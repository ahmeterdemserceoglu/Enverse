import * as Device from 'expo-device';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform } from 'react-native';
import type { LaunchableApp } from './apps';
import { assertTrustedApkUrl } from './apkUrl';
import { enverseDevice } from '../device/EnverseDevice';

export type InstallProgress = {
  written: number;
  total: number;
  ratio: number;
  bytesPerSecond: number;
  etaSeconds: number | null;
};

export type LaunchResult =
  | { kind: 'opened' }
  | { kind: 'not-installed' }
  | { kind: 'unsupported-platform' };

const installerDirectory = `${FileSystem.cacheDirectory}enverse-installers/`;
export class AppLauncherService {
  private downloads = new Map<string, FileSystem.DownloadResumable>();

  async open(app: LaunchableApp): Promise<LaunchResult> {
    if (Platform.OS !== 'android') return { kind: 'unsupported-platform' };
    try {
      await IntentLauncher.openApplication(app.packageName);
      return { kind: 'opened' };
    } catch {
      return { kind: 'not-installed' };
    }
  }

  private async launchInstaller(app: LaunchableApp, uri: string) {
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists) throw new Error('APK_DOWNLOAD_FAILED');
    if (app.sizeBytes && 'size' in info && Math.abs(info.size - app.sizeBytes) > 1024) throw new Error('APK_SIZE_MISMATCH');
    if (!app.sha256) throw new Error('APK_HASH_MISSING');
    const actualHash = await enverseDevice.sha256(uri);
    if (actualHash.toLowerCase() !== app.sha256.toLowerCase()) {
      await FileSystem.deleteAsync(uri, { idempotent: true });
      throw new Error('APK_HASH_MISMATCH');
    }
    const contentUri = await FileSystem.getContentUriAsync(uri);
    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
      data: contentUri,
      flags: 1,
      type: 'application/vnd.android.package-archive',
    });
  }

  async install(app: LaunchableApp, onProgress?: (progress: InstallProgress) => void, resume = false) {
    if (Platform.OS !== 'android') throw new Error('ANDROID_ONLY');
    if (!app.apkUrl) throw new Error('APK_URL_NOT_CONFIGURED');
    assertTrustedApkUrl(app.apkUrl);

    const sideLoadingEnabled = await Device.isSideLoadingEnabledAsync();
    if (!sideLoadingEnabled) {
      await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.MANAGE_UNKNOWN_APP_SOURCES, {
        data: 'package:com.enverse.app',
      });
      throw new Error('INSTALL_PERMISSION_REQUIRED');
    }

    await FileSystem.makeDirectoryAsync(installerDirectory, { intermediates: true });
    const destination = `${installerDirectory}${app.id}.apk`;
    let lastBytes = 0;
    let lastAt = Date.now();
    const callback = ({ totalBytesWritten, totalBytesExpectedToWrite }: FileSystem.DownloadProgressData) => {
        const now = Date.now();
        const seconds = Math.max((now - lastAt) / 1000, 0.001);
        const speed = Math.max(0, (totalBytesWritten - lastBytes) / seconds);
        const remaining = Math.max(0, totalBytesExpectedToWrite - totalBytesWritten);
        onProgress?.({
          written: totalBytesWritten,
          total: totalBytesExpectedToWrite,
          ratio: totalBytesExpectedToWrite > 0 ? totalBytesWritten / totalBytesExpectedToWrite : 0,
          bytesPerSecond: speed,
          etaSeconds: speed > 0 ? Math.ceil(remaining / speed) : null,
        });
        lastBytes = totalBytesWritten;
        lastAt = now;
      };
    let task = this.downloads.get(app.id);
    if (!resume || !task) {
      await FileSystem.deleteAsync(destination, { idempotent: true });
      task = FileSystem.createDownloadResumable(app.apkUrl, destination, {}, callback);
      this.downloads.set(app.id, task);
    }
    const result = resume ? await task.resumeAsync() : await task.downloadAsync();
    if (!result?.uri) throw new Error('APK_DOWNLOAD_FAILED');
    this.downloads.delete(app.id);
    await this.launchInstaller(app, result.uri);
  }

  async pause(appId: string) {
    const task = this.downloads.get(appId);
    if (!task) return false;
    await task.pauseAsync();
    return true;
  }

  async cancel(appId: string) {
    const task = this.downloads.get(appId);
    if (task) await task.pauseAsync().catch(() => undefined);
    this.downloads.delete(appId);
    await FileSystem.deleteAsync(`${installerDirectory}${appId}.apk`, { idempotent: true });
  }

  async uninstall(packageName: string) {
    if (Platform.OS !== 'android') return;
    await IntentLauncher.startActivityAsync('android.intent.action.DELETE', { data: `package:${packageName}` });
  }
}

export const appLauncherService = new AppLauncherService();

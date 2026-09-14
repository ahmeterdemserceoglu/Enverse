import * as Device from 'expo-device';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform } from 'react-native';
import type { LaunchableApp } from './apps';
import { assertTrustedApkUrl } from './apkUrl';

export type InstallProgress = {
  written: number;
  total: number;
  ratio: number;
};

export type LaunchResult =
  | { kind: 'opened' }
  | { kind: 'not-installed' }
  | { kind: 'unsupported-platform' };

const installerDirectory = `${FileSystem.cacheDirectory}enverse-installers/`;
export class AppLauncherService {
  async open(app: LaunchableApp): Promise<LaunchResult> {
    if (Platform.OS !== 'android') return { kind: 'unsupported-platform' };
    try {
      IntentLauncher.openApplication(app.packageName);
      return { kind: 'opened' };
    } catch {
      return { kind: 'not-installed' };
    }
  }

  async install(app: LaunchableApp, onProgress?: (progress: InstallProgress) => void) {
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
    const task = FileSystem.createDownloadResumable(
      app.apkUrl,
      destination,
      {},
      ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
        onProgress?.({
          written: totalBytesWritten,
          total: totalBytesExpectedToWrite,
          ratio: totalBytesExpectedToWrite > 0 ? totalBytesWritten / totalBytesExpectedToWrite : 0,
        });
      },
    );
    const result = await task.downloadAsync();
    if (!result?.uri) throw new Error('APK_DOWNLOAD_FAILED');

    const contentUri = await FileSystem.getContentUriAsync(result.uri);
    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
      data: contentUri,
      flags: 1,
      type: 'application/vnd.android.package-archive',
    });
  }
}

export const appLauncherService = new AppLauncherService();

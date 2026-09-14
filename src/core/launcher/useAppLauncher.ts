import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';
import type { InstalledPackage } from '../device/EnverseDevice';
import type { LaunchableApp } from './apps';
import { appLauncherService } from './AppLauncherService';

export type LauncherPhase = 'opening' | 'downloading' | 'paused' | 'verifying' | 'installing' | 'permission' | 'error';
export type LauncherJob = {
  phase: LauncherPhase;
  progress: number;
  written: number;
  total: number;
  bytesPerSecond: number;
  etaSeconds: number | null;
  message?: string;
};

const initialJob: LauncherJob = { phase: 'opening', progress: 0, written: 0, total: 0, bytesPerSecond: 0, etaSeconds: null };

function errorMessage(code: string) {
  if (code === 'APK_HASH_MISMATCH') return 'Dosya doğrulanamadı';
  if (code === 'APK_SIZE_MISMATCH') return 'Dosya boyutu uyuşmuyor';
  if (code === 'APK_HASH_MISSING') return 'Güvenlik özeti eksik';
  return 'İndirme tamamlanamadı';
}

export function useAppLauncher(onInstallerOpened?: () => void) {
  const [jobs, setJobs] = useState<Record<string, LauncherJob>>({});
  const paused = useRef(new Set<string>());
  const updateJob = useCallback((id: string, patch: Partial<LauncherJob>) => {
    setJobs((current) => ({ ...current, [id]: { ...(current[id] || initialJob), ...patch } }));
  }, []);
  const clearJob = useCallback((id: string) => setJobs((current) => {
    const next = { ...current };
    delete next[id];
    return next;
  }), []);

  const install = useCallback(async (app: LaunchableApp, resume = false) => {
    paused.current.delete(app.id);
    updateJob(app.id, { phase: 'downloading', message: undefined });
    try {
      await appLauncherService.install(app, (progress) => updateJob(app.id, { phase: progress.ratio >= 1 ? 'verifying' : 'downloading', ...progress }), resume);
      updateJob(app.id, { phase: 'installing', progress: 1 });
      onInstallerOpened?.();
      // Android'in kurucusu ayrı bir ekran açar. İş sonucu, Enverse yeniden aktif
      // olduğunda kurulu paket sorgusundan hesaplanır; geçici işi ekranda tutma.
      setTimeout(() => clearJob(app.id), 1500);
    } catch (error) {
      if (paused.current.has(app.id)) return;
      const code = error instanceof Error ? error.message : 'UNKNOWN';
      if (code === 'INSTALL_PERMISSION_REQUIRED') {
        updateJob(app.id, { phase: 'permission', message: 'Yükleme izni gerekli' });
        Alert.alert('Yükleme izni gerekli', '“Bu kaynaktan uygulama yükle” seçeneğini açıp tekrar dene.');
      } else updateJob(app.id, { phase: 'error', message: errorMessage(code) });
    }
  }, [clearJob, onInstallerOpened, updateJob]);

  const act = useCallback(async (app: LaunchableApp, installed?: InstalledPackage) => {
    const existing = jobs[app.id];
    if (existing?.phase === 'paused') return void install(app, true);
    if (existing && !['error', 'permission'].includes(existing.phase)) return;
    if (installed?.installed && installed.versionCode >= app.versionCode) {
      updateJob(app.id, { phase: 'opening' });
      const result = await appLauncherService.open(app);
      if (result.kind === 'opened') clearJob(app.id);
      else updateJob(app.id, { phase: 'error', message: 'Uygulama açılamadı' });
      return;
    }
    const update = Boolean(installed?.installed);
    Alert.alert(update ? `${app.name} güncellensin mi?` : `${app.name} kurulu değil`, `${app.versionName} sürümü GitHub’dan indirilip doğrulansın mı?`, [
      { text: 'Vazgeç', style: 'cancel' },
      { text: update ? 'Güncelle' : 'İndir ve kur', onPress: () => void install(app) },
    ]);
  }, [clearJob, install, jobs, updateJob]);

  const pause = useCallback(async (appId: string) => {
    paused.current.add(appId);
    if (await appLauncherService.pause(appId)) updateJob(appId, { phase: 'paused' });
  }, [updateJob]);

  const cancel = useCallback(async (appId: string) => {
    paused.current.delete(appId);
    await appLauncherService.cancel(appId);
    clearJob(appId);
  }, [clearJob]);

  return { jobs, act, install, pause, cancel, clearJob };
}

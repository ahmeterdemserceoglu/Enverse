import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { appLauncherService } from './AppLauncherService';
import { launchableApps, type LaunchableAppId } from './apps';

export type LauncherPhase = 'idle' | 'opening' | 'permission' | 'downloading' | 'installing' | 'error';

type LauncherState = {
  appId: LaunchableAppId | null;
  phase: LauncherPhase;
  progress: number;
  written: number;
  total: number;
  message?: string;
};

const initialState: LauncherState = { appId: null, phase: 'idle', progress: 0, written: 0, total: 0 };

export function useAppLauncher() {
  const [state, setState] = useState<LauncherState>(initialState);
  const reset = useCallback(() => setState(initialState), []);

  const install = useCallback(async (appId: LaunchableAppId) => {
    const app = launchableApps[appId];
    try {
      setState({ ...initialState, appId, phase: 'downloading' });
      await appLauncherService.install(app, ({ ratio, written, total }) =>
        setState({ appId, phase: 'downloading', progress: ratio, written, total }),
      );
      setState((current) => ({ ...current, phase: 'installing', progress: 1 }));
    } catch (error) {
      const code = error instanceof Error ? error.message : 'UNKNOWN';
      if (code === 'INSTALL_PERMISSION_REQUIRED') {
        setState({ ...initialState, appId, phase: 'permission', message: 'Yükleme iznini aç ve tekrar dokun.' });
        Alert.alert('Yükleme izni gerekli', '“Bu kaynaktan uygulama yükle” seçeneğini aç. Enverse’e dönünce karta tekrar dokun.');
      } else {
        const message = code === 'APK_URL_NOT_CONFIGURED'
          ? 'APK bağlantısı yapılandırılmamış.'
          : 'İndirme tamamlanamadı. Tekrar deneyebilirsin.';
        setState({ ...initialState, appId, phase: 'error', message });
      }
    }
  }, []);

  const open = useCallback(async (appId: LaunchableAppId) => {
    if (!['idle', 'error', 'permission'].includes(state.phase)) return;
    const app = launchableApps[appId];
    setState({ ...initialState, appId, phase: 'opening' });
    const result = await appLauncherService.open(app);

    if (result.kind === 'opened') {
      reset();
      return;
    }
    if (result.kind === 'unsupported-platform') {
      setState({ ...initialState, appId, phase: 'error', message: 'Bu özellik yalnızca Android’de çalışır.' });
      return;
    }

    setState({ ...initialState, appId, phase: 'idle' });
    Alert.alert(
      `${app.name} kurulu değil`,
      'APK, Enverse GitHub sürümünden doğrudan indirilecek. Android son adımda kurulum onayı ister.',
      [
        { text: 'Vazgeç', style: 'cancel', onPress: reset },
        { text: 'İndir ve kur', onPress: () => void install(appId) },
      ],
    );
  }, [install, reset, state.phase]);

  const busy = !['idle', 'error', 'permission'].includes(state.phase);
  return { ...state, busy, open, reset };
}

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import type { LaunchableApp } from './apps';
import { appLauncherService } from './AppLauncherService';

export type LauncherPhase = 'idle' | 'opening' | 'permission' | 'downloading' | 'installing' | 'error';
type State = { appId: string | null; phase: LauncherPhase; progress: number; written: number; total: number; message?: string };
const idle: State = { appId: null, phase: 'idle', progress: 0, written: 0, total: 0 };

export function useAppLauncher() {
  const [state, setState] = useState<State>(idle);
  const reset = useCallback(() => setState(idle), []);

  const install = useCallback(async (app: LaunchableApp) => {
    try {
      setState({ ...idle, appId: app.id, phase: 'downloading' });
      await appLauncherService.install(app, ({ ratio, written, total }) => setState({ appId: app.id, phase: 'downloading', progress: ratio, written, total }));
      setState((current) => ({ ...current, phase: 'installing', progress: 1 }));
    } catch (error) {
      const code = error instanceof Error ? error.message : 'UNKNOWN';
      if (code === 'INSTALL_PERMISSION_REQUIRED') {
        setState({ ...idle, appId: app.id, phase: 'permission', message: 'Yükleme izni gerekli' });
        Alert.alert('Yükleme izni gerekli', '“Bu kaynaktan uygulama yükle” seçeneğini açıp tekrar dene.');
      } else setState({ ...idle, appId: app.id, phase: 'error', message: 'İndirme tamamlanamadı' });
    }
  }, []);

  const open = useCallback(async (app: LaunchableApp) => {
    if (!['idle', 'error', 'permission'].includes(state.phase)) return;
    setState({ ...idle, appId: app.id, phase: 'opening' });
    const result = await appLauncherService.open(app);
    if (result.kind === 'opened') return reset();
    if (result.kind === 'unsupported-platform') return setState({ ...idle, appId: app.id, phase: 'error', message: 'Yalnızca Android' });
    setState(idle);
    Alert.alert(`${app.name} kurulu değil`, 'GitHub üzerindeki APK indirilsin mi?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'İndir ve kur', onPress: () => void install(app) },
    ]);
  }, [install, reset, state.phase]);

  return { ...state, busy: !['idle', 'error', 'permission'].includes(state.phase), open, reset };
}

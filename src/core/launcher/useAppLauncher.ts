import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { appLauncherService } from './AppLauncherService';
import { launchableApps, type LaunchableAppId } from './apps';

type LauncherState = {
  appId: LaunchableAppId | null;
  phase: 'idle' | 'opening' | 'downloading' | 'installing';
  progress: number;
};

const initialState: LauncherState = { appId: null, phase: 'idle', progress: 0 };

export function useAppLauncher() {
  const [state, setState] = useState<LauncherState>(initialState);

  const install = useCallback(async (appId: LaunchableAppId) => {
    const app = launchableApps[appId];
    try {
      setState({ appId, phase: 'downloading', progress: 0 });
      await appLauncherService.install(app, ({ ratio }) =>
        setState({ appId, phase: 'downloading', progress: ratio }),
      );
      setState({ appId, phase: 'installing', progress: 1 });
    } catch (error) {
      const code = error instanceof Error ? error.message : 'UNKNOWN';
      if (code === 'INSTALL_PERMISSION_REQUIRED') {
        Alert.alert('Yükleme izni gerekli', 'Enverse için “Bu kaynaktan uygulama yükle” seçeneğini açtıktan sonra tekrar dene.');
      } else if (code === 'APK_URL_NOT_CONFIGURED') {
        Alert.alert('İndirme adresi eksik', `${app.name} APK bağlantısı henüz Enverse yapılandırmasına eklenmemiş.`);
      } else {
        Alert.alert('Kurulum başlatılamadı', 'APK indirilemedi veya Android kurucusu açılamadı.');
      }
    } finally {
      setState(initialState);
    }
  }, []);

  const open = useCallback(async (appId: LaunchableAppId) => {
    const app = launchableApps[appId];
    setState({ appId, phase: 'opening', progress: 0 });
    const result = await appLauncherService.open(app);
    setState(initialState);

    if (result.kind === 'unsupported-platform') {
      Alert.alert('Yalnızca Android', 'Paket tabanlı uygulama açma ve APK kurulumu Android üzerinde kullanılabilir.');
      return;
    }
    if (result.kind === 'not-installed') {
      Alert.alert(
        `${app.name} kurulu değil`,
        `${app.name} APK dosyası GitHub Releases üzerinden indirilsin mi?`,
        [{ text: 'Vazgeç', style: 'cancel' }, { text: 'İndir ve kur', onPress: () => void install(appId) }],
      );
    }
  }, [install]);

  return { ...state, open };
}

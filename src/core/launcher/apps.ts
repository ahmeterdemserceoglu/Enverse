export type LaunchableAppId = 'maxen' | 'tuben' | 'voxen';

export type LaunchableApp = {
  id: LaunchableAppId;
  name: string;
  packageName: string;
  apkUrl?: string;
};

export const launchableApps: Record<LaunchableAppId, LaunchableApp> = {
  maxen: {
    id: 'maxen',
    name: 'Maxen',
    packageName: 'com.maxen.app',
    apkUrl: process.env.EXPO_PUBLIC_MAXEN_APK_URL,
  },
  tuben: {
    id: 'tuben',
    name: 'Tuben',
    packageName: 'com.tuben.app',
    apkUrl: process.env.EXPO_PUBLIC_TUBEN_APK_URL,
  },
  voxen: {
    id: 'voxen',
    name: 'Voxen',
    packageName: 'com.voxen.music',
    apkUrl: process.env.EXPO_PUBLIC_VOXEN_APK_URL,
  },
};

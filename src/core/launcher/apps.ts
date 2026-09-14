export type LaunchableAppId = string;

export type LaunchableApp = {
  id: string;
  name: string;
  description: string;
  packageName: string;
  apkUrl: string;
  iconUrl?: string;
  accent?: string;
  category?: string;
};

const releaseBase = 'https://github.com/ahmeterdemserceoglu/Enverse/releases/latest/download';

export const bundledApps: LaunchableApp[] = [
  { id: 'maxen', name: 'Maxen', description: 'Film ve dizi', category: 'Video', packageName: 'com.maxen.app', apkUrl: process.env.EXPO_PUBLIC_MAXEN_APK_URL || `${releaseBase}/maxen.apk`, accent: '#E94B61' },
  { id: 'tuben', name: 'Tuben', description: 'Video ve shorts', category: 'Video', packageName: 'com.tuben.app', apkUrl: process.env.EXPO_PUBLIC_TUBEN_APK_URL || `${releaseBase}/tuben.apk`, accent: '#4285E8' },
  { id: 'voxen', name: 'Voxen', description: 'Müzik ve podcast', category: 'Müzik', packageName: 'com.voxen.music', apkUrl: process.env.EXPO_PUBLIC_VOXEN_APK_URL || `${releaseBase}/voxen.apk`, accent: '#9254D8' },
];

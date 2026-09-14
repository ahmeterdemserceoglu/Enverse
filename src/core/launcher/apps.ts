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
  versionName: string;
  versionCode: number;
  sizeBytes?: number;
  sha256?: string;
  changelog?: string[];
  releasedAt?: string;
};

const releaseBase = 'https://github.com/ahmeterdemserceoglu/Enverse-Distribution/releases/latest/download';

export const bundledApps: LaunchableApp[] = [
  { id: 'maxen', name: 'Maxen', description: 'Film ve dizi', category: 'Video', packageName: 'com.maxen.app', apkUrl: process.env.EXPO_PUBLIC_MAXEN_APK_URL || `${releaseBase}/maxen.apk`, accent: '#E94B61', versionName: '10.6.5', versionCode: 23, sizeBytes: 86502396, sha256: 'c31c46f5e45fb57da887038e267d2bfce5b58f500a728ce500e5472014ba6ae4' },
  { id: 'tuben', name: 'Tuben', description: 'Video ve shorts', category: 'Video', packageName: 'com.tuben.app', apkUrl: process.env.EXPO_PUBLIC_TUBEN_APK_URL || `${releaseBase}/tuben.apk`, accent: '#4285E8', versionName: '1.0.0', versionCode: 1, sizeBytes: 93203956, sha256: 'a42f523308dd1f724066115db4fd0b142a979bfe12384be44efe1258d252aaf0' },
  { id: 'voxen', name: 'Voxen', description: 'Müzik ve podcast', category: 'Müzik', packageName: 'com.voxen.music', apkUrl: process.env.EXPO_PUBLIC_VOXEN_APK_URL || `${releaseBase}/voxen.apk`, accent: '#9254D8', versionName: '1.0.0', versionCode: 1, sizeBytes: 43991573, sha256: 'dd0740cc6c1e0b8d70d57d0e9adebbea3feda69ddf8cd4567df4f4033b464330' },
];

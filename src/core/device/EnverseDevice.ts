import { NativeModules, Platform } from 'react-native';

export type InstalledPackage = {
  installed: boolean;
  packageName: string;
  versionName: string;
  versionCode: number;
};

type EnverseDeviceNative = {
  getPackageInfo(packageName: string): Promise<InstalledPackage>;
  sha256(uri: string): Promise<string>;
  verifyRsaSha256(payload: string, signature: string, publicKey: string): Promise<boolean>;
};

const native = NativeModules.EnverseDevice as EnverseDeviceNative | undefined;

export const enverseDevice = {
  async getPackageInfo(packageName: string): Promise<InstalledPackage> {
    if (Platform.OS !== 'android' || !native) return { installed: false, packageName, versionName: '', versionCode: 0 };
    return native.getPackageInfo(packageName);
  },
  async sha256(uri: string) {
    if (!native) throw new Error('HASH_UNAVAILABLE');
    return native.sha256(uri);
  },
  async verifyRsaSha256(payload: string, signature: string, publicKey: string) {
    if (Platform.OS !== 'android' || !native) return false;
    return native.verifyRsaSha256(payload, signature, publicKey);
  },
};

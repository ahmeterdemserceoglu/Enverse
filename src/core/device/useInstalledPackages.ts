import { useCallback, useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import type { LaunchableApp } from '../launcher/apps';
import { enverseDevice, type InstalledPackage } from './EnverseDevice';

export type InstalledPackages = Record<string, InstalledPackage>;

export function useInstalledPackages(apps: LaunchableApp[]) {
  const [packages, setPackages] = useState<InstalledPackages>({});
  const [checking, setChecking] = useState(true);
  const packageKey = apps.map((app) => app.packageName).join('|');

  const refresh = useCallback(async () => {
    if (Platform.OS !== 'android') return setChecking(false);
    setChecking(true);
    const entries = await Promise.all(apps.map(async (app) => [app.id, await enverseDevice.getPackageInfo(app.packageName)] as const));
    setPackages(Object.fromEntries(entries));
    setChecking(false);
  // packageKey deliberately makes this refresh when the remote catalog changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageKey]);

  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => { if (state === 'active') void refresh(); });
    return () => subscription.remove();
  }, [refresh]);

  return { packages, checking, refresh };
}

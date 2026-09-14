import { useCallback, useEffect, useState } from 'react';
import { bundledApps, type LaunchableApp } from '../launcher/apps';
import { loadCatalog } from './catalog';

export function useAppCatalog() {
  const [apps, setApps] = useState<LaunchableApp[]>(bundledApps);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'github' | 'cache' | 'bundled'>('bundled');
  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await loadCatalog();
    setApps(result.apps);
    setSource(result.source);
    setLoading(false);
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  return { apps, loading, source, refresh };
}

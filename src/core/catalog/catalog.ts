import AsyncStorage from '@react-native-async-storage/async-storage';
import { bundledApps, type LaunchableApp } from '../launcher/apps';
import { assertTrustedApkUrl } from '../launcher/apkUrl';

export const catalogUrl = process.env.EXPO_PUBLIC_APP_CATALOG_URL
  || 'https://raw.githubusercontent.com/ahmeterdemserceoglu/Enverse/main/catalog/apps.json';
const cacheKey = 'enverse.app-catalog.v1';
const packagePattern = /^[a-zA-Z][\w]*(\.[a-zA-Z][\w]*)+$/;
const colorPattern = /^#[0-9a-fA-F]{6}$/;

function parseApp(value: unknown): LaunchableApp | null {
  if (!value || typeof value !== 'object') return null;
  const app = value as Record<string, unknown>;
  if (typeof app.id !== 'string' || typeof app.name !== 'string' || typeof app.description !== 'string'
    || typeof app.packageName !== 'string' || typeof app.apkUrl !== 'string') return null;
  if (!/^[a-z0-9-]{2,40}$/.test(app.id) || !packagePattern.test(app.packageName)) return null;
  try { assertTrustedApkUrl(app.apkUrl); } catch { return null; }
  const iconUrl = typeof app.iconUrl === 'string' && /^https:\/\/(raw\.githubusercontent\.com|github\.com)\//.test(app.iconUrl) ? app.iconUrl : undefined;
  return {
    id: app.id,
    name: app.name.slice(0, 40),
    description: app.description.slice(0, 80),
    packageName: app.packageName,
    apkUrl: app.apkUrl,
    iconUrl,
    accent: typeof app.accent === 'string' && colorPattern.test(app.accent) ? app.accent : '#6D6F78',
    category: typeof app.category === 'string' ? app.category.slice(0, 30) : 'Uygulama',
  };
}

function parseCatalog(value: unknown): LaunchableApp[] {
  if (!value || typeof value !== 'object' || !Array.isArray((value as { apps?: unknown }).apps)) throw new Error('INVALID_CATALOG');
  const apps = (value as { apps: unknown[] }).apps.map(parseApp).filter((app): app is LaunchableApp => Boolean(app));
  if (!apps.length) throw new Error('EMPTY_CATALOG');
  return apps;
}

export async function loadCatalog(): Promise<{ apps: LaunchableApp[]; source: 'github' | 'cache' | 'bundled' }> {
  try {
    const response = await fetch(catalogUrl, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP_${response.status}`);
    const apps = parseCatalog(await response.json());
    await AsyncStorage.setItem(cacheKey, JSON.stringify(apps));
    return { apps, source: 'github' };
  } catch {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      try { return { apps: parseCatalog({ apps: JSON.parse(cached) }), source: 'cache' }; } catch { /* use bundle */ }
    }
    return { apps: bundledApps, source: 'bundled' };
  }
}

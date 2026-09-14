import AsyncStorage from '@react-native-async-storage/async-storage';
import { bundledApps, type LaunchableApp } from '../launcher/apps';
import { assertTrustedApkUrl } from '../launcher/apkUrl';
import { enverseDevice } from '../device/EnverseDevice';

export const catalogUrl = process.env.EXPO_PUBLIC_APP_CATALOG_URL
  || 'https://raw.githubusercontent.com/ahmeterdemserceoglu/Enverse-Distribution/main/apps.json';
const cacheKey = 'enverse.app-catalog.v1';
const packagePattern = /^[a-zA-Z][\w]*(\.[a-zA-Z][\w]*)+$/;
const colorPattern = /^#[0-9a-fA-F]{6}$/;
const hashPattern = /^[0-9a-fA-F]{64}$/;
const catalogPublicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtJMLoh74zgAcdrs9+WUiMCvm8Cz52oJJtX80iinzkLX8NtNFy0+2nhBjGVmcoCGAXvMBU85SAHqXTxgSXpcLRB2YV75OTJuD5/CqOqBs1BikRSJzBre3N2mdsedcbDDu0ZHEi2xEBfBFUNlz/QluJ8VtmFaDVJb8TBYMrmayIcFCe8VDqQpt4T/A2ue1PcKDEsNnwgZnKiuaZfQKlnZPOD/FouFPbEpz3KD/50sHOUOYltqHOBHK4Dj5h/K63XZXUtX8iWDDABy5Dug80Tr9YRhlEAlrf8WApAnNKTqDOhCgn7kkZoM0x11mhwC+uwsEVnfg/i+/d8ZBjelKTyKLrQIDAQAB';

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
    versionName: typeof app.versionName === 'string' ? app.versionName.slice(0, 30) : '0',
    versionCode: typeof app.versionCode === 'number' && Number.isSafeInteger(app.versionCode) && app.versionCode >= 0 ? app.versionCode : 0,
    sizeBytes: typeof app.sizeBytes === 'number' && app.sizeBytes > 0 ? app.sizeBytes : undefined,
    sha256: typeof app.sha256 === 'string' && hashPattern.test(app.sha256) ? app.sha256.toLowerCase() : undefined,
    changelog: Array.isArray(app.changelog) ? app.changelog.filter((line): line is string => typeof line === 'string').slice(0, 12).map((line) => line.slice(0, 160)) : undefined,
    releasedAt: typeof app.releasedAt === 'string' ? app.releasedAt : undefined,
  };
}

async function parseCatalog(value: unknown): Promise<LaunchableApp[]> {
  if (!value || typeof value !== 'object') throw new Error('INVALID_CATALOG');
  const document = value as { payload?: unknown; signature?: unknown };
  if (!document.payload || typeof document.signature !== 'string') throw new Error('UNSIGNED_CATALOG');
  const verified = await enverseDevice.verifyRsaSha256(JSON.stringify(document.payload), document.signature, catalogPublicKey);
  if (!verified) throw new Error('INVALID_CATALOG_SIGNATURE');
  if (!Array.isArray((document.payload as { apps?: unknown }).apps)) throw new Error('INVALID_CATALOG');
  const apps = (document.payload as { apps: unknown[] }).apps.map(parseApp).filter((app): app is LaunchableApp => Boolean(app));
  if (!apps.length) throw new Error('EMPTY_CATALOG');
  return apps;
}

export async function loadCatalog(): Promise<{ apps: LaunchableApp[]; source: 'github' | 'cache' | 'bundled' }> {
  try {
    const response = await fetch(catalogUrl, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP_${response.status}`);
    const apps = await parseCatalog(await response.json());
    await AsyncStorage.setItem(cacheKey, JSON.stringify(apps));
    return { apps, source: 'github' };
  } catch {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      try { return { apps: JSON.parse(cached) as LaunchableApp[], source: 'cache' }; } catch { /* use bundle */ }
    }
    return { apps: bundledApps, source: 'bundled' };
  }
}

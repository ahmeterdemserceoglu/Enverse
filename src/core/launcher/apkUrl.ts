const githubHosts = new Set([
  'github.com',
  'objects.githubusercontent.com',
  'github-releases.githubusercontent.com',
]);

export function assertTrustedApkUrl(url: string) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || !githubHosts.has(parsed.hostname)) {
    throw new Error('UNTRUSTED_APK_URL');
  }
  if (!parsed.pathname.toLowerCase().includes('.apk')) {
    throw new Error('INVALID_APK_URL');
  }
}

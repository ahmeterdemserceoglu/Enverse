/// <reference types="jest" />
import { assertTrustedApkUrl } from '../apkUrl';

describe('assertTrustedApkUrl', () => {
  it('accepts GitHub release APK links', () => {
    expect(() =>
      assertTrustedApkUrl('https://github.com/example/maxen/releases/latest/download/maxen.apk'),
    ).not.toThrow();
  });

  it('rejects non-HTTPS links', () => {
    expect(() => assertTrustedApkUrl('http://github.com/example/app.apk')).toThrow(
      'UNTRUSTED_APK_URL',
    );
  });

  it('rejects non-GitHub hosts', () => {
    expect(() => assertTrustedApkUrl('https://example.com/app.apk')).toThrow(
      'UNTRUSTED_APK_URL',
    );
  });

  it('rejects links without an APK path', () => {
    expect(() => assertTrustedApkUrl('https://github.com/example/releases/latest')).toThrow(
      'INVALID_APK_URL',
    );
  });
});

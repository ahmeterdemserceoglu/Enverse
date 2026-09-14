const { withAndroidManifest } = require('@expo/config-plugins');

const TARGET_PACKAGES = ['com.maxen.app', 'com.tuben.app', 'com.voxen.music'];

module.exports = function withLauncherQueries(config) {
  return withAndroidManifest(config, (result) => {
    const manifest = result.modResults.manifest;
    const queries = manifest.queries ?? [];
    const mergedQuery = {
      intent: queries.flatMap((query) => query.intent ?? []),
      provider: queries.flatMap((query) => query.provider ?? []),
      package: queries.flatMap((query) => query.package ?? []),
    };
    const existingPackages = new Set(
      mergedQuery.package.map((entry) => entry.$['android:name']),
    );

    for (const packageName of TARGET_PACKAGES) {
      if (!existingPackages.has(packageName)) {
        mergedQuery.package.push({ $: { 'android:name': packageName } });
      }
    }

    manifest.queries = [mergedQuery];
    return result;
  });
};

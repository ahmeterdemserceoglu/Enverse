import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppCatalog } from '../core/catalog/useAppCatalog';
import type { LaunchableApp } from '../core/launcher/apps';
import { useAppLauncher } from '../core/launcher/useAppLauncher';

const icons: Record<string, keyof typeof Ionicons.glyphMap> = { maxen: 'film', tuben: 'play', voxen: 'musical-notes' };
const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export function HomeScreen() {
  const { width } = useWindowDimensions();
  const catalog = useAppCatalog();
  const launcher = useAppLauncher();
  const columns = width >= 900 ? 5 : width >= 600 ? 3 : 2;
  const gap = 12;
  const horizontalPadding = 14;
  const maxWidth = Math.min(width, 1080);
  const cardWidth = (maxWidth - horizontalPadding * 2 - gap * (columns - 1)) / columns;

  return (
    <View style={styles.page}>
      <Image source={require('../../assets/backgrounds/enverse-cosmic-portrait.png')} resizeMode="cover" style={styles.background} />
      <View style={styles.scrim} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <FlatList
          key={columns}
          data={catalog.apps}
          numColumns={columns}
          keyExtractor={(app) => app.id}
          renderItem={({ item }) => <AppCard app={item} width={cardWidth} launcher={launcher} />}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.content}
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={7}
          removeClippedSubviews
          refreshControl={<RefreshControl refreshing={catalog.loading} onRefresh={() => void catalog.refresh()} tintColor="#FFFFFF" colors={['#FFFFFF']} />}
          ListEmptyComponent={<View style={styles.empty}><ActivityIndicator color="#FFFFFF" /><Text style={styles.emptyText}>Katalog yükleniyor…</Text></View>}
        />
      </SafeAreaView>
    </View>
  );
}

function AppCard({ app, width, launcher }: { app: LaunchableApp; width: number; launcher: ReturnType<typeof useAppLauncher> }) {
  const active = launcher.appId === app.id;
  const downloading = active && launcher.phase === 'downloading';
  const loading = active && (launcher.phase === 'opening' || launcher.phase === 'installing');
  const disabled = launcher.busy && !active;
  const accent = app.accent || '#6D6F78';
  let status = app.category || 'Uygulama';
  if (active && launcher.phase === 'opening') status = 'Kontrol ediliyor';
  if (active && launcher.phase === 'installing') status = 'Kurulum ekranı açık';
  if (active && launcher.phase === 'permission') status = 'İzin gerekli · tekrar dokun';
  if (active && launcher.phase === 'error') status = launcher.message || 'Tekrar dene';

  return (
    <Pressable disabled={disabled} onPress={() => void launcher.open(app)} style={({ pressed }) => [{ width }, styles.card, disabled && styles.disabled, pressed && styles.pressed]}>
      <View style={[styles.iconBox, { backgroundColor: `${accent}1A` }]}>
        {app.iconUrl
          ? <Image source={{ uri: app.iconUrl }} style={styles.remoteIcon} />
          : <Ionicons name={icons[app.id] || 'apps'} size={30} color={accent} />}
      </View>
      <Text numberOfLines={1} style={styles.appName}>{app.name}</Text>
      <Text numberOfLines={1} style={styles.appDescription}>{app.description}</Text>
      <View style={styles.cardFooter}>
        <Text numberOfLines={1} style={[styles.category, active && { color: accent }]}>{status}</Text>
        {loading ? <ActivityIndicator size="small" color={accent} /> : <Ionicons name="chevron-forward" size={17} color="#73737C" />}
      </View>
      {downloading && <View style={styles.downloadArea}>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.max(2, launcher.progress * 100)}%`, backgroundColor: accent }]} /></View>
        <Text style={styles.downloadText}>{Math.round(launcher.progress * 100)}%{launcher.total > 0 ? ` · ${mb(launcher.written)} / ${mb(launcher.total)}` : ''}</Text>
      </View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#08090E' },
  safe: { flex: 1 },
  background: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%', opacity: 0.55 },
  scrim: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(5,6,12,0.62)' },
  content: { width: '100%', maxWidth: 1080, alignSelf: 'center', paddingHorizontal: 14, paddingTop: 14, paddingBottom: 28 },
  row: { gap: 12, marginBottom: 12 },
  card: { minHeight: 205, padding: 14, borderRadius: 19, backgroundColor: '#18181C', borderWidth: 1, borderColor: '#29292F' },
  iconBox: { width: 58, height: 58, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 17, overflow: 'hidden' }, remoteIcon: { width: '100%', height: '100%' },
  appName: { color: '#F4F4F5', fontSize: 19, fontWeight: '800' }, appDescription: { color: '#909098', fontSize: 11, marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 15 }, category: { color: '#686870', fontSize: 9, fontWeight: '700', flex: 1 },
  disabled: { opacity: 0.4 }, pressed: { transform: [{ scale: 0.98 }], backgroundColor: '#202025' },
  downloadArea: { marginTop: 10 }, progressTrack: { height: 4, borderRadius: 2, backgroundColor: '#303036', overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 2 },
  downloadText: { color: '#A3A3AA', fontSize: 8, marginTop: 6 },
  empty: { paddingTop: 80, alignItems: 'center', gap: 12 }, emptyText: { color: '#B7B7BD', fontSize: 12 },
});

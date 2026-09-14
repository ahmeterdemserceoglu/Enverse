import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
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
  const columns = width >= 900 ? 4 : width >= 600 ? 3 : 2;
  const gap = 12;
  const horizontalPadding = 18;
  const maxWidth = Math.min(width, 1080);
  const cardWidth = (maxWidth - horizontalPadding * 2 - gap * (columns - 1)) / columns;

  return (
    <SafeAreaView style={styles.page} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={catalog.loading} onRefresh={() => void catalog.refresh()} tintColor="#FFFFFF" />}
      >
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Image source={require('../../assets/brand/enverse-mark.png')} style={styles.logo} />
            <View><Text style={styles.brand}>Enverse</Text><Text style={styles.brandSub}>Uygulama Merkezi</Text></View>
          </View>
          <Pressable accessibilityLabel="Kataloğu yenile" onPress={() => void catalog.refresh()} style={styles.refreshButton}>
            {catalog.loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Ionicons name="refresh" size={20} color="#FFFFFF" />}
          </Pressable>
        </View>

        <View style={styles.catalogStatus}>
          <View><Text style={styles.heading}>Uygulamalar</Text><Text style={styles.subheading}>Açmak veya kurmak için dokun.</Text></View>
          <View style={styles.sourceBadge}><View style={[styles.sourceDot, catalog.source !== 'github' && styles.offlineDot]} /><Text style={styles.sourceText}>{catalog.source === 'github' ? 'GitHub güncel' : 'Çevrimdışı katalog'}</Text></View>
        </View>

        <View style={styles.grid}>
          {catalog.apps.map((app) => (
            <AppCard key={app.id} app={app} width={cardWidth} launcher={launcher} />
          ))}
        </View>

        <View style={styles.githubInfo}>
          <Ionicons name="logo-github" size={21} color="#E7E7EA" />
          <View style={styles.infoCopy}><Text style={styles.infoTitle}>GitHub kataloğuna bağlı</Text><Text style={styles.infoBody}>Yeni uygulama eklemek için catalog/apps.json dosyasına bir kayıt ekle. Enverse yenilendiğinde otomatik görünür.</Text></View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  page: { flex: 1, backgroundColor: '#0E0E10' },
  content: { width: '100%', maxWidth: 1080, alignSelf: 'center', paddingHorizontal: 18, paddingBottom: 28 },
  header: { height: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#242428' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 11 }, logo: { width: 40, height: 40, borderRadius: 11 },
  brand: { color: '#F6F6F7', fontSize: 18, fontWeight: '800' }, brandSub: { color: '#85858D', fontSize: 11, marginTop: 1 },
  refreshButton: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#202024', alignItems: 'center', justifyContent: 'center' },
  catalogStatus: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 27, paddingBottom: 16 },
  heading: { color: '#F7F7F8', fontSize: 25, fontWeight: '800', letterSpacing: -0.6 }, subheading: { color: '#85858D', fontSize: 12, marginTop: 4 },
  sourceBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 9, paddingVertical: 7, borderRadius: 99, backgroundColor: '#1A1A1E' },
  sourceDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#58D67A' }, offlineDot: { backgroundColor: '#E7AA52' }, sourceText: { color: '#A6A6AD', fontSize: 9, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { minHeight: 205, padding: 14, borderRadius: 19, backgroundColor: '#18181C', borderWidth: 1, borderColor: '#29292F' },
  iconBox: { width: 58, height: 58, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 17, overflow: 'hidden' }, remoteIcon: { width: '100%', height: '100%' },
  appName: { color: '#F4F4F5', fontSize: 19, fontWeight: '800' }, appDescription: { color: '#909098', fontSize: 11, marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 15 }, category: { color: '#686870', fontSize: 9, fontWeight: '700', flex: 1 },
  disabled: { opacity: 0.4 }, pressed: { transform: [{ scale: 0.98 }], backgroundColor: '#202025' },
  downloadArea: { marginTop: 10 }, progressTrack: { height: 4, borderRadius: 2, backgroundColor: '#303036', overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 2 },
  downloadText: { color: '#A3A3AA', fontSize: 8, marginTop: 6 },
  githubInfo: { flexDirection: 'row', gap: 12, marginTop: 20, padding: 16, borderRadius: 16, backgroundColor: '#151518', borderWidth: 1, borderColor: '#252529' },
  infoCopy: { flex: 1 }, infoTitle: { color: '#E7E7EA', fontSize: 12, fontWeight: '700' }, infoBody: { color: '#7F7F87', fontSize: 10, lineHeight: 15, marginTop: 4 },
});

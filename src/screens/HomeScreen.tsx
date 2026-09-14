import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppCatalog } from '../core/catalog/useAppCatalog';
import type { InstalledPackage } from '../core/device/EnverseDevice';
import { useInstalledPackages } from '../core/device/useInstalledPackages';
import type { LaunchableApp } from '../core/launcher/apps';
import { appLauncherService } from '../core/launcher/AppLauncherService';
import { type LauncherJob, useAppLauncher } from '../core/launcher/useAppLauncher';

const icons: Record<string, keyof typeof Ionicons.glyphMap> = { maxen: 'film', tuben: 'play', voxen: 'musical-notes', enverse: 'grid' };
const mb = (bytes?: number) => bytes ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : '—';
const speed = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB/sn`;
const eta = (seconds: number | null) => seconds === null ? '' : seconds < 60 ? `${seconds} sn` : `${Math.ceil(seconds / 60)} dk`;

function appState(app: LaunchableApp, installed?: InstalledPackage, job?: LauncherJob) {
  if (job) {
    const labels: Record<LauncherJob['phase'], string> = {
      opening: 'Açılıyor', downloading: `İndiriliyor · ${Math.round(job.progress * 100)}%`, paused: 'Duraklatıldı',
      verifying: 'Doğrulanıyor', installing: 'Kurulum bekleniyor', permission: 'İzin gerekli', error: job.message || 'Tekrar dene',
    };
    return labels[job.phase];
  }
  if (!installed) return 'Kontrol ediliyor';
  if (!installed.installed) return 'Kur';
  if (installed.versionCode < app.versionCode) return `Güncelle · ${app.versionName}`;
  return 'Güncel';
}

export function HomeScreen() {
  const { width } = useWindowDimensions();
  const catalog = useAppCatalog();
  const installed = useInstalledPackages(catalog.apps);
  const launcher = useAppLauncher(() => void installed.refresh());
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tümü');
  const [selected, setSelected] = useState<LaunchableApp | null>(null);
  const columns = width >= 900 ? 5 : width >= 600 ? 3 : 2;
  const gap = 12;
  const horizontalPadding = 14;
  const maxWidth = Math.min(width, 1080);
  const cardWidth = (maxWidth - horizontalPadding * 2 - gap * (columns - 1)) / columns;
  const categories = useMemo(() => ['Tümü', ...Array.from(new Set(catalog.apps.map((app) => app.category || 'Uygulama')))], [catalog.apps]);
  const apps = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('tr-TR');
    return catalog.apps.filter((app) => (category === 'Tümü' || app.category === category)
      && (!normalized || `${app.name} ${app.description} ${app.category}`.toLocaleLowerCase('tr-TR').includes(normalized)));
  }, [catalog.apps, category, query]);
  const refresh = async () => { await catalog.refresh(); await installed.refresh(); };

  return (
    <View style={styles.page}>
      <Image source={require('../../assets/backgrounds/enverse-cosmic-portrait.png')} resizeMode="cover" style={styles.background} />
      <View style={styles.scrim} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <FlatList
          key={columns}
          data={apps}
          numColumns={columns}
          keyExtractor={(app) => app.id}
          renderItem={({ item }) => <AppCard app={item} width={cardWidth} installed={installed.packages[item.id]} job={launcher.jobs[item.id]} launcher={launcher} onDetails={() => setSelected(item)} />}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.content}
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={7}
          removeClippedSubviews
          refreshControl={<RefreshControl refreshing={catalog.loading || installed.checking} onRefresh={() => void refresh()} tintColor="#FFFFFF" colors={['#FFFFFF']} />}
          ListHeaderComponent={<Filters query={query} setQuery={setQuery} categories={categories} selected={category} setSelected={setCategory} />}
          ListEmptyComponent={<View style={styles.empty}>{catalog.loading ? <ActivityIndicator color="#FFFFFF" /> : <Ionicons name="search" size={30} color="#777781" />}<Text style={styles.emptyText}>{catalog.loading ? 'Katalog yükleniyor…' : 'Uygulama bulunamadı'}</Text></View>}
        />
      </SafeAreaView>
      <AppDetails app={selected} installed={selected ? installed.packages[selected.id] : undefined} job={selected ? launcher.jobs[selected.id] : undefined} onClose={() => setSelected(null)} onAction={() => selected && void launcher.act(selected, installed.packages[selected.id])} onUninstall={() => selected && void appLauncherService.uninstall(selected.packageName)} />
    </View>
  );
}

function Filters({ query, setQuery, categories, selected, setSelected }: { query: string; setQuery(value: string): void; categories: string[]; selected: string; setSelected(value: string): void }) {
  return <View style={styles.filters}>
    <View style={styles.search}><Ionicons name="search" size={18} color="#85858E" /><TextInput value={query} onChangeText={setQuery} placeholder="Uygulama ara" placeholderTextColor="#777781" style={styles.searchInput} />{query ? <Pressable onPress={() => setQuery('')} hitSlop={12}><Ionicons name="close-circle" size={18} color="#85858E" /></Pressable> : null}</View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{categories.map((item) => <Pressable key={item} onPress={() => setSelected(item)} style={[styles.chip, item === selected && styles.chipActive]}><Text style={[styles.chipText, item === selected && styles.chipTextActive]}>{item}</Text></Pressable>)}</ScrollView>
  </View>;
}

function AppCard({ app, width, installed, job, launcher, onDetails }: { app: LaunchableApp; width: number; installed?: InstalledPackage; job?: LauncherJob; launcher: ReturnType<typeof useAppLauncher>; onDetails(): void }) {
  const accent = app.accent || '#6D6F78';
  const downloading = job?.phase === 'downloading';
  return (
    <Pressable onPress={() => void launcher.act(app, installed)} onLongPress={onDetails} delayLongPress={350} style={({ pressed }) => [{ width }, styles.card, pressed && styles.pressed]}>
      <View style={[styles.iconBox, { backgroundColor: `${accent}1A` }]}>{app.iconUrl ? <Image source={{ uri: app.iconUrl }} style={styles.remoteIcon} /> : <Ionicons name={icons[app.id] || 'apps'} size={30} color={accent} />}</View>
      <Text numberOfLines={1} style={styles.appName}>{app.name}</Text>
      <Text numberOfLines={1} style={styles.appDescription}>{app.description}</Text>
      <View style={styles.cardFooter}>
        <Text numberOfLines={1} style={[styles.category, (job || installed?.versionCode !== app.versionCode) && { color: accent }]}>{appState(app, installed, job)}</Text>
        <Pressable onPress={onDetails} hitSlop={12}><Ionicons name="information-circle-outline" size={20} color="#85858E" /></Pressable>
      </View>
      {job && ['downloading', 'paused', 'verifying'].includes(job.phase) && <View style={styles.downloadArea}>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.max(2, job.progress * 100)}%`, backgroundColor: accent }]} /></View>
        <View style={styles.downloadMeta}><Text style={styles.downloadText}>{mb(job.written)} / {mb(job.total || app.sizeBytes)}</Text><View style={styles.jobButtons}>{downloading && <Pressable onPress={() => void launcher.pause(app.id)} hitSlop={10}><Ionicons name="pause" size={16} color="#D4D4D8" /></Pressable>}<Pressable onPress={() => void launcher.cancel(app.id)} hitSlop={10}><Ionicons name="close" size={17} color="#D4D4D8" /></Pressable></View></View>
        {downloading && <Text style={styles.downloadText}>{speed(job.bytesPerSecond)} {eta(job.etaSeconds)}</Text>}
      </View>}
    </Pressable>
  );
}

function AppDetails({ app, installed, job, onClose, onAction, onUninstall }: { app: LaunchableApp | null; installed?: InstalledPackage; job?: LauncherJob; onClose(): void; onAction(): void; onUninstall(): void }) {
  if (!app) return null;
  return <Modal visible transparent animationType="slide" onRequestClose={onClose}><Pressable style={styles.modalBackdrop} onPress={onClose}><Pressable style={styles.sheet} onPress={() => undefined}>
    <View style={styles.sheetHandle} />
    <View style={styles.detailHead}><View style={[styles.detailIcon, { backgroundColor: `${app.accent || '#777777'}22` }]}><Ionicons name={icons[app.id] || 'apps'} size={32} color={app.accent || '#AAAAAA'} /></View><View style={styles.detailTitle}><Text style={styles.detailName}>{app.name}</Text><Text style={styles.detailDescription}>{app.description}</Text></View><Pressable onPress={onClose} hitSlop={12}><Ionicons name="close" size={25} color="#B2B2B8" /></Pressable></View>
    <View style={styles.detailGrid}><Meta label="Durum" value={appState(app, installed, job)} /><Meta label="Yeni sürüm" value={`${app.versionName} (${app.versionCode})`} /><Meta label="Kurulu sürüm" value={installed?.installed ? `${installed.versionName} (${installed.versionCode})` : 'Kurulu değil'} /><Meta label="Boyut" value={mb(app.sizeBytes)} /></View>
    <Text style={styles.packageName}>{app.packageName}</Text>
    {app.changelog?.length ? <View style={styles.changelog}><Text style={styles.changelogTitle}>Yenilikler</Text>{app.changelog.map((line) => <Text key={line} style={styles.changelogLine}>• {line}</Text>)}</View> : null}
    <View style={styles.detailActions}>{installed?.installed && app.packageName !== 'com.enverse.app' ? <Pressable style={styles.secondaryButton} onPress={onUninstall}><Text style={styles.secondaryButtonText}>Kaldır</Text></Pressable> : null}<Pressable style={[styles.primaryButton, { backgroundColor: app.accent || '#6E6E78' }]} onPress={onAction}><Text style={styles.primaryButtonText}>{installed?.installed && installed.versionCode >= app.versionCode ? 'Aç' : installed?.installed ? 'Güncelle' : 'Kur'}</Text></Pressable></View>
  </Pressable></Pressable></Modal>;
}

function Meta({ label, value }: { label: string; value: string }) { return <View style={styles.meta}><Text style={styles.metaLabel}>{label}</Text><Text numberOfLines={2} style={styles.metaValue}>{value}</Text></View>; }

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#08090E' }, safe: { flex: 1 },
  background: { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 },
  scrim: { position: 'absolute', inset: 0, backgroundColor: 'rgba(5,6,12,0.62)' },
  content: { width: '100%', maxWidth: 1080, alignSelf: 'center', paddingHorizontal: 14, paddingTop: 10, paddingBottom: 28 },
  filters: { marginBottom: 13 }, search: { height: 46, paddingHorizontal: 14, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(24,24,29,0.94)', borderWidth: 1, borderColor: '#303037' },
  searchInput: { flex: 1, color: '#F4F4F5', fontSize: 15, paddingVertical: 0 }, chips: { gap: 8, paddingTop: 10, paddingRight: 10 },
  chip: { height: 34, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 99, backgroundColor: 'rgba(24,24,29,0.92)', borderWidth: 1, borderColor: '#303037' }, chipActive: { backgroundColor: '#EEEEF0', borderColor: '#EEEEF0' }, chipText: { color: '#A3A3AB', fontSize: 12, fontWeight: '700' }, chipTextActive: { color: '#151519' },
  row: { gap: 12, marginBottom: 12 }, card: { minHeight: 205, padding: 14, borderRadius: 19, backgroundColor: 'rgba(24,24,28,0.96)', borderWidth: 1, borderColor: '#29292F' },
  iconBox: { width: 58, height: 58, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 17, overflow: 'hidden' }, remoteIcon: { width: '100%', height: '100%' },
  appName: { color: '#F4F4F5', fontSize: 19, fontWeight: '800' }, appDescription: { color: '#909098', fontSize: 11, marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 15 }, category: { color: '#8A8A92', fontSize: 9, fontWeight: '800', flex: 1 }, pressed: { transform: [{ scale: 0.98 }], backgroundColor: '#202025' },
  downloadArea: { marginTop: 10 }, progressTrack: { height: 4, borderRadius: 2, backgroundColor: '#303036', overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 2 },
  downloadMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }, downloadText: { color: '#A3A3AA', fontSize: 8 }, jobButtons: { flexDirection: 'row', gap: 12 },
  empty: { paddingTop: 60, alignItems: 'center', gap: 12 }, emptyText: { color: '#B7B7BD', fontSize: 12 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.65)' }, sheet: { maxHeight: '82%', padding: 20, paddingBottom: 30, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: '#17171C', borderWidth: 1, borderColor: '#303037' },
  sheetHandle: { width: 38, height: 4, borderRadius: 2, alignSelf: 'center', backgroundColor: '#4A4A52', marginBottom: 20 }, detailHead: { flexDirection: 'row', alignItems: 'center', gap: 14 }, detailIcon: { width: 62, height: 62, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }, detailTitle: { flex: 1 }, detailName: { color: '#F5F5F6', fontSize: 23, fontWeight: '900' }, detailDescription: { color: '#91919A', fontSize: 12, marginTop: 3 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 22 }, meta: { width: '47%', padding: 12, borderRadius: 14, backgroundColor: '#202026' }, metaLabel: { color: '#777780', fontSize: 9, fontWeight: '700' }, metaValue: { color: '#E1E1E4', fontSize: 12, fontWeight: '700', marginTop: 4 }, packageName: { color: '#6F6F78', fontSize: 10, marginTop: 14 },
  changelog: { marginTop: 18 }, changelogTitle: { color: '#EFEFF1', fontSize: 14, fontWeight: '800', marginBottom: 7 }, changelogLine: { color: '#A1A1A9', fontSize: 12, lineHeight: 19 }, detailActions: { flexDirection: 'row', gap: 10, marginTop: 22 },
  primaryButton: { flex: 1, minHeight: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' }, secondaryButton: { minWidth: 100, minHeight: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#292930' }, secondaryButtonText: { color: '#E6E6E8', fontSize: 14, fontWeight: '800' },
});

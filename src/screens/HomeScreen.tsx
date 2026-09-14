import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LaunchableAppId } from '../core/launcher/apps';
import { useAppLauncher } from '../core/launcher/useAppLauncher';

const APPS = [
  { id: 'maxen', name: 'Maxen', description: 'Film & Dizi', icon: 'film', accent: '#FF4B65', colors: ['rgba(62,14,24,0.94)', 'rgba(20,7,11,0.97)'] },
  { id: 'tuben', name: 'Tuben', description: 'Video & Shorts', icon: 'play', accent: '#4C8DFF', colors: ['rgba(11,37,78,0.94)', 'rgba(5,12,25,0.97)'] },
  { id: 'voxen', name: 'Voxen', description: 'Müzik & Podcast', icon: 'musical-notes', accent: '#A264FF', colors: ['rgba(48,17,82,0.94)', 'rgba(14,7,25,0.97)'] },
] as const;

const formatBytes = (bytes: number) => bytes > 0 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : 'Hazırlanıyor';

export function HomeScreen() {
  const { width } = useWindowDimensions();
  const launcher = useAppLauncher();
  const mobile = width < 700;
  const cardWidth = mobile ? (width - 50) / 2 : undefined;

  const statusFor = (id: LaunchableAppId) => {
    if (launcher.appId !== id) return undefined;
    if (launcher.phase === 'opening') return 'Kontrol ediliyor';
    if (launcher.phase === 'installing') return 'Kurulum açıldı';
    if (launcher.phase === 'permission') return 'İzin gerekli';
    if (launcher.phase === 'error') return launcher.message ?? 'Tekrar dene';
    if (launcher.phase === 'downloading') return launcher.total > 0
      ? `${formatBytes(launcher.written)} / ${formatBytes(launcher.total)}`
      : formatBytes(launcher.written);
    return undefined;
  };

  return (
    <View style={styles.root}>
      <Image source={require('../../assets/backgrounds/enverse-cosmic-portrait.png')} resizeMode="cover" style={styles.background} />
      <LinearGradient colors={['rgba(3,5,13,0.20)', 'rgba(3,5,13,0.70)', 'rgba(3,5,13,0.96)']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <Image source={require('../../assets/brand/enverse-mark.png')} style={styles.logo} />
              <View><Text style={styles.brand}>ENVERSE</Text><Text style={styles.brandSub}>APP CENTER</Text></View>
            </View>
            <View style={styles.ready}><View style={[styles.readyDot, launcher.busy && styles.busyDot]} /><Text style={styles.readyText}>{launcher.busy ? 'Çalışıyor' : 'Hazır'}</Text></View>
          </View>

          <View style={styles.hero}>
            <Text style={styles.kicker}>EVRENİNİ SEÇ</Text>
            <Text style={styles.title}>Bir dokunuşla{mobile ? '\n' : ' '}başka bir dünyaya.</Text>
            <Text style={styles.subtitle}>İzle, dinle, keşfet. Kurulu değilse Enverse indirip kuruluma hazırlar.</Text>
          </View>

          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Uygulamalar</Text>
            <Text style={styles.count}>{APPS.length} UYGULAMA</Text>
          </View>

          <View style={styles.grid}>
            {APPS.map((app, index) => {
              const active = launcher.appId === app.id;
              const loading = active && (launcher.phase === 'opening' || launcher.phase === 'installing');
              const downloading = active && launcher.phase === 'downloading';
              const disabled = launcher.busy && !active;
              return (
                <Pressable key={app.id} disabled={disabled} onPress={() => void launcher.open(app.id)}
                  style={({ pressed }) => [styles.pressable, mobile && { width: cardWidth }, !mobile && styles.desktopCard, disabled && styles.disabled, pressed && styles.pressed]}>
                  <LinearGradient colors={app.colors} style={styles.card}>
                    <View style={styles.cardTop}>
                      <View style={[styles.icon, { borderColor: `${app.accent}66`, backgroundColor: `${app.accent}1F` }]}>
                        <Ionicons name={app.icon} size={mobile ? 24 : 28} color={app.accent} />
                      </View>
                      {loading ? <ActivityIndicator color={app.accent} /> : <Ionicons name="arrow-forward-circle" size={28} color={app.accent} />}
                    </View>
                    <View>
                      <Text style={[styles.appName, mobile && styles.appNameMobile]}>{app.name}</Text>
                      <Text style={styles.appDescription}>{statusFor(app.id) ?? app.description}</Text>
                      {downloading && <View style={styles.progressTrack}><View style={[styles.progress, { width: `${Math.max(2, launcher.progress * 100)}%`, backgroundColor: app.accent }]} /></View>}
                      {downloading && <Text style={[styles.percent, { color: app.accent }]}>{Math.round(launcher.progress * 100)}%</Text>}
                    </View>
                    {index === 0 && <View style={[styles.orb, { backgroundColor: app.accent }]} />}
                  </LinearGradient>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.note}><Ionicons name="shield-checkmark" size={16} color="#B9A8FF" /><Text style={styles.noteText}>APK dosyaları resmi Enverse GitHub sürümünden indirilir.</Text></View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#03050D' },
  background: { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.72 },
  safe: { flex: 1 },
  content: { width: '100%', maxWidth: 1080, alignSelf: 'center', paddingHorizontal: 16, paddingBottom: 28 },
  header: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 }, logo: { width: 38, height: 38, borderRadius: 12 },
  brand: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', letterSpacing: 3.1 }, brandSub: { color: '#89859B', fontSize: 8, fontWeight: '800', letterSpacing: 2, marginTop: 2 },
  ready: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 99, backgroundColor: 'rgba(5,8,18,0.55)' },
  readyDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#64ED8C' }, busyDot: { backgroundColor: '#B9A8FF' }, readyText: { color: '#D5D3DA', fontSize: 10, fontWeight: '700' },
  hero: { paddingTop: 33, paddingBottom: 31 }, kicker: { color: '#B9A8FF', fontSize: 10, fontWeight: '900', letterSpacing: 2.2 },
  title: { color: '#FFFFFF', fontSize: 36, lineHeight: 40, fontWeight: '900', letterSpacing: -1.5, marginTop: 9, maxWidth: 680 },
  subtitle: { color: '#AAA7B3', fontSize: 13, lineHeight: 19, marginTop: 10, maxWidth: 560 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' }, count: { color: '#777382', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, pressable: { flexGrow: 0 }, desktopCard: { flex: 1, minWidth: 220 },
  card: { height: 190, borderRadius: 24, padding: 16, justifyContent: 'space-between', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  icon: { width: 46, height: 46, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  appName: { color: '#FFFFFF', fontSize: 27, fontWeight: '900', letterSpacing: -0.8 }, appNameMobile: { fontSize: 22 },
  appDescription: { color: '#92909A', fontSize: 11, fontWeight: '600', marginTop: 3 },
  progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 3, overflow: 'hidden', marginTop: 10 }, progress: { height: '100%', borderRadius: 3 },
  percent: { fontSize: 9, fontWeight: '900', marginTop: 5 }, orb: { position: 'absolute', width: 150, height: 150, borderRadius: 75, opacity: 0.05, top: -75, right: -55 },
  disabled: { opacity: 0.4 }, pressed: { transform: [{ scale: 0.975 }] },
  note: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 14, padding: 13, borderRadius: 16, backgroundColor: 'rgba(4,6,14,0.68)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  noteText: { flex: 1, color: '#8E8B98', fontSize: 10, lineHeight: 15 },
});

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { WorldCard } from '../components/WorldCard';
import type { LaunchableAppId } from '../core/launcher/apps';
import { useAppLauncher } from '../core/launcher/useAppLauncher';
import { theme } from '../theme';

const formatBytes = (bytes: number) => bytes > 0 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : 'Hazırlanıyor…';

export function HomeScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const launcher = useAppLauncher();
  const detailFor = (id: LaunchableAppId) => {
    if (launcher.appId !== id) return undefined;
    if (launcher.phase === 'downloading') {
      return launcher.total > 0 ? `${formatBytes(launcher.written)} / ${formatBytes(launcher.total)}` : formatBytes(launcher.written);
    }
    return launcher.message;
  };

  return (
    <View style={styles.page}>
      <View style={styles.glowOne} /><View style={styles.glowTwo} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Image source={require('../../assets/brand/enverse-mark.png')} style={styles.logo} />
            <View><Text style={styles.brand}>ENVERSE</Text><Text style={styles.tagline}>Üç dünya. Tek dokunuş.</Text></View>
          </View>
          <View style={styles.androidBadge}>
            <Ionicons name={Platform.OS === 'android' ? 'logo-android' : 'phone-portrait-outline'} size={15} color="#B8F6C7" />
            <Text style={styles.androidText}>{Platform.OS === 'android' ? 'Android launcher' : 'Android gerekli'}</Text>
          </View>
        </View>

        <LinearGradient colors={['rgba(112,68,255,0.22)', 'rgba(12,15,27,0.72)']} style={styles.hero}>
          <Text style={styles.eyebrow}>UYGULAMA MERKEZİN</Text>
          <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>Eğlence evrenine{compact ? '\n' : ' '}tek yerden geç.</Text>
          <Text style={styles.heroBody}>Film, video ve müzik uygulamalarını aç. Kurulu değilse Enverse sürüm dosyasını indirip kuruluma hazırlar.</Text>
          <View style={styles.featureRow}>
            <View style={styles.feature}><Ionicons name="flash" size={14} color="#BCAEFF" /><Text style={styles.featureText}>Hızlı açılış</Text></View>
            <View style={styles.feature}><Ionicons name="cloud-download" size={14} color="#BCAEFF" /><Text style={styles.featureText}>Doğrudan APK</Text></View>
            <View style={styles.feature}><Ionicons name="shield-checkmark" size={14} color="#BCAEFF" /><Text style={styles.featureText}>Android onaylı</Text></View>
          </View>
        </LinearGradient>

        <View style={styles.sectionHeading}>
          <View><Text style={styles.sectionTitle}>Uygulamalar</Text><Text style={styles.sectionSubtitle}>Başlatmak veya kurmak için birini seç.</Text></View>
          {launcher.busy && <View style={styles.livePill}><View style={styles.liveDot} /><Text style={styles.liveText}>İŞLEM SÜRÜYOR</Text></View>}
        </View>

        <View style={[styles.worlds, compact && styles.worldsCompact]}>
          {(['maxen', 'tuben', 'voxen'] as LaunchableAppId[]).map((id) => (
            <WorldCard key={id} world={id} active={launcher.appId === id} disabled={launcher.busy && launcher.appId !== id}
              phase={launcher.appId === id ? launcher.phase : 'idle'} progress={launcher.appId === id ? launcher.progress : 0}
              detail={detailFor(id)} onPress={() => void launcher.open(id)} />
          ))}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}><Ionicons name="information" size={18} color="#BCAEFF" /></View>
          <Text style={styles.infoText}>İlk kurulumda Android, Enverse’e uygulama yükleme izni vermeni ister. İndirme tamamlanınca sistem kurucusu otomatik açılır.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: theme.colors.background, overflow: 'hidden' },
  glowOne: { position: 'absolute', width: 420, height: 420, borderRadius: 210, backgroundColor: 'rgba(93,56,255,0.11)', top: -180, right: -150 },
  glowTwo: { position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(0,164,255,0.07)', bottom: -170, left: -130 },
  content: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 42, width: '100%', maxWidth: 1160, alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, brandRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  logo: { width: 48, height: 48, borderRadius: 15 }, brand: { color: theme.colors.text, fontWeight: '900', letterSpacing: 3.5, fontSize: 17 },
  tagline: { color: theme.colors.muted, fontSize: 11, marginTop: 3 },
  androidBadge: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderColor: 'rgba(130,238,158,0.2)', backgroundColor: 'rgba(70,180,95,0.08)', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 999 },
  androidText: { color: '#B8F6C7', fontSize: 11, fontWeight: '700' },
  hero: { marginTop: 28, borderRadius: 30, paddingHorizontal: 24, paddingVertical: 30, borderWidth: 1, borderColor: 'rgba(179,159,255,0.18)', overflow: 'hidden' },
  eyebrow: { color: '#BCAEFF', fontWeight: '900', letterSpacing: 2.1, fontSize: 10 },
  heroTitle: { color: theme.colors.text, fontWeight: '900', letterSpacing: -1.7, fontSize: 40, lineHeight: 45, marginTop: 10, maxWidth: 760 },
  heroTitleCompact: { fontSize: 34, lineHeight: 39 }, heroBody: { color: '#B6B4C3', fontSize: 14, lineHeight: 21, marginTop: 12, maxWidth: 670 },
  featureRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 22 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.055)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 },
  featureText: { color: '#D7D3E3', fontSize: 11, fontWeight: '700' },
  sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 31, marginBottom: 14 },
  sectionTitle: { color: theme.colors.text, fontSize: 21, fontWeight: '900', letterSpacing: -0.4 }, sectionSubtitle: { color: theme.colors.muted, fontSize: 12, marginTop: 4 },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: 'rgba(124,92,252,0.12)', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#9B83FF' }, liveText: { color: '#BCAEFF', fontWeight: '900', fontSize: 9, letterSpacing: 1 },
  worlds: { flexDirection: 'row', gap: 13 }, worldsCompact: { flexDirection: 'column' },
  infoCard: { flexDirection: 'row', alignItems: 'center', marginTop: 18, padding: 14, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.035)', borderWidth: 1, borderColor: theme.colors.border },
  infoIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(124,92,252,0.14)', marginRight: 11 },
  infoText: { color: theme.colors.muted, flex: 1, fontSize: 11, lineHeight: 17 },
});

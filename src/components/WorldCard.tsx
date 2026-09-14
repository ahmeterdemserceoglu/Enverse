import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LauncherPhase } from '../core/launcher/useAppLauncher';
import { theme } from '../theme';
import type { EnverseWorld } from '../types';

type World = Exclude<EnverseWorld, 'home' | 'library'>;
const config = {
  maxen: { title: 'Maxen', subtitle: 'Film & Dizi', icon: 'film', colors: ['#421620', '#16090E'] as const, accent: theme.colors.maxen },
  tuben: { title: 'Tuben', subtitle: 'Video & Shorts', icon: 'play', colors: ['#102C5B', '#080F1C'] as const, accent: theme.colors.tuben },
  voxen: { title: 'Voxen', subtitle: 'Müzik & Podcast', icon: 'musical-notes', colors: ['#35165B', '#100919'] as const, accent: theme.colors.voxen },
};

type Props = { world: World; onPress: () => void; active: boolean; disabled: boolean; phase: LauncherPhase; progress: number; detail?: string };

export function WorldCard({ world, onPress, active, disabled, phase, progress, detail }: Props) {
  const item = config[world];
  const downloading = active && phase === 'downloading';
  const label = active
    ? phase === 'opening' ? 'Uygulama kontrol ediliyor…'
      : phase === 'installing' ? 'Android kurucusu açık'
        : phase === 'permission' ? 'Yükleme izni gerekiyor'
          : phase === 'error' ? detail ?? 'Bir sorun oluştu'
            : item.subtitle
    : item.subtitle;

  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.shell, pressed && styles.pressed, disabled && styles.disabled]}>
      <LinearGradient colors={item.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.card, active && { borderColor: `${item.accent}99` }]}>
        <View style={styles.topRow}>
          <View style={[styles.icon, { backgroundColor: item.accent }]}><Ionicons name={item.icon as never} size={25} color="#fff" /></View>
          {active && (phase === 'opening' || phase === 'installing')
            ? <ActivityIndicator color={item.accent} />
            : <View style={styles.launchBadge}><Ionicons name="arrow-up" size={17} color={item.accent} /></View>}
        </View>
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text numberOfLines={2} style={[styles.subtitle, active && { color: theme.colors.text }]}>{label}</Text>
          {downloading && (
            <View style={styles.progressArea}>
              <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.max(2, progress * 100)}%`, backgroundColor: item.accent }]} /></View>
              <Text style={styles.progressText}>{Math.round(progress * 100)}% · {detail}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, minWidth: 210 }, pressed: { transform: [{ scale: 0.985 }] }, disabled: { opacity: 0.45 },
  card: { minHeight: 206, borderRadius: 28, padding: 20, borderWidth: 1, borderColor: theme.colors.border, justifyContent: 'space-between', overflow: 'hidden' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  icon: { width: 50, height: 50, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  launchBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.07)', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '45deg' }] },
  title: { color: theme.colors.text, fontSize: 28, fontWeight: '900', letterSpacing: -0.8 },
  subtitle: { color: theme.colors.muted, fontSize: 13, lineHeight: 18, marginTop: 5, minHeight: 18 },
  progressArea: { marginTop: 13 }, progressTrack: { height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 }, progressText: { color: theme.colors.muted, fontSize: 11, fontWeight: '700', marginTop: 7 },
});

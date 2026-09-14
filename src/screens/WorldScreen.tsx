import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { worldCopy } from '../content';
import { theme } from '../theme';
import type { EnverseWorld } from '../types';

type World = Exclude<EnverseWorld, 'home' | 'library'>;

const icons = { maxen: 'film-outline', tuben: 'play-circle-outline', voxen: 'musical-notes-outline' } as const;

export function WorldScreen({ world, onHome }: { world: World; onHome: () => void }) {
  const copy = worldCopy[world];
  const color = theme.colors[world];
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Pressable onPress={onHome} style={styles.back}><Ionicons name="arrow-back" size={20} color={theme.colors.text} /><Text style={styles.backText}>Enverse</Text></Pressable>
      <LinearGradient colors={[`${color}55`, theme.colors.background]} style={styles.hero}>
        <View style={[styles.icon, { backgroundColor: color }]}><Ionicons name={icons[world]} size={34} color="#fff" /></View>
        <Text style={[styles.eyebrow, { color }]}>{copy.eyebrow}</Text>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.description}>{copy.description}</Text>
        <View style={styles.badge}><View style={[styles.liveDot, { backgroundColor: color }]} /><Text style={styles.badgeText}>Modül bağlantısı için hazır</Text></View>
      </LinearGradient>
      <View style={styles.placeholder}>
        <Ionicons name="layers-outline" size={28} color={color} />
        <Text style={styles.placeholderTitle}>{copy.title} taşıma alanı</Text>
        <Text style={styles.placeholderBody}>Mevcut {copy.title} ekranları ve servisleri ortak Enverse çekirdeğine bu modülden bağlanacak.</Text>
      </View>
    </ScrollView>
  );
}

export function LibraryScreen() {
  return <View style={styles.center}><Ionicons name="library-outline" size={40} color={theme.colors.accent} /><Text style={styles.placeholderTitle}>Ortak Kütüphane</Text><Text style={styles.placeholderBody}>Filmler, videolar, müzikler ve indirmeler tek yerde birleşecek.</Text></View>;
}

const styles = StyleSheet.create({
  content: { padding: 22, width: '100%', maxWidth: 1200, alignSelf: 'center' },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  backText: { color: theme.colors.text, fontWeight: '700' },
  hero: { minHeight: 320, borderRadius: theme.radius.lg, padding: 28, marginTop: 18, justifyContent: 'flex-end', overflow: 'hidden' },
  icon: { width: 62, height: 62, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  eyebrow: { fontWeight: '900', letterSpacing: 2, fontSize: 12 },
  title: { color: theme.colors.text, fontSize: 46, fontWeight: '900', marginTop: 3 },
  description: { color: theme.colors.muted, fontSize: 17, marginTop: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 22 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  badgeText: { color: theme.colors.muted, fontSize: 12 },
  placeholder: { alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, marginTop: 20, padding: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: theme.colors.background },
  placeholderTitle: { color: theme.colors.text, fontSize: 19, fontWeight: '800', marginTop: 12 },
  placeholderBody: { color: theme.colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', maxWidth: 500, marginTop: 6 },
});

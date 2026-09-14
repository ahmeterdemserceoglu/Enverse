import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import type { EnverseWorld } from '../types';

type World = Exclude<EnverseWorld, 'home' | 'library'>;

const config = {
  maxen: { title: 'MAXEN', subtitle: 'Film & Dizi', icon: 'film-outline', colors: ['#411018', '#17090C'] as const, accent: theme.colors.maxen },
  tuben: { title: 'TUBEN', subtitle: 'Video & Shorts', icon: 'play-circle-outline', colors: ['#102A55', '#090E18'] as const, accent: theme.colors.tuben },
  voxen: { title: 'VOXEN', subtitle: 'Müzik & Podcast', icon: 'musical-notes-outline', colors: ['#30134E', '#100A17'] as const, accent: theme.colors.voxen },
};

export function WorldCard({ world, onPress, status }: { world: World; onPress: () => void; status?: string }) {
  const item = config[world];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.shell, pressed && styles.pressed]}>
      <LinearGradient colors={item.colors} style={styles.card}>
        <View style={[styles.icon, { backgroundColor: item.accent }]}>
          <Ionicons name={item.icon as never} size={26} color="#fff" />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{status ?? item.subtitle}</Text>
        </View>
        <Ionicons name="arrow-forward" size={20} color={item.accent} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, minWidth: 210 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
  card: { minHeight: 164, borderRadius: theme.radius.lg, padding: 20, borderWidth: 1, borderColor: theme.colors.border, justifyContent: 'space-between' },
  icon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  copy: { marginTop: 24 },
  title: { color: theme.colors.text, fontSize: 25, fontWeight: '900', letterSpacing: 2 },
  subtitle: { color: theme.colors.muted, fontSize: 14, marginTop: 4 },
});

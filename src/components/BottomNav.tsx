import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import type { EnverseWorld } from '../types';

const items: Array<{ key: EnverseWorld; label: string; icon: string }> = [
  { key: 'home', label: 'Ana Sayfa', icon: 'home-outline' },
  { key: 'maxen', label: 'Maxen', icon: 'film-outline' },
  { key: 'tuben', label: 'Tuben', icon: 'play-circle-outline' },
  { key: 'voxen', label: 'Voxen', icon: 'musical-notes-outline' },
  { key: 'library', label: 'Kütüphane', icon: 'library-outline' },
];

export function BottomNav({ active, onChange }: { active: EnverseWorld; onChange: (world: EnverseWorld) => void }) {
  return (
    <View style={styles.nav}>
      {items.map((item) => {
        const selected = active === item.key;
        return (
          <Pressable key={item.key} onPress={() => onChange(item.key)} style={styles.item} accessibilityRole="tab" accessibilityState={{ selected }}>
            <Ionicons name={item.icon as never} size={22} color={selected ? theme.colors.text : theme.colors.muted} />
            <Text style={[styles.label, selected && styles.selected]} numberOfLines={1}>{item.label}</Text>
            {selected && <View style={styles.dot} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', backgroundColor: 'rgba(17,17,22,0.98)', borderTopWidth: 1, borderTopColor: theme.colors.border, paddingHorizontal: 6, paddingTop: 9, paddingBottom: 8 },
  item: { flex: 1, alignItems: 'center', minHeight: 48, gap: 3 },
  label: { color: theme.colors.muted, fontSize: 10, fontWeight: '600' },
  selected: { color: theme.colors.text },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: theme.colors.accent },
});

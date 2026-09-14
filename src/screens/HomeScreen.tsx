import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { continueItems } from '../content';
import { theme } from '../theme';
import type { EnverseWorld } from '../types';
import { WorldCard } from '../components/WorldCard';

export function HomeScreen({ onOpen }: { onOpen: (world: EnverseWorld) => void }) {
  const { width } = useWindowDimensions();
  const compact = width < 720;
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>ENVERSE</Text>
          <Text style={styles.tagline}>Üç dünya, tek evren.</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.kicker}>BUGÜN SENİN İÇİN</Text>
        <Text style={styles.heroTitle}>Ne izlemek veya{compact ? '\n' : ' '}dinlemek istersin?</Text>
        <Text style={styles.heroBody}>Film, video ve müziğin aynı hesapta; kaldığın yer her cihazda seninle.</Text>
      </View>

      <View style={[styles.worlds, compact && styles.worldsCompact]}>
        <WorldCard world="maxen" onPress={() => onOpen('maxen')} />
        <WorldCard world="tuben" onPress={() => onOpen('tuben')} />
        <WorldCard world="voxen" onPress={() => onOpen('voxen')} />
      </View>

      <Text style={styles.sectionTitle}>Senin evrenin</Text>
      <View style={styles.feed}>
        {continueItems.map((item) => {
          const color = theme.colors[item.world];
          return (
            <View key={item.id} style={styles.feedCard}>
              <View style={[styles.feedIcon, { backgroundColor: `${color}22` }]}>
                <Ionicons name={item.icon as never} color={color} size={23} />
              </View>
              <View style={styles.feedCopy}>
                <Text style={styles.feedTitle}>{item.title}</Text>
                <Text style={styles.feedSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 22, paddingBottom: 38, width: '100%', maxWidth: 1200, alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: theme.colors.text, fontWeight: '900', letterSpacing: 4, fontSize: 19 },
  tagline: { color: theme.colors.muted, fontSize: 12, marginTop: 3 },
  avatar: { width: 42, height: 42, borderRadius: 15, backgroundColor: theme.colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  hero: { paddingVertical: 48, maxWidth: 740 },
  kicker: { color: '#9C8AFF', fontWeight: '800', letterSpacing: 2, fontSize: 11 },
  heroTitle: { color: theme.colors.text, fontWeight: '800', fontSize: 38, lineHeight: 44, marginTop: 10 },
  heroBody: { color: theme.colors.muted, fontSize: 16, lineHeight: 24, marginTop: 12, maxWidth: 600 },
  worlds: { flexDirection: 'row', gap: 14 },
  worldsCompact: { flexDirection: 'column' },
  sectionTitle: { color: theme.colors.text, fontSize: 20, fontWeight: '800', marginTop: 38, marginBottom: 14 },
  feed: { gap: 10 },
  feedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 14, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border },
  feedIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  feedCopy: { flex: 1, marginHorizontal: 13 },
  feedTitle: { color: theme.colors.text, fontSize: 15, fontWeight: '700' },
  feedSubtitle: { color: theme.colors.muted, fontSize: 12, marginTop: 3 },
});

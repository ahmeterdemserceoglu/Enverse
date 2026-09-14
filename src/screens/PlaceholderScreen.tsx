import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <Ionicons name="construct-outline" size={36} color={theme.colors.accent} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>Bu ortak Enverse özelliği sonraki migrasyon fazında bağlanacak.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: theme.colors.background },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '800', marginTop: 12 },
  body: { color: theme.colors.muted, fontSize: 14, textAlign: 'center', marginTop: 6 },
});

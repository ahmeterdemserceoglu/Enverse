import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

type Props = {
  kind: 'loading' | 'empty' | 'error';
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function FeedbackState({ kind, title, message, actionLabel, onAction }: Props) {
  const defaults = {
    loading: ['Yükleniyor', 'Evrenin hazırlanıyor.'],
    empty: ['Henüz burada bir şey yok', 'Yeni içerikler burada görünecek.'],
    error: ['İçerik yüklenemedi', 'Bağlantını kontrol edip yeniden deneyebilirsin.'],
  } as const;

  return (
    <View style={styles.container} accessibilityRole={kind === 'error' ? 'alert' : undefined}>
      {kind === 'loading' ? (
        <ActivityIndicator color={theme.colors.accent} size="large" />
      ) : (
        <Ionicons name={kind === 'empty' ? 'sparkles-outline' : 'cloud-offline-outline'} size={38} color={theme.colors.accent} />
      )}
      <Text style={styles.title}>{title ?? defaults[kind][0]}</Text>
      <Text style={styles.message}>{message ?? defaults[kind][1]}</Text>
      {actionLabel && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', minHeight: 240, padding: 28 },
  title: { color: theme.colors.text, fontSize: 18, fontWeight: '800', marginTop: 14 },
  message: { color: theme.colors.muted, fontSize: 14, lineHeight: 20, textAlign: 'center', maxWidth: 420, marginTop: 6 },
  action: { minHeight: 44, justifyContent: 'center', backgroundColor: theme.colors.accent, paddingHorizontal: 20, borderRadius: theme.radius.pill, marginTop: 20 },
  actionText: { color: '#fff', fontWeight: '800' },
  pressed: { opacity: 0.8 },
});

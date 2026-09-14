import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';

type State = { error: Error | null };

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (__DEV__) console.error('[EnverseErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bir şeyler ters gitti</Text>
        <Text style={styles.body}>Enverse bu ekranı açamadı. Yeniden deneyebilirsin.</Text>
        <Pressable style={styles.button} onPress={() => this.setState({ error: null })}>
          <Text style={styles.buttonText}>Yeniden dene</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: theme.colors.background },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '800' },
  body: { color: theme.colors.muted, textAlign: 'center', marginTop: 8, maxWidth: 420 },
  button: { backgroundColor: theme.colors.accent, borderRadius: theme.radius.pill, paddingHorizontal: 20, paddingVertical: 12, marginTop: 22 },
  buttonText: { color: '#fff', fontWeight: '800' },
});

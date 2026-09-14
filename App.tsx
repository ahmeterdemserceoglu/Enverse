import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { AppProviders } from './src/app/AppProviders';
import { RootNavigator } from './src/app/RootNavigator';

export default function App() {
  return (
    <AppProviders>
      <StatusBar style="light" />
      <RootNavigator />
    </AppProviders>
  );
}

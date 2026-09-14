import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, useWindowDimensions } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { LibraryScreen, WorldScreen } from '../screens/WorldScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { theme } from '../theme';
import { linking } from './linking';
import type { MainTabParamList, RootStackParamList } from './navigationTypes';

const Tabs = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const icons: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline', Maxen: 'film-outline', Tuben: 'play-circle-outline', Voxen: 'musical-notes-outline', Library: 'library-outline',
};

function MainTabs() {
  const { width } = useWindowDimensions();
  const useSidebar = width >= 960;
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border, height: Platform.OS === 'web' ? 68 : 62 },
        tabBarPosition: useSidebar ? 'left' : 'bottom',
        tabBarVariant: useSidebar ? 'material' : 'uikit',
        tabBarLabelPosition: useSidebar ? 'beside-icon' : 'below-icon',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
        tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name]} color={color} size={size} />,
      })}
    >
      <Tabs.Screen name="Home">{({ navigation }) => <HomeScreen onOpen={(world) => navigation.navigate(world === 'maxen' ? 'Maxen' : world === 'tuben' ? 'Tuben' : world === 'voxen' ? 'Voxen' : 'Home')} />}</Tabs.Screen>
      <Tabs.Screen name="Maxen">{({ navigation }) => <WorldScreen world="maxen" onHome={() => navigation.navigate('Home')} />}</Tabs.Screen>
      <Tabs.Screen name="Tuben">{({ navigation }) => <WorldScreen world="tuben" onHome={() => navigation.navigate('Home')} />}</Tabs.Screen>
      <Tabs.Screen name="Voxen">{({ navigation }) => <WorldScreen world="voxen" onHome={() => navigation.navigate('Home')} />}</Tabs.Screen>
      <Tabs.Screen name="Library" component={LibraryScreen} options={{ title: 'Kütüphane' }} />
    </Tabs.Navigator>
  );
}

const navigationTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, primary: theme.colors.accent, background: theme.colors.background, card: theme.colors.surface, text: theme.colors.text, border: theme.colors.border, notification: theme.colors.maxen } };

export function RootNavigator() {
  return (
    <NavigationContainer linking={linking} theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: theme.colors.surface }, headerTintColor: theme.colors.text, contentStyle: { backgroundColor: theme.colors.background } }}>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="GlobalSearch" options={{ title: 'Ara' }}>{() => <PlaceholderScreen title="Birleşik Arama" />}</Stack.Screen>
        <Stack.Screen name="Settings" options={{ title: 'Ayarlar' }}>{() => <PlaceholderScreen title="Ayarlar" />}</Stack.Screen>
        <Stack.Screen name="Downloads" options={{ title: 'İndirilenler' }}>{() => <PlaceholderScreen title="İndirilenler" />}</Stack.Screen>
        <Stack.Screen name="DeviceConnect" options={{ title: 'Cihaz Bağla' }}>{() => <PlaceholderScreen title="Enverse Connect" />}</Stack.Screen>
        <Stack.Screen name="Player" options={{ headerShown: false }}>{() => <PlaceholderScreen title="Ortak Oynatıcı" />}</Stack.Screen>
        <Stack.Screen name="Profile" options={{ title: 'Profil' }}>{() => <PlaceholderScreen title="En ID Profili" />}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

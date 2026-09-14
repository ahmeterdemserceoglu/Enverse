import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Maxen: undefined;
  Tuben: undefined;
  Voxen: undefined;
  Library: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  GlobalSearch: { initialQuery?: string } | undefined;
  Settings: undefined;
  Downloads: undefined;
  DeviceConnect: { token?: string } | undefined;
  Player: { mediaId: string; mediaType: string; world: 'maxen' | 'tuben' | 'voxen' };
  Profile: { userId: string };
};

import type { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import type { RootStackParamList } from './navigationTypes';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), 'enverse://'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Home: '',
          Maxen: 'maxen',
          Tuben: 'tuben',
          Voxen: 'voxen',
          Library: 'library',
        },
      },
      GlobalSearch: 'search',
      Settings: 'settings',
      Downloads: 'downloads',
      DeviceConnect: 'device/connect/:token?',
      Player: 'play/:world/:mediaType/:mediaId',
      Profile: 'profile/:userId',
    },
  },
};

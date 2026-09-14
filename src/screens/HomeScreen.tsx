import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import type { LaunchableAppId } from '../core/launcher/apps';
import { useAppLauncher } from '../core/launcher/useAppLauncher';

type AppConfig = {
  id: LaunchableAppId;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  gradient: readonly [string, string];
};

const APPS: AppConfig[] = [
  {
    id: 'maxen',
    name: 'Maxen',
    description: 'Film & Dizi',
    icon: 'film',
    accent: '#FF4B65',
    gradient: ['#261014', '#12090B'],
  },
  {
    id: 'tuben',
    name: 'Tuben',
    description: 'Video & Shorts',
    icon: 'play',
    accent: '#4C8DFF',
    gradient: ['#0D1D3A', '#090D15'],
  },
  {
    id: 'voxen',
    name: 'Voxen',
    description: 'Müzik & Podcast',
    icon: 'musical-notes',
    accent: '#A264FF',
    gradient: ['#211039', '#100A18'],
  },
];

function formatBytes(bytes: number) {
  if (!bytes || bytes <= 0) {
    return 'Hazırlanıyor';
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function HomeScreen() {
  const { width, height } = useWindowDimensions();

  const launcher = useAppLauncher();

  const compact = width < 760;
  const shortScreen = height < 680;

  const getStatusText = (id: LaunchableAppId) => {
    if (launcher.appId !== id) {
      return undefined;
    }

    switch (launcher.phase) {
      case 'opening':
        return 'Kontrol ediliyor';

      case 'downloading':
        if (launcher.total > 0) {
          return `${formatBytes(
            launcher.written
          )} / ${formatBytes(launcher.total)}`;
        }

        return formatBytes(launcher.written);

      case 'installing':
        return 'Kurulum açıldı';

      case 'permission':
        return 'Yükleme izni gerekli';

      case 'error':
        return launcher.message || 'Bir sorun oluştu';

      default:
        return launcher.message;
    }
  };

  return (
    <View style={styles.page}>
      {/* Background */}
      <LinearGradient
        colors={['#07080C', '#0A0B11', '#07080C']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.brand}>
          <Image
            source={require('../../assets/brand/enverse-mark.png')}
            style={styles.logo}
          />

          <Text style={styles.brandName}>ENVERSE</Text>
        </View>

        <View style={styles.status}>
          <View style={styles.onlineDot} />

          <Text style={styles.statusText}>
            {launcher.busy ? 'Çalışıyor' : 'Hazır'}
          </Text>
        </View>
      </View>

      {/* MAIN */}
      <View
        style={[
          styles.main,
          shortScreen && styles.mainShort,
        ]}
      >
        <View style={styles.heading}>
          <Text
            style={[
              styles.title,
              compact && styles.titleCompact,
            ]}
          >
            Bir uygulama seç.
          </Text>

          <Text style={styles.subtitle}>
            İzle, dinle veya keşfet.
          </Text>
        </View>

        <View
          style={[
            styles.appRow,
            compact && styles.appRowCompact,
          ]}
        >
          {APPS.map((app) => {
            const active = launcher.appId === app.id;

            const disabled =
              launcher.busy &&
              launcher.appId !== app.id;

            const loading =
              active &&
              (
                launcher.phase === 'opening' ||
                launcher.phase === 'installing'
              );

            const downloading =
              active &&
              launcher.phase === 'downloading';

            const error =
              active &&
              launcher.phase === 'error';

            const statusText =
              getStatusText(app.id);

            return (
              <Pressable
                key={app.id}
                disabled={disabled}
                onPress={() => void launcher.open(app.id)}
                style={({ pressed }) => [
                  styles.cardPressable,

                  compact &&
                  styles.cardPressableCompact,

                  disabled &&
                  styles.cardDisabled,

                  pressed &&
                  !disabled &&
                  styles.cardPressed,
                ]}
              >
                <LinearGradient
                  colors={app.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.card,

                    active && {
                      borderColor: `${app.accent}75`,
                    },
                  ]}
                >
                  {/* Accent glow */}
                  <View
                    style={[
                      styles.cardGlow,
                      {
                        backgroundColor: app.accent,
                      },
                    ]}
                  />

                  <View style={styles.cardTop}>
                    <View
                      style={[
                        styles.appIcon,
                        {
                          backgroundColor: `${app.accent}18`,
                          borderColor: `${app.accent}30`,
                        },
                      ]}
                    >
                      <Ionicons
                        name={app.icon}
                        size={29}
                        color={app.accent}
                      />
                    </View>

                    <View
                      style={[
                        styles.openButton,
                        {
                          backgroundColor: `${app.accent}12`,
                        },
                      ]}
                    >
                      {loading ? (
                        <ActivityIndicator
                          size="small"
                          color={app.accent}
                        />
                      ) : (
                        <Ionicons
                          name="arrow-forward"
                          size={20}
                          color={app.accent}
                        />
                      )}
                    </View>
                  </View>

                  <View style={styles.cardBottom}>
                    <Text style={styles.appName}>
                      {app.name}
                    </Text>

                    <Text style={styles.appDescription}>
                      {app.description}
                    </Text>

                    {active &&
                      statusText && (
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.appStatus,

                            error && {
                              color: '#FF7689',
                            },
                          ]}
                        >
                          {statusText}
                        </Text>
                      )}

                    {downloading && (
                      <View style={styles.progressSection}>
                        <View
                          style={styles.progressTrack}
                        >
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${Math.min(
                                  100,
                                  Math.max(
                                    1,
                                    launcher.progress * 100
                                  )
                                )}%`,
                                backgroundColor:
                                  app.accent,
                              },
                            ]}
                          />
                        </View>

                        <Text
                          style={[
                            styles.progressText,
                            {
                              color: app.accent,
                            },
                          ]}
                        >
                          {Math.round(
                            launcher.progress * 100
                          )}
                          %
                        </Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Ionicons
            name={
              Platform.OS === 'android'
                ? 'logo-android'
                : 'phone-portrait-outline'
            }
            size={13}
            color="#626570"
          />

          <Text style={styles.footerText}>
            {Platform.OS === 'android'
              ? 'Android'
              : 'Mobile'}
          </Text>
        </View>

        <Text style={styles.footerText}>
          Enverse Launcher
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#07080C',
    paddingHorizontal: 26,
    paddingTop: 22,
    paddingBottom: 18,
    overflow: 'hidden',
  },

  glowTop: {
    position: 'absolute',
    width: 460,
    height: 460,
    borderRadius: 230,
    backgroundColor: 'rgba(115, 80, 255, 0.08)',
    top: -290,
    left: '22%',
  },

  glowBottom: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: 'rgba(48, 92, 255, 0.04)',
    bottom: -280,
    right: -150,
  },

  header: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  logo: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },

  brandName: {
    color: '#F5F5F7',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 3.4,
  },

  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6EEE8B',
  },

  statusText: {
    color: '#676A74',
    fontSize: 10,
    fontWeight: '700',
  },

  main: {
    flex: 1,
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  mainShort: {
    justifyContent: 'flex-start',
    paddingTop: 36,
  },

  heading: {
    marginBottom: 25,
  },

  title: {
    color: '#F7F7F9',
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '900',
    letterSpacing: -1.3,
  },

  titleCompact: {
    fontSize: 28,
    lineHeight: 33,
  },

  subtitle: {
    color: '#6C6E78',
    fontSize: 12,
    marginTop: 4,
  },

  appRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 14,
  },

  appRowCompact: {
    flexDirection: 'column',
    gap: 11,
  },

  cardPressable: {
    flex: 1,
    minWidth: 0,
  },

  cardPressableCompact: {
    flex: 0,
    width: '100%',
  },

  cardPressed: {
    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  cardDisabled: {
    opacity: 0.38,
  },

  card: {
    position: 'relative',

    width: '100%',
    height: 235,

    borderRadius: 25,

    padding: 20,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.065)',

    justifyContent: 'space-between',

    overflow: 'hidden',
  },

  cardGlow: {
    position: 'absolute',

    width: 190,
    height: 190,

    borderRadius: 95,

    opacity: 0.07,

    top: -95,
    right: -70,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  appIcon: {
    width: 54,
    height: 54,

    borderRadius: 17,

    borderWidth: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },

  openButton: {
    width: 39,
    height: 39,

    borderRadius: 20,

    alignItems: 'center',
    justifyContent: 'center',
  },

  cardBottom: {
    width: '100%',
  },

  appName: {
    color: '#F8F8FA',

    fontSize: 27,

    fontWeight: '900',

    letterSpacing: -0.8,
  },

  appDescription: {
    color: '#747680',

    fontSize: 12,

    fontWeight: '600',

    marginTop: 3,
  },

  appStatus: {
    color: '#999BA5',

    fontSize: 10,

    fontWeight: '600',

    marginTop: 9,
  },

  progressSection: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 9,

    marginTop: 11,
  },

  progressTrack: {
    flex: 1,

    height: 4,

    borderRadius: 2,

    overflow: 'hidden',

    backgroundColor:
      'rgba(255,255,255,0.10)',
  },

  progressFill: {
    height: '100%',

    borderRadius: 2,
  },

  progressText: {
    width: 31,

    fontSize: 9,

    textAlign: 'right',

    fontWeight: '900',
  },

  footer: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingTop: 13,

    borderTopWidth: 1,
    borderTopColor:
      'rgba(255,255,255,0.045)',
  },

  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  footerText: {
    color: '#484A53',
    fontSize: 9,
    fontWeight: '600',
  },
});
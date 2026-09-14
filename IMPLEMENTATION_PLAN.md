# Enverse — Eksiksiz Uygulama ve Migrasyon Planı

> Bu belge, Enverse'i başka bir agentın baştan sona uygulayabilmesi için hazırlanmış bağlayıcı teknik şartnamedir. Burada açıkça belirtilen kararları değiştirmeyin. Zorunlu bir teknik engel çıkarsa mevcut davranışı bozmayan en küçük değişikliği yapın ve değişikliği `DECISIONS.md` dosyasına gerekçesiyle kaydedin.

## 1. Ürün vizyonu

Enverse; Maxen, Tuben ve Voxen'i tek uygulama, tek hesap, tek kütüphane ve ortak cihaz deneyiminde buluşturan modüler medya platformudur.

Marka mesajı:

> **Enverse — Üç dünya, tek evren.**

Ürün dünyaları:

| Dünya | Amaç | Marka rengi | Kaynak proje |
|---|---|---:|---|
| Maxen | Film, dizi, fragman, Android TV ve watch party | `#FF3D4D` | `/home/ahmet/Projeler/maxen/maxen-master` |
| Tuben | Video, Shorts, SponsorBlock ve video indirme | `#3B82F6` | `/home/ahmet/Projeler/tuben/tuben-main` |
| Voxen | Müzik, podcast, şarkı sözleri ve listening room | `#A855F7` | `/home/ahmet/Projeler/voxen/voxen-main` |
| Enverse | Ortak ana sayfa, arama, hesap, kütüphane ve cihazlar | `#7C5CFC` | `/home/ahmet/Projeler/enverse` |

Enverse, üç uygulamanın kaynak dosyalarını körlemesine tek klasöre kopyalayan bir proje olmayacaktır. Her dünya bağımsız bir özellik modülü olacak; kimlik, depolama, ağ, sosyal grafik, cihaz yönetimi, telemetri ve tasarım sistemi ortak çekirdekte yaşayacaktır.

## 2. Değiştirilemez temel kararlar

1. Yeni ana proje `/home/ahmet/Projeler/enverse` dizinidir.
2. Kaynak projeler migrasyon tamamlanana kadar çalışır durumda tutulmalıdır.
3. Kaynak projelerde doğrudan değişiklik yapmayın. Önce Enverse'e taşıyın, doğrulayın, sonra ortak paket çıkarın.
4. Mobil/web tabanı Expo SDK 57, React 19.2 ve React Native 0.86 olacaktır.
5. Maxen Android TV desteği ayrı bir platform adaptörü ve gerekirse ayrı build hedefi olarak ele alınacaktır. `react-native-tvos` doğrudan mobil bağımlılık ağacına zorla eklenmeyecektir.
6. Navigasyon için React Navigation 7 kullanılacaktır. Mevcut prototipteki `useState` navigasyonu Faz 1'de kaldırılacaktır.
7. Global istemci durumu Zustand; sunucu/cache durumu TanStack Query ile yönetilecektir.
8. Firebase modüler SDK kullanılacaktır. Tek Firebase projesi ve tek Auth kullanıcı kimliği hedeflenir.
9. Gizli değerler kaynak koda yazılmayacaktır. Firebase istemci yapılandırması environment üzerinden alınacak; gerçek sırlar yalnızca sunucu/edge ortamında tutulacaktır.
10. Her migrasyon adımı test edilmeden sonraki dünyaya geçilmeyecektir.
11. Maxen Firestore kuralları mevcut haliyle kesinlikle deploy edilmeyecektir.
12. Uygulamada aynı anda yalnızca bir aktif medya oturumu bulunacaktır. Video ve müzik motorları birbirleriyle yarışmayacaktır.

## 3. Başarı ölçütleri

İlk genel sürüm aşağıdakilerin tamamı sağlandığında tamamlanmış sayılır:

- Kullanıcı tek En ID ile giriş yapar.
- Ana sayfa üç dünyadan kişiselleştirilmiş içerik gösterebilir.
- Maxen, Tuben ve Voxen ekranları ortak kabuk içinde açılır.
- Tek birleşik arama film/dizi, video ve müzik sonuçlarını sekmelerle sunar.
- Tek kütüphane favori, geçmiş, oynatma listesi ve indirmeleri türüne göre gösterebilir.
- Bir dünyada başlayan medya, diğer dünyaya geçilse bile doğru mini player ile devam eder.
- Yeni medya başlatıldığında önceki medya güvenli şekilde durur ve kaynakları serbest bırakır.
- Mobilde arka plan oynatma ve uygun içerikte PiP çalışır.
- Kullanıcı verileri başka kullanıcı tarafından okunamaz veya yazılamaz.
- Kritik Firestore kuralları Emulator testlerinden geçer.
- Android, iOS ve web typecheck/build aşamaları başarılıdır.
- Android TV hedefi D-pad ile erişilebilir ve odak kaybetmeden kullanılabilir.

## 4. Hedef depo yapısı

İlk aşamada tek Expo uygulaması içinde paket sınırları uygulanacaktır. Workspace monorepo dönüşümü ancak tüm modüller çalıştıktan sonra yapılmalıdır.

```text
enverse/
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
├── IMPLEMENTATION_PLAN.md
├── DECISIONS.md
├── MIGRATION_STATUS.md
├── assets/
├── firebase/
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   ├── database.rules.json
│   └── tests/
├── scripts/
│   ├── audit-secrets.mjs
│   ├── validate-env.mjs
│   └── verify-migration.mjs
└── src/
    ├── app/
    │   ├── AppProviders.tsx
    │   ├── RootNavigator.tsx
    │   ├── linking.ts
    │   └── bootstrap.ts
    ├── core/
    │   ├── auth/
    │   ├── config/
    │   ├── errors/
    │   ├── firebase/
    │   ├── media/
    │   ├── network/
    │   ├── storage/
    │   ├── telemetry/
    │   └── types/
    ├── design-system/
    │   ├── components/
    │   ├── tokens/
    │   ├── typography/
    │   └── accessibility/
    ├── features/
    │   ├── en-id/
    │   ├── home/
    │   ├── search/
    │   ├── library/
    │   ├── downloads/
    │   ├── social/
    │   ├── devices/
    │   └── settings/
    ├── worlds/
    │   ├── maxen/
    │   │   ├── api/
    │   │   ├── components/
    │   │   ├── navigation/
    │   │   ├── screens/
    │   │   ├── state/
    │   │   └── index.ts
    │   ├── tuben/
    │   └── voxen/
    └── platform/
        ├── mobile/
        ├── web/
        └── tv/
```

Her dünya yalnızca kendi `index.ts` dosyası üzerinden dışa açılmalıdır. Bir dünya başka bir dünyanın iç dosyasını import etmemelidir. Dünyalar arası iletişim `core` sözleşmeleriyle yapılmalıdır.

## 5. Uygulama sağlayıcı sırası

`AppProviders.tsx` sağlayıcıları aşağıdaki sırada kurmalıdır:

```text
ErrorBoundary
└── SafeAreaProvider
    └── QueryClientProvider
        └── EnverseThemeProvider
            └── AuthProvider
                └── NetworkProvider
                    └── MediaSessionProvider
                        └── NavigationContainer
```

Bootstrap sırasında:

1. Environment değişkenlerini doğrula.
2. Firebase'i yalnızca bir kez başlat.
3. Yerel depolama şemasını migrate et.
4. Auth durumunu çöz.
5. Aktif profili yükle.
6. Ağ durumunu başlat.
7. Bekleyen offline işlemleri senkronize et.
8. Uygulamayı aç.

Bootstrap 8 saniyeyi aşarsa kullanıcıya sonsuz spinner yerine yeniden deneme ekranı gösterilmelidir.

## 6. Navigasyon sözleşmesi

Ana sekmeler:

```text
Home | Maxen | Tuben | Voxen | Library
```

Root stack rotaları:

```ts
type RootStackParamList = {
  MainTabs: undefined;
  GlobalSearch: { initialQuery?: string } | undefined;
  Player: { mediaId: string; mediaType: MediaType; world: WorldId };
  Profile: { userId: string };
  Settings: undefined;
  Downloads: undefined;
  DeviceConnect: undefined;
};
```

Her dünya kendi nested navigator'ına sahip olabilir fakat root player açma davranışı ortak olmalıdır. Deep link şeması:

```text
enverse://maxen/movie/:id
enverse://maxen/show/:id
enverse://tuben/video/:id
enverse://tuben/short/:id
enverse://voxen/track/:id
enverse://voxen/album/:id
enverse://party/:code
enverse://device/connect/:token
```

Android geri tuşu sırası:

1. Açık modal/sheet kapanır.
2. Full player mini player'a iner.
3. Nested navigator geri gider.
4. Ana dünya ekranındaysa Home'a döner.
5. Home'daysa sistem geri davranışı uygulanır.

## 7. Tasarım sistemi

Mevcut `src/theme.ts` başlangıç noktasıdır; Faz 1'de tokenlara ayrılacaktır.

Zorunlu temel renkler:

```ts
background = '#07070A'
surface = '#111116'
elevated = '#191920'
text = '#F8F8FA'
muted = '#9A9AA6'
enverse = '#7C5CFC'
maxen = '#FF3D4D'
tuben = '#3B82F6'
voxen = '#A855F7'
```

Kurallar:

- Renkler bileşen dosyalarında dağınık literal olarak kullanılmamalıdır.
- Dokunma hedefi minimum `44x44` olmalıdır.
- Metin kontrastı WCAG AA hedeflemelidir.
- Dinamik font boyutunda düzen kırılmamalıdır.
- TV odak durumu yalnızca renk değişimiyle değil scale/border ile de görünmelidir.
- Reduce Motion ayarı desteklenmelidir.
- Telefon alt navigasyonu, tablette navigation rail, TV/web geniş ekranda sidebar kullanılmalıdır.
- Maxen/Tuben/Voxen kişiliklerini korur fakat spacing, radius, tipografi ve erişilebilirlik ortak kalır.

## 8. Ortak domain modeli

```ts
type WorldId = 'maxen' | 'tuben' | 'voxen';

type MediaType =
  | 'movie'
  | 'episode'
  | 'video'
  | 'short'
  | 'track'
  | 'podcastEpisode';

type MediaRef = {
  id: string;
  sourceId: string;
  world: WorldId;
  type: MediaType;
  title: string;
  subtitle?: string;
  artworkUrl?: string;
  durationMs?: number;
};

type PlaybackProgress = {
  media: MediaRef;
  positionMs: number;
  durationMs: number;
  completed: boolean;
  updatedAt: number;
  deviceId: string;
};
```

Kaynak dünyaların modelleri bu modele adapter ile çevrilmelidir. Ortak model, kaynak API'nin bütün ayrıntılarını taşımaya zorlanmamalıdır.

## 9. Tek medya oturumu mimarisi

`MediaSessionCoordinator` aşağıdaki tek otorite olacaktır:

```ts
interface MediaSessionCoordinator {
  play(request: PlayRequest): Promise<void>;
  pause(): Promise<void>;
  seek(positionMs: number): Promise<void>;
  stop(reason: StopReason): Promise<void>;
  handoff(targetDeviceId: string): Promise<void>;
  getSnapshot(): MediaSessionSnapshot;
  subscribe(listener: (state: MediaSessionSnapshot) => void): () => void;
}
```

Motor adaptörleri:

- `MaxenVideoAdapter`: HLS, MP4 ve Maxen video özellikleri.
- `TubenVideoAdapter`: DASH/muxed video, SponsorBlock, Shorts.
- `VoxenAudioAdapter`: ses, kuyruk, lyrics ve background playback.

Koordinatör kuralları:

1. Yeni `play` gelince aktif motor farklıysa eski motor `stop('source-switch')` çağrısıyla kapatılır.
2. Aynı medya tekrar açılırsa mümkünse mevcut oturum devam eder.
3. Uygulama arka plana geçtiğinde yalnızca izin verilen ses/video oturumu sürer.
4. Mini player aktif medya tipine göre video veya müzik görünümü kullanır.
5. Player UI doğrudan motor store'una değil koordinatör sözleşmesine bağlanır.
6. Oynatma pozisyonu en fazla 15 saniyede bir ve pause/background/exit anlarında kalıcılaştırılır.

## 10. En ID ve profil sistemi

Tek Firebase Auth kullanıcısı bütün dünyalarda aynı `uid` ile temsil edilir.

Firestore önerilen yapı:

```text
users/{uid}
users/{uid}/profiles/{profileId}
users/{uid}/settings/global
users/{uid}/library/{entryId}
users/{uid}/history/{entryId}
users/{uid}/downloads/{entryId}
users/{uid}/devices/{deviceId}
publicProfiles/{uid}
usernames/{normalizedUsername}
```

`users/{uid}` özel veridir. `publicProfiles/{uid}` sadece açık profil alanlarını içerir. E-posta, doğum tarihi, cihaz tokenı ve özel tercihler public profile'a yazılmamalıdır.

Kullanıcı adı:

- Trim edilir ve locale bağımsız küçük harfe çevrilir.
- `^[a-z0-9_]{3,24}$` formatında olmalıdır.
- Rezervasyon ve profil güncellemesi transaction veya güvenilir backend fonksiyonuyla atomik yapılmalıdır.
- Client tek başına iki dokümanı güvenli benzersizlik garantisiyle yönetiyor varsayılmamalıdır.

Profil ayrımı:

- En ID hesap seviyesidir.
- Aile profilleri `profiles` alt koleksiyonundadır.
- Geçmiş ve öneriler `profileId` ile namespace edilmelidir.
- Çocuk profilinde sosyal özellikler ve yetişkin içerik varsayılan kapalıdır.

## 11. Birleşik kütüphane

Tek koleksiyon şeması:

```ts
type LibraryEntry = {
  id: string;
  profileId: string;
  media: MediaRef;
  bucket: 'favorite' | 'watchLater' | 'playlist' | 'download';
  sourcePlaylistId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
```

Entry ID deterministik olmalıdır: `${profileId}_${world}_${type}_${sourceId}`. Böylece aynı öğenin tekrar tekrar yazılması engellenir.

Kütüphane ekranı filtreleri:

- Tümü
- Film ve diziler
- Videolar
- Müzik ve podcast
- İndirilenler
- Oynatma listeleri

Offline-first davranış: kullanıcı aksiyonu önce yerel store'a uygulanır, sync kuyruğuna eklenir, bağlantı gelince Firestore'a yazılır. Başarısız senkronizasyon kullanıcı verisini sessizce silmemelidir.

## 12. Birleşik arama

Arama servis sözleşmesi:

```ts
interface SearchProvider {
  world: WorldId;
  search(query: string, signal: AbortSignal): Promise<SearchSection[]>;
  suggest(query: string, signal: AbortSignal): Promise<SearchSuggestion[]>;
}
```

Davranış:

- 2 karakterden önce ağ isteği atılmaz.
- Yazma için 300 ms debounce uygulanır.
- Önceki istek yeni sorguda abort edilir.
- Sonuçlar `Tümü`, `Maxen`, `Tuben`, `Voxen` sekmelerinde gösterilir.
- Bir provider çökerse diğer sonuçlar gösterilmeye devam eder.
- Son sorgular yalnızca cihazda tutulur; kullanıcı açıkça izin vermedikçe telemetriye ham sorgu gönderilmez.

## 13. Sosyal sistem ve odalar

Ortak sosyal grafik kullanılmalıdır; Maxen ve Voxen ayrı arkadaş listeleri üretmemelidir.

```text
publicProfiles/{uid}
relationships/{relationshipId}
users/{uid}/notifications/{notificationId}
rooms/{roomId}
rooms/{roomId}/members/{uid}
rooms/{roomId}/messages/{messageId}
```

Oda türü `watch` veya `listen` olabilir. Oda dokümanında host, aktif medya, pozisyon, durum, sequence number ve son güncelleme bulunur.

Güvenlik:

- Yalnızca oda üyeleri odayı okuyabilir.
- Yalnızca host oynatma state'ini değiştirebilir; host transferi kontrollü yapılır.
- Mesaj yazan UID, `request.auth.uid` ile aynı olmalıdır.
- Oda kodu doğrudan doküman ID'si ve yetkilendirme anahtarı olmamalıdır.
- Rate limit ve kötüye kullanım koruması güvenilir backend tarafında uygulanmalıdır.
- Oda kapanınca presence ve geçici tokenlar temizlenmelidir.

## 14. Cihaz bağlantısı ve TV

TV eşleştirme akışı:

1. TV backend'den süreli pairing session ister.
2. TV QR ve 6 karakterlik kullanıcı kodu gösterir.
3. Mobil kullanıcı En ID ile oturum açmış şekilde kodu doğrular.
4. Backend tek kullanımlık session'ı tüketir ve cihazı hesaba bağlar.
5. TV kısa ömürlü custom token veya cihaz kimliği alır.
6. Pairing session silinir/expire olur.

Firestore'da `allow read, write: if true` kullanılmayacaktır. TV komutları imzalı/sahip kontrollü olmalı; komutlarda `createdAt`, `expiresAt`, `nonce`, `senderDeviceId` bulunmalıdır. Aynı nonce ikinci kez çalıştırılmamalıdır.

TV için kabul kriterleri:

- Her etkileşimli öğe D-pad ile erişilebilir.
- Odak görünürdür ve ekran değişiminde kaybolmaz.
- Back tuşu beklenen hiyerarşiyi izler.
- Telefon ile yazı gönderme yalnızca eşleşmiş cihazlarda çalışır.
- Eski/başka kullanıcıya ait komut çalıştırılmaz.

## 15. Firebase güvenlik şartları

Kurallar varsayılan kapalı olmalıdır:

```text
match /{document=**} {
  allow read, write: if false;
}
```

Zorunlu test kategorileri:

- Oturumsuz kullanıcı özel veriyi okuyamaz/yazamaz.
- A kullanıcısı B kullanıcısının özel verisini okuyamaz/yazamaz.
- Kullanıcı kendi profilinde immutable UID/createdAt alanını değiştiremez.
- Public profile yalnızca izin verilen alanları kabul eder.
- Username başka UID tarafından devralınamaz.
- Oda dışındaki kullanıcı oda/mesajları okuyamaz.
- Oda üyesi başka UID adına mesaj yazamaz.
- Host olmayan kişi playback state değiştiremez.
- Süresi geçmiş TV session okunamaz/güncellenemez.
- Bildirim gönderen, hedef kullanıcı belgesine keyfi alan yazamaz.
- Liste/mesaj alanlarında tip ve maksimum boyut kontrolleri vardır.

Maxen kaynak kuralındaki aşağıdaki yaklaşımlar taşınmayacaktır:

- Kullanıcı belgelerinde `allow write: if ... || isSignedIn()`
- `tv_sessions` için herkese açık tam erişim
- `tv_devices` için herkese açık tam erişim
- Watch party için herkese açık update
- Direct conversation içeriğini bütün oturum açmış kullanıcılara açmak

## 16. Environment ve gizli bilgi yönetimi

`.env.example` aşağıdaki anahtarları sadece boş örnek olarak içermelidir:

```text
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_API_BASE_URL=
```

Kurallar:

- `.env.local` commit edilmez.
- API anahtarları domain/app restriction ile sınırlandırılır.
- Firebase App Check etkinleştirilir.
- TMDB gibi servis sırları istemciye konmaz; backend proxy kullanılır.
- OAuth client secret mobil istemci içinde bulunmaz.
- Repo genelinde secret scan CI aşamasında çalışır.
- Mevcut kaynaklardaki anahtarlar yeni projeye kopyalanmaz; gerekirse rotate edilir.

## 17. Migrasyon sırası

### Faz 0 — Çalışma ortamı ve baz doğrulama

Amaç: Enverse kabuğunu güvenilir biçimde çalıştırmak.

Görevler:

- Node LTS ve npm erişimini doğrula.
- `npm install` çalıştır ve lockfile üret.
- Expo dependency uyumluluğunu `npx expo install --check` ile doğrula.
- `npm run typecheck` çalıştır.
- Android, iOS ve web başlangıç ekranını aç.
- ESLint, Prettier ve Jest yapılandır.
- CI workflow ekle: install, typecheck, lint, test, secret scan.
- `DECISIONS.md` ve `MIGRATION_STATUS.md` oluştur.

Kabul kriteri: Temiz checkout'ta tek komutla kurulum ve üç platform için en azından build/config doğrulaması.

### Faz 1 — Uygulama kabuğu ve tasarım sistemi

Amaç: Prototipi üretim mimarisine taşımak.

Görevler:

- `useState` tab geçişini React Navigation 7 ile değiştir.
- `AppProviders`, `RootNavigator` ve linking config oluştur.
- Design-system tokenlarını ve ortak bileşenleri çıkar.
- Telefon/tablet/web/TV navigation varyantlarını oluştur.
- Error boundary, empty state, retry state ve skeleton bileşenleri ekle.
- Light theme şimdilik zorunlu değildir; tema sözleşmesi ileride eklemeye uygun olmalıdır.

Kabul kriteri: Bütün ana rotalar deep link ile açılır; geri davranışı ve erişilebilirlik testleri geçer.

### Faz 2 — En ID, güvenli Firebase ve veri migrasyon altyapısı

Amaç: Tek hesap ve güvenli veri sınırı.

Görevler:

- Ortak Firebase init modülü.
- Auth provider: email/password, anonymous upgrade ve password reset.
- Profil seçimi ve username rezervasyonu.
- Yeni Firestore kuralları ve emulator testleri.
- Kaynak kullanıcı verileri için idempotent migrasyon komutları.
- Her migrasyonda `migrationVersion` ve checkpoint tutulması.
- Çift yazma gerekiyorsa süreli feature flag altında yapılması.

Kabul kriteri: İki test kullanıcısı arasında veri izolasyonu kanıtlanır; migrasyon tekrar çalıştırıldığında duplicate üretmez.

### Faz 3 — Voxen migrasyonu

Voxen ilk seçilmiştir çünkü Expo 57 ile uyumlu ve test fazla kapsamlıdır.

Taşınacak ana alanlar:

- `src/services/youtubeService.ts`
- `src/store/musicStore.ts`
- `src/components/AudioEngine.tsx`
- `src/components/MiniPlayer.tsx`
- `src/components/FullPlayerModal.tsx`
- `src/views/HomeView.tsx`
- `src/views/SearchView.tsx`
- `src/views/LibraryView.tsx`
- Lyrics, queue, album, artist, podcast ve listening-room bileşenleri
- Gerekli Android playback service adaptörü

Yöntem:

1. Önce servisleri `worlds/voxen/api` içine adapter ile taşı.
2. Voxen store'unu ortak MediaSessionCoordinator'a bağla.
3. Ekranları design-system tokenlarına geçir.
4. Auth ve library yazımlarını ortak repository'lere yönlendir.
5. Listening room'u ortak room modeline adapte et.
6. Eski uygulamayla özellik karşılaştırma checklist'i çalıştır.

Kabul kriteri: Arama, oynatma, background audio, kuyruk, lyrics, favori, playlist ve listening room çalışır; başka dünyaya geçerken audio beklenen şekilde sürer.

### Faz 4 — Tuben migrasyonu

Taşınacak ana alanlar:

- `src/services/youtubeService.ts`
- `src/services/sponsorBlockService.ts`
- Player, MiniPlayer ve Shorts player
- Home, Trending, Search, Channel, Library, History, Subscriptions
- Download manager
- YouTube auth/sync yalnızca politika ve güvenlik incelemesinden sonra

Yöntem:

1. Voxen ile ortak YouTube istek/parsing kodunu tespit et fakat davranış eşitliği kanıtlanmadan birleştirme.
2. Tuben video motorunu koordinatör adaptörü yap.
3. Shorts'u normal root navigation üstünde tam ekran rota yap.
4. SponsorBlock ayarlarını Enverse settings altında dünya ayarı olarak sakla.
5. İndirmeleri ortak DownloadManager arayüzüne taşı.

Kabul kriteri: Video, Shorts, kalite/hız, PiP, SponsorBlock, geçmiş ve indirme çalışır; Voxen sesi video başlayınca güvenli şekilde kapanır.

### Faz 5 — Maxen mobil/web migrasyonu

Maxen büyük dosyalar doğrudan taşınmayacak, önce parçalanacaktır.

Öncelikli parçalama:

- `VideoPlayerView.tsx`: playback shell, controls, subtitles, episode actions, x-ray, watch party ve telemetry.
- `SocialView.tsx`: friends, requests, presence, invitations ve direct messages.
- `MediaHubView.tsx`: bölümler ve veri hook'ları.
- `ActorDetailView.tsx`: header, credits ve filmography.

Taşınacak işlevler:

- Home ve discovery
- Film/dizi detayları
- TMDB proxy istemcisi
- Reels fragman akışı
- Maxen video player
- Continue watching
- Watch party
- Profil ve aile profilleri
- Cross-device handoff

Kabul kriteri: Film/dizi keşfi, detay, oynatma, altyazı, bölüm geçişi, watch party ve kaldığın yerden devam mobil/web üzerinde çalışır.

### Faz 6 — Android TV adaptörü

Amaç: Mobil dependency ağacını bozmadan TV deneyimini üretmek.

Görevler:

- `platform/tv` içinde focus primitives.
- TV sidebar ve 10-foot layout.
- `react-native-tvos` için ayrı build stratejisi/config plugin.
- Leanback banner ve manifest özellikleri.
- QR pairing ve virtual remote.
- TV smoke test senaryoları.

Kabul kriteri: Android TV release build alınır; kritik kullanıcı yolculukları yalnızca D-pad ile tamamlanır.

### Faz 7 — Birleşik deneyimler

- Birleşik arama.
- Ortak kütüphane.
- Dünyalar arası öneri kartları.
- Tek sosyal grafik.
- Ortak Party altyapısı.
- Cihazlar arası handoff.
- Enverse ana sayfa kişiselleştirmesi.

Kabul kriteri: Üç dünya yalnızca aynı uygulamada duran sekmeler değil, kontrollü biçimde veri ve kullanıcı yolculuğu paylaşan tek ürün gibi çalışır.

### Faz 8 — Sertleştirme ve yayın

- Crash reporting ve performans ölçümü.
- Network retry/backoff ve offline edge case'leri.
- Büyük liste performans profili.
- Memory leak ve medya kaynak temizliği.
- Accessibility audit.
- Privacy policy, data deletion ve izin açıklamaları.
- Store metadata, ikon, splash ve ekran görüntüleri.
- Internal testing, closed beta, staged rollout.

Kabul kriteri: P0/P1 hata yok; crash-free session hedefi en az `%99.5`; cold start ve player start ölçümleri kayıtlıdır.

## 18. Test stratejisi

### Unit test

- Domain adapterları
- Store reducer/action davranışları
- MediaSessionCoordinator geçişleri
- URL/deep link parser
- Username normalization
- Library deterministic ID
- Playback progress throttling

### Integration test

- Auth → profil → home
- Arama → sonuç → player
- Voxen audio → Tuben video geçişi
- Tuben video → Maxen video geçişi
- Offline favorite → online sync
- İndirme pause/resume/failure
- Room join/leave/host transfer
- Device pairing/expiry/replay prevention

### Firebase Emulator test

Bu belgenin 15. bölümündeki bütün negatif ve pozitif senaryolar.

### E2E kritik yolculuklar

1. Yeni kullanıcı kayıt olur, profil oluşturur, içerik oynatır ve favoriler.
2. Kullanıcı Voxen'de müzik dinlerken Tuben videosu açar.
3. Kullanıcı Maxen içeriğini telefondan TV'ye gönderir.
4. Kullanıcı offline iken favoriler, sonra bağlantıda senkronize eder.
5. İki kullanıcı odaya katılır ve senkron playback yapar.

## 19. Performans bütçeleri

- Ana thread uzun görevleri ölçülmeli; 100 ms üzeri bloklar hata bütçesine yazılmalıdır.
- Uzun listeler FlashList veya ölçülmüş eşdeğer sanallaştırma kullanmalıdır.
- Görseller cihaz boyutuna uygun istenmeli ve cache edilmelidir.
- Ana sayfa ilk görünüm için bütün dünyaların tüm verisini beklememelidir.
- Her dünya lazy-load edilmelidir.
- Arka plandaki player dışındaki ağır ekran subscriptionları durdurulmalıdır.
- Firestore listenerları ekran kapanınca unsubscribe edilmelidir.
- Aynı içerik isteği TanStack Query ile deduplicate edilmelidir.

## 20. Hata ve gözlemlenebilirlik

Standart hata modeli:

```ts
type AppError = {
  code: string;
  message: string;
  world?: WorldId;
  operation: string;
  retryable: boolean;
  cause?: unknown;
};
```

Loglarda e-posta, token, arama sorgusu, mesaj içeriği veya tam medya URL'si tutulmamalıdır. Telemetri eventleri versionlanmalı ve `world`, `platform`, `appVersion` ortak alanlarını içermelidir.

Zorunlu metrikler:

- App cold/warm start
- Auth resolution
- Home first content
- Search success/failure/latency
- Player start time ve playback error
- Buffer ratio
- Download success/failure
- Room sync drift
- Handoff success/failure

## 21. Veri migrasyonu

Kaynak uygulama verisi asla doğrudan silinmemelidir.

Her migrasyon:

1. Kaynak şema sürümünü tespit eder.
2. Veriyi salt okunur biçimde alır.
3. Ortak modele dönüştürür.
4. Deterministik ID ile upsert eder.
5. Sayım ve checksum doğrular.
6. Checkpoint yazar.
7. Başarılı olduğunda kullanıcıya sonuç gösterir.

`MIGRATION_STATUS.md` tablosu:

```text
| Alan | Kaynak | Hedef | Durum | Test | Not |
```

Durum değerleri yalnızca `not-started`, `in-progress`, `blocked`, `verified` olabilir.

## 22. Çalışma disiplini

Başka agent aşağıdaki sırayı izlemelidir:

1. İlgili kaynak kodu okumadan yeniden yazmamalı.
2. Her faz başında `MIGRATION_STATUS.md` güncellemeli.
3. Küçük, geri alınabilir değişiklikler yapmalı.
4. Her değişiklikten sonra typecheck ve ilgili testleri çalıştırmalı.
5. Kullanıcının mevcut kaynak projelerindeki dosyaları silmemeli.
6. Güvenlik kurallarını gerçek projeye deploy etmeden önce Emulator'da test etmeli.
7. Derleme hatasını `skip`, `any`, `@ts-ignore` veya testi silerek gizlememeli.
8. Üretim anahtarı, sertifika veya secret commit etmemeli.
9. Bir fazın kabul kriteri tamamlanmadan sonraki fazı “tamamlandı” işaretlememeli.
10. Her teknik sapmayı `DECISIONS.md` içine tarih, bağlam, karar ve sonuç formatıyla yazmalı.

## 23. İlk agent görevi — doğrudan uygulanacak talimat

Aşağıdaki metin yeni agente görev olarak verilebilir:

> `/home/ahmet/Projeler/enverse/IMPLEMENTATION_PLAN.md` dosyasını eksiksiz oku ve bu belgeyi bağlayıcı teknik şartname kabul et. Önce Faz 0 ve Faz 1'i tamamla. Mevcut `/home/ahmet/Projeler/enverse` prototipini koruyarak üretim mimarisine dönüştür. Kaynak Maxen, Tuben ve Voxen projelerinde değişiklik yapma. Node/Expo ortamını doğrula; bağımlılıkları kur; lockfile, lint, format, test ve CI yapılandırmasını ekle. React Navigation tabanlı root/nested navigasyonu, AppProviders yapısını, design-system tokenlarını, responsive telefon/tablet/web navigasyonunu, hata/boş/yükleniyor durumlarını ve deep linking'i uygula. `DECISIONS.md` ile `MIGRATION_STATUS.md` oluştur. Typecheck, lint ve testleri çalıştır; sonuçları kaydet. Faz 0 ve Faz 1 kabul kriterleri gerçekten sağlanmadan tamamlandı deme. Firestore deploy etme ve kaynak projelerde veri değiştirme.

## 24. Tamamlanma tanımı

Bir görev yalnızca şu koşullarda tamamlanmış sayılır:

- Kod yazılmıştır.
- Typecheck temizdir.
- İlgili unit/integration testleri geçmiştir.
- En az hedef platformlarda smoke test yapılmıştır.
- Güvenlik etkisi değerlendirilmiştir.
- README veya ilgili teknik doküman güncellenmiştir.
- `MIGRATION_STATUS.md` güncellenmiştir.
- Bilinen eksik varsa açıkça `blocked` veya `not-started` olarak yazılmıştır.

Bu projenin hedefi üç uygulamayı aynı paket içine sıkıştırmak değil; üç güçlü ürün dünyasını tek, güvenli, sürdürülebilir ve tutarlı bir kullanıcı evreninde birleştirmektir.

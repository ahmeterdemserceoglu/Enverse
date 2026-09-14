# Enverse — Güncel Devir ve Devam Planı

> **DURUM: GEÇERSİZ / ARŞİV.** Güncel ürün modeli ve devam işleri `LAUNCHER_IMPLEMENTATION_PLAN.md` dosyasındadır.

> Tarih: 2026-09-13. Bu belge, ilk uygulama çalışmasının gerçek durumunu kaydeder. Yeni agent önce `IMPLEMENTATION_PLAN.md` dosyasının tamamını, sonra bu dosyayı okumalıdır. Çelişki halinde ürün/mimari hedeflerde `IMPLEMENTATION_PLAN.md`; mevcut kod ve sıradaki somut işlerde bu dosya esas alınır.

## 1. Şu anda çalışan durum

Proje dizini:

```text
/home/ahmet/Projeler/enverse
```

Tamamlanan altyapı:

- Expo SDK 57.0.22, React 19.2.3, React Native 0.86.3.
- pnpm lockfile oluşturuldu.
- Expo dependency check temiz.
- React Navigation 7 root stack ve ana tab navigasyonu.
- Typed route parametreleri.
- `enverse://` deep link yapılandırması.
- Telefon için bottom tabs; 960 px ve üzerinde sol sidebar.
- Maxen, Tuben ve Voxen dünya ekranları.
- Birleşik Enverse ana sayfa prototipi.
- Ortak kütüphane placeholder ekranı.
- Global Search, Settings, Downloads, Device Connect, Player ve Profile root rotaları.
- QueryClient, SafeArea ve ErrorBoundary provider katmanı.
- Ortak loading/empty/error feedback bileşeni.
- Tek aktif oynatıcıyı yönetecek `MediaSessionCoordinator` çekirdeği.
- Lint, TypeScript ve Jest altyapısı.
- GitHub Actions kalite workflow'u.
- Desktop web görsel smoke test.
- Üretim web export'u.

Son doğrulama sonuçları:

```text
Expo dependencies: up to date
Jest: 1 suite, 5 tests passed
TypeScript: passed
ESLint: passed
Web export: passed
```

## 2. Önemli dosyalar

```text
App.tsx
src/app/AppProviders.tsx
src/app/RootNavigator.tsx
src/app/linking.ts
src/app/navigationTypes.ts
src/core/errors/AppErrorBoundary.tsx
src/core/media/MediaSessionCoordinator.ts
src/core/media/types.ts
src/core/media/__tests__/MediaSessionCoordinator.test.ts
src/design-system/FeedbackState.tsx
src/screens/HomeScreen.tsx
src/screens/WorldScreen.tsx
src/theme.ts
IMPLEMENTATION_PLAN.md
DECISIONS.md
MIGRATION_STATUS.md
```

## 3. Çalışma ortamı

Shell ortamında `node` varsayılan PATH üzerinde bulunmayabilir. Codex bundled runtime kullanıldı:

```bash
NODE_BIN=/home/ahmet/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin
FALLBACK_BIN=/home/ahmet/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback
PATH="$NODE_BIN:$FALLBACK_BIN:$PATH"
```

Kurulum:

```bash
pnpm install
```

Codex masaüstü pnpm wrapper'ı `@parcel/watcher` build scriptini onaylanmadığı için kurulum sonunda `ERR_PNPM_IGNORED_BUILDS` gösterebilir. Paketler kurulmuş ve uygulama export edilmiştir. Build scriptini körlemesine onaylama. Önce paketin provenance ve gerekliliğini incele. Doğrulama komutları gerekirse doğrudan binary üzerinden çalıştırılabilir:

```bash
"$NODE_BIN/node" node_modules/typescript/bin/tsc --noEmit
"$NODE_BIN/node" node_modules/eslint/bin/eslint.js . --ext .ts,.tsx
"$NODE_BIN/node" node_modules/jest/bin/jest.js --runInBand
"$NODE_BIN/node" node_modules/expo/bin/cli install --check
"$NODE_BIN/node" node_modules/expo/bin/cli export --platform web --output-dir dist
```

## 4. Görsel olarak doğrulanan davranış

Desktop web görünümünde:

- Sol sidebar görünür.
- Home, Maxen, Tuben, Voxen ve Kütüphane tabları erişilebilir tab rollerine sahiptir.
- Ana başlık, üç dünya kartı ve kişisel feed düzgün render olur.
- Maxen tabına geçiş URL'yi `/maxen` yapar ve doğru dünya ekranını açar.
- Marka renkleri ve hiyerarşi beklenen düzeydedir.

Mobil viewport görsel testi henüz yapılmadı. Sonraki agent bunu 390x844 ve 768x1024 viewportlarda yapmalıdır.

## 5. Bilinen eksikler

- Ana ekran verileri hâlâ statik örnek içeriktir.
- Dünya ekranları gerçek kaynak uygulamalara bağlı değildir.
- En ID/Auth uygulanmadı.
- Firebase Enverse projesi ve güvenli kurallar uygulanmadı.
- MediaSessionCoordinator gerçek motor adaptörlerine bağlanmadı.
- NetworkProvider ve MediaSessionProvider henüz AppProviders zincirinde yok.
- Tasarım tokenları hâlâ tek `src/theme.ts` dosyasında; hedef klasörlere tam ayrılmadı.
- Tablet navigation rail ayrı tasarım değildir; 960 px altında bottom tabs kullanılır.
- TV build/adaptör uygulanmadı.
- Native Android/iOS build alınmadı.
- Uygulama ikonları ve splash tasarlanmadı.
- Otomatik component/E2E testleri yok.
- `src/components/BottomNav.tsx` eski prototipten kalmıştır ve artık import edilmez. Silmeden önce `rg BottomNav` ile kullanım olmadığını doğrula.

## 6. Sıradaki çalışma sırası

### Adım A — Faz 1'i tam kapat

1. `src/theme.ts` içeriğini `src/design-system/tokens` altına ayır.
2. Ortak `Button`, `IconButton`, `Card`, `Screen`, `Text`, `Skeleton` bileşenlerini ekle.
3. WorldCard ve ekranları yalnızca design-system bileşenlerine geçir.
4. 600–959 px aralığında tablet navigation rail uygula.
5. TV odak primitive'lerini henüz ekleme; sadece navigation arayüzünü platform adaptörüne hazırla.
6. 390x844, 768x1024 ve 1440x900 görsel smoke test yap.
7. Home → üç dünya → Library geçişlerini test et.
8. Kullanılmayan eski BottomNav bileşenini doğruladıktan sonra kaldır.

Faz 1 kabul kriteri:

- Typecheck, lint, test ve web export temiz.
- Üç viewportta overflow veya kesilmiş ana aksiyon yok.
- Klavye ile tab navigasyonu yapılabiliyor.
- Ekran okuyucu isimleri anlamlı.
- `MIGRATION_STATUS.md` içindeki Design tokens satırı `verified`.

### Adım B — Faz 2 öncesi Firebase güvenlik tasarımı

Firebase skill/yönergeleri okunmadan uygulamaya başlama.

1. `firebase/firestore.rules` için default-deny iskeleti oluştur.
2. Firestore Emulator test ortamını kur.
3. `users`, `profiles`, `publicProfiles`, `usernames` için pozitif ve negatif testler yaz.
4. Username atomik rezervasyonu için istemci transaction ile güvenilir backend seçeneklerini karşılaştır; kararı ADR olarak yaz.
5. Firebase client config'i `.env.example` alanlarından yükle.
6. Environment eksikse üretimde fail-fast, geliştirmede açık hata ekranı göster.
7. Kaynak projelerdeki gömülü anahtarları Enverse'e kopyalama.

Bu adımda gerçek Firebase projesine deploy yapılmayacaktır.

### Adım C — En ID

1. `src/core/auth` altında AuthProvider ve repository sözleşmesi.
2. Email/password kayıt ve giriş.
3. Anonymous session → kalıcı hesap upgrade.
4. Password reset.
5. AuthGate ve bootstrap loading/error durumları.
6. Profil oluşturma/seçme.
7. Username normalization ve rezervasyon.
8. İki kullanıcı arasında veri izolasyon testi.

Auth tamamlanmadan Voxen cloud state taşınmamalıdır.

### Adım D — MediaSessionProvider

1. Coordinator snapshot'ını React `useSyncExternalStore` ile bağlayan hook yaz.
2. `MediaSessionProvider` oluştur ve AppProviders sırasına ekle.
3. App background/logout sırasında doğru `pause`/`stop` davranışı ekle.
4. Coordinator için şu ilave testleri yaz:
   - Adapter play hatası.
   - Aynı dünya içinde medya değişimi.
   - Stop hatası sonrası kuyruk devamlılığı.
   - Unregister edilmiş aktif adapter.
   - Listener unsubscribe.
5. Placeholder global player'ı snapshot gösterecek debug player ekranına bağla.

### Adım E — Voxen keşif migrasyonu

İlk olarak yalnızca read-only keşif akışını taşı:

1. Kaynak `/home/ahmet/Projeler/voxen/voxen-main/src/services/youtubeService.ts` dosyasını oku.
2. API erişimini `src/worlds/voxen/api` adapterlarına ayır.
3. Kaynak domain tiplerini ortak `MediaRef` modeline mapper ile çevir.
4. Voxen Home ve Search sorgularını TanStack Query hook'ları yap.
5. Mock/static ana ekran yerine gerçek Voxen bölümünü bağla.
6. AbortSignal, timeout, retry ve hata sınıflandırması ekle.
7. Kaynak Voxen dosyalarını değiştirme.

Bu aşamada player, auth, playlist veya cloud library taşıma. Önce keşif/veri sınırı doğrulansın.

## 7. İlk devam görevi için hazır prompt

> `/home/ahmet/Projeler/enverse/IMPLEMENTATION_PLAN.md` ve `/home/ahmet/Projeler/enverse/CONTINUATION_PLAN.md` dosyalarını eksiksiz oku. Mevcut kodu yeniden kurma veya kaynak Maxen/Tuben/Voxen projelerini değiştirme. Önce mevcut typecheck, lint, Jest ve Expo dependency check sonuçlarını yeniden doğrula. Ardından CONTINUATION_PLAN içindeki “Adım A — Faz 1'i tam kapat” görevlerinin tamamını uygula. Design-system token ve primitive bileşenlerini oluştur, mevcut ekranları bunlara geçir, tablet navigation rail ekle, üç hedef viewportta görsel smoke test yap, kullanılmayan BottomNav'ı kullanım olmadığını doğrulayarak kaldır. Her değişiklikten sonra testleri çalıştır. `MIGRATION_STATUS.md` ve gerekiyorsa `DECISIONS.md` dosyalarını güncelle. Faz 1 kabul kriterleri sağlanmadan Faz 2'ye başlama. Firebase'e deploy yapma.

## 8. Agentın kaçınması gereken hatalar

- Üç kaynak projenin `src` klasörlerini Enverse içine topluca kopyalamak.
- Üç bağımsız AuthProvider veya Firebase app başlatmak.
- Voxen ve Tuben playerlarını coordinator dışında aynı anda mount etmek.
- Maxen'in mevcut açık Firestore kurallarını taşımak.
- Expo 54 Maxen bağımlılıklarını Expo 57 ağacına topluca eklemek.
- `any`, `@ts-ignore` veya test silme ile migrasyon hatalarını saklamak.
- Gerçek API anahtarlarını `.env.example` veya kaynak dosyalara yazmak.
- Kaynak uygulamaları silmek veya yerinde refactor etmek.
- Emulator testi olmadan Firestore rules deploy etmek.

## 9. Devir anındaki kesin doğrulama özeti

```text
package install: completed; pnpm ignored-build warning documented
expo install --check: passed
jest: 5/5 passed
typescript: passed
eslint: passed
web export: passed
desktop web render: passed
desktop Maxen route transition: passed
mobile visual QA: pending
native build: pending
```

Devam eden agent, ilk komut olarak mevcut dosyaları ve `MIGRATION_STATUS.md` durumunu okumalı; tamamlanmış işi yeniden yazmamalıdır.

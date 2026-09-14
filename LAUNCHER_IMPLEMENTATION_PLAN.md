# Enverse Launcher — Bağlayıcı Uygulama Planı

> Bu belge kullanıcının kesinleştirdiği güncel ürün modelidir. `IMPLEMENTATION_PLAN.md` içindeki “üç uygulamayı tek kod tabanına migrate etme” yaklaşımı artık uygulanmayacaktır. Maxen, Tuben ve Voxen bağımsız Android uygulamaları olarak kalır. Enverse bunları açan, kurulu değillerse GitHub Releases üzerinden APK indirip Android sistem kurucusuna gönderen ana launcher uygulamasıdır.

## 1. Kesin ürün modeli

```text
Enverse (com.enverse.app)
├── Maxen → com.maxen.app
├── Tuben → com.tuben.app
└── Voxen → com.voxen.music
```

Kart davranışı:

1. Kullanıcı karta basar.
2. İlgili paket kuruluysa Enverse uygulamayı açar.
3. Paket kurulu değilse Enverse kurulum teklif eder.
4. Kullanıcı kabul ederse APK, tanımlı GitHub Release URL’sinden indirilir.
5. Android bilinmeyen kaynak izni yoksa Enverse kendi izin sayfasını açar.
6. Kullanıcı izni açıp döndüğünde karttan tekrar dener.
7. APK indirilir ve Android’in resmi sistem paket kurucusu açılır.
8. Kullanıcı Android’in “Kur” düğmesine basar.
9. Kurulum tamamlandıktan sonra kullanıcı Enverse’e döner ve karta basarak uygulamayı açar.

Android güvenliği nedeniyle sessiz/etkileşimsiz kurulum yapılmayacaktır. Root, device-owner veya kurumsal MDM varsayılmayacaktır.

## 2. GitHub Releases düzeni

Her uygulama kendi GitHub reposunda aynı isimli sabit APK asset’i yayımlamalıdır:

```text
maxen.apk
tuben.apk
voxen.apk
```

Önerilen sabit bağlantılar:

```text
https://github.com/OWNER/MAXEN_REPO/releases/latest/download/maxen.apk
https://github.com/OWNER/TUBEN_REPO/releases/latest/download/tuben.apk
https://github.com/OWNER/VOXEN_REPO/releases/latest/download/voxen.apk
```

Enverse `.env`:

```text
EXPO_PUBLIC_MAXEN_APK_URL=https://github.com/OWNER/MAXEN_REPO/releases/latest/download/maxen.apk
EXPO_PUBLIC_TUBEN_APK_URL=https://github.com/OWNER/TUBEN_REPO/releases/latest/download/tuben.apk
EXPO_PUBLIC_VOXEN_APK_URL=https://github.com/OWNER/VOXEN_REPO/releases/latest/download/voxen.apk
```

OWNER ve repo adları bilinmeden gerçek URL uydurulmayacaktır.

## 3. İmzalama zorunluluğu

- Her uygulamanın bütün sürümleri aynı Android signing key ile imzalanmalıdır.
- Maxen, Tuben ve Voxen farklı signing key kullanabilir; fakat kendi eski/yeni sürümleri arasında key değişmemelidir.
- Signing key GitHub reposuna veya Enverse kaynak koduna konmamalıdır.
- GitHub Actions kullanılırsa keystore base64 secret ve parolalar GitHub Actions Secrets içinde tutulmalıdır.
- Yanlış key ile yayımlanan APK mevcut kurulumu güncelleyemez; kullanıcı uygulamayı silmek zorunda kalır ve yerel veri kaybı yaşayabilir.

## 4. Mevcut kod durumu

Uygulanan dosyalar:

```text
src/core/launcher/apps.ts
src/core/launcher/apkUrl.ts
src/core/launcher/AppLauncherService.ts
src/core/launcher/useAppLauncher.ts
src/core/launcher/__tests__/apkUrl.test.ts
plugins/withLauncherQueries.js
```

Native yapılandırma:

- `REQUEST_INSTALL_PACKAGES` izni eklendi.
- Android 11+ package visibility için üç hedef paket `<queries>` listesine ekleniyor.
- `expo-intent-launcher`, `expo-file-system` ve `expo-device` kullanılıyor.
- APK URL’si HTTPS ve izin verilen GitHub hostlarından biri olmak zorunda.
- APK cache dizinine indirilip `content://` URI’ye çevriliyor.
- Android `ACTION_VIEW` ve `application/vnd.android.package-archive` ile sistem kurucusu açılıyor.

## 5. Tamamlanması gereken işler

### A. Gerçek GitHub bağlantıları

Kullanıcıdan yalnızca GitHub kullanıcı/organizasyon adı ve üç repo adı alın. `.env.local` oluşturup gerçek URL’leri ekle. `.env.local` commit edilmemeli.

### B. Android cihaz doğrulaması

Gerçek Android cihaz veya emülatörde development APK üret. Şunları doğrula:

1. Üç paket kurulu değilken kartlar kurulum teklif ediyor.
2. Bilinmeyen kaynak izni doğru Enverse ayar sayfasını açıyor.
3. İzin sonrası APK indiriliyor.
4. Yüzde ilerlemesi kartta gösteriliyor.
5. Sistem paket kurucusu doğru uygulama adıyla açılıyor.
6. Kurulumdan sonra karta basınca doğru uygulama açılıyor.
7. Hedef uygulamadan geri dönünce Enverse state’i bozulmuyor.

### C. İndirme sağlamlığı

- Aynı anda yalnızca bir APK indirmesine izin ver.
- Kartları download sırasında devre dışı bırak.
- İndirmeyi iptal et butonu ekle.
- Ağ kopmasında resumable download state’ini sakla.
- En az 300 MB boş alan kontrolü ekle.
- Eski cache APK’larını yeni indirmeden önce güvenli biçimde temizle.
- HTTP status ve beklenen minimum dosya boyutunu doğrula.

### D. Release manifest ve güncelleme

İkinci sürümde her repo veya ortak repo şu manifesti yayımlayabilir:

```json
{
  "schemaVersion": 1,
  "apps": {
    "maxen": { "versionCode": 24, "versionName": "10.6.6", "apkUrl": "...", "sha256": "..." },
    "tuben": { "versionCode": 2, "versionName": "1.0.1", "apkUrl": "...", "sha256": "..." },
    "voxen": { "versionCode": 2, "versionName": "1.0.1", "apkUrl": "...", "sha256": "..." }
  }
}
```

Manifest olmadan Enverse yalnızca “kurulu/kurulu değil” davranışı sunar. Otomatik yeni sürüm kontrolü için native package version sorgusu ve SHA-256 doğrulaması eklenmelidir.

### E. UI düzenlemesi

- “Senin evrenin” altındaki statik medya feed’i launcher modeline uygun değil; kaldır veya “Son açılanlar” bölümüne dönüştür.
- Her kart `Kurulu`, `Kurulu değil`, `Açılıyor`, `İndiriliyor %N`, `Kurulum bekleniyor` durumlarını göstermeli.
- Kurulu değilse kartın aksiyon metni “İndir ve kur” olmalı.
- İlk açılışta üç paketin durumu sorgulanmalı.
- Web/iOS’ta kartlar Android-only açıklaması göstermeli.

## 6. Güvenlik kabul kriterleri

- HTTP APK URL kabul edilmez.
- GitHub dışı domain kabul edilmez.
- Paket adları environment üzerinden değiştirilemez; kodda sabittir.
- İndirilen dosya yalnızca `.apk` hedef adına yazılır.
- Update aşamasında SHA-256 manifest doğrulaması olmadan “güncelleme var” gösterilmez.
- Android sistem kurucusu atlanmaz.
- Enverse accessibility service, root veya gizli install API kullanmaz.
- APK signing key kaynak kodda tutulmaz.

## 7. Yeni agente verilecek kısa prompt

> `/home/ahmet/Projeler/enverse/LAUNCHER_IMPLEMENTATION_PLAN.md` dosyasını eksiksiz oku ve bağlayıcı güncel ürün planı kabul et. Eski IMPLEMENTATION_PLAN içindeki tek kod tabanına migrasyon yaklaşımını uygulama. Enverse yalnızca `com.maxen.app`, `com.tuben.app` ve `com.voxen.music` paketlerini açan; kurulu değilse GitHub Releases APK’sını indirip Android sistem kurucusuna veren launcher olacaktır. Önce mevcut launcher kodunun typecheck, lint, Jest, Expo config ve web export kontrollerini çalıştır. Sonra plandaki Android cihaz doğrulaması, indirme sağlamlığı ve launcher UI durumlarını uygula. Kaynak üç projeyi Enverse içine kopyalama veya değiştirme. Gerçek GitHub repo adlarını bilmiyorsan URL uydurma.

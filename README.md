# Enverse

**Üç dünya, tek evren.** Android uygulamalarını imzalı GitHub kataloğundan keşfeden, açan, doğrulayan, kuran ve güncelleyen kişisel uygulama merkezi.

## İlk sürüm

- Sınırsız ve sanallaştırılmış uygulama grid'i
- Arama, kategori filtreleri ve uygulama detayları
- Kurulu sürüm algılama ve otomatik güncelleme karşılaştırması
- Eşzamanlı indirme; duraklatma, devam, iptal, hız ve kalan süre
- APK boyutu ve SHA-256 bütünlük doğrulaması
- RSA-SHA256 imzalı uzaktan katalog
- Enverse'in kendi APK güncellemesini katalogdan alması
- Sistem onaylı kurma ve kaldırma akışları

## Çalıştırma

```bash
npm install
npm start
```

## Doğrulama

```bash
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm exec expo export --platform web --output-dir dist
```

## Dağıtım ve yeni uygulama ekleme

Kaynak kod ile APK dağıtımı ayrılmıştır:

- Kaynak: `ahmeterdemserceoglu/Enverse` — private yapılabilir.
- Dağıtım: [`ahmeterdemserceoglu/Enverse-Distribution`](https://github.com/ahmeterdemserceoglu/Enverse-Distribution) — public kalmalıdır.

Yeni APK'yı dağıtım deposunun son Release'ine yükleyip `manifest.json` kaydını güncelleyin. GitHub Actions APK boyutunu ve SHA-256 değerini hesaplar, `apps.json` dosyasını repository secret içindeki özel anahtarla imzalar ve yayınlar. Uygulama yalnızca içine gömülü açık anahtarla doğrulanan katalogları kabul eder.

Adım adım sürüm ve katalog işletim rehberi: [`distribution/KATALOG_KULLANIM_REHBERI.md`](./distribution/KATALOG_KULLANIM_REHBERI.md).

APK adresleri güvenlik nedeniyle yalnızca HTTPS GitHub Release adreslerinden kabul edilir. Ağ yoksa son başarılı doğrulanmış katalog cihaz önbelleğinden, o da yoksa uygulamayla gelen katalog açılır. Katalog ekranını aşağı çekmek GitHub listesini ve kurulu sürümleri yeniler.

> Dağıtım deposu private yapılırsa GitHub, katalog ve APK isteklerinde kimlik doğrulaması ister; cihazlar güncelleme alamaz. Public olmak yazma yetkisini açmaz: manifest ve Release yükleme yetkisi yalnızca repo sahibi ile açıkça yetkilendirilmiş collaborator'lardadır.

Detaylı uygulama şartnamesi için [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md), ilerleme için [MIGRATION_STATUS.md](./MIGRATION_STATUS.md) ve mimari kararlar için [DECISIONS.md](./DECISIONS.md) dosyalarını okuyun.

## Bağlanan Android paketleri

```text
Maxen: com.maxen.app
Tuben: com.tuben.app
Voxen: com.voxen.music
```

APK bağlantıları `.env` içindeki `EXPO_PUBLIC_MAXEN_APK_URL`, `EXPO_PUBLIC_TUBEN_APK_URL` ve `EXPO_PUBLIC_VOXEN_APK_URL` alanlarına doğrudan GitHub Release `.apk` URL'si olarak girilir.

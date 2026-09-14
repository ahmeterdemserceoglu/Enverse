# Enverse

**Üç dünya, tek evren.** Maxen, Tuben ve Voxen uygulamalarını tek merkezden açan ve gerektiğinde GitHub Releases üzerinden kuran Android launcher.

## İlk sürüm

- Enverse birleşik ana sayfası
- Maxen, Tuben ve Voxen'i paket adıyla açma
- Kurulu olmayan uygulamayı GitHub Releases üzerinden indirip Android kurucusuna gönderme
- Telefon, tablet ve web için uyarlanabilir düzen
- Her ürünün kendi vurgu rengini koruyan ortak tasarım sistemi

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

## GitHub kataloğuna uygulama ekleme

Enverse açılışta [`catalog/apps.json`](./catalog/apps.json) dosyasını GitHub üzerinden okur. Yeni bir uygulama göstermek için `apps` dizisine benzersiz `id`, görünen `name`, `description`, Android `packageName` ve GitHub Releases üzerindeki `apkUrl` alanlarını ekleyip `main` dalına gönderin. İsteğe bağlı `category`, `accent` (`#RRGGBB`) ve GitHub üzerinde barındırılan `iconUrl` kullanılabilir.

APK adresleri güvenlik nedeniyle yalnızca HTTPS GitHub Release adreslerinden kabul edilir. Ağ yoksa son başarılı katalog cihaz önbelleğinden, o da yoksa uygulamayla gelen üçlü katalogdan açılır. Katalog ekranını aşağı çekmek GitHub listesini anında yeniler.

> Dağıtım deposu private yapılırsa GitHub, katalog ve APK isteklerinde kimlik doğrulaması ister; sonradan eklenen uygulamalar anonim cihazlara ulaşmaz. Kaynak kod gizlenecekse private kaynak repo ile public katalog/Release reposunu ayrı tutun. Public repoya yazma ve Release yükleme yetkisi yine yalnızca repo sahibindedir.

Detaylı uygulama şartnamesi için [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md), ilerleme için [MIGRATION_STATUS.md](./MIGRATION_STATUS.md) ve mimari kararlar için [DECISIONS.md](./DECISIONS.md) dosyalarını okuyun.

## Bağlanan Android paketleri

```text
Maxen: com.maxen.app
Tuben: com.tuben.app
Voxen: com.voxen.music
```

APK bağlantıları `.env` içindeki `EXPO_PUBLIC_MAXEN_APK_URL`, `EXPO_PUBLIC_TUBEN_APK_URL` ve `EXPO_PUBLIC_VOXEN_APK_URL` alanlarına doğrudan GitHub Release `.apk` URL'si olarak girilir.

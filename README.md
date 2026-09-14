# Enverse

**Üç dünya, tek evren.** Maxen, Tuben ve Voxen deneyimlerini ortak bir uygulama kabuğunda buluşturan modüler medya platformu.

## İlk sürüm

- Enverse birleşik ana sayfası
- Maxen, Tuben ve Voxen dünya geçişleri
- Ortak alt navigasyon ve kütüphane alanı
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

Detaylı uygulama şartnamesi için [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md), ilerleme için [MIGRATION_STATUS.md](./MIGRATION_STATUS.md) ve mimari kararlar için [DECISIONS.md](./DECISIONS.md) dosyalarını okuyun.

## Taşıma sırası

1. Ortak kimlik doğrulama ve En ID
2. Voxen müzik modülü
3. Tuben video modülü
4. Maxen film/TV modülü ve TV adaptörü
5. Ortak kütüphane, arama, cihaz aktarımı ve sosyal grafik

Kaynak projeler taşıma tamamlanana kadar bağımsız şekilde çalışmaya devam eder.

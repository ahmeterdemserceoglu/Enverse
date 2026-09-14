import type { ContentItem } from './types';

export const continueItems: ContentItem[] = [
  { id: 'maxen-1', world: 'maxen', title: 'Kaldığın yerden devam et', subtitle: 'Film ve dizilerin Maxen\'de hazır', icon: 'film-outline' },
  { id: 'tuben-1', world: 'tuben', title: 'Günün videoları', subtitle: 'Tuben seçkisi', icon: 'play-circle-outline' },
  { id: 'voxen-1', world: 'voxen', title: 'Sana özel karışım', subtitle: 'Voxen günlük mix', icon: 'musical-notes-outline' },
];

export const worldCopy = {
  maxen: { title: 'Maxen', eyebrow: 'FİLM & DİZİ', description: 'Sinemanın ve hikâyelerin dünyası.' },
  tuben: { title: 'Tuben', eyebrow: 'VİDEO', description: 'İzlemek istediğin her şey tek akışta.' },
  voxen: { title: 'Voxen', eyebrow: 'MÜZİK & PODCAST', description: 'Ritmini bul, birlikte dinle.' },
} as const;

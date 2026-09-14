export type EnverseWorld = 'home' | 'maxen' | 'tuben' | 'voxen' | 'library';

export type WorldId = 'maxen' | 'tuben' | 'voxen';
export type MediaType = 'movie' | 'episode' | 'video' | 'short' | 'track' | 'podcastEpisode';

export type MediaRef = {
  id: string;
  sourceId: string;
  world: WorldId;
  type: MediaType;
  title: string;
  subtitle?: string;
  artworkUrl?: string;
  durationMs?: number;
};

export type ContentItem = {
  id: string;
  world: Exclude<EnverseWorld, 'home' | 'library'>;
  title: string;
  subtitle: string;
  icon: string;
};

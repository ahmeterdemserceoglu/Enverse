import type { MediaRef } from '../../types';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';
export type StopReason = 'user' | 'source-switch' | 'logout' | 'error';

export type PlayRequest = {
  media: MediaRef;
  startPositionMs?: number;
  autoplay?: boolean;
};

export type MediaSessionSnapshot = {
  state: PlaybackState;
  media: MediaRef | null;
  positionMs: number;
  durationMs: number;
  errorCode?: string;
};

export interface MediaEngineAdapter {
  readonly world: MediaRef['world'];
  play(request: PlayRequest): Promise<void>;
  pause(): Promise<void>;
  seek(positionMs: number): Promise<void>;
  stop(reason: StopReason): Promise<void>;
}

export interface MediaSessionCoordinatorContract {
  register(adapter: MediaEngineAdapter): () => void;
  play(request: PlayRequest): Promise<void>;
  pause(): Promise<void>;
  seek(positionMs: number): Promise<void>;
  stop(reason: StopReason): Promise<void>;
  getSnapshot(): MediaSessionSnapshot;
  subscribe(listener: (snapshot: MediaSessionSnapshot) => void): () => void;
}

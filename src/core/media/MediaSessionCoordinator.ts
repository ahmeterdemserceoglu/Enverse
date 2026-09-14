import type {
  MediaEngineAdapter,
  MediaSessionCoordinatorContract,
  MediaSessionSnapshot,
  PlayRequest,
  StopReason,
} from './types';

const initialSnapshot: MediaSessionSnapshot = {
  state: 'idle',
  media: null,
  positionMs: 0,
  durationMs: 0,
};

export class MediaSessionCoordinator implements MediaSessionCoordinatorContract {
  private readonly adapters = new Map<MediaEngineAdapter['world'], MediaEngineAdapter>();
  private readonly listeners = new Set<(snapshot: MediaSessionSnapshot) => void>();
  private snapshot = initialSnapshot;
  private activeAdapter: MediaEngineAdapter | null = null;
  private operation = Promise.resolve();

  register(adapter: MediaEngineAdapter) {
    this.adapters.set(adapter.world, adapter);
    return () => {
      if (this.adapters.get(adapter.world) === adapter) this.adapters.delete(adapter.world);
    };
  }

  play(request: PlayRequest) {
    return this.enqueue(async () => {
      const nextAdapter = this.adapters.get(request.media.world);
      if (!nextAdapter) throw new Error(`MEDIA_ENGINE_NOT_REGISTERED:${request.media.world}`);

      this.update({ state: 'loading', media: request.media, positionMs: request.startPositionMs ?? 0, durationMs: request.media.durationMs ?? 0, errorCode: undefined });
      try {
        if (this.activeAdapter && this.activeAdapter !== nextAdapter) {
          await this.activeAdapter.stop('source-switch');
        }
        this.activeAdapter = nextAdapter;
        await nextAdapter.play(request);
        this.update({ ...this.snapshot, state: request.autoplay === false ? 'paused' : 'playing' });
      } catch (error) {
        this.update({ ...this.snapshot, state: 'error', errorCode: error instanceof Error ? error.message : 'MEDIA_PLAY_FAILED' });
        throw error;
      }
    });
  }

  pause() {
    return this.enqueue(async () => {
      if (!this.activeAdapter || this.snapshot.state !== 'playing') return;
      await this.activeAdapter.pause();
      this.update({ ...this.snapshot, state: 'paused' });
    });
  }

  seek(positionMs: number) {
    return this.enqueue(async () => {
      if (!this.activeAdapter || !this.snapshot.media) return;
      const bounded = Math.max(0, this.snapshot.durationMs ? Math.min(positionMs, this.snapshot.durationMs) : positionMs);
      await this.activeAdapter.seek(bounded);
      this.update({ ...this.snapshot, positionMs: bounded });
    });
  }

  stop(reason: StopReason) {
    return this.enqueue(async () => {
      if (this.activeAdapter) await this.activeAdapter.stop(reason);
      this.activeAdapter = null;
      this.update(initialSnapshot);
    });
  }

  getSnapshot() {
    return this.snapshot;
  }

  subscribe(listener: (snapshot: MediaSessionSnapshot) => void) {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => this.listeners.delete(listener);
  }

  private update(snapshot: MediaSessionSnapshot) {
    this.snapshot = snapshot;
    this.listeners.forEach((listener) => listener(snapshot));
  }

  private enqueue<T>(task: () => Promise<T>): Promise<T> {
    const result = this.operation.then(task, task);
    this.operation = result.then(() => undefined, () => undefined);
    return result;
  }
}

export const mediaSessionCoordinator = new MediaSessionCoordinator();

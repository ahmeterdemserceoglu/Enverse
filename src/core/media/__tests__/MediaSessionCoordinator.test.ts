/// <reference types="jest" />
import { MediaSessionCoordinator } from '../MediaSessionCoordinator';
import type { MediaEngineAdapter, PlayRequest, StopReason } from '../types';
import type { MediaRef, WorldId } from '../../../types';

function media(world: WorldId, durationMs = 100_000): MediaRef {
  return { id: `${world}-1`, sourceId: '1', world, type: world === 'voxen' ? 'track' : 'video', title: 'Test', durationMs };
}

function adapter(world: WorldId) {
  const calls: string[] = [];
  const value: MediaEngineAdapter = {
    world,
    async play(request: PlayRequest) { calls.push(`play:${request.media.id}`); },
    async pause() { calls.push('pause'); },
    async seek(positionMs: number) { calls.push(`seek:${positionMs}`); },
    async stop(reason: StopReason) { calls.push(`stop:${reason}`); },
  };
  return { value, calls };
}

describe('MediaSessionCoordinator', () => {
  it('stops the previous world before starting another one', async () => {
    const coordinator = new MediaSessionCoordinator();
    const voxen = adapter('voxen');
    const tuben = adapter('tuben');
    coordinator.register(voxen.value);
    coordinator.register(tuben.value);

    await coordinator.play({ media: media('voxen') });
    await coordinator.play({ media: media('tuben') });

    expect(voxen.calls).toEqual(['play:voxen-1', 'stop:source-switch']);
    expect(tuben.calls).toEqual(['play:tuben-1']);
    expect(coordinator.getSnapshot()).toMatchObject({ state: 'playing', media: { world: 'tuben' } });
  });

  it('serializes concurrent play requests', async () => {
    const coordinator = new MediaSessionCoordinator();
    const maxen = adapter('maxen');
    const voxen = adapter('voxen');
    coordinator.register(maxen.value);
    coordinator.register(voxen.value);

    await Promise.all([
      coordinator.play({ media: media('maxen') }),
      coordinator.play({ media: media('voxen') }),
    ]);

    expect(maxen.calls).toEqual(['play:maxen-1', 'stop:source-switch']);
    expect(coordinator.getSnapshot().media?.world).toBe('voxen');
  });

  it('bounds seek between zero and media duration', async () => {
    const coordinator = new MediaSessionCoordinator();
    const voxen = adapter('voxen');
    coordinator.register(voxen.value);
    await coordinator.play({ media: media('voxen', 10_000) });

    await coordinator.seek(-20);
    await coordinator.seek(15_000);

    expect(voxen.calls).toContain('seek:0');
    expect(voxen.calls).toContain('seek:10000');
    expect(coordinator.getSnapshot().positionMs).toBe(10_000);
  });

  it('publishes an error state when an engine is missing', async () => {
    const coordinator = new MediaSessionCoordinator();
    await expect(coordinator.play({ media: media('tuben') })).rejects.toThrow('MEDIA_ENGINE_NOT_REGISTERED:tuben');
    expect(coordinator.getSnapshot().state).toBe('idle');
  });

  it('notifies subscribers immediately and on transitions', async () => {
    const coordinator = new MediaSessionCoordinator();
    const maxen = adapter('maxen');
    coordinator.register(maxen.value);
    const states: string[] = [];
    const unsubscribe = coordinator.subscribe((snapshot) => states.push(snapshot.state));
    await coordinator.play({ media: media('maxen') });
    await coordinator.pause();
    unsubscribe();

    expect(states).toEqual(['idle', 'loading', 'playing', 'paused']);
  });
});

# Enverse Architecture Decisions

## ADR-001 — Expo 57 mobile baseline

- **Status:** accepted
- **Context:** Tuben and Voxen already use Expo 57 and React Native 0.86; Maxen uses Expo 54 with `react-native-tvos`.
- **Decision:** Enverse mobile/web targets Expo 57. TV remains a separate platform adapter/build target until compatibility is proven.
- **Consequence:** Voxen and Tuben migrate first. Maxen is adapted rather than copied wholesale.

## ADR-002 — React Navigation 7

- **Status:** accepted
- **Context:** The initial shell used local state for navigation.
- **Decision:** Root stack and main tabs use React Navigation 7 with typed route params and deep links.
- **Consequence:** Feature modules can register nested navigators without owning the app shell.

## ADR-003 — One active media session

- **Status:** accepted
- **Context:** Three source projects contain independent playback engines.
- **Decision:** A future `MediaSessionCoordinator` will exclusively arbitrate playback across worlds.
- **Consequence:** Source player stores must be adapted and cannot independently start background media after migration.

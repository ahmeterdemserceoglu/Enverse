# Enverse Migration Status

Status values: `not-started`, `in-progress`, `blocked`, `verified`.

| Area | Source | Target | Status | Verification | Notes |
|---|---|---|---|---|---|
| Project shell | Enverse prototype | `src/app` | verified | Typecheck, lint, web export | React Navigation, providers and deep links added |
| Media coordinator | All players | `src/core/media` | in-progress | 5 unit tests passing; adapter integration pending | Serialized single-session coordinator added |
| Design tokens | Enverse prototype | `src/design-system` | in-progress | Desktop web visual QA passed | Base tokens and shared feedback state added |
| En ID | All apps | `src/core/auth` | not-started | — | Requires secure Firebase rules first |
| Voxen | Voxen | `src/worlds/voxen` | not-started | — | First world migration |
| Tuben | Tuben | `src/worlds/tuben` | not-started | — | Second world migration |
| Maxen mobile/web | Maxen | `src/worlds/maxen` | not-started | — | Split large player/social files first |
| Android TV | Maxen | `src/platform/tv` | not-started | — | Separate build adapter |
| Unified library | All apps | `src/features/library` | not-started | — | Domain contract defined in plan |
| Unified search | All apps | `src/features/search` | not-started | — | Provider interface defined in plan |

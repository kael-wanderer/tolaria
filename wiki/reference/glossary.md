# Glossary & upstream links

## Upstream Tolaria (don't re-document here — link out)

- **Repo:** https://github.com/refactoringhq/tolaria
- **In-repo base docs:** `docs/ARCHITECTURE.md`, `docs/ABSTRACTIONS.md`, `docs/GETTING-STARTED.md` (these describe upstream Tolaria; my fork only adds one-line pointers to them)
- **App identity:** product `Tolaria`, bundle id `club.refactoring.tolaria`, base version `0.1.0`

This wiki documents *my fork only*. For how Tolaria's vault, editor, git sync, or AI integration work, read upstream's docs above.

## Fork terms

| Term | Meaning |
|------|---------|
| **upstream** | The author's repo (`refactoringhq/tolaria`). Read-only to me; I only `fetch`. |
| **origin** | My fork's remote (`kael-wanderer/tolaria`). |
| **fork point** | `b84d6579` (2026-05-30) — the upstream commit my `main` branches from. |
| **main** | My integration + working branch: upstream base + my customizations; the branch I build/run/push. |
| **codex/customization** | Staging branch holding the clean record of just-my-changes; currently at the fork point. |
| **customization layer** | The local-only appearance feature under `src/customization/` (themes, fonts, per-region font sizes). |
| **integration point** | An upstream file I edit to wire in the layer (e.g. `SettingsPanel.tsx`, `useTheme.ts`) — the conflict-prone surface. |
| **sync** | Pulling a new upstream release and re-applying my layer — see [how-to-sync.md](how-to-sync.md). |

## Fork-specific docs at repo root

- `docs/CUSTOMIZATION.md` — canonical implementation reference for the appearance layer
- `CHANGELOG.customization.md` — dated log of what diverges from upstream

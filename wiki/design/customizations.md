# Customization inventory (consolidated)

Every way this fork diverges from `upstream/main`, grounded in `git diff upstream/main..main`. Two logical changes, delivered in commits `3643850c` (feature) and `9fd796df` (smoke-test stabilization).

## What changed, why, and conflict risk

| # | Change | Files it touches | Why | Conflict risk on upstream bump |
|---|--------|------------------|-----|-------------------------------|
| 1 | **Customization feature module** (themes, fonts, per-region font sizes) | `src/customization/customAppearance.ts`, `useCustomAppearance.ts`, `CustomizationSettingsSection.tsx` (+ tests) | Personal appearance layer upstream doesn't offer | **None** — all new files, additive |
| 2 | **Register Customization Settings section** | `src/components/SettingsPanel.tsx`, `SettingsBodyNav.tsx`, `settingsSectionIds.ts` | Surface the feature natively in Settings | **High** — upstream actively edits the Settings panel |
| 3 | **Theme variable merge** | `src/hooks/useTheme.ts`, `useTheme.test.ts` | Inject my theme presets into the live theme | **Medium** — theming is core, may move |
| 4 | **Preference / menu wiring** | `src/hooks/useAppPreferences.ts`, `useMenuEvents.ts` | Persist + react to customization changes | **Low/Medium** |
| 5 | **CSS variable consumers** | `src/App.css`, `src/components/Editor.css`, `EditorTheme.css` | Apply sidebar/note-list/editor sizes & theme vars | **Medium** — CSS drift on upstream restyles |
| 6 | **Storage key** | `src/constants/appStorage.ts` | localStorage key for customization | **Low** — usually append-only |
| 7 | **App entry wiring** | `src/main.tsx` | Apply customization at boot | **Low/Medium** |
| 8 | **Disable auto-updater for local builds** | `src-tauri/src/app_updater.rs`, `src-tauri/tauri.conf.json` | Stop upstream update prompts; allow unsigned local `tauri build` | **Medium** — `tauri.conf.json` changes upstream often |
| 9 | **Raise chunk-size warning limit** | `vite.config.ts` | Silence build warning for my bundle | **Low/Medium** |
| 10 | **New UI strings** | `src/lib/locales/en.json` (source) + 18 translated locales | Localize customization labels | **Medium** — locale files churn upstream; merge can be noisy |
| 11 | **Misc upstream-touch tidy** | `src/utils/*.ts` (`ai-chat`, `url`, `notePdfExport`, `streamAiAgent`, `streamAiModel`, `ai-reference-content`) | Small adjustments pulled in with the feature | **Low** — 1–3 line edits |
| 12 | **Fork docs** | `CHANGELOG.customization.md`, `docs/CUSTOMIZATION.md`, one-line notes in `docs/ARCHITECTURE.md` / `ABSTRACTIONS.md` / `GETTING-STARTED.md` | Record divergence | **Low** |
| 13 | **Wikilink smoke stabilization** (`9fd796df`) | `tests/smoke/wikilink-path-fix.spec.ts` | Flaky smoke setup touched during integration | **Low/Medium** — upstream owns this spec |

## Conflict-risk summary

- **Watch first on every sync:** `SettingsPanel.tsx` (#2), `tauri.conf.json` (#8), `useTheme.ts` (#3), locale files (#10).
- **Safe by construction:** everything under `src/customization/` (#1) — new files, never the thing in conflict.
- The thinner the integration touch, the cheaper the re-apply — keep it that way.

## Verification (from `CHANGELOG.customization.md`)

The feature commit was verified with: `npx tsc --noEmit`, `pnpm lint`, `pnpm l10n:validate`, the targeted tests (`customAppearance.test.ts`, `useTheme.test.ts`, `SettingsPanel.test.tsx`), and `npm run tauri build`.

Deep design of the appearance layer itself: [appearance-customization.md](appearance-customization.md).

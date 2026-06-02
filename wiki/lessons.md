# Fork lessons & gotchas

What reliably bites when maintaining this fork. Append as you learn — newest insights welcome at the top.

## What reliably conflicts on upstream bumps

Ranked by how often upstream churns the same lines I edit:

1. **`src-tauri/tauri.conf.json`** — upstream bumps version, updater config, and bundle settings here often. My change disables the updater / unsigned local builds. Re-apply my edits and double-check the `version` field after every sync.
2. **`src/components/SettingsPanel.tsx` + `SettingsBodyNav.tsx` + `settingsSectionIds.ts`** — upstream actively develops Settings. My section registration is the most likely real merge conflict. Keep the registration small and obvious so it's easy to re-insert.
3. **`src/lib/locales/*.json`** — 19 locale files. Upstream adds keys; I add keys. Conflicts here are noisy but mechanical. After resolving, run `pnpm l10n:validate`; only `en.json` is authoritative, the rest regenerate via `pnpm l10n:translate` (needs LARA keys).
4. **`src/hooks/useTheme.ts`** — theming is core; if upstream refactors it, my variable-merge needs re-threading. Covered by `useTheme.test.ts`.
5. **`vite.config.ts`** — small (chunk-size warning limit). Easy to re-apply, easy to lose silently.

**Never in conflict:** anything under `src/customization/`. That's the whole point of isolating the feature — keep it that way.

## Gotchas learned so far

- **Editor font-size didn't visibly change body text** until sizes were applied through the BlockNote editor theme variables (not a plain CSS rule). Fixed in `3643850c`. If a future upstream editor refactor breaks sizing, that's the first place to look.
- **`tauri build` requires `TAURI_SIGNING_PRIVATE_KEY`** out of the box because upstream generates signed updater artifacts. My fork disables updater artifact generation for local builds so `npm run tauri build` works without the key. If a sync re-enables it, builds will fail asking for the key.
- **Auto-updater reported phantom updates** from the upstream release feed against my local build. Disabled in `app_updater.rs`. Re-check after any `app_updater.rs` upstream change.
- **`pnpm l10n:translate` needs LARA credentials** (`LARA_ACCESS_KEY_ID`, `LARA_ACCESS_KEY_SECRET`). Without them, non-English customization labels fall back to English — acceptable, but don't be surprised by English text in other locales.
- **Smoke flakiness:** the wikilink smoke spec (`tests/smoke/wikilink-path-fix.spec.ts`) was stabilized in `9fd796df` while integrating the feature. Since upstream owns that spec, a sync may reintroduce the flake — re-apply the hardening if so.

## Process reminders

- After every sync, the **two log writes are not optional**: `CHANGELOG.customization.md` (dated entry) and [02-timeline.md](02-timeline.md) (sync-log row). Skipping them is how a fork becomes unmaintainable.
- **Never `--no-verify`** to get past the pre-push hook — fix the cause (see [reference/how-to-sync.md](reference/how-to-sync.md)).
- Keep the integration touch **thin**. Every extra upstream line I edit is a future conflict I'm signing up for.

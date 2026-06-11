# Timeline & sync log

All commits/dates below come from `git log` against `upstream/main` — they are real, not estimated.

## Forked at

| | |
|---|---|
| **Fork-point commit** | `b84d6579` — *fix: refresh clean active notes after external edits* |
| **Date** | 2026-05-30 |
| **Upstream** | https://github.com/refactoringhq/tolaria (`upstream/main`) |
| **My remote** | https://github.com/kael-wanderer/tolaria (`origin`) |
| **Base version** | Tolaria `0.1.0` (`identifier: club.refactoring.tolaria`) |

As of the 2026-06-11 sync, `main` is rebased onto `upstream/main` at `f6a8028e` — **ahead by 4** and **behind by 0**. (Hashes below are post-rebase and change every sync; identify commits by message, not hash.)

## Customizations added

These are the commits on `main` that are **not** in `upstream/main` (`git log upstream/main..main`):

| Date | Commit | Summary |
|------|--------|---------|
| 2026-05-31 | `7403e5a7` | **feat: add local customization settings** — the whole appearance layer (themes, fonts, per-region font sizes) + local-build fixes |
| 2026-05-31 | `0b81346c` | **test: stabilize wikilink smoke setup** — hardened the wikilink smoke spec touched while integrating the above |
| 2026-05-31 | `4012be1b` | **docs: add fork-maintenance wiki** — this wiki |
| 2026-06-11 | `894f1a84` | **docs: add architecture map and command cheat sheet to AGENTS.md** |

For the full breakdown of what the feature commit changed and where, see [design/customizations.md](design/customizations.md).

## Upstream sync log

> Each time I pull upstream, add a row: date, the upstream commit/version I moved to, what (if anything) broke, and how I fixed it. Keep newest at top.

| Date | Synced to (upstream commit / version) | Broke? | Fix |
|------|----------------------------------------|--------|-----|
| 2026-06-11 | `f6a8028e` (+100 commits from `b84d6579`; incl. v2026-06-10) | 19 conflicts: `tauri.conf.json`, `streamAiModel.ts`, 17 locales | tauri.conf: kept updater-off + took upstream `category`. streamAiModel: took upstream (my tidy now subsumed). locales: took upstream, restored 34 customization keys from `3643850c`; `sv-SE`/`uk-UA` new → English fallback. |

When the author ships an update, follow [reference/how-to-sync.md](reference/how-to-sync.md), then record the result here and append a dated entry to `CHANGELOG.customization.md` at the repo root. Note any conflicts in [lessons.md](lessons.md).

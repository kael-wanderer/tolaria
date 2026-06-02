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

At the time of writing, `upstream/main` is still at `b84d6579`, so my `main` is **ahead by 2** and **behind by 0** — i.e. no upstream sync has been needed yet since the fork.

## Customizations added

These are the commits on `main` that are **not** in `upstream/main` (`git log upstream/main..main`):

| Date | Commit | Summary |
|------|--------|---------|
| 2026-05-31 | `3643850c` | **feat: add local customization settings** — the whole appearance layer (themes, fonts, per-region font sizes) + local-build fixes |
| 2026-05-31 | `9fd796df` | **test: stabilize wikilink smoke setup** — hardened the wikilink smoke spec touched while integrating the above |

For the full breakdown of what `3643850c` changed and where, see [design/customizations.md](design/customizations.md).

## Upstream sync log

> Each time I pull upstream, add a row: date, the upstream commit/version I moved to, what (if anything) broke, and how I fixed it. Keep newest at top.

| Date | Synced to (upstream commit / version) | Broke? | Fix |
|------|----------------------------------------|--------|-----|
| — | *No upstream sync performed yet.* `main` still branches cleanly from `b84d6579`. | — | — |

When the author ships an update, follow [reference/how-to-sync.md](reference/how-to-sync.md), then record the result here and append a dated entry to `CHANGELOG.customization.md` at the repo root. Note any conflicts in [lessons.md](lessons.md).

# Why I forked Tolaria

## The pain point

Upstream Tolaria ships exactly three appearance modes: **Light**, **Dark**, and **System**. That is fine for most people, but it does not let me:

- use the editor color themes I actually like (Everforest, Catppuccin, Nord, Tokyo Night, Dracula, Gruvbox)
- pick my own editor font (e.g. JetBrains Mono, Iosevka Nerd Font Mono) instead of the bundled default
- size the **sidebar**, **note list**, and **editor** independently — upstream has a single editor font-size knob, which left the left-hand panels too small or too large for me

None of this is a vault/content concern — it is purely *how the app looks on my machine*. Upstream had no reason to add a personal theming surface, so I added one locally.

On top of that, building the app locally was annoying:

- the bundled **auto-updater** kept reporting updates from the upstream release feed, which do not apply to my local build
- `tauri build` refused to run without a `TAURI_SIGNING_PRIVATE_KEY`, because upstream generates signed updater artifacts
- the production build printed a chunk-size warning every time

## What I needed

1. A **local-only** appearance layer that never touches vault markdown, Type docs, or the remote — pure installation preference.
2. Per-region font sizing (sidebar / note list / editor) and a real theme + font picker, surfaced as a proper Settings section that feels native to the app.
3. A clean local build: no updater noise, no signing key requirement, no warning spam.

## Goals (and non-goals)

**Goals**
- Keep all my changes **isolated and additive** so upstream pulls stay cheap to re-apply.
- Store customization in `localStorage` only — never in the vault, never pushed.
- Match Tolaria's visual language (shadcn/ui, existing Settings panel pattern).
- Keep the fork honest: a `CHANGELOG.customization.md` + `docs/CUSTOMIZATION.md` describe exactly what diverges from upstream.

**Non-goals**
- I am **not** re-documenting or re-implementing upstream Tolaria features. I link to the author's docs for those.
- No full VS Code theme import (custom theme accepts known aliases or a small JSON color object — see [design/appearance-customization.md](design/appearance-customization.md)).
- No macOS font auto-discovery yet (custom font = type the installed family name).
- I do not maintain a long-lived divergent fork — the intent is always to stay close to upstream and re-apply a thin layer.

See [02-timeline.md](02-timeline.md) for when this happened and [03-architecture.md](03-architecture.md) for how it is structured to survive upstream merges.

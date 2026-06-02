# How to sync with upstream

The runbook for pulling a new upstream Tolaria release and re-applying my customizations. Diagram: [../diagrams/sync-flow.md](../diagrams/sync-flow.md).

## Remotes (one-time, already configured)

```bash
git remote -v
# origin    https://github.com/kael-wanderer/tolaria.git   (mine)
# upstream  https://github.com/refactoringhq/tolaria.git    (author)
```

If `upstream` is missing:

```bash
git remote add upstream https://github.com/refactoringhq/tolaria.git
```

## Sync sequence

```bash
# 1. Get the latest upstream history (no working-tree changes)
git fetch upstream

# 2. See what's new and whether you've diverged
git log --oneline main..upstream/main      # new upstream commits
git log --oneline upstream/main..main      # my customizations sitting on top

# 3. Re-apply my customizations on top of the new upstream base.
#    Rebase keeps history linear (preferred for this thin layer):
git switch main
git rebase upstream/main
#    (Alternative if rebase gets ugly: `git merge upstream/main`)

# 4. Resolve conflicts ONLY at the integration points; never let
#    src/customization/* lose its logic. Likely conflict files:
#    SettingsPanel.tsx, useTheme.ts, tauri.conf.json, src/lib/locales/*.json
#    After editing each: git add <file> ; then: git rebase --continue

# 5. Verify before trusting the merge (the pre-push suite runs these too):
npx tsc --noEmit
pnpm lint
pnpm test src/customization/customAppearance.test.ts src/hooks/useTheme.test.ts src/components/SettingsPanel.test.tsx
pnpm l10n:validate
npm run tauri build

# 6. Record the sync (do NOT skip — future-you needs this)
#    - append a dated entry to CHANGELOG.customization.md
#    - add a row to wiki/02-timeline.md "Upstream sync log"
#    - note any conflict that bit you in wiki/lessons.md

# 7. Publish (AGENTS.md: push directly to main, never --no-verify)
git push origin main
```

## If a customization commit needs re-staging

`codex/customization` is the clean record of "just my changes". If a rebase mangles things, you can re-derive the layer:

```bash
git log --oneline upstream/main..main        # find my customization commits
git switch -c rework upstream/main
git cherry-pick 3643850c 9fd796df            # re-apply on fresh upstream
```

## Rules

- **Never `--no-verify`.** If the pre-push hook (build + tests + smoke + CodeScene) blocks, fix the cause and push again.
- **Keep the layer thin.** The fewer upstream lines you edit, the cheaper the next sync.
- **localStorage only.** Nothing in the customization layer should ever write to the vault or be pushed as vault content.

# Customization Branch Changelog

## 2026-05-31

### Added
- Added a local-only **Customization** settings section.
- Added app color theme presets:
  - Everforest Dark
  - Catppuccin Mocha
  - Nord
  - Tokyo Night
  - Dracula
  - Gruvbox Dark
- Added custom theme input. It accepts supported theme aliases such as `Tokyo Night`, or a simple JSON color object with keys such as `background`, `surface`, `text`, `accent`, and `border`.
- Added editor font presets:
  - Inter
  - Georgia
  - Merriweather
  - JetBrains Mono
  - SF Mono
  - Menlo
  - Iosevka Nerd Font Mono
- Added custom editor font input for installed system fonts.
- Added separate font-size controls for:
  - Sidebar
  - Note list
  - Editor
- Added font-size presets `12, 14, 16, 18, 20, 22, 24, 26, 28, 30` plus custom numeric input.

### Changed
- Customization is stored in localStorage under the app customization key, so it stays local to this installed app and does not modify vault files.
- The previous single editor font-size setting is migrated to the new **Editor font size** field.
- Sidebar and note-list font sizes now apply through layout-level CSS variables.
- Editor font and size continue to apply through the BlockNote editor theme variables.

### Fixed
- Fixed editor font-size selection not visibly changing note body text.
- Disabled app updater checks for this local fork build so installed local builds do not report update availability from the original upstream release feed.
- Disabled Tauri updater artifact generation for local builds so `npm run tauri build` does not require `TAURI_SIGNING_PRIVATE_KEY`.
- Suppressed the local build chunk-size warning by raising the warning limit for this app bundle.

### Verified
- `npx tsc --noEmit`
- `pnpm lint`
- `pnpm l10n:validate`
- `pnpm test src/customization/customAppearance.test.ts src/hooks/useTheme.test.ts src/components/SettingsPanel.test.tsx`
- `npm run tauri build`

### Known Follow-Ups
- `pnpm l10n:translate` still requires `LARA_ACCESS_KEY_ID` and `LARA_ACCESS_KEY_SECRET`; non-English customization labels currently use English fallback text.
- Custom theme loading is intentionally minimal. It supports known aliases and simple JSON colors, not full VS Code theme import yet.
- Custom font discovery from macOS is not implemented yet; custom font entry expects the user to type an installed font family name.

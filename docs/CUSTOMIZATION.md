# Local Customization

This branch adds a local-only customization layer for Tolaria builds that need personal appearance preferences without changing the upstream vault model.

## Scope

Customization is installation-local. It is stored in browser/Tauri localStorage through `src/customization/customAppearance.ts` and does not write to vault markdown files, Type documents, app settings JSON, or remote repositories.

The Settings panel exposes the feature as a dedicated **Customization** section. This keeps fork-specific appearance controls isolated from the upstream app's standard Light, Dark, and System appearance mode.

## Controls

### Theme

Available presets:

- Default
- Everforest Dark
- Catppuccin Mocha
- Nord
- Tokyo Night
- Dracula
- Gruvbox Dark
- Custom

Custom theme input supports:

- Known aliases such as `Tokyo Night` or `Everforest Dark`
- A simple JSON object with optional `background`, `surface`, `text`, `accent`, and `border` color keys

Example:

```json
{
  "background": "#1e2326",
  "surface": "#272e33",
  "text": "#d3c6aa",
  "accent": "#a7c080",
  "border": "#4f585e"
}
```

### Font

Available editor font presets:

- Default
- Inter
- Georgia
- Merriweather
- JetBrains Mono
- SF Mono
- Menlo
- Iosevka Nerd Font Mono
- Custom

Custom font input accepts a CSS font-family string or a plain installed font family name. Plain names are quoted and given a `sans-serif` fallback.

### Font Sizes

Font size is split by app region:

- **Sidebar font size** controls left navigation, filters, folders, types, and saved views.
- **Note list font size** controls the middle note list.
- **Editor font size** controls note body text, inline code, tables, and derived heading sizes.

Preset values are `12, 14, 16, 18, 20, 22, 24, 26, 28, 30`; each region also supports a custom numeric value.

## Runtime Design

`CustomizationSettingsSection` owns the Settings UI and writes normalized values through `useCustomAppearanceSettings`.

`customAppearance.ts` owns:

- Storage key and change event
- Normalization and migration of stored values
- Theme preset variable maps
- Custom theme alias and JSON parsing
- Editor CSS variable export
- Document-level theme and layout font-size variable application

Editor-specific variables flow into `useEditorTheme`, which merges local customization with the existing `theme.json` derived BlockNote variables.

Sidebar and note-list font sizes are applied through document-level CSS variables:

- `--custom-sidebar-font-size`
- `--custom-note-list-font-size`

`App.css` consumes those variables on `.app__sidebar` and `.app__note-list`.

## Compatibility

The original single `fontSize` field is treated as a legacy editor font-size value. On load, it migrates into `editorFontSize` behavior so existing local customization remains visible after the split into Sidebar, Note list, and Editor sizes.

Because the customization module is isolated under `src/customization/`, future upstream updates should usually merge by keeping the Settings section registration and the small theme/layout integration points, then resolving any local conflicts inside the customization module.

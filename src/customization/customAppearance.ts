import { APP_STORAGE_KEYS } from '../constants/appStorage'
import { applyThemeModeToDocument } from '../lib/themeMode'

export const CUSTOM_APPEARANCE_STORAGE_KEY = APP_STORAGE_KEYS.customization
export const CUSTOM_APPEARANCE_CHANGE_EVENT = 'tolaria:custom-appearance-change'

export const CUSTOM_THEME_IDS = [
  'default',
  'catppuccin-mocha',
  'everforest-dark',
  'nord',
  'tokyo-night',
  'dracula',
  'gruvbox-dark',
  'custom',
] as const
export type CustomThemeId = typeof CUSTOM_THEME_IDS[number]

export const CUSTOM_FONT_IDS = [
  'default',
  'inter',
  'georgia',
  'merriweather',
  'jetbrains-mono',
  'sf-mono',
  'menlo',
  'iosevka-nerd-font-mono',
  'custom',
] as const
export type CustomFontId = typeof CUSTOM_FONT_IDS[number]

export const CUSTOM_FONT_SIZE_PRESETS = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30] as const
export type CustomFontSizePreset = typeof CUSTOM_FONT_SIZE_PRESETS[number]
export type CustomFontSizeMode = 'default' | 'preset' | 'custom'

export interface CustomAppearanceSettings {
  themeId: CustomThemeId
  customTheme: string
  fontId: CustomFontId
  customFontFamily: string
  sidebarFontSize: number | null
  sidebarFontSizeMode: CustomFontSizeMode
  noteListFontSize: number | null
  noteListFontSizeMode: CustomFontSizeMode
  editorFontSize: number | null
  editorFontSizeMode: CustomFontSizeMode
}

type CustomAppearanceStorage = Pick<Storage, 'getItem' | 'setItem'>
type CustomAppearanceDocument = Pick<Document, 'documentElement'>

export const DEFAULT_CUSTOM_APPEARANCE: CustomAppearanceSettings = {
  themeId: 'default',
  customTheme: '',
  fontId: 'default',
  customFontFamily: '',
  sidebarFontSize: null,
  sidebarFontSizeMode: 'default',
  noteListFontSize: null,
  noteListFontSizeMode: 'default',
  editorFontSize: null,
  editorFontSizeMode: 'default',
}

export const CUSTOM_FONT_FAMILIES: Record<Exclude<CustomFontId, 'default' | 'custom'>, string> = {
  inter: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  georgia: "Georgia, 'Times New Roman', serif",
  merriweather: "'Merriweather', Georgia, serif",
  'jetbrains-mono': "'JetBrains Mono', 'SF Mono', monospace",
  'sf-mono': "'SF Mono', SFMono-Regular, ui-monospace, monospace",
  menlo: "Menlo, Monaco, Consolas, monospace",
  'iosevka-nerd-font-mono': "'Iosevka Nerd Font Mono', 'IosevkaTerm Nerd Font Mono', 'Iosevka', monospace",
}

const CUSTOM_THEME_SET = new Set<CustomThemeId>(CUSTOM_THEME_IDS)
const CUSTOM_FONT_SET = new Set<CustomFontId>(CUSTOM_FONT_IDS)
const CUSTOM_FONT_SIZE_MIN = 10
const CUSTOM_FONT_SIZE_MAX = 40

const EVERFOREST_DARK_VARS: Record<string, string> = {
  '--surface-app': '#1e2326',
  '--surface-sidebar': '#272e33',
  '--surface-panel': '#272e33',
  '--surface-card': '#272e33',
  '--surface-popover': '#323c41',
  '--surface-input': '#1e2326',
  '--surface-button': '#3a464c',
  '--surface-dialog': '#272e33',
  '--surface-editor': '#1e2326',
  '--surface-overlay': 'rgba(15, 18, 20, 0.62)',
  '--text-primary': '#d3c6aa',
  '--text-secondary': '#a7b19d',
  '--text-tertiary': '#9da89a',
  '--text-muted': '#859289',
  '--text-faint': '#6f7b73',
  '--text-heading': '#e9ddc2',
  '--text-inverse': '#1e2326',
  '--border-default': '#4f585e',
  '--border-subtle': '#3a464c',
  '--border-strong': '#5b656b',
  '--border-input': '#4f585e',
  '--border-dialog': '#4f585e',
  '--border-focus': '#a7c080',
  '--state-hover': 'rgba(167, 192, 128, 0.08)',
  '--state-hover-subtle': 'rgba(167, 192, 128, 0.05)',
  '--state-selected': 'rgba(167, 192, 128, 0.16)',
  '--state-selected-strong': 'rgba(167, 192, 128, 0.22)',
  '--state-active': 'rgba(167, 192, 128, 0.18)',
  '--state-focus-ring': '#a7c080',
  '--state-drag-target': 'rgba(167, 192, 128, 0.2)',
  '--state-disabled': '#272e33',
  '--accent-blue': '#7fbbb3',
  '--accent-blue-bg': 'rgba(127, 187, 179, 0.16)',
  '--accent-blue-hover': '#9dd0c8',
  '--accent-blue-light': 'rgba(127, 187, 179, 0.14)',
  '--accent-green': '#a7c080',
  '--accent-green-light': 'rgba(167, 192, 128, 0.16)',
  '--accent-orange': '#e69875',
  '--accent-orange-light': 'rgba(230, 152, 117, 0.16)',
  '--accent-red': '#e67e80',
  '--accent-red-light': 'rgba(230, 126, 128, 0.16)',
  '--accent-purple': '#d699b6',
  '--accent-purple-light': 'rgba(214, 153, 182, 0.16)',
  '--accent-yellow': '#dbbc7f',
  '--accent-yellow-light': 'rgba(219, 188, 127, 0.18)',
  '--accent-teal': '#83c092',
  '--accent-teal-light': 'rgba(131, 192, 146, 0.16)',
  '--accent-pink': '#d699b6',
  '--accent-pink-light': 'rgba(214, 153, 182, 0.16)',
  '--accent-gray': '#9da89a',
  '--accent-gray-light': 'rgba(157, 168, 154, 0.14)',
  '--feedback-warning-text': '#dbbc7f',
  '--feedback-warning-bg': 'rgba(219, 188, 127, 0.16)',
  '--feedback-warning-border': '#e69875',
  '--syntax-heading': '#7fbbb3',
  '--syntax-link': '#7fbbb3',
  '--syntax-monospace': '#e67e80',
  '--syntax-monospace-bg': 'rgba(167, 192, 128, 0.1)',
  '--syntax-muted': '#859289',
  '--syntax-frontmatter-key': '#e67e80',
  '--syntax-frontmatter-value': '#a7c080',
  '--syntax-highlight-comment': '#859289',
  '--syntax-highlight-keyword': '#e67e80',
  '--syntax-highlight-string': '#a7c080',
  '--syntax-highlight-number': '#dbbc7f',
  '--syntax-highlight-title': '#7fbbb3',
  '--syntax-highlight-type': '#e69875',
  '--syntax-highlight-deletion': '#e67e80',
  '--syntax-highlight-deletion-bg': 'rgba(230, 126, 128, 0.16)',
  '--diff-added-text': '#a7c080',
  '--diff-added-bg': 'rgba(167, 192, 128, 0.14)',
  '--diff-removed-text': '#e67e80',
  '--diff-removed-bg': 'rgba(230, 126, 128, 0.14)',
  '--diff-hunk-bg': 'rgba(127, 187, 179, 0.13)',
  '--editor-code-block-background': '#272e33',
  '--editor-code-block-border': '#4f585e',
  '--editor-code-block-text': '#d3c6aa',
  '--editor-code-block-language': '#859289',
  '--shadow-dialog': 'rgba(0, 0, 0, 0.42)',
  '--primary': '#a7c080',
  '--sidebar-primary': '#a7c080',
}

const CATPPUCCIN_MOCHA_VARS: Record<string, string> = {
  ...EVERFOREST_DARK_VARS,
  '--surface-app': '#1e1e2e',
  '--surface-sidebar': '#181825',
  '--surface-panel': '#252536',
  '--surface-card': '#252536',
  '--surface-popover': '#313244',
  '--surface-input': '#1e1e2e',
  '--surface-button': '#45475a',
  '--surface-dialog': '#252536',
  '--surface-editor': '#1e1e2e',
  '--text-primary': '#cdd6f4',
  '--text-secondary': '#bac2de',
  '--text-tertiary': '#a6adc8',
  '--text-muted': '#9399b2',
  '--text-faint': '#6c7086',
  '--text-heading': '#f5e0dc',
  '--border-default': '#45475a',
  '--border-subtle': '#313244',
  '--border-strong': '#585b70',
  '--border-input': '#45475a',
  '--border-dialog': '#45475a',
  '--border-focus': '#89b4fa',
  '--state-hover': 'rgba(137, 180, 250, 0.08)',
  '--state-hover-subtle': 'rgba(137, 180, 250, 0.05)',
  '--state-selected': 'rgba(137, 180, 250, 0.15)',
  '--state-focus-ring': '#89b4fa',
  '--accent-blue': '#89b4fa',
  '--accent-green': '#a6e3a1',
  '--accent-orange': '#fab387',
  '--accent-red': '#f38ba8',
  '--accent-purple': '#cba6f7',
  '--accent-yellow': '#f9e2af',
  '--accent-teal': '#94e2d5',
  '--accent-pink': '#f5c2e7',
  '--syntax-link': '#89b4fa',
  '--syntax-monospace': '#f38ba8',
  '--syntax-frontmatter-key': '#f38ba8',
  '--syntax-frontmatter-value': '#a6e3a1',
  '--editor-code-block-background': '#181825',
  '--editor-code-block-border': '#45475a',
  '--editor-code-block-text': '#cdd6f4',
  '--primary': '#89b4fa',
  '--sidebar-primary': '#89b4fa',
}

const NORD_VARS: Record<string, string> = {
  ...EVERFOREST_DARK_VARS,
  '--surface-app': '#2e3440',
  '--surface-sidebar': '#242933',
  '--surface-panel': '#3b4252',
  '--surface-card': '#3b4252',
  '--surface-popover': '#434c5e',
  '--surface-input': '#2e3440',
  '--surface-button': '#4c566a',
  '--surface-dialog': '#3b4252',
  '--surface-editor': '#2e3440',
  '--text-primary': '#d8dee9',
  '--text-secondary': '#c7d0dc',
  '--text-tertiary': '#a3afc2',
  '--text-muted': '#8c9bb0',
  '--text-faint': '#6f7a8c',
  '--text-heading': '#eceff4',
  '--border-default': '#4c566a',
  '--border-subtle': '#3b4252',
  '--border-strong': '#5e6a7f',
  '--border-input': '#4c566a',
  '--border-dialog': '#4c566a',
  '--border-focus': '#88c0d0',
  '--state-hover': 'rgba(136, 192, 208, 0.08)',
  '--state-hover-subtle': 'rgba(136, 192, 208, 0.05)',
  '--state-selected': 'rgba(136, 192, 208, 0.16)',
  '--state-focus-ring': '#88c0d0',
  '--accent-blue': '#88c0d0',
  '--accent-green': '#a3be8c',
  '--accent-orange': '#d08770',
  '--accent-red': '#bf616a',
  '--accent-purple': '#b48ead',
  '--accent-yellow': '#ebcb8b',
  '--accent-teal': '#8fbcbb',
  '--accent-pink': '#b48ead',
  '--syntax-link': '#88c0d0',
  '--syntax-monospace': '#b48ead',
  '--syntax-frontmatter-key': '#bf616a',
  '--syntax-frontmatter-value': '#a3be8c',
  '--editor-code-block-background': '#242933',
  '--editor-code-block-border': '#4c566a',
  '--editor-code-block-text': '#d8dee9',
  '--primary': '#88c0d0',
  '--sidebar-primary': '#88c0d0',
}

const TOKYO_NIGHT_VARS: Record<string, string> = {
  ...EVERFOREST_DARK_VARS,
  '--surface-app': '#1a1b26',
  '--surface-sidebar': '#16161e',
  '--surface-panel': '#24283b',
  '--surface-card': '#24283b',
  '--surface-popover': '#292e42',
  '--surface-editor': '#1a1b26',
  '--text-primary': '#c0caf5',
  '--text-secondary': '#a9b1d6',
  '--text-muted': '#565f89',
  '--text-heading': '#c0caf5',
  '--border-default': '#414868',
  '--border-focus': '#7aa2f7',
  '--state-hover': 'rgba(122, 162, 247, 0.1)',
  '--state-selected': 'rgba(122, 162, 247, 0.18)',
  '--accent-blue': '#7aa2f7',
  '--accent-green': '#9ece6a',
  '--accent-orange': '#ff9e64',
  '--accent-red': '#f7768e',
  '--accent-purple': '#bb9af7',
  '--accent-yellow': '#e0af68',
  '--accent-teal': '#7dcfff',
  '--syntax-link': '#7aa2f7',
  '--syntax-monospace': '#f7768e',
  '--editor-code-block-background': '#16161e',
  '--primary': '#7aa2f7',
  '--sidebar-primary': '#7aa2f7',
}

const DRACULA_VARS: Record<string, string> = {
  ...EVERFOREST_DARK_VARS,
  '--surface-app': '#282a36',
  '--surface-sidebar': '#21222c',
  '--surface-panel': '#343746',
  '--surface-card': '#343746',
  '--surface-popover': '#3d4050',
  '--surface-editor': '#282a36',
  '--text-primary': '#f8f8f2',
  '--text-secondary': '#d6d6d0',
  '--text-muted': '#9095b3',
  '--text-heading': '#f8f8f2',
  '--border-default': '#4a4d5e',
  '--border-focus': '#bd93f9',
  '--state-hover': 'rgba(189, 147, 249, 0.1)',
  '--state-selected': 'rgba(189, 147, 249, 0.18)',
  '--accent-blue': '#8be9fd',
  '--accent-green': '#50fa7b',
  '--accent-orange': '#ffb86c',
  '--accent-red': '#ff5555',
  '--accent-purple': '#bd93f9',
  '--accent-yellow': '#f1fa8c',
  '--accent-pink': '#ff79c6',
  '--syntax-link': '#8be9fd',
  '--syntax-monospace': '#ff79c6',
  '--editor-code-block-background': '#21222c',
  '--primary': '#bd93f9',
  '--sidebar-primary': '#bd93f9',
}

const GRUVBOX_DARK_VARS: Record<string, string> = {
  ...EVERFOREST_DARK_VARS,
  '--surface-app': '#282828',
  '--surface-sidebar': '#1d2021',
  '--surface-panel': '#32302f',
  '--surface-card': '#32302f',
  '--surface-popover': '#3c3836',
  '--surface-editor': '#282828',
  '--text-primary': '#ebdbb2',
  '--text-secondary': '#d5c4a1',
  '--text-muted': '#928374',
  '--text-heading': '#fbf1c7',
  '--border-default': '#504945',
  '--border-focus': '#fabd2f',
  '--state-hover': 'rgba(250, 189, 47, 0.1)',
  '--state-selected': 'rgba(250, 189, 47, 0.18)',
  '--accent-blue': '#83a598',
  '--accent-green': '#b8bb26',
  '--accent-orange': '#fe8019',
  '--accent-red': '#fb4934',
  '--accent-purple': '#d3869b',
  '--accent-yellow': '#fabd2f',
  '--accent-teal': '#8ec07c',
  '--syntax-link': '#83a598',
  '--syntax-monospace': '#fb4934',
  '--editor-code-block-background': '#1d2021',
  '--primary': '#fabd2f',
  '--sidebar-primary': '#fabd2f',
}

const CUSTOM_THEME_VAR_MAP: Record<Exclude<CustomThemeId, 'default' | 'custom'>, Record<string, string>> = {
  'catppuccin-mocha': CATPPUCCIN_MOCHA_VARS,
  'everforest-dark': EVERFOREST_DARK_VARS,
  nord: NORD_VARS,
  'tokyo-night': TOKYO_NIGHT_VARS,
  dracula: DRACULA_VARS,
  'gruvbox-dark': GRUVBOX_DARK_VARS,
}

const CUSTOM_THEME_ALIASES = new Map<string, Exclude<CustomThemeId, 'default' | 'custom'>>([
  ['catppuccin mocha', 'catppuccin-mocha'],
  ['catppuccin-mocha', 'catppuccin-mocha'],
  ['everforest dark', 'everforest-dark'],
  ['everforest-dark', 'everforest-dark'],
  ['nord', 'nord'],
  ['tokyo night', 'tokyo-night'],
  ['tokyo-night', 'tokyo-night'],
  ['dracula', 'dracula'],
  ['gruvbox dark', 'gruvbox-dark'],
  ['gruvbox-dark', 'gruvbox-dark'],
])

const CUSTOM_THEME_VARS = new Set(Object.keys(EVERFOREST_DARK_VARS))
const CUSTOM_LAYOUT_FONT_SIZE_VARS = [
  '--custom-sidebar-font-size',
  '--custom-note-list-font-size',
] as const

export function normalizeCustomThemeId(value: unknown): CustomThemeId {
  return typeof value === 'string' && CUSTOM_THEME_SET.has(value as CustomThemeId)
    ? value as CustomThemeId
    : DEFAULT_CUSTOM_APPEARANCE.themeId
}

export function normalizeCustomFontId(value: unknown): CustomFontId {
  return typeof value === 'string' && CUSTOM_FONT_SET.has(value as CustomFontId)
    ? value as CustomFontId
    : DEFAULT_CUSTOM_APPEARANCE.fontId
}

export function normalizeCustomFontSize(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'number' || !Number.isFinite(value)) return null

  return Math.min(CUSTOM_FONT_SIZE_MAX, Math.max(CUSTOM_FONT_SIZE_MIN, Math.round(value)))
}

function normalizeFontSizeMode(value: unknown, fontSize: number | null): CustomFontSizeMode {
  if (value === 'custom') return 'custom'
  if (value === 'preset') return fontSize ? 'preset' : 'default'
  return fontSize ? 'preset' : 'default'
}

function normalizeCustomText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function normalizeCustomAppearanceSettings(value: unknown): CustomAppearanceSettings {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return { ...DEFAULT_CUSTOM_APPEARANCE }
  }

  const record = value as Record<string, unknown>
  const legacyFontSize = normalizeCustomFontSize(record.fontSize)
  const sidebarFontSize = normalizeCustomFontSize(record.sidebarFontSize)
  const noteListFontSize = normalizeCustomFontSize(record.noteListFontSize)
  const editorFontSize = normalizeCustomFontSize(record.editorFontSize) ?? legacyFontSize
  return {
    themeId: normalizeCustomThemeId(record.themeId),
    customTheme: normalizeCustomText(record.customTheme),
    fontId: normalizeCustomFontId(record.fontId),
    customFontFamily: normalizeCustomText(record.customFontFamily),
    sidebarFontSize,
    sidebarFontSizeMode: normalizeFontSizeMode(record.sidebarFontSizeMode, sidebarFontSize),
    noteListFontSize,
    noteListFontSizeMode: normalizeFontSizeMode(record.noteListFontSizeMode, noteListFontSize),
    editorFontSize,
    editorFontSizeMode: normalizeFontSizeMode(record.editorFontSizeMode ?? record.fontSizeMode, editorFontSize),
  }
}

export function loadCustomAppearanceSettings(storage: CustomAppearanceStorage = window.localStorage): CustomAppearanceSettings {
  try {
    const rawValue = storage.getItem(CUSTOM_APPEARANCE_STORAGE_KEY)
    if (!rawValue) return { ...DEFAULT_CUSTOM_APPEARANCE }

    return normalizeCustomAppearanceSettings(JSON.parse(rawValue))
  } catch {
    return { ...DEFAULT_CUSTOM_APPEARANCE }
  }
}

export function saveCustomAppearanceSettings(
  settings: CustomAppearanceSettings,
  storage: CustomAppearanceStorage = window.localStorage,
): CustomAppearanceSettings {
  const normalizedSettings = normalizeCustomAppearanceSettings(settings)
  try {
    storage.setItem(CUSTOM_APPEARANCE_STORAGE_KEY, JSON.stringify(normalizedSettings))
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
  dispatchCustomAppearanceChange()
  return normalizedSettings
}

export function dispatchCustomAppearanceChange(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CUSTOM_APPEARANCE_CHANGE_EVENT))
}

export function customAppearanceEditorCssVars(settings: CustomAppearanceSettings): Record<string, string> {
  const vars: Record<string, string> = {}
  const fontFamily = resolveFontFamily(settings)
  if (fontFamily) {
    vars['--editor-font-family'] = fontFamily
    vars['--inline-styles-code-font-family'] = fontFamily
  }

  if (settings.editorFontSize) {
    const size = settings.editorFontSize
    vars['--editor-font-size'] = `${size}px`
    vars['--inline-styles-code-font-size'] = `${Math.max(11, size - 1)}px`
    vars['--table-font-size'] = `${Math.max(11, size - 1)}px`
    vars['--headings-h1-font-size'] = `${Math.round(size * 2.1)}px`
    vars['--headings-h2-font-size'] = `${Math.round(size * 1.8)}px`
    vars['--headings-h3-font-size'] = `${Math.round(size * 1.35)}px`
    vars['--headings-h4-font-size'] = `${Math.round(size * 1.35)}px`
  }

  return vars
}

function resolveFontFamily(settings: CustomAppearanceSettings): string | null {
  if (settings.fontId === 'default') return null
  if (settings.fontId !== 'custom') return CUSTOM_FONT_FAMILIES[settings.fontId]

  return cssFontFamilyFromCustomInput(settings.customFontFamily)
}

function cssFontFamilyFromCustomInput(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.includes(',') || trimmed.includes('"') || trimmed.includes("'")) return trimmed

  return `'${trimmed.replace(/'/g, "\\'")}', sans-serif`
}

function resolveCustomThemeVars(settings: CustomAppearanceSettings): Record<string, string> | null {
  if (settings.themeId === 'default') return null
  if (settings.themeId !== 'custom') return CUSTOM_THEME_VAR_MAP[settings.themeId]

  return customThemeVarsFromInput(settings.customTheme)
}

function customThemeVarsFromInput(input: string): Record<string, string> | null {
  const normalizedName = input.trim().toLowerCase()
  const aliasedTheme = CUSTOM_THEME_ALIASES.get(normalizedName)
  if (aliasedTheme) return CUSTOM_THEME_VAR_MAP[aliasedTheme]

  try {
    const value = JSON.parse(input) as Record<string, unknown>
    return customThemeVarsFromJson(value)
  } catch {
    return null
  }
}

function customThemeVarsFromJson(value: Record<string, unknown>): Record<string, string> | null {
  const background = readColor(value, 'background') ?? readColor(value, 'bg')
  const surface = readColor(value, 'surface')
  const text = readColor(value, 'text') ?? readColor(value, 'foreground')
  const accent = readColor(value, 'accent')
  const border = readColor(value, 'border')
  if (!background && !surface && !text && !accent && !border) return null

  return {
    ...EVERFOREST_DARK_VARS,
    ...(background ? {
      '--surface-app': background,
      '--surface-editor': background,
      '--surface-input': background,
    } : {}),
    ...(surface ? {
      '--surface-sidebar': surface,
      '--surface-panel': surface,
      '--surface-card': surface,
      '--surface-popover': surface,
      '--surface-button': surface,
      '--surface-dialog': surface,
      '--editor-code-block-background': surface,
    } : {}),
    ...(text ? {
      '--text-primary': text,
      '--text-heading': text,
      '--editor-code-block-text': text,
    } : {}),
    ...(accent ? {
      '--accent-blue': accent,
      '--border-focus': accent,
      '--state-focus-ring': accent,
      '--primary': accent,
      '--sidebar-primary': accent,
      '--syntax-link': accent,
    } : {}),
    ...(border ? {
      '--border-default': border,
      '--border-input': border,
      '--border-dialog': border,
      '--editor-code-block-border': border,
    } : {}),
  }
}

function readColor(value: Record<string, unknown>, key: string): string | null {
  const color = value[key]
  return typeof color === 'string' && color.trim() ? color.trim() : null
}

export function applyCustomAppearanceToDocument(
  documentObject: CustomAppearanceDocument,
  settings: CustomAppearanceSettings,
): void {
  const root = documentObject.documentElement
  root.removeAttribute('data-custom-theme')
  for (const cssVar of CUSTOM_THEME_VARS) {
    root.style.removeProperty(cssVar)
  }
  for (const cssVar of CUSTOM_LAYOUT_FONT_SIZE_VARS) {
    root.style.removeProperty(cssVar)
  }

  if (settings.sidebarFontSize) {
    root.style.setProperty('--custom-sidebar-font-size', `${settings.sidebarFontSize}px`)
  }
  if (settings.noteListFontSize) {
    root.style.setProperty('--custom-note-list-font-size', `${settings.noteListFontSize}px`)
  }

  const themeVars = resolveCustomThemeVars(settings)
  if (!themeVars) return

  applyThemeModeToDocument(documentObject, 'dark')
  root.setAttribute('data-custom-theme', settings.themeId)
  for (const [cssVar, value] of Object.entries(themeVars)) {
    root.style.setProperty(cssVar, value)
  }
}

export function applyStoredCustomAppearance(
  documentObject: CustomAppearanceDocument,
  storage: CustomAppearanceStorage = window.localStorage,
): CustomAppearanceSettings {
  const settings = loadCustomAppearanceSettings(storage)
  applyCustomAppearanceToDocument(documentObject, settings)
  return settings
}

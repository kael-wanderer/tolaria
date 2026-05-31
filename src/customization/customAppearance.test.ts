import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CUSTOM_APPEARANCE_STORAGE_KEY,
  applyCustomAppearanceToDocument,
  customAppearanceEditorCssVars,
  loadCustomAppearanceSettings,
  normalizeCustomAppearanceSettings,
  saveCustomAppearanceSettings,
} from './customAppearance'

function makeStorage(initial: Record<string, string> = {}): Storage {
  const values = new Map(Object.entries(initial))
  return {
    get length() { return values.size },
    clear: vi.fn(() => values.clear()),
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    key: vi.fn((index: number) => Array.from(values.keys())[index] ?? null),
    removeItem: vi.fn((key: string) => { values.delete(key) }),
    setItem: vi.fn((key: string, value: string) => { values.set(key, value) }),
  }
}

describe('customAppearance', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-custom-theme')
    document.documentElement.removeAttribute('class')
    document.documentElement.removeAttribute('style')
  })

  it('normalizes unknown values back to defaults and clamps custom font size', () => {
    expect(normalizeCustomAppearanceSettings({
      themeId: 'unknown',
      fontId: 'bad-font',
      fontSize: 99,
    })).toEqual({
      themeId: 'default',
      customTheme: '',
      fontId: 'default',
      customFontFamily: '',
      sidebarFontSize: null,
      sidebarFontSizeMode: 'default',
      noteListFontSize: null,
      noteListFontSizeMode: 'default',
      editorFontSize: 40,
      editorFontSizeMode: 'preset',
    })
  })

  it('stores and loads the local customization payload', () => {
    const storage = makeStorage()

    saveCustomAppearanceSettings({
      themeId: 'everforest-dark',
      customTheme: '',
      fontId: 'iosevka-nerd-font-mono',
      customFontFamily: '',
      sidebarFontSize: 14,
      sidebarFontSizeMode: 'preset',
      noteListFontSize: 16,
      noteListFontSizeMode: 'preset',
      editorFontSize: 18,
      editorFontSizeMode: 'preset',
    }, storage)

    expect(storage.setItem).toHaveBeenCalledWith(
      CUSTOM_APPEARANCE_STORAGE_KEY,
      JSON.stringify({
        themeId: 'everforest-dark',
        customTheme: '',
        fontId: 'iosevka-nerd-font-mono',
        customFontFamily: '',
        sidebarFontSize: 14,
        sidebarFontSizeMode: 'preset',
        noteListFontSize: 16,
        noteListFontSizeMode: 'preset',
        editorFontSize: 18,
        editorFontSizeMode: 'preset',
      }),
    )
    expect(loadCustomAppearanceSettings(storage)).toEqual({
      themeId: 'everforest-dark',
      customTheme: '',
      fontId: 'iosevka-nerd-font-mono',
      customFontFamily: '',
      sidebarFontSize: 14,
      sidebarFontSizeMode: 'preset',
      noteListFontSize: 16,
      noteListFontSizeMode: 'preset',
      editorFontSize: 18,
      editorFontSizeMode: 'preset',
    })
  })

  it('exports editor CSS variable overrides for custom font and size', () => {
    expect(customAppearanceEditorCssVars({
      themeId: 'default',
      customTheme: '',
      fontId: 'iosevka-nerd-font-mono',
      customFontFamily: '',
      sidebarFontSize: null,
      sidebarFontSizeMode: 'default',
      noteListFontSize: null,
      noteListFontSizeMode: 'default',
      editorFontSize: 18,
      editorFontSizeMode: 'preset',
    })).toMatchObject({
      '--editor-font-family': expect.stringContaining('Iosevka Nerd Font Mono'),
      '--inline-styles-code-font-family': expect.stringContaining('Iosevka Nerd Font Mono'),
      '--editor-font-size': '18px',
      '--inline-styles-code-font-size': '17px',
    })
  })

  it('applies Everforest Dark as a dark-mode overlay and removes it when reset', () => {
    applyCustomAppearanceToDocument(document, {
      themeId: 'everforest-dark',
      customTheme: '',
      fontId: 'default',
      customFontFamily: '',
      sidebarFontSize: 12,
      sidebarFontSizeMode: 'preset',
      noteListFontSize: 14,
      noteListFontSizeMode: 'preset',
      editorFontSize: null,
      editorFontSizeMode: 'default',
    })

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(document.documentElement).toHaveAttribute('data-custom-theme', 'everforest-dark')
    expect(document.documentElement.style.getPropertyValue('--surface-app')).toBe('#1e2326')
    expect(document.documentElement.style.getPropertyValue('--custom-sidebar-font-size')).toBe('12px')
    expect(document.documentElement.style.getPropertyValue('--custom-note-list-font-size')).toBe('14px')

    applyCustomAppearanceToDocument(document, {
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
    })

    expect(document.documentElement).not.toHaveAttribute('data-custom-theme')
    expect(document.documentElement.style.getPropertyValue('--surface-app')).toBe('')
    expect(document.documentElement.style.getPropertyValue('--custom-sidebar-font-size')).toBe('')
    expect(document.documentElement.style.getPropertyValue('--custom-note-list-font-size')).toBe('')
  })

  it('accepts custom font names and custom theme aliases', () => {
    expect(customAppearanceEditorCssVars({
      themeId: 'custom',
      customTheme: 'Tokyo Night',
      fontId: 'custom',
      customFontFamily: 'Berkeley Mono',
      sidebarFontSize: null,
      sidebarFontSizeMode: 'default',
      noteListFontSize: null,
      noteListFontSizeMode: 'default',
      editorFontSize: 30,
      editorFontSizeMode: 'custom',
    })).toMatchObject({
      '--editor-font-family': "'Berkeley Mono', sans-serif",
      '--editor-font-size': '30px',
    })

    applyCustomAppearanceToDocument(document, {
      themeId: 'custom',
      customTheme: 'Tokyo Night',
      fontId: 'default',
      customFontFamily: '',
      sidebarFontSize: null,
      sidebarFontSizeMode: 'default',
      noteListFontSize: null,
      noteListFontSizeMode: 'default',
      editorFontSize: null,
      editorFontSizeMode: 'default',
    })

    expect(document.documentElement).toHaveAttribute('data-custom-theme', 'custom')
    expect(document.documentElement.style.getPropertyValue('--surface-app')).toBe('#1a1b26')
  })
})

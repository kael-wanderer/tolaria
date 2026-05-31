import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { CUSTOM_APPEARANCE_STORAGE_KEY } from '../customization/customAppearance'
import { useEditorTheme } from './useTheme'

describe('useEditorTheme', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('keeps inline code on the muted editor surface without exporting code block overrides', () => {
    const { result } = renderHook(() => useEditorTheme())

    expect(result.current.cssVars['--inline-styles-code-background-color']).toBe(
      'var(--bg-hover-subtle)'
    )
    expect(result.current.cssVars['--code-blocks-background-color']).toBeUndefined()
  })

  it('merges local customization overrides into editor CSS variables', () => {
    window.localStorage.setItem(CUSTOM_APPEARANCE_STORAGE_KEY, JSON.stringify({
      themeId: 'default',
      customTheme: '',
      fontId: 'iosevka-nerd-font-mono',
      customFontFamily: '',
      sidebarFontSize: null,
      sidebarFontSizeMode: 'default',
      noteListFontSize: null,
      noteListFontSizeMode: 'default',
      editorFontSize: 20,
      editorFontSizeMode: 'preset',
    }))

    const { result } = renderHook(() => useEditorTheme())

    expect(result.current.cssVars['--editor-font-family']).toContain('Iosevka Nerd Font Mono')
    expect(result.current.cssVars['--editor-font-size']).toBe('20px')
  })
})

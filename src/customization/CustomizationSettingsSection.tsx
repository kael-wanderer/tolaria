import { NumberInputControl, SelectControl, SettingsGroup, SettingsRow } from '../components/SettingsControls'
import { Input } from '../components/ui/input'
import { applyStoredThemeMode } from '../lib/themeMode'
import type { TranslationKey } from '../lib/i18n'
import {
  CUSTOM_FONT_SIZE_PRESETS,
  applyStoredCustomAppearance,
  type CustomFontSizeMode,
  type CustomAppearanceSettings,
  type CustomFontId,
  type CustomThemeId,
} from './customAppearance'
import { useCustomAppearanceSettings } from './useCustomAppearance'

type Translate = (key: TranslationKey) => string

const CUSTOM_FONT_SIZE_CUSTOM = 'custom'
const CUSTOM_FONT_SIZE_DEFAULT = 'default'

export function CustomizationSettingsSection({ t }: { t: Translate }) {
  const [settings, saveSettings] = useCustomAppearanceSettings()

  const updateSettings = (patch: Partial<CustomAppearanceSettings>) => {
    saveSettings({ ...settings, ...patch })
    if (typeof document === 'undefined') return
    applyStoredThemeMode(document, window.localStorage)
    applyStoredCustomAppearance(document, window.localStorage)
  }

  return (
    <SettingsGroup>
      <SettingsRow
        label={t('settings.customization.theme.label')}
        description={t('settings.customization.theme.description')}
      >
        <SelectControl
          ariaLabel={t('settings.customization.theme.label')}
          value={settings.themeId}
          onValueChange={(value) => updateSettings({ themeId: value as CustomThemeId })}
          options={[
            { value: 'default', label: t('settings.customization.theme.default') },
            { value: 'catppuccin-mocha', label: t('settings.customization.theme.catppuccinMocha') },
            { value: 'everforest-dark', label: t('settings.customization.theme.everforestDark') },
            { value: 'nord', label: t('settings.customization.theme.nord') },
            { value: 'tokyo-night', label: t('settings.customization.theme.tokyoNight') },
            { value: 'dracula', label: t('settings.customization.theme.dracula') },
            { value: 'gruvbox-dark', label: t('settings.customization.theme.gruvboxDark') },
            { value: 'custom', label: t('settings.customization.theme.custom') },
          ]}
          testId="settings-custom-theme"
        />
        {settings.themeId === 'custom' ? (
          <Input
            aria-label={t('settings.customization.theme.customInput')}
            className="mt-2 bg-transparent"
            data-testid="settings-custom-theme-input"
            placeholder={t('settings.customization.theme.customPlaceholder')}
            value={settings.customTheme}
            onChange={(event) => updateSettings({ customTheme: event.target.value })}
          />
        ) : null}
      </SettingsRow>

      <SettingsRow
        label={t('settings.customization.font.label')}
        description={t('settings.customization.font.description')}
      >
        <SelectControl
          ariaLabel={t('settings.customization.font.label')}
          value={settings.fontId}
          onValueChange={(value) => updateSettings({ fontId: value as CustomFontId })}
          options={[
            { value: 'default', label: t('settings.customization.font.default') },
            { value: 'inter', label: t('settings.customization.font.inter') },
            { value: 'georgia', label: t('settings.customization.font.georgia') },
            { value: 'merriweather', label: t('settings.customization.font.merriweather') },
            { value: 'jetbrains-mono', label: t('settings.customization.font.jetbrainsMono') },
            { value: 'sf-mono', label: t('settings.customization.font.sfMono') },
            { value: 'menlo', label: t('settings.customization.font.menlo') },
            { value: 'iosevka-nerd-font-mono', label: t('settings.customization.font.iosevkaNerdFontMono') },
            { value: 'custom', label: t('settings.customization.font.custom') },
          ]}
          testId="settings-custom-font"
        />
        {settings.fontId === 'custom' ? (
          <Input
            aria-label={t('settings.customization.font.customInput')}
            className="mt-2 bg-transparent"
            data-testid="settings-custom-font-input"
            placeholder={t('settings.customization.font.customPlaceholder')}
            value={settings.customFontFamily}
            onChange={(event) => updateSettings({ customFontFamily: event.target.value })}
          />
        ) : null}
      </SettingsRow>

      <FontSizeSettingsRow
        label={t('settings.customization.fontSize.sidebarLabel')}
        description={t('settings.customization.fontSize.sidebarDescription')}
        value={settings.sidebarFontSize}
        mode={settings.sidebarFontSizeMode}
        testId="settings-custom-sidebar-font-size"
        onChange={(patch) => updateSettings({
          sidebarFontSize: patch.fontSize,
          sidebarFontSizeMode: patch.fontSizeMode,
        })}
        t={t}
      />

      <FontSizeSettingsRow
        label={t('settings.customization.fontSize.noteListLabel')}
        description={t('settings.customization.fontSize.noteListDescription')}
        value={settings.noteListFontSize}
        mode={settings.noteListFontSizeMode}
        testId="settings-custom-note-list-font-size"
        onChange={(patch) => updateSettings({
          noteListFontSize: patch.fontSize,
          noteListFontSizeMode: patch.fontSizeMode,
        })}
        t={t}
      />

      <FontSizeSettingsRow
        label={t('settings.customization.fontSize.editorLabel')}
        description={t('settings.customization.fontSize.editorDescription')}
        value={settings.editorFontSize}
        mode={settings.editorFontSizeMode}
        testId="settings-custom-editor-font-size"
        onChange={(patch) => updateSettings({
          editorFontSize: patch.fontSize,
          editorFontSizeMode: patch.fontSizeMode,
        })}
        t={t}
      />
    </SettingsGroup>
  )
}

interface FontSizeSettingsRowProps {
  label: string
  description: string
  value: number | null
  mode: CustomFontSizeMode
  testId: string
  onChange: (patch: FontSizePatch) => void
  t: Translate
}

function FontSizeSettingsRow({
  label,
  description,
  value,
  mode,
  testId,
  onChange,
  t,
}: FontSizeSettingsRowProps) {
  const selection = fontSizeSelection(value, mode)

  return (
    <SettingsRow label={label} description={description}>
      <div className="grid gap-2">
        <SelectControl
          ariaLabel={label}
          value={selection}
          onValueChange={(selectedValue) => onChange(fontSizePatchFromSelection(selectedValue, value))}
          options={[
            { value: CUSTOM_FONT_SIZE_DEFAULT, label: t('settings.customization.fontSize.default') },
            ...CUSTOM_FONT_SIZE_PRESETS.map((preset) => ({ value: `${preset}`, label: `${preset}px` })),
            { value: CUSTOM_FONT_SIZE_CUSTOM, label: t('settings.customization.fontSize.custom') },
          ]}
          testId={testId}
        />
        {selection === CUSTOM_FONT_SIZE_CUSTOM ? (
          <NumberInputControl
            ariaLabel={t('settings.customization.fontSize.custom')}
            value={value ?? 16}
            onValueChange={(nextValue) => onChange({ fontSize: nextValue, fontSizeMode: 'custom' })}
            testId={`${testId}-input`}
          />
        ) : null}
      </div>
    </SettingsRow>
  )
}

function fontSizeSelection(value: number | null, mode: CustomFontSizeMode): string {
  if (mode === CUSTOM_FONT_SIZE_CUSTOM) return CUSTOM_FONT_SIZE_CUSTOM
  if (!value) return CUSTOM_FONT_SIZE_DEFAULT
  return CUSTOM_FONT_SIZE_PRESETS.includes(value as typeof CUSTOM_FONT_SIZE_PRESETS[number])
    ? `${value}`
    : CUSTOM_FONT_SIZE_CUSTOM
}

interface FontSizePatch {
  fontSize: number | null
  fontSizeMode: CustomFontSizeMode
}

function fontSizePatchFromSelection(
  selection: string,
  currentSize: number | null,
): FontSizePatch {
  if (selection === CUSTOM_FONT_SIZE_DEFAULT) {
    return { fontSize: null, fontSizeMode: 'default' }
  }
  if (selection === CUSTOM_FONT_SIZE_CUSTOM) {
    return { fontSize: currentSize ?? 16, fontSizeMode: 'custom' }
  }

  return { fontSize: Number(selection), fontSizeMode: 'preset' }
}

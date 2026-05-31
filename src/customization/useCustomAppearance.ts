import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { applyStoredThemeMode } from '../lib/themeMode'
import {
  CUSTOM_APPEARANCE_CHANGE_EVENT,
  DEFAULT_CUSTOM_APPEARANCE,
  applyStoredCustomAppearance,
  loadCustomAppearanceSettings,
  saveCustomAppearanceSettings,
  type CustomAppearanceSettings,
} from './customAppearance'

const SERVER_SNAPSHOT = DEFAULT_CUSTOM_APPEARANCE
let cachedSnapshotKey = JSON.stringify(SERVER_SNAPSHOT)
let cachedSnapshot: CustomAppearanceSettings = SERVER_SNAPSHOT

function readCustomAppearanceSnapshot(): CustomAppearanceSettings {
  if (typeof window === 'undefined') return SERVER_SNAPSHOT

  const nextSnapshot = loadCustomAppearanceSettings(window.localStorage)
  const nextSnapshotKey = JSON.stringify(nextSnapshot)
  if (nextSnapshotKey === cachedSnapshotKey) return cachedSnapshot

  cachedSnapshotKey = nextSnapshotKey
  cachedSnapshot = nextSnapshot
  return cachedSnapshot
}

function subscribeCustomAppearance(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {}

  window.addEventListener(CUSTOM_APPEARANCE_CHANGE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(CUSTOM_APPEARANCE_CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

export function useCustomAppearanceSettings(): [
  CustomAppearanceSettings,
  (settings: CustomAppearanceSettings) => CustomAppearanceSettings,
] {
  const settings = useSyncExternalStore(
    subscribeCustomAppearance,
    readCustomAppearanceSnapshot,
    () => SERVER_SNAPSHOT,
  )
  const saveSettings = useCallback((nextSettings: CustomAppearanceSettings) => {
    return saveCustomAppearanceSettings(nextSettings)
  }, [])

  return [settings, saveSettings]
}

export function useCustomAppearanceRuntime(themeModeDependency?: unknown): void {
  const [settings] = useCustomAppearanceSettings()

  useEffect(() => {
    if (typeof document === 'undefined') return
    applyStoredThemeMode(document, window.localStorage)
    applyStoredCustomAppearance(document)
  }, [settings, themeModeDependency])
}

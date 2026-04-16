import { DEFAULT_SETTINGS, LS_KEY_SETTINGS } from '../constants'
import type { UserSettings } from '../types'

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(LS_KEY_SETTINGS)
    if (!raw) return { ...DEFAULT_SETTINGS }
    const parsed = JSON.parse(raw) as Partial<UserSettings>
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(LS_KEY_SETTINGS, JSON.stringify(settings))
}

export function applyTheme(theme: 'dark' | 'light'): void {
  if (theme === 'light') {
    document.documentElement.classList.add('light')
  } else {
    document.documentElement.classList.remove('light')
  }
}

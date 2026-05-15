import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { messages } from './messages'

const STORAGE_KEY = 'marts-camp-lang'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === 'undefined') return 'ro'
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'ru' || saved === 'ro') return saved
    return 'ro'
  })

  const setLang = useCallback((next) => {
    if (next !== 'ru' && next !== 'ro') return
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === 'ru' ? 'ro' : 'ru')
  }, [lang, setLang])

  useEffect(() => {
    document.documentElement.lang = lang === 'ro' ? 'ro' : 'ru'
    document.title =
      lang === 'ro'
        ? 'MARTS FITNESS — Vară pe drive! Tabăra de fitness pentru copii'
        : 'MARTS FITNESS — Лето на драйве! Детский фитнес-лагерь'
  }, [lang])

  const t = useMemo(() => {
    return (path) => {
      const keys = path.split('.')
      let cur = messages[lang]
      for (const k of keys) {
        if (cur == null) return path
        cur = cur[k]
      }
      return cur ?? path
    }
  }, [lang])

  const m = messages[lang]

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t, m }),
    [lang, setLang, toggleLang, t, m],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}

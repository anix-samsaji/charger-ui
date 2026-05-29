import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Theme } from '../types'

interface ThemeCtx {
  theme:       Theme
  toggleTheme: (e?: React.MouseEvent) => void
}

const ThemeContext = createContext<ThemeCtx>({ theme: 'dark', toggleTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('charger-theme')
    if (stored === 'light' || stored === 'dark') return stored
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('charger-theme', theme)
  }, [theme])

  const toggleTheme = useCallback((e?: React.MouseEvent) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'

    // View Transition API circular reveal from button position
    if ('startViewTransition' in document && e) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const x    = Math.round(rect.left + rect.width  / 2)
      const y    = Math.round(rect.top  + rect.height / 2)
      document.documentElement.style.setProperty('--vt-x', `${x}px`)
      document.documentElement.style.setProperty('--vt-y', `${y}px`)
      ;(document as any).startViewTransition(() => { setTheme(next) })
    } else {
      setTheme(next)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

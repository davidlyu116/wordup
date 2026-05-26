import { useState, useEffect } from 'react'

export function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('wordup_theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('wordup_theme', dark ? 'dark' : 'light')
  }, [dark])

  return { dark, toggle: () => setDark(d => !d) }
}

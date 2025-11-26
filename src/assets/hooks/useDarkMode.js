import { useState, useEffect } from 'react'

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage and system preference
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode !== null) {
      return JSON.parse(savedMode)
    }
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // Apply dark mode to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Save to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))

    // Broadcast to other subscribers in the same window/tab so that multiple
    // hook instances stay in sync (avoids conflicting local hook states)
    try {
      const ev = new CustomEvent('darkModeToggle', { detail: { isDarkMode } })
      window.dispatchEvent(ev)
    } catch (err) {
      // ignore (older browsers)
    }
  }, [isDarkMode])

  // Keep this hook instances in sync with toggles from other components
  useEffect(() => {
    const handler = (e) => {
      if (!e?.detail) return
      const next = !!e.detail.isDarkMode
      setIsDarkMode(next)
    }
    window.addEventListener('darkModeToggle', handler)
    return () => window.removeEventListener('darkModeToggle', handler)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return { isDarkMode, toggleDarkMode }
}

export default useDarkMode
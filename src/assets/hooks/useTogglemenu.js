import { useState } from 'react'

const useToggleMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const openMenu = () => {
    setIsMenuOpen(true)
  }

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    openMenu
  }
}

export default useToggleMenu
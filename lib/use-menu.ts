'use client'

import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_MENU, type MenuItem } from './menu-data'

const MENU_KEY = 'faz3ah_menu_v3'

function readMenu(): MenuItem[] {
  if (typeof window === 'undefined') return DEFAULT_MENU
  try {
    const raw = window.localStorage.getItem(MENU_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MENU
    }
  } catch {
    return DEFAULT_MENU
  }
  return DEFAULT_MENU
}

export function useMenu() {
  const [menu, setMenu] = useState<MenuItem[]>(DEFAULT_MENU)

  useEffect(() => {
    setMenu(readMenu())
  }, [])

  const addItem = useCallback((item: MenuItem) => {
    const updated = [...readMenu(), item]
    window.localStorage.setItem(MENU_KEY, JSON.stringify(updated))
    setMenu(updated)
  }, [])

  const updateItem = useCallback((item: MenuItem) => {
    const updated = readMenu().map((m) => (m.id === item.id ? item : m))
    window.localStorage.setItem(MENU_KEY, JSON.stringify(updated))
    setMenu(updated)
  }, [])

  const removeItem = useCallback((id: string) => {
    const updated = readMenu().filter((m) => m.id !== id)
    window.localStorage.setItem(MENU_KEY, JSON.stringify(updated))
    setMenu(updated)
  }, [])

  return { menu, addItem, updateItem, removeItem }
}
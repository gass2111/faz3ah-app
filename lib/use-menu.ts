'use client'

import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_MENU, type MenuItem } from './menu-data'

const MENU_KEY = 'faz3ah_menu_v3'

let listeners: Array<() => void> = []
let memoryMenu: MenuItem[] | null = null

function readMenu(): MenuItem[] {
  if (memoryMenu) return memoryMenu
  if (typeof window === 'undefined') return DEFAULT_MENU
  try {
    const raw = window.localStorage.getItem(MENU_KEY)
    if (raw) {
      memoryMenu = JSON.parse(raw) as MenuItem[]
      // التأكد من أن كل منتج قديم يحتوي على متجر افتراضي إذا لم يتوفر
      return memoryMenu.map(item => ({
        ...item,
        shopId: item.shopId || 'abu_halima'
      }))
    }
  } catch {
    // تجاهل الأخطاء
  }
  memoryMenu = DEFAULT_MENU
  return memoryMenu
}

function writeMenu(menu: MenuItem[]) {
  memoryMenu = menu
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(MENU_KEY, JSON.stringify(menu))
  }
  listeners.forEach((l) => l())
}

export function useMenu() {
  const [menu, setMenu] = useState<MenuItem[]>(DEFAULT_MENU)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setMenu(readMenu())
    setReady(true)
    const listener = () => setMenu([...readMenu()])
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  const addItem = useCallback((item: MenuItem) => {
    writeMenu([...readMenu(), item])
  }, [])

  const updateItem = useCallback((item: MenuItem) => {
    writeMenu(readMenu().map((m) => (m.id === item.id ? item : m)))
  }, [])

  const removeItem = useCallback((id: string) => {
    writeMenu(readMenu().filter((m) => m.id !== id))
  }, [])

  const resetMenu = useCallback(() => {
    writeMenu(DEFAULT_MENU)
  }, [])

  return { menu, ready, addItem, updateItem, removeItem, resetMenu }
}
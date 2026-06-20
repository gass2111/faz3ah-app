'use client'

import { useCallback, useEffect, useState } from 'react'
import type { MenuItem } from './menu-data'

const CART_KEY = 'faz3ah_cart_v1'

export type CartLine = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

let listeners: Array<() => void> = []
let memoryCart: CartLine[] | null = null

function readCart(): CartLine[] {
  if (memoryCart) return memoryCart
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_KEY)
    memoryCart = raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    memoryCart = []
  }
  return memoryCart
}

function writeCart(cart: CartLine[]) {
  memoryCart = cart
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }
  listeners.forEach((l) => l())
}

export function useCart() {
  const [cart, setCart] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setCart(readCart())
    setReady(true)
    const listener = () => setCart([...readCart()])
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  const addToCart = useCallback((item: MenuItem) => {
    const current = readCart()
    const existing = current.find((l) => l.id === item.id)
    if (existing) {
      writeCart(
        current.map((l) =>
          l.id === item.id ? { ...l, quantity: l.quantity + 1 } : l,
        ),
      )
    } else {
      writeCart([
        ...current,
        { id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 },
      ])
    }
  }, [])

  const setQuantity = useCallback((id: string, quantity: number) => {
    const current = readCart()
    if (quantity <= 0) {
      writeCart(current.filter((l) => l.id !== id))
    } else {
      writeCart(current.map((l) => (l.id === id ? { ...l, quantity } : l)))
    }
  }, [])

  // التعديل الذكي هنا: دالة الحذف الحين تنقص حبة حبة بذكاء
  const removeFromCart = useCallback((id: string) => {
    const current = readCart()
    const existing = current.find((l) => l.id === id)
    
    if (existing && existing.quantity > 1) {
      // إذا كانت الكمية أكثر من حبة، نقص حبة واحدة فقط
      writeCart(
        current.map((l) =>
          l.id === id ? { ...l, quantity: l.quantity - 1 } : l,
        ),
      )
    } else {
      // إذا كانت حبة واحدة أو أقل، احذف الصنف تماماً من السلة
      writeCart(current.filter((l) => l.id !== id))
    }
  }, [])

  const clearCart = useCallback(() => {
    writeCart([])
  }, [])

  const totalItems = cart.reduce((sum, l) => sum + l.quantity, 0)
  const totalPrice = cart.reduce((sum, l) => sum + l.quantity * l.price, 0)

  return {
    cart,
    ready,
    addToCart,
    setQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  }
}
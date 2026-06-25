'use client'

import { useEffect, useState } from 'react'
import { type MenuItem } from './menu-data'
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore"
import { db } from "./firebase"

export function useMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([])

  useEffect(() => {
    const colRef = collection(db, "menuItems")
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const items: MenuItem[] = []
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as MenuItem)
      })
      const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values())
      setMenu(uniqueItems)
    })
    return () => unsubscribe()
  }, [])

  // دالة الإضافة (تستخدم setDoc)
  const addItem = async (item: MenuItem) => {
    const id = item.id || `item_${Date.now()}`
    const docRef = doc(db, "menuItems", id)
    await setDoc(docRef, { ...item, id })
  }

  // دالة التحديث
  const updateItem = async (item: MenuItem) => {
    if (!item.id) return
    const docRef = doc(db, "menuItems", item.id)
    await setDoc(docRef, item, { merge: true })
  }

  // دالة الحذف
  const removeItem = async (id: string) => {
    if (!id) return
    const docRef = doc(db, "menuItems", id)
    await deleteDoc(docRef)
  }

  // دالة إضافية إذا كنت تستخدمها في صفحة الإدارة
  const resetMenu = () => setMenu([])

  return { menu, addItem, updateItem, removeItem, resetMenu }
}
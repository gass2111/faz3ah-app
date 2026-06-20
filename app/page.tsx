'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, LayoutDashboard, ArrowRight, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SplashScreen } from '@/components/splash-screen'
import { MenuItemCard } from '@/components/menu-item-card'
import { CartSheet } from '@/components/cart-sheet'
import { useMenu } from '@/lib/use-menu'
import { useCart } from '@/lib/use-cart'
import { SHOPS, CATEGORY_ORDER, CATEGORY_LABELS, type ShopId } from '@/lib/menu-data'

const DEFAULT_BANNERS = [
  { id: 'default-1', title: "عروض الجمعة البيضاء", description: "خصومات تصل إلى 50%", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop" },
  { id: 'default-2', title: "مخبوزات طازجة", description: "احصل على خبزك الحار", image: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?q=80&w=800&auto=format&fit=crop" },
]

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)
  const [selectedShop, setSelectedShop] = useState<ShopId | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [shopImages, setShopImages] = useState<Record<string, string>>({})
  const [banners, setBanners] = useState(DEFAULT_BANNERS)
  const [currentSlide, setCurrentSlide] = useState(0)

  const { menu } = useMenu()
  const { cart, addToCart, removeFromCart, totalPrice } = useCart()

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const loadData = () => {
      const savedShops = localStorage.getItem('faz3ah_shop_images')
      if (savedShops) try { setShopImages(JSON.parse(savedShops)) } catch (e) { console.error(e) }
    }
    loadData()
  }, [])

  if (showSplash) return <SplashScreen />

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0)
  const filteredMenu = menu.filter((item) => (item.available ?? true) && (!selectedShop || item.shopId === selectedShop))
  const currentSelectedShopData = SHOPS.find(s => s.id === selectedShop)

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-[#FDF8F5] pb-32" dir="rtl">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gold/30 bg-primary px-4 py-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative size-11 flex-shrink-0 overflow-hidden rounded-full border-2 border-gold bg-white">
            <Image src="/logo.png" alt="فزعة" fill className="object-cover" />
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <h1 className="font-heading text-xl font-900 leading-none text-gold">فزعة للتسوق</h1>
            <span className="text-[10px] text-primary-foreground/70">أصالة وفخامة في كل طلب</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className="size-9 text-primary-foreground/70" onClick={() => window.location.href = '/admin'}>
            <LayoutDashboard className="size-5" />
          </Button>
          <Button size="icon" variant="ghost" className="relative size-9 text-primary-foreground/70" onClick={() => setCartOpen(true)}>
            <ShoppingCart className="size-5" />
            {totalCartItems > 0 && <Badge className="absolute -right-0.5 -top-0.5 h-5 min-w-5 flex items-center justify-center rounded-full bg-gold p-1 text-xs text-gold-foreground">{totalCartItems}</Badge>}
          </Button>
        </div>
      </header>

      {!selectedShop ? (
        <section className="px-4 pt-6">
          <h2 className="font-heading text-base font-800 text-foreground mb-4 text-right">اختر المحل المفضل لديك:</h2>
          <div className="grid grid-cols-2 gap-4">
            {SHOPS.map((shop) => (
              <button key={shop.id} onClick={() => setSelectedShop(shop.id)} className="flex flex-col items-center gap-3 rounded-2xl border p-5 bg-card hover:border-primary">
                <img src={shopImages[shop.id] || shop.image} className="size-16 rounded-full object-cover" alt={shop.name} />
                <span className="text-sm font-800">{shop.name}</span>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <div className="p-4">
          <button onClick={() => setSelectedShop(null)} className="mb-4 text-sm font-800 text-primary flex items-center gap-1"><ArrowRight className="size-4" /> عودة</button>
          {CATEGORY_ORDER.map((cat) => {
            const items = filteredMenu.filter((i) => i.category === cat)
            if (items.length === 0) return null
            return (
              <div key={cat} className="mb-6">
                <h2 className="font-heading text-base font-800 mb-3">{CATEGORY_LABELS[cat]}</h2>
                {items.map((item) => <MenuItemCard key={item.id} item={item} onAdd={addToCart} onRemove={() => removeFromCart(item.id)} quantity={cart.find(c => c.id === item.id)?.quantity || 0} />)}
              </div>
            )
          })}
        </div>
      )}
{/* الفوتر - هذا التنسيق هو اللي كان يظهر الاسم */}
      <footer className="w-full pt-16 pb-6 text-center" dir="ltr">
        <Link 
          href="https://www.instagram.com/GASS_211" 
          target="_blank" 
          className="text-xs font-500 text-muted-foreground/60 hover:text-primary transition-colors duration-300"
        >
          Developer by Mahmoud Al-Ali
        </Link>
      </footer>

      {totalCartItems > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-2xl p-4">
          <Button onClick={() => setCartOpen(true)} className="flex h-14 w-full items-center justify-between rounded-full bg-primary px-6 text-base font-700 text-primary-foreground shadow-xl">
             <div className="flex items-center gap-2"><ShoppingBag className="size-5 text-gold" /> عرض السلة</div>
             <div className="flex items-center gap-2"><span>{totalPrice.toFixed(2)} د.أ</span><span className="flex size-7 items-center justify-center rounded-full bg-gold text-sm font-900 text-gold-foreground">{totalCartItems}</span></div>
          </Button>
        </div>
      )}
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  )
}
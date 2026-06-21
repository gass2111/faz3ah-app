'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, LayoutDashboard, ArrowRight, ShoppingBag, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SplashScreen } from '@/components/splash-screen'
import { MenuItemCard } from '@/components/menu-item-card'
import { CartSheet } from '@/components/cart-sheet'
import { useMenu } from '@/lib/use-menu'
import { useCart } from '@/lib/use-cart'
import { SHOPS, CATEGORY_ORDER, CATEGORY_LABELS, type MenuItem } from '@/lib/menu-data'
export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)
  const [selectedShop, setSelectedShop] = useState<ShopId | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [shopImages, setShopImages] = useState<Record<string, string>>({})
  const [banners, setBanners] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // الـ State الخاص بنص البحث
  const [searchQuery, setSearchQuery] = useState('')

  const { menu } = useMenu()
  const { cart, addToCart, removeFromCart, totalPrice } = useCart()



  
  // تفريغ خانة البحث تلقائياً عند تغيير المحل أو العودة للخلف
  useEffect(() => {
    setSearchQuery('')
  }, [selectedShop])

  // التنقل التلقائي للبنرات كل 3 ثواني
  useEffect(() => {
    if (banners.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [banners])

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const loadData = () => {
      const savedShops = localStorage.getItem('faz3ah_shop_images')
      if (savedShops) try { setShopImages(JSON.parse(savedShops)) } catch (e) { console.error(e) }
      
      const savedBanners = localStorage.getItem('faz3ah_custom_banners')
      if (savedBanners) {
        try { setBanners(JSON.parse(savedBanners)) } catch (e) { console.error(e) }
      }
    }
    loadData()
    window.addEventListener('storage', loadData)
    return () => window.removeEventListener('storage', loadData)
  }, [])

  if (showSplash) return <SplashScreen />

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0)
  
  // تصفية القائمة بناءً على المحل المختار وحالة تفعيل المنتج، إضافةً لتصفية نص البحث
  const filteredMenu = menu.filter((item) => {
    const isAvailable = item.available ?? true
    const matchesShop = !selectedShop || item.shopId === selectedShop
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    return isAvailable && matchesShop && matchesSearch
  })

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

      {/* قسم السلايدر للبنرات */}
      {banners.length > 0 && (
  <section className="px-4 pt-4">
    <div className="relative h-40 w-full overflow-hidden rounded-2xl shadow-lg">
      {banners.map((b, index) => (
        <div key={b.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
          {/* الصورة الآن ستكون ساطعة وواضحة تماماً */}
          <img src={b.image} alt={b.title} className="h-full w-full object-cover" />

          {/* تمت إزالة الـ overlay الأسود والنصوص بالكامل */}
        </div>
      ))}
    </div>
    {/* ابقي كود مؤشرات النقاط كما هو إذا أردت استمراريتها */}
    <div className="flex justify-center gap-2 mt-2">
      {banners.map((_, index) => (
        <button key={index} className={`size-2 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-gray-300'}`} onClick={() => setCurrentIndex(index)} />
      ))}
    </div>
  </section>
)}

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
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setSelectedShop(null)} className="text-sm font-800 text-primary flex items-center gap-1">
              <ArrowRight className="size-4" /> عودة
            </button>
          </div>

          {/* خانة البحث المصممة بتناسق مع التطبيق والدعم للغة العربية */}
          <div className="relative flex items-center mb-6">
            <input
              type="text"
              placeholder="ابحث عن الأصالة والفخامة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 text-sm text-right text-foreground bg-card border border-border rounded-full shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
            />
            <Search className="absolute right-3.5 size-4 text-muted-foreground/60" />
          </div>

          {/* عرض المنتجات بناءً على الفلترة */}
          {CATEGORY_ORDER.some(cat => filteredMenu.some(i => i.category === cat)) ? (
            CATEGORY_ORDER.map((cat) => {
              const items = filteredMenu.filter((i) => i.category === cat)
              if (items.length === 0) return null
              return (
                <div key={cat} className="mb-6">
                  <h2 className="font-heading text-base font-800 mb-3">{CATEGORY_LABELS[cat]}</h2>
                  {items.map((item) => (
                    <MenuItemCard 
                      key={item.id} 
                      item={item} 
                      onAdd={addToCart} 
                      onRemove={() => removeFromCart(item.id)} 
                      quantity={cart.find(c => c.id === item.id)?.quantity || 0} 
                    />
                  ))}
                </div>
              )
            })
          ) : (
            <div className="text-center py-12 text-sm text-muted-foreground/80 font-500">
              لا توجد منتجات تطابق بحثك في هذا المحل.
            </div>
          )}
        </div>
      )}

      <footer className="w-full pt-16 pb-6 text-center" dir="ltr">
        <Link href="https://www.instagram.com/GASS_211" target="_blank" className="text-xs font-500 text-muted-foreground/60 hover:text-primary transition-colors duration-300">
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
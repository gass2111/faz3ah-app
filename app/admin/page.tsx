'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Lock, Pencil, Plus, RotateCcw, Trash2, Eye, EyeOff, Store, ImagePlus, Loader2, Images, LayoutList } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ItemFormDialog } from '@/components/item-form-dialog'
import { useMenu } from '@/lib/use-menu'
import { CATEGORY_LABELS, SHOPS, type MenuItem, type ShopId } from '@/lib/menu-data'
import { db } from "@/lib/firebase"
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore"

const ADMIN_PASSWORD = 'omar000999'

interface CustomBanner {
  id: string
  title: string
  description: string
  image: string
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const { menu, addItem, updateItem, removeItem, resetMenu } = useMenu()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<MenuItem | null>(null)

  const [shopImages, setShopImages] = useState<Record<string, string>>({})
  const [uploadingShopId, setUploadingShopId] = useState<string | null>(null)
  const shopFileInputRef = useRef<HTMLInputElement>(null)

  const [banners, setBanners] = useState<CustomBanner[]>([])
  const [bannerTitle, setBannerTitle] = useState('')
  const [bannerDesc, setBannerDesc] = useState('')
  const [bannerImage, setBannerImage] = useState('')

  const [categories, setCategories] = useState<string[]>(['مشروبات', 'حلويات', 'وجبات رئيسية'])
  const [newCat, setNewCat] = useState('')

  // دالة معالجة الصور الموحدة
  const processImage = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx!.fillStyle = '#FFFFFF';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
        ctx!.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.4));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "banners"), (snapshot) => {
      const bannersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CustomBanner))
      setBanners(bannersData)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const savedImages = localStorage.getItem('faz3ah_shop_images')
    if (savedImages) { try { setShopImages(JSON.parse(savedImages)) } catch (e) { console.error(e) } }
    const savedCats = localStorage.getItem('faz3ah_categories')
    if (savedCats) { try { setCategories(JSON.parse(savedCats)) } catch (e) { console.error(e) } }
  }, [])

  const handleAddCategory = () => {
    if (!newCat.trim()) return
    const updated = [...categories, newCat]
    setCategories(updated)
    localStorage.setItem('faz3ah_categories', JSON.stringify(updated))
    setNewCat('')
    toast.success('تمت إضافة القسم بنجاح')
  }

  const handleDeleteCategory = (cat: string) => {
    const updated = categories.filter(c => c !== cat)
    setCategories(updated)
    localStorage.setItem('faz3ah_categories', JSON.stringify(updated))
    toast.info('تم حذف القسم')
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      toast.success('مرحباً بك في لوحة التحكم')
    } else {
      toast.error('كلمة المرور غير صحيحة')
    }
  }

  async function handleSave(item: MenuItem) {
    const itemToSave = { ...item, id: item.id || `item_${Date.now()}` };
    try {
      toast.loading('جاري الحفظ...');
      if (editing) {
        await updateItem(itemToSave);
        toast.success('تم تحديث الصنف بنجاح');
      } else {
        await addItem(itemToSave);
        toast.success('تمت إضافة الصنف بنجاح');
      }
      setEditing(null);
      setDialogOpen(false);
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      toast.error('حدث خطأ أثناء الحفظ');
      console.error(error);
    }
  }

  function toggleVisibility(item: MenuItem) {
    const currentStatus = item.available ?? true
    updateItem({ ...item, available: !currentStatus })
    toast.info(currentStatus ? `تم إخفاء ${item.name}` : `تم إظهار ${item.name}`)
  }

  const handleShopImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !uploadingShopId) return
    processImage(file, (base64) => {
        const updatedImages = { ...shopImages, [uploadingShopId]: base64 }
        setShopImages(updatedImages)
        localStorage.setItem('faz3ah_shop_images', JSON.stringify(updatedImages))
        toast.success('تم تحديث شعار المحل بنجاح')
        setUploadingShopId(null)
    })
  }

  function triggerShopUpload(shopId: string) {
    setUploadingShopId(shopId)
    setTimeout(() => { shopFileInputRef.current?.click() }, 50)
  }

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    processImage(file, setBannerImage)
  }

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bannerImage) {
      toast.error('الرجاء اختيار صورة للبنر أولاً')
      return
    }
    try {
      await addDoc(collection(db, "banners"), {
        title: bannerTitle || 'بنر مخصص',
        description: bannerDesc || '',
        image: bannerImage,
        createdAt: new Date().toISOString()
      })
      toast.success('تمت إضافة البنر الإعلاني بنجاح')
      setBannerTitle('')
      setBannerDesc('')
      setBannerImage('')
    } catch (error) {
      toast.error('حدث خطأ أثناء الحفظ')
      console.error(error)
    }
  }

  const handleDeleteBanner = async (id: string) => {
    try {
      await deleteDoc(doc(db, "banners", id))
      toast.success('تم حذف البنر الإعلاني')
    } catch (error) {
      toast.error('فشل حذف البنر')
    }
  }

  function openAdd() { setEditing(null); setDialogOpen(true) }
  function openEdit(item: MenuItem) { setEditing(item); setDialogOpen(true) }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-primary px-6">
        <form onSubmit={handleLogin} className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl bg-card p-8 shadow-2xl">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary"><Lock className="size-7 text-gold" /></div>
          <div className="text-center">
            <h1 className="font-heading text-2xl font-800 text-card-foreground">لوحة التحكم</h1>
            <p className="mt-1 text-sm text-muted-foreground">أدخل كلمة المرور للوصول</p>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="pw">كلمة المرور</Label>
            <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoFocus />
          </div>
          <Button type="submit" className="h-11 w-full bg-primary font-700 text-primary-foreground hover:bg-primary/90">دخول</Button>
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">العودة للتطبيق</Link>
        </form>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-background pb-10" dir="rtl">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gold/30 bg-primary px-4 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="العودة"><Button size="icon" variant="ghost" className="size-9 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><ArrowRight className="size-5" /></Button></Link>
          <h1 className="font-heading text-xl font-800 text-gold">إدارة التطبيق الكاملة</h1>
        </div>
        <Button onClick={openAdd} className="gap-1 rounded-full bg-gold font-700 text-gold-foreground hover:bg-gold/90"><Plus className="size-4" /> صنف جديد</Button>
      </header>

      <section className="m-4 rounded-xl border border-gold/20 bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 border-b pb-2 mb-3 border-border">
          <LayoutList className="size-5 text-primary" />
          <h2 className="font-heading font-700 text-base text-card-foreground">إدارة أقسام القائمة</h2>
        </div>
        <div className="flex gap-2 mb-4">
          <Input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="اسم القسم الجديد..." />
          <Button onClick={handleAddCategory} className="bg-primary text-primary-foreground"><Plus className="size-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <Badge key={cat} className="flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground">
              {cat}
              <button onClick={() => handleDeleteCategory(cat)} className="hover:text-destructive"><Trash2 className="size-3" /></button>
            </Badge>
          ))}
        </div>
      </section>

      <input type="file" ref={shopFileInputRef} onChange={handleShopImageUpload} accept="image/*" className="hidden" />
      
      <section className="m-4 rounded-xl border border-gold/20 bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 border-b pb-2 mb-3 border-border"><Store className="size-5 text-primary" /><h2 className="font-heading font-700 text-base text-card-foreground">إدارة صور وشعارات المحلات</h2></div>
        <div className="grid grid-cols-2 gap-3">
          {SHOPS.map((shop) => {
            const currentImg = shopImages[shop.id] || `/stores/${shop.id}.png`
            return (
              <div key={shop.id} className="flex flex-col items-center gap-2 rounded-lg border border-border p-3 bg-secondary/10">
                <div className="relative size-16 overflow-hidden rounded-full border bg-white flex items-center justify-center"><img src={currentImg} alt={shop.name} className="h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg' }} /></div>
                <span className="text-xs font-700 text-card-foreground text-center">{shop.name}</span>
                <Button size="sm" variant="outline" onClick={() => triggerShopUpload(shop.id)} className="mt-1 h-7 text-[11px] gap-1 px-2 border-primary/40 text-primary hover:bg-primary/5"><ImagePlus className="size-3" /> تغيير الشعار</Button>
              </div>
            )
          })}
        </div>
      </section>

      <section className="m-4 rounded-xl border border-gold/20 bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 border-b pb-2 mb-3 border-border"><Images className="size-5 text-primary" /><h2 className="font-heading font-700 text-base text-card-foreground">إدارة البنرات الإعلانية للرئيسية</h2></div>
        <form onSubmit={handleAddBanner} className="flex flex-col gap-3 text-right mb-4">
          <div className="flex items-center justify-between gap-3 mt-1">
            <div className="flex items-center gap-2">
              <input type="file" accept="image/*" id="banner-file-input" className="hidden" onChange={handleBannerImageUpload} />
              <label htmlFor="banner-file-input" className="flex items-center gap-1.5 border border-dashed rounded-lg px-3 py-1.5 text-xs cursor-pointer bg-secondary/10 border-primary/40 text-primary hover:bg-primary/5 font-700"><ImagePlus className="size-3.5" /> اختر صورة البنر</label>
              {bannerImage && <span className="text-[11px] text-green-600 font-700">✓ تم تجهيز الصورة</span>}
            </div>
            <Button type="submit" size="sm" className="bg-primary font-700 text-primary-foreground hover:bg-primary/90 text-xs h-8 px-4 rounded-lg">حفظ ونشر البنر</Button>
          </div>
        </form>
        <div className="pt-3 border-t border-border">
          <span className="block text-xs font-700 text-muted-foreground mb-2">البنرات النشطة حالياً ({banners.length})</span>
          {banners.length === 0 ? <p className="text-xs text-muted-foreground/70 bg-secondary/10 p-3 rounded-lg text-center font-medium">لا توجد بنرات حالياً.</p> : (
            <div className="flex flex-col gap-2">
              {banners.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-2 border border-border rounded-lg bg-secondary/5 gap-3">
                  <div className="relative h-10 w-16 overflow-hidden rounded border bg-white flex-shrink-0"><img src={b.image} className="size-full object-cover" alt="" /></div>
                  <Button variant="outline" size="icon" onClick={() => handleDeleteBanner(b.id)} className="size-7 text-destructive border-destructive/20 hover:bg-destructive hover:text-white rounded-md flex-shrink-0"><Trash2 className="size-3.5" /></Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="flex items-center justify-between px-4 py-3 border-t mt-4 border-border">
        <p className="text-sm text-muted-foreground">{menu.length} صنف مسجل حالياً</p>
        <button onClick={() => { if(confirm('هل أنت متأكد؟')) resetMenu() }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><RotateCcw className="size-3.5" /> استعادة الافتراضي</button>
      </div>

      <ul className="flex flex-col gap-3 px-4">
        {menu.map((item) => {
          const isAvailable = item.available ?? true
          const shopName = SHOPS.find(s => s.id === item.shopId)?.name || 'غير محدد'
          return (
            <li key={item.id} className={`flex gap-3 rounded-xl border border-border bg-card p-3 transition-opacity ${!isAvailable ? 'opacity-50 border-dashed bg-secondary/30' : ''}`}>
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg"><img src={item.image || '/placeholder.svg'} alt={item.name} className="h-full w-full object-cover rounded-lg" /></div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-700 text-card-foreground text-right">{item.name} {!isAvailable && <span className="text-xs text-destructive">(مخفي)</span>}</h3>
                  <div className="flex gap-1 shrink-0">
                    <Badge variant="outline" className="text-[10px] border-gold text-gold bg-primary/10">{shopName}</Badge>
                    <Badge variant="secondary" className="text-[10px]">{CATEGORY_LABELS[item.category]}</Badge>
                  </div>
                </div>
                <p className="line-clamp-1 text-sm text-muted-foreground text-right">{item.description}</p>
                <div className="mt-auto flex items-center justify-between pt-1">
                  <span className="font-heading font-800 text-primary">{item.price.toFixed(2)} د.أ</span>
                  <div className="flex gap-1">
                    <Button size="icon" variant={isAvailable ? "outline" : "default"} className={`size-8 ${!isAvailable ? 'bg-primary text-primary-foreground' : ''}`} onClick={() => toggleVisibility(item)}>{isAvailable ? <Eye className="size-4" /> : <EyeOff className="size-4" />}</Button>
                    <Button size="icon" variant="outline" className="size-8" onClick={() => openEdit(item)}><Pencil className="size-4" /></Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="size-8 text-destructive hover:bg-destructive hover:text-white" 
                      onClick={async () => { 
                        await removeItem(item.id); 
                        toast.success('تم حذف الصنف'); 
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <ItemFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} editing={editing} />
    </main>
  )
}
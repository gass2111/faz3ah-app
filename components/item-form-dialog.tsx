'use client'

import { useEffect, useState, useRef } from 'react'
import { ImagePlus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SHOPS, type MenuItem, type ShopId } from '@/lib/menu-data'

type Props = {
  open: boolean
  onClose: () => void
  onSave: (item: MenuItem) => void
  editing: MenuItem | null
}

export function ItemFormDialog({ open, onClose, onSave, editing }: Props) {
  // حالة لحفظ الأقسام الديناميكية
  const [categories, setCategories] = useState<string[]>(['مشروبات', 'حلويات', 'وجبات رئيسية'])
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'مشروبات',
    shopId: 'abu_halima' as ShopId,
  })
  
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // تحميل الأقسام عند فتح الـ Dialog
  useEffect(() => {
    const savedCats = localStorage.getItem('faz3ah_categories')
    if (savedCats) {
      try {
        const parsed = JSON.parse(savedCats)
        setCategories(parsed)
      } catch (e) { console.error(e) }
    }
  }, [open])

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        description: editing.description,
        price: String(editing.price),
        image: editing.image,
        category: editing.category, // هنا سيتم تخزين اسم القسم كنص
        shopId: editing.shopId || 'abu_halima',
      })
    } else {
      setForm({
        name: '',
        description: '',
        price: '',
        image: '',
        category: categories[0] || 'مشروبات',
        shopId: 'abu_halima',
      })
    }
  }, [editing, open, categories])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }))
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.price) return
    onSave({
      id: editing?.id ?? `item_${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number.parseFloat(form.price) || 0,
      image: form.image.trim() || '/placeholder.svg',
      category: form.category,
      shopId: form.shopId,
      available: editing ? editing.available : true,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-heading text-right">
            {editing ? 'تعديل الصنف' : 'إضافة صنف جديد'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          
          <div className="flex flex-col gap-2">
            <Label>صورة المنتج</Label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="relative flex h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-input bg-card hover:border-primary/50 overflow-hidden">
              {form.image ? <img src={form.image} alt="Preview" className="h-full w-full object-cover" /> : 
               isUploading ? <Loader2 className="size-6 animate-spin text-primary" /> : <><ImagePlus className="size-6 text-muted-foreground" /><span className="text-xs">اضغط لاختيار صورة</span></>}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="f-name">اسم الصنف</Label>
            <Input id="f-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: بيبسي" />
          </div>
          
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="f-shop">المتجر</Label>
              <select id="f-shop" value={form.shopId} onChange={(e) => setForm({ ...form, shopId: e.target.value as ShopId })} className="h-9 rounded-md border border-input px-3 text-sm">
                {SHOPS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="f-cat">القسم</Label>
              <select id="f-cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-9 rounded-md border border-input px-3 text-sm">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="f-price">السعر (د.أ)</Label>
            <Input id="f-price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
        </div>
        <DialogFooter className="flex-row gap-2">
          <Button onClick={handleSubmit} className="flex-1 bg-primary text-primary-foreground">حفظ</Button>
          <Button variant="outline" onClick={onClose} className="flex-1">إلغاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
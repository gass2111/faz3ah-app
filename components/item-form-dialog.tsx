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
import { CATEGORY_LABELS, CATEGORY_ORDER, SHOPS, type Category, type MenuItem, type ShopId } from '@/lib/menu-data'

type Props = {
  open: boolean
  onClose: () => void
  onSave: (item: MenuItem) => void
  editing: MenuItem | null
}

const EMPTY = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: 'drinks' as Category,
  shopId: 'abu_halima' as ShopId,
}

export function ItemFormDialog({ open, onClose, onSave, editing }: Props) {
  const [form, setForm] = useState(EMPTY)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        description: editing.description,
        price: String(editing.price),
        image: editing.image,
        category: editing.category,
        shopId: editing.shopId || 'abu_halima',
      })
    } else {
      setForm(EMPTY)
    }
  }, [editing, open])

  // دالة تحويل الصورة المرفوعة من جهازك إلى نص وتخزينها
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const reader = new FileReader()
    
    reader.onloadend = () => {
      const base64String = reader.result as string
      setForm((prev) => ({ ...prev, image: base64String }))
      setIsUploading(false)
    }

    reader.onerror = () => {
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
      image: form.image.trim() || '/placeholder.svg?height=200&width=200',
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
          
          {/* الحقل الجديد: رفع صورة من المعرض وتثبيتها بالمعاينة */}
          <div className="flex flex-col gap-2">
            <Label>صورة المنتج</Label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-input bg-card hover:border-primary/50 transition-colors overflow-hidden"
            >
              {form.image ? (
                <>
                  <img src={form.image} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImagePlus className="size-8 text-white" />
                  </div>
                </>
              ) : isUploading ? (
                <Loader2 className="size-6 animate-spin text-primary" />
              ) : (
                <>
                  <ImagePlus className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="mt-1 text-xs text-muted-foreground">اضغط هنا لفتح معرض الصور واختيار صورة</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="f-name">اسم الصنف</Label>
            <Input
              id="f-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="مثال: بيبسي علبة"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="f-desc">الوصف</Label>
            <Textarea
              id="f-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="وصف مختصر للصنف"
              className="resize-none"
            />
          </div>
          
          {/* اختيار المتجر واختيار القسم بجانب بعض */}
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="f-shop">تابع لمتجر</Label>
              <select
                id="f-shop"
                value={form.shopId}
                onChange={(e) => setForm({ ...form, shopId: e.target.value as ShopId })}
                className="h-9 rounded-md border border-input bg-card px-3 text-sm"
              >
                {SHOPS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="f-cat">القسم</Label>
              <select
                id="f-cat"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                className="h-9 rounded-md border border-input bg-card px-3 text-sm"
              >
                {CATEGORY_ORDER.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="f-price">السعر (د.أ)</Label>
              <Input
                id="f-price"
                type="number"
                step="0.05"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex-row gap-2">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            حفظ
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
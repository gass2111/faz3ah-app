'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/use-cart'
import { STORE_PHONE } from '@/lib/menu-data'

export function CartSheet({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { cart, setQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart()
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')

  function buildMessage() {
    const lines = cart
      .map(
        (l) =>
          `${l.name} x ${l.quantity} = ${(l.price * l.quantity).toFixed(2)} د.أ`,
      )
      .join('\n')
    return (
      `طلب جديد من تطبيق فزعة 🚨\n` +
      `--------------------\n` +
      `${lines}\n` +
      `--------------------\n` +
      `المجموع الإجمالي: ${totalPrice.toFixed(2)} د.أ\n` +
      `العنوان: ${address.trim()}\n` +
      `ملاحظات إضافية: ${notes.trim() || 'لا يوجد'}`
    )
  }

  function handleConfirm() {
    if (cart.length === 0) {
      toast.error('السلة فارغة، أضف بعض الأصناف أولاً')
      return
    }
    if (!address.trim()) {
      toast.error('الرجاء إدخال عنوان التوصيل')
      return
    }
    const url = `https://wa.me/${STORE_PHONE}?text=${encodeURIComponent(buildMessage())}`
    window.open(url, '_blank')
    toast.success('تم تجهيز طلبك وفتح الواتساب')
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-foreground/40 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-label="سلة المشتريات"
      >
        <header className="flex items-center justify-between border-b border-border bg-primary px-4 py-4">
          <div className="flex items-center gap-2 text-primary-foreground">
            <ShoppingBag className="size-5 text-gold" />
            <h2 className="font-heading text-lg font-700">سلة المشتريات</h2>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="size-9 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            aria-label="إغلاق"
          >
            <X className="size-5" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <ShoppingBag className="size-12 opacity-40" />
              <p className="font-600">سلتك فارغة</p>
              <p className="text-sm">أضف أصنافك المفضلة من المنيو</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {cart.map((l) => (
                <li
                  key={l.id}
                  className="flex gap-3 rounded-xl border border-border bg-card p-2"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={l.image || '/placeholder.svg'}
                      alt={l.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-700 leading-tight text-card-foreground">
                        {l.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(l.id)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`حذف ${l.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <span className="text-sm font-700 text-primary">
                      {(l.price * l.quantity).toFixed(2)} د.أ
                    </span>
                    <div className="mt-auto flex items-center gap-2 pt-1">
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-7 rounded-full"
                        onClick={() => setQuantity(l.id, l.quantity - 1)}
                        aria-label="إنقاص"
                      >
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="w-6 text-center font-700">{l.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-7 rounded-full"
                        onClick={() => setQuantity(l.id, l.quantity + 1)}
                        aria-label="زيادة"
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {cart.length > 0 && (
            <div className="mt-5 flex flex-col gap-4">
              <Separator />
              <div className="flex flex-col gap-2">
                <Label htmlFor="address" className="font-700">
                  عنوان التوصيل <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="اكتب عنوانك بالتفصيل (المنطقة، الشارع، رقم المبنى)"
                  className="min-h-20 resize-none bg-card"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="notes" className="font-700">
                  ملاحظات خاصة <span className="text-muted-foreground">(اختياري)</span>
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: بدون بصل، إضافة صوص حار..."
                  className="min-h-16 resize-none bg-card"
                />
              </div>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <footer className="border-t border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-600 text-muted-foreground">
                المجموع ({totalItems} صنف)
              </span>
              <span className="font-heading text-2xl font-900 text-primary">
                {totalPrice.toFixed(2)} د.أ
              </span>
            </div>
            <Button
              onClick={handleConfirm}
              className="h-12 w-full gap-2 rounded-full bg-primary text-base font-700 text-primary-foreground hover:bg-primary/90"
            >
              تأكيد الطلب عبر الواتساب
            </Button>
            <button
              onClick={clearCart}
              className="mt-2 w-full text-sm text-muted-foreground hover:text-destructive"
            >
              تفريغ السلة
            </button>
          </footer>
        )}
      </aside>
    </>
  )
}

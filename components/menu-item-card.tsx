'use client'

import Image from 'next/image'
import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { MenuItem } from '@/lib/menu-data'

export function MenuItemCard({
  item,
  onAdd,
  onRemove,
  quantity = 0,
}: {
  item: MenuItem
  onAdd: (item: MenuItem) => void
  onRemove: () => void
  quantity?: number
}) {
  return (
    <div className="flex gap-3 overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-heading text-lg font-700 leading-tight text-card-foreground">
          {item.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-heading text-lg font-800 text-primary">
            {item.price.toFixed(2)} <span className="text-xs font-600">د.أ</span>
          </span>

          {/* العداد الذكي */}
          {quantity > 0 ? (
            <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-secondary/50 p-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onAdd(item)}
                className="size-7 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                aria-label="زيادة الكمية"
              >
                <Plus className="size-3.5" />
              </Button>
              
              <span className="min-w-[20px] text-center font-heading text-base font-800 text-primary">
                {quantity}
              </span>

              {/* هنا التعديل السحري: زر الناقص ينقص حبة واحدة فقط */}
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  // إذا كانت الكمية حبة واحدة، نقوم بحذفها تماماً، غير ذلك ننقص حبة حبة
                  onRemove(); 
                }}
                className="size-7 rounded-full border border-primary/30 text-primary hover:bg-primary/10"
                aria-label="تقليل الكمية"
              >
                <Minus className="size-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => onAdd(item)}
              className="h-9 gap-1 rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-4" />
              إضافة
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
'use client'

import Image from 'next/image'

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#7f0019]">
      <div className="animate-pulse">
        <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-2xl">
          <Image
            src="/logo.png"
            alt="فزعة"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <h1 className="mt-6 text-5xl font-bold text-white">
        فزعة
      </h1>

      <p className="mt-2 text-white/90">
        أصالة وفخامة في كل طلب
      </p>

      <div className="mt-8 flex gap-2">
        <span className="h-3 w-3 animate-bounce rounded-full bg-white"></span>
        <span
          className="h-3 w-3 animate-bounce rounded-full bg-white"
          style={{ animationDelay: '0.2s' }}
        />
        <span
          className="h-3 w-3 animate-bounce rounded-full bg-white"
          style={{ animationDelay: '0.4s' }}
        />
      </div>
    </div>
  )
}
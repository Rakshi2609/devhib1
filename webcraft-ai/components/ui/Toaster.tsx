'use client'

import { useEffect, useState } from 'react'

type ToastType = 'success' | 'error' | 'info'

type ToastItem = {
  id: number
  message: string
  type: ToastType
}

function bgForType(type: ToastType) {
  if (type === 'success') return 'bg-emerald-600'
  if (type === 'error') return 'bg-rose-600'
  return 'bg-slate-800'
}

export default function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ message: string; type?: ToastType }>
      const message = custom.detail?.message
      const type = custom.detail?.type || 'info'
      if (!message) return

      const id = Date.now() + Math.floor(Math.random() * 1000)
      setItems((prev) => [...prev, { id, message, type }])

      window.setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== id))
      }, 2600)
    }

    window.addEventListener('webcraft:toast', handler as EventListener)
    return () => window.removeEventListener('webcraft:toast', handler as EventListener)
  }, [])

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {items.map((item) => (
        <div
          key={item.id}
          className={`${bgForType(item.type)} text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg`}
        >
          {item.message}
        </div>
      ))}
    </div>
  )
}

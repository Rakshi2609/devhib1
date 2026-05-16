'use client'

import { useEffect, useState } from 'react'
import { showToast } from '@/lib/toast'

type InboxItem = {
  _id: string
  fromUsername: string
  roomId: string
  link: string
  message: string
  createdAt: string
}

export default function InboxPage() {
  const [items, setItems] = useState<InboxItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/notifications')
      if (!res.ok) {
        showToast('Unable to load inbox', 'error')
        setLoading(false)
        return
      }
      const data = await res.json()
      setItems(data.notifications || [])
      setLoading(false)
    }

    load()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500">Inbox</p>
            <h1 className="text-4xl font-black text-gray-900">Owner Notifications</h1>
          </div>
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-violet-600">← Home</a>
        </div>

        {loading && <p className="text-sm text-gray-500">Loading inbox...</p>}

        {!loading && items.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            No presentations yet.
          </div>
        )}

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-gray-900">{item.message}</p>
              <p className="text-xs text-gray-500 mt-1">From @{item.fromUsername} • Room {item.roomId}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(item.createdAt).toLocaleString()}</p>
              <div className="mt-4">
                <a
                  href={item.link}
                  className="inline-flex text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg"
                >
                  Open Presentation
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

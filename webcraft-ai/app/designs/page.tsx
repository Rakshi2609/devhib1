'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TEMPLATE_PRESETS } from '@/lib/templates'
import { showToast } from '@/lib/toast'

export default function DesignsPage() {
  const router = useRouter()
  const [ownerName, setOwnerName] = useState('')

  const templates = useMemo(() => Object.entries(TEMPLATE_PRESETS), [])

  const cloneTemplate = (templateId: string) => {
    const roomId = Math.random().toString(36).slice(2)
    const params = new URLSearchParams({ template: templateId })
    if (ownerName.trim()) {
      params.set('owner', ownerName.trim().toLowerCase())
    }
    showToast('Cloned design. Opening collaborative editor...', 'success')
    router.push(`/editor/${roomId}?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between flex-wrap gap-5 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] font-bold text-violet-500 mb-2">Design Playground</p>
            <h1 className="text-5xl font-black text-gray-900">Clone, Improve, Present</h1>
            <p className="text-gray-500 mt-3 max-w-2xl">
              Pick any available design, clone it into your own collaborative room, refine it, and present your improved version back to the owner.
            </p>
          </div>
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-violet-600">← Back to Home</a>
        </div>

        <div className="mb-8 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
          <label className="text-xs font-bold uppercase tracking-wide text-violet-500">Owner username (for presentation handoff)</label>
          <div className="mt-2 flex items-center gap-3">
            <input
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="e.g. rakshi2609"
              className="w-full max-w-md border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400"
            />
            <span className="text-xs text-gray-500">Optional. Used by the editor's Present to Owner action.</span>
          </div>
          {ownerName.trim() && (
            <p className="mt-2 text-xs font-semibold text-violet-600">
              Owner target: @{ownerName.trim().toLowerCase()}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(([id, template]) => (
            <div key={id} className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className={`h-44 bg-gradient-to-br ${template.color} px-6 py-6 flex flex-col justify-between`}>
                <span className="text-4xl">{template.emoji}</span>
                <div>
                  <h2 className="text-2xl font-black text-white">{template.label}</h2>
                  <p className="text-white/80 text-sm mt-1">{template.description}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs text-violet-600 font-bold uppercase tracking-wide mb-3">{template.components.length} ready sections</p>
                <button
                  onClick={() => cloneTemplate(id)}
                  className="w-full bg-gray-900 hover:bg-violet-600 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Clone And Improve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

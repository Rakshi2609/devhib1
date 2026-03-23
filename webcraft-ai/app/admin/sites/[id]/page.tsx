'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { showToast } from '@/lib/toast'

type SiteData = {
  _id: string
  subdomain: string
  title: string
  description: string
  content: {
    hero?: { heading?: string; subheading?: string }
    about?: { heading?: string; body?: string }
    contact?: { email?: string }
  }
}

export default function SiteLayoutEditorPage() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [site, setSite] = useState<SiteData | null>(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/sites/${id}`)
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error || 'Failed to load site', 'error')
        setLoading(false)
        return
      }
      setSite(data.site)
      setLoading(false)
    }

    load()
  }, [id])

  const save = async () => {
    if (!site) return
    setSaving(true)
    const res = await fetch(`/api/sites/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(site),
    })
    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      showToast(data.error || 'Failed to save layout', 'error')
      return
    }

    setSite(data.site)
    showToast('Site layout saved', 'success')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading site...</div>
  }

  if (!site) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Site not found.</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-violet-500">My Site Layout</p>
            <h1 className="text-3xl font-black text-gray-900">Edit {site.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{site.subdomain}.rakshithganjimut.xyz</p>
          </div>
          <a href="/admin/sites" className="text-sm font-semibold text-gray-600 hover:text-violet-600">← Back</a>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <input
            value={site.title}
            onChange={(e) => setSite((s) => (s ? { ...s, title: e.target.value } : s))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            placeholder="Title"
          />
          <input
            value={site.description || ''}
            onChange={(e) => setSite((s) => (s ? { ...s, description: e.target.value } : s))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            placeholder="Description"
          />
          <input
            value={site.content?.hero?.heading || ''}
            onChange={(e) => setSite((s) => (s ? { ...s, content: { ...s.content, hero: { ...(s.content?.hero || {}), heading: e.target.value } } } : s))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            placeholder="Hero heading"
          />
          <textarea
            value={site.content?.hero?.subheading || ''}
            onChange={(e) => setSite((s) => (s ? { ...s, content: { ...s.content, hero: { ...(s.content?.hero || {}), subheading: e.target.value } } } : s))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 min-h-24"
            placeholder="Hero subheading"
          />
          <input
            value={site.content?.about?.heading || ''}
            onChange={(e) => setSite((s) => (s ? { ...s, content: { ...s.content, about: { ...(s.content?.about || {}), heading: e.target.value } } } : s))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            placeholder="About heading"
          />
          <textarea
            value={site.content?.about?.body || ''}
            onChange={(e) => setSite((s) => (s ? { ...s, content: { ...s.content, about: { ...(s.content?.about || {}), body: e.target.value } } } : s))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 min-h-28"
            placeholder="About body"
          />
          <input
            value={site.content?.contact?.email || ''}
            onChange={(e) => setSite((s) => (s ? { ...s, content: { ...s.content, contact: { ...(s.content?.contact || {}), email: e.target.value } } } : s))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            placeholder="Contact email"
          />

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-2.5 rounded-lg disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Layout'}
            </button>
            <a href={`/sites/${site.subdomain}`} target="_blank" className="text-sm font-semibold text-violet-600 hover:text-violet-700">
              Preview site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

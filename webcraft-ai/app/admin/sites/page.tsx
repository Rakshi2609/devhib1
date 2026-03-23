'use client'
import { useState, useEffect } from 'react'

interface Site {
  _id: string
  subdomain: string
  title: string
  description: string
  createdAt: string
}

export default function AdminSitesPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ subdomain: '', title: '', description: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchSites = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/sites')
      const data = await res.json()
      setSites(data.sites || [])
    } catch {
      setError('Failed to load sites')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSites() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          content: {
            hero: {
              heading: `Welcome to ${form.title}`,
              subheading: form.description || 'Built with WebCraft AI',
            },
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create site')
      } else {
        setSuccess(`Site created! Visit /sites/${form.subdomain} to see it.`)
        setForm({ subdomain: '', title: '', description: '' })
        fetchSites()
      }
    } catch {
      setError('Network error, please try again')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
          Site Manager
        </h1>
        <p className="text-gray-500 mb-10">Create and manage your multi-tenant sites.</p>

        {/* Create Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
          <h2 className="text-xl font-bold mb-6">Create New Site</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="flex gap-2 items-center">
              <input
                required
                value={form.subdomain}
                onChange={e => setForm(f => ({ ...f, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                placeholder="subdomain"
                className="flex-1 border border-gray-200 rounded-xl p-3 outline-none focus:border-violet-400 font-mono"
              />
              <span className="text-sm text-gray-400 whitespace-nowrap">.rakshithganjimut.xyz</span>
            </div>
            <input
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Site title"
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-violet-400"
            />
            <input
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Short description (optional)"
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-violet-400"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <button
              type="submit"
              disabled={creating}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Site'}
            </button>
          </form>
        </div>

        {/* Sites List */}
        <h2 className="text-xl font-bold mb-4">Your Sites ({sites.length})</h2>
        {loading ? (
          <p className="text-gray-400">Loading sites...</p>
        ) : sites.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400">
            No sites yet. Create one above.
          </div>
        ) : (
          <div className="grid gap-4">
            {sites.map(site => (
              <div key={site._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{site.title}</h3>
                  <p className="text-sm text-gray-400 font-mono mt-1">{site.subdomain}.rakshithganjimut.xyz</p>
                  {site.description && <p className="text-sm text-gray-500 mt-1">{site.description}</p>}
                </div>
                <a
                  href={`/sites/${site.subdomain}`}
                  target="_blank"
                  className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-violet-600 transition-colors"
                >
                  View →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

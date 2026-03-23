'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { TEMPLATE_PRESETS } from '@/lib/templates'

export default function HomePage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)

  const template = selected ? TEMPLATE_PRESETS[selected] : null

  const openEditor = (templateId: string) => {
    const projectId = Math.random().toString(36).substring(7)
    router.push(`/editor/${projectId}?template=${templateId}`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
            WebCraft AI
          </span>
          <div className="flex items-center gap-6">
            <a href="/admin/sites" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">My Sites</a>
            <button
              onClick={() => openEditor('blank')}
              className="bg-gray-900 hover:bg-violet-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              Start Building →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-bold px-4 py-1.5 rounded-full mb-8 border border-violet-100">
          🤖 AI-Powered Website Builder
        </div>
        <h1 className="text-7xl font-black tracking-tight mb-6 leading-none">
          Build Sites with{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600">
            Voice & AI
          </span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Pick a template, drag & drop components, speak your changes with AI voice commands,
          and publish to your own subdomain — all in minutes.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => setSelected('saas')}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg shadow-violet-200 transition-all hover:scale-105"
          >
            Browse Templates
          </button>
          <button
            onClick={() => openEditor('blank')}
            className="border border-gray-200 hover:border-gray-300 text-gray-700 font-bold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Start from Scratch ✨
          </button>
        </div>
      </section>

      {/* Feature badges */}
      <section className="py-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          {['🎙️ Voice Commands', '🤖 AI Layout Generator', '🔄 Drag & Drop', '👥 Real-time Collab', '🚀 1-Click Deploy', '🎨 Premium Palettes'].map(f => (
            <div key={f} className="flex items-center gap-2 font-medium">{f}</div>
          ))}
        </div>
      </section>

      {/* Template Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4">Premium Templates</h2>
          <p className="text-gray-500 text-center mb-14 text-lg">Professional designs ready to customize and launch today.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(TEMPLATE_PRESETS).map(([id, t]) => (
              <div
                key={id}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                onClick={() => setSelected(id)}
              >
                {/* Template preview thumbnail */}
                <div className={`h-52 bg-gradient-to-br ${t.color} flex flex-col items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')]" />
                  <span className="text-5xl mb-3 relative">{t.emoji}</span>
                  <span className="text-white font-black text-2xl relative">{t.label}</span>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent h-16" />
                </div>
                <div className="p-6 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{t.label}</h3>
                    <p className="text-sm text-gray-500">{t.description}</p>
                    <p className="text-xs text-violet-500 font-medium mt-2">{t.components.length} sections included</p>
                  </div>
                  <span className="text-gray-300 group-hover:text-violet-500 transition-colors text-xl mt-1">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Preview Modal */}
      {selected && template && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className={`p-8 bg-gradient-to-br ${template.color} text-white flex items-center gap-4`}>
              <span className="text-5xl">{template.emoji}</span>
              <div>
                <h2 className="text-3xl font-black">{template.label}</h2>
                <p className="text-white/80 mt-1">{template.description}</p>
              </div>
            </div>
            {/* Section list */}
            <div className="p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Included Sections ({template.components.length})</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {template.components.map((c, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 text-xs font-mono font-medium px-3 py-1.5 rounded-lg capitalize">
                    {c.type}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openEditor(selected)}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-violet-200"
                >
                  Use This Template →
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-3.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-10 border-t border-gray-100 text-center text-sm text-gray-400">
        <p>Built by <strong className="text-gray-700">Team Meow</strong> — Rakshith, Ayushi & Bhuvan 🐾</p>
      </footer>
    </div>
  )
}

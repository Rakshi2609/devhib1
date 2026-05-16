'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { TEMPLATE_PRESETS } from '@/lib/templates'

// Animated mesh gradient background
function MeshGradient() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base dark navy */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #020817 0%, #0a1628 40%, #071020 100%)' }} />
      {/* Animated blue orbs */}
      <div
        className="absolute rounded-full blur-[120px] opacity-20 animate-float"
        style={{
          width: '800px', height: '800px',
          background: 'radial-gradient(circle, #1d4ed8 0%, #1e40af 50%, transparent 70%)',
          top: '-200px', left: '-200px',
        }}
      />
      <div
        className="absolute rounded-full blur-[100px] opacity-15"
        style={{
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, #2563eb 0%, #1e3a8a 60%, transparent 80%)',
          top: '40%', right: '-100px',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute rounded-full blur-[80px] opacity-10"
        style={{
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
          bottom: '10%', left: '30%',
          animation: 'float 10s ease-in-out infinite',
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(148,163,184,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}

// Stat card
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-5 rounded-2xl border border-blue-800/30 bg-blue-950/20 backdrop-blur-sm">
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-sm text-blue-300/70">{label}</div>
    </div>
  )
}

// Feature badge
function FeatureBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-blue-700/30 bg-blue-900/20 backdrop-blur-sm text-sm font-medium text-blue-200 hover:border-blue-500/50 hover:bg-blue-800/30 transition-all duration-300 cursor-default group">
      <span className="group-hover:scale-125 transition-transform duration-300">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

const FEATURES = [
  { icon: '🎙️', label: 'Voice Commands' },
  { icon: '🤖', label: 'AI Generator' },
  { icon: '🔄', label: 'Drag & Drop' },
  { icon: '👥', label: 'Real-time Collab' },
  { icon: '🚀', label: '1-Click Deploy' },
  { icon: '🎨', label: 'Premium Themes' },
  { icon: '📱', label: 'Responsive' },
  { icon: '🔒', label: 'Secure & Fast' },
]

// Template card
function TemplateCard({ id, t, onClick }: { id: string; t: any; onClick: () => void }) {
  const colorMap: Record<string, string> = {
    'from-indigo-500 to-purple-600': 'from-indigo-600 to-purple-700',
    'from-blue-500 to-cyan-500': 'from-blue-600 to-cyan-600',
    'from-gray-900 to-gray-700': 'from-slate-800 to-slate-600',
    'from-orange-500 to-red-500': 'from-orange-600 to-red-600',
    'from-fuchsia-600 to-pink-600': 'from-fuchsia-600 to-pink-700',
    'from-gray-300 to-gray-400': 'from-slate-500 to-slate-600',
  }
  const gradient = colorMap[t.color] || t.color

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl overflow-hidden border border-blue-800/30 bg-blue-950/30 backdrop-blur-sm hover:border-blue-500/60 hover:bg-blue-900/40 transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/40"
    >
      {/* Preview thumbnail */}
      <div className={`h-48 bg-gradient-to-br ${gradient} relative overflow-hidden flex flex-col items-center justify-center`}>
        {/* Shimmer overlay */}
        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="text-5xl mb-3 relative z-10 group-hover:scale-110 transition-transform duration-400">{t.emoji}</span>
        <span className="text-white font-black text-xl relative z-10 tracking-wide">{t.label}</span>
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Card content */}
      <div className="p-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-white text-base mb-1 truncate">{t.label}</h3>
          <p className="text-sm text-blue-300/70 line-clamp-2">{t.description}</p>
          <p className="text-xs text-blue-400/80 font-semibold mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
            {t.components.length} sections included
          </p>
        </div>
        <span className="text-blue-500/50 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300 text-xl flex-shrink-0 mt-1">→</span>
      </div>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [authUser, setAuthUser] = useState<string | null>(null)

  const template = selected ? TEMPLATE_PRESETS[selected] : null

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d?.data?.username) setAuthUser(d.data.username)
    }).catch(() => {})
  }, [])

  const openEditor = (templateId: string) => {
    const projectId = Math.random().toString(36).substring(7)
    router.push(`/editor/${projectId}?template=${templateId}`)
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      <MeshGradient />

      {/* ── Fixed Navbar ─────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#060d1a]/90 backdrop-blur-xl border-b border-blue-900/40 shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/50">
              <span className="text-white font-black text-sm">W</span>
            </div>
            <span className="text-lg font-black tracking-tight">
              <span className="text-white">WebCraft</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"> AI</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#templates" className="text-sm font-medium text-blue-300/80 hover:text-white transition-colors">Templates</a>
            <a href="#features" className="text-sm font-medium text-blue-300/80 hover:text-white transition-colors">Features</a>
            <a href="/admin/sites" className="text-sm font-medium text-blue-300/80 hover:text-white transition-colors">My Sites</a>
            {authUser ? (
              <span className="text-xs text-blue-400 font-mono bg-blue-900/30 px-3 py-1 rounded-full border border-blue-700/40">
                @{authUser}
              </span>
            ) : (
              <a href="/login" className="text-sm font-medium text-blue-300/80 hover:text-white transition-colors">Login</a>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={() => openEditor('blank')}
            className="relative group bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/50 hover:shadow-blue-500/30 hover:scale-105"
          >
            <span className="relative z-10">Start Building →</span>
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-sm" />
          </button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 text-center relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 animate-pulse-glow bg-blue-950/60 border border-blue-700/50 text-blue-300 text-xs font-bold px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          AI-Powered Website Builder · Now with Voice Commands
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.9]">
          <span className="block text-white mb-2">Build Sites with</span>
          <span
            className="block bg-clip-text text-transparent animate-gradient-x"
            style={{ backgroundImage: 'linear-gradient(90deg, #60a5fa, #38bdf8, #818cf8, #60a5fa)' }}
          >
            Voice &amp; AI
          </span>
        </h1>

        <p className="text-lg md:text-xl text-blue-200/60 max-w-2xl mx-auto mb-12 leading-relaxed">
          Pick a template, drag &amp; drop components, speak your changes with AI voice,
          and publish to your own subdomain — <span className="text-blue-300 font-semibold">all in minutes.</span>
        </p>

        {/* CTAs */}
        <div className="flex gap-4 justify-center flex-wrap mb-20">
          <button
            onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all duration-300 shadow-xl shadow-blue-900/50 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105"
          >
            Browse Templates
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-400/30 to-cyan-400/30 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
          </button>
          <button
            onClick={() => openEditor('blank')}
            className="border border-blue-700/50 hover:border-blue-500 text-blue-200 hover:text-white font-bold px-8 py-4 rounded-2xl text-base transition-all duration-300 bg-blue-900/20 hover:bg-blue-800/30 backdrop-blur-sm hover:scale-105"
          >
            Start from Scratch ✨
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <StatCard value="6+" label="Premium Templates" />
          <StatCard value="10+" label="Component Blocks" />
          <StatCard value="1-Click" label="Deploy to Web" />
          <StatCard value="Live" label="Collaboration" />
        </div>
      </section>

      {/* ── Feature Pills ─────────────────────────────────────────────── */}
      <section id="features" className="py-12 border-y border-blue-800/20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs text-blue-400/60 font-bold uppercase tracking-widest text-center mb-6">Everything You Need</p>
          <div className="flex flex-wrap justify-center gap-3">
            {FEATURES.map(f => <FeatureBadge key={f.label} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── Template Grid ─────────────────────────────────────────────── */}
      <section id="templates" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-4">Templates</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Premium Templates
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Ready to Launch
              </span>
            </h2>
            <p className="text-blue-300/60 text-lg max-w-xl mx-auto">
              Professional designs crafted to convert. Customize every detail with our visual editor.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(TEMPLATE_PRESETS).map(([id, t]) => (
              <TemplateCard key={id} id={id} t={t} onClick={() => setSelected(id)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-blue-800/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-4">How It Works</p>
            <h2 className="text-4xl font-black text-white">Launch in 3 Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🎨', title: 'Pick a Template', desc: 'Choose from 6 professionally designed templates tailored to your industry.' },
              { step: '02', icon: '✏️', title: 'Customize & Edit', desc: 'Click any text to edit it. Drag components to reorder. Change colors instantly.' },
              { step: '03', icon: '🚀', title: 'Deploy Instantly', desc: 'Hit deploy and your site goes live on your custom subdomain in seconds.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="relative p-6 rounded-2xl border border-blue-800/30 bg-blue-950/20 backdrop-blur-sm group hover:border-blue-600/50 hover:bg-blue-900/30 transition-all duration-300">
                <div className="absolute -top-3 -left-1 text-xs font-black text-blue-600/40 font-mono text-4xl leading-none">{step}</div>
                <div className="text-4xl mb-4 mt-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
                <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-blue-300/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-blue-900/40 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <span className="text-white font-black text-xs">W</span>
            </div>
            <span className="font-black text-white">
              WebCraft <span className="text-blue-400">AI</span>
            </span>
          </div>
          <p className="text-sm text-blue-400/50 text-center">
            Built with ❤️ by <strong className="text-blue-300/80">Team Meow</strong> — Rakshith, Ayushi &amp; Bhuvan 🐾
          </p>
          <div className="flex items-center gap-6 text-sm text-blue-400/50">
            <a href="/admin/sites" className="hover:text-blue-300 transition-colors">My Sites</a>
            <a href="/designs" className="hover:text-blue-300 transition-colors">Designs</a>
            <a href="/login" className="hover:text-blue-300 transition-colors">Login</a>
          </div>
        </div>
      </footer>

      {/* ── Template Preview Modal ────────────────────────────────────── */}
      {selected && template && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div
            className="bg-[#0a1628] border border-blue-800/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up"
            style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.1)' }}
          >
            {/* Modal header */}
            <div className={`p-8 bg-gradient-to-br ${template.color} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative flex items-center gap-4">
                <span className="text-5xl">{template.emoji}</span>
                <div>
                  <h2 className="text-3xl font-black text-white">{template.label}</h2>
                  <p className="text-white/70 mt-1 text-sm">{template.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6">
              <p className="text-xs font-bold text-blue-400/60 uppercase tracking-wider mb-3">
                Included Sections ({template.components.length})
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {template.components.map((c: any, i: number) => (
                  <span
                    key={i}
                    className="bg-blue-900/40 border border-blue-700/40 text-blue-200 text-xs font-mono font-medium px-3 py-1.5 rounded-lg capitalize"
                  >
                    {c.type}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openEditor(selected)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/50 hover:shadow-blue-500/30"
                >
                  Use This Template →
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-3.5 border border-blue-700/40 rounded-xl text-blue-300 font-medium hover:bg-blue-900/30 hover:border-blue-600/60 transition-all"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

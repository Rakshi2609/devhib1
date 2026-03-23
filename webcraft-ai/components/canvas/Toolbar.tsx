'use client'
import { useMutation, useStorage } from '@/lib/liveblocks'
import { Page } from '@/lib/liveblocks'

const AVAILABLE_COMPONENTS = [
  { type: 'navbar',       label: '🧭 Navigation Bar',  desc: 'Top nav with links & CTA' },
  { type: 'hero',         label: '🚀 Hero Section',     desc: 'Full-width headline + CTAs' },
  { type: 'about',        label: '👤 About',            desc: 'Text intro / bio section' },
  { type: 'features',     label: '⚡ Features',         desc: '3-column feature cards' },
  { type: 'pricing',      label: '💰 Pricing Table',    desc: 'Tiered pricing plans' },
  { type: 'testimonials', label: '💬 Testimonials',     desc: 'Customer review cards' },
  { type: 'contact',      label: '📩 Contact Form',     desc: 'Name, email & message form' },
  { type: 'image',        label: '🖼️ Image Upload',    desc: 'Upload or paste an image' },
  { type: 'footer',       label: '🔗 Footer',           desc: 'Brand, links & copyright' },
  { type: 'button',       label: '🔘 Button',            desc: 'Link button with custom href' },
]

export default function Toolbar({ readOnly = false }: { readOnly?: boolean }) {
  const pages = useStorage((root: any) => root.pages) as Page[] | null
  const activePage = useStorage((root: any) => root.activePage) as string | null

  const addComponent = useMutation(({ storage }, type: string) => {
    const currentPages: Page[] = (storage.get('pages') as any) || []
    const activeId = storage.get('activePage') as string

    const updated = currentPages.map((p: Page) => {
      if (p.id !== activeId) return p
      const newItem = {
        id: Math.random().toString(36).substring(7),
        type,
        props: {},
      }
      return { ...p, components: [...p.components, newItem] }
    })
    storage.set('pages', updated)
  }, [])

  const activeName = pages?.find((p: Page) => p.id === activePage)?.name || 'Page'

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'transparent' }}>
      {/* Header */}
      <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(30,58,95,0.5)' }}>
        <p className="text-xs font-bold text-blue-400/40 uppercase tracking-wider mb-0.5">Add to</p>
        <p className="text-sm font-bold text-blue-300 truncate">{activeName}</p>
      </div>

      {/* Component list */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
        {AVAILABLE_COMPONENTS.map(comp => (
          <button
            key={comp.type}
            onClick={() => !readOnly && addComponent(comp.type)}
            disabled={readOnly}
            className={`group p-3 text-left rounded-xl transition-all ${ 
              readOnly
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:text-blue-200 cursor-pointer'
            }`}
            style={readOnly
              ? { border: '1px solid rgba(30,58,95,0.3)', background: 'rgba(8,15,30,0.3)' }
              : { border: '1px solid rgba(30,58,95,0.4)', background: 'rgba(8,15,30,0.2)' }
            }
            onMouseEnter={e => {
              if (!readOnly) {
                (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.15)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.4)'
              }
            }}
            onMouseLeave={e => {
              if (!readOnly) {
                (e.currentTarget as HTMLElement).style.background = 'rgba(8,15,30,0.2)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,58,95,0.4)'
              }
            }}
          >
            <div className="font-semibold text-sm text-blue-200/80 group-hover:text-blue-100 transition-colors">
              {comp.label}
            </div>
            <div className="text-xs text-blue-400/40 mt-0.5">{comp.desc}</div>
          </button>
        ))}

        {readOnly && (
          <div className="mt-2 rounded-xl px-3 py-2 text-xs font-medium text-blue-400/60" style={{ border: '1px solid rgba(37,99,235,0.3)', background: 'rgba(37,99,235,0.08)' }}>
            View-only mode: ask for an edit link.
          </div>
        )}
      </div>
    </div>
  )
}

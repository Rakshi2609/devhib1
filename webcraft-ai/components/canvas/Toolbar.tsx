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

export default function Toolbar() {
  const pages = useStorage((root: any) => root.pages) as Page[] | null
  const activePage = useStorage((root: any) => root.activePage) as string | null

  const addComponent = useMutation(({ storage }, type: string) => {
    const currentPages: Page[] = (storage.get('pages') as any) || []
    const activeId = storage.get('activePage') as string

    // Find the active page and append the new component to it
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
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Add to</p>
        <p className="text-sm font-bold text-violet-600 truncate">{activeName}</p>
      </div>

      {/* Component list */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {AVAILABLE_COMPONENTS.map(comp => (
          <button
            key={comp.type}
            onClick={() => addComponent(comp.type)}
            className="group p-3 text-left border border-gray-100 rounded-xl hover:border-violet-300 hover:bg-violet-50/50 transition-all shadow-sm"
          >
            <div className="font-semibold text-sm text-gray-800 group-hover:text-violet-700 transition-colors">
              {comp.label}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{comp.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

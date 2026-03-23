'use client'
import { useStorage, useMutation } from '@/lib/liveblocks'
import { Page } from '@/lib/liveblocks'
import { useState } from 'react'

const PAGE_ICONS: Record<string, string> = {
  home: '🏠', about: '👤', features: '⚡', pricing: '💰',
  contact: '📩', blog: '📝', portfolio: '🎨', services: '🛠️',
}

function getIcon(slug: string) {
  return PAGE_ICONS[slug.toLowerCase()] || '📄'
}

export default function PageSwitcher({ readOnly = false }: { readOnly?: boolean }) {
  const pages = useStorage((root: any) => root.pages) as Page[] | null
  const activePage = useStorage((root: any) => root.activePage) as string | null
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const setActivePage = useMutation(({ storage }, pageId: string) => {
    storage.set('activePage', pageId)
  }, [])

  const addPage = useMutation(({ storage }) => {
    const currentPages: Page[] = (storage.get('pages') as any) || []
    const newId = Math.random().toString(36).substring(7)
    const pageNum = currentPages.length + 1
    const defaultNames = ['Home', 'About', 'Features', 'Pricing', 'Contact', 'Blog', 'Services', 'Portfolio']
    const name = defaultNames[currentPages.length] || `Page ${pageNum}`
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    const newPage: Page = {
      id: newId,
      name,
      slug,
      components: [
        {
          id: `n${newId}`,
          type: 'navbar',
          props: {
            logo: 'My Brand',
            links: [
              { label: 'Home', href: '#home' },
              { label: name, href: `#${slug}` },
            ],
            cta: 'Get Started',
            ctaHref: '#contact',
          }
        },
        {
          id: `h${newId}`,
          type: 'hero',
          props: {
            title: `${name} Page`,
            subtitle: `Welcome to the ${name} page. Click any text to edit it.`,
            bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            cta: 'Get Started',
            ctaHref: '#contact',
            cta2: 'Learn More →',
            cta2Href: '#features',
          }
        },
        {
          id: `f${newId}`,
          type: 'footer',
          props: {
            brand: 'My Brand',
            copy: `© ${new Date().getFullYear()} My Brand.`,
            footerLinks: [
              { label: 'Home', href: '#home' },
              { label: name, href: `#${slug}` },
              { label: 'Contact', href: '#contact' },
            ],
          }
        },
      ],
    }
    storage.set('pages', [...currentPages, newPage])
    storage.set('activePage', newId)
  }, [])

  const deletePage = useMutation(({ storage }, pageId: string) => {
    const currentPages: Page[] = (storage.get('pages') as any) || []
    if (currentPages.length <= 1) return // always keep at least 1 page
    const filtered = currentPages.filter((p: Page) => p.id !== pageId)
    storage.set('pages', filtered)
    const currentActive = storage.get('activePage')
    if (currentActive === pageId) {
      storage.set('activePage', filtered[0].id)
    }
  }, [])

  const renamePage = useMutation(({ storage }, pageId: string, newName: string) => {
    const currentPages: Page[] = (storage.get('pages') as any) || []
    const slug = newName.toLowerCase().replace(/\s+/g, '-')
    const updated = currentPages.map((p: Page) =>
      p.id === pageId ? { ...p, name: newName, slug } : p
    )
    storage.set('pages', updated)
  }, [])

  if (!pages) return null

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pages</span>
        <button
          onClick={() => !readOnly && addPage()}
          disabled={readOnly}
          className={`w-6 h-6 rounded-md text-white flex items-center justify-center text-lg leading-none transition-colors font-bold ${
            readOnly ? 'bg-gray-300 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'
          }`}
          title="Add new page"
        >
          +
        </button>
      </div>

      {/* Page list */}
      <div className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
        {pages.map((page: Page) => (
          <div
            key={page.id}
            className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all select-none ${
              activePage === page.id
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => setActivePage(page.id)}
          >
            <span className="text-base">{getIcon(page.slug)}</span>

            {renamingId === page.id ? (
              <input
                autoFocus
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onBlur={() => {
                  if (renameValue.trim()) renamePage(page.id, renameValue.trim())
                  setRenamingId(null)
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    if (renameValue.trim()) renamePage(page.id, renameValue.trim())
                    setRenamingId(null)
                  }
                  if (e.key === 'Escape') setRenamingId(null)
                }}
                onClick={e => e.stopPropagation()}
                className="flex-1 bg-white/20 text-white placeholder-white/60 outline-none text-sm font-medium rounded px-1 min-w-0"
              />
            ) : (
              <span
                className="flex-1 text-sm font-medium truncate"
                onDoubleClick={e => {
                  if (readOnly) return
                  e.stopPropagation()
                  setRenamingId(page.id)
                  setRenameValue(page.name)
                }}
                title="Double-click to rename"
              >
                {page.name}
              </span>
            )}

            {/* Delete button — shows on hover, disabled if only 1 page */}
            {!readOnly && pages.length > 1 && (
              <button
                onClick={e => { e.stopPropagation(); deletePage(page.id) }}
                className={`opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all hover:scale-110 flex-shrink-0 ${
                  activePage === page.id
                    ? 'hover:bg-white/20 text-white'
                    : 'hover:bg-red-100 text-red-500'
                }`}
                title="Delete page"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 leading-tight">
          {readOnly ? 'View-only mode enabled' : '💡 Double-click a page to rename it'}
        </p>
      </div>
    </div>
  )
}

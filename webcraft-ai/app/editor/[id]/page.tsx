// app/editor/[id]/page.tsx
'use client'
import Canvas from '@/components/canvas/Canvas'
import VoiceCommander from '@/components/voice/VoiceCommander'
import Toolbar from '@/components/canvas/Toolbar'
import PageSwitcher from '@/components/canvas/PageSwitcher'
import ColourPalette from '@/components/ui/ColourPalette'
import DeployModal from '@/components/ui/DeployModal'
import ExportModal from '@/components/ui/ExportModal'
import Collaborators from '@/components/ui/Collaborators'
import LiveCursors from '@/components/ui/LiveCursors'
import { RoomProvider, useMutation, useStorage } from '@/lib/liveblocks'
import { Page } from '@/lib/liveblocks'
import { ClientSideSuspense } from '@liveblocks/react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { TEMPLATE_PRESETS } from '@/lib/templates'
import { showToast } from '@/lib/toast'

// Convert the flat template components into a Pages array
function templateToPages(templateId: string): Page[] {
  const preset = TEMPLATE_PRESETS[templateId] || TEMPLATE_PRESETS['blank']
  const homeId = Math.random().toString(36).substring(7)

  // The template components all go into the "Home" page
  const homePage: Page = {
    id: homeId,
    name: 'Home',
    slug: 'home',
    components: preset.components,
  }

  // If the template has pricing, add a pre-built Contact page too
  const hasContact = preset.components.some((c: any) => c.type === 'contact')
  if (hasContact) return [homePage]

  // Otherwise give them a second starter page to show the feature
  const contactId = Math.random().toString(36).substring(7)
  const contactPage: Page = {
    id: contactId,
    name: 'Contact',
    slug: 'contact',
    components: [
      {
        id: `n${contactId}`,
        type: 'navbar',
        props: {
          logo: 'My Brand',
          links: [
            { label: 'Home', href: '#home' },
            { label: 'Contact', href: '#contact' },
          ],
          cta: 'Back to Home',
          ctaHref: '#home',
        },
      },
      {
        id: `c${contactId}`,
        type: 'contact',
        props: { heading: 'Get In Touch', subtitle: 'Have questions? We\'d love to hear from you.' },
      },
      {
        id: `f${contactId}`,
        type: 'footer',
        props: {
          brand: 'My Brand',
          copy: `© ${new Date().getFullYear()} My Brand.`,
          footerLinks: [
            { label: 'Home', href: '#home' },
            { label: 'Contact', href: '#contact' },
          ],
        },
      },
    ],
  }

  return [homePage, contactPage]
}

function siteContentToPages(site: any): Page[] {
  const pageId = Math.random().toString(36).substring(7)
  const content = site?.content || {}

  const components: any[] = [
    {
      id: `n${pageId}`,
      type: 'navbar',
      props: {
        logo: site?.title || 'My Brand',
        links: [
          { label: 'Home', href: '#home' },
          { label: 'About', href: '#about' },
          { label: 'Contact', href: '#contact' },
        ],
        cta: 'Contact',
        ctaHref: '#contact',
      },
    },
    {
      id: `h${pageId}`,
      type: 'hero',
      props: {
        title: content?.hero?.heading || site?.title || 'Welcome',
        subtitle: content?.hero?.subheading || site?.description || 'Upgraded with WebCraft AI',
        cta: 'Get Started',
        ctaHref: '#contact',
      },
    },
  ]

  if (content?.about?.heading || content?.about?.body) {
    components.push({
      id: `a${pageId}`,
      type: 'about',
      props: {
        heading: content?.about?.heading || 'About',
        body: content?.about?.body || '',
      },
    })
  }

  components.push({
    id: `c${pageId}`,
    type: 'contact',
    props: {
      heading: 'Get In Touch',
      subtitle: content?.contact?.email ? `Email: ${content.contact.email}` : 'We would love to hear from you.',
    },
  })

  components.push({
    id: `f${pageId}`,
    type: 'footer',
    props: {
      brand: site?.title || 'My Brand',
      copy: `© ${new Date().getFullYear()} ${site?.title || 'My Brand'}`,
      footerLinks: [
        { label: 'Home', href: '#home' },
        { label: 'Contact', href: '#contact' },
      ],
    },
  })

  return [{ id: pageId, name: 'Home', slug: 'home', components }]
}

function EditorContent() {
  const router = useRouter()
  const { id } = useParams()
  const searchParams = useSearchParams()
  const templateId = searchParams?.get('template') || 'blank'
  const cloneSubdomain = searchParams?.get('cloneSubdomain') || ''
  const ownerUsername = searchParams?.get('owner') || ''
  const inviteMode = searchParams?.get('mode')
  const inviteToken = searchParams?.get('token')
  const [showDeploy, setShowDeploy] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [role, setRole] = useState<'owner' | 'edit' | 'view' | 'none' | null>(null)
  const [authUser, setAuthUser] = useState<string | null>(null)

  const pages = useStorage((root: any) => root.pages) as Page[] | null
  const activePage = useStorage((root: any) => root.activePage) as string | null

  const canEdit = role === 'owner' || role === 'edit'

  const initTemplate = useMutation(({ storage }, clonePages?: Page[] | null) => {
    const existingPages = storage.get('pages') as any
    if (!existingPages || (existingPages as any[]).length === 0) {
      const newPages = clonePages && clonePages.length > 0 ? clonePages : templateToPages(templateId)
      storage.set('pages', newPages)
      storage.set('activePage', newPages[0].id)
    } else {
      // Ensure activePage is set if missing
      const active = storage.get('activePage')
      if (!active && existingPages.length > 0) {
        storage.set('activePage', existingPages[0].id)
      }
    }
    setInitialized(true)
  }, [templateId])

  useEffect(() => {
    if (!initialized && pages !== null) {
      if (cloneSubdomain) {
        fetch(`/api/sites/public?subdomain=${encodeURIComponent(cloneSubdomain)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data?.site) {
              initTemplate(siteContentToPages(data.site))
            } else {
              initTemplate(null)
            }
          })
          .catch(() => initTemplate(null))
      } else {
        initTemplate(null)
      }
    }
  }, [pages, initialized, initTemplate, cloneSubdomain])

  useEffect(() => {
    let active = true

    const checkAuth = async () => {
      const res = await fetch('/api/auth/me')
      if (!res.ok) {
        const nextPath = `${window.location.pathname}${window.location.search}`
        router.replace(`/login?next=${encodeURIComponent(nextPath)}`)
        return
      }

      const data = await res.json()
      if (!active) return

      setAuthUser(data?.data?.username || null)
      setIsAuthLoading(false)
    }

    checkAuth()
    return () => {
      active = false
    }
  }, [router])

  useEffect(() => {
    if (isAuthLoading) return

    let active = true
    const resolveRole = async () => {
      if (inviteToken && (inviteMode === 'edit' || inviteMode === 'view')) {
        await fetch('/api/rooms/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId: id, token: inviteToken }),
        })
      }

      const meRes = await fetch(`/api/rooms/${id}/me`)
      if (!meRes.ok) {
        setRole('none')
        return
      }

      const meData = await meRes.json()
      if (!active) return
      setRole(meData?.role || 'none')
    }

    resolveRole()
    return () => {
      active = false
    }
  }, [id, inviteToken, inviteMode, isAuthLoading])

  const createShareLink = async (access: 'edit' | 'view', presenter?: string) => {
    showToast('Generating share link...', 'info')
    const res = await fetch('/api/rooms/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: id, access }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      showToast(data?.error || 'Could not generate link', 'error')
      return
    }

    const data = await res.json()
    await navigator.clipboard.writeText(data.link)
    if (presenter) {
      const notifyRes = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUsername: presenter,
          roomId: id,
          link: data.link,
          message: `${authUser || 'A collaborator'} has shared an improved design for your review.`,
        }),
      })

      if (!notifyRes.ok) {
        showToast(`Link copied. Could not notify @${presenter}`, 'error')
        return
      }

      showToast(`Presented to @${presenter}. Inbox notification sent.`, 'success')
      return
    }
    showToast(`${access === 'edit' ? 'Edit' : 'View'} link copied`, 'success')
  }

  const handleVoiceCommand = (command: any) => {
    console.log('Voice command received:', command)
  }

  const templateName = TEMPLATE_PRESETS[templateId]?.label || 'Editor'
  const activeP = pages?.find((p: Page) => p.id === activePage)

  // Gather all components from all pages for export
  const allComponents = pages?.flatMap((p: Page) => p.components) ?? []

  if (isAuthLoading || role === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'linear-gradient(135deg, #020817 0%, #0a1628 100%)' }}>
        <div className="w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-blue-300/60 text-sm">Preparing collaboration room...</p>
      </div>
    )
  }

  if (role === 'none') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-6 text-center" style={{ background: 'linear-gradient(135deg, #020817 0%, #0a1628 100%)' }}>
        <p className="text-xl font-bold text-white">No access to this room</p>
        <p className="text-blue-300/60">Ask the owner for a valid share link with edit or view access.</p>
        <a href="/" className="mt-4 text-sm text-blue-400 hover:text-blue-300 underline">← Back to Home</a>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0d1117] text-gray-900 editor-root">
      {/* Fixed top bar — navy dark */}
      <header className="flex-shrink-0 z-30" style={{ background: 'rgba(6,13,26,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(30,58,95,0.6)', boxShadow: '0 1px 20px rgba(0,0,0,0.5)' }}>
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xs">W</span>
              </div>
              <span className="text-base font-black text-white tracking-tight">WebCraft<span className="text-blue-400"> AI</span></span>
            </a>
            <a href="/designs" className="text-xs font-bold px-2 py-1 rounded-md border border-blue-700/50 text-blue-300 bg-blue-900/30 hover:bg-blue-800/40 transition-colors">
              Designs
            </a>
            <span className="text-blue-800">|</span>
            <span className="text-sm text-blue-400/70 font-medium">{templateName} Template</span>
            {activeP && (
              <>
                <span className="text-blue-700">›</span>
                <span className="text-sm font-semibold text-blue-300">{activeP.name}</span>
              </>
            )}
            <span className="text-xs text-blue-300/70 bg-blue-900/40 border border-blue-700/40 px-2.5 py-1 rounded-md font-semibold uppercase">
              {role === 'owner' ? 'Owner' : role === 'edit' ? 'Editor' : 'Viewer'}
            </span>
            {authUser && <span className="text-xs text-blue-400/50 font-mono">@{authUser}</span>}
            {ownerUsername && (
              <span className="text-xs text-blue-300 bg-blue-900/30 border border-blue-700/40 px-2.5 py-1 rounded-md font-semibold">
                Owner: @{ownerUsername}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-400/60 bg-blue-900/30 border border-blue-800/40 px-3 py-1.5 rounded-lg font-medium">
              {pages?.length ?? 0}p
            </span>
            <Collaborators />
            {role === 'owner' && (
              <>
                <button
                  onClick={() => createShareLink('view')}
                  className="text-sm font-medium text-blue-300/70 hover:text-blue-200 transition-colors border border-blue-800/50 hover:border-blue-600/60 px-3 py-2 rounded-lg bg-blue-900/20 hover:bg-blue-800/30"
                >
                  🔗 Share View
                </button>
                <button
                  onClick={() => createShareLink('edit')}
                  className="text-sm font-medium text-blue-300/70 hover:text-blue-200 transition-colors border border-blue-800/50 hover:border-blue-600/60 px-3 py-2 rounded-lg bg-blue-900/20 hover:bg-blue-800/30"
                >
                  ✏️ Share Edit
                </button>
                {ownerUsername && (
                  <button
                    onClick={() => createShareLink('view', ownerUsername)}
                    className="text-sm font-medium text-blue-300/70 hover:text-blue-200 transition-colors border border-blue-800/50 hover:border-blue-600/60 px-3 py-2 rounded-lg bg-blue-900/20 hover:bg-blue-800/30"
                  >
                    📣 Present to @{ownerUsername}
                  </button>
                )}
              </>
            )}
            <button
              onClick={() => window.open(`/preview/${id as string}`, '_blank')}
              className="text-sm font-medium text-blue-300/70 hover:text-blue-200 transition-colors border border-blue-800/50 hover:border-blue-600/60 px-3 py-2 rounded-lg bg-blue-900/20 hover:bg-blue-800/30"
            >
              👁 Preview
            </button>
            <button
              onClick={() => setShowExport(true)}
              className="text-sm font-medium text-blue-300/70 hover:text-blue-200 transition-colors border border-blue-800/50 hover:border-blue-600/60 px-3 py-2 rounded-lg bg-blue-900/20 hover:bg-blue-800/30"
            >
              💻 Export
            </button>
            <button
              onClick={() => setShowDeploy(true)}
              disabled={!canEdit}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-5 py-2 rounded-lg text-sm shadow-lg shadow-blue-900/50 transition-all disabled:opacity-40"
            >
              🚀 Deploy
            </button>
          </div>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Pages + Components stacked — dark navy sidebar */}
        <div className="flex flex-col w-60 flex-shrink-0" style={{ background: '#080f1e', borderRight: '1px solid rgba(30,58,95,0.5)' }}>
          {/* Pages section */}
          <div className="flex-shrink-0" style={{ borderBottom: '1px solid rgba(30,58,95,0.5)', minHeight: '200px', maxHeight: '280px' }}>
            <PageSwitcher readOnly={!canEdit} />
          </div>
          {/* Components section */}
          <div className="flex-1 min-h-0">
            <Toolbar readOnly={!canEdit} />
          </div>
        </div>

        {/* Canvas area — light bg for contrast with components */}
        <main className="flex-1 relative overflow-y-auto" style={{ background: '#111827' }}>
          {/* Hint bar */}
          <div className="sticky top-0 z-10 px-6 py-2 text-xs font-medium flex items-center gap-2" style={{ background: 'rgba(8,15,30,0.9)', borderBottom: '1px solid rgba(30,58,95,0.4)', backdropFilter: 'blur(8px)', color: '#60a5fa' }}>
            <span>💡</span>
            <span><strong>Click text</strong> to edit · <strong>Drag ⠿</strong> to reorder · <strong>✕</strong> to delete · Use the <strong>Pages panel</strong> to switch pages</span>
          </div>
          {/* Canvas wrapper */}
          <div className="max-w-5xl mx-auto py-6 px-4">
            <Canvas readOnly={!canEdit} />
          </div>
        </main>

        {/* Right sidebar */}
        <div className="w-56 flex-shrink-0 overflow-y-auto" style={{ background: '#080f1e', borderLeft: '1px solid rgba(30,58,95,0.5)' }}>
          <ColourPalette />
        </div>
      </div>

      <VoiceCommander onCommand={handleVoiceCommand} />
      <LiveCursors myName={authUser || 'Guest'} canShare={true} />
      {canEdit && showDeploy && <DeployModal onClose={() => setShowDeploy(false)} />}
      {showExport && <ExportModal components={allComponents} theme="midnight" onClose={() => setShowExport(false)} />}
    </div>
  )
}

export default function EditorPage() {
  const { id } = useParams()

  return (
    <RoomProvider
      id={id as string}
      initialStorage={{ pages: [], activePage: '', colorPalette: 'midnight', components: [] }}
    >
      <ClientSideSuspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading editor...</p>
        </div>
      }>
        {() => <EditorContent />}
      </ClientSideSuspense>
    </RoomProvider>
  )
}

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Preparing collaboration room...</p>
      </div>
    )
  }

  if (role === 'none') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3 px-6 text-center">
        <p className="text-xl font-bold text-gray-800">No access to this room</p>
        <p className="text-gray-500">Ask the owner for a valid share link with edit or view access.</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-100 text-gray-900">
      {/* Fixed top bar */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-30">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-4">
            <a href="/" className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              WebCraft AI
            </a>
            <a href="/designs" className="text-xs font-bold px-2 py-1 rounded-md border border-violet-200 text-violet-600 bg-violet-50">
              Designs
            </a>
            <span className="text-gray-200">|</span>
            <span className="text-sm text-gray-500 font-medium">{templateName} Template</span>
            {activeP && (
              <>
                <span className="text-gray-200">›</span>
                <span className="text-sm font-semibold text-violet-600">{activeP.name}</span>
              </>
            )}
            <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md font-semibold uppercase">
              {role === 'owner' ? 'Owner' : role === 'edit' ? 'Editor' : 'Viewer'}
            </span>
            {authUser && <span className="text-xs text-gray-400">@{authUser}</span>}
            {ownerUsername && (
              <span className="text-xs text-violet-600 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-md font-semibold">
                Owner: @{ownerUsername}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg font-medium">
              {pages?.length ?? 0} page{(pages?.length ?? 0) !== 1 ? 's' : ''}
            </span>
            <Collaborators />
            {role === 'owner' && (
              <>
                <button
                  onClick={() => createShareLink('view')}
                  className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors border border-gray-200 hover:border-violet-300 px-4 py-2 rounded-lg"
                >
                  🔗 Share View
                </button>
                <button
                  onClick={() => createShareLink('edit')}
                  className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors border border-gray-200 hover:border-violet-300 px-4 py-2 rounded-lg"
                >
                  ✏️ Share Edit
                </button>
                {ownerUsername && (
                  <button
                    onClick={() => createShareLink('view', ownerUsername)}
                    className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors border border-gray-200 hover:border-violet-300 px-4 py-2 rounded-lg"
                  >
                    📣 Present to @{ownerUsername}
                  </button>
                )}
              </>
            )}
            <button
              onClick={() => window.open(`/preview/${id as string}`, '_blank')}
              className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors border border-gray-200 hover:border-violet-300 px-4 py-2 rounded-lg"
            >
              👁 Preview
            </button>
            <button
              onClick={() => setShowExport(true)}
              className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors border border-gray-200 hover:border-violet-300 px-4 py-2 rounded-lg"
            >
              💻 Export Code
            </button>
            <button
              onClick={() => setShowDeploy(true)}
              disabled={!canEdit}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold px-5 py-2 rounded-lg text-sm shadow-md shadow-violet-200 transition-all"
            >
              🚀 Deploy
            </button>
          </div>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Pages + Components stacked */}
        <div className="flex flex-col w-60 flex-shrink-0 bg-white border-r border-gray-200">
          {/* Pages section (top ~40% of sidebar) */}
          <div className="flex-shrink-0 border-b border-gray-100" style={{ minHeight: '200px', maxHeight: '280px' }}>
            <PageSwitcher readOnly={!canEdit} />
          </div>
          {/* Components section (rest of sidebar) */}
          <div className="flex-1 min-h-0">
            <Toolbar readOnly={!canEdit} />
          </div>
        </div>

        {/* Canvas area */}
        <main className="flex-1 relative overflow-y-auto bg-gray-100">
          {/* Hint bar */}
          <div className="sticky top-0 z-10 bg-amber-50 border-b border-amber-100 px-6 py-2 text-xs text-amber-700 font-medium flex items-center gap-2">
            <span>💡</span>
            <span><strong>Click text</strong> to edit · <strong>Drag ⠿</strong> to reorder · <strong>✕</strong> to delete · Use the <strong>Pages panel</strong> to switch pages</span>
          </div>
          {/* Canvas */}
          <div className="max-w-5xl mx-auto py-6 px-4">
            <Canvas readOnly={!canEdit} />
          </div>
        </main>

        {/* Right sidebar */}
        <div className="w-56 flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto">
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

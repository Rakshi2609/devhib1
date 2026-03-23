// app/preview/[id]/page.tsx
'use client'
import { RoomProvider, useStorage } from '@/lib/liveblocks'
import { Page } from '@/lib/liveblocks'
import { ClientSideSuspense } from '@liveblocks/react'
import Component from '@/components/canvas/Component'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { PreviewContext } from '@/lib/preview-context'

function PreviewContent() {
  const pages = useStorage((root: any) => root.pages) as Page[] | null
  const [activePageId, setActivePageId] = useState<string | null>(null)

  if (!pages || pages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-gray-50">
        Nothing to preview yet.
      </div>
    )
  }

  // Resolve the active page — default to first page
  const activePg = pages.find((p: Page) => p.id === activePageId) ?? pages[0]

  return (
    <PreviewContext.Provider value={{ pages: pages as Page[], setActivePageId }}>
      <div className="min-h-screen bg-white">
        {/* Multi-page tab bar (only shown if >1 page) */}
        {pages.length > 1 && (
          <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 flex items-center gap-1 overflow-x-auto">
              {pages.map((page: Page) => (
                <button
                  key={page.id}
                  onClick={() => setActivePageId(page.id)}
                  className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                    activePg.id === page.id
                      ? 'border-violet-600 text-violet-600'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                  }`}
                >
                  {page.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Render all sections of the active page */}
        <div className="w-full">
          {activePg.components.map((c: any) => (
            <Component key={c.id} {...c} isPreview={true} />
          ))}

          {activePg.components.length === 0 && (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-400 gap-3">
              <span className="text-4xl">📄</span>
              <p className="font-semibold">The <em>{activePg.name}</em> page has no sections yet.</p>
              <p className="text-sm">Go back to the editor and add some components.</p>
            </div>
          )}
        </div>

        {/* Page navigation footer (shown if >1 page) */}
        {pages.length > 1 && (
          <div className="border-t border-gray-100 bg-gray-50 py-6">
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-3 flex-wrap">
              <span className="text-sm text-gray-400 font-medium mr-2">Go to page:</span>
              {pages.map((page: Page) => (
                <button
                  key={page.id}
                  onClick={() => { setActivePageId(page.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all border ${
                    activePg.id === page.id
                      ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-600'
                  }`}
                >
                  {page.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </PreviewContext.Provider>
  )
}

export default function PreviewPage() {
  const { id } = useParams()

  return (
    <RoomProvider id={id as string} initialStorage={{ pages: [], activePage: '', colorPalette: 'midnight', components: [] }}>
      <ClientSideSuspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 gap-3">
          <div className="w-6 h-6 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading preview...</span>
        </div>
      }>
        {() => <PreviewContent />}
      </ClientSideSuspense>
    </RoomProvider>
  )
}

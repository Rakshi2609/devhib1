// app/editor/[id]/page.tsx
'use client'
import Canvas from '@/components/canvas/Canvas'
import VoiceCommander from '@/components/voice/VoiceCommander'
import Toolbar from '@/components/canvas/Toolbar'
import ColourPalette from '@/components/ui/ColourPalette'
import DeployModal from '@/components/ui/DeployModal'
import ExportModal from '@/components/ui/ExportModal'
import { RoomProvider, useMutation, useStorage } from '@/lib/liveblocks'
import { ClientSideSuspense } from '@liveblocks/react'
import { useParams, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { TEMPLATE_PRESETS } from '@/lib/templates'

function EditorContent() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const templateId = searchParams?.get('template') || 'blank'
  const [showDeploy, setShowDeploy] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const components = useStorage((root: any) => root.components)

  const initTemplate = useMutation(({ storage }) => {
    const existing = storage.get('components')
    if (!existing || (existing as any[]).length === 0) {
      const preset = TEMPLATE_PRESETS[templateId] || TEMPLATE_PRESETS['blank']
      storage.set('components', preset.components)
    }
    setInitialized(true)
  }, [templateId])

  useEffect(() => {
    if (!initialized && components !== null) {
      initTemplate()
    }
  }, [components, initialized, initTemplate])

  const handleVoiceCommand = (command: any) => {
    console.log('Voice command received:', command)
  }

  const templateName = TEMPLATE_PRESETS[templateId]?.label || 'Editor'

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-100 text-gray-900">
      {/* Fixed top bar */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-30">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-4">
            <a href="/" className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              WebCraft AI
            </a>
            <span className="text-gray-200">|</span>
            <span className="text-sm text-gray-500 font-medium">{templateName} Template</span>
          </div>
          <div className="flex items-center gap-3">
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
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold px-5 py-2 rounded-lg text-sm shadow-md shadow-violet-200 transition-all"
            >
              🚀 Deploy
            </button>
          </div>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <main className="flex-1 relative overflow-y-auto bg-gray-100">
          {/* Hint bar */}
          <div className="sticky top-0 z-10 bg-amber-50 border-b border-amber-100 px-6 py-2 text-xs text-amber-700 font-medium flex items-center gap-2">
            <span>💡 Tip:</span>
            <span><strong>Click any text</strong> to edit it · <strong>Drag the ⠿ handle</strong> to reorder sections · <strong>✕</strong> to delete a section</span>
          </div>
          {/* Canvas */}
          <div className="max-w-5xl mx-auto py-6 px-4">
            <Canvas />
          </div>
        </main>
        {/* Right sidebar */}
        <div className="w-64 flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto">
          <ColourPalette />
        </div>
      </div>

      <VoiceCommander onCommand={handleVoiceCommand} />
      {showDeploy && <DeployModal onClose={() => setShowDeploy(false)} />}
      {showExport && <ExportModal components={components as any[]} theme="midnight" onClose={() => setShowExport(false)} />}
    </div>
  )
}

export default function EditorPage() {
  const { id } = useParams()

  return (
    <RoomProvider id={id as string} initialStorage={{ components: [], colorPalette: 'midnight' }}>
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

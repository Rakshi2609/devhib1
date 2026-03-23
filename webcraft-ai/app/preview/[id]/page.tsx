// app/preview/[id]/page.tsx
'use client'
import { RoomProvider, useStorage } from '@/lib/liveblocks'
import { ClientSideSuspense } from '@liveblocks/react'
import Component from '@/components/canvas/Component'
import { useParams } from 'next/navigation'

function PreviewContent() {
  const components = useStorage((root: any) => root.components)
  
  if (!components || components.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400 bg-gray-50">Nothing to preview yet.</div>
  }

  return (
    <div className="min-h-screen relative bg-white">
      {components.map((c: any) => (
        <Component key={c.id} {...c} isPreview={true} />
      ))}
    </div>
  )
}

export default function PreviewPage() {
  const { id } = useParams()

  return (
    <RoomProvider id={id as string} initialStorage={{ components: [], colorPalette: 'midnight' }}>
      <ClientSideSuspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">Loading preview...</div>}>
         {() => <PreviewContent />}
      </ClientSideSuspense>
    </RoomProvider>
  )
}

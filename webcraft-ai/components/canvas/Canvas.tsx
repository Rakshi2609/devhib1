'use client'
import { Rnd } from 'react-rnd'
import { useStorage, useMutation } from '@/lib/liveblocks'
import Component from './Component'

export default function Canvas() {
  const components = useStorage((root: any) => root.components)

  const updatePosition = useMutation(({ storage }, id: string, d: { x: number, y: number }) => {
    const items: any[] = storage.get('components') as any
    const updated = items.map((c: any) => c.id === id ? { ...c, position: { x: d.x, y: d.y } } : c)
    storage.set('components', updated)
  }, [])

  const updateSize = useMutation(({ storage }, id: string, size: { w: number | string, h: number | string }, position: { x: number, y: number }) => {
    const items: any[] = storage.get('components') as any
    const updated = items.map((c: any) => c.id === id ? { ...c, size, position } : c)
    storage.set('components', updated)
  }, [])

  const removeComponent = useMutation(({ storage }, id: string) => {
    const items: any[] = storage.get('components') as any
    storage.set('components', items.filter((c: any) => c.id !== id))
  }, [])

  if (!components) {
    return <div className="flex flex-col w-full h-full min-h-[800px] bg-gray-50 items-center justify-center">Loading canvas...</div>
  }

  return (
    <div className="relative w-full h-[3000px] bg-gray-50/50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden">
      {components.map((component: any) => {
        // Defaults if missing (from old 1D layout)
        const pos = component.position || { x: 50, y: 50 }
        const size = component.size || { w: component.type === 'text' ? 300 : 800, h: 'auto' }
        
        return (
          <Rnd
            key={component.id}
            size={{ width: size.w, height: size.h }}
            position={{ x: pos.x, y: pos.y }}
            onDragStop={(e, d) => updatePosition(component.id, { x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateSize(component.id, { w: ref.style.width, h: ref.style.height }, position)
            }}
            bounds="parent"
            dragHandleClassName="drag-handle"
            className="group absolute"
          >
            <div className="w-full h-full relative rounded-2xl shadow-sm hover:shadow-xl hover:ring-2 hover:ring-violet-400 transition-shadow bg-white overflow-hidden flex flex-col">
              
              {/* Drag Handle & Controls overlay */}
              <div className="absolute top-2 left-2 z-50 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="drag-handle cursor-grab active:cursor-grabbing bg-gray-900/80 backdrop-blur text-white px-2 py-1.5 rounded-lg flex items-center justify-center shadow-lg hover:bg-black transition-colors" title="Drag to move">
                  <span className="text-sm">✥ Move</span>
                </div>
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); removeComponent(component.id) }}
                  className="bg-red-500 text-white p-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors shadow-lg"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
              
              <div className="w-full flex-1 overflow-hidden relative">
                <Component {...component} />
              </div>
            </div>
          </Rnd>
        )
      })}
      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-gray-400 font-bold bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
            Click a component in the sidebar to add it to this free-form canvas!
          </p>
        </div>
      )}
    </div>
  )
}

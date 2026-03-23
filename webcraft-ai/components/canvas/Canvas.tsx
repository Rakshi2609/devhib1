'use client'
import { useStorage, useMutation } from '@/lib/liveblocks'
import { Page } from '@/lib/liveblocks'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import Component from './Component'

export default function Canvas() {
  const pages = useStorage((root: any) => root.pages) as Page[] | null
  const activePage = useStorage((root: any) => root.activePage) as string | null

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  // Get the active page object + its components
  const activePg = pages?.find((p: Page) => p.id === activePage) ?? null
  const components = activePg?.components ?? []

  const reorderComponents = useMutation(({ storage }, oldIndex: number, newIndex: number) => {
    const currentPages: Page[] = (storage.get('pages') as any) || []
    const activeId = storage.get('activePage') as string
    const updated = currentPages.map((p: Page) => {
      if (p.id !== activeId) return p
      return { ...p, components: arrayMove(p.components, oldIndex, newIndex) }
    })
    storage.set('pages', updated)
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = components.findIndex((c: any) => c.id === active.id)
    const newIndex = components.findIndex((c: any) => c.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderComponents(oldIndex, newIndex)
    }
  }

  if (!pages) {
    return (
      <div className="flex flex-col w-full min-h-[400px] bg-gray-50 items-center justify-center rounded-2xl">
        <div className="w-6 h-6 border-3 border-violet-500 border-t-transparent rounded-full animate-spin mb-2" />
        <span className="text-gray-400 text-sm">Loading canvas...</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Page indicator banner */}
      {activePg && (
        <div className="mb-3 flex items-center gap-2 px-1">
          <span className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
            📄 {activePg.name}
          </span>
          <span className="text-xs text-gray-400">{components.length} section{components.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={components.map((c: any) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-0 bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm min-h-[300px]">
            {components.map((component: any) => (
              <Component
                key={component.id}
                {...component}
                isPreview={false}
              />
            ))}

            {components.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                <div className="text-4xl mb-4">🎨</div>
                <p className="text-gray-500 font-semibold text-lg mb-1">This page is empty</p>
                <p className="text-gray-400 text-sm">
                  Click a component in the left panel to add it to <strong>{activePg?.name || 'this page'}</strong>
                </p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

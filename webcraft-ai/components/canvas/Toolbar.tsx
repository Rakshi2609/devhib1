'use client'
import { useMutation } from '@/lib/liveblocks'

const AVAILABLE_COMPONENTS = [
  { type: 'navbar', label: 'Navigation Bar' },
  { type: 'hero', label: 'Hero Section' },
  { type: 'features', label: 'Features' },
  { type: 'pricing', label: 'Pricing Table' },
  { type: 'testimonials', label: 'Testimonials' },
  { type: 'image', label: 'Image Upload' },
  { type: 'footer', label: 'Footer' },
]

export default function Toolbar() {
  const addComponent = useMutation(({ storage }, type: string) => {
    const items = storage.get('components')
    const newItem = {
      id: Math.random().toString(36).substring(7),
      type,
      props: {}
    }
    storage.set('components', [...items, newItem])
  }, [])

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-6 text-gray-800">Components</h2>
      <div className="flex flex-col gap-3">
        {AVAILABLE_COMPONENTS.map(comp => (
          <button
            key={comp.type}
            onClick={() => addComponent(comp.type)}
            className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-violet-300 transition-colors shadow-sm text-gray-700"
          >
            {comp.label}
          </button>
        ))}
      </div>
    </div>
  )
}

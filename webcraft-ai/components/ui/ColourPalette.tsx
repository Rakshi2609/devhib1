'use client'
import { useMutation, useStorage } from '@/lib/liveblocks'
import { palettes } from '@/lib/palettes'

export default function ColourPalette() {
  const currentPalette = useStorage((root: any) => root.colorPalette)

  const setPalette = useMutation(({ storage }, paletteName: string) => {
    storage.set('colorPalette', paletteName)
  }, [])

  return (
    <div className="p-5">
      <h3 className="text-xs font-bold text-blue-400/60 uppercase tracking-wider mb-4">Theme</h3>
      <div className="flex flex-col gap-2">
        {Object.entries(palettes).map(([name, colors]) => (
          <button
            key={name}
            onClick={() => setPalette(name)}
            className={`flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
              currentPalette === name ? 'ring-2 ring-blue-500' : 'hover:bg-blue-900/20'
            }`}
            style={currentPalette === name ? { background: 'rgba(37,99,235,0.15)' } : {}}
          >
            <div className="flex rounded-lg overflow-hidden w-14 h-7 flex-shrink-0 shadow-sm">
              {colors.map((c: string) => (
                <div key={c} style={{ backgroundColor: c }} className="flex-1 h-full" />
              ))}
            </div>
            <span className="text-sm text-blue-200/70 capitalize font-medium">{name}</span>
            {currentPalette === name && <span className="ml-auto text-blue-400 text-xs">✓</span>}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xs font-bold text-blue-400/60 uppercase tracking-wider mb-4">Page Info</h3>
        <div className="space-y-2 text-xs text-blue-400/40">
          <p>📐 Max width: 1280px</p>
          <p>📱 Mobile responsive</p>
          <p>⚡ Optimized for Vercel</p>
        </div>
      </div>
    </div>
  )
}

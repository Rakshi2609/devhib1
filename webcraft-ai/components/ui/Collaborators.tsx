'use client'

import { useOthers } from '@/lib/liveblocks'

export default function Collaborators() {
  const others = useOthers()
  const names = others.map((other: any) => other.info?.name || 'Guest')

  if (names.length === 0) {
    return (
      <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg font-medium">
        Solo session
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 font-medium">Live now:</span>
      <div className="flex items-center gap-1">
        {names.slice(0, 3).map((name: string, i: number) => (
          <span key={`${name}-${i}`} className="text-xs text-white bg-violet-600 px-2.5 py-1 rounded-full font-semibold">
            {name}
          </span>
        ))}
        {names.length > 3 && (
          <span className="text-xs text-gray-500 font-semibold">+{names.length - 3}</span>
        )}
      </div>
    </div>
  )
}

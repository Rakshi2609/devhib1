'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMyPresence, useOthers } from '@/lib/liveblocks'

type CursorPoint = { x: number; y: number } | null

type LiveCursorsProps = {
  myName: string
  canShare: boolean
}

const PRESET_COLORS = ['#7c3aed', '#0891b2', '#16a34a', '#ea580c', '#db2777', '#4f46e5']

export default function LiveCursors({ myName, canShare }: LiveCursorsProps) {
  const others = useOthers()
  const [presence, updateMyPresence] = useMyPresence()
  const [pointerEnabled, setPointerEnabled] = useState(true)

  const defaultColor = useMemo(() => PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)], [])
  const myColor = presence.cursorColor || defaultColor

  useEffect(() => {
    updateMyPresence({
      name: myName,
      cursorColor: myColor,
      pointerEnabled,
    })
  }, [myName, myColor, pointerEnabled, updateMyPresence])

  useEffect(() => {
    if (!canShare || !pointerEnabled) {
      updateMyPresence({ cursor: null })
      return
    }

    let rafId = 0
    const handleMove = (e: PointerEvent) => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        updateMyPresence({ cursor: { x: e.clientX, y: e.clientY } })
        rafId = 0
      })
    }

    const clearCursor = () => {
      updateMyPresence({ cursor: null })
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerleave', clearCursor)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerleave', clearCursor)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [canShare, pointerEnabled, updateMyPresence])

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 pointer-events-auto rounded-xl border border-gray-200 bg-white/95 backdrop-blur px-3 py-2 shadow-lg shadow-gray-200">
        <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1">Pointer Tool</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPointerEnabled((v) => !v)}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border ${
              pointerEnabled ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            {pointerEnabled ? 'On' : 'Off'}
          </button>
          <input
            type="color"
            value={myColor}
            onChange={(e) => updateMyPresence({ cursorColor: e.target.value })}
            className="h-7 w-10 p-0 border border-gray-200 rounded cursor-pointer"
            title="Pick cursor color"
          />
          <span className="text-[11px] text-gray-500">{myName}</span>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 z-50">
        {others.map((other: any) => {
          const cursor: CursorPoint = other.presence?.cursor || null
          const visible = other.presence?.pointerEnabled !== false
          if (!cursor || !visible) return null

          const name = other.presence?.name || other.info?.name || 'Guest'
          const color = other.presence?.cursorColor || '#7c3aed'

          return (
            <div
              key={other.connectionId}
              className="absolute"
              style={{ left: cursor.x, top: cursor.y, transform: 'translate(10px, 8px)' }}
            >
              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="drop-shadow">
                  <path d="M1 1L1 13L4.5 9.5L7.5 15L10 14L7 8L12.5 8L1 1Z" fill={color} />
                </svg>
                <span
                  className="absolute left-4 top-3 px-1.5 py-0.5 rounded text-[10px] font-semibold text-white whitespace-nowrap"
                  style={{ backgroundColor: color }}
                >
                  {name}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

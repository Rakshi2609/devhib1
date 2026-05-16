'use client'
import { useState, useRef, useEffect } from 'react'

interface VoiceCommanderProps {
  onCommand: (cmd: any) => void
}

export default function VoiceCommander({ onCommand }: VoiceCommanderProps) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [log, setLog] = useState<{ text: string; time: string }[]>([])
  const [showLog, setShowLog] = useState(false)
  const recognitionRef = useRef<any>(null)

  const startListening = () => {
    if (listening) {
      recognitionRef.current?.stop()
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser. Try Chrome.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognitionRef.current = recognition

    recognition.onstart = () => {
      setListening(true)
      setTranscript('')
      setInterimText('')
    }

    recognition.onend = () => {
      setListening(false)
      setInterimText('')
    }

    recognition.onerror = () => {
      setListening(false)
      setInterimText('')
    }

    recognition.onresult = async (event: any) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += text
        } else {
          interim += text
        }
      }

      if (interim) setInterimText(interim)

      if (final) {
        setInterimText('')
        setTranscript(final.trim())
        const timestamp = new Date().toLocaleTimeString()
        setLog(prev => [{ text: final.trim(), time: timestamp }, ...prev.slice(0, 9)])

        // Try to send to AI API for command parsing
        try {
          const res = await fetch('/api/voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: final.trim() }),
          })
          if (res.ok) {
            const data = await res.json()
            if (data.action) onCommand(data)
          }
        } catch {
          // API may be unavailable — just show transcript
        }
      }
    }

    recognition.start()
  }

  // Auto-clear transcript after 4s
  useEffect(() => {
    if (transcript) {
      const t = setTimeout(() => setTranscript(''), 4000)
      return () => clearTimeout(t)
    }
  }, [transcript])

  return (
    <>
      {/* Live transcript bubble */}
      {(listening || transcript || interimText) && (
        <div className="fixed bottom-24 right-6 max-w-xs z-50 animate-in slide-in-from-bottom-2">
          <div className="bg-gray-900/95 backdrop-blur-md text-white rounded-2xl px-5 py-4 shadow-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              {listening && <span className="flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1 bg-violet-400 rounded-full animate-bounce" style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </span>}
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {listening ? 'Listening...' : 'You said'}
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              {listening && interimText ? (
                <span className="text-gray-300 italic">{interimText}</span>
              ) : (
                <span className="text-white font-medium">"{transcript}"</span>
              )}
            </p>
          </div>
          {/* Triangle pointer */}
          <div className="absolute -bottom-2 right-8 w-4 h-2 bg-gray-900/95 clip-path-triangle" />
        </div>
      )}

      {/* History log */}
      {showLog && log.length > 0 && (
        <div className="fixed bottom-24 right-20 bg-white rounded-2xl shadow-2xl border border-gray-200 w-72 z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Voice History</span>
            <button onClick={() => setShowLog(false)} className="text-gray-400 text-xs hover:text-gray-700">✕</button>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {log.map((entry, i) => (
              <div key={i} className="px-4 py-2.5 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <p className="text-sm text-gray-800">"{entry.text}"</p>
                <p className="text-xs text-gray-400 mt-0.5">{entry.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Microphone button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {log.length > 0 && (
          <button
            onClick={() => setShowLog(s => !s)}
            className="text-xs text-white/80 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-full transition-colors"
          >
            📋 {log.length} commands
          </button>
        )}
        <button
          onClick={startListening}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all duration-200 ${
            listening
              ? 'bg-red-500 scale-110 ring-4 ring-red-200 animate-pulse'
              : 'bg-gradient-to-br from-violet-600 to-indigo-600 hover:scale-105 hover:shadow-violet-300'
          }`}
          title={listening ? 'Stop listening (click again)' : 'Start voice command'}
        >
          {listening ? '⏹' : '🎙️'}
        </button>
      </div>
    </>
  )
}

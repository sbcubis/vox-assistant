import React from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'

export default function MicButton({ state, onPress }) {
  // state: 'idle' | 'recording' | 'thinking' | 'playing'

  const colors = {
    idle:      { bg: '#7c3aed', ring: '#7c3aed33', label: 'Hold to talk', pulse: false },
    recording: { bg: '#ef4444', ring: '#ef444433', label: 'Tap to send',  pulse: 'recording' },
    thinking:  { bg: '#6d28d9', ring: '#6d28d922', label: 'Thinking...',  pulse: 'thinking' },
    playing:   { bg: '#059669', ring: '#05966922', label: 'Speaking...',  pulse: 'thinking' },
  }

  const c = colors[state] || colors.idle

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Outer glow ring */}
      <div className="relative flex items-center justify-center">
        {c.pulse && (
          <>
            <div className={`absolute w-44 h-44 rounded-full ${c.pulse === 'recording' ? 'pulse-recording' : 'pulse-thinking'}`}
              style={{ background: c.ring }} />
            <div className={`absolute w-36 h-36 rounded-full ${c.pulse === 'recording' ? 'pulse-recording' : 'pulse-thinking'}`}
              style={{ background: c.ring, animationDelay: '0.3s' }} />
          </>
        )}

        {/* Main button */}
        <button
          onPointerDown={onPress}
          disabled={state === 'thinking' || state === 'playing'}
          className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl active:scale-[0.94] transition-transform select-none"
          style={{ background: `radial-gradient(circle at 35% 35%, ${c.bg}cc, ${c.bg})`, boxShadow: `0 0 60px ${c.ring}, 0 8px 32px rgba(0,0,0,0.5)` }}>
          {state === 'thinking' ? (
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          ) : state === 'recording' ? (
            <MicOff className="w-10 h-10 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
        </button>
      </div>

      {/* Label */}
      <p className="text-white/40 text-sm tracking-wide font-medium">{c.label}</p>
    </div>
  )
}

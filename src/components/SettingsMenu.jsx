import React, { useRef, useEffect } from 'react'
import { X, MessageSquare, Volume2, VolumeX, LogOut } from 'lucide-react'
import { signOutUser } from '../firebase'

export default function SettingsMenu({ open, onClose, memoryLimit, onMemoryLimitChange, voiceEnabled, onVoiceToggle, user }) {
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])

  if (!open) return null

  const limits = [5, 10, 20, 50, 100]

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end pt-16 pr-4">
      <div ref={ref} className="slide-up w-72 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
        {/* User */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          {user?.photoURL
            ? <img src={user.photoURL} className="w-9 h-9 rounded-full" alt="" />
            : <div className="w-9 h-9 rounded-full bg-accent/30 flex items-center justify-center text-white font-bold text-sm">
                {user?.displayName?.[0] || '?'}
              </div>
          }
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.displayName || 'User'}</p>
            <p className="text-white/35 text-xs truncate">{user?.email}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center">
            <X className="w-3.5 h-3.5 text-white/50" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Memory limit */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <MessageSquare className="w-3.5 h-3.5 text-accent-light" />
              <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Conversation Memory</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {limits.map(l => (
                <button key={l}
                  onClick={() => onMemoryLimitChange(l)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    memoryLimit === l
                      ? 'bg-accent text-white'
                      : 'bg-white/6 text-white/50 hover:bg-white/10 hover:text-white/80'
                  }`}>
                  {l}
                </button>
              ))}
            </div>
            <p className="text-white/25 text-xs mt-2">Last {memoryLimit} messages remembered</p>
          </div>

          {/* Voice toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-accent-light" /> : <VolumeX className="w-3.5 h-3.5 text-white/30" />}
              <span className="text-white/70 text-sm">Voice responses</span>
            </div>
            <button onClick={onVoiceToggle}
              className={`w-11 h-6 rounded-full transition-all relative ${voiceEnabled ? 'bg-accent' : 'bg-white/15'}`}>
              <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-all ${voiceEnabled ? 'left-[22px]' : 'left-[2px]'}`} />
            </button>
          </div>

          {/* Sign out */}
          <button onClick={() => { signOutUser(); onClose() }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/15 text-white/50 hover:text-red-400 text-sm transition-all">
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

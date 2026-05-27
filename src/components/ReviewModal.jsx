import React, { useState, useEffect } from 'react'
import { X, Edit2, Send } from 'lucide-react'

export default function ReviewModal({ text, onSend, onCancel }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(text)

  useEffect(() => { setDraft(text) }, [text])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="slide-up w-full max-w-lg bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="text-white font-semibold">Review message</span>
          <button onClick={onCancel}
            className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="px-5 py-4 max-h-64 overflow-y-auto">
          {editing ? (
            <textarea
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              className="w-full bg-white/5 border border-accent/40 rounded-2xl p-4 text-white text-sm leading-relaxed resize-none focus:outline-none focus:border-accent min-h-[100px]"
              rows={5}
            />
          ) : (
            <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{draft}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 py-4 border-t border-border">
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/6 hover:bg-white/10 text-white/70 text-sm font-medium transition-all">
            <Edit2 className="w-3.5 h-3.5" />
            {editing ? 'Preview' : 'Edit'}
          </button>
          <button
            onClick={() => onSend(draft)}
            disabled={!draft.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-light disabled:opacity-40 text-white text-sm font-semibold transition-all active:scale-[0.97]">
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

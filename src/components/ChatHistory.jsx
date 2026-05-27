import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'

  // Render URLs as clickable links
  const renderContent = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(urlRegex)
    return parts.map((part, i) =>
      urlRegex.test(part)
        ? <a key={i} href={part} target="_blank" rel="noopener noreferrer"
            className="text-accent-light underline break-all">{part}</a>
        : part
    )
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 fade-in`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-accent/25 border border-accent/30 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-light" />
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-accent text-white rounded-br-md'
          : 'bg-white/6 text-white/90 rounded-bl-md border border-white/6'
      }`}>
        {renderContent(msg.content)}
        <div className={`text-xs mt-1.5 ${isUser ? 'text-white/50' : 'text-white/25'}`}>
          {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

export default function ChatHistory({ messages, open, onClose }) {
  const bottomRef = useRef()

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-30 flex flex-col" style={{ background: 'rgba(10,10,18,0.97)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
        <div>
          <h2 className="text-white font-semibold">Conversation</h2>
          <p className="text-white/30 text-xs mt-0.5">{messages.length} messages</p>
        </div>
        <button onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/20 text-sm">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <div className="w-4 h-4 rounded-full border-2 border-white/20" />
            </div>
            No messages yet
          </div>
        ) : (
          messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

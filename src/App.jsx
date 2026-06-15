import React, { useState, useEffect, useRef, useCallback } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { useVoice } from './useVoice'
import { transcribeAudio, sendMessage, createConversation, speakText } from './api'
import { CONFIG } from './config'

import LoginScreen from './components/LoginScreen'
import MicButton from './components/MicButton'
import ChatHistory from './components/ChatHistory'
import ReviewModal from './components/ReviewModal'
import SettingsMenu from './components/SettingsMenu'
import { MessageSquare, Settings } from 'lucide-react'

const STORAGE_KEY = 'vox_conversation_id'
const MESSAGES_KEY = 'vox_messages'
const MEMORY_KEY = 'vox_memory_limit'
const VOICE_KEY = 'vox_voice_enabled'

export default function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [micState, setMicState] = useState('idle') // idle|recording|thinking|playing
  const [liveText, setLiveText] = useState('')
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]') } catch { return [] }
  })
  const [memoryLimit, setMemoryLimit] = useState(() => parseInt(localStorage.getItem(MEMORY_KEY) || CONFIG.DEFAULT_MEMORY_LIMIT))
  const [voiceEnabled, setVoiceEnabled] = useState(() => localStorage.getItem(VOICE_KEY) !== 'false')
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [reviewText, setReviewText] = useState(null)
  const [reviewMode, setReviewMode] = useState(false)
  const [textInput, setTextInput] = useState('')
  const conversationIdRef = useRef(localStorage.getItem(STORAGE_KEY))

  // Auth
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => { setUser(u); setAuthLoading(false) })
  }, [])

  // Persist messages
  useEffect(() => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  }, [messages])

  // Persist settings
  useEffect(() => { localStorage.setItem(MEMORY_KEY, memoryLimit) }, [memoryLimit])
  useEffect(() => { localStorage.setItem(VOICE_KEY, voiceEnabled) }, [voiceEnabled])

  const addMessage = (role, content) => {
    const msg = { role, content, ts: Date.now() }
    setMessages(prev => {
      const updated = [...prev, msg]
      return updated.slice(-(memoryLimit * 2))
    })
    return msg
  }

  const ensureConversation = async () => {
    if (!conversationIdRef.current) {
      const id = await createConversation()
      conversationIdRef.current = id
      localStorage.setItem(STORAGE_KEY, id)
    }
    return conversationIdRef.current
  }

  const processText = useCallback(async (text) => {
    if (!text?.trim()) return
    setMicState('thinking')
    setLiveText('')
    addMessage('user', text)

    try {
      const convId = await ensureConversation()
      // sendMessage now returns { reply, sensitive }
      const result = await sendMessage(convId, text)
      const reply = typeof result === 'string' ? result : result.reply
      const sensitive = typeof result === 'object' ? (result.sensitive || false) : false

      addMessage('assistant', reply)

      if (voiceEnabled) {
        setMicState('playing')
        // Pass sensitive flag so TTS uses softer voice settings
        await speakText(reply, sensitive)
      }
    } catch (e) {
      console.error('Send error:', e)
      addMessage('assistant', 'Sorry, something went wrong. Please try again.')
    }
    setMicState('idle')
  }, [voiceEnabled, memoryLimit])

  const handleFinalTranscript = useCallback(async (audioBlob, liveTranscript) => {
    let finalText = liveTranscript?.trim()

    if (audioBlob && CONFIG.OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY') {
      try {
        finalText = await transcribeAudio(audioBlob) || finalText
      } catch (e) {
        console.warn('Whisper fallback to live transcript:', e)
      }
    }

    if (!finalText) { setMicState('idle'); return }

    if (reviewMode) {
      setMicState('idle')
      setReviewText(finalText)
    } else {
      await processText(finalText)
    }
  }, [reviewMode, processText])

  const { isRecording, startRecording, stopRecording } = useVoice({
    onFinalTranscript: handleFinalTranscript,
    onLiveTranscript: setLiveText,
  })

  const handleMicPress = useCallback(() => {
    if (micState === 'idle') {
      setLiveText('')
      startRecording()
      setMicState('recording')
    } else if (micState === 'recording') {
      stopRecording()
      setMicState('thinking')
    }
  }, [micState, startRecording, stopRecording])

  const handleTextSend = async () => {
    const text = textInput.trim()
    if (!text) return
    if (reviewMode) {
      setReviewText(text)
    } else {
      setTextInput('')
      await processText(text)
    }
  }

  const handleReviewSend = async (text) => {
    setReviewText(null)
    setTextInput('')
    await processText(text)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) return <LoginScreen />

  return (
    <div className="min-h-screen bg-bg flex flex-col select-none overflow-hidden" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-safe pt-4 pb-3 flex-shrink-0">
        <button onClick={() => setShowHistory(true)}
          className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
          <MessageSquare className="w-4 h-4 text-white/50" />
          {messages.length > 0 && (
            <span className="text-xs text-white/40">{messages.length}</span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-light animate-pulse" />
          <span className="text-white/60 text-sm font-medium">Vox</span>
        </div>

        <button onClick={() => setShowSettings(true)}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
          <Settings className="w-4 h-4 text-white/50" />
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 gap-8">
        {/* Live transcript */}
        <div className="w-full max-w-md min-h-[80px] flex items-center justify-center">
          {liveText ? (
            <p className="text-white/70 text-base text-center leading-relaxed fade-in">
              {liveText}
              {isRecording && <span className="inline-block w-1 h-5 bg-accent-light ml-1 animate-pulse align-middle" />}
            </p>
          ) : micState === 'idle' ? (
            <p className="text-white/15 text-sm text-center">
              {messages.length === 0 ? 'Tap the mic and start talking' : 'Ready'}
            </p>
          ) : null}
        </div>

        {/* Mic button */}
        <MicButton state={micState} onPress={handleMicPress} />

        {/* Review before send toggle */}
        <div className="flex items-center gap-3">
          <button onClick={() => setReviewMode(v => !v)}
            className={`w-10 h-5.5 rounded-full transition-all relative flex-shrink-0 ${reviewMode ? 'bg-accent' : 'bg-white/15'}`}
            style={{ height: '22px', width: '40px' }}>
            <div className={`w-4 h-4 rounded-full bg-white absolute top-[3px] transition-all ${reviewMode ? 'left-[21px]' : 'left-[3px]'}`} />
          </button>
          <span className="text-white/35 text-xs">Review before send</span>
        </div>
      </div>

      {/* Text input bar */}
      <div className="flex-shrink-0 px-4 pb-safe pb-6 pt-2">
        <div className="flex items-end gap-3 bg-card border border-border rounded-2xl px-4 py-3">
          <textarea
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTextSend() } }}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-transparent text-white text-sm placeholder-white/20 resize-none focus:outline-none leading-relaxed"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={handleTextSend}
            disabled={!textInput.trim() || micState === 'thinking'}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-accent disabled:bg-white/10 flex items-center justify-center transition-all active:scale-[0.94]">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Overlays */}
      <ChatHistory messages={messages} open={showHistory} onClose={() => setShowHistory(false)} />
      <SettingsMenu
        open={showSettings} onClose={() => setShowSettings(false)}
        memoryLimit={memoryLimit} onMemoryLimitChange={setMemoryLimit}
        voiceEnabled={voiceEnabled} onVoiceToggle={() => setVoiceEnabled(v => !v)}
        user={user}
      />
      {reviewText != null && (
        <ReviewModal text={reviewText} onSend={handleReviewSend} onCancel={() => setReviewText(null)} />
      )}
    </div>
  )
}

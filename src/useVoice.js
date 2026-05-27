import { useRef, useState, useCallback } from 'react'

// Live transcription via Web Speech API (real-time display)
// Final submission via MediaRecorder -> Whisper (accuracy)

export function useVoice({ onFinalTranscript, onLiveTranscript }) {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const speechRef = useRef(null)
  const liveTextRef = useRef('')

  const startRecording = useCallback(async () => {
    liveTextRef.current = ''
    chunksRef.current = []

    // ── MediaRecorder for Whisper ──
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
      mediaRecorderRef.current = mr
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.start(250)
    } catch (e) {
      console.warn('MediaRecorder failed:', e)
    }

    // ── Web Speech API for live display ──
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const sr = new SpeechRecognition()
      sr.continuous = true
      sr.interimResults = true
      sr.lang = 'en-AU'
      speechRef.current = sr

      sr.onresult = (e) => {
        let interim = ''
        let final = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript
          if (e.results[i].isFinal) final += t
          else interim += t
        }
        if (final) liveTextRef.current += final
        onLiveTranscript(liveTextRef.current + interim)
      }

      sr.onerror = (e) => console.warn('SpeechRecognition error:', e.error)

      // Auto-restart on end so it never times out
      sr.onend = () => {
        if (isRecording || mediaRecorderRef.current?.state === 'recording') {
          try { sr.start() } catch {}
        }
      }

      try { sr.start() } catch {}
    }

    setIsRecording(true)
  }, [onLiveTranscript])

  const stopRecording = useCallback(() => {
    setIsRecording(false)

    // Stop speech recognition
    if (speechRef.current) {
      speechRef.current.onend = null
      try { speechRef.current.stop() } catch {}
      speechRef.current = null
    }

    // Stop MediaRecorder and get blob
    const mr = mediaRecorderRef.current
    if (mr && mr.state !== 'inactive') {
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        mr.stream?.getTracks().forEach(t => t.stop())
        onFinalTranscript(blob, liveTextRef.current)
      }
      mr.stop()
    } else {
      onFinalTranscript(null, liveTextRef.current)
    }
  }, [onFinalTranscript])

  return { isRecording, startRecording, stopRecording }
}

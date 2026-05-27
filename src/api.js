import { CONFIG } from './config'

// ── Transcribe audio blob via Whisper ──────────────────────────
export async function transcribeAudio(audioBlob) {
  const form = new FormData()
  form.append('file', audioBlob, 'audio.webm')
  form.append('model', 'whisper-1')

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${CONFIG.OPENAI_API_KEY}` },
    body: form,
  })
  if (!res.ok) throw new Error(`Whisper error ${res.status}`)
  const data = await res.json()
  return data.text?.trim() || ''
}

// ── Send message to Charlotte May ─────────────────────────────
export async function sendMessage(conversationId, content) {
  const res = await fetch(
    `https://base44.app/api/agents/${CONFIG.BASE44_APP_ID}/conversations/${conversationId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        api_key: CONFIG.BASE44_API_KEY,
      },
      body: JSON.stringify({ content }),
    }
  )
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  return data.content || data.message || data.response || JSON.stringify(data)
}

// ── Create new conversation ────────────────────────────────────
export async function createConversation() {
  const res = await fetch(
    `https://base44.app/api/agents/${CONFIG.BASE44_APP_ID}/conversations`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        api_key: CONFIG.BASE44_API_KEY,
      },
      body: JSON.stringify({}),
    }
  )
  if (!res.ok) throw new Error(`Create conversation error ${res.status}`)
  const data = await res.json()
  return data.id || data.conversation_id
}

// ── ElevenLabs TTS ────────────────────────────────────────────
export async function speakText(text) {
  if (!text?.trim()) return

  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text]

  const fetchAudio = async (sentence) => {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${CONFIG.ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': CONFIG.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sentence.trim(),
          model_id: CONFIG.ELEVENLABS_MODEL,
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    )
    if (!res.ok) throw new Error(`ElevenLabs error ${res.status}`)
    return res.blob()
  }

  // Fetch all in parallel, play sequentially
  const blobs = await Promise.all(sentences.map(fetchAudio))
  for (const blob of blobs) {
    const url = URL.createObjectURL(blob)
    await new Promise((resolve) => {
      const audio = new Audio(url)
      audio.onended = resolve
      audio.onerror = resolve
      audio.play().catch(resolve)
    })
    URL.revokeObjectURL(url)
  }
}

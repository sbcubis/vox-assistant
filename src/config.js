// =============================================================
// VOX ASSISTANT — CONFIG
// Replace these values with your actual API keys
// =============================================================

export const CONFIG = {
  // Charlotte May / Base44 Superagent
  BASE44_APP_ID: '6a137759291f6ae664c3b557',
  BASE44_API_KEY: 'YOUR_BASE44_API_KEY',

  // OpenAI Whisper (for transcription)
  OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY',

  // ElevenLabs TTS
  ELEVENLABS_API_KEY: 'YOUR_ELEVENLABS_API_KEY',
  ELEVENLABS_VOICE_ID: 'HE0XlnHeqQoWUBWhwUa3',
  ELEVENLABS_MODEL: 'eleven_multilingual_v2',

  // Firebase (Google Auth)
  FIREBASE: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },

  // Default conversation memory limit
  DEFAULT_MEMORY_LIMIT: 10,
}

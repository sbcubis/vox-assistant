# Vox — Voice-First Personal Assistant

A sleek, voice-first AI assistant web app. Tap to talk, get spoken responses, and keep a scrollable conversation history.

## Features

- 🎙️ **Tap-to-talk** — tap once to start, tap again to send. No timeouts, continuous listening.
- 📝 **Live transcription** while you speak (Web Speech API)
- 🧠 **Accurate final transcription** via OpenAI Whisper
- 🔊 **Voice responses** via ElevenLabs (sentence-by-sentence streaming)
- 💬 **Text input** fallback for silent environments
- 👁️ **Review before send** toggle — review + edit before submitting
- 📜 **Conversation history** panel (top-left button)
- ⚙️ **Settings menu** — adjust memory limit (5/10/20/50/100 messages), toggle voice
- 🔐 **Google Sign-In** via Firebase Auth

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure API keys
Edit `src/config.js` and fill in:

- **BASE44_API_KEY** — from your Base44 dashboard
- **OPENAI_API_KEY** — for Whisper transcription
- **ELEVENLABS_API_KEY** — for voice responses
- **FIREBASE config** — create a project at https://console.firebase.google.com

### 3. Firebase setup
1. Create a project at https://console.firebase.google.com
2. Enable **Authentication → Google** sign-in provider
3. Add your domain to **Authorised domains**
4. Copy the config values into `src/config.js`

### 4. Run
```bash
npm run dev
```

## API Keys needed

| Key | Where to get it |
|-----|----------------|
| BASE44_API_KEY | Base44 dashboard → Settings |
| OPENAI_API_KEY | https://platform.openai.com/api-keys |
| ELEVENLABS_API_KEY | https://elevenlabs.io → Profile |
| Firebase config | https://console.firebase.google.com |

## Voice settings
- Voice ID: `HE0XlnHeqQoWUBWhwUa3` (British female — Charlotte May)
- Model: `eleven_multilingual_v2`

Change these in `src/config.js`.

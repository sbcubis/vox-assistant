import React from 'react'
import { signInWithGoogle } from '../firebase'

export default function LoginScreen() {
  const handleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (e) {
      console.error('Login failed:', e)
      alert('Login failed. Check Firebase config in src/config.js')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-12 text-center">
        <div className="w-20 h-20 rounded-3xl bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#7c3aed" strokeWidth="1.5" />
            <path d="M14 20 C14 14 26 14 26 20 C26 26 14 26 14 20Z" fill="#7c3aed" opacity="0.4"/>
            <circle cx="20" cy="20" r="4" fill="#a855f7"/>
            <path d="M20 28 L20 34 M16 34 L24 34" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Vox</h1>
        <p className="text-white/40 mt-2 text-sm">Your personal AI assistant</p>
      </div>

      {/* Sign in card */}
      <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-8">
        <h2 className="text-white font-semibold text-lg mb-1">Sign in to continue</h2>
        <p className="text-white/35 text-sm mb-8">Use your Google account to get started</p>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold rounded-2xl px-6 py-4 hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <p className="text-white/20 text-xs mt-8 text-center">
        Your conversations are private and stored locally
      </p>
    </div>
  )
}

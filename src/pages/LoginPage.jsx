import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Globe, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { clearGuestFlag } from '../utils/storage.js'
import PageTransition from '../components/PageTransition.jsx'

export default function LoginPage() {
  const { isSupabaseReady, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGoogleSignIn() {
    if (!isSupabaseReady) {
      setError('Google login is being configured. Use email/password for now.')
      return
    }
    clearGuestFlag()
    await signInWithGoogle()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!isSupabaseReady) {
      setError('Auth service not configured')
      return
    }

    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    if (mode === 'signup' && !acceptedTerms) {
      setError('You must accept the Terms & Conditions')
      return
    }

    setLoading(true)

    if (mode === 'login') {
      const { error: err } = await signInWithEmail(email, password)
      if (err) {
        setError(err.message)
      } else {
        clearGuestFlag()
        navigate('/dashboard')
      }
    } else {
      const { error: err } = await signUpWithEmail(email, password)
      if (err) {
        setError(err.message)
      } else {
        setMessage('Check your email for a confirmation link!')
      }
    }

    setLoading(false)
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-surface border border-border rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-white font-bold text-xl mb-4">
              <Sparkles className="w-6 h-6 text-accent" />
              ViralHooks
            </Link>
            <h1 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              {mode === 'login' ? 'Sign in to generate unlimited hooks' : 'Get started for free — no credit card needed'}
            </p>
          </div>

          {message && (
            <div className="bg-accent/10 border border-accent/20 text-accent text-sm rounded-xl px-4 py-3 mb-6">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={!isSupabaseReady || loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 mb-4"
          >
            <Globe className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface px-3 text-gray-500">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-dark border border-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-dark border border-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-border bg-dark accent-primary"
                />
                <span className="text-xs text-gray-400">
                  I accept the <span className="text-primary hover:underline">Terms & Conditions</span> and{' '}
                  <span className="text-primary hover:underline">Privacy Policy</span>. I agree to receive product updates and notifications.
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading || (mode === 'signup' && !acceptedTerms)}
              className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {mode === 'login' ? (
              <>Don't have an account?{' '}<button onClick={() => { setMode('signup'); setError(''); setMessage('') }} className="text-primary hover:underline font-medium">Sign up</button></>
            ) : (
              <>Already have an account?{' '}<button onClick={() => { setMode('login'); setError(''); setMessage('') }} className="text-primary hover:underline font-medium">Sign in</button></>
            )}
          </p>
        </motion.div>
      </div>
    </PageTransition>
  )
}

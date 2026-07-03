import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseReady, ADMIN_EMAIL } from '../lib/supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')

  useEffect(() => {
    if (!isSupabaseReady()) {
      setLoading(false)
      return
    }

    async function init() {
      // Check if this is an auth callback (code in URL)
      const params = new URLSearchParams(window.location.search)
      const hasAuthCode = params.has('code')
      const hasError = params.get('error')

      if (hasError) {
        setVerifyError(params.get('error_description') || 'Verification failed')
        setLoading(false)
        window.history.replaceState({}, '', window.location.pathname + window.location.hash)
        return
      }

      if (hasAuthCode) {
        setVerifying(true)
        // Explicitly exchange the PKCE code for a session
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        if (error) {
          setVerifyError(error.message)
          setLoading(false)
          setVerifying(false)
        } else if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id, session.user.email)
          window.history.replaceState({}, '', window.location.pathname + window.location.hash)
          return
        }
      }

      // Try to get existing session
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id, session.user.email)
      } else {
        setLoading(false)
        setVerifying(false)
        if (hasAuthCode) {
          window.history.replaceState({}, '', window.location.pathname + window.location.hash)
        }
      }
    }

    init()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id, session.user.email)
        setVerifying(false)
        setVerifyError('')
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          window.history.replaceState({}, '', window.location.pathname + window.location.hash)
        }
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false)
        setVerifying(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId, email) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      // Auto-promote owner to admin if their email matches ADMIN_EMAIL
      if (data && ADMIN_EMAIL && email === ADMIN_EMAIL && data.role !== 'admin') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userId)

        if (!updateError) {
          setProfile({ ...data, role: 'admin' })
        } else {
          setProfile(data)
        }
      } else {
        setProfile(data)
      }
    } catch {
      setProfile({ role: 'free' })
    } finally {
      setLoading(false)
      setVerifying(false)
    }
  }

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseReady()) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + window.location.pathname },
    })
  }, [])

  const signInWithEmail = useCallback(async (email, password) => {
    if (!isSupabaseReady()) return { error: 'Supabase not configured' }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }, [])

  const signUpWithEmail = useCallback(async (email, password) => {
    if (!isSupabaseReady()) return { error: 'Supabase not configured' }
    const redirectTo = window.location.origin + window.location.pathname
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    })
    return { error }
  }, [])

  const signOut = useCallback(async () => {
    if (!isSupabaseReady()) return
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [])

  const isAdmin = profile?.role === 'admin'
  const isOwner = !!(ADMIN_EMAIL && user?.email === ADMIN_EMAIL)

  return (
    <AuthContext.Provider value={{
      user, profile, loading, verifying, verifyError,
      isAdmin, isOwner, isSupabaseReady: isSupabaseReady(),
      signInWithGoogle, signInWithEmail, signUpWithEmail, signOut,
      setProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

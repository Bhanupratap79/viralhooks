import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseReady, ADMIN_EMAIL } from '../lib/supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const navigate = useNavigate()
  const initHandled = useRef(false)

  useEffect(() => {
    if (!isSupabaseReady()) {
      setLoading(false)
      return
    }

    async function init() {
      const params = new URLSearchParams(window.location.search)
      const hasAuthCode = params.has('code')
      const hasErrorParam = params.get('error')
      let shouldNavigateDashboard = false

      if (hasErrorParam) {
        setVerifyError(params.get('error_description') || 'Authentication failed - please try again')
        setLoading(false)
        window.history.replaceState({}, '', window.location.pathname + window.location.hash)
        return
      }

      if (hasAuthCode) {
        setVerifying(true)

        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(window.location.href)

        window.history.replaceState({}, '', window.location.pathname + window.location.hash)

        if (error) {
          setVerifyError(error.message)
          setLoading(false)
          setVerifying(false)
          return
        }

        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id, session.user.email)
          setLoading(false)
          setVerifying(false)
          shouldNavigateDashboard = true
        }
      }

      if (!shouldNavigateDashboard) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id, session.user.email)
          setLoading(false)
          setVerifying(false)
        } else {
          setLoading(false)
          setVerifying(false)
        }
      }

      if (shouldNavigateDashboard) {
        navigate('/dashboard')
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id, session.user.email)
        setVerifyError('')
        if (event === 'SIGNED_IN' && !hasCodeParam()) {
          navigate('/dashboard')
        }
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false)
        setVerifying(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  function hasCodeParam() {
    return new URLSearchParams(window.location.search).has('code')
  }

  async function fetchProfile(userId, email) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({ id: userId, email, role: 'free' })
          .select()
          .single()

        if (newProfile) {
          if (ADMIN_EMAIL && email === ADMIN_EMAIL) {
            await supabase.from('profiles').update({ role: 'admin' }).eq('id', userId)
            setProfile({ ...newProfile, role: 'admin' })
          } else {
            setProfile(newProfile)
          }
          return
        }
      }

      if (data) {
        if (ADMIN_EMAIL && email === ADMIN_EMAIL && data.role !== 'admin') {
          await supabase.from('profiles').update({ role: 'admin' }).eq('id', userId)
          setProfile({ ...data, role: 'admin' })
        } else {
          setProfile(data)
        }
        return
      }
    } catch {}

    setProfile({ role: 'free' })
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    })
    if (!error && data?.session) {
      setUser(data.session.user)
      await fetchProfile(data.session.user.id, data.session.user.email)
      setLoading(false)
    }
    return { error, data }
  }, [])

  const signOut = useCallback(async () => {
    if (!isSupabaseReady()) return
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    navigate('/')
  }, [navigate])

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

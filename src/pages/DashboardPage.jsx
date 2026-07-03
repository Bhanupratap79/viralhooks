import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Settings, Shield, LogOut, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import PageTransition from '../components/PageTransition.jsx'

export default function DashboardPage() {
  const { user, profile, signOut, isAdmin, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    navigate('/login')
    return null
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 mt-1">Manage your account</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-surface border border-border text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          <div className="grid gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-300">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-300">
                    Plan: <span className="text-accent font-medium capitalize">{profile?.role || 'free'}</span>
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link
                  to="/app"
                  className="flex items-center gap-3 bg-gradient-to-r from-primary to-accent text-white p-4 rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-5 h-5" />
                  Go to Generator
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 bg-surface border border-border text-white p-4 rounded-xl font-medium hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    Admin Panel
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

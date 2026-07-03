import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Search, Mail, Users, BarChart3, Send, Crown } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import PageTransition from '../components/PageTransition.jsx'

export default function AdminPage() {
  const { user, profile, isAdmin, isOwner, loading: authLoading, setProfile } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [notifTitle, setNotifTitle] = useState('')
  const [notifMsg, setNotifMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [notifSent, setNotifSent] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (isAdmin || (isOwner && user)) {
      fetchUsers()
    }
  }, [isAdmin, isOwner, user])

  async function fetchUsers() {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      setUsers(data || [])
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  async function toggleRole(userId, currentRole) {
    const roles = ['free', 'premium', 'admin']
    const idx = roles.indexOf(currentRole)
    const newRole = roles[(idx + 1) % roles.length]
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
  }

  async function sendNotification() {
    if (!notifTitle.trim() || !notifMsg.trim()) return
    setSending(true)
    setNotifSent(false)
    try {
      await supabase.from('notifications').insert({
        title: notifTitle.trim(),
        message: notifMsg.trim(),
        created_by: user.id,
        for_role: 'all',
      })
      setNotifTitle('')
      setNotifMsg('')
      setNotifSent(true)
      setTimeout(() => setNotifSent(false), 3000)
    } catch {}
    setSending(false)
  }

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: users.length,
    free: users.filter(u => !u.role || u.role === 'free').length,
    premium: users.filter(u => u.role === 'premium').length,
    admins: users.filter(u => u.role === 'admin').length,
  }

  if (authLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null // will redirect to login
  }

  // Non-owner, non-admin — access denied
  if (!isAdmin && !isOwner) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 text-center"
          >
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-gray-400 text-sm">
              Only the project owner can access the admin panel.
            </p>
          </motion.div>
        </div>
      </PageTransition>
    )
  }

  // Owner but not yet admin (profile not updated yet)
  if (isOwner && !isAdmin) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 text-center"
          >
            <Crown className="w-16 h-16 text-accent mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400 text-sm mb-4">
              Your email is recognized as the owner account. Auto-promoting to admin...
            </p>
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            {users.length === 0 ? (
              <p className="text-xs text-gray-500 mt-4">
                Please sign out and sign in again to refresh your permissions.
              </p>
            ) : (
              <p className="text-xs text-green-400 mt-4">Admin status applied! Reloading...</p>
            )}
          </motion.div>
        </div>
      </PageTransition>
    )
  }

  // Full admin view
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-accent" />
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          </div>
          <p className="text-gray-400 mb-8">Manage users, plans, and send notifications</p>

          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <Users className="w-4 h-4" />
                Total Users
              </div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <BarChart3 className="w-4 h-4" />
                Free
              </div>
              <p className="text-2xl font-bold text-white">{stats.free}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-primary text-sm mb-1">
                <BarChart3 className="w-4 h-4" />
                Premium
              </div>
              <p className="text-2xl font-bold text-white">{stats.premium}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-accent text-sm mb-1">
                <Shield className="w-4 h-4" />
                Admins
              </div>
              <p className="text-2xl font-bold text-white">{stats.admins}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            <div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users by email..."
                  className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Email</th>
                        <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Role</th>
                        <th className="text-left text-sm font-medium text-gray-400 px-4 py-3">Joined</th>
                        <th className="text-right text-sm font-medium text-gray-400 px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                          </td>
                        </tr>
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-12 text-center text-gray-500">No users found</td>
                        </tr>
                      ) : filtered.map((u, i) => (
                        <motion.tr
                          key={u.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02 }}
                          className="border-b border-border/50 last:border-0 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <span className="text-white text-sm">{u.email}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              u.role === 'admin'
                                ? 'bg-accent/10 text-accent border border-accent/20'
                                : u.role === 'premium'
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                            }`}>
                              {u.role || 'free'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => toggleRole(u.id, u.role || 'free')}
                              className="text-xs font-medium text-primary hover:text-accent transition-colors"
                              title="Cycle role: free → premium → admin"
                            >
                              Change
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-border rounded-2xl p-6 sticky top-28"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Send className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold text-white">Send Notification</h2>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Send an announcement to all users. It will appear in their notification bell.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={notifTitle}
                      onChange={(e) => setNotifTitle(e.target.value)}
                      placeholder="e.g., New Feature: Bulk Export"
                      maxLength={100}
                      className="w-full bg-dark border border-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Message</label>
                    <textarea
                      value={notifMsg}
                      onChange={(e) => setNotifMsg(e.target.value)}
                      placeholder="Describe the update..."
                      rows={3}
                      maxLength={500}
                      className="w-full bg-dark border border-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                    <span className="text-xs text-gray-600">{notifMsg.length}/500</span>
                  </div>
                  <button
                    onClick={sendNotification}
                    disabled={sending || !notifTitle.trim() || !notifMsg.trim()}
                    className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : 'Send to All Users'}
                  </button>
                  {notifSent && (
                    <p className="text-xs text-green-400 text-center">Notification sent!</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

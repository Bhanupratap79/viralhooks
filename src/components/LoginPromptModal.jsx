import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useApp } from '../context/AppContext.jsx'

export default function LoginPromptModal() {
  const { user } = useAuth()
  const { showLoginPrompt, hideLoginPrompt } = useApp()
  const navigate = useNavigate()

  if (user) return null

  return (
    <AnimatePresence>
      {showLoginPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full relative"
          >
            <button
              onClick={hideLoginPrompt}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <Sparkles className="w-10 h-10 text-accent mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white">Free Trial Used!</h2>
              <p className="text-gray-400 mt-2 text-sm">
                Sign up free to generate unlimited hooks. No credit card needed.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => { hideLoginPrompt(); navigate('/login') }}
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Continue with Google
              </button>
              <button
                onClick={() => { hideLoginPrompt(); navigate('/login') }}
                className="w-full bg-dark border border-border text-gray-300 py-3 rounded-xl font-medium hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2"
              >
                Sign up with Email
              </button>
              <p className="text-xs text-gray-500 text-center pt-2">
                By signing up, you agree to our Terms & Privacy Policy
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

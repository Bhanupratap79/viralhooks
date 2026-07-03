import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, LogIn, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stats = [
  { value: '10,000+', label: 'Hooks Generated' },
  { value: '50+', label: 'Templates' },
  { value: '6', label: 'Platforms' },
];

export default function Hero() {
  const { user, loading } = useAuth();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(108,60,225,0.15) 0%, rgba(255,51,102,0.1) 50%, rgba(15,15,35,1) 100%)',
            animation: 'heroGradient 8s ease-in-out infinite alternate',
            backgroundSize: '200% 200%',
          }}
        />
      </div>
      <style>{`
        @keyframes heroGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 mb-6">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-gray-300">AI-Powered Hook Generator</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
        >
          Create Viral-Worthy{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Hooks</span>{' '}
          in Seconds
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Stop staring at a blank page. Generate attention-grabbing hooks for Instagram, TikTok, YouTube, and more with the power of AI.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/app"
            className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3.5 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            Start Generating
            <ArrowRight className="w-5 h-5" />
          </Link>

          {!loading && user ? (
            <Link
              to="/dashboard"
              className="bg-surface border border-border text-white px-8 py-3.5 rounded-full text-lg font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-surface border border-border text-white px-8 py-3.5 rounded-full text-lg font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </Link>
          )}

          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-surface border border-border text-white px-8 py-3.5 rounded-full text-lg font-semibold hover:bg-white/10 transition-colors"
          >
            See Examples
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-20 grid grid-cols-3 gap-8 sm:gap-16 max-w-2xl mx-auto"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

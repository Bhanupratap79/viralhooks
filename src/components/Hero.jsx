import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, LayoutDashboard } from 'lucide-react';
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
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: '4s' }} />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center relative"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-surface/70 backdrop-blur-sm border border-border/50 rounded-full px-4 py-1.5 mb-6">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-gray-300">AI-Powered Hook Generator</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
        >
          Create Viral-Worthy{' '}
          <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">Hooks</span>{' '}
          in Seconds
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Stop staring at a blank page. Generate attention-grabbing hooks for Instagram, TikTok, YouTube, and more instantly.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/app"
            className="group relative bg-gradient-to-r from-primary to-accent text-white px-8 py-3.5 rounded-full text-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary/25"
          >
            <span>Start Generating</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {!loading && user ? (
            <Link
              to="/dashboard"
              className="bg-white/5 backdrop-blur-sm border border-white/10 text-white px-8 py-3.5 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
          ) : (
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/5 backdrop-blur-sm border border-white/10 text-white px-8 py-3.5 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300"
            >
              See Examples
            </button>
          )}
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

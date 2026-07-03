import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { to: '/', label: 'Home' },
  { to: '/app', label: 'App' },
  { to: '/premium', label: 'Premium' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Sparkles className="w-6 h-6 text-accent" />
            ViralHooks
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-gray-400 hover:text-white'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/app"
              className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-dark/95 backdrop-blur-xl border-b border-border"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-gray-400 hover:text-white'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/app"
                onClick={() => setMobileOpen(false)}
                className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity text-center"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

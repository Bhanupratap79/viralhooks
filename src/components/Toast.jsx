import { CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';

export default function Toast() {
  const { toast, dispatch } = useApp();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={() => dispatch({ type: 'HIDE_TOAST' })}
          className="fixed top-20 right-4 z-[100] flex items-center gap-3 bg-surface border border-border rounded-xl px-5 py-3 shadow-2xl cursor-pointer"
        >
          <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
          <span className="text-sm text-white font-medium">{toast}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

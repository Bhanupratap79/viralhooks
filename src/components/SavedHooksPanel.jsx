import { X, Copy, Trash2, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';

export default function SavedHooksPanel({ isOpen, onClose }) {
  const { savedHooks, showToast, toggleSaveHook } = useApp();

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!');
    } catch {
      showToast('Failed to copy');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-80 bg-dark border-l border-border z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-accent" />
                <h2 className="text-white font-semibold">Saved Hooks</h2>
                <span className="text-xs text-gray-500 bg-surface px-2 py-0.5 rounded-full">
                  {savedHooks.length}
                </span>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {savedHooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Bookmark className="w-10 h-10 text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500">No saved hooks yet</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Save hooks while generating to build your collection.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedHooks.map((hook) => (
                    <div
                      key={hook.id}
                      className="bg-surface border border-border rounded-xl p-3"
                    >
                      <p className="text-sm text-white leading-relaxed line-clamp-2 mb-2">
                        {hook.text}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-0.5 rounded-full capitalize">
                          {hook.platform}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(hook.text)}
                            className="p-1.5 text-gray-400 hover:text-white transition-colors"
                            title="Copy"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleSaveHook(hook)}
                            className="p-1.5 text-gray-400 hover:text-accent transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

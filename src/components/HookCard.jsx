import { Copy, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';

export default function HookCard({ hook }) {
  const { showToast, toggleSaveHook, isHookSaved } = useApp();
  const saved = isHookSaved(hook.id);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hook.text);
      showToast('Copied to clipboard!');
    } catch {
      showToast('Failed to copy');
    }
  };

  const handleSave = () => {
    toggleSaveHook(hook);
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3"
    >
      <p className="text-white text-base leading-relaxed">{hook.text}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium bg-primary/20 text-primary px-2.5 py-1 rounded-full capitalize">
          {hook.platform}
        </span>
        <span className="text-xs font-medium bg-white/10 text-gray-300 px-2.5 py-1 rounded-full capitalize">
          {hook.tone}
        </span>
        <span className="text-xs font-medium bg-white/10 text-gray-300 px-2.5 py-1 rounded-full capitalize">
          {hook.type?.replace(/_/g, ' ')}
        </span>
      </div>

      {hook.hashtags && hook.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {hook.hashtags.map((tag, i) => (
            <span key={i} className="text-xs text-gray-500">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
            saved
              ? 'bg-accent/20 text-accent'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-accent' : ''}`} />
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </motion.div>
  );
}

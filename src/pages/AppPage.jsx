import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bookmark } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import PlatformSelector from '../components/PlatformSelector.jsx';
import ToneSelector from '../components/ToneSelector.jsx';
import HookTypeSelector from '../components/HookTypeSelector.jsx';
import ResultsGrid from '../components/ResultsGrid.jsx';
import SavedHooksPanel from '../components/SavedHooksPanel.jsx';
import DailyCounter from '../components/DailyCounter.jsx';
import Toast from '../components/Toast.jsx';
import LoginPromptModal from '../components/LoginPromptModal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { generateHooks } from '../utils/generator.js';
import { GUEST_LIMIT, FREE_DAILY_LIMIT } from '../utils/storage.js';

export default function AppPage() {
  const { user } = useAuth();
  const { dailyCount, guestUsed, savedHooks, showToast, showLoginPrompt, generate, generateGuest, hideLoginPrompt } = useApp();

  const [platform, setPlatform] = useState('instagram');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('casual');
  const [hookType, setHookType] = useState('question');
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);

  const canGenerate = user
    ? user.role === 'premium' || user.role === 'admin' || dailyCount < FREE_DAILY_LIMIT
    : !guestUsed;

  const handleGenerate = useCallback(async () => {
    if (!topic || topic.trim().length < 3) {
      showToast('Please enter a topic (min 3 characters)');
      return;
    }

    if (!canGenerate) {
      if (user) {
        showToast('Daily limit reached. Upgrade to Premium!');
      } else {
        showLoginPrompt();
      }
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const generated = generateHooks(topic.trim(), platform, tone, hookType, 5);
    setHooks(generated);

    if (!user) {
      generateGuest();
    } else {
      generate();
    }

    setLoading(false);

    if (generated.length === 0) {
      showToast('No hooks found for this combination. Try different options.');
    }
  }, [topic, platform, tone, hookType, canGenerate, user, generate, generateGuest, showToast, showLoginPrompt]);

  const charCount = topic.length;

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Hook Generator
              </h1>
              <p className="text-gray-400 mt-1">
                Create attention-grabbing hooks for any platform
              </p>
            </div>
            <div className="flex items-center gap-4">
              <DailyCounter />
              <button
                onClick={() => setSavedOpen(!savedOpen)}
                className="relative flex items-center gap-2 bg-surface border border-border text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-all"
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Saved</span>
                {savedHooks.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                    {savedHooks.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-border rounded-2xl p-6 sm:p-8 mb-6"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Choose Platform
                    </label>
                    <PlatformSelector selected={platform} onChange={setPlatform} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      What's your topic?
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        placeholder="e.g., fitness tips, digital marketing, vegan recipes..."
                        maxLength={100}
                        className="w-full bg-dark border border-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                        {charCount}/100
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Select Tone
                    </label>
                    <ToneSelector selected={tone} onChange={setTone} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Hook Type
                    </label>
                    <HookTypeSelector selected={hookType} onChange={setHookType} />
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={loading || !topic.trim()}
                    className="w-full bg-gradient-to-r from-primary to-accent text-white py-3.5 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Hooks
                      </>
                    )}
                  </button>

                  {!user && !guestUsed && (
                    <p className="text-xs text-center text-gray-500">
                      You have {GUEST_LIMIT} free try. <span className="text-primary">Sign in</span> for unlimited.
                    </p>
                  )}
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={hooks.length + (loading ? 'l' : '')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ResultsGrid hooks={hooks} loading={loading} />
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {savedOpen && (
                <SavedHooksPanel isOpen={savedOpen} onClose={() => setSavedOpen(false)} />
              )}
            </AnimatePresence>
          </div>
        </div>

        <Toast />
        <LoginPromptModal />
      </div>
    </PageTransition>
  );
}

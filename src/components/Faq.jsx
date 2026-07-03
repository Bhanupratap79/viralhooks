import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'How does ViralHooks work?',
    a: 'ViralHooks uses AI to generate attention-grabbing hooks for your content. Simply select a platform, enter your topic, choose a tone and hook type, and our AI generates multiple engaging hooks you can use right away.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes! You get 5 free hook generations every day. If you need unlimited generations and premium features, you can upgrade to our premium plan at any time.',
  },
  {
    q: 'What platforms do you support?',
    a: 'We support Instagram, TikTok, YouTube, Twitter/X, LinkedIn, and Facebook. Each platform has optimized hook styles that work best for its audience.',
  },
  {
    q: 'Can I save my favorite hooks?',
    a: 'Absolutely! You can save hooks to your personal collection with one click. Saved hooks are stored locally and accessible anytime from the app.',
  },
  {
    q: 'How are the hooks generated?',
    a: 'Our hooks are generated using a combination of proven copywriting frameworks, viral content patterns, and platform-specific best practices to create hooks that stop the scroll.',
  },
  {
    q: 'Can I upgrade later?',
    a: 'Yes, you can upgrade to premium anytime. Your saved hooks and settings will carry over seamlessly. Go to the Premium page to see available plans.',
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400">
            Everything you need to know about ViralHooks.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-5 text-left text-white font-medium hover:bg-white/5 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

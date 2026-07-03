import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Layers, Copy, Heart, BarChart3, Globe } from 'lucide-react';
import Hero from '../components/Hero.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import PricingCard from '../components/PricingCard.jsx';
import Faq from '../components/Faq.jsx';
import { generateDemoHooks } from '../utils/generator.js';
import HookCard from '../components/HookCard.jsx';

const features = [
  { icon: Globe, title: 'Multi-Platform', description: 'Generate hooks for Instagram, TikTok, YouTube, Twitter, LinkedIn, and Facebook with platform-specific templates.' },
  { icon: Layers, title: 'Tone Customization', description: 'Choose from 6 tones — Professional, Casual, Funny, Inspirational, Dramatic, or Witty to match your brand voice.' },
  { icon: Copy, title: 'One-Click Copy', description: 'Copy any hook to your clipboard instantly. No more manual typing or formatting headaches.' },
  { icon: Heart, title: 'Save Favorites', description: 'Save your best hooks for later. Access them anytime from your personal saved hooks panel.' },
  { icon: BarChart3, title: 'Bulk Generate', description: 'Generate up to 50 hooks at once. Premium feature for power creators who need volume.', isPremium: true },
  { icon: Zap, title: 'Analytics', description: 'See which hooks perform best with detailed engagement analytics. Premium feature with actionable insights.', isPremium: true },
];

export default function LandingPage() {
  const [demoHooks, setDemoHooks] = useState([]);

  useEffect(() => {
    setDemoHooks(generateDemoHooks());
  }, []);

  return (
    <div>
      <Hero />

      <HowItWorks />

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Go Viral
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to help you create attention-grabbing hooks that stop the scroll.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              See It in Action
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Here's a preview of the hooks our generator creates. Try it yourself on the app page!
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoHooks.map((hook) => (
              <HookCard key={hook.id} hook={hook} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Try the Generator <Zap className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4" id="pricing">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Start for free. Upgrade when you're ready to scale.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <PricingCard
              title="Free"
              price="$0"
              features={[
                '5 hooks per day',
                '6 platforms supported',
                '6 tone options',
                '6 hook types',
                'Save favorites',
                'One-click copy',
              ]}
              ctaText="Get Started Free"
              ctaLink="/app"
            />
            <PricingCard
              title="Premium"
              price="$9"
              features={[
                'Unlimited hooks',
                'Bulk export (CSV)',
                'Advanced analytics',
                'Priority support',
                'Early access to features',
                'No daily limits',
              ]}
              isPremium
              ctaText="Coming Soon - $9/mo"
              ctaLink="/premium"
            />
          </div>
        </div>
      </section>

      <Faq />

      <section className="py-16 px-4 text-center bg-gradient-to-r from-primary/20 to-accent/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Create Viral Hooks?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of creators using ViralHooks to grow their audience.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-10 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Start Generating Free <Zap className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

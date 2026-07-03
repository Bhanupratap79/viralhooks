import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, Shield, Star, TrendingUp, Download, Headphones, Zap } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';

const comparisonData = [
  { feature: 'Daily Hooks', free: '5/day', premium: 'Unlimited' },
  { feature: 'Platforms', free: 'All 6', premium: 'All 6' },
  { feature: 'Tones', free: '6 tones', premium: '6 tones' },
  { feature: 'Hook Types', free: '6 types', premium: '6 types' },
  { feature: 'Save Favorites', free: true, premium: true },
  { feature: 'One-Click Copy', free: true, premium: true },
  { feature: 'Bulk Export', free: false, premium: true },
  { feature: 'Analytics', free: false, premium: true },
  { feature: 'Priority Support', free: false, premium: true },
  { feature: 'Early Access', free: false, premium: true },
];

const testimonials = [
  { name: 'Sarah Chen', handle: '@sarahcreates', role: 'Content Creator', text: 'ViralHooks completely changed my content game. My engagement is up 3x since I started using it. The hook templates are incredibly effective.', avatar: 'SC' },
  { name: 'Marcus Johnson', handle: '@marcusj', role: 'Social Media Manager', text: 'I manage 12 brand accounts and ViralHooks saves me hours every week. The bulk export feature is a lifesaver for my workflow.', avatar: 'MJ' },
  { name: 'Priya Patel', handle: '@priyawrites', role: 'Freelance Writer', text: 'The analytics alone are worth the premium price. I can finally see which hooks actually drive engagement and optimize accordingly.', avatar: 'PP' },
  { name: 'Alex Rivera', handle: '@alexrive', role: 'YouTuber', text: 'My click-through rate doubled after switching to ViralHooks-generated titles. The YouTube-specific templates understand the platform perfectly.', avatar: 'AR' },
];

export default function PremiumPage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-20">
        <section className="py-16 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" /> Premium Plan
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Unlock the Full Power of ViralHooks
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
              Go beyond the free tier with unlimited hook generation, advanced analytics, and priority support.
            </p>

            <div className="bg-gradient-to-r from-primary to-accent p-[1px] rounded-2xl max-w-md mx-auto mb-16">
              <div className="bg-dark rounded-2xl p-8">
                <p className="text-gray-400 text-sm mb-2">Premium</p>
                <p className="text-5xl font-bold text-white mb-2">$9<span className="text-xl text-gray-400">/mo</span></p>
                <p className="text-gray-400 text-sm mb-6">Cancel anytime</p>
                <button
                  className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity cursor-not-allowed opacity-70"
                  disabled
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="py-16 px-4 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white text-center mb-12"
            >
              Free vs Premium Comparison
            </motion.h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Feature</th>
                    <th className="text-center py-4 px-4 text-gray-400 font-medium">Free</th>
                    <th className="text-center py-4 px-4 text-accent font-medium bg-accent/5">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 text-white">{row.feature}</td>
                      <td className="py-4 px-4 text-center">
                        {typeof row.free === 'boolean' ? (
                          row.free ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-gray-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400">{row.free}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center bg-accent/5">
                        {typeof row.premium === 'boolean' ? (
                          row.premium ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-gray-600 mx-auto" />
                        ) : (
                          <span className="text-accent font-medium">{row.premium}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white text-center mb-4"
            >
              What Creators Are Saying
            </motion.h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Join hundreds of satisfied creators who transformed their content strategy.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface border border-border rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.handle} · {t.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{t.text}</p>
                  <div className="flex gap-1 mt-3">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-green-500/10 text-green-400 px-6 py-3 rounded-xl mb-8">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">30-Day Money-Back Guarantee. No questions asked.</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-6 mt-12">
              {[
                { icon: TrendingUp, title: 'Unlimited Growth', desc: 'Generate as many hooks as you need' },
                { icon: Download, title: 'Bulk Export', desc: 'Export your hooks to CSV with one click' },
                { icon: Headphones, title: 'Priority Support', desc: 'Get help within 24 hours' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface border border-border rounded-xl p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-12">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-10 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Try Free First <Zap className="w-5 h-5" />
              </Link>
              <p className="text-gray-500 text-sm mt-3">No credit card required for free tier</p>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingCard({ title, price, features, isPremium = false, ctaText, ctaLink }) {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 30 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative bg-surface border rounded-2xl p-8 flex flex-col ${isPremium ? 'border-primary' : 'border-border'}`}
    >
      {isPremium && (
        <>
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary to-accent -z-10 opacity-50" />
          <span className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </>
      )}

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-white">${price}</span>
        <span className="text-gray-400 ml-1">/month</span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
            <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        to={ctaLink}
        className={`w-full text-center py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 ${isPremium ? 'bg-gradient-to-r from-primary to-accent text-white' : 'bg-white/10 text-white border border-border'}`}
      >
        {ctaText}
      </Link>
    </motion.div>
  );
}

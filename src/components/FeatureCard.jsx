import { motion } from 'framer-motion';

export default function FeatureCard({ icon: Icon, title, description, isPremium = false }) {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 30 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative bg-surface/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
    >
      {isPremium && (
        <span className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-3 py-1 rounded-full">
          Premium
        </span>
      )}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-accent group-hover:rotate-6 transition-transform duration-300" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

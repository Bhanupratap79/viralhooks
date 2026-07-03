import { Monitor, FileText, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: 1,
    icon: Monitor,
    title: 'Choose Platform',
    description: 'Select from 6 platforms including Instagram, TikTok, YouTube, and more to get platform-optimized hooks.',
  },
  {
    number: 2,
    icon: FileText,
    title: 'Enter Topic',
    description: 'Type in your content topic or niche. Our AI understands context and tailors hooks specifically for you.',
  },
  {
    number: 3,
    icon: Zap,
    title: 'Get Hooks',
    description: 'Receive AI-powered, attention-grabbing hooks instantly. Copy, save, and use them in your content.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.25 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HowItWorks() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Three simple steps to create viral hooks that stop the scroll.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className="relative bg-surface border border-border rounded-2xl p-8 text-center"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-bold flex items-center justify-center">
                {step.number}
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-5 mt-2">
                <step.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

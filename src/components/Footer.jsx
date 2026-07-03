import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/#features' },
      { label: 'Pricing', to: '/premium' },
      { label: 'FAQ', to: '/#faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/' },
      { label: 'Blog', to: '/' },
      { label: 'Careers', to: '/' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', to: '/' },
      { label: 'Terms', to: '/' },
    ],
  },
  {
    title: 'Social',
    links: [
      { label: 'Twitter', to: '/' },
      { label: 'Instagram', to: '/' },
      { label: 'TikTok', to: '/' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-border pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
              ViralHooks
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              AI-powered hook generator for content creators. Create viral hooks in seconds.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-8 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} ViralHooks. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Image, Music2, Video, Hash, Users, MessageCircle } from 'lucide-react';

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: Image, color: 'from-pink-500 to-purple-500' },
  { id: 'tiktok', label: 'TikTok', icon: Music2, color: 'from-cyan-400 to-pink-500' },
  { id: 'youtube', label: 'YouTube', icon: Video, color: 'from-red-500 to-red-600' },
  { id: 'twitter', label: 'Twitter/X', icon: Hash, color: 'from-blue-400 to-blue-500' },
  { id: 'linkedin', label: 'LinkedIn', icon: Users, color: 'from-blue-600 to-blue-700' },
  { id: 'facebook', label: 'Facebook', icon: MessageCircle, color: 'from-blue-500 to-blue-600' },
];

export default function PlatformSelector({ selected, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {platforms.map((platform) => {
        const isSelected = selected === platform.id;
        return (
          <button
            key={platform.id}
            onClick={() => onChange(platform.id)}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
              isSelected
                ? 'border-primary bg-primary/10 ring-2 ring-primary/50'
                : 'border-border bg-surface hover:bg-white/5'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
              <platform.icon className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>
              {platform.label}
            </span>
            {isSelected && (
              <div className="absolute inset-0 rounded-xl ring-1 ring-primary/30" />
            )}
          </button>
        );
      })}
    </div>
  );
}

const tones = ['Professional', 'Casual', 'Funny', 'Inspirational', 'Dramatic', 'Witty'];

export default function ToneSelector({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tones.map((tone) => {
        const isSelected = selected === tone.toLowerCase();
        return (
          <button
            key={tone}
            onClick={() => onChange(tone.toLowerCase())}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isSelected
                ? 'bg-gradient-to-r from-primary to-accent text-white'
                : 'bg-surface border border-border text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tone}
          </button>
        );
      })}
    </div>
  );
}

const typeMap = {
  'Question Hook': 'question',
  'Story Hook': 'story',
  'Statistic Hook': 'statistic',
  'Bold Statement': 'bold_statement',
  'How-To': 'how_to',
  'List': 'list',
};

export default function HookTypeSelector({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(typeMap).map(([label, value]) => {
        const isSelected = selected === value;
        return (
          <button
            key={label}
            onClick={() => onChange(value)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isSelected
                ? 'bg-gradient-to-r from-primary to-accent text-white'
                : 'bg-surface border border-border text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

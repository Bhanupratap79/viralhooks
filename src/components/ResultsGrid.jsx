import { Lightbulb } from 'lucide-react';
import HookCard from './HookCard.jsx';
import LoadingSkeleton from './LoadingSkeleton.jsx';

export default function ResultsGrid({ hooks, loading = false }) {
  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  if (!hooks || hooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
          <Lightbulb className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No hooks yet</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Select a platform, enter a topic, and generate hooks to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {hooks.map((hook) => (
        <HookCard key={hook.id} hook={hook} />
      ))}
    </div>
  );
}

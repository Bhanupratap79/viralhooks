export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface border border-border rounded-xl p-5 animate-pulse"
        >
          <div className="h-4 bg-white/10 rounded w-full mb-3" />
          <div className="h-4 bg-white/10 rounded w-3/4 mb-3" />
          <div className="h-4 bg-white/10 rounded w-1/2 mb-4" />
          <div className="flex gap-2 mb-4">
            <div className="h-5 bg-white/10 rounded-full w-16" />
            <div className="h-5 bg-white/10 rounded-full w-16" />
          </div>
          <div className="flex gap-2 mb-3">
            <div className="h-3 bg-white/10 rounded w-14" />
            <div className="h-3 bg-white/10 rounded w-14" />
            <div className="h-3 bg-white/10 rounded w-14" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 bg-white/10 rounded-full w-16" />
            <div className="h-7 bg-white/10 rounded-full w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

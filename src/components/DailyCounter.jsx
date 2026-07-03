import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function DailyCounter() {
  const { dailyCount, DAILY_LIMIT, canGenerate, isPremium } = useApp();

  const percent = Math.min((dailyCount / DAILY_LIMIT) * 100, 100);

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-sm text-white font-medium">
            {isPremium ? 'Unlimited' : `${dailyCount}/${DAILY_LIMIT} free hooks used today`}
          </span>
        </div>
        {!isPremium && (
          <Link
            to="/premium"
            className="text-xs text-primary hover:text-accent transition-colors font-medium"
          >
            Upgrade
          </Link>
        )}
      </div>

      {!isPremium && (
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {!canGenerate && !isPremium && (
        <p className="text-xs text-gray-500 mt-2">
          You've used all free generations today.{' '}
          <Link to="/premium" className="text-primary hover:text-accent">
            Upgrade for unlimited
          </Link>
        </p>
      )}
    </div>
  );
}

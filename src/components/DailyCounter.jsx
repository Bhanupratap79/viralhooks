import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function DailyCounter() {
  const { dailyCount, guestUsed } = useApp();
  const { user, profile } = useAuth();
  const isPremium = profile?.role === 'premium' || profile?.role === 'admin';

  if (!user) {
    return (
      <div className="bg-surface border border-border rounded-xl p-4 min-w-[180px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-white font-medium">
              {guestUsed ? 'Trial used' : '1 free try'}
            </span>
          </div>
          <Link
            to="/login"
            className="text-xs text-primary hover:text-accent transition-colors font-medium"
          >
            Sign up
          </Link>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${guestUsed ? 100 : 0}%` }}
          />
        </div>
        {guestUsed && (
          <p className="text-xs text-gray-500 mt-2">
            <Link to="/login" className="text-primary hover:text-accent">Sign up free</Link> for unlimited
          </p>
        )}
      </div>
    );
  }

  if (isPremium) {
    return (
      <div className="bg-surface border border-primary/30 rounded-xl p-4 min-w-[180px]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm text-white font-medium">Unlimited access</span>
        </div>
      </div>
    );
  }

  const limit = 5;
  const percent = Math.min((dailyCount / limit) * 100, 100);
  const canGenerate = dailyCount < limit;

  return (
    <div className="bg-surface border border-border rounded-xl p-4 min-w-[180px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-sm text-white font-medium">
            {dailyCount}/{limit} free today
          </span>
        </div>
        <Link
          to="/premium"
          className="text-xs text-primary hover:text-accent transition-colors font-medium"
        >
          Upgrade
        </Link>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      {!canGenerate && (
        <p className="text-xs text-gray-500 mt-2">
          Limit reached.{' '}
          <Link to="/premium" className="text-primary hover:text-accent">Go Premium</Link>
        </p>
      )}
    </div>
  );
}

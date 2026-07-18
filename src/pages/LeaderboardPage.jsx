import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trophy, Medal, Flame } from 'lucide-react';
import { asyncReceiveLeaderboards } from '../states/leaderboards/action';
import { LeaderboardSkeleton } from '../components/Skeleton';
import useTranslation from '../hooks/useTranslation';

function LeaderboardPage() {
  const dispatch = useDispatch();
  const leaderboards = useSelector((state) => state.leaderboards);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslation();

  useEffect(() => {
    const fetchLeaderboards = async () => {
      await dispatch(asyncReceiveLeaderboards());
      setIsLoading(false);
    };
    fetchLeaderboards();
  }, [dispatch]);

  // Find max score to calculate progress bar percentages
  const maxScore = leaderboards.length > 0 ? Math.max(...leaderboards.map((l) => l.score)) : 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Title section */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-2">
          <Trophy className="w-8 h-8 text-indigo-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-color)] tracking-tight">
          {t('leaderboard')}
        </h1>
        <p className="text-[var(--text-muted)] text-xs md:text-sm max-w-md mx-auto">
          {t('leaderboardSubtitle')}
        </p>
      </div>

      {isLoading ? (
        <LeaderboardSkeleton />
      ) : leaderboards.length > 0 ? (
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-[var(--card-border)] shadow-xl space-y-6 transition-colors">
          <h2 className="text-lg font-bold text-[var(--text-color)] flex items-center gap-2 pb-4 border-b border-[var(--divider-color)]">
            <Flame className="w-5 h-5 text-indigo-500" />
            {t('mostActiveUsers')}
          </h2>

          <div className="space-y-4">
            {leaderboards.map((item, index) => {
              const isTop3 = index < 3;

              return (
                <div
                  key={item.user.id}
                  className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all ${
                    isTop3
                      ? 'bg-[var(--bg-accent)] border-[var(--card-border)] shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-[var(--bg-accent)]'
                  }`}
                >
                  {/* Rank indicator */}
                  <div className="flex items-center justify-center w-8 h-8 font-bold text-sm">
                    {index === 0 ? (
                      <Medal className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                    ) : index === 1 ? (
                      <Medal className="w-6 h-6 text-slate-400 dark:text-slate-300" />
                    ) : index === 2 ? (
                      <Medal className="w-6 h-6 text-amber-600" />
                    ) : (
                      <span className="text-[var(--text-muted)]">#{index + 1}</span>
                    )}
                  </div>

                  {/* User info */}
                  <img
                    src={item.user.avatar}
                    alt={item.user.name}
                    className="w-10 h-10 rounded-full border border-[var(--card-border)] object-cover"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="text-sm font-semibold text-[var(--text-color)] truncate">
                        {item.user.name}
                      </h4>
                      <span className="text-sm font-bold text-[var(--text-color)] flex items-center gap-1">
                        {item.score} <span className="text-[10px] text-[var(--text-muted)] font-normal">{t('score')}</span>
                      </span>
                    </div>

                    {/* Progress score bar */}
                    <div className="w-full h-1.5 bg-[var(--divider-color)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          index === 0
                            ? 'bg-gradient-to-r from-yellow-500 to-amber-400'
                            : index === 1
                              ? 'bg-slate-400'
                              : index === 2
                                ? 'bg-amber-600'
                                : 'bg-indigo-500'
                        }`}
                        style={{ width: `${(item.score / maxScore) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center rounded-2xl border border-[var(--card-border)] transition-colors">
          <p className="text-[var(--text-muted)] text-sm font-medium">No leaderboard data found.</p>
        </div>
      )}
    </div>
  );
}

export default LeaderboardPage;

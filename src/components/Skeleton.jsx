import React from 'react';

export function ThreadSkeleton() {
  return (
    <div className="glass-card p-6 rounded-2xl animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-800" />
        <div className="space-y-2">
          <div className="w-24 h-4 bg-slate-800 rounded" />
          <div className="w-16 h-3 bg-slate-800 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-3/4 h-6 bg-slate-800 rounded" />
        <div className="w-full h-4 bg-slate-800 rounded" />
        <div className="w-5/6 h-4 bg-slate-800 rounded" />
      </div>
      <div className="flex gap-4 pt-2">
        <div className="w-12 h-6 bg-slate-800 rounded-full" />
        <div className="w-12 h-6 bg-slate-800 rounded-full" />
        <div className="w-16 h-6 bg-slate-800 rounded-full" />
      </div>
    </div>
  );
}

export function ThreadDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-card p-6 md:p-8 rounded-2xl space-y-4">
        <div className="w-20 h-6 bg-slate-800 rounded-full" />
        <div className="w-3/4 h-8 bg-slate-800 rounded" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800" />
          <div className="space-y-2">
            <div className="w-28 h-4 bg-slate-800 rounded" />
            <div className="w-16 h-3 bg-slate-800 rounded" />
          </div>
        </div>
        <div className="space-y-2 pt-4">
          <div className="w-full h-4 bg-slate-800 rounded" />
          <div className="w-full h-4 bg-slate-800 rounded" />
          <div className="w-4/5 h-4 bg-slate-800 rounded" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="w-32 h-6 bg-slate-800 rounded" />
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800" />
            <div className="w-24 h-4 bg-slate-800 rounded" />
          </div>
          <div className="w-full h-4 bg-slate-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="glass-card p-6 rounded-2xl animate-pulse space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-900 last:border-0">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs" />
            <div className="w-10 h-10 rounded-full bg-slate-800" />
            <div className="w-32 h-4 bg-slate-800 rounded" />
          </div>
          <div className="w-10 h-6 bg-slate-800 rounded" />
        </div>
      ))}
    </div>
  );
}

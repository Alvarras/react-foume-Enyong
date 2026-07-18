import React from 'react';
import { ThreadSkeleton, ThreadDetailSkeleton, LeaderboardSkeleton } from './Skeleton';

export default {
  title: 'Components/Skeleton',
  component: ThreadSkeleton,
};

export const Thread = () => <ThreadSkeleton />;
export const ThreadDetail = () => <ThreadDetailSkeleton />;
export const Leaderboard = () => <LeaderboardSkeleton />;

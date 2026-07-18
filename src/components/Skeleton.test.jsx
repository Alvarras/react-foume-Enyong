import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThreadSkeleton, ThreadDetailSkeleton, LeaderboardSkeleton } from './Skeleton';

describe('Skeleton components', () => {
  it('should render ThreadSkeleton correctly', () => {
    const { container } = render(<ThreadSkeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
    expect(container.firstChild).toHaveClass('glass-card');
  });

  it('should render ThreadDetailSkeleton correctly', () => {
    const { container } = render(<ThreadDetailSkeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('should render LeaderboardSkeleton correctly', () => {
    const { container } = render(<LeaderboardSkeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
    expect(container.firstChild).toHaveClass('glass-card');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../../utils/api';
import {
  asyncAddThread,
  asyncToggleUpvoteThread
} from './action';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import {
  addThread,
  toggleUpvoteThread,
  toggleNeutralVoteThread
} from './reducer';

// Mock redux-redux-loading-bar actions
vi.mock('react-redux-loading-bar', () => ({
  showLoading: vi.fn(() => ({ type: 'showLoading' })),
  hideLoading: vi.fn(() => ({ type: 'hideLoading' })),
}));

describe('threads action (thunks)', () => {
  let dispatch;
  let getState;

  beforeEach(() => {
    dispatch = vi.fn();
    getState = vi.fn();
    vi.clearAllMocks();
  });

  describe('asyncAddThread', () => {
    it('should dispatch actions correctly when API call succeeds', async () => {
      // Arrange
      const mockThread = { id: 'thread-1', title: 'Test Title', body: 'Test Body', category: 'test' };
      api.createThread = vi.fn().mockResolvedValue(mockThread);

      // Act
      await asyncAddThread({ title: 'Test Title', body: 'Test Body', category: 'test' })(dispatch, getState, {});

      // Assert
      expect(dispatch).toHaveBeenCalledWith(showLoading());
      expect(api.createThread).toHaveBeenCalledWith({ title: 'Test Title', body: 'Test Body', category: 'test' });
      expect(dispatch).toHaveBeenCalledWith(addThread(mockThread));
      expect(dispatch).toHaveBeenCalledWith(hideLoading());
    });

    it('should dispatch actions correctly and throw error when API call fails', async () => {
      // Arrange
      const errorMsg = 'Failed to create thread';
      api.createThread = vi.fn().mockRejectedValue(new Error(errorMsg));

      // Act
      const result = await asyncAddThread({ title: 'Test Title', body: 'Test Body', category: 'test' })(dispatch, getState, {});

      // Assert
      expect(result.type).toBe('threads/asyncAddThread/rejected');
      expect(result.error.message).toBe(errorMsg);

      expect(dispatch).toHaveBeenCalledWith(showLoading());
      expect(api.createThread).toHaveBeenCalledWith({ title: 'Test Title', body: 'Test Body', category: 'test' });
      expect(dispatch).not.toHaveBeenCalledWith(addThread(expect.any(Object)));
      expect(dispatch).toHaveBeenCalledWith(hideLoading());
    });
  });

  describe('asyncToggleUpvoteThread', () => {
    it('should dispatch optimistic toggleUpvoteThread and call api.upVoteThread when thread is not yet upvoted', async () => {
      // Arrange
      const threadId = 'thread-1';
      const userId = 'user-1';
      getState.mockReturnValue({
        authUser: { id: userId },
        threads: [
          { id: threadId, upVotesBy: [], downVotesBy: [] },
        ],
      });
      api.upVoteThread = vi.fn().mockResolvedValue({});

      // Act
      await asyncToggleUpvoteThread(threadId)(dispatch, getState, {});

      // Assert
      // Optimistic update
      expect(dispatch).toHaveBeenCalledWith(toggleUpvoteThread({ threadId, userId }));
      expect(api.upVoteThread).toHaveBeenCalledWith(threadId);
    });

    it('should rollback the state when api.upVoteThread fails', async () => {
      // Arrange
      const threadId = 'thread-1';
      const userId = 'user-1';
      getState.mockReturnValue({
        authUser: { id: userId },
        threads: [
          { id: threadId, upVotesBy: [], downVotesBy: [] }, // thread is not upvoted
        ],
      });
      api.upVoteThread = vi.fn().mockRejectedValue(new Error('Network error'));
      api.neutralizeThreadVote = vi.fn().mockResolvedValue({});

      // Act
      await asyncToggleUpvoteThread(threadId)(dispatch, getState, {});

      // Assert
      // First optimistic update
      expect(dispatch).toHaveBeenCalledWith(toggleUpvoteThread({ threadId, userId }));
      expect(api.upVoteThread).toHaveBeenCalledWith(threadId);
      // Rollback: since it wasn't upvoted, it should neutralized it back
      expect(dispatch).toHaveBeenCalledWith(toggleNeutralVoteThread({ threadId, userId }));
    });
  });
});

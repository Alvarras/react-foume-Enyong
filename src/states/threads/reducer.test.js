import { describe, it, expect } from 'vitest';
import threadsReducer, {
  receiveThreads,
  addThread,
  toggleUpvoteThread,
  toggleDownvoteThread,
  toggleNeutralVoteThread,
} from './reducer';

describe('threadsReducer', () => {
  it('should return the initial state when given an unknown action', () => {
    expect(threadsReducer(undefined, { type: 'UNKNOWN' })).toEqual([]);
  });

  it('should handle receiveThreads action', () => {
    const dummyThreads = [
      { id: 'thread-1', title: 'First Thread', body: 'Hello', upVotesBy: [], downVotesBy: [] },
    ];
    expect(threadsReducer([], receiveThreads(dummyThreads))).toEqual(dummyThreads);
  });

  it('should handle addThread action', () => {
    const initialState = [
      { id: 'thread-1', title: 'First Thread', body: 'Hello', upVotesBy: [], downVotesBy: [] },
    ];
    const newThread = { id: 'thread-2', title: 'Second Thread', body: 'World', upVotesBy: [], downVotesBy: [] };
    const expectedState = [
      newThread,
      initialState[0],
    ];
    expect(threadsReducer(initialState, addThread(newThread))).toEqual(expectedState);
  });

  it('should handle toggleUpvoteThread action', () => {
    const initialState = [
      { id: 'thread-1', title: 'Thread 1', upVotesBy: [], downVotesBy: ['user-1'] },
    ];
    const updatedState = threadsReducer(initialState, toggleUpvoteThread({ threadId: 'thread-1', userId: 'user-1' }));
    expect(updatedState[0].upVotesBy).toContain('user-1');
    expect(updatedState[0].downVotesBy).not.toContain('user-1');
  });

  it('should handle toggleDownvoteThread action', () => {
    const initialState = [
      { id: 'thread-1', title: 'Thread 1', upVotesBy: ['user-1'], downVotesBy: [] },
    ];
    const updatedState = threadsReducer(initialState, toggleDownvoteThread({ threadId: 'thread-1', userId: 'user-1' }));
    expect(updatedState[0].downVotesBy).toContain('user-1');
    expect(updatedState[0].upVotesBy).not.toContain('user-1');
  });

  it('should handle toggleNeutralVoteThread action', () => {
    const initialState = [
      { id: 'thread-1', title: 'Thread 1', upVotesBy: ['user-1'], downVotesBy: [] },
    ];
    const updatedState = threadsReducer(initialState, toggleNeutralVoteThread({ threadId: 'thread-1', userId: 'user-1' }));
    expect(updatedState[0].upVotesBy).not.toContain('user-1');
    expect(updatedState[0].downVotesBy).not.toContain('user-1');
  });
});

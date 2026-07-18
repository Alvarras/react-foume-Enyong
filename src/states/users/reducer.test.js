import { describe, it, expect } from 'vitest';
import usersReducer, { receiveUsers } from './reducer';

describe('usersReducer', () => {
  it('should return the initial state when given an unknown action', () => {
    expect(usersReducer(undefined, { type: 'UNKNOWN' })).toEqual([]);
  });

  it('should handle receiveUsers action', () => {
    const dummyUsers = [
      { id: 'user-1', name: 'Alice' },
      { id: 'user-2', name: 'Bob' },
    ];
    expect(usersReducer([], receiveUsers(dummyUsers))).toEqual(dummyUsers);
  });
});

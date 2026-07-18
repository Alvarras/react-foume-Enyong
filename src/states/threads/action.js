import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import {
  receiveThreads,
  addThread,
  toggleUpvoteThread,
  toggleDownvoteThread,
  toggleNeutralVoteThread,
} from './reducer';

const receiveThreadsActionCreator = receiveThreads;
const addThreadActionCreator = addThread;
const toggleUpvoteThreadActionCreator = toggleUpvoteThread;
const toggleDownvoteThreadActionCreator = toggleDownvoteThread;
const toggleNeutralVoteThreadActionCreator = toggleNeutralVoteThread;

const asyncAddThread = createAsyncThunk(
  'threads/asyncAddThread',
  async ({ title, body, category }, { dispatch }) => {
    dispatch(showLoading());
    try {
      const thread = await api.createThread({ title, body, category });
      dispatch(addThreadActionCreator(thread));
      return thread;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  }
);

const asyncToggleUpvoteThread = createAsyncThunk(
  'threads/asyncToggleUpvoteThread',
  async (threadId, { dispatch, getState }) => {
    const { authUser, threads } = getState();

    if (!authUser) {
      console.error('You must be logged in to vote.');
      return;
    }

    const userId = authUser.id;
    const thread = threads.find((t) => t.id === threadId);
    const isUpvoted = thread?.upVotesBy.includes(userId);
    const isDownvoted = thread?.downVotesBy.includes(userId);

    // Optimistically update
    if (isUpvoted) {
      dispatch(toggleNeutralVoteThreadActionCreator({ threadId, userId }));
    } else {
      dispatch(toggleUpvoteThreadActionCreator({ threadId, userId }));
    }

    try {
      if (isUpvoted) {
        await api.neutralizeThreadVote(threadId);
      } else {
        await api.upVoteThread(threadId);
      }
    } catch (error) {
      console.error(error.message);
      // Revert to previous state
      if (isUpvoted) {
        dispatch(toggleUpvoteThreadActionCreator({ threadId, userId }));
      } else {
        if (isDownvoted) {
          dispatch(toggleDownvoteThreadActionCreator({ threadId, userId }));
        } else {
          dispatch(toggleNeutralVoteThreadActionCreator({ threadId, userId }));
        }
      }
    }
  }
);

const asyncToggleDownvoteThread = createAsyncThunk(
  'threads/asyncToggleDownvoteThread',
  async (threadId, { dispatch, getState }) => {
    const { authUser, threads } = getState();

    if (!authUser) {
      console.error('You must be logged in to vote.');
      return;
    }

    const userId = authUser.id;
    const thread = threads.find((t) => t.id === threadId);
    const isUpvoted = thread?.upVotesBy.includes(userId);
    const isDownvoted = thread?.downVotesBy.includes(userId);

    // Optimistically update
    if (isDownvoted) {
      dispatch(toggleNeutralVoteThreadActionCreator({ threadId, userId }));
    } else {
      dispatch(toggleDownvoteThreadActionCreator({ threadId, userId }));
    }

    try {
      if (isDownvoted) {
        await api.neutralizeThreadVote(threadId);
      } else {
        await api.downVoteThread(threadId);
      }
    } catch (error) {
      console.error(error.message);
      // Revert to previous state
      if (isDownvoted) {
        dispatch(toggleDownvoteThreadActionCreator({ threadId, userId }));
      } else {
        if (isUpvoted) {
          dispatch(toggleUpvoteThreadActionCreator({ threadId, userId }));
        } else {
          dispatch(toggleNeutralVoteThreadActionCreator({ threadId, userId }));
        }
      }
    }
  }
);

export {
  receiveThreadsActionCreator,
  addThreadActionCreator,
  toggleUpvoteThreadActionCreator,
  toggleDownvoteThreadActionCreator,
  toggleNeutralVoteThreadActionCreator,
  asyncAddThread,
  asyncToggleUpvoteThread,
  asyncToggleDownvoteThread,
};

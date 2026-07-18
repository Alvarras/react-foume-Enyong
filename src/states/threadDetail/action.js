import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import {
  receiveThreadDetail,
  clearThreadDetail,
  addComment,
  toggleUpvoteThreadDetail,
  toggleDownvoteThreadDetail,
  toggleNeutralVoteThreadDetail,
  toggleUpvoteComment,
  toggleDownvoteComment,
  toggleNeutralVoteComment,
} from './reducer';

const receiveThreadDetailActionCreator = receiveThreadDetail;
const clearThreadDetailActionCreator = clearThreadDetail;
const addCommentActionCreator = addComment;
const toggleUpvoteThreadDetailActionCreator = toggleUpvoteThreadDetail;
const toggleDownvoteThreadDetailActionCreator = toggleDownvoteThreadDetail;
const toggleNeutralVoteThreadDetailActionCreator = toggleNeutralVoteThreadDetail;
const toggleUpvoteCommentActionCreator = toggleUpvoteComment;
const toggleDownvoteCommentActionCreator = toggleDownvoteComment;
const toggleNeutralVoteCommentActionCreator = toggleNeutralVoteComment;

const asyncReceiveThreadDetail = createAsyncThunk(
  'threadDetail/asyncReceiveThreadDetail',
  async (threadId, { dispatch }) => {
    dispatch(showLoading());
    dispatch(clearThreadDetailActionCreator());
    try {
      const threadDetail = await api.getThreadDetail(threadId);
      dispatch(receiveThreadDetailActionCreator(threadDetail));
    } catch (error) {
      console.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  }
);

const asyncAddComment = createAsyncThunk(
  'threadDetail/asyncAddComment',
  async ({ threadId, content }, { dispatch }) => {
    dispatch(showLoading());
    try {
      const comment = await api.createComment({ threadId, content });
      dispatch(addCommentActionCreator(comment));
      return comment;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  }
);

const asyncToggleUpvoteThreadDetail = createAsyncThunk(
  'threadDetail/asyncToggleUpvoteThreadDetail',
  async (_, { dispatch, getState }) => {
    const { authUser, threadDetail } = getState();

    if (!authUser) {
      console.error('You must be logged in to vote.');
      return;
    }

    if (!threadDetail) return;

    const userId = authUser.id;
    const isUpvoted = threadDetail.upVotesBy.includes(userId);

    if (isUpvoted) {
      dispatch(toggleNeutralVoteThreadDetailActionCreator({ userId }));
    } else {
      dispatch(toggleUpvoteThreadDetailActionCreator({ userId }));
    }

    try {
      if (isUpvoted) {
        await api.neutralizeThreadVote(threadDetail.id);
      } else {
        await api.upVoteThread(threadDetail.id);
      }
    } catch (error) {
      console.error(error.message);
      // Revert
      if (isUpvoted) {
        dispatch(toggleUpvoteThreadDetailActionCreator({ userId }));
      } else {
        dispatch(toggleNeutralVoteThreadDetailActionCreator({ userId }));
      }
    }
  }
);

const asyncToggleDownvoteThreadDetail = createAsyncThunk(
  'threadDetail/asyncToggleDownvoteThreadDetail',
  async (_, { dispatch, getState }) => {
    const { authUser, threadDetail } = getState();

    if (!authUser) {
      console.error('You must be logged in to vote.');
      return;
    }

    if (!threadDetail) return;

    const userId = authUser.id;
    const isDownvoted = threadDetail.downVotesBy.includes(userId);

    if (isDownvoted) {
      dispatch(toggleNeutralVoteThreadDetailActionCreator({ userId }));
    } else {
      dispatch(toggleDownvoteThreadDetailActionCreator({ userId }));
    }

    try {
      if (isDownvoted) {
        await api.neutralizeThreadVote(threadDetail.id);
      } else {
        await api.downVoteThread(threadDetail.id);
      }
    } catch (error) {
      console.error(error.message);
      // Revert
      if (isDownvoted) {
        dispatch(toggleDownvoteThreadDetailActionCreator({ userId }));
      } else {
        dispatch(toggleNeutralVoteThreadDetailActionCreator({ userId }));
      }
    }
  }
);

const asyncToggleUpvoteComment = createAsyncThunk(
  'threadDetail/asyncToggleUpvoteComment',
  async (commentId, { dispatch, getState }) => {
    const { authUser, threadDetail } = getState();

    if (!authUser) {
      console.error('You must be logged in to vote.');
      return;
    }

    if (!threadDetail) return;

    const userId = authUser.id;
    const comment = threadDetail.comments.find((c) => c.id === commentId);
    const isUpvoted = comment?.upVotesBy.includes(userId);

    if (isUpvoted) {
      dispatch(toggleNeutralVoteCommentActionCreator({ commentId, userId }));
    } else {
      dispatch(toggleUpvoteCommentActionCreator({ commentId, userId }));
    }

    try {
      if (isUpvoted) {
        await api.neutralizeCommentVote({ threadId: threadDetail.id, commentId });
      } else {
        await api.upVoteComment({ threadId: threadDetail.id, commentId });
      }
    } catch (error) {
      console.error(error.message);
      // Revert
      if (isUpvoted) {
        dispatch(toggleUpvoteCommentActionCreator({ commentId, userId }));
      } else {
        dispatch(toggleNeutralVoteCommentActionCreator({ commentId, userId }));
      }
    }
  }
);

const asyncToggleDownvoteComment = createAsyncThunk(
  'threadDetail/asyncToggleDownvoteComment',
  async (commentId, { dispatch, getState }) => {
    const { authUser, threadDetail } = getState();

    if (!authUser) {
      console.error('You must be logged in to vote.');
      return;
    }

    if (!threadDetail) return;

    const userId = authUser.id;
    const comment = threadDetail.comments.find((c) => c.id === commentId);
    const isDownvoted = comment?.downVotesBy.includes(userId);

    if (isDownvoted) {
      dispatch(toggleNeutralVoteCommentActionCreator({ commentId, userId }));
    } else {
      dispatch(toggleDownvoteCommentActionCreator({ commentId, userId }));
    }

    try {
      if (isDownvoted) {
        await api.neutralizeCommentVote({ threadId: threadDetail.id, commentId });
      } else {
        await api.downVoteComment({ threadId: threadDetail.id, commentId });
      }
    } catch (error) {
      console.error(error.message);
      // Revert
      if (isDownvoted) {
        dispatch(toggleDownvoteCommentActionCreator({ commentId, userId }));
      } else {
        dispatch(toggleNeutralVoteCommentActionCreator({ commentId, userId }));
      }
    }
  }
);

export {
  receiveThreadDetailActionCreator,
  clearThreadDetailActionCreator,
  addCommentActionCreator,
  toggleUpvoteThreadDetailActionCreator,
  toggleDownvoteThreadDetailActionCreator,
  toggleNeutralVoteThreadDetailActionCreator,
  toggleUpvoteCommentActionCreator,
  toggleDownvoteCommentActionCreator,
  toggleNeutralVoteCommentActionCreator,
  asyncReceiveThreadDetail,
  asyncAddComment,
  asyncToggleUpvoteThreadDetail,
  asyncToggleDownvoteThreadDetail,
  asyncToggleUpvoteComment,
  asyncToggleDownvoteComment,
};

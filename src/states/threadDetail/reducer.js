import { createSlice } from '@reduxjs/toolkit';

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: null,
  reducers: {
    receiveThreadDetail: (state, action) => action.payload,
    clearThreadDetail: () => null,
    addComment: (state, action) => {
      if (state) {
        state.comments.unshift(action.payload);
      }
    },
    toggleUpvoteThreadDetail: (state, action) => {
      const { userId } = action.payload;
      if (state) {
        if (!state.upVotesBy.includes(userId)) {
          state.upVotesBy.push(userId);
        }
        state.downVotesBy = state.downVotesBy.filter((id) => id !== userId);
      }
    },
    toggleDownvoteThreadDetail: (state, action) => {
      const { userId } = action.payload;
      if (state) {
        if (!state.downVotesBy.includes(userId)) {
          state.downVotesBy.push(userId);
        }
        state.upVotesBy = state.upVotesBy.filter((id) => id !== userId);
      }
    },
    toggleNeutralVoteThreadDetail: (state, action) => {
      const { userId } = action.payload;
      if (state) {
        state.upVotesBy = state.upVotesBy.filter((id) => id !== userId);
        state.downVotesBy = state.downVotesBy.filter((id) => id !== userId);
      }
    },
    toggleUpvoteComment: (state, action) => {
      const { commentId, userId } = action.payload;
      if (state) {
        const comment = state.comments.find((c) => c.id === commentId);
        if (comment) {
          if (!comment.upVotesBy.includes(userId)) {
            comment.upVotesBy.push(userId);
          }
          comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
        }
      }
    },
    toggleDownvoteComment: (state, action) => {
      const { commentId, userId } = action.payload;
      if (state) {
        const comment = state.comments.find((c) => c.id === commentId);
        if (comment) {
          if (!comment.downVotesBy.includes(userId)) {
            comment.downVotesBy.push(userId);
          }
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
        }
      }
    },
    toggleNeutralVoteComment: (state, action) => {
      const { commentId, userId } = action.payload;
      if (state) {
        const comment = state.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
          comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
        }
      }
    },
  },
});

export const {
  receiveThreadDetail,
  clearThreadDetail,
  addComment,
  toggleUpvoteThreadDetail,
  toggleDownvoteThreadDetail,
  toggleNeutralVoteThreadDetail,
  toggleUpvoteComment,
  toggleDownvoteComment,
  toggleNeutralVoteComment,
} = threadDetailSlice.actions;

export default threadDetailSlice.reducer;

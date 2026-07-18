import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { receiveLeaderboards } from './reducer';

const receiveLeaderboardsActionCreator = receiveLeaderboards;

const asyncReceiveLeaderboards = createAsyncThunk(
  'leaderboards/asyncReceiveLeaderboards',
  async (_, { dispatch }) => {
    dispatch(showLoading());
    try {
      const leaderboards = await api.getLeaderboards();
      dispatch(receiveLeaderboardsActionCreator(leaderboards));
    } catch (error) {
      console.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  }
);

export {
  receiveLeaderboardsActionCreator,
  asyncReceiveLeaderboards,
};

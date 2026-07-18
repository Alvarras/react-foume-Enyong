import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { receiveUsersActionCreator } from '../users/action';
import { receiveThreadsActionCreator } from '../threads/action';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

const asyncPopulateUsersAndThreads = createAsyncThunk(
  'shared/asyncPopulateUsersAndThreads',
  async (_, { dispatch }) => {
    dispatch(showLoading());
    try {
      const [users, threads] = await Promise.all([
        api.getAllUsers(),
        api.getAllThreads(),
      ]);

      dispatch(receiveUsersActionCreator(users));
      dispatch(receiveThreadsActionCreator(threads));
    } catch (error) {
      console.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  }
);

export { asyncPopulateUsersAndThreads };

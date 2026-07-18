import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { receiveUsers } from './reducer';

const receiveUsersActionCreator = receiveUsers;

const asyncRegisterUser = createAsyncThunk(
  'users/asyncRegisterUser',
  async ({ name, email, password }, { dispatch }) => {
    dispatch(showLoading());
    try {
      await api.register({ name, email, password });
    } catch (error) {
      throw new Error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  }
);

export {
  receiveUsersActionCreator,
  asyncRegisterUser,
};

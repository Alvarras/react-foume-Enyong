import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { setAuthUser, unsetAuthUser } from './reducer';

const setAuthUserActionCreator = setAuthUser;
const unsetAuthUserActionCreator = unsetAuthUser;

const asyncSetAuthUser = createAsyncThunk(
  'authUser/asyncSetAuthUser',
  async ({ email, password }, { dispatch }) => {
    dispatch(showLoading());
    try {
      const token = await api.login({ email, password });
      api.putAccessToken(token);
      const authUser = await api.getOwnProfile();
      dispatch(setAuthUserActionCreator(authUser));
      return authUser;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  }
);

const asyncUnsetAuthUser = createAsyncThunk(
  'authUser/asyncUnsetAuthUser',
  async (_, { dispatch }) => {
    api.putAccessToken('');
    dispatch(unsetAuthUserActionCreator());
  }
);

export {
  setAuthUserActionCreator,
  unsetAuthUserActionCreator,
  asyncSetAuthUser,
  asyncUnsetAuthUser,
};

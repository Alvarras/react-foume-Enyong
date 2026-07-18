import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { setAuthUserActionCreator } from '../authUser/action';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { setIsPreload } from './reducer';

const setIsPreloadActionCreator = setIsPreload;

const asyncPreloadProcess = createAsyncThunk(
  'isPreload/asyncPreloadProcess',
  async (_, { dispatch }) => {
    dispatch(showLoading());
    try {
      const token = api.getAccessToken();
      if (token) {
        const authUser = await api.getOwnProfile();
        dispatch(setAuthUserActionCreator(authUser));
      }
    } catch {
      // Clear invalid token
      api.putAccessToken('');
      dispatch(setAuthUserActionCreator(null));
    } finally {
      dispatch(setIsPreloadActionCreator(false));
      dispatch(hideLoading());
    }
  }
);

export {
  setIsPreloadActionCreator,
  asyncPreloadProcess,
};

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authUserReducer from './authUser/reducer';
import isPreloadReducer from './isPreload/reducer';
import usersReducer from './users/reducer';
import threadsReducer from './threads/reducer';
import threadDetailReducer from './threadDetail/reducer';
import leaderboardsReducer from './leaderboards/reducer';
import themeReducer from './theme/reducer';
import languageReducer from './language/reducer';

const rootReducer = combineReducers({
  authUser: authUserReducer,
  isPreload: isPreloadReducer,
  users: usersReducer,
  threads: threadsReducer,
  threadDetail: threadDetailReducer,
  leaderboards: leaderboardsReducer,
  loadingBar: loadingBarReducer,
  theme: themeReducer,
  language: languageReducer,
});

const persistConfig = {
  key: 'dicoding-forum',
  storage,
  whitelist: ['authUser', 'theme', 'language'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

const persistor = persistStore(store);

export default store;
export { persistor };
// Exporting RootState / AppDispatch types is not needed since we're using Javascript.

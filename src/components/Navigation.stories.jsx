import React from 'react';
import Navigation from './Navigation';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../states/theme/reducer';
import languageReducer from '../states/language/reducer';
import authUserReducer from '../states/authUser/reducer';

const mockStore = (preloadedState) => configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
    authUser: authUserReducer,
  },
  preloadedState,
});

export default {
  title: 'Components/Navigation',
  component: Navigation,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Unauthenticated = () => (
  <Provider store={mockStore({ theme: 'dark', language: 'en', authUser: null })}>
    <Navigation />
  </Provider>
);

export const Authenticated = () => (
  <Provider
    store={mockStore({
      theme: 'dark',
      language: 'en',
      authUser: {
        id: 'user-1',
        name: 'Jane Doe',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Doe',
      },
    })}
  >
    <Navigation />
  </Provider>
);

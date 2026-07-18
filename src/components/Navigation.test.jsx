import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Navigation from './Navigation';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../states/theme/reducer';
import languageReducer from '../states/language/reducer';
import authUserReducer from '../states/authUser/reducer';

// Helper function to render component with Redux store and React Router Router
function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        authUser: authUserReducer,
        theme: themeReducer,
        language: languageReducer,
      },
      preloadedState: {
        theme: 'dark',
        language: 'en',
        authUser: null,
        ...preloadedState,
      },
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

describe('Navigation Component', () => {
  it('should render brand name and default links correctly', () => {
    renderWithProviders(<Navigation />);

    expect(screen.getByText('Talk')).toBeInTheDocument();
    expect(screen.getByText('Space')).toBeInTheDocument();
  });

  it('should display Login button when user is not authenticated', () => {
    renderWithProviders(<Navigation />, {
      preloadedState: { authUser: null }
    });

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('should display user avatar and Logout button when user is authenticated', () => {
    const authUser = {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg'
    };

    renderWithProviders(<Navigation />, {
      preloadedState: { authUser }
    });

    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should dispatch toggleTheme action when theme button is clicked', () => {
    const { store } = renderWithProviders(<Navigation />, {
      preloadedState: { theme: 'dark' }
    });

    const themeButton = screen.getByTitle('Switch to Light Mode');
    fireEvent.click(themeButton);

    // After toggleTheme, state should become light
    expect(store.getState().theme).toBe('light');
  });

  it('should dispatch toggleLanguage action when language button is clicked', () => {
    const { store } = renderWithProviders(<Navigation />, {
      preloadedState: { language: 'en' }
    });

    const langButton = screen.getByText('en');
    fireEvent.click(langButton);

    // After toggleLanguage, state should become id
    expect(store.getState().language).toBe('id');
  });
});

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import store, { persistor } from './states';
import App from './App';
import './index.css';

/* eslint-disable camelcase */
const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};
/* eslint-enable camelcase */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter future={routerFuture}>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

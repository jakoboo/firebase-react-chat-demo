import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './store';
import StorePoweredThemeProvider from './ThemeProvider';
import { GlobalStyles } from './styles';

import App from './App';
import * as serviceWorker from './serviceWorker';

const APP_ELEMENT_SELECTOR = '#app';

ReactDOM.render(
  <Provider store={store}>
    <StorePoweredThemeProvider>
      <GlobalStyles />
      <App />
    </StorePoweredThemeProvider>
  </Provider>,
  document.querySelector(APP_ELEMENT_SELECTOR)
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

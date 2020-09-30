import { combineReducers, createStore } from 'redux';

const CHANGE_THEME = 'UI_CHANGE_THEME';
const initialTheme = 'light';

const themeReducer = (state = initialTheme, action) => {
  switch (action.type) {
    case CHANGE_THEME:
      return action.theme;
    default:
      return state;
  }
};

const uiReducer = combineReducers({
  theme: themeReducer,
});

const appReducer = combineReducers({
  ui: uiReducer,
});

export const store = createStore(appReducer);

/**
 * Redux Store configuration
 */
/* istanbul ignore file */
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { apiTokenReducer } from '../redux/token/reducers';
import { apiProfileReducer } from '../redux/profile/reducers';
import { appReducer } from '../redux/app/reducers';

// Combine all reducers
const rootReducer = combineReducers({
  api: combineReducers({
    token: apiTokenReducer,
    profile: apiProfileReducer,
  }),
  app: appReducer,
});

// Thunk middleware
const middlewares = [thunk];

// Create store
export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

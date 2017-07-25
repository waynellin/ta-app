import { applyMiddleware, createStore } from 'redux';
import freeze from 'redux-freeze';
import { composeWithDevTools } from 'redux-devtools-extension';
import { loadState } from './localStorage.js';

import logger from 'redux-logger';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';

import reducer from './reducers';

const middleware = applyMiddleware(promise(), thunk, logger(), freeze);

export default createStore(reducer, loadState(), composeWithDevTools(middleware));
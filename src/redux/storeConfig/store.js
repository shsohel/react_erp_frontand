// ** Redux, Thunk & Root Reducer Imports
import { applyMiddleware, compose, createStore } from 'redux';
import createDebounce from 'redux-debounced';
import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';

// ** init middleware
const middleware = [thunk, createDebounce()];

// ** Dev Tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// ** Create store
export const store = createStore( rootReducer, {}, composeEnhancers( applyMiddleware( ...middleware ) ) );

export const persistor = persistStore( store );

export default { store, persistor };

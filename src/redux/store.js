import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { createStore, applyMiddleware, compose } from 'redux';

// Determine if Redux Devtool is installed
const composeSetup = process.env.NODE_ENV !== 'production' && typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose

const enhancer = composeSetup(applyMiddleware(thunk));

export default function configureStore(initialState) {    
    const store = createStore(rootReducer, initialState, enhancer);
    return store;
}

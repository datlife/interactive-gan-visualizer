import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';


const enhancer = compose(
    applyMiddleware(thunk),
     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
export default function configureStore(initialState) {    
    const store = createStore(rootReducer, initialState, enhancer);
    return store;
}

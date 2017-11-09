import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import ImageReducer from './reducers';

const rootReducer = combineReducers({
    routing: routerReducer,
    images: ImageReducer
});

export default rootReducer;
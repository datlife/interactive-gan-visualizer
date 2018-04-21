import { combineReducers } from 'redux';

import fabricCanvas from './fabricCanvas';
import ImageReducer from './imageReducer';

const rootReducers = combineReducers({
    images: ImageReducer,
    views:  fabricCanvas,
});
export default rootReducers;

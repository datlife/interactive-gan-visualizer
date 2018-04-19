import { combineReducers } from 'redux';

import fabricCanvas from './fabricCanvas';
import ImageReducer from './ImageReducer';

const rootReducers = combineReducers({
    images: ImageReducer,
    views:  fabricCanvas,
});
export default rootReducers;

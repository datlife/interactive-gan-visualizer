import { combineReducers } from 'redux';

import fabricCanvas from './fabricCanvas';
import BboxReducer from './BboxReducer';
import ImageReducer from './ImageReducer';

const rootReducers = combineReducers({
    images: ImageReducer,
    bboxes: BboxReducer,
    views:  fabricCanvas,
});
export default rootReducers;

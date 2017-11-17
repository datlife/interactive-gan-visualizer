import { combineReducers } from 'redux';

import fabricCanvas from './fabricCanvas';
import updateBboxes from './updateBboxes';
import ImageReducer from './processImages';

const rootReducers = combineReducers({
    images: ImageReducer,
    bboxes: updateBboxes,
    views:  fabricCanvas,
});
export default rootReducers;

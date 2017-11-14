import { combineReducers } from 'redux';

import fabricCanvas from './fabricCanvas';
import activeObject from './activeObject';
import exportObject from './exportObject';
import ImageReducer from './uploadImage';

const init_state = {
    img: null,
    canvas: null,
    bboxes: [],
}
const rootReducers = combineReducers({
    fabricCanvas,
    activeObject,
    exportObject,
    images: ImageReducer,
});
export default rootReducers;

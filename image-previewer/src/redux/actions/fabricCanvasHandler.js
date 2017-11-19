import * as types from '../constants';
import {fabric} from 'fabric';


export const initialize = (el, id, canvas, background) => (dispatch, getState) => {
    dispatch({
        type: types.CANVAS_INITIALIZE, 
        id: id,
        background: background,
        canvas: canvas}); 
};

export const addObject = (id, obj) => (dispatch, getState) => {
    dispatch({
        type: types.ADD_OBJECT, 
        id: id,
        object: obj});

    dispatch({
        type: types.OBJECT_SELECTED, 
        payload: obj});    
};

export const modified = event => ({
    type: types.OBJECT_MODIFIED, 
    payload: event.target
});

export const refresh = id => ({
    type: types.CANVAS_REFRESH,
    id: id
});

export const toDataURL = (id) => (dispatch, getState) => {
    const fabricCanvas = getState().fabricCanvas.byId.id;
    const dataURL = fabricCanvas.toDataURL({format: 'jpeg', quality: 0.8});

    dispatch({
        type: types.TO_DATA_URL, 
        payload: dataURL});  // and id
}


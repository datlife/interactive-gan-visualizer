import * as types from '../constants';
import {fabric} from 'fabric';

export const initialize = (el, id, height, width) => (dispatch, getState) => {
    let canvas = new fabric.Canvas();
    canvas.initialize(el, {height, width});    
    dispatch({type: types.CANVAS_INITIALIZE, canvas: canvas, id: id}); // and id
};

export const modified = event => ({type: types.OBJECT_MODIFIED, payload: event.target});
export const refresh = ({type: types.CANVAS_REFRESH});

export const addObject = (id, obj) => (dispatch, getState) => {
    // Add new object to current canvase

    const fabricCanvas = getState().fabricCanvas; // find the canvas getState().canvas[id] ?
    fabricCanvas.add(obj);                        // add the bounding box to this canvas
    fabricCanvas.setActiveObject(obj);            // set this bounding box as active on

    dispatch({type: types.ADD_OBJECT, payload: fabricCanvas, id: id});
    dispatch({type: types.OBJECT_SELECTED, payload: obj});
};


export const toDataURL = () => (dispatch, getState) => {
    const fabricCanvas = getState().fabricCanvas;
    const dataURL = fabricCanvas.toDataURL({format: 'jpeg', quality: 0.8});

    dispatch({type: types.TO_DATA_URL, payload: dataURL});  // and id
}

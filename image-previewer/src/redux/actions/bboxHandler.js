import {createAction} from 'redux-actions';
import * as types from '../constants';

export const selected = createAction(types.OBJECT_SELECTED);
export const moving = createAction(types.OBJECT_MOVING);
export const scaling = createAction(types.OBJECT_SCALING);
export const cleared = createAction(types.OBJECT_CLEARED);

export const modified = obj => {
    const {width, height, scaleX, scaleY} = obj;
    obj
        .setWidth(width * scaleX)
        .setHeight(height * scaleY)
        .setScaleX(1)
        .setScaleY(1);

    return {
        type: types.OBJECT_MODIFIED, 
        payload: obj
    };
};


export const setLeft = (id,value) => (dispatch, getState) => {
    const activeObject = getState().fabricCanvas.byId.id.getActiveObject();
    activeObject.setLeft(parseInt(value, 10)).setCoords();

    dispatch({ 
        type: types.OBJECT_SET_LEFT, 
        payload: activeObject });

    dispatch({ 
        type: types.CANVAS_REFRESH,
        id: id });
};

export const setTop =  (id,value)=> (dispatch, getState) => {
    const activeObject = getState().fabricCanvas.byId.id.getActiveObject();
    activeObject.setTop(parseInt(value, 10)).setCoords();
    dispatch({ 
        type: types.OBJECT_SET_TOP, 
        payload: activeObject });

    dispatch({ 
        type: types.CANVAS_REFRESH,
        id: id});
};

export const setWidth = (id,value) => (dispatch, getState) => {
    const activeObject = getState().fabricCanvas.byId.id.getActiveObject();
    activeObject.setWidth(parseInt(value, 10)).setCoords();

    dispatch({ 
        type: types.OBJECT_SET_WIDTH, 
        payload: activeObject });
    dispatch({ 
        type: types.CANVAS_REFRESH,
        id: id });
};

export const setHeight = (id,value) => (dispatch, getState) => {
    const activeObject = getState().fabricCanvas.byId.id.getActiveObject();
    activeObject.setHeight(parseInt(value, 10)).setCoords();

    dispatch({ 
        type: types.OBJECT_SET_HEIGHT, 
        payload: activeObject });

    dispatch({
        type: types.CANVAS_REFRESH,
        id: id });
};
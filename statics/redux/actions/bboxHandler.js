import {createAction} from 'redux-actions';
import * as types from '../constants';

export const selected = createAction(types.OBJECT_SELECTED);
export const moving = createAction(types.OBJECT_MOVING);

export const select =(canvas, id, event) => (dispatch, getState) => {
};

export const scaling =(canvas, id, event) => (dispatch, getState) => {
  let obj = event.target;

  const {width, height, scaleX, scaleY, strokeWidth} = obj;
  console.log(strokeWidth);
  obj
    .setWidth(width * scaleX)
    .setHeight(height * scaleY)
    .setScaleX(1)
    .setScaleY(1);

  // return {type: types.OBJECT_MODIFIED, payload: obj};
  dispatch({type: types.MODIFY_CANVAS, id: id, canvas: JSON.stringify(canvas)});
  
};

export const cleared  =(canvas, id, event) => (dispatch, getState) => {
}

import {createAction} from 'redux-actions';
import * as types from '../constants';

export const selected = createAction(types.OBJECT_SELECTED);

export const select = (canvas, id, event) => (dispatch, getState) => {


  dispatch({type: types.OBJECT_SELECTED, 
            id: id, 
            object: event.target})

};

export const scaling =(canvas, id, event) => (dispatch, getState) => {
  let obj = event.target;

  const {width, height, scaleX, scaleY, strokeWidth} = obj;
  obj
    .setWidth(width * scaleX)
    .setHeight(height * scaleY)
    .setScaleX(1)
    .setScaleY(1);

  // return {type: types.OBJECT_MODIFIED, payload: obj};
  dispatch({type: types.MODIFY_CANVAS, id: id, canvas: JSON.stringify(canvas)});
  
};

export const moving  =(canvas, id, event) => (dispatch, getState) => {
  console.log("moving")
  // dispatch({
  //   type: types.OBJECT_MOVING,
  //   object: canvas
  // })
}

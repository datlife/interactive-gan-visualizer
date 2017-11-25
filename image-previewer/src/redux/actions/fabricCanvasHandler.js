import * as types from '../constants';
import {fabric} from 'fabric';

export const initialize = (id, canvas) => (dispatch, getState) => {
  dispatch({
      type: types.INITIALIZE_CANVAS, 
      id: id, canvas: JSON.stringify(canvas) });
};

export const addObject = (id, object) => (dispatch, getState) => {    
  const canvas_json = getState().views.byId[id].canvas;
  var new_canvas_json = Object.assign({}, JSON.parse(canvas_json))
  new_canvas_json['objects'].push(object)

  dispatch({type: types.ADD_OBJECT, id: id, canvas: JSON.stringify(new_canvas_json)});
};


export const toDataURL = (id) => (dispatch, getState) => {
  const fabricCanvas = getState().views.byId[id].canvas;
  const dataURL = fabricCanvas.toDataURL({format: 'jpeg', quality: 0.8});
  
  dispatch({type: types.TO_DATA_URL, payload: dataURL}); // and id
}
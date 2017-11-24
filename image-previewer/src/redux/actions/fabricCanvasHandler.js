import * as types from '../constants';
import {fabric} from 'fabric';

export const initialize = (id, canvas) => (dispatch, getState) => {
  dispatch({
      type: types.CANVAS_INITIALIZE, 
      id: id, canvas: JSON.stringify(canvas) });
};

export const addObject = (id, object) => (dispatch, getState) => {    
  let canvas_json = getState().views.byId[id].canvas;
  console.log(getState().views.byId[id]);
  // rebuild canvas and add object
  var canvas = new fabric.Canvas();
  canvas.loadFromJSON(canvas_json);
  canvas.add(object);
  canvas.setActiveObject(object); 
  
  dispatch({type: types.ADD_OBJECT, id: id, canvas: JSON.stringify(canvas)});
};

export const modified = event => ({type: types.OBJECT_MODIFIED, payload: event.target});


export const toDataURL = (id) => (dispatch, getState) => {
  const fabricCanvas = getState().views.byId[id].canvas;
  const dataURL = fabricCanvas.toDataURL({format: 'jpeg', quality: 0.8});
  dispatch({type: types.TO_DATA_URL, payload: dataURL}); // and id
}
import {fabric} from 'fabric';
import * as types from '../constants';
import * as API from '../../api/objectDetection';

export const initialize = (id, canvas) => (dispatch, getState) => {
  dispatch({
      type: types.INITIALIZE_CANVAS, 
      id: id, canvas: JSON.stringify(canvas) });
};

export const detectObjects = (id) => (dispatch, getState) =>{
  const image = getState().images.byId[id];
  
  const reader = new FileReader();
  reader.readAsDataURL(image.file);      
  reader.onload = () => {
    let result = API.detect_object(image.id, reader.result)
    result.then(
      function(res){
        console.log(res)
        res.data.forEach(e => {
          console.log()
          const rect = new fabric.Rect({
            top: e.top,
            left: e.left,
            width: e.width,
            height: e.height,
            hasBorder: true,
            stroke: 'yellow',
            strokeWidth: 3,
            fill:'transparent'
          });
          dispatch(addObject(image.id, rect))             
      })
    });
    dispatch({type: types.DETECT_OBJECT, id:id})             
  }
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
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
        var detected_ojects =  new Array();    
        console.log(res.data)
        res.data.forEach(e => {
          const rect = new fabric.Rect({
            top:   e.top,
            left:  e.left,
            width: e.width,
            height:e.height,
            hasBorder: true,
            stroke: 'yellow',
            strokeWidth: 3,
            fill:'transparent'
          });
          detected_ojects.push(rect)})
        const canvas_json = getState().views.byId[id].canvas;
        var new_canvas_json = Object.assign({}, JSON.parse(canvas_json))
        new_canvas_json['objects'] = detected_ojects   
        dispatch({type: types.DETECT_OBJECT, 
                  id:id, 
                  canvas: JSON.stringify(new_canvas_json) })        
    }); 
  }
};   

export const confirmSelectedObject = (id) => (dispatch, getState) => {    
  console.log("confirming")
  
  const view = getState().views.byId[id];
  var new_canvas_json = Object.assign({}, JSON.parse(view.canvas))
  new_canvas_json['objects'] = view.selected;
  console.log(new_canvas_json)
  dispatch({type: types.CONFIRM_SELECT, id: id, canvas: JSON.stringify(new_canvas_json)})
  
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
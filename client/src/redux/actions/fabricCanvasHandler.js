import {fabric} from 'fabric';
import * as types from '../constants';
import * as API from '../../api/objectDetection';

export const initialize = (id, canvas) => (dispatch, getState) => {
  dispatch({
      type: types.INITIALIZE_CANVAS, 
      id: id, canvas: JSON.stringify(canvas) });
};

export const confirmSelectedObject = (id) => (dispatch, getState) =>{  
  const view = getState().views.byId[id];  
  var canvas_json = Object.assign({}, JSON.parse(view.canvas))
  const moveable_box = view.selected
  const fix_box      = view.selected.set({hasControl: false, selectable: false})
  canvas_json['objects'] = [fix_box, moveable_box];
  dispatch({type: types.CONFIRM_SELECT, 
            id: id, 
            confirmed: true,
            canvas: JSON.stringify(canvas_json)})
};

export const detectObjects = (id) => (dispatch, getState) =>{
  // Clear all existing bounding boxes and generate new ones from server
  const image = getState().images.byId[id];
  const reader = new FileReader();
  reader.readAsDataURL(image.file);      
  reader.onload = () => {
    let result = API.detect_object(image.id, reader.result)
    result.then(
      function(res){
        var detected_ojects =  [];    
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
    }).catch(resp => {
      // Catch Error when sever is not available
      // Display Error Message on screen
      console.log(resp)
    }); 
  }
};   


export const addObject = (id, object) => (dispatch, getState) => {    
  const canvas_json = getState().views.byId[id].canvas;
  var new_canvas_json = Object.assign({}, JSON.parse(canvas_json))
  new_canvas_json['objects'].push(object)

  dispatch({type: types.ADD_OBJECT, id: id, canvas: JSON.stringify(new_canvas_json)});
};

export const clear = (id) => (dispatch, getState) => {
  const view = getState().views.byId[id];  
  var canvas_json = Object.assign({}, JSON.parse(view.canvas))
  canvas_json['objects'] = [];
  dispatch({type: types.CLEAR_CANVAS, 
    id: id, 
    confirmed: false,
    canvas: JSON.stringify(canvas_json)})
}
import {createAction} from 'redux-actions';
import * as types from '../constants';
import {fabric} from 'fabric';

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
  if (getState().views.byId[id].confirmed){
    let canvas_json = JSON.parse(getState().views.byId[id].canvas)
    
    var moving_obj  = canvas_json['objects'][1]  // reference confirmSelectedObject in fabricCanvashandler
    console.log("moving")

    //generated canvas
    var generated_json = Object.assign({}, JSON.parse(getState().views.byId[`generated-${id}`].canvas))
    generated_json.backgroundImage = {
      ...generated_json.backgroundImage,
      scaleX: 400 / moving_obj.width,
      scaleY: 400 / moving_obj.height
    }
    dispatch({
      type:  types.OBJECT_MOVING,
      id:    `generated-${id}`,
      canvas: JSON.stringify(generated_json)
    })
  }

 
  // debug canvas
  // console.log(canvas_json)

}

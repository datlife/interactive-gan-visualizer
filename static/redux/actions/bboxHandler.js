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
    // reference confirmSelectedObject in fabricCanvashandler
    let moving_obj = JSON.parse(getState().views.byId[id].canvas)['objects'][1]
    console.log("moving")
    // TODO: copy region iamge of fixed_obj int moving_obj
    // moving_obj ={...moving_obj,
    // }
        //generated canvas
    var generated_json = Object.assign({}, JSON.parse(getState().views.byId[`generated-${id}`].canvas))
    let generated_json = JSON.parse(getState().views.byId[`generated-${id}`].canvas)
    
    generated_json = {...generated_json,
      ['objects']: [moving_obj]
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

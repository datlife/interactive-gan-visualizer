import {combineReducers} from 'redux';
import dotProp from "dot-prop-immutable";
import * as types from '../constants';
import {fabric} from 'fabric';

export default combineReducers({byId: byId, allIds: allIds})

function byId(state = {}, action) {
  switch (action.type) {
    case types.CANVAS_INITIALIZE: return init(state, action)
    case types.CANVAS_REFRESH:
      // return dotProp.set(state, `byId[${action.id}].canvas`, state[action.id].renderAll());
      return state;

    case types.ADD_OBJECT:{
      // fabricObject.canvas.setActiveObject(obj); 
      return {
        ...state,
        [action.id]:{...state[action.id], canvas: state[action.id].canvas.add(action.object)}
      }
    }
    default:
      return state
  }
}

function allIds(state = [], action) {

  switch (action.type) {
    case types.CANVAS_INITIALIZE:
      return [
        ...state,
        action.id
      ]

    case types.DELETE_IMAGE:
      return state

    default:
      return state
  }
}

function init(state, action){
  let {id, background, canvas} = action;

  fabric.Image.fromURL(background, (background)=>{
    background.set({selectable: false, hasControls: false}); // not allow image to move
    canvas.add(background);
  }, {crossOrigin: 'anonymous'});

  return {
    ...state,[id]: 
    {
      id: id,
      canvas: canvas
    }
  }
}
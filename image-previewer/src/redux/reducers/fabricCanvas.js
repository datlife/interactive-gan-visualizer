import {combineReducers} from 'redux';
import dotProp from "dot-prop-immutable";
import * as types from '../constants';
import {fabric} from 'fabric';

export default combineReducers({byId: byId, allIds: allIds})

function byId(state = {}, action) {
  switch (action.type) {
    case types.CANVAS_INITIALIZE:{ return init(state, action);}
    case types.CANVAS_REFRESH:   { return state;}
    case types.ADD_OBJECT: {
      return {...state,
              [action.id]: 
                {...state[action.id], 
                 canvas: action.canvas
                }
              };
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
  let {id, canvas} = action;  
  return {
    ...state,[id]: 
    {...state[id],
      id: id,
      canvas: canvas
    }
  }
}
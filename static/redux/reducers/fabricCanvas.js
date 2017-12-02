import {combineReducers} from 'redux';
import dotProp from "dot-prop-immutable";
import * as types from '../constants';
import {fabric} from 'fabric';

export default combineReducers({byId: byId, allIds: allIds})

function byId(state = {}, action) {
  switch (action.type) {
    case types.INITIALIZE_CANVAS:
      {
        let {id, canvas} = action;
        return {
          ...state,
          [id]: {
            ...state[id],
            id: id,
            canvas: canvas,
            selected: null,   
          }
        }
      }
    case types.MODIFY_CANVAS:{
      let {id, canvas} = action;
      return {
        ...state,
        [id]:{
          ...state[id],
          canvas: canvas
        }
      }
    }  
    case types.DETECT_OBJECT:{
      let {id, canvas} = action;
      return {
        ...state,
        [id]:{
          ...state[id],
          canvas: canvas
        }
      }
    }   
    case types.ADD_OBJECT:{
      let {id, canvas} = action;
      return {
        ...state,
        [id]:{
          ...state[id],
          canvas: canvas
        }
      }
    }  

    case types.OBJECT_SELECTED:{
      let {id, object} = action;
      return {
        ...state,
        [id]:{
          ...state[id],
          selected: object
        }
      }
    }
    case types.OBJECT_MOVING:{
      let {id, canvas} = action;
      return {
        ...state,
        [id]:{
          ...state[id],
          canvas: canvas
        }
      }
    }
    case types.CONFIRM_SELECT:{
      let {id, canvas, confirmed} = action;
      return {
        ...state,
        [id]:{
          ...state[id],
          canvas: canvas,
          confirmed: true
        }
      }
    }
    case types.DELETE_IMAGE:
      {
        // desctructor using Spread Operator
        let {[action.id]: deleted, 
             [`generated-${action.id}`]: any, 
             [`debug-${action.id}`]: gone, ...new_state} = state;
        return new_state;
      }
    case types.CLEAR_CANVAS:
      {
        let {id, canvas} = action;
        return {
          ...state,
          [id]:{
            ...state[id],
            canvas: canvas,
            confirmed: false            
          }
        }      
      }
    default:
      return state
  }
}

function allIds(state = [], action) {
  switch (action.type) {
    case types.INITIALIZE_CANVAS:
      return [
        ...state,
        action.id
      ]
    case types.DELETE_IMAGE:
      {
        return state.filter(function(id){
          if ((id !== action.id) && 
              (id !== `generated-${action.id}`) &&
              (id !== `debug-${action.id}`) ){
            return true;            
          }
          return false;
        });
      }

    default:
      return state
  }
}
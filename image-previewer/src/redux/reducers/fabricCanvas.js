import {combineReducers} from 'redux';
import dotProp from "dot-prop-immutable";
import * as types from '../constants';
import {fabric} from 'fabric';

export default combineReducers({byId: byId, allIds: allIds})

function byId(state = {}, action) {
  switch (action.type) {
    case types.CANVAS_INITIALIZE:
      {
        let {id, canvas} = action;
        return {
          ...state,
          [id]: {
            ...state[id],
            id: id,
            canvas: canvas
          }
        }
      }
    case types.ADD_OBJECT:
      {
        let {id, canvas} = action;
        return {
          ...state,
          [id]: {
            ...state[id],
            canvas: canvas
          }
        };
      }
    case types.DELETE_IMAGE:
      {
        // desctructor using Spread Operator
        let {[action.id]: deleted, [`generated-${action.id}`]: any, ...new_state} = state;
        return new_state;
      }
    case types.CANVAS_REFRESH:
      {
        return state;
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
      {
        return state.filter(id => (id !== (action.id || id !== `generated-${action.id}`)))
      }

    default:
      return state
  }
}
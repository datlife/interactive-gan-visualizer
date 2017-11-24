import * as types from '../constants';
import {combineReducers} from 'redux';

export default combineReducers({
  byId: byId,
  allIds:allIds
});

// import { handleActions } from 'redux-actions';

// export default handleActions({
//   [types.ADD_OBJECT]: (state, action) =>({

//   }),
//   [types.OBJECT_SELECTED]: (state, action) => ({ ...state, ...action.payload.toJSON() }),
//   [types.OBJECT_MOVING]: (state, action) => ({ ...state, ...action.payload.toJSON() }),
//   [types.OBJECT_MODIFIED]: (state, action) => ({ ...state, ...action.payload.toJSON() }),
//   [types.OBJECT_SCALING]: (state, action) => ({ ...state, ...action.payload.toJSON() }),
//   [types.OBJECT_CLEARED]: () => initialState,
// }, initialState);

function byId(state = {}, action) {
  switch (action.type) {
    case types.UPLOAD_IMAGE: {
      // Initialize empty bounding boxes
      return action.new_images.reduce(function (state, image) {
        const img_id = image.preview.split("/").pop(); // get the last element of array
        return {
          ...state,
          [img_id]: {
            ...state[img_id],
            id: img_id,
            bboxes: [],
            active_bbox: 0
          }
        };
      }, state);
    }
    case types.ADD_OBJECT:{
        let {id, object} = action;
        const obj_id = state[id].bboxes.length + 1;
        return {
          ...state,
          [id]: {
            ...state[id],
            id:  id,
            bboxes: {...state[id].bboxes, [obj_id]: object}
          }
        };
      }

    case types.OBJECT_SELECTED:{
      return { ...state, ...action.payload.toJSON() }
    }
    case types.OBJECT_MOVING:{

    }
    case types.OBJECT_MODIFIED:{

    }
    case types.OBJECT_SCALING:{

    }
    case types.OBJECT_CLEARED:{

    }

    case types.DELETE_IMAGE:{
        // desctructor using Spread Operator
        let {[action.id]: deleted, ...new_state} = state;
        return new_state;
      }
    default:
      return state
  }
}

function allIds(state = [], action) {
  switch (action.type) {
    case types.UPLOAD_IMAGE:  {
      return action.new_images.reduce(function (state, image) {
        const img_id = image.preview.split("/").pop(); // get the last element of array
        return [
          ...state,
          img_id
        ]
      }, state);
    }
    case types.DELETE_IMAGE: return state.filter(id => (id !== action.id))

    default:
      return state
  }
}
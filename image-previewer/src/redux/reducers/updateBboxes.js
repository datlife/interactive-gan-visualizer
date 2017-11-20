import { handleActions } from 'redux-actions';
import * as types from '../constants';

const initialState = {
  byIds:{},
  allIds:[]
};

export default handleActions({
  [types.OBJECT_SELECTED]: (state, action) => ({ ...state, ...action.payload.toJSON() }),
  [types.OBJECT_MOVING]: (state, action) => ({ ...state, ...action.payload.toJSON() }),
  [types.OBJECT_MODIFIED]: (state, action) => ({ ...state, ...action.payload.toJSON() }),
  [types.OBJECT_SCALING]: (state, action) => ({ ...state, ...action.payload.toJSON() }),
  [types.OBJECT_CLEARED]: () => initialState,
}, initialState);

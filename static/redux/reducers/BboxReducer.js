import * as types from '../constants';
import {combineReducers} from 'redux';
import { handleActions } from 'redux-actions';

export default handleActions({
  [types.ADD_OBJECT]: (state, action) =>({}),
  [types.OBJECT_SELECTED]: (state, action) => ({ ...state, ...action.payload.toJSON() }),
  [types.OBJECT_MOVING]: (state, action) => ({ ...state, ...action.payload.toJSON() }),
  [types.OBJECT_MODIFIED]: (state, action) => ({ ...state, ...action.payload.toJSON() }),
  [types.OBJECT_SCALING]: (state, action) => ({ ...state, ...action.payload.toJSON() }),
  [types.OBJECT_CLEARED]: () => initialState,
}, initialState);

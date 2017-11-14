// Reducers
// ALl reducers have two arguments: states, actions
// Ref: https://hackernoon.com/redux-patterns-add-edit-remove-objects-in-an-array-6ee70cab2456

import * as types from '../constants';
import { handleActions } from 'redux-actions';

const initial_state = [];

export default handleActions({
    [types.UPLOAD_IMAGE]: (state, action) => state.concat(action.new_images),
    [types.DELETE_IMAGE]: (state, action) => state.filter((img, id) => id !== action.id),

}, initial_state);


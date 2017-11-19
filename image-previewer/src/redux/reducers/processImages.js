// Reducers
// ALl reducers have two arguments: states, actions
// Ref: https://hackernoon.com/redux-patterns-add-edit-remove-objects-in-an-array-6ee70cab2456

import * as types from '../constants';
import {combineReducers} from 'redux';

export default combineReducers({
    byId: byId,
    allIds: allIds
})

function byId(state = {}, action){
    let new_images = action.new_images;

    switch(action.type){
        case types.UPLOAD_IMAGE:{
            return new_images.reduce(function(state, image){
                const img_id = image.preview.split("/").pop(); // get the last element of array
                return {
                    ...state,
                    [img_id]:{ ...state[img_id],
                        id: img_id, 
                        original: image.preview,
                        generated: image.preview,
                        debug: image.preview,
                        bboxes: [],
                        isDebugging: false,  
                    }
                }
            }, {})

        }

        case types.DELETE_IMAGE: 
            return state

        default:
            return state
    }
}


function allIds(state=[], action){
    let new_images = action.new_images;
    
    switch(action.type){
        case types.UPLOAD_IMAGE:{
            return new_images.reduce(function(state, image){
                const img_id = image.preview.split("/").pop(); // get the last element of array                
                return [...state, img_id]}, {})
        }
        case types.DELETE_IMAGE: 
            return state

        default:
            return state
    }
}

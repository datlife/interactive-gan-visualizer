// Reducers
// ALl reducers have two arguments: states, actions
// Ref: https://hackernoon.com/redux-patterns-add-edit-remove-objects-in-an-array-6ee70cab2456

import {UPLOAD_IMAGE, DELETE_IMAGE} from './actions';

export function ImageReducer(state = [], action){
    if (action.type !== undefined) {
        switch(action.type){

            case UPLOAD_IMAGE:{
                console.log(action.images);
                return state.concat(action.images)
                
            }

            case DELETE_IMAGE:
            {
                // console.log(state);  
                // console.log(action);                
                
                // delete state.images[action.image_id] // delete the hash associated with the action.id
                // return {
                // images: state.images
                // }
                return state
            }
            default:
                return state
        }
    }  
    return state     
}




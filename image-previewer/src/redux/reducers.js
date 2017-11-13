// Reducers
// ALl reducers have two arguments: states, actions
// Ref: https://hackernoon.com/redux-patterns-add-edit-remove-objects-in-an-array-6ee70cab2456

import {UPLOAD_IMAGE, DELETE_IMAGE} from './actions';

export function ImageReducer(images = [], action){
    if (action.type !== undefined) {
        switch(action.type){
            case UPLOAD_IMAGE:{
                return images.concat(action.images)  
            }
            case DELETE_IMAGE:
            {
                console.log(action);
                return images.filter((img, id) => id !== action.id)
            }
            default:
                return images
        }
    }  
    return images   
}




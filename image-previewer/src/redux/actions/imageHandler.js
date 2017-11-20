import {UPLOAD_IMAGE, DELETE_IMAGE} from '../constants';

// Action Creators
export const uploadImage = (new_images)=> (dispatch, getState)  => {
    dispatch({
        type: UPLOAD_IMAGE, 
        new_images: new_images
    });
}

export const deleteImage = (id) => (dispatch, getState) =>{
    dispatch({
        type: DELETE_IMAGE, 
        id: id
    });
}

export const changeDebugMode =(id, debug)=> (dispatch, getState) => {   
    dispatch({
        type: 'TOGGLE_DEBUG', 
        id: id,
        debug:  !debug
    });
}
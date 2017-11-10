// Define actions
export const UPLOAD_IMAGE    = 'UPLOAD_IMG'
export const DELETE_IMAGE    = 'DELETE_IMG'

export const DETECT_OBJECT   = 'DRAG_OBJECT'
export const SELECT_OBJECT   = 'SELECT_OBJECT'
export const DRAG_OBJECT     = 'DRAG_OBJECT'

// Action Creators
// Def: an action creator need to create an action with a "type" and an "object"
export function uploadImage(images){
    console.log("New Images are uploaded." + images.length);
    return {
        type: UPLOAD_IMAGE,  
        images: images   
    }
}

export function deleteImage(image_id){
    return {
        type: DELETE_IMAGE,  
        image_id: image_id 
    }
}


// Define actions
const UPLOAD_IMAGE    = 'UPLOAD_IMG'
const DETECT_OBJECT   = 'DRAG_OBJECT'
const SELECT_OBJECT   = 'SELECT_OBJECT'
const DRAG_OBJECT     = 'DRAG_OBJECT'

// Action Creators
// Def: an action creator need to create an action with a "type" and an "object"
export function uploadImage(images){
    console.log("New Images are uploaded." + images.length);
    return {
        type: 'UPLOAD_IMAGE',  
        images: images   
    }
}


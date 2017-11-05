
// Define actions in image-previewer app
const UPLOAD_IMAGE  = 'UPLOAD_IMG'
const DRAG_OBJECT   = 'DRAG_OBJECT'
const SELECT_OBJECT = 'SELECT_OBJECT'

// Action Creators
function uploadImage(image){
    return {
        type: 'UPLOAD_IMAGE',
        image
    }
}
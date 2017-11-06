
// Define actions in image-previewer app
const UPLOAD_IMAGE  = 'UPLOAD_IMG'
const SELECT_OBJECT = 'SELECT_OBJECT'
const DRAG_OBJECT   = 'DRAG_OBJECT'

// Action Creators
function uploadImage(image){
    return {
        type: 'UPLOAD_IMAGE',
        image
    }
}
// Define actions
export const UPLOAD_IMAGE = 'UPLOAD_IMG'
export const DELETE_IMAGE = 'DELETE_IMG'

export const DETECT_OBJECT = 'DRAG_OBJECT'
export const SELECT_OBJECT = 'SELECT_OBJECT'
export const DRAG_OBJECT   = 'DRAG_OBJECT'

export const TOGGLE_DEBUG  = 'TOGGLE_DEBUG'

// Action Creators
export function uploadImage(images) {
    return {type: UPLOAD_IMAGE, images: images}
}

export function deleteImage(id) {
    return {type: DELETE_IMAGE, id: id}
}

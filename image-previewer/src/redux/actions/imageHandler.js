import {UPLOAD_IMAGE, DELETE_IMAGE} from '../constants';

// Action Creators
export function uploadImage(new_images) { return {type: UPLOAD_IMAGE, new_images: new_images}}
export function deleteImage(id)     { return {type: DELETE_IMAGE, id: id}}

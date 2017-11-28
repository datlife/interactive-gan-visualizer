import {UPLOAD_IMAGE, DELETE_IMAGE} from '../constants';
import * as API from '../../api/objectDetection';
import b64toBlob from 'b64-to-blob';
// Action Creators
export const uploadImage = (new_images) => (dispatch, getState) => {
  dispatch({
    type: UPLOAD_IMAGE, 
    new_images: new_images});
}

export const deleteImage = (id) => (dispatch, getState) => {
  dispatch({type: DELETE_IMAGE, id: id});
}

export const changeDebugMode = (id, current_debug_mode) => (dispatch, getState) => {
  const canvas = getState().views.byId[id].canvas;
  let result = API.update_debug(id, JSON.parse(canvas)["objects"])
  result.then(
    function(res){      
      var blob = b64toBlob(res.data, 'data:image/jpg;base64,');
      console.log(blob)
      var blobUrl = URL.createObjectURL(blob);
      console.log(blobUrl)
      dispatch({
        type: 'TOGGLE_DEBUG',
        id: id,
        debug: !current_debug_mode,
        mask: blobUrl,
      });
    })
};

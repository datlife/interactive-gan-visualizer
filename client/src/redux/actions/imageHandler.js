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

export const changeDebugMode = (id) => (dispatch, getState) => {
  const objects =  JSON.parse(getState().views.byId[id].canvas)["objects"];
  var bboxes = objects.map(function(box){
    return {
      top: box.top,
      left: box.left,
      width: box.width,
      height: box.height
    }
  })

  // @TODO: logiccccc
  let isDebugging = getState().images.byId[id].isDebugging
  let result = API.update_debug(id, bboxes)
  result.then(
    function(res){      
      var blob = b64toBlob(res.data, 'data:image/jpg;base64,');
      var blobUrl = URL.createObjectURL(blob);
      dispatch({
        type: 'TOGGLE_DEBUG',
        id: id,
        debug: !isDebugging,
        mask: blobUrl,
      });
    })
  
};
  // // Create obj mask in debug
  // let objects = JSON.parse(getState().views.byId[id].canvas)["objects"].map(function(obj){
  //   obj = {...obj,
  //     hasBorder: false,
  //     stroke: 'white',
  //     strokeWidth: 3,
  //     fill:'white'
  //   }
  //   return obj
  // })
  // dispatch({
  //   type: types.TOGGLE_DEBUG,
  //   id: id,
  //   debug: !current_debug_mode,
  //   mask: blobUrl,
  // });
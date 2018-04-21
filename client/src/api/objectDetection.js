import axios from 'axios';

export function detect_object(id, image_base64) {
  var formData = new FormData();
  formData.append("id", id);
  formData.append("image", image_base64);

  return axios
    .post('http://localhost:5000/detect/', formData, {
      headers: {'Content-Type': 'multipart/form-data'}
    })
    .then(function (response) { //onfullfilled()
      return response; 
    })
    .catch(function (error) {
      console.log(error);
    });
}


export function update_debug(id, bboxes) {
  var formData = new FormData();
  formData.append("id", id);
  formData.append("bboxes", JSON.stringify(bboxes));

  return axios
    .post('http://localhost:5000/debug/', formData, {
      headers: {'Content-Type': 'multipart/form-data'}
    })
    .then(function (response) { //onfullfilled()
      return response; 
    })
    .catch(function (error) {
      console.log(error);
    });
}

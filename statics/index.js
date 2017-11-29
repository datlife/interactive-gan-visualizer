// This file will combines all react components + redux store + CSS
// in order to generate necessary scripts to build the web app
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import configureStore from './redux/store';
import {Provider} from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import * as types from './redux/constants';
import dataURItoBlob from './utils';

const store = configureStore({});

// Intialize an example - I know it is long and ugly:(
var img = new Image();
img.src = 'assets/car2.jpg';
img.onload = function () {
	var canvas = document.createElement('canvas'), context = canvas.getContext('2d');
	canvas.width = img.width; canvas.height = img.height;
	context.drawImage(img, 0, 0, img.width, img.height);
    var blob = dataURItoBlob(canvas.toDataURL('image/png'))
    var image = new File([blob], 'car2.jpg', {type: "image/jpeg"})
    image['preview'] =URL.createObjectURL(blob)
    store.dispatch({
        type: types.UPLOAD_IMAGE, 
        new_images: [image]});
};


ReactDOM.render(
   <Provider store={store}>
      <App />
   </Provider>,
    document.getElementById('root')
);

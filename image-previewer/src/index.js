// This file will combines all react components + redux store + CSS
// in order to generate necessary scripts to build the web app
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import {Provider} from 'react-redux';

import configureStore from './redux/store';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import  './styles/main.css';

const store = configureStore({});

ReactDOM.render(
   <Provider store={store}>
      <App />
   </Provider>,
    document.getElementById('root')
);
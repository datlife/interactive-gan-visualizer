// This file will combines all react components + redux store + CSS
// in order to generate necessary scripts to build the web app

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from './App';
import Store from './redux/store';

import  './styles/main.css';

ReactDOM.render(
   <Provider store={Store}>
      <App />
   </Provider>,
    document.getElementById('root')
);

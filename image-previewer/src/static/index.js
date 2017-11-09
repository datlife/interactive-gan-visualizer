// import style
import  './styles/main.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import {Provider} from 'react-redux';
import Store from './store';

ReactDOM.render(
   <Provider store={Store}>
      <App />
   </Provider>,
    document.getElementById('root')
);
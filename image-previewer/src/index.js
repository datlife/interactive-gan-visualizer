// This file will combines all react components + redux store + CSS
// in order to generate necessary scripts to build the web app
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import configureStore from './redux/store';
import {Provider} from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';


const store = configureStore({});

ReactDOM.render(
   <Provider store={store}>
      <App />
   </Provider>,
    document.getElementById('root')
);
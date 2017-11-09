// import {createStore, applyMiddleware} from 'redux';
import { createStore } from 'redux'
import rootReducer from './redux/index';

// const Store = applyMiddleware()(createStore());
const Store = createStore(rootReducer);

export default Store;
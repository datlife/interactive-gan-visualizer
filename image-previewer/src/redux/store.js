import {combineReducers, createStore} from 'redux';
import {ImageReducer} from './reducers';
// import {routerReducer} from 'react-router-redux';

const initial_state ={
    images: [{name: 'car-2.jpg', 
              preview: require("../../assets/car-2.jpg")}] // Example 
}

const rootReducer = combineReducers({
    images: ImageReducer
});

const Store = createStore(rootReducer, initial_state);

export default Store;
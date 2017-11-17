import {handleActions} from 'redux-actions';
import dotProp from "dot-prop-immutable";
import * as types from '../constants';

const initial_canvas_state = {
    byId: {},
    allIds: []
};

export default handleActions({
    [types.CANVAS_INITIALIZE]: (state, action) => initialize(state, action),
    [types.CANVAS_REFRESH]:    (state, action) => (state.map(obj =>(obj.id == action.id) ? obj.canvas.renderAll() : null)),
    [types.ADD_OBJECT]:        (state, action) => state
}, initial_canvas_state);


function initialize(state, action){
    let {canvas, id} = action;
    
    const updatedWithCanvasTable = dotProp.set(
        state,
        `byId.${id}`,
        {id: id, canvas: canvas}
    );

    const updatedWithCanvasList = dotProp.set(
        updatedWithCanvasTable,
        `allIds`,
        allIds => allIds.concat(id)
    );
    
    // Inser new canvas into lookup table
    return updatedWithCanvasList
}

// Reducers
// ALl reducers have two arguments: states, actions
function ImageReducer(state = [], action){
    switch(action.type){
        case 'UPLOAD_IMAGE':
            return action.images
        default:
            return state
    }
}

export default ImageReducer;
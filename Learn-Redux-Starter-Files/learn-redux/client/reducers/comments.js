// a reducer takes in two things

// Input:
//    1. an action - info about what happened
//    2. states    - copy of current states
// Return : 
//   updated states

function comments(state = [], action){
    switch(action.type){
        case 'ADD_COMMENTS':
            //return updated state
        case 'REMOVE_COMMENTS':
            
        default:
            return state
    }
    return state;
}

export default comments;
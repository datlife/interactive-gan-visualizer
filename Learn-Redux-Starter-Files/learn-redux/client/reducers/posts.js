// a reducer takes in two things

// Input:
//    1. an action - info about what happened
//    2. states    - copy of current states
// Return : 
//   updated states

function posts(state = [], action){
    switch(action.type){
        case 'INCREMENT_LIKES':
            //return updated state
            console.log("Increment likes");
            const i = action.index;
            return [...state.slice(0,i), //before one we updated
                    {...state[i], likes: state[i].likes + 1},
                    ...state.slice(i+1), //after
                   ]
        default:
            return state
    }
}

export default posts;
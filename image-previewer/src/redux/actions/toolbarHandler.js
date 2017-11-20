import {TOGGLE_DEBUG} from '../constants';

// Action Creators
export function toggleDebug(id, debug) { 
    return {
        type: TOGGLE_DEBUG, 
        id: id,
        isDebugging: debug
}}

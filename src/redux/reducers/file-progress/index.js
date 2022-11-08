/* eslint-disable no-case-declarations */

import { FILE_PROGRESS, GET_PROGRESS, POST_PROGRESS } from "../../action-types";

// **  Initial State
const initialState = {
    progressValue: 0,
    getProgressValue: 0,
    postProgressValue: 0
};

const fileProgress = ( state = initialState, action ) => {
    switch ( action.type ) {
        case FILE_PROGRESS:
            return { ...state, progressValue: action.progressValue };
        case GET_PROGRESS:
            return { ...state, getProgressValue: action.getProgressValue };
        case POST_PROGRESS:
            return { ...state, postProgressValue: action.postProgressValue };
        default:
            return state;
    }
};

export default fileProgress;

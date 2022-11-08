import { FILE_PROGRESS, GET_PROGRESS, POST_PROGRESS } from "../../action-types";

export const fileProgressAction = value => dispatch => {
    dispatch( {
        type: FILE_PROGRESS,
        progressValue: value
    } );
};
export const getProgressAction = value => dispatch => {
    dispatch( {
        type: GET_PROGRESS,
        getProgressValue: value
    } );
};
export const postProgressAction = value => dispatch => {
    dispatch( {
        type: POST_PROGRESS,
        postProgressValue: value
    } );
};
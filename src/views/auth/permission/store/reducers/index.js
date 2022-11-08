import { BIND_PERMISSION, CLEAR_PERMISSION_ALL_STATE, GET_PERMISSIONS } from '../action-types';

const initialState = {
    permissions: [],
    authPermissions: []

};


const permissionReducers = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_PERMISSIONS:
            return {
                ...state,
                permissions: action.permissions,
                authPermissions: action.authPermissions
            };

        case BIND_PERMISSION:
            return { ...state, permissions: action.permissions };

        case CLEAR_PERMISSION_ALL_STATE:
            return {
                ...state,
                permissions: [],
                authPermissions: []

            };

        default:
            return state;
    }
};
export default permissionReducers;

import { userModel } from '../../model';
import { BIND_USER_BASIC_INFO, CLEAR_USER_ALL_STATE, GET_USERS_BY_QUERY, GET_USER_BY_ID, GET_USER_DROPDOWN, IS_USER_ADD_FORM_SIDEBAR_OPEN, IS_USER_DATA_LOADED, IS_USER_DATA_PROGRESS, IS_USER_DATA_SUBMIT_PROGRESS, IS_USER_EDIT_FORM_SIDEBAR_OPEN } from '../action-types';

const initialState = {
    users: [],
    queryData: [],
    queryObj: [],
    total: 1,
    params: {},
    userBasicInfo: userModel,
    isUserDataLoaded: false,
    isUserDataProgress: false,
    isUserDataSubmitProgress: false,
    userAddFormSidebarOpen: false,
    userEditFormSidebarOpen: false,
    userDropdown: [],
    isUserDropdownLoaded: true

};


const userReducers = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_USER_BY_ID:
            return { ...state, userBasicInfo: action.userBasicInfo };
        case GET_USERS_BY_QUERY:
            return {
                ...state,
                queryData: action.users,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case IS_USER_DATA_LOADED:
            return {
                ...state,
                isUserDataLoaded: action.isUserDataLoaded
            };
        case GET_USER_DROPDOWN:
            return {
                ...state,
                userDropdown: action.userDropdown,
                isUserDropdownLoaded: action.isUserDropdownLoaded
            };

        case IS_USER_DATA_PROGRESS:
            return {
                ...state,
                isUserDataProgress: action.isUserDataProgress
            };
        case IS_USER_DATA_SUBMIT_PROGRESS:
            return {
                ...state,
                isUserDataSubmitProgress: action.isUserDataSubmitProgress
            };
        case BIND_USER_BASIC_INFO:
            return {
                ...state,
                userBasicInfo: action.userBasicInfo
            };

        case IS_USER_ADD_FORM_SIDEBAR_OPEN:
            return {
                ...state,
                userAddFormSidebarOpen: action.userAddFormSidebarOpen
            };
        case IS_USER_EDIT_FORM_SIDEBAR_OPEN:
            return {
                ...state,
                userEditFormSidebarOpen: action.userEditFormSidebarOpen
            };
        case CLEAR_USER_ALL_STATE:
            return {
                ...state,
                users: [],
                queryData: [],
                queryObj: [],
                total: 1,
                params: {},
                userBasicInfo: userModel,
                isUserDataLoaded: false,
                userAddFormSidebarOpen: false,
                userEditFormSidebarOpen: false
            };

        default:
            return state;
    }
};
export default userReducers;

import { roleModel } from '../../model';
import { BIND_ROLE_BASIC_INFO, BIND_ROLE_PERMISSIONS, CLEAR_ROLE_ALL_STATE, GET_ROLES_BY_QUERY, GET_ROLES_DROPDOWN, GET_ROLE_BY_ID, GET_ROLE_PERMISSIONS_BY_ROLE_ID, IS_ROLE_ADD_FORM_SIDEBAR_OPEN, IS_ROLE_DATA_LOADED, IS_ROLE_DATA_PROGRESS, IS_ROLE_DATA_SUBMIT_PROGRESS, IS_ROLE_EDIT_FORM_SIDEBAR_OPEN, IS_ROLE_PERMISSION_MODAL_OPEN } from '../action-types';

const initialState = {
    roles: [],
    queryData: [],
    queryObj: [],
    total: 1,
    params: {},
    roleBasicInfo: roleModel,
    isRoleDataLoaded: false,
    isRoleDataProgress: false,
    isRoleDataSubmitProgress: false,
    roleAddFormSidebarOpen: false,
    roleEditFormSidebarOpen: false,
    rolePermissionModalOpen: false,
    rolePermissions: [],
    role: '',
    roleDropdown: [],
    isRoleDropdownLoaded: true
};


const roleReducers = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_ROLE_BY_ID:
            return { ...state, roleBasicInfo: action.roleBasicInfo };
        case GET_ROLES_BY_QUERY:
            return {
                ...state,
                queryData: action.roles,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case IS_ROLE_DATA_LOADED:
            return {
                ...state,
                isRoleDataLoaded: action.isRoleDataLoaded
            };
        case IS_ROLE_DATA_PROGRESS:
            return {
                ...state,
                isRoleDataProgress: action.isRoleDataProgress
            };
        case IS_ROLE_DATA_SUBMIT_PROGRESS:
            return {
                ...state,
                isRoleDataSubmitProgress: action.isRoleDataSubmitProgress
            };
        case IS_ROLE_ADD_FORM_SIDEBAR_OPEN:
            return {
                ...state,
                roleAddFormSidebarOpen: action.roleAddFormSidebarOpen
            };
        case IS_ROLE_EDIT_FORM_SIDEBAR_OPEN:
            return {
                ...state,
                roleEditFormSidebarOpen: action.roleEditFormSidebarOpen
            };
        case IS_ROLE_PERMISSION_MODAL_OPEN:
            return {
                ...state,
                rolePermissionModalOpen: action.rolePermissionModalOpen
            };

        case BIND_ROLE_BASIC_INFO:
            return {
                ...state,
                roleBasicInfo: action.roleBasicInfo
            };
        case GET_ROLE_PERMISSIONS_BY_ROLE_ID:
            return {
                ...state,
                rolePermissions: action.rolePermissions,
                role: action.role
            };
        case GET_ROLES_DROPDOWN:
            return {
                ...state,
                roleDropdown: action.roleDropdown,
                isRoleDropdownLoaded: action.isRoleDropdownLoaded
            };
        case BIND_ROLE_PERMISSIONS:
            return {
                ...state,
                rolePermissions: action.rolePermissions
            };
        case CLEAR_ROLE_ALL_STATE:
            return {
                ...state,
                roles: [],
                queryData: [],
                queryObj: [],
                total: 1,
                params: {},
                roleBasicInfo: roleModel,
                isRoleDataLoaded: false,
                roleAddFormSidebarOpen: false,
                roleEditFormSidebarOpen: false
            };

        default:
            return state;
    }
};
export default roleReducers;

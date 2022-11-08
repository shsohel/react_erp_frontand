import { notify } from '@custom/notifications';
import { baseAxios } from '@services';
import { getAuthUserPermission } from '../../../../../redux/actions/auth';
import { userManagementApi } from "../../../../../services/api-end-points/user-management";
import { confirmDialog } from '../../../../../utility/custom/ConfirmDialog';
import { confirmObj, status } from "../../../../../utility/enums";
import { convertQueryString } from "../../../../../utility/Utils";
import { getAppPermissions } from '../../../permission/store/actions';
import { roleModel } from '../../model';
import { BIND_ROLE_BASIC_INFO, BIND_ROLE_PERMISSIONS, CLEAR_ROLE_ALL_STATE, GET_ROLES_BY_QUERY, GET_ROLES_DROPDOWN, GET_ROLE_BY_ID, GET_ROLE_PERMISSIONS_BY_ROLE_ID, IS_ROLE_ADD_FORM_SIDEBAR_OPEN, IS_ROLE_DATA_LOADED, IS_ROLE_DATA_PROGRESS, IS_ROLE_DATA_SUBMIT_PROGRESS, IS_ROLE_EDIT_FORM_SIDEBAR_OPEN, IS_ROLE_PERMISSION_MODAL_OPEN } from "../action-types";


export const isRoleDataLoaded = ( condition ) => dispatch => {
    dispatch( {
        type: IS_ROLE_DATA_LOADED,
        isRoleDataLoaded: condition
    } );
};

export const roleDataProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_ROLE_DATA_PROGRESS,
        isRoleDataProgress: condition
    } );
};
export const roleDataSubmitProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_ROLE_DATA_SUBMIT_PROGRESS,
        isRoleDataSubmitProgress: condition
    } );
};


export const openRoleAddFormSidebar = ( condition ) => dispatch => {
    console.log( condition );
    dispatch( {
        type: IS_ROLE_ADD_FORM_SIDEBAR_OPEN,
        roleAddFormSidebarOpen: condition
    } );
};


export const openRoleEditFormSidebar = ( condition ) => dispatch => {
    dispatch( {
        type: IS_ROLE_EDIT_FORM_SIDEBAR_OPEN,
        roleEditFormSidebarOpen: condition
    } );
};
export const openRolePermissionModal = ( condition ) => dispatch => {
    dispatch( {
        type: IS_ROLE_PERMISSION_MODAL_OPEN,
        rolePermissionModalOpen: condition
    } );
};

export const bindRolePermissions = ( rolePermissions ) => dispatch => {
    dispatch( {
        type: BIND_ROLE_PERMISSIONS,
        rolePermissions
    } );
};

export const bindRoleBasicInfo = ( roleBasicInfo ) => dispatch => {
    if ( roleBasicInfo ) {
        dispatch( {
            type: BIND_ROLE_BASIC_INFO,
            roleBasicInfo
        } );
    } else {
        dispatch( {
            type: BIND_ROLE_BASIC_INFO,
            roleBasicInfo: roleModel
        } );
    }
};

//Get Data by Query
export const getRolesByQuery = ( params, queryData ) => async dispatch => {
    dispatch( isRoleDataLoaded( false ) );
    const apiEndPont = `${userManagementApi.role.root}/grid?${convertQueryString( params )}`;
    await baseAxios.post( apiEndPont, queryData ).then( response => {
        console.log( response );

        if ( response.status === status.success ) {
            dispatch( {
                type: GET_ROLES_BY_QUERY,
                roles: response?.data.data,
                totalPages: response?.data.totalRecords,
                params,
                queryObj: queryData
            } );
        }
        dispatch( isRoleDataLoaded( true ) );

    } ).catch( ( { response } ) => {
        dispatch( isRoleDataLoaded( true ) );
        if ( response?.status === status?.badRequest || response?.status === status?.severError ) {
            notify( 'error', 'Please contact the support team.' );
        }
    } );
};
export const getRoleDropdown = () => async dispatch => {
    dispatch( {
        type: GET_ROLES_DROPDOWN,
        roleDropdown: [],
        isRoleDropdownLoaded: false
    } );
    const apiEndPont = `${userManagementApi.role.root}`;
    await baseAxios.get( apiEndPont ).then( response => {
        if ( response.status === status.success ) {
            const roleDropdown = response?.data?.data?.map( role => ( {
                value: role.id,
                label: role.name
            } ) );
            dispatch( {
                type: GET_ROLES_DROPDOWN,
                roleDropdown,
                isRoleDropdownLoaded: true
            } );
        }
    } ).catch( ( { response } ) => {
        dispatch( {
            type: GET_ROLES_DROPDOWN,
            roleDropdown: [],
            isRoleDropdownLoaded: true
        } );
        if ( response.status === status.severError ) {
            notify( 'error', `Please contact the support team!!!` );
        }
    } );
};

export const addRole = ( role ) => async ( dispatch, getState ) => {
    dispatch( roleDataSubmitProgress( true ) );
    const apiEndPont = `${userManagementApi.role.root}`;
    await baseAxios
        .post( apiEndPont, role )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().roles;
                notify( 'success', 'The Role has been added Successfully!' );
                dispatch( getRolesByQuery( params, queryObj ) );
                dispatch( openRoleAddFormSidebar( false ) );
                dispatch( roleDataSubmitProgress( false ) );

            } else {
                notify( 'error', 'The Role has been added Failed!' );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( roleDataSubmitProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors?.join( ', ' )}` );
            }
        } );
};

export const updateRole = ( role, roleId ) => async ( dispatch, getState ) => {
    dispatch( roleDataSubmitProgress( true ) );
    const apiEndPont = `${userManagementApi.role.root}/${roleId}`;
    await baseAxios
        .put( apiEndPont, role )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().roles;
                notify( 'success', 'The Role has been added Successfully!' );
                dispatch( getRolesByQuery( params, queryObj ) );
                dispatch( openRoleEditFormSidebar( false ) );
                dispatch( roleDataSubmitProgress( false ) );

            } else {
                notify( 'error', 'The Role has been added Failed!' );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( roleDataSubmitProgress( true ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors?.join( ', ' )}` );
            }
        } );
};


export const getRoleById = ( roleId ) => async dispatch => {
    dispatch( roleDataProgress( true ) );
    const apiEndPont = `${userManagementApi.role.root}/${roleId}`;
    await baseAxios.get( apiEndPont ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: GET_ROLE_BY_ID,
                roleBasicInfo: response.data
            } );
            dispatch( openRoleEditFormSidebar( true ) );
            dispatch( roleDataProgress( false ) );

        } else {
            notify( 'waring', 'Something gone wrong!!!' );
        }
    } ).catch( ( { response } ) => {
        dispatch( roleDataProgress( false ) );
        if ( response.status === status.severError ) {
            notify( 'error', `Please contact the support team!!!` );
        } else {
            notify( 'warning', `${response.data.errors?.join( ', ' )}` );
        }
    } );

};
export const deleteRole = ( role ) => ( dispatch, getState ) => {

    const apiEndPont = `${userManagementApi.role.root}/${role.id}`;
    confirmDialog( { ...confirmObj, text: `<h4 class="text-primary mb-0">${role.name}</h4> <br/> <span>You won't be able to revert this!</span>` } ).then( async e => {
        if ( e.isConfirmed ) {
            dispatch( roleDataProgress( true ) );

            await baseAxios.delete( apiEndPont ).then( response => {
                if ( response.status === status.success ) {
                    notify( 'success', 'The Role has been deleted Successfully!' );
                    const { params, queryObj } = getState().roles;
                    dispatch( getRolesByQuery( params, queryObj ) );
                    dispatch( roleDataProgress( false ) );

                } else {
                    notify( 'waring', 'Something gone wrong!!!' );
                }
            } ).catch( ( { response } ) => {
                dispatch( roleDataProgress( false ) );
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'warning', `${response.data.errors?.join( ', ' )}` );
                }
            } );
        }
    } );

};


export const getRolePermissionByRoleId = ( role ) => async dispatch => {
    dispatch( roleDataProgress( true ) );
    const apiEndPont = `${userManagementApi.role.root}/${role.id}/permissions`;
    await baseAxios.get( apiEndPont ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: GET_ROLE_PERMISSIONS_BY_ROLE_ID,
                rolePermissions: response.data,

                role
            } );
            dispatch( openRolePermissionModal( true ) );
            dispatch( getAppPermissions() );
            dispatch( roleDataProgress( false ) );
        } else {
            notify( 'waring', 'Something gone wrong!!!' );
        }
    } ).catch( ( { response } ) => {
        dispatch( roleDataProgress( false ) );
        if ( response.status === status.severError ) {
            notify( 'error', `Please contact the support team!!!` );
        } else {
            notify( 'warning', `${response?.data.errors?.join( ', ' )}` );
        }
    } );
};

export const assignRolePermissions = ( roleId, permissions ) => async dispatch => {
    dispatch( roleDataSubmitProgress( true ) );

    const apiEndPont = `${userManagementApi.role.root}/${roleId}/permissions`;
    await baseAxios
        .put( apiEndPont, permissions )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', 'The Role Permission has been assigned Successfully!' );
                dispatch( openRolePermissionModal( false ) );
                dispatch( getAuthUserPermission() );
                // dispatch( bindNavigation() );
                dispatch( roleDataSubmitProgress( false ) );


            } else {
                notify( 'error', 'The Role Permissions has been assigned Failed!' );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( roleDataSubmitProgress( false ) );

            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors?.join( ', ' )}` );
            }
        } );
};

export const clearRoleAllState = () => dispatch => {
    dispatch( {
        type: CLEAR_ROLE_ALL_STATE
    } );
};

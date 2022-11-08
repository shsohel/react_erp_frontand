import { notify } from '@custom/notifications';
import { baseAxios } from '@services';
import { userManagementApi } from "../../../../../services/api-end-points/user-management";
import { confirmDialog } from '../../../../../utility/custom/ConfirmDialog';
import { baseUrl, confirmObj, status } from "../../../../../utility/enums";
import { convertQueryString } from "../../../../../utility/Utils";
import { userModel } from '../../model';
import { BIND_USER_BASIC_INFO, CLEAR_USER_ALL_STATE, GET_USERS_BY_QUERY, GET_USER_BY_ID, GET_USER_DROPDOWN, IS_USER_ADD_FORM_SIDEBAR_OPEN, IS_USER_DATA_LOADED, IS_USER_DATA_PROGRESS, IS_USER_DATA_SUBMIT_PROGRESS, IS_USER_EDIT_FORM_SIDEBAR_OPEN } from "../action-types";


export const isUserDataLoaded = ( condition ) => dispatch => {
    dispatch( {
        type: IS_USER_DATA_LOADED,
        isUserDataLoaded: condition
    } );
};

export const userDataProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_USER_DATA_PROGRESS,
        isUserDataProgress: condition
    } );
};
export const userDataSubmitProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_USER_DATA_SUBMIT_PROGRESS,
        isUserDataSubmitProgress: condition
    } );
};

export const isUserPhotoUploaded = ( condition ) => dispatch => {
    dispatch( {
        type: IS_USER_DATA_LOADED,
        isUserDataLoaded: condition
    } );
};


export const openUserAddFormSidebar = ( condition ) => dispatch => {
    console.log( condition );
    dispatch( {
        type: IS_USER_ADD_FORM_SIDEBAR_OPEN,
        userAddFormSidebarOpen: condition
    } );
};


export const openUserEditFormSidebar = ( condition ) => dispatch => {
    dispatch( {
        type: IS_USER_EDIT_FORM_SIDEBAR_OPEN,
        userEditFormSidebarOpen: condition
    } );
};


export const bindUserBasicInfo = ( userBasicInfo ) => dispatch => {
    if ( userBasicInfo ) {
        dispatch( {
            type: BIND_USER_BASIC_INFO,
            userBasicInfo
        } );
    } else {
        dispatch( {
            type: BIND_USER_BASIC_INFO,
            userBasicInfo: userModel
        } );
    }
};


export const userImageUpload = ( file, formData ) => async ( dispatch, getState ) => {
    dispatch( isUserPhotoUploaded( false ) );
    const path = `/api/userAccess/medias/upload/image`;
    // const apiEndPoint = `${merchandisingApi.buyer.root}/uploadImage`;
    await baseAxios.post( path, formData )
        .then( response => {
            console.log( response );
            if ( response.status === status.success ) {
                const { userBasicInfo } = getState().users;
                const updatedObj = {
                    ...userBasicInfo,
                    avatarUrl: URL.createObjectURL( file ),
                    avatar: response.data
                };
                console.log( updatedObj );
                dispatch( bindUserBasicInfo( updatedObj ) );

                dispatch( isUserPhotoUploaded( true ) );
            }
        } ).catch( ( { response } ) => {
            // if ( response.status === status.severError ) {
            //     notify( 'error', `Please contact the support team!!!` );
            // } else {
            //     notify( 'error', `${response.data.errors.join( ', ' )}` );
            // }
            dispatch( isUserPhotoUploaded( true ) );
        } );
};


//Get Data by Query
export const getUsersByQuery = ( params, queryData ) => async dispatch => {
    dispatch( isUserDataLoaded( false ) );
    const apiEndPont = `${userManagementApi.user.root}/grid?${convertQueryString( params )}`;
    await baseAxios.post( apiEndPont, queryData ).then( response => {

        if ( response.status === status.success ) {
            dispatch( {
                type: GET_USERS_BY_QUERY,
                users: response?.data.data,
                totalPages: response?.data.totalRecords,
                params,
                queryObj: queryData
            } );
        }
        dispatch( isUserDataLoaded( true ) );

    } ).catch( ( { response } ) => {
        dispatch( isUserDataLoaded( true ) );
        if ( response.status === status.badRequest || response.status === status.severError ) {
            notify( 'error', 'Please contact the support team.' );
        }
    } );
};
export const getUserDropdown = () => async dispatch => {
    dispatch( {
        type: GET_USER_DROPDOWN,
        userDropdown: [],
        isUserDropdownLoaded: false
    } );
    const apiEndPont = `${userManagementApi.user.root}`;

    await baseAxios.get( apiEndPont ).then( response => {
        if ( response.status === status.success ) {
            const userDropdown = response?.data.data?.map( user => (
                {
                    label: user.name,
                    value: user.id
                }
            ) );
            dispatch( {
                type: GET_USER_DROPDOWN,
                userDropdown,
                isUserDropdownLoaded: true
            } );
        }
    } ).catch( ( { response } ) => {
        dispatch( {
            type: GET_USER_DROPDOWN,
            userDropdown: [],
            isUserDropdownLoaded: true
        } );
        if ( response.status === status.badRequest || response.status === status.severError ) {
            notify( 'error', 'Please contact the support team.' );
        }
    } );
};

export const addUser = ( user ) => async ( dispatch, getState ) => {
    dispatch( userDataSubmitProgress( true ) );
    const apiEndPont = `${userManagementApi.root}/UserRegistrations`;
    await baseAxios
        .post( apiEndPont, user )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().users;
                notify( 'success', 'The User has been added Successfully!' );
                dispatch( getUsersByQuery( params, queryObj ) );
                dispatch( openUserAddFormSidebar( false ) );
                dispatch( userDataSubmitProgress( false ) );

            } else {
                notify( 'error', 'The User has been added Failed!' );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( userDataSubmitProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else if ( response.status === status.conflict ) {
                notify( 'warning', `${response.data.detail}` );
            } else {
                notify( 'warning', `${response.data.errors?.join( ', ' )}` );
            }
        } );
};
export const updateUser = ( user ) => async ( dispatch, getState ) => {
    dispatch( userDataSubmitProgress( true ) );
    const apiEndPont = `${userManagementApi.user.root}/${user?.id}`;
    await baseAxios
        .put( apiEndPont, user )
        .then( response => {
            if ( response.status === status.success ) {
                const { params, queryObj } = getState().users;
                notify( 'success', 'The user has been updated Successfully!' );
                dispatch( getUsersByQuery( params, [], queryObj ) );
                dispatch( openUserEditFormSidebar( false ) );
                dispatch( userDataSubmitProgress( false ) );

            } else {
                notify( 'error', 'The user update process has been Failed!' );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( userDataSubmitProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors?.join( ', ' )}` );
            }
        } );
};

export const getUserById = ( userId ) => async dispatch => {
    dispatch( userDataProgress( true ) );

    const apiEndPont = `${userManagementApi.user.root}/${userId}`;
    await baseAxios.get( apiEndPont ).then( response => {
        if ( response.status === status.success ) {
            const { data } = response;
            const user = {
                ...data,
                contactNumber: data.contactNumber ?? '',
                avatarUrl: data?.imageUrl ? `${baseUrl}/${data.imageUrl}` : '',
                roles: data?.roles.map( role => ( {
                    value: role.id,
                    label: role.name
                } ) ),
                permissibleProcesses: data?.permissibleProcesses ? data.permissibleProcesses.map( p => ( { value: p, label: p } ) ) : []
            };
            dispatch( {
                type: GET_USER_BY_ID,
                userBasicInfo: user
            } );
            dispatch( openUserEditFormSidebar( true ) );
            dispatch( userDataProgress( false ) );

        } else {
            notify( 'waring', 'Something gone wrong!!!' );
        }
    } ).catch( ( { response } ) => {
        dispatch( userDataProgress( false ) );

        if ( response.status === status.severError || response.status === status.methodNotAllow ) {
            notify( 'error', `Please contact the support team!!!` );
        } else {
            notify( 'warning', `${response.data.errors?.join( ', ' )}` );
        }
    } );

};

export const deleteUser = ( user ) => ( dispatch, getState ) => {
    const apiEndPont = `${userManagementApi.user.root}/${user.id}/archive`;
    confirmDialog( { ...confirmObj, text: `<h4 class="text-primary mb-0">${user.name}</h4> <br/> <span>You can retrieve again from archive list!</span>` } ).then( async e => {
        if ( e.isConfirmed ) {
            dispatch( userDataProgress( true ) );

            await baseAxios.put( apiEndPont ).then( response => {
                if ( response.status === status.success ) {
                    notify( 'success', 'The User has been deleted Successfully!' );
                    const { params, queryObj } = getState().users;
                    dispatch( getUsersByQuery( params, queryObj ) );
                    dispatch( userDataProgress( false ) );

                } else {
                    notify( 'waring', 'Something gone wrong!!!' );
                }
            } ).catch( ( { response } ) => {
                dispatch( userDataProgress( false ) );
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'warning', `${response.data.errors?.join( ', ' )}` );
                }
            } );
        }
    } );

};

export const retrieveUser = ( user ) => ( dispatch, getState ) => {
    const apiEndPont = `${userManagementApi.user.root}/${user.id}/reActive`;
    confirmDialog( { ...confirmObj, text: `<h4 class="text-primary mb-0">${user.name}</h4> <br/> <span>it will be available in active list!</span>` } ).then( async e => {
        if ( e.isConfirmed ) {
            dispatch( userDataProgress( true ) );

            await baseAxios.put( apiEndPont ).then( response => {
                if ( response.status === status.success ) {
                    notify( 'success', 'The User has been retrieved Successfully!' );
                    const { params, queryObj } = getState().users;
                    dispatch( getUsersByQuery( params, queryObj ) );
                    dispatch( userDataProgress( false ) );

                } else {
                    notify( 'waring', 'Something gone wrong!!!' );
                }
            } ).catch( ( { response } ) => {
                dispatch( userDataProgress( false ) );
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'warning', `${response.data.errors?.join( ', ' )}` );
                }
            } );
        }
    } );
};


export const clearUserAllState = () => dispatch => {
    dispatch( {
        type: CLEAR_USER_ALL_STATE
    } );
};

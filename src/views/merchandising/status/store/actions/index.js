import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { confirmObj, status } from "../../../../../utility/enums";
import { convertQueryString } from "../../../../../utility/Utils";
import { ADD_STATUS, DELETE_STATUS, DELETE_STATUSES_BY_RANGE, DROP_DOWN_STATUSES, GET_STATUSES, GET_STATUSES_BY_QUERY, GET_STATUS_BY_ID, GET_STATUS_TYPES, OPEN_STATUS_SIDEBAR, OPEN_STATUS_SIDEBAR_FOR_EDIT, ORDER_STATUS_DROPDOWN, SELECTED_STATUS_NULL, STYLE_STATUS_DROPDOWN, UPDATE_STATUS } from '../actionTypes';


//Get All Color without Query
export const getAllStatuses = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.status.root}` ).then( response => {
            dispatch( {
                type: GET_STATUSES,
                statuses: response.data
            } );
        } );
    };
};

//Get All Status Types
export const getAllStatusTypes = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.status.root}/types` ).then( response => {
            console.log( response );
            dispatch( {
                type: GET_STATUS_TYPES,
                statusTypes: response.data
            } );
        } );
    };
};
/// Get All Color Without Query
export const getDropDownStatuses = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.status.root}` ).then( response => {
            dispatch( {
                type: DROP_DOWN_STATUSES,
                dropDownStatuses: response.data.data.map( item => ( { value: item.id, label: item.name } ) )
            } );
        } );
    };
};
export const getStyleDropdownStatus = () => async dispatch => {
    await baseAxios.get( `${merchandisingApi.style.root}/statuses` ).then( response => {
        dispatch( {
            type: STYLE_STATUS_DROPDOWN,
            dropdownStyleStatus: response?.data.map( item => ( { value: item.id, label: item.name } ) )
        } );
    } );
};
export const getOrderDropdownStatus = () => async dispatch => {
    await baseAxios.get( `${merchandisingApi.style.root}/statuses` ).then( response => {
        dispatch( {
            type: ORDER_STATUS_DROPDOWN,
            dropdownOrderStatus: response?.data.map( item => ( { value: item.id, label: item.name } ) )
        } );
    } );
};

//Get Data by Query
export const getStatusByQuery = params => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.status.root}/grid?${convertQueryString( params )}`, params ).then( ( { data } ) => {
            dispatch( {
                type: GET_STATUSES_BY_QUERY,
                statuses: data.data,
                totalPages: data.totalRecords,
                params
            } );
        } );
    };
};

// ** Get Status by Id
export const getStatusById = id => {
    return async dispatch => {
        await baseAxios
            .get( `${merchandisingApi.status.root}/${id}` )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_STATUS_BY_ID,
                        selectedStatus: response.data ? response.data : null
                    } );
                } else {
                    notify( 'error', `'The Status couldn't find` );
                }
            } )
            .catch( err => console.log( err ) );
    };
};

/// Selected Status Null after Edit or Edit Cancel
export const selectedStatusNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_STATUS_NULL,
            selectedStatus: null
        } );
    };
};

// ** Open  Status Sidebar
export const handleOpenStatusSidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_STATUS_SIDEBAR,
            openStatusSidebar: condition
        } );
    };
};
// ** Open  Status Sidebar
export const handleOpenStatusSidebarForEdit = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_STATUS_SIDEBAR_FOR_EDIT,
            openStatusSidebarForEdit: condition
        } );
    };
};

// ** Add new Status
export const addStatus = status => {
    return async ( dispatch, getState ) => {
        await baseAxios
            .post( `${merchandisingApi.status.root}`, status )
            .then( ( { data } ) => {
                if ( data.status === status.success ) {
                    dispatch( {
                        type: ADD_STATUS,
                        status
                    } );
                    notify( 'success', 'The Status has been added Successfully!' );
                    dispatch( handleOpenStatusSidebar( false ) );
                    dispatch( getStatusByQuery( getState().statuses.params ) );
                } else {
                    notify( 'error', 'The Status has been added Failed!' );
                }
            } )
            .catch( ( { response } ) => {
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'warning', `${response.data.errors.join( ', ' )}` );
                }
            } );
    };
};

// ** Update Status
export const updateStatus = status => {
    return ( dispatch, getState ) => {
        baseAxios
            .put( `${merchandisingApi.status.root}/${status.id}`, status )
            .then( response => {
                if ( response?.data?.status === status.success ) {
                    dispatch( {
                        type: UPDATE_STATUS,
                        status
                    } );
                    dispatch( handleOpenStatusSidebarForEdit( false ) );
                    notify( 'success', 'The Status has been updated Successfully!' );
                    dispatch( getStatusByQuery( getState().statuses.params ) );
                    dispatch( selectedStatusNull() );
                } else {
                    notify( 'error', 'The Status has been updated Failed!' );
                }
            } )
            .catch( ( { response } ) => {
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'warning', `${response.data.errors.join( ', ' )}` );
                }
            } );

    };
};

// ** Delete Status
export const deleteStatus = id => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                baseAxios
                    .put( `${merchandisingApi.status.root}/archives/${id}` )
                    .then( response => {
                        if ( response.status === status.success ) {
                            dispatch( {
                                type: DELETE_STATUS
                            } );
                            notify( 'success', 'The Status has been deleted Successfully!' );
                            dispatch( getStatusByQuery( getState().statuses.params ) );
                        } else {
                            notify( 'success', 'The Status DELETE request has been failed!!!' );
                        }
                    } )
                    .catch( err => console.log( err ) );
            }
        } );
    };
};

// ** Delete Status by Range
export const deleteRangeStatus = ids => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios
                    .delete( `${merchandisingApi.status.delete_status_by_range}`, { ids } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_STATUSES_BY_RANGE
                        } );
                    } )
                    .then( () => {
                        notify( 'success', 'Status has been deleted Successfully!' );
                        dispatch( getStatusByQuery( getState().statuses.params ) );
                        dispatch( getAllStatuses() );
                    } );
            }
        } );
    };
};

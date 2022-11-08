import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { confirmObj, status } from "../../../../../utility/enums";
import { ADD_COSTING_GROUP, DELETE_COSTING_GROUP, DELETE_COSTING_GROUPS_BY_RANGE, DROP_DOWN_COSTING_GROUPS, GET_COSTING_GROUPS, GET_COSTING_GROUPS_BY_QUERY, GET_COSTING_GROUP_BY_ID, OPEN_COSTING_GROUP_SIDEBAR, OPEN_COSTING_GROUP_SIDEBAR_FOR_EDIT, SELECTED_COSTING_GROUP_NULL, UPDATE_COSTING_GROUP } from "../action-types";

// ** Open Costing Group Sidebar
export const handleOpenCostingGroupSidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_COSTING_GROUP_SIDEBAR,
            openCostingGroupSidebar: condition
        } );
    };
};
// ** Open Costing Group Sidebar
export const handleOpenCostingGroupSidebarForEdit = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_COSTING_GROUP_SIDEBAR_FOR_EDIT,
            openCostingGroupSidebarForEdit: condition
        } );
    };
};
//Get All Costing Group without Query
export const getAllCostingGroups = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.costingGroup.get_costing_groups}` ).then( response => {
            dispatch( {
                type: GET_COSTING_GROUPS,
                costingGroups: response.data
            } );
        } );
    };
};

/// Get All Costing Group Without Query
export const getDropDownCostingGroups = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.costingGroup.get_costing_groups}` ).then( response => {
            dispatch( {
                type: DROP_DOWN_COSTING_GROUPS,
                dropDownCostingGroups: response.data.data.map( item => ( { value: item?.id, label: item?.name } ) )
            } );
        } );
    };
};

//Get Data by Query
export const getCostingGroupByQuery = params => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.costingGroup.root}`, { params } ).then( response => {
            dispatch( {
                type: GET_COSTING_GROUPS_BY_QUERY,
                costingGroups: response.data.data,
                totalPages: response.data.totalRecords,
                params
            } );
        } );
    };
};


// ** Get Costing Group by Id
export const getCostingGroupById = id => {
    return async dispatch => {
        await baseAxios
            .get( `${merchandisingApi.costingGroup.root}/${id}` )
            .then( ( response ) => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_COSTING_GROUP_BY_ID,
                        selectedCostingGroup: response.data ? response.data : null
                    } );
                } else {
                    notify( 'error', `'The Costing Group couldn't find'` );
                }
            } )
            .catch( err => console.log( err ) );
    };
};


/// Selected Costing Group Null after Edit or Edit Cancel
export const selectedCostingGroupNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_COSTING_GROUP_NULL,
            selectedCostingGroup: null
        } );
    };
};


// ** Add new Costing Group
export const addCostingGroup = costingGroup => {
    return async ( dispatch, getState ) => {
        await baseAxios.post( `${merchandisingApi.costingGroup.root}`, costingGroup )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: ADD_COSTING_GROUP,
                        costingGroup
                    } );
                    notify( 'success', 'The Costing Group has been added Successfully!' );
                    dispatch( getCostingGroupByQuery() );
                    dispatch( handleOpenCostingGroupSidebar( false ) );
                } else {
                    notify( 'error', 'The Costing Group has been failed!' );
                }
            } )
            .catch( ( { response } ) => {
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'error', `${response.data.errors.join( ', ' )}` );
                }
            } );
    };
};

//Update Costing Group
export const updateCostingGroup = costingGroup => {
    return ( dispatch, getState ) => {
        baseAxios.put( `${merchandisingApi.costingGroup.root}/${costingGroup.id}`, costingGroup ).then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_COSTING_GROUP,
                    costingGroup
                } );
                notify( 'success', 'The Costing Group has been updated Successfully!' );
                dispatch( getCostingGroupByQuery( getState().costingGroup.params ) );
                dispatch( handleOpenCostingGroupSidebarForEdit( false ) );
                dispatch( selectedCostingGroupNull( false ) );
            } else {
                notify( 'error', 'The Costing Group has been updated failed!' );
            }
        } )
            .catch( ( { response } ) => {
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'error', `${response.data.errors.join( ', ' )}` );
                }
            } );
    };
};

// ** Delete Costing Group
export const deleteCostingGroup = id => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                await baseAxios
                    .delete( `${merchandisingApi.costingGroup.delete_costing_group}`, { id } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_COSTING_GROUP
                        } );
                    } )
                    .then( () => {
                        notify( 'success', 'The Costing Group has been deleted Successfully!' );
                        dispatch( getCostingGroupByQuery( getState().costingGroups.params ) );
                        dispatch( getAllCostingGroups() );
                    } );
            }
        } );
    };
};


// ** Delete Costing Group by Range
export const deleteRangeCostingGroup = ids => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios
                    .delete( `${merchandisingApi.costingGroup.delete_costing_groups_by_range}`, { ids } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_COSTING_GROUPS_BY_RANGE
                        } );
                    } )
                    .then( () => {
                        notify( 'success', 'Costing Group has been deleted Successfully!' );
                        dispatch( getCostingGroupByQuery( getState().costingGroups.params ) );
                        dispatch( getAllCostingGroups() );
                    } );
            }
        } );
    };
};

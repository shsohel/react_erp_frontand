import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import _ from 'lodash';
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { status } from "../../../../../utility/enums";
import { convertQueryString } from "../../../../../utility/Utils";
import { sizeGroupModel } from "../../model";
import { ADD_SIZE_GROUP, BIND_SIZE_GROUP_DATA, DELETE_SIZE_GROUP, DELETE_SIZE_GROUP_BY_RANGE, DROP_DOWN_SIZE_GROUPS, GET_SIZE_GROUPS, GET_SIZE_GROUPS_BY_QUERY, GET_SIZE_GROUP_BY_ID, IS_SIZE_GROUP_DATA_LOADED, IS_SIZE_GROUP_DATA_ON_PROGRESS, IS_SIZE_GROUP_DATA_SUBMIT_PROGRESS, OPEN_SIZE_GROUP_SIDEBAR, OPEN_SIZE_GROUP_SIDEBAR_FOR_EDIT, SELECTED_SIZE_GROUP_NULL, UPDATE_SIZE_GROUP } from "../actionTypes";


const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};

// case IS_SIZE_GROUP_DATA_LOADED:
// return { ...state, isSizeGroupDataLoaded: action.isSizeGroupDataLoaded };
//         case IS_SIZE_GROUP_DATA_ON_PROGRESS:
// return { ...state, isSizeGroupDataOnProgress: action.isSizeGroupDataOnProgress };
//         case IS_SIZE_GROUP_DATA_SUBMIT_PROGRESS:
// return { ...state, isSizeGroupDataSubmitProgress: action.isSizeGroupDataSubmitProgress };

export const sizeGroupDataLoaded = ( condition ) => dispatch => {
    dispatch( {
        type: IS_SIZE_GROUP_DATA_LOADED,
        isSizeGroupDataLoaded: condition
    } );
};

export const sizeGroupDataOnProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_SIZE_GROUP_DATA_ON_PROGRESS,
        isSizeGroupDataOnProgress: condition
    } );
};
export const sizeGroupDataSubmitProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_SIZE_GROUP_DATA_SUBMIT_PROGRESS,
        isSizeGroupDataSubmitProgress: condition
    } );
};

// ** Open  Size Group Sidebar
export const bindSizeGroupData = ( sizeGroup ) => dispatch => {
    if ( sizeGroup ) {
        dispatch( {
            type: BIND_SIZE_GROUP_DATA,
            sizeGroup
        } );
    } else {
        dispatch( {
            type: BIND_SIZE_GROUP_DATA,
            sizeGroup: sizeGroupModel
        } );
    }

};
// ** Open  Size Group Sidebar
export const handleOpenSizeGroupSidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_SIZE_GROUP_SIDEBAR,
            openSizeGroupSidebar: condition
        } );
        dispatch( bindSizeGroupData( null ) );

    };
};
// ** Open  Size Group Sidebar
export const handleOpenSizeGroupSidebarForEdit = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_SIZE_GROUP_SIDEBAR_FOR_EDIT,
            openSizeGroupSidebarForEdit: condition
        } );
    };
};
///Get All without Query
export const getAllSizeGroups = () => {
    return async ( dispatch ) => {
        await baseAxios
            .get( `${merchandisingApi.sizeGroup.get_size_groups}` )
            .then( ( response ) => {
                dispatch( {
                    type: GET_SIZE_GROUPS,
                    sizeGroups: response.data
                } );
            } );
    };
};


/// Get All Size Group Without Query
export const getDropDownSizeGroups = () => async dispatch => {
    dispatch( {
        type: DROP_DOWN_SIZE_GROUPS,
        dropDownSizeGroups: [],
        isDropDownSizeGroupsLoaded: false
    } );
    await baseAxios.get( `${merchandisingApi.sizeGroup.root}` )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: DROP_DOWN_SIZE_GROUPS,
                    dropDownSizeGroups: response.data.data.map( item => ( {
                        value: item.id,
                        label: item.groupName
                    } ) ),
                    isDropDownSizeGroupsLoaded: true
                } );
            }

        } ).catch( ( { response } ) => {
            dispatch( {
                type: DROP_DOWN_SIZE_GROUPS,
                dropDownSizeGroups: [],
                isDropDownSizeGroupsLoaded: true
            } );
            if ( response?.status === status.severError || response === undefined ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

//Get Data by Query
export const getSizeGroupByQuery = ( params, queryData ) => async dispatch => {
    dispatch( sizeGroupDataLoaded( false ) );
    const apiEndPoint = `${merchandisingApi.sizeGroup.root}/grid?${convertQueryString( params )}`;
    await baseAxios.post( apiEndPoint, queryData )
        .then( response => {
            if ( response.status === status.success ) {
                const { data } = response;
                dispatch( {
                    type: GET_SIZE_GROUPS_BY_QUERY,
                    sizeGroups: data.data,
                    totalPages: data.totalRecords,
                    params
                } );
                dispatch( sizeGroupDataLoaded( true ) );

            }
        } ).catch( ( { response } ) => {
            dispatch( sizeGroupDataLoaded( true ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

// ** Get Size Group by Id
export const getSizeGroupById = id => async dispatch => {
    dispatch( sizeGroupDataOnProgress( true ) );

    await baseAxios
        .get( `${merchandisingApi.sizeGroup.root}/${id}` )
        .then( response => {
            if ( response.status === status.success ) {
                const { data } = response;
                const getObj = {
                    id: data.id,
                    name: data.groupName,
                    sizes: _.sortBy( data.sizes, 'position' ).map( size => ( {
                        label: size.size,
                        value: size.sizeId,
                        position: size.position
                    } ) )
                };
                dispatch( {
                    type: GET_SIZE_GROUP_BY_ID,
                    sizeGroup: response.data ? getObj : null
                } );
                dispatch( handleOpenSizeGroupSidebarForEdit( true ) );
                dispatch( sizeGroupDataOnProgress( false ) );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( sizeGroupDataOnProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};


/// Selected Size Group Null after Edit or Edit Cancel
export const selectedSizeGroupNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_SIZE_GROUP_NULL,
            selectedSizeGroup: null
        } );
    };
};


// ** Add new Size Group
export const addSizeGroup = sizeGroup => async ( dispatch, getState ) => {
    dispatch( sizeGroupDataSubmitProgress( true ) );
    await baseAxios
        .post( `${merchandisingApi.sizeGroup.root}`, sizeGroup )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_SIZE_GROUP,
                    sizeGroup
                } );
                notify( 'success', 'The Size Group has been added Successfully!' );
                dispatch( getSizeGroupByQuery( getState().sizeGroups.params, [] ) );
                dispatch( handleOpenSizeGroupSidebar( false ) );
                dispatch( bindSizeGroupData( null ) );
                dispatch( sizeGroupDataSubmitProgress( false ) );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( sizeGroupDataSubmitProgress( false ) );

            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

// ** Update Size Group
export const updateSizeGroup = sizeGroup => ( dispatch, getState ) => {
    dispatch( sizeGroupDataSubmitProgress( true ) );

    baseAxios
        .put( `${merchandisingApi.sizeGroup.root}/${sizeGroup.id}`, sizeGroup )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_SIZE_GROUP,
                    sizeGroup
                } );
                notify( 'success', 'The Size Group has been updated Successfully!' );
                dispatch( getSizeGroupByQuery( getState().sizeGroups.params, [] ) );
                dispatch( selectedSizeGroupNull() );
                dispatch( handleOpenSizeGroupSidebarForEdit( false ) );
                dispatch( sizeGroupDataSubmitProgress( false ) );

            }
        } )
        .catch( ( { response } ) => {
            dispatch( sizeGroupDataSubmitProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

// ** Delete Size Group
export const deleteSizeGroup = sizeGroup => ( dispatch, getState ) => {
    confirmDialog( {
        ...confirmObj,
        text: `<h4 class="text-primary mb-0">${sizeGroup.groupName}</h4> <br/> <span>You won't retrieve again!</span>`
    } ).then( e => {
        if ( e.isConfirmed ) {
            dispatch( sizeGroupDataOnProgress( true ) );
            baseAxios
                .delete( `${merchandisingApi.sizeGroup.root}/${sizeGroup.id}` )
                .then( response => {
                    if ( response.status === status.success ) {
                        dispatch( {
                            type: DELETE_SIZE_GROUP
                        } );
                        notify( 'success', 'The Size Group has been deleted Successfully!' );

                        dispatch( getSizeGroupByQuery( getState().sizeGroups.params, [] ) );
                        dispatch( sizeGroupDataOnProgress( false ) );
                    }
                } )
                .catch( ( { response } ) => {
                    dispatch( sizeGroupDataOnProgress( false ) );
                    if ( response?.status === status.severError || response === undefined ) {
                        notify( 'error', `Please contact the support team!!!` );
                    } else if ( response?.status === status.badRequest ) {
                        notify( 'errors', response.data.errors );
                    } else {
                        notify( 'warning', `${response?.data?.errors?.join( ', ' )}` );
                    }
                } );
        }
    } );
};


// ** Delete Size Group by Range
export const deleteRangeSizeGroup = ids => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios
                    .delete( `${merchandisingApi.sizeGroup.root}`, { ids } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_SIZE_GROUP_BY_RANGE
                        } );
                    } )
                    .then( () => {
                        notify( 'success', 'Size Group has been deleted Successfully!' );
                        dispatch( getSizeGroupByQuery( getState().sizeGroups.params, [] ) );
                        dispatch( getAllSizeGroups() );
                    } );
            }
        } );
    };
};

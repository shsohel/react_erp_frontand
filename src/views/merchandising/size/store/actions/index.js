import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { status } from "../../../../../utility/enums";
import { convertQueryString } from "../../../../../utility/Utils";
import { sizeModel } from "../../model";
import { ADD_SIZE, BIND_SIZE_DATA, DELETE_SIZE, DELETE_SIZES_BY_RANGE, DROP_DOWN_SIZES, GET_SIZES, GET_SIZES_BY_QUERY, GET_SIZE_BY_ID, GET_STYLE_SIZES_DROP_DOWN, IS_SIZE_DATA_LOADED, IS_SIZE_DATA_ON_PROGRESS, IS_SIZE_DATA_SUBMIT_PROGRESS, OPEN_SIZE_SIDEBAR, OPEN_SIZE_SIDEBAR_FOR_EDIT, SELECTED_SIZE_NULL, UPDATE_SIZE } from '../actionTypes';

const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};


//   case IS_SIZE_DATA_LOADED:
// return { ...state, isSizeDataLoaded: action.isSizeDataLoaded };
//         case IS_SIZE_DATA_ON_PROGRESS:
// return { ...state, isSizeDataOnProgress: action.isSizeDataOnProgress };
//         case IS_SIZE_DATA_SUBMIT_PROGRESS:
// return { ...state, isSizeDataSubmitProgress: action.isSizeDataSubmitProgress };

export const sizeDataLoaded = ( condition ) => dispatch => {
    dispatch( {
        type: IS_SIZE_DATA_LOADED,
        isSizeDataLoaded: condition
    } );
};
export const sizeDataOnProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_SIZE_DATA_ON_PROGRESS,
        isSizeDataOnProgress: condition
    } );
};
export const sizeDataSubmitProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_SIZE_DATA_SUBMIT_PROGRESS,
        isSizeDataSubmitProgress: condition
    } );
};

export const bindSizeData = ( size ) => dispatch => {
    if ( size ) {
        dispatch( {
            type: BIND_SIZE_DATA,
            size
        } );
    } else {
        dispatch( {
            type: BIND_SIZE_DATA,
            size: sizeModel
        } );
    }

};

// ** Open  Size Sidebar

export const handleOpenSizeSidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_SIZE_SIDEBAR,
            openSizeSidebar: condition
        } );
        dispatch( bindSizeData( null ) );
    };
};

// ** Open  Size Sidebar
export const handleOpenSizeSidebarForEdit = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_SIZE_SIDEBAR_FOR_EDIT,
            openSizeSidebarForEdit: condition
        } );
    };
};
//Get All Size without Query
export const getAllSizes = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.size.root}` ).then( response => {
            dispatch( {
                type: GET_SIZES,
                sizes: response.data
            } );
        } );
    };
};


/// Get All Size Without Query
export const getDropDownSizes = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.size.root}` ).then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: DROP_DOWN_SIZES,
                    dropDownSizes: response.data.data.map( s => ( { value: s.id, label: s.shortCode } ) )
                } );
            } else {
                notify( 'warning', 'Sizes Data Not Found!' );
            }

        } );
    };
};

///GET SIZES by SizeGroup Id
export const getSizesBySizeGroupId = ( sizeGroupId ) => async dispatch => {
    await baseAxios.get( `${merchandisingApi}` );
};


//Get Data by Query
export const getSizeByQuery = ( params, queryData ) => async dispatch => {
    dispatch( sizeDataLoaded( false ) );
    const apiEndPoint = `${merchandisingApi.size.root}/grid?${convertQueryString( params )}`;
    await baseAxios.post( apiEndPoint, queryData )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_SIZES_BY_QUERY,
                    sizes: response.data.data,
                    totalPages: response.data.totalRecords,
                    params
                } );
                dispatch( sizeDataLoaded( true ) );
            }

        } ).catch( ( { response } ) => {
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

// ** Get Size by Id
export const getSizeById = id => async dispatch => {
    dispatch( sizeDataOnProgress( true ) );

    await baseAxios
        .get( `${merchandisingApi.size.get_size_by_id}/${id}` )
        .then( response => {
            if ( response.status === status.success ) {
                const { data } = response;
                const getObj = {
                    id: data.id,
                    name: data.name,
                    shortCode: data.shortCode
                };
                dispatch( {
                    type: GET_SIZE_BY_ID,
                    size: response.data ? getObj : null
                } );
                dispatch( handleOpenSizeSidebarForEdit( true ) );
                dispatch( sizeDataOnProgress( false ) );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( sizeDataOnProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};
// ** Get Size by Style Id
export const getSizeDropDownByStyleId = styleId => async dispatch => {
    if ( styleId ) {
        await baseAxios
            .get( `${merchandisingApi.style.root}/${styleId}/sizes` )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_STYLE_SIZES_DROP_DOWN,
                        styleSizesDropdown: response.data ? response.data.map( s => ( {
                            label: s.name,
                            value: s.sizeId
                        } ) ) : []
                    } );
                } else {
                    notify( 'error', `'The Size couldn't find'` );
                }
            } )
            .catch( err => console.log( err ) );
    } else {
        dispatch( {
            type: GET_STYLE_SIZES_DROP_DOWN,
            styleSizesDropdown: []
        } );
    }

};
export const getSizeDropDownBySetStyleIds = queryData => async dispatch => {
    // if ( queryData.lenth > 0 ) {
    const endPoints = `${merchandisingApi.purchaseOrder.root}/setStyles/sizes`;
    await baseAxios
        .post( endPoints, queryData )
        .then( response => {
            if ( response.status === status.success ) {
                console.log( 'response', JSON.stringify( response.data, null, 2 ) );
                dispatch( {
                    type: GET_STYLE_SIZES_DROP_DOWN,
                    styleSizesDropdown: response.data ? response.data.map( s => ( {
                        label: s.name,
                        value: s.id
                    } ) ) : []
                } );
            } else {
                notify( 'error', `'The Size couldn't find'` );
            }
        } )
        .catch( err => console.log( err ) );
    // } else {
    //     dispatch( {
    //         type: GET_STYLE_SIZES_DROP_DOWN,
    //         styleSizesDropdown: []
    //     } );
    // }

};


/// Selected Size Null after Edit or Edit Cancel
export const selectedSizeNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_SIZE_NULL,
            selectedSize: null
        } );
    };
};


// ** Add new Size
export const addSize = size => async ( dispatch, getState ) => {
    dispatch( sizeDataSubmitProgress( true ) );
    await baseAxios
        .post( `${merchandisingApi.size.root}`, size )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_SIZE,
                    size
                } );
                notify( 'success', 'The Size has been added Successfully!' );
                dispatch( getSizeByQuery( getState().sizes.params, [] ) );
                dispatch( handleOpenSizeSidebar( false ) );
                dispatch( sizeDataSubmitProgress( false ) );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( sizeDataSubmitProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

export const addSizeInstant = ( size ) => async ( dispatch, getState ) => {
    await baseAxios
        .post( `${merchandisingApi.size.root}`, size )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_SIZE,
                    lastCreatedId: response.data,
                    size
                } );
                notify( 'success', 'The Size has been added Successfully!' );
                dispatch( getDropDownSizes() );
                dispatch( getSizeByQuery( getState().sizes.params, [] ) );

            } else {
                notify( 'error', 'The Size has been added Failed!' );
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


// ** Update Size
export const updateSize = size => async ( dispatch, getState ) => {
    dispatch( sizeDataSubmitProgress( true ) );
    await baseAxios
        .put( `${merchandisingApi.size.root}/${size.id}`, size )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_SIZE,
                    size
                } );
                notify( 'success', 'The Size has been updated Successfully!' );
                dispatch( getSizeByQuery( getState().sizes.params, [] ) );
                dispatch( handleOpenSizeSidebarForEdit( false ) );
                dispatch( selectedSizeNull() );
                dispatch( sizeDataSubmitProgress( false ) );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( sizeDataSubmitProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

// ** Delete Size
export const deleteSize = size => ( dispatch, getState ) => {
    confirmDialog( {
        ...confirmObj,
        text: `<h4 class="text-primary mb-0">${size.name}</h4> <br/> <span>You won't retrieve again!</span>`
    } ).then( async e => {
        if ( e.isConfirmed ) {
            dispatch( sizeDataOnProgress( true ) );
            baseAxios
                .delete( `${merchandisingApi.size.root}/${size.id}` )
                .then( response => {
                    if ( response.status === status.success ) {
                        dispatch( {
                            type: DELETE_SIZE
                        } );
                        notify( 'success', 'The Size has been deleted Successfully!' );
                        dispatch( getSizeByQuery( getState().sizes.params, [] ) );
                        dispatch( sizeDataOnProgress( false ) );
                    }
                } )
                .catch( ( { response } ) => {
                    dispatch( sizeDataOnProgress( false ) );
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


// ** Delete Size by Range
export const deleteRangeSize = ids => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios
                    .delete( `${merchandisingApi.size.delete_size_by_range}`, { ids } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_SIZES_BY_RANGE
                        } );
                    } )
                    .then( () => {
                        notify( 'success', 'Size has been deleted Successfully!' );
                        dispatch( getSizeByQuery( getState().sizes.params, [] ) );
                    } );
            }
        } );
    };
};

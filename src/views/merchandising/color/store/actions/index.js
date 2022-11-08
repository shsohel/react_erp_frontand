import { notify } from '@custom/notifications';
import { baseAxios } from '@services';
import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import { confirmDialog } from '../../../../../utility/custom/ConfirmDialog';
import { confirmObj, status } from '../../../../../utility/enums';
import { convertQueryString } from '../../../../../utility/Utils';
import { colorModel } from '../../model';
import { ADD_COLOR, BIND_COLOR_DATA, DELETE_COLOR, DELETE_COLORS_BY_RANGE, DROP_DOWN_COLORS, GET_COLORS, GET_COLORS_BY_QUERY, GET_COLORS_BY_STYLE_ID, GET_COLOR_BY_ID, IS_COLOR_DATA_LOADED, IS_COLOR_DATA_ON_PROGRESS, IS_COLOR_DATA_SUBMIT_PROGRESS, OPEN_COLOR_SIDEBAR, OPEN_COLOR_SIDEBAR_FOR_EDIT, SELECTED_COLOR_NULL, UPDATE_COLOR } from '../actionTypes';


// case IS_COLOR_DATA_LOADED:
// return { ...state, isColorDataLoaded: action.isColorDataLoaded };
//         case IS_COLOR_DATA_ON_PROGRESS:
// return { ...state, isColorDataOnProgress: action.isColorDataOnProgress };
//         case IS_COLOR_DATA_SUBMIT_PROGRESS:
// return { ...state, isColorDataSubmitProgress: action.isColorDataSubmitProgress };

export const colorDataLoaded = ( condition ) => dispatch => {
    dispatch( {
        type: IS_COLOR_DATA_LOADED,
        isColorDataLoaded: condition
    } );
};
export const colorDataOnProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_COLOR_DATA_ON_PROGRESS,
        isColorDataOnProgress: condition
    } );
};
export const colorDataSubmitProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_COLOR_DATA_SUBMIT_PROGRESS,
        isColorDataSubmitProgress: condition
    } );
};


export const bindColorData = ( color ) => dispatch => {
    if ( color ) {
        dispatch( {
            type: BIND_COLOR_DATA,
            color
        } );
    } else {
        dispatch( {
            type: BIND_COLOR_DATA,
            color: colorModel
        } );
    }

};
// ** Open  Color Sidebar
export const handleOpenColorSidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_COLOR_SIDEBAR,
            openColorSidebar: condition
        } );
        dispatch( bindColorData( null ) );
    };
};
// ** Open  Color Sidebar
export const handleOpenColorSidebarForEdit = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_COLOR_SIDEBAR_FOR_EDIT,
            openColorSidebarForEdit: condition
        } );
    };
};
//Get All Color without Query
export const getAllColors = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.color.root}` ).then( response => {
            dispatch( {
                type: GET_COLORS,
                colors: response.data
            } );
        } );
    };
};

/// Get All Color Without Query
export const getDropDownColors = () => async dispatch => {
    dispatch( {
        type: DROP_DOWN_COLORS,
        dropDownColors: [],
        isDropDownColorsLoaded: false
    } );
    await baseAxios.get( `${merchandisingApi.color.root}` )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: DROP_DOWN_COLORS,
                    dropDownColors: response.data.data.map( item => ( {
                        value: item.id,
                        label: item.name
                    } ) ),
                    isDropDownColorsLoaded: true
                } );
            }
        } ).catch( ( { response } ) => {
            dispatch( {
                type: DROP_DOWN_COLORS,
                dropDownColors: [],
                isDropDownColorsLoaded: true
            } );
            if ( response?.status === status.severError || response === undefined ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

//Get Data by Query
export const getColorByQuery = ( params, queryData ) => async dispatch => {
    dispatch( colorDataLoaded( false ) );

    const apiEndPoint = `${merchandisingApi.color.root}/grid?${convertQueryString( params )}`;
    await baseAxios.post( apiEndPoint, queryData ).then( response => {
        if ( response.status === status.success ) {
            const { data } = response;
            dispatch( {
                type: GET_COLORS_BY_QUERY,
                colors: data.data,
                totalPages: data.totalRecords,
                params
            } );
            dispatch( colorDataLoaded( true ) );


        }

    } ).catch( ( { response } ) => {
        dispatch( colorDataLoaded( true ) );
        if ( response.status === status.severError ) {
            notify( 'error', `Please contact the support team!!!` );
        } else {
            notify( 'warning', `${response.data.errors.join( ', ' )}` );
        }
    } );
};

// ** Get Color by Id
export const getColorById = id => async dispatch => {
    dispatch( colorDataOnProgress( true ) );
    await baseAxios
        .get( `${merchandisingApi.color.root}/${id}` )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_COLOR_BY_ID,
                    color: response.data ? response.data.data : null
                } );
                dispatch( handleOpenColorSidebarForEdit( true ) );
                dispatch( colorDataOnProgress( false ) );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( colorDataOnProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

//GET COLORS by STYLE ID
export const getColorDropDownByStyleId = styleId => async dispatch => {
    if ( styleId ) {
        await baseAxios
            .get( `${merchandisingApi.style.root}/${styleId}/colors` )
            .then( response => {
                if ( response.status === status.success ) {
                    console.log( response.data );
                    dispatch( {
                        type: GET_COLORS_BY_STYLE_ID,
                        styleColorsDropdown: response.data ? response.data.map( s => ( {
                            label: s.name,
                            value: s.id
                        } ) ) : []
                    } );
                } else {
                    notify( 'error', `'The Color couldn't find'` );
                }
            } )
            .catch( err => console.log( err ) );
    } else {
        dispatch( {
            type: GET_COLORS_BY_STYLE_ID,
            styleColorsDropdown: []
        } );
    }

};

/// Selected Color Null after Edit or Edit Cancel
export const selectedColorNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_COLOR_NULL,
            selectedColor: null
        } );
    };
};

// ** Add new Color
export const addColor = color => async ( dispatch, getState ) => {
    dispatch( colorDataSubmitProgress( true ) );
    await baseAxios
        .post( `${merchandisingApi.color.root}`, color )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_COLOR,
                    color
                } );
                notify( 'success', 'The Color has been added Successfully!' );
                dispatch( getColorByQuery( getState().colors.params, [] ) );
                dispatch( handleOpenColorSidebar( false ) );
                dispatch( colorDataSubmitProgress( false ) );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( colorDataSubmitProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response.data.errors.join( ', ' )}` );
            }
        } );
};


// ** Update Color
export const updateColor = color => async ( dispatch, getState ) => {
    dispatch( colorDataSubmitProgress( true ) );

    await baseAxios
        .put( `${merchandisingApi.color.root}/${color.id}`, color )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_COLOR,
                    color
                } );
                notify( 'success', 'The Color has been updated Successfully!' );
                dispatch( getColorByQuery( getState().colors.params, [] ) );
                dispatch( handleOpenColorSidebarForEdit( false ) );
                dispatch( selectedColorNull( false ) );
                dispatch( colorDataSubmitProgress( false ) );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( colorDataSubmitProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response.data.errors.join( ', ' )}` );
            }
        } );
};


// ** Delete Color
export const deleteColor = color => ( dispatch, getState ) => {
    confirmDialog( {
        ...confirmObj,
        text: `<h4 class="text-primary mb-0">${color.name}</h4> <br/> <span>You won't retrieve again!</span>`
    } )
        .then( async e => {
            if ( e.isConfirmed ) {
                dispatch( colorDataOnProgress( true ) );
                await baseAxios
                    .delete( `${merchandisingApi.color.root}/${color.id}` )
                    .then( response => {
                        if ( response.status === status.success ) {
                            dispatch( {
                                type: DELETE_COLOR
                            } );
                            notify( 'success', 'The Color has been deleted Successfully!' );
                            dispatch( getColorByQuery( getState().colors.params, [] ) );
                            dispatch( colorDataOnProgress( false ) );
                        }
                    } )
                    .catch( ( { response } ) => {
                        dispatch( colorDataOnProgress( false ) );
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

// ** Delete Color by Range
export const deleteRangeColor = ids => ( dispatch, getState ) => {
    confirmDialog( confirmObj ).then( e => {
        if ( e.isConfirmed ) {
            baseAxios
                .delete( `${merchandisingApi.color.delete_color_by_range}`, { ids } )
                .then( response => {
                    dispatch( {
                        type: DELETE_COLORS_BY_RANGE
                    } );
                } )
                .then( () => {
                    notify( 'success', 'Colors has been deleted Successfully!' );
                    dispatch( getColorByQuery( getState().colors.params, [] ) );
                } );
        }
    } );

};

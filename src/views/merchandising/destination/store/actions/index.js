import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { status } from "../../../../../utility/enums";
import { convertQueryString } from "../../../../../utility/Utils";
import { destinationModel } from "../../model";
import { ADD_DESTINATION, BIND_DESTINATION_DATA, DELETE_DESTINATION, DELETE_DESTINATIONS_BY_RANGE, DROP_DOWN_DESTINATIONS, GET_DESTINATIONS, GET_DESTINATIONS_BY_QUERY, GET_DESTINATION_BY_BUYER_ID, GET_DESTINATION_BY_COUNTRY_NAME, GET_DESTINATION_BY_ID, GET_STYLE_DESTINATIONS_DROP_DOWN, IS_DESTINATION_DATA_LOADED, IS_DESTINATION_DATA_ON_PROGRESS, IS_DESTINATION_DATA_SUBMIT_PROGRESS, OPEN_DESTINATION_SIDEBAR, OPEN_DESTINATION_SIDEBAR_FOR_EDIT, SELECTED_DESTINATION_NULL, UPDATE_DESTINATION } from '../actionTypes';

const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};


export const destinationDataLoaded = ( condition ) => dispatch => {
    dispatch( {
        type: IS_DESTINATION_DATA_LOADED,
        isDestinationDataLoaded: condition
    } );
};

export const destinationDataOnProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_DESTINATION_DATA_ON_PROGRESS,
        isDestinationDataOnProgress: condition
    } );
};
export const destinationDataSubmitProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_DESTINATION_DATA_SUBMIT_PROGRESS,
        isDestinationDataSubmitProgress: condition
    } );
};

export const bindDestinationData = ( destination ) => dispatch => {
    if ( destination ) {
        dispatch( {
            type: BIND_DESTINATION_DATA,
            destination
        } );
    } else {
        dispatch( {
            type: BIND_DESTINATION_DATA,
            destination: destinationModel
        } );
    }

};

// ** Open  Destination Sidebar

export const handleOpenDestinationSidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_DESTINATION_SIDEBAR,
            openDestinationSidebar: condition
        } );
        dispatch( bindDestinationData( null ) );
    };
};

// ** Open  Destination Sidebar
export const handleOpenDestinationSidebarForEdit = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_DESTINATION_SIDEBAR_FOR_EDIT,
            openDestinationSidebarForEdit: condition
        } );
    };
};
//Get All Destination without Query
export const getAllDestinations = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.destination.root}` ).then( response => {
            dispatch( {
                type: GET_DESTINATIONS,
                destinations: response.data
            } );
        } );
    };
};


/// Get All Destination Without Query
export const getDropDownDestinations = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.destination.root}` ).then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: DROP_DOWN_DESTINATIONS,
                    dropDownDestinations: response.data.data.map( s => ( { value: s.id, label: s.destination } ) )
                } );
            } else {
                notify( 'warning', 'Destinations Data Not Found!' );
            }

        } );
    };
};

export const getDropDownDestinationsByCountryName = ( countryName ) => async dispatch => {
    const apiEndPoint = `api/merchandising/countries/${countryName}/destinations`;
    dispatch( {
        type: GET_DESTINATION_BY_COUNTRY_NAME,
        destinationDropdownCountryWise: [],
        isDestinationDropdownCountryWiseLoaded: false
    } );
    if ( countryName ) {
        await baseAxios.get( apiEndPoint ).then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_DESTINATION_BY_COUNTRY_NAME,
                    destinationDropdownCountryWise: response.data.map( d => ( { value: d, label: d } ) ),
                    isDestinationDropdownCountryWiseLoaded: true
                } );
            }

        } ).catch( ( { response } ) => {
            dispatch( {
                type: GET_DESTINATION_BY_COUNTRY_NAME,
                destinationDropdownCountryWise: [],
                isDestinationDropdownCountryWiseLoaded: true
            } );
            if ( response.status === status.severError || response === undefined ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
    } else {
        dispatch( {
            type: GET_DESTINATION_BY_COUNTRY_NAME,
            destinationDropdownCountryWise: [],
            isDestinationDropdownCountryWiseLoaded: true
        } );
    }
};
//   case GET_DESTINATION_BY_BUYER_ID:
// return { ...state, destinationDropdownBuyerWise: action.destinationDropdownBuyerWise };
export const getDropDownDestinationsByBuyerId = ( buyerId ) => async dispatch => {
    const apiEndPoint = `${merchandisingApi.buyer.root}/${buyerId}/destinations`;
    if ( buyerId ) {
        await baseAxios.get( apiEndPoint ).then( response => {
            if ( response.status === status.success ) {
                console.log( response.data );
                dispatch( {
                    type: GET_DESTINATION_BY_BUYER_ID,
                    destinationDropdownBuyerWise: response.data.map( d => ( { value: d, label: d } ) )
                } );
            }

        } ).catch( ( { response } ) => {
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
    } else {
        dispatch( {
            type: GET_DESTINATION_BY_BUYER_ID,
            destinationDropdownBuyerWise: []
        } );
    }
};

///GET DESTINATIONS by DestinationGroup Id
export const getDestinationsByDestinationGroupId = ( destinationGroupId ) => async dispatch => {
    await baseAxios.get( `${merchandisingApi}` );
};


//Get Data by Query
export const getDestinationByQuery = ( params, queryData ) => async dispatch => {
    const apiEndPoint = `${merchandisingApi.destination.root}/grid?${convertQueryString( params )}`;
    dispatch( destinationDataLoaded( false ) );
    await baseAxios.post( apiEndPoint, queryData )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_DESTINATIONS_BY_QUERY,
                    destinations: response.data.data,
                    totalPages: response.data.totalRecords,
                    params
                } );
                dispatch( destinationDataLoaded( true ) );
            }
        } ).catch( ( { response } ) => {
            dispatch( destinationDataLoaded( true ) );
            if ( response === undefined || response?.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response?.data?.errors.join( ', ' )}` );
            }
        } );
};

// ** Get Destination by Id
export const getDestinationById = id => {
    return async dispatch => {
        await baseAxios
            .get( `${merchandisingApi.destination.get_destination_by_id}/${id}` )
            .then( response => {
                if ( response.status === status.success ) {
                    const { data } = response;
                    const getObj = {
                        id: data.id,
                        name: data.name,
                        shortCode: data.shortCode
                    };
                    dispatch( {
                        type: GET_DESTINATION_BY_ID,
                        destination: response.data ? getObj : null
                    } );
                    dispatch( handleOpenDestinationSidebarForEdit( true ) );
                } else {
                    notify( 'error', `'The Destination couldn't find'` );
                }
            } )
            .catch( err => console.log( err ) );
    };
};
// ** Get Destination by Style Id
export const getDestinationDropDownByStyleId = styleId => async dispatch => {
    if ( styleId ) {
        await baseAxios
            .get( `${merchandisingApi.style.root}/${styleId}/destinations` )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_STYLE_DESTINATIONS_DROP_DOWN,
                        styleDestinationsDropdown: response.data ? response.data.map( s => ( {
                            label: s.name,
                            value: s.destinationId
                        } ) ) : []
                    } );
                } else {
                    notify( 'error', `'The Destination couldn't find'` );
                }
            } )
            .catch( err => console.log( err ) );
    } else {
        dispatch( {
            type: GET_STYLE_DESTINATIONS_DROP_DOWN,
            styleDestinationsDropdown: []
        } );
    }

};
export const getDestinationDropDownBySetStyleIds = queryData => async dispatch => {
    // if ( queryData.lenth > 0 ) {
    const endPoints = `${merchandisingApi.purchaseOrder.root}/setStyles/destinations`;
    await baseAxios
        .post( endPoints, queryData )
        .then( response => {
            if ( response.status === status.success ) {
                console.log( 'response', JSON.stringify( response.data, null, 2 ) );
                dispatch( {
                    type: GET_STYLE_DESTINATIONS_DROP_DOWN,
                    styleDestinationsDropdown: response.data ? response.data.map( s => ( {
                        label: s.name,
                        value: s.id
                    } ) ) : []
                } );
            } else {
                notify( 'error', `'The Destination couldn't find'` );
            }
        } )
        .catch( err => console.log( err ) );
    // } else {
    //     dispatch( {
    //         type: GET_STYLE_DESTINATIONS_DROP_DOWN,
    //         styleDestinationsDropdown: []
    //     } );
    // }

};


/// Selected Destination Null after Edit or Edit Cancel
export const selectedDestinationNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_DESTINATION_NULL,
            selectedDestination: null
        } );
    };
};


// ** Add new Destination
export const addDestination = destination => async ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.destination.root}`;
    dispatch( destinationDataSubmitProgress( true ) );
    await baseAxios
        .post( apiEndPoint, destination )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_DESTINATION,
                    destination
                } );
                notify( 'success', 'The Destination has been added Successfully!' );
                dispatch( getDestinationByQuery( getState().destinations.params, [] ) );
                dispatch( handleOpenDestinationSidebar( false ) );
                dispatch( destinationDataSubmitProgress( false ) );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( destinationDataSubmitProgress( false ) );

            if ( response === undefined || response?.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response?.data?.errors.join( ', ' )}` );
            }
        } );
};

export const addDestinationInstant = ( destination ) => async ( dispatch, getState ) => {
    await baseAxios
        .post( `${merchandisingApi.destination.root}`, destination )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_DESTINATION,
                    lastCreatedId: response.data,
                    destination
                } );
                notify( 'success', 'The Destination has been added Successfully!' );
                dispatch( getDropDownDestinations() );
                dispatch( getDestinationByQuery( getState().destinations.params, [] ) );

            } else {
                notify( 'error', 'The Destination has been added Failed!' );
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


// ** Update Destination
export const updateDestination = destination => async ( dispatch, getState ) => {
    await baseAxios
        .put( `${merchandisingApi.destination.root}/${destination.id}`, destination )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_DESTINATION,
                    destination
                } );
                notify( 'success', 'The Destination has been updated Successfully!' );
                dispatch( getDestinationByQuery( getState().destinations.params, [] ) );
                dispatch( handleOpenDestinationSidebarForEdit( false ) );
                dispatch( selectedDestinationNull() );
            } else {
                notify( 'success', 'The Destination has been updated Successfully!' );
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

// ** Delete Destination
export const deleteDestination = destination => ( dispatch, getState ) => {
    confirmDialog( { ...confirmObj, text: `<h4 class="text-primary mb-0">${destination.destination}</h4> <br/> <span>You can't retrieve again!</span>` } ).then( async e => {
        if ( e.isConfirmed ) {
            baseAxios
                .put( `${merchandisingApi.destination.root}/archives/${destination.id}` )
                .then( response => {
                    if ( response.status === status.success ) {
                        dispatch( {
                            type: DELETE_DESTINATION
                        } );
                        notify( 'success', 'The Destination has been deleted Successfully!' );
                        dispatch( getDestinationByQuery( getState().destinations.params, [] ) );
                    } else {
                        notify( 'error', 'The Destination DELETE request has been failed!' );
                    }

                } )
                .catch( err => console.log( err ) );
        }
    } );
};


// ** Delete Destination by Range
export const deleteRangeDestination = ids => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios
                    .delete( `${merchandisingApi.destination.delete_destination_by_range}`, { ids } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_DESTINATIONS_BY_RANGE
                        } );
                    } )
                    .then( () => {
                        notify( 'success', 'Destination has been deleted Successfully!' );
                        dispatch( getDestinationByQuery( getState().destinations.params, [] ) );
                    } );
            }
        } );
    };
};

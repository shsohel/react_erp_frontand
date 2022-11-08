import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import { merchandisingApi } from '@services/api-end-points/merchandising';
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { confirmObj, status } from "../../../../../utility/enums";
import { convertQueryString } from "../../../../../utility/Utils";
// import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import { ADD_SEASON, DELETE_SEASON, DELETE_SEASONS_BY_RANGE, DROP_DOWN_SEASONS, GET_SEASONS, GET_SEASONS_BY_QUERY, GET_SEASON_BY_ID, OPEN_SEASON_SIDEBAR, OPEN_SEASON_SIDEBAR_FOR_EDIT, SELECTED_SEASON_NULL, UPDATE_SEASON } from '../actionTypes';


// ** Open  Season Sidebar
export const handleOpenSeasonSidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_SEASON_SIDEBAR,
            openSeasonSidebar: condition
        } );
    };
};
// ** Open  Season Sidebar
export const handleOpenSeasonSidebarForEdit = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_SEASON_SIDEBAR_FOR_EDIT,
            openSeasonSidebarForEdit: condition
        } );
    };
};

//Get All Season without Query
export const getAllSeasons = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.season.root}` ).then( response => {
            dispatch( {
                type: GET_SEASONS,
                seasons: response.data
            } );
        } );
    };
};


/// Get All Season Without Query
export const getDropDownSeasons = () => async dispatch => {
    dispatch( {
        type: DROP_DOWN_SEASONS,
        dropDownSeasons: [],
        isDropDownSeasonsLoaded: false
    } );
    const apiEndPoint = `${merchandisingApi.season.root}`;

    await baseAxios.get( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: DROP_DOWN_SEASONS,
                dropDownSeasons: response.data.data.map( item => ( { value: item?.id, label: item?.name } ) ),
                isDropDownSeasonsLoaded: true
            } );
        }

    } ).catch( ( { response } ) => {
        dispatch( {
            type: DROP_DOWN_SEASONS,
            dropDownSeasons: [],
            isDropDownSeasonsLoaded: true
        } );
        if ( response?.status === status.severError ) {
            notify( 'error', `Please contact the support team!!!` );
        }
    } );
};


//Get Data by Query
export const getSeasonByQuery = ( params, queryData ) => {
    return async dispatch => {
        await baseAxios.post( `${merchandisingApi.season.root}/grid?${convertQueryString( params )}`, queryData ).then( ( { data } ) => {
            if ( data.succeeded ) {
                dispatch( {
                    type: GET_SEASONS_BY_QUERY,
                    seasons: data.data,
                    totalPages: data.totalRecords,
                    params
                } );
            } else {
                notify( "error", "Something gonna Wrong!" );
            }
        } ).catch( e => {
            notify( 'warning', 'Server Side ERROR' );
        } );
    };
};


// ** Get Season by Id
export const getSeasonById = id => {
    return async dispatch => {
        await baseAxios
            .get( `${merchandisingApi.season.root}/${id}` )
            .then( ( response ) => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_SEASON_BY_ID,
                        selectedSeason: response.data ? response.data : null
                    } );
                } else {
                    notify( 'error', `'The Season couldn't find'` );
                }
            } )
            .catch( err => console.log( err ) );
    };
};


/// Selected Season Null after Edit or Edit Cancel
export const selectedSeasonNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_SEASON_NULL,
            selectedSeason: null
        } );
    };
};


// ** Add new Season
export const addSeason = season => {
    return async ( dispatch, getState ) => {
        await baseAxios
            .post( `${merchandisingApi.season.root}`, season )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: ADD_SEASON,
                        season
                    } );
                    notify( 'success', 'The Season has been added Successfully!' );
                    dispatch( getSeasonByQuery( getState().seasons.params, [] ) );
                    dispatch( handleOpenSeasonSidebar( false ) );
                } else {
                    notify( 'error', 'The Season has been added Failed!' );
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


// ** Update Season
export const updateSeason = season => {
    return ( dispatch, getState ) => {
        baseAxios
            .put( `${merchandisingApi.season.root}/${season.id}`, season )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: UPDATE_SEASON,
                        season
                    } );
                    notify( 'success', 'The Season has been updated Successfully!' );
                    dispatch( getSeasonByQuery( getState().seasons.params, [] ) );
                    dispatch( selectedSeasonNull() );
                    dispatch( handleOpenSeasonSidebarForEdit( false ) );
                } else {
                    notify( 'error', 'The Season has been updated Failed!' );
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

// ** Delete Season
export const deleteSeason = id => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                await baseAxios
                    .put( `${merchandisingApi.season.root}/archives/${id}` )
                    .then( response => {
                        if ( response.status === status.success ) {
                            dispatch( {
                                type: DELETE_SEASON
                            } );
                            notify( 'success', 'The Season has been deleted Successfully!' );
                            dispatch( getSeasonByQuery( getState().seasons.params, [] ) );
                        }
                    } )
                    .catch( err => console.log( err ) );
            }
        } );
    };
};


// ** Delete Season by Range
export const deleteRangeSeason = ids => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios
                    .delete( `${merchandisingApi.season.delete_season_by_range}`, { ids } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_SEASONS_BY_RANGE
                        } );
                    } )
                    .then( () => {
                        notify( 'success', 'Season has been deleted Successfully!' );
                        dispatch( getSeasonByQuery( getState().seasons.params ) );
                        dispatch( getAllSeasons() );
                    } );
            }
        } );
    };
};

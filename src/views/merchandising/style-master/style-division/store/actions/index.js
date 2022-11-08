import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import { merchandisingApi } from '../../../../../../services/api-end-points/merchandising';
import { confirmDialog } from "../../../../../../utility/custom/ConfirmDialog";
import { status } from "../../../../../../utility/enums";
import { convertQueryString } from "../../../../../../utility/Utils";
import { styleDivisionModel } from "../../model";
import { ADD_DIVISION, BIND_STYLE_DIVISION_DATA, DELETE_DIVISION, DELETE_DIVISIONS_BY_RANGE, DROP_DOWN_DIVISIONS, GET_DEPARTMENT_BY_DIVISION_ID, GET_DIVISIONS, GET_DIVISIONS_BY_QUERY, GET_DIVISION_BY_ID, IS_STYLE_DIVISION_DATA_LOADED, OPEN_DIVISION_SIDEBAR, OPEN_DIVISION_SIDEBAR_FOR_EDIT, SELECTED_DIVISION_NULL, UPDATE_DIVISION } from '../actionTypes';

const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};
export const isStyleDivisionDataLoad = () => ( dispatch, getState ) => {
    const { isDivisionDataLoaded } = getState().divisions;
    dispatch( {
        type: IS_STYLE_DIVISION_DATA_LOADED,
        isDivisionDataLoaded: !isDivisionDataLoaded
    } );
};


export const bindStyleDivisionData = ( styleDivision ) => dispatch => {
    if ( styleDivision ) {
        dispatch( {
            type: BIND_STYLE_DIVISION_DATA,
            styleDivision
        } );
    } else {
        dispatch( {
            type: BIND_STYLE_DIVISION_DATA,
            styleDivision: styleDivisionModel
        } );
    }

};


// ** Open  Division Sidebar
export const handleOpenDivisionSidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_DIVISION_SIDEBAR,
            openDivisionSidebar: condition
        } );
        dispatch( bindStyleDivisionData( null ) );

    };
};
// ** Open  Division Sidebar
export const handleOpenDivisionSidebarForEdit = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_DIVISION_SIDEBAR_FOR_EDIT,
            openDivisionSidebarForEdit: condition
        } );
        // dispatch( bindStyleDivisionData( null ) );
    };
};

export const getDepartmentsByDivisionId = ( divisionId ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.division.root}/${divisionId}/styleDepartments`;
    await baseAxios.get( apiEndPoint )
        .then( response => {
            const departments = response?.data;
            const { queryData } = getState().divisions;
            const updatedData = queryData.map( department => {
                if ( department.id === divisionId ) {
                    department['departments'] = departments;
                }
                return department;
            } );

            dispatch( {
                type: GET_DEPARTMENT_BY_DIVISION_ID,
                queryDataWithDepartments: updatedData
            } );
        } );
};

///Get All Division Without Query
export const getAllDivisions = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.division.root}` ).then( response => {
            dispatch( {
                type: GET_DIVISIONS,
                divisions: response.data
            } );
        } );
    };
};

/// Get All Division Without Query
export const getDropDownDivisions = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.division.root}` ).then( response => {
            dispatch( {
                type: DROP_DOWN_DIVISIONS,
                dropDownDivisions: response.data.data.map( item => ( { value: item.id, label: item.name } ) )
            } );
        } );
    };
};
//For Cascade
export const getCascadeDropDownDivisions = () => async dispatch => {
    dispatch( {
        type: DROP_DOWN_DIVISIONS,
        dropDownDivisions: [],
        isDropDownDivisionsLoaded: false
    } );
    await baseAxios.get( `${merchandisingApi.division.root}` )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: DROP_DOWN_DIVISIONS,
                    dropDownDivisions: response.data.data.map( item => ( { value: item.id, label: item.name } ) ),
                    isDropDownDivisionsLoaded: true
                } );
            }
        } ).catch( ( { response } ) => {
            dispatch( {
                type: DROP_DOWN_DIVISIONS,
                dropDownDivisions: [],
                isDropDownDivisionsLoaded: true
            } );
            if ( response === undefined || response?.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response?.data?.errors.join( ', ' )}` );
            }
        } );
};


//Get Data by Query
export const getDivisionByQuery = ( params, queryData ) => async dispatch => {
    dispatch( isStyleDivisionDataLoad() );
    await baseAxios.post( `${merchandisingApi.division.root}/grid?${convertQueryString( params )}`, queryData )
        .then( response => {
            if ( response.status === status.success ) {
                const { data } = response;
                dispatch( {
                    type: GET_DIVISIONS_BY_QUERY,
                    divisions: data.data,
                    totalPages: data.totalRecords,
                    params
                } );
                dispatch( isStyleDivisionDataLoad() );

            }
        } ).catch( ( { response } ) => {
            dispatch( isStyleDivisionDataLoad() );
            if ( response === undefined || response?.status === status.severError || response?.status === status.badRequest ) {
                notify( 'error', `Please contact the support team!!!` );
            }
        } );
};


// ** Get Division by Id
export const getDivisionById = id => {
    return async dispatch => {
        await baseAxios
            .get( `${merchandisingApi.division.root}/${id}` )
            .then( response => {
                if ( response.status === status.success ) {
                    const { data } = response;
                    dispatch( {
                        type: GET_DIVISION_BY_ID,
                        styleDivision: response.data ? {
                            id: data.id,
                            name: data.name,
                            description: data.description,
                            styleDepartments: data.styleDepartments?.map( department => ( {
                                value: department.id,
                                label: department.name
                            } ) )
                        } : styleDivisionModel
                    } );
                    dispatch( handleOpenDivisionSidebarForEdit( true ) );
                } else {
                    notify( 'error', `'The Style Division couldn't find'` );

                }

            } )
            .catch( err => console.log( err ) );
    };
};


/// Selected Division Null after Edit or Edit Cancel
export const selectedDivisionNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_DIVISION_NULL,
            selectedDivision: null
        } );
    };
};


// ** Add new Division
export const addDivision = division => {
    return async ( dispatch, getState ) => {
        await baseAxios
            .post( `${merchandisingApi.division.root}`, division )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: ADD_DIVISION,
                        division
                    } );
                    notify( 'success', 'The Division has been added Successfully!' );
                    dispatch( getDivisionByQuery( getState().divisions.params, [] ) );
                    dispatch( handleOpenDivisionSidebar( false ) );
                    dispatch( bindStyleDivisionData( null ) );
                } else {
                    notify( 'error', 'The Division has been added Failed!' );
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


// ** Update Division
export const updateDivision = division => {
    return ( dispatch, getState ) => {
        baseAxios
            .put( `${merchandisingApi.division.root}/${division.id}`, division )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: UPDATE_DIVISION,
                        division
                    } );
                    notify( 'success', 'The Division has been updated Successfully!' );
                    dispatch( getDivisionByQuery( getState().divisions.params, [] ) );
                    dispatch( handleOpenDivisionSidebarForEdit( false ) );
                    dispatch( bindStyleDivisionData( null ) );
                    dispatch( selectedDivisionNull() );
                } else {
                    notify( 'error', 'The Division has been updated Failed!' );
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

// ** Delete Division
export const deleteDivision = id => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                await baseAxios
                    .put( `${merchandisingApi.division.root}/archives/${id}` )
                    .then( response => {
                        if ( response.status === status.success ) {
                            dispatch( {
                                type: DELETE_DIVISION
                            } );
                            notify( 'success', 'The Division has been deleted Successfully!' );
                            dispatch( getDivisionByQuery( getState().divisions.params ) );
                        } else {

                            notify( 'error', 'The Division DELETE request has been failed!' );
                        }
                    } )
                    .catch( err => console.log( err ) );
            }
        } );

    };
};


// ** Delete Division by Range
export const deleteRangeDivision = ids => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios
                    .delete( `${merchandisingApi.division.delete_division_by_range}`, { ids } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_DIVISIONS_BY_RANGE
                        } );
                    } )
                    .then( () => {
                        notify( 'success', 'The Division has been deleted Successfully!' );
                        dispatch( getDivisionByQuery( getState().divisions.params ) );
                        dispatch( getAllDivisions() );

                    } );
            }
        } );

    };
};

import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
// import { axios } from "@services";
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { status } from "../../../../../utility/enums";
import { convertQueryString } from "../../../../../utility/Utils";
import { ADD_BUYER_DEPARTMENT, DELETE_BUYER_DEPARTMENT, DELETE_BUYER_DEPARTMENTS_BY_RANGE, DROP_DOWN_BUYER_DEPARTMENTS, GET_BUYER_DEPARTMENTS, GET_BUYER_DEPARTMENTS_BY_QUERY, GET_BUYER_DEPARTMENT_BY_ID, IS_BUYER_DEPARTMENT_DATA_LOADED, OPEN_BUYER_DEPARTMENT_SIDEBAR, OPEN_BUYER_DEPARTMENT_SIDEBAR_FOR_EDIT, SELECTED_BUYER_DEPARTMENT_NULL, UPDATE_BUYER_DEPARTMENT } from "../actionTypes";


const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};


export const isBuyerDepartmentDataLoad = () => ( dispatch, getState ) => {
    const { isBuyerDepartmentDataLoaded } = getState().buyerDepartments;
    dispatch( {
        type: IS_BUYER_DEPARTMENT_DATA_LOADED,
        isBuyerDepartmentDataLoaded: !isBuyerDepartmentDataLoaded
    } );
};


//Open Buyer Department Sidebar
export const handleOpenBuyerDepartmentSidebar = ( condition ) => {
    return async ( dispatch ) => {
        await dispatch( {
            type: OPEN_BUYER_DEPARTMENT_SIDEBAR,
            openBuyerDepartmentSidebar: condition
        } );
    };
};
//Open Buyer Department Sidebar
export const handleOpenBuyerDepartmentSidebarForEdit = ( condition ) => {
    return async ( dispatch ) => {
        await dispatch( {
            type: OPEN_BUYER_DEPARTMENT_SIDEBAR_FOR_EDIT,
            openBuyerDepartmentSidebarForEdit: condition
        } );
    };
};

///Get All without Query
export const getAllBuyerDepartments = () => async ( dispatch ) => {
    await baseAxios
        .get( `${merchandisingApi.buyerDepartment.get_buyer_departments}` )
        .then( ( response ) => {
            dispatch( {
                type: GET_BUYER_DEPARTMENTS,
                buyerDepartments: response.data
            } );
        } );
};


///Get All DropDown Buyer Department without query
export const getDropDownBuyerDepartments = () => async ( dispatch ) => {
    dispatch( {
        type: DROP_DOWN_BUYER_DEPARTMENTS,
        dropDownBuyerDepartments: [],
        isDropDownBuyerDepartmentsLoaded: false
    } );
    await baseAxios.get( `${merchandisingApi.buyerDepartment.root}` )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: DROP_DOWN_BUYER_DEPARTMENTS,
                    dropDownBuyerDepartments: response.data.data.map( ( item ) => ( {
                        value: item.id,
                        label: item.name,
                        description: item.description
                    } ) ),
                    isDropDownBuyerDepartmentsLoaded: true
                } );
            }
        } ).catch( ( { response } ) => {
            dispatch( {
                type: DROP_DOWN_BUYER_DEPARTMENTS,
                dropDownBuyerDepartments: [],
                isDropDownBuyerDepartmentsLoaded: false
            } );
            if ( response?.status === status.severError || response?.status === status.badRequest ) {
                notify( 'error', `Please contact the support team!!!` );
            }
        } );
};
//For Cascade
export const getCascadeDropDownBuyerDepartments = ( id ) => async dispatch => {
    if ( id ) {
        dispatch( {
            type: DROP_DOWN_BUYER_DEPARTMENTS,
            dropDownBuyerDepartments: [],
            isDropDownBuyerDepartmentsLoaded: false
        } );
        await baseAxios.get( `${merchandisingApi.buyerDepartment.get_buyers_departments_cascade_dropdown}/${id}/departments` )
            .then( response => {
                if ( response.status === status.success ) {
                    const dropDownData = response?.data?.map( ( item ) => ( {
                        value: item.id,
                        label: item.name
                    } ) );
                    dispatch( {
                        type: DROP_DOWN_BUYER_DEPARTMENTS,
                        dropDownBuyerDepartments: dropDownData,
                        isDropDownBuyerDepartmentsLoaded: true
                    } );
                }
            } );
    } else {
        dispatch( {
            type: DROP_DOWN_BUYER_DEPARTMENTS,
            dropDownBuyerDepartments: [],
            isDropDownBuyerDepartmentsLoaded: true
        } );
    }
};

//Get Data by Query
export const getBuyerDepartmentByQuery = ( params, queryData ) => async dispatch => {
    dispatch( isBuyerDepartmentDataLoad() );
    await baseAxios
        .post( `${merchandisingApi.buyerDepartment.root}/grid?${convertQueryString( params )}`, queryData )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_BUYER_DEPARTMENTS_BY_QUERY,
                    buyerDepartments: response.data.data,
                    totalPages: response.data.totalPages,
                    params
                } );
                dispatch( isBuyerDepartmentDataLoad() );
            } else {
                notify( 'error', 'Something gonna wrong!' );
            }

        } ).catch( ( { response } ) => {
            dispatch( isBuyerDepartmentDataLoad() );
            if ( response?.status === status.severError || response?.status === status.badRequest ) {
                notify( 'error', `Please contact the support team!!!` );
            }
        } );

};

//Get Buyer Department By ID
export const getBuyerDepartmentById = ( id ) => {
    return async ( dispatch ) => {
        await baseAxios
            .get( `${merchandisingApi.buyerDepartment.get_buyer_department_by_id}/${id}` )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_BUYER_DEPARTMENT_BY_ID,
                        selectedBuyerDepartment: response.data ? response.data : null
                    } );
                } else {
                    notify( 'error', `'The Buyer Department couldn't find'` );
                }

            } )
            .catch( ( err ) => console.log( err ) );
    };
};

///Selected Buyer Department Null after Edit or Cancel
export const selectedBuyerDepartmentNull = () => {
    return async ( dispatch ) => {
        await dispatch( {
            type: SELECTED_BUYER_DEPARTMENT_NULL,
            selectedBuyerDepartment: null
        } );
    };
};

// Add new Buyer Department
export const addBuyerDepartment = ( buyerDepartment ) => async ( dispatch, getState ) => {
    await baseAxios
        .post( `${merchandisingApi.buyerDepartment.add_buyer_department}`, buyerDepartment )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_BUYER_DEPARTMENT,
                    buyerDepartment
                } );
                notify( "success", "The Buyer Department has been added Successfully!" );
                dispatch( getBuyerDepartmentByQuery( getState().buyerDepartments.params, [] ) );
                dispatch( handleOpenBuyerDepartmentSidebar( false ) );
                dispatch( selectedBuyerDepartmentNull() );
            } else {
                notify( "error", "The Buyer Department has been added Failed!" );
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

// ** Update BuyerAgent
export const updateBuyerDepartment = ( buyerDepartment ) => async ( dispatch, getState ) => {
    await baseAxios
        .put( `${merchandisingApi.buyerDepartment.update_buyer_department}/${buyerDepartment.id}`, buyerDepartment )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_BUYER_DEPARTMENT,
                    buyerDepartment
                } );
                notify( "success", "The Buyer Department has been updated Successfully!" );
                dispatch( getBuyerDepartmentByQuery( getState().buyerDepartments.params, [] ) );
                dispatch( handleOpenBuyerDepartmentSidebarForEdit() );
            } else {
                notify( "error", "The Buyer Department has been updated Failed!" );
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

//Delete BuyerAgent
export const deleteBuyerDepartment = ( id ) => {
    return ( dispatch, getState ) => {

        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                await baseAxios
                    .delete( `${merchandisingApi.buyerDepartment.delete_buyer_department}`, { id } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_BUYER_DEPARTMENT
                        } );
                    } )
                    .then( () => {
                        notify( "success", "The Buyer Department has been updated Successfully!" );
                        dispatch( getBuyerDepartmentByQuery( getState().buyerDepartments.params ) );
                        dispatch( getAllBuyerDepartments() );
                    } );
            }
        } );

    };
};

//Delete Buyer Department by Range
export const deleteRangeBuyerDepartment = ( ids ) => {
    return ( dispatch, getState ) => {

        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios
                    .delete( `${merchandisingApi.buyerDepartment.delete_buyer_department_by_range}`, { ids } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_BUYER_DEPARTMENTS_BY_RANGE
                        } );
                    } )
                    .then( () => {
                        notify( "success", "The Buyer Department has been deleted Successfully!" );
                        dispatch( getBuyerDepartmentByQuery( getState().buyerDepartments.params ) );
                        dispatch( getAllBuyerDepartments() );
                    } );
            }
        } );

    };
};

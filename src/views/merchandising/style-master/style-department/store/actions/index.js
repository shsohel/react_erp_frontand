import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import { merchandisingApi } from '../../../../../../services/api-end-points/merchandising';
import { confirmDialog } from "../../../../../../utility/custom/ConfirmDialog";
import { status } from "../../../../../../utility/enums";
import { convertQueryString } from "../../../../../../utility/Utils";
import { styleDepartmentModel } from "../../model";
import { ADD_DEPARTMENT, BIND_STYLE_DEPARTMENT, DELETE_DEPARTMENT, DELETE_DEPARTMENTS_BY_RANGE, DEPARTMENT_INSTANT_CREATE, DROP_DOWN_DEPARTMENTS, GET_DEPARTMENTS, GET_DEPARTMENTS_BY_QUERY, GET_DEPARTMENT_BY_ID, GET_PRODUCT_CATEGORY_BY_DEPARTMENT_ID, IS_STYLE_DEPARTMENT_DATA_LOADED, OPEN_DEPARTMENT_SIDEBAR, OPEN_DEPARTMENT_SIDEBAR_FOR_EDIT, SELECTED_DEPARTMENT_NULL, UPDATE_DEPARTMENT } from '../actionTypes';


const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};

export const isStyleDepartmentDataLoad = () => ( dispatch, getState ) => {
    const { isStyleDepartmentDataLoaded } = getState().departments;
    dispatch( {
        type: IS_STYLE_DEPARTMENT_DATA_LOADED,
        isStyleDepartmentDataLoaded: !isStyleDepartmentDataLoaded
    } );
};


///Bind onchange Data For Style POST and PUT
export const bindStyleDepartmentData = ( styleDepartment ) => dispatch => {
    if ( styleDepartment ) {
        dispatch( {
            type: BIND_STYLE_DEPARTMENT,
            styleDepartment
        } );
    } else {
        dispatch( {
            type: BIND_STYLE_DEPARTMENT,
            styleDepartment: styleDepartmentModel
        } );
    }
};
export const getDepartmentProductCategories = ( departmentId ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.department.root}/${departmentId}/productCategories`;
    await baseAxios.get( apiEndPoint )
        .then( response => {
            const productCategories = response?.data;
            const { queryData } = getState().departments;
            const updatedData = queryData.map( department => {
                if ( department.id === departmentId ) {
                    department['productCategories'] = productCategories;
                }
                return department;
            } );

            dispatch( {
                type: GET_PRODUCT_CATEGORY_BY_DEPARTMENT_ID,
                queryDataWithProductCategory: updatedData
            } );
        } );
};


// ** Open  Department Sidebar
export const handleOpenDepartmentSidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_DEPARTMENT_SIDEBAR,
            openDepartmentSidebar: condition
        } );
        dispatch( bindStyleDepartmentData( null ) );
    };
};
// ** Open  Department Sidebar
export const handleOpenDepartmentSidebarForEdit = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_DEPARTMENT_SIDEBAR_FOR_EDIT,
            openDepartmentSidebarForEdit: condition
        } );
    };
};
///Get All Department Without Query
export const getAllDepartments = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.department.root}` ).then( response => {
            dispatch( {
                type: GET_DEPARTMENTS,
                departments: response.data
            } );
        } );
    };
};

/// Get All Department Without Query
export const getDropDownDepartments = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.department.root}` ).then( response => {
            console.log( response );
            dispatch( {
                type: DROP_DOWN_DEPARTMENTS,
                dropDownDepartments: response?.data?.data?.map( item => ( { value: item.id, label: item.name } ) )
            } );
        } );
    };
};

export const getCascadeDropDownDepartments = ( id ) => async dispatch => {
    if ( id ) {
        dispatch( {
            type: DROP_DOWN_DEPARTMENTS,
            dropDownDepartments: [],
            isDropDownDepartmentsLoaded: false
        } );
        await baseAxios.get( `${merchandisingApi.division.root}/${id}/styleDepartments` )
            .then( response => {
                if ( response.status === status.success ) {
                    const dropDownData = response?.data?.map( item => (
                        { value: item.id, label: item.name }
                    ) );
                    dispatch( {
                        type: DROP_DOWN_DEPARTMENTS,
                        dropDownDepartments: dropDownData,
                        isDropDownDepartmentsLoaded: true
                    } );
                }
            } );
    } else {
        dispatch( {
            type: DROP_DOWN_DEPARTMENTS,
            dropDownDepartments: [],
            isDropDownDepartmentsLoaded: true
        } );
    }

};

//Get Data by Query
export const getDepartmentByQuery = ( params, queryData ) => async dispatch => {
    dispatch( isStyleDepartmentDataLoad() );

    await baseAxios.post( `${merchandisingApi.department.root}/grid?${convertQueryString( params )}`, queryData )
        .then( response => {
            if ( response.status === status.success ) {
                const { data } = response;
                dispatch( {
                    type: GET_DEPARTMENTS_BY_QUERY,
                    departments: data.data,
                    totalPages: data.totalRecords,
                    params
                } );
                dispatch( isStyleDepartmentDataLoad() );

            }

        } ).catch( ( { response } ) => {
            dispatch( isStyleDepartmentDataLoad() );
            console.log( response );
            if ( response?.status === status.severError || response?.status === status.badRequest ) {
                notify( 'error', `Please contact the support team!!!` );
            }
        } );
};

// ** Get Department by Id
export const getDepartmentById = id => {
    return async dispatch => {
        await baseAxios
            .get( `${merchandisingApi.department.root}/${id}` )
            .then( response => {
                const { data } = response;
                if ( response.status === status.success ) {
                    const getObj = {
                        id: data.id,
                        name: data.name,
                        description: data.description,
                        productCategories: data.productCategories?.map( category => ( {
                            label: category.name,
                            value: category.id
                        } ) )
                    };
                    dispatch( {
                        type: GET_DEPARTMENT_BY_ID,
                        styleDepartment: response.data ? getObj : styleDepartmentModel
                    } );
                    dispatch( handleOpenDepartmentSidebarForEdit( true ) );
                } else {
                    notify( 'error', `'The Style Department couldn't find'` );
                }

            } )
            .catch( err => console.log( err ) );
    };
};

/// Selected Department Null after Edit or Edit Cancel
export const selectedDepartmentNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_DEPARTMENT_NULL,
            selectedDepartment: null
        } );
    };
};

// ** Add new Department
export const addDepartment = department => {
    return async ( dispatch, getState ) => {
        await baseAxios
            .post( `${merchandisingApi.department.root}`, department )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: ADD_DEPARTMENT,
                        lastCreatedId: response.data,
                        department
                    } );
                    notify( 'success', 'The Department has been added Successfully!' );
                    dispatch( handleOpenDepartmentSidebar( false ) );
                    dispatch( getDepartmentByQuery( getState().departments.params, [] ) );
                    dispatch( bindStyleDepartmentData( null ) );
                } else {
                    notify( 'error', 'The Department has been added Failed!' );
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
// ** Add new Department
export const departmentInstantCreate = department => {
    return async ( dispatch, getState ) => {
        await baseAxios
            .post( `${merchandisingApi.department.root}`, department )
            .then( response => {
                if ( response.status === status.success ) {
                    const { styleDivision } = getState().divisions;

                    dispatch( {
                        type: DEPARTMENT_INSTANT_CREATE,
                        lastCreatedId: response.data,
                        department
                    } );
                    notify( 'success', 'The Department has been added Successfully!' );
                    dispatch( handleOpenDepartmentSidebar( false ) );
                    //  dispatch( getDepartmentByQuery( getState().departments.params, [] ) );
                } else {
                    notify( 'error', 'The Department has been added Failed!' );
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

// ** Update Department
export const updateDepartment = department => {
    return ( dispatch, getState ) => {
        baseAxios
            .put( `${merchandisingApi.department.root}/${department.id}`, department )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: UPDATE_DEPARTMENT,
                        department
                    } );
                    notify( 'success', 'The Style Department has been updated Successfully!' );
                    dispatch( getDepartmentByQuery( getState().departments.params, [] ) );
                    dispatch( selectedDepartmentNull() );
                    dispatch( handleOpenDepartmentSidebarForEdit( false ) );
                } else {
                    notify( 'error', 'The Style Department has been updated Failed!' );
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

// ** Delete Department
export const deleteDepartment = id => {
    return ( dispatch, getState ) => {

        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                await baseAxios
                    .put( `${merchandisingApi.department.root}/archives/${id}` )
                    .then( response => {
                        if ( response.status === status.success ) {
                            dispatch( {
                                type: DELETE_DEPARTMENT
                            } );
                            notify( 'success', 'The Style Department has been deleted Successfully!' );
                            dispatch( getDepartmentByQuery( getState().departments.params ) );
                        } else {
                            notify( 'error', 'The Style Department DELETE request has been failed!' );
                        }
                    } )
                    .catch( err => console.log( err ) );
            }
        } );


    };
};

// ** Delete Department by Range
export const deleteRangeDepartment = ids => {
    return ( dispatch, getState ) => {

        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios
                    .delete( `${merchandisingApi.department.delete_department_by_range}`, { ids } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_DEPARTMENTS_BY_RANGE
                        } );
                    } )
                    .then( () => {
                        notify( 'success', 'The Style Department has been deleted Successfully!' );
                        dispatch( getDepartmentByQuery( getState().departments.params ) );
                        dispatch( getAllDepartments() );

                    } );
            }
        } );

    };
};

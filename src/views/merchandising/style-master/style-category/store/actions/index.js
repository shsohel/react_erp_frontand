import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import { merchandisingApi } from '../../../../../../services/api-end-points/merchandising';
import { confirmDialog } from "../../../../../../utility/custom/ConfirmDialog";
import { status } from "../../../../../../utility/enums";
import { convertQueryString } from "../../../../../../utility/Utils";
import { ADD_STYLE_CATEGORY, DELETE_STYLE_CATEGORY, DELETE_STYLE_CATEGORY_BY_RANGE, DROP_DOWN_STYLE_CATEGORIES, GET_STYLE_CATEGORIES, GET_STYLE_CATEGORIES_BY_QUERY, GET_STYLE_CATEGORY_BY_ID, IS_STYLE_CATEGORY_DATA_LOADED, OPEN_STYLE_CATEGORY_SIDEBAR, OPEN_STYLE_CATEGORY_SIDEBAR_FOR_EDIT, SELECTED_STYLE_CATEGORY_NULL, UPDATE_STYLE_CATEGORY } from '../actionTypes';


const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};

export const isStyleCategoryDataLoad = () => ( dispatch, getState ) => {
    const { isStyleCategoryDataLoaded } = getState().styleCategories;
    dispatch( {
        type: IS_STYLE_CATEGORY_DATA_LOADED,
        isStyleCategoryDataLoaded: !isStyleCategoryDataLoaded
    } );
};


// ** Open  Style Category Sidebar
export const handleOpenStyleCategorySidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_STYLE_CATEGORY_SIDEBAR,
            openStyleCategorySidebar: condition
        } );
    };
};
// ** Open  Style Category Sidebar
export const handleOpenStyleCategorySidebarForEdit = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_STYLE_CATEGORY_SIDEBAR_FOR_EDIT,
            openStyleCategorySidebarForEdit: condition
        } );
    };
};
///Get All Style Category Without Query
export const getAllStyleCategory = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.styleCategory.root}` ).then( response => {
            dispatch( {
                type: GET_STYLE_CATEGORIES,
                styleCategories: response.data
            } );
        } );
    };
};

/// Get All Style Category Without Query
export const getDropDownStyleCategories = () => async dispatch => {
    dispatch( {
        type: DROP_DOWN_STYLE_CATEGORIES,
        dropDownStyleCategories: [],
        isDropDownStyleCategoriesLoaded: false
    } );
    const apiEndPoint = `${merchandisingApi.styleCategory.root}`;
    await baseAxios.get( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: DROP_DOWN_STYLE_CATEGORIES,
                dropDownStyleCategories: response.data.data.map( item => ( { value: item.id, label: item.name } ) ),
                isDropDownStyleCategoriesLoaded: true
            } );
        }
    } ).catch( ( { response } ) => {
        dispatch( {
            type: DROP_DOWN_STYLE_CATEGORIES,
            dropDownStyleCategories: [],
            isDropDownStyleCategoriesLoaded: true
        } );
        if ( response?.status === status.severError || response?.status === status.badRequest ) {
            notify( 'error', `Please contact the support team!!!` );
        }
    } );
};

export const getCascadeDropDownStyleCategories = ( id ) => async dispatch => {
    if ( id ) {
        dispatch( {
            type: DROP_DOWN_STYLE_CATEGORIES,
            dropDownStyleCategories: [],
            isDropDownStyleCategoriesLoaded: false
        } );
        await baseAxios.get( `${merchandisingApi.productCategory.root}/${id}/styleCategories` )
            .then( response => {
                const dropDownData = response?.data?.map( item => ( {
                    value: item.id, label: item.name
                } ) );
                dispatch( {
                    type: DROP_DOWN_STYLE_CATEGORIES,
                    dropDownStyleCategories: dropDownData,
                    isDropDownStyleCategoriesLoaded: true
                } );
            } );
    } else {
        dispatch( {
            type: DROP_DOWN_STYLE_CATEGORIES,
            dropDownStyleCategories: [],
            isDropDownStyleCategoriesLoaded: true
        } );
    }
};

//Get Data by Query
export const getStyleCategoryByQuery = ( params, queryData ) => async dispatch => {
    dispatch( isStyleCategoryDataLoad() );
    await baseAxios.post( `${merchandisingApi.styleCategory.root}/grid?${convertQueryString( params )}`, queryData )
        .then( response => {
            const { data } = response;
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_STYLE_CATEGORIES_BY_QUERY,
                    styleCategories: data.data,
                    totalPages: data.totalPages,
                    params
                } );
                dispatch( isStyleCategoryDataLoad() );
            }

        } ).catch( ( { response } ) => {
            dispatch( isStyleCategoryDataLoad() );
            console.log( response );
            if ( response?.status === status.severError || response?.status === status.badRequest ) {
                notify( 'error', `Please contact the support team!!!` );
            }
        } );
};

// ** Get Style Category by Id
export const getStyleCategoryById = id => {
    return async dispatch => {
        await baseAxios
            .get( `${merchandisingApi.styleCategory.root}/${id}` )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_STYLE_CATEGORY_BY_ID,
                        selectedStyleCategory: response.data ? response.data : null
                    } );
                } else {
                    notify( 'error', `'The Style Category couldn't find'` );
                }

            } )
            .catch( err => console.log( err ) );
    };
};

/// Selected Style Category Null after Edit or Edit Cancel
export const selectedStyleCategoryNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_STYLE_CATEGORY_NULL,
            selectedStyleCategory: null
        } );
    };
};

// ** Add new Style Category
export const addStyleCategory = styleCategory => {
    return async ( dispatch, getState ) => {
        await baseAxios
            .post( `${merchandisingApi.styleCategory.root}`, styleCategory )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: ADD_STYLE_CATEGORY,
                        lastCreatedId: response.data,
                        styleCategory
                    } );
                    notify( 'success', 'The Style Category has been added Successfully!' );
                    dispatch( getStyleCategoryByQuery( getState().styleCategories.params, [] ) );
                    dispatch( handleOpenStyleCategorySidebar( false ) );
                } else {
                    notify( 'error', 'The Style Category has been added Failed!' );
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

// ** Update Style Category
export const updateStyleCategory = styleCategory => {
    return ( dispatch, getState ) => {
        baseAxios
            .put( `${merchandisingApi.styleCategory.root}/${styleCategory.id}`, styleCategory )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: UPDATE_STYLE_CATEGORY,
                        styleCategory
                    } );
                    notify( 'success', 'The Style Category has been updated Successfully!' );
                    dispatch( getStyleCategoryByQuery( getState().styleCategories.params, [] ) );
                    dispatch( handleOpenStyleCategorySidebarForEdit( false ) );
                    dispatch( selectedStyleCategoryNull() );
                } else {
                    notify( 'error', 'The Style Category has been updated Failed!' );
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

// ** Delete Style Category
export const deleteStyleCategory = id => {
    return ( dispatch, getState ) => {

        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                await baseAxios
                    .put( `${merchandisingApi.styleCategory.root}/archives/${id}` )
                    .then( response => {
                        if ( response.status === status.success ) {
                            dispatch( {
                                type: DELETE_STYLE_CATEGORY
                            } );
                            notify( 'success', 'The Style Category has been deleted Successfully!' );
                            dispatch( getStyleCategoryByQuery( getState().styleCategories.params ) );
                        } else {
                            notify( 'error', 'The Style Category DELETE request has been failed!' );
                        }

                    } )
                    .catch( err => console.log( err ) );

            }
        } );


    };
};

// ** Delete Style Category by Range
export const deleteRangeStyleCategory = ids => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios
                    .delete( `${merchandisingApi.styleCategory.root}`, { ids } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_STYLE_CATEGORY_BY_RANGE
                        } );
                    } )
                    .then( () => {
                        notify( 'success', 'Style Category has been deleted Successfully!' );
                        dispatch( getStyleCategoryByQuery( getState().styleCategories.params ) );
                        dispatch( getAllStyleCategory() );
                    } );
            }
        } );


    };
};

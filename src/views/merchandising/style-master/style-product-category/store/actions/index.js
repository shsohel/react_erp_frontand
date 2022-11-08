import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import { merchandisingApi } from '../../../../../../services/api-end-points/merchandising';
import { confirmDialog } from "../../../../../../utility/custom/ConfirmDialog";
import { status } from "../../../../../../utility/enums";
import { convertQueryString } from "../../../../../../utility/Utils";
import { styleProductCategoryModel } from "../../model";
import { ADD_PRODUCT_CATEGORY, BIND_STYLE_PRODUCT_CATEGORY_DATA, DELETE_PRODUCT_CATEGORY, DELETE_PRODUCT_CATEGORY_BY_RANGE, DELETE_STYLE_CATEGORY_FROM_PRODUCT_CATEGORY, DROP_DOWN_PRODUCT_CATEGORIES, GET_PRODUCT_CATEGORIES, GET_PRODUCT_CATEGORIES_BY_QUERY, GET_PRODUCT_CATEGORY_BY_ID, GET_STYLE_CATEGORY_BY_PRODUCT_CATEGORY_ID, IS_STYLE_PRODUCT_CATEGORY_DATA_LOADED, OPEN_PRODUCT_CATEGORY_SIDEBAR, OPEN_PRODUCT_CATEGORY_SIDEBAR_FOR_EDIT, SELECTED_PRODUCT_CATEGORY_NULL, UPDATE_PRODUCT_CATEGORY } from '../actionTypes';


const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};

export const styleProductCategoryData = () => ( dispatch, getState ) => {
    const { isStyleProductCategoryDataLoaded } = getState().productCategories;
    dispatch( {
        type: IS_STYLE_PRODUCT_CATEGORY_DATA_LOADED,
        isStyleProductCategoryDataLoaded: !isStyleProductCategoryDataLoaded
    } );
};

///Bind onchange Data For Style Product Category POST and PUT
export const bindStyleProductCategoryData = ( styleProductCategory ) => dispatch => {
    if ( styleProductCategory ) {
        dispatch( {
            type: BIND_STYLE_PRODUCT_CATEGORY_DATA,
            styleProductCategory
        } );
    } else {
        dispatch( {
            type: BIND_STYLE_PRODUCT_CATEGORY_DATA,
            styleProductCategory: styleProductCategoryModel
        } );
    }

};


// ** Open  Product Category Sidebar
export const handleOpenProductCategorySidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_PRODUCT_CATEGORY_SIDEBAR,
            openProductCategorySidebar: condition
        } );
        dispatch( bindStyleProductCategoryData( null ) );
    };
};
// ** Open  Product Category Sidebar
export const handleOpenProductCategorySidebarForEdit = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_PRODUCT_CATEGORY_SIDEBAR_FOR_EDIT,
            openProductCategorySidebarForEdit: condition
        } );
    };
};
///Get All Product Category Without Query
export const getAllProductCategory = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.productCategory.root}` ).then( response => {
            dispatch( {
                type: GET_PRODUCT_CATEGORIES,
                productCategories: response.data
            } );
        } );
    };
};

/// Get All Product Category Without Query
export const getDropDownProductCategories = () => async dispatch => {
    dispatch( {
        type: DROP_DOWN_PRODUCT_CATEGORIES,
        dropDownProductCategories: [],
        isDropDownProductCategoriesLoaded: false
    } );
    const apiEndPoint = `${merchandisingApi.productCategory.root}`;
    await baseAxios.get( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: DROP_DOWN_PRODUCT_CATEGORIES,
                dropDownProductCategories: response?.data?.data?.map( item => ( { value: item.id, label: item.name } ) ),
                isDropDownProductCategoriesLoaded: true
            } );
        }

    } ).catch( ( { response } ) => {
        dispatch( {
            type: DROP_DOWN_PRODUCT_CATEGORIES,
            dropDownProductCategories: [],
            isDropDownProductCategoriesLoaded: true
        } );
        if ( response?.status === status.severError || response.status === status.badRequest ) {
            notify( 'error', `Please contact the support team!!!` );
        }
    } );
};


export const getStyleCategoriesByProductCategoryId = ( productCategoryId ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.productCategory.root}/${productCategoryId}/styleCategories`;
    await baseAxios.get( apiEndPoint )
        .then( response => {
            const productCategories = response?.data;
            const { queryData } = getState().productCategories;
            const updatedData = queryData.map( productCategory => {
                if ( productCategory.id === productCategoryId ) {
                    productCategory['styleCategories'] = productCategories;
                }
                return productCategory;
            } );

            dispatch( {
                type: GET_STYLE_CATEGORY_BY_PRODUCT_CATEGORY_ID,
                queryDataWithStyleCategories: updatedData
            } );
        } );
};

export const getCascadeDropDownProductCategories = ( id ) => async dispatch => {
    if ( id ) {
        console.log( id );
        dispatch( {
            type: DROP_DOWN_PRODUCT_CATEGORIES,
            dropDownProductCategories: [],
            isDropDownProductCategoriesLoaded: false
        } );
        await baseAxios.get( `${merchandisingApi.department.root}/${id}/productCategories` )
            .then( response => {
                if ( response.status === status.success ) {
                    const dropDownData = response?.data?.map( item => ( {
                        value: item.id,
                        label: item.name
                    } ) );
                    dispatch( {
                        type: DROP_DOWN_PRODUCT_CATEGORIES,
                        dropDownProductCategories: dropDownData,
                        isDropDownProductCategoriesLoaded: true
                    } );
                }

            } );
    } else {
        dispatch( {
            type: DROP_DOWN_PRODUCT_CATEGORIES,
            dropDownProductCategories: [],
            isDropDownProductCategoriesLoaded: true
        } );
    }

};

//Get Data by Query
export const getProductCategoryByQuery = ( params, queryData ) => async dispatch => {
    dispatch( styleProductCategoryData() );
    await baseAxios.post( `${merchandisingApi.productCategory.root}/grid?${convertQueryString( params )}`, queryData )
        .then( response => {
            if ( response.status === status.success ) {
                const { data } = response;
                dispatch( {
                    type: GET_PRODUCT_CATEGORIES_BY_QUERY,
                    productCategories: data.data,
                    totalPages: data.totalPages,
                    params
                } );
                dispatch( styleProductCategoryData() );

            } else {
                notify( "error", "Something gonna Wrong!" );

            }

        } ).catch( ( { response } ) => {
            dispatch( styleProductCategoryData() );
            if ( response?.status === status.severError || response.status === status.badRequest ) {
                notify( 'error', `Please contact the support team!!!` );
            }
        } );
};

// ** Get Product Category by Id
export const getProductCategoryById = id => {
    return async dispatch => {
        await baseAxios
            .get( `${merchandisingApi.productCategory.root}/${id}` )
            .then( response => {
                if ( response.status === status.success ) {
                    const { data } = response;
                    const getObj = {
                        ...data,
                        styleCategories: data.styleCategories ? data.styleCategories.map( category => ( {
                            label: category.name,
                            value: category.id
                        } ) ) : []
                    };
                    dispatch( {
                        type: GET_PRODUCT_CATEGORY_BY_ID,
                        styleProductCategory: response.data ? getObj : styleProductCategoryModel
                    } );

                    dispatch( handleOpenProductCategorySidebarForEdit( true ) );
                } else {
                    notify( 'error', `'The Style Product Category couldn't find'` );

                }
            } )
            .catch( err => console.log( err ) );
    };
};

/// Selected Product Category Null after Edit or Edit Cancel
export const selectedProductCategoryNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_PRODUCT_CATEGORY_NULL,
            selectedProductCategory: null
        } );
    };
};

// ** Add new Product Category
export const addProductCategory = productCategory => {
    return async ( dispatch, getState ) => {
        await baseAxios
            .post( `${merchandisingApi.productCategory.root}`, productCategory )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: ADD_PRODUCT_CATEGORY,
                        lastCreatedId: response.data,
                        productCategory
                    } );
                    notify( 'success', 'The Product Category has been added Successfully!' );
                    dispatch( getProductCategoryByQuery( getState().productCategories.params, [] ) );
                    dispatch( handleOpenProductCategorySidebar( false ) );
                } else {
                    notify( 'error', 'The Product Category has been added Failed!' );
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

// ** Update Product Category
export const updateProductCategory = productCategory => {
    return ( dispatch, getState ) => {
        baseAxios
            .put( `${merchandisingApi.productCategory.root}/${productCategory.id}`, productCategory )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: UPDATE_PRODUCT_CATEGORY,
                        productCategory
                    } );
                    notify( 'success', 'The Product Category has been updated Successfully!' );
                    dispatch( getProductCategoryByQuery( getState().productCategories.params, [] ) );
                    dispatch( selectedProductCategoryNull() );
                    dispatch( handleOpenProductCategorySidebarForEdit( false ) );
                    dispatch( bindStyleProductCategoryData( null ) );
                } else {
                    notify( 'error', 'The Product Category has been updated Failed!' );
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

// ** Delete Product Category
export const deleteProductCategory = id => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                await baseAxios
                    .put( `${merchandisingApi.productCategory.root}/archives/${id}` )
                    .then( response => {
                        if ( response.status === status.success ) {
                            dispatch( {
                                type: DELETE_PRODUCT_CATEGORY
                            } );
                            notify( 'success', 'The Product Category has been deleted Successfully!' );
                            dispatch( getProductCategoryByQuery( getState().productCategories.params ) );

                        } else {
                            notify( 'error', 'The Product Category DELETE request has been failed!' );

                        }
                    } )
                    .catch( err => console.log( err ) );

            }
        } );
    };
};

// ** Delete Product Category by Range
export const deleteRangeProductCategory = ids => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios
                    .delete( `${merchandisingApi.productCategory.delete_product_category_by_range}`, { ids } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_PRODUCT_CATEGORY_BY_RANGE
                        } );
                    } )
                    .then( () => {
                        notify( 'success', 'Product Category has been deleted Successfully!' );
                        dispatch( getProductCategoryByQuery( getState().productCategories.params ) );
                        dispatch( getAllProductCategory() );
                    } );
            }
        } );
    };
};

// /api/merchandising/styles/styleDepartments/{id}/productCategories{styleCategoryId}
// ** Delete Style Category From Product Category
export const deleteStyleCategoryFromProductCategory = ( id, styleCategoryId ) => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                await baseAxios
                    .delete( `${merchandisingApi.productCategory.delete_style_category_from_product_category}/${id}/styleCategory/${styleCategoryId}` )
                    .then( response => {
                        dispatch( {
                            type: DELETE_STYLE_CATEGORY_FROM_PRODUCT_CATEGORY
                        } );
                    } )
                    .then( () => {
                        notify( 'success', 'The Style Category has been deleted Successfully!' );
                        dispatch( getProductCategoryByQuery( getState().productCategories.params ) );
                        dispatch( getAllProductCategory() );
                    } );
            }
        } );
    };
};

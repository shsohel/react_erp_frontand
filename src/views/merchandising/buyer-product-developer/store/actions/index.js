import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
// import { axios } from "@services";
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { baseUrl, confirmObj, status } from "../../../../../utility/enums";
import { convertQueryString } from "../../../../../utility/Utils";
import { productDeveloperModel } from "../../model";
import { ADD_BUYER_PRODUCT_DEVELOPER, BIND_PRODUCT_DEVELOPER_BASIC_INFO, DELETE_BUYER_PRODUCT_DEVELOPER, DELETE_BUYER_PRODUCT_DEVELOPER_BY_RANGE, DROP_DOWN_BUYER_PRODUCT_DEVELOPERS, GET_BUYER_PRODUCT_DEVELOPERS, GET_BUYER_PRODUCT_DEVELOPERS_BY_QUERY, GET_BUYER_PRODUCT_DEVELOPER_BY_ID, IS_PRODUCT_DEVELOPER_DATA_LOADED, OPEN_BUYER_PRODUCT_DEVELOPER_SIDEBAR, OPEN_BUYER_PRODUCT_DEVELOPER_SIDEBAR_FOR_EDIT, PRODUCT_DEV_IMAGE_UPLOADING, SELECTED_BUYER_PRODUCT_DEVELOPER_NULL, UPDATE_BUYER_PRODUCT_DEVELOPER } from "../actionTypes";


export const productDeveloperDataLoad = () => ( dispatch, getState ) => {
    const { isProductDeveloperDataLoaded } = getState().productDevelopers;
    dispatch( {
        type: IS_PRODUCT_DEVELOPER_DATA_LOADED,
        isProductDeveloperDataLoaded: !isProductDeveloperDataLoaded
    } );
};

//Open Product Developer Sidebar
export const handleOpenBuyerProductDeveloperSidebar = ( condition ) => {
    return async ( dispatch ) => {
        await dispatch( {
            type: OPEN_BUYER_PRODUCT_DEVELOPER_SIDEBAR,
            openProductDeveloperSidebar: condition
        } );
    };
};
//Open Product Developer Sidebar
export const handleOpenBuyerProductDeveloperSidebarForEdit = ( condition ) => {
    return async ( dispatch ) => {
        await dispatch( {
            type: OPEN_BUYER_PRODUCT_DEVELOPER_SIDEBAR_FOR_EDIT,
            openProductDeveloperSidebarForEdit: condition
        } );
    };
};
///Get All without Query
export const getAllBuyerProductDevelopers = () => {
    return async ( dispatch ) => {
        await baseAxios
            .get( `${merchandisingApi.productDeveloper.get_product_developers}` )
            .then( ( response ) => {
                dispatch( {
                    type: GET_BUYER_PRODUCT_DEVELOPERS,
                    productDevelopers: response.data
                } );
            } );
    };
};


///Get All DropDown Product Developer without query
export const getDropDownBuyerProductDevelopers = () => async ( dispatch ) => {
    dispatch( {
        type: DROP_DOWN_BUYER_PRODUCT_DEVELOPERS,
        dropDownProductDevelopers: [],
        isDropDownProductDevelopersLoaded: false
    } );
    await baseAxios
        .get( `${merchandisingApi.productDeveloper.root}` )
        .then( ( response ) => {
            dispatch( {
                type: DROP_DOWN_BUYER_PRODUCT_DEVELOPERS,
                dropDownProductDevelopers: response.data.data.map( ( item ) => ( {
                    value: item.id,
                    label: item.name,
                    email: item.email,
                    phoneNumber: item.phoneNumber
                } ) ),
                isDropDownProductDevelopersLoaded: true
            } );
        } ).catch( ( { response } ) => {
            dispatch( {
                type: DROP_DOWN_BUYER_PRODUCT_DEVELOPERS,
                dropDownProductDevelopers: [],
                isDropDownProductDevelopersLoaded: true
            } );
            if ( response?.status === status.severError || response === undefined ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};
//Cascade
export const getCascadeDropDownBuyerProductDevelopers = ( id ) => async dispatch => {
    if ( id ) {
        dispatch( {
            type: DROP_DOWN_BUYER_PRODUCT_DEVELOPERS,
            dropDownProductDevelopers: [],
            isDropDownProductDevelopersLoaded: false
        } );
        await baseAxios
            .get( `${merchandisingApi.productDeveloper.get_product_developers_cascade_dropdown}/${id}/productDevelopers` )
            .then( ( response ) => {
                const dropDownData = response?.data?.map( ( item ) => ( {
                    value: item.id,
                    label: item.name
                } ) );
                dispatch( {
                    type: DROP_DOWN_BUYER_PRODUCT_DEVELOPERS,
                    dropDownProductDevelopers: dropDownData,
                    isDropDownProductDevelopersLoaded: true
                } );
            } );
    } else {
        dispatch( {
            type: DROP_DOWN_BUYER_PRODUCT_DEVELOPERS,
            dropDownProductDevelopers: [],
            isDropDownProductDevelopersLoaded: true
        } );
    }

};

//Get Data by Query
export const getBuyerProductDeveloperByQuery = ( params, queryData ) => async dispatch => {
    dispatch( productDeveloperDataLoad() );
    await baseAxios
        .post( `${merchandisingApi.productDeveloper.root}/grid?${convertQueryString( params )}`, queryData )
        .then( response => {
            if ( response.status === status.success ) {
                const { data } = response;
                dispatch( {
                    type: GET_BUYER_PRODUCT_DEVELOPERS_BY_QUERY,
                    productDevelopers: data.data,
                    totalPages: data.totalPages,
                    params
                } );
                dispatch( productDeveloperDataLoad() );

            } else {
                notify( "error", "Something gonna Wrong!" );

            }

        } ).catch( ( { response } ) => {
            dispatch( productDeveloperDataLoad() );
            console.log( response );
            if ( response?.status === status.severError || response?.status === status.badRequest ) {
                notify( 'error', `Please contact the support team!!!` );
            }
        } );
};

//Get Product Developer By ID
export const getBuyerProductDeveloperById = ( id ) => {
    console.log( id );
    return async ( dispatch ) => {
        await baseAxios
            .get( `${merchandisingApi.productDeveloper.get_product_developer_by_id}/${id}` )
            .then( ( response ) => {
                if ( response.status === status.success ) {
                    const { data } = response;

                    dispatch( {
                        type: GET_BUYER_PRODUCT_DEVELOPER_BY_ID,
                        productDeveloperBasicInfo: response.data ? {
                            ...data,
                            city: data.city ? { label: data.city, value: data.city } : null,
                            state: data.state ? { label: data.state, value: data.state } : null,
                            country: data.country ? { label: data.country, value: data.country } : null,
                            imageUrl: response.data.imageUrl.length ? `${baseUrl}/${response.data.imageUrl}` : '',
                            imageEditUrl: ''
                        } : null
                    } );
                    dispatch( handleOpenBuyerProductDeveloperSidebarForEdit( true ) );
                } else {
                    notify( 'error', `'The Product developer couldn't find'` );
                }

            } )
            .catch( ( err ) => console.log( err ) );
    };
};

///Selected Product Developer Null after Edit or Cancel
export const selectedBuyerProductDeveloperNull = () => {
    return async ( dispatch ) => {
        await dispatch( {
            type: SELECTED_BUYER_PRODUCT_DEVELOPER_NULL,
            selectedProductDeveloper: null
        } );
    };
};

// Add new Product Developer
export const addBuyerProductDeveloper = ( productDeveloper ) => {
    return async ( dispatch, getState ) => {
        await baseAxios
            .post( `${merchandisingApi.productDeveloper.add_product_developer}`, productDeveloper )
            .then( ( response ) => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: ADD_BUYER_PRODUCT_DEVELOPER,
                        productDeveloper
                    } );
                    notify( "success", "The Product Developer has been added Successfully!" );
                    dispatch( getBuyerProductDeveloperByQuery( getState().productDevelopers.params, [] ) );
                    dispatch( handleOpenBuyerProductDeveloperSidebar( false ) );
                } else {
                    notify( "error", "The Product Developer has been added Successfully!" );
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

// ** Update Buyer Product Developer
export const updateBuyerProductDeveloper = ( productDeveloper, devId ) => {
    //console.log( JSON.stringify( productDeveloper, null, 2 ) );
    return ( dispatch, getState ) => {
        baseAxios
            .put( `${merchandisingApi.productDeveloper.update_product_developer}/${devId}`, productDeveloper )
            .then( ( response ) => {
                console.log( response );
                if ( response.status === status.success ) {
                    dispatch( {
                        type: UPDATE_BUYER_PRODUCT_DEVELOPER,
                        productDeveloper
                    } );
                    dispatch( getBuyerProductDeveloperByQuery( getState().productDevelopers.params, [] ) );
                    notify( "success", "The Product Developer has been updated Successfully!" );
                    dispatch( handleOpenBuyerProductDeveloperSidebarForEdit( false ) );
                    dispatch( selectedBuyerProductDeveloperNull() );
                } else {
                    notify( "error", "The Product Developer has been updated Failed!" );
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

//Delete BuyerAgent
export const deleteBuyerProductDeveloper = ( id ) => {
    return ( dispatch, getState ) => {

        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                await baseAxios
                    .delete( `${merchandisingApi.productDeveloper.delete_product_developer}`, { id } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_BUYER_PRODUCT_DEVELOPER
                        } );
                    } )
                    .then( () => {
                        notify( "success", "The Product Developer has been updated Successfully!" );
                        dispatch( getBuyerProductDeveloperByQuery( getState().productDevelopers.params ) );
                        dispatch( getAllBuyerProductDevelopers() );
                    } );
            }
        } );

    };
};

//Delete Product Developer by Range
export const deleteRangeBuyerProductDeveloper = ( ids ) => {
    return ( dispatch, getState ) => {

        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios
                    .delete( `${merchandisingApi.productDeveloper.delete_product_developer_by_range}`, { ids } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_BUYER_PRODUCT_DEVELOPER_BY_RANGE
                        } );
                    } )
                    .then( () => {
                        notify( "success", "The Product Developer has been deleted Successfully!" );
                        dispatch( getBuyerProductDeveloperByQuery( getState().productDevelopers.params ) );
                        dispatch( getAllBuyerProductDevelopers() );
                    } );
            }
        } );

    };
};


export const bindProductDeveloperBasicInfo = ( productDeveloperBasicInfo ) => dispatch => {
    if ( productDeveloperBasicInfo ) {
        dispatch( {
            type: BIND_PRODUCT_DEVELOPER_BASIC_INFO,
            productDeveloperBasicInfo
        } );
    } else {
        dispatch( {
            type: BIND_PRODUCT_DEVELOPER_BASIC_INFO,
            productDeveloperBasicInfo: productDeveloperModel
        } );
    }

};


export const productDeveloperImageUploadLoading = () => async ( dispatch, getState ) => {
    const { isProDevImageUploading } = getState().productDevelopers;
    dispatch( {
        type: PRODUCT_DEV_IMAGE_UPLOADING,
        isProDevImageUploading: !isProDevImageUploading
    } );

};

export const productDeveloperImageUpload = ( file, formData ) => async ( dispatch, getState ) => {
    dispatch( productDeveloperImageUploadLoading() );
    const path = `/api/merchandising/medias/upload/image`;
    // const apiEndPoint = `${merchandisingApi.buyer.root}/uploadImage`;
    await baseAxios.post( path, formData )
        .then( response => {
            console.log( response );
            if ( response.status === status.success ) {
                const { productDeveloperBasicInfo } = getState().productDevelopers;
                const updatedObj = {
                    ...productDeveloperBasicInfo,
                    imageEditUrl: URL.createObjectURL( file ),
                    image: response.data
                };
                dispatch( bindProductDeveloperBasicInfo( updatedObj ) );
                // dispatch( {
                //     type: AGENT_IMAGE_UPLOADING
                // } );
                dispatch( productDeveloperImageUploadLoading() );
            }
        } ).catch( ( { response } ) => {
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response.data.errors.join( ', ' )}` );
            }
            dispatch( productDeveloperImageUploadLoading() );
        } );
};

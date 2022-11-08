import { notify } from "@custom/notifications";
import { baseAxios } from "../../../../../services";
import { inventoryApi } from "../../../../../services/api-end-points/inventory";
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { baseUrl, confirmObj, status } from "../../../../../utility/enums";
import { convertQueryString, randomIdGenerator } from "../../../../../utility/Utils";
import { vendorBasicInfoModel, vendorContactInfoModel } from "../../model";
import { ADD_VENDOR, BIND_VENDOR_CONTACT_DATA_ONCHANGE, BIND_VENDOR_DATA_ONCHANGE, CLEAR_ALL_VENDOR_STATE, GET_VENDORS_BY_QUERY, GET_VENDORS_DROPDOWN, GET_VENDOR_BY_ID, IS_VENDOR_DATA_LOADED, IS_VENDOR_DATA_PROGRESS, IS_VENDOR_DATA_SUBMIT_PROGRESS, UPDATE_VENDOR, VENDOR_IMAGE_UPLOAD, VENDOR_IMAGE_UPLOAD_LOADING } from "../action-types";


export const vendorDataLoaded = ( condition ) => dispatch => {
    dispatch( {
        type: IS_VENDOR_DATA_LOADED,
        isVendorDataLoaded: condition
    } );
};

export const vendorDataOnProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_VENDOR_DATA_PROGRESS,
        isVendorDataOnProgress: condition
    } );
};
export const vendorDataSubmitProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_VENDOR_DATA_SUBMIT_PROGRESS,
        isVendorDataSubmitProgress: condition
    } );
};

export const bindVendorDataOnchange = ( vendorBasicInfo ) => dispatch => {
    if ( vendorBasicInfo ) {
        dispatch( {
            type: BIND_VENDOR_DATA_ONCHANGE,
            vendorBasicInfo
        } );
    } else {
        dispatch( {
            type: BIND_VENDOR_DATA_ONCHANGE,
            vendorBasicInfo: vendorBasicInfoModel
        } );
    }
};
export const bindVendorContactDataOnchange = ( vendorContactInfo ) => dispatch => {
    if ( vendorContactInfo ) {
        dispatch( {
            type: BIND_VENDOR_CONTACT_DATA_ONCHANGE,
            vendorContactInfo
        } );
    } else {
        dispatch( {
            type: BIND_VENDOR_CONTACT_DATA_ONCHANGE,
            vendorContactInfo: vendorContactInfoModel
        } );
    }
};

export const getVendorByQuery = ( params, queryData ) => async dispatch => {
    dispatch( vendorDataLoaded( false ) );
    const apiEndPoint = `${inventoryApi.vendor.root}/grid?${convertQueryString( params )}`;
    await baseAxios.post( apiEndPoint, queryData ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: GET_VENDORS_BY_QUERY,
                vendors: response.data.data,
                totalPages: response.data.totalPages,
                params
            } );
            dispatch( vendorDataLoaded( true ) );
        }
    } ).catch( ( ( { response } ) => {
        dispatch( vendorDataLoaded( true ) );

        if ( response?.status === status.badRequest || response?.status === status.notFound || response?.status === status.severError || response === undefined ) {
            notify( 'error', 'Please contact with Software Developer!' );
        } else if ( response?.status === status.conflict ) {
            notify( 'warning', `${response.statusText}` );
        }
    } ) );
};

export const getVendorById = ( id ) => async dispatch => {
    dispatch( vendorDataOnProgress( true ) );
    const apiEndPoint = `${inventoryApi.vendor.root}/${id}`;
    await baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                //    console.log( 'response.data', JSON.stringify( response.data, null, 2 ) );
                const { data } = response;
                const obj = {
                    ...data,
                    contacts: data.contacts.map( c => ( { ...c, rowId: randomIdGenerator() } ) ),
                    city: data.city ? { value: data.city, label: data.city } : null,
                    state: data.state ? { value: data.state, label: data.state } : null,
                    country: data.country ? { value: data.country, label: data.country } : null,
                    defaultCurrency: data.defaultCurrency ? { value: data.defaultCurrency, label: data.defaultCurrency } : null,
                    paymentTerm: data.paymentTerm ? { value: data.paymentTerm, label: data.paymentTerm } : null,
                    group: { value: data.groupId, label: data.group },
                    tags: data.tags.map( t => ( { value: t, label: t } ) ),
                    imageUrl: data.imageUrl.length ? `${baseUrl}/${data.imageUrl}` : data.imageUrl,
                    imageEditUrl: ''
                };
                dispatch( {
                    type: GET_VENDOR_BY_ID,
                    vendorBasicInfo: obj
                } );
                dispatch( vendorDataOnProgress( false ) );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( vendorDataOnProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

export const getVendorDropdown = () => {
    return async dispatch => {
        await baseAxios.get( `${inventoryApi.vendor.root}` ).then( response => {
            const dropdown = response.data.data.map( vendor => (
                {
                    ...vendor,
                    value: vendor.id,
                    label: vendor.name
                }
            ) );
            dispatch( {
                type: GET_VENDORS_DROPDOWN,
                vendorDropdown: dropdown
            } );
        } ).catch( ( ( { response } ) => {
            const { data } = response;
            console.log( response );
        } ) );
    };
};

export const addVendor = ( vendor, push ) => async dispatch => {
    dispatch( vendorDataOnProgress( true ) );

    const apiEndPoint = `${inventoryApi.vendor.root}`;
    await baseAxios.post( apiEndPoint, vendor )
        .then( response => {
            if ( response.status === status.success ) {
                console.log( response );
                dispatch( {
                    type: ADD_VENDOR
                } );
                notify( 'success', 'The Vendor has been added Successfully!' );
                push( { pathname: `/edit-vendor`, state: `${response.data}` } );

                dispatch( bindVendorContactDataOnchange( null ) );
                dispatch( bindVendorDataOnchange( null ) );
            } else {
                notify( 'error', 'The Vendor has been added failed!' );
            }
        } ).catch( ( { response } ) => {
            dispatch( vendorDataOnProgress( false ) );

            if ( response === undefined || response?.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response?.data?.errors.join( ', ' )}` );
            }
        } );
};

export const updateVendor = ( vendor, vendorId ) => async dispatch => {
    dispatch( vendorDataOnProgress( true ) );
    const apiEndPoint = `${inventoryApi.vendor.root}/${vendorId}`;
    await baseAxios.put( apiEndPoint, vendor )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_VENDOR
                } );
                notify( 'success', 'The Vendor has been updated Successfully!' );
                dispatch( getVendorById( vendorId ) );

            } else {
                notify( 'error', 'The Vendor has been updated failed!' );
            }
        } ).catch( ( { response } ) => {
            dispatch( vendorDataOnProgress( false ) );

            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

export const vendorImageUploadLoading = () => async ( dispatch, getState ) => {
    const { isImageUploading } = getState().vendors;
    dispatch( {
        type: VENDOR_IMAGE_UPLOAD_LOADING,
        isImageUploading: !isImageUploading
    } );

};

export const vendorImageUpload = ( file, formData ) => async ( dispatch, getState ) => {
    dispatch( vendorImageUploadLoading() );
    const apiEndPoint = `/api/inventory/medias/upload/image`;
    await baseAxios.post( apiEndPoint, formData )
        .then( response => {
            console.log( response );
            if ( response.status === status.success ) {
                const { vendorBasicInfo } = getState().vendors;
                const updatedObj = {
                    ...vendorBasicInfo,
                    photo: file,
                    imageEditUrl: URL.createObjectURL( file ),
                    image: response.data
                };
                dispatch( bindVendorDataOnchange( updatedObj ) );
                dispatch( {
                    type: VENDOR_IMAGE_UPLOAD
                } );
                dispatch( vendorImageUploadLoading() );
            }
        } ).catch( ( { response } ) => {
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response.data.errors.join( ', ' )}` );
            }
            dispatch( vendorImageUploadLoading() );
        } );
};


// Delete
export const deleteVendor = id => async ( dispatch, getState ) => {
    const apiEndPoint = `${inventoryApi.vendor.root}/${id}`;
    confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios.delete( apiEndPoint ).then( response => {
                if ( response.status === status.success ) {
                    notify( 'success', 'The Vendor has been deleted Successfully!' );
                    dispatch( getVendorByQuery( getState().vendors.params, [] ) );
                }
            } ).catch( ( ( { response } ) => {
                if ( response.status === status.badRequest ) {
                    notify( 'error', `${response.data.errors.join( ', ' )}` );
                }
                if ( response.status === status.notFound || response.status === status.severError ) {
                    notify( 'error', 'Please contact with Software Developer!' );
                }
                if ( response.status === status.conflict ) {
                    notify( 'warning', `${response.statusText}` );
                }
            } ) );
        }
    } );
};

export const clearAllVendorState = () => dispatch => {
    dispatch( {
        type: CLEAR_ALL_VENDOR_STATE
    } );
};

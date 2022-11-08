import { vendorBasicInfoModel, vendorContactInfoModel } from "../../model";
import { ADD_VENDOR, BIND_VENDOR_CONTACT_DATA_ONCHANGE, BIND_VENDOR_DATA_ONCHANGE, CLEAR_ALL_VENDOR_STATE, GET_VENDORS_BY_QUERY, GET_VENDORS_DROPDOWN, GET_VENDOR_BY_ID, IS_VENDOR_DATA_LOADED, IS_VENDOR_DATA_PROGRESS, IS_VENDOR_DATA_SUBMIT_PROGRESS, UPDATE_VENDOR, VENDOR_IMAGE_UPLOAD_LOADING } from "../action-types";


// export const vendorDataLoaded = ( condition ) => dispatch => {
//     dispatch( {
//         type: IS_VENDOR_DATA_LOADED,
//         isVendorDataLoaded: condition
//     } );
// };

// export const vendorDataOnProgress = ( condition ) => dispatch => {
//     dispatch( {
//         type: IS_VENDOR_DATA_PROGRESS,
//         isVendorDataOnProgress: condition
//     } );
// };
// export const vendorDataSubmitProgress = ( condition ) => dispatch => {
//     dispatch( {
//         type: IS_VENDOR_DATA_SUBMIT_PROGRESS,
//         isVendorDataSubmitProgress: condition
//     } );
// };


const initialState = {
    isVendorDataLoaded: true,
    isVendorDataOnProgress: false,
    isVendorDataSubmitProgress: false,
    vendors: [],
    queryData: [],
    total: 1,
    params: {},
    selectedVendor: null,
    vendorBasicInfo: vendorBasicInfoModel,
    vendorContactInfo: vendorContactInfoModel,
    vendorDropdown: [],
    isVendorDataLoading: false,
    isImageUploading: false
};

const vendorReducers = ( state = initialState, action ) => {
    switch ( action.type ) {
        case IS_VENDOR_DATA_LOADED:
            return {
                ...state,
                isVendorDataLoaded: action.isVendorDataLoaded
            };
        case IS_VENDOR_DATA_PROGRESS:
            return {
                ...state,
                isVendorDataOnProgress: action.isVendorDataOnProgress
            };
        case IS_VENDOR_DATA_SUBMIT_PROGRESS:
            return {
                ...state,
                isVendorDataSubmitProgress: action.isVendorDataSubmitProgress
            };
        case GET_VENDORS_BY_QUERY:
            return {
                ...state,
                queryData: action.vendors,
                total: action.totalPages,
                params: action.params
            };
        case GET_VENDOR_BY_ID:
            return { ...state, vendorBasicInfo: action.vendorBasicInfo };
        case GET_VENDORS_DROPDOWN:
            return { ...state, vendorDropdown: action.vendorDropdown };
        case BIND_VENDOR_DATA_ONCHANGE:
            return { ...state, vendorBasicInfo: action.vendorBasicInfo };
        case BIND_VENDOR_CONTACT_DATA_ONCHANGE:
            return { ...state, vendorContactInfo: action.vendorContactInfo };
        case ADD_VENDOR:
            return { ...state };
        case UPDATE_VENDOR:
            return { ...state };
        case VENDOR_IMAGE_UPLOAD_LOADING:
            return { ...state, isImageUploading: action.isImageUploading };
        case CLEAR_ALL_VENDOR_STATE:
            return {
                ...state,
                isVendorDataLoaded: true,
                isVendorDataOnProgress: false,
                isVendorDataSubmitProgress: false,
                vendors: [],
                queryData: [],
                total: 1,
                params: {},
                selectedVendor: null,
                vendorBasicInfo: vendorBasicInfoModel,
                vendorContactInfo: vendorContactInfoModel,
                vendorDropdown: [],
                isVendorDataLoading: false,
                isImageUploading: false
            };
        default:
            return state;
    }
};

export default vendorReducers;
import { packagingInfoModel, setPackagingInfoModel } from "../../models";
import {
    ADD_SET_PACKAGING,
    ADD_SINGLE_PACKAGING,
    BIND_SET_PACKAGING_BASIC_INFO,
    BIND_SET_PACKAGING_STYLE_SIZE_DETAILS,
    BIND_SINGLE_PACKAGING_BASIC_INFO,
    BIND_SINGLE_PACKAGING_COLOR_SIZE_DETAILS,
    CLEAR_PACKAGING_ALL_STATE,
    DELETE_SET_PACKAGING,
    DELETE_SET_PACKAGING_BY_RANGE,
    DELETE_SINGLE_PACKAGING,
    DELETE_SINGLE_PACKAGING_BY_RANGE,
    GET_PACKAGING_COLOR_DROPDOWN,
    GET_PACKAGING_PURCHASER_ORDERS,
    GET_PACKAGING_SIZE_COLOR_DROPDOWN, GET_PACKAGING_SIZE_DROPDOWN, GET_SET_PACKAGING_BY_ID,
    GET_SET_PACKAGING_DETAILS,
    GET_SINGLE_PACKAGING_BY_ID,
    GET_SINGLE_PACKAGING_DETAILS,
    GET_UOM_DROPDOWN_BY_UOM_SET_NAME,
    SET_PACKAGING_ACCESSORIES_DETAILS,
    SINGLE_PACKAGING_ACCESSORIES_DETAILS,
    UPDATE_SET_PACKAGING,
    UPDATE_SINGLE_PACKAGING
} from "../action-types";


const initialState = {
    packagingInfo: packagingInfoModel,
    setPackagingInfo: setPackagingInfoModel,

    singlePackingColorSizeDetails: [],
    setPackingStyleSizeDetails: [],

    singlePackagingDetails: [],
    singlePackagingAccessoriesDetails: [],

    setPackagingDetails: [],
    setPackaging: [],

    setPackagingAccessoriesDetails: [],
    packagingColorDropdown: [],
    packagingSizeDropdown: [],
    packagingPurchaseOrders: [],
    dropdownUom: []
};

const packagingReducers = ( state = initialState, action ) => {
    switch ( action.type ) {

        case GET_SINGLE_PACKAGING_BY_ID:
            return {
                ...state,
                packagingInfo: action.packagingInfo,
                singlePackagingAccessoriesDetails: action.singlePackagingAccessoriesDetails,
                singlePackingColorSizeDetails: action.singlePackingColorSizeDetails
            };

        case BIND_SINGLE_PACKAGING_BASIC_INFO:
            return { ...state, packagingInfo: action.packagingInfo };

        case BIND_SET_PACKAGING_BASIC_INFO:
            return { ...state, setPackagingInfo: action.setPackagingInfo };


        case BIND_SINGLE_PACKAGING_COLOR_SIZE_DETAILS:
            return { ...state, singlePackingColorSizeDetails: action.singlePackingColorSizeDetails };

        case BIND_SET_PACKAGING_STYLE_SIZE_DETAILS:
            return { ...state, setPackingStyleSizeDetails: action.setPackingStyleSizeDetails };

        case GET_SINGLE_PACKAGING_DETAILS:
            return { ...state, singlePackagingDetails: action.singlePackagingDetails };

        case GET_SET_PACKAGING_DETAILS:
            return { ...state, setPackagingDetails: action.setPackagingDetails };

        case GET_PACKAGING_SIZE_COLOR_DROPDOWN:
            return {
                ...state,
                packagingColorDropdown: action.packagingColorDropdown,
                packagingSizeDropdown: action.packagingSizeDropdown
            };

        case GET_PACKAGING_SIZE_DROPDOWN:
            return {
                ...state,
                packagingSizeDropdown: action.packagingSizeDropdown
            };

        case GET_PACKAGING_COLOR_DROPDOWN:
            return {
                ...state,
                packagingColorDropdown: action.packagingColorDropdown
            };

        case GET_PACKAGING_PURCHASER_ORDERS:
            return {
                ...state,
                packagingPurchaseOrders: action.packagingPurchaseOrders
            };

        case GET_SET_PACKAGING_BY_ID:
            return {
                ...state,
                setPackagingInfo: action.setPackagingInfo,
                setPackingStyleSizeDetails: action.setPackingStyleSizeDetails,
                setPackagingAccessoriesDetails: action.setPackagingAccessoriesDetails
            };

        case SINGLE_PACKAGING_ACCESSORIES_DETAILS:
            return { ...state, singlePackagingAccessoriesDetails: action.singlePackagingAccessoriesDetails };

        case SET_PACKAGING_ACCESSORIES_DETAILS:
            return { ...state, setPackagingAccessoriesDetails: action.setPackagingAccessoriesDetails };

        case GET_UOM_DROPDOWN_BY_UOM_SET_NAME:
            return { ...state, dropdownUom: action.dropdownUom };
        case ADD_SINGLE_PACKAGING:
            return { ...state };
        case UPDATE_SINGLE_PACKAGING:
            return { ...state };
        case DELETE_SINGLE_PACKAGING:
            return { ...state };
        case DELETE_SINGLE_PACKAGING_BY_RANGE:
            return { ...state };

        case ADD_SET_PACKAGING:
            return { ...state };
        case UPDATE_SET_PACKAGING:
            return { ...state };
        case DELETE_SET_PACKAGING:
            return { ...state };
        case DELETE_SET_PACKAGING_BY_RANGE:
            return { ...state };
        case CLEAR_PACKAGING_ALL_STATE:
            return {
                ...state,
                packagingInfo: packagingInfoModel,
                setPackagingInfo: setPackagingInfoModel,

                singlePackingColorSizeDetails: [],
                setPackingStyleSizeDetails: [],

                singlePackagingDetails: [],
                singlePackagingAccessoriesDetails: [],

                setPackagingDetails: [],
                setPackaging: [],

                setPackagingAccessoriesDetails: [],
                packagingColorDropdown: [],
                packagingSizeDropdown: []
            };
        default:
            return state;
    }


};

export default packagingReducers;
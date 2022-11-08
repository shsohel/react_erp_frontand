import { consumptionBasicInfoModel } from '../../model';
import { ADD_CONSUMPTION, CLEAN_CONSUMPTION_ALL_STATE, CLONE_CONSUMPTION, CONSUMPTION_PURCHASE_ORDER_DATA_ON_PROGRESS, DELETE_CONSUMPTION, DELETE_CONSUMPTIONS_BY_RANGE, DROP_DOWN_CONSUMPTIONS, GET_CONSUMPTIONS, GET_CONSUMPTIONS_BY_QUERY, GET_CONSUMPTION_ACCESSORIES_DETAILS, GET_CONSUMPTION_BASIC_INFO, GET_CONSUMPTION_BY_ID, GET_CONSUMPTION_DETAILS_COLOR_SIZE_SENSE, GET_CONSUMPTION_FABRIC_DETAILS, GET_CONSUMPTION_ORDER_DERAILS, GET_CONSUMPTION_PACKAGING_ACCESSORIES_DETAILS, GET_CONSUMPTION_PURCHASE_ORDER_COLORS, GET_CONSUMPTION_PURCHASE_ORDER_SIZES, GET_CONSUMPTION_STYLE_PURCHASE_ORDER_DETAILS, GET_COSTING_HISTORY_FOR_CONSUMPTION, GET_PACK_CONSUMPTION_BY_ID, GET_SET_CONSUMPTION_BY_ID, GET_SET_CONSUMPTION_STYLE_PURCHASE_ORDER_DETAILS, IS_CONSUMPTION_DATA_LOADED, SIZE_COLOR_SENSE_DATA_ON_PROGRESS, UPDATE_CONSUMPTION } from '../action-types';

// export const CONSUMPTION_PURCHASE_ORDER_DATA_ON_PROGRESS = "CONSUMPTION_PURCHASE_ORDER_DATA_ON_PROGRESS";

const initialState = {
    isConsumptionDataLoaded: true,
    consumptions: [],
    queryData: [],
    queryObj: [],
    total: 1,
    params: {},
    selectedConsumption: null,
    selectedSetConsumption: null,
    dropDownConsumptions: [],
    consumptionBasicInfo: consumptionBasicInfoModel,
    consumptionFabricDetails: [],

    consumptionAccessoriesDetails: [],
    consumptionPackagingAccessories: [],

    consumptionDetailsSizeSens: null,
    consumptionDetailsColorSens: null,
    consumptionPurchaseOrderColors: [],
    consumptionPurchaseOrderSizes: [],
    consumptionPurchaseOrderDetails: [],
    isConsumptionPurchaseOrderDetailsDataProgress: false,
    setConsumptionStylePurchaseOrderDetails: [],

    consumptionPackOrderDetails: [],
    isSizeColorSenseDataOnProgress: false

};

const consumptionReducers = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_CONSUMPTIONS:
            return { ...state, consumptions: action.consumptions };
        case GET_CONSUMPTION_BY_ID:
            return {
                ...state,
                consumptionBasicInfo: action.consumptionBasicInfo,
                consumptionFabricDetails: action.consumptionFabricDetails,
                consumptionAccessoriesDetails: action.consumptionAccessoriesDetails,
                consumptionPackagingAccessories: action.consumptionPackagingAccessories
            };
        case GET_PACK_CONSUMPTION_BY_ID:
            return {
                ...state,
                consumptionBasicInfo: action.consumptionBasicInfo,
                consumptionPackagingAccessories: action.consumptionPackagingAccessories
            };
        case GET_SET_CONSUMPTION_BY_ID:
            return {
                ...state,
                consumptionBasicInfo: action.consumptionBasicInfo,
                consumptionFabricDetails: action.consumptionFabricDetails,
                consumptionAccessoriesDetails: action.consumptionAccessoriesDetails,
                consumptionPackagingAccessories: action.consumptionPackagingAccessories
            };
        case DROP_DOWN_CONSUMPTIONS:
            return { ...state, dropDownConsumptions: action.dropDownConsumptions };
        case SIZE_COLOR_SENSE_DATA_ON_PROGRESS:
            return { ...state, isSizeColorSenseDataOnProgress: action.isSizeColorSenseDataOnProgress };
        case GET_CONSUMPTION_BASIC_INFO:
            return { ...state, consumptionBasicInfo: action.consumptionBasicInfo };

        case GET_CONSUMPTION_FABRIC_DETAILS:
            return { ...state, consumptionFabricDetails: action.consumptionFabricDetails };

        case GET_CONSUMPTION_ACCESSORIES_DETAILS:
            return { ...state, consumptionAccessoriesDetails: action.consumptionAccessoriesDetails };

        case GET_CONSUMPTION_PACKAGING_ACCESSORIES_DETAILS:
            return { ...state, consumptionPackagingAccessories: action.consumptionPackagingAccessories };

        case GET_CONSUMPTION_STYLE_PURCHASE_ORDER_DETAILS:
            return { ...state, consumptionPurchaseOrderDetails: action.consumptionPurchaseOrderDetails };
        case CONSUMPTION_PURCHASE_ORDER_DATA_ON_PROGRESS:
            return { ...state, isConsumptionPurchaseOrderDetailsDataProgress: action.isConsumptionPurchaseOrderDetailsDataProgress };

        case GET_SET_CONSUMPTION_STYLE_PURCHASE_ORDER_DETAILS:
            return { ...state, setConsumptionStylePurchaseOrderDetails: action.setConsumptionStylePurchaseOrderDetails };


        case GET_COSTING_HISTORY_FOR_CONSUMPTION:
            return {
                ...state,
                consumptionAccessoriesDetails: action.consumptionAccessoriesDetails,
                consumptionFabricDetails: action.consumptionFabricDetails
            };

        case GET_CONSUMPTION_DETAILS_COLOR_SIZE_SENSE:
            return {
                ...state,
                consumptionDetailsSizeSens: action.consumptionDetailsSizeSens,
                consumptionDetailsColorSens: action.consumptionDetailsColorSens
            };

        case GET_CONSUMPTION_PURCHASE_ORDER_COLORS:
            return {
                ...state,
                consumptionPurchaseOrderColors: action.consumptionPurchaseOrderColors
            };

        case GET_CONSUMPTION_PURCHASE_ORDER_SIZES:
            return {
                ...state,
                consumptionPurchaseOrderSizes: action.consumptionPurchaseOrderSizes
            };
        case GET_CONSUMPTION_ORDER_DERAILS:
            return {
                ...state,
                consumptionPackOrderDetails: action.consumptionPackOrderDetails
            };

        case GET_CONSUMPTIONS_BY_QUERY:
            return {
                ...state,
                queryData: action.consumptions,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case ADD_CONSUMPTION:
            return { ...state };
        case UPDATE_CONSUMPTION:
            return { ...state };
        case DELETE_CONSUMPTION:
            return { ...state };
        case DELETE_CONSUMPTIONS_BY_RANGE:
            return { ...state };
        case IS_CONSUMPTION_DATA_LOADED:
            return { ...state, isConsumptionDataLoaded: action.isConsumptionDataLoaded };
        case CLONE_CONSUMPTION:
            return {
                ...state,
                consumptionBasicInfo: action.consumptionBasicInfo,
                consumptionFabricDetails: action.consumptionFabricDetails,
                consumptionAccessoriesDetails: action.consumptionAccessoriesDetails,
                consumptionPackagingAccessories: action.consumptionPackagingAccessories
            };
        case CLEAN_CONSUMPTION_ALL_STATE:
            return {
                isConsumptionDataLoaded: true,
                consumptions: [],
                queryData: [],
                total: 1,
                params: {},
                selectedConsumption: null,
                selectedSetConsumption: null,
                dropDownConsumptions: [],
                consumptionBasicInfo: consumptionBasicInfoModel,
                consumptionFabricDetails: [],
                consumptionAccessoriesDetails: [],
                consumptionDetailsSizeSens: null,
                consumptionDetailsColorSens: null,
                consumptionPurchaseOrderDetails: [],
                consumptionPurchaseOrderColors: [],
                consumptionPurchaseOrderSizes: [],
                setConsumptionStylePurchaseOrderDetails: [],
                consumptionPackagingAccessories: [],
                consumptionPackOrderDetails: []

            };
        default:
            return state;
    }
};

export default consumptionReducers;
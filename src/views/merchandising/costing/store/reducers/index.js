import { cmCalculationForMachine, cmCalculationForSMV, costingBasicInfoModel, costingGroupsSummaryModel } from "../../model";
import { ADD_COSTING, CLEAR_ALL_COSTING_STATE, COSTING_ACCESSORIES_DETAILS, COSTING_BASIC_INFO, COSTING_CLONE, COSTING_CM_CALCULATION_FOR_MACHINE, COSTING_CM_CALCULATION_FOR_SMV, COSTING_FABRIC_DETAILS, COSTING_GROUP_FOR_COSTING, DELETE_COSTING, DELETE_COSTINGS_BY_RANGE, DROP_DOWN_COSTINGS, GET_COSTINGS, GET_COSTINGS_BY_QUERY, GET_COSTING_BY_ID, GET_COSTING_DROPDOWN_BY_ORDER_ID_AND_STYLE_ID, GET_COSTING_SIZE_GROUP_AND_COLORS_HISTORY, GET_COSTING_STYLES_PURCHASE_ORDER_DETAILS, GET_SET_COSTING_BY_ID, GET_SET_COSTING_STYLES_PURCHASE_ORDER_DETAILS, GET_SET_STYLE_PREVIOUS_COSTING_HISTORY, GET_STYLES_DROP_DOWN_BY_PURCHASE_ORDER_ID, GET_STYLE_COSTING_DETAILS, GET_STYLE_DEFAULT_CATEGORY, IS_COSTING_DATA_LOADED, IS_COSTING_DATA_PROGRESS, SELECTED_COSTING_NULL, UPDATE_COSTING } from "../action-types";


const initialState = {
    isCostingDataLoaded: true,
    isCostingDataProgress: false,
    costings: [],
    queryData: [],
    queryObj: [],
    total: 1,
    params: {},
    selectedCosting: null,
    selectedSetCosting: null,
    dropDownDownCostings: null,
    costingBasicInfo: costingBasicInfoModel,
    costingGroupsSummary: costingGroupsSummaryModel,
    costingAccessoriesDetails: [],
    costingFabricDetails: [],
    cmCalculationForSMV,
    cmCalculationForMachine,
    purchaseOrderStylesDropdown: [],
    setStyleCostingPreviousHistory: [],
    costingSizeGroupColorHistory: null,
    costingDropdownByOrderIdAndStyleId: [],
    costingStylePurchaseOrderDetails: [],
    isCostingStylePurchaseOrderDetailsLoaded: true,
    setCostingStylePurchaseOrderDetails: [],
    stylesCostingDetails: [],
    styleDefaultCategory: null
};

const costingReducers = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_COSTINGS:
            return { ...state, preCostings: action.preCostings };
        case GET_SET_COSTING_BY_ID:
            return { ...state, costingBasicInfo: action.costingBasicInfo, stylesCostingDetails: action.stylesCostingDetails };
        case GET_COSTING_BY_ID:
            return { ...state, costingBasicInfo: action.costingBasicInfo };
        case SELECTED_COSTING_NULL:
            return { ...state, selectedCosting: action.selectedCosting };
        case DROP_DOWN_COSTINGS:
            return { ...state, dropDownDownCostings: action.dropDownDownCostings };
        case GET_COSTING_DROPDOWN_BY_ORDER_ID_AND_STYLE_ID:
            return { ...state, costingDropdownByOrderIdAndStyleId: action.costingDropdownByOrderIdAndStyleId };
        case GET_STYLES_DROP_DOWN_BY_PURCHASE_ORDER_ID:
            return { ...state, purchaseOrderStylesDropdown: action.purchaseOrderStylesDropdown };
        case GET_SET_STYLE_PREVIOUS_COSTING_HISTORY:
            return { ...state, setStyleCostingPreviousHistory: action.setStyleCostingPreviousHistory };
        case GET_COSTING_SIZE_GROUP_AND_COLORS_HISTORY:
            return { ...state, costingSizeGroupColorHistory: action.costingSizeGroupColorHistory };
        case GET_COSTING_STYLES_PURCHASE_ORDER_DETAILS:
            return {
                ...state,
                costingStylePurchaseOrderDetails: action.costingStylePurchaseOrderDetails,
                isCostingStylePurchaseOrderDetailsLoaded: action.isCostingStylePurchaseOrderDetailsLoaded
            };
        case GET_SET_COSTING_STYLES_PURCHASE_ORDER_DETAILS:
            return { ...state, setCostingStylePurchaseOrderDetails: action.setCostingStylePurchaseOrderDetails };
        case GET_COSTINGS_BY_QUERY:
            return {
                ...state,
                queryData: action.costings,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case COSTING_BASIC_INFO:
            return { ...state, costingBasicInfo: action.costingBasicInfo };

        case IS_COSTING_DATA_LOADED:
            return { ...state, isCostingDataLoaded: action.isCostingDataLoaded };

        case IS_COSTING_DATA_PROGRESS:
            return { ...state, isCostingDataProgress: action.isCostingDataProgress };

        case GET_STYLE_COSTING_DETAILS:
            return { ...state, stylesCostingDetails: action.stylesCostingDetails };
        case COSTING_GROUP_FOR_COSTING:
            return { ...state, costingGroupsSummary: action.costingGroupsSummary };
        case COSTING_ACCESSORIES_DETAILS:
            return { ...state, costingAccessoriesDetails: action.costingAccessoriesDetails };
        case COSTING_CM_CALCULATION_FOR_SMV:
            return { ...state, cmCalculationForSMV: action.cmCalculationForSMV };
        case COSTING_CM_CALCULATION_FOR_MACHINE:
            return { ...state, cmCalculationForMachine: action.cmCalculationForMachine };
        case COSTING_FABRIC_DETAILS:
            return { ...state, costingFabricDetails: action.costingFabricDetails };
        case GET_STYLE_DEFAULT_CATEGORY:
            return { ...state, styleDefaultCategory: action.styleDefaultCategory };
        case ADD_COSTING:
            return { ...state };
        case UPDATE_COSTING:
            return { ...state };
        case DELETE_COSTING:
            return { ...state };
        case DELETE_COSTINGS_BY_RANGE:
            return { ...state };
        case COSTING_CLONE:
            return {
                ...state,
                costingBasicInfo: action.costingBasicInfo,
                costingFabricDetails: action.costingFabricDetails,
                costingAccessoriesDetails: action.costingAccessoriesDetails,
                costingGroupsSummary: action.costingGroupsSummary
            };
        case CLEAR_ALL_COSTING_STATE:
            return {
                ...state,
                costings: [],
                queryData: [],
                total: 1,
                params: {},
                selectedCosting: null,
                selectedSetCosting: null,
                dropDownDownCostings: null,
                costingBasicInfo: costingBasicInfoModel,
                costingGroupsSummary: costingGroupsSummaryModel,
                costingAccessoriesDetails: [],
                costingFabricDetails: [],
                cmCalculationForSMV,
                cmCalculationForMachine,
                purchaseOrderStylesDropdown: [],
                setStyleCostingPreviousHistory: [],
                costingSizeGroupColorHistory: null,
                costingDropdownByOrderIdAndStyleId: [],
                costingStylePurchaseOrderDetails: [],
                setCostingStylePurchaseOrderDetails: [],
                stylesCostingDetails: []
            };
        default:
            return state;
    }
};

export default costingReducers;
import { bomBasicInfoModel } from "../../model";
import { BIND_BOM_BASIC_INFO, BOM_ITEM_DETAILS_DATA_ON_PROGRESS, BOM_PURCHASE_ORDER_DATA_ON_PROGRESS, CLEAR_ALL_BOM_STATE, DELETE_BOM, DROP_DOWN_BOMS, GET_BOMS, GET_BOMS_BY_QUERY, GET_BOM_BY_ID, GET_BOM_GENERATION_DETAILS, GET_BOM_PURCHASE_ORDERS, OPEN_BOM_VIEW_MODAL } from "../action-types";


const initialState = {
    boms: [],
    queryData: [],
    total: 1,
    params: {},
    selectedBom: null,
    dropDownBoms: [],
    openBomViewModal: false,
    bomBasicInfo: bomBasicInfoModel,
    bomDetails: [],
    bomPurchaseOrders: [],
    isBomPurchaseOrdersDataOnProgress: false,
    isBomItemDetailsDataOnProgress: false
};

const bomReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case BOM_PURCHASE_ORDER_DATA_ON_PROGRESS:
            return {
                ...state,
                isBomPurchaseOrdersDataOnProgress: action.isBomPurchaseOrdersDataOnProgress
            };
        case BOM_ITEM_DETAILS_DATA_ON_PROGRESS:
            return {
                ...state,
                isBomItemDetailsDataOnProgress: action.isBomItemDetailsDataOnProgress
            };
        case GET_BOMS:
            return { ...state, boms: action.boms };

        case GET_BOM_BY_ID:
            return { ...state, selectedBom: action.selectedBom };

        case DROP_DOWN_BOMS:
            return { ...state, dropDownBoms: action.dropDownBoms };

        case OPEN_BOM_VIEW_MODAL:
            return { ...state, openBomViewModal: action.openBomViewModal };

        case BIND_BOM_BASIC_INFO:
            return { ...state, bomBasicInfo: action.bomBasicInfo };

        case GET_BOM_GENERATION_DETAILS:
            return { ...state, bomDetails: action.bomDetails };

        case GET_BOM_PURCHASE_ORDERS:
            return { ...state, bomPurchaseOrders: action.bomPurchaseOrders };

        case GET_BOMS_BY_QUERY:
            return {
                ...state,
                queryData: action.boms,
                total: action.totalPages,
                params: action.params
            };

        case DELETE_BOM:
            return { ...state };

        case CLEAR_ALL_BOM_STATE:
            return {
                ...state,
                boms: [],
                queryData: [],
                total: 1,
                params: {},
                selectedBom: null,
                dropDownBoms: [],
                openBomViewModal: false,
                bomBasicInfo: bomBasicInfoModel,
                bomDetails: [],
                bomPurchaseOrders: [],
                isBomPurchaseOrdersDataOnProgress: false
            };
        default:
            return state;
    }
};
export default bomReduces;
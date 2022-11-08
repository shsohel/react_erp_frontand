import { purchaseOrderBasicInfo, stylePurchaseOrderDetailsModel, stylePurchaseOrderModel } from '../../model';
import { ADD_PURCHASE_ORDER, BIND_STYLE_PURCHASE_ORDER, BIND_STYLE_PURCHASE_ORDER_DETAILS, CONTROL_SET_PURCHASE_ORDER, CONTROL_SINGLE_PURCHASE_ORDER, DELETE_PURCHASE_ORDER, DELETE_PURCHASE_ORDERS_BY_RANGE, DELETE_PURCHASE_ORDER_DETAILS, GET_COLOR_SIZE_QUANTITY_BY_PO_DETAILS_ID, GET_PURCHASE_ORDERS, GET_PURCHASE_ORDERS_BY_QUERY, GET_PURCHASE_ORDER_BY_ID, GET_PURCHASE_ORDER_DETAILS_BY_ID, GET_PURCHASE_ORDER_DETAILS_SIZE_COLOR_QUANTITY_SUMMARY, GET_PURCHASE_ORDER_DETAILS_SIZE_COLOR_QUANTITY_SUMMARY_DETAILS, GET_PURCHASE_ORDER_DROP_DOWN, GET_PURCHASE_ORDER_DROP_DOWN_BY_BUYER_ID, GET_STYLES_BY_PO_ID, GET_STYLE_PURCHASE_ORDER, GET_STYLE_PURCHASE_ORDER_DETAILS, OPEN_PURCHASE_ORDER_FORM, PURCHASE_ORDER_DATA_LOADING, SELECTED_PURCHASE_ORDER_NULL, STYLE_PURCHASE_ORDER_DROPDOWN, TOTAL_SELECTED_STYLES, UPDATE_PURCHASE_ORDER } from "../action-types";


const initialState = {
    purchaseOrders: [],
    queryData: [],
    total: 1,
    params: {},
    isPurchaseOrderDataLoading: false,
    selectedPurchaseOrder: null,
    purchaseOrderDetails: [],
    openPurchaseOrderForm: false,
    isItSetOrder: false,
    isItSingleOrder: false,
    totalSelectedStyles: null,
    lastPurchaseOrderId: null,
    POStyles: [],
    isPODetailsDeleted: false,
    isPOUpdated: false,
    quantityOnSizeAndColor: [],
    purchaseOrderDropdown: [],
    buyerPurchaseOrderDropdown: [],
    purchaseOrderBasicInfo,
    orderDetailsSizeColorQuantitySummary: [],
    orderDetailsSizeColorQuantitySummaryDetails: [],
    stylePurchaserOrder: stylePurchaseOrderModel,
    stylePurchaseOrderDetails: stylePurchaseOrderDetailsModel,
    stylePurchaseOrderDropdown: [],
    isStylePurchaseOrderDropdown: true
};

const purchaseOrderReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_PURCHASE_ORDERS:
            return { ...state, purchaseOrders: action.purchaseOrders };

        case GET_PURCHASE_ORDER_BY_ID:
            return { ...state, selectedPurchaseOrder: action.selectedPurchaseOrder };

        case GET_PURCHASE_ORDER_DETAILS_BY_ID:
            return { ...state, purchaseOrderDetails: action.purchaseOrderDetails };

        case GET_COLOR_SIZE_QUANTITY_BY_PO_DETAILS_ID:
            return { ...state, quantityOnSizeAndColor: action.quantityOnSizeAndColor };

        case GET_PURCHASE_ORDER_DETAILS_SIZE_COLOR_QUANTITY_SUMMARY:
            return { ...state, orderDetailsSizeColorQuantitySummary: action.orderDetailsSizeColorQuantitySummary };

        case GET_PURCHASE_ORDER_DETAILS_SIZE_COLOR_QUANTITY_SUMMARY_DETAILS:
            return { ...state, orderDetailsSizeColorQuantitySummaryDetails: action.orderDetailsSizeColorQuantitySummaryDetails };

        case GET_STYLES_BY_PO_ID:
            return { ...state, POStyles: action.POStyles };

        case GET_PURCHASE_ORDER_DROP_DOWN:
            return { ...state, purchaseOrderDropdown: action.purchaseOrderDropdown };

        case STYLE_PURCHASE_ORDER_DROPDOWN:
            return {
                ...state,
                stylePurchaseOrderDropdown: action.stylePurchaseOrderDropdown,
                isStylePurchaseOrderDropdown: action.isStylePurchaseOrderDropdown
            };

        case GET_PURCHASE_ORDER_DROP_DOWN_BY_BUYER_ID:
            return { ...state, buyerPurchaseOrderDropdown: action.buyerPurchaseOrderDropdown };

        case SELECTED_PURCHASE_ORDER_NULL:
            return { ...state, selectedPurchaseOrder: action.selectedPurchaseOrder };

        case OPEN_PURCHASE_ORDER_FORM:
            return { ...state, openPurchaseOrderForm: action.openPurchaseOrderForm };

        case CONTROL_SET_PURCHASE_ORDER:
            return { ...state, isItSetOrder: action.isItSetOrder };

        case CONTROL_SINGLE_PURCHASE_ORDER:
            return { ...state, isItSingleOrder: action.isItSingleOrder };

        case TOTAL_SELECTED_STYLES:
            return { ...state, totalSelectedStyles: action.totalSelectedStyles };

        case GET_STYLE_PURCHASE_ORDER:
            return { ...state, stylePurchaserOrder: action.stylePurchaserOrder };

        case BIND_STYLE_PURCHASE_ORDER:
            return { ...state, stylePurchaserOrder: action.stylePurchaserOrder };

        case GET_STYLE_PURCHASE_ORDER_DETAILS:
            return { ...state, stylePurchaseOrderDetails: action.stylePurchaseOrderDetails };

        case BIND_STYLE_PURCHASE_ORDER_DETAILS:
            return { ...state, stylePurchaseOrderDetails: action.stylePurchaseOrderDetails };

        case GET_PURCHASE_ORDERS_BY_QUERY:
            return {
                ...state,
                queryData: action.purchaseOrders,
                total: action.totalPages,
                params: action.params
            };

        case ADD_PURCHASE_ORDER:
            return { ...state, lastPurchaseOrderId: action.lastPurchaseOrderId };

        case UPDATE_PURCHASE_ORDER:
            return { ...state, isPOUpdated: action.isPOUpdated };

        case DELETE_PURCHASE_ORDER:
            return { ...state };

        case DELETE_PURCHASE_ORDER_DETAILS:
            return { ...state, isPODetailsDeleted: action.isPODetailsDeleted };

        case DELETE_PURCHASE_ORDERS_BY_RANGE:
            return { ...state };

        case PURCHASE_ORDER_DATA_LOADING:
            return { ...state, isPurchaseOrderDataLoading: action.isPurchaseOrderDataLoading };

        default:
            return state;
    }


};

export default purchaseOrderReduces;
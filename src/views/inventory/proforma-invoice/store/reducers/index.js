import { proformaInvoiceModel } from "../../model";
import { ADD_PI_INVOICE, BIND_PI_BASIC_INFO, BIND_SELECTED_PROCUREMENT_ITEMS, BIND_SELECTED_SUPPLIER_ORDERS, CLEAR_ALL_PI_STATE, GET_PI_BY_ID, GET_PI_BY_QUERY, GET_PROCUREMENT_ITEMS, GET_SUPPLIER_ORDERS, IS_FILE_UPLOADED_COMPLETE, IS_PI_DATA_LOADED, IS_PI_DATA_PROGRESS } from "../action-types";


const initialState = {
    isPiDataLoaded: true,
    isPiDataProgress: false,
    pis: [],
    queryData: [],
    queryObj: [],
    total: 1,
    params: {},
    piBasicInfo: proformaInvoiceModel,
    supplierOrder: [],
    selectedSupplierOrders: [],
    procurementItems: [],
    selectedProcurementItems: [],
    isFileUploadComplete: true
};
const piReducers = ( state = initialState, action ) => {
    switch ( action.type ) {
        case IS_PI_DATA_LOADED:
            return {
                ...state,
                isPiDataLoaded: action.isPiDataLoaded
            };
        case IS_PI_DATA_PROGRESS:
            return {
                ...state,
                isPiDataProgress: action.isPiDataProgress
            };
        case GET_PI_BY_QUERY:
            return {
                ...state,
                queryData: action.pis,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case GET_PI_BY_ID:
            return {
                ...state,
                piBasicInfo: action.piBasicInfo
                // selectedProcurementItems: action.selectedProcurementItems,
                // selectedSupplierOrders: action.selectedSupplierOrders

            };
        case GET_SUPPLIER_ORDERS:
            return {
                ...state,
                supplierOrder: action.supplierOrder
            };
        case BIND_SELECTED_SUPPLIER_ORDERS:
            return {
                ...state,
                selectedSupplierOrders: action.selectedSupplierOrders
            };

        case GET_PROCUREMENT_ITEMS:
            return {
                ...state,
                procurementItems: action.procurementItems
            };
        case BIND_SELECTED_PROCUREMENT_ITEMS:
            return {
                ...state,
                selectedProcurementItems: action.selectedProcurementItems
            };

        case ADD_PI_INVOICE:
            return { ...state };
        case BIND_PI_BASIC_INFO:
            return { ...state, piBasicInfo: action.piBasicInfo };
        case IS_FILE_UPLOADED_COMPLETE:
            return { ...state, isFileUploadComplete: action.isFileUploadComplete };
        case CLEAR_ALL_PI_STATE:
            return {
                ...action
            };

        default:
            return state;
    }
};

export default piReducers;

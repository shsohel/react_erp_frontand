import { warehouseData } from "../../model";
import { ADD_WAREHOUSE, BIND_WAREHOUSE_DATA_ONCHANGE, GET_WAREHOUSES, GET_WAREHOUSE_BY_ID, GET_WAREHOUSE_BY_QUERY, GET_WAREHOUSE_DROPDOWN, IS_WAREHOUSE_DATA_LOADED, IS_WAREHOUSE_ON_PROGRESS, UPDATE_WAREHOUSE } from "../action-types";

const initialState = {
    isWarehouseDataLoaded: true,
    isWarehouseOnProgress: false,
    queryData: [],
    queryObj: [],
    total: 1,
    params: {},
    warehouses: [],
    warehouse: warehouseData,
    selectedWarehouse: null,
    warehouseDropdown: []
};

const warehouseReducers = ( state = initialState, action ) => {
    switch ( action.type ) {
        case IS_WAREHOUSE_DATA_LOADED:
            return { ...state, isWarehouseDataLoaded: action.isWarehouseDataLoaded };
        case IS_WAREHOUSE_ON_PROGRESS:
            return { ...state, isWarehouseOnProgress: action.isWarehouseOnProgress };

        case GET_WAREHOUSES:
            return { ...state, warehouses: action.warehouses };
        case GET_WAREHOUSE_BY_QUERY:
            return {
                ...state,
                queryData: action.warehouses,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case GET_WAREHOUSE_BY_ID:
            return { ...state, warehouse: action.warehouse };
        case GET_WAREHOUSE_DROPDOWN:
            return { ...state, warehouseDropdown: action.warehouseDropdown };
        case ADD_WAREHOUSE:
            return { ...state };
        case UPDATE_WAREHOUSE:
            return { ...state };
        case BIND_WAREHOUSE_DATA_ONCHANGE:
            return { ...state, warehouse: action.warehouse };
        default:
            return state;
    }
};
export default warehouseReducers;
import { ADD_PRE_COSTING, DELETE_PRE_COSTING, DELETE_PRE_COSTINGS_BY_RANGE, DROP_DOWN_PRE_COSTINGS, GET_PRE_COSTINGS, GET_PRE_COSTINGS_BY_QUERY, GET_PRE_COSTING_BY_ID, SELECTED_PRE_COSTING_NULL, UPDATE_PRE_COSTING } from "../action-types";

const initialState = {
    preCostings: [],
    queryData: [],
    total: 1,
    params: {},
    selectedPreCosting: null,
    dropDowndownPreCostings: null
};

const preCostingReducers = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_PRE_COSTINGS:
            return { ...state, preCostings: action.preCostings };
        case GET_PRE_COSTING_BY_ID:
            return { ...state, selectedPreCosting: action.selectedPreCosting };
        case SELECTED_PRE_COSTING_NULL:
            return { ...state, selectedPreCosting: action.selectedPreCosting };
        case DROP_DOWN_PRE_COSTINGS:
            return { ...state, dropDowndownPreCostings: action.dropDowndownPreCostings };
        case GET_PRE_COSTINGS_BY_QUERY:
            return {
                ...state,
                queryData: action.preCostings,
                total: action.totalPages,
                params: action.params
            };
        case ADD_PRE_COSTING:
            return { ...state };
        case UPDATE_PRE_COSTING:
            return { ...state };
        case DELETE_PRE_COSTING:
            return { ...state };
        case DELETE_PRE_COSTINGS_BY_RANGE:
            return { ...state };
        default:
            return state;
    }
};

export default preCostingReducers;
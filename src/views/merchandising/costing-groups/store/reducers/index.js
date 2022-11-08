import { ADD_COSTING_GROUP, DELETE_COSTING_GROUP, DELETE_COSTING_GROUPS_BY_RANGE, DROP_DOWN_COSTING_GROUPS, GET_COSTING_GROUPS, GET_COSTING_GROUPS_BY_QUERY, GET_COSTING_GROUP_BY_ID, OPEN_COSTING_GROUP_SIDEBAR, OPEN_COSTING_GROUP_SIDEBAR_FOR_EDIT, SELECTED_COSTING_GROUP_NULL, UPDATE_COSTING_GROUP } from "../action-types";

const initialState = {
    costingGroups: [],
    queryData: [],
    total: 1,
    params: {},
    selectedCostingGroup: null,
    openCostingGroupSidebar: false,
    openCostingGroupSidebarForEdit: false,
    dropDownCostingGroups: []
};


const costingGroupReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_COSTING_GROUPS:
            return { ...state, costingGroups: action.costingGroups };
        case GET_COSTING_GROUP_BY_ID:
            return { ...state, selectedCostingGroup: action.selectedCostingGroup };
        case SELECTED_COSTING_GROUP_NULL:
            return { ...state, selectedCostingGroup: action.selectedCostingGroup };
        case OPEN_COSTING_GROUP_SIDEBAR:
            return { ...state, openCostingGroupSidebar: action.openCostingGroupSidebar };
        case OPEN_COSTING_GROUP_SIDEBAR_FOR_EDIT:
            return { ...state, openCostingGroupSidebarForEdit: action.openCostingGroupSidebarForEdit };
        case DROP_DOWN_COSTING_GROUPS:
            return { ...state, dropDownCostingGroups: action.dropDownCostingGroups };
        case GET_COSTING_GROUPS_BY_QUERY:
            return {
                ...state,
                queryData: action.costingGroups,
                total: action.totalPages,
                params: action.params
            };
        case ADD_COSTING_GROUP:
            return { ...state };
        case UPDATE_COSTING_GROUP:
            return { ...state };
        case DELETE_COSTING_GROUP:
            return { ...state };
        case DELETE_COSTING_GROUPS_BY_RANGE:
            return { ...state };
        default:
            return state;
    }
};
export default costingGroupReduces;

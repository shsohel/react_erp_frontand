import { ADD_ITEM_SUB_GROUP, DELETE_ITEM_SUB_GROUP, DELETE_ITEM_SUB_GROUP_BY_RANGE, DROP_DOWN_ITEM_SUB_GROUP, GET_FABRIC_SUB_CATEGORIES, GET_ITEM_SUB_GROUP, GET_ITEM_SUB_GROUP_BY_ID, GET_ITEM_SUB_GROUP_BY_QUERY, OPEN_ITEM_SUB_GROUP_SIDEBAR, SELECTED_ITEM_SUB_GROUP_NULL, UPDATE_ITEM_SUB_GROUP } from "../action-types";


const initialState = {
    itemSubGroups: [],
    queryData: [],
    total: 1,
    params: {},
    selectedItemSubGroup: null,
    openItemSubGroupSidebar: false,
    dropDownItemSubGroups: [],
    dropdownFabricSubGroup: []
};


const itemSubGroupReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_ITEM_SUB_GROUP:
            return { ...state, itemSubGroups: action.itemSubGroups };
        case GET_ITEM_SUB_GROUP_BY_ID:
            return { ...state, selectedItemSubGroup: action.selectedItemSubGroup };
        case SELECTED_ITEM_SUB_GROUP_NULL:
            return { ...state, selectedItemSubGroup: action.selectedItemSubGroup };
        case OPEN_ITEM_SUB_GROUP_SIDEBAR:
            return { ...state, openItemSubGroupSidebar: action.openItemSubGroupSidebar };
        case DROP_DOWN_ITEM_SUB_GROUP:
            return { ...state, dropDownItemSubGroups: action.dropDownItemSubGroups };
        case GET_FABRIC_SUB_CATEGORIES:
            return { ...state, dropdownFabricSubGroup: action.dropdownFabricSubGroup };
        case GET_ITEM_SUB_GROUP_BY_QUERY:
            return {
                ...state,
                queryData: action.itemSubGroups,
                total: action.totalPages,
                params: action.params
            };
        case ADD_ITEM_SUB_GROUP:
            return { ...state };
        case UPDATE_ITEM_SUB_GROUP:
            return { ...state };
        case DELETE_ITEM_SUB_GROUP:
            return { ...state };
        case DELETE_ITEM_SUB_GROUP_BY_RANGE:
            return { ...state };
        default:
            return state;
    }
};
export default itemSubGroupReduces;
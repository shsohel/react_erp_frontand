import { itemBasicInfoModel } from "../../model";
import { ADD_ITEM, BIND_ITEM_BASIC_INFO, DELETE_ITEM, DELETE_ITEMS_BY_RANGE, GET_DROP_DOWN_ITEMS, GET_ITEM, GET_ITEMS_BY_QUERY, GET_ITEM_BY_ID, GET_ITEM_DESCRIPTION_DROPDOWN, IS_ITEM_DATA_LOADED, IS_ITEM_DATA_ON_PROGRESS, IS_ITEM_DATA_SUBMIT_PROGRESS, OPEN_ITEM_SIDEBAR, OPEN_ITEM_SIDEBAR_FOR_EDIT, SELECTED_ITEM_NULL, UPDATE_ITEM } from "../action-types";


// export const IS_ITEM_DATA_LOADED = "IS_ITEM_DATA_LOADED";
// export const IS_ITEM_DATA_ON_PROGRESS = "IS_ITEM_DATA_ON_PROGRESS";
// export const IS_ITEM_DATA_SUBMIT_PROGRESS = "IS_ITEM_DATA_SUBMIT_PROGRESS";

const initialState = {
    isItemDataLoaded: true,
    isItemDataOnProgress: false,
    isItemDataSubmitProgress: false,
    items: [],
    queryData: [],
    total: 1,
    params: {},
    selectedItem: null,
    openItemSidebar: false,
    openItemEditSidebar: false,
    itemId: null,
    dropdownItemDescription: [],
    dropdownItems: [],
    itemBasicInfo: itemBasicInfoModel
};

const itemReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case IS_ITEM_DATA_LOADED:
            return { ...state, isItemDataLoaded: action.isItemDataLoaded };
        case IS_ITEM_DATA_ON_PROGRESS:
            return { ...state, isItemDataOnProgress: action.isItemDataOnProgress };
        case IS_ITEM_DATA_SUBMIT_PROGRESS:
            return { ...state, isItemDataSubmitProgress: action.isItemDataSubmitProgress };
        case GET_ITEM:
            return { ...state, items: action.items };
        case GET_ITEM_BY_ID:
            return { ...state, itemBasicInfo: action.itemBasicInfo };
        case SELECTED_ITEM_NULL:
            return { ...state, selectedItem: action.selectedItem };
        case OPEN_ITEM_SIDEBAR:
            return { ...state, openItemSidebar: action.openItemSidebar };
        case OPEN_ITEM_SIDEBAR_FOR_EDIT:
            return { ...state, openItemEditSidebar: action.openItemEditSidebar };
        // case DROP_DOWN_ITEMS:
        //     return { ...state, dropDownItemGroups: action.dropDownItemGroups };

        case GET_ITEM_DESCRIPTION_DROPDOWN:
            return { ...state, dropdownItemDescription: action.dropdownItemDescription };

        // case GET_ITEMS_DROPDOWN_BY_ITEM_GROUP:
        //     return { ...state, dropdownItems: action.dropdownItems };

        case GET_DROP_DOWN_ITEMS:
            return { ...state, dropdownItems: action.dropdownItems };

        case BIND_ITEM_BASIC_INFO:
            return { ...state, itemBasicInfo: action.itemBasicInfo };

        case GET_ITEMS_BY_QUERY:
            return {
                ...state,
                queryData: action.itemGroups,
                total: action.totalPages,
                params: action.params
            };
        case ADD_ITEM:
            return { ...state };
        case UPDATE_ITEM:
            return { ...state };
        case DELETE_ITEM:
            return { ...state };
        case DELETE_ITEMS_BY_RANGE:
            return { ...state };
        default:
            return state;
    }
};
export default itemReduces;
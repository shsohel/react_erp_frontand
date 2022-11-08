import { ADD_ITEM_GROUP, DELETE_ITEM_GROUP, DELETE_ITEM_GROUP_BY_RANGE, DROP_DOWN_CATEGORY_GROUPS, DROP_DOWN_ITEM_GROUPS, GET_ITEM_FABRIC_GROUPS_DROPDOWN_BY_GROUP, GET_ITEM_GROUPS, GET_ITEM_GROUPS_BY_QUERY, GET_ITEM_GROUPS_DROPDOWN_BY_GROUP, GET_ITEM_GROUP_BY_ID, GET_ITEM_PACK_GROUPS_DROPDOWN_BY_GROUP, GET_ITEM_SEGMENT_BY_ITEM_GROUP_ID, GET_ITEM_SEGMENT_DROPDOWN_BY_ITEM_GROUP_ID, GET_ITEM_SEGMENT_VALUE_BY_ITEM_GROUP_ID, GET_ITEM_SUB_GROUP_BY_ITEM_GROUP_ID, GET_ITEM_SUB_GROUP_DROPDOWN_BY_ITEM_GROUP_ID, GET_ITEM_SUB_GROUP_SEGMENT_BY_ITEM_GROUP_ID, GET_ITEM_TRIM_GROUPS_DROPDOWN_BY_GROUP, IS_ITEM_GROUP_DATA_LOADED, IS_ITEM_GROUP_DATA_SUBMIT_PROGRESS, IS_ITEM_GROUP_ON_PROGRESS, OPEN_ASSIGN_ITEM_SEGMENT_MODAL, OPEN_ASSIGN_ITEM_SEGMENT_VALUE_MODAL, OPEN_ASSIGN_SUB_CATEGORY_MODAL, OPEN_ITEM_GROUP_SIDEBAR, OPEN_ITEM_GROUP_SIDEBAR_FOR_EDIT, SELECTED_ITEM_GROUP_NULL, UPDATE_ITEM_GROUP } from "../action-types";


const initialState = {
    isItemGroupDataLoaded: true,
    isItemGroupOnProgress: false,
    isItemGroupDataSubmitProgress: false,
    itemGroups: [],
    queryData: [],
    queryObj: [],
    total: 1,
    params: {},
    selectedItemGroup: null,
    openItemGroupSidebar: false,
    openItemGroupSidebarForEdit: false,
    openAssignSubCategoryModal: false,
    openAssignItemSegmentModal: false,
    openAssignItemSegmentValueModal: false,
    dropDownItems: [],
    dropDownItemGroups: [],
    isDropDownItemGroupsDataLoaded: true,
    dropDownItemSubGroups: [],
    isDropDownItemSubGroupsDataLoaded: true,
    itemSubGroups: [],
    itemSegments: [],
    itemSegmentValues: [],
    itemGroupId: null,
    itemSegmentsArray: [],
    isItemSegmentsArrayLoaded: true,
    dropDownCategoryGroups: [],
    isDropDownCategoryGroupsLoaded: true,
    dropDownItemGroupByGroups: [],
    dropDownTrimItemGroups: [],
    dropDownFabricItemGroups: [],
    dropDownPackItemGroups: [],
    itemGroup: null
};

const itemGroupReduces = ( state = initialState, action ) => {
    switch ( action.type ) {

        case IS_ITEM_GROUP_DATA_LOADED:
            return { ...state, isItemGroupDataLoaded: action.isItemGroupDataLoaded };

        case IS_ITEM_GROUP_ON_PROGRESS:
            return { ...state, isItemGroupOnProgress: action.isItemGroupOnProgress };

        case IS_ITEM_GROUP_DATA_SUBMIT_PROGRESS:
            return { ...state, isItemGroupDataSubmitProgress: action.isItemGroupDataSubmitProgress };

        case GET_ITEM_GROUPS:
            return { ...state, itemGroups: action.itemGroups };
        case GET_ITEM_GROUP_BY_ID:
            return { ...state, selectedItemGroup: action.selectedItemGroup };
        case SELECTED_ITEM_GROUP_NULL:
            return { ...state, selectedItemGroup: action.selectedItemGroup };
        case OPEN_ITEM_GROUP_SIDEBAR:
            return { ...state, openItemGroupSidebar: action.openItemGroupSidebar };
        case OPEN_ITEM_GROUP_SIDEBAR_FOR_EDIT:
            return { ...state, openItemGroupSidebarForEdit: action.openItemGroupSidebarForEdit };
        case OPEN_ASSIGN_SUB_CATEGORY_MODAL:
            return { ...state, openAssignSubCategoryModal: action.openAssignSubCategoryModal, itemGroupId: action.itemGroupId, itemGroup: action.itemGroup };
        case OPEN_ASSIGN_ITEM_SEGMENT_MODAL:
            return { ...state, openAssignItemSegmentModal: action.openAssignItemSegmentModal, itemGroupId: action.itemGroupId, itemGroup: action.itemGroup };
        case OPEN_ASSIGN_ITEM_SEGMENT_VALUE_MODAL:
            return { ...state, openAssignItemSegmentValueModal: action.openAssignItemSegmentValueModal, itemGroupId: action.itemGroupId, itemGroup: action.itemGroup };
        case GET_ITEM_SUB_GROUP_BY_ITEM_GROUP_ID:
            return { ...state, itemSubGroups: action.itemSubGroups };
        case GET_ITEM_SUB_GROUP_SEGMENT_BY_ITEM_GROUP_ID:
            return {
                ...state,
                itemSegmentsArray: action.itemSegmentsArray,
                isItemSegmentsArrayLoaded: action.isItemSegmentsArrayLoaded
            };
        case GET_ITEM_SEGMENT_BY_ITEM_GROUP_ID:
            return { ...state, itemSegments: action.itemSegments };
        case GET_ITEM_SEGMENT_VALUE_BY_ITEM_GROUP_ID:
            return { ...state, itemSegmentValues: action.itemSegmentValues };
        case DROP_DOWN_ITEM_GROUPS:
            return {
                ...state,
                dropDownItemGroups: action.dropDownItemGroups,
                isDropDownItemGroupsDataLoaded: action.isDropDownItemGroupsDataLoaded
            };

        case GET_ITEM_GROUPS_DROPDOWN_BY_GROUP:
            return { ...state, dropDownItemGroupByGroups: action.dropDownItemGroupByGroups };

        case GET_ITEM_FABRIC_GROUPS_DROPDOWN_BY_GROUP:
            return { ...state, dropDownFabricItemGroups: action.dropDownFabricItemGroups };

        case GET_ITEM_PACK_GROUPS_DROPDOWN_BY_GROUP:
            return { ...state, dropDownPackItemGroups: action.dropDownPackItemGroups };

        case GET_ITEM_TRIM_GROUPS_DROPDOWN_BY_GROUP:
            return { ...state, dropDownTrimItemGroups: action.dropDownTrimItemGroups };

        case DROP_DOWN_CATEGORY_GROUPS:
            return {
                ...state,
                dropDownCategoryGroups: action.dropDownCategoryGroups,
                isDropDownCategoryGroupsLoaded: action.isDropDownCategoryGroupsLoaded
            };

        case GET_ITEM_SEGMENT_DROPDOWN_BY_ITEM_GROUP_ID:
            return { ...state, itemSegmentsDropdown: action.itemSegmentsDropdown };
        case GET_ITEM_SUB_GROUP_DROPDOWN_BY_ITEM_GROUP_ID:
            return {
                ...state,
                dropDownItemSubGroups: action.dropDownItemSubGroups,
                isDropDownItemSubGroupsDataLoaded: action.isDropDownItemSubGroupsDataLoaded
            };
        case GET_ITEM_GROUPS_BY_QUERY:
            return {
                ...state,
                queryData: action.itemGroups,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case ADD_ITEM_GROUP:
            return { ...state };
        case UPDATE_ITEM_GROUP:
            return { ...state };
        case DELETE_ITEM_GROUP:
            return { ...state };
        case DELETE_ITEM_GROUP_BY_RANGE:
            return { ...state };
        default:
            return state;
    }
};
export default itemGroupReduces;
import { sizeGroupModel } from '../../model';
import { ADD_SIZE_GROUP, BIND_SIZE_GROUP_DATA, DELETE_SIZE_GROUP, DELETE_SIZE_GROUP_BY_RANGE, DROP_DOWN_SIZE_GROUPS, GET_SIZE_GROUPS, GET_SIZE_GROUPS_BY_QUERY, GET_SIZE_GROUP_BY_ID, IS_SIZE_GROUP_DATA_LOADED, IS_SIZE_GROUP_DATA_ON_PROGRESS, IS_SIZE_GROUP_DATA_SUBMIT_PROGRESS, OPEN_SIZE_GROUP_SIDEBAR, OPEN_SIZE_GROUP_SIDEBAR_FOR_EDIT, SELECTED_SIZE_GROUP_NULL, UPDATE_SIZE_GROUP } from '../actionTypes';


const initialState = {
    isSizeGroupDataLoaded: true,
    isSizeGroupDataOnProgress: false,
    isSizeGroupDataSubmitProgress: false,
    sizeGroups: [],
    queryData: [],
    total: 1,
    params: {},
    selectedSizeGroup: null,
    openSizeGroupSidebar: false,
    openSizeGroupSidebarForEdit: false,
    dropDownSizeGroups: [],
    isDropDownSizeGroupsLoaded: true,
    sizeGroup: sizeGroupModel
};


const sizeGroupReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case IS_SIZE_GROUP_DATA_LOADED:
            return { ...state, isSizeGroupDataLoaded: action.isSizeGroupDataLoaded };
        case IS_SIZE_GROUP_DATA_ON_PROGRESS:
            return { ...state, isSizeGroupDataOnProgress: action.isSizeGroupDataOnProgress };
        case IS_SIZE_GROUP_DATA_SUBMIT_PROGRESS:
            return { ...state, isSizeGroupDataSubmitProgress: action.isSizeGroupDataSubmitProgress };
        case GET_SIZE_GROUPS:
            return { ...state, sizeGroups: action.sizeGroups };
        case GET_SIZE_GROUP_BY_ID:
            return { ...state, sizeGroup: action.sizeGroup };
        case SELECTED_SIZE_GROUP_NULL:
            return { ...state, selectedSizeGroup: action.selectedSizeGroup };
        case OPEN_SIZE_GROUP_SIDEBAR:
            return { ...state, openSizeGroupSidebar: action.openSizeGroupSidebar };
        case OPEN_SIZE_GROUP_SIDEBAR_FOR_EDIT:
            return { ...state, openSizeGroupSidebarForEdit: action.openSizeGroupSidebarForEdit };
        case DROP_DOWN_SIZE_GROUPS:
            return {
                ...state,
                dropDownSizeGroups: action.dropDownSizeGroups,
                isDropDownSizeGroupsLoaded: action.isDropDownSizeGroupsLoaded
            };
        case GET_SIZE_GROUPS_BY_QUERY:
            return {
                ...state,
                queryData: action.sizeGroups,
                total: action.totalPages,
                params: action.params
            };
        case BIND_SIZE_GROUP_DATA:
            return { ...state, sizeGroup: action.sizeGroup };
        case ADD_SIZE_GROUP:
            return { ...state };
        case UPDATE_SIZE_GROUP:
            return { ...state };
        case DELETE_SIZE_GROUP:
            return { ...state };
        case DELETE_SIZE_GROUP_BY_RANGE:
            return { ...state };
        default:
            return state;
    }
};
export default sizeGroupReduces;

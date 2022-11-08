import { ADD_STATUS, DELETE_STATUS, DELETE_STATUSES_BY_RANGE, DROP_DOWN_STATUSES, GET_STATUSES, GET_STATUSES_BY_QUERY, GET_STATUS_BY_ID, GET_STATUS_TYPES, OPEN_STATUS_SIDEBAR, OPEN_STATUS_SIDEBAR_FOR_EDIT, ORDER_STATUS_DROPDOWN, SELECTED_STATUS_NULL, STYLE_STATUS_DROPDOWN, UPDATE_STATUS } from '../actionTypes';

const initialState = {
    statuses: [],
    statusTypes: [],
    queryData: [],
    total: 1,
    params: {},
    selectedStatus: null,
    openStatusSidebar: false,
    openStatusSidebarForEdit: false,
    dropDownStatuses: null,
    dropdownStyleStatus: [],
    dropdownOrderStatus: []
};


const statusesReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_STATUSES:
            return { ...state, statuses: action.statuses };
        case GET_STATUS_TYPES:
            return { ...state, statusTypes: action.statusTypes };
        case GET_STATUS_BY_ID:
            return { ...state, selectedStatus: action.selectedStatus };
        case SELECTED_STATUS_NULL:
            return { ...state, selectedStatus: action.selectedStatus };
        case OPEN_STATUS_SIDEBAR:
            return { ...state, openStatusSidebar: action.openStatusSidebar };
        case OPEN_STATUS_SIDEBAR_FOR_EDIT:
            return { ...state, openStatusSidebarForEdit: action.openStatusSidebarForEdit };
        case DROP_DOWN_STATUSES:
            return { ...state, dropDownStatuses: action.dropDownStatuses };
        case STYLE_STATUS_DROPDOWN:
            return { ...state, dropdownStyleStatus: action.dropdownStyleStatus };
        case ORDER_STATUS_DROPDOWN:
            return { ...state, dropdownOrderStatus: action.dropdownOrderStatus };
        case GET_STATUSES_BY_QUERY:
            return {
                ...state,
                queryData: action.statuses,
                total: action.totalPages,
                params: action.params
            };
        case ADD_STATUS:
            return { ...state };
        case UPDATE_STATUS:
            return { ...state };
        case DELETE_STATUS:
            return { ...state };
        case DELETE_STATUSES_BY_RANGE:
            return { ...state };
        default:
            return state;
    }
};
export default statusesReduces;
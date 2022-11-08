import { vendorGroupBasicInfoModel } from "../../model";
import { ADD_VENDOR_GROUP, BIND_VENDOR_GROUP_BASIC_INFO, GET_VENDOR_GROUPS_BY_QUERY, GET_VENDOR_GROUP_BY_ID, GET_VENDOR_GROUP_DROPDOWN, GET_VENDOR_SUB_GROUPS_DROPDOWN_BY_VENDOR_ID, GET_VENDOR_SUB_GROUP_VENDOR_GROUP_BY_ID, OPEN_VENDOR_GROUPS_EDIT_SIDEBAR, OPEN_VENDOR_GROUPS_SIDEBAR, OPEN_VENDOR_SUB_GROUPS_SIDEBAR, UPDATE_VENDOR_GROUP } from "../action-types";

const initialState = {
    queryData: [],
    total: 1,
    params: {},
    queryObj: [],
    selectedVendorGroup: [],
    dropdownVendorGroups: [],
    dropdownVendorSubGroup: [],
    openVendorGroupSidebar: false,
    openSubVendorGroupSidebar: false,
    openVendorGroupSidebarEdit: false,
    vendorGroupBasicInfo: vendorGroupBasicInfoModel,
    vendorSubGroups: []
};

const vendorGroupsReducers = ( state = initialState, action ) => {
    switch ( action.type ) {

        case GET_VENDOR_GROUPS_BY_QUERY:
            return {
                ...state,
                queryData: action.vendorGroups,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryData
            };

        case GET_VENDOR_GROUP_BY_ID:
            return { ...state, vendorGroupBasicInfo: action.vendorGroupBasicInfo };

        case GET_VENDOR_GROUP_DROPDOWN:
            return { ...state, dropdownVendorGroups: action.dropdownVendorGroups };

        case GET_VENDOR_SUB_GROUPS_DROPDOWN_BY_VENDOR_ID:
            return { ...state, dropdownVendorSubGroup: action.dropdownVendorSubGroup };

        case OPEN_VENDOR_GROUPS_SIDEBAR:
            return { ...state, openVendorGroupSidebar: action.openVendorGroupSidebar };


        case OPEN_VENDOR_GROUPS_EDIT_SIDEBAR:
            return { ...state, openVendorGroupSidebarEdit: action.openVendorGroupSidebarEdit };

        case OPEN_VENDOR_SUB_GROUPS_SIDEBAR:
            return { ...state, openSubVendorGroupSidebar: action.openSubVendorGroupSidebar };

        case BIND_VENDOR_GROUP_BASIC_INFO:
            return { ...state, vendorGroupBasicInfo: action.vendorGroupBasicInfo };

        case GET_VENDOR_SUB_GROUP_VENDOR_GROUP_BY_ID:
            return { ...state, vendorSubGroups: action.vendorSubGroups };

        case ADD_VENDOR_GROUP:
            return { ...state };
        case UPDATE_VENDOR_GROUP:
            return { ...state };

        default:
            return state;
    }
};
export default vendorGroupsReducers;
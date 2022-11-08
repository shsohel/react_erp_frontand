import { ADD_UNIT_SET, DELETE_UNIT_SET, DELETE_UNIT_SETS_BY_RANGE, DROP_DOWN_UNIT_SETS, GET_DEFAULT_UOM_DROPDOWN, GET_ORDER_AND_CONSUMPTION_UOM_DROPDOWN_BY_ITEM_GROUP_ID, GET_UNIT_SET, GET_UNIT_SETS_BY_QUERY, GET_UNIT_SETS_UNIT_BY_ID, GET_UNIT_SET_BY_ID, GET_UOM_DROPDOWN_BY_UOM_SET_ID, GET_UOM_DROPDOWN_BY_UOM_SET_NAME, OPEN_UNIT_SET_SIDEBAR, OPEN_UNIT_SET_SIDEBAR_FOR_EDIT, SELECTED_UNIT_SET_NULL, UNIT_SETS_UNITS, UPDATE_UNIT_SET, UPDATE_UNIT_SET_UNIT } from "../action-types";

const initialState = {
    unitSets: [],
    queryData: [],
    total: 1,
    params: {},
    selectedUnitSet: null,
    openUnitSetSidebar: false,
    openUnitSetEditSidebar: false,
    UnitSetId: null,
    unitSetUnits: null,
    dropDownUnitSet: [],
    orderMDropdown: [],
    consumptionUOMDropdown: [],
    defaultUOMDropdown: [],
    isDefaultUOMDropdownLoaded: true,
    dropdownUnitSetUom: [],
    dropdownUom: []
};

const unitSetsReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_UNIT_SET:
            return { ...state, unitSets: action.unitSets };
        case GET_UNIT_SETS_UNIT_BY_ID:
            return { ...state, unitSetUnits: action.unitSetUnits };
        case GET_UNIT_SET_BY_ID:
            return { ...state, selectedUnitSet: action.selectedUnitSet };
        case SELECTED_UNIT_SET_NULL:
            return { ...state, selectedUnitSet: action.selectedUnitSet };
        case OPEN_UNIT_SET_SIDEBAR:
            return { ...state, openUnitSetSidebar: action.openUnitSetSidebar };
        case OPEN_UNIT_SET_SIDEBAR_FOR_EDIT:
            return { ...state, openUnitSetEditSidebar: action.openUnitSetEditSidebar };
        case DROP_DOWN_UNIT_SETS:
            return { ...state, dropDownUnitSet: action.dropDownUnitSet };
        case GET_DEFAULT_UOM_DROPDOWN:
            return {
                ...state,
                defaultUOMDropdown: action.defaultUOMDropdown,
                isDefaultUOMDropdownLoaded: action.isDefaultUOMDropdownLoaded
            };
        case GET_UOM_DROPDOWN_BY_UOM_SET_ID:
            return { ...state, dropdownUnitSetUom: action.dropdownUnitSetUom };
        case GET_UOM_DROPDOWN_BY_UOM_SET_NAME:
            return { ...state, dropdownUom: action.dropdownUom };
        case GET_ORDER_AND_CONSUMPTION_UOM_DROPDOWN_BY_ITEM_GROUP_ID:
            return {
                ...state,
                orderMDropdown: action.orderMDropdown,
                consumptionUOMDropdown: action.consumptionUOMDropdown
            };
        case UNIT_SETS_UNITS:
            return { ...state, unitSetUnits: action.unitSetUnits };
        case GET_UNIT_SETS_BY_QUERY:
            return {
                ...state,
                queryData: action.queryData,
                total: action.totalPages,
                params: action.params
            };
        case ADD_UNIT_SET:
            return { ...state };
        case UPDATE_UNIT_SET:
            return { ...state };
        case UPDATE_UNIT_SET_UNIT:
            return { ...state };
        case DELETE_UNIT_SET:
            return { ...state };
        case DELETE_UNIT_SETS_BY_RANGE:
            return { ...state };
        default:
            return state;
    }
};
export default unitSetsReduces;
import { colorModel } from '../../model';
import { ADD_COLOR, BIND_COLOR_DATA, DELETE_COLOR, DELETE_COLORS_BY_RANGE, DROP_DOWN_COLORS, GET_COLORS, GET_COLORS_BY_QUERY, GET_COLORS_BY_STYLE_ID, GET_COLOR_BY_ID, IS_COLOR_DATA_LOADED, IS_COLOR_DATA_ON_PROGRESS, IS_COLOR_DATA_SUBMIT_PROGRESS, OPEN_COLOR_SIDEBAR, OPEN_COLOR_SIDEBAR_FOR_EDIT, SELECTED_COLOR_NULL, UPDATE_COLOR } from '../actionTypes';


const initialState = {
    isColorDataLoaded: true,
    isColorDataOnProgress: false,
    isColorDataSubmitProgress: false,
    colors: [],
    queryData: [],
    total: 1,
    params: {},
    selectedColor: null,
    openColorSidebar: false,
    openColorSidebarForEdit: false,
    dropDownColors: [],
    isDropDownColorsLoaded: true,
    styleColorsDropdown: [],
    color: colorModel
};


const colorsReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case IS_COLOR_DATA_LOADED:
            return { ...state, isColorDataLoaded: action.isColorDataLoaded };
        case IS_COLOR_DATA_ON_PROGRESS:
            return { ...state, isColorDataOnProgress: action.isColorDataOnProgress };
        case IS_COLOR_DATA_SUBMIT_PROGRESS:
            return { ...state, isColorDataSubmitProgress: action.isColorDataSubmitProgress };
        case GET_COLORS:
            return { ...state, colors: action.colors };
        case GET_COLOR_BY_ID:
            return { ...state, color: action.color };
        case GET_COLORS_BY_STYLE_ID:
            return { ...state, styleColorsDropdown: action.styleColorsDropdown };
        case SELECTED_COLOR_NULL:
            return { ...state, selectedColor: action.selectedColor };
        case OPEN_COLOR_SIDEBAR:
            return { ...state, openColorSidebar: action.openColorSidebar };
        case OPEN_COLOR_SIDEBAR_FOR_EDIT:
            return { ...state, openColorSidebarForEdit: action.openColorSidebarForEdit };
        case DROP_DOWN_COLORS:
            return {
                ...state,
                dropDownColors: action.dropDownColors,
                isDropDownColorsLoaded: action.isDropDownColorsLoaded
            };
        case GET_COLORS_BY_QUERY:
            return {
                ...state,
                queryData: action.colors,
                total: action.totalPages,
                params: action.params
            };
        case BIND_COLOR_DATA:
            return { ...state, color: action.color };
        case ADD_COLOR:
            return { ...state };
        case UPDATE_COLOR:
            return { ...state };
        case DELETE_COLOR:
            return { ...state };
        case DELETE_COLORS_BY_RANGE:
            return { ...state };
        default:
            return state;
    }
};
export default colorsReduces;

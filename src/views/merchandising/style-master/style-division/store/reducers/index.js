import { styleDivisionModel } from '../../model';
import { ADD_DIVISION, BIND_STYLE_DIVISION_DATA, DELETE_DIVISION, DELETE_DIVISIONS_BY_RANGE, DROP_DOWN_DIVISIONS, GET_DEPARTMENT_BY_DIVISION_ID, GET_DIVISIONS, GET_DIVISIONS_BY_QUERY, GET_DIVISION_BY_ID, IS_STYLE_DIVISION_DATA_LOADED, OPEN_DIVISION_SIDEBAR, OPEN_DIVISION_SIDEBAR_FOR_EDIT, SELECTED_DIVISION_NULL, UPDATE_DIVISION } from '../actionTypes';

const initialState = {
    isDivisionDataLoaded: true,
    divisions: [],
    queryData: [],
    total: 1,
    params: {},
    selectedDivision: null,
    openDivisionSidebar: false,
    openDivisionSidebarForEdit: false,
    dropDownDivisions: [],
    isDropDownDivisionsLoaded: true,
    styleDivision: styleDivisionModel
};


const divisionsReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_DIVISIONS:
            return { ...state, divisions: action.divisions };
        case GET_DIVISION_BY_ID:
            return { ...state, styleDivision: action.styleDivision };
        case SELECTED_DIVISION_NULL:
            return { ...state, selectedDivision: action.selectedDivision };
        case OPEN_DIVISION_SIDEBAR:
            return { ...state, openDivisionSidebar: action.openDivisionSidebar };
        case OPEN_DIVISION_SIDEBAR_FOR_EDIT:
            return { ...state, openDivisionSidebarForEdit: action.openDivisionSidebarForEdit };
        case DROP_DOWN_DIVISIONS:
            return {
                ...state,
                dropDownDivisions: action.dropDownDivisions,
                isDropDownDivisionsLoaded: action.isDropDownDivisionsLoaded
            };
        case GET_DIVISIONS_BY_QUERY:
            return {
                ...state,
                queryData: action.divisions,
                total: action.totalPages,
                params: action.params
            };
        case GET_DEPARTMENT_BY_DIVISION_ID:
            return {
                ...state,
                queryData: action.queryDataWithDepartments
            };
        case ADD_DIVISION:
            return { ...state };
        case BIND_STYLE_DIVISION_DATA:
            return { ...state, styleDivision: action.styleDivision };
        case UPDATE_DIVISION:
            return { ...state };
        case DELETE_DIVISION:
            return { ...state };
        case DELETE_DIVISIONS_BY_RANGE:
            return { ...state };
        case IS_STYLE_DIVISION_DATA_LOADED:
            return { ...state, isDivisionDataLoaded: action.isDivisionDataLoaded };
        default:
            return state;
    }
};
export default divisionsReduces;

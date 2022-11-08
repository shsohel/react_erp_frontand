import { styleDepartmentModel } from '../../model';
import { ADD_DEPARTMENT, BIND_STYLE_DEPARTMENT, DELETE_DEPARTMENT, DELETE_DEPARTMENTS_BY_RANGE, DEPARTMENT_INSTANT_CREATE, DROP_DOWN_DEPARTMENTS, GET_DEPARTMENTS, GET_DEPARTMENTS_BY_QUERY, GET_DEPARTMENT_BY_ID, GET_PRODUCT_CATEGORY_BY_DEPARTMENT_ID, IS_STYLE_DEPARTMENT_DATA_LOADED, OPEN_DEPARTMENT_SIDEBAR, OPEN_DEPARTMENT_SIDEBAR_FOR_EDIT, SELECTED_DEPARTMENT_NULL, UPDATE_DEPARTMENT } from '../actionTypes';

const initialState = {
    departments: [],
    queryData: [],
    total: 1,
    params: {},
    selectedDepartment: null,
    openDepartmentSidebar: false,
    openDepartmentSidebarForEdit: false,
    dropDownDepartments: [],
    isDropDownDepartmentsLoaded: true,
    styleDepartment: styleDepartmentModel,
    lastCreatedId: null,
    isStyleDepartmentDataLoaded: true
};


const departmentsReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_DEPARTMENTS:
            return { ...state, departments: action.departments };
        case GET_DEPARTMENT_BY_ID:
            return { ...state, styleDepartment: action.styleDepartment };
        case SELECTED_DEPARTMENT_NULL:
            return { ...state, selectedDepartment: action.selectedDepartment };
        case OPEN_DEPARTMENT_SIDEBAR:
            return { ...state, openDepartmentSidebar: action.openDepartmentSidebar };
        case OPEN_DEPARTMENT_SIDEBAR_FOR_EDIT:
            return { ...state, openDepartmentSidebarForEdit: action.openDepartmentSidebarForEdit };
        case DROP_DOWN_DEPARTMENTS:
            return {
                ...state,
                dropDownDepartments: action.dropDownDepartments,
                isDropDownDepartmentsLoaded: action.isDropDownDepartmentsLoaded
            };
        case GET_DEPARTMENTS_BY_QUERY:
            return {
                ...state,
                queryData: action.departments,
                total: action.totalPages,
                params: action.params
            };
        case GET_PRODUCT_CATEGORY_BY_DEPARTMENT_ID:
            return {
                ...state,
                queryData: action.queryDataWithProductCategory
            };
        case ADD_DEPARTMENT:
            return { ...state, lastCreatedId: action.lastCreatedId };
        case BIND_STYLE_DEPARTMENT:
            return { ...state, styleDepartment: action.styleDepartment };
        case DEPARTMENT_INSTANT_CREATE:
            return { ...state, lastCreatedId: action.lastCreatedId };
        case UPDATE_DEPARTMENT:
            return { ...state };
        case DELETE_DEPARTMENT:
            return { ...state };
        case DELETE_DEPARTMENTS_BY_RANGE:
            return { ...state };
        case IS_STYLE_DEPARTMENT_DATA_LOADED:
            return { ...state, isStyleDepartmentDataLoaded: action.isStyleDepartmentDataLoaded };
        default:
            return state;
    }
};
export default departmentsReduces;
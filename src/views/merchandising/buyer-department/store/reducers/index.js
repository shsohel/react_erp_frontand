import { ADD_BUYER_DEPARTMENT, DELETE_BUYER_DEPARTMENT, DELETE_BUYER_DEPARTMENTS_BY_RANGE, DROP_DOWN_BUYER_DEPARTMENTS, GET_BUYER_DEPARTMENTS, GET_BUYER_DEPARTMENTS_BY_QUERY, GET_BUYER_DEPARTMENT_BY_ID, IS_BUYER_DEPARTMENT_DATA_LOADED, OPEN_BUYER_DEPARTMENT_SIDEBAR, OPEN_BUYER_DEPARTMENT_SIDEBAR_FOR_EDIT, SELECTED_BUYER_DEPARTMENT_NULL, UPDATE_BUYER_DEPARTMENT } from "../actionTypes";

const initialState = {
    isBuyerDepartmentDataLoaded: true,
    buyerDepartments: [],
    queryData: [],
    total: 1,
    params: {},
    selectedBuyerDepartment: null,
    openBuyerDepartmentSidebar: false,
    openBuyerDepartmentSidebarForEdit: false,
    dropDownBuyerDepartments: [],
    isDropDownBuyerDepartmentsLoaded: true
};


const buyerDepartmentReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_BUYER_DEPARTMENTS:
            return { ...state, buyerDepartments: action.buyerDepartments };
        case GET_BUYER_DEPARTMENT_BY_ID:
            return { ...state, selectedBuyerDepartment: action.selectedBuyerDepartment };
        case SELECTED_BUYER_DEPARTMENT_NULL:
            return { ...state, selectedBuyerDepartment: action.selectedBuyerDepartment };
        case OPEN_BUYER_DEPARTMENT_SIDEBAR:
            return { ...state, openBuyerDepartmentSidebar: action.openBuyerDepartmentSidebar };
        case OPEN_BUYER_DEPARTMENT_SIDEBAR_FOR_EDIT:
            return { ...state, openBuyerDepartmentSidebarForEdit: action.openBuyerDepartmentSidebarForEdit };
        case DROP_DOWN_BUYER_DEPARTMENTS:
            return {
                ...state,
                dropDownBuyerDepartments: action.dropDownBuyerDepartments,
                isDropDownBuyerDepartmentsLoaded: action.isDropDownBuyerDepartmentsLoaded
            };
        case GET_BUYER_DEPARTMENTS_BY_QUERY:
            return {
                ...state,
                queryData: action.buyerDepartments,
                total: action.totalPages,
                params: action.params
            };
        case ADD_BUYER_DEPARTMENT:
            return { ...state };
        case UPDATE_BUYER_DEPARTMENT:
            return { ...state };
        case DELETE_BUYER_DEPARTMENT:
            return { ...state };
        case DELETE_BUYER_DEPARTMENTS_BY_RANGE:
            return { ...state };
        case IS_BUYER_DEPARTMENT_DATA_LOADED:
            return { ...state, isBuyerDepartmentDataLoaded: action.isBuyerDepartmentDataLoaded };
        default:
            return state;
    }
};
export default buyerDepartmentReduces;
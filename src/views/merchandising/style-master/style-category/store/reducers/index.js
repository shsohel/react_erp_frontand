import { ADD_STYLE_CATEGORY, DELETE_STYLE_CATEGORY, DELETE_STYLE_CATEGORY_BY_RANGE, DROP_DOWN_STYLE_CATEGORIES, GET_DROPDOWN_STYLE_CATEGORY, GET_STYLE_CATEGORIES, GET_STYLE_CATEGORIES_BY_QUERY, GET_STYLE_CATEGORY_BY_ID, IS_STYLE_CATEGORY_DATA_LOADED, OPEN_STYLE_CATEGORY_SIDEBAR, OPEN_STYLE_CATEGORY_SIDEBAR_FOR_EDIT, SELECTED_STYLE_CATEGORY_NULL, UPDATE_STYLE_CATEGORY } from '../actionTypes';

const initialState = {
    isStyleCategoryDataLoaded: true,
    styleCategories: [],
    queryData: [],
    total: 1,
    params: {},
    selectedStyleCategory: null,
    openStyleCategorySidebar: false,
    openStyleCategorySidebarForEdit: false,
    dropDownStyleCategories: [],
    isDropDownStyleCategoriesLoaded: true,

    dropDownStyleCategory: [],
    lastCreatedId: null

};


const styleCategoryReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_STYLE_CATEGORIES:
            return { ...state, styleCategories: action.styleCategories };
        case GET_STYLE_CATEGORY_BY_ID:
            return { ...state, selectedStyleCategory: action.selectedStyleCategory };
        case SELECTED_STYLE_CATEGORY_NULL:
            return { ...state, selectedStyleCategory: action.selectedStyleCategory };
        case OPEN_STYLE_CATEGORY_SIDEBAR:
            return { ...state, openStyleCategorySidebar: action.openStyleCategorySidebar };
        case OPEN_STYLE_CATEGORY_SIDEBAR_FOR_EDIT:
            return { ...state, openStyleCategorySidebarForEdit: action.openStyleCategorySidebarForEdit };
        case DROP_DOWN_STYLE_CATEGORIES:
            return {
                ...state,
                dropDownStyleCategories: action.dropDownStyleCategories,
                isDropDownStyleCategoriesLoaded: action.isDropDownStyleCategoriesLoaded
            };

        case GET_DROPDOWN_STYLE_CATEGORY:
            return { ...state, dropDownStyleCategory: action.dropDownStyleCategory };

        case GET_STYLE_CATEGORIES_BY_QUERY:
            return {
                ...state,
                queryData: action.styleCategories,
                total: action.totalPages,
                params: action.params
            };
        case ADD_STYLE_CATEGORY:
            return { ...state, lastCreatedId: action.lastCreatedId };
        case UPDATE_STYLE_CATEGORY:
            return { ...state };
        case DELETE_STYLE_CATEGORY:
            return { ...state };
        case DELETE_STYLE_CATEGORY_BY_RANGE:
            return { ...state };
        case IS_STYLE_CATEGORY_DATA_LOADED:
            return { ...state, isStyleCategoryDataLoaded: action.isStyleCategoryDataLoaded };
        default:
            return state;
    }
};
export default styleCategoryReduces;
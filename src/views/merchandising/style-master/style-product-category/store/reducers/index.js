import { styleProductCategoryModel } from '../../model';
import { ADD_PRODUCT_CATEGORY, BIND_STYLE_PRODUCT_CATEGORY_DATA, DELETE_PRODUCT_CATEGORY, DELETE_PRODUCT_CATEGORY_BY_RANGE, DROP_DOWN_PRODUCT_CATEGORIES, GET_PRODUCT_CATEGORIES, GET_PRODUCT_CATEGORIES_BY_QUERY, GET_PRODUCT_CATEGORY_BY_ID, GET_STYLE_CATEGORY_BY_PRODUCT_CATEGORY_ID, IS_STYLE_PRODUCT_CATEGORY_DATA_LOADED, OPEN_PRODUCT_CATEGORY_SIDEBAR, OPEN_PRODUCT_CATEGORY_SIDEBAR_FOR_EDIT, SELECTED_PRODUCT_CATEGORY_NULL, UPDATE_PRODUCT_CATEGORY } from '../actionTypes';

const initialState = {
    isStyleProductCategoryDataLoaded: true,
    productCategories: [],
    queryData: [],
    total: 1,
    params: {},
    selectedProductCategory: null,
    openProductCategorySidebar: false,
    openProductCategorySidebarForEdit: false,
    dropDownProductCategories: [],
    isDropDownProductCategoriesLoaded: true,
    lastCreatedId: null,
    styleProductCategory: styleProductCategoryModel
};


const productCategoryReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_PRODUCT_CATEGORIES:
            return { ...state, productCategories: action.productCategories };
        case GET_PRODUCT_CATEGORY_BY_ID:
            return { ...state, styleProductCategory: action.styleProductCategory };
        case SELECTED_PRODUCT_CATEGORY_NULL:
            return { ...state, selectedProductCategory: action.selectedProductCategory };
        case OPEN_PRODUCT_CATEGORY_SIDEBAR:
            return { ...state, openProductCategorySidebar: action.openProductCategorySidebar };
        case OPEN_PRODUCT_CATEGORY_SIDEBAR_FOR_EDIT:
            return { ...state, openProductCategorySidebarForEdit: action.openProductCategorySidebarForEdit };
        case DROP_DOWN_PRODUCT_CATEGORIES:
            return {
                ...state,
                dropDownProductCategories: action.dropDownProductCategories,
                isDropDownProductCategoriesLoaded: action.isDropDownProductCategoriesLoaded
            };
        case GET_PRODUCT_CATEGORIES_BY_QUERY:
            return {
                ...state,
                queryData: action.productCategories,
                total: action.totalPages,
                params: action.params
            };
        case GET_STYLE_CATEGORY_BY_PRODUCT_CATEGORY_ID:
            return {
                ...state,
                queryData: action.queryDataWithStyleCategories
            };
        case ADD_PRODUCT_CATEGORY:
            return { ...state, lastCreatedId: action.lastCreatedId };
        case BIND_STYLE_PRODUCT_CATEGORY_DATA:
            return { ...state, styleProductCategory: action.styleProductCategory };
        case UPDATE_PRODUCT_CATEGORY:
            return { ...state };
        case DELETE_PRODUCT_CATEGORY:
            return { ...state };
        case DELETE_PRODUCT_CATEGORY_BY_RANGE:
            return { ...state };
        case IS_STYLE_PRODUCT_CATEGORY_DATA_LOADED:
            return { ...state, isStyleProductCategoryDataLoaded: action.isStyleProductCategoryDataLoaded };
        default:
            return state;
    }
};
export default productCategoryReduces;
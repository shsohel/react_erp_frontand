import { productDeveloperModel } from "../../model";
import { ADD_BUYER_PRODUCT_DEVELOPER, BIND_PRODUCT_DEVELOPER_BASIC_INFO, DELETE_BUYER_PRODUCT_DEVELOPER, DELETE_BUYER_PRODUCT_DEVELOPER_BY_RANGE, DROP_DOWN_BUYER_PRODUCT_DEVELOPERS, GET_BUYER_PRODUCT_DEVELOPERS, GET_BUYER_PRODUCT_DEVELOPERS_BY_QUERY, GET_BUYER_PRODUCT_DEVELOPER_BY_ID, IS_PRODUCT_DEVELOPER_DATA_LOADED, OPEN_BUYER_PRODUCT_DEVELOPER_SIDEBAR, OPEN_BUYER_PRODUCT_DEVELOPER_SIDEBAR_FOR_EDIT, PRODUCT_DEV_IMAGE_UPLOADING, SELECTED_BUYER_PRODUCT_DEVELOPER_NULL, UPDATE_BUYER_PRODUCT_DEVELOPER } from "../actionTypes";

const initialState = {
    isProductDeveloperDataLoaded: true,
    productDevelopers: [],
    queryData: [],
    total: 1,
    params: {},
    selectedProductDeveloper: null,
    openProductDeveloperSidebar: false,
    openProductDeveloperSidebarForEdit: false,
    dropDownProductDevelopers: [],
    isDropDownProductDevelopersLoaded: true,
    productDeveloperBasicInfo: productDeveloperModel,
    isProDevImageUploading: false
};


const productDeveloperReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_BUYER_PRODUCT_DEVELOPERS:
            return { ...state, productDevelopers: action.productDevelopers };

        case GET_BUYER_PRODUCT_DEVELOPER_BY_ID:
            return { ...state, selectedProductDeveloper: action.selectedProductDeveloper, productDeveloperBasicInfo: action.productDeveloperBasicInfo };

        case BIND_PRODUCT_DEVELOPER_BASIC_INFO:
            return { ...state, productDeveloperBasicInfo: action.productDeveloperBasicInfo };

        case SELECTED_BUYER_PRODUCT_DEVELOPER_NULL:
            return { ...state, selectedProductDeveloper: action.selectedProductDeveloper };
        case OPEN_BUYER_PRODUCT_DEVELOPER_SIDEBAR:
            return { ...state, openProductDeveloperSidebar: action.openProductDeveloperSidebar };
        case OPEN_BUYER_PRODUCT_DEVELOPER_SIDEBAR_FOR_EDIT:
            return { ...state, openProductDeveloperSidebarForEdit: action.openProductDeveloperSidebarForEdit };
        case DROP_DOWN_BUYER_PRODUCT_DEVELOPERS:
            return {
                ...state,
                dropDownProductDevelopers: action.dropDownProductDevelopers,
                isDropDownProductDevelopersLoaded: action.isDropDownProductDevelopersLoaded
            };
        case GET_BUYER_PRODUCT_DEVELOPERS_BY_QUERY:
            return {
                ...state,
                queryData: action.productDevelopers,
                total: action.totalPages,
                params: action.params
            };
        case ADD_BUYER_PRODUCT_DEVELOPER:
            return { ...state };
        case UPDATE_BUYER_PRODUCT_DEVELOPER:
            return { ...state };
        case DELETE_BUYER_PRODUCT_DEVELOPER:
            return { ...state };
        case DELETE_BUYER_PRODUCT_DEVELOPER_BY_RANGE:
            return { ...state };
        case PRODUCT_DEV_IMAGE_UPLOADING:
            return { ...state, isProDevImageUploading: action.isProDevImageUploading };

        case IS_PRODUCT_DEVELOPER_DATA_LOADED:
            return { ...state, isProductDeveloperDataLoaded: action.isProductDeveloperDataLoaded };
        default:
            return state;
    }
};
export default productDeveloperReduces;
import { sizeModel } from '../../model';
import { ADD_SIZE, BIND_SIZE_DATA, DELETE_SIZE, DELETE_SIZES_BY_RANGE, DROP_DOWN_SIZES, GET_SIZES, GET_SIZES_BY_QUERY, GET_SIZES_BY_SIZE_GROUP_ID, GET_SIZE_BY_ID, GET_STYLE_SIZES_DROP_DOWN, IS_SIZE_DATA_LOADED, IS_SIZE_DATA_ON_PROGRESS, IS_SIZE_DATA_SUBMIT_PROGRESS, OPEN_SIZE_SIDEBAR, OPEN_SIZE_SIDEBAR_FOR_EDIT, SELECTED_SIZE_NULL, UPDATE_SIZE } from '../actionTypes';


const initialState = {
    isSizeDataLoaded: true,
    isSizeDataOnProgress: false,
    isSizeDataSubmitProgress: false,
    sizes: [],
    queryData: [],
    total: 1,
    params: {},
    selectedSize: null,
    openSizeSidebar: false,
    openSizeSidebarForEdit: false,
    dropDownSizes: null,
    lastCreatedId: null,
    sizeGroupsSizes: [],
    styleSizesDropdown: [],
    size: sizeModel
};


const sizesReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case IS_SIZE_DATA_LOADED:
            return { ...state, isSizeDataLoaded: action.isSizeDataLoaded };
        case IS_SIZE_DATA_ON_PROGRESS:
            return { ...state, isSizeDataOnProgress: action.isSizeDataOnProgress };
        case IS_SIZE_DATA_SUBMIT_PROGRESS:
            return { ...state, isSizeDataSubmitProgress: action.isSizeDataSubmitProgress };
        case GET_SIZES:
            return { ...state, sizes: action.sizes };
        case GET_SIZE_BY_ID:
            return { ...state, size: action.size };
        case GET_STYLE_SIZES_DROP_DOWN:
            return { ...state, styleSizesDropdown: action.styleSizesDropdown };
        case SELECTED_SIZE_NULL:
            return { ...state, selectedSize: action.selectedSize };
        case OPEN_SIZE_SIDEBAR:
            return { ...state, openSizeSidebar: action.openSizeSidebar };
        case OPEN_SIZE_SIDEBAR_FOR_EDIT:
            return { ...state, openSizeSidebarForEdit: action.openSizeSidebarForEdit };
        case DROP_DOWN_SIZES:
            return { ...state, dropDownSizes: action.dropDownSizes };
        case GET_SIZES_BY_QUERY:
            return {
                ...state,
                queryData: action.sizes,
                total: action.totalPages,
                params: action.params
            };
        case BIND_SIZE_DATA:
            return { ...state, size: action.size };
        case ADD_SIZE:
            return { ...state, lastCreatedId: action.lastCreatedId };
        case UPDATE_SIZE:
            return { ...state };
        case DELETE_SIZE:
            return { ...state };
        case DELETE_SIZES_BY_RANGE:
            return { ...state };
        case GET_SIZES_BY_SIZE_GROUP_ID:
            return { ...state, sizeGroupsSizes: action.sizeGroupsSizes };
        default:
            return state;
    }
};
export default sizesReduces;

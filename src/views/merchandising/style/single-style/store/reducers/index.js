
import { singleStyleModel } from '../../../model';
import { ADD_SINGLE_STYLE, DELETE_SINGLE_STYLE, DELETE_SINGLE_STYLES_BY_RANGE, DROP_DOWN_SINGLE_STYLES, GET_SINGLE_STYLES, GET_SINGLE_STYLES_BY_QUERY, GET_SINGLE_STYLE_BY_ID, GET_SINGLE_STYLE_COLORS, GET_SINGLE_STYLE_SIZES, GET_SINGLE_STYLE_SIZE_GROUPS, GET_SINGLE_STYLE_UPLOAD_FILE, GET_SINGLE_STYLE_UPLOAD_IMAGE, GET_SINGLE_TEMPLATE_DROPDOWN, IS_FILE_UPLOADED_COMPLETE, IS_PHOTO_UPLOADED_COMPLETE, IS_SINGLE_STYLE_DATA_LOADED, IS_SINGLE_STYLE_DATA_PROGRESS, IS_SINGLE_STYLE_DATA_SUBMIT_PROGRESS, OPEN_SINGLE_STYLE_FORM, SELECTED_SINGLE_STYLE_NULL, SINGLE_STYLE_DATA_BIND, UPDATE_SINGLE_STYLE } from '../action-types';
const initialState = {
    isSingleStyleDataLoaded: true,
    styles: [],
    queryData: [],
    queryObj: [],
    total: 1,
    params: {},
    singleStyleBasicInfo: singleStyleModel,
    selectedStyle: null,
    openStyleForm: false,
    dropDownStyles: null,
    singleStyleImages: [],
    lastStyleId: null,
    singleStyleFiles: null,
    isFileUploadComplete: true,
    isPhotoUploadComplete: true,
    singleStyleColors: [],
    singleStyleSizes: null,
    singleStyleSizeGroups: [],
    singleStyleTemplateDropdown: [],
    isSingleStyleTemplateDropdownLoaded: true,
    isSingleStyleDataProgress: false,
    isSingleStyleDataSubmitProgress: false
};

// export const singleStyleDataProgress = ( condition ) => dispatch => {
//     dispatch( {
//         type: IS_SINGLE_STYLE_DATA_PROGRESS,
//         isSingleStyleDataProgress: condition
//     } );
// };
// export const singleStyleDataSubmitProgress = ( condition ) => dispatch => {
//     dispatch( {
//         type: IS_SINGLE_STYLE_DATA_SUBMIT_PROGRESS,
//         isSingleStyleDataSubmitProgress: condition
//     } );
// };


const styleReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_SINGLE_STYLES:
            return { ...state, styles: action.styles };
        case GET_SINGLE_STYLE_BY_ID:
            return { ...state, singleStyleBasicInfo: action.singleStyleBasicInfo, lastStyleId: action.lastStyleId };
        case SELECTED_SINGLE_STYLE_NULL:
            return { ...state, selectedStyle: action.selectedStyle };
        case OPEN_SINGLE_STYLE_FORM:
            return { ...state, openStyleForm: action.openStyleForm };
        case DROP_DOWN_SINGLE_STYLES:
            return { ...state, dropDownStyles: action.dropDownStyles };
        case GET_SINGLE_TEMPLATE_DROPDOWN:
            return {
                ...state,
                singleStyleTemplateDropdown: action.singleStyleTemplateDropdown,
                isSingleStyleTemplateDropdownLoaded: action.isSingleStyleTemplateDropdownLoaded
            };
        case GET_SINGLE_STYLES_BY_QUERY:
            return {
                ...state,
                queryData: action.styles,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };

        case ADD_SINGLE_STYLE:
            return { ...state, lastStyleId: action.lastStyleId };

        case IS_SINGLE_STYLE_DATA_PROGRESS:
            return { ...state, isSingleStyleDataProgress: action.isSingleStyleDataProgress };

        case IS_SINGLE_STYLE_DATA_SUBMIT_PROGRESS:
            return { ...state, isSingleStyleDataSubmitProgress: action.isSingleStyleDataSubmitProgress };

        case UPDATE_SINGLE_STYLE:
            return { ...state };
        case DELETE_SINGLE_STYLE:
            return { ...state };
        case DELETE_SINGLE_STYLES_BY_RANGE:
            return { ...state };
        case GET_SINGLE_STYLE_UPLOAD_IMAGE:
            return { ...state, singleStyleImages: action.singleStyleImages };
        case GET_SINGLE_STYLE_UPLOAD_FILE:
            return { ...state, singleStyleFiles: action.singleStyleFiles };
        case IS_FILE_UPLOADED_COMPLETE:
            return { ...state, isFileUploadComplete: action.isFileUploadComplete };
        case IS_PHOTO_UPLOADED_COMPLETE:
            return { ...state, isPhotoUploadComplete: action.isPhotoUploadComplete };
        case GET_SINGLE_STYLE_COLORS:
            return { ...state, singleStyleColors: action.singleStyleColors };
        case GET_SINGLE_STYLE_SIZE_GROUPS:
            return { ...state, singleStyleSizeGroups: action.singleStyleSizeGroups };
        case GET_SINGLE_STYLE_SIZES:
            return { ...state, singleStyleSizes: action.singleStyleSizes };

        case SINGLE_STYLE_DATA_BIND:
            return { ...state, singleStyleBasicInfo: action.singleStyleBasicInfo };
        case IS_SINGLE_STYLE_DATA_LOADED:
            return { ...state, isSingleStyleDataLoaded: action.isSingleStyleDataLoaded };
        default:
            return state;
    }


};

export default styleReduces;
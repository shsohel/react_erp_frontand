
import { setStyleModel } from '../../../model';
import { ADD_SET_STYLE, CLEAR_ALL_SET_STYLE_STATE, DELETE_SET_STYLE, DELETE_SET_STYLES_BY_RANGE, DELETE_SET_STYLE_FILE, DELETE_SET_STYLE_PHOTO, DROP_DOWN_SET_STYLES, DROP_DOWN_STYLE_SIZES, GET_SET_STYLES, GET_SET_STYLES_BY_QUERY, GET_SET_STYLES_COLORS, GET_SET_STYLES_SIZE_GROUPS, GET_SET_STYLE_BY_ID, GET_SET_STYLE_STYLES_BY_SET_STYLE_ID, GET_SET_STYLE_UPLOAD_FILE, GET_SET_STYLE_UPLOAD_IMAGE, IS_SET_FILE_UPLOADED_COMPLETE, IS_SET_PHOTO_UPLOADED_COMPLETE, IS_SET_STYLE_DATA_LOADED, SELECTED_SET_STYLE_NULL, SET_STYLE_DATA_BIND, UPDATE_SET_STYLE } from '../action-types';
const initialState = {
    isSetStyleDataLoaded: true,
    setStyles: [],
    queryData: [],
    queryObj: [],
    total: 1,
    params: {},
    selectedSetStyle: null,
    setStyleBasicInfo: setStyleModel,
    dropDownSetStyles: [],
    lastSetStyleId: null,
    isSetStylePhotoUploadComplete: true,
    isSetStyleFileUploadComplete: true,
    setStyleImages: [],
    setStyleFiles: [],
    dropdownStyleSizes: [],
    setStyleStylesDropdown: [],
    dropdownSetStyleColors: [],
    dropdownSetStyleSizeGroups: []
};

const styleReducers = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_SET_STYLES:
            return { ...state, setStyles: action.setStyles };

        case GET_SET_STYLE_BY_ID:
            return { ...state, setStyleBasicInfo: action.setStyleBasicInfo, lastSetStyleId: action.lastSetStyleId };

        case SET_STYLE_DATA_BIND:
            return { ...state, setStyleBasicInfo: action.setStyleBasicInfo };

        case SELECTED_SET_STYLE_NULL:
            return { ...state, selectedSetStyle: action.selectedSetStyle };

        case DROP_DOWN_SET_STYLES:
            return { ...state, dropDownSetStyles: action.dropDownSetStyles };

        case DROP_DOWN_STYLE_SIZES:
            return { ...state, dropdownStyleSizes: action.dropdownStyleSizes };

        case GET_SET_STYLES_SIZE_GROUPS:
            return { ...state, dropdownSetStyleSizeGroups: action.dropdownSetStyleSizeGroups };

        case GET_SET_STYLES_COLORS:
            return { ...state, dropdownSetStyleColors: action.dropdownSetStyleColors };

        case GET_SET_STYLE_STYLES_BY_SET_STYLE_ID:
            return { ...state, setStyleStylesDropdown: action.setStyleStylesDropdown };

        case GET_SET_STYLES_BY_QUERY:
            return {
                ...state,
                queryData: action.setStyles,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };

        case ADD_SET_STYLE:
            return { ...state, lastSetStyleId: action.lastSetStyleId };

        case UPDATE_SET_STYLE:
            return { ...state };
        case DELETE_SET_STYLE:
            return { ...state };
        case DELETE_SET_STYLES_BY_RANGE:
            return { ...state };
        case GET_SET_STYLE_UPLOAD_IMAGE:
            return { ...state, setStyleImages: action.setStyleImages };
        case GET_SET_STYLE_UPLOAD_FILE:
            return { ...state, setStyleFiles: action.setStyleFiles };
        case IS_SET_PHOTO_UPLOADED_COMPLETE:
            return { ...state, isSetStylePhotoUploadComplete: action.isSetStylePhotoUploadComplete };
        case IS_SET_FILE_UPLOADED_COMPLETE:
            return { ...state, isSetStyleFileUploadComplete: action.isSetStyleFileUploadComplete };
        case IS_SET_STYLE_DATA_LOADED:
            return { ...state, isSetStyleDataLoaded: action.isSetStyleDataLoaded };
        case DELETE_SET_STYLE_FILE:
            return { ...state };
        case DELETE_SET_STYLE_PHOTO:
            return { ...state };
        case CLEAR_ALL_SET_STYLE_STATE:
            return {
                ...state,
                setStyles: [],
                queryData: [],
                total: 1,
                params: {},
                selectedSetStyle: null,
                setStyleBasicInfo: setStyleModel,
                dropDownSetStyles: [],
                lastSetStyleId: null,
                isSetStylePhotoUploadComplete: true,
                isSetStyleFileUploadComplete: true,
                setStyleImages: [],
                setStyleFiles: [],
                dropdownStyleSizes: [],
                setStyleStylesDropdown: []
            };
        default:
            return state;
    }
};

export default styleReducers;
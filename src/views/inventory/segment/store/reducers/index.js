import { ADD_SEGMENT, DELETE_SEGMENT, DELETE_SEGMENT_BY_RANGE, DROP_DOWN_SEGMENT, GET_ITEM_GROUP_SEGMENTS_WITH_VALUE, GET_SEGMENT, GET_SEGMENT_BY_ID, GET_SEGMENT_BY_QUERY, GET_SEGMENT_VALUE_BY_SEGMENT_ID, IS_SEGMENT_DATA_LOADED, IS_SEGMENT_DATA_ON_PROGRESS, IS_SEGMENT_DATA_SUBMIT_PROGRESS, OPEN_SEGMENT_SIDEBAR, OPEN_SEGMENT_SIDEBAR_FOR_EDIT, SELECTED_SEGMENT_NULL, UPDATE_SEGMENT } from "../action-types";


const initialState = {
    isSegmentDataLoaded: true,
    isSegmentDataOnProgress: false,
    isSegmentDataSubmitProgress: false,
    segments: [],
    queryData: [],
    total: 1,
    params: {},
    selectedSegment: null,
    openSegmentSidebar: false,
    openSegmentEditSidebar: false,
    dropDownSegments: [],
    segmentValues: [],
    itemGroupSegmentsWithValue: [],
    isItemGroupSegmentsWithValueLoaded: true
};


const segmentReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case IS_SEGMENT_DATA_LOADED:
            return { ...state, isSegmentDataLoaded: action.isSegmentDataLoaded };
        case IS_SEGMENT_DATA_ON_PROGRESS:
            return { ...state, isSegmentDataOnProgress: action.isSegmentDataOnProgress };
        case IS_SEGMENT_DATA_SUBMIT_PROGRESS:
            return { ...state, isSegmentDataSubmitProgress: action.isSegmentDataSubmitProgress };
        case GET_SEGMENT:
            return { ...state, segments: action.segments };
        case GET_SEGMENT_BY_ID:
            return { ...state, selectedSegment: action.selectedSegment };
        case GET_SEGMENT_VALUE_BY_SEGMENT_ID:
            return { ...state, segmentValues: action.segmentValues };
        case SELECTED_SEGMENT_NULL:
            return { ...state, selectedSegment: action.selectedSegment };
        case OPEN_SEGMENT_SIDEBAR:
            return { ...state, openSegmentSidebar: action.openSegmentSidebar };
        case OPEN_SEGMENT_SIDEBAR_FOR_EDIT:
            return { ...state, openSegmentEditSidebar: action.openSegmentEditSidebar };
        case DROP_DOWN_SEGMENT:
            return { ...state, dropDownSegments: action.dropDownSegments };
        case GET_ITEM_GROUP_SEGMENTS_WITH_VALUE:
            return {
                ...state,
                itemGroupSegmentsWithValue: action.itemGroupSegmentsWithValue,
                isItemGroupSegmentsWithValueLoaded: action.isItemGroupSegmentsWithValueLoaded
            };
        case GET_SEGMENT_BY_QUERY:
            return {
                ...state,
                queryData: action.segments,
                total: action.totalPages,
                params: action.params
            };
        case ADD_SEGMENT:
            return { ...state };
        case UPDATE_SEGMENT:
            return { ...state };
        case DELETE_SEGMENT:
            return { ...state };
        case DELETE_SEGMENT_BY_RANGE:
            return { ...state };
        default:
            return state;
    }
};
export default segmentReduces;
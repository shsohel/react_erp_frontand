import { sampleAssigneeModel } from "../../model";
import { ADD_SAMPLE_ASSIGNEE, BIND_SAMPLE_ASSIGNEE_BASIC_INFO, DELETE_SAMPLE_ASSIGNEE, DELETE_SAMPLE_ASSIGNEE_BY_RANGE, GET_SAMPLE_ASSIGNEES, GET_SAMPLE_ASSIGNEES_BY_QUERY, GET_SAMPLE_ASSIGNEE_BY_ID, GET_SAMPLE_ASSIGNEE_DROPDOWN, IS_SAMPLE_ASSIGNEE_DATA_LOADED, OPEN_SAMPLE_ASSIGNEE_EDIT_SIDEBAR, OPEN_SAMPLE_ASSIGNEE_SIDEBAR, SAMPLE_ASSIGNEE_IMAGE_UPLOADING, SELECTED_SAMPLE_ASSIGNEE_NULL, UPDATE_SAMPLE_ASSIGNEE } from "../actionTypes";

const initialState = {
    sampleAssignees: [],
    queryData: [],
    total: 1,
    params: {},
    selectedSampleAssignee: null,
    openSampleAssigneeSidebar: false,
    openSampleAssigneeEditSidebar: false,
    dropDownSampleAssignees: [],
    isDropDownSampleAssigneesLoaded: true,
    isSampleAssigneeDataLoaded: true,
    isSampleAssigneeImageUploading: false,
    sampleAssigneeBasicInfo: sampleAssigneeModel
};


const sampleAssigneeReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_SAMPLE_ASSIGNEES:
            return { ...state, sampleAssignees: action.sampleAssignees };

        case GET_SAMPLE_ASSIGNEE_BY_ID:
            return { ...state, sampleAssigneeBasicInfo: action.sampleAssigneeBasicInfo };

        case BIND_SAMPLE_ASSIGNEE_BASIC_INFO:
            return { ...state, sampleAssigneeBasicInfo: action.sampleAssigneeBasicInfo };

        case SELECTED_SAMPLE_ASSIGNEE_NULL:
            return { ...state, selectedSampleAssignee: action.selectedSampleAssignee };

        case OPEN_SAMPLE_ASSIGNEE_SIDEBAR:
            return { ...state, openSampleAssigneeSidebar: action.openSampleAssigneeSidebar };
        case OPEN_SAMPLE_ASSIGNEE_EDIT_SIDEBAR:
            return { ...state, openSampleAssigneeEditSidebar: action.openSampleAssigneeEditSidebar };

        case GET_SAMPLE_ASSIGNEE_DROPDOWN:
            return {
                ...state,
                dropDownSampleAssignees: action.dropDownSampleAssignees,
                isDropDownSampleAssigneesLoaded: action.isDropDownSampleAssigneesLoaded
            };

        case IS_SAMPLE_ASSIGNEE_DATA_LOADED:
            return { ...state, isSampleAssigneeDataLoaded: action.isSampleAssigneeDataLoaded };

        case SAMPLE_ASSIGNEE_IMAGE_UPLOADING:
            return { ...state, isSampleAssigneeImageUploading: action.isSampleAssigneeImageUploading };

        case GET_SAMPLE_ASSIGNEES_BY_QUERY:
            return {
                ...state,
                queryData: action.sampleAssignees,
                total: action.totalPages,
                params: action.params
            };
        case ADD_SAMPLE_ASSIGNEE:
            return { ...state };
        case UPDATE_SAMPLE_ASSIGNEE:
            return { ...state };
        case DELETE_SAMPLE_ASSIGNEE:
            return { ...state };
        case DELETE_SAMPLE_ASSIGNEE_BY_RANGE:
            return { ...state };
        default:
            return state;
    }
};
export default sampleAssigneeReduces;
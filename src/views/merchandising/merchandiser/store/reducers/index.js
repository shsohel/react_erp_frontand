import { merchandiserModel } from "../../model";
import {
    ADD_MERCHANDISER, BIND_MERCHANDISER_BASIC_INFO, CLEAR_MERCHANDISER_ALL_STATE, DELETE_MERCHANDISER, DELETE_MERCHANDISER_BY_RANGE, DROP_DOWN_MERCHANDISERS, GET_BUYER_MERCHANDISER_BY_ID, GET_MERCHANDISERS, GET_MERCHANDISERS_BY_QUERY, GET_MERCHANDISER_BY_ID, IS_ASSIGN_BUYER_MODAL_OPEN, IS_MERCHANDISER_DATA_LOADED, MERCHANDISER_IMAGE_UPLOADING, OPEN_MERCHANDISER_SIDEBAR, OPEN_MERCHANDISER_SIDEBAR_FOR_EDIT, SELECTED_MERCHANDISER_NULL, UPDATE_MERCHANDISER
} from "../actionTypes";

// export const GET_BUYER_MERCHANDISER_BY_ID = "GET_BUYER_MERCHANDISER_BY_ID";

const initialState = {
    isMerchandiserDataLoaded: true,
    merchandisers: [],
    queryData: [],
    total: 1,
    params: {},
    selectedMerchandiser: null,
    openMerchandiserSidebar: false,
    openMerchandiserEditSidebar: false,
    dropDownMerchandisers: [],
    isAgentImageUploading: false,
    merchandiserBasicInfo: merchandiserModel,
    isAssignBuyerModal: false,
    merchandiserBuyers: []
};

const merchandiserReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case IS_MERCHANDISER_DATA_LOADED:
            return { ...state, isMerchandiserDataLoaded: action.isMerchandiserDataLoaded };
        case GET_MERCHANDISERS:
            return { ...state, merchandisers: action.merchandisers };

        case GET_MERCHANDISER_BY_ID:
            return { ...state, merchandiserBasicInfo: action.merchandiserBasicInfo };

        case BIND_MERCHANDISER_BASIC_INFO:
            return { ...state, merchandiserBasicInfo: action.merchandiserBasicInfo };

        case SELECTED_MERCHANDISER_NULL:
            return { ...state, selectedMerchandiser: action.selectedMerchandiser };
        case OPEN_MERCHANDISER_SIDEBAR:
            return { ...state, openMerchandiserSidebar: action.openMerchandiserSidebar };
        case OPEN_MERCHANDISER_SIDEBAR_FOR_EDIT:
            return { ...state, openMerchandiserEditSidebar: action.openMerchandiserEditSidebar };
        case DROP_DOWN_MERCHANDISERS:
            return { ...state, dropDownMerchandisers: action.dropDownMerchandisers };
        case IS_ASSIGN_BUYER_MODAL_OPEN:
            return { ...state, isAssignBuyerModal: action.isAssignBuyerModal };

        case GET_BUYER_MERCHANDISER_BY_ID:
            return { ...state, merchandiserBuyers: action.merchandiserBuyers };

        case GET_MERCHANDISERS_BY_QUERY:
            return {
                ...state,
                queryData: action.merchandisers,
                total: action.totalPages,
                params: action.params
            };
        case ADD_MERCHANDISER:
            return { ...state };
        case CLEAR_MERCHANDISER_ALL_STATE:
            return {
                ...state,
                isMerchandiserDataLoaded: true,
                merchandisers: [],

                dropDownMerchandisers: [],
                isAgentImageUploading: false,
                merchandiserBasicInfo: merchandiserModel
            };
        case UPDATE_MERCHANDISER:
            return { ...state };
        case DELETE_MERCHANDISER:
            return { ...state };
        case DELETE_MERCHANDISER_BY_RANGE:
            return { ...state };
        case MERCHANDISER_IMAGE_UPLOADING:
            return { ...state, isAgentImageUploading: action.isAgentImageUploading };
        default:
            return state;
    }
};
export default merchandiserReduces;

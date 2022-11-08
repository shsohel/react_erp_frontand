import { agentModel } from "../../model";
import {
    ADD_BUYER_AGENT, AGENT_IMAGE_UPLOADING, BIND_AGENT_BASIC_INFO, CLEAR_AGENT_ALL_STATE, DELETE_BUYER_AGENT, DELETE_BUYER_AGENT_BY_RANGE, DROP_DOWN_BUYER_AGENTS, GET_BUYER_AGENTS, GET_BUYER_AGENTS_BY_QUERY, GET_BUYER_AGENT_BY_ID, IS_AGENT_DATA_LOADED, OPEN_BUYER_AGENT_SIDEBAR, OPEN_BUYER_AGENT_SIDEBAR_FOR_EDIT, SELECTED_BUYER_AGENT_NULL, UPDATE_BUYER_AGENT
} from "../actionTypes";

const initialState = {
    isAgentDataLoaded: true,
    buyerAgents: [],
    queryData: [],
    total: 1,
    params: {},
    selectedBuyerAgent: null,
    openBuyerAgentSidebar: false,
    openBuyerAgentEditSidebar: false,
    dropDownBuyerAgents: [],
    isDropDownBuyerAgentsLoaded: true,
    isAgentImageUploading: false,
    agentBasicInfo: agentModel
};

const buyerAgentReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case IS_AGENT_DATA_LOADED:
            return { ...state, isAgentDataLoaded: action.isAgentDataLoaded };
        case GET_BUYER_AGENTS:
            return { ...state, buyerAgents: action.buyerAgents };

        case GET_BUYER_AGENT_BY_ID:
            return { ...state, agentBasicInfo: action.agentBasicInfo };

        case BIND_AGENT_BASIC_INFO:
            return { ...state, agentBasicInfo: action.agentBasicInfo };

        case SELECTED_BUYER_AGENT_NULL:
            return { ...state, selectedBuyerAgent: action.selectedBuyerAgent };
        case OPEN_BUYER_AGENT_SIDEBAR:
            return { ...state, openBuyerAgentSidebar: action.openBuyerAgentSidebar };
        case OPEN_BUYER_AGENT_SIDEBAR_FOR_EDIT:
            return { ...state, openBuyerAgentEditSidebar: action.openBuyerAgentEditSidebar };
        case DROP_DOWN_BUYER_AGENTS:
            return {
                ...state,
                dropDownBuyerAgents: action.dropDownBuyerAgents,
                isDropDownBuyerAgentsLoaded: action.isDropDownBuyerAgentsLoaded
            };
        case GET_BUYER_AGENTS_BY_QUERY:
            return {
                ...state,
                queryData: action.buyerAgents,
                total: action.totalPages,
                params: action.params
            };
        case ADD_BUYER_AGENT:
            return { ...state };
        case CLEAR_AGENT_ALL_STATE:
            return {
                ...state,
                isAgentDataLoaded: true,
                buyerAgents: [],

                dropDownBuyerAgents: [],
                isAgentImageUploading: false,
                agentBasicInfo: agentModel
            };
        case UPDATE_BUYER_AGENT:
            return { ...state };
        case DELETE_BUYER_AGENT:
            return { ...state };
        case DELETE_BUYER_AGENT_BY_RANGE:
            return { ...state };
        case AGENT_IMAGE_UPLOADING:
            return { ...state, isAgentImageUploading: action.isAgentImageUploading };
        default:
            return state;
    }
};
export default buyerAgentReduces;

import { destinationModel } from '../../model';
import { ADD_DESTINATION, BIND_DESTINATION_DATA, DELETE_DESTINATION, DELETE_DESTINATIONS_BY_RANGE, DROP_DOWN_DESTINATIONS, GET_DESTINATIONS, GET_DESTINATIONS_BY_DESTINATION_GROUP_ID, GET_DESTINATIONS_BY_QUERY, GET_DESTINATION_BY_BUYER_ID, GET_DESTINATION_BY_COUNTRY_NAME, GET_DESTINATION_BY_ID, GET_STYLE_DESTINATIONS_DROP_DOWN, IS_DESTINATION_DATA_LOADED, IS_DESTINATION_DATA_ON_PROGRESS, IS_DESTINATION_DATA_SUBMIT_PROGRESS, OPEN_DESTINATION_SIDEBAR, OPEN_DESTINATION_SIDEBAR_FOR_EDIT, SELECTED_DESTINATION_NULL, UPDATE_DESTINATION } from '../actionTypes';

// export const IS_DESTINATION_DATA_LOADED = "IS_DESTINATION_DATA_LOADED";
// export const IS_DESTINATION_DATA_ON_PROGRESS = "IS_DESTINATION_DATA_ON_PROGRESS";
// export const IS_DESTINATION_DATA_SUBMIT_PROGRESS = "IS_DESTINATION_DATA_SUBMIT_PROGRESS";

const initialState = {
    isDestinationDataLoaded: true,
    isDestinationDataOnProgress: false,
    isDestinationDataSubmitProgress: false,
    destinations: [],
    queryData: [],
    total: 1,
    params: {},
    selectedDestination: null,
    openDestinationSidebar: false,
    openDestinationSidebarForEdit: false,
    dropDownDestinations: null,
    lastCreatedId: null,
    destinationGroupsDestinations: [],
    styleDestinationsDropdown: [],
    destinationDropdownCountryWise: [],
    isDestinationDropdownCountryWiseLoaded: true,
    destinationDropdownBuyerWise: [],
    destination: destinationModel
};


const destinationsReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case IS_DESTINATION_DATA_LOADED:
            return { ...state, isDestinationDataLoaded: action.isDestinationDataLoaded };
        case IS_DESTINATION_DATA_ON_PROGRESS:
            return { ...state, isDestinationDataOnProgress: action.isDestinationDataOnProgress };
        case IS_DESTINATION_DATA_SUBMIT_PROGRESS:
            return { ...state, isDestinationDataSubmitProgress: action.isDestinationDataSubmitProgress };
        case GET_DESTINATIONS:
            return { ...state, destinations: action.destinations };
        case GET_DESTINATION_BY_ID:
            return { ...state, destination: action.destination };
        case GET_STYLE_DESTINATIONS_DROP_DOWN:
            return { ...state, styleDestinationsDropdown: action.styleDestinationsDropdown };
        case SELECTED_DESTINATION_NULL:
            return { ...state, selectedDestination: action.selectedDestination };
        case OPEN_DESTINATION_SIDEBAR:
            return { ...state, openDestinationSidebar: action.openDestinationSidebar };
        case OPEN_DESTINATION_SIDEBAR_FOR_EDIT:
            return { ...state, openDestinationSidebarForEdit: action.openDestinationSidebarForEdit };
        case DROP_DOWN_DESTINATIONS:
            return { ...state, dropDownDestinations: action.dropDownDestinations };
        case GET_DESTINATION_BY_COUNTRY_NAME:
            return {
                ...state,
                destinationDropdownCountryWise: action.destinationDropdownCountryWise,
                isDestinationDropdownCountryWiseLoaded: action.isDestinationDropdownCountryWiseLoaded
            };
        case GET_DESTINATION_BY_BUYER_ID:
            return { ...state, destinationDropdownBuyerWise: action.destinationDropdownBuyerWise };
        case GET_DESTINATIONS_BY_QUERY:
            return {
                ...state,
                queryData: action.destinations,
                total: action.totalPages,
                params: action.params
            };
        case BIND_DESTINATION_DATA:
            return { ...state, destination: action.destination };
        case ADD_DESTINATION:
            return { ...state, lastCreatedId: action.lastCreatedId };
        case UPDATE_DESTINATION:
            return { ...state };
        case DELETE_DESTINATION:
            return { ...state };
        case DELETE_DESTINATIONS_BY_RANGE:
            return { ...state };
        case GET_DESTINATIONS_BY_DESTINATION_GROUP_ID:
            return { ...state, destinationGroupsDestinations: action.destinationGroupsDestinations };
        default:
            return state;
    }
};
export default destinationsReduces;

import { UPDATE_ITEM_SEGMENT } from "../action-types";


const initialState = {
    itemSegmentsData: [],
    itemGroupSegmentsWithValue: {}
};


const itemSegmentReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case UPDATE_ITEM_SEGMENT:
            return { ...state };

        default:
            return state;
    }
};
export default itemSegmentReducer;
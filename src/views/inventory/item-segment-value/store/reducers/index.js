
import { UPDATE_ITEM_SEGMENT_VALUE } from "../action-types";

const initialState = {
    itemSegmentsValuesData: []
};


const itemSegmentValueReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case UPDATE_ITEM_SEGMENT_VALUE:
            return { ...state };
        default:
            return state;
    }
};
export default itemSegmentValueReducer;
import { notify } from "@custom/notifications";
import axios from "axios";
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { ADD_PRE_COSTING, DELETE_PRE_COSTING, DELETE_PRE_COSTINGS_BY_RANGE, DROP_DOWN_PRE_COSTINGS, GET_PRE_COSTINGS, GET_PRE_COSTINGS_BY_QUERY, GET_PRE_COSTING_BY_ID, SELECTED_PRE_COSTING_NULL, UPDATE_PRE_COSTING } from "../action-types";

//GET all without Query or Pagination
export const getAllPreCostings = () => {
    return async dispatch => {
        await axios.get( `${merchandisingApi.preCosting.get_pre_costings}` )
            .then( response => {
                dispatch( {
                    type: GET_PRE_COSTINGS,
                    preCostings: response.data
                } );
            } );
    };
};

//GET Dropdown Data
export const getDropDownPreCostings = () => {
    return async dispatch => {
        await axios.get( `${merchandisingApi.preCosting.get_pre_costings}` )
            .then( response => {
                dispatch( {
                    type: DROP_DOWN_PRE_COSTINGS,
                    dropDowndownPreCostings: response.data.map( item => (
                        {
                            value: item.id,
                            label: item.preCostingNo
                        }
                    ) )
                } );
            } );
    };
};

//PreCosting Query Data 
export const getPreCostingByQuery = ( params ) => {
    return async dispatch => {
        await axios.get( `${merchandisingApi.preCosting.get_pre_costings_by_query}`, params )
            .then( response => {
                dispatch( {
                    type: GET_PRE_COSTINGS_BY_QUERY,
                    preCostings: response.data.preCostings,
                    totalPages: response.data.total,
                    params
                } );
            } );
    };
};

//GET PreCosting by Id
export const getPreCostingById = ( id ) => {
    return async dispatch => {
        await axios.get( `${merchandisingApi.preCosting.get_pre_costing_by_id}`, id )
            .then( response => {
                dispatch( {
                    type: GET_PRE_COSTING_BY_ID,
                    selectedPreCosting: response.data.preCosting ? response.data.preCosting : null
                } );
            } );
    };
};

//Selected Pre Costing must be Empty after Edit or Details 
export const selectedPreCostingNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_PRE_COSTING_NULL,
            selectedPreCosting: null
        } );
    };
};


///Add PreCosting 
export const addPreCosting = ( preCosting ) => {
    return async ( dispatch, getState ) => {
        await axios.post( `${merchandisingApi.preCosting.add_pre_costing}`, preCosting )
            .then( response => {
                dispatch( {
                    type: ADD_PRE_COSTING,
                    preCosting
                } );
            } )
            .then( () => {
                notify( 'success', 'The Pre-Costing has been added Successfully.' );
                dispatch( getPreCostingByQuery( getState().preCostings.params ) );
                dispatch( getAllPreCostings() );
            } );
    };
};


/// Update Pre Costing 
export const updatePreCosting = ( preCosting ) => {
    return async ( dispatch, getState ) => {
        await axios.put( `${merchandisingApi.preCosting.update_pre_costing}`, preCosting )
            .then( response => {
                dispatch( {
                    type: UPDATE_PRE_COSTING,
                    preCosting
                } );
            } )
            .then( () => {
                notify( 'success', 'The Pre Costing has been updated Successfully' );
                dispatch( getPreCostingByQuery( getState().preCostings.params ) );
                dispatch( getAllPreCostings() );
            } );
    };
};

///Delete Pre Costing by Id
export const deletePreCosting = ( id ) => {
    return async ( dispatch, getState ) => {
        await axios.delete( `${merchandisingApi.preCosting.delete_pre_costing}`, { id } )
            .then( response => {
                dispatch( {
                    type: DELETE_PRE_COSTING
                } );
            } )
            .then( () => {
                notify( 'success', 'The Pre Costing has been deleted Successfully' );
                dispatch( getPreCostingByQuery( getState().preCostings.params ) );
                dispatch( getAllPreCostings() );
            } );
    };
};

/// Delete Pre Costing by Range
export const deleteRangePreCosting = ( ids ) => {
    return async ( dispatch, getState ) => {
        await axios.delete( `${merchandisingApi.preCosting.delete_pre_costing_by_range}`, { ids } )
            .then( response => {
                dispatch( {
                    type: DELETE_PRE_COSTINGS_BY_RANGE
                } );
            } )
            .then( () => {
                notify( 'success', 'The Pre Costing has been deleted Successfully' );
                dispatch( getPreCostingByQuery( getState().preCostings.params ) );
                dispatch( getAllPreCostings() );
            } );
    };
};


import { notify } from "@custom/notifications";
import { baseAxios } from '@services';
import { inventoryApi } from '../../../../../services/api-end-points/inventory';
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { confirmObj, status } from "../../../../../utility/enums";
import { randomIdGenerator } from "../../../../../utility/Utils";
import {
    ADD_UNIT_SET,
    DELETE_UNIT_SET,
    DELETE_UNIT_SETS_BY_RANGE,
    DROP_DOWN_UNIT_SETS,
    GET_DEFAULT_UOM_DROPDOWN,
    GET_ORDER_AND_CONSUMPTION_UOM_DROPDOWN_BY_ITEM_GROUP_ID,
    GET_UNIT_SETS_BY_QUERY,
    GET_UNIT_SETS_UNIT_BY_ID,
    GET_UNIT_SET_BY_ID, GET_UOM_DROPDOWN_BY_UOM_SET_ID, GET_UOM_DROPDOWN_BY_UOM_SET_NAME, OPEN_UNIT_SET_SIDEBAR,
    OPEN_UNIT_SET_SIDEBAR_FOR_EDIT,
    SELECTED_UNIT_SET_NULL,
    UNIT_SETS_UNITS,
    UPDATE_UNIT_SET,
    UPDATE_UNIT_SET_UNIT
} from "../action-types";


// Open Unit Sidebar
export const handleOpenUnitSetSidebar = ( condition ) => async dispatch => {
    await dispatch( {
        type: OPEN_UNIT_SET_SIDEBAR,
        openUnitSetSidebar: condition
    } );
};
// Open Unit Sidebar
export const handleOpenUnitSetEditSidebar = ( condition ) => async dispatch => {
    await dispatch( {
        type: OPEN_UNIT_SET_SIDEBAR_FOR_EDIT,
        openUnitSetEditSidebar: condition
    } );
};

// Get All unitSet without Query
export const getUnitSetsDropdown = () => async dispatch => {
    await baseAxios.get( `${inventoryApi.unitSet.root}` ).then( response => {
        dispatch( {
            type: DROP_DOWN_UNIT_SETS,
            dropDownUnitSet: response.data.data.map( i => ( {
                value: i.id, label: i.name
            } ) )
        } );
    } );
};


export const getUomDropdownByUnitSetId = ( unitSetId ) => async dispatch => {
    if ( unitSetId ) {
        await baseAxios.get( `${inventoryApi.unitSet.root}/${unitSetId}/details` ).then( response => {
            console.log( response );
            dispatch( {
                type: GET_UOM_DROPDOWN_BY_UOM_SET_ID,
                dropdownUnitSetUom: response.data.map( unit => ( {
                    label: unit.unitName,
                    description: unit.description,
                    value: unit.id,
                    isBaseUnit: unit.isBaseUnit,
                    relativeFactor: unit.relativeFactor,
                    uomSetId: unit.uomSetId
                } ) )
            } );
        } );
    } else {
        dispatch( {
            type: GET_UOM_DROPDOWN_BY_UOM_SET_ID,
            dropdownUnitSetUom: []
        } );
    }
};


export const getUomDropdownByUnitSetName = ( unitSetName ) => async dispatch => {
    if ( unitSetName ) {
        await baseAxios.get( `${inventoryApi.unitSet.root}/${unitSetName}/uomDetails` ).then( response => {
            dispatch( {
                type: GET_UOM_DROPDOWN_BY_UOM_SET_NAME,
                dropdownUom: response.data.map( unit => ( {
                    label: unit.unitName,
                    description: unit.description,
                    value: unit.id,
                    isBaseUnit: unit.isBaseUnit,
                    relativeFactor: unit.relativeFactor,
                    uomSetId: unit.uomSetId
                } ) )
            } );
        } );
    } else {
        dispatch( {
            type: GET_UOM_DROPDOWN_BY_UOM_SET_NAME,
            dropdownUom: []
        } );
    }
};


export const getOrderAndConsumptionUOMDropdown = ( itemGroupId ) => async dispatch => {
    if ( itemGroupId ) {
        const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/orderAndConsumptionUomSetDetails`;
        await baseAxios.get( endPoint )
            .then( response => {
                console.log( response );
                const consumptionUoms = response?.data?.consumptionUoms.map( conUOM => ( {
                    label: conUOM?.unitName, value: conUOM?.id, relativeFactor: conUOM?.relativeFactor
                } ) );
                const orderUoms = response?.data?.orderUoms.map( conUOM => ( {
                    label: conUOM?.unitName, value: conUOM?.id, relativeFactor: conUOM?.relativeFactor
                } ) );
                dispatch( {
                    type: GET_ORDER_AND_CONSUMPTION_UOM_DROPDOWN_BY_ITEM_GROUP_ID,
                    consumptionUOMDropdown: consumptionUoms,
                    orderMDropdown: orderUoms
                } );
            } );
    } else {
        dispatch( {
            type: GET_ORDER_AND_CONSUMPTION_UOM_DROPDOWN_BY_ITEM_GROUP_ID,
            consumptionUOMDropdown: [],
            orderMDropdown: []
        } );
    }
};
export const getDefaultUOMDropdownByUnitId = ( unitId ) => async dispatch => {
    const endPoint = `${inventoryApi.unitSet.root}/${unitId}/details`;
    dispatch( {
        type: GET_DEFAULT_UOM_DROPDOWN,
        defaultUOMDropdown: [],
        isDefaultUOMDropdownLoaded: false
    } );
    await baseAxios.get( endPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const defaultOUM = response?.data?.map( uom => ( {
                    label: uom?.unitName, value: uom?.id, isBaseUnit: uom?.isBaseUnit, relativeFactor: uom.relativeFactor
                } ) );

                dispatch( {
                    type: GET_DEFAULT_UOM_DROPDOWN,
                    defaultUOMDropdown: defaultOUM,
                    isDefaultUOMDropdownLoaded: true
                } );
            }

        } ).catch( ( { response } ) => {
            dispatch( {
                type: GET_DEFAULT_UOM_DROPDOWN,
                defaultUOMDropdown: [],
                isDefaultUOMDropdownLoaded: true
            } );
            if ( response === undefined || response?.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response?.data?.errors.join( ', ' )}` );
            }
        } );
};

// Get unitSet by Query
export const getUnitSetsByQuery = params => async dispatch => {
    await baseAxios.get( `${inventoryApi.unitSet.root}`, params ).then( response => {
        dispatch( {
            type: GET_UNIT_SETS_BY_QUERY,
            queryData: response.data.data,
            totalPages: response.data.total,
            params
        } );
    } );
};

// Get unitSet By Id
export const getUnitSetById = id => async dispatch => {
    if ( id ) {
        await baseAxios.get( `${inventoryApi.unitSet.root}/${id}` ).then( response => {
            dispatch( {
                type: GET_UNIT_SET_BY_ID,
                selectedUnitSet: response.data ? response.data : null
            } );
        } ).catch( err => console.log( err ) );
    } else {
        dispatch( {
            type: GET_UNIT_SET_BY_ID,
            selectedUnitSet: null
        } );
    }

};
export const getUnitSetUnitsById = id => async dispatch => {
    await baseAxios.get( `${inventoryApi.unitSet.root}/${id}` ).then( response => {
        const responseArray = {
            id: response.data.id,
            name: response.data.name,
            description: response.data.description,
            details: response.data.details ? response.data.details?.map( unit => ( {
                id: randomIdGenerator(),
                uomSetId: unit.uomSetId,
                unitName: unit.unitName,
                description: unit.description,
                relativeFactor: unit.relativeFactor,
                isBaseUnit: unit.isBaseUnit,
                isEdit: false
            } ) ) : []
        };
        dispatch( {
            type: GET_UNIT_SETS_UNIT_BY_ID,
            unitSetUnits: response.data ? responseArray : []
        } );
    } ).catch( err => console.log( err ) );
};

// Selected unitSet Null after Edit
export const selectedUnitSetNull = () => async dispatch => {
    await dispatch( {
        type: SELECTED_UNIT_SET_NULL,
        selectedUnitSet: null
    } );
};

// Add new unitSet
export const addUnitSet = unitSet => async ( dispatch, getState ) => {
    await baseAxios.post( `${inventoryApi.unitSet.root}`, unitSet )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_UNIT_SET,
                    unitSet
                } );
                dispatch( getUnitSetsByQuery( getState().unitSets.params ) );
                notify( 'success', 'The Unit Set has been added Successfully!' );
                dispatch( handleOpenUnitSetSidebar( false ) );
            }
        } ).catch( err => console.log( err ) );

};

//Update unitSet
export const updateUnitSet = ( unitSet, unitSetId ) => async ( dispatch, getState ) => {
    await baseAxios.put( `${inventoryApi.unitSet.root}/${unitSetId}`, unitSet ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: UPDATE_UNIT_SET_UNIT,
                unitSet
            } );
            dispatch( getUnitSetsByQuery( getState().unitSets.params ) );
            notify( 'success', 'The Unit Set has been updated Successfully!' );
            dispatch( handleOpenUnitSetEditSidebar( false ) );
            dispatch( getUnitSetById( null ) );
        }
    } ).catch( err => console.log( err ) );

};
export const updateUnitSetUnit = ( unitSetUnit, unitSetId ) => async dispatch => {
    await baseAxios.put( `${inventoryApi.unitSet.root}/${unitSetId}/details`, unitSetUnit ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: UPDATE_UNIT_SET,
                unitSetUnit
            } );
            dispatch( getUnitSetUnitsById( unitSetId ) );
            notify( 'success', 'The Unit Set has been updated Successfully!' );
        }
    } ).catch( err => console.log( err ) );

};

// Delete unitSet
export const deleteUnitSet = id => async ( dispatch, getState ) => {
    await confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios.delete( `${inventoryApi.unitSet.root}`, { id } ).then( response => {
                dispatch( {
                    type: DELETE_UNIT_SET
                } );
            } ).then( () => {
                notify( 'success', 'The Unit Set  has been deleted Successfully!' );
                dispatch( getUnitSetsByQuery( getState().unitSet.params ) );
            } );
        }
    } );
};

// Delete unitSet Range
export const deleteRangeUnitSets = ids => async ( dispatch, getState ) => {
    await confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios.delete( `${inventoryApi.unitSet.root}`, { ids } ).then( response => {
                dispatch( {
                    type: DELETE_UNIT_SETS_BY_RANGE
                } );
            } ).then( () => {
                notify( 'success', 'The Unit Set  has been deleted Successfully!' );
                dispatch( getUnitSetsByQuery( getState().unitSet.params ) );
            } );
        }
    } );
};


export const bindUnitSetUnitOnChange = ( units ) => async dispatch => {
    await dispatch( {
        type: UNIT_SETS_UNITS,
        unitSetUnits: units
    } );
};

import { notify } from "@custom/notifications";
import { baseAxios } from '@services';
import { convertQueryString } from "@utils";
import { inventoryApi } from "../../../../../services/api-end-points/inventory";
import { status } from "../../../../../utility/enums";
import { warehouseData } from "../../model";
import { ADD_WAREHOUSE, BIND_WAREHOUSE_DATA_ONCHANGE, GET_WAREHOUSES, GET_WAREHOUSE_BY_ID, GET_WAREHOUSE_BY_QUERY, GET_WAREHOUSE_DROPDOWN, IS_WAREHOUSE_DATA_LOADED, IS_WAREHOUSE_ON_PROGRESS, UPDATE_WAREHOUSE } from '../action-types';

export const warehouseDataLoaded = ( condition ) => dispatch => {
    dispatch( {
        type: IS_WAREHOUSE_DATA_LOADED,
        isWarehouseDataLoaded: condition
    } );
};

export const warehouseOnProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_WAREHOUSE_ON_PROGRESS,
        isWarehouseOnProgress: condition
    } );
};

export const bindWarehouseDataOnchange = ( warehouse ) => dispatch => {
    if ( warehouse ) {
        dispatch( {
            type: BIND_WAREHOUSE_DATA_ONCHANGE,
            warehouse
        } );
    } else {
        dispatch( {
            type: BIND_WAREHOUSE_DATA_ONCHANGE,
            warehouse: warehouseData
        } );
    }
};


export const getWarehousesByQuery = ( params, queryData ) => async dispatch => {
    dispatch( warehouseDataLoaded( false ) );
    const apiEndPoint = `${inventoryApi.warehouse.root}/grid?${convertQueryString( params )}`;
    await baseAxios.post( apiEndPoint, queryData ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: GET_WAREHOUSE_BY_QUERY,
                warehouses: response.data.data,
                totalPages: response.data.total,
                params,
                queryObj: queryData
            } );
            dispatch( warehouseDataLoaded( true ) );

        } else {
            notify( 'error', 'The Warehouses Data not Found!' );
        }
    } ).catch( ( ( { response } ) => {
        dispatch( warehouseDataLoaded( true ) );
        if ( response.status === status.badRequest || response.status === status.notFound || response.status === status.severError ) {
            notify( 'error', 'Please contact the support team!' );
        }
    } ) );
};

export const getWarehouses = () => async dispatch => {
    const apiEndPoint = `${inventoryApi.warehouse.root}`;
    await baseAxios.get( apiEndPoint )
        .then( response => {
            dispatch( {
                type: GET_WAREHOUSES,
                warehouses: response.data.data
            } );
        } );
};

export const getWarehouseDropdown = () => async dispatch => {
    const apiEndPoint = `${inventoryApi.warehouse.root}`;
    await baseAxios.get( apiEndPoint )
        .then( response => {
            const dropdown = response.data.data.map( vendor => (
                {
                    value: vendor.id,
                    label: vendor.name
                }
            ) );
            dispatch( {
                type: GET_WAREHOUSE_DROPDOWN,
                warehouseDropdown: dropdown
            } );
        } );
};

export const getWarehouseById = ( warehouseId ) => async dispatch => {
    dispatch( warehouseOnProgress( true ) );
    const apiEndPoint = `${inventoryApi.warehouse.root}/${warehouseId}`;

    await baseAxios.get( apiEndPoint ).then( ( response ) => {
        if ( response.status === status.success ) {
            const { data } = response;
            const updatedData = {
                ...data,
                fullAddress: data.address,
                city: data.city.length ? { label: data.city, value: data.city } : null,
                state: data.state.length ? { label: data.state, value: data.state } : null,
                country: data.country.length ? { label: data.country, value: data.country } : null,
                tags: data?.tags ? data?.tags?.map( t => ( { label: t, value: t } ) ) : [],
                itemGroupList: data.itemCategoryList.map( item => ( { ...item, itemGroupId: item.categoryId } ) ) ?? []
            };

            dispatch( {
                type: GET_WAREHOUSE_BY_ID,
                warehouse: updatedData
            } );
            dispatch( warehouseOnProgress( false ) );

        }
    } ).catch( ( { response } ) => {
        dispatch( warehouseOnProgress( false ) );

        if ( response.status === status.severError ) {
            notify( 'error', `Please contact the support team!!!` );
        } else {
            notify( 'warning', `${response.data.errors.join( ', ' )}` );
        }
    } );


};

export const addWarehouse = ( warehouse, push ) => async dispatch => {
    dispatch( warehouseOnProgress( true ) );

    const apiEndPoint = `${inventoryApi.warehouse.root}`;
    await baseAxios.post( apiEndPoint, warehouse )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_WAREHOUSE
                } );
                notify( 'success', 'The Warehouse has been added Successfully!' );
                push( { pathname: `/edit-warehouse`, state: `${response.data}` } );

            } else {
                notify( 'warning', 'The Warehouse has been added failed!' );
            }
        } ).catch( ( { response } ) => {
            dispatch( warehouseOnProgress( false ) );

            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response?.data?.errors?.join( ', ' )}` );
            }
        } );
};
export const updateWarehouse = ( warehouse, warehouseId ) => async dispatch => {
    dispatch( warehouseOnProgress( true ) );

    const apiEndPoint = `${inventoryApi.warehouse.root}/${warehouseId}`;
    await baseAxios.put( apiEndPoint, warehouse )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_WAREHOUSE
                } );
                notify( 'success', 'The Warehouse has been updated Successfully!' );
                //  dispatch( getWarehouses() );
                dispatch( getWarehouseById( warehouseId ) );

            } else {
                notify( 'success', 'The Warehouse has been updated failed!' );
            }
        } ).catch( ( { response } ) => {
            dispatch( warehouseOnProgress( false ) );

            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

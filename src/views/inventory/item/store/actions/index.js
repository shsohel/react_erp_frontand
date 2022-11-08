import { notify } from "@custom/notifications";
import { baseAxios } from '@services';
import { inventoryApi } from '../../../../../services/api-end-points/inventory';
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { status } from "../../../../../utility/enums";
import { convertQueryString, randomIdGenerator } from "../../../../../utility/Utils";
import { getItemSegmentDropDownByItemGroupId } from "../../../item-group/store/actions";
import { itemBasicInfoModel } from "../../model";
import {
    ADD_ITEM, BIND_ITEM_BASIC_INFO,
    DELETE_ITEM, DELETE_ITEMS_BY_RANGE, GET_DROP_DOWN_ITEMS, GET_ITEMS_BY_QUERY,
    GET_ITEM_BY_ID,
    GET_ITEM_DESCRIPTION_DROPDOWN,
    IS_ITEM_DATA_LOADED,
    IS_ITEM_DATA_ON_PROGRESS,
    IS_ITEM_DATA_SUBMIT_PROGRESS,
    OPEN_ITEM_SIDEBAR,
    OPEN_ITEM_SIDEBAR_FOR_EDIT,
    SELECTED_ITEM_NULL,
    UPDATE_ITEM
} from "../action-types";


const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};

//  case IS_ITEM_DATA_LOADED:
// return { ...state, isItemDataLoaded: action.isItemDataLoaded };
//         case IS_ITEM_DATA_ON_PROGRESS:
// return { ...state, isItemDataOnProgress: action.isItemDataOnProgress };
//         case IS_ITEM_DATA_SUBMIT_PROGRESS:
// return { ...state, isItemDataSubmitProgress: action.isItemDataSubmitProgress };

export const itemDataLoaded = ( condition ) => dispatch => {
    dispatch( {
        type: IS_ITEM_DATA_LOADED,
        isItemDataLoaded: condition
    } );
};

export const itemDataOnProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_ITEM_DATA_ON_PROGRESS,
        isItemDataOnProgress: condition
    } );
};
export const itemDataSubmitProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_ITEM_DATA_SUBMIT_PROGRESS,
        isItemDataSubmitProgress: condition
    } );
};


// Open item Sidebar
export const handleOpenItemSidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_ITEM_SIDEBAR,
            openItemSidebar: condition
        } );
    };
};
export const handleOpenItemEditSidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_ITEM_SIDEBAR_FOR_EDIT,
            openItemEditSidebar: condition
        } );
    };
};
export const bindItemBasicInfo = ( itemBasicInfo ) => dispatch => {
    dispatch( {
        type: BIND_ITEM_BASIC_INFO,
        itemBasicInfo
    } );
};

// Get All itemGroup Without Query
export const getAllItems = () => {
    return async dispatch => {
        await baseAxios.get( `${inventoryApi.item.root}` ).then( response => {
            dispatch( {
                type: GET_ITEMS_BY_QUERY,
                items: response.data
            } );
        } );
    };
};

// // Get All item without Query
// export const getDropDownItems = () => {
//     return async dispatch => {
//         await baseAxios.get( `${inventoryApi.item.root}` ).then( response => {
//             dispatch( {
//                 type: DROP_DOWN_ITEMS,
//                 dropDownItems: response.data.map( item => ( {
//                     value: item.id, label: item.subCategory.name
//                 } ) )
//             } );
//         } );
//     };
// };

// Get itemGroup by Query
export const getItemsByQuery = ( params, queryData ) => async dispatch => {
    const apiEndPoint = `${inventoryApi.item.root}/grid?${convertQueryString( params )}`;
    dispatch( itemDataLoaded( false ) );
    await baseAxios.post( apiEndPoint, queryData ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: GET_ITEMS_BY_QUERY,
                itemGroups: response.data.data.map( item => ( { ...item, id: randomIdGenerator(), itemId: item.id } ) ),
                totalPages: response.data.totalRecords,
                params
            } );
            dispatch( itemDataLoaded( true ) );
        }

    } ).catch( ( ( { response } ) => {
        dispatch( itemDataLoaded( true ) );
        if ( response.status === status.badRequest || response.status === status.notFound || response.status === status.severError ) {
            notify( 'error', 'Please contact the support team!' );
        }
        if ( response.status === status.conflict ) {
            notify( 'warning', `${response.statusText}` );
        }
    } ) );
};

// Get Item Dropdown
export const getDropDownItems = () => async dispatch => {
    await baseAxios.post( `${inventoryApi.item.root}/grid?isActive=true`, [] ).then( response => {

        dispatch( {
            type: GET_DROP_DOWN_ITEMS,
            dropdownItems: response.data.data.map( item => ( { ...item, label: item.name, value: item.id } ) )
        } );
    } );
};

// Get itemGroup By Id
export const getItemById = id => async dispatch => {
    if ( id ) {
        dispatch( itemDataOnProgress( true ) );

        await baseAxios.get( `${inventoryApi.item.root}/${id}` ).then( response => {
            if ( response.status === status.success ) {
                const { data } = response;
                const responseData = {
                    id: data.id,
                    itemGroupId: data.categoryId,
                    itemGroup: { label: data.category, value: data?.categoryId },
                    itemSubGroupId: data.subCategoryId,
                    itemSubGroup: { label: data?.subCategory, value: data?.subCategoryId },
                    itemNumber: data.itemNumber,
                    name: data.name,
                    sku: data.sku,
                    uom: { label: data?.uom, value: data?.uom }
                };
                dispatch( {
                    type: GET_ITEM_BY_ID,
                    itemBasicInfo: response.data ? responseData : null
                } );
                dispatch( handleOpenItemEditSidebar( true ) );
                dispatch( getItemSegmentDropDownByItemGroupId( data.categoryId ) );
                dispatch( itemDataOnProgress( false ) );

            }
        } ).catch( ( ( { response } ) => {
            dispatch( itemDataOnProgress( false ) );
            if ( response.status === status.badRequest || response.status === status.notFound || response.status === status.severError ) {
                notify( 'error', 'Please contact the support team!' );
            }
            if ( response.status === status.conflict ) {
                notify( 'warning', `${response.statusText}` );
            }
        } ) );
    } else {
        dispatch( {
            type: GET_ITEM_BY_ID,
            itemBasicInfo: null
        } );
    }
};

// Selected item Null after Edit
export const selectedItemGroupNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_ITEM_NULL,
            selectedItem: null
        } );
    };
};

// Add new item
export const addItem = item => async ( dispatch, getState ) => {
    dispatch( itemDataSubmitProgress( true ) );

    await baseAxios.post( `${inventoryApi.item.root}`, item )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_ITEM,
                    item
                } );
                notify( 'success', 'The Item has been added Successfully!' );
                dispatch( getItemsByQuery( getState().items.params, [] ) );
                dispatch( handleOpenItemSidebar( false ) );
                dispatch( bindItemBasicInfo( itemBasicInfoModel ) );
                dispatch( itemDataSubmitProgress( false ) );

            } else {
                notify( 'error', 'The Item has been added Failed!' );
            }
        } ).catch( ( ( { response } ) => {
            dispatch( itemDataSubmitProgress( false ) );
            if ( response.status === status.badRequest || response.status === status.notFound || response.status === status.severError ) {
                notify( 'error', 'Please contact the support team!' );
            }
            if ( response.status === status.conflict ) {
                notify( 'warning', `${response.statusText}` );
            }
        } ) );
};

//Update item
export const updateItem = ( item, itemId ) => async ( dispatch, getState ) => {
    dispatch( itemDataSubmitProgress( true ) );
    await baseAxios.put( `${inventoryApi.item.root}/${itemId}`, item ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: UPDATE_ITEM,
                item
            } );
            notify( 'success', 'The Item has been updated Successfully!' );
            dispatch( getItemsByQuery( getState().items.params, [] ) );
            dispatch( handleOpenItemEditSidebar( false ) );
            dispatch( bindItemBasicInfo( itemBasicInfoModel ) );
            dispatch( itemDataSubmitProgress( false ) );

        }
    } ).catch( ( ( { response } ) => {
        dispatch( itemDataSubmitProgress( false ) );
        if ( response.status === status.badRequest || response.status === status.notFound || response.status === status.severError ) {
            notify( 'error', 'Please contact the support team!' );
        }
        if ( response.status === status.conflict ) {
            notify( 'warning', `${response.statusText}` );
        }
    } ) );
};

// Delete item
export const deleteItem = id => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                await baseAxios.delete( `${inventoryApi.item.root}/${id}` ).then( response => {
                    dispatch( {
                        type: DELETE_ITEM
                    } );
                } ).then( () => {
                    notify( 'success', 'The Item  has been deleted Successfully!' );
                    dispatch( getItemsByQuery( getState().items.params, [] ) );
                } );
            }
        } );
    };
};

// Delete item Range
export const deleteRangeItem = ids => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios.delete( `${inventoryApi.itemGroup.delete_item_group_by_range}`, { ids } ).then( response => {
                    dispatch( {
                        type: DELETE_ITEMS_BY_RANGE
                    } );
                } ).then( () => {
                    notify( 'success', 'The Item  has been deleted Successfully!' );
                    dispatch( getItemsByQuery( getState().items.params ) );
                } );
            }
        } );
    };
};

export const getItemDescriptionByItemGroupAndSubGroupId = ( itemGroupId, itemSubGroupId ) => async dispatch => {
    if ( itemGroupId && itemSubGroupId ) {
        const endPoint = `${merchandisingApi.costing.root}/fabricDetails/itemGroup/${itemGroupId}/itemSubGroup/${itemSubGroupId}/itemDescriptionSuggestions`;
        await baseAxios.get( endPoint ).then( response => {
            const dropdownItemDescription = response.data.map( i => ( {
                label: i.itemDescription,
                value: i.itemDescription,
                itemDescriptionTemplate: i.itemDescriptionTemplate
            } ) );
            dispatch( {
                type: GET_ITEM_DESCRIPTION_DROPDOWN,
                dropdownItemDescription
            } );
        } );
    } else {
        dispatch( {
            type: GET_ITEM_DESCRIPTION_DROPDOWN,
            dropdownItemDescription: []
        } );
    }
};

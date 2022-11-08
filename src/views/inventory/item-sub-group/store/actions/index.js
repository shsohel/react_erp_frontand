import { notify } from "@custom/notifications";
import { baseAxios } from '@services';
import { inventoryApi } from '../../../../../services/api-end-points/inventory';
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { status } from "../../../../../utility/enums";
import { handleOpenAssignSubCategoryModal, itemGroupDataOnSubmitProgress } from "../../../item-group/store/actions";
import { ADD_ITEM_SUB_GROUP, DELETE_ITEM_SUB_GROUP, DELETE_ITEM_SUB_GROUP_BY_RANGE, DROP_DOWN_ITEM_SUB_GROUP, GET_FABRIC_SUB_CATEGORIES, GET_ITEM_SUB_GROUP, GET_ITEM_SUB_GROUP_BY_ID, GET_ITEM_SUB_GROUP_BY_QUERY, OPEN_ITEM_SUB_GROUP_SIDEBAR, SELECTED_ITEM_SUB_GROUP_NULL, UPDATE_ITEM_SUB_GROUP } from "../action-types";


const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};


// Get All Sub Item Group Without Query
export const getAllItemSubGroups = () => {
    return async dispatch => {
        await baseAxios.get( `${inventoryApi.itemSubGroup.get_item_sub_groups}` ).then( response => {
            dispatch( {
                type: GET_ITEM_SUB_GROUP,
                itemSubGroups: response.data
            } );
        } );
    };
};

// Get All Sub Item Group without Query
export const getDropDownItemSubGroups = () => {
    return async dispatch => {
        await baseAxios.get( `${inventoryApi.itemSubGroup.root}` ).then( response => {
            console.log( response );

            dispatch( {
                type: DROP_DOWN_ITEM_SUB_GROUP,
                dropDownItemSubGroups: response?.data?.data?.map( item => ( {
                    value: item.id, label: item.name
                } ) )
            } );
        } );
    };
};
export const getFabricSubGroupDropdown = () => async dispatch => {
    await baseAxios.get( `${inventoryApi.itemGroup.root}/subCategories` ).then( response => {
        dispatch( {
            type: GET_FABRIC_SUB_CATEGORIES,
            dropdownFabricSubGroup: response?.data?.map( item => ( {
                ...item,
                value: item.id,
                label: item.name
            } ) )
        } );
    } );
};

// Get Sub Item Group by Query
export const getItemSubGroupByQuery = ( id, subCategories, params ) => {
    return async dispatch => {
        await baseAxios.get( `${inventoryApi.itemSubGroup.root}/${id}/subCategories`, params ).then( response => {
            dispatch( {
                type: GET_ITEM_SUB_GROUP_BY_QUERY,
                itemSubGroups: response.data.data,
                totalPages: response.data.total,
                params
            } );
        } );
    };
};

// Get Sub Item Group By Id
export const getItemSubGroupById = id => {
    return async dispatch => {
        await baseAxios.get( `${inventoryApi.itemSubGroup.root}/${id}/subCategories` ).then( response => {
            dispatch( {
                type: GET_ITEM_SUB_GROUP_BY_ID,
                selectedItemSubGroup: response.data ? response.data : null
            } );
        } ).catch( err => console.log( err ) );
    };
};

// Selected Sub Item Group Null after Edit
export const selectedItemSubGroupNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_ITEM_SUB_GROUP_NULL,
            selectedItemSubGroup: null
        } );
    };
};

// Add new Sub Item Group
export const addItemSubGroup = subCategories => {
    return async ( dispatch, getState ) => {
        await baseAxios.put( `${inventoryApi.itemSubGroup.root}/{id}`, subCategories )
            .then( response => {
                dispatch( {
                    type: ADD_ITEM_SUB_GROUP,
                    subCategories
                } );
            } ).then( () => {
                notify( 'success', 'The Item Sub Group has been added Successfully!' );
                dispatch( getItemSubGroupByQuery( getState().itemSubGroups.params ) );
                //dispatch( getAllItemSubGroups() );
            } ).catch( err => console.log( err ) );
    };
};

//Update Sub Item Group
export const updateItemSubGroup = ( id, subCategories ) => dispatch => {
    dispatch( itemGroupDataOnSubmitProgress( true ) );
    const apiEndpoint = `${inventoryApi.itemSubGroup.root}/${id}/subCategories`;
    baseAxios.put( apiEndpoint, subCategories ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: UPDATE_ITEM_SUB_GROUP,
                subCategories
            } );
            dispatch( handleOpenAssignSubCategoryModal( false ) );
            notify( 'success', 'The Item Sub Group has been updated Successfully!' );
            dispatch( itemGroupDataOnSubmitProgress( false ) );


        }

    } ).catch( ( ( { response } ) => {
        dispatch( itemGroupDataOnSubmitProgress( false ) );

        if ( response.status === status.badRequest ) {
            notify( 'error', `${response.data.errors.join( ', ' )}` );
        }
        if ( response.status === status.notFound || response.status === status.severError ) {
            notify( 'error', 'Please contact the support team!' );
        }
        if ( response.status === status.conflict ) {
            notify( 'warning', `${response.statusText}` );
        }
    } ) );
};

// Delete Sub Item Group
export const deleteItemSubGroup = id => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                await baseAxios.delete( `${inventoryApi.itemSubGroup.delete_item_sub_group}`, { id } ).then( response => {
                    dispatch( {
                        type: DELETE_ITEM_SUB_GROUP
                    } );
                } ).then( () => {
                    notify( 'success', 'The Item Sub Group has been deleted Successfully!' );
                    dispatch( getItemSubGroupByQuery( getState().itemSubGroups.params ) );
                    dispatch( getAllItemSubGroups() );
                } );
            }
        } );
    };
};

// Delete Sub Item Group Range
export const deleteRangeItemSubGroup = ids => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios.delete( `${inventoryApi.itemSubGroup.delete_item_sub_group_by_range}`, { ids } ).then( response => {
                    dispatch( {
                        type: DELETE_ITEM_SUB_GROUP_BY_RANGE
                    } );
                } ).then( () => {
                    notify( 'success', 'The Item Sub Group has been deleted Successfully!' );
                    dispatch( getItemSubGroupByQuery( getState().itemSubGroups.params ) );
                    dispatch( getAllItemSubGroups() );
                } );
            }
        } );
    };
};

// Open Sub Item Group Sidebar
export const handleOpenItemSubGroupSidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_ITEM_SUB_GROUP_SIDEBAR,
            openItemSubGroupSidebar: condition
        } );
    };
};
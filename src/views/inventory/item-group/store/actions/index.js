import { notify } from "@custom/notifications";
import { baseAxios } from '@services';
import { inventoryApi } from '../../../../../services/api-end-points/inventory';
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { status } from "../../../../../utility/enums";
import { convertQueryString, randomIdGenerator } from "../../../../../utility/Utils";
import { ADD_ITEM_GROUP, DELETE_ITEM_GROUP_BY_RANGE, DROP_DOWN_CATEGORY_GROUPS, DROP_DOWN_ITEM_GROUPS, GET_ITEM_FABRIC_GROUPS_DROPDOWN_BY_GROUP, GET_ITEM_GROUPS, GET_ITEM_GROUPS_BY_QUERY, GET_ITEM_GROUPS_DROPDOWN_BY_GROUP, GET_ITEM_GROUP_BY_ID, GET_ITEM_PACK_GROUPS_DROPDOWN_BY_GROUP, GET_ITEM_SEGMENT_BY_ITEM_GROUP_ID, GET_ITEM_SEGMENT_DROPDOWN_BY_ITEM_GROUP_ID, GET_ITEM_SEGMENT_VALUE_BY_ITEM_GROUP_ID, GET_ITEM_SUB_GROUP_BY_ITEM_GROUP_ID, GET_ITEM_SUB_GROUP_DROPDOWN_BY_ITEM_GROUP_ID, GET_ITEM_SUB_GROUP_SEGMENT_BY_ITEM_GROUP_ID, GET_ITEM_TRIM_GROUPS_DROPDOWN_BY_GROUP, IS_ITEM_GROUP_DATA_LOADED, IS_ITEM_GROUP_DATA_SUBMIT_PROGRESS, IS_ITEM_GROUP_ON_PROGRESS, OPEN_ASSIGN_ITEM_SEGMENT_MODAL, OPEN_ASSIGN_ITEM_SEGMENT_VALUE_MODAL, OPEN_ASSIGN_SUB_CATEGORY_MODAL, OPEN_ITEM_GROUP_SIDEBAR, OPEN_ITEM_GROUP_SIDEBAR_FOR_EDIT, SELECTED_ITEM_GROUP_NULL, UPDATE_ITEM_GROUP } from "../action-types";


const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};


// Open itemGroup Sidebar
export const handleOpenItemGroupSidebarForEdit = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_ITEM_GROUP_SIDEBAR_FOR_EDIT,
            openItemGroupSidebarForEdit: condition
        } );
    };
};

export const itemGroupDataLoaded = ( condition ) => dispatch => {
    dispatch( {
        type: IS_ITEM_GROUP_DATA_LOADED,
        isItemGroupDataLoaded: condition
    } );
};
export const itemGroupOnProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_ITEM_GROUP_ON_PROGRESS,
        isItemGroupOnProgress: condition
    } );
};
export const itemGroupDataOnSubmitProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_ITEM_GROUP_DATA_SUBMIT_PROGRESS,
        isItemGroupDataSubmitProgress: condition
    } );
};


// Get All itemGroup Without Query
export const getAllItemGroups = () => {
    return async dispatch => {
        await baseAxios.get( `${inventoryApi.itemGroup.get_item_group}` ).then( response => {
            dispatch( {
                type: GET_ITEM_GROUPS,
                itemGroups: response.data
            } );
        } );
    };
};


// Get All itemGroup without Query
// export const getDropDownItems = () => {
//     return async dispatch => {
//         await baseAxios.get( `${inventoryApi.itemGroup.get_item_group}` ).then( response => {
//             dispatch( {
//                 type: DROP_DOWN_ITEM_GROUPS,
//                 dropDownItemGroups: response.data.map( item => ( {
//                     value: item.id, label: item.subCategory.name
//                 } ) )
//             } );
//         } );
//     };
// };

export const itemSubGroupRemoveFromTableRow = ( remainingItemGroup ) => async dispatch => {
    await dispatch( {
        type: GET_ITEM_SUB_GROUP_BY_ITEM_GROUP_ID,
        itemSubGroups: remainingItemGroup
    } );
};

export const deleteItemSubGroup = ( subGroup, itemGroupId ) => ( dispatch, getState ) => {
    const apiEndPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/subCategory/${subGroup.id}`;
    dispatch( itemGroupDataOnSubmitProgress( true ) );
    const { itemSubGroups } = getState().itemGroups;
    baseAxios.delete( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const updatedSubGroup = itemSubGroups.filter( s => s.id !== subGroup.id );
                dispatch( itemSubGroupRemoveFromTableRow( updatedSubGroup ) );
                notify( 'success', `Item Sub-Group Successfully Delete` );
                dispatch( itemGroupDataOnSubmitProgress( false ) );

            }
        } ).catch( ( ( { response } ) => {
            dispatch( itemGroupDataOnSubmitProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else if ( response?.status === status.badRequest ) {
                notify( 'errors', response.data.errors );
            } else {
                notify( 'warning', `${response.data.errors?.join( ', ' )}` );
            }
        } ) );
};

export const getDropDownCategoryGroups = () => dispatch => {
    dispatch( {
        type: DROP_DOWN_CATEGORY_GROUPS,
        dropDownCategoryGroups: [],
        isDropDownCategoryGroupsLoaded: false
    } );
    const apiEndpoint = `${inventoryApi.itemGroup.root}/categoryGroups`;
    baseAxios.get( apiEndpoint ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: DROP_DOWN_CATEGORY_GROUPS,
                dropDownCategoryGroups: response.data.map( group => ( {
                    value: group.name,
                    label: group.name,
                    parentName: group.parentName
                } ) ),
                isDropDownCategoryGroupsLoaded: true
            } );
        }

    } ).catch( ( ( { response } ) => {
        dispatch( {
            type: DROP_DOWN_CATEGORY_GROUPS,
            dropDownCategoryGroups: [],
            isDropDownCategoryGroupsLoaded: true
        } );
        if ( response.status === status.badRequest || response.status === status.notFound || response.status === status.severError ) {
            notify( 'error', 'Please contact with Software Developer!' );
        }
        if ( response.status === status.conflict ) {
            notify( 'warning', `${response.statusText}` );
        }
    } ) );
};


export const getDropDownFabricItemGroupsByGroupName = ( groupName ) => {
    return dispatch => {
        baseAxios.get( `${inventoryApi.itemGroup.root}/${groupName}` ).then( response => {
            dispatch( {
                type: GET_ITEM_FABRIC_GROUPS_DROPDOWN_BY_GROUP,
                dropDownFabricItemGroups: response.data.map( group => (
                    {
                        value: group.id,
                        label: group.name,
                        defaultUomSetId: group.defaultUomSetId,
                        defaultUomSet: group.defaultUomSet,
                        defaultUomId: group.defaultUomId,
                        defaultUom: group.defaultUom,
                        orderUomId: group.orderUomId,
                        orderUom: group.orderUom,
                        consumptionUomId: group.consumptionUomId,
                        consumptionUom: group.consumptionUom,
                        groupName: group.groupName,
                        subGroupName: group.subGroupName,
                        costingMethod: group.costingMethod,
                        hasAnyColorSensitivity: group.hasAnyColorSensitivity,
                        hasAnySizeSensitivity: group.hasAnySizeSensitivity
                    }
                ) )
            } );
        } );
    };
};

export const getDropDownItemGroupsByGroupName = ( groupName ) => {
    return dispatch => {
        baseAxios.get( `${inventoryApi.itemGroup.root}/${groupName}` ).then( response => {
            dispatch( {
                type: GET_ITEM_GROUPS_DROPDOWN_BY_GROUP,
                dropDownItemGroupByGroups: response.data.map( group => (
                    {
                        value: group.id,
                        label: group.name,
                        defaultUomSetId: group.defaultUomSetId,
                        defaultUomSet: group.defaultUomSet,
                        defaultUomId: group.defaultUomId,
                        defaultUom: group.defaultUom,
                        orderUomId: group.orderUomId,
                        orderUom: group.orderUom,
                        consumptionUomId: group.consumptionUomId,
                        consumptionUom: group.consumptionUom,
                        groupName: group.groupName,
                        subGroupName: group.subGroupName,
                        costingMethod: group.costingMethod
                    }
                ) )
            } );
        } );
    };
};


export const getDropDownTrimItemGroupsByGroupName = ( groupName ) => {
    return dispatch => {
        baseAxios.get( `${inventoryApi.itemGroup.root}/${groupName}` ).then( response => {
            dispatch( {
                type: GET_ITEM_TRIM_GROUPS_DROPDOWN_BY_GROUP,
                dropDownTrimItemGroups: response.data.map( group => (
                    {
                        value: group.id,
                        label: group.name,
                        defaultUomSetId: group.defaultUomSetId,
                        defaultUomSet: group.defaultUomSet,
                        defaultUomId: group.defaultUomId,
                        defaultUom: group.defaultUom,
                        orderUomId: group.orderUomId,
                        orderUom: group.orderUom,
                        consumptionUomId: group.consumptionUomId,
                        consumptionUom: group.consumptionUom,
                        groupName: group.groupName,
                        subGroupName: group.subGroupName,
                        costingMethod: group.costingMethod,
                        hasAnyColorSensitivity: group.hasAnyColorSensitivity,
                        hasAnySizeSensitivity: group.hasAnySizeSensitivity
                    }
                ) )
            } );
        } );
    };
};
export const getDropDownPackItemGroupsByGroupName = ( groupName ) => async dispatch => {
    await baseAxios.get( `${inventoryApi.itemGroup.root}/${groupName}` ).then( response => {
        dispatch( {
            type: GET_ITEM_PACK_GROUPS_DROPDOWN_BY_GROUP,
            dropDownPackItemGroups: response.data.map( group => (
                {
                    value: group.id,
                    label: group.name,
                    defaultUomSetId: group.defaultUomSetId,
                    defaultUomSet: group.defaultUomSet,
                    defaultUomId: group.defaultUomId,
                    defaultUom: group.defaultUom,
                    orderUomId: group.orderUomId,
                    orderUom: group.orderUom,
                    consumptionUomId: group.consumptionUomId,
                    consumptionUom: group.consumptionUom,
                    groupName: group.groupName,
                    subGroupName: group.subGroupName,
                    costingMethod: group.costingMethod
                }
            ) )
        } );
    } );

};

export const getDropDownItemGroups = () => async dispatch => {
    dispatch( {
        type: DROP_DOWN_ITEM_GROUPS,
        dropDownItemGroups: [],
        isDropDownItemGroupsDataLoaded: false
    } );
    await baseAxios.get( `${inventoryApi.itemGroup.root}?isActive=true` ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: DROP_DOWN_ITEM_GROUPS,
                dropDownItemGroups: response?.data?.data?.map( item => (
                    {
                        value: item.id,
                        label: item.name,
                        //
                        defaultUomSetId: item.defaultUomSetId,
                        defaultUomSet: item.defaultUomSet,
                        defaultUomId: item.defaultUomId,
                        defaultUom: item.defaultUom,
                        orderUomId: item.orderUomId,
                        orderUom: item.orderUom,
                        consumptionUomId: item.consumptionUomId,
                        consumptionUom: item.consumptionUom,
                        groupName: item.groupName,
                        subGroupName: item.subGroupName,
                        costingMethod: item.costingMethod

                    }
                ) ),
                isDropDownItemGroupsDataLoaded: true
            } );
        }

    } ).catch( ( ( { response } ) => {
        dispatch( {
            type: DROP_DOWN_ITEM_GROUPS,
            dropDownItemGroups: [],
            isDropDownItemGroupsDataLoaded: true
        } );
        if ( response?.status === status.badRequest || response?.status === status.notFound || response.status === status.severError ) {
            notify( 'error', 'Please contact the support team!' );
        }
        if ( response?.status === status.conflict ) {
            notify( 'warning', `${response?.statusText}` );
        }
    } ) );
};

// Get itemGroup by Query
export const getItemGroupByQuery = ( params, queryData ) => async dispatch => {
    dispatch( itemGroupDataLoaded( false ) );
    const apiEndpoint = `${inventoryApi.itemGroup.root}/grid?${convertQueryString( params )}`;
    await baseAxios.post( apiEndpoint, queryData ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: GET_ITEM_GROUPS_BY_QUERY,
                itemGroups: response?.data?.data,
                totalPages: response?.data?.totalRecords,
                queryObj: queryData,
                params
            } );
            dispatch( itemGroupDataLoaded( true ) );
        } else {
            notify( 'error', 'The Item Groups not Found!' );
        }
    } ).catch( ( ( { response } ) => {
        dispatch( itemGroupDataLoaded( true ) );

        if ( response.status === status.badRequest || response.status === status.notFound || response.status === status.severError ) {
            notify( 'error', 'Please contact the support team!' );
        }
        if ( response.status === status.conflict ) {
            notify( 'warning', `${response.statusText}` );
        }
    } ) );
};

// Get itemGroup By Id
export const getItemGroupById = id => async dispatch => {
    dispatch( itemGroupOnProgress( true ) );
    const apiEndpoint = `${inventoryApi.itemGroup.root}/${id}`;
    await baseAxios.get( apiEndpoint ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: GET_ITEM_GROUP_BY_ID,
                selectedItemGroup: response.data ? response.data : null
            } );
            dispatch( handleOpenItemGroupSidebarForEdit( true ) );
            dispatch( itemGroupOnProgress( false ) );

        }

    } ).catch( ( ( { response } ) => {
        dispatch( itemGroupOnProgress( false ) );
        if ( response.status === status.badRequest || response.status === status.notFound || response.status === status.severError ) {
            notify( 'error', 'Please contact the support team!' );
        }
        if ( response.status === status.conflict ) {
            notify( 'warning', `${response.statusText}` );
        }
    } ) );
};
// Get itemGroup By Id
export const getItemSubGroupByItemGroupId = id => {
    return async dispatch => {
        await baseAxios.get( `${inventoryApi.itemGroup.root}/${id}/subCategories` ).then( response => {
            dispatch( {
                type: GET_ITEM_GROUP_BY_ID,
                selectedItemGroup: response.data ? response.data : null,
                selectedSubGroupId: id
            } );
        } ).catch( err => console.log( err ) );
    };
};

// Open itemGroup Sidebar
export const handleOpenItemGroupSidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_ITEM_GROUP_SIDEBAR,
            openItemGroupSidebar: condition
        } );
    };
};

// Selected itemGroup Null after Edit
export const selectedItemGroupNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_ITEM_GROUP_NULL,
            selectedItemGroup: null
        } );
    };
};

// Add new itemGroup
export const addItemGroup = ( itemGroup, isMulti ) => async ( dispatch, getState ) => {
    dispatch( itemGroupDataOnSubmitProgress( true ) );
    const apiEndpoint = `${inventoryApi.itemGroup.root}`;

    await baseAxios.post( apiEndpoint, itemGroup )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_ITEM_GROUP,
                    itemGroup
                } );
                notify( 'success', 'The Item Group has been added Successfully!' );
                dispatch( getItemGroupByQuery( getState().itemGroups.params, [] ) );
                if ( !isMulti ) {
                    dispatch( handleOpenItemGroupSidebar( isMulti ) );
                }
                dispatch( itemGroupDataOnSubmitProgress( false ) );

            }
        } ).catch( ( { response } ) => {
            dispatch( itemGroupDataOnSubmitProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors?.join( ', ' )}` );
            }
        } );
};

//Update itemGroup
export const updateItemGroup = ( itemGroupId, itemGroup ) => async ( dispatch, getState ) => {
    dispatch( itemGroupDataOnSubmitProgress( true ) );
    const apiEndpoint = `${inventoryApi.itemGroup.root}/${itemGroupId}`;
    await baseAxios.put( apiEndpoint, itemGroup )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_ITEM_GROUP,
                    itemGroup
                } );
                notify( 'success', 'The Item Group has been updated Successfully!' );
                dispatch( getItemGroupByQuery( getState().itemGroups.params, [] ) );
                dispatch( itemGroupDataOnSubmitProgress( false ) );
                dispatch( handleOpenItemGroupSidebarForEdit( false ) );


            } else {
                notify( 'error', 'The Item Group has been added failed!' );
            }

        } ).catch( ( { response } ) => {
            dispatch( itemGroupDataOnSubmitProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors?.join( ', ' )}` );
            }
        } );
};

// Delete itemGroup
export const deleteItemGroup = itemGroup => ( dispatch, getState ) => {
    const apiEndpoint = `${inventoryApi.itemGroup.root}/${itemGroup.id}`;
    confirmDialog( { ...confirmObj, text: `<h4 class="text-primary mb-0">${itemGroup.name}</h4> <br/> <span>You won't retrieve again!</span>` } ).then( async e => {
        if ( e.isConfirmed ) {
            dispatch( itemGroupOnProgress( true ) );
            await baseAxios.delete( apiEndpoint ).then( response => {
                if ( response.status === status.success ) {
                    notify( 'success', 'The Item Group has been deleted Successfully!' );
                    dispatch( getItemGroupByQuery( getState().itemGroups.params, [] ) );
                    dispatch( itemGroupOnProgress( false ) );

                }

            } ).catch( ( { response } ) => {
                dispatch( itemGroupOnProgress( false ) );
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else if ( response?.status === status.badRequest ) {
                    notify( 'errors', response.data.errors );
                } else {
                    notify( 'warning', `${response.data.errors?.join( ', ' )}` );
                }
            } );
        }
    } );

};

// Delete itemGroup Range
export const deleteRangeItemGroup = ids => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios.delete( `${inventoryApi.itemGroup.delete_item_group_by_range}`, { ids } ).then( response => {
                    dispatch( {
                        type: DELETE_ITEM_GROUP_BY_RANGE
                    } );
                } ).then( () => {
                    notify( 'success', 'The Item Group has been deleted Successfully!' );
                    dispatch( getItemGroupByQuery( getState().itemGroups.params ) );
                    dispatch( getAllItemGroups() );
                } );
            }
        } );
    };
};

// Open Item Sub Group Modal
export const handleOpenAssignSubCategoryModal = ( condition, itemGroup ) => dispatch => {
    dispatch( {
        type: OPEN_ASSIGN_SUB_CATEGORY_MODAL,
        openAssignSubCategoryModal: condition,
        itemGroupId: itemGroup?.id ?? '',
        itemGroup: {
            groupName: itemGroup?.name ?? '',
            subGroupName: itemGroup?.subGroupName ?? ''
        }

    } );

    // dispatch( getSubGroupByItemId( itemGroupId ) );
};

// row.id, row.name, row.subGroupName
export const getSubGroupByItemId = ( itemGroup ) => async dispatch => {
    dispatch( itemGroupOnProgress( true ) );
    const endPoint = `${inventoryApi.itemGroup.root}/${itemGroup.id}/subCategories`;
    if ( itemGroup.id !== undefined || itemGroup.id ) {
        await baseAxios.get( endPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const responseArray = response?.data?.map( rd => ( {
                        rowId: randomIdGenerator(),
                        id: rd.id,
                        parentCategoryId: rd.parentCategoryId,
                        name: rd.name,
                        description: rd.description
                    } ) );
                    dispatch( {
                        type: GET_ITEM_SUB_GROUP_BY_ITEM_GROUP_ID,
                        itemSubGroups: response?.data ? responseArray : []
                    } );

                    dispatch( handleOpenAssignSubCategoryModal( true, itemGroup ) );
                    dispatch( itemGroupOnProgress( false ) );
                }

            } ).catch( ( { response } ) => {
                dispatch( itemGroupOnProgress( false ) );
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'warning', `${response.data.errors?.join( ', ' )}` );
                }
            } );
    }
};
export const getSubGroupDropdownByItemId = ( itemGroupId ) => async dispatch => {
    const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/subCategories`;
    console.log( itemGroupId );

    if ( itemGroupId ) {
        dispatch( {
            type: GET_ITEM_SUB_GROUP_DROPDOWN_BY_ITEM_GROUP_ID,
            dropDownItemSubGroups: [],
            isDropDownItemSubGroupsDataLoaded: false
        } );
        await baseAxios.get( endPoint )
            .then( response => {
                const responseArray = response?.data?.map( rd => ( {
                    value: rd.id,
                    label: rd.name
                } ) );
                dispatch( {
                    type: GET_ITEM_SUB_GROUP_DROPDOWN_BY_ITEM_GROUP_ID,
                    dropDownItemSubGroups: response?.data ? responseArray : [],
                    isDropDownItemSubGroupsDataLoaded: true
                } );
            } ).catch( ( { response } ) => {
                dispatch( {
                    type: GET_ITEM_SUB_GROUP_DROPDOWN_BY_ITEM_GROUP_ID,
                    dropDownItemSubGroups: [],
                    isDropDownItemSubGroupsDataLoaded: true
                } ); if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'warning', `${response.data.errors?.join( ', ' )}` );
                }
            } );
    } else {
        dispatch( {
            type: GET_ITEM_SUB_GROUP_DROPDOWN_BY_ITEM_GROUP_ID,
            dropDownItemSubGroups: [],
            isDropDownItemSubGroupsDataLoaded: true

        } );
    }
};
export const handleOpenAssignItemSegmentModal = ( condition, itemGroup ) => async dispatch => {
    await dispatch( {
        type: OPEN_ASSIGN_ITEM_SEGMENT_MODAL,
        openAssignItemSegmentModal: condition,
        itemGroupId: itemGroup?.id ?? '',
        itemGroup: {
            groupName: itemGroup?.name ?? '',
            subGroupName: itemGroup?.subGroupName ?? ''
        }
    } );
};
///GET ITEM GROUP SEGMENT
export const getItemSegmentByItemGroupId = ( itemGroup ) => async dispatch => {
    const endPoint = `${inventoryApi.itemGroup.root}/${itemGroup.id}/segments`;
    dispatch( itemGroupOnProgress( true ) );
    if ( itemGroup.id !== undefined || itemGroup.id ) {
        await baseAxios.get( endPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const responseArray = response?.data?.map( rd => ( {
                        rowId: randomIdGenerator(),
                        itemGroupId: rd.categoryId,
                        itemGroupName: rd.categoryName,
                        isColorSense: rd.isColorSensitive,
                        isSizeSense: rd.isSizeSensitive,
                        segmentId: rd.segmentId,
                        segment: { value: rd.segmentId, label: rd.segmentName },
                        segmentName: rd.segmentName
                    } ) );
                    dispatch( {
                        type: GET_ITEM_SEGMENT_BY_ITEM_GROUP_ID,
                        itemSegments: response?.data ? responseArray : []
                    } );
                    dispatch( handleOpenAssignItemSegmentModal( true, itemGroup ) );
                    dispatch( itemGroupOnProgress( false ) );

                }

            } ).catch( ( { response } ) => {
                dispatch( itemGroupOnProgress( false ) );
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'warning', `${response.data.errors?.join( ', ' )}` );
                }
            } );
    }
};

export const handleOpenAssignItemSegmentValueModal = ( condition, itemGroup ) => async dispatch => {
    await dispatch( {
        type: OPEN_ASSIGN_ITEM_SEGMENT_VALUE_MODAL,
        openAssignItemSegmentValueModal: condition,
        itemGroupId: itemGroup?.id ?? '',
        itemGroup: {
            groupName: itemGroup?.name ?? '',
            subGroupName: itemGroup?.subGroupName ?? ''
        }
    } );
    // dispatch( getItemSegmentDropDownByItemGroupId( itemGroupId ) );
};

export const getItemSegmentDropDownByItemGroupId = ( itemGroup ) => async dispatch => {
    const endPoint = `${inventoryApi.itemGroup.root}/${itemGroup.id}/segments`;
    dispatch( itemGroupOnProgress( true ) );
    if ( itemGroup.id ) {
        await baseAxios.get( endPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const responseArray = response?.data?.map( rd => ( {
                        value: rd.segmentId,
                        label: rd.segmentName
                    } ) );
                    dispatch( {
                        type: GET_ITEM_SEGMENT_DROPDOWN_BY_ITEM_GROUP_ID,
                        itemSegmentsDropdown: response?.data ? responseArray : []
                    } );
                    dispatch( handleOpenAssignItemSegmentValueModal( true, itemGroup ) );
                    dispatch( itemGroupOnProgress( false ) );
                }

            } ).catch( ( { response } ) => {
                dispatch( itemGroupOnProgress( false ) );
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'warning', `${response.data.errors?.join( ', ' )}` );
                }
            } );
    } else {
        dispatch( {
            type: GET_ITEM_SEGMENT_DROPDOWN_BY_ITEM_GROUP_ID,
            itemSegmentsDropdown: []
        } );
    }
};
export const getItemSegmentArrayByItemGroupId = ( itemGroupId, itemDescriptionTemplate ) => async dispatch => {
    const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segments`;
    const itemDecExit = itemDescriptionTemplate ? JSON.parse( itemDescriptionTemplate ) : [];

    const getExitingSegmentValue = ( segmentId ) => {
        const value = { label: itemDecExit.find( i => i.id === segmentId )?.value, value: itemDecExit.find( i => i.id === segmentId )?.value };

        return value;
    };
    if ( itemGroupId ) {
        dispatch( {
            type: GET_ITEM_SUB_GROUP_SEGMENT_BY_ITEM_GROUP_ID,
            itemSegmentsArray: [],
            isItemSegmentsArrayLoaded: false
        } );
        await baseAxios.get( endPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const responseArray = response?.data?.map( rd => ( {
                        fieldId: randomIdGenerator(),
                        itemGroupId,
                        isColorSensitive: rd.isColorSensitive,
                        isSizeSensitive: rd.isSizeSensitive,
                        segment: rd,
                        segmentValues: [],
                        isSegmentValuesLoaded: true,
                        value: getExitingSegmentValue( rd.segmentId )?.label?.length ? getExitingSegmentValue( rd.segmentId ) : null
                    } ) );
                    dispatch( {
                        type: GET_ITEM_SUB_GROUP_SEGMENT_BY_ITEM_GROUP_ID,
                        itemSegmentsArray: response?.data ? responseArray : [],
                        isItemSegmentsArrayLoaded: true
                    } );
                }
            } );
    } else {
        dispatch( {
            type: GET_ITEM_SUB_GROUP_SEGMENT_BY_ITEM_GROUP_ID,
            itemSegmentsArray: [],
            isItemSegmentsArrayLoaded: true
        } );
    }
};
export const bindSegmentDescriptionArray = ( itemSegmentsArray ) => async dispatch => {
    if ( itemSegmentsArray ) {
        dispatch( {
            type: GET_ITEM_SUB_GROUP_SEGMENT_BY_ITEM_GROUP_ID,
            itemSegmentsArray,
            isItemSegmentsArrayLoaded: true

        } );
    } else {
        dispatch( {
            type: GET_ITEM_SUB_GROUP_SEGMENT_BY_ITEM_GROUP_ID,
            itemSegmentsArray: [],
            isItemSegmentsArrayLoaded: true

        } );
    }


};
/// GET ITEM GROUP SEGMENT VALUE
export const getItemSegmentValueByItemGroupId = ( itemGroupId, segmentId ) => async dispatch => {
    const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
    if ( itemGroupId && segmentId ) {
        dispatch( itemGroupDataOnSubmitProgress( true ) );

        await baseAxios.get( endPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const responseArray = response?.data?.map( rd => ( {
                        rowId: randomIdGenerator(),
                        id: rd.id,
                        itemGroupId: rd.categoryId,
                        segmentId: rd.segmentId,
                        value: rd.value,
                        isDeleted: false,
                        isDeletedSuccess: false,
                        isNew: false
                    } ) );
                    dispatch( {
                        type: GET_ITEM_SEGMENT_VALUE_BY_ITEM_GROUP_ID,
                        itemSegmentValues: response?.data ? responseArray : []
                    } );
                    dispatch( itemGroupDataOnSubmitProgress( false ) );
                }

            } ).catch( ( { response } ) => {
                dispatch( itemGroupDataOnSubmitProgress( false ) );
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'warning', `${response.data.errors?.join( ', ' )}` );
                }
            } );
    } else {
        dispatch( {
            type: GET_ITEM_SEGMENT_VALUE_BY_ITEM_GROUP_ID,
            itemSegmentValues: []
        } );
    }
};

export const itemSegmentValueOnChange = ( updateSegmentValues ) => async dispatch => {
    await dispatch( {
        type: GET_ITEM_SEGMENT_VALUE_BY_ITEM_GROUP_ID,
        itemSegmentValues: updateSegmentValues
    } );
};

///For Component
export const itemSubGroupAddToTableRow = ( itemSubGroup ) => async dispatch => {
    await dispatch( {
        type: GET_ITEM_SUB_GROUP_BY_ITEM_GROUP_ID,
        itemSubGroups: itemSubGroup
    } );
};


///For Assign Item Segment
export const itemSegmentAddToTableRow = ( newItemSegments ) => async dispatch => {
    await dispatch( {
        type: GET_ITEM_SEGMENT_BY_ITEM_GROUP_ID,
        itemSegments: newItemSegments
    } );
};

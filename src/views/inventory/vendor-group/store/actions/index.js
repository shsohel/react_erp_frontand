import { baseAxios } from "@services";
import { inventoryApi } from "../../../../../services/api-end-points/inventory";
import { notify } from "../../../../../utility/custom/notifications";
import { status } from "../../../../../utility/enums";
import { convertQueryString, randomIdGenerator } from "../../../../../utility/Utils";
import { bindVendorDataOnchange } from "../../../vendor/store/actions";
import { vendorGroupBasicInfoModel } from "../../model";
import { ADD_VENDOR_GROUP, ADD_VENDOR_SUB_GROUP, BIND_VENDOR_GROUP_BASIC_INFO, GET_VENDOR_GROUPS_BY_QUERY, GET_VENDOR_GROUP_BY_ID, GET_VENDOR_GROUP_DROPDOWN, GET_VENDOR_SUB_GROUPS_DROPDOWN_BY_VENDOR_ID, GET_VENDOR_SUB_GROUP_VENDOR_GROUP_BY_ID, OPEN_VENDOR_GROUPS_EDIT_SIDEBAR, OPEN_VENDOR_GROUPS_SIDEBAR, OPEN_VENDOR_SUB_GROUPS_SIDEBAR, UPDATE_VENDOR_GROUP } from "../action-types";

export const handleOpenVendorGroup = ( condition ) => dispatch => {
    console.log( condition );
    dispatch( {
        type: OPEN_VENDOR_GROUPS_SIDEBAR,
        openVendorGroupSidebar: condition
    } );
};

export const handleOpenVendorGroupEdit = ( condition ) => dispatch => {
    dispatch( {
        type: OPEN_VENDOR_GROUPS_EDIT_SIDEBAR,
        openVendorGroupSidebarEdit: condition
    } );
};

export const handleOpenVendorSubGroup = ( condition ) => dispatch => {
    dispatch( {
        type: OPEN_VENDOR_SUB_GROUPS_SIDEBAR,
        openSubVendorGroupSidebar: condition
    } );
};

export const bindVendorBasicInfo = ( vendorGroupBasicInfo ) => dispatch => {
    if ( vendorGroupBasicInfo ) {
        dispatch( {
            type: BIND_VENDOR_GROUP_BASIC_INFO,
            vendorGroupBasicInfo
        } );
    } else {
        dispatch( {
            type: BIND_VENDOR_GROUP_BASIC_INFO,
            vendorGroupBasicInfo: vendorGroupBasicInfoModel
        } );
    }

};

// Get VendorGroups by Query
export const getVendorGroupsByQuery = ( params, queryData ) => async dispatch => {
    await baseAxios.post( `${inventoryApi.vendorGroup.root}/grid?${convertQueryString( params )}`, queryData ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: GET_VENDOR_GROUPS_BY_QUERY,
                vendorGroups: response?.data?.data.map( g => ( { ...g, isEditable: false } ) ),
                totalPages: response?.data?.totalPages,
                queryData,
                params
            } );
        } else {
            notify( 'error', 'The Vendor Groups not Found!' );
        }
    } ).catch( ( ( { response } ) => {
        if ( response.status === status.badRequest || response.status === status.notFound || response.status === status.severError ) {
            notify( 'error', 'Please contact with Software Developer!' );
        }
        if ( response.status === status.conflict ) {
            notify( 'warning', `${response.statusText}` );
        }
    } ) );
};

export const bindVendorGroup = ( vendorGroups ) => async dispatch => {
    if ( vendorGroups.length > 0 ) {
        dispatch( {
            type: GET_VENDOR_GROUPS_BY_QUERY,
            vendorGroups
        } );
    }
};
export const bindVendorSubGroup = ( vendorSubGroups ) => async dispatch => {
    if ( vendorSubGroups.length > 0 ) {
        dispatch( {
            type: GET_VENDOR_SUB_GROUP_VENDOR_GROUP_BY_ID,
            vendorSubGroups
        } );
    } else {
        dispatch( {
            type: GET_VENDOR_SUB_GROUP_VENDOR_GROUP_BY_ID,
            vendorSubGroups: []
        } );
    }
};


export const getVendorGroupById = ( id ) => async dispatch => {
    const apiEndPoint = `${inventoryApi.vendorGroup.root}/${id}`;
    await baseAxios.get( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_VENDOR_GROUP_BY_ID,
                    vendorGroupBasicInfo: response.data
                } );
                dispatch( handleOpenVendorGroupEdit( true ) );
                dispatch( handleOpenVendorSubGroup( false ) );
                dispatch( bindVendorSubGroup( [] ) );
            }
        } );

};


export const getVendorGroupDropdown = () => async dispatch => {
    const apiEndPoint = `${inventoryApi.vendorGroup.root}`;
    baseAxios.get( apiEndPoint )
        .then( response => {
            const dropdownVendorGroups = response.data?.data.map( vg => ( {
                label: vg.name,
                value: vg.id
            } ) );
            dispatch( {
                type: GET_VENDOR_GROUP_DROPDOWN,
                dropdownVendorGroups
            } );
        } );
};

export const getVendorSubGroupDropdownByVendorId = ( vendorId ) => async dispatch => {
    if ( vendorId ) {
        const apiEndPoint = `${inventoryApi.vendorGroup.root}/${vendorId}/subGroups`;
        baseAxios.get( apiEndPoint )
            .then( response => {
                console.log( response.data );
                const dropdownVendorSubGroup = response?.data.map( vg => ( {
                    label: vg,
                    value: vg
                } ) );
                dispatch( {
                    type: GET_VENDOR_SUB_GROUPS_DROPDOWN_BY_VENDOR_ID,
                    dropdownVendorSubGroup
                } );
            } );
    } else {
        dispatch( {
            type: GET_VENDOR_SUB_GROUPS_DROPDOWN_BY_VENDOR_ID,
            dropdownVendorSubGroup: []
        } );
    }

};


export const getVendorSubGroupByVendorId = ( vendorId ) => async dispatch => {
    if ( vendorId ) {
        const apiEndPoint = `${inventoryApi.vendorGroup.root}/${vendorId}/subGroups`;
        baseAxios.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_VENDOR_SUB_GROUP_VENDOR_GROUP_BY_ID,
                        vendorSubGroups: response.data.map( sub => ( { name: sub, rowId: randomIdGenerator(), isEditable: false, isNew: false } ) )
                    } );
                    dispatch( handleOpenVendorSubGroup( true ) );

                }
            } );
    } else {
        dispatch( {
            type: GET_VENDOR_SUB_GROUP_VENDOR_GROUP_BY_ID,
            vendorSubGroups: []
        } );
    }
};

export const vendorSubGroupAddForInstantCreate = ( vendorSubGroup, vendorId ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${inventoryApi.vendorGroup.root}/${vendorId}/subGroups`;
    const { vendorBasicInfo } = getState().vendors;
    baseAxios.post( apiEndPoint, { name: vendorSubGroup } ).then( response => {
        console.log( response );
        if ( response.status === status.success ) {
            const { tags } = vendorBasicInfo;
            const updatedObj = {
                ...vendorBasicInfo,
                tags: [...tags, { value: vendorSubGroup, label: vendorSubGroup }]
            };
            dispatch(
                bindVendorDataOnchange( updatedObj )
            );
            console.log( status.success );
        }
    } );
};
export const addVendorSubGroup = ( vendorSubGroup, vendorId ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${inventoryApi.vendorGroup.root}/${vendorId}/subGroups`;

    baseAxios.post( apiEndPoint, vendorSubGroup )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_VENDOR_SUB_GROUP
                } );
                notify( 'success', `The Vendor Sub Group has been created successfully` );
                dispatch( getVendorSubGroupByVendorId( vendorId ) );
            }
        } );
};
export const updateVendorSubGroup = ( vendorSubGroup, vendorId ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${inventoryApi.vendorGroup.root}/${vendorId}/subGroups`;

    baseAxios.put( apiEndPoint, vendorSubGroup )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_VENDOR_SUB_GROUP
                } );
                notify( 'success', `The Vendor Sub Group has been updated successfully` );
                dispatch( getVendorSubGroupByVendorId( vendorId ) );
            }
        } ).catch( ( { response } ) => {

            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else if ( response.status === status.badRequest ) {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};


export const addVendorGroup = ( vendorGroup ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${inventoryApi.vendorGroup.root}`;
    await baseAxios.post( apiEndPoint, vendorGroup )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_VENDOR_GROUP
                } );
                notify( 'success', `The Vendor Group has been created successfully` );
                dispatch( getVendorGroupsByQuery( getState().itemGroups.params, [] ) );
                dispatch( bindVendorBasicInfo( null ) );
                dispatch( handleOpenVendorGroup( false ) );

            }
        } ).catch( ( { response } ) => {

            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else if ( response.status === status.badRequest ) {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};
export const updateVendorGroup = ( vendorGroup, vendorGroupId ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${inventoryApi.vendorGroup.root}/${vendorGroupId}`;
    await baseAxios.put( apiEndPoint, vendorGroup )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_VENDOR_GROUP
                } );
                notify( 'success', `The Vendor Group has been updated successfully` );
                dispatch( handleOpenVendorGroupEdit( false ) );
                dispatch( getVendorGroupsByQuery( getState().itemGroups.params, [] ) );
                dispatch( bindVendorBasicInfo( null ) );

            }
        } ).catch( ( { response } ) => {

            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else if ( response.status === status.badRequest ) {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};
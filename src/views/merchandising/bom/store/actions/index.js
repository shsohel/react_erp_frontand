import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import moment from "moment";
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { status } from "../../../../../utility/enums";
import { randomIdGenerator } from "../../../../../utility/Utils";
import { bomBasicInfoModel } from "../../model";
import {
    BIND_BOM_BASIC_INFO,
    BOM_ITEM_DETAILS_DATA_ON_PROGRESS,
    BOM_PURCHASE_ORDER_DATA_ON_PROGRESS,
    CLEAR_ALL_BOM_STATE,
    DELETE_BOM,
    DELETE_BOM_BY_RANGE,
    DROP_DOWN_BOMS,
    GET_BOMS,
    GET_BOMS_BY_QUERY,
    GET_BOM_BY_ID,
    GET_BOM_GENERATION_DETAILS,
    GET_BOM_PURCHASE_ORDERS,
    OPEN_BOM_VIEW_MODAL
} from "../action-types";

const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};


//   case BOM_PURCHASE_ORDER_DATA_ON_PROGRESS:
// return {
//     ...state,
//     isBomPurchaseOrdersDataOnProgress: action.isBomPurchaseOrdersDataOnProgress
// };


export const bomPurchaserOrderDataOnProgress = ( condition ) => dispatch => {
    dispatch( {
        type: BOM_PURCHASE_ORDER_DATA_ON_PROGRESS,
        isBomPurchaseOrdersDataOnProgress: condition
    } );
};


export const bomItemDetailsDataOnProgress = ( condition ) => dispatch => {
    dispatch( {
        type: BOM_ITEM_DETAILS_DATA_ON_PROGRESS,
        isBomItemDetailsDataOnProgress: condition
    } );
};


///Get All without Query
export const getAllBoms = () => {
    return async ( dispatch ) => {
        await baseAxios
            .get( `${merchandisingApi.bom.get_boms}` )
            .then( ( response ) => {
                dispatch( {
                    type: GET_BOMS,
                    boms: response.data
                } );
            } );

    };

};

///Get All DropDown Sample Assignee without query
export const getDropDownBoms = () => {
    return async ( dispatch ) => {
        await baseAxios
            .getAllBoms( `${merchandisingApi.bom.get_boms}` )
            .then( ( response ) => {
                dispatch( {
                    type: DROP_DOWN_BOMS,
                    dropDownBoms: response.data.map( ( item ) => ( {
                        value: item.id,
                        label: item.itemGroup
                    } ) )
                } );
            } );
    };
};

//Get Data by Query
export const getBomByQuery = ( params ) => {
    return async ( dispatch ) => {
        await baseAxios
            .get( `${merchandisingApi.bom.root}`, params )
            .then( ( response ) => {
                dispatch( {
                    type: GET_BOMS_BY_QUERY,
                    boms: response.data.data,
                    totalPages: response.data.total,
                    params
                } );
            } );
    };
};

//Get Sample Assignee By ID
export const getBomById = ( id ) => async ( dispatch ) => {
    if ( id ) {
        await baseAxios
            .get( `${merchandisingApi.bom.root}/${id}` )
            .then( ( response ) => {
                dispatch( {
                    type: GET_BOM_BY_ID,
                    selectedBom: response.data ? response.data : null
                } );
            } )
            .catch( ( err ) => console.log( err ) );
    } else {
        dispatch( {
            type: GET_BOM_BY_ID,
            selectedBom: null
        } );
    }
};

export const getBomPurchaseOrders = ( buyerId, bomStatus ) => async dispatch => {
    if ( buyerId && bomStatus.length ) {
        dispatch( bomPurchaserOrderDataOnProgress( true ) );
        const apiEndPoints = `${merchandisingApi.buyer.root}/${buyerId}/boms/${bomStatus}/purchaseOrders`;

        await baseAxios.get( apiEndPoints )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_BOM_PURCHASE_ORDERS,
                        bomPurchaseOrders: response.data.map( order => (
                            {
                                ...order,
                                rowId: randomIdGenerator(),
                                orderDate: moment( order.orderDate ).format( 'yyyy-MM-DD' ),
                                shipmentDate: moment( order.shipmentDate ).format( 'yyyy-MM-DD' ),
                                currencyCode: order.currencyCode ?? '',
                                isSelected: false
                            }
                        ) )
                    } );
                    dispatch( bomPurchaserOrderDataOnProgress( false ) );
                }
            } );
    } else {
        dispatch( {
            type: GET_BOM_PURCHASE_ORDERS,
            bomPurchaseOrders: []
        } );
        dispatch( bomPurchaserOrderDataOnProgress( false ) );

    }
};
export const bindBomPurchaseOrders = ( bomPurchaseOrders ) => dispatch => {
    if ( bomPurchaseOrders.length > 0 ) {
        dispatch( {
            type: GET_BOM_PURCHASE_ORDERS,
            bomPurchaseOrders
        } );
    } else {
        dispatch( {
            type: GET_BOM_PURCHASE_ORDERS,
            bomPurchaseOrders: []
        } );
    }
};


// Delete Segment
export const deleteBom = id => async ( dispatch, getState ) => {
    confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios
                .put( `${merchandisingApi.bom.root}/archives/${id}` )
                .then( response => {
                    console.log( response );
                    if ( response.status === status.success ) {
                        dispatch( {
                            type: DELETE_BOM
                        } );
                        notify( 'success', 'The BOM has been deleted Successfully!' );
                        dispatch( getBomByQuery( getState().boms.params ) );
                    } else {
                        notify( 'error', 'The BOM DELETE request has been failed!' );
                    }

                } )
                .catch( ( { response } ) => {
                    console.log( response );
                    if ( response.status === status.severError ) {
                        notify( 'error', `Please contact the support team!!!` );
                    } else {
                        notify( 'error', `${response.data.errors.join( ', ' )}` );
                    }
                } );
        }
    } );
};


// Delete Segment Range
export const deleteRangeBom = ids => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios.delete( `${merchandisingApi.bom.delete_boms_by_range}`, { ids } ).then( response => {
                    dispatch( {
                        type: DELETE_BOM_BY_RANGE
                    } );
                } ).then( () => {
                    notify( 'success', 'The Bom has been deleted Successfully!' );
                    dispatch( getBomByQuery( getState().boms.params ) );
                    dispatch( getAllBoms() );
                } );
            }
        } );
    };
};
//Open Buyer Agent Sidebar
export const handleOpenBomViewModal = ( condition ) => {
    return async ( dispatch ) => {
        await dispatch( {
            type: OPEN_BOM_VIEW_MODAL,
            openBomViewModal: condition
        } );
    };
};

export const getBOMSByOrderIds = ( queryData ) => async dispatch => {
    if ( queryData.length > 0 ) {
        dispatch( bomItemDetailsDataOnProgress( true ) );
        const endPoint = `${merchandisingApi.purchaseOrder.root}/boms`;
        await baseAxios.post( endPoint, queryData )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_BOM_GENERATION_DETAILS,
                        bomDetails: response.data ? response.data : []
                    } );
                    dispatch( bomItemDetailsDataOnProgress( false ) );

                }
            } ).catch( ( { response } ) => {
                dispatch( bomItemDetailsDataOnProgress( false ) );
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'error', `${response.data.errors.join( ', ' )}` );
                }
            } );
    } else {
        dispatch( bomItemDetailsDataOnProgress( false ) );
        dispatch( {
            type: GET_BOM_GENERATION_DETAILS,
            bomDetails: []
        } );
    }

};
export const getBOMSByOrderIdsBeforeGenerate = ( queryData ) => async dispatch => {
    if ( queryData.length > 0 ) {
        dispatch( bomItemDetailsDataOnProgress( true ) );

        const endPoint = `${merchandisingApi.purchaseOrder.root}/consumptions/details/preBoms`;
        await baseAxios.post( endPoint, queryData )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_BOM_GENERATION_DETAILS,
                        bomDetails: response.data ? response.data : []
                    } );
                    dispatch( bomItemDetailsDataOnProgress( false ) );

                }
            } ).catch( ( { response } ) => {
                dispatch( bomItemDetailsDataOnProgress( false ) );
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'error', `${response.data.errors.join( ', ' )}` );
                }
            } );
    } else {
        dispatch( bomItemDetailsDataOnProgress( false ) );

        dispatch( {
            type: GET_BOM_GENERATION_DETAILS,
            bomDetails: []
        } );
    }

};

///For Bom Generation
export const bomGenerationByOrderId = ( purchaseOrderIds, buyerId, bomStatus ) => async ( dispatch ) => {
    const endPoint = `${merchandisingApi.buyer.root}/${buyerId}/purchaseOrders/boms`;
    dispatch( bomPurchaserOrderDataOnProgress( true ) );

    await baseAxios
        .post( endPoint, purchaseOrderIds )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_BOM_GENERATION_DETAILS,
                    bomDetails: response.data ? response.data : []
                } );
                ///    dispatch( getBomById( response?.data ) );
                notify( 'success', 'The Bom has been generated Successfully!' );
                //    dispatch( getBOMSByOrderIds( purchaseOrderIds ) );
                dispatch( getBomPurchaseOrders( buyerId, bomStatus ) );
                dispatch( bomPurchaserOrderDataOnProgress( false ) );

            } else {
                notify( 'error', 'The Bom has been generated Failed!' );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( bomPurchaserOrderDataOnProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

///For Bom Generation
export const bomReGenerationByOrderId = ( regenerateIds, buyerId, bomStatus ) => async ( dispatch ) => {
    const endPoint = `${merchandisingApi.purchaseOrder.root}/boms`;
    dispatch( bomPurchaserOrderDataOnProgress( true ) );
    await baseAxios
        .put( endPoint, regenerateIds )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_BOM_GENERATION_DETAILS,
                    bomDetails: response.data ? response.data : []
                } );
                ///    dispatch( getBomById( response?.data ) );
                notify( 'success', 'The Bom has been generated Successfully!' );
                //  dispatch( getBOMSByOrderIds( selectedOrdersId ) );
                dispatch( getBomPurchaseOrders( buyerId, bomStatus ) );
                dispatch( bomPurchaserOrderDataOnProgress( false ) );

            } else {
                notify( 'error', 'The Bom has been generated Failed!' );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( bomPurchaserOrderDataOnProgress( false ) );

            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else if ( response.status === status.badRequest ) {
                // notify( 'warning', `${response.data.errors.join( ', ' )}` );
                notify( 'warning', `${response.data.errors}` );

            } else if ( response.status === status.conflict ) {
                // notify( 'warning', `${response.data.errors.join( ', ' )}` );
                notify( 'warning', `${response.data.detail}` );

            }
        } );
};


export const bindDetails = ( bomDetails ) => async dispatch => {
    dispatch( {
        type: GET_BOM_GENERATION_DETAILS,
        bomDetails
    } );

};

export const bindBomBasicInfo = ( bom ) => async ( dispatch ) => {
    if ( bom ) {
        dispatch( {
            type: BIND_BOM_BASIC_INFO,
            bomBasicInfo
                : bom
        } );
    } else {
        dispatch( {
            type: BIND_BOM_BASIC_INFO,
            bomBasicInfo: bomBasicInfoModel
        } );
    }
};

export const clearAllBomState = () => dispatch => {
    dispatch( {
        type: CLEAR_ALL_BOM_STATE
    } );
};
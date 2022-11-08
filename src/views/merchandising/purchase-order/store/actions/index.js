// import { merchandisingApi } from "@api/merchandising";
// import { baseAxios } from "@services";
import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import axios from "axios";
import moment from "moment";
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { confirmObj, status } from "../../../../../utility/enums";
import { randomIdGenerator } from "../../../../../utility/Utils";
import { getStyleFabricDefaultCategory } from "../../../costing/store/action";
import { stylePurchaseOrderModel } from "../../model";
import { ADD_PURCHASE_ORDER, ADD_SINGLE_PO_SIZE_COLOR_RATION, BIND_STYLE_PURCHASE_ORDER, BIND_STYLE_PURCHASE_ORDER_DETAILS, CONTROL_SET_PURCHASE_ORDER, CONTROL_SINGLE_PURCHASE_ORDER, DELETE_PURCHASE_ORDER, DELETE_PURCHASE_ORDERS_BY_RANGE, DELETE_PURCHASE_ORDER_DETAILS, GET_COLOR_SIZE_QUANTITY_BY_PO_DETAILS_ID, GET_PURCHASE_ORDERS, GET_PURCHASE_ORDERS_BY_QUERY, GET_PURCHASE_ORDER_BY_ID, GET_PURCHASE_ORDER_DETAILS_BY_ID, GET_PURCHASE_ORDER_DETAILS_SIZE_COLOR_QUANTITY_SUMMARY, GET_PURCHASE_ORDER_DETAILS_SIZE_COLOR_QUANTITY_SUMMARY_DETAILS, GET_PURCHASE_ORDER_DROP_DOWN, GET_PURCHASE_ORDER_DROP_DOWN_BY_BUYER_ID, GET_STYLES_BY_PO_ID, GET_STYLE_PURCHASE_ORDER_DETAILS, OPEN_PURCHASE_ORDER_FORM, PURCHASE_ORDER_DATA_LOADING, SELECTED_PURCHASE_ORDER_NULL, STYLE_PURCHASE_ORDER_DROPDOWN, TOTAL_SELECTED_STYLES, UPDATE_PURCHASE_ORDER } from "../action-types";


const purchaseOrderDataLoad = () => async ( dispatch, getState ) => {
    const { isPurchaseOrderDataLoading } = getState().purchaseOrders;
    await dispatch( {
        type: PURCHASE_ORDER_DATA_LOADING,
        isPurchaseOrderDataLoading: !isPurchaseOrderDataLoading
    } );
};

/// Get All wtihout Query
export const getAllPurchaseOrderss = () => {
    return async dispatch => {
        await axios.get( `${merchandisingApi.purchaseOrder.get_purchaseOrders}` ).then( response => {
            dispatch( {
                type: GET_PURCHASE_ORDERS,
                purchaseOrders: response.data
            } );
        } );
    };
};


//Get Data by Query
export const getPurchaseOrdersByQuery = params => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.purchaseOrder.root}` ).then( response => {
            // console.log( response );
            dispatch( {
                type: GET_PURCHASE_ORDERS_BY_QUERY,
                purchaseOrders: response.data.data,
                totalPages: response.data.totalRecords,
                params
            } );
        } );
    };
};
//Get Data by Query
export const getStylePurchaseOrderDropdown = styleQuery => dispatch => {
    if ( styleQuery[0]?.value?.length ) {
        dispatch( {
            type: STYLE_PURCHASE_ORDER_DROPDOWN,
            stylePurchaseOrderDropdown: [],
            isStylePurchaseOrderDropdown: false

        } );
        baseAxios.post( `${merchandisingApi.purchaseOrder.root}/Grid?isActive=true`, styleQuery )
            .then( response => {
                if ( response.status === status.success ) {
                    const order = response.data.data.map( o => ( {
                        value: o.id,
                        isSetOrder: o.isSetOrder,
                        label: o.orderNumber
                    } ) );
                    dispatch( {
                        type: STYLE_PURCHASE_ORDER_DROPDOWN,
                        stylePurchaseOrderDropdown: order,
                        isStylePurchaseOrderDropdown: true

                    } );
                }
            } ).catch( ( { response } ) => {
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'error', `${response.data.detail}` );
                }
                dispatch( {
                    type: STYLE_PURCHASE_ORDER_DROPDOWN,
                    stylePurchaseOrderDropdown: [],
                    isStylePurchaseOrderDropdown: true

                } );
            } );
    } else {
        dispatch( {
            type: STYLE_PURCHASE_ORDER_DROPDOWN,
            stylePurchaseOrderDropdown: [],
            isStylePurchaseOrderDropdown: true
        } );
    }

};

export const bindStylePurchaseOrder = ( stylePurchaserOrder ) => dispatch => {
    if ( stylePurchaserOrder ) {
        dispatch( {
            type: BIND_STYLE_PURCHASE_ORDER,
            stylePurchaserOrder
        } );
    } else {
        dispatch( {
            type: BIND_STYLE_PURCHASE_ORDER,
            stylePurchaserOrder: stylePurchaseOrderModel
        } );
    }

};
export const bindStylePurchaseOrderDetails = ( stylePurchaseOrderDetails ) => dispatch => {
    dispatch( {
        type: BIND_STYLE_PURCHASE_ORDER_DETAILS,
        stylePurchaseOrderDetails
    } );
};


export const getStylePurchaseOrderDetails = ( styleId, buyerId ) => async dispatch => {
    // const { replace } = useHistory();
    dispatch( purchaseOrderDataLoad() );
    if ( styleId && buyerId ) {
        console.log( 'ID haici' );
        const apiEndPoint = `${merchandisingApi.buyer.root}/${buyerId}/styles/${styleId}/purchaseOrders`;
        await baseAxios.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const stylesPODetails = response?.data?.map( order => ( {
                        rowId: randomIdGenerator(),
                        //detailId: order.detailId,
                        orderId: order.orderId,
                        orderNumber: order.orderNumber,
                        orderDate: order.orderDate,
                        // orderUOM: order.orderUOM ? { label: order.orderUOM, value: order.orderUOM } : null,
                        orderUOM: order.orderUOM,
                        orderUOMRelativeFactor: order.orderUOMRelativeFactor,
                        orderQuantity: order.orderQuantity,
                        buyerId: order.buyerId,
                        buyerName: order.buyerName,
                        agentId: order.agentId,
                        agentName: order.agentName,
                        styleId: order.styleId,
                        styleNumber: order.styleNumber,
                        sizeGroup: order.sizeGroupId ? { label: order.sizeGroupName, value: order.sizeGroupId } : null,
                        season: order.season ? { label: order.season, value: order.season } : null,
                        year: order.year ? { label: order.year, value: order.year } : null,
                        currency: order.currencyCode ? { label: order.currencyCode, value: order.currencyCode } : null,
                        shipmentMode: order.shipmentMode ? { label: order.shipmentMode, value: order.shipmentMode } : null,
                        shipmentDate: order.shipmentDate,
                        inspectionDate: order.inspectionDate,
                        ratePerUnit: order.ratePerUnit,
                        excessQuantityPercentage: order.excessQuantityPercentage,
                        wastageQuantityPercentage: order.wastageQuantityPercentage,
                        adjustedQuantity: order.adjustedQuantity,
                        deliveryDestination: order.deliveryDestination ? { label: order.deliveryDestination, value: order.deliveryDestination } : null,
                        status: order.status ? { label: order.status, value: order.status } : null,
                        exporter: order.exporter ? { label: order.exporter, value: order.exporter } : null,
                        orderQuantitySizeAndColor: order.orderQuantitySizeAndColor ? order.orderQuantitySizeAndColor : [],
                        isEditable: false,
                        isDetailQuantityExist: true,
                        isQuantityDetailsOpen: false,
                        isFieldError: false

                    } ) );
                    dispatch( {
                        type: GET_STYLE_PURCHASE_ORDER_DETAILS,
                        stylePurchaseOrderDetails: stylesPODetails
                    } );
                    dispatch( purchaseOrderDataLoad() );

                }
            } )
            .catch( ( { response } ) => {
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'error', `${response.data.detail}` );
                }
                dispatch( purchaseOrderDataLoad() );
            } );
    } else {
        console.log( 'ID hai no' );
        dispatch( purchaseOrderDataLoad() );

        dispatch( {
            type: GET_STYLE_PURCHASE_ORDER_DETAILS,
            stylePurchaseOrderDetails: []
        } );
    }

};

export const handleNewStylePurchaseOrder = ( style ) => dispatch => {
    const obj = {
        isSetStyle: false,
        style: { label: style.styleNo, value: style.id },
        styleDescription: style.description,
        styleCategory: style.styleCategory,
        buyer: { label: style.buyerName, value: style.buyerId },
        status: style.status,
        isSizeSpecific: style.isSizeSpecific,
        isColorSpecific: style.isColorSpecific
    };
    localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );
    //   dispatch( getStylePurchaseOrderDetails( null, null ) );
    //   dispatch( bindStylePurchaseOrder( null, null ) );
};

export const handleSingleStyleMovement = ( style ) => dispatch => {
    const obj = {
        isSetStyle: false,
        style: { label: style.styleNo, value: style.id },
        styleDescription: style.description,
        styleCategory: style.styleCategory,
        buyer: { label: style.buyerName, value: style.buyerId },
        status: style.status,
        isSizeSpecific: style.isSizeSpecific,
        isColorSpecific: style.isColorSpecific
    };
    localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );

};
export const handleOpenStyleCosting = ( id, styleNo, isSetStyle, buyerName, buyerId, styleDescription, styleCategory ) => dispatch => {
    const obj = {
        column: "styleId",
        value: id,
        isSetStyle,
        styleNo
    };

    localStorage.setItem( 'styleIdsForCosting', JSON.stringify( obj ) );

    const objCosting = {
        style: { label: styleNo, value: id },
        buyer: { label: buyerName, value: buyerId },
        styleDescription,
        styleCategory,
        isSetStyle
    };
    localStorage.setItem( 'buyerAndStyle', JSON.stringify( objCosting ) );
    dispatch( getStyleFabricDefaultCategory( id ) );
};


export const handleOpenStyleConsumptions = ( id, styleNo, isSetStyle, buyerName, buyerId, styleDescription, styleCategory ) => dispatch => {
    const obj = {
        column: "styleId",
        operator: "string",
        value: id,
        isSetStyle,
        styleNo
    };
    localStorage.setItem( 'styleIdsForConsumption', JSON.stringify( obj ) );

    const objCosting = {
        style: { label: styleNo, value: id },
        buyer: { label: buyerName, value: buyerId },
        styleDescription,
        styleCategory,
        isSetStyle
    };
    localStorage.setItem( 'buyerAndStyle', JSON.stringify( objCosting ) );
};


export const getPurchaseOrdersDropdown = () => {
    return async dispatch => {
        await baseAxios.get( `${merchandisingApi.purchaseOrder.root}` ).then( response => {
            const responseArray = response?.data?.data?.map( rd => ( {
                label: rd.orderNumber,
                value: rd.id
            } ) );
            dispatch( {
                type: GET_PURCHASE_ORDER_DROP_DOWN,
                purchaseOrderDropdown: response?.data?.data ? responseArray : []
            } );
        } );
    };
};
export const getPurchaseOrdersDropdownByBuyerId = ( buyerId ) => async dispatch => {
    if ( buyerId ) {
        await baseAxios.get( `${merchandisingApi.buyer.root}/${buyerId}/purchaseOrders` ).then( response => {
            const responseArray = response?.data?.map( rd => ( {
                label: rd.orderNumber,
                value: rd.id,
                isSetOrder: rd.isSetOrder
            } ) );
            dispatch( {
                type: GET_PURCHASE_ORDER_DROP_DOWN_BY_BUYER_ID,
                buyerPurchaseOrderDropdown: response?.data ? responseArray : []
            } );
        } );
    } else {
        dispatch( {
            type: GET_PURCHASE_ORDER_DROP_DOWN_BY_BUYER_ID,
            buyerPurchaseOrderDropdown: []
        } );
    }

};

// ** Get purchaseOrder by Id
export const getPurchaseOrderById = id => async dispatch => {
    if ( id ) {
        await baseAxios
            .get( `${merchandisingApi.purchaseOrder.root}/${id}` )
            .then( response => {
                const po = response.data;
                const purchaseOrderBasicInfo = {
                    id: po?.id,
                    buyerId: po?.buyerId,
                    buyerName: po?.buyerName,
                    buyer: { value: po?.buyerId, label: po?.buyerName },
                    agentId: po?.agentId,
                    agentName: po?.agentName,
                    agent: { value: po?.agentId, label: po?.agentName },
                    orderNumber: po?.orderNumber,
                    orderDate: moment( new Date( po?.orderDate ) ).format( 'yy-MM-DD' ),
                    season: po?.season,
                    seasonValue: { value: po?.season, label: po?.season },
                    year: po?.year,
                    yearValue: { value: po?.year, label: po?.year },
                    currencyCode: po?.currencyCode,
                    currencyValue: { value: po?.currencyCode, label: po?.currencyCode },
                    description: `This is for ${po?.orderNumber}`,
                    remarks: po?.remarks ? po?.remarks : '',
                    isSetOrder: po?.isSetOrder,
                    totalOrderQuantity: po?.totalOrderQuantity,
                    totalOrderAmount: po?.totalOrderAmount
                };
                dispatch( {
                    type: GET_PURCHASE_ORDER_BY_ID,
                    selectedPurchaseOrder: response.data ? purchaseOrderBasicInfo : null
                } );
            } )
            .catch( err => console.log( err ) );
    } else {
        dispatch( {
            type: GET_PURCHASE_ORDER_BY_ID,
            selectedPurchaseOrder: null
        } );
    }
};
export const getPurchaseOrderDetails = id => async dispatch => {
    if ( id ) {
        await baseAxios
            .get( `${merchandisingApi.purchaseOrder.root}/${id}/orderDetails` )
            .then( response => {
                console.log( response.data );
                const purchaseOrderDetails = response?.data?.map( ( pod, index ) => ( {
                    fieldId: randomIdGenerator(),
                    rowNo: index + 1,
                    id: pod.id,
                    purchaseOrderId: pod.purchaseOrderId,
                    style: { label: pod.styleNo, value: pod.styleId },
                    styleId: pod.styleId,
                    styleNo: pod.styleNo,
                    sizeGroup: pod?.sizeGroupId ? { value: pod?.sizeGroupId, label: pod?.sizeGroupName } : null,
                    sizeGroupId: pod?.sizeGroupId,
                    sizeGroupName: pod?.sizeGroupName,
                    sizeGroupDropdown: [],
                    destinationDropDown: { label: pod.deliveryDestination, value: pod.deliveryDestination },
                    deliveryDestination: pod.deliveryDestination,
                    orderQuantity: pod.orderQuantity,
                    orderUOMDropDown: pod?.orderUOM ? { label: pod?.orderUOM, value: pod?.orderUOM } : null,
                    orderUOM: pod.orderUOM,
                    shipmentModeDropDown: { label: pod?.shipmentMode, value: pod?.shipmentMode },
                    shipmentMode: pod.shipmentMode,
                    shipmentDate: moment( new Date( pod.shipmentDate ) ).format( 'yy-MM-DD' ),
                    inspectionDate: moment( new Date( pod.inspectionDate ) ).format( 'yy-MM-DD' ),
                    ratePerUnit: pod.ratePerUnit,
                    excessQuantityPercentage: pod.excessQuantityPercentage,
                    wastageQuantityPercentage: pod.wastageQuantityPercentage,
                    adjustedQuantity: pod.adjustedQuantity,
                    /// orderUOMRelativeFactor: pod?.orderUOMRelativeFactor,
                    statusDropDown: { label: pod?.status, value: pod?.status },
                    status: pod.status,
                    isDetailQuantityExist: pod.isDetailQuantityExist,
                    amount: pod.orderQuantity * pod.ratePerUnit,
                    isOpenDetails: false,
                    colorSizeQuantity: [],
                    rowExpanded: false

                } ) );
                dispatch( {
                    type: GET_PURCHASE_ORDER_DETAILS_BY_ID,
                    purchaseOrderDetails
                } );
                console.log( purchaseOrderDetails );
            } )
            .catch( err => console.log( err ) );
    } else {
        dispatch( {
            type: GET_PURCHASE_ORDER_DETAILS_BY_ID,
            purchaseOrderDetails: []
        } );
    }
};
export const bindPurchaseOrderInfoOnchange = purchaseOrder => async dispatch => {
    await dispatch( {
        type: GET_PURCHASE_ORDER_BY_ID,
        selectedPurchaseOrder: purchaseOrder
    } );
};
export const bindPurchaseOrderDetails = purchaseOrderDetails => async dispatch => {
    await dispatch( {
        type: GET_PURCHASE_ORDER_DETAILS_BY_ID,
        purchaseOrderDetails
    } );
};
// ** Get StyleBy PO  Id
export const getStylesByPOById = orderId => async dispatch => {
    if ( orderId ) {
        await baseAxios
            .get( `${merchandisingApi.purchaseOrder.root}/${orderId}/styles` )
            .then( response => {
                console.log( response.data );
                dispatch( {
                    type: GET_STYLES_BY_PO_ID,
                    POStyles: response.data ? response.data.map( ps => ( {
                        label: ps.styleNo,
                        value: ps.styleId,
                        isSetStyle: ps.isSetStyle
                    } ) ) : null
                } );
            } )
            .catch( err => console.log( err ) );
    } else {
        dispatch( {
            type: GET_STYLES_BY_PO_ID,
            POStyles: []
        } );
    }

};
export const getPOSizeColorQuantitySummaryDetails = summaryDetails => async dispatch => {
    dispatch( {
        type: GET_PURCHASE_ORDER_DETAILS_SIZE_COLOR_QUANTITY_SUMMARY_DETAILS,
        orderDetailsSizeColorQuantitySummaryDetails: summaryDetails
    } );

};
// ** Get PO Details Size Color Quantity
export const getPOSizeColorQuantitySummaryByDetailsId = ( detailsId, additionalQuantity, orderId ) => async dispatch => {
    await baseAxios
        .get( `${merchandisingApi.purchaseOrder.root}/orderDetails/${detailsId}/quantityOnSizeAndColor` )
        .then( response => {
            if ( additionalQuantity ) {
                const filteredData = response?.data?.filter( responseData => additionalQuantity.some( qty => responseData.id === qty.id ) );
                const modifiedFilterData = filteredData.map( filter => {
                    filter.orderId = orderId; filter.detailsId = detailsId;
                    return filter;
                }
                );
                dispatch( getPOSizeColorQuantitySummaryDetails( modifiedFilterData ) );
            }
            dispatch( {
                type: GET_PURCHASE_ORDER_DETAILS_SIZE_COLOR_QUANTITY_SUMMARY,
                orderDetailsSizeColorQuantitySummary: response.data ? response.data : []
            } );
        } )
        .catch( err => console.log( err ) );
};


export const updateAdditionalSizeColorQuantity = ( orderId, detailsId, additionalQuantity ) => async dispatch => {
    await baseAxios
        .put( `${merchandisingApi.purchaseOrder.root}/${orderId}/orderDetails/${detailsId}/additionalQtyOnSizeAndColor`, additionalQuantity )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', 'Quantity based on color size updated Successfully!' );
                dispatch( getPOSizeColorQuantitySummaryByDetailsId( detailsId, additionalQuantity, orderId ) );
                dispatch( getPurchaseOrderById( orderId ) );
                dispatch( getPurchaseOrderDetails( orderId ) );
            } else {
                notify( 'error', 'Quantity based on color size update operation failed !' );
            }
        } )
        .catch( err => console.log( err ) );
};


/// Selected State Null After Edit or Cancel State Null
export const selectedPurchaseOrderNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_PURCHASE_ORDER_NULL,
            selectedPurchaseOrder: null
        } );
    };
};

export const handleOpenPurchaseOrderForm = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_PURCHASE_ORDER_FORM,
            openPurchaseOrderForm: condition
        } );
    };
};
export const handleSetOrder = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: CONTROL_SET_PURCHASE_ORDER,
            isItSetOrder: condition
        } );
    };
};
export const handleSingleOrder = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: CONTROL_SINGLE_PURCHASE_ORDER,
            isItSingleOrder: condition
        } );
    };
};
export const handleTotalSelectedStyles = ( styles ) => {
    return async dispatch => {
        await dispatch( {
            type: TOTAL_SELECTED_STYLES,
            totalSelectedStyles: styles
        } );
    };
};

export const addPurchaseOrder = ( purchaseOrder, styleId, buyerId ) => async dispatch => {
    dispatch( purchaseOrderDataLoad() );
    await baseAxios.post( `${merchandisingApi.purchaseOrder.root}`, purchaseOrder )
        .then( response => {
            // console.log( response );
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_PURCHASE_ORDER,
                    lastPurchaseOrderId: response.data,
                    purchaseOrder
                } );
                notify( 'success', 'The PO has been added Successfully!' );
                // push( `/purchase-order-edit`, response.data );
                dispatch( getStylePurchaseOrderDetails( styleId, buyerId ) );

                dispatch( purchaseOrderDataLoad() );
            } else {
                notify( 'error', 'The PO has been added Failed!' );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( purchaseOrderDataLoad() );
            console.log( response );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else if ( response.status === status.badRequest ) {
                // notify( 'warning', `${response.data.errors.join( ', ' )}` );
                notify( 'errors', response.data.errors );

            } else if ( response.status === status.conflict ) {
                // notify( 'warning', `${response.data.errors.join( ', ' )}` );
                notify( 'warning', `${response.data.detail}` );

            }

        } );
};

export const addStylePurchaseOrder = ( purchaseOrders, styleId, buyerId ) => async dispatch => {
    dispatch( purchaseOrderDataLoad() );

    await baseAxios.post( `${merchandisingApi.style.root}/purchaseOrders`, purchaseOrders )
        .then( response => {
            // console.log( response );
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_PURCHASE_ORDER
                } );
                notify( 'success', 'The PO has been added Successfully!' );
                dispatch( getStylePurchaseOrderDetails( styleId, buyerId ) );
                // push( {
                //     pathname: '/purchase-order-edit',
                //     state: response.data
                // } );
                dispatch( purchaseOrderDataLoad() );

            } else {
                notify( 'error', 'The PO has been added Failed!' );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( purchaseOrderDataLoad() );
            console.log( response );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else if ( response.status === status.badRequest ) {
                // notify( 'warning', `${response.data.errors.join( ', ' )}` );
                notify( 'errors', `${response.data.errors}` );

            } else if ( response.status === status.conflict ) {
                // notify( 'warning', `${response.data.errors.join( ', ' )}` );
                notify( 'warning', `${response.data.detail}` );

            }

        } );
};

export const getColorSizeRationByPODetailsId = ( poDetailsId ) => async dispatch => {
    const endPoints = `${merchandisingApi.purchaseOrder.root}/orderDetails/${poDetailsId}/quantityOnSizeAndColor`;
    if ( poDetailsId ) {
        await baseAxios.get( endPoints )
            .then( response => {
                console.log( response );
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_COLOR_SIZE_QUANTITY_BY_PO_DETAILS_ID,
                        quantityOnSizeAndColor: response?.data
                    } );

                }
            } );
    } else {
        dispatch( {
            type: GET_COLOR_SIZE_QUANTITY_BY_PO_DETAILS_ID,
            quantityOnSizeAndColor: []
        } );
    }


};

export const addSinglePOSizeColorRation = ( poId, poDetailsId, submitArray ) => async dispatch => {
    const endPoints = `${merchandisingApi.purchaseOrder.root}/${poId}/orderDetails/${poDetailsId}/quantityOnSizeAndColor`;
    await baseAxios.put( endPoints, submitArray )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_SINGLE_PO_SIZE_COLOR_RATION
                } );
                notify( 'success', 'The PO Size Color Ration has been added Successfully!' );
                dispatch( getPurchaseOrderById( poId ) );
                dispatch( getPurchaseOrderDetails( poId ) );
            } else {
                notify( 'error', 'The PO Size Color Ration has been added Failed!' );
            }
        } )
        .catch( ( { response } ) => {
            if ( response.data.status === status.conflict ) {
                notify( 'warning', `${response.data.detail}` );
            } else if ( response.data.status === status.severError ) {
                notify( 'error', 'Please Contact with Software Developer!' );
            }
        }
        );
};


// Update purchaseOrder
export const updatePurchaseOrder = ( purchaseOrder, poId, push ) => async dispatch => {
    await baseAxios
        .put( `${merchandisingApi.purchaseOrder.root}/${poId}`, purchaseOrder )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_PURCHASE_ORDER,
                    isPOUpdated: true,
                    purchaseOrder
                } );
                notify( 'success', 'The Purchase Order has been updated Successfully!' );
                //   push( `/purchase-order-edit/${response.data}` );
                dispatch( getPurchaseOrderDetails( response.data ) );
                dispatch( getPurchaseOrderById( response.data ) );
            } else {
                notify( 'warning', 'The Purchase Order has been failed!' );
            }

        } )
        .catch( ( { response } ) => {
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response.data.detail}` );
            }
        } );

};

// ** Delete purchaseOrder
export const deletePODetails = ( poId, orderDetailsId ) => async dispatch => {
    const endPoints = `${merchandisingApi.purchaseOrder.root}/${poId}/orderDetails/${orderDetailsId}`;
    await confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios
                .delete( endPoints )
                .then( response => {
                    if ( response.status === status.success ) {
                        dispatch( {
                            type: DELETE_PURCHASE_ORDER_DETAILS,
                            isPODetailsDeleted: true
                        } );
                        notify( 'success', 'The Purchase Order has been deleted Successfully!' );

                    } else {
                        notify( 'warning', 'The Purchase Order has been deleted Successfully!' );
                    }
                    console.log( response );
                } )
                .then( () => {
                    dispatch( getPurchaseOrderDetails( poId ) );
                    dispatch( getStylesByPOById( poId ) );

                } )
                .catch( ( { response } ) => {
                    console.log( response );
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
        }
    } );
};
export const deleteStylePurchaseOrderDetails = ( poId ) => async ( dispatch, getState ) => {
    const endPoints = `${merchandisingApi.purchaseOrder.root}/${poId}`;
    await confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios
                .delete( endPoints )
                .then( response => {
                    const { stylePurchaseOrderDetails } = getState().purchaseOrders;
                    if ( response.status === status.success ) {
                        dispatch( {
                            type: DELETE_PURCHASE_ORDER_DETAILS,
                            isPODetailsDeleted: true
                        } );
                        notify( 'success', 'The Purchase Order has been deleted Successfully!' );
                        const updatedDetails = stylePurchaseOrderDetails.filter( detail => detail.orderId !== poId );

                        dispatch( bindStylePurchaseOrderDetails( updatedDetails ) );

                    } else {
                        notify( 'warning', 'The Purchase Order has been deleted Successfully!' );
                    }
                    console.log( response );
                } )
                .catch( ( { response } ) => {
                    console.log( response );
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
        }
    } );
};
// ** Delete purchaseOrder
export const deletePurchaseOrder = id => async ( dispatch, getState ) => {
    confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios
                .put( `${merchandisingApi.purchaseOrder.root}/archives/${id}` )
                .then( response => {
                    console.log( response );
                    if ( response.status === status.success ) {
                        dispatch( {
                            type: DELETE_PURCHASE_ORDER
                        } );
                        notify( 'success', 'The PO has been deleted Successfully!' );
                        dispatch( getPurchaseOrdersByQuery( getState().purchaseOrders.params ) );
                    } else {
                        notify( 'error', 'The PO DELETE request has been failed!' );
                    }

                } )
                .catch( err => console.log( err ) );
        }
    } );
};

// Update purchaseOrder Range Delete
export const deleteRangePurchaseOrder = ids => {
    return ( dispatch, getState ) => {
        axios
            .delete( `${merchandisingApi.purchaseOrder.root}`, { ids } )
            .then( response => {
                dispatch( {
                    type: DELETE_PURCHASE_ORDERS_BY_RANGE
                } );
            } )
            .then( () => {
                notify( 'success', 'Purchase Orders has been deleted Successfully!' );
                dispatch( getPurchaseOrdersByQuery( getState().purchaseOrders.params ) );
                dispatch( getAllPurchaseOrderss() );
            } );
    };
};

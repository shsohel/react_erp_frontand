import { notify } from '@custom/notifications';
import { baseAxios } from '@services';
import _ from 'lodash';
import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import { confirmDialog, confirmOK } from '../../../../../utility/custom/ConfirmDialog';
import { confirmObj, status } from '../../../../../utility/enums';
import { convertQueryString, randomIdGenerator } from '../../../../../utility/Utils';
import { serviceCostSummaryModel } from '../../models';
import {
    ADD_BUDGET,
    BIND_BUDGET_BASIC_INFO, BIND_SERVICE_COST_SUMMARY, BUYERS_PO_DETAILS_FOR_BUDGET,
    CLEAN_ALL_BUDGET_STATES,
    DELETE_BUDGET,
    DELETE_BUDGET_BY_RANGE,
    DELETE_BUDGET_ORDER,
    GET_BUDGETS_BY_BUYER_ID,
    GET_BUDGETS_BY_QUERY,
    GET_BUDGET_BUYER_PO_BY_BUYER_ID,
    GET_BUDGET_BY_ID,
    GET_BUDGET_DERAILS,
    GET_BUDGET_DERAILS_BY_GROUP_TYPE,
    GET_BUDGET_DROPDOWN,
    IS_BUDGET_DATA_LOADED,
    UPDATE_BUDGET
} from '../action-types';


export const isBudgetDataLoad = ( condition ) => dispatch => {
    dispatch( {
        type: IS_BUDGET_DATA_LOADED,
        isBudgetDataLoaded: condition
    } );
};

//Get Data by Query
export const getBudgetByQuery = ( params, queryData ) => async dispatch => {
    dispatch( isBudgetDataLoad( false ) );
    await baseAxios
        .post( `${merchandisingApi.budget.root}/grid?${convertQueryString( params )}`, queryData )
        .then( ( response ) => {
            console.log( response );
            dispatch( {
                type: GET_BUDGETS_BY_QUERY,
                budgets: response.data.data,
                totalPages: response.data.total,
                params,
                queryObj: queryData
            } );
            dispatch( isBudgetDataLoad( true ) );
        } ).catch( ( { response } ) => {
            dispatch( isBudgetDataLoad( true ) );

            notify( 'error', 'Please contact the support team.' );
        } );
};

export const getBuyerBudgetsDropdown = ( buyerId ) => async ( dispatch ) => {
    if ( buyerId ) {
        await baseAxios
            .get( `${merchandisingApi.buyer.root}/${buyerId}/budgets` )
            .then( ( response ) => {
                console.log( response.data );
                dispatch( {
                    type: GET_BUDGETS_BY_BUYER_ID,
                    buyerBudgetsDropdown: response.data.map( budget => ( {
                        label: budget.budgetNumber,
                        value: budget.id,
                        styleNumbers: budget.styleNumbers
                    } ) )
                } );
            } );
    } else {
        dispatch( {
            type: GET_BUDGETS_BY_BUYER_ID,
            buyerBudgetsDropdown: []
        } );
    }
};
export const getBudgetDropdownByBuyerId = ( buyerId ) => async ( dispatch ) => {
    if ( buyerId ) {
        const queryData = [
            {
                column: 'buyerId',
                value: buyerId.toString()
            }
        ];
        await baseAxios
            .post( `${merchandisingApi.budget.root}/grid?isActive=true`, queryData ).then( ( response ) => {
                console.log( response.data );
                dispatch( {
                    type: GET_BUDGET_DROPDOWN,
                    budgetsDropdown: response.data?.data.map( budget => ( {
                        label: budget.budgetNumber,
                        value: budget.id,
                        styleNumbers: budget.styleNumbers
                    } ) )
                } );
            } );
    } else {
        dispatch( {
            type: GET_BUDGET_DROPDOWN,
            budgetsDropdown: []
        } );
    }
};


export const getBudgetBuyerPO = ( budgetIds, orderIds, styleIds ) => async ( dispatch, getState ) => {
    if ( budgetIds ) {

        await baseAxios
            .post( `${merchandisingApi.budget.root}/styleOrders`, budgetIds )
            .then( ( response ) => {
                // const { itemDetails, styleAndOrderDetails } = response.data;
                console.log( response.data );
                const { selectedProcurementSelectedItems } = getState().procurements;
                dispatch( {
                    type: GET_BUDGET_BUYER_PO_BY_BUYER_ID,
                    buyerBudgerPurchaseOrder: response.data?.map( styleOrder => ( {
                        fieldId: randomIdGenerator(),
                        bomId: styleOrder.bomId,
                        orderId: styleOrder.orderId,
                        orderNumber: styleOrder.orderNumber,
                        orderQuantity: styleOrder.orderQuantity,
                        shipmentDate: styleOrder.shipmentDate,
                        styleId: styleOrder.styleId,
                        styleNumber: styleOrder.styleNumber,
                        destination: styleOrder.destination,
                        isSelected: selectedProcurementSelectedItems.some( sp => sp.styleId === styleOrder.styleId )
                    } ) ),
                    buyerBudgetItemDetails: []
                } );
            } );
    } else {
        dispatch( {
            type: GET_BUDGET_BUYER_PO_BY_BUYER_ID,
            buyerBudgerPurchaseOrder: [],
            buyerBudgetItemDetails: []
        } );
    }

};
export const getBudgetItems = ( groupType, budgetIds, orderIds, styleIds ) => async ( dispatch, getState ) => {
    if ( groupType ) {
        const buyerBudgetObj = {
            groupType,
            budgetIds,
            orderIds,
            styleIds
        };
        await baseAxios
            .post( `${merchandisingApi.procurement.root}/bomDetails`, buyerBudgetObj )
            .then( ( response ) => {
                const { buyerBudgerPurchaseOrder } = getState().budgets;
                const { selectedProcurementSelectedItems } = getState().procurements;
                const itemDetails = response.data;


                const uniqueByItemSubGroupId = _.uniqWith(
                    itemDetails,
                    ( a, b ) => a.itemGroupId === b.itemGroupId &&
                        a.itemSubGroupId === b.itemSubGroupId
                );


                const buyerBudgetItemDetails = uniqueByItemSubGroupId.map( uniqData => ( {
                    itemSubGroupId: uniqData.itemSubGroupId,
                    itemSubGroup: uniqData.itemSubGroup,
                    itemGroup: uniqData.itemGroup,
                    isSelected: false,
                    fieldId: randomIdGenerator(),
                    items: itemDetails.filter( item => item.itemSubGroupId === uniqData.itemSubGroupId )?.map( filterItem => (
                        {
                            ...filterItem,
                            fieldId: randomIdGenerator(),
                            uoms: [],
                            balanceToRaised: filterItem.bomQuantity - filterItem.totalRequisitionQuantity,
                            isSelected: selectedProcurementSelectedItems.some( sp => sp.itemNumber === filterItem.itemNumber )
                        }
                    ) )
                } ) );

                console.log( buyerBudgetItemDetails );

                dispatch( {
                    type: GET_BUDGET_BUYER_PO_BY_BUYER_ID,
                    buyerBudgerPurchaseOrder,
                    buyerBudgetItemDetails
                } );
            } );
    } else {
        const { buyerBudgerPurchaseOrder } = getState().budgets;
        dispatch( {
            type: GET_BUDGET_BUYER_PO_BY_BUYER_ID,
            buyerBudgerPurchaseOrder,
            buyerBudgetItemDetails: []
        } );
    }


};

export const bindBudgetBuyerPoOnChange = ( buyerBudgerPurchaseOrder ) => async ( dispatch, getState ) => {
    if ( buyerBudgerPurchaseOrder ) {
        const { buyerBudgetItemDetails } = getState().budgets;
        console.log( buyerBudgetItemDetails );
        dispatch( {
            type: GET_BUDGET_BUYER_PO_BY_BUYER_ID,
            buyerBudgerPurchaseOrder,
            buyerBudgetItemDetails
        } );
    }
};
export const bindBudgetItemDetailsOnChange = ( buyerBudgetItemDetails ) => async ( dispatch, getState ) => {
    if ( buyerBudgetItemDetails ) {
        const { buyerBudgerPurchaseOrder } = getState().budgets;
        console.log( buyerBudgetItemDetails );
        dispatch( {
            type: GET_BUDGET_BUYER_PO_BY_BUYER_ID,
            buyerBudgerPurchaseOrder,
            buyerBudgetItemDetails
        } );
    }
};


export const getBudgetDetails = ( queryData ) => async ( dispatch, getState ) => {
    dispatch( isBudgetDataLoad( false ) );

    if ( queryData.length > 0 ) {
        const endPoint = `${merchandisingApi.bom.root}/styles/purchaseOrders`;
        await baseAxios.post( endPoint, queryData )
            .then( response => {
                const { budgetBasicInfo, budgetPurchaseOrderQuantityDetails } = getState().budgets;
                const purchaseOrderQuantityDetails = response.data?.map( order => ( { ...order, rowId: randomIdGenerator() } ) );
                if ( response.status === status.success ) {


                    const purchaseOrderAndStyleIds = response.data.map( order => ( {
                        orderId: order.orderId,
                        styleId: order.styleId,
                        shipmentDate: order.shipmentDate,
                        destination: order.destination
                    } ) );

                    if ( purchaseOrderAndStyleIds.length ) {
                        const endPointBoms = `${merchandisingApi.bom.root}/summaryAndDetails`;
                        baseAxios.post( endPointBoms, purchaseOrderAndStyleIds )
                            .then( response => {
                                if ( response.status === status.success ) {
                                    const { costingAndBomSummary, costingAndBomSummaryDetails, serviceCostSummary } = response?.data;

                                    const basicInfo = {
                                        ...budgetBasicInfo,
                                        budgetCategory: response?.data.budgetCategory,
                                        budgetCurrentCategory: response?.data.budgetCategory
                                    };

                                    const budgetCostingAndBomSummaryDetails = costingAndBomSummaryDetails.map( details => ( {
                                        ...details,
                                        rowId: randomIdGenerator(),

                                        details: [],
                                        isRowOpen: false
                                    } ) );

                                    const modifiedServiceCostSummary = serviceCostSummary.map( scs => ( {
                                        ...scs,
                                        id: serviceCostSummaryModel?.find( sm => scs.serviceGroup === sm.serviceGroup )?.id,
                                        approvedAmount: scs.totalBuyerCost
                                    } ) );
                                    const deferentServiceCostSummary = _.differenceBy( serviceCostSummaryModel, modifiedServiceCostSummary, 'id' );

                                    dispatch( {
                                        type: GET_BUDGET_DERAILS,
                                        budgetBasicInfo: basicInfo,
                                        budgetCostingAndBomSummary: costingAndBomSummary,
                                        budgetCostingAndBomSummaryDetails,
                                        budgetPurchaseOrderQuantityDetails,
                                        serviceCostSummary: [...modifiedServiceCostSummary, ...deferentServiceCostSummary]
                                    } );
                                    dispatch( isBudgetDataLoad( true ) );
                                }

                            } ).catch( ( err ) => {
                                dispatch( isBudgetDataLoad( true ) );
                            } );
                    }

                }

            } )
            .catch( ( err ) => {
                dispatch( isBudgetDataLoad( true ) );
            } );
    } else {
        dispatch( isBudgetDataLoad( true ) );
        const { budgetBasicInfo } = getState().budgets;

        dispatch( {
            type: GET_BUDGET_DERAILS,
            budgetBasicInfo,
            budgetCostingAndBomSummary: [],
            budgetCostingAndBomSummaryDetails: [],
            budgetPurchaseOrderQuantityDetails: [],
            serviceCostSummary: serviceCostSummaryModel
        } );
    }

};

export const bindBudgetPurchaseOrderDetails = ( budgetPurchaseOrderQuantityDetails ) => dispatch => {
    dispatch( {
        type: DELETE_BUDGET_ORDER,
        budgetPurchaseOrderQuantityDetails
    } );
};

export const bindServiceCostSummary = ( serviceCostSummary ) => dispatch => {
    console.log( serviceCostSummary );
    dispatch( {
        type: BIND_SERVICE_COST_SUMMARY,
        serviceCostSummary
    } );
};

export const bindBudgetBasicInfo = ( budgetBasicInfo ) => async dispatch => {
    dispatch( {
        type: BIND_BUDGET_BASIC_INFO,
        budgetBasicInfo
    } );
};

export const getBudgetById = ( budgetId, goBack ) => async ( dispatch, getState ) => {
    dispatch( isBudgetDataLoad( false ) );
    if ( budgetId ) {
        const endPoint = `${merchandisingApi.budget.root}/${budgetId}`;
        await baseAxios.get( endPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const { budgetDetail, serviceCostDetails } = response?.data;
                    const budgetBasicInfo = {
                        ...response?.data,
                        budgetCategory: response?.data.budgetCategory,
                        buyerId: response?.data.buyerId,
                        buyerName: response?.data.buyerName,
                        budgetNumber: response?.data.budgetNumber,
                        // approvedDate: response?.data.approvedDate,
                        // approvedBy: response?.data.approvedBy,
                        isApproved: response.data.isApproved,
                        status: { label: response?.data.status, value: response?.data.status },
                        updateStatus: { label: response?.data.status, value: response?.data.status },
                        dataAlreadyLoaded: true
                    };
                    const queryData = budgetDetail ? budgetDetail.map( order => ( {
                        orderId: order.orderId,
                        styleId: order.styleId,
                        shipmentDate: order.shipmentDate,
                        destination: order.destination
                    } ) ) : [];


                    if ( queryData.length ) {
                        const endPointBoms = `${merchandisingApi.bom.root}/summaryAndDetails`;

                        baseAxios.post( endPointBoms, queryData )

                            .then( response => {
                                if ( response.status === status.success ) {
                                    const { costingAndBomSummary, costingAndBomSummaryDetails, serviceCostSummary } = response?.data;

                                    console.log( 'first', JSON.stringify( costingAndBomSummaryDetails, null, 2 ) );
                                    console.log( 'costingAndBomSummary', JSON.stringify( costingAndBomSummary, null, 2 ) );

                                    const basicInfo = {
                                        ...budgetBasicInfo,
                                        //  budgetCategory: response?.data.budgetCategory,
                                        budgetCurrentCategory: response?.data.budgetCategory
                                    };

                                    const budgetCostingAndBomSummaryDetails = costingAndBomSummaryDetails.map( details => ( {
                                        rowId: randomIdGenerator(),
                                        ...details,
                                        // groupName: details.groupName,
                                        // costingAmount: details.costingAmount,
                                        // bomAmount: details.bomAmount,
                                        // itemCategoryId: details.itemCategoryId,
                                        // itemCategory: details.itemCategory,
                                        // itemSubCategoryId: details.itemSubCategoryId,
                                        // itemSubCategory: details.itemSubCategory,
                                        // summaryDetails: details.summaryDetails,
                                        details: [],
                                        isRowOpen: false
                                    } ) );

                                    ///For AdJust in Model
                                    const modifiedServiceCostSummary = serviceCostSummary.map( scs => ( {
                                        ...scs,
                                        id: serviceCostSummaryModel?.find( sm => scs.serviceGroup === sm.serviceGroup )?.id,
                                        approvedAmount: 0
                                    } ) );

                                    const deferentServiceCostSummary = _.differenceBy( serviceCostSummaryModel, modifiedServiceCostSummary, 'id' );

                                    const updatedServiceCostingSummary = [...modifiedServiceCostSummary, ...deferentServiceCostSummary];
                                    //End Model

                                    /// If Budget have Approved Amount
                                    const finalServiceCostingSummary = updatedServiceCostingSummary.map( scs => ( {
                                        ...scs,
                                        approvedAmount: serviceCostDetails?.find( scd => scs.serviceGroup === scd.name )?.amount ?? 0
                                    } ) );
                                    /// End If Budget have Approved Amount

                                    console.log( 'budgetDetail', JSON.stringify( budgetDetail, null, 2 ) );

                                    dispatch( {
                                        type: GET_BUDGET_DERAILS,
                                        budgetBasicInfo: basicInfo,
                                        budgetCostingAndBomSummary: costingAndBomSummary,
                                        budgetCostingAndBomSummaryDetails,
                                        budgetPurchaseOrderQuantityDetails: budgetDetail ? budgetDetail?.map( order => ( { ...order, rowId: randomIdGenerator() } ) ) : [],
                                        serviceCostSummary: finalServiceCostingSummary
                                    } );
                                    dispatch( isBudgetDataLoad( true ) );

                                }

                            } );
                        //   dispatch( getBudgetDetails( queryData ) );

                    } else {
                        dispatch( isBudgetDataLoad( true ) );
                        dispatch( {
                            type: GET_BUDGET_DERAILS,
                            budgetBasicInfo,
                            budgetCostingAndBomSummary: [],
                            budgetCostingAndBomSummaryDetails: [],
                            budgetPurchaseOrderQuantityDetails: [],
                            serviceCostSummary: []
                        } );

                    }
                }
            } ).catch( ( ( { response } ) => {
                // dispatch( consumptionDataLoaded() );
                dispatch( isBudgetDataLoad( true ) );
                if ( response.status === status.badRequest ) {
                    const isBomRegenerateState = response?.data?.errors[0] === "Budget can't be view.";
                    if ( isBomRegenerateState ) {

                        const confirmObj = {
                            title: response?.data?.errors[0],
                            text: response?.data?.errors[1],
                            confirmButtonText: 'OK'
                        };
                        confirmOK( confirmObj ).then( e => {
                            if ( e.isConfirmed ) {
                                goBack( '/budget' );
                            }
                        } );
                    } else {
                        notify( 'errors', response?.data?.errors );
                    }

                }
                if ( response?.status === status.notFound || response?.status === status.severError || response === undefined ) {
                    notify( 'error', 'Please contact the Support Team!' );
                }
                if ( response?.status === status.conflict ) {

                    notify( 'warning', `${response?.data?.detail}` );
                }
            } ) );
    } else {
        dispatch( isBudgetDataLoad( true ) );
        dispatch( {
            type: GET_BUDGET_BY_ID,
            budgetBasicInfo: null,
            budgetCostingAndBomSummary: [],
            budgetCostingAndBomSummaryDetails: [],
            budgetPurchaseOrderQuantityDetails: [],
            serviceCostSummary: []
        } );
    }

};

export const deleteBudgetPurchaseOrderDetails = ( budgetId, detailsId, purchaseOrderDetails, push ) => async dispatch => {
    const apiEndPoint = `${merchandisingApi.budget.root}/${budgetId}/details/${detailsId}`;
    baseAxios.delete( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            dispatch( bindBudgetPurchaseOrderDetails( purchaseOrderDetails ) );
            dispatch( getBudgetById( budgetId, push ) );
            notify( 'success', 'The Purchaser Order Details has been deleted successfully ' );
        }
    } ).catch( ( ( { response } ) => {
        if ( response.status === status.badRequest ) {
            notify( 'error', `${response.data.errors.join( ', ' )}` );
        }
        if ( response.status === status.notFound || response.status === status.severError ) {
            notify( 'error', 'Please contact with Software Developer!' );
        }
        if ( response.status === status.conflict ) {
            notify( 'warning', `${response.statusText}` );
        }
    } ) );

};
export const getBudgetDetailsByGroupType = ( rowId, groupType, itemGroupId, itemSubGroupId, isRowOpen ) => async ( dispatch, getState ) => {
    const endPoint = `/api/merchandising/categoryGroups/${groupType}/categories/${itemGroupId}/subCategories/${itemSubGroupId}/bom/itemDetails`;
    const { budgetPurchaseOrderQuantityDetails, budgetCostingAndBomSummaryDetails } = getState().budgets;
    const purchaseOrderAndStyleIds = budgetPurchaseOrderQuantityDetails.map( order => ( {
        orderId: order.orderId,
        styleId: order.styleId,
        shipmentDate: order.shipmentDate
    } ) );

    if ( isRowOpen ) {
        const updatedData = budgetCostingAndBomSummaryDetails.map( accessories => {
            if ( rowId === accessories.rowId ) {
                accessories.isRowOpen = !accessories.isRowOpen;
            }
            return accessories;
        } );
        dispatch( {
            type: GET_BUDGET_DERAILS_BY_GROUP_TYPE,
            budgetCostingAndBomSummaryDetails: updatedData
        } );
    } else {
        await baseAxios.post( endPoint, purchaseOrderAndStyleIds )
            .then( response => {
                console.log( response );
                const updatedData = budgetCostingAndBomSummaryDetails.map( accessories => {
                    if ( rowId === accessories.rowId ) {
                        accessories.isRowOpen = !accessories.isRowOpen;
                        accessories.details = response.data.map( detail => ( { ...detail, rowId: randomIdGenerator() } ) );
                    }
                    return accessories;
                } );
                dispatch( {
                    type: GET_BUDGET_DERAILS_BY_GROUP_TYPE,
                    budgetCostingAndBomSummaryDetails: updatedData
                } );
            } );
    }


};


export const getBuyerPODetailsForBudget = ( buyerId ) => async ( dispatch, getState ) => {
    if ( buyerId ) {
        const endPoint = `${merchandisingApi.buyer.root}/${buyerId}/boms/styles/purchaseOrders`;
        await baseAxios.get( endPoint )
            .then( response => {
                const { budgetPurchaseOrderQuantityDetails } = getState().budgets;
                dispatch( {
                    type: BUYERS_PO_DETAILS_FOR_BUDGET,
                    buyerPODetails: response?.data ? response?.data.map( d => ( {
                        ...d,
                        id: randomIdGenerator(),
                        isInclude: budgetPurchaseOrderQuantityDetails.some( order => order.orderId === d.orderId && order.shipmentDate === d.shipmentDate && order.destination === d.destination )
                    } ) ) : []
                } );
            } )
            .catch( ( err ) => console.log( err ) );
    } else {
        dispatch( {
            type: BUYERS_PO_DETAILS_FOR_BUDGET,
            buyerPODetails: []
        } );
        dispatch( getBudgetDetails( [] ) );
    }

};

export const bindPODetails = ( poDetails ) => async dispatch => {
    dispatch( {
        type: BUYERS_PO_DETAILS_FOR_BUDGET,
        buyerPODetails: poDetails
    } );
};


export const bindBudgetSummaryDetails = ( budgetPODetails ) => async ( dispatch, getState ) => {
    const { budgetBasicInfo, budgetCostingAndBomSummary, budgetPurchaseOrderQuantityDetails } = getState().budgets;
    dispatch( {
        type: GET_BUDGET_DERAILS,
        budgetBasicInfo,
        budgetCostingAndBomSummary,
        budgetCostingAndBomSummaryDetails: budgetPODetails,
        budgetPurchaseOrderQuantityDetails
    } );
};


export const budgetStatusChange = ( budgetId, budgetStatus ) => dispatch => {
    dispatch( isBudgetDataLoad( false ) );
    const apiEndPoint = `${merchandisingApi.budget.root}/${budgetId}/status`;
    baseAxios.put( apiEndPoint, { status: budgetStatus } ).then( response => {
        console.log( response );
        if ( response.status === status.success ) {
            notify( 'success', `The budget has been updated successfully` );
            dispatch( getBudgetById( budgetId ) );
            // dispatch( costingDataProgress( false ) );

        }
    } ).catch( ( ( { response } ) => {
        dispatch( isBudgetDataLoad( true ) );

        if ( response.status === status.badRequest ) {
            notify( 'error', `${response.data.errors.join( ', ' )}` );
        }
        if ( response.status === status.notFound || response.status === status.severError ) {
            notify( 'error', 'Please contact with Software Developer!' );
        }
        if ( response.status === status.conflict ) {
            notify( 'warning', `${response.statusText}` );
        }
    } ) );
};


export const addBudget = ( budget, push ) => async dispatch => {
    const endPoint = `${merchandisingApi.budget.root}`;
    await baseAxios.post( endPoint, budget )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_BUDGET,
                    budget
                } );
                notify( 'success', 'The Budget has been added Successfully!' );
                push( { pathname: '/budget-details', state: response.data } );
            } else {
                notify( 'error', 'The Budget has been failed!' );
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
};
export const updateBudget = ( budget, budgetId, budgetStatus, push ) => async dispatch => {
    dispatch( isBudgetDataLoad( false ) );

    const endPoint = `${merchandisingApi.budget.root}/${budgetId}`;
    await baseAxios.put( endPoint, budget )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_BUDGET,
                    budget
                } );
                notify( 'success', 'The Budget has been updated Successfully!' );
                if ( budgetStatus === "Approved" ) {
                    push( { pathname: '/budget-details', state: budgetId } );
                } else {
                    dispatch( getBudgetById( budgetId ) );
                }
            } else {
                notify( 'error', 'The Budget has been failed!' );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( isBudgetDataLoad( true ) );
            if ( response?.status === status?.severError || response === undefined ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response?.data?.errors.join( ', ' )}` );
            }
        } );
};


// Delete Segment
export const deleteBudget = id => async ( dispatch, getState ) => {
    confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios
                .delete( `${merchandisingApi.budget.root}/${id}` )
                .then( response => {
                    if ( response.status === status.success ) {
                        const { params, queryObj } = getState().budgets;
                        dispatch( {
                            type: DELETE_BUDGET
                        } );
                        notify( 'success', 'The Budget has been deleted Successfully!' );
                        dispatch( getBudgetByQuery( params, queryObj ) );
                    } else {
                        notify( 'error', 'The Budget DELETE request has been failed!' );
                    }

                } )
                .catch( ( ( { response } ) => {
                    if ( response.status === status.badRequest ) {
                        notify( 'error', `${response.data.errors.join( ', ' )}` );
                    }
                    if ( response.status === status.notFound || response.status === status.severError ) {
                        notify( 'error', 'Please contact with Software Developer!' );
                    }
                    if ( response.status === status.conflict ) {
                        notify( 'warning', `${response.statusText}` );
                    }
                } ) );
        }
    } );
};


// Delete Segment Range
export const deleteRangeBudget = ids => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios.delete( `${merchandisingApi.budget.delete_budgets_by_range}`, { ids } ).then( response => {
                    dispatch( {
                        type: DELETE_BUDGET_BY_RANGE
                    } );
                } ).then( () => {
                    notify( 'success', 'The Budget has been deleted Successfully!' );
                    dispatch( getBudgetByQuery( getState().budgets.params ) );
                } );
            }
        } );
    };
};

export const cleanAllBudgetState = () => dispatch => {
    dispatch( {
        type: CLEAN_ALL_BUDGET_STATES
    } );
};


export const approveBudget = ( budgetId, budgetStatus ) => async dispatch => {
    const apiEndPoint = `${merchandisingApi.budget.root}/${budgetId}/approve`;
    const confirmedStatus = budgetStatus ? 'disapproved' : 'approved';
    await baseAxios.put( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', `The Budget has been ${confirmedStatus} successfully` );
                dispatch( getBudgetById( budgetId ) );
            }
        } ).catch( ( { response } ) => {
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response.data.errors.join( ', ' )}` );
            }
        } );
};
import { notify } from "@custom/notifications";
// import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import { randomIdGenerator } from '@utils';
import axios from "axios";
import _ from 'lodash';
import moment from "moment";
import { inventoryApi } from "../../../../../services/api-end-points/inventory";
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { confirmObj, status } from "../../../../../utility/enums";
import { convertQueryString } from "../../../../../utility/Utils";
import { getBuyersStyles } from "../../../buyer/store/actions";
import { consumptionBasicInfoModel } from "../../../consumption/model";
import { costingBasicInfoModel, costingGroupsSummaryModel } from "../../model";
import { ADD_COSTING, CLEAR_ALL_COSTING_STATE, COSTING_ACCESSORIES_DETAILS, COSTING_BASIC_INFO, COSTING_CLONE, COSTING_CM_CALCULATION_FOR_MACHINE, COSTING_CM_CALCULATION_FOR_SMV, COSTING_FABRIC_DETAILS, COSTING_GROUP_FOR_COSTING, COSTING_SUMMARY_INFO, DELETE_COSTING, DELETE_COSTINGS_BY_RANGE, DELETE_COSTING_PURCHASE_ORDER_DETAILS, DROP_DOWN_COSTINGS, GET_COSTINGS, GET_COSTINGS_BY_QUERY, GET_COSTING_BY_ID, GET_COSTING_DROPDOWN_BY_ORDER_ID_AND_STYLE_ID, GET_COSTING_SIZE_GROUP_AND_COLORS_HISTORY, GET_COSTING_STYLES_PURCHASE_ORDER_DETAILS, GET_SET_COSTING_BY_ID, GET_SET_COSTING_STYLES_PURCHASE_ORDER_DETAILS, GET_SET_STYLE_PREVIOUS_COSTING_HISTORY, GET_STYLES_DROP_DOWN_BY_PURCHASE_ORDER_ID, GET_STYLE_COSTING_DETAILS, GET_STYLE_DEFAULT_CATEGORY, IS_COSTING_DATA_LOADED, IS_COSTING_DATA_PROGRESS, SELECTED_COSTING_NULL, UPDATE_COSTING } from "../action-types";

export const costingDataLoaded = () => ( dispatch, getState ) => {
    const { isCostingDataLoaded } = getState().costings;
    dispatch( {
        type: IS_COSTING_DATA_LOADED,
        isCostingDataLoaded: !isCostingDataLoaded
    } );
};
export const costingDataProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_COSTING_DATA_PROGRESS,
        isCostingDataProgress: condition
    } );
};

//GET all without Query or Pagination
export const getAllPreCostings = () => {
    return async dispatch => {
        await axios.get( `${merchandisingApi.preCosting.root}` )
            .then( response => {
                dispatch( {
                    type: GET_COSTINGS,
                    preCostings: response.data
                } );
            } );
    };
};

//GET Dropdown Data
export const getDropDownPreCostings = () => {
    return async dispatch => {
        await axios.get( `${merchandisingApi.preCosting.root}` )
            .then( response => {
                dispatch( {
                    type: DROP_DOWN_COSTINGS,
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
export const getCostingByQuery = ( params, queryData ) => async dispatch => {
    dispatch( costingDataLoaded() );
    await baseAxios.post( `${merchandisingApi.costing.root}/Grid?${convertQueryString( params )}`, queryData )
        .then( response => {

            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_COSTINGS_BY_QUERY,
                    costings: response.data.data,
                    totalPages: response?.data?.totalRecords,
                    params,
                    queryObj: queryData
                } );
                dispatch( costingDataLoaded() );
            }

        } ).catch( ( response ) => {

            dispatch( costingDataLoaded() );

        } );
};
export const bindCostingSummary = ( costingSummary ) => async dispatch => {
    await dispatch( {
        type: COSTING_SUMMARY_INFO,
        costingSummary
    } );
};
export const bindCostingAccessoriesDetails = ( costingAccessoriesDetails ) => async dispatch => {
    await dispatch( {
        type: COSTING_ACCESSORIES_DETAILS,
        costingAccessoriesDetails
    } );
};
export const bindCostingFabricDetails = ( costingFabricDetails ) => async dispatch => {
    await dispatch( {
        type: COSTING_FABRIC_DETAILS,
        costingFabricDetails
    } );
};


export const getCostingStylePurchaseOrderDetails = ( buyerId, styleId ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.buyer.root}/${buyerId}/styles/${styleId}/purchaseOrdersForCosting`;
    if ( styleId ) {
        dispatch( {
            type: GET_COSTING_STYLES_PURCHASE_ORDER_DETAILS,
            costingStylePurchaseOrderDetails: [],
            isCostingStylePurchaseOrderDetailsLoaded: false
        } );
        const { costingBasicInfo } = getState().costings;
        await baseAxios.get( apiEndPoint )
            .then( response => {
                dispatch( {
                    type: GET_COSTING_STYLES_PURCHASE_ORDER_DETAILS,
                    costingStylePurchaseOrderDetails: response?.data?.map( order => (
                        {
                            ...order,
                            rowId: randomIdGenerator(),
                            isSelected: costingBasicInfo?.styleOrderDetails?.some( o => o.orderId === order.orderId && o.sizeGroupId === order.sizeGroupId && o.colorId === order.colorId && o.shipmentDate === order.shipmentDate ),
                            isCostingAlreadyDone: order.isCostingCompleted,
                            isCostingCompleted: costingBasicInfo?.styleOrderDetails?.some( o => o.orderId === order.orderId && o.sizeGroupId === order.sizeGroupId && o.colorId === order.colorId && o.shipmentDate === order.shipmentDate ) ? false : order.isCostingCompleted
                        } ) ),
                    isCostingStylePurchaseOrderDetailsLoaded: true
                } );
            } );
    } else {
        dispatch( {
            type: GET_COSTING_STYLES_PURCHASE_ORDER_DETAILS,
            costingStylePurchaseOrderDetails: [],
            isCostingStylePurchaseOrderDetailsLoaded: true
        } );
    }
};
export const bindCostingStylePurchaseOrderDetails = ( costingStylePurchaseOrderDetails ) => async dispatch => {
    if ( costingStylePurchaseOrderDetails.length > 0 ) {

        dispatch( {
            type: GET_COSTING_STYLES_PURCHASE_ORDER_DETAILS,
            costingStylePurchaseOrderDetails,
            isCostingStylePurchaseOrderDetailsLoaded: true

        } );
    } else {
        dispatch( {
            type: GET_COSTING_STYLES_PURCHASE_ORDER_DETAILS,
            costingStylePurchaseOrderDetails: [],
            isCostingStylePurchaseOrderDetailsLoaded: true

        } );
    }
};
export const getSetCostingStylePurchaseOrderDetails = ( buyerId ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.buyer.root}/${buyerId}/setStylesPurchaseOrders`;
    if ( buyerId ) {
        await baseAxios.get( apiEndPoint )
            .then( response => {
                const { costingBasicInfo } = getState().costings;

                dispatch( {
                    type: GET_SET_COSTING_STYLES_PURCHASE_ORDER_DETAILS,
                    setCostingStylePurchaseOrderDetails: response?.data?.map( order => (
                        {
                            ...order,
                            rowId: randomIdGenerator(),
                            isSelected: costingBasicInfo?.styleOrderDetails?.some( o => o.orderId === order.orderId && o.sizeGroupId === order.sizeGroupId && o.colorId === order.colorId )
                        } ) )
                } );
            } );
    } else {
        dispatch( {
            type: GET_SET_COSTING_STYLES_PURCHASE_ORDER_DETAILS,
            setCostingStylePurchaseOrderDetails: []
        } );
    }
};
export const bindSetCostingStylePurchaseOrderDetails = ( setCostingStylePurchaseOrderDetails ) => async dispatch => {
    if ( setCostingStylePurchaseOrderDetails.length > 0 ) {

        dispatch( {
            type: GET_SET_COSTING_STYLES_PURCHASE_ORDER_DETAILS,
            setCostingStylePurchaseOrderDetails
        } );
    } else {
        dispatch( {
            type: GET_SET_COSTING_STYLES_PURCHASE_ORDER_DETAILS,
            setCostingStylePurchaseOrderDetails: []
        } );
    }
};

export const getStyleFabricDefaultCategory = ( styleId, isEditForm ) => dispatch => {
    const apiEndPoint = `${merchandisingApi.style.root}/${styleId}`;
    if ( styleId ) {
        dispatch( costingDataProgress( true ) );
        baseAxios.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    //
                    const { data } = response;
                    const apiEndPointItemGroup = `${inventoryApi.itemGroup.root}/${data.defaultFabCatId}`;

                    baseAxios.get( apiEndPointItemGroup )
                        .then( response => {
                            if ( response.status === status.success ) {
                                // console.log( response.data.defaultUomSetId );
                                // console.log( response.data );

                                const styleDefaultCategory = {
                                    itemGroupId: data.defaultFabCatId,
                                    defaultFabCat: data.defaultFabCat,
                                    itemGroup: data.defaultFabCatId ? {
                                        label: data.defaultFabCat,
                                        value: data.defaultFabCatId
                                    } : null,
                                    itemSubGroupId: data.defaultFabSubCatId,
                                    defaultFabSubCat: data.defaultFabSubCat,
                                    itemSubGroup: data.defaultFabSubCatId ? {
                                        label: data.defaultFabSubCat,
                                        value: data.defaultFabSubCatId
                                    } : null,
                                    itemDescription: data.defaultFabDesc,
                                    itemDescriptionValue: data.defaultFabDesc ? {
                                        label: data.defaultFabDesc,
                                        value: data.defaultFabDesc
                                    } : null,
                                    itemDescriptionTemplate: data.defaultFabDescTemp,
                                    defaultUomSetId: response.data.defaultUomSetId,
                                    consumptionUOMValue: { label: response.data.consumptionUom, value: response.data.consumptionUomId },
                                    consumptionUOM: response.data.consumptionUom

                                };

                                dispatch( {
                                    type: GET_STYLE_DEFAULT_CATEGORY,
                                    styleDefaultCategory
                                } );

                                if ( !isEditForm ) {
                                    dispatch( bindCostingFabricDetails( [
                                        {
                                            ...styleDefaultCategory,
                                            fieldId: randomIdGenerator(),
                                            id: 0,
                                            // itemGroup: null,
                                            // itemGroupId: 0,
                                            // itemSubGroup: null,
                                            // itemSubGroupId: 0,
                                            itemSubGroupArray: [],
                                            itemDescriptionArray: [],
                                            // itemDescriptionValue: null,
                                            // itemDescription: '',
                                            // itemDescriptionTemplate: '',
                                            //   uom: null,
                                            // unitName: '',
                                            //   defaultUomSetId: null,
                                            consumptionUOMArray: [],

                                            wastagePercent: 0,
                                            consumptionQuantity: 0,
                                            consumptionRatePerUnit: 0,
                                            inHouseConsumption: 0,
                                            inHouseRatePerUnit: 0,
                                            inHouseCostPerUnit: 0,
                                            remarks: '',
                                            isFieldError: false,
                                            totalCost: 0,
                                            isItemSubGroupLoaded: true,
                                            isItemDescriptionLoaded: true,
                                            isConsumptionUomLoaded: true
                                        }
                                    ] ) );
                                }
                            }


                        } );
                    dispatch( costingDataProgress( false ) );

                }

            } ).catch( ( ( { response } ) => {
                dispatch( costingDataProgress( false ) );
                if ( response === undefined || response.status === status.notFound || response.status === status.severError || response.status === status.badRequest ) {
                    notify( 'error', `'Please contact with Software Developer!'` );
                }

            } ) );
    } else {
        dispatch( {
            type: GET_STYLE_DEFAULT_CATEGORY,
            styleDefaultCategory: {}
        } );
        //  dispatch( bindCostingFabricDetails( [] ) );
        dispatch( costingDataProgress( false ) );
    }


};

//GET PreCosting by Id
export const getCostingById = ( id ) => async ( dispatch, getState ) => {
    dispatch( costingDataProgress( true ) );
    if ( id ) {
        await baseAxios.get( `${merchandisingApi.costing.root}/${id}` )
            .then( async response => {
                if ( response.status === status.success ) {
                    const { accessoriesDetails, fabricDetails, otherDetails } = response?.data;
                    // const styleDropdownValue = costingStyleOrderDetails[0];
                    const { data } = response;
                    const costingBasicInfo = {
                        ...data,
                        id: data?.id,
                        userCostingNumber: "",
                        orderId: data?.orderId,
                        orderNumber: data?.orderNumber,
                        style: { label: data?.styleNumber, value: data?.styleId },
                        costingNumber: data?.costingNumber,
                        buyer: { label: data?.buyerName, value: data?.buyerId },
                        uom: { label: data?.costingUOM, value: data?.costingUOM },
                        costingQuantity: data?.costingQuantity,
                        costingTerm: { value: data?.costingTerm, label: data?.costingTerm },
                        shipmentMode: { value: data?.shipmentMode, label: data?.shipmentMode },
                        shipmentDate: data?.shipmentDate ? moment( Date.parse( data?.shipmentDate ) ).format( 'yyyy-MM-DD' ) : moment( new Date() ).format( 'yy-MM-DD' ),
                        currencyCode: { value: data?.currencyCode, label: data?.currencyCode },
                        totalQuotedPrice: data?.totalQuotedPrice,
                        perUnitQuotedPrice: data?.perUnitQuotedPrice,
                        fobAmount: data?.fobAmount,
                        status: { value: data?.status, label: data?.status },
                        updateStatus: { value: data?.status, label: data?.status },
                        merchandiser: data.merchandiser ? { label: data.merchandiser, value: data.merchandiserId } : null,
                        remarks: data?.remarks,
                        additionalInstruction: data?.additionalInstruction,
                        styleOrderDetails: data.costingStyleOrderDetails.map( order => ( { ...order, rowId: randomIdGenerator(), isSelected: true, isEditable: true } ) ),
                        isCostingNumberInput: false,
                        isEditCosting: true,
                        accessoriesDetails,
                        fabricDetails
                    };
                    const modifiedFabricDetails = fabricDetails?.map( ( fd, index ) => (
                        {
                            fieldId: randomIdGenerator(),
                            id: fd.id,
                            rowNo: index + 1,
                            costingGroupType: fd.costingGroupType,
                            itemGroupId: fd.itemGroupId,
                            itemGroupName: fd.itemGroupName,
                            itemGroup: { value: fd.itemGroupId, label: fd.itemGroupName },
                            itemSubGroupId: fd.itemSubGroupId,
                            itemSubGroupName: fd.itemSubGroupName,
                            itemSubGroup: { value: fd.itemSubGroupId, label: fd.itemSubGroupName },
                            itemDescription: fd.itemDescription,
                            itemDescriptionValue: fd.itemDescription ? { value: fd.itemDescription, label: fd.itemDescription } : null,
                            itemDescriptionTemplate: fd.itemDescriptionTemplate,
                            itemDescriptionArray: [],
                            itemSubGroupArray: [],
                            defaultUomSetId: null,
                            consumptionUOMArray: [],
                            consumptionUOM: fd.consumptionUOM,
                            consumptionUOMValue: { value: fd.consumptionUOM, label: fd.consumptionUOM },
                            wastagePercent: fd.wastagePercent,
                            consumptionRatePerUnit: fd.consumptionRatePerUnit,
                            inHouseRatePerUnit: fd.inHouseRatePerUnit,
                            // inHouseQuantity: fd.inHouseQuantity,
                            inHouseConsumption: fd.inHouseQuantity,
                            consumptionQuantity: fd.consumptionQuantity,
                            consumptionCost: fd.consumptionCost,
                            inHouseCostPerUnit: fd.inHouseCost,
                            remarks: fd.remarks ?? "",
                            garmentPart: fd?.garmentPart ? { value: fd.garmentPart, label: fd.garmentPart } : null,

                            isFieldError: false,
                            totalCost: fd.consumptionCost,
                            isItemSubGroupLoaded: true,
                            isItemDescriptionLoaded: true,
                            isConsumptionUomLoaded: true
                        }
                    ) );
                    const modifiedAccessoriesDetails = accessoriesDetails?.map( ( ad, index ) => (
                        {
                            fieldId: randomIdGenerator(),
                            rowNo: index + 1,
                            id: ad.id,

                            costingGroupType: ad.costingGroupType,
                            itemGroupId: ad.itemGroupId,
                            itemGroupName: ad.itemGroupName,
                            itemGroup: { value: ad.itemGroupId, label: ad.itemGroupName },
                            itemSubGroupId: ad.itemSubGroupId,
                            itemSubGroupName: ad.itemSubGroupName,
                            itemSubGroup: { value: ad.itemSubGroupId, label: ad.itemSubGroupName },
                            itemDescription: ad.itemDescription,
                            itemDescriptionValue: ad.itemDescription ? { value: ad.itemDescription, label: ad.itemDescription } : null,
                            itemDescriptionTemplate: ad.itemDescriptionTemplate,
                            defaultUomSetId: null,
                            consumptionUOMArray: [],
                            itemSubGroupArray: [],
                            consumptionUOM: ad.consumptionUOM,
                            consumptionUOMValue: { value: ad.consumptionUOM, label: ad.consumptionUOM },
                            wastagePercent: ad.wastagePercent,
                            consumptionRatePerUnit: ad.consumptionRatePerUnit,
                            inHouseRatePerUnit: ad.inHouseRatePerUnit,
                            // inHouseQuantity: ad.inHouseQuantity,
                            inHouseConsumption: ad.inHouseQuantity,
                            consumptionQuantity: ad.consumptionQuantity,
                            consumptionCost: ad.consumptionCost,
                            inHouseCostPerUnit: ad.inHouseCost,
                            remarks: ad.remarks ?? "",
                            isFieldError: false,
                            garmentPart: ad?.garmentPart ? { value: ad.garmentPart, label: ad.garmentPart } : null,
                            totalCost: ad.consumptionCost,
                            isItemSubGroupLoaded: true,
                            isItemDescriptionLoaded: true,
                            isConsumptionUomLoaded: true
                        }
                    ) );
                    // console.log( fabricDetails );

                    const { costingGroupsSummary } = getState().costings;

                    const modifiedOtherDetails = otherDetails?.map( od => ( {
                        id: costingGroupsSummary?.find( s => s.name === od.costingGroup )?.id,
                        inPercentage: od.costInPercentage,
                        name: od?.costingGroup,
                        isCalculateInPercentage: !!( ( od?.costingGroup === "Commercial Expense" || od?.costingGroup === "BH Commission" || od?.costingGroup === "Profit" ) ),
                        buyerAmount: od?.totalBuyerCost,
                        inHouseAmount: od?.totalInHouseCost
                    } ) );


                    const deferentOtherDetails = _.differenceBy( costingGroupsSummary, modifiedOtherDetails, 'name' );

                    const concatOtherDerails = _.concat( modifiedOtherDetails, deferentOtherDetails );


                    const modifiedSummary = concatOtherDerails.filter( c => c.name !== "Fabric" && c.name !== "Accessories" );
                    modifiedSummary.unshift(
                        {
                            id: 1,
                            name: 'Fabric',
                            buyerAmount: _.sum( fabricDetails.map( i => Number( i.consumptionCost ) ) ),
                            inHouseAmount: _.sum( fabricDetails.map( i => Number( i.inHouseCost ) ) ),
                            inPercentage: 0,
                            isCalculateInPercentage: false

                        }, {
                        id: 2,
                        name: 'Accessories',
                        buyerAmount: _.sum( accessoriesDetails.map( i => Number( i.consumptionCost ) ) ),
                        inHouseAmount: _.sum( accessoriesDetails.map( i => Number( i.inHouseCost ) ) ),
                        inPercentage: 0,
                        isCalculateInPercentage: false

                    } );
                    dispatch( {
                        type: COSTING_GROUP_FOR_COSTING,
                        costingGroupsSummary: modifiedSummary
                        // console.log( JSON.stringify( costingBasicInfo, null, 2 ) );
                    } );
                    dispatch( {
                        type: GET_COSTING_BY_ID,
                        costingBasicInfo: response.data ? costingBasicInfo : costingBasicInfoModel
                    } );
                    dispatch( bindCostingFabricDetails( modifiedFabricDetails ) );
                    dispatch( bindCostingAccessoriesDetails( modifiedAccessoriesDetails ) );
                    dispatch( getStyleFabricDefaultCategory( data?.styleId, true ) );
                    dispatch( costingDataProgress( false ) );
                }
            } ).catch( ( ( { response } ) => {
                dispatch( costingDataProgress( false ) );
                if ( response === undefined || response.status === status.notFound || response.status === status.severError || response.status === status.badRequest ) {
                    notify( 'error', `'Please contact with Software Developer!'` );
                }
                if ( response?.status === status.conflict ) {
                    notify( 'warning', `${response?.data?.details}` );
                }
            } ) );
    } else {

        dispatch( {
            type: COSTING_GROUP_FOR_COSTING,
            costingGroupsSummary: costingGroupsSummaryModel
        } );
        dispatch( {
            type: GET_COSTING_BY_ID,
            costingBasicInfo: costingBasicInfoModel
        } );
        dispatch( bindCostingFabricDetails( [] ) );
        dispatch( bindCostingAccessoriesDetails( [] ) );
        dispatch( costingDataProgress( false ) );

    }

};

export const getSetCostingById = ( setCostingId ) => async dispatch => {
    if ( setCostingId ) {
        await baseAxios.get( `${merchandisingApi.costing.root}/setCosting/${setCostingId}` )
            .then( response => {
                const { data } = response;
                const { accessoriesDetails, styleCostingDetails } = response?.data;
                console.log( styleCostingDetails );

                const basicInfo = {
                    costingNumber: data.costingNumber,
                    isCostingNumberInput: false,
                    buyer: { label: data.buyerName, value: data.buyerId },
                    styleOrderDetails: data.setStylesAndPurchaseOrders.map( order => ( { ...order, rowId: randomIdGenerator() } ) )
                };
                const modifiedAccessoriesDetails = accessoriesDetails?.map( ad => (
                    {
                        fieldId: randomIdGenerator(),
                        costingGroupType: ad.costingGroupType,
                        itemGroupId: ad.itemGroupId,
                        itemGroupName: ad.itemGroupName,
                        itemGroup: { value: ad.itemGroupId, label: ad.itemGroupName },
                        itemSubGroupId: ad.itemSubGroupId,
                        itemSubGroupName: ad.itemSubGroupName,
                        itemSubGroup: { value: ad.itemSubGroupId, label: ad.itemSubGroupName },
                        itemDescription: ad.itemDescription,
                        itemDescriptionTemplate: ad.itemDescriptionTemplate,
                        consumptionUOMArray: [],
                        consumptionUOM: { value: ad.consumptionUOM, label: ad.consumptionUOM },
                        wastagePercent: ad.wastagePercent,
                        consumptionRatePerUnit: ad.consumptionRatePerUnit,
                        inHouseRatePerUnit: ad.inHouseRatePerUnit,
                        inHouseQuantity: ad.inHouseQuantity,
                        consumptionQuantity: ad.consumptionQuantity,
                        consumptionCost: ad.consumptionCost,
                        inHouseCost: ad.inHouseCost,
                        totalCost: ad.consumptionCost,
                        remarks: ad.remarks
                    }
                ) );
                dispatch( {
                    type: GET_SET_COSTING_BY_ID,
                    costingBasicInfo: response.data ? basicInfo : consumptionBasicInfoModel,
                    stylesCostingDetails: styleCostingDetails.map( detail => ( { ...detail, rowId: randomIdGenerator(), costingNumber: detail.styleCosting, costingId: detail.styleCostingId } ) )
                } );

                dispatch( bindCostingAccessoriesDetails( modifiedAccessoriesDetails ) );

            } );
    } else {
        dispatch( {
            type: GET_SET_COSTING_BY_ID,
            costingBasicInfo: consumptionBasicInfoModel,
            stylesCostingDetails: []
        } );
    }
};

export const getStyleCostingDetails = ( queryData ) => async dispatch => {
    const endPoint = `${merchandisingApi.setStyle.root}/stylesCostingDetails`;
    if ( queryData.length > 0 ) {
        await baseAxios.post( endPoint, queryData )
            .then( response => {
                console.log( response.data );
                dispatch( {
                    type: GET_STYLE_COSTING_DETAILS,
                    stylesCostingDetails: response.data.map( detail => ( { ...detail, rowId: randomIdGenerator() } ) )
                } );
            } );
    } else {
        dispatch( {
            type: GET_STYLE_COSTING_DETAILS,
            stylesCostingDetails: []
        } );
    }

};
export const bindStyleCostingDetails = ( costings ) => async dispatch => {
    dispatch( {
        type: GET_STYLE_COSTING_DETAILS,
        stylesCostingDetails: costings
    } );


};


//GET PreCosting by Id
export const getCostingDropdownByOrderIdAndStyleId = ( orderId, styleId ) => async dispatch => {
    const endPoint = `${merchandisingApi.costing.root}/purchaseOrder/${orderId}/style/${styleId}`;
    if ( orderId && styleId ) {
        await baseAxios.get( endPoint )
            .then( response => {
                dispatch( {
                    type: GET_COSTING_DROPDOWN_BY_ORDER_ID_AND_STYLE_ID,
                    costingDropdownByOrderIdAndStyleId: response.data ? response.data.map( costing => ( { label: costing.costingNumber, value: costing.id } ) ) : []
                } );
            } );
    } else {
        dispatch( {
            type: GET_COSTING_DROPDOWN_BY_ORDER_ID_AND_STYLE_ID,
            costingDropdownByOrderIdAndStyleId: []
        } );
    }

};


export const getSetStyleCostingPreviousHistory = ( orderId, setStyleId ) => async dispatch => {
    const endPoint = `${merchandisingApi.costing.root}/purchaseOrder/${orderId}/setStyle/${setStyleId}/styles/costing/details`;
    await baseAxios.get( endPoint )
        .then( response => {
            dispatch( {
                type: GET_SET_STYLE_PREVIOUS_COSTING_HISTORY,
                setStyleCostingPreviousHistory: response.data ? response.data : null
            } );
        } );
};
export const bindCostingBasicInfo = ( costingBasicInfo ) => dispatch => {
    if ( costingBasicInfo ) {
        dispatch( {
            type: COSTING_BASIC_INFO,
            costingBasicInfo
        } );
    } else {
        dispatch( {
            type: COSTING_BASIC_INFO,
            costingBasicInfo: costingBasicInfoModel
        } );
    }
};
export const getEditCostingSizeGroupAndColorsHistory = ( queryData, color, sizeGroup ) => async dispatch => {

    if ( queryData?.length > 0 ) {
        // const endPoint = `${merchandisingApi.costing.root}/purchaseOrder/${orderId}/style/${styleId}/sizeGroupsAndColorsForCosting`;
        const endPoint = `${merchandisingApi.style.root}/purchaseOrders/sizeGroupsAndColors`;
        await baseAxios.post( endPoint, queryData )
            .then( response => {
                const demoSizeGroup = [
                    {
                        sizeGroupId: null,
                        sizeGroup: null
                    }
                ];
                const { data } = response;
                const existingSizeGroups = sizeGroup.length > 0 ? sizeGroup?.map( sg => ( {
                    sizeGroupId: sizeGroup.length > 0 ? sg.value : null,
                    sizeGroup: sizeGroup.length > 0 ? sg.label : null
                } ) ) : demoSizeGroup;
                const existingColors = color?.map( sg => ( {
                    colorId: sg.value,
                    color: sg.label
                } ) );

                const concatDataBefore = existingColors.map( color => (
                    existingSizeGroups.map( size => ( { ...size, ...color } ) )
                ) ).flat();

                const concatData = concatDataBefore.concat( data );

                const sizeGroups = concatData?.filter( sizeGroup => sizeGroup.sizeGroup ).map( sg => ( {
                    value: sg.sizeGroupId,
                    label: sg.sizeGroup,
                    color: sg.color,
                    colorId: sg.colorId
                } ) );


                const colors = concatData?.map( color => ( {
                    label: color.color,
                    value: color.colorId,
                    sizeGroup: color.sizeGroup,
                    sizeGroupId: color.sizeGroupId
                } ) );

                const responseBody = {
                    sizeGroups,
                    colors: _.uniqBy( colors, 'value' )
                };

                dispatch( {
                    type: GET_COSTING_SIZE_GROUP_AND_COLORS_HISTORY,
                    costingSizeGroupColorHistory: response.data ? responseBody : null
                } );
            } )
            .catch( ( response ) => {
                // if ( response.status === status.badRequest ) {
                //     const demoSizeGroup = [
                //         {
                //             sizeGroupId: null,
                //             sizeGroup: null
                //         }
                //     ];
                //     //  notify( 'error', `${response.data}` );

                //     const existingSizeGroups = sizeGroup?.length > 0 ? sizeGroup?.map( sg => ( {
                //         sizeGroupId: sg.value ? sg.value : null,
                //         sizeGroup: sg.label ? sg.label : null
                //     } ) ) : demoSizeGroup;


                //     const existingColors = color?.map( sg => ( {
                //         colorId: sg.value,
                //         color: sg.label
                //     } ) );


                //     const concatData = existingColors.map( color => (
                //         existingSizeGroups.map( size => ( { ...size, ...color } ) )
                //     ) ).flat();

                //     //console.log( concatData.flat() );


                //     const sizeGroups = concatData?.filter( sizeGroup => sizeGroup.sizeGroup ).map( sg => ( {
                //         value: sg.sizeGroupId,
                //         label: sg.sizeGroup,
                //         color: sg.color,
                //         colorId: sg.colorId
                //     } ) );

                //     const colors = concatData?.map( color => ( {
                //         label: color.color,
                //         value: color.colorId,
                //         sizeGroup: color.sizeGroup ? color.sizeGroup : null,
                //         sizeGroupId: color.sizeGroupId ? color.sizeGroupId : null
                //     } ) );


                //     const responseBody = {
                //         sizeGroups,
                //         colors
                //         // colors: _.uniqBy( colors, 'value' )
                //     };

                //     dispatch( {
                //         type: GET_COSTING_SIZE_GROUP_AND_COLORS_HISTORY,
                //         costingSizeGroupColorHistory: response.data ? responseBody : null
                //     } );
                // }
                // if ( response.status === status.notFound || response.status === status.severError ) {
                //     notify( 'error', `'Please contact with Software Developer!'` );
                // }
                // if ( response.status === status.conflict ) {
                //     notify( 'warning', `${response.statusText}` );
                // }
                // console.log( response );
            } );
    } else {
        dispatch( {
            type: GET_COSTING_SIZE_GROUP_AND_COLORS_HISTORY,
            costingSizeGroupColorHistory: null
        } );
    }

};
export const getCostingSizeGroupAndColorsHistory = ( queryData ) => async ( dispatch, getState ) => {
    const body = [
        {
            styleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            styleNumber: "string",
            orderId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            orderNumber: "string"
        }
    ];
    if ( queryData?.length > 0 ) {
        const endPoint = `${merchandisingApi.style.root}/purchaseOrders/sizeGroupsAndColors`;
        await baseAxios.post( endPoint, queryData )
            .then( response => {
                const { data } = response;

                const sizeGroups = data?.filter( sizeGroup => sizeGroup.sizeGroup ).map( sg => ( {
                    value: sg.sizeGroupId,
                    label: sg.sizeGroup,
                    color: sg.color,
                    colorId: sg.colorId
                } ) );

                const colors = data?.map( color => ( {
                    label: color.color,
                    value: color.colorId,
                    sizeGroup: color.sizeGroup
                } ) );

                const responseBody = {
                    // sizeGroups: _.uniqBy( sizeGroups, 'value' ),
                    colors: _.uniqBy( colors, 'value' ),
                    sizeGroups
                    // colors
                };

                dispatch( {
                    type: GET_COSTING_SIZE_GROUP_AND_COLORS_HISTORY,
                    costingSizeGroupColorHistory: response.data ? responseBody : null
                } );
                // const { costingBasicInfo } = getState().costings;
                // const updateCostingBasicInfo = {
                //     ...costingBasicInfo,
                //     sizeGroups: [],
                //     colorsArray: [],
                //     colors: [],
                //     costingUOMValue: null, //Extra
                //     costingUOM: "",
                //     relativeFactor: 0,
                //     costingTermValue: null, //Extra
                //     costingTerm: "",
                //     shipmentModeValue: null,
                //     shipmentMode: "",
                //     currencyValue: null, ///Extra
                //     currency: "",
                //     costingQuantity: 1,
                //     totalQuotedPrice: 0,
                //     perUnitQuotedPrice: 0,
                //     fobAmount: 0,
                //     statusValue: null,
                //     status: "",
                //     cm: 0,
                //     effectiveCM: 0,
                //     remarks: "",
                //     additionalInstruction: "",
                //     costOfMakingPercentage: 0,
                //     itSetStyle: false,
                //     isAllCostingCompleted: false
                // };
                // dispatch( bindCostingBasicInfo( updateCostingBasicInfo ) );
                // dispatch( bindCostingFabricDetails( [] ) );
                // dispatch( bindCostingAccessoriesDetails( [] ) );
            } )
            .catch( ( ( { response } ) => {
                if ( response.status === status.badRequest ) {
                    notify( 'error', `${response.data}` );
                    const { costingBasicInfo } = getState().costings;
                    const updateCostingBasicInfo = {
                        ...costingBasicInfo,
                        isAllCostingCompleted: true
                    };
                    dispatch( bindCostingBasicInfo( updateCostingBasicInfo ) );
                }
                if ( response.status === status.notFound || response.status === status.severError ) {
                    notify( 'error', `'Please contact with Software Developer!'` );
                }
                if ( response.status === status.conflict ) {
                    notify( 'warning', `${response.statusText}` );
                }
            } ) );
    } else {
        dispatch( {
            type: GET_COSTING_SIZE_GROUP_AND_COLORS_HISTORY,
            costingSizeGroupColorHistory: null
        } );
    }

};

//Selected Pre Costing must be Empty after Edit or Details
export const selectedPreCostingNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_COSTING_NULL,
            selectedPreCosting: null
        } );
    };
};

export const costingStatusChange = ( costingId, costingStatus ) => dispatch => {
    dispatch( costingDataProgress( true ) );
    const apiEndPoint = `${merchandisingApi.costing.root}/${costingId}/status`;
    baseAxios.put( apiEndPoint, { status: costingStatus } ).then( response => {
        console.log( response );
        if ( response.status === status.success ) {
            notify( 'success', `The costing has been updated successfully` );
            dispatch( getCostingById( costingId ) );
            // dispatch( costingDataProgress( false ) );

        }
    } ).catch( ( ( { response } ) => {
        dispatch( costingDataProgress( false ) );

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

///Add Costing
export const addCosting = ( costing, push ) => async dispatch => {
    dispatch( costingDataProgress( true ) );

    await baseAxios.post( `${merchandisingApi.costing.root}`, costing )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_COSTING,
                    costing
                } );
                notify( 'success', 'The Costing has been added Successfully' );
                push( { pathname: `/costings-details`, state: `${response.data}` } );
            } else {
                notify( 'error', 'The Costing has been failed!' );
            }

        } )
        .catch( ( ( { response } ) => {
            dispatch( costingDataProgress( false ) );

            if ( response?.status === status.badRequest ) {
                notify( 'error', `${response?.data?.errors.join( ', ' )}` );
            }
            if ( response.status === status.notFound || response.status === status.severError ) {
                notify( 'error', 'Please contact with Software Developer!' );
            }
            if ( response.status === status.conflict ) {
                notify( 'warning', `${response.statusText}` );
            }
        } ) );
};
export const addSetCosting = ( setCosting, push ) => async dispatch => {
    await baseAxios.post( `${merchandisingApi.costing.root}/setCosting`, setCosting )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_COSTING,
                    setCosting
                } );
                notify( 'success', 'The Costing has been added Successfully' );
                push( { pathname: `/set-costings-edit`, state: `${response.data}` } );
            } else {
                notify( 'error', 'The Costing has been failed!' );
            }
        } )
        .catch( ( { response } ) => {
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};


/// Update Costing
export const updateCosting = ( costing, costingId, costingStatus, push ) => async ( dispatch, getState ) => {
    dispatch( costingDataProgress( true ) );

    await baseAxios.put( `${merchandisingApi.costing.root}/${costingId}`, costing )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_COSTING,
                    costing
                } );
                if ( costingStatus === 'Approved' ) {
                    push( { pathname: '/costings-details', state: costingId } );
                } else {
                    dispatch( getCostingById( costingId ) );
                }
                notify( 'success', 'The Costing has been updated Successfully' );

            } else {
                notify( 'error', 'The Costing has been failed' );
            }
        } )
        .catch( ( { response } ) => {
            dispatch( costingDataProgress( false ) );

            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};
/// Update Costing
export const updateSetCosting = ( costing, costingId ) => async ( dispatch, getState ) => {
    await baseAxios.put( `${merchandisingApi.costing.root}/setCosting/${costingId}`, costing )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_COSTING,
                    costing
                } );
                dispatch( getSetCostingById( costingId ) );

                notify( 'success', 'The Pre Costing has been updated Successfully' );
            } else {
                notify( 'error', 'The Pre Costing has been failed' );
            }
        } )
        .catch( ( { response } ) => {
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

///Delete Pre Costing by Id
export const deleteCosting = ( id ) => async ( dispatch, getState ) => {
    confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios
                .delete( `${merchandisingApi.costing.root}/${id}` )
                .then( response => {
                    if ( response.status === status.success ) {
                        const { params, queryObj } = getState().costings;

                        dispatch( {
                            type: DELETE_COSTING
                        } );
                        notify( 'success', 'The Costing has been deleted Successfully!' );
                        dispatch( getCostingByQuery( params, queryObj ) );
                    } else {
                        notify( 'error', 'The Costing DELETE request has been failed!' );
                    }

                } )
                .catch( ( { response } ) => {
                    console.log( response.data.errors );
                    if ( response.status === status.severError ) {
                        notify( 'error', `Please contact the support team!!!` );
                    } else {
                        notify( 'errors', response.data.errors );
                    }
                } );
        }
    } );

};
///Delete Pre Costing by Id
export const retrieveCosting = ( id ) => async ( dispatch, getState ) => {
    confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios
                .put( `${merchandisingApi.costing.root}/archiveOrActive/${id}` )
                .then( response => {
                    if ( response.status === status.success ) {
                        const { params, queryObj } = getState().costings;
                        dispatch( {
                            type: DELETE_COSTING
                        } );
                        notify( 'success', 'The Costing has been retrieved Successfully!' );
                        dispatch( getCostingByQuery( params, queryObj ) );
                    } else {
                        notify( 'error', 'The Costing retrieved request has been failed!' );
                    }

                } )
                .catch( err => console.log( err ) );
        }
    } );

};
///Delete Pre Costing by Id
export const deleteCostingPurchaseOrderDetails = ( id, detailId, rowId ) => async ( dispatch, getState ) => {
    const f = "/api/merchandising/costings/{id}/styleAndOrderDetail/{detailId}";
    const apiEndPoint = `${merchandisingApi.costing.root}/${id}/styleAndOrderDetail/${detailId}`;
    confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios
                .delete( apiEndPoint )
                .then( response => {
                    const { costingBasicInfo } = getState().costings;
                    if ( response.status === status.success ) {
                        dispatch( {
                            type: DELETE_COSTING_PURCHASE_ORDER_DETAILS
                        } );
                        notify( 'success', `The Costing Purchase Order Details has been deleted Successfully!` );
                        //  dispatch( getCostingById( id ) );
                        const updatedData = costingBasicInfo.styleOrderDetails.filter( o => o.rowId !== rowId );
                        const updateObj = {
                            ...costingBasicInfo,
                            ['styleOrderDetails']: updatedData
                        };
                        dispatch( bindCostingBasicInfo( updateObj ) );

                    } else {
                        notify( 'error', 'The request has been failed!' );
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

/// Delete Pre Costing by Range
export const deleteRangeCosting = ( ids ) => {
    return async ( dispatch, getState ) => {
        await axios.delete( `${merchandisingApi.preCosting.delete_costing_by_range}`, { ids } )
            .then( response => {
                dispatch( {
                    type: DELETE_COSTINGS_BY_RANGE
                } );
            } )
            .then( () => {
                notify( 'success', 'The Pre Costing has been deleted Successfully' );
                dispatch( getAllPreCostings() );
            } );
    };
};


export const bindCostingEditBasicInfo = ( costingBasicInfo ) => async dispatch => {
    if ( costingBasicInfo ) {
        await dispatch( {
            type: GET_COSTING_BY_ID,
            selectedCosting: costingBasicInfo
        } );
    } else {
        await dispatch( {
            type: GET_COSTING_BY_ID,
            selectedCosting: null
        } );
    }
};


export const getCostingGroupsForCosting = () => async dispatch => {

    await baseAxios.get( `${merchandisingApi.costingGroup.root}` ).then( response => {
        const costingSummary = response?.data?.data?.map( cs => ( {
            id: cs.id,
            name: cs.name,
            buyerAmount: 0,
            inHouseAmount: 0,
            inPercentage: 0,
            isCalculateInPercentage: cs.isCalculateInPercentage
        } ) );

        const totals = [...costingSummary, { id: randomIdGenerator(), name: 'Total', buyerAmount: 0, inHouseAmount: 0, inPercentage: 0 }];
        totals.unshift( { id: randomIdGenerator(), name: 'Fabric', buyerAmount: 0, inHouseAmount: 0, inPercentage: 0 }, { id: randomIdGenerator(), name: 'Accessories', buyerAmount: 0, inHouseAmount: 0, inPercentage: 0 } );
        dispatch( {
            type: COSTING_GROUP_FOR_COSTING,
            costingGroupsSummary: response?.data?.data ? totals : []
        } );
    } );
};

//GET Dropdown Data PO Styles
export const getStylesDropdownByPOId = ( purchaseOrderId ) => async ( dispatch, getState ) => {
    if ( purchaseOrderId ) {
        await baseAxios.get( `${merchandisingApi.purchaseOrder.root}/${purchaseOrderId}/styles` )
            .then( response => {
                const responseArray = response?.data?.map( i => (
                    {
                        value: i.styleId,
                        label: i.styleNo,
                        isSetStyle: i.isSetStyle
                    }
                ) );
                dispatch( {
                    type: GET_STYLES_DROP_DOWN_BY_PURCHASE_ORDER_ID,
                    purchaseOrderStylesDropdown: response?.data ? responseArray : []
                } );
            } );
    } else {
        dispatch( {
            type: GET_STYLES_DROP_DOWN_BY_PURCHASE_ORDER_ID,
            purchaseOrderStylesDropdown: []
        } );
    }
};

export const bindCostingSummaryInputOnChange = ( costingSummary ) => {
    return async dispatch => {
        dispatch( {
            type: COSTING_GROUP_FOR_COSTING,
            costingGroupsSummary: costingSummary
        } );
    };
};

export const bindCMCalculationForSVMInputOnChange = ( cmSmv ) => async dispatch => {
    const obj = {
        smv: 0,
        efficiency: 0,
        perMinCost: 0,
        pcs: 0,
        cm: 0
    };

    if ( cmSmv ) {
        await dispatch( {
            type: COSTING_CM_CALCULATION_FOR_SMV,
            cmCalculationForSMV: cmSmv
        } );
    } else {
        await dispatch( {
            type: COSTING_CM_CALCULATION_FOR_SMV,
            cmCalculationForSMV: obj
        } );
    }


};
export const bindCMCalculationForMachineInputOnChange = ( cmMachine ) => async dispatch => {
    const obj = {
        noOfMachine: 0,
        productivity: 0,
        perMinCost: 0,
        pcs: 0,
        cm: 0
    };
    if ( cmMachine ) {
        dispatch( {
            type: COSTING_CM_CALCULATION_FOR_MACHINE,
            cmCalculationForMachine: cmMachine
        } );
    } else {
        dispatch( {
            type: COSTING_CM_CALCULATION_FOR_MACHINE,
            cmCalculationForMachine: obj
        } );
    }

};


export const clearAllCostingState = () => dispatch => {
    dispatch( {
        type: CLEAR_ALL_COSTING_STATE
    } );
    dispatch( getBuyersStyles( null ) );
};

export const cloneCosting = ( costingBasicInfo, costingFabricDetails, costingAccessoriesDetails, costingGroupsSummary, replace ) => dispatch => {
    dispatch( {
        type: COSTING_CLONE,
        costingBasicInfo: { ...costingBasicInfo, sysId: '', costingNumber: '', currency: costingBasicInfo?.currencyCode, styleOrderDetails: [] },
        costingFabricDetails,
        costingAccessoriesDetails,
        costingGroupsSummary
    } );

    replace( { pathname: `/clone-costing` } );
};

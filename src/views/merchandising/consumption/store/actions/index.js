import { notify } from '@custom/notifications';
import { baseAxios } from '@services';
import _ from 'lodash';
import { inventoryApi } from '../../../../../services/api-end-points/inventory';
import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import { confirmDialog } from '../../../../../utility/custom/ConfirmDialog';
import { confirmObj, status } from '../../../../../utility/enums';
import { convertQueryString, randomIdGenerator } from '../../../../../utility/Utils';
import { getBuyersStyles } from '../../../buyer/store/actions';
import {
    ADD_CONSUMPTION,
    CLEAN_CONSUMPTION_ALL_STATE,
    CLONE_CONSUMPTION,
    CONSUMPTION_PURCHASE_ORDER_DATA_ON_PROGRESS,
    DELETE_CONSUMPTION,
    DELETE_CONSUMPTIONS_BY_RANGE,
    DELETE_CONSUMPTION_ORDER_DETAILS,
    DROP_DOWN_CONSUMPTIONS,
    GET_CONSUMPTIONS_BY_QUERY,
    GET_CONSUMPTION_ACCESSORIES_DETAILS,
    GET_CONSUMPTION_BASIC_INFO,
    GET_CONSUMPTION_BY_ID,
    GET_CONSUMPTION_DETAILS_COLOR_SIZE_SENSE,
    GET_CONSUMPTION_FABRIC_DETAILS,
    GET_CONSUMPTION_ORDER_DERAILS,
    GET_CONSUMPTION_PACKAGING_ACCESSORIES_DETAILS,
    GET_CONSUMPTION_PURCHASE_ORDER_COLORS,
    GET_CONSUMPTION_PURCHASE_ORDER_SIZES,
    GET_CONSUMPTION_STYLE_PURCHASE_ORDER_DETAILS,
    GET_COSTING_HISTORY_FOR_CONSUMPTION,
    GET_PACK_CONSUMPTION_BY_ID,
    GET_SET_CONSUMPTION_BY_ID,
    GET_SET_CONSUMPTION_STYLE_PURCHASE_ORDER_DETAILS,
    IS_CONSUMPTION_DATA_LOADED,
    SIZE_COLOR_SENSE_DATA_ON_PROGRESS,
    UPDATE_CONSUMPTION
} from '../action-types';


export const consumptionDataLoaded = () => ( dispatch, getState ) => {
    const { isConsumptionDataLoaded } = getState().consumptions;
    dispatch( {
        type: IS_CONSUMPTION_DATA_LOADED,
        isConsumptionDataLoaded: !isConsumptionDataLoaded

    } );
};


export const sizeColorDataOnProgress = ( condition ) => dispatch => {
    dispatch( {
        type: SIZE_COLOR_SENSE_DATA_ON_PROGRESS,
        isSizeColorSenseDataOnProgress: condition

    } );
};


export const consumptionPurchaseOrderDetailsDataProgress = ( condition ) => dispatch => {
    dispatch( {
        type: CONSUMPTION_PURCHASE_ORDER_DATA_ON_PROGRESS,
        isConsumptionPurchaseOrderDetailsDataProgress: condition
    } );
};

/// Get All Consumption Without Query
export const getDropDownConsumptions = () => {
    return async ( dispatch ) => {
        await baseAxios
            .get( `${merchandisingApi.consumption.get_consumptions}` )
            .then( ( response ) => {
                dispatch( {
                    type: DROP_DOWN_CONSUMPTIONS,
                    dropDownConsumptions: response.data.map( ( item ) => ( {
                        value: item?.id,
                        label: item?.name
                    } ) )
                } );
            } );
    };
};

//Consumption Query Data
export const getConsumptionByQuery = ( params, queryData ) => async dispatch => {
    dispatch( consumptionDataLoaded() );
    await baseAxios
        .post( `${merchandisingApi.consumption.root}/Grid?${convertQueryString( params )}`, queryData )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_CONSUMPTIONS_BY_QUERY,
                    consumptions: response.data.data,
                    totalPages: response.data.totalRecords,
                    params,
                    queryObj: queryData
                } );
                dispatch( consumptionDataLoaded() );

            }

        } ).catch( ( { response } ) => {
            dispatch( consumptionDataLoaded() );
        } );
};


export const getConsumptionStylePurchaseOrderDetails = (
    buyerId,
    styleId
) => async ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.buyer.root}/${buyerId}/styles/${styleId}/purchaseOrdersAndCostings`;
    if ( styleId ) {
        dispatch( consumptionPurchaseOrderDetailsDataProgress( true ) );
        const { consumptionBasicInfo } = getState().consumptions;
        await baseAxios.get( apiEndPoint )
            .then( ( response ) => {
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_CONSUMPTION_STYLE_PURCHASE_ORDER_DETAILS,
                        consumptionPurchaseOrderDetails: response?.data?.map( ( order ) => ( {
                            ...order,
                            rowId: randomIdGenerator(),
                            isSelected: consumptionBasicInfo?.styleOrderDetails?.some( ( o ) => o.orderId === order.orderId && o.costingId === order.costingId && o.shipmentDate === order.shipmentDate ),
                            isCostingCompleted: order.isCostingCompleted,
                            isAlreadyDone: order.isConsumptionCompleted,
                            //  isConsumptionCompleted: false
                            isConsumptionCompleted: consumptionBasicInfo?.styleOrderDetails?.some( ( o ) => o.orderId === order.orderId && o.costingId === order.costingId && o.shipmentDate === order.shipmentDate ) ? false : order.isConsumptionCompleted
                        } ) )
                    } );
                    dispatch( consumptionPurchaseOrderDetailsDataProgress( false ) );

                }
            } ).catch( ( ( { response } ) => {
                dispatch( consumptionPurchaseOrderDetailsDataProgress( false ) );
                if ( response === undefined || response.status === status.notFound || response.status === status.severError ) {
                    notify( 'error', 'Please contact with Software Developer!' );
                } else {
                    notify( 'error', `${response.data.errors.join( ', ' )}` );
                }


            } ) );
    } else {
        dispatch( {
            type: GET_CONSUMPTION_STYLE_PURCHASE_ORDER_DETAILS,
            consumptionPurchaseOrderDetails: []
        } );
    }
};
export const getConsumptionPackOrderDetails = (
    buyerId,
    styleId
) => async ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.buyer.root}/${buyerId}/styles/${styleId}/packagings/purchaseOrders`;
    if ( styleId ) {
        const { consumptionBasicInfo } = getState().consumptions;
        await baseAxios.get( apiEndPoint ).then( ( response ) => {

            // {
            //     "styleId": "ba225d24-330b-4535-b5b0-506b771f769e",
            //     "orderId": "b0d88a6d-844d-479d-b58e-4aa8a43f5253",
            //      "orderNumber": "PO-SS-20-2",
            //      "shipmentDate": "2022-10-12T00:00:00",
            //       "destination": "Bangladesh"
            // }
            dispatch( {
                type: GET_CONSUMPTION_ORDER_DERAILS,
                consumptionPackOrderDetails: response?.data?.map( ( order ) => ( {
                    ...order,
                    rowId: randomIdGenerator(),
                    isSelected: consumptionBasicInfo?.packOrderDetails?.some( ( o ) => o.orderId === order.orderId && o.costingId === order.costingId && o.shipmentDate === order.shipmentDate )
                    /// isConsumptionCompleted: consumptionBasicInfo?.packOrderDetails?.some( ( o ) => o.orderId === order.orderId && o.costingId === order.costingId && o.shipmentDate === order.shipmentDate ) ? false : order.isConsumptionCompleted
                } ) )
            } );
        } );
    } else {
        dispatch( {
            type: GET_CONSUMPTION_ORDER_DERAILS,
            consumptionPackOrderDetails: []
        } );
    }
};


export const bindConsumptionStylePurchaseOrderDetails = (
    consumptionPurchaseOrderDetails
) => async ( dispatch, getState ) => {
    if ( consumptionPurchaseOrderDetails.length > 0 ) {
        dispatch( {
            type: GET_CONSUMPTION_STYLE_PURCHASE_ORDER_DETAILS,
            consumptionPurchaseOrderDetails
        } );
    } else {
        dispatch( {
            type: GET_CONSUMPTION_STYLE_PURCHASE_ORDER_DETAILS,
            consumptionPurchaseOrderDetails: []
        } );
    }
};
export const bindConsumptionPackOrderDetails = ( consumptionPackOrderDetails ) => async dispatch => {
    if ( consumptionPackOrderDetails.length > 0 ) {
        dispatch( {
            type: GET_CONSUMPTION_ORDER_DERAILS,
            consumptionPackOrderDetails
        } );
    } else {
        dispatch( {
            type: GET_CONSUMPTION_ORDER_DERAILS,
            consumptionPackOrderDetails: []
        } );
    }
};


export const getSetConsumptionStylePurchaseOrderDetails = ( buyerId ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.buyer.root}/${buyerId}/setStyles/purchaseOrdersAndCostings`;
    if ( buyerId ) {
        const { consumptionBasicInfo } = getState().consumptions;
        await baseAxios.get( apiEndPoint ).then( ( response ) => {
            dispatch( {
                type: GET_SET_CONSUMPTION_STYLE_PURCHASE_ORDER_DETAILS,
                setConsumptionStylePurchaseOrderDetails: response?.data?.map(
                    ( order ) => ( {
                        ...order,
                        rowId: randomIdGenerator(),
                        isSelected: consumptionBasicInfo?.styleOrderDetails?.some(
                            ( o ) => o.orderId === order.orderId && o.costingId === order.costingId
                        ),
                        isCostingCompleted: order.isCostingCompleted,
                        isConsumptionCompleted: consumptionBasicInfo?.styleOrderDetails?.some(
                            ( o ) => o.orderId === order.orderId && o.costingId === order.costingId
                        ) ? false : order.isConsumptionCompleted
                    } )
                )
            } );
        } );
    } else {
        dispatch( {
            type: GET_SET_CONSUMPTION_STYLE_PURCHASE_ORDER_DETAILS,
            setConsumptionStylePurchaseOrderDetails: []
        } );
    }
};


export const bindSetConsumptionStylePurchaseOrderDetails = ( setConsumptionStylePurchaseOrderDetails ) => async ( dispatch, getState ) => {
    if ( setConsumptionStylePurchaseOrderDetails.length > 0 ) {
        dispatch( {
            type: GET_SET_CONSUMPTION_STYLE_PURCHASE_ORDER_DETAILS,
            setConsumptionStylePurchaseOrderDetails
        } );
    } else {
        dispatch( {
            type: GET_SET_CONSUMPTION_STYLE_PURCHASE_ORDER_DETAILS,
            setConsumptionStylePurchaseOrderDetails: []
        } );
    }
};


///GET Consumption Packaging Accessories Details
export const getConsumptionPackagingAccessories = ( queryData ) => async ( dispatch, getState ) => {
    const endPoint = `${merchandisingApi.packaging.root}/costingsDetails`;
    await baseAxios.post( endPoint, queryData )
        .then( response => {
            const { consumptionPackagingAccessories } = getState().consumptions;
            const allDetails = consumptionPackagingAccessories.map( detail => detail.details ).flat();


            if ( response.status === status.success ) {
                console.log( 'response.data', JSON.stringify( response.data, null, 2 ) );
                const modifiedPackagingAccessories = _.uniqBy( response.data, 'orderId' ).map( pack => ( {
                    rowId: randomIdGenerator(),
                    orderId: pack.orderId,
                    orderNumber: pack.orderNumber,

                    details: response.data.filter( d => d.orderId === pack.orderId ).map( detail => ( {
                        ...detail,
                        id: 0,
                        rowId: randomIdGenerator(),
                        orderId: detail.orderId,
                        orderNumber: detail.orderNumber,
                        itemGroup: { label: detail.itemGroup, value: detail.itemGroupId },
                        itemGroupId: detail.itemGroupId,
                        itemSubGroup: { label: detail.itemSubGroup, value: detail.itemSubGroupId },
                        itemSubGroupId: detail.itemSubGroupId,
                        itemSubGroupArray: [],
                        itemDescriptionArray: [],
                        itemDescriptionValue: { label: detail.itemDescription, value: detail.itemDescription },
                        itemDescriptionTemplate: detail.itemDescriptionTemplate,
                        wastagePercent: 0,

                        consumptionUom: { label: detail.consumptionUom, value: detail.consumptionUom },
                        consumptionUomArray: [],
                        consumptionUomRelativeFactor: detail.conUomRelativeFactor,
                        // consumptionQuantity: detail.consumptionQuantity,
                        consumptionQuantity: detail.inHouseQuantity,
                        consumptionRatePerUnit: 0,

                        orderUom: { label: detail.consumptionUom, value: detail.consumptionUom },
                        orderUomArray: [],
                        orderUomRelativeFactor: detail.conUomRelativeFactor,

                        currencyCode: { label: 'USD', value: 'USD' },
                        ratePerUnit: 0,
                        purchaseType: { label: 'IMPORT', value: 'IMPORT' },
                        isApproved: false,
                        remarks: 'remarks'
                    } ) )
                } ) );

                const oldPackWithNewPackDetails = modifiedPackagingAccessories.map( order => (
                    {
                        ...order,
                        details: [
                            ...allDetails.filter( n => order.details.filter(
                                d => d.orderId === order.orderId
                            ).some(
                                o => o.itemGroupId === n.itemGroupId
                                    && o.itemSubGroupId === n.itemSubGroupId
                                    && o.itemDescription.trim() === n.itemDescription.trim()
                            ) ),
                            ...order.details.filter( n => !allDetails.filter(
                                d => d.orderId === order.orderId
                            ).some(
                                o => o.itemGroupId === n.itemGroupId
                                    && o.itemSubGroupId === n.itemSubGroupId
                                    && o.itemDescription.trim() === n.itemDescription.trim()
                            ) )
                        ]
                    }
                ) );


                dispatch( {
                    type: GET_CONSUMPTION_PACKAGING_ACCESSORIES_DETAILS,
                    consumptionPackagingAccessories: oldPackWithNewPackDetails
                } );
            }
        } )
        .catch( ( { response } ) => {

        } );
};

export const getPackConsumptionById = ( consumptionId ) => async dispatch => {

    const apiEndPoint = `${merchandisingApi.consumption.root}/packagings/${consumptionId}`;

    await baseAxios.get( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { data } = response;
            const consumptionBasicInfo = {
                ...data,
                id: data?.id,
                consumptionNumber: data?.consumptionNumber,
                buyer: data?.buyerId ? { label: data?.buyerName, value: data?.buyerId } : null,
                style: data?.styleId ? { label: data?.styleNumber, value: data?.styleId } : null,
                isClone: false,


                packOrderDetails: data?.styleOrderDetails.map( ( order ) => ( {
                    ...order,
                    rowId: randomIdGenerator()
                } ) )
            };

            const queryData = data?.styleOrderDetails.map( ( order ) => ( {
                orderId: order.orderId,
                styleId: order.styleId,
                shipmentDate: order.shipmentDate
            } ) );

            const { packagingAccessoriesDetails } = response.data;

            console.log( packagingAccessoriesDetails );

            const consumptionPackagingAccessories = _.uniqBy( packagingAccessoriesDetails, 'orderId' ).map( pack => ( {
                rowId: randomIdGenerator(),
                orderId: pack.orderId,
                orderNumber: pack.orderNumber,
                details: packagingAccessoriesDetails.filter( d => d.orderId === pack.orderId ).map( detail => ( {
                    ...detail,
                    rowId: randomIdGenerator(),
                    orderId: detail.orderId,
                    orderNumber: detail.orderNumber,
                    itemGroup: { label: detail.itemGroup, value: detail.itemGroupId },
                    itemSubGroup: { label: detail.itemSubGroup, value: detail.itemSubGroupId },
                    itemSubGroupArray: [],
                    consumptionUomArray: [],
                    consumptionUom: { label: detail.consumptionUom, value: detail.consumptionUom },
                    itemDescriptionArray: [],
                    itemSegments: [],
                    itemDescriptionValue: { label: detail.itemDescription, value: detail.itemDescription },
                    itemDescriptionTemplate: detail.itemDescriptionTemplate,
                    wastagePercent: detail.wastagePercent,
                    consumptionPerGarmentUomArray: [],
                    consumptionPerGarment: detail.consumptionPerGarment,
                    consumptionPerGarmentUom: { label: detail.consumptionPerGarmentUom, value: detail.consumptionPerGarmentUom },
                    consumptionUomRelativeFactor: detail.consumptionUomRelativeFactor,
                    consumptionPerGarmentRelativeFactor: detail.consumptionPerGarmentRelativeFactor,
                    consumptionQuantity: detail.consumptionQuantity,
                    //consumptionRatePerUnit: 0,
                    orderUom: detail.orderUOM ? { label: detail.orderUOM, value: detail.orderUOM } : null,
                    orderUomArray: [],
                    orderUomRelativeFactor: detail.orderUomRelativeFactor,
                    currencyCode: detail.currencyCode ? { label: detail.currencyCode, value: detail.currencyCode } : null,
                    ratePerUnit: detail.ratePerUnit,
                    purchaseType: detail.purchaseType ? { label: detail.purchaseType, value: detail.purchaseType } : null,
                    isApproved: detail.isApproved,

                    remarks: detail?.remarks ?? '',
                    inHouseQuantity: 0, //Optional
                    inHouseRatePerUnit: 0 //Optional,,

                } ) )
            } ) );

            dispatch( {
                type: GET_PACK_CONSUMPTION_BY_ID,
                consumptionBasicInfo: response.data ? consumptionBasicInfo : null,
                consumptionPackagingAccessories
            } );

            dispatch( getConsumptionPackagingAccessories( queryData ) );
        }
    } );

};

///After Run On Change Any Data of Consumption Packaging Accessories Details
export const bindConsumptionPackagingAccessories = ( consumptionPackagingAccessories ) => async ( dispatch, getState ) => {
    if ( consumptionPackagingAccessories.length > 0 ) {
        dispatch( {
            type: GET_CONSUMPTION_PACKAGING_ACCESSORIES_DETAILS,
            consumptionPackagingAccessories
        } );
    } else {
        dispatch( {
            type: GET_CONSUMPTION_PACKAGING_ACCESSORIES_DETAILS,
            consumptionPackagingAccessories: []
        } );
    }
};

///GET Consumption For Set
export const getCostingInfoForSetConsumption = ( orderId, setStyleIds ) => async (
    dispatch
) => {
    if ( orderId ) {
        let endPoint = '';
        if ( setStyleIds ) {
            const styleIds = setStyleIds?.map( ( i ) => i?.value )?.toString();
            endPoint = `${merchandisingApi.consumption.root}/purchaseOrder/${orderId}/setStyle/costingDetails?setStyleIds=${styleIds}`;
        } else {
            endPoint = `${merchandisingApi.consumption.root}/purchaseOrder/${orderId}/setStyle/costingDetails`;
        }
        await baseAxios
            .get( endPoint )
            .then( ( response ) => {
                const { accessoriesDetails } = response.data;
                const modifiedAccessoriesDetails = accessoriesDetails.map( ( i ) => ( {
                    fieldId: randomIdGenerator(),
                    detailId: 0,
                    costingGroupType: i.costingGroupType,
                    // consumptionId: "",
                    itemGroup: { value: i.itemGroupId, label: i.itemGroupName },
                    itemGroupId: i.itemGroupId,
                    itemSubGroupId: i.itemSubGroupId,
                    itemSubGroup: { value: i.itemSubGroupId, label: i.itemSubGroupName },
                    itemSubGroupArray: [], //Extra
                    itemDescriptionArray: [],
                    itemDescriptionValue: i.itemDescription ? { label: i.itemDescription, value: i.itemDescription } : null,
                    itemDescriptionTemplate: i.itemDescriptionTemplate,
                    itemDescription: i.itemDescription === null ? '' : i.itemDescription,
                    consumptionQuantity: i.consumptionQuantity,
                    consumptionUom: i.consumptionUom,
                    consumptionUomValue: i.consumptionUom ? { label: i.consumptionUom, value: i.consumptionUom } : null,
                    wastagePercent: i.wastagePercent,
                    consumptionPerGarment: 0,
                    consumptionPerGarmentUomValue: null, // Extra
                    consumptionPerGarmentUom: '',
                    consumptionUomRelativeFactor: i.consumptionUomRelativeFactor,
                    consumptionPerGarmentRelativeFactor: 0,
                    orderUOMValue: i.orderUom ? { value: i.orderUom, label: i.orderUom } : null, ///Extra
                    orderUOM: i.orderUom,
                    currencyValue: null, //Extra
                    currencyCode: '',
                    // ratePerUnit: i.ratePerUnit,
                    ratePerUnit: i.consumptionRatePerUnit,
                    purchaseTypeValue: null, //Extra
                    purchaseType: '',
                    isBuyerSupplied: i.isBuyerSupplied,
                    preferredSupplierValue: null,
                    preferredSupplier: '',
                    remarks: '',
                    statusValue: null,
                    status: '',
                    isApproved: false,
                    colorSensitivityType: 3,
                    sizeSensitivityType: 3,
                    colorSensitivities: null,
                    sizeSensitivities: null
                } ) );
                dispatch( {
                    type: GET_COSTING_HISTORY_FOR_CONSUMPTION,
                    consumptionAccessoriesDetails: modifiedAccessoriesDetails,
                    consumptionFabricDetails: []
                } );
            } )
            .catch( ( { response } ) => {
                if ( response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'error', `${response.data.errors.join( ', ' )}` );
                }
                return Promise.resolve();
            } );
    }

    // dispatch( {
    //     type: GET_COSTING_HISTORY_FOR_CONSUMPTION,
    //     consumptionAccessoriesDetails: [],
    //     consumptionFabricDetails: []
    // } );
};

export const getConsumptionPurchaseOrderColorsAndSizes = ( queryData ) => async ( dispatch ) => {
    const colorEndPoint = `${merchandisingApi.costing.root}/colors`;
    const sizeEndPoint = `${merchandisingApi.costing.root}/sizeGroups/sizes`;
    await baseAxios.post( colorEndPoint, queryData ).then( ( response ) => {
        const consumptionPurchaseOrderColors = response?.data.map( ( c ) => ( {
            randomGenerateId: randomIdGenerator(),
            colorId: c.id,
            colorName: c.name,
            isSelected: true
        } ) );
        dispatch( {
            type: GET_CONSUMPTION_PURCHASE_ORDER_COLORS,
            consumptionPurchaseOrderColors
        } );
    } );
    await baseAxios.post( sizeEndPoint, queryData ).then( ( response ) => {

        const consumptionPurchaseOrderSizes = response?.data.map( ( s ) => ( {
            randomGenerateId: randomIdGenerator(),
            sizeGroupId: s.sizeGroupId,
            sizeGroup: s.sizeGroup,
            sizeId: s.sizeId,
            sizeName: s.name,
            position: s.position,
            isSelected: true
        } ) );
        dispatch( {
            type: GET_CONSUMPTION_PURCHASE_ORDER_SIZES,
            consumptionPurchaseOrderSizes
        } );
    } );
};

//GET Consumption by Id
export const getCostingInfoForConsumption = ( queryData ) => async ( dispatch, getState ) => {
    dispatch( consumptionDataLoaded() );
    if ( queryData.length > 0 ) {
        const endPoint = `${merchandisingApi.style.root}/costingsDetails`;

        dispatch( getConsumptionPurchaseOrderColorsAndSizes( queryData ) );
        const { consumptionAccessoriesDetails, consumptionFabricDetails } = getState().consumptions;
        const { defaultUOMDropdown } = getState().unitSets;
        const defaultUOMSet = defaultUOMDropdown?.find( uom => uom?.isBaseUnit === true );


        await baseAxios.post( endPoint, queryData ).then( ( response ) => {
            const { accessoriesDetails, fabricDetails } = response.data;
            console.log( 'fabricDetails', fabricDetails );

            const modifiedAccessoriesDetails = accessoriesDetails.map( ( i ) => ( {
                fieldId: randomIdGenerator(),
                detailId: 0,
                costingGroupType: i.costingGroupType,
                // consumptionId: "",
                itemGroup: { value: i.itemGroupId, label: i.itemGroupName },
                itemGroupId: i.itemGroupId,
                itemSubGroupId: i.itemSubGroupId,
                itemSubGroup: { value: i.itemSubGroupId, label: i.itemSubGroupName },
                itemSubGroupArray: [], //Extra
                itemDescriptionArray: [],
                itemDescriptionValue: i.itemDescription ? { label: i.itemDescription, value: i.itemDescription } : null,
                itemDescriptionTemplate: i.itemDescriptionTemplate,
                itemDescription: i.itemDescription === null ? '' : i.itemDescription,
                consumptionQuantity: i.consumptionQuantity,
                defaultUomSetId: null,

                consumptionUomArray: [],
                consumptionUomValue: i.consumptionUom ? { label: i.consumptionUom, value: i.consumptionUom } : null,
                consumptionUom: i.consumptionUom ?? '',
                consumptionUomRelativeFactor: i?.consumptionUomRelativeFactor ?? 0,

                wastagePercent: i.wastagePercent,

                // consumptionPerGarment: 1,
                // perGarmentUom: "PC",
                // perGarmentRelativeFactor: 1,

                consumptionPerGarment: i.consumptionPerGarment,
                consumptionPerGarmentUomValue: { label: i.perGarmentUom, value: i.perGarmentUom },
                consumptionPerGarmentUom: i?.perGarmentUom,
                consumptionPerGarmentRelativeFactor: i?.perGarmentRelativeFactor,

                orderUomArray: [],
                orderUomRelativeFactor: i?.consumptionUomRelativeFactor ?? 0,

                baseRate: i.ratePerUnit / i.consumptionUomRelativeFactor,

                orderUOMValue: i.consumptionUom ? { label: i.consumptionUom, value: i.consumptionUom } : null,
                orderUOM: i.consumptionUom ?? '',

                currencyValue: { label: "USD", value: 'USD' }, //Extra
                currencyCode: 'USD',
                ratePerUnit: i.ratePerUnit,
                purchaseTypeValue: { label: "IMPORT", value: 'IMPORT' }, //Extra
                purchaseType: 'IMPORT',
                isBuyerSupplied: false,
                preferredSupplierValue: null,
                preferredSupplier: '',
                isBomOnShipmentQty: i?.isBomOnShipmentQty ?? true,
                remarks: i?.remarks ?? '',
                statusValue: null,
                garmentPart: i?.garmentPart ? { label: i.garmentPart, value: i.garmentPart } : null,
                hasAnyColorSensitivity: i.hasAnyColorSensitivity,
                hasAnySizeSensitivity: i.hasAnySizeSensitivity,
                status: '',
                isApproved: false,
                isAllDestinationApplicable: true,
                applicableDestinations: [],
                colorSensitivityType: 3,
                sizeSensitivityType: 3,
                colorSensitivities: [],
                sizeSensitivities: [],
                consumptionPurchaseOrderSizes: [],
                consumptionPurchaseOrderColors: [],
                isAllSizeApplicable: true,
                isAllColorApplicable: true,
                applicableColorIds: [],
                applicableSizeIds: [],
                applicableSizes: [],
                applicableColors: [],
                itemSegments: [],
                expanded: false,
                isNew: false,
                isRestrictedToChange: false,
                approvedById: null,
                approvedBy: null,
                isApprovedStatus: false,
                isEdit: false,
                isSensibilityAlreadyLoadedOnRow: true,
                isRowEditableState: false
            } ) );
            const modifiedFabricDetails = fabricDetails.map( ( i ) => ( {
                fieldId: randomIdGenerator(),
                detailId: 0,
                costingGroupType: i.costingGroupType,
                // consumptionId: "",
                itemGroup: { value: i.itemGroupId, label: i.itemGroupName },
                itemGroupId: i.itemGroupId,
                itemSubGroup: { value: i.itemSubGroupId, label: i.itemSubGroupName },
                itemSubGroupArray: [], //Extra
                itemSubGroupId: i.itemSubGroupId,
                itemDescriptionArray: [],
                itemDescriptionValue: i.itemDescription ? { label: i.itemDescription, value: i.itemDescription } : null,
                itemDescriptionTemplate: i.itemDescriptionTemplate,
                itemDescription: i.itemDescription === null ? '' : i.itemDescription,
                consumptionQuantity: i.consumptionQuantity,
                defaultUomSetId: null,

                consumptionUomArray: [],
                consumptionUomValue: i.consumptionUom ? { label: i.consumptionUom, value: i.consumptionUom } : null,
                consumptionUom: i.consumptionUom ?? '',
                consumptionUomRelativeFactor: i?.consumptionUomRelativeFactor ?? 0,

                wastagePercent: i.wastagePercent,

                // consumptionPerGarment: 1,
                // consumptionPerGarmentUomValue: defaultUOMSet ? { label: defaultUOMSet.label, value: defaultUOMSet.label } : null, // Extra
                // consumptionPerGarmentUom: defaultUOMSet?.label,
                // consumptionPerGarmentRelativeFactor: defaultUOMSet?.relativeFactor,
                consumptionPerGarment: i.consumptionPerGarment,
                consumptionPerGarmentUomValue: { label: i.perGarmentUom, value: i.perGarmentUom },
                consumptionPerGarmentUom: i?.perGarmentUom,
                consumptionPerGarmentRelativeFactor: i?.perGarmentRelativeFactor,

                orderUomArray: [],
                orderUomRelativeFactor: i?.consumptionUomRelativeFactor ?? 0,

                baseRate: i.ratePerUnit / i.consumptionUomRelativeFactor,

                orderUOMValue: i.consumptionUom ? { label: i.consumptionUom, value: i.consumptionUom } : null,
                orderUOM: i.consumptionUom ?? '',

                currencyValue: { label: "USD", value: 'USD' }, //Extra
                currencyCode: 'USD',

                ratePerUnit: i.ratePerUnit,

                purchaseTypeValue: { label: "IMPORT", value: 'IMPORT' }, //Extra
                purchaseType: 'IMPORT',
                isBuyerSupplied: false,
                preferredSupplierValue: null,
                preferredSupplier: '',
                isBomOnShipmentQty: i?.isBomOnShipmentQty ?? true,
                remarks: i?.remarks ?? '',
                statusValue: null,
                garmentPart: i?.garmentPart ? { label: i.garmentPart, value: i.garmentPart } : null,
                hasAnyColorSensitivity: i.hasAnyColorSensitivity,
                hasAnySizeSensitivity: i.hasAnySizeSensitivity,
                status: '',
                isApproved: false,
                isAllDestinationApplicable: true,
                applicableDestinations: [],
                colorSensitivityType: 3,
                sizeSensitivityType: 3,
                colorSensitivities: [],
                sizeSensitivities: [],
                consumptionPurchaseOrderSizes: [],
                consumptionPurchaseOrderColors: [],
                applicableColorIds: [],
                applicableSizeIds: [],
                isAllSizeApplicable: true,
                isAllColorApplicable: true,
                applicableSizes: [],
                applicableColors: [],
                itemSegments: [],
                expanded: false,
                isNew: false,
                isRestrictedToChange: false,
                approvedById: null,
                approvedBy: null,
                isApprovedStatus: false,
                isEdit: false,
                isSensibilityAlreadyLoadedOnRow: true,
                isRowEditableState: false


            } ) );


            /// item check Consumption Exiting item with Costing item by itemTemplate
            const isTemplateSame = ( oldTemplate, newTemplate ) => {
                const oldTemplateArray = oldTemplate ? JSON.parse( oldTemplate ) : [];
                const newTemplateArray = newTemplate ? JSON.parse( newTemplate ) : [];

                const isSameFilter = oldTemplateArray.filter( o => newTemplateArray.some( n => n.value.length && o.name === n.name ) );

                const isSame = isSameFilter.every( o => newTemplateArray.some( n => o.value === n.value && o.name === n.name ) );
                return isSame;
            };


            ///For Accessories Details
            const sameAccessories = consumptionAccessoriesDetails.filter( n => modifiedAccessoriesDetails.some( o => o.itemGroupId === n.itemGroupId &&
                o.itemSubGroupId === n.itemSubGroupId

            ) );

            const exitingAccessories = consumptionAccessoriesDetails.filter( n => !modifiedAccessoriesDetails.some( o => o.itemGroupId === n.itemGroupId &&
                o.itemSubGroupId === n.itemSubGroupId


            ) );

            const deferentAccessories = modifiedAccessoriesDetails.filter( n => !consumptionAccessoriesDetails.some( o => o.itemGroupId === n.itemGroupId &&
                o.itemSubGroupId === n.itemSubGroupId

            ) );

            ///For Fabric Details
            const sameFabrics = consumptionFabricDetails.filter( n => modifiedFabricDetails.some( o => o.itemGroupId === n.itemGroupId &&
                o.itemSubGroupId === n.itemSubGroupId &&
                isTemplateSame( o.itemDescriptionTemplate, n.itemDescriptionTemplate )

            ) );

            const exitingFabrics = consumptionFabricDetails.filter( n => !modifiedFabricDetails.some( o => o.itemGroupId === n.itemGroupId &&
                o.itemSubGroupId === n.itemSubGroupId &&
                isTemplateSame( o.itemDescriptionTemplate, n.itemDescriptionTemplate )

            ) );

            const deferentFabrics = modifiedFabricDetails.filter( n => !consumptionFabricDetails.some( o => o.itemGroupId === n.itemGroupId &&
                o.itemSubGroupId === n.itemSubGroupId &&
                isTemplateSame( o.itemDescriptionTemplate, n.itemDescriptionTemplate )

            ) );


            const existingSortedFabric = _.orderBy( [...exitingFabrics, ...sameFabrics], ['detailId'], ['asc'] );
            const existingSortedAccessories = _.orderBy( [...exitingAccessories, ...sameAccessories], ['detailId'], ['asc'] );

            dispatch( {
                type: GET_COSTING_HISTORY_FOR_CONSUMPTION,
                consumptionAccessoriesDetails: [...existingSortedAccessories, ...deferentAccessories],
                // consumptionFabricDetails: [...exitingFabrics, ...sameFabrics, ...deferentFabrics]
                consumptionFabricDetails: [...existingSortedFabric, ...deferentFabrics]
            } );
            dispatch( consumptionDataLoaded() );

        } );
    } else {
        dispatch( consumptionDataLoaded() );
        dispatch( {
            type: GET_COSTING_HISTORY_FOR_CONSUMPTION,
            consumptionAccessoriesDetails: [],
            consumptionFabricDetails: []
        } );
    }
};
export const getSetCostingInfoForConsumption = ( queryData ) => async (
    dispatch,
    getState
) => {
    if ( queryData.length > 0 ) {
        const endPoint = `${merchandisingApi.setStyle.root}/costingDetails`;
        await baseAxios.post( endPoint, queryData ).then( ( response ) => {
            const { accessoriesDetails } = response.data;
            const { consumptionAccessoriesDetails } = getState().consumptions;

            const modifiedAccessoriesDetails = accessoriesDetails.map( ( i ) => ( {
                fieldId: randomIdGenerator(),
                detailId: 0,
                costingGroupType: i.costingGroupType,
                // consumptionId: "",
                itemGroup: { value: i.itemGroupId, label: i.itemGroupName },
                itemGroupId: i.itemGroupId,
                itemSubGroupId: i.itemSubGroupId,
                itemSubGroup: { value: i.itemSubGroupId, label: i.itemSubGroupName },
                itemSubGroupArray: [], //Extra
                itemDescriptionArray: [],
                itemDescriptionValue: i.itemDescription ? { label: i.itemDescription, value: i.itemDescription } : null,
                itemDescriptionTemplate: i.itemDescriptionTemplate,
                itemDescription: i.itemDescription === null ? '' : i.itemDescription,
                consumptionQuantity: i.consumptionQuantity,
                defaultUomSetId: null,
                orderUomArray: [],
                consumptionUomArray: [],
                // consumptionUomValue: i.consumptionUom ? { label: i.consumptionUom, value: i.consumptionUom } : null,
                consumptionUomValue: null,
                // consumptionUom: i.consumptionUOM,
                consumptionUom: '',
                wastagePercent: i.wastagePercent,
                consumptionPerGarment: 1,
                consumptionPerGarmentUomValue: null, // Extra
                consumptionPerGarmentUom: '',
                consumptionPerGarmentRelativeFactor: 0,
                // orderUOMValue: i.orderUom ? { value: i.orderUom, label: i.orderUom } : null, ///Extra
                orderUOMValue: null, ///Extra
                // orderUOM: i.orderUom,
                orderUOM: '',
                consumptionUomRelativeFactor: i?.consumptionUomRelativeFactor ?? 0,
                orderUomRelativeFactor: i?.orderUomRelativeFactor ?? 0,
                currencyValue: null, //Extra
                currencyCode: '',
                // ratePerUnit: i.ratePerUnit,
                ratePerUnit: 0,
                purchaseTypeValue: null, //Extra
                purchaseType: '',
                isBuyerSupplied: i.isBuyerSupplied,
                preferredSupplierValue: null,
                preferredSupplier: '',
                remarks: '',
                statusValue: null,
                status: '',
                isApproved: false,
                colorSensitivityType: 3,
                sizeSensitivityType: 3,
                colorSensitivities: null,
                sizeSensitivities: null
            } ) );

            ///For Accessories Details
            const sameAccessories = consumptionAccessoriesDetails.filter( n => modifiedAccessoriesDetails.some( o => o.itemGroupId === n.itemGroupId && o.itemSubGroupId === n.itemSubGroupId ) );

            const deferentAccessories = modifiedAccessoriesDetails.filter( n => !consumptionAccessoriesDetails.some( o => o.itemGroupId === n.itemGroupId && o.itemSubGroupId === n.itemSubGroupId ) );

            dispatch( {
                type: GET_COSTING_HISTORY_FOR_CONSUMPTION,
                consumptionAccessoriesDetails: [...sameAccessories, ...deferentAccessories],
                consumptionFabricDetails: []
            } );
        } );
    } else {
        dispatch( {
            type: GET_COSTING_HISTORY_FOR_CONSUMPTION,
            consumptionAccessoriesDetails: [],
            consumptionFabricDetails: []
        } );
    }
};

//GET Consumption by Id
export const getConsumptionById = ( id ) => async ( dispatch ) => {
    dispatch( consumptionDataLoaded() );

    if ( id ) {
        await baseAxios
            .get( `${merchandisingApi.consumption.root}/${id}` )
            .then( response => {
                if ( response.status === status.success ) {
                    const { data } = response;

                    const consumptionBasicInfo = {
                        ...data,
                        id: data?.id,
                        consumptionNumber: data?.consumptionNumber,
                        buyer: data?.buyerId ? { label: data?.buyerName, value: data?.buyerId } : null,
                        style: data?.styleId ? { label: data?.styleNumber, value: data?.styleId } : null,
                        isClone: false,
                        dataAlreadyLoaded: true,


                        styleOrderDetails: data?.styleOrderDetails.map( ( order ) => ( {
                            ...order,
                            rowId: randomIdGenerator(),
                            costingNumber: order.styleCostingNumber,
                            costingId: order.styleCostingId
                        } ) )
                    };

                    const queryData = data?.styleOrderDetails.map( ( order ) => ( {
                        orderId: order.orderId,
                        setStyleId: order.setStyleId,
                        styleId: order.styleId,
                        costingId: order.styleCostingId,
                        shipmentDate: order.shipmentDate
                    } ) );


                    ///For Color and Size
                    dispatch( getConsumptionPurchaseOrderColorsAndSizes( queryData ) );
                    //End Color and Size


                    const { accessoriesDetails, fabricDetails } = response.data;


                    const modifiedAccessoriesDetails = accessoriesDetails.map( ( i ) => ( {
                        ...i,
                        fieldId: randomIdGenerator(),
                        detailId: i.id,
                        costingGroupType: i.costingGroupType,
                        itemGroup: { value: i.itemGroupId, label: i.itemGroup },
                        itemGroupId: i.itemGroupId,
                        itemSubGroupId: i.itemSubGroupId,
                        itemSubGroup: { value: i.itemSubGroupId, label: i.itemSubGroup },
                        itemSubGroupArray: [], //Extra
                        consumptionUomArray: [],
                        itemDescriptionArray: [],
                        itemDescriptionValue: i.itemDescription ? { label: i.itemDescription, value: i.itemDescription } : null,
                        itemDescriptionTemplate: i.itemDescriptionTemplate,
                        itemDescription: i.itemDescription === null ? '' : i.itemDescription,
                        consumptionQuantity: i.consumptionQuantity,
                        consumptionUomValue: {
                            value: i?.consumptionUom,
                            label: i?.consumptionUom
                        },
                        orderUomArray: [],

                        consumptionUom: i.consumptionUom,
                        wastagePercent: i.wastagePercent,
                        consumptionPerGarment: i.consumptionPerGarment,
                        consumptionPerGarmentUomValue: i.consumptionPerGarmentUom ? {
                            label: i.consumptionPerGarmentUom,
                            value: i.consumptionPerGarmentUom
                        } : null, // Extra
                        consumptionPerGarmentUomArray: [],
                        consumptionPerGarmentUom: i.consumptionPerGarmentUom,
                        consumptionPerGarmentRelativeFactor:
                            i.consumptionPerGarmentRelativeFactor,
                        orderUOMValue: i.orderUOM ? { value: i.orderUOM, label: i.orderUOM } : null, ///Extra
                        orderUOM: i.orderUOM,
                        consumptionUomRelativeFactor: i?.consumptionUomRelativeFactor,
                        orderUomRelativeFactor: i?.orderUomRelativeFactor,
                        currencyValue: { label: i.currencyCode, value: i.currencyCode }, //Extra
                        currencyCode: i.currencyCode,
                        ratePerUnit: i.ratePerUnit,

                        baseRate: i.ratePerUnit / i.orderUomRelativeFactor,

                        purchaseTypeValue: { label: i.purchaseType, value: i.purchaseType }, //Extra
                        purchaseType: i.purchaseType,
                        isBuyerSupplied: i.isBuyerSupplied,
                        preferredSupplierValue: i.supplier ? { value: i.supplierId, label: i.supplier } : null,
                        preferredSupplier: i.preferredSupplier,
                        isBomOnShipmentQty: i.isBomOnShipmentQty,
                        remarks: i?.remarks ?? '',
                        statusValue: { label: i.status, value: i.status },
                        garmentPart: i?.garmentPart ? { label: i.garmentPart, value: i.garmentPart } : null,

                        status: i.status,
                        isAllDestinationApplicable: i.isAllDestinationApplicable,
                        applicableDestinations: i.applicableDestinations,
                        colorSensitivityType: i.colorSensitivityType,
                        sizeSensitivityType: i.sizeSensitivityType,
                        colorSensitivities: i.colorSensitivity,
                        sizeSensitivities: i.sizeSensitivity,
                        isAllColorApplicable: i.isAllColorApplicable,
                        isAllSizeApplicable: i.isAllSizeApplicable,

                        applicableColorIds: i.applicableColorIds,
                        applicableSizeIds: i.applicableSizeIds,

                        applicableColors: i.applicableColors ?? [],
                        applicableSizes: i.applicableSizes,

                        consumptionPurchaseOrderSizes: [],
                        consumptionPurchaseOrderColors: [],
                        itemSegments: [],

                        isRestrictedToChange: i.isRestrictedToChange,
                        isApproved: i.isApproved,
                        isApprovedStatus: i.isApproved,
                        hasAnyColorSensitivity: i.hasAnyColorSensitivity,
                        hasAnySizeSensitivity: i.hasAnySizeSensitivity,
                        expanded: false,
                        isNew: false,
                        isEdit: false,
                        isSensibilityAlreadyLoadedOnRow: false,
                        isRowEditableState: false

                    } ) );
                    const modifiedFabricDetails = fabricDetails.map( ( i ) => ( {
                        ...i,
                        fieldId: randomIdGenerator(),
                        detailId: i?.id,
                        costingGroupType: i.costingGroupType,
                        // consumptionId: "",
                        itemGroup: { value: i.itemGroupId, label: i.itemGroup },
                        itemGroupId: i.itemGroupId,
                        itemSubGroup: { value: i.itemSubGroupId, label: i.itemSubGroup },
                        itemSubGroupArray: [], //Extra
                        itemSubGroupId: i.itemSubGroupId,
                        consumptionUomArray: [],
                        itemDescriptionArray: [],
                        itemDescriptionValue: i.itemDescription ? { label: i.itemDescription, value: i.itemDescription } : null,
                        itemDescriptionTemplate: i.itemDescriptionTemplate,
                        itemDescription: i.itemDescription === null ? '' : i.itemDescription,
                        consumptionQuantity: i.consumptionQuantity,
                        consumptionUom: i.consumptionUom,
                        consumptionUomValue: i.consumptionUom ? { value: i?.consumptionUom, label: i?.consumptionUom } : null,
                        wastagePercent: i.wastagePercent,
                        consumptionPerGarment: i.consumptionPerGarment,
                        consumptionPerGarmentUomValue: i.consumptionPerGarmentUom ? {
                            label: i.consumptionPerGarmentUom,
                            value: i.consumptionPerGarmentUom
                        } : null, // Extra
                        consumptionUomRelativeFactor: i?.consumptionUomRelativeFactor ?? 0,
                        orderUomArray: [],

                        orderUomRelativeFactor: i?.orderUomRelativeFactor ?? 0,
                        consumptionPerGarmentUom: i.consumptionPerGarmentUom,
                        consumptionPerGarmentRelativeFactor:
                            i.consumptionPerGarmentRelativeFactor,
                        orderUOMValue: i.orderUOM ? { value: i.orderUOM, label: i.orderUOM } : null, ///Extra
                        orderUOM: i.orderUOM,
                        currencyValue: { label: i.currencyCode, value: i.currencyCode }, //Extra
                        currencyCode: i.currencyCode,
                        ratePerUnit: i.ratePerUnit,

                        baseRate: i.ratePerUnit / i.orderUomRelativeFactor,

                        purchaseTypeValue: { label: i.purchaseType, value: i.purchaseType }, //Extra
                        purchaseType: i.purchaseType,
                        isBuyerSupplied: i.isBuyerSupplied,
                        preferredSupplierValue: i.supplier ? { value: i.supplierId, label: i.supplier } : null,
                        preferredSupplier: '',
                        isBomOnShipmentQty: i.isBomOnShipmentQty,
                        remarks: i?.remarks ?? '',
                        statusValue: { label: i.status, value: i.status },
                        garmentPart: i?.garmentPart ? { label: i.garmentPart, value: i.garmentPart } : null,

                        status: i.status,
                        isAllDestinationApplicable: i.isAllDestinationApplicable,
                        applicableDestinations: i.applicableDestinations,

                        colorSensitivityType: i.colorSensitivityType,
                        sizeSensitivityType: i.sizeSensitivityType,
                        colorSensitivities: i.colorSensitivity,
                        sizeSensitivities: i.sizeSensitivity,
                        isAllColorApplicable: i.isAllColorApplicable,
                        isAllSizeApplicable: i.isAllSizeApplicable,

                        applicableColorIds: i.applicableColorIds,
                        applicableSizeIds: i.applicableSizeIds,

                        applicableColors: i.applicableColors,
                        applicableSizes: i.applicableSizes,

                        consumptionPurchaseOrderSizes: [],
                        consumptionPurchaseOrderColors: [],
                        itemSegments: [],

                        isRestrictedToChange: i.isRestrictedToChange,
                        isApproved: i.isApproved,
                        isApprovedStatus: i.isApproved,

                        hasAnyColorSensitivity: i.hasAnyColorSensitivity,
                        hasAnySizeSensitivity: i.hasAnySizeSensitivity,
                        isEdit: false,
                        isSensibilityAlreadyLoadedOnRow: false,
                        expanded: false,
                        isNew: false,
                        isRowEditableState: false

                    } ) );
                    dispatch( {
                        type: GET_CONSUMPTION_BY_ID,
                        consumptionBasicInfo,
                        consumptionFabricDetails: modifiedFabricDetails,
                        consumptionAccessoriesDetails: modifiedAccessoriesDetails,
                        consumptionPackagingAccessories: []
                    } );

                    ///For Fabric , Accessories and Pack Accessories Data If Change Costing
                    if ( queryData.length ) {
                        dispatch( getCostingInfoForConsumption( queryData ) );
                    }
                    /// dispatch( getConsumptionPackagingAccessories( queryData ) );
                    ///For
                    dispatch( consumptionDataLoaded() );

                }
            } ).catch( ( ( { response } ) => {
                dispatch( consumptionDataLoaded() );
                if ( response.status === status.badRequest ) {
                    notify( 'errors', response.data.errors );
                }
                if ( response.status === status.notFound || response.status === status.severError ) {
                    notify( 'error', 'Please contact the Support Team!' );
                }
                if ( response.status === status.conflict ) {

                    notify( 'warning', `${response.data.detail}` );
                }
            } ) );
    } else {
        dispatch( consumptionDataLoaded() );
        dispatch( {
            type: GET_CONSUMPTION_BY_ID,
            selectedConsumption: null,
            consumptionFabricDetails: [],
            consumptionAccessoriesDetails: []
        } );
    }
};
export const getSetConsumptionById = ( id ) => async ( dispatch ) => {
    if ( id ) {
        await baseAxios
            .get( `${merchandisingApi.consumption.root}/setConsumption/${id}` )
            .then( ( response ) => {
                const { data } = response;

                const consumptionBasicInfo = {
                    id: data.id,
                    buyer: { value: data.buyerId, label: data.buyerName },
                    consumptionNumber: data.consumptionNumber,
                    isConsumptionNumberInput: false,
                    styleOrderDetails: data?.setStylesDetails.map( ( order ) => ( {
                        ...order,
                        rowId: randomIdGenerator(),
                        costingNumber: order.styleCostingNumber,
                        costingId: order.styleCostingId
                    } ) )
                };

                const { accessoriesDetails, packagingAccessoriesDetails } = response.data;


                const consumptionPackagingAccessories = _.uniqBy( packagingAccessoriesDetails, 'orderId' ).map( pack => ( {
                    rowId: randomIdGenerator(),
                    orderId: pack.orderId,
                    orderNumber: pack.orderNumber,
                    details: packagingAccessoriesDetails.filter( d => d.orderId === pack.orderId ).map( detail => ( {
                        ...detail,
                        rowId: randomIdGenerator(),
                        orderId: detail.orderId,
                        orderNumber: detail.orderNumber,
                        itemGroup: { label: detail.itemGroup, value: detail.itemGroupId },
                        itemSubGroup: { label: detail.itemSubGroup, value: detail.itemSubGroupId },
                        itemSubGroupArray: [],
                        consumptionUomArray: [],
                        consumptionUom: { label: detail.consumptionUom, value: detail.consumptionUom },
                        itemDescriptionArray: [],
                        itemDescriptionValue: { label: detail.itemDescription, value: detail.itemDescription },
                        itemDescriptionTemplate: detail.itemDescriptionTemplate,
                        wastagePercent: detail.wastagePercent,
                        consumptionPerGarment: detail.consumptionPerGarment,
                        consumptionPerGarmentUom: { label: detail.consumptionPerGarmentUom, value: detail.consumptionPerGarmentUom },
                        consumptionUomRelativeFactor: detail.consumptionUomRelativeFactor,
                        consumptionPerGarmentRelativeFactor: detail.consumptionPerGarmentRelativeFactor,
                        consumptionQuantity: detail.consumptionQuantity,
                        //consumptionRatePerUnit: 0,
                        orderUom: { label: detail.orderUOM, value: detail.orderUOM },
                        orderUomArray: [],
                        orderUomRelativeFactor: detail.orderUomRelativeFactor,
                        currencyCode: { label: detail.currencyCode, value: detail.currencyCode },
                        ratePerUnit: detail.ratePerUnit,
                        purchaseType: { label: detail.purchaseType, value: detail.purchaseType },
                        isApproved: detail.isApproved,
                        remarks: 'remarks',
                        inHouseQuantity: 0, //Optional
                        inHouseRatePerUnit: 0 //Optional
                    } ) )
                } ) );

                const modifiedAccessoriesDetails = accessoriesDetails.map( ( i ) => ( {
                    fieldId: randomIdGenerator(),
                    detailId: i.id,
                    costingGroupType: i.costingGroupType,
                    itemGroup: { value: i.itemGroupId, label: i.itemGroup },
                    itemGroupId: i.itemGroupId,
                    itemSubGroupId: i.itemSubGroupId,
                    itemSubGroup: { value: i.itemSubGroupId, label: i.itemSubGroup },
                    itemSubGroupArray: [], //Extra
                    itemDescriptionArray: [],
                    itemDescriptionValue: i.itemDescription ? { label: i.itemDescription, value: i.itemDescription } : null,
                    itemDescriptionTemplate: i.itemDescriptionTemplate,
                    itemDescription: i.itemDescription === null ? '' : i.itemDescription,
                    defaultUomSetId: null,
                    consumptionUomArray: [],
                    consumptionQuantity: i.consumptionQuantity,
                    consumptionUomValue: {
                        value: i?.consumptionUom,
                        label: i?.consumptionUom
                    },
                    consumptionUom: i.consumptionUom,
                    wastagePercent: i.wastagePercent,
                    consumptionPerGarment: i.consumptionPerGarment,
                    consumptionUomRelativeFactor: i.consumptionUomRelativeFactor,
                    consumptionPerGarmentUomValue: i.consumptionPerGarmentUom ? {
                        label: i.consumptionPerGarmentUom,
                        value: i.consumptionPerGarmentUom
                    } : null, // Extra
                    consumptionPerGarmentUom: i.consumptionPerGarmentUom,
                    consumptionPerGarmentRelativeFactor:
                        i.consumptionPerGarmentRelativeFactor,
                    orderUomArray: [],
                    orderUomRelativeFactor: i.orderUomRelativeFactor,
                    orderUOMValue: i.orderUOM ? { value: i.orderUOM, label: i.orderUOM } : null, ///Extra
                    orderUOM: i.orderUOM,

                    currencyValue: { label: i.currencyCode, value: i.currencyCode }, //Extra
                    currencyCode: i.currencyCode,
                    ratePerUnit: i.ratePerUnit,
                    purchaseTypeValue: { label: i.purchaseType, value: i.purchaseType }, //Extra
                    purchaseType: i.purchaseType,
                    isBuyerSupplied: i.isBuyerSupplied,
                    preferredSupplierValue: null,
                    preferredSupplier: i.preferredSupplier,
                    remarks: i.remarks,
                    statusValue: { label: i.status, value: i.status },
                    status: i.status,
                    isApproved: i.isApproved,
                    colorSensitivityType: i.colorSensitivityType,
                    sizeSensitivityType: i.sizeSensitivityType,
                    colorSensitivities: i.colorSensitivity,
                    sizeSensitivities: i.sizeSensitivity
                } ) );

                dispatch( {
                    type: GET_SET_CONSUMPTION_BY_ID,
                    consumptionBasicInfo: response.data ? consumptionBasicInfo : null,
                    consumptionFabricDetails: [],
                    consumptionAccessoriesDetails: modifiedAccessoriesDetails,
                    consumptionPackagingAccessories
                } );
            } );
    } else {
        dispatch( {
            type: GET_CONSUMPTION_BY_ID,
            selectedConsumption: null,
            consumptionFabricDetails: [],
            consumptionAccessoriesDetails: []
        } );
    }
};

export const bindConsumptionSizeColorSense = (
    consumptionDetailsColorSens,
    consumptionDetailsSizeSens
) => async ( dispatch ) => {
    if ( consumptionDetailsColorSens && consumptionDetailsSizeSens ) {
        await dispatch( {
            type: GET_CONSUMPTION_DETAILS_COLOR_SIZE_SENSE,
            consumptionDetailsColorSens,
            consumptionDetailsSizeSens
        } );
    } else {
        const colorObj = {
            categoryId: '',
            segmentId: '',
            segmentName: '',
            segment: null,
            fieldId: '',
            sizeSense: []
        };
        const sizeObj = {
            categoryId: '',
            segmentId: '',
            segmentName: '',
            segment: null,
            fieldId: '',
            colorSens: []
        };
        await dispatch( {
            type: GET_CONSUMPTION_DETAILS_COLOR_SIZE_SENSE,
            consumptionDetailsColorSens: colorObj,
            consumptionDetailsSizeSens: sizeObj
        } );
    }
};

export const bindConsumptionBasicInfo = ( consumptionBasicInfo ) => async (
    dispatch
) => {
    dispatch( {
        type: GET_CONSUMPTION_BASIC_INFO,
        consumptionBasicInfo
    } );
};
export const bindConsumptionFabricDetails = (
    consumptionFabricDetails
) => async ( dispatch ) => {
    dispatch( {
        type: GET_CONSUMPTION_FABRIC_DETAILS,
        consumptionFabricDetails
    } );
    // dispatch( bindConsumptionSizeColorSense( null, null ) );
};


export const bindConsumptionAccessoriesDetails = (
    consumptionAccessoriesDetails
) => async ( dispatch ) => {
    dispatch( {
        type: GET_CONSUMPTION_ACCESSORIES_DETAILS,
        consumptionAccessoriesDetails
    } );
};

export const deleteConsumptionDetailsItem = ( consumptionId, detailId, type ) => ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.consumption.root}/${consumptionId}/details/${detailId}`;
    const { consumptionFabricDetails, consumptionAccessoriesDetails, consumptionBasicInfo } = getState().consumptions;
    dispatch( consumptionDataLoaded() );
    baseAxios.delete( apiEndPoint )
        .then( response => {
            if ( response.status === status.success ) {
                if ( type === "Fabric" ) {
                    const updatedData = consumptionFabricDetails.filter( fabric => fabric.detailId !== response.data );
                    dispatch( bindConsumptionFabricDetails( updatedData ) );
                    //
                } else if ( type === "Accessories" ) {
                    const updatedData = consumptionAccessoriesDetails.filter( acc => acc.detailId !== response.data );
                    dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
                    //
                }
                notify( 'success', `The Consumption's Item has been deleted successfully` );
                dispatch( consumptionDataLoaded() );
                const queryData = consumptionBasicInfo?.styleOrderDetails.map( ( order ) => ( {
                    orderId: order.orderId,
                    setStyleId: order.setStyleId,
                    styleId: order.styleId,
                    costingId: order.styleCostingId,
                    shipmentDate: order.shipmentDate
                } ) );
                if ( queryData.length ) {
                    dispatch( getCostingInfoForConsumption( queryData ) );
                }

            }
        } ).catch( ( ( { response } ) => {
            dispatch( consumptionDataLoaded() );

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

export const getConsumptionSizeColorSense = (
    colorSense,
    sizeSense,
    itemGroupId,
    fieldId,
    colorSensitivityType,
    sizeSensitivityType
) => async ( dispatch, getState ) => {
    if ( ( colorSense.length > 0 && sizeSense.length > 0 ) || colorSense.length > 0 || sizeSense.length > 0 ) {
        const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/colorAndSizeSensitivitySegmentDetail`;
        dispatch( sizeColorDataOnProgress( true ) );
        await baseAxios.get( endPoint ).then( ( response ) => {
            if ( response.status === status.success ) {
                const { colorSensitivity, sizeSensitivity } = response.data;
                const consumptionDetailsSizeSens = {
                    categoryId: sizeSensitivity?.categoryId,
                    segmentId: sizeSensitivity?.segmentId,
                    segmentName: sizeSensitivity?.segmentName,
                    fieldId,
                    sizeSensitivityType,
                    sizeSense: sizeSense?.map( ( ss ) => ( {
                        ...ss,
                        segmentValues: [],
                        isValueLoading: false,
                        randomGenerateId: randomIdGenerator()
                    } ) )
                };
                const consumptionDetailsColorSens = {
                    categoryId: colorSensitivity?.categoryId,
                    segmentId: colorSensitivity?.segmentId,
                    segmentName: colorSensitivity?.segmentName,
                    fieldId,
                    colorSensitivityType,
                    colorSens: colorSense?.map( ( cs ) => ( {
                        ...cs,
                        segmentValues: [],
                        isValueLoading: false,
                        randomGenerateId: randomIdGenerator()
                    } ) )
                };
                dispatch( {
                    type: GET_CONSUMPTION_DETAILS_COLOR_SIZE_SENSE,
                    consumptionDetailsSizeSens,
                    consumptionDetailsColorSens
                } );
                dispatch( sizeColorDataOnProgress( false ) );

            }

        } );
    } else {
        const {
            consumptionPurchaseOrderSizes,
            consumptionPurchaseOrderColors
        } = getState().consumptions;

        const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/colorAndSizeSensitivitySegmentDetail`;
        dispatch( sizeColorDataOnProgress( true ) );

        await baseAxios.get( endPoint ).then( ( response ) => {

            if ( response.status === status.success ) {
                const { colorSensitivity, sizeSensitivity } = response.data;

                if ( colorSensitivity || sizeSensitivity ) {
                    const consumptionDetailsSizeSens = {
                        categoryId: sizeSensitivity?.categoryId,
                        segmentId: sizeSensitivity?.segmentId,
                        segmentName: sizeSensitivity?.segmentName,
                        fieldId,
                        sizeSensitivityType,
                        sizeSense: sizeSensitivity ? consumptionPurchaseOrderSizes.map( ( size ) => ( {
                            ...size,
                            segmentId: sizeSensitivity?.segmentId,
                            segment: null,
                            value: '',
                            segmentValues: [],
                            isValueLoading: false
                        } ) ) : []
                    };
                    const consumptionDetailsColorSens = {
                        categoryId: colorSensitivity?.categoryId,
                        segmentId: colorSensitivity?.segmentId,
                        segmentName: colorSensitivity?.segmentName,
                        fieldId,
                        colorSensitivityType,
                        colorSens: colorSensitivity ? consumptionPurchaseOrderColors.map( ( color ) => ( {
                            ...color,
                            segmentId: colorSensitivity?.segmentId,
                            segment: null,
                            value: '',
                            segmentValues: [],
                            isValueLoading: false
                        } ) ) : []
                    };
                    dispatch( {
                        type: GET_CONSUMPTION_DETAILS_COLOR_SIZE_SENSE,
                        consumptionDetailsSizeSens,
                        consumptionDetailsColorSens
                    } );
                } else {
                    notify(
                        'warning',
                        'Size Sensibility or Color Sensibility Not Found for the selected item'
                    );
                }
                dispatch( sizeColorDataOnProgress( false ) );

            }

        } );
    }
};
export const getConsumptionSizeColorSenseForEdit = (
    colorSense,
    sizeSense,
    itemGroupId,
    fieldId,
    detailsId,
    colorSensitivityType,
    sizeSensitivityType,
    styleId,
    orderId
) => async ( dispatch, getState ) => {
    if ( ( colorSense.length > 0 && sizeSense.length > 0 ) || colorSense.length > 0 || sizeSense.length > 0 ) {
        const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/colorAndSizeSensitivitySegmentDetail`;
        dispatch( sizeColorDataOnProgress( true ) );
        await baseAxios.get( endPoint ).then( ( response ) => {
            if ( response.status === status.success ) {
                const { colorSensitivity, sizeSensitivity } = response.data;

                const consumptionDetailsSizeSens = {
                    categoryId: sizeSensitivity?.categoryId,
                    segmentId: sizeSensitivity?.segmentId,
                    segmentName: sizeSensitivity?.segmentName,
                    fieldId,
                    sizeSensitivityType,
                    sizeSense: sizeSense?.map( ( ss ) => ( {
                        ...ss,
                        segmentValues: [],
                        isValueLoading: false,
                        randomGenerateId: randomIdGenerator()
                    } ) )
                };

                const consumptionDetailsColorSens = {
                    categoryId: colorSensitivity?.categoryId,
                    segmentId: colorSensitivity?.segmentId,
                    segmentName: colorSensitivity?.segmentName,
                    fieldId,
                    colorSensitivityType,
                    colorSens: colorSense?.map( ( cs ) => ( {
                        ...cs,
                        segmentValues: [],
                        isValueLoading: false,
                        randomGenerateId: randomIdGenerator()
                    } ) )
                };
                dispatch( {
                    type: GET_CONSUMPTION_DETAILS_COLOR_SIZE_SENSE,
                    consumptionDetailsSizeSens,
                    consumptionDetailsColorSens
                } );
                dispatch( sizeColorDataOnProgress( false ) );
            }

        } );
    } else {
        dispatch( sizeColorDataOnProgress( true ) );

        let color = [];
        let size = [];
        await baseAxios
            .get( `${merchandisingApi.consumption.root}/details/${detailsId}/colorAndSizeSensitivities` )
            .then( async ( response ) => {
                if ( response.status === status.success ) {
                    const { colorSensitivities, sizeSensitivities } = response.data;

                    const {
                        consumptionPurchaseOrderSizes,
                        consumptionPurchaseOrderColors
                    } = getState().consumptions;

                    //      console.log( 'size Data', consumptionPurchaseOrderSizes );
                    //  console.log( 'sizeSensitivities', sizeSensitivities );

                    const filteredColorSense = colorSensitivities.filter( ( f ) => consumptionPurchaseOrderColors.some( ( c ) => c.colorId === f.colorId ) );

                    const filteredDataColor = consumptionPurchaseOrderColors.filter( ( f ) => !filteredColorSense.some( ( c ) => c.colorId === f.colorId ) );

                    console.log( 'filer', colorSensitivities );


                    const combineFilterColor = filteredDataColor.map( dc => ( { ...dc, name: dc.colorName } ) ).concat(
                        filteredColorSense.map( ( csens ) => ( {
                            segmentId: csens?.segmentId,
                            colorId: csens?.colorId,
                            name: consumptionPurchaseOrderColors?.find(
                                ( cn ) => cn.colorId === csens?.colorId
                            )?.colorName,
                            // segment: csens.value ? { label: csens.value, value: csens.segmentId } : null,
                            segment: csens.value ? { label: csens.value, value: csens.value } : null,
                            value: csens.value
                        } ) )
                    );

                    color = combineFilterColor.map( ( c ) => ( {
                        randomGenerateId: randomIdGenerator(),
                        colorId: c.colorId,
                        colorName: c.name,
                        segmentId: c.segmentId ? c.segmentId : 0,
                        segment: c.segment ? c.segment : null,
                        value: c.value ? c.value : '',
                        segmentValues: [],
                        isValueLoading: false
                    } ) );


                    const filteredSizeSense = sizeSensitivities.filter( ( f ) => consumptionPurchaseOrderSizes.some( ( c ) => c.sizeId === f.sizeId ) );


                    const filteredDataSize = consumptionPurchaseOrderSizes.filter(
                        ( f ) => !filteredSizeSense.some( ( c ) => c.sizeId === f.sizeId )
                    );
                    const combineFilter = filteredDataSize.map( ds => ( { ...ds, name: ds.sizeName } ) ).concat(
                        filteredSizeSense.map( ( ssens ) => ( {
                            segmentId: ssens?.segmentId,
                            sizeId: ssens?.sizeId,
                            sizeGroupId: ssens?.sizeGroupId,
                            sizeGroup: consumptionPurchaseOrderSizes.find( sg => sg.sizeGroupId === ssens.sizeGroupId )?.sizeGroup,
                            name: consumptionPurchaseOrderSizes?.find(
                                ( sn ) => sn.sizeId === ssens?.sizeId
                            )?.sizeName,
                            // segment: ssens.value ? { label: ssens.value, value: ssens.segmentId } : null,
                            segment: ssens.value ? { label: ssens.value, value: ssens.value } : null,
                            value: ssens.value
                        } ) )
                    );
                    //  console.log( combineFilter );
                    size = combineFilter.map( ( s ) => ( {
                        randomGenerateId: randomIdGenerator(),
                        sizeGroupId: s.sizeGroupId,
                        sizeGroup: s.sizeGroup,
                        sizeId: s.sizeId,
                        sizeName: s.name,
                        segmentId: s.segmentId ? s.segmentId : 0,
                        segment: s.segment ? s.segment : null,
                        value: s.value ? s.value : '',
                        segmentValues: [],
                        isValueLoading: false
                    } ) );
                }

            } );


        const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/colorAndSizeSensitivitySegmentDetail`;
        await baseAxios.get( endPoint ).then( ( response ) => {
            if ( response.status === status.success ) {
                const { colorSensitivity, sizeSensitivity } = response.data;
                const consumptionDetailsSizeSens = {
                    categoryId: sizeSensitivity?.categoryId,
                    segmentId: sizeSensitivity?.segmentId,
                    segmentName: sizeSensitivity?.segmentName,
                    fieldId,
                    sizeSensitivityType,
                    // sizeSense: sizeSense?.map( ss => ( { ...ss, randomGenerateId: randomIdGenerator() } ) )
                    sizeSense: size
                };
                const consumptionDetailsColorSens = {
                    categoryId: colorSensitivity?.categoryId,
                    segmentId: colorSensitivity?.segmentId,
                    segmentName: colorSensitivity?.segmentName,
                    fieldId,
                    colorSensitivityType,
                    colorSens: color
                };
                dispatch( {
                    type: GET_CONSUMPTION_DETAILS_COLOR_SIZE_SENSE,
                    consumptionDetailsSizeSens,
                    consumptionDetailsColorSens
                } );
                dispatch( sizeColorDataOnProgress( false ) );

            }

        } );
    }
};

export const getItemSubGroupForConsumptionFabric = ( fieldId, itemId ) => async ( dispatch, getState ) => {
    const endPoint = `${inventoryApi.itemGroup.root}/${itemId}/subCategories`;
    const { consumptionFabricDetails } = getState().consumptions;

    if ( itemId ) {
        await baseAxios.get( endPoint ).then( ( response ) => {
            const updatedData = consumptionFabricDetails.map( ( cfd ) => {
                if ( fieldId === cfd.fieldId ) {
                    cfd.itemSubGroupArray = response?.data?.map( ( rd ) => ( {
                        value: rd.id,
                        label: rd.name
                    } ) );
                }
                return cfd;
            } );
            dispatch( bindConsumptionFabricDetails( updatedData ) );
        } );
    }

};
export const getItemSubGroupForConsumptionAccessories = ( fieldId, itemId ) => async ( dispatch, getState ) => {
    const endPoint = `${inventoryApi.itemGroup.root}/${itemId}/subCategories`;
    const { consumptionAccessoriesDetails } = getState().consumptions;

    if ( itemId ) {
        await baseAxios.get( endPoint ).then( ( response ) => {
            const updatedData = consumptionAccessoriesDetails.map( ( cad ) => {
                if ( fieldId === cad.fieldId ) {
                    cad.itemSubGroupArray = response?.data?.map( ( rd ) => ( {
                        value: rd.id,
                        label: rd.name
                    } ) );
                }
                return cad;
            } );
            dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
        } );
    }

};

///Add Consumption
export const addConsumption = ( consumption, push ) => async ( dispatch, getState ) => {
    dispatch( consumptionDataLoaded() );

    await baseAxios
        .post( `${merchandisingApi.consumption.root}`, consumption )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_CONSUMPTION,
                    consumption
                } );
                notify( 'success', 'The Consumption has been added Successfully.' );
                dispatch( getConsumptionByQuery( getState().consumptions.params, [] ) );
                // push( { pathname: row?.isSetConsumption ? `/set-consumptions-edit` : `/consumptions-edit`, state: `${row.id}` } )
                push( { pathname: `/consumptions-edit`, state: `${response.data}` } );
                dispatch( consumptionDataLoaded() );
            }
        } )
        .catch( ( ( { response } ) => {
            dispatch( consumptionDataLoaded() );
            if ( response.status === status.badRequest ) {
                notify( 'error', `${response.data.errors.join( ', ' )}` );
            }
            if ( response.status === status.notFound || response.status === status.severError ) {
                notify( 'error', 'Please contact with Software Developer!' );
            }
            if ( response.status === status.conflict ) {

                notify( 'warning', `${response.data.detail}` );
            }
        } ) );
};

/// Update Consumption
export const updateConsumption = ( consumption, consumptionId ) => async ( dispatch, getState ) => {
    dispatch( consumptionDataLoaded() );
    await baseAxios
        .put( `${merchandisingApi.consumption.root}/${consumptionId}`, consumption )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_CONSUMPTION,
                    consumption
                } );
                notify( 'success', 'The Consumption has been updated Successfully' );
                dispatch( getConsumptionById( response.data ) );
                dispatch( consumptionDataLoaded() );
            }
        } )
        .catch( ( ( { response } ) => {
            dispatch( consumptionDataLoaded() );
            if ( response.status === status.badRequest ) {
                notify( 'errors', response.data.errors );
            }
            if ( response.status === status.notFound || response.status === status.severError ) {
                notify( 'error', 'Please contact with Software Developer!' );
            }
            if ( response.status === status.conflict ) {
                notify( 'warning', `${response.data.detail}` );
            }
        } ) );
};

export const updateSetConsumption = ( consumption, consumptionId ) => async (
    dispatch,
    getState
) => {
    await baseAxios
        .put(
            `${merchandisingApi.consumption.root}/setConsumption/${consumptionId}`,
            consumption
        )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_CONSUMPTION,
                    consumption
                } );
                notify( 'success', 'The Consumption has been updated Successfully' );
                dispatch( getSetConsumptionById( response.data ) );
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
};

export const addPackConsumption = ( consumption, push ) => async ( dispatch, getState ) => {
    dispatch( consumptionDataLoaded() );
    await baseAxios
        .post( `${merchandisingApi.consumption.root}/packagings`, consumption )
        .then( ( response ) => {
            if ( response.status === status.success ) {

                notify( 'success', 'The Consumption has been added Successfully.' );
                push( { pathname: `/edit-consumption-packaging`, state: `${response.data}` } );
                // push( { pathname: `/consumptions-edit`, state: `${response.data}` } );
                dispatch( consumptionDataLoaded() );
            }
        } )
        .catch( ( ( { response } ) => {
            dispatch( consumptionDataLoaded() );
            if ( response.status === status.badRequest ) {
                notify( 'error', `${response.data.errors.join( ', ' )}` );
            }
            if ( response.status === status.notFound || response.status === status.severError ) {
                notify( 'error', 'Please contact with Software Developer!' );
            }
            if ( response.status === status.conflict ) {

                notify( 'warning', `${response.data.detail}` );
            }
        } ) );
};
export const updatePackConsumption = ( consumption, push, consumptionId ) => async ( dispatch, getState ) => {
    dispatch( consumptionDataLoaded() );
    await baseAxios
        .put( `${merchandisingApi.consumption.root}/${consumptionId}/packagings`, consumption )
        .then( ( response ) => {
            if ( response.status === status.success ) {

                notify( 'success', 'The Consumption has been updated Successfully.' );
                dispatch( getPackConsumptionById( consumptionId ) );
                //   push( { pathname: `/edit-consumption-packaging`, state: `${response.data}` } );
                // push( { pathname: `/consumptions-edit`, state: `${response.data}` } );
                dispatch( consumptionDataLoaded() );
            }
        } )
        .catch( ( ( { response } ) => {
            dispatch( consumptionDataLoaded() );
            if ( response.status === status.badRequest ) {
                notify( 'error', `${response.data.errors.join( ', ' )}` );
            }
            if ( response.status === status.notFound || response.status === status.severError ) {
                notify( 'error', 'Please contact with Software Developer!' );
            }
            if ( response.status === status.conflict ) {

                notify( 'warning', `${response.data.detail}` );
            }
        } ) );
};

export const addSetConsumption = ( setConsumption, push ) => async ( dispatch, getState ) => {
    await baseAxios
        .post( `${merchandisingApi.consumption.root}/setConsumption`, setConsumption )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_CONSUMPTION,
                    setConsumption
                } );
                notify( 'success', 'The Consumption has been added Successfully.' );
            }
            push( { pathname: `/set-consumptions-edit`, state: `${response.data}` } );

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
};


///Delete Pre Consumption by Id
export const deleteConsumptionPurchaseOrderDetails = ( id, detailId, rowId ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.consumption.root}/${id}/styleOrderDetail/${detailId}`;
    confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios
                .delete( apiEndPoint )
                .then( response => {
                    const { consumptionBasicInfo } = getState().consumptions;
                    if ( response.status === status.success ) {
                        dispatch( {
                            type: DELETE_CONSUMPTION_ORDER_DETAILS
                        } );
                        notify( 'success', `The Consumption Purchase Order Details has been deleted Successfully!` );
                        //  dispatch( getCostingById( id ) );
                        const updatedData = consumptionBasicInfo.styleOrderDetails.filter( o => o.rowId !== rowId );
                        const updateObj = {
                            ...consumptionBasicInfo,
                            ['styleOrderDetails']: updatedData
                        };
                        dispatch( bindConsumptionBasicInfo( updateObj ) );

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
export const deletePackConsumptionPurchaseOrderDetails = ( id, detailId, rowId ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.consumption.root}/${id}/styleOrderDetail/${detailId}`;
    confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios
                .delete( apiEndPoint )
                .then( response => {
                    const { consumptionBasicInfo } = getState().consumptions;
                    if ( response.status === status.success ) {
                        dispatch( {
                            type: DELETE_CONSUMPTION_ORDER_DETAILS
                        } );
                        notify( 'success', `The Consumption Purchase Order Details has been deleted Successfully!` );
                        //  dispatch( getCostingById( id ) );
                        const updatedData = consumptionBasicInfo.packOrderDetails.filter( o => o.rowId !== rowId );
                        const updateObj = {
                            ...consumptionBasicInfo,
                            ['packOrderDetails']: updatedData
                        };
                        dispatch( bindConsumptionBasicInfo( updateObj ) );

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

///Delete Consumption by Id
export const deleteConsumption = ( id ) => async ( dispatch, getState ) => {
    confirmDialog( confirmObj ).then( async ( e ) => {
        if ( e.isConfirmed ) {
            await baseAxios
                .delete( `${merchandisingApi.consumption.root}/${id}` )
                .then( ( response ) => {
                    if ( response.status === status.success ) {
                        const { params, queryObj } = getState().consumptions;
                        dispatch( {
                            type: DELETE_CONSUMPTION
                        } );
                        notify( 'success', 'The Consumption has been deleted Successfully!' );
                        dispatch( getConsumptionByQuery( params, queryObj ) );
                    } else {
                        notify( 'error', 'The Consumption DELETE request has been failed!' );
                    }
                } )
                .catch( ( ( { response } ) => {
                    if ( response.status === status.badRequest ) {
                        notify( 'errors', response.data.errors );
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
export const retrieveConsumption = ( id ) => async ( dispatch, getState ) => {
    confirmDialog( confirmObj ).then( async ( e ) => {
        if ( e.isConfirmed ) {
            await baseAxios
                .put( `${merchandisingApi.consumption.root}/archiveOrActive/${id}` )
                .then( ( response ) => {
                    if ( response.status === status.success ) {
                        const { params, queryObj } = getState().consumptions;
                        dispatch( {
                            type: DELETE_CONSUMPTION
                        } );
                        notify( 'success', 'The Consumption has been retrieve Successfully!' );
                        dispatch( getConsumptionByQuery( params, queryObj ) );
                    } else {
                        notify( 'error', 'The Consumption retrieve request has been failed!' );
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

/// Delete Consumption by Range
export const deleteRangeConsumption = ( ids ) => {
    return async ( dispatch, getState ) => {
        await baseAxios
            .delete( `${merchandisingApi.consumption.delete_consumption_by_range}`, {
                ids
            } )
            .then( ( response ) => {
                dispatch( {
                    type: DELETE_CONSUMPTIONS_BY_RANGE
                } );
            } )
            .then( () => {
                notify( 'success', 'The Consumption has been deleted Successfully' );
                dispatch( getConsumptionByQuery( getState().consumptions.params ) );
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
    };
};

///Clean All State For Consumption

export const cleanAllConsumptionState = () => ( dispatch ) => {
    dispatch( {
        type: CLEAN_CONSUMPTION_ALL_STATE
    } );
    dispatch( getBuyersStyles( null ) );
};

export const cloneConsumption = ( consumptionBasicInfo, consumptionFabricDetails, consumptionAccessoriesDetails, consumptionPackagingAccessories, replace ) => ( dispatch ) => {
    dispatch( {
        type: CLONE_CONSUMPTION,
        consumptionBasicInfo: { ...consumptionBasicInfo, styleOrderDetails: [], consumptionNumber: '', isClone: true },
        consumptionFabricDetails: consumptionFabricDetails.map( fabric => ( { ...fabric, isApproved: false } ) ),
        consumptionAccessoriesDetails: consumptionAccessoriesDetails.map( acc => ( { ...acc, isApproved: false } ) ),
        consumptionPackagingAccessories
    } );
    replace( { pathname: `/clone-consumption` } );

};

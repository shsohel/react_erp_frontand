
import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import _ from 'lodash';
import { inventoryApi } from "../../../../../services/api-end-points/inventory";
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { confirmObj, selectSizeColorType, selectSizeType, status } from "../../../../../utility/enums";
import { randomIdGenerator } from "../../../../../utility/Utils";
import { packagingInfoModel, setPackagingInfoModel } from "../../models";
import { ADD_SET_PACKAGING, ADD_SINGLE_PACKAGING, BIND_SET_PACKAGING_BASIC_INFO, BIND_SET_PACKAGING_STYLE_SIZE_DETAILS, BIND_SINGLE_PACKAGING_BASIC_INFO, BIND_SINGLE_PACKAGING_COLOR_SIZE_DETAILS, CLEAR_PACKAGING_ALL_STATE, DELETE_SINGLE_PACKAGING, GET_PACKAGING_COLOR_DROPDOWN, GET_PACKAGING_PURCHASER_ORDERS, GET_PACKAGING_SIZE_COLOR_DROPDOWN, GET_PACKAGING_SIZE_DROPDOWN, GET_SET_PACKAGING_BY_ID, GET_SET_PACKAGING_DETAILS, GET_SINGLE_PACKAGING, GET_SINGLE_PACKAGING_BY_ID, GET_SINGLE_PACKAGING_DETAILS, GET_UOM_DROPDOWN_BY_UOM_SET_NAME, SET_PACKAGING_ACCESSORIES_DETAILS, SINGLE_PACKAGING_ACCESSORIES_DETAILS, UPDATE_SET_PACKAGING } from "../action-types";


///Input OnChange When Any Data Change on Single Packaging Input
export const bindSinglePackagingBasic = ( packagingInfo ) => async dispatch => {
    if ( packagingInfo ) {
        dispatch( {
            type: BIND_SINGLE_PACKAGING_BASIC_INFO,
            packagingInfo
        } );
    } else {
        dispatch( {
            type: BIND_SINGLE_PACKAGING_BASIC_INFO,
            packagingInfo: packagingInfoModel
        } );
    }
};
///Input OnChange When Any Data Change on Single Packaging Input
export const bindSetPackagingBasic = ( setPackagingInfo ) => async dispatch => {
    if ( setPackagingInfo ) {
        dispatch( {
            type: BIND_SET_PACKAGING_BASIC_INFO,
            setPackagingInfo
        } );
    } else {
        dispatch( {
            type: BIND_SET_PACKAGING_BASIC_INFO,
            setPackagingInfo: setPackagingInfoModel
        } );
    }
};

//Get Data by Query

///GET SINGLE PACKAGING Details By Order Id and StyleId
export const getSinglePackingDetail = ( orderId, styleId ) => async ( dispatch, getState ) => {
    if ( orderId && styleId ) {
        const endPoints = `${merchandisingApi.purchaseOrder.root}/${orderId}/styles/${styleId}/packagings`;
        await baseAxios.get( endPoints )
            .then( response => {
                const { packagingInfo } = getState().packaging;

                const updatedObj = {
                    ...packagingInfo,
                    isRepeatableCreate: packagingInfo?.isRepeatableCreate,
                    id: response.data.packagingDetails ? response.data.id : null
                };
                dispatch( bindSinglePackagingBasic( updatedObj ) );
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_SINGLE_PACKAGING_DETAILS,
                        singlePackagingDetails: response.data.packagingDetails ? response.data.packagingDetails.map( s => ( {
                            ...s,
                            packagingId: response.data.id,
                            fieldId: randomIdGenerator()
                        } ) ) : []
                    } );
                }
            } )
            .catch( response => {
                console.log( 'response' );
            } );
    } else {
        dispatch( {
            type: GET_SINGLE_PACKAGING_DETAILS,
            singlePackagingDetails: []
        } );
    }
};
export const bindSinglePackagingDetails = ( singlePackagingDetails ) => ( dispatch ) => {
    dispatch( {
        type: GET_SINGLE_PACKAGING_DETAILS,
        singlePackagingDetails
    } );

};


///GET SET PACKAGING Details By Order Id and StyleId
export const getSetPackingDetail = ( orderId ) => async ( dispatch, getState ) => {
    if ( orderId ) {
        const endPoints = `${merchandisingApi.purchaseOrder.root}/${orderId}/setStyles/packagings`;
        await baseAxios.get( endPoints )
            .then( response => {
                const { setPackagingInfo } = getState().packaging;

                const updatedObj = {
                    ...setPackagingInfo,
                    id: response.data.packagingDetails ? response.data.id : null
                };
                dispatch( bindSetPackagingBasic( updatedObj ) );
                if ( response.status === status.success ) {
                    dispatch( {
                        type: GET_SET_PACKAGING_DETAILS,
                        setPackagingDetails: response.data.packagingDetails.map( s => ( {
                            ...s,
                            packagingId: response.data.id,
                            fieldId: randomIdGenerator()
                        } ) )
                    } );
                }
            } )
            .catch( response => {
                console.log( 'response' );
            } );
    } else {
        dispatch( {
            type: GET_SET_PACKAGING_DETAILS,
            setPackagingDetails: []
        } );
    }
};

export const bindSetPackagingDetails = ( setPackagingDetails ) => dispatch => {
    dispatch( {
        type: GET_SET_PACKAGING_DETAILS,
        setPackagingDetails
    } );
};

///Get Colors and Sizes by Order Id and Style Id
export const getPackagingSizeColorDropdown = ( orderId, styleId ) => async dispatch => {
    if ( orderId && styleId ) {
        const endPoints = `${merchandisingApi.purchaseOrder.root}/${orderId}/styles/${styleId}/sizesAndColors`;
        const sizeEndPoint = `${merchandisingApi.style.root}/purchaseOrders/sizes`;
        const colorEndPoint = `${merchandisingApi.style.root}/purchaseOrders/colors`;
        const queryData = [
            {
                orderId,
                styleId
            }
        ];
        let colors = [];
        let sizes = [];

        await baseAxios.post( colorEndPoint, queryData ).then( ( response ) => {
            sizes = response.data.map( s => ( {
                value: s.sizeId,
                label: s.size

            } ) );
            if ( response.status === status.success ) {
                colors = response.data.map( c => ( {
                    value: c.id,
                    label: c.name
                } ) );

            } else {
                notify( "error", "Something gonna Wrong!" );
            }
        } );

        await baseAxios.post( sizeEndPoint, queryData ).then( ( response ) => {
            if ( response.status === status.success ) {
                sizes = response.data.map( s => ( {
                    value: s.id,
                    label: s.name

                } ) );
                dispatch( {
                    type: GET_PACKAGING_SIZE_COLOR_DROPDOWN,
                    packagingColorDropdown: colors,
                    packagingSizeDropdown: sizes
                } );
            } else {
                notify( "error", "Something gonna Wrong!" );
            }

        } );

    } else {
        dispatch( {
            type: GET_PACKAGING_SIZE_COLOR_DROPDOWN,
            packagingColorDropdown: [],
            packagingSizeDropdown: []
        } );
    }
};

export const getPackagingColorDropdown = ( orderId, styleId ) => async dispatch => {
    if ( orderId && styleId ) {
        const colorEndPoint = `${merchandisingApi.style.root}/purchaseOrders/colors`;
        const queryData = [
            {
                orderId,
                styleId
            }
        ];
        await baseAxios.post( colorEndPoint, queryData ).then( ( response ) => {
            if ( response.status === status.success ) {
                const colors = response.data.map( c => ( {
                    value: c.id,
                    label: c.name
                } ) );
                dispatch( {
                    type: GET_PACKAGING_COLOR_DROPDOWN,
                    packagingColorDropdown: colors
                } );
            } else {
                notify( "error", "Something gonna Wrong!" );
            }
        } );

    } else {
        dispatch( {
            type: GET_PACKAGING_COLOR_DROPDOWN,
            packagingColorDropdown: []
        } );
    }
};
export const getPackagingSizeDropdown = ( orderId, styleId ) => async dispatch => {
    if ( orderId && styleId ) {
        const sizeEndPoint = `${merchandisingApi.style.root}/purchaseOrders/sizes`;
        const queryData = [
            {
                orderId,
                styleId
            }
        ];
        await baseAxios.post( sizeEndPoint, queryData ).then( ( response ) => {
            if ( response.status === status.success ) {
                const sizes = response.data.map( s => ( {
                    value: s.id,
                    label: s.name

                } ) );
                dispatch( {
                    type: GET_PACKAGING_SIZE_DROPDOWN,
                    packagingSizeDropdown: sizes
                } );
            } else {
                notify( "error", "Something gonna Wrong!" );
            }
        } );

    } else {
        dispatch( {
            type: GET_PACKAGING_SIZE_DROPDOWN,
            packagingSizeDropdown: []
        } );
    }
};
export const getPackagingPurchaseOrder = ( buyerId, styleId ) => async dispatch => {
    if ( buyerId && styleId ) {
        const endPoint = `${merchandisingApi.buyer.root}/${buyerId}/styles/${styleId}/purchaseOrders`;
        await baseAxios.get( endPoint ).then( ( response ) => {
            if ( response.status === status.success ) {
                const packagingPurchaseOrders = response.data.map( order => ( {
                    orderId: order.orderId,
                    orderNumber: order.orderNumber,
                    styleId: order.orderId,
                    styleNumber: order.orderId,
                    shipmentMode: order.shipmentMode,
                    shipmentDate: order.shipmentDate,
                    sizeGroup: order.sizeGroupName,
                    destination: order.deliveryDestination
                } ) );
                dispatch( {
                    type: GET_PACKAGING_PURCHASER_ORDERS,
                    packagingPurchaseOrders
                } );
            } else {
                notify( "error", "Something gonna Wrong!" );
            }
        } );

    } else {
        dispatch( {
            type: GET_PACKAGING_PURCHASER_ORDERS,
            packagingPurchaseOrders: []
        } );
    }
};

///Get Single Packaging Details by Id When Click Edit Button
export const getSinglePackagingById = ( packId, detailId ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.packaging.root}/${packId}/details/${detailId}`;

    await baseAxios.get( apiEndPoint ).then( ( response ) => {
        const { packagingInfo, dropdownUom } = getState().packaging;
        const { data } = response;

        const getUOM = ( uomName ) => {
            console.log( uomName );
            const uom = dropdownUom.find( uom => uom.label.toLowerCase().includes( uomName?.toLowerCase() ) );
            console.log( uom );
            return uom;
        };


        const updatedData = {
            ...data,
            buyer: packagingInfo.buyer,
            style: packagingInfo.style,
            orderId: packagingInfo.orderId,
            orderNumber: packagingInfo.orderNumber,
            shipmentDate: packagingInfo.shipmentDate,
            destination: packagingInfo.destination,

            cartonSeriesNo: data.cartonNoSeries,
            lengthUom: getUOM( data.lengthUom ),
            widthUom: getUOM( data.widthUom ),
            heightUom: getUOM( data.heightUom ),

            isRepeatableCreate: false,
            packagingType: selectSizeColorType.find( t => t.value === data.packagingType ),
            color: _.unionBy( data.packagingQuantityDetails, 'colorId' ).map( c => ( {
                value: c.colorId,
                label: c.color
            } ) ),
            size: _.unionBy( data.packagingQuantityDetails, 'sizeId' ).map( s => ( {
                value: s.sizeId,
                label: s.size
            } ) )
        };

        const singlePackingColorSizeDetails = _.unionBy( data.packagingQuantityDetails, 'colorId' ).map( cs => ( {
            fieldId: randomIdGenerator(),
            colorId: cs.colorId,
            colorName: cs.color,
            size: data.packagingQuantityDetails.filter( c => c.colorId === cs.colorId ).map( s => ( {
                fieldId: randomIdGenerator(),
                id: s.id,
                sizeId: s.sizeId,
                sizeName: s.size,
                inputValue: s.quantity
            } ) )
        } ) );

        const singlePackagingAccessoriesDetails = data.accessoriesDetails.map( ( acc, index ) => ( {
            fieldId: randomIdGenerator(),
            id: acc.id,
            rowNo: index + 1,

            itemGroup: acc.itemGroupId ? { value: acc.itemGroupId, label: acc.itemGroup } : null,
            itemGroupId: acc.itemGroupId,

            itemSubGroup: acc.itemSubGroupId ? { value: acc.itemSubGroupId, label: acc.itemSubGroup } : null,
            itemSubGroupId: acc.itemSubGroupId,
            itemSubGroupArray: [],

            itemDescriptionArray: [],
            itemDescriptionValue: acc.itemDescription ? { value: acc.itemDescription, label: acc.itemDescription } : null,
            itemDescription: acc.itemDescription ? acc.itemDescription : '',
            itemDescriptionTemplate: acc.itemDescriptionTemplate ? acc.itemDescriptionTemplate : '',

            defaultUomSetId: null,
            consumptionUomArray: [],

            consumptionUom: acc.consumptionUOM ? { label: acc.consumptionUOM, value: acc.consumptionUOM } : null,

            wastagePercent: acc.wastagePercent,
            consumptionQuantity: acc.consumptionQuantity,
            consumptionRatePerUnit: acc.consumptionRatePerUnit,

            inHouseQuantity: acc.inHouseQuantity,
            inHouseRatePerUnit: acc.inHouseRatePerUnit,
            inHouseCost: acc.inHouseCost,
            totalCost: 0

        } ) );
        if ( response.status === status.success ) {
            dispatch( {
                type: GET_SINGLE_PACKAGING_BY_ID,
                packagingInfo: updatedData,
                singlePackingColorSizeDetails,
                singlePackagingAccessoriesDetails
            } );
        } else {
            notify( "error", "Something gonna Wrong!" );
        }

    } ).catch( e => {
        notify( 'warning', 'Server Side ERROR' );
    } );
};
///Get Single Packaging Details by Id When Click Edit Button
export const getSetPackagingById = ( packId, detailId ) => async ( dispatch, getState ) => {
    const apiEndPoint = `${merchandisingApi.packaging.root}/${packId}/details/${detailId}`;
    await baseAxios.get( apiEndPoint ).then( ( response ) => {

        const { setPackagingInfo } = getState().packaging;

        const { data } = response;

        const updatedData = {
            ...data,
            buyer: setPackagingInfo.buyer,
            // style: packagingInfo.style,
            purchaseOrder: setPackagingInfo.purchaseOrder,
            cartonSeriesNo: data.cartonNoSeries,
            isRepeatableCreate: false,
            packagingType: selectSizeType.find( t => t.value === data.packagingType ),
            style: _.unionBy( data.packagingDetails, 'styleId' ).map( c => ( {
                value: c.styleId,
                label: c.styleNumber
            } ) ),
            size: _.unionBy( data.packagingDetails, 'sizeId' ).map( s => ( {
                value: s.sizeId,
                label: s.size
            } ) )
        };

        const setPackingStyleSizeDetails = _.unionBy( data.packagingDetails, 'styleId' ).map( cs => ( {
            fieldId: randomIdGenerator(),
            styleId: cs.styleId,
            style: cs.styleNumber,
            size: data.packagingDetails.filter( c => c.styleId === cs.styleId ).map( s => ( {
                fieldId: randomIdGenerator(),
                sizeId: s.sizeId,
                sizeName: s.size,
                inputValue: s.quantity
            } ) )
        } ) );

        const setPackagingAccessoriesDetails = data.accessoriesDetails.map( ( acc, index ) => ( {
            fieldId: randomIdGenerator(),
            id: acc.id,
            rowNo: index + 1,

            itemGroup: acc.itemGroupId ? { value: acc.itemGroupId, label: acc.itemGroup } : null,
            itemGroupId: acc.itemGroupId,

            itemSubGroup: acc.itemSubGroupId ? { value: acc.itemSubGroupId, label: acc.itemSubGroup } : null,
            itemSubGroupId: acc.itemSubGroupId,
            itemSubGroupArray: [],

            itemDescriptionArray: [],
            itemDescriptionValue: acc.itemDescription ? { value: acc.itemDescription, label: acc.itemDescription } : null,
            itemDescription: acc.itemDescription ? acc.itemDescription : '',
            itemDescriptionTemplate: acc.itemDescriptionTemplate ? acc.itemDescriptionTemplate : '',

            defaultUomSetId: null,
            consumptionUomArray: [],

            consumptionUom: acc.consumptionUOM ? { label: acc.consumptionUOM, value: acc.consumptionUOM } : null,

            wastagePercent: acc.wastagePercent,
            consumptionQuantity: acc.consumptionQuantity,
            consumptionRatePerUnit: acc.consumptionRatePerUnit,

            inHouseQuantity: acc.inHouseQuantity,
            inHouseRatePerUnit: acc.inHouseRatePerUnit,
            inHouseCost: acc.inHouseCost,
            totalCost: 0

        } ) );
        if ( response.status === status.success ) {
            dispatch( {
                type: GET_SET_PACKAGING_BY_ID,
                setPackagingInfo: updatedData,
                setPackingStyleSizeDetails,
                setPackagingAccessoriesDetails
            } );
        } else {
            notify( "error", "Something gonna Wrong!" );
        }

    } ).catch( e => {
        notify( 'warning', 'Server Side ERROR' );
    } );
};


///Then Action Fire When Single Packaging Size Quantity Changing
export const bindSinglePackagingColorSizeDetails = ( singlePackingColorSizeDetails ) => async dispatch => {
    if ( singlePackingColorSizeDetails.length > 0 ) {
        dispatch( {
            type: BIND_SINGLE_PACKAGING_COLOR_SIZE_DETAILS,
            singlePackingColorSizeDetails
        } );
    } else {
        dispatch( {
            type: BIND_SINGLE_PACKAGING_COLOR_SIZE_DETAILS,
            singlePackingColorSizeDetails: []
        } );
    }
};

///Then Action Fire When SET Packaging Size Quantity Changing
export const bindSetPackagingStyleSizeDetails = ( setPackingStyleSizeDetails ) => async dispatch => {
    if ( setPackingStyleSizeDetails.length > 0 ) {
        dispatch( {
            type: BIND_SET_PACKAGING_STYLE_SIZE_DETAILS,
            setPackingStyleSizeDetails
        } );
    } else {
        dispatch( {
            type: BIND_SET_PACKAGING_STYLE_SIZE_DETAILS,
            setPackingStyleSizeDetails: []
        } );
    }
};


//Get Data by Query
export const getSetPackagingByQuery = ( params ) => async dispatch => {
    await baseAxios.get( `${merchandisingApi.packaging.root}` ).then( ( response ) => {
        if ( response.status === status.success ) {
            dispatch( {
                type: GET_SINGLE_PACKAGING,
                setPackaging: response.data.data,
                totalPages: response.data.totalRecords,
                params
            } );
        } else {
            notify( "error", "Something gonna Wrong!" );
        }

    } ).catch( e => {
        notify( 'warning', 'Server Side ERROR' );
    } );

};

///The Action fire when Single Packaging Detail's Data Changing
export const bindPackagingAccessoriesDetails = ( accessoriesDetails ) => async dispatch => {
    if ( accessoriesDetails ) {
        dispatch( {
            type: SINGLE_PACKAGING_ACCESSORIES_DETAILS,
            singlePackagingAccessoriesDetails: accessoriesDetails
        } );
    } else {
        dispatch( {
            type: SINGLE_PACKAGING_ACCESSORIES_DETAILS,
            singlePackagingAccessoriesDetails: []
        } );
    }

};

///The Action fire when Set Packaging Detail's Data Changing

export const bindSetPackagingAccessoriesDetails = ( accessoriesDetails ) => async dispatch => {
    if ( accessoriesDetails ) {
        dispatch( {
            type: SET_PACKAGING_ACCESSORIES_DETAILS,
            setPackagingAccessoriesDetails: accessoriesDetails
        } );
    } else {
        dispatch( {
            type: SET_PACKAGING_ACCESSORIES_DETAILS,
            setPackagingAccessoriesDetails: []
        } );
    }

};

// ** When Single Packing Insert
export const addSinglePackaging = packaging => async ( dispatch, getState ) => {
    await baseAxios
        .post( `${merchandisingApi.packaging.root}`, packaging )
        .then( response => {
            if ( response.status === status.success ) {
                const { packagingInfo, dropdownUom, singlePackingColorSizeDetails } = getState().packaging;
                const defaultUOM = dropdownUom.find( uom => uom.label.toLowerCase().includes( 'cm' ) );

                dispatch( {
                    type: ADD_SINGLE_PACKAGING,
                    packaging
                } );

                notify( 'success', 'The Packaging has been added Successfully!' );


                if ( packagingInfo.isRepeatableCreate ) {
                    console.log( 'repatealbe' );
                    const updatedObj = {
                        ...packagingInfo,
                        cartonSeriesNo: ''
                    };
                    dispatch( bindSinglePackagingBasic( updatedObj ) );

                    const updatedSizeColorQty = singlePackingColorSizeDetails.map( sc => ( { ...sc, inputValue: 0 } ) );
                    dispatch( bindSinglePackagingColorSizeDetails( updatedSizeColorQty ) );

                    dispatch( getSinglePackingDetail( packagingInfo?.orderId, packagingInfo.style?.value ) );
                } else {
                    const updatedObj = {
                        ...packagingInfoModel,
                        lengthUom: defaultUOM,
                        widthUom: defaultUOM,
                        heightUom: defaultUOM,
                        buyer: packagingInfo.buyer,
                        style: packagingInfo.style,
                        orderId: packagingInfo.orderId,
                        orderNumber: packagingInfo.orderNumber,
                        shipmentDate: packagingInfo.shipmentDate,
                        destination: packagingInfo.destination
                    };
                    dispatch( bindSinglePackagingBasic( updatedObj ) );
                    dispatch( getSinglePackingDetail( packagingInfo?.orderId, packagingInfo.style?.value ) );
                    dispatch( bindSinglePackagingColorSizeDetails( [] ) );
                    dispatch( bindPackagingAccessoriesDetails( [] ) );
                }

            } else {
                notify( 'error', 'The Packaging has been added Failed!' );
            }
        } )
        .catch( ( ( { response } ) => {
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
};

// ** When Single Packing Insert
export const updateSinglePackaging = ( packaging, packId ) => async ( dispatch, getState ) => {
    await baseAxios
        .put( `${merchandisingApi.packaging.root}/${packId}/detail/${packaging.detailId}`, packaging )
        .then( response => {
            if ( response.status === status.success ) {
                const { packagingInfo, dropdownUom, singlePackingColorSizeDetails } = getState().packaging;
                const defaultUOM = dropdownUom.find( uom => uom.label.toLowerCase().includes( 'cm' ) );

                if ( packagingInfo.isRepeatableCreate ) {
                    console.log( 'repeatable' );
                    const updatedObj = {
                        ...packagingInfo,
                        cartonSeriesNo: '',
                        detailId: 0,
                        isRepeatableCreate: true
                    };
                    dispatch( bindSinglePackagingBasic( updatedObj ) );

                    const updatedSizeColorQty = singlePackingColorSizeDetails.map( sc => ( {
                        ...sc,
                        size: sc.size.map( size => (
                            { ...size, inputValue: 0 } ) )
                    } ) );
                    console.log( updatedSizeColorQty );
                    dispatch( bindSinglePackagingColorSizeDetails( updatedSizeColorQty ) );

                    dispatch( getSinglePackingDetail( packagingInfo?.orderId, packagingInfo.style?.value ) );
                } else {
                    console.log( 'not repeatable' );
                    const updatedObj = {
                        ...packagingInfoModel,
                        lengthUom: defaultUOM,
                        widthUom: defaultUOM,
                        heightUom: defaultUOM,
                        buyer: packagingInfo.buyer,
                        style: packagingInfo.style,
                        orderId: packagingInfo.orderId,
                        orderNumber: packagingInfo.orderNumber,
                        shipmentDate: packagingInfo.shipmentDate,
                        destination: packagingInfo.destination
                    };
                    dispatch( bindSinglePackagingBasic( updatedObj ) );
                    dispatch( bindPackagingAccessoriesDetails( [] ) );
                    dispatch( bindSinglePackagingColorSizeDetails( [] ) );
                }

                dispatch( {
                    type: ADD_SINGLE_PACKAGING,
                    packaging
                } );
                notify( 'success', 'The Packaging has been updated Successfully!' );
                dispatch( getSinglePackingDetail( packagingInfo.orderId, packagingInfo.style?.value ) );

            } else {
                notify( 'error', 'The Packaging has been updated Failed!' );
            }
        } )

        .catch( ( ( { response } ) => {
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
};
// ** When Single Packing Insert
export const addSetPackaging = setPackaging => async ( dispatch, getState ) => {
    await baseAxios
        .post( `${merchandisingApi.packaging.setRoot}`, setPackaging )
        .then( response => {
            if ( response.status === status.success ) {
                const { setPackagingInfo } = getState().packaging;
                const updatedObj = {
                    ...setPackagingInfoModel,
                    buyer: setPackagingInfo.buyer,
                    purchaseOrder: setPackagingInfo.purchaseOrder,
                    style: setPackagingInfo.style
                };
                dispatch( {
                    type: ADD_SET_PACKAGING,
                    setPackaging
                } );
                notify( 'success', 'The Set Packaging has been added Successfully!' );
                dispatch( bindSetPackagingBasic( updatedObj ) );
                dispatch( getSetPackingDetail( setPackagingInfo.purchaseOrder?.value ) );
                dispatch( bindSetPackagingAccessoriesDetails( [] ) );
                dispatch( bindSetPackagingStyleSizeDetails( [] ) );
            } else {
                notify( 'error', 'The Set Packaging has been added Failed!' );
            }
        } )
        .catch( ( { response } ) => {
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response?.data?.errors?.join( ', ' )}` );
            }
        }
        );
};

// ** When Single Packing Insert
export const updateSetPackaging = ( packaging, packId ) => async ( dispatch, getState ) => {
    await baseAxios
        .put( `${merchandisingApi.packaging.setRoot}/${packId}/detail/${packaging.detailId}`, packaging )
        .then( response => {
            if ( response.status === status.success ) {
                const { setPackagingInfo } = getState().packaging;
                const updatedObj = {
                    ...setPackagingInfoModel,
                    buyer: setPackagingInfo.buyer,
                    purchaseOrder: setPackagingInfo.purchaseOrder
                };
                dispatch( {
                    type: UPDATE_SET_PACKAGING,
                    packaging
                } );
                notify( 'success', 'The Set Packaging has been updated Successfully!' );

                dispatch( bindSetPackagingBasic( updatedObj ) );
                dispatch( getSetPackingDetail( setPackagingInfo.purchaseOrder?.value ) );
                dispatch( bindSetPackagingAccessoriesDetails( [] ) );
                dispatch( bindSetPackagingStyleSizeDetails( [] ) );

            } else {
                notify( 'error', 'The Packaging has been updated Failed!' );
            }
        } )
        .then( () => {
            // dispatch( getSizeByQuery( getState().sizes.params ) );
        } )
        .catch( ( { response } ) => {
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response?.data?.errors?.join( ', ' )}` );
            }
        }
        );
};


// ** Delete Single Pack
export const deletePackagingDetails = ( packId, detailId ) => async ( dispatch, getState ) => {
    confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            const apiEndPoint = `${merchandisingApi.packaging.root}/${packId}/details/${detailId}`;
            const { packagingInfo, singlePackagingDetails } = getState().packaging;
            await baseAxios
                .delete( apiEndPoint )
                .then( response => {
                    if ( response.status === status.success ) {
                        dispatch( {
                            type: DELETE_SINGLE_PACKAGING
                        } );
                        notify( 'success', 'The Buyer has been deleted Successfully!' );
                        //    dispatch( getBuyerByQuery( getState().buyers.params ) );
                        const updatedSinglePackDetails = singlePackagingDetails.filter( detail => detail.detailId !== detailId );
                        dispatch( bindSinglePackagingDetails( updatedSinglePackDetails ) );

                    } else {
                        notify( 'error', 'The request has been failed!' );
                    }

                } )
                .catch( err => console.log( err ) );
        }
    } );


};

export const getUomDropdownByUnitSetName = ( unitSetName ) => async ( dispatch, getState ) => {
    if ( unitSetName ) {
        await baseAxios.get( `${inventoryApi.unitSet.root}/${unitSetName}/uomDetails` ).then( response => {
            const { packagingInfo } = getState().packaging;

            const dropdownUom = response.data.map( unit => ( {
                label: unit.unitName,
                description: unit.description,
                value: unit.id,
                isBaseUnit: unit.isBaseUnit,
                relativeFactor: unit.relativeFactor,
                uomSetId: unit.uomSetId
            } ) );
            const defaultUom = dropdownUom.find( uom => uom.label.toLowerCase().includes( 'cm' ) );

            const updatedObj = {
                ...packagingInfo,

                lengthUom: defaultUom,
                widthUom: defaultUom,
                heightUom: defaultUom
            };
            dispatch( bindSinglePackagingBasic( updatedObj ) );
            dispatch( {
                type: GET_UOM_DROPDOWN_BY_UOM_SET_NAME,
                dropdownUom
            } );
        } );
    } else {
        dispatch( {
            type: GET_UOM_DROPDOWN_BY_UOM_SET_NAME,
            dropdownUom: []
        } );
    }
};


export const clearPackAllState = () => dispatch => {
    dispatch( {
        type: CLEAR_PACKAGING_ALL_STATE
    } );
};

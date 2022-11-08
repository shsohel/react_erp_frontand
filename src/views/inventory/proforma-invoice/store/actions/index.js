/* eslint-disable no-var */

import { notify } from "@custom/notifications";
import { baseAxios } from '@services';
import moment from "moment";
import { fileProgressAction } from "../../../../../redux/actions/file-progress";
import { inventoryApi } from '../../../../../services/api-end-points/inventory';
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { baseUrl, confirmObj, status } from '../../../../../utility/enums';
import { convertQueryString, isHaveDeferentObj, randomIdGenerator } from "../../../../../utility/Utils";
import { proformaInvoiceModel } from '../../model';
import { BIND_SELECTED_PROCUREMENT_ITEMS, BIND_SELECTED_SUPPLIER_ORDERS, CLEAR_ALL_PI_STATE, DELETE_PI, GET_PI_BY_ID, GET_PI_BY_QUERY, GET_PROCUREMENT_ITEMS, GET_SUPPLIER_ORDERS, IS_FILE_UPLOADED_COMPLETE, IS_PI_DATA_LOADED, IS_PI_DATA_PROGRESS } from '../action-types';


export const isPiDataLoad = () => ( dispatch, getState ) => {
    const { isPiDataLoaded } = getState().pis;
    dispatch( {
        type: IS_PI_DATA_LOADED,
        isPiDataLoaded: !isPiDataLoaded
    } );
};

export const piDataProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_PI_DATA_PROGRESS,
        isPiDataProgress: condition
    } );
};

//Get Data by Query
export const getPiByQuery = ( params, queryObj ) => async dispatch => {
    dispatch( isPiDataLoad() );
    const endPoint = `${inventoryApi.pi.root}/grid?${convertQueryString( params )}`;
    await baseAxios
        .post( endPoint, queryObj )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( isPiDataLoad() );
                dispatch( {
                    type: GET_PI_BY_QUERY,
                    pis: response.data.data,
                    totalPages: response.data.totalPages,
                    params,
                    queryObj
                } );
            }

        } ).catch( ( { response } ) => {
            console.log( response );
            dispatch( isPiDataLoad() );
            if ( response?.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else if ( response?.status === status.badRequest ) {
                // notify( 'warning', `${response.data.errors.join( ', ' )}` );
                notify( 'warning', `${response.data.errors}` );

            } else if ( response?.status === status.conflict ) {
                // notify( 'warning', `${response.data.errors.join( ', ' )}` );
                notify( 'warning', `${response.data.detail}` );

            }

        } );
};


export const getSupplierOrders = ( buyerId, supplierId, source ) => async ( dispatch, getState ) => {
    if ( supplierId ) {
        const endPoint = `api/inventory/buyers/${buyerId}/suppliers/${supplierId}/source/${source}/supplierOrders`;
        const f = "/api/inventory/buyers/{buyerId}/suppliers/{supplierId}/source/{source}/supplierOrders";
        await baseAxios
            .get( endPoint ).then( response => {
                const { selectedProcurementItems } = getState().pis;

                dispatch( {
                    type: GET_SUPPLIER_ORDERS,
                    supplierOrder: response.data.map( order => ( {
                        ...order,
                        fieldId: randomIdGenerator(),
                        isSelected: selectedProcurementItems
                            .some( sp => sp.supplierOrderId === order.id )
                    } ) )
                } );
            } );
    } else {
        dispatch( {
            type: GET_SUPPLIER_ORDERS,
            supplierOrder: []
        } );
    }
};
export const bindSupplierOrderOnChange = ( supplierOrder ) => async dispatch => {
    if ( supplierOrder ) {
        dispatch( {
            type: GET_SUPPLIER_ORDERS,
            supplierOrder
        } );
    } else {
        dispatch( {
            type: GET_SUPPLIER_ORDERS,
            supplierOrder: []
        } );
    }
};

export const bindSelectedSupplierOrders = ( selectedSupplierOrders ) => async dispatch => {
    console.log( selectedSupplierOrders.length );

    if ( selectedSupplierOrders.length > 0 ) {
        dispatch( {
            type: BIND_SELECTED_SUPPLIER_ORDERS,
            selectedSupplierOrders
        } );
    } else {
        dispatch( {
            type: BIND_SELECTED_SUPPLIER_ORDERS,
            selectedSupplierOrders
        } );
    }
};

export const getProcurementItemsByOrdersId = ( orderIds ) => async ( dispatch, getState ) => {
    if ( orderIds.length > 0 ) {
        const endPoint = `${inventoryApi.purchaseRequisition.root}/itemDetails`;
        await baseAxios
            .post( endPoint, orderIds ).then( response => {
                // console.log( 'items', JSON.stringify( response.data, null, 2 ) );
                const { selectedProcurementItems } = getState().pis;

                dispatch( {
                    type: GET_PROCUREMENT_ITEMS,
                    procurementItems: response.data.map( item => ( {
                        ...item,
                        rowId: randomIdGenerator(),
                        budgetNumber: item.budgetNumber ?? "NA",
                        isSelected: selectedProcurementItems
                            .some( s => s.itemName === item.itemName && s.itemCode === item.itemCode && s.supplierOrderId === item.supplierOrderId )
                    } ) )
                } );
            } );
    } else {
        dispatch( {
            type: GET_PROCUREMENT_ITEMS,
            procurementItems: []
        } );
    }
};

export const bindProcurementItems = ( procurementItems ) => async dispatch => {
    if ( procurementItems.length > 0 ) {
        dispatch( {
            type: GET_PROCUREMENT_ITEMS,
            procurementItems
        } );
    } else {
        dispatch( {
            type: GET_PROCUREMENT_ITEMS,
            procurementItems: []
        } );
    }
};

export const bindSelectedProcurementItems = ( selectedProcurementItems ) => async dispatch => {
    if ( selectedProcurementItems.length > 0 ) {
        dispatch( {
            type: BIND_SELECTED_PROCUREMENT_ITEMS,
            selectedProcurementItems
        } );
    } else {
        dispatch( {
            type: BIND_SELECTED_PROCUREMENT_ITEMS,
            selectedProcurementItems: []
        } );
    }
};


export const bindPiBasicInfo = ( piBasicInfo ) => async dispatch => {
    if ( piBasicInfo ) {
        await dispatch( {
            type: GET_PI_BY_ID,
            piBasicInfo
        } );
    } else {
        await dispatch( {
            type: GET_PI_BY_ID,
            piBasicInfo: proformaInvoiceModel
        } );
    }
};


export const getPiById = ( piId ) => async dispatch => {
    dispatch( piDataProgress( true ) );
    const endPoint = `${inventoryApi.pi.root}/${piId}`;
    await baseAxios
        .get( endPoint ).then( response => {
            if ( response.status === status.success ) {
                const { data } = response;

                const styleIdExitingItem = data.orderDetails.filter( item => item.styleId.length );
                const orderIdExitingItem = data.orderDetails.filter( item => item.supplierOrderId.length );

                const files = data.files.map( file => ( {
                    id: file.id,
                    rowId: randomIdGenerator(),
                    type: "IMAGE",
                    name: file.name,
                    category: null,
                    generatedName: '',
                    extension: file.fileExtension,
                    isDefault: false,
                    fileUrl: file.fileUrl

                } ) );
                const obj = {
                    ...data,
                    supplier: { value: data.supplierId, label: data.supplier },
                    buyer: data?.buyerId ? { value: data.buyerId, label: data.buyerName } : null,
                    piNumber: data.piNumber,
                    styleNo: styleIdExitingItem.length ? ( isHaveDeferentObj( 'styleId', styleIdExitingItem ) ? 'Multiple' : styleIdExitingItem[0]?.styleNumber ) : '',
                    supplierPO: orderIdExitingItem.length ? ( isHaveDeferentObj( 'supplierOrderId', orderIdExitingItem ) ? 'Multiple' : orderIdExitingItem[0]?.supplierOrderNumber ) : '',
                    piDate: moment( Date.parse( data.piDate ) ).format( "yy-MM-DD" ),
                    purchaser: data.purchaser ? { value: data.purchaser, label: data.purchaser } : null,
                    purpose: data.purpose ? { value: data.purpose, label: data.purpose } : null,
                    tradeTerm: data.tradeTerm ? { value: data.tradeTerm, label: data.tradeTerm } : null,
                    payTerm: data.payTerm ? { value: data.payTerm, label: data.payTerm } : null,
                    currency: data.currencyCode ? { value: data.currencyCode, label: data.currencyCode } : null,
                    conversionRate: data.currencyRate,
                    conversionCurrencyCode: '',
                    shipmentMode: data.shipmentMode ? { value: data.shipmentMode, label: data.shipmentMode } : null,
                    shipmentDate: moment( Date.parse( data.shipmentDate ) ).format( "yy-MM-DD" ),
                    itemValue: 0,
                    serviceCharge: data.serviceCharge,
                    additionalCharge: data.additionalCharge,
                    deductionAmount: data.deductionAmount,
                    piValue: 0,
                    source: { label: data?.source, value: data?.source },
                    status: data?.status ? { label: data?.status, value: data?.status } : null,
                    updateStatus: data?.status ? { label: data?.status, value: data?.status } : null,
                    files,
                    fileUrls: files.map( file => ( {
                        ...file,
                        fileUrl: `${baseUrl}/${file.fileUrl}`
                    } ) ),

                    sysId: data.sysId,
                    //   styleNo: '',
                    // supplierPO: '',
                    ///
                    supplierId: "",
                    /// currencyCode: "string",
                    /// currencyRate: 0,
                    etaDate: moment( Date.parse( data.etaDate ) ).format( "yy-MM-DD" ),
                    termsAndConditions: data?.termsAndConditions ?? "",
                    isDeleteItemExiting: false
                };

                dispatch( {
                    type: GET_PI_BY_ID,
                    piBasicInfo: obj
                } );


                const selectedProcurementItems = data.orderDetails.map( item => (
                    {
                        ...item,
                        detailId: randomIdGenerator(),
                        rowId: randomIdGenerator(),
                        itemCategory: item.category,
                        itemCategoryId: item.categoryId,
                        itemSubCategory: item.subCategory,
                        itemSubCategoryId: item.subCategoryId,
                        orderRate: item.rate,
                        isFieldError: false,
                        selected: false
                    }
                ) );
                const orderIds = selectedProcurementItems.map( order => order.supplierOrderId );

                const apiEndPoint = `${inventoryApi.purchaseRequisition.root}/itemDetails`;
                baseAxios
                    .post( apiEndPoint, orderIds ).then( response => {
                        if ( response.status === status.success ) {
                            const getRemainQty = ( supplierOrders, selectedPIItems ) => {
                                const remainQty = supplierOrders.find( i => i.itemId === selectedPIItems.itemId && i.supplierOrderId === selectedPIItems.supplierOrderId )?.quantityRemaining ?? 0;
                                const toFixedRemainingQty = Number( remainQty.toFixed( 4 ) );
                                return toFixedRemainingQty;
                            };
                            const updateRemainItem = selectedProcurementItems.map( s => ( {
                                ...s,
                                quantityRemaining: getRemainQty( response.data, s ),
                                orderQty: response.data.find( i => i.itemId === s.itemId && i.supplierOrderId === s.supplierOrderId )?.quantity ?? s.quantity
                            } ) );

                            dispatch( bindSelectedProcurementItems( updateRemainItem ) );
                            dispatch( piDataProgress( false ) );
                        }
                    } ).catch( ( { response } ) => {
                        dispatch( piDataProgress( false ) );
                        if ( response?.status === status.severError || response?.status === status.badRequest || response === undefined ) {
                            notify( 'error', `Please contact the support team!!!` );
                        }
                    } );
            }

        } ).catch( ( { response } ) => {
            dispatch( piDataProgress( false ) );
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

export const piStatusChange = ( piId, piStatus ) => dispatch => {
    dispatch( piDataProgress( true ) );
    const apiEndPoint = `${inventoryApi.pi.root}/${piId}/status`;
    baseAxios.put( apiEndPoint, { status: piStatus } ).then( response => {
        console.log( response );
        if ( response.status === status.success ) {
            notify( 'success', `The IPI has been updated successfully` );
            dispatch( getPiById( piId ) );

            dispatch( piDataProgress( false ) );

        }
    } ).catch( ( ( { response } ) => {
        dispatch( piDataProgress( false ) );

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

export const addPi = ( pi, push ) => async ( dispatch, getState ) => {
    dispatch( piDataProgress( true ) );
    const endPoint = `${inventoryApi.pi.root}`;
    await baseAxios.post( endPoint, pi )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', 'The PI has been added Successfully!' );
                // dispatch( getPiByQuery( getState().pis.params ) );
                push( { pathname: '/pi-details', state: response.data } );
                dispatch( piDataProgress( false ) );

            } else {
                notify( 'error', 'The PI has been added failed!' );
            }
        } ).catch( ( { response } ) => {
            dispatch( piDataProgress( false ) );
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

export const updatePi = ( pi, piId, piStatus, push ) => async dispatch => {
    dispatch( piDataProgress( true ) );
    const endPoint = `${inventoryApi.pi.root}/${piId}`;
    await baseAxios.put( endPoint, pi )
        .then( response => {
            if ( response.status === status.success ) {
                notify( 'success', 'The PI has been updated Successfully!' );
                //  dispatch( getPiByQuery( getState().pis.params ) );
                if ( piStatus === "Approved" ) {
                    push( { pathname: '/pi-details', state: piId } );
                } else {
                    dispatch( getPiById( piId ) );
                }
            } else {
                notify( 'error', 'The PI has been updated failed!' );
            }
        } ).catch( ( { response } ) => {
            dispatch( piDataProgress( false ) );
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


export const piFileUpload = ( fileObj ) => async ( dispatch, getState ) => {
    console.log( fileObj );
    dispatch( {
        type: IS_FILE_UPLOADED_COMPLETE,
        isFileUploadComplete: false
    } );
    const apiEndPoint = `/api/inventory/medias/upload/file`;
    const options = {
        onUploadProgress: ( progressEvent ) => {
            const { loaded, total } = progressEvent;
            const percent = Math.floor( ( loaded * 100 ) / total );
            console.log( percent );
            // console.log( ` ${loaded}kb of ${total}kb | ${percent} % ` );
            dispatch( fileProgressAction( percent ) );
            if ( percent < 100 ) {
                // eslint-disable-next-line no-invalid-this
                // this.setState( { uploadPercentage: percent } );
                //console.log( percent );
            }
        }
    };


    const formData = new FormData();
    for ( var key in fileObj ) {
        formData.append( key, fileObj[key] );
    }

    formData.append( 'File', fileObj.file, fileObj.file.name );

    // formData.append( 'IsDefault', file.isDefault );
    // formData.append( 'Category', '' );
    // formData.append( 'Description', '' );

    await baseAxios.post( apiEndPoint, formData, options )
        .then( response => {
            if ( response.status === status.success ) {
                const files = {
                    ...response.data,
                    id: 0,
                    rowId: randomIdGenerator()
                };
                const { piBasicInfo } = getState().pis;
                const updatedObj = {
                    ...piBasicInfo,
                    files: [...piBasicInfo.files, files],
                    fileUrls: [
                        ...piBasicInfo.fileUrls, {
                            fileUrl: URL.createObjectURL( fileObj.file ),
                            ...files
                        }
                    ]
                };
                dispatch( bindPiBasicInfo( updatedObj ) );
                dispatch( {
                    type: IS_FILE_UPLOADED_COMPLETE,
                    isFileUploadComplete: true
                } );
                dispatch( fileProgressAction( 0 ) );
            }

        } ).catch( e => {
            console.log( e );
            dispatch( {
                type: IS_FILE_UPLOADED_COMPLETE,
                isFileUploadComplete: true
            } );
            //    dispatch( fileProgressAction( 0 ) );

            notify( 'warning', 'Please contact with Support team!' );
        } );
};


export const getDataFromIPO = ( ipoId, push ) => async dispatch => {
    dispatch( piDataProgress( true ) );
    const endPoint = `${merchandisingApi.procurement.root}/${ipoId}`;
    await baseAxios.get( endPoint ).then( async response => {
        const { data } = response;
        if ( response.status === status.success ) {
            const obj = {
                ...proformaInvoiceModel,
                buyer: { value: data.buyerId, label: data.buyerName },

                supplier: { value: data.supplierId, label: data.supplierName },

                source: { label: data?.source, value: data?.source },

                currency: { value: data.currencyCode, label: data.currencyCode },
                conversionCurrencyCode: data.conversionCurrencyCode,
                conversionRate: data.conversionRate,

                shipmentDate: moment( data.receiveDate ).format( 'yyyy-MM-DD' ),

                shipmentMode: { value: data.shipmentMode, label: data.shipmentMode },
                tradeTerm: { value: data.shippingTerm, label: data.shippingTerm },


                termsAndConditions: data?.termsAndConditions,
                status: { value: data.status, label: data.status }
            };

            dispatch( bindPiBasicInfo( obj ) );

            const itemDetailsEndPoint = `${inventoryApi.purchaseRequisition.root}/itemDetails`;


            await baseAxios.post( itemDetailsEndPoint, [ipoId] ).then( res => {
                if ( res.status === status.success ) {


                    const items = res?.data?.map( item => ( {
                        ...item,
                        rowId: randomIdGenerator(),
                        budgetNumber: item.budgetNumber ?? "NA",
                        detailId: null,
                        orderQty: item.quantity,
                        quantity: item.quantityRemaining,
                        uom: item.orderUom,
                        amount: 0,
                        remarks: '',
                        isFieldError: false,
                        selected: false
                    } ) );
                    ///
                    dispatch( bindSelectedProcurementItems( items ) );
                    push( '/new-pi' );
                    dispatch( piDataProgress( false ) );

                }
            } ).catch( ( { response } ) => {
                dispatch( piDataProgress( false ) );
                if ( response?.status === status.severError || response?.status === status.badRequest || response === undefined ) {
                    notify( 'error', `Please contact the support team!!!` );
                }
            } );


        }
    } ).catch( ( { response } ) => {
        dispatch( piDataProgress( false ) );
        if ( response?.status === status.severError || response?.status === status.badRequest || response === undefined ) {
            notify( 'error', `Please contact the support team!!!` );
        }
    } );

};

export const deletePI = ( id ) => async ( dispatch, getState ) => {
    confirmDialog( confirmObj ).then( async e => {
        if ( e.isConfirmed ) {
            await baseAxios
                .delete( `${inventoryApi.pi.root}/${id}` )
                .then( response => {
                    if ( response.status === status.success ) {
                        const { params, queryObj } = getState().pis;

                        dispatch( {
                            type: DELETE_PI
                        } );
                        notify( 'success', 'The Procurement has been deleted Successfully!' );
                        dispatch( getPiByQuery( params, queryObj ) );
                    } else {
                        notify( 'error', 'The Procurement DELETE request has been failed!' );
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

export const piFileDelete = ( selectedFile ) => async ( dispatch, getState ) => {
    const { piBasicInfo } = getState().pis;
    const apiEndPoint = `${inventoryApi.pi.root}/${piBasicInfo?.id}/media/${selectedFile.id}`;
    if ( selectedFile.id === 0 ) {
        const updatedData = piBasicInfo.files.filter( f => f.rowId !== selectedFile.rowId );
        const updatedDataUrls = piBasicInfo.fileUrls.filter( f => f.rowId !== selectedFile.rowId );
        dispatch( bindPiBasicInfo(
            {
                ...piBasicInfo,
                files: updatedData,
                fileUrls: updatedDataUrls
            }
        ) );
        notify( 'success', 'The file has been removed successfully' );

    } else {
        await baseAxios.delete( apiEndPoint ).then( response => {
            if ( response.status === status.success ) {
                const updatedData = piBasicInfo.files.filter( f => f.id !== selectedFile.id );
                const updatedDataUrls = piBasicInfo.fileUrls.filter( f => f.id !== selectedFile.id );
                dispatch( bindPiBasicInfo(
                    {
                        ...piBasicInfo,
                        files: updatedData,
                        fileUrls: updatedDataUrls
                    }
                ) );
                notify( 'success', 'The file has been deleted successfully' );
            }
        } );
    }
};


const initialState = {
    isPiDataLoaded: true,
    pis: [],
    queryData: [],
    total: 1,
    params: {},
    piBasicInfo: proformaInvoiceModel,
    supplierOrder: [],
    selectedSupplierOrders: [],
    procurementItems: [],
    selectedProcurementItems: [],
    isFileUploadComplete: true
};
export const clearAllPIState = () => dispatch => {
    dispatch( {
        type: CLEAR_ALL_PI_STATE,
        ...initialState
    } );
};
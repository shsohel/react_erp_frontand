import { notify } from "@custom/notifications";
import { baseAxios } from '@services';
import moment from "moment";
import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { confirmObj, status } from '../../../../../utility/enums';
import { convertQueryString, isHaveDeferentObj, randomIdGenerator } from "../../../../../utility/Utils";
import { procurementBasicInfoModel } from "../../model";
import { BIND_ITEM_DETAILS_WITH_MIN_ORDER, BIND_PROCUREMENT_BASIC_INFO, BIND_PROCUREMENT_ITEMS, BIND_SELECTED_ITEMS_FOR_PROCUREMENT, CLEAR_PROCUREMENT_ALL_STATE, DELETE_PROCUREMENT, GET_PROCUREMENTS_BY_QUERY, GET_PROCUREMENT_BY_ID, GET_PROCUREMENT_DROP_DOWN, IS_PROCUREMENT_DATA_LOADED } from '../action-types';

import _ from 'lodash';
import { getBudgetBuyerPO } from "../../../budget/store/actions";

export const isProcurementDataLoad = ( condition ) => dispatch => {
  dispatch( {
    type: IS_PROCUREMENT_DATA_LOADED,
    isProcurementDataLoaded: condition
  } );
};


export const handleProcurementToPi = ( procurement ) => dispatch => {
  const obj = {
    orderNumber: procurement?.orderNumber,
    ipoId: procurement?.id
  };
  localStorage.setItem( 'IPO', JSON.stringify( obj ) );
};


//Get Data by Query
export const getProcurementByQuery = ( params, queryData ) => async dispatch => {
  dispatch( isProcurementDataLoad( false ) );
  await baseAxios
    .post( `${merchandisingApi.procurement.root}/grid?${convertQueryString( params )}`, queryData )
    .then( ( response ) => {
      if ( response.status === status.success ) {
        dispatch( isProcurementDataLoad( true ) );

        dispatch( {
          type: GET_PROCUREMENTS_BY_QUERY,
          procurements: response.data.data,
          totalPages: response.data.totalPages,
          params,
          queryObj: queryData
        } );
      }
    } ).catch( ( { response } ) => {
      console.log( response );
      dispatch( isProcurementDataLoad( true ) );
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
export const itemDetailsWithMinOrder = ( itemDetails ) => dispatch => {
  if ( itemDetails.length > 0 ) {
    const uniqueByItemSubGroupId = _.uniqWith(
      itemDetails,
      ( a, b ) => a.itemGroupId === b.itemGroupId &&
        a.itemSubGroupId === b.itemSubGroupId &&
        a.itemName === b.itemName
    );

    const getTotalMinOrderQty = ( uniqData ) => {
      return _.sum( itemDetails.filter( item => item.itemSubGroupId === uniqData.itemSubGroupId &&
        item.itemGroupId === uniqData.itemGroupId &&
        item.itemName === uniqData.itemName
      ).map( item => item.minCountableOrderQuantity ) );
    };
    const getTotalOrderQty = ( uniqData ) => {
      return _.sum( itemDetails.filter( item => item.itemSubGroupId === uniqData.itemSubGroupId &&
        item.itemGroupId === uniqData.itemGroupId &&
        item.itemName === uniqData.itemName &&
        item.budgetId.length ).map( item => item.minCountableOrderQuantity ) );
    };

    const buyerBudgetItemDetails = uniqueByItemSubGroupId.map( uniqData => ( {
      groupType: uniqData.groupType,
      itemSubGroupId: uniqData.itemSubGroupId,
      itemSubGroup: uniqData.itemSubGroup,
      itemGroup: uniqData.itemGroup,
      itemGroupId: uniqData.itemGroupId,
      itemId: uniqData.itemId,
      itemName: uniqData.itemName,
      itemNumber: uniqData.itemNumber,
      orderUomRelativeFactor: uniqData.orderUomRelativeFactor,
      bomUomRelativeFactor: uniqData.bomUomRelativeFactor,
      bomUom: uniqData.bomUom,
      rowId: randomIdGenerator(),
      totalOrderQty: Number( ( getTotalOrderQty( uniqData ) ).toFixed( 4 ) ),
      minOrderQty: Number( ( getTotalMinOrderQty( uniqData ) ).toFixed( 4 ) )
    } ) );

    dispatch( {
      type: BIND_ITEM_DETAILS_WITH_MIN_ORDER,
      itemDetailsWithMinOder: buyerBudgetItemDetails
    } );
  } else {
    dispatch( {
      type: BIND_ITEM_DETAILS_WITH_MIN_ORDER,
      itemDetailsWithMinOder: []
    } );
  }
};
export const bindItemDetailsWithMinOrder = ( itemDetails ) => dispatch => {
  if ( itemDetails ) {
    dispatch( {
      type: BIND_ITEM_DETAILS_WITH_MIN_ORDER,
      itemDetailsWithMinOder: itemDetails
    } );
  } else {
    dispatch( {
      type: BIND_ITEM_DETAILS_WITH_MIN_ORDER,
      itemDetailsWithMinOder: []
    } );
  }
};
export const getProcurementById = ( procurementId ) => async ( dispatch, getState ) => {
  dispatch( isProcurementDataLoad( false ) );
  if ( procurementId ) {
    const endPoint = `${merchandisingApi.procurement.root}/${procurementId}`;
    await baseAxios.get( endPoint ).then( response => {
      if ( response.status === status.success ) {
        const { data } = response;
        const findRelativeFactorIsZero = ( item ) => {
          const findItem = data?.details?.find( i => i.itemCode === item.itemCode );
          const { bomUomRelativeFactor } = findItem;
          return bomUomRelativeFactor;

        };
        const selectedProcurementSelectedItems = data?.details ? data?.details?.map( detail => ( {
          id: detail.id,
          rowId: randomIdGenerator(),
          supplierOrderId: detail.supplierOrderId,
          budgetId: detail.budgetId ?? "",
          budgetNumber: detail.budgetNumber,
          orderId: detail.orderId ?? "",
          orderNumber: detail.orderNumber,
          styleId: detail.styleId ?? "",
          styleNumber: detail.styleNumber,
          itemGroupId: detail.itemCategoryId,
          itemGroup: detail.itemCategory,
          itemSubGroupId: detail.itemSubCategoryId,
          itemSubGroup: detail.itemSubCategory,
          itemNumber: detail.itemCode,
          itemId: detail.itemId,
          itemName: detail.itemName,
          bomUom: detail.bomUom,
          uoms: [],
          bomQuantity: detail.bomQuantityOnOrderUom,
          bomRatePerUnit: detail.bomRate,
          orderUom: detail.orderUom ? { value: detail.orderUom, label: detail.orderUom } : null,
          orderQuantity: detail.orderQuantity,

          minCountableOrderQuantity: ( detail.orderUomRelativeFactor / ( detail.bomUomRelativeFactor === 0 ? findRelativeFactorIsZero( detail ) : detail.bomUomRelativeFactor ) ) * detail.orderQuantity,

          orderUomRelativeFactor: detail.orderUomRelativeFactor,
          bomUomRelativeFactor: detail.bomUomRelativeFactor === 0 ? findRelativeFactorIsZero( detail ) : detail.bomUomRelativeFactor,
          orderRate: detail.orderRate,

          baseBomRate: detail.bomRate / detail.bomUomRelativeFactor,
          baseOrderRate: detail.orderRate / detail.orderUomRelativeFactor,

          // balanceToRaised: Math.round( detail.bomQuantityOnOrderUom ) - Math.round( detail.totalOrderQuantity ),
          balanceToRaised: detail.bomQuantityOnOrderUom - detail.totalOrderQuantity,
          totalOrderQuantity: detail.totalOrderQuantity,
          amount: detail.amount,
          remarks: detail.remarks ?? '',
          selected: false
        } ) ) : [];

        const budgetIdExitingItem = selectedProcurementSelectedItems.filter( item => item.budgetId.length );
        const styleIdExitingItem = selectedProcurementSelectedItems.filter( item => item.styleId.length );
        const orderIdExitingItem = selectedProcurementSelectedItems.filter( item => item.orderId.length );


        const procurementBasicInfo = {
          ...data,
          id: data.id,
          sysId: data.sysId,
          orderNumber: data.orderNumber,
          budgetNo: budgetIdExitingItem.length ? ( isHaveDeferentObj( 'budgetId', budgetIdExitingItem ) ? 'Multiple' : budgetIdExitingItem[0]?.budgetNumber ) : '',
          styleNo: styleIdExitingItem.length ? ( isHaveDeferentObj( 'styleId', styleIdExitingItem ) ? 'Multiple' : styleIdExitingItem[0]?.styleNumber ) : '',
          exportedPONo: orderIdExitingItem.length ? ( isHaveDeferentObj( 'orderId', orderIdExitingItem ) ? 'Multiple' : orderIdExitingItem[0]?.orderNumber ) : '',
          subGroup: selectedProcurementSelectedItems.length ? ( isHaveDeferentObj( 'itemSubGroupId', selectedProcurementSelectedItems ) ? 'Multiple' : selectedProcurementSelectedItems[0]?.itemSubGroup ) : '',
          // poNumber: { label: data.orderNumber, value: data.orderId },
          buyer: { label: data.buyerName, value: data.buyerId },
          supplier: { label: data.supplierName, value: data.supplierId },
          warehouse: { label: data.warehouseName, value: data.warehouseId },
          orderNature: data.orderNature ? { label: data.orderNature, value: data.orderNature } : null,
          totalAmount: data.totalAmount,
          isNormalOrder: data.isNormalOrder,
          ///NOt Found
          budget: [],
          itemGroupType: { label: data.orderFor, value: data.orderFor },
          orderDate: moment( data.orderDate ).format( 'yyyy-MM-DD' ),
          receivedDate: moment( data.receiveDate ).format( 'yyyy-MM-DD' ),
          currency: { label: data.currencyCode, value: data.currencyCode },
          shipmentMode: { label: data.shipmentMode, value: data.shipmentMode },
          serviceChargeAmount: data.serviceChargeAmount,
          additionalChargeAmount: data.additionalChargeAmount,
          deductionAmount: data.deductionAmount,
          conversionRate: data.conversionRate,
          conversionCurrencyCode: data.conversionCurrencyCode,
          shippingTerm: { label: data.shippingTerm, value: data.shippingTerm },
          payTerm: { label: data?.payTerm, value: data?.payTerm },
          source: { label: data?.source, value: data?.source },
          remarks: data.remarks ?? "",
          termsAndConditions: data.termsAndConditions ?? '',
          status: { label: data?.status, value: data?.status },
          updateStatus: { label: data?.status, value: data?.status },
          purchaser: data?.purchaser ? { label: data?.purchaser, value: data?.purchaser } : null,
          isDeleteItemExiting: false
        };

        dispatch( {
          type: GET_PROCUREMENT_BY_ID,
          procurementBasicInfo,
          selectedProcurementSelectedItems,
          procurementItems: []
        } );
        dispatch( itemDetailsWithMinOrder( selectedProcurementSelectedItems ) );
        dispatch( isProcurementDataLoad( true ) );
        dispatch( getBudgetBuyerPO( null ) );
      }
    } ).catch( ( { response } ) => {
      dispatch( isProcurementDataLoad( true ) );
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
  } else {
    dispatch( {
      type: GET_PROCUREMENT_BY_ID,
      procurementBasicInfo: procurementBasicInfoModel,
      selectedProcurementSelectedItems: [],
      procurementItems: []

    } );
    dispatch( itemDetailsWithMinOrder( [] ) );
  }

};

export const getNormalProcurementById = ( procurementId ) => async dispatch => {
  dispatch( isProcurementDataLoad( false ) );

  if ( procurementId ) {
    const endPoint = `${merchandisingApi.procurement.root}/${procurementId}`;
    await baseAxios.get( endPoint ).then( response => {
      console.log( response.data );
      const { data } = response;
      const { details } = response.data;
      const procurementItems = data?.details ? data?.details?.map( detail => ( {
        id: detail.id,
        style: detail.styleId ? { value: detail.styleId, label: detail.styleNumber } : null,
        styleId: detail.styleId,
        styleNumber: detail.styleNumber,
        itemGroupId: detail.itemCategoryId,
        itemGroup: { label: detail.itemCategory, value: detail.itemCategoryId },
        itemGroupName: detail.itemCategory,
        itemSubGroupId: detail.itemSubCategoryId,
        itemSubGroup: { label: detail.itemSubCategory, value: detail.itemSubCategoryId },
        itemSubGroupName: detail.itemSubCategory,
        items: [],
        item: { value: detail.itemId, label: detail.itemName },

        orderUom: { value: detail.orderUom, label: detail.orderUom },
        orderUoms: [],
        isEditable: false,
        rowId: randomIdGenerator(),
        supplierOrderId: detail.supplierOrderId,
        budgetId: detail.budgetId ?? '',
        budgetNumber: detail.budgetNumber,
        orderId: detail.orderId ?? '',
        orderNumber: detail.orderNumber,
        groupType: detail.groupType,
        orderUomRelativeFactor: detail.orderUomRelativeFactor,
        itemNumber: detail.itemCode,
        itemId: detail.itemId,
        itemName: detail.itemName,
        itemCode: detail.itemCode,
        uom: detail.uom,
        bomQuantity: detail.quantity,
        bomRatePerUnit: detail.rate,
        orderQuantity: detail.orderQuantity,
        orderRate: detail.orderRate,
        minOrderQuantity: detail.minOrderQuantity,
        amount: detail.amount,
        remarks: detail.remarks,
        isFieldError: false,
        selected: false
      } ) ) : [];

      const styleIdExitingItem = procurementItems.filter( item => item.styleId.length );

      console.log( data );
      const procurementBasicInfo = {
        ...data,
        id: data.id,
        sysId: data.sysId,
        styleNo: styleIdExitingItem.length ? ( isHaveDeferentObj( 'styleId', styleIdExitingItem ) ? 'Multiple' : styleIdExitingItem[0]?.styleNumber ) : '',
        orderNumber: data.orderNumber,
        // orderNumber: { label: data.orderNumber, value: data.orderId },
        buyer: { label: data.buyerName, value: data.buyerId },
        supplier: { label: data.supplierName, value: data.supplierId },
        warehouse: { label: data.warehouseName, value: data.warehouseId },
        orderNature: { label: data.orderNature, value: data.orderNature },
        totalAmount: data.totalAmount,
        isNormalOrder: data.isNormalOrder,
        ///NOt Found
        budget: [],
        itemGroupType: { label: data.orderFor, value: data.orderFor },
        orderDate: moment( data.orderDate ).format( 'yyyy-MM-DD' ),
        receivedDate: moment( data.receiveDate ).format( 'yyyy-MM-DD' ),
        currency: { label: data.currencyCode, value: data.currencyCode },
        shipmentMode: { label: data.shipmentMode, value: data.shipmentMode },
        serviceChargeAmount: data.serviceChargeAmount,
        additionalChargeAmount: data.additionalChargeAmount,
        deductionAmount: data.deductionAmount,
        conversionRate: data.conversionRate,
        conversionCurrencyCode: data.conversionCurrencyCode,
        shippingTerm: { label: data.shippingTerm, value: data.shippingTerm },
        payTerm: { label: data?.payTerm, value: data?.payTerm },
        source: { label: data?.source, value: data?.source },
        remarks: data.remarks,
        termsAndConditions: data.termsAndConditions ?? '',
        status: { value: data.status, label: data.status },
        updateStatus: { value: data.status, label: data.status },
        purchaser: data?.purchaser ? { label: data?.purchaser, value: data?.purchaser } : null
      };

      dispatch( {
        type: GET_PROCUREMENT_BY_ID,
        procurementBasicInfo,
        selectedProcurementSelectedItems: [],
        procurementItems
      } );
      dispatch( isProcurementDataLoad( true ) );

    } ).catch( ( { response } ) => {
      dispatch( isProcurementDataLoad( true ) );
      if ( response?.status === status.severError || response === undefined ) {
        notify( 'error', `Please contact the support team!!!` );
      } else if ( response?.status === status.badRequest ) {
        // notify( 'warning', `${response.data.errors.join( ', ' )}` );
        notify( 'warning', `${response?.data?.errors}` );

      } else if ( response?.status === status.conflict ) {
        // notify( 'warning', `${response.data.errors.join( ', ' )}` );
        notify( 'warning', `${response?.data.detail}` );

      }

    } );
  } else {
    dispatch( {
      type: GET_PROCUREMENT_BY_ID,
      procurementBasicInfo: procurementBasicInfoModel,
      selectedProcurementSelectedItems: [],
      procurementItems: []

    } );
  }

};

export const bindSelectedItemsForProcurement = ( selectedProcurementSelectedItems ) => dispatch => {
  if ( selectedProcurementSelectedItems ) {
    dispatch( {
      type: BIND_SELECTED_ITEMS_FOR_PROCUREMENT,
      selectedProcurementSelectedItems
    } );
  } else {
    dispatch( {
      type: BIND_SELECTED_ITEMS_FOR_PROCUREMENT,
      selectedProcurementSelectedItems: []
    } );
  }
};


export const bindProcurementItems = ( procurementItems ) => dispatch => {
  console.log( 'h' );
  if ( procurementItems.length > 0 ) {
    dispatch( {
      type: BIND_PROCUREMENT_ITEMS,
      procurementItems
    } );
  } else {
    dispatch( {
      type: BIND_PROCUREMENT_ITEMS,
      procurementItems: []
    } );
  }
};

export const bindProcurementBasicInfo = ( procurementBasicInfo ) => dispatch => {
  if ( procurementBasicInfo ) {
    dispatch( {
      type: BIND_PROCUREMENT_BASIC_INFO,
      procurementBasicInfo
    } );
  } else {
    dispatch( {
      type: BIND_PROCUREMENT_BASIC_INFO,
      procurementBasicInfo: procurementBasicInfoModel
    } );
  }
};

export const getProcurementDropdown = () => async dispatch => {
  await baseAxios
    .post( `${merchandisingApi.procurement.root}/grid`, [] )
    .then( ( response ) => {
      if ( response.status === status.success ) {
        console.log( response );
        const procurementDropdown = response.data?.data?.map( procurement => ( {
          label: procurement.orderNumber,
          value: procurement.id
        } ) );
        dispatch( {
          type: GET_PROCUREMENT_DROP_DOWN,
          procurementDropdown
        } );
      }
    } ).catch( ( { response } ) => {
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


export const procurementStatusChange = ( procurementId, procurementStatus, type ) => dispatch => {
  dispatch( isProcurementDataLoad( false ) );
  const apiEndPoint = `${merchandisingApi.procurement.root}/${procurementId}/status`;
  baseAxios.put( apiEndPoint, { status: procurementStatus } ).then( response => {
    console.log( response );
    if ( response.status === status.success ) {
      notify( 'success', `The IPO has been updated successfully` );
      if ( type === "Independent" ) {
        dispatch( getNormalProcurementById( procurementId ) );
      } else {
        dispatch( getProcurementById( procurementId ) );

      }
      // dispatch( isProcurementDataLoad( true ) );

    }
  } ).catch( ( ( { response } ) => {
    dispatch( isProcurementDataLoad( true ) );

    if ( response.status === status.badRequest ) {
      notify( 'errors', response.data.errors );
    } else if ( response.status === status.notFound || response.status === status.severError ) {
      notify( 'error', 'Please contact with Software Developer!' );
    } else if ( response.status === status.conflict ) {
      notify( 'warning', `${response.statusText}` );
    }
  } ) );
};


export const addProcurement = ( procurement, push, type ) => async ( dispatch, getState ) => {
  await baseAxios.post( `${merchandisingApi.procurement.root}`, procurement )
    .then( response => {
      if ( response.status === status.success ) {
        notify( 'success', 'The Procurement has been added Successfully!' );
        //  dispatch( getProcurementByQuery( getState().procurements.params ) );
        if ( type === "Normal" ) {
          push( { pathname: `/independent-procurement-details`, state: `${response.data}` } );
        } else {
          push( { pathname: `/procurement-details`, state: `${response.data}` } );
        }

      } else {
        notify( 'error', 'The Procurement has been added failed!' );
      }
    } ).catch( ( { response } ) => {
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
export const updateProcurement = ( procurement, procurementId, type, procurementStatus, push ) => async ( dispatch, getState ) => {
  dispatch( isProcurementDataLoad( false ) );

  await baseAxios.put( `${merchandisingApi.procurement.root}/${procurementId}`, procurement )
    .then( response => {
      if ( response.status === status.success ) {
        notify( 'success', 'The Procurement has been updated Successfully!' );
        // dispatch( getProcurementByQuery( getState().procurements.params ) );
        if ( type === "Normal" ) {
          if ( procurementStatus === "Approved" ) {
            push( { pathname: '/independent-procurement-details', state: procurementId } );
          } else {
            dispatch( getNormalProcurementById( procurementId ) );
          }
        } else {
          if ( procurementStatus === "Approved" ) {
            push( { pathname: '/procurement-details', state: procurementId } );
          } else {
            dispatch( getProcurementById( procurementId ) );
          }
        }
        //   dispatch( isProcurementDataLoad( true ) );

      } else {
        notify( 'error', 'The Procurement has been updated failed!' );
      }
    } ).catch( ( { response } ) => {
      dispatch( isProcurementDataLoad( true ) );
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

export const deleteProcurement = ( id ) => async ( dispatch, getState ) => {
  confirmDialog( confirmObj ).then( async e => {
    if ( e.isConfirmed ) {
      await baseAxios
        .delete( `${merchandisingApi.procurement.root}/${id}` )
        .then( response => {
          if ( response.status === status.success ) {
            const { params, queryObj } = getState().procurements;

            dispatch( {
              type: DELETE_PROCUREMENT
            } );
            notify( 'success', 'The Procurement has been deleted Successfully!' );
            dispatch( getProcurementByQuery( params, queryObj ) );
          } else {
            notify( 'error', 'The Procurement DELETE request has been failed!' );
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
    }
  } );

};


export const clearAllProcurementState = () => async dispatch => {
  await dispatch( {
    type: CLEAR_PROCUREMENT_ALL_STATE
  } );
};
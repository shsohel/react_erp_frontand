import '@custom-styles/merchandising/form/procurement-form.scss';
import '@custom-styles/merchandising/others/custom-tab.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { MoreHorizontal, Search } from 'react-feather';
import { useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Input, Label, NavItem, NavLink, Row } from 'reactstrap';
import * as yup from 'yup';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { notify } from '../../../../utility/custom/notifications';
import { itemGroupType, procurementStatus, selectPurchaser, selectPurchaseTerm, selectShipmentMode, selectTerm, source } from '../../../../utility/enums';
import { duplicateItemsOfArray, isHaveDeferentObj, isPermit, isZeroToFixed, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownItemGroups } from '../../../inventory/item-group/store/actions';
import { getVendorDropdown } from '../../../inventory/vendor/store/actions';
import { getWarehouseDropdown } from '../../../inventory/warehouse/store/actions';
import { getBudgetBuyerPO, getBudgetItems, getBuyerBudgetsDropdown } from '../../budget/store/actions';
import { getDropDownBuyers } from '../../buyer/store/actions';
import { getCurrencyDropdown } from '../../currency/store/actions';
import { addProcurement, bindProcurementBasicInfo, bindSelectedItemsForProcurement, getProcurementById } from '../store/actions';
import ProcurementItemDetailForm from './ProcurementItemDetailForm';
import ProcurementOrderItemModal from './ProcurementOrderItemModal';
import ProcurementSearchableListModal from './ProcurementSearchableListModal';
import SupplierModal from './SupplierModal';
const breadcrumb = [
  {
    id: 'home',
    name: 'Home',
    link: '/',
    isActive: false
  },
  {
    id: 'procurements',
    name: 'IPO List',
    link: '/procurements',
    isActive: false
  }
];


const ProcurementAdd = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();

  const {
    selectedProcurementSelectedItems,
    procurementBasicInfo
  } = useSelector( ( { procurements } ) => procurements );

  const { vendorDropdown } = useSelector( ( { vendors } ) => vendors );
  const { warehouseDropdown } = useSelector( ( { warehouses } ) => warehouses );
  const { currencyDropdown } = useSelector( ( { currencies } ) => currencies );
  const { dropDownBuyers } = useSelector( ( { buyers } ) => buyers );

  const { userPermission } = useSelector( ( { auth } ) => auth );
  const { authPermissions } = useSelector( ( { permissions } ) => permissions );

  const [openPurchaseOrderAndItemModal, setOpenPurchaseOrderAndItemModal] = useState( false );

  const [openSupplierModal, setOpenSupplierModal] = useState( false );
  const [searchMOdalOpen, setSearchMOdalOpen] = useState( false );

  ///For Validation Start
  const SignupSchema = yup.object().shape( {
    buyer: procurementBasicInfo?.buyer ? yup.string() : yup.string().required( 'Buyer Term is Required!!' ),
    supplier: procurementBasicInfo?.supplier ? yup.string() : yup.string().required( 'Supplier Term is Required!!' ),
    itemGroupType: procurementBasicInfo?.itemGroupType ? yup.string() : yup.string().required( 'Item Group Type Term is Required!!' ),
    shipmentMode: procurementBasicInfo?.shipmentMode ? yup.string() : yup.string().required( 'Shipment Mode is Required!!' ),
    currency: procurementBasicInfo?.currency ? yup.string() : yup.string().required( 'Currency is Required!!' ),
    warehouse: procurementBasicInfo?.warehouse ? yup.string() : yup.string().required( 'Warehouse is Required!!' ),
    source: procurementBasicInfo?.source ? yup.string() : yup.string().required( 'Source is Required!!' ),
    shippingTerm: procurementBasicInfo?.shippingTerm ? yup.string() : yup.string().required( 'Shipping Term is Required!!' ),
    orderNature: procurementBasicInfo?.orderNature ? yup.string() : yup.string().required( 'Requisition Nature is Required!!' ),
    status: procurementBasicInfo?.status ? yup.string() : yup.string().required( 'Status is Required!!' )
  } );


  const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );
  ///For Validation End


  useEffect( () => {
    dispatch( getDropDownItemGroups() );
  }, [] );

  const handleBuyerDropdownOnFocus = () => {
    dispatch( getDropDownBuyers() );
  };
  const handleVendorDropdownOnFocus = () => {
    dispatch( getVendorDropdown() );
  };

  const handleWarehouseDropdownOnFocus = () => {
    dispatch( getWarehouseDropdown() );
  };

  const handleCurrencyDropdownOnFocus = () => {
    dispatch( getCurrencyDropdown() );
  };

  const handleSupplierModalOpen = () => {
    setOpenSupplierModal( !openSupplierModal );
    dispatch( getVendorDropdown() );

  };

  const handleSearchModalOpen = () => {
    setSearchMOdalOpen( !searchMOdalOpen );
  };

  const handleBasicInfoDropdownChange = ( data, e ) => {
    const { name } = e;
    if ( name === 'currency' ) {
      const updatedObj = {
        ...procurementBasicInfo,
        [name]: data,
        ['conversionRate']: data?.conversionRate ?? 0,
        ['conversionCurrencyCode']: currencyDropdown?.find( cc => cc.isBaseCurrency === true )?.label
      };
      dispatch( bindProcurementBasicInfo( updatedObj ) );

    } else if ( name === 'buyer' ) {
      const updatedObj = {
        ...procurementBasicInfo,
        budget: [],
        [name]: data
      };
      dispatch( bindProcurementBasicInfo( updatedObj ) );
      if ( !procurementBasicInfo?.isNormalOrder ) {
        dispatch( getBuyerBudgetsDropdown( data?.value ) );
      }
      dispatch( getBudgetBuyerPO( null ) );
      dispatch( getBudgetItems( null ) );
      //   dispatch( bindSelectedProcurementItems( [] ) );
      dispatch( bindSelectedItemsForProcurement( null ) );

    } else {
      const updatedObj = {
        ...procurementBasicInfo,
        [name]: data
      };
      dispatch( bindProcurementBasicInfo( updatedObj ) );
    }

  };

  const handleBasicInfoInputOnChange = ( e ) => {
    const { name, value, checked, type } = e.target;
    const isName = name === 'serviceChargeAmount' || name === "additionalChargeAmount" || name === "deductionAmount";

    if ( value !== '.' ) {
      const updatedObj = {
        ...procurementBasicInfo,
        [name]: isName ? Number( value ) : type === 'date' ? moment( value ).format( 'yy-MM-DD' ) : type === "checkbox" ? checked : value
      };
      dispatch( bindProcurementBasicInfo( updatedObj ) );
    }
  };


  const handlePurchaseOrderModalOpen = () => {
    setOpenPurchaseOrderAndItemModal( !openPurchaseOrderAndItemModal );
  };

  const onSubmit = () => {
    const submitObj = {
      orderNumber: procurementBasicInfo?.orderNumber,
      supplierId: procurementBasicInfo?.supplier?.value,
      buyerId: procurementBasicInfo?.buyer?.value,
      warehouseId: procurementBasicInfo?.warehouse?.value,
      buyerName: procurementBasicInfo?.buyer?.label,
      orderDate: procurementBasicInfo?.orderDate,
      receiveDate: procurementBasicInfo?.receivedDate,
      shippingTerm: procurementBasicInfo?.shippingTerm?.label,
      shipmentMode: procurementBasicInfo?.shipmentMode?.label,
      payTerm: procurementBasicInfo?.payTerm?.label,
      source: procurementBasicInfo?.source?.value,
      currencyCode: procurementBasicInfo?.currency?.label,
      conversionCurrencyCode: procurementBasicInfo?.conversionCurrencyCode,
      conversionRate: procurementBasicInfo?.conversionRate,
      serviceChargeAmount: procurementBasicInfo?.serviceChargeAmount,
      additionalChargeAmount: procurementBasicInfo?.additionalChargeAmount,
      deductionAmount: procurementBasicInfo?.deductionAmount,
      isNormalOrder: procurementBasicInfo?.isNormalOrder,
      termsAndConditions: procurementBasicInfo?.termsAndConditions,
      orderNature: procurementBasicInfo?.orderNature?.label,
      orderFor: procurementBasicInfo.itemGroupType?.value,
      status: procurementBasicInfo?.status?.label,
      purchaser: procurementBasicInfo?.purchaser?.label,

      details: selectedProcurementSelectedItems.map( ( detail, index ) => ( {
        rowNo: index + 1,
        budgetId: detail.budgetId.length ? detail.budgetId : null,
        budgetNumber: detail.budgetNumber,
        orderId: detail.orderId.length ? detail.orderId : null,
        orderNumber: detail.orderNumber,
        styleId: detail.styleId.length ? detail.styleId : null,
        styleNumber: detail.styleNumber,
        itemCategoryId: detail.itemGroupId,
        itemSubCategoryId: detail.itemSubGroupId,
        itemId: detail.itemId,
        itemCode: detail.itemNumber,
        itemName: detail.itemName,
        bomUom: detail.bomUom,
        bomRate: detail.bomRatePerUnit,
        bomQuantity: detail.bomQuantity,
        orderUom: detail.orderUom?.label,
        orderQuantity: Number( detail.orderQuantity ),
        orderRate: detail.orderRate,
        //minOrderQuantity: detail.minOrderQuantity,
        amount: detail.orderRate * detail.orderQuantity,
        remarks: detail.remarks,
        bomUomRelativeFactor: detail.bomUomRelativeFactor,
        //   bomRate: 0,
        //   bomQuantity: 0,
        orderUomRelativeFactor: detail.orderUomRelativeFactor
      } ) )
    };

    console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );

    if ( submitObj.details.length ) {
      //Filter Duplicate Item of Array by Item Id
      const duplicateArray = duplicateItemsOfArray( 'itemId', submitObj.details );
      console.log( duplicateArray );
      // console.log( duplicateArray );

      //After find duplicate items , then check Order UOM same of those Items by Order UOM
      const isDeferent = isHaveDeferentObj( 'orderUom', duplicateArray );

      if ( !isDeferent ) {
        dispatch( addProcurement( submitObj, push, '' ) );
        // console.log( 'I am ready to Post' );
      } else {
        notify( 'warning', 'Same item never expect deferent Order UOM!!!' );
      }
    } else {
      notify( 'warning', 'Please add at least an item!!!' );
    }

  };


  ///Total Order Qty Show Up
  const totalItemValue = () => {
    const total = _.sum( selectedProcurementSelectedItems.map( item => item.minCountableOrderQuantity * item.orderRate ) );
    return total;
  };
  const totalPOvalue = () => {
    const total = ( totalItemValue() + procurementBasicInfo?.serviceChargeAmount + procurementBasicInfo?.additionalChargeAmount ) - procurementBasicInfo?.deductionAmount;
    return total;
  };
  const handleCancel = () => {
    dispatch( getProcurementById( null ) );

    push( '/procurements' );
  };


  return <div>
    <ActionMenu breadcrumb={breadcrumb} title='New IPO' >
      <NavItem className="mr-1" >
        <NavLink
          tag={Button}
          size="sm"
          color="primary"
          type="submit"
          onClick={handleSubmit( onSubmit )}
        >Save</NavLink>
      </NavItem>
      <NavItem className="mr-1" >
        <NavLink
          tag={Button}
          size="sm"
          color="secondary"
          onClick={() => { handleCancel(); }}
        >
          Cancel
        </NavLink>
      </NavItem>
    </ActionMenu>
    <Card className="mt-3 ipo-form">
      <CardBody>
        <Row>
          <Col>
            {/* <div className='font-weight-bolder'>
              <span>Direction: </span>
              <span>
                <Button.Ripple
                  className='btn-icon '
                  outline
                  size="sm"
                  color='secondary'

                >
                  <MoreHorizontal size={16} />
                </Button.Ripple>
              </span>
              <span> for Buyer Purchase Order and Items Modal</span>
            </div> */}
            <div className='divider divider-left '>
              <div className='divider-text text-secondary font-weight-bolder'>Procurement Info</div>
            </div>
            <div className="border rounded rounded-3 p-1">
              <Row>
                <Col>
                  <Row>
                    <Col xs={12} sm={12} md={6} lg={3} xl={3} xxl={3}>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='poId'> IPO ID</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-input-group'>
                          <div className='custom-input-group-prepend inside-btn'>
                            <Input
                              type="text"
                              name="sysId"
                              bsSize="sm"
                              disabled
                              value={procurementBasicInfo?.sysId}
                              onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                              onFocus={( e ) => e.target.select()}
                            />
                          </div>
                          <div className='custom-input-group-append inside-btn'>
                            <Button.Ripple
                              className='btn-icon'
                              outline
                              size="sm"
                              color='secondary'
                              onClick={() => { handleSearchModalOpen(); }}
                            >
                              <Search size={16} />
                            </Button.Ripple>
                          </div>
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='supplierId'> IPO NO</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Input
                            type="text"
                            name="orderNumber"
                            bsSize="sm"
                            value={procurementBasicInfo?.orderNumber}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            onFocus={( e ) => e.target.select()}
                          />
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='supplierId'> Supplier <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className={procurementBasicInfo?.isNormalOrder ? 'custom-form-group' : 'custom-form-input-group'}>
                          <div className='custom-input-group-prepend inside-btn'>
                            <Select
                              id='supplierId'
                              name="supplier"
                              isSearchable
                              menuPosition="fixed"
                              isClearable
                              theme={selectThemeColors}
                              options={vendorDropdown}
                              classNamePrefix='dropdown'
                              className={classnames( `erp-dropdown-select ${( errors && errors.supplier && !procurementBasicInfo?.supplier ) && 'is-invalid'}` )}
                              innerRef={register( { required: true } )}
                              value={procurementBasicInfo?.supplier}
                              onChange={( data, e ) => {
                                handleBasicInfoDropdownChange( data, e );
                              }}
                              onFocus={() => { handleVendorDropdownOnFocus(); }}
                            />
                          </div>
                          <div className='custom-input-group-append inside-btn'>
                            <Button.Ripple
                              className='btn-icon'
                              outline
                              size="sm"
                              color='secondary'
                              onClick={() => { handleSupplierModalOpen(); }}
                            >
                              <Search size={16} />
                            </Button.Ripple>
                          </div>
                        </div>
                      </div>


                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='itemGroupTypId'>Item Group Type<span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Select
                            id='itemGroupTypId'
                            name="itemGroupType"
                            isSearchable
                            menuPosition="fixed"
                            theme={selectThemeColors}
                            options={itemGroupType}
                            classNamePrefix='dropdown'
                            innerRef={register( { required: true } )}
                            className={classnames( `erp-dropdown-select ${( errors && errors.itemGroupType && !procurementBasicInfo?.itemGroupType ) && 'is-invalid'}` )}
                            value={procurementBasicInfo?.itemGroupType}
                            onChange={( data, e ) => {
                              handleBasicInfoDropdownChange( data, e );
                            }}


                          />
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='buyerId'> Buyer <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className={procurementBasicInfo?.isNormalOrder ? 'custom-form-group' : 'custom-form-input-group'}>
                          <div className='custom-input-group-prepend inside-btn'>
                            <Select
                              id='buyerId'
                              isLoading={!dropDownBuyers.length}
                              name="buyer"
                              isSearchable
                              menuPosition="fixed"
                              isClearable
                              theme={selectThemeColors}
                              options={dropDownBuyers}
                              classNamePrefix='dropdown'
                              innerRef={register( { required: true } )}
                              className={classnames( `erp-dropdown-select ${( errors && errors.buyer && !procurementBasicInfo?.buyer ) && 'is-invalid'}` )}
                              value={procurementBasicInfo?.buyer}
                              onChange={( data, e ) => {
                                handleBasicInfoDropdownChange( data, e );
                              }}
                              onFocus={() => { handleBuyerDropdownOnFocus(); }}
                            />
                          </div>
                          <div className='custom-input-group-append inside-btn'>
                            <span>
                              <Button.Ripple
                                disabled={!( procurementBasicInfo?.buyer && procurementBasicInfo.itemGroupType )}
                                hidden={procurementBasicInfo?.isNormalOrder}
                                className='btn-icon'
                                outline
                                size="sm"
                                // color='success'
                                onClick={() => { handlePurchaseOrderModalOpen(); }}
                              >

                                <MoreHorizontal color='green' size={16} />
                              </Button.Ripple>
                            </span>
                            <span style={{ color: 'green', fontWeight: 'bolder', fontSize: "1.2rem" }}>*</span>

                          </div>
                        </div>
                      </div>
                      {/* <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }} className='feedback m-0 p-0 d-flex justify-content-end'> fdfd For the </p> */}
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='budgetId'> Budget No</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Input
                            type="text"
                            name="budgetNo"
                            disabled
                            bsSize="sm"
                            value={procurementBasicInfo?.budgetNo}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            onFocus={( e ) => e.target.select()}
                          />
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='budgetId'> Style No</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Input
                            type="text"
                            name="styleNo"
                            disabled
                            bsSize="sm"
                            value={procurementBasicInfo?.styleNo}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            onFocus={( e ) => e.target.select()}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={3} xl={3} xxl={3}>


                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='exportOrderId'> Export Order</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Input
                            type="text"
                            name="exportedPONo"
                            disabled
                            bsSize="sm"
                            value={procurementBasicInfo?.exportedPONo}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            onFocus={( e ) => e.target.select()}
                          />
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='budgetId'> Sub Group</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Input
                            type="text"
                            name="subGroup"
                            disabled
                            bsSize="sm"
                            value={procurementBasicInfo?.subGroup}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            onFocus={( e ) => e.target.select()}
                          />
                        </div>
                      </div>

                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='orderDateId'> Order Date <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Input
                            id="orderDateId"
                            type="date"
                            name="orderDate"
                            placeholder="Purchase Order Date"
                            bsSize="sm"
                            value={procurementBasicInfo?.orderDate}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            innerRef={register( { required: true } )}
                            className={classnames( { 'is-invalid': errors['orderDate'] } )}
                          />
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='shipmentModeId'> Shipment Mode <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Select
                            id='shipmentModeId'
                            name="shipmentMode"
                            isSearchable
                            menuPosition="fixed"
                            isClearable
                            theme={selectThemeColors}
                            options={selectShipmentMode}
                            classNamePrefix='dropdown'
                            innerRef={register( { required: true } )}
                            className={classnames( `erp-dropdown-select ${( errors && errors.shipmentMode && !procurementBasicInfo?.shipmentMode ) && 'is-invalid'}` )}
                            value={procurementBasicInfo?.shipmentMode}
                            onChange={( data, e ) => {
                              handleBasicInfoDropdownChange( data, e );
                            }}
                          />
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='receivedDateId'> Ship Date <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Input
                            id="receivedDateId"
                            type="date"
                            name="receivedDate"
                            placeholder="Received Date"
                            bsSize="sm"
                            value={procurementBasicInfo?.receivedDate}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            innerRef={register( { required: true } )}
                            className={classnames( { 'is-invalid': errors['receivedDate'] } )}
                          />
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='currencyId'> Currency <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-input-group'>
                          <div className='custom-input-group-prepend'>
                            <Select
                              id='currencyId'
                              name="currency"
                              isSearchable
                              menuPosition="fixed"
                              isClearable
                              theme={selectThemeColors}
                              options={currencyDropdown}
                              classNamePrefix='dropdown'
                              innerRef={register( { required: true } )}
                              className={classnames( `erp-dropdown-select ${( errors && errors.currency && !procurementBasicInfo?.currency ) && 'is-invalid'}` )}
                              value={procurementBasicInfo?.currency}
                              onChange={( data, e ) => {
                                handleBasicInfoDropdownChange( data, e );
                              }}
                              onFocus={() => { handleCurrencyDropdownOnFocus(); }}

                            />
                          </div>
                          <div className='custom-input-group-append'>
                            <Input
                              className="text-right"
                              type="number"
                              name="conversionRate"
                              bsSize="sm"
                              placeholder="৳ Conversion Rate"
                              value={procurementBasicInfo?.conversionRate}
                              onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                              onFocus={( e ) => e.target.select()}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='warehouseId'>Warehouse <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Select
                            id='warehouseId'
                            name="warehouse"
                            isSearchable
                            menuPosition="fixed"
                            isClearable
                            theme={selectThemeColors}
                            options={warehouseDropdown}
                            classNamePrefix='dropdown'
                            innerRef={register( { required: true } )}
                            className={classnames( `erp-dropdown-select ${( errors && errors.warehouse && !procurementBasicInfo?.warehouse ) && 'is-invalid'}` )}
                            value={procurementBasicInfo?.warehouse}
                            onChange={( data, e ) => {
                              handleBasicInfoDropdownChange( data, e );
                            }}
                            onFocus={() => { handleWarehouseDropdownOnFocus(); }}

                          />
                        </div>
                      </div>
                    </Col>

                    <Col xs={12} sm={12} md={6} lg={3} xl={3} xxl={3}>


                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='additionalChargeId'>Item Value</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Input
                            className="text-right"
                            type="number"
                            name="additionalCharge"
                            disabled
                            bsSize="sm"
                            value={isZeroToFixed( totalItemValue(), 4 )}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            onFocus={( e ) => e.target.select()}
                          />
                        </div>
                      </div>

                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='additionalChargeId'>Additional Charge</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {/* <Input
                            className="text-right"
                            type="number"
                            name="additionalChargeAmount"
                            bsSize="sm"
                            value={procurementBasicInfo?.additionalChargeAmount}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            onFocus={( e ) => e.target.select()}
                          /> */}

                          <NumberFormat
                            className={classnames( `form-control-sm form-control text-right ` )}
                            displayType="input"
                            value={procurementBasicInfo?.additionalChargeAmount}
                            name="additionalChargeAmount"
                            decimalScale={4}
                            allowNegative={false}
                            fixedDecimalScale={procurementBasicInfo?.additionalChargeAmount !== 0}
                            allowLeadingZeros={false}
                            onFocus={e => {
                              e.target.select();
                            }}
                            onBlur={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}

                          />
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='serviceChargeId'>Service Charge</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {/* <Input
                            className="text-right"
                            type="number"
                            name="serviceChargeAmount"
                            bsSize="sm"
                            value={procurementBasicInfo?.serviceChargeAmount}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            onFocus={( e ) => e.target.select()}
                          /> */}
                          <NumberFormat
                            className={classnames( `form-control-sm form-control text-right ` )}
                            displayType="input"
                            value={procurementBasicInfo?.serviceChargeAmount}
                            name="serviceChargeAmount"
                            decimalScale={4}
                            allowNegative={false}
                            fixedDecimalScale={procurementBasicInfo?.serviceChargeAmount !== 0}
                            allowLeadingZeros={false}
                            onFocus={e => {
                              e.target.select();
                            }}
                            onBlur={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}

                          />
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='deductionAmountId'>Deduction Amount</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {/* <Input
                            className="text-right"
                            type="number"
                            name="deductionAmount"
                            bsSize="sm"
                            value={procurementBasicInfo?.deductionAmount}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            onFocus={( e ) => e.target.select()}
                          /> */}

                          <NumberFormat
                            className={classnames( `form-control-sm form-control text-right ` )}
                            displayType="input"
                            value={procurementBasicInfo?.deductionAmount}
                            name="deductionAmount"
                            decimalScale={4}
                            allowNegative={false}
                            fixedDecimalScale={procurementBasicInfo?.deductionAmount !== 0}
                            allowLeadingZeros={false}
                            onFocus={e => {
                              e.target.select();
                            }}
                            onBlur={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}

                          />
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='totalAmountId'>Total Amount</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Input
                            id="totalAmountId"
                            className="text-right"
                            type="number"
                            bsSize="sm"
                            disabled
                            name="totalAmount"
                            value={isZeroToFixed( totalPOvalue(), 4 )}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            onFocus={( e ) => e.target.select()}
                          />
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='pOrderId'>Nature <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Select
                            id='pOrderId'
                            name="orderNature"
                            isSearchable
                            menuPosition="fixed"
                            isClearable
                            theme={selectThemeColors}
                            options={selectPurchaseTerm}
                            classNamePrefix='dropdown'
                            innerRef={register( { required: true } )}
                            className={classnames( `erp-dropdown-select ${( errors && errors.orderNature && !procurementBasicInfo?.orderNature ) && 'is-invalid'}` )}
                            value={procurementBasicInfo?.orderNature}
                            onChange={( data, e ) => {
                              handleBasicInfoDropdownChange( data, e );
                            }}
                          />
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='purchaserId'> Purchaser</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Select
                            id='purchaserId'
                            name="purchaser"
                            isSearchable
                            menuPosition="fixed"
                            isClearable
                            theme={selectThemeColors}
                            options={selectPurchaser}
                            classNamePrefix='dropdown'
                            className={classnames( `erp-dropdown-select ${( errors && errors.purchaser && !procurementBasicInfo?.purchaser ) && 'is-invalid'}` )}
                            innerRef={register( { required: true } )}
                            value={procurementBasicInfo?.purchaser}
                            onChange={( data, e ) => {
                              handleBasicInfoDropdownChange( data, e );
                            }}
                            onFocus={() => { handleVendorDropdownOnFocus(); }}
                          />
                        </div>
                      </div>

                    </Col>
                    <Col xs={12} sm={12} md={6} lg={3} xl={3} xxl={3}>

                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='shippingTermId'> Trade Term <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Select
                            id='shippingTermId'
                            name="shippingTerm"
                            isSearchable
                            menuPosition="fixed"
                            isClearable
                            theme={selectThemeColors}
                            options={selectTerm}
                            classNamePrefix='dropdown'
                            innerRef={register( { required: true } )}
                            className={classnames( `erp-dropdown-select ${( errors && errors.shippingTerm && !procurementBasicInfo?.shippingTerm ) && 'is-invalid'}` )}
                            value={procurementBasicInfo?.shippingTerm}
                            onChange={( data, e ) => {
                              handleBasicInfoDropdownChange( data, e );
                            }}
                          />
                        </div>
                      </div>


                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='sourceId'>Source <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Select
                            id='sourceId'
                            name="source"
                            isSearchable
                            menuPosition="fixed"
                            isClearable
                            theme={selectThemeColors}
                            options={source}
                            classNamePrefix='dropdown'
                            innerRef={register( { required: true } )}
                            className={classnames( `erp-dropdown-select ${( errors && errors.source && !procurementBasicInfo?.source ) && 'is-invalid'}` )}
                            value={procurementBasicInfo?.source}
                            onChange={( data, e ) => {
                              handleBasicInfoDropdownChange( data, e );
                            }}
                          />
                        </div>
                      </div>


                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='budgetId'> Term and Condition</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          <Input
                            type="textarea"
                            name="termsAndConditions"
                            bsSize="sm"
                            value={procurementBasicInfo?.termsAndConditions}
                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                            onFocus={( e ) => e.target.select()}
                          />
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: 'flex-end', alignItems: 'center' }}>
                        <span style={{ color: 'green', fontWeight: 'bolder', fontSize: "1.2rem", marginRight: '0.5rem' }}>*</span>
                        <span style={{ fontWeight: 'bold', fontSize: '0.7rem', fontStyle: 'italic' }}> Buyer PO and Item Details Modal Open Button</span>
                      </div>

                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row >
          <Col>
            <div className='divider divider-left '>
              <div className='divider-text text-secondary font-weight-bolder'>{procurementBasicInfo?.itemGroupType?.label} Details</div>
            </div>
            <div className="border rounded rounded-3 p-1">
              <Row>
                <Col>
                  <ProcurementItemDetailForm />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="border rounded rounded-3 p-1 mt-1">
              <Row>
                <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                  <div className='custom-form-main'>
                    <Label className='custom-form-label' for='statusId'>Status</Label>
                    <Label className='custom-form-colons'> : </Label>
                    <div className='custom-form-group'>
                      <Select
                        id='pOrderId'
                        isDisabled={!isPermit( userPermission?.SupplierOrderCanApprove, authPermissions )}

                        name="status"
                        isSearchable
                        menuPosition="fixed"
                        isClearable
                        theme={selectThemeColors}
                        options={procurementStatus}
                        classNamePrefix='dropdown'
                        innerRef={register( { required: true } )}
                        className={classnames( `erp-dropdown-select ${( errors && errors.status && !procurementBasicInfo?.status ) && 'is-invalid'}` )}
                        value={procurementBasicInfo?.status}
                        onChange={( data, e ) => {
                          handleBasicInfoDropdownChange( data, e );
                        }} />
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                  <div className='custom-form-main'>
                    <Label className='custom-form-label' for='statusId'>Approved By</Label>
                    <Label className='custom-form-colons'> : </Label>
                    <div className='custom-form-group'>

                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                  <div className='custom-form-main'>
                    <Label className='custom-form-label' for='statusId'>Approved Date</Label>
                    <Label className='custom-form-colons'> : </Label>
                    <div className='custom-form-group'>

                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

      </CardBody>
    </Card>


    {
      openPurchaseOrderAndItemModal &&
      <ProcurementOrderItemModal
        openModal={openPurchaseOrderAndItemModal}
        setOpenModal={setOpenPurchaseOrderAndItemModal}
      />
    }
    {
      openSupplierModal &&
      <SupplierModal
        openModal={openSupplierModal}
        setOpenModal={setOpenSupplierModal}
      />
    }
    {
      searchMOdalOpen && (
        <ProcurementSearchableListModal
          setOpenModal={setSearchMOdalOpen}
          openModal={searchMOdalOpen}
        />
      )
    }

  </div>;
};

export default ProcurementAdd;

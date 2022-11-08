import '@custom-styles/merchandising/form/procurement-form.scss';
import '@custom-styles/merchandising/others/custom-tab.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import { Search } from 'react-feather';
import { useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Input, Label, NavItem, NavLink, Row } from 'reactstrap';
import * as yup from 'yup';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { notify } from '../../../../utility/custom/notifications';
import { itemGroupType, procurementStatus, selectPurchaser, selectPurchaseTerm, selectShipmentMode, selectTerm, source } from '../../../../utility/enums';
import { isPermit, isZeroToFixed, selectThemeColors } from '../../../../utility/Utils';
import { getVendorDropdown } from '../../../inventory/vendor/store/actions';
import { getWarehouseDropdown } from '../../../inventory/warehouse/store/actions';
import { getBudgetBuyerPO, getBudgetItems, getBuyerBudgetsDropdown } from '../../budget/store/actions';
import { getDropDownBuyers } from '../../buyer/store/actions';
import { getCurrencyDropdown } from '../../currency/store/actions';
import { addProcurement, bindProcurementBasicInfo, bindProcurementItems, bindSelectedItemsForProcurement, getProcurementById } from '../store/actions';
import NormalProcurementItemDetails from './NormalProcurementItemDetails';
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


const NormalProcurementAddForm = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const {
    procurementBasicInfo,
    procurementItems
  } = useSelector( ( { procurements } ) => procurements );

  const { userPermission } = useSelector( ( { auth } ) => auth );
  const { authPermissions } = useSelector( ( { permissions } ) => permissions );

  const { vendorDropdown } = useSelector( ( { vendors } ) => vendors );
  const { warehouseDropdown } = useSelector( ( { warehouses } ) => warehouses );
  const { currencyDropdown } = useSelector( ( { currencies } ) => currencies );
  const { dropDownBuyers } = useSelector( ( { buyers } ) => buyers );

  const [searchMOdalOpen, setSearchMOdalOpen] = useState( false );
  const [openSupplierModal, setOpenSupplierModal] = useState( false );

  const SignupSchema = yup.object().shape( {
    buyer: procurementBasicInfo?.buyer ? yup.string() : yup.string().required( 'Buyer Term is Required!!' ),
    supplier: procurementBasicInfo?.supplier ? yup.string() : yup.string().required( 'Supplier Term is Required!!' ),
    itemGroupType: procurementBasicInfo?.itemGroupType ? yup.string() : yup.string().required( 'Item Group is Required!!' ),
    shipmentMode: procurementBasicInfo?.shipmentMode ? yup.string() : yup.string().required( 'Shipment Mode is Required!!' ),
    currency: procurementBasicInfo?.currency ? yup.string() : yup.string().required( 'Currency is Required!!' ),
    warehouse: procurementBasicInfo?.warehouse ? yup.string() : yup.string().required( 'Warehouse is Required!!' ),
    source: procurementBasicInfo?.source ? yup.string() : yup.string().required( 'Source is Required!!' ),
    shippingTerm: procurementBasicInfo?.shippingTerm ? yup.string() : yup.string().required( 'Shipping Term is Required!!' ),
    orderNature: procurementBasicInfo?.orderNature ? yup.string() : yup.string().required( 'Requisition Nature is Required!!' ),
    status: procurementBasicInfo?.status ? yup.string() : yup.string().required( 'Status is Required!!' )
  } );


  const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );

  // ///For Validation
  // useEffect( () => {
  //   dispatch( getDropDownItemGroups() );
  // }, [] );


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

  const handleSearchModalOpen = () => {
    setSearchMOdalOpen( !searchMOdalOpen );
  };

  const handleSupplierModalOpen = () => {
    setOpenSupplierModal( !openSupplierModal );
    dispatch( getVendorDropdown() );

  };

  const handleBasicInfoDropdownChange = ( data, e ) => {
    const { action, name, option } = e;
    if ( name === 'currency' ) {
      const updatedObj = {
        ...procurementBasicInfo,
        [name]: data,
        ['conversionRate']: data?.conversionRate,
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
      dispatch( bindSelectedItemsForProcurement( null ) );

    } else if ( name === 'itemGroupType' ) {
      if ( procurementItems.length ) {
        const confirmObj = {
          title: 'Do you want to change?',
          text: 'Your Items will be delete!',
          confirmButtonText: 'Yes !',
          cancelButtonText: 'No'
        };
        confirmDialog( confirmObj ).then( async e => {
          if ( e.isConfirmed ) {
            const updatedObj = {
              ...procurementBasicInfo,
              [name]: data
            };
            dispatch( bindProcurementBasicInfo( updatedObj ) );
            dispatch( bindProcurementItems( [] ) );

          }
        } );
      } else {
        const updatedObj = {
          ...procurementBasicInfo,
          [name]: data
        };
        dispatch( bindProcurementBasicInfo( updatedObj ) );
      }


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

  const isValidatedArray = () => {
    const errorField = procurementItems.map( od => {
      if ( !od.style
        || !od.item
        || !od.orderUom
        || od.orderQuantity === 0
        || od.orderRate === 0
      ) {
        od['isFieldError'] = true;
      } else {
        od['isFieldError'] = false;
      }
      return od;
    } );
    //   console.log( errorField.some( e => e.isFieldError ) );
    dispatch( bindProcurementItems( errorField ) );

    console.log( errorField );

    return errorField.some( e => e.isFieldError );
  };
  const onSubmit = () => {
    const submitNormalObj = {
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
      orderNature: procurementBasicInfo?.orderNature?.label,
      currencyCode: procurementBasicInfo?.currency?.label,
      conversionCurrencyCode: procurementBasicInfo?.conversionCurrencyCode,
      conversionRate: procurementBasicInfo?.conversionRate,
      serviceChargeAmount: procurementBasicInfo?.serviceChargeAmount,
      additionalChargeAmount: procurementBasicInfo?.additionalChargeAmount,
      deductionAmount: procurementBasicInfo?.deductionAmount,
      isNormalOrder: true,
      orderFor: procurementBasicInfo.itemGroupType?.value,
      termsAndConditions: procurementBasicInfo?.termsAndConditions,
      status: procurementBasicInfo?.status?.label,
      purchaser: procurementBasicInfo?.purchaser?.label,

      details: procurementItems.map( ( detail, index ) => ( {
        rowNo: index + 1,
        styleId: detail.styleId,
        styleNumber: detail.styleNumber,
        itemCategoryId: detail.itemGroup?.value,
        itemSubCategoryId: detail.itemSubGroup?.value,
        itemId: detail.item?.value ?? '',
        itemCode: detail?.itemCode ?? '',
        itemName: detail.item?.label ?? '',
        quantity: detail.bomQuantity,
        orderUom: detail.orderUom?.label ?? '',
        orderQuantity: detail.orderQuantity,
        orderRate: detail.orderRate,
        orderUomRelativeFactor: detail.orderUomRelativeFactor,
        minOrderQuantity: detail.minOrderQuantity,
        amount: detail.orderRate * detail.orderQuantity,
        remarks: detail.remarks

        //id: 0,
        //  supplierOrderId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        // budgetId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        //   budgetNumber: "string",
        // orderId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        // orderNumber: "string",
        // itemCategory: "string",
        // itemSubCategory: "string",
        // bomUom: "",
        // bomUomRelativeFactor: 0,
        //  bomRate: 0,
        // bomQuantity: 0,
        //  bomQuantityOnOrderUom: 0,
        // totalOrderQuantity: 0
      } ) )
    };

    console.log( 'submitObj', JSON.stringify( submitNormalObj, null, 2 ) );
    if ( submitNormalObj.details.length ) {
      if ( !isValidatedArray() ) {
        dispatch( addProcurement( submitNormalObj, push, 'Normal' ) );
      } else {
        notify( 'warning', 'Please Provide Validated Data!' );
      }
    } else {
      notify( 'warning', 'Please add at least an item!!!' );
    }
  };


  ///Total Order Qty Show Up
  const totalItemValue = () => {
    const total = _.sum( procurementItems.map( item => item.orderQuantity * item.orderRate ) );
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
    <ActionMenu breadcrumb={breadcrumb} title='New IPO (Ind.)' >
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
                        <div className={'custom-form-input-group'}>
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
                        <Label className='custom-form-label' for='buyerId'> Buyer <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className={'custom-form-group'}>

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
                      </div>

                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='supplierId'> Supplier <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-input-group'>
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
                            isClearable
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
                  <NormalProcurementItemDetails />
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
      searchMOdalOpen && (
        <ProcurementSearchableListModal
          setOpenModal={setSearchMOdalOpen}
          openModal={searchMOdalOpen}
        />
      )
    }
    {
      openSupplierModal &&
      <SupplierModal
        openModal={openSupplierModal}
        setOpenModal={setOpenSupplierModal}
      />
    }
  </div>;
};

export default NormalProcurementAddForm;

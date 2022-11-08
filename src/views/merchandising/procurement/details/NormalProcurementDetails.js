import Spinner from '@components/spinner/Fallback-spinner';
// import '@custom-styles/basic/custom-form.scss';
import '@custom-styles/merchandising/form/procurement-form.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Search } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Label, NavItem, NavLink, Row } from 'reactstrap';
import * as yup from 'yup';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { confirmObj, permissibleProcessObj, procurementStatus } from '../../../../utility/enums';
import { isPermit, isZeroToFixed, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownItemGroups } from '../../../inventory/item-group/store/actions';
import { getVendorDropdown } from '../../../inventory/vendor/store/actions';
import { getWarehouseDropdown } from '../../../inventory/warehouse/store/actions';
import { getBudgetBuyerPO, getBudgetItems, getBuyerBudgetsDropdown } from '../../budget/store/actions';
import { getDropDownBuyers } from '../../buyer/store/actions';
import { getCurrencyDropdown } from '../../currency/store/actions';
import ProcurementSearchableListModal from '../form/ProcurementSearchableListModal';
import { bindProcurementBasicInfo, bindProcurementItems, getNormalProcurementById, getProcurementById, procurementStatusChange } from '../store/actions';
import NormalProcurementItemDetails from './NormalProcurementItemDetails';
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

const NormalProcurementDetails = () => {
  const { replace, push } = useHistory();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { procurementItems,
    procurementBasicInfo,
    isProcurementDataLoaded
  } = useSelector( ( { procurements } ) => procurements );

  const { userPermission, authenticateUser } = useSelector( ( { auth } ) => auth );
  const { authPermissions } = useSelector( ( { permissions } ) => permissions );

  const { vendorDropdown } = useSelector( ( { vendors } ) => vendors );
  const { warehouseDropdown } = useSelector( ( { warehouses } ) => warehouses );
  const { currencyDropdown } = useSelector( ( { currencies } ) => currencies );
  const { dropDownBuyers } = useSelector( ( { buyers } ) => buyers );

  const [searchMOdalOpen, setSearchMOdalOpen] = useState( false );
  const [openSupplierModal, setOpenSupplierModal] = useState( false );

  const SignupSchema = yup.object().shape( {

    status: procurementBasicInfo?.status ? yup.string() : yup.string().required( 'Status is Required!!' )
  } );


  const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );

  const procurementId = state;
  useEffect( () => {
    dispatch( getNormalProcurementById( procurementId ) );
  }, [dispatch, procurementId] );

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
        [name]: data
      };
      dispatch( bindProcurementBasicInfo( updatedObj ) );

      dispatch( getBuyerBudgetsDropdown( data?.value ) );
    } else {
      const updatedObj = {
        ...procurementBasicInfo,
        [name]: data
      };
      dispatch( bindProcurementBasicInfo( updatedObj ) );
    }

  };

  const handleStatusDropdownOChange = ( data, e ) => {
    const { name } = e;
    if ( procurementBasicInfo?.status?.value === 'Approved' ) {
      confirmDialog( {
        ...confirmObj,
        title: `Approved By`,
        text: `<h4 class="text-primary mb-0">${procurementBasicInfo.approvedBy}</h4> <br/> <span> Are you sure to change?</span>`
      } ).then( async e => {
        if ( e.isConfirmed ) {
          const updatedObj = {
            ...procurementBasicInfo,
            [name]: data
          };
          dispatch( bindProcurementBasicInfo( updatedObj ) );
        }
      } );
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
    const updatedObj = {
      ...procurementBasicInfo,
      [name]: type === 'number' ? Number( value ) : type === 'date' ? moment( value ).format( 'yy-MM-DD' ) : type === "checkbox" ? checked : value
    };
    dispatch( bindProcurementBasicInfo( updatedObj ) );
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
    dispatch( procurementStatusChange( procurementId, procurementBasicInfo?.updateStatus?.label, 'Independent' ) );

  };

  ///Total Order Qty Show Up
  const totalItemValue = () => {
    const total = _.sum( procurementItems.map( item => item.orderQuantity * item.orderRate ) );
    return total;
  };
  const totalPOvalue = () => {
    const total = ( totalItemValue() + procurementBasicInfo?.serviceChargeAmount + procurementBasicInfo?.additionalChargeAmount ) - procurementBasicInfo?.deductionAmount;
    return 0;
  };

  const handleSearchModalOpen = () => {
    setSearchMOdalOpen( !searchMOdalOpen );
  };


  const handleCancel = () => {
    push( '/procurements' );
    dispatch( getProcurementById( null ) );

  };
  const handleAddNew = () => {
    dispatch( getProcurementById( null ) );
    dispatch( getBudgetBuyerPO( null ) );
    dispatch( bindProcurementItems( [] ) );
    dispatch( getBudgetItems( null ) );
    push( '/new-independent-procurement' );
  };

  const handleEdit = () => {
    replace( { pathname: '/edit-independent-procurement', state: procurementId } );

  };

  const isPermittedByStatus = ( status, approvedById ) => {
    if ( status === "Approved" ) {
      const permitted = ( authenticateUser?.id === approvedById )
        || authenticateUser.permissibleProcesses.some( p => p === permissibleProcessObj.ipo );
      return permitted;
    } else {
      return true;
    }
  };

  const isEditButtonHidden = ( status ) => {
    let hidden = false;
    if ( status === 'Approved' ) {
      hidden = true;
    } else if ( status !== 'Approved' ) {
      hidden = !isPermit( userPermission?.SupplierOrderEdit, authPermissions );
    }
    return hidden;
  };


  return <div>
    <ActionMenu breadcrumb={breadcrumb} title='IPO Details (Ind.)' >
      <NavItem className="mr-1" >
        <NavLink
          tag={Button}
          size="sm"
          color="primary"
          //  type="submit"
          onClick={handleSubmit( onSubmit )}
        >Save</NavLink>
      </NavItem>
      <NavItem
        hidden={isEditButtonHidden( procurementBasicInfo?.status?.value )}
        className="mr-1"
      >
        <NavLink
          tag={Button}
          size="sm"
          color="success"
          onClick={() => { handleEdit(); }}
        >
          Edit
        </NavLink>
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
      <NavItem className="mr-1" >
        <NavLink
          tag={Button}
          size="sm"
          color="success"
          onClick={() => { handleAddNew(); }}                    >
          Add New
        </NavLink>
      </NavItem>
    </ActionMenu>
    <div hidden={isProcurementDataLoaded}>
      <Spinner />

    </div>
    <Card className="mt-3 ipo-form" hidden={!isProcurementDataLoaded}>
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
                            {procurementBasicInfo?.sysId}
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
                          {procurementBasicInfo?.orderNumber}
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='buyerId'> Buyer <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className={'custom-form-group'}>
                          {procurementBasicInfo?.buyer?.label}

                        </div>
                      </div>

                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='supplierId'> Supplier <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {procurementBasicInfo?.supplier?.label}
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='itemGroupTypId'>Item Group Type<span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {procurementBasicInfo?.itemGroupType?.label}
                        </div>
                      </div>


                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='budgetId'> Style No</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {procurementBasicInfo?.styleNo}
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={3} xl={3} xxl={3}>


                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='orderDateId'> Order Date <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {moment( procurementBasicInfo?.orderDate ).format( "DD-MM-yyyy" )}

                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='shipmentModeId'> Shipment Mode <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {procurementBasicInfo?.shipmentMode?.label}
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='receivedDateId'> Ship Date <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {moment( procurementBasicInfo?.receivedDate ).format( "DD-MM-yyyy" )}
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='currencyId'> Currency <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-input-group'>
                          <div className='custom-input-group-prepend'>
                            {procurementBasicInfo?.currency?.label}
                          </div>
                          <div className='custom-input-group-append'>
                            {procurementBasicInfo?.conversionRate}
                          </div>
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='warehouseId'>Warehouse <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {procurementBasicInfo?.warehouse?.label}
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='pOrderId'>Nature <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {procurementBasicInfo?.orderNature?.label}
                        </div>
                      </div>
                    </Col>

                    <Col xs={12} sm={12} md={6} lg={3} xl={3} xxl={3}>


                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='additionalChargeId'>Item Value</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {isZeroToFixed( totalItemValue(), 4 )}
                        </div>
                      </div>

                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='additionalChargeId'>Additional Charge</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>

                          {isZeroToFixed( procurementBasicInfo?.additionalChargeAmount, 4 )}
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='serviceChargeId'>Service Charge</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {isZeroToFixed( procurementBasicInfo?.serviceChargeAmount, 4 )}
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='deductionAmountId'>Deduction Amount</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>

                          {isZeroToFixed( procurementBasicInfo?.deductionAmount, 4 )}
                        </div>
                      </div>
                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='totalAmountId'>Total Amount</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {isZeroToFixed( totalPOvalue(), 4 )}
                        </div>
                      </div>

                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='purchaserId'> Purchaser</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {procurementBasicInfo?.purchaser?.label}
                        </div>
                      </div>

                    </Col>
                    <Col xs={12} sm={12} md={6} lg={3} xl={3} xxl={3}>

                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='shippingTermId'> Trade Term <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {procurementBasicInfo?.shippingTerm?.label}
                        </div>
                      </div>


                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='sourceId'>Source <span className='text-danger'>*</span></Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {procurementBasicInfo?.source?.label}
                        </div>
                      </div>

                      <div className='custom-form-main'>
                        <Label className='custom-form-label' for='budgetId'> Term and Condition</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                          {procurementBasicInfo?.termsAndConditions}
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
                      {
                        isPermit( userPermission?.SupplierOrderCanApprove, authPermissions ) ? (
                          <Select
                            id='pOrderId'
                            isDisabled={!isPermittedByStatus( procurementBasicInfo?.status?.value, procurementBasicInfo?.approvedById )}

                            name="updateStatus"
                            isSearchable
                            menuPosition="fixed"
                            isClearable
                            theme={selectThemeColors}
                            options={procurementStatus}
                            classNamePrefix='dropdown'
                            innerRef={register( { required: true } )}
                            className={classnames( `erp-dropdown-select ${( errors && errors.status && !procurementBasicInfo?.status ) && 'is-invalid'}` )}
                            value={procurementBasicInfo?.updateStatus}
                            onChange={( data, e ) => {
                              handleStatusDropdownOChange( data, e );
                            }} />
                        ) : procurementBasicInfo?.status?.value
                      }

                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                  <div className='custom-form-main'>
                    <Label className='custom-form-label' for='statusId'>Approved By</Label>
                    <Label className='custom-form-colons'> : </Label>
                    <div className='custom-form-group'>
                      {procurementBasicInfo?.approvedBy}

                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                  <div className='custom-form-main'>
                    <Label className='custom-form-label' for='statusId'>Approved Date</Label>
                    <Label className='custom-form-colons'> : </Label>
                    <div className='custom-form-group'>
                      {procurementBasicInfo?.approveDate ? moment( Date.parse( procurementBasicInfo?.approveDate ) ).format( "DD/MM/YYYY" ) : ''}

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
          searchFor="procurement-details"

        />
      )
    }


  </div>;
};

export default NormalProcurementDetails;

import FallbackSpinner from '@components/spinner/Fallback-spinner';
import '@custom-styles/inventory/form/pi-custom-form.scss';
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
import PiSearchableListModal from '../form/PiSearchableListModal';
import { bindPiBasicInfo, bindProcurementItems, bindSelectedProcurementItems, bindSelectedSupplierOrders, bindSupplierOrderOnChange, getPiById, piStatusChange } from '../store/actions';
import PiDocuments from './PiDocuments';
import PiSelectedItem from './PiSelectedItem';
// import PISupplierOrderModal from './PISupplierOrderModal';
// import ProcurementOrderModal from './ProcurementOrderModal';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: '/',
        isActive: false
    },
    {
        id: 'pis',
        name: 'IPI List',
        link: '/pis',
        isActive: false
    }
];
const PiEditForm = () => {
    const { push, replace } = useHistory();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const piId = state;

    const { piBasicInfo, selectedProcurementItems, isPiDataProgress } = useSelector( ( { pis } ) => pis );

    const { userPermission, authenticateUser } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );
    const [searchMOdalOpen, setSearchMOdalOpen] = useState( false );

    const validationSchema = yup.object().shape( {
        status: piBasicInfo?.status ? yup.string() : yup.string().required( 'Status is required!' )
    } );

    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );

    useEffect( () => {
        dispatch( getPiById( piId ) );
    }, [dispatch, piId] );


    const handleBasicInfoDropdownChange = ( data, e ) => {
        const { action, name, option } = e;
        const updatedObj = {
            ...piBasicInfo,
            [name]: data
        };
        dispatch( bindPiBasicInfo( updatedObj ) );

    };

    const handleStatusDropdownOChange = ( data, e ) => {
        const { name } = e;
        if ( piBasicInfo?.status?.value === 'Approved' ) {
            confirmDialog( {
                ...confirmObj,
                title: `Approved By`,
                text: `<h4 class="text-primary mb-0">${piBasicInfo.approvedBy}</h4> <br/> <span> Are you sure to change?</span>`
            } ).then( async e => {
                if ( e.isConfirmed ) {
                    const updatedObj = {
                        ...piBasicInfo,
                        [name]: data
                    };
                    dispatch( bindPiBasicInfo( updatedObj ) );
                }
            } );
        } else {
            const updatedObj = {
                ...piBasicInfo,
                [name]: data
            };
            dispatch( bindPiBasicInfo( updatedObj ) );
        }
    };

    const onSubmit = () => {

        dispatch( piStatusChange( piId, piBasicInfo?.updateStatus?.label ) );

    };

    // console.log( piBasicInfo );


    ///Total Order Qty Show Up
    const totalItemValue = () => {
        const total = _.sum( selectedProcurementItems.map( item => item.quantity * item.orderRate ) );
        return total;
    };
    const totalPOvalue = () => {
        const total = ( totalItemValue() + piBasicInfo?.serviceCharge + piBasicInfo?.additionalCharge ) - piBasicInfo?.deductionAmount;
        return total;
    };
    const handleCancel = () => {
        dispatch( bindPiBasicInfo( null ) );
        dispatch( bindSupplierOrderOnChange( null ) );
        dispatch( bindSelectedSupplierOrders( [] ) );
        dispatch( bindProcurementItems( [] ) );
        dispatch( bindSelectedProcurementItems( [] ) );
        push( '/pis' );
    };


    const handleSearchModalOpen = () => {
        setSearchMOdalOpen( !searchMOdalOpen );
    };
    const handleAddNew = () => {
        dispatch( bindPiBasicInfo( null ) );
        dispatch( bindSelectedProcurementItems( [] ) );
        // dispatch( bindProcurementItems( [] ) );
        // dispatch( getBudgetItems( null ) );
        push( '/new-pi' );
    };

    const handleEdit = () => {
        replace( { pathname: '/edit-pi', state: piId } );
    };


    const isPermittedByStatus = ( status, approvedById ) => {
        if ( status === "Approved" ) {
            const permitted = ( authenticateUser?.id === approvedById )
                || authenticateUser.permissibleProcesses.some( p => p === permissibleProcessObj.ipi );
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
            hidden = !isPermit( userPermission?.ProformaInvoiceEdit, authPermissions );
        }
        return hidden;
    };

    return (
        <div>
            <ActionMenu breadcrumb={breadcrumb} title='IPI Details' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        disabled={isPiDataProgress}
                        size="sm"
                        color="primary"
                        type="submit"
                        onClick={handleSubmit( onSubmit )}
                    >Save</NavLink>
                </NavItem>
                <NavItem
                    hidden={isEditButtonHidden( piBasicInfo?.status?.label )}
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
                        disabled={isPiDataProgress}
                        color="success"
                        onClick={() => { handleAddNew(); }}
                    >
                        Add New
                    </NavLink>
                </NavItem>
            </ActionMenu>
            {isPiDataProgress ? <FallbackSpinner /> : (
                <Card className="mt-3 pi-custom-form">
                    <CardBody>
                        <Row>
                            <Col>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Proforma Invoice (IPI)</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='sysId'> IPI ID</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-input-group'>
                                                    <div className='custom-input-group-prepend inside-btn'>
                                                        {piBasicInfo?.sysId}
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
                                                <Label className='custom-form-label' for='piNumberId'> IPI NO <span className='text-danger'>*</span></Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {piBasicInfo?.piNumber}
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='buyerId'> Buyer <span className='text-danger'>*</span></Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {piBasicInfo?.buyer?.label}
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='supplierId'> Supplier <span className='text-danger'>*</span></Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {piBasicInfo?.supplier?.label}
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='purposeId'> Purpose <span className='text-danger'>*</span></Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {piBasicInfo?.purpose?.label}
                                                </div>
                                            </div>

                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='sourceId'>Source <span className='text-danger'>*</span></Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {piBasicInfo?.source?.label}
                                                </div>
                                            </div>

                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='supplierId'> Style <span className='text-danger'>*</span></Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {piBasicInfo?.styleNo}
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='supplierPOId'> Supplier PO </Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {piBasicInfo?.supplierPO}
                                                </div>
                                            </div>

                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='piDateId'> IPI Date <span className='text-danger'>*</span></Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {moment( piBasicInfo?.piDate ).format( "DD-MM-yyyy" )}
                                                </div>
                                            </div>


                                        </Col>

                                        <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='currencyId'> Currency <span className='text-danger'>*</span></Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-input-group'>
                                                            <div className='custom-input-group-prepend'>
                                                                {piBasicInfo?.currency?.label}
                                                            </div>
                                                            <div className='custom-input-group-append'>
                                                                {piBasicInfo?.conversionRate}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='etaId'> Item Value</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            {isZeroToFixed( totalItemValue(), 4 )}
                                                        </div>
                                                    </div>

                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='etaId'> Service Charge</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            {isZeroToFixed( piBasicInfo?.serviceCharge, 4 )}
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='etaId'> Additional Charge</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            {isZeroToFixed( piBasicInfo?.additionalCharge, 4 )}
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='etaId'> Deduction Amount</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            {isZeroToFixed( piBasicInfo?.deductionAmount, 4 )}
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='etaId'> IPI Value</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            {isZeroToFixed( totalPOvalue(), 4 )}
                                                        </div>
                                                    </div>

                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='shipModeId'> Ship Mode <span className='text-danger'>*</span></Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            {piBasicInfo?.shipmentMode?.label}
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='shipDateId'> Ship Date <span className='text-danger'>*</span></Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            {moment( piBasicInfo?.shipmentDate ).format( "DD-MM-yyyy" )}
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='tradeTermId'> Trade Term <span className='text-danger'>*</span></Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            {piBasicInfo?.tradeTerm?.label}
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='payTermId'> Pay Term <span className='text-danger'>*</span></Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            {piBasicInfo?.payTerm?.label}
                                                        </div>
                                                    </div>


                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='etaId'> ETA <span className='text-danger'>*</span></Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            {moment( piBasicInfo?.etaDate ).format( "DD-MM-yyyy" )}
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='purchaserId'> Purchaser</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            {piBasicInfo?.purchaser?.label}
                                                        </div>
                                                    </div>

                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label col-div-12' for='budgetId'> Term and Condition</Label>
                                                        <Label className='custom-form-colons col-div-12'> : </Label>
                                                        <div className='custom-form-group col-div-12'>
                                                            {piBasicInfo?.termsAndConditions}
                                                        </div>
                                                    </div>


                                                </Col>
                                            </Row>

                                        </Col>


                                    </Row>

                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={3}>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Documents</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <PiDocuments />
                                </div>
                            </Col>
                        </Row>

                        <Row >
                            <Col>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Item Details</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row>
                                        <Col>
                                            <PiSelectedItem />
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
                                                        isPermit( userPermission?.ProformaInvoiceCanApprove, authPermissions ) ? (
                                                            <Select
                                                                id='pOrderId'
                                                                isDisabled={!isPermittedByStatus( piBasicInfo?.status?.value, piBasicInfo?.approvedById )}
                                                                name="updateStatus"
                                                                isSearchable
                                                                menuPosition="fixed"
                                                                isClearable
                                                                theme={selectThemeColors}
                                                                options={procurementStatus}
                                                                classNamePrefix='dropdown'
                                                                innerRef={register( { required: true } )}
                                                                className={classnames( `erp-dropdown-select ${( errors && errors.status && !piBasicInfo?.status ) && 'is-invalid'}` )}
                                                                value={piBasicInfo?.updateStatus}
                                                                onChange={( data, e ) => {
                                                                    handleStatusDropdownOChange( data, e );
                                                                }} />
                                                        ) : piBasicInfo?.status?.value
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='statusId'>Approved By</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {piBasicInfo?.approvedBy}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='statusId'>Approved Date</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {piBasicInfo?.approveDate ? moment( Date.parse( piBasicInfo?.approveDate ) ).format( "DD/MM/YYYY" ) : ''}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            )}


            {
                searchMOdalOpen && (
                    <PiSearchableListModal
                        setOpenModal={setSearchMOdalOpen}
                        openModal={searchMOdalOpen}
                        searchFor="pi-details"
                    />
                )
            }

        </div>
    );
};

export default PiEditForm;

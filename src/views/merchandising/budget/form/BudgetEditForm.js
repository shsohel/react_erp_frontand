import Loader from '@components/spinner/Fallback-spinner';
import '@custom-styles/merchandising/form/budget-form.scss';
import '@custom-styles/merchandising/others/custom-tab.scss';
import '@custom-styles/merchandising/others/custom-table.scss';

import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { MoreHorizontal, Search, Trash2 } from 'react-feather';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { budgetStatus, confirmObj, permissibleProcessObj } from '../../../../utility/enums';
import { isPermit, isZeroToFixed, selectThemeColors } from '../../../../utility/Utils';
import { bindBudgetBasicInfo, bindBudgetPurchaseOrderDetails, bindServiceCostSummary, cleanAllBudgetState, deleteBudgetPurchaseOrderDetails, getBudgetById, getBudgetDetails, getBuyerPODetailsForBudget, updateBudget } from '../store/actions';
import { BudgetAccessoriesDetails } from './BudgetAccessoriesDetails';
import { BudgetFabricDetails } from './BudgetFabricDetails';
import { BudgetPackDetails } from './BudgetPackDetails';
import BudgetSearchableListModal from './BudgetSearchableListModal';
import { POModal } from './POModal';
const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'budgetList',
        name: 'List',
        link: "/budget",

        isActive: false
    },
    {
        id: 'budget',
        name: 'Budget Edit',
        link: "#",
        isActive: true
    }
];
const BudgetEditForm = () => {
    const { replace, push } = useHistory();
    const { state } = useLocation();
    const budgetId = state;
    const dispatch = useDispatch();
    const {
        isBudgetDataLoaded,
        budgetBasicInfo,
        budgetCostingAndBomSummary,
        budgetPurchaseOrderQuantityDetails,
        serviceCostSummary
    } = useSelector( ( { budgets } ) => budgets );
    const { userPermission, authenticateUser } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );
    const [openPOModal, setOpenPOModal] = useState( false );
    const [openSearchableModal, setOpenSearchableModal] = useState( false );

    const [activeTab, setActiveTab] = useState( 'Fabric' );


    useEffect( () => {
        if ( !budgetBasicInfo?.dataAlreadyLoaded ) {
            dispatch( getBudgetById( budgetId, push ) );
        }
    }, [dispatch, budgetId] );

    const handleTab = ( item ) => {
        setActiveTab( item );
    };

    const handleBudgetInputOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...budgetBasicInfo,
            [name]: value
        };
        dispatch( bindBudgetBasicInfo( updatedObj ) );
    };

    const handleDropdownOnChange = ( data, event ) => {
        const { name } = event;
        if ( name === 'buyer' ) {
            dispatch( getBuyerPODetailsForBudget( null ) );
        }
        const updatedObj = {
            ...budgetBasicInfo,
            [name]: data
        };
        dispatch( bindBudgetBasicInfo( updatedObj ) );
    };
    const handleOpenPOModal = () => {
        setOpenPOModal( !openPOModal );
        dispatch( getBuyerPODetailsForBudget( budgetBasicInfo?.buyerId ) );
    };
    const handleServiceCostSummaryChange = ( e, id ) => {
        const { name, value } = e.target;
        if ( value !== '.' ) {
            const updatedData = serviceCostSummary.map( scs => {
                if ( id === scs.id ) {
                    scs[name] = Number( value );
                }
                return scs;
            } );
            dispatch( bindServiceCostSummary( updatedData ) );
        }
    };


    const handleBudgetOnSearch = () => {
        setOpenSearchableModal( !openSearchableModal );
    };

    console.log( budgetBasicInfo );

    const handleDeleteBudgetPO = ( selectOrder ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                if ( selectOrder.id === 0 ) {
                    const updatedData = budgetPurchaseOrderQuantityDetails.filter( order => order.rowId !== selectOrder.rowId );
                    const queryData = updatedData.map( order => ( {
                        orderId: order.orderId,
                        styleId: order.styleId,
                        shipmentDate: order.shipmentDate,
                        destination: order.destination

                    } ) );
                    dispatch( bindBudgetPurchaseOrderDetails( updatedData ) );
                    dispatch( getBudgetDetails( queryData ) );

                    const basicInfo = {
                        ...budgetBasicInfo,
                        //  budgetCategory: response?.data.budgetCategory,
                        budgetCurrentCategory: ''
                    };
                    dispatch( bindBudgetBasicInfo( basicInfo ) );

                } else {
                    const updatedData = budgetPurchaseOrderQuantityDetails.filter( order => order.id !== selectOrder.id );
                    dispatch( deleteBudgetPurchaseOrderDetails( budgetId, selectOrder.id, updatedData, push ) );
                }
            }
        } );
    };

    const onSubmit = () => {
        const orderDetails = budgetPurchaseOrderQuantityDetails?.map( order => ( {
            bomId: order.bomId,
            orderId: order.orderId,
            styleId: order.styleId,
            orderQuantity: order.orderQuantity,
            shipmentDate: order.shipmentDate,
            destination: order.destination
        } ) );
        const serviceCostDetails = serviceCostSummary.map( scs => ( {
            name: scs.serviceGroup,
            amount: scs.approvedAmount
        } ) );
        const submitObj = {
            id: budgetBasicInfo?.id,
            budgetNumber: budgetBasicInfo?.budgetNumber,
            buyerId: budgetBasicInfo?.buyer?.value,
            budgetCategory: budgetBasicInfo?.budgetCurrentCategory,
            status: budgetBasicInfo?.updateStatus?.value,
            orderDetails,
            serviceCostDetails
        };
        console.log( 'f', JSON.stringify( submitObj, null, 2 ) );
        dispatch( updateBudget( submitObj, budgetId, budgetBasicInfo?.updateStatus?.label, push ) );
    };

    const handleAddNew = () => {
        dispatch( cleanAllBudgetState() );
        push( '/add-budget' );
    };

    const handleCancel = () => {
        replace( '/budget' );
        dispatch( cleanAllBudgetState() );
    };

    // const isPermittedByStatus = ( status, approvedById ) => {
    //     if ( status === "Approved" && approvedById ) {
    //         const permitted = !isPermit( userPermission?.CostingCanApprove, authPermissions ) || !( authenticateUser?.id === budgetBasicInfo?.approvedById );
    //         return permitted;
    //     } else {
    //         const permitted = !isPermit( userPermission?.CostingCanApprove, authPermissions );
    //         return permitted;
    //     }
    // };

    const isPermittedByStatus = ( status, approvedById ) => {
        if ( status === "Approved" ) {
            const permitted = ( authenticateUser?.id === approvedById )
                || authenticateUser.permissibleProcesses.some( p => p === permissibleProcessObj.budget );
            return permitted;
        } else {
            return true;
        }
    };

    return (
        <div>
            <div className="mt-3 ">
                <ActionMenu breadcrumb={breadcrumb} title='Edit Budget' >
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="primary"

                            onClick={() => { onSubmit(); }}
                        >
                            Save
                        </NavLink>
                    </NavItem>
                    {/* <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="secondary"
                            onClick={() => { handleClear(); }}
                        >
                            Clear
                        </NavLink>
                    </NavItem> */}
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
            </div>
            <Card className="budget-form">
                <CardBody>
                    <div hidden={isBudgetDataLoaded} >
                        <Loader />
                    </div>
                    <div hidden={!isBudgetDataLoaded}>
                        <Row >
                            <Col>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Control</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">

                                    <Row>

                                        <Col>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='buyerId'>SYS ID </Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {budgetBasicInfo?.sysId}
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='buyerId'> Budget No </Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-input-group'>
                                                    <div className='custom-input-group-prepend inside-btn'>

                                                        <Input
                                                            bsSize="sm"
                                                            name="budgetNumber"
                                                            value={budgetBasicInfo?.budgetNumber}
                                                            onChange={( e ) => { handleBudgetInputOnChange( e ); }}
                                                        />


                                                    </div>
                                                    <div className='custom-input-group-append inside-btn'>
                                                        <Button.Ripple
                                                            className='btn-icon'
                                                            outline
                                                            size="sm"
                                                            color='primary'
                                                            onClick={() => { handleBudgetOnSearch(); }}
                                                        >
                                                            <Search size={16} />
                                                        </Button.Ripple>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='buyerId'> Buyer</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-input-group'>
                                                    <div className='custom-input-group-prepend inside-btn'>

                                                        {budgetBasicInfo?.buyerName}


                                                    </div>
                                                    <div className='custom-input-group-append inside-btn'>
                                                        <span>
                                                            <Button.Ripple
                                                                className='btn-icon'
                                                                outline
                                                                size="sm"
                                                                color='secondary'
                                                                onClick={() => { handleOpenPOModal(); }}
                                                            >
                                                                <MoreHorizontal color='green' size={16} />
                                                            </Button.Ripple>
                                                        </span>
                                                        <span style={{ color: 'green', fontWeight: 'bolder', fontSize: "1.2rem" }}>*</span>

                                                    </div>
                                                </div>
                                            </div>

                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='buyerId'> Category </Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {budgetBasicInfo?.budgetCategory}
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='buyerId'> Current Category </Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {budgetBasicInfo?.budgetCurrentCategory}
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: 'flex-end', alignItems: 'center' }}>
                                                <span style={{ color: 'green', fontWeight: 'bolder', fontSize: "1.2rem", marginRight: '0.5rem' }}>*</span>
                                                <span style={{ fontWeight: 'bold', fontSize: '0.7rem', fontStyle: 'italic' }}> Buyer PO Modal Open Button</span>
                                            </div>


                                        </Col>

                                    </Row>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={7}>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Selected Purchase Order</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row>
                                        <Col >
                                            <div className='custom-table'>
                                                <Table responsive bordered>
                                                    <thead className='text-center'>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Style</th>
                                                            <th>PO</th>
                                                            <th>Order Qty</th>
                                                            <th>Shipment Date</th>
                                                            <th>Destination</th>
                                                            <th>Action</th>
                                                            {/* <th>Exporter</th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            budgetPurchaseOrderQuantityDetails?.map( ( order, index ) => (
                                                                <tr key={index + 1} >
                                                                    <td style={{ width: '4px' }} className='text-center'>
                                                                        {index + 1}
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        {order.styleNumber}
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        {order.orderNumber}
                                                                    </td>
                                                                    <td className='text-right'>
                                                                        {order.orderQuantity}
                                                                    </td>

                                                                    <td className='text-center'>
                                                                        {moment( order.shipmentDate ).format( 'DD-MM-YYYY' )}
                                                                    </td>
                                                                    <td className='text-right'>
                                                                        {order.destination}
                                                                    </td>
                                                                    <td className='text-center action'>
                                                                        <Button.Ripple
                                                                            id="bgt-po-delete-id"
                                                                            className="btn-icon p-0"
                                                                            disabled={order?.isRestrictedToChange}

                                                                            tag={Label}
                                                                            color="flat-danger"
                                                                            onClick={() => { handleDeleteBudgetPO( order ); }}
                                                                        >
                                                                            <Trash2
                                                                                size={18}
                                                                                id="bgt-po-delete-id"
                                                                                color='red'

                                                                            />

                                                                        </Button.Ripple>
                                                                    </td>

                                                                </tr>
                                                            ) )
                                                        }
                                                        {
                                                            budgetPurchaseOrderQuantityDetails.length ? <tr className='font-weight-bolder'>
                                                                <td className='text-right' colSpan={3}>
                                                                    Total
                                                                </td>
                                                                <td className='text-right'  >
                                                                    {_.sum( budgetPurchaseOrderQuantityDetails?.map( order => Number( order.orderQuantity ) ) )}
                                                                </td>
                                                                <td className='text-right' colSpan={3}>

                                                                </td>
                                                            </tr> : <tr >
                                                                <td className='text-center' colSpan={7}>
                                                                    There are no records to display
                                                                </td>

                                                            </tr>
                                                        }


                                                    </tbody>

                                                </Table>

                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>

                        <Row >
                            <Col xs={12} sm={12} md={12} lg={8}>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Summary</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row>
                                        <Col className="custom-table">
                                            <Table bordered responsive className='text-center'>
                                                <thead>
                                                    <tr>
                                                        <th>Costing Head</th>
                                                        <th>Costing Amount</th>
                                                        <th>BOM Amount</th>
                                                        <th>Costing/PC(avg)</th>
                                                        <th>BOM Amount/PC(avg)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        budgetCostingAndBomSummary?.map( ( summary, index ) => (
                                                            <tr key={index + 1} className={summary.totalCostingAmount < summary.totalBomAmount ? 'bg-light-danger font-weight-bold' : 'text-right'}>
                                                                <td className='font-weight-bold text-left'>{summary.groupName}</td>
                                                                <td className="text-right">{isZeroToFixed( summary.totalCostingAmount, 4 )}</td>
                                                                <td className="text-right">{isZeroToFixed( summary.totalBomAmount, 4 )}</td>
                                                                <td className="text-right">{isZeroToFixed( summary.avgCostingRate, 4 )}</td>
                                                                <td className="text-right">{isZeroToFixed( summary.avgBomRate, 4 )}</td>
                                                            </tr>

                                                        ) )

                                                    }
                                                    {
                                                        budgetCostingAndBomSummary.length ? <tr className='font-weight-bolder text-right'>
                                                            <td>Total</td>
                                                            <td>
                                                                {isZeroToFixed( _.sum( budgetCostingAndBomSummary?.map( order => order.totalCostingAmount ) ), 4 )}

                                                            </td>
                                                            <td>
                                                                {isZeroToFixed( _.sum( budgetCostingAndBomSummary?.map( order => order.totalBomAmount ) ), 4 )}
                                                            </td>
                                                            <td></td>
                                                            <td></td>
                                                        </tr> : <tr >
                                                            <td className='text-center' colSpan={5}>
                                                                There are no records to display
                                                            </td>

                                                        </tr>
                                                    }

                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={4}>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Garment Service Budget</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row>
                                        <Col className="custom-table">
                                            <Table bordered responsive className='text-center'>
                                                <thead>
                                                    <tr>
                                                        <th>Costing Head</th>
                                                        <th>PC Amount</th>
                                                        <th>Approved Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        _.orderBy( serviceCostSummary, ['id'], ['asc'] )?.map( ( summary, index ) => (
                                                            <tr key={index + 1} >
                                                                <td className="text-left font-weight-bold">{summary.serviceGroup}</td>
                                                                <td className='text-right'>{isZeroToFixed( summary.totalBuyerCost, 4 )}</td>
                                                                <td className='text-right'>
                                                                    <NumberFormat
                                                                        className="form-control-sm form-control text-right"
                                                                        value={summary?.approvedAmount}
                                                                        displayType="input"
                                                                        name="approvedAmount"
                                                                        decimalScale={4}
                                                                        fixedDecimalScale={summary?.approvedAmount > 0}
                                                                        allowNegative={false}
                                                                        allowLeadingZeros={false}
                                                                        onFocus={e => {
                                                                            e.target.select();
                                                                        }}
                                                                        onBlur={e => { handleServiceCostSummaryChange( e, summary.id ); }}
                                                                        onChange={e => { handleServiceCostSummaryChange( e, summary.id ); }}
                                                                    />
                                                                </td>
                                                            </tr>

                                                        ) )
                                                    }
                                                    {
                                                        <tr className='font-weight-bolder text-right'>
                                                            <td>Total</td>
                                                            <td>
                                                                {isZeroToFixed( _.sum( serviceCostSummary?.map( order => order.totalBuyerCost ) ), 4 )}

                                                            </td>
                                                            <td>
                                                                {isZeroToFixed( _.sum( serviceCostSummary?.map( order => order.approvedAmount ) ), 4 )}
                                                            </td>

                                                        </tr>
                                                    }

                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <Row >
                            <Col>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Fabric && Accessories Details</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row>
                                        <Col>
                                            <div className='tab-main'>
                                                <div className='tab-sidebar'>
                                                    <div className='link-tab' >
                                                        <li onClick={() => { handleTab( 'Fabric' ); }} className={`${activeTab === 'Fabric' ? 'tab-link-item active' : 'tab-link-item inactive'}`}> Fabric</li>
                                                        <li onClick={() => { handleTab( 'Accessories' ); }} className={`${activeTab === 'Accessories' ? 'tab-link-item active' : 'tab-link-item inactive'}`}> Accessories </li>
                                                        <li onClick={() => { handleTab( 'Packaging' ); }} className={`${activeTab === 'Packaging' ? 'tab-link-item active' : 'tab-link-item inactive'}`}> Packaging </li>
                                                    </div>
                                                </div>
                                                <div className='tab-main-content'>
                                                    {activeTab === 'Fabric' ? (
                                                        <BudgetFabricDetails />
                                                    ) : activeTab === 'Accessories' ? (
                                                        <BudgetAccessoriesDetails />
                                                    ) : activeTab === 'Packaging' ? (
                                                        <BudgetPackDetails />
                                                    ) : null
                                                    }
                                                </div>
                                            </div>
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
                                                    {isPermit( userPermission?.BudgetCanApprove, authPermissions ) ? (
                                                        <Select
                                                            id='pOrderId'
                                                            name="updateStatus"
                                                            isSearchable
                                                            isDisabled={!isPermittedByStatus( budgetBasicInfo?.status?.value, budgetBasicInfo?.approvedById )}
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={budgetStatus}
                                                            classNamePrefix='dropdown'
                                                            // className={classNames( `erp-dropdown-select ${( errors && errors.status && !procurementBasicInfo?.status ) && 'is-invalid'}` )}
                                                            className={classNames( `erp-dropdown-select` )}
                                                            value={budgetBasicInfo?.updateStatus}
                                                            onChange={( data, e ) => {
                                                                handleDropdownOnChange( data, e );
                                                            }} />
                                                    ) : budgetBasicInfo?.status?.label
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='statusId'>Approved By</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {budgetBasicInfo?.approvedBy ?? ''}

                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='statusId'>Approved Date</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {budgetBasicInfo?.approveDate ? moment( budgetBasicInfo.approveDate ).format( 'DD/MM/YYYY' ) : ''}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>


                </CardBody>

            </Card>
            {
                openPOModal && (
                    <POModal
                        openModal={openPOModal}
                        setOpenModal={setOpenPOModal}
                    />
                )
            }

            {
                openSearchableModal && (
                    <BudgetSearchableListModal
                        openModal={openSearchableModal}
                        setOpenModal={setOpenSearchableModal}
                        searchFor="edit-details"
                    />
                )
            }
        </div >
    );
};

export default BudgetEditForm;

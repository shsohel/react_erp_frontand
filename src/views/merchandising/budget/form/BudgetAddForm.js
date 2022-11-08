import Loader from '@components/spinner/Fallback-spinner';
import '@custom-styles/merchandising/form/budget-form.scss';
import '@custom-styles/merchandising/others/custom-tab.scss';
import '@custom-styles/merchandising/others/custom-table.scss';

import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import { MoreHorizontal, Trash2 } from 'react-feather';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { budgetStatus, confirmObj } from '../../../../utility/enums';
import { isPermit, isZeroToFixed, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownBuyers } from '../../buyer/store/actions';
import { addBudget, bindBudgetBasicInfo, bindBudgetPurchaseOrderDetails, bindServiceCostSummary, cleanAllBudgetState, getBudgetDetails, getBuyerPODetailsForBudget } from '../store/actions';
import { BudgetAccessoriesDetails } from './BudgetAccessoriesDetails';
import { BudgetFabricDetails } from './BudgetFabricDetails';
import { BudgetPackDetails } from './BudgetPackDetails';
import { POModal } from './POModal';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        icon: '',
        isActive: false
    },
    {
        id: 'budgetList',
        name: 'List',
        link: "/budget",
        icon: '',
        isActive: false
    },
    {
        id: 'budget',
        name: 'Budget Add',
        link: "#",
        icon: '',
        isActive: true
    }
];

const BudgetAddForm = () => {
    const { replace, push } = useHistory();
    const dispatch = useDispatch();
    const { dropDownBuyers } = useSelector( ( { buyers } ) => buyers );
    const {
        budgetBasicInfo,
        budgetCostingAndBomSummary,
        budgetPurchaseOrderQuantityDetails,
        serviceCostSummary,
        isBudgetDataLoaded
    } = useSelector( ( { budgets } ) => budgets );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    const [openPOModal, setOpenPOModal] = useState( false );
    const [activeTab, setActiveTab] = useState( 'Fabric' );


    const handleBuyerDropdownChange = ( data ) => {
        //  setBuyer( data );
        const updatedObj = {
            ...budgetBasicInfo,
            buyer: data
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

    const handleBudgetInputOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...budgetBasicInfo,
            [name]: value
        };
        dispatch( bindBudgetBasicInfo( updatedObj ) );
    };

    const handleBuyerOnFocus = () => {
        dispatch( getDropDownBuyers() );
    };


    const handleOpenPOModal = () => {
        setOpenPOModal( !openPOModal );
        dispatch( getBuyerPODetailsForBudget( budgetBasicInfo?.buyer?.value ) );
    };
    const handleTab = ( item ) => {
        setActiveTab( item );
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
    const handleDeleteBudgetPO = ( rowId ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                const updatedData = budgetPurchaseOrderQuantityDetails.filter( order => order.rowId !== rowId );
                const queryData = updatedData.map( order => ( {
                    orderId: order.orderId,
                    styleId: order.styleId,
                    shipmentDate: order.shipmentDate,
                    destination: order.destination

                } ) );
                dispatch( bindBudgetPurchaseOrderDetails( updatedData ) );
                dispatch( getBudgetDetails( queryData ) );
            }
        } );
    };

    const onSubmit = () => {
        const orderDetails = budgetPurchaseOrderQuantityDetails?.map( order => ( {
            bomId: order.bomId,
            orderId: order.orderId,
            orderNumber: order.orderNumber,
            styleId: order.styleId,
            styleNumber: order.styleNumber,
            orderQuantity: order.orderQuantity,
            shipmentDate: order.shipmentDate,
            destination: order.destination
        } ) );

        const serviceCostDetails = serviceCostSummary.map( scs => ( {
            name: scs.serviceGroup,
            amount: scs.approvedAmount
        } ) );

        const submitObj = {
            budgetNumber: budgetBasicInfo?.budgetNumber,
            buyerId: budgetBasicInfo?.buyer?.value,
            budgetCategory: budgetBasicInfo?.budgetCategory,
            status: budgetBasicInfo?.status?.value,
            orderDetails,
            serviceCostDetails
        };
        console.log( JSON.stringify( submitObj, null, 2 ) );
        dispatch( addBudget( submitObj, push ) );
    };
    const handleClear = () => {
        dispatch( cleanAllBudgetState( null ) );
    };

    const handleCancel = () => {
        replace( '/budget' );
        dispatch( cleanAllBudgetState( null ) );

    };

    const totalOrderQuantity = _.sum( budgetPurchaseOrderQuantityDetails?.map(
        order => Number( order.orderQuantity )
    ) );

    return (
        <div>
            <div className="mt-3 ">
                <ActionMenu breadcrumb={breadcrumb} title='Budget' >
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="primary"
                            onClick={() => { onSubmit(); }}
                        >Save</NavLink>
                    </NavItem>
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="secondary"
                            onClick={() => { handleClear(); }}
                        >
                            Clear
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
                    {/* <UncontrolledButtonDropdown>
                        <DropdownToggle color='primary' size="sm" caret>
                            Action
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => { console.log( 'hel' ); }}>
                                Print
                            </DropdownItem>
                            <DropdownItem  >
                                Button 2
                            </DropdownItem>
                            <DropdownItem>
                                Button 3
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledButtonDropdown> */}
                </ActionMenu>
            </div>
            <Card className="budget-form">
                <div hidden={isBudgetDataLoaded} >
                    <Loader />
                </div>
                <div hidden={!isBudgetDataLoaded}>
                    <CardBody>
                        <Row >
                            <Col xs={12} sm={12} md={12} lg={5}>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Control</div>
                                </div>
                                <div className="border rounded rounded-3 p-1 ">
                                    <Row>

                                        <Col>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='buyerId'> Budget No </Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <Input
                                                        bsSize="sm"
                                                        name="budgetNumber"
                                                        value={budgetBasicInfo?.budgetNumber}
                                                        onChange={( e ) => { handleBudgetInputOnChange( e ); }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='buyerId'> Buyer</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-input-group'>
                                                    <div className='custom-input-group-prepend inside-btn'>
                                                        <Select
                                                            id='buyerId'
                                                            isSearchable
                                                            name="buyer"
                                                            isLoading={!dropDownBuyers.length}
                                                            placeholder="Select Buyer"
                                                            isClearable
                                                            maxMenuHeight={200}
                                                            menuShouldScrollIntoView
                                                            theme={selectThemeColors}
                                                            options={dropDownBuyers}
                                                            classNamePrefix='dropdown'
                                                            className="erp-dropdown-select"
                                                            // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                            value={budgetBasicInfo?.buyer}
                                                            onChange={( data, e ) => {
                                                                handleDropdownOnChange( data, e );
                                                            }}
                                                            onFocus={() => { handleBuyerOnFocus(); }}
                                                        />
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
                                                    {/* <div className='custom-input-group-prepend inside-btn'>
                                                        <Select
                                                            id='buyerId'
                                                            isSearchable
                                                            name="buyer"
                                                            isLoading={!dropDownBuyers.length}
                                                            placeholder="Select Buyer"
                                                            isClearable
                                                            maxMenuHeight={200}
                                                            menuShouldScrollIntoView
                                                            theme={selectThemeColors}
                                                            options={dropDownBuyers}
                                                            classNamePrefix='dropdown'
                                                            className="erp-dropdown-select"
                                                            // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                            value={budgetBasicInfo?.buyer}
                                                            onChange={( data, e ) => {
                                                                handleDropdownOnChange( data, e );
                                                            }}
                                                            onFocus={() => { handleBuyerOnFocus(); }}
                                                        />
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
                                                                <MoreHorizontal size={16} />
                                                            </Button.Ripple>
                                                        </span>
                                                        <span className='text-danger font-weight-bolder'>**</span>
                                                    </div> */}
                                                </div>
                                            </div>

                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='buyerId'> Category </Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    {budgetBasicInfo?.budgetCategory}
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
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            budgetPurchaseOrderQuantityDetails?.map( ( order, index ) => (
                                                                <tr key={index + 1} >
                                                                    <td className='text-center sl'>
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
                                                                        {moment( Date.parse( order.shipmentDate ) ).format( 'DD-MM-YYYY' )}
                                                                    </td>
                                                                    <td className='text-right'>
                                                                        {order.destination}
                                                                    </td>
                                                                    <td className='text-center action'>
                                                                        <Button.Ripple
                                                                            id="bgt-po-delete-id"
                                                                            className="btn-icon p-0"
                                                                            tag={Label}
                                                                            color="flat-danger"
                                                                            onClick={() => { handleDeleteBudgetPO( order.rowId ); }}
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
                                                        <th className='text-left'>Costing Head</th>
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
                                                        </tr> : < >
                                                            < tr className='text-left font-weight-bold' >
                                                                <td>Fabric</td>
                                                                <td className="text-right">0</td>
                                                                <td className="text-right">0</td>
                                                                <td className="text-right">0</td>
                                                                <td className="text-right">0</td>
                                                            </tr>
                                                            < tr className='text-left font-weight-bold' >
                                                                <td>Accessories</td>
                                                                <td className="text-right">0</td>
                                                                <td className="text-right">0</td>
                                                                <td className="text-right">0</td>
                                                                <td className="text-right">0</td>
                                                            </tr>
                                                            <tr className='font-weight-bolder text-right'>
                                                                <td>Total</td>
                                                                <td>
                                                                    0
                                                                </td>
                                                                <td>
                                                                    0
                                                                </td>
                                                                <td></td>
                                                                <td></td>
                                                            </tr>
                                                        </>
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
                                                        serviceCostSummary?.map( ( summary, index ) => (
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
                                                        serviceCostSummary.length ? <tr className='font-weight-bolder text-right'>
                                                            <td>Total</td>
                                                            <td>
                                                                {isZeroToFixed( _.sum( serviceCostSummary?.map( order => order.totalBuyerCost ) ), 4 )}

                                                            </td>
                                                            <td>
                                                                {/* {( _.sum( serviceCostSummary?.map( order => order.totalInHouseCost ) ).toFixed( 4 ) )} */}
                                                                {isZeroToFixed( _.sum( serviceCostSummary?.map( order => order.approvedAmount ) ), 4 )}
                                                            </td>

                                                        </tr> : <>
                                                            < tr className='text-left font-weight-bold' >

                                                                <td>Print</td>
                                                                <td></td>
                                                                <td></td>

                                                            </tr>
                                                            < tr className='text-left font-weight-bold' >

                                                                <td>Wash</td>
                                                                <td></td>
                                                                <td></td>

                                                            </tr>
                                                            < tr className='text-left font-weight-bold' >
                                                                <td>Embroidery</td>
                                                                <td></td>
                                                                <td></td>
                                                            </tr>
                                                        </>
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
                                                    <Select
                                                        id='pOrderId'
                                                        name="status"
                                                        isDisabled={!isPermit( userPermission?.BudgetCanApprove, authPermissions )}
                                                        isSearchable
                                                        menuPosition="fixed"
                                                        theme={selectThemeColors}
                                                        options={budgetStatus}
                                                        classNamePrefix='dropdown'
                                                        // className={classNames( `erp-dropdown-select ${( errors && errors.status && !procurementBasicInfo?.status ) && 'is-invalid'}` )}
                                                        className={classNames( `erp-dropdown-select` )}
                                                        value={budgetBasicInfo?.status}
                                                        onChange={( data, e ) => {
                                                            handleDropdownOnChange( data, e );
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
                                                    {budgetBasicInfo?.approvedDate ? moment( Date.parse( budgetBasicInfo.approvedDate ) ).format( 'DD/MM/YYYY' ) : ''}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>

                    </CardBody>
                </div>
            </Card>
            <POModal
                openModal={openPOModal}
                setOpenModal={setOpenPOModal}
            />
        </div >
    );
};

export default BudgetAddForm;

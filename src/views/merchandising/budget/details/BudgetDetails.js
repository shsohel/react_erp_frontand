import Loader from '@components/spinner/Fallback-spinner';
import '@custom-styles/merchandising/form/budget-form.scss';
import '@custom-styles/merchandising/others/custom-tab.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { budgetStatus, confirmObj, permissibleProcessObj } from '../../../../utility/enums';
import { isPermit, isZeroToFixed, selectThemeColors } from '../../../../utility/Utils';
import { BudgetAccessoriesDetails } from '../form/BudgetAccessoriesDetails';
import { BudgetFabricDetails } from '../form/BudgetFabricDetails';
import { BudgetPackDetails } from '../form/BudgetPackDetails';
import BudgetSearchableListModal from '../form/BudgetSearchableListModal';
import { bindBudgetBasicInfo, budgetStatusChange, cleanAllBudgetState, getBudgetById } from '../store/actions';
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
        name: 'Budget Details',
        link: "/budget-details",
        isActive: true
    }
];
const BudgetDetails = () => {
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
    const [openSearchableModal, setOpenSearchableModal] = useState( false );

    const [activeTab, setActiveTab] = useState( 'Fabric' );


    useEffect( () => {
        dispatch( getBudgetById( budgetId, push ) );
    }, [dispatch, budgetId] );

    const handleTab = ( item ) => {
        setActiveTab( item );
    };


    const handleDropdownOnChange = ( data, event ) => {
        const { name } = event;

        const updatedObj = {
            ...budgetBasicInfo,
            [name]: data
        };
        dispatch( bindBudgetBasicInfo( updatedObj ) );
    };


    const handleStatusDropdownOChange = ( data, e ) => {
        const { name } = e;
        if ( budgetBasicInfo?.status?.value === 'Approved' ) {
            confirmDialog( {
                ...confirmObj,
                title: `Approved By`,
                text: `<h4 class="text-primary mb-0">${budgetBasicInfo.approvedBy}</h4> <br/> <span> Are you sure to change?</span>`
            } ).then( async e => {
                if ( e.isConfirmed ) {
                    const updatedObj = {
                        ...budgetBasicInfo,
                        [name]: data
                    };
                    dispatch( bindBudgetBasicInfo( updatedObj ) );
                }
            } );
        } else {
            const updatedObj = {
                ...budgetBasicInfo,
                [name]: data
            };
            dispatch( bindBudgetBasicInfo( updatedObj ) );
        }
    };


    const handleBudgetOnSearch = () => {
        setOpenSearchableModal( !openSearchableModal );
    };


    const onSubmit = () => {
        dispatch( budgetStatusChange( budgetId, budgetBasicInfo?.updateStatus?.label ) );

    };

    const handleAddNew = () => {
        dispatch( cleanAllBudgetState() );
        push( '/add-budget' );

    };

    const handleCancel = () => {
        replace( '/budget' );
        dispatch( cleanAllBudgetState() );
    };

    console.log( 'permisible', authenticateUser.permissibleProcesses.some( p => p === 'Budget' ) );
    console.log( 'can Aprrove', isPermit( userPermission?.BudgetCanApprove, authPermissions ) );
    console.log( 'user', authenticateUser?.id === budgetBasicInfo?.approvedById );

    const isPermittedByStatus = ( status, approvedById ) => {

        if ( status === "Approved" ) {
            const permitted = ( authenticateUser?.id === approvedById )
                || authenticateUser.permissibleProcesses.some( p => p === permissibleProcessObj.budget );
            return permitted;
        } else {
            return true;
        }
    };

    const handleEdit = () => {
        replace( { pathname: 'edit-budget', state: budgetId } );

    };

    const isEditButtonHidden = ( status ) => {
        let hidden = false;
        if ( status === 'Approved' ) {
            hidden = true;
        } else if ( status !== 'Approved' ) {
            hidden = !isPermit( userPermission?.BudgetEdit, authPermissions );
        }
        return hidden;

    };

    return (
        <div>
            <div className="mt-3 ">
                <ActionMenu breadcrumb={breadcrumb} title='Budget Details' >
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="primary"
                            disabled={!isBudgetDataLoaded}
                            onClick={() => { onSubmit(); }}
                        >
                            Save
                        </NavLink>
                    </NavItem>
                    <NavItem
                        className="mr-1"
                        hidden={isEditButtonHidden( budgetBasicInfo?.status?.value )}
                    >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="success"
                            onClick={() => { handleEdit(); }}
                            disabled={!isBudgetDataLoaded}

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
                                                <div className='custom-form-group'>


                                                    {budgetBasicInfo?.budgetNumber}


                                                    {/* <div className='custom-input-group-append inside-btn'>
                                                        <Button.Ripple
                                                            className='btn-icon'
                                                            outline
                                                            size="sm"
                                                            color='primary'
                                                            onClick={() => { handleBudgetOnSearch(); }}
                                                        >
                                                            <Search size={16} />
                                                        </Button.Ripple>
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='buyerId'> Buyer</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-input-group'>
                                                    {budgetBasicInfo?.buyerName}
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
                                                                        {moment( Date.parse( order.shipmentDate ) ).format( 'DD-MM-YYYY' )}
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        {order.destination}
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
                                                                    {isZeroToFixed( summary?.approvedAmount, 4 )}
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
                        <Row >
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
                                                                handleStatusDropdownOChange( data, e );
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
                                                    {budgetBasicInfo?.approveDate ? moment( Date.parse( budgetBasicInfo.approveDate ) ).format( 'DD/MM/YYYY' ) : ''}
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
            {/* {
                openPOModal && (
                    <POModal
                        openModal={openPOModal}
                        setOpenModal={setOpenPOModal}
                    />
                )
            } */}

            {
                openSearchableModal && (
                    <BudgetSearchableListModal
                        openModal={openSearchableModal}
                        setOpenModal={setOpenSearchableModal}
                        searchFor="budget-details"
                    />
                )
            }
        </div >
    );
};

export default BudgetDetails;

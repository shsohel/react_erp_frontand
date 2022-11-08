import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/merchandising/form/consumption-form.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Search } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Card, CardBody, Col, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import LabelBox from '../../../../utility/custom/LabelBox';
import { isPermit } from '../../../../utility/Utils';
import ConsumptionSearchModal from '../form/ConsumptionSearchableListModal';
import { cleanAllConsumptionState, getConsumptionById } from '../store/actions';
import ConsumptionDetailsForm from './ConsumptionDetailsForm';
const ConsumptionDetails = () => {
    const dispatch = useDispatch();
    const { replace } = useHistory();

    const { state } = useLocation();
    const consumptionId = state;
    const {
        consumptionBasicInfo,
        consumptionFabricDetails,
        consumptionAccessoriesDetails,
        consumptionPackagingAccessories,
        isConsumptionDataLoaded,
        consumptionPurchaseOrderSizes,
        consumptionPurchaseOrderColors
    } = useSelector( ( { consumptions } ) => consumptions );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    useEffect( () => {
        dispatch( getConsumptionById( consumptionId ) );
    }, [dispatch, consumptionId] );

    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: '/',
            isActive: false
        },
        {
            id: 'consumptions',
            name: 'List',
            link: '/consumptions',
            isActive: false
        },
        {
            id: 'editConsumption',
            name: 'Consumption',
            link: '#',
            isActive: true
        }
    ];


    const [consumptionSearchModalOpen, setConsumptionSearchModalOpen] = useState( false );
    const handleConsumptionSearch = () => {
        setConsumptionSearchModalOpen( !consumptionSearchModalOpen );
    };


    const handleSubmit = () => {

    };

    const handleCancel = () => {
        replace( '/consumptions' );
        dispatch( cleanAllConsumptionState() );
    };

    const handleAddNew = () => {
        replace( '/new-consumption' );
        dispatch( cleanAllConsumptionState() );

    };

    const handleEdit = () => {
        replace( { pathname: `/consumptions-edit`, state: `${consumptionBasicInfo.id}` } );
    };


    return (
        <div>
            <UILoader blocking={!isConsumptionDataLoaded} loader={<ComponentSpinner />} >

                <Card className="mt-3 consumption-form" style={{ minHeight: '80vh' }}>
                    <CardBody>
                        <ActionMenu breadcrumb={breadcrumb} title='Consumption Details' >
                            <NavItem
                                hidden={!isPermit( userPermission?.ConsumptionEdit, authPermissions )}
                                className="mr-1"
                            >
                                <NavLink
                                    tag={Button}
                                    disabled={!isConsumptionDataLoaded}
                                    size="sm"
                                    color="primary"
                                    onClick={() => { handleEdit(); }}
                                >Edit</NavLink>
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
                        <Row>
                            <Col>

                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Consumption Basic Info</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='buyerId'>SYS ID</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-input-group'>
                                                            <div className='custom-input-group-prepend inside-btn'>
                                                                <LabelBox text={consumptionBasicInfo?.sysId} />
                                                            </div>
                                                            <div className='custom-input-group-append inside-btn'>
                                                                <Button.Ripple
                                                                    className='btn-icon'
                                                                    outline
                                                                    size="sm"
                                                                    color='primary'
                                                                    onClick={() => { handleConsumptionSearch(); }}
                                                                >
                                                                    <Search size={16} />
                                                                </Button.Ripple>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='buyerId'> Consumption No</Label>
                                                        <Label className='custom-form-colons'> : </Label>

                                                        <div className='custom-form-group'>

                                                            <LabelBox text={consumptionBasicInfo?.consumptionNumber} />

                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='buyerId'> Buyer</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            {/* <Label className="font-weight-bold" > {consumptionBasicInfo?.buyer?.label} </Label> */}
                                                            <LabelBox text={consumptionBasicInfo?.buyer?.label} />
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='styleId'> Style</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <LabelBox text={consumptionBasicInfo?.style?.label} />
                                                        </div>
                                                    </div>

                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={8} xl={8} >
                                                    <div className=' border rounded pt-0 pr-1 pb-1 pl-1 costing-custom-table' style={{ minHeight: '137px' }} >
                                                        <Label className="font-weight-bolder"> Purchase Order :</Label>
                                                        <Table responsive bordered size="sm">
                                                            <thead className='text-center'>
                                                                <tr>
                                                                    <th className='sl'>SL</th>
                                                                    <th>PO NO</th>
                                                                    <th>Costing NO</th>
                                                                    <th>Shipt. Date</th>
                                                                    <th>Destination</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className='text-center' >
                                                                {/* {_.uniqBy( consumptionBasicInfo?.styleOrderDetails, 'orderId' )?.map( ( order, index ) => (
                                                                <tr key={order?.rowId}>
                                                                    <td className='sl'>{index + 1}</td>
                                                                    <td>{order.orderNumber}</td>
                                                                    <td>{moment( order.shipmentDate ).format( "DD-MM-YYYY" )}</td>
                                                                </tr>
                                                            ) )
                                                            } */}

                                                                {
                                                                    consumptionBasicInfo?.styleOrderDetails?.length > 0 ? (
                                                                        consumptionBasicInfo?.styleOrderDetails?.map( ( order, index ) => (
                                                                            <tr key={order?.rowId}>
                                                                                <td className='sl'>{index + 1}</td>
                                                                                <td>{order.orderNumber}</td>
                                                                                <td>{order.costingNumber}</td>
                                                                                <td>{moment( order.shipmentDate ).format( "DD-MM-YYYY" )}</td>
                                                                                <td>{order.destination}</td>

                                                                            </tr>
                                                                        ) )
                                                                    ) : <tr >
                                                                        <td colSpan={5}>There are no records to display</td>
                                                                    </tr>
                                                                }
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </Col>

                                            </Row>

                                        </Col>
                                    </Row>

                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Consumption Details</div>
                                </div>

                                <div hidden={!isConsumptionDataLoaded} className="border rounded rounded-3 p-1">
                                    <Row>
                                        <Col>
                                            <ConsumptionDetailsForm />
                                        </Col>
                                    </Row>
                                </div>
                            </Col>

                        </Row>
                    </CardBody>
                </Card>
            </UILoader>
            {
                consumptionSearchModalOpen && (
                    <ConsumptionSearchModal
                        openModal={consumptionSearchModalOpen}
                        setOpenModal={setConsumptionSearchModalOpen}
                        searchFor="Consumption Details"
                    />
                )
            }
        </div>
    );
};

export default ConsumptionDetails;
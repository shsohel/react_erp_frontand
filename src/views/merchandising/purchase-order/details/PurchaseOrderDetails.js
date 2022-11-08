import Spinner from '@components/spinner/Fallback-spinner';
import '@custom-styles/merchandising/others/custom-table.scss';
import '@custom-styles/merchandising/others/po-details-table.scss';
import '@custom-styles/merchandising/select/po-details-select.scss';
import '@custom-styles/merchandising/view/po-view.scss';
import _ from 'lodash';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { Check, Maximize2, Minimize2, MoreVertical, Settings, X } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, Col, Collapse, CustomInput, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import ResizableTable from '../../../../utility/custom/ResizableTable';
import { bindPurchaseOrderDetails, getColorSizeRationByPODetailsId, getPOSizeColorQuantitySummaryByDetailsId, getPOSizeColorQuantitySummaryDetails, getPurchaseOrderById, getPurchaseOrderDetails } from '../store/actions';
import POStyleDetails from './POStyleDetails';
import SizeColorRatioDetails from './SizeColorRatioDetails';
import SizeRatioDetails from './SizeRatioDetails';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'purchaseOrderList',
        name: 'List',
        link: "/purchase-order",
        isActive: false
    },
    {
        id: 'purchaseOrder',
        name: 'Purchase Order',
        link: "#",
        isActive: true
    }
];

const Label2 = () => (
    <Fragment>
        <span className='switch-icon-left'>
            <Check size={14} />
        </span>
        <span className='switch-icon-right'>
            <X size={14} />
        </span>
    </Fragment>
);


const PurchaseOrderDetails = () => {
    const { replace, push } = useHistory();
    const { state } = useLocation();

    const poId = state;
    const dispatch = useDispatch();
    const { selectedPurchaseOrder, purchaseOrderDetails, orderDetailsSizeColorQuantitySummary } = useSelector( ( { purchaseOrders } ) => purchaseOrders );
    const [isColorSizeCombinationOpen, setIsColorSizeCombinationOpen] = useState( true );
    const [openModal, setOpenModal] = useState( false );
    const [isOpen, setIsOpen] = useState( false );
    const [isItSetOrder, setIsItSetOrder] = useState( false );
    const toggle = () => setIsOpen( !isOpen );

    useEffect( () => {
        dispatch( getPurchaseOrderById( poId ) );
        dispatch( getPurchaseOrderDetails( poId ) );
    }, [dispatch, poId] );

    let totalAmount = null;
    const sumOfAmount = ( value ) => {
        const values = +value;
        totalAmount = values;
        return values;
    };
    const [isSizeRationOpen, setIsSizeRationOpen] = useState( false );
    const [colorSizeRationIds, setColorSizeRationIds] = useState( null );

    const handleOpenSizeColorRation = ( orderDetailsId, orderQuantity ) => {

        const obj = {
            orderQuantity
        };
        setColorSizeRationIds( obj );
        setIsSizeRationOpen( !isSizeRationOpen );
        dispatch( getColorSizeRationByPODetailsId( orderDetailsId ) );
    };
    const handleOpenSizeRation = ( orderDetailsId, styleId, orderQuantity ) => {
        const obj = {
            styleId,
            orderQuantity
        };
        setColorSizeRationIds( obj );
        setIsSizeRationOpen( !isSizeRationOpen );
        dispatch( getColorSizeRationByPODetailsId( orderDetailsId ) );
    };

    const handleCollapsibleTableOpen = ( fieldId, detailsId ) => {
        const updatedData = purchaseOrderDetails.map( od => {
            if ( fieldId === od.fieldId ) {
                od.isOpenDetails = !od.isOpenDetails;
            } else {
                od.isOpenDetails = false;
            }
            return od;
        } );
        dispatch( bindPurchaseOrderDetails( updatedData ) );
        dispatch( getPOSizeColorQuantitySummaryByDetailsId( detailsId ) );
    };


    const handlePODetailsQuantity = ( details, orderId, detailsId ) => {
        const modifiedDetails = details.map( additionalQty => ( {
            orderId,
            detailsId,
            id: additionalQty.id,
            color: additionalQty.color,
            colorId: additionalQty.colorId,
            quantity: additionalQty.quantity,
            size: additionalQty.size,
            sizeId: additionalQty.sizeId,
            styleId: additionalQty.styleId,
            styleNo: additionalQty.styleNo,
            excessPercentage: additionalQty?.excessPercentage,
            wastagePercentage: additionalQty?.wastagePercentage,
            sampleQuantity: additionalQty?.sampleQuantity,
            adjustedQuantity: additionalQty?.adjustedQuantity
        } ) );
        dispatch( getPOSizeColorQuantitySummaryDetails( modifiedDetails ) );
        setOpenModal( !openModal );
    };

    const groupedByColor = _.groupBy( orderDetailsSizeColorQuantitySummary, function ( d ) {
        return d.color;
    } );
    const groupByStyleNo = _.groupBy( orderDetailsSizeColorQuantitySummary, function ( d ) {
        return d.styleNo;
    } );

    const checkLoading = !selectedPurchaseOrder || purchaseOrderDetails.length === 0;

    const handleCancel = () => {
        replace( '/purchase-order' );
    };
    return (
        <div>

            {
                checkLoading ? <Spinner /> : (
                    <Card className="p-1 mt-3">
                        {/* <CardHeader  >
                <CardTitle className="text-dark font-weight-bold" tag='h2'> Purchase Order Details</CardTitle>
            </CardHeader> */}
                        <CardBody>

                            <ActionMenu breadcrumb={breadcrumb} title='Purchase Order' >
                                <NavItem className="mr-1" >
                                    <NavLink
                                        tag={Link}
                                        className="btn btn-primary"
                                        size="sm"
                                        type="submit"
                                        to={{ pathname: `/purchase-order-edit`, state: `${poId}` }}
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
                            </ActionMenu>
                            <Row>
                                <Col xs='12' sm='12' md='12' lg='12' xl='12'>

                                    <div className="border rounded rounded-3 p-2">
                                        <Row className="mb-1">
                                            <Col xs='3' sm='3' md='3' lg='3' xl='3' className="text-nowrap" >
                                                <Label className="text-dark font-weight-bold pb-1" for='styleNo'>Buyer PO No.</Label>
                                                <p className="h4 font-weight-bold" > {selectedPurchaseOrder?.orderNumber}</p>
                                            </Col>
                                            <Col xs='3' sm='3' md='3' lg='3' xl='3' className="text-nowrap">
                                                <Label className="text-dark font-weight-bold pb-1" for='season'>Purchase Order Date</Label>
                                                <p className="h4 font-weight-bold" >
                                                    {moment( selectedPurchaseOrder?.orderDate ).format( 'DD-MM-yy' )}
                                                </p>
                                            </Col>

                                            <Col xs='3' sm='3' md='3' lg='3' xl='3' className="text-nowrap">
                                                <Label className="text-dark font-weight-bold pb-1" for='description'>Description</Label>
                                                <p className="h4 font-weight-bold" >description</p>

                                            </Col>
                                            <Col xs='3' sm='3' md='3' lg='3' xl='3' className="">
                                                <Label className="text-dark font-weight-bold pb-1" for='sizeGroupIds'>Remarks</Label>
                                                <p className="h4 font-weight-bold" >This is Remarks</p>
                                            </Col>
                                        </Row>

                                        <Row className="mb-1">
                                            <Col xs='3' sm='3' md='3' lg='3' xl='3' className="text-nowrap">
                                                <Label className="text-dark font-weight-bold pb-1" for='buyer'>Buyer</Label>
                                                <p className="h4 font-weight-bold" >{selectedPurchaseOrder?.buyerName}</p>
                                            </Col>

                                            <Col xs='3' sm='3' md='3' lg='3' xl='3' className="text-nowrap">
                                                <Label className="text-dark font-weight-bold pb-1" for='buyerAgent'>Buyer Agent</Label>
                                                <p className="h4 font-weight-bold pb-1">{selectedPurchaseOrder?.agentName}</p>

                                            </Col>
                                            <Col xs='3' sm='3' md='3' lg='3' xl='3' className="text-nowrap">
                                                <Label className="text-dark font-weight-bold pb-1" for='buyerProductdeveloper'>Season</Label>
                                                <p className="h4 font-weight-bold" >{selectedPurchaseOrder?.season}</p>

                                            </Col>
                                            <Col xs='3' sm='3' md='3' lg='3' xl='3' className="text-nowrap">
                                                <Label className="text-dark font-weight-bold pb-1" for='buyerDepartment'>Year</Label>
                                                <p className="h4 font-weight-bold" >     {selectedPurchaseOrder?.year}</p>

                                            </Col>
                                        </Row>

                                        <Row >
                                            <Col xs='3' sm='3' md='3' lg='3' xl='3' className="text-nowrap">
                                                <Label className="text-dark font-weight-bold pb-1" for='division'>Total Order Quantity</Label>
                                                <p className="h4 font-weight-bold" >   {selectedPurchaseOrder?.totalOrderQuantity}
                                                </p>
                                            </Col>
                                            <Col xs='3' sm='3' md='3' lg='3' xl='3' className="text-nowrap">
                                                <Label className="text-dark font-weight-bold pb-1" for='styleDepartment'>Currency</Label>
                                                <p className="h4 font-weight-bold" >{selectedPurchaseOrder?.currencyCode}</p>
                                            </Col>
                                            <Col xs='3' sm='3' md='3' lg='3' xl='3' className="text-nowrap">
                                                <Label className="text-dark font-weight-bold pb-1" for='productCategory'> Total Amount</Label>
                                                <p className="h4 font-weight-bold" >54454</p>
                                            </Col>
                                            <Col xs='3' sm='3' md='3' lg='3' xl='3' className="text-nowrap">
                                                <div >
                                                    <div className='divider-text text-dark font-weight-bold pb-1'>Is-Set Order</div>
                                                </div>
                                                {/* <div className='divider divider-left divider-normal'>
                                        <div className='divider-text'>Size Specific</div>
                                    </div> */}

                                                {
                                                    !selectedPurchaseOrder?.isSetOrder ? ( < CustomInput
                                                        type='switch'
                                                        label={< Label2 />}
                                                        className='custom-control-success'
                                                        id='icon-success'
                                                        name='icon-success'
                                                        inline
                                                        onChange={( e ) => e.preventDefault()}
                                                        onClick={( e ) => e.preventDefault()}

                                                    /> ) : < CustomInput
                                                        type='switch'
                                                        label={< Label2 />}
                                                        className='custom-control-success'
                                                        id='icon-success'
                                                        name='icon-success'
                                                        inline
                                                        defaultChecked
                                                        onChange={( e ) => e.preventDefault()}
                                                        onClick={( e ) => e.preventDefault()}
                                                    />


                                                }
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className='divider divider-left divider-secondary'>
                                        <div className='divider-text text-secondary font-weight-bolder'> Order Details</div>
                                    </div>

                                    <div className="border rounded rounded-3 p-1">
                                        <Row >
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} >
                                                <div className="po-details-table">
                                                    <ResizableTable mainClass="purchaseTable" tableId="purchaseTableId" className="po-details-table" size="sm" responsive={true} bordered={true}  >
                                                        <thead className='thead-secondary'  >
                                                            <tr className='text-center'>
                                                                <th style={{ minWidth: '4px' }} ><strong>#</strong></th>
                                                                <th><strong>Style</strong></th>
                                                                <th className={selectedPurchaseOrder?.isSetOrder ? 'd-none' : 'd'}><strong>Size Range</strong></th>
                                                                <th ><strong>Destination</strong></th>
                                                                <th ><strong>Shipment Mode</strong></th>
                                                                <th ><strong>Shipment Date</strong></th>
                                                                <th ><strong>Inspection Date</strong></th>
                                                                <th ><strong>Order Qty</strong></th>
                                                                <th ><strong>Order UOM</strong></th>
                                                                <th ><strong>Rate</strong></th>
                                                                <th ><strong>Amount</strong></th>
                                                                <th ><strong>Excess Qty</strong></th>
                                                                <th ><strong>Wastage Qty</strong></th>
                                                                <th style={{ minWidth: '5px' }}  ><strong>RC</strong></th>
                                                                <th ><strong>Status</strong></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-center">
                                                            {
                                                                purchaseOrderDetails?.map( ( pod, index ) => (
                                                                    <Fragment key={pod.id + pod.id} >
                                                                        <tr key={pod.id}>
                                                                            <td style={{ minWidth: '4px' }} >
                                                                                <Button.Ripple for="collapseId" tag={Label} onClick={() => { handleCollapsibleTableOpen( pod.fieldId, pod.id ); }} className='btn-icon' color='flat-primary' >
                                                                                    <Maximize2 className={pod.isOpenDetails ? 'd-none' : 'd'} id="collapseId" size={15} color="#7367f0" />
                                                                                    <Minimize2 className={pod.isOpenDetails ? 'd' : 'd-none'} id="collapseId" size={15} color="#28c76f" />
                                                                                </Button.Ripple>

                                                                            </td>
                                                                            <td>
                                                                                <Label className="text-dark font-weight-bold" for='styleNo'>{pod?.styleNo}</Label>
                                                                            </td>
                                                                            <td className={selectedPurchaseOrder?.isSetOrder ? 'd-none' : 'd'}>
                                                                                <Label className="text-dark font-weight-bold" for='sizeGroup'>{pod?.sizeGroupName}</Label>
                                                                            </td>
                                                                            <td>
                                                                                <Label className="text-dark font-weight-bold" for='deliveryDestination'>{pod.deliveryDestination}</Label>
                                                                            </td>

                                                                            <td>
                                                                                <Label className="text-dark font-weight-bold" for='shipmentMode'>{pod.shipmentMode}</Label>
                                                                            </td>
                                                                            <td>
                                                                                <Label className="text-dark font-weight-bold" for='shipmentDate'>{moment( pod.shipmentDate ).format( "DD/MM/YYYY" )}</Label>
                                                                            </td>
                                                                            <td>
                                                                                <Label className="text-dark font-weight-bold" for='inspectionDate'>{moment( pod.inspectionDate ).format( "DD/MM/YYYY" )}</Label>
                                                                            </td>
                                                                            <td>
                                                                                <Label className="text-dark font-weight-bold" for='orderQuantity'>{pod.orderQuantity}</Label>
                                                                            </td>

                                                                            <td>
                                                                                <Label className="text-dark font-weight-bold" for='orderUOM'>{pod.orderUOM}</Label>
                                                                            </td>
                                                                            <td>
                                                                                <Label className="text-dark font-weight-bold" for='ratePerUnit'>{pod.ratePerUnit}</Label>
                                                                            </td>
                                                                            <td>
                                                                                <Label className="text-dark font-weight-bold" for='amount'> {sumOfAmount( pod.orderQuantity * pod.ratePerUnit )} </Label>
                                                                            </td>
                                                                            <td>
                                                                                <Label className="text-dark font-weight-bold" for='excessQuantityPercentage'>{pod.excessQuantityPercentage} %</Label>
                                                                            </td>
                                                                            <td>
                                                                                <Label className="text-dark font-weight-bold" for='wastageQuantityPercentage'>{pod.wastageQuantityPercentage} %</Label>
                                                                            </td>

                                                                            <td style={{ minWidth: '5px' }} >
                                                                                {selectedPurchaseOrder?.isSetOrder ? <Button.Ripple
                                                                                    id="rcIds" tag={Label}
                                                                                    className='btn-icon'
                                                                                    color='flat-danger'
                                                                                    onClick={() => { handleOpenSizeRation( pod?.id, pod?.styleId, pod?.orderQuantity ); }}
                                                                                >
                                                                                    <MoreVertical size={18} id="rcIds" color="purple" />
                                                                                </Button.Ripple> : <Button.Ripple
                                                                                    id="rcIds" tag={Label}
                                                                                    className='btn-icon'
                                                                                    color='flat-danger'
                                                                                    onClick={() => { handleOpenSizeColorRation( pod?.id, pod?.orderQuantity ); }}
                                                                                >
                                                                                    <MoreVertical size={18} id="rcIds" color="purple" />
                                                                                </Button.Ripple>
                                                                                }

                                                                            </td>
                                                                            <td>
                                                                                <Label className="text-dark font-weight-bold" for='isRationId'>{pod?.status?.toUpperCase()}</Label>
                                                                            </td>

                                                                        </tr>
                                                                        <tr >
                                                                            <td colSpan={7}>
                                                                                {
                                                                                    purchaseOrderDetails.some( ( i => i.fieldId === i.fieldId ) ) && (
                                                                                        <Collapse isOpen={pod.isOpenDetails}>
                                                                                            <Table bordered>
                                                                                                <thead className="text-center">
                                                                                                    {
                                                                                                        selectedPurchaseOrder?.isSetOrder ? <tr>
                                                                                                            <th>Style No</th>
                                                                                                            <th>Quantity</th>
                                                                                                            <th>Rate</th>
                                                                                                            <th>Amount</th>
                                                                                                            <th>Adjusted Qty</th>
                                                                                                            <th>Action</th>
                                                                                                        </tr> : <tr>
                                                                                                            <th>Color</th>
                                                                                                            <th>Quantity</th>
                                                                                                            <th>Rate</th>
                                                                                                            <th>Amount</th>
                                                                                                            <th>Adjusted Qty</th>
                                                                                                            <th>Action</th>
                                                                                                        </tr>
                                                                                                    }

                                                                                                </thead>
                                                                                                <tbody className="text-center">
                                                                                                    {selectedPurchaseOrder?.isSetOrder ? Object.keys( groupByStyleNo ).map( ( ii, inx ) => (
                                                                                                        <tr key={inx + 1}>
                                                                                                            <td>{ii}</td>
                                                                                                            <td>{_.sum( groupByStyleNo[ii]?.map( s => Number( s.quantity ) ) )}</td>
                                                                                                            <td>{pod?.ratePerUnit}</td>
                                                                                                            <td>{_.sum( groupByStyleNo[ii]?.map( s => Number( s.quantity * pod?.ratePerUnit ) ) )}</td>
                                                                                                            <td>{_.sum( groupByStyleNo[ii]?.map( s => Number( s.adjustedQuantity ) ) )}</td>
                                                                                                            <td><Settings onClick={() => { handlePODetailsQuantity( groupByStyleNo[ii], pod.purchaseOrderId, pod.id ); }} /></td>
                                                                                                        </tr>
                                                                                                    ) ) : ( Object.keys( groupedByColor ).map( ( ii, inx ) => (
                                                                                                        <tr key={inx + 1}>
                                                                                                            <td>{ii}</td>
                                                                                                            <td>{_.sum( groupedByColor[ii]?.map( s => Number( s.quantity ) ) )}</td>
                                                                                                            <td>{pod.ratePerUnit}</td>
                                                                                                            <td>{_.sum( groupedByColor[ii]?.map( s => Number( s.quantity * pod?.ratePerUnit ) ) )}</td>
                                                                                                            <td>{_.sum( groupedByColor[ii]?.map( s => Number( s.adjustedQuantity ) ) )}</td>
                                                                                                            <td><Settings onClick={() => { handlePODetailsQuantity( groupedByColor[ii], pod.purchaseOrderId, pod.id ); }} /></td>
                                                                                                        </tr>
                                                                                                    ) ) )
                                                                                                    }
                                                                                                </tbody>
                                                                                            </Table>

                                                                                        </Collapse>
                                                                                    )
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    </Fragment>
                                                                ) )
                                                            }
                                                        </tbody>
                                                    </ResizableTable>
                                                </div>

                                            </Col>
                                        </Row>

                                    </div>

                                    {
                                        ( selectedPurchaseOrder?.isSetOrder && isSizeRationOpen ) ? <SizeRatioDetails
                                            openModal={isSizeRationOpen}
                                            setOpenModal={setIsSizeRationOpen}
                                            colorSizeRationIds={colorSizeRationIds}
                                            setColorSizeRationIds={setColorSizeRationIds}
                                        /> : isSizeRationOpen && <SizeColorRatioDetails
                                            openModal={isSizeRationOpen}
                                            setOpenModal={setIsSizeRationOpen}
                                            colorSizeRationIds={colorSizeRationIds}
                                            setColorSizeRationIds={setColorSizeRationIds}
                                        />
                                    }

                                </Col>

                            </Row>

                        </CardBody>
                        {
                            openModal && <POStyleDetails
                                openModal={openModal}
                                setOpenModal={setOpenModal}
                            />
                        }

                    </Card> )
            }
        </div>
    );
};

export default PurchaseOrderDetails;

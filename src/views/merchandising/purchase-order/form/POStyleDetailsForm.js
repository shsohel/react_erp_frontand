
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, Input, Table } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { bindPurchaseOrderDetails, getPOSizeColorQuantitySummaryDetails, updateAdditionalSizeColorQuantity } from '../store/actions';


const POStyleDetailsForm = ( { openModal, setOpenModal } ) => {
    const dispatch = useDispatch();
    const { orderDetailsSizeColorQuantitySummaryDetails, purchaseOrderDetails } = useSelector( ( { purchaseOrders } ) => purchaseOrders );


    const handleCollapsibleTableOpen = () => {
        const detailsId = orderDetailsSizeColorQuantitySummaryDetails[0].detailsId;
        const updatedData = purchaseOrderDetails.map( od => {
            if ( detailsId === od.id ) {
                od.isOpenDetails = true;
            } else {
                od.isOpenDetails = false;
            }
            return od;
        } );
        dispatch( bindPurchaseOrderDetails( updatedData ) );
    };
    const handleMainModelSubmit = () => {
        const purchaseOrderId = orderDetailsSizeColorQuantitySummaryDetails[0].orderId;
        const detailsId = orderDetailsSizeColorQuantitySummaryDetails[0].detailsId;
        const additionalQuantity = orderDetailsSizeColorQuantitySummaryDetails.map( additionalQty => ( {
            id: additionalQty.id,
            colorId: additionalQty.colorId,
            sizeId: additionalQty.sizeId,
            styleId: additionalQty.styleId,
            excessPercentage: additionalQty?.excessPercentage,
            wastagePercentage: additionalQty?.wastagePercentage,
            sampleQuantity: additionalQty?.sampleQuantity
        } ) );
        dispatch( updateAdditionalSizeColorQuantity( purchaseOrderId, detailsId, additionalQuantity ) );
        console.log( JSON.stringify( additionalQuantity, null, 2 ) );
    };

    const handleAdditionalQtyOnChange = ( e, qtyDetailsId ) => {
        const { name, type, value } = e.target;
        const updateData = orderDetailsSizeColorQuantitySummaryDetails.map( quantity => {
            if ( qtyDetailsId === quantity.id ) {
                quantity[name] = Number( value );
            }
            return quantity;
        } );
        dispatch( getPOSizeColorQuantitySummaryDetails( updateData ) );
    };
    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
        handleCollapsibleTableOpen();
    };

    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-lg'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModelSubmit={handleMainModelSubmit}
                handleMainModalToggleClose={handleMainModalToggleClose}
                title="Size Color Additional Quantity"
            >
                <Card outline >
                    <CardBody className="custom-table">
                        <Table size="sm" bordered hover responsive>
                            <thead className="thead-light" >
                                <tr className="text-center" >
                                    <th className='text-nowrap'>Color</th>
                                    <th className='text-nowrap'>Size</th>
                                    <th className='text-nowrap'>Quantity</th>
                                    <th className='text-nowrap'>Excess(%)</th>
                                    <th className='text-nowrap'>Wastage(%)</th>
                                    <th className='text-nowrap'>Sample Qty.</th>
                                    <th className='text-nowrap' >Adjusted Qty.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orderDetailsSizeColorQuantitySummaryDetails?.map( ( additionalQty, indx ) => (
                                        <tr key={indx + 1}  >
                                            <td className="text-nowrap" >
                                                {additionalQty.color}
                                            </td>
                                            <td className="text-nowrap" >
                                                {additionalQty.size}
                                            </td>
                                            <td>
                                                <Input
                                                    className='text-right'
                                                    type='number'
                                                    placeholder='10975'
                                                    name="quantity"
                                                    bsSize='sm'
                                                    disabled
                                                    value={additionalQty.quantity}
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.id ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td >
                                                <Input
                                                    className='text-right'
                                                    type='number'
                                                    name="excessPercentage"
                                                    bsSize='sm'
                                                    placeholder='0'
                                                    value={additionalQty.excessPercentage}
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.id ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    className='text-right'
                                                    type='number'
                                                    name="wastagePercentage"
                                                    bsSize='sm'
                                                    placeholder='0'
                                                    value={additionalQty.wastagePercentage}
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.id ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    className='text-right'
                                                    type='number'
                                                    name="sampleQuantity"
                                                    bsSize='sm'
                                                    placeholder='0'
                                                    value={additionalQty.sampleQuantity}
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.id ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    className='text-right'
                                                    name="adjustedQuantity"
                                                    type='number'
                                                    bsSize='sm'
                                                    disabled
                                                    placeholder='10975'
                                                    value={additionalQty.adjustedQuantity}
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.id ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                        </tr>
                                    ) )
                                }


                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </CustomModal>
        </div>
    );
};

export default POStyleDetailsForm;

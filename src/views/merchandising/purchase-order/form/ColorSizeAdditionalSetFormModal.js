
import _ from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, Input, Table } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { getPOSizeColorQuantitySummaryDetails } from '../store/actions';

const ColorSizeAdditionalSetFormModal = ( { openModal, setOpenModal, colorSizeRationIds, handleColorSizeBindingOnRow } ) => {
    const dispatch = useDispatch();
    const { orderDetailsSizeColorQuantitySummaryDetails } = useSelector( ( { purchaseOrders } ) => purchaseOrders );


    const handleMainModelSubmit = () => {
        console.log( JSON.stringify( orderDetailsSizeColorQuantitySummaryDetails, null, 2 ) );
        handleColorSizeBindingOnRow( colorSizeRationIds?.rowId, orderDetailsSizeColorQuantitySummaryDetails );
        setOpenModal( !openModal );

    };

    const handleAdditionalQtyOnChange = ( e, fieldId ) => {
        const { name, type, value } = e.target;
        const updateData = orderDetailsSizeColorQuantitySummaryDetails.map( quantity => {
            if ( fieldId === quantity.fieldId ) {
                quantity[name] = Number( value );
            }
            return quantity;
        } );
        dispatch( getPOSizeColorQuantitySummaryDetails( updateData ) );
    };
    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );

    };

    const filteredColorSizeAdditionalQuantity = orderDetailsSizeColorQuantitySummaryDetails.filter( qty => qty.colorName === colorSizeRationIds?.color );
    const styleWiseSort = _.sortBy( filteredColorSizeAdditionalQuantity, 'styleNo' );


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
                                    <th className='text-nowrap'>Style</th>
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
                                    styleWiseSort?.map( ( additionalQty, index ) => (
                                        <tr key={index + 1}  >
                                            <td className="text-nowrap" >
                                                {additionalQty.styleNo}
                                            </td>
                                            <td className="text-nowrap" >
                                                {additionalQty.colorName}
                                            </td>
                                            <td className="text-center" >
                                                {additionalQty.sizeName}
                                            </td>
                                            <td>
                                                <Input
                                                    className='text-right'
                                                    type='number'
                                                    placeholder='10975'
                                                    name="quantity"
                                                    bsSize='sm'
                                                    disabled
                                                    value={additionalQty.totalQuantity}
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
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
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
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
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
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
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
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
                                                    value={Math.ceil( additionalQty.adjustedQuantity )}
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
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

export default ColorSizeAdditionalSetFormModal;

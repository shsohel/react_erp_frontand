
import _ from 'lodash';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, Input, Table } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { isZeroToFixed } from '../../../../utility/Utils';
import { getPOSizeColorQuantitySummaryDetails } from '../store/actions';


const ColorSizeAdditionalFormModal = ( { openModal, setOpenModal, colorSizeRationIds, handleColorSizeBindingOnRow, isEditable } ) => {
    const dispatch = useDispatch();
    const { orderDetailsSizeColorQuantitySummaryDetails } = useSelector( ( { purchaseOrders } ) => purchaseOrders );
    const handleMainModelSubmit = () => {
        console.log( JSON.stringify( orderDetailsSizeColorQuantitySummaryDetails, null, 2 ) );
        handleColorSizeBindingOnRow( colorSizeRationIds?.rowId, orderDetailsSizeColorQuantitySummaryDetails );
        setOpenModal( !openModal );

    };

    const handleAdditionalQtyOnChange = ( e, fieldId ) => {
        if ( isEditable ) {
            const { name, type, value } = e.target;
            if ( value !== '.' ) {
                const updateData = orderDetailsSizeColorQuantitySummaryDetails.map( quantity => {
                    if ( fieldId === quantity.fieldId ) {
                        quantity[name] = Number( value );
                    }
                    return quantity;
                } );
                dispatch( getPOSizeColorQuantitySummaryDetails( updateData ) );
            }
        }
    };

    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );

    };

    const filteredColorSizeAdditionalQuantity = orderDetailsSizeColorQuantitySummaryDetails.filter( qty => qty.colorName === colorSizeRationIds?.color );
    const sortedColorSizeAdditionalQuantity = _.sortBy( filteredColorSizeAdditionalQuantity, 'position' );

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
                                    <th className='text-nowrap'>Rate</th>
                                    <th className='text-nowrap'>Amount</th>
                                    <th className='text-nowrap'>Excess(%)</th>
                                    <th className='text-nowrap'>Wastage(%)</th>
                                    <th className='text-nowrap'>Sample Qty.</th>
                                    <th className='text-nowrap' >Adjusted Qty.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    sortedColorSizeAdditionalQuantity?.map( ( additionalQty, indx ) => (
                                        <tr key={indx + 1} hidden={additionalQty.quantity === 0} >
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
                                                    value={additionalQty.quantity}
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td>
                                                {/* <Input
                                                    className='text-right'
                                                    type='number'
                                                    placeholder='10975'
                                                    name="ratePerUnit"
                                                    bsSize='sm'
                                                    value={additionalQty.ratePerUnit}
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                /> */}
                                                <NumberFormat
                                                    className="form-control-sm form-control text-right"
                                                    displayType="input"
                                                    name="ratePerUnit"
                                                    value={additionalQty.ratePerUnit}
                                                    decimalScale={4}
                                                    fixedDecimalScale={additionalQty.ratePerUnit > 0}
                                                    allowNegative={false}
                                                    allowLeadingZeros={false}
                                                    disabled={!isEditable}
                                                    onFocus={e => {
                                                        e.target.select();
                                                    }}
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
                                                    onBlur={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    className='text-right'
                                                    type='number'
                                                    placeholder='10975'
                                                    name="amount"
                                                    bsSize='sm'
                                                    disabled
                                                    value={isZeroToFixed( additionalQty.quantity * additionalQty.ratePerUnit, 4 )}
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td >
                                                {/* <Input
                                                    className='text-right'
                                                    type='number'
                                                    name="excessPercentage"
                                                    value={additionalQty.excessPercentage}
                                                    bsSize='sm'
                                                    placeholder='0'
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                /> */}
                                                <NumberFormat
                                                    className="form-control-sm form-control text-right"
                                                    displayType="input"
                                                    name="excessPercentage"
                                                    value={additionalQty.excessPercentage}
                                                    decimalScale={2}
                                                    fixedDecimalScale={additionalQty.excessPercentage > 0}
                                                    allowNegative={false}
                                                    allowLeadingZeros={false}
                                                    disabled={!isEditable}

                                                    onFocus={e => {
                                                        e.target.select();
                                                    }}
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
                                                    onBlur={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
                                                />
                                            </td>
                                            <td>
                                                {/* <Input
                                                    className='text-right'
                                                    type='number'
                                                    name="wastagePercentage"
                                                    value={additionalQty.wastagePercentage}
                                                    bsSize='sm'
                                                    placeholder='0'
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                /> */}
                                                <NumberFormat
                                                    className="form-control-sm form-control text-right"
                                                    displayType="input"
                                                    name="wastagePercentage"
                                                    value={additionalQty.wastagePercentage}
                                                    decimalScale={2}
                                                    fixedDecimalScale={additionalQty.wastagePercentage > 0}
                                                    allowNegative={false}
                                                    allowLeadingZeros={false}
                                                    disabled={!isEditable}

                                                    onFocus={e => {
                                                        e.target.select();
                                                    }}
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
                                                    onBlur={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}

                                                />
                                            </td>
                                            <td>
                                                {/* <Input
                                                    className='text-right'
                                                    type='number'
                                                    name="sampleQuantity"
                                                    bsSize='sm'
                                                    placeholder='0'
                                                    value={additionalQty.sampleQuantity}
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                /> */}
                                                <NumberFormat
                                                    className="form-control-sm form-control text-right"
                                                    displayType="input"
                                                    value={additionalQty.sampleQuantity}
                                                    name="sampleQuantity"
                                                    decimalScale={0}
                                                    fixedDecimalScale={true}
                                                    allowNegative={false}
                                                    allowLeadingZeros={false}
                                                    disabled={!isEditable}

                                                    onFocus={e => {
                                                        e.target.select();
                                                    }}
                                                    onChange={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
                                                    onBlur={( e ) => { handleAdditionalQtyOnChange( e, additionalQty.fieldId ); }}
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

export default ColorSizeAdditionalFormModal;

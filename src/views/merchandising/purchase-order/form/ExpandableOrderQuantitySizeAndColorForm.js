import '@custom-styles/merchandising/others/custom-table.scss';
import _ from 'lodash';
import { Fragment, useState } from 'react';
import { Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Label, Table } from 'reactstrap';
import { isZeroToFixed, randomIdGenerator } from '../../../../utility/Utils';
import { bindStylePurchaseOrderDetails, getPOSizeColorQuantitySummaryDetails } from '../store/actions';
import ColorSizeAdditionalFormModal from './ColorSizeAdditionalFormModal';

const ExpandableOrderQuantitySizeAndColorForm = ( { data } ) => {
    console.log( data?.orderQuantitySizeAndColor );
    const dispatch = useDispatch();
    const { stylePurchaseOrderDetails } = useSelector( ( { purchaseOrders } ) => purchaseOrders );
    const [colorSizeRationIds, setColorSizeRationIds] = useState( null );
    const [openColorSizeAdditionalModal, setOpenColorSizeAdditionalModal] = useState( false );

    const handleColorSizeBindingOnRow = ( rowId, orderQuantitySizeAndColor ) => {
        const updatedData = stylePurchaseOrderDetails.map( detail => {
            if ( rowId === detail.rowId ) {
                detail['orderQuantitySizeAndColor'] = orderQuantitySizeAndColor;
            }
            return detail;
        } );
        dispatch( bindStylePurchaseOrderDetails( updatedData ) );
        setColorSizeRationIds( null );
    };
    const handleColorSizeAdditionalModal = ( rowId, orderQuantitySizeAndColor, color ) => {
        const obj = {
            rowId,
            orderQuantitySizeAndColor,
            color
        };
        setColorSizeRationIds( obj );
        setOpenColorSizeAdditionalModal( !openColorSizeAdditionalModal );
        dispatch( getPOSizeColorQuantitySummaryDetails( orderQuantitySizeAndColor.map( cs => ( { ...cs, fieldId: randomIdGenerator() } ) ) ) );
    };

    const sortedSizeColorQuantity = _.sortBy( data?.orderQuantitySizeAndColor, 'colorName' );


    const groupByColorSizeQuantity = Object.keys( _.groupBy( sortedSizeColorQuantity, 'colorName' ) );
    const groupByCSQty = _.groupBy( sortedSizeColorQuantity, 'colorName' );


    const totalRateAmount = ( amount, qty ) => {
        const total = Number( amount / qty );
        return isZeroToFixed( total, 4 );
    };


    const totalRowAmount = ( rate, qty ) => {
        const total = Number( rate * qty );
        return isZeroToFixed( total, 4 );
    };


    let totalQty = 0;
    const totalOfTotalQty = ( q ) => {
        totalQty += q;
        return totalQty;
    };

    let totalAmount = 0;
    const totalOfTotalAmount = ( rate, amount ) => {
        totalAmount += rate * amount;
        return totalAmount.toFixed( 4 );
    };

    let averageRate = 0;
    const totalAverageRate = ( rate, totalLength ) => {
        averageRate += rate;
        return ( averageRate / totalLength ).toFixed( 4 );
    };


    return (
        <div className='custom-table w-50 p-2'>
            <Label className="font-weight-bolder h5 text-secondary" >Color Size Quantity:</Label>
            <Table bordered >
                <thead>
                    <tr className="p-1">
                        <th>Color</th>
                        <th>Order Qty.</th>
                        <th>Rate</th>
                        <th>Total Amount</th>
                        <th>Adj. Qty.</th>
                        <th className='text-center'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        ( groupByColorSizeQuantity.map( ( color, index ) => (
                            <Fragment key={index + 1}>
                                <tr >

                                    <td>{color}</td>

                                    <td className='text-right'>{_.sum( groupByCSQty[color]?.map( s => Number( s.totalQuantity ) ) )}</td>
                                    <td className='text-right'>
                                        {totalRateAmount( _.sum( groupByCSQty[color]?.map( r => r.ratePerUnit * r.totalQuantity ) ), _.sum( groupByCSQty[color]?.map( s => Number( s.totalQuantity ) ) ) )}
                                    </td>
                                    <td className='text-right'>
                                        {totalRowAmount( _.sum( groupByCSQty[color]?.map( r => r.ratePerUnit * r.totalQuantity ) ) / _.sum( groupByCSQty[color]?.map( s => Number( s.totalQuantity ) ) ), _.sum( groupByCSQty[color]?.map( r => r.totalQuantity ) ) )}
                                    </td>

                                    <td className='text-right'>{( _.sum( groupByCSQty[color]?.map( s => Number( Math.ceil( s.adjustedQuantity ) ) ) ) )}</td>

                                    <td className='text-center' style={{ width: '20px' }}>
                                        <Button.Ripple
                                            id="additionalColorSizeId"
                                            tag={Label}
                                            onClick={() => { handleColorSizeAdditionalModal( data.rowId, sortedSizeColorQuantity, color ); }}
                                            className='btn-icon p-0'
                                            color='flat-success'
                                        >
                                            <Settings
                                                size={20}
                                                id="additionalColorSizeId"
                                                color="green"
                                            />
                                        </Button.Ripple>
                                    </td>
                                </tr>
                                <tr className='text-right font-weight-bold'>
                                    <td hidden={!( groupByColorSizeQuantity.length - 1 === index )}>
                                        Total
                                    </td>
                                    <td hidden={!( groupByColorSizeQuantity.length - 1 === index )}>
                                        {totalOfTotalQty( _.sum( groupByCSQty[color]?.map( s => Number( s.totalQuantity ) ) ) )}
                                    </td>
                                    {/* <td hidden={!( groupByColorSizeQuantity.length - 1 === index )}>
                                        {totalAverageRate( _.sum( groupByCSQty[color]?.map( s => Number( s.ratePerUnit / groupByCSQty[color].length ) ) ), groupByColorSizeQuantity.length )}
                                    </td>
                                    <td hidden={!( groupByColorSizeQuantity.length - 1 === index )}>
                                        {totalOfTotalAmount( ( _.sum( groupByCSQty[color]?.map( s => Number( s.ratePerUnit / groupByCSQty[color].length ) ) ) ), _.sum( groupByCSQty[color]?.map( s => Number( s.totalQuantity ) ) ) )}
                                    </td> */}
                                </tr>

                            </Fragment>

                        ) ) )
                    }


                </tbody>
            </Table>
            {
                openColorSizeAdditionalModal && <ColorSizeAdditionalFormModal
                    ratePerUnit={data.ratePerUnit}
                    isEditable={data?.isEditable}
                    openModal={openColorSizeAdditionalModal}
                    setOpenModal={setOpenColorSizeAdditionalModal}
                    colorSizeRationIds={colorSizeRationIds}
                    setColorSizeRationIds={setColorSizeRationIds}
                    handleColorSizeBindingOnRow={handleColorSizeBindingOnRow}
                />
            }
        </div >
    );
};

export default ExpandableOrderQuantitySizeAndColorForm;
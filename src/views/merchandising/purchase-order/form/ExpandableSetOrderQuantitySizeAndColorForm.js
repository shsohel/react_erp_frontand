import '@custom-styles/merchandising/others/custom-table.scss';
import _ from 'lodash';
import React, { useState } from 'react';
import { Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Label, Table } from 'reactstrap';
import { randomIdGenerator } from '../../../../utility/Utils';
import { bindStylePurchaseOrderDetails, getPOSizeColorQuantitySummaryDetails } from '../store/actions';
import ColorSizeAdditionalSetFormModal from './ColorSizeAdditionalSetFormModal';

const ExpandableSetOrderQuantitySizeAndColorForm = ( { data } ) => {
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

    return (
        <div className='custom-table w-50 p-2'>
            <Label className="font-weight-bolder h5 text-secondary" >Set Color Size Quantity:</Label>
            <Table bordered >
                <thead>
                    <tr className="p-1">
                        <th>Color</th>
                        <th>Total Qty.</th>
                        <th>Adj. Qty.</th>
                        <th className='text-center'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        ( Object.keys( _.groupBy( sortedSizeColorQuantity, 'colorName' ) ).map( ( color, index ) => (
                            <tr key={index + 1}>
                                <td>{color}</td>
                                <td>{_.sum( _.groupBy( sortedSizeColorQuantity, 'colorName' )[color]?.map( s => Number( s.totalQuantity ) ) )}</td>
                                <td>{( _.sum( _.groupBy( sortedSizeColorQuantity, 'colorName' )[color]?.map( s => Number( Math.ceil( s.adjustedQuantity ) ) ) ) )}</td>
                                <td className='text-center' style={{ width: '20px' }}>
                                    <Button.Ripple id="additionalColorSizeId" tag={Label}
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
                        ) ) )
                    }
                </tbody>
            </Table>
            {
                openColorSizeAdditionalModal && <ColorSizeAdditionalSetFormModal
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

export default ExpandableSetOrderQuantitySizeAndColorForm;
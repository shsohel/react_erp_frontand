

/* eslint-disable no-unused-expressions */
import _ from 'lodash';
import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, Spinner, Table } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { randomIdGenerator } from '../../../../utility/Utils';
import { getColorSizeRationByPODetailsId } from '../store/actions';

const SizeColorRatioDetails = ( {
    openModal,
    setOpenModal,
    colorSizeRationIds,
    setColorSizeRationIds
} ) => {
    const dispatch = useDispatch();
    const { quantityOnSizeAndColor } = useSelector( ( { purchaseOrders } ) => purchaseOrders );


    ///Final Submit
    const handleSizeColorRationSubmit = () => {
        setOpenModal( !openModal );
        setColorSizeRationIds( null );
        dispatch( getColorSizeRationByPODetailsId( null ) );

    };

    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
        setColorSizeRationIds( null );
        dispatch( getColorSizeRationByPODetailsId( null ) );
    };

    // console.log( JSON.stringify( colorSize, null, 2 ) );

    const groupByColor = _.groupBy( quantityOnSizeAndColor, function ( d ) {
        return d.color;
    } );
    console.log( groupByColor );

    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-lg'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModelSubmit={handleSizeColorRationSubmit}
                handleMainModalToggleClose={handleMainModalToggleClose}
                title="Size Color Ratio Details"
            >
                <Card className="p-0" >
                    <CardBody className="custom-table">
                        <div className="d-flex justify-content-between">
                            <div className=" ">
                                <p className="font-weight-bolder"> Total Order Quantity: {colorSizeRationIds.orderQuantity}</p>
                            </div>
                        </div>
                        {quantityOnSizeAndColor.length > 0 ? (
                            <Table responsive bordered className='text-center font-weight-bold'>
                                <thead className="thead-light">
                                    <tr className="text-nowrap" >
                                        <th>Color</th>
                                        {/* {isRation &&
                                            <th>Assort Value</th>
                                        } */}
                                        {
                                            Object.keys( groupByColor ).map( item => {
                                                return groupByColor[item].map( c => (
                                                    <Fragment key={randomIdGenerator()}>
                                                        <th>{c.size}</th>
                                                    </Fragment>
                                                ) );
                                            } )[0]
                                        }

                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys( groupByColor ).map( ( item, n ) => {
                                        return groupByColor[item].map( ( i, index ) => ( index === 0 ? (
                                            <tr key={randomIdGenerator()} className="text-center p-0">
                                                <td rowSpan={groupByColor[item].length} >
                                                    {i.color}
                                                </td>
                                                {
                                                    groupByColor[item].map( q => (
                                                        <Fragment key={randomIdGenerator()}>
                                                            <td>{q.quantity}</td>
                                                        </Fragment>
                                                    ) )
                                                }
                                                <td>
                                                    {_.sum( groupByColor[item]?.map( s => Number( s.quantity ) ) )}
                                                </td>


                                            </tr>
                                        ) : (
                                            <tr key={randomIdGenerator()} className="text-center p-0">

                                            </tr>
                                        ) )
                                        );
                                    } )}

                                </tbody>
                            </Table>
                        ) : <Spinner />}
                    </CardBody>

                </Card>
            </CustomModal>
        </div>
    );
};

export default SizeColorRatioDetails;

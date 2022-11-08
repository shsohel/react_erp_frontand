
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, Table } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';


const POStyleDetails = ( { openModal, setOpenModal } ) => {
    const dispatch = useDispatch();
    const { orderDetailsSizeColorQuantitySummaryDetails, purchaseOrderDetails } = useSelector( ( { purchaseOrders } ) => purchaseOrders );


    const handleMainModelSubmit = () => {
        { setOpenModal( !openModal ); }
    };


    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
        //   handleCollapsibleTableOpen();
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
                                            <td className="text-nowrap text-center" >
                                                {additionalQty.color}
                                            </td>
                                            <td className="text-nowrap text-center" >
                                                {additionalQty.size}
                                            </td>
                                            <td className='text-right'>
                                                {additionalQty.quantity}

                                            </td>
                                            <td className='text-right'>
                                                {additionalQty.excessPercentage}
                                            </td>
                                            <td className='text-right'>
                                                {additionalQty.wastagePercentage}
                                            </td>
                                            <td className='text-right'>
                                                {additionalQty.sampleQuantity}
                                            </td>
                                            <td className='text-right'>
                                                {additionalQty.adjustedQuantity}
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

export default POStyleDetails;

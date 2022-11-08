import React from 'react';

const PurchaseOrderExpandRow = ( { data } ) => {

    return (
        <div style={{ backgroundColor: 'white', color: 'black' }} className=' p-1'>
            {/* {
                data?.costing.length > 0 ? <>
                    <div>
                        <h3 className='font-weight-bold'>Available Costing:</h3>
                    </div>
                    <Table size='sm' bordered responsive>
                        <thead >
                            <tr>
                                <th>Unit</th>
                                <th>Colors</th>
                                <th>Shipment</th>
                                <th>Shipment Date</th>
                                <th>Destination</th>
                                <th>Order Qty</th>
                                <th>P.U.P</th>
                                <th>Amount</th>
                                <th>Excess Qty</th>
                                <th>Wastage Qty</th>
                                <th>Adjustage Qty</th>
                                <th>Color Size Ration</th>
                            </tr>
                        </thead>
                        {
                            data?.costing?.map( costing => (
                                <tbody key={costing.id}>
                                    <tr>
                                        <td>{costing.unit}</td>
                                        <td>{costing.colors}</td>
                                        <td>{costing.shipmentMode}</td>
                                        <td>{costing.shipmentDate}</td>
                                        <td>{costing.destination}</td>
                                        <td>{costing.orderQuantity}</td>
                                        <td>{costing.perUnitPrice}</td>
                                        <td>{costing.amount}</td>
                                        <td>{costing.excessQuantity}</td>
                                        <td>{costing.wastageQuantity}</td>
                                        <td>{costing.adjustageQuantity}</td>
                                        <td className='text-center '>
                                            <UncontrolledDropdown>
                                                <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
                                                    <Eye color='#0099FF' size={22} />
                                                </DropdownToggle>
                                            </UncontrolledDropdown>
                                        </td>
                                    </tr>
                                </tbody>
                            ) )
                        }
                    </Table>
                </> : <div>
                    <h2 className='text-center'>Costing is pending</h2>
                </div>
            } */}

            <div>
                {/* <h2 className='text-center'>Developing Mode On !!!!! </h2> */}
            </div>

        </div>
    );
};

export default PurchaseOrderExpandRow;

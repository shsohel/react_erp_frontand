import React from 'react';
import { Table } from 'reactstrap';

const PreCostingExpandRow = ( { data } ) => {
    return (
        <div style={{ backgroundColor: 'white', color: 'black' }} className=' p-1'>
            {
                data?.costing?.length > 0 ? <>
                    <div>
                        <h3 className='font-weight-bold'>Details:</h3>
                    </div>
                    <Table size='sm' bordered responsive>
                        <thead >
                            <tr>
                                <th>#</th>
                                <th>Costing No</th>
                                <th>Size Groups</th>
                                <th>Colors</th>
                                <th>Costing Date</th>
                                <th>UOM</th>
                                <th className="text-right">Qty.</th>
                                <th className="text-right">Total</th>
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>
                        {
                            data?.costing?.map( ( item, index ) => (
                                <tbody key={item.costingNo}>
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{item.costingNo}</td>
                                        <td>{item.sizeGroup.toString()}</td>
                                        <td>{item.colors}</td>
                                        <td>{item.costingDate}</td>
                                        <td>{item.uom}</td>
                                        <td className="text-right">{item.quantity}</td>
                                        <td className="text-right">{item.total}</td>
                                        <td className="text-center">{item.status}</td>
                                    </tr>
                                </tbody>
                            ) )
                        }
                    </Table>
                </> : <div>
                    <h2 className='text-center'>Pending</h2>
                </div>
            }


        </div>
    );
};

export default PreCostingExpandRow;

import '@custom-styles/merchandising/others/custom-table.scss';
import { Table } from "reactstrap";
import { isZeroToFixed } from '../../../../utility/Utils';

const CostingExpandRow = ( { data } ) => {
    console.log( data );
    // fab, trims, cm, print, wash
    return (
        <div style={{ backgroundColor: 'white', color: 'black', maxWidth: '700px' }} className=' p-1 custom-table' >
            {
                data ? <>
                    <div>
                        <h4 className='font-weight-bold'>Summary Details:</h4>
                    </div>
                    <Table size='sm' bordered responsive>
                        <thead >
                            <tr>
                                <th>Fabric</th>
                                <th>Accessories</th>
                                <th>CM</th>
                                <th>Embr. Amount</th>
                                <th>Print</th>
                                <th>Wash</th>
                                <th>Others</th>

                            </tr>
                        </thead>
                        <tbody >
                            <tr className='text-right'>
                                <td>{isZeroToFixed( data?.totalFabricAmount, 4 )}</td>
                                <td>{isZeroToFixed( data?.totalTrimAmount, 4 )}</td>
                                <td>{isZeroToFixed( data?.cmAmount, 4 )}</td>
                                <td>{isZeroToFixed( data?.embroideryAmount, 4 )}</td>
                                <td>{isZeroToFixed( data?.printAmount, 4 )}</td>
                                <td>{isZeroToFixed( data?.washAmount, 4 )}</td>
                                <td>{isZeroToFixed( data?.othersAmount, 4 )}</td>
                            </tr>
                        </tbody>

                    </Table>
                </> : <div>
                    <h2 className='text-center'>Pending</h2>
                </div>
            }


        </div>
    );
};

export default CostingExpandRow;

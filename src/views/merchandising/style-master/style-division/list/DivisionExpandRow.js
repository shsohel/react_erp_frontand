import { Table } from 'reactstrap';
import '../../../../../../src/assets/scss/merchandising/others/custom-table.scss';
const DivisionExpandRow = ( { data } ) => {
    return (
        <div style={{ backgroundColor: 'white', color: 'black' }} className='expandable-content p-2'>
            <h5>Department :</h5>
            <Table className="custom-table" bordered >
                <thead className="table-bordered">
                    <tr className="text-nowrap">
                        <th >#</th>
                        <th> Name</th>
                        <th> Description</th>
                    </tr>
                </thead>
                <tbody >
                    {
                        data?.departments?.map( ( i, index ) => (
                            <tr key={index + 1}>
                                <td className='sl'>{index + 1}</td>
                                <td>{i?.name}</td>
                                <td>{i?.description}</td>
                            </tr>
                        ) )
                    }
                </tbody>
            </Table>

        </div>
    );
};

export default DivisionExpandRow;

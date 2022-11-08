import { Table } from 'reactstrap';
import '../../../../../../src/assets/scss/merchandising/others/custom-table.scss';

const StyleProductCategoryExpandRow = ( { data } ) => {
    return (
        <div
            style={{ backgroundColor: 'white', color: 'black' }} className='expandable-content p-2'

        >
            <h5>Style Category :</h5>
            <Table className="custom-table text-center" bordered>
                <thead >
                    <tr>
                        <th >#</th>
                        <th> Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data?.styleCategories?.map( ( i, index ) => (
                            <tr key={index}>
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

export default StyleProductCategoryExpandRow;

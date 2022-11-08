import { default as React } from 'react';
import { Table } from 'reactstrap';
const SetStyleExpandRow = ( { data } ) => {
    return (
        <div style={{ backgroundColor: 'white', color: 'black' }} className=' p-1'>
            {
                data?.nestedStyle?.length > 0 ? <>
                    <div>
                        <h3 className='font-weight-bold'>Details:</h3>
                    </div>
                    <Table size='sm' bordered responsive>
                        <thead >
                            <tr>
                                <th>#</th>
                                <th>Style No</th>
                                <th>Product Category</th>
                                <th>Style Category</th>
                                <th>Size Range</th>
                                <th>Colors</th>
                                <th>Documents</th>
                                <th>Images</th>
                            </tr>
                        </thead>
                        {
                            data?.nestedStyle?.map( ( item, index ) => (
                                <tbody key={item.id}>
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{item.styleNo}</td>
                                        <td>{item.productCategory.categoryName}</td>
                                        <td>{item.styleCategory.categoryName}</td>
                                        <td>{item.sizeRange}</td>
                                        <td>{item.colors}</td>
                                        <td>DOC</td>
                                        <td>Image</td>
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

export default SetStyleExpandRow;

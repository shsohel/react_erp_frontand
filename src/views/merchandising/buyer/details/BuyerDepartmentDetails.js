import React from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useSelector } from "react-redux";
import { Card } from 'reactstrap';


const BuyerDepartmentDetails = () => {
    const { buyerBasicInfo } = useSelector( ( { buyers } ) => buyers );
    return (
        <div >
            <Card>
                <DataTable
                    noHeader
                    dense={true}
                    pagination
                    paginationServer
                    className='react-custom-dataTable'
                    data={buyerBasicInfo.buyerDepartment}
                    columns={[
                        {
                            name: '#',
                            width: '30px',
                            selector: 'name',
                            sortable: true,
                            cell: ( row, index ) => index + 1
                        },
                        {
                            name: 'Name',
                            minWidth: '200px',
                            selector: 'name',
                            sortable: true,
                            cell: row => row?.name
                        },
                        {
                            name: 'Description',
                            minWidth: '200px',
                            selector: 'description',
                            sortable: true,
                            cell: row => row?.description
                        }

                    ]}
                    sortIcon={<ChevronDown size={10} />}
                />
            </Card>
        </div>
    );
};

export default BuyerDepartmentDetails;

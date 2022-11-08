import React from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useSelector } from 'react-redux';
import { Card } from 'reactstrap';


const BuyerAgentDetails = () => {
    const { buyerBasicInfo } = useSelector( ( { buyers } ) => buyers );
    return (
        <div>
            <Card>
                <DataTable
                    dense={true}
                    noHeader
                    pagination
                    paginationServer
                    className='react-custom-dataTable'
                    data={buyerBasicInfo.buyerAgent}
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
                            cell: row => row.name
                        },
                        {
                            name: 'Email',
                            minWidth: '200px',
                            selector: 'email',
                            sortable: true,
                            cell: row => row.email
                        },
                        {
                            name: 'Phone',
                            minWidth: '200px',
                            selector: 'phoneNumber',
                            sortable: true,
                            cell: row => row.phoneNumber
                        }

                    ]}
                    sortIcon={<ChevronDown size={10} />}
                />
            </Card>
        </div>
    );
};

export default BuyerAgentDetails;

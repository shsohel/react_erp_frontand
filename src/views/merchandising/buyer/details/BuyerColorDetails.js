import React from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';

const BuyerColorDetails = () => {
    const { buyerBasicInfo } = useSelector( ( { buyers } ) => buyers );
    return (
        <div>
            <Row>
                <Col >
                    <Row>
                        <Col lg={12} className="mt-1">
                            <DataTable
                                noHeader
                                dense={true}
                                pagination
                                className='react-custom-dataTable'
                                paginationTotalRows={buyerBasicInfo.buyerColors.filter( c => c.isDeleted === false ).length}


                                columns={[
                                    {
                                        name: '#',
                                        width: '30px',
                                        selector: '#',
                                        sortable: true,
                                        cell: ( row, index ) => index + 1
                                    },
                                    {
                                        name: 'Name',
                                        minWidth: '200px',
                                        selector: 'name',
                                        sortable: true,
                                        cell: row => row.name
                                    }
                                ]}
                                sortIcon={<ChevronDown size={10} />}
                                data={buyerBasicInfo.buyerColors.filter( c => c.isDeleted === false )}
                            />
                        </Col>
                    </Row>
                </Col>

            </Row>

        </div>
    );
};

export default BuyerColorDetails;
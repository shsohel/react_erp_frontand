import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';

const BuyerDestinationDetails = () => {
    const dispatch = useDispatch();
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
                                paginationTotalRows={buyerBasicInfo?.buyerDestinations.filter( c => c.isDeleted === false ).length}
                                className='react-custom-dataTable'

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

                                //     data={buyerColors}
                                data={buyerBasicInfo?.buyerDestinations.filter( c => c.isDeleted === false )}
                            />
                        </Col>

                    </Row>
                </Col>

            </Row>
            {/* <ColorInstantCreateForm
                open={colorSidebarOpen}
                handleCreateColorSubmit={handleCreateColorSubmit}
                toggleSidebar={toggleSidebar}
            /> */}
        </div>
    );
};

export default BuyerDestinationDetails;
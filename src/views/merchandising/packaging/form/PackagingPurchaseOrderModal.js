import moment from 'moment';
import React from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { bindSinglePackagingBasic, getSinglePackingDetail } from '../store/action';

const PackagingPurchaseOrderModal = ( { openModal, setOpenModal } ) => {
    const dispatch = useDispatch();
    const { dropdownUom } = useSelector( ( { unitSets } ) => unitSets );

    // console.log( dropdownUom );
    const {
        packagingInfo,
        packagingPurchaseOrders
    } = useSelector( ( { packaging } ) => packaging );

    const handleRowOnClick = ( row ) => {
        const updatedObj = {
            ...packagingInfo,
            orderId: row.orderId,
            orderNumber: row.orderNumber,
            shipmentDate: row.shipmentDate,
            destination: row.destination


        };
        dispatch( bindSinglePackagingBasic( updatedObj ) );
        setOpenModal( !openModal );
        dispatch( getSinglePackingDetail( updatedObj?.orderId, packagingInfo?.style?.value ) );

    };
    const handleModelSubmit = () => {
        setOpenModal( !openModal );

    };
    const handleModalToggleClose = () => {
        setOpenModal( !openModal );
    };
    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog modal-lg'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModelSubmit={handleModelSubmit}
                handleMainModalToggleClose={handleModalToggleClose}
                title="Purchase Orders"
            >
                <Row>
                    <Col>
                        <DataTable
                            noHeader
                            dense
                            pagination
                            highlightOnHover
                            responsive
                            persistTableHead
                            paginationRowsPerPageOptions={[5, 10, 20, 25]}
                            data={packagingPurchaseOrders}
                            paginationTotalRows={packagingPurchaseOrders?.length}
                            sortIcon={<ChevronDown />}
                            className='react-custom-dataTable-other'
                            onRowClicked={( row ) => { handleRowOnClick( row ); }}
                            conditionalRowStyles={[
                                {
                                    when: row => ( packagingInfo?.orderId === row.orderId && packagingInfo?.shipmentDate === row.shipmentDate ),
                                    style: {
                                        backgroundColor: '#E1FEEB'
                                    }
                                }
                            ]}
                            columns={[
                                {
                                    name: 'SL',
                                    width: '30px',
                                    selector: 'SL',
                                    center: true,
                                    cell: ( row, index ) => index + 1
                                },
                                {
                                    name: 'PO No',
                                    reorder: true,
                                    minWidth: '150px',
                                    selector: 'orderNumber',
                                    sortable: true,
                                    center: true,
                                    cell: row => row?.orderNumber
                                },
                                {
                                    name: 'Size Group',
                                    reorder: true,
                                    minWidth: '150px',
                                    selector: 'sizeGroup',
                                    sortable: true,
                                    center: true,
                                    cell: row => row?.sizeGroup
                                },

                                {
                                    name: 'Shipment Date',
                                    minWidth: '100px',
                                    selector: 'shipmentDate',
                                    sortable: true,
                                    center: true,
                                    cell: row => moment( row?.shipmentDate ).format( 'DD-MM-YYYY' )
                                },
                                {
                                    name: 'Destination',
                                    minWidth: '100px',
                                    selector: 'destination',
                                    sortable: true,
                                    center: true,
                                    cell: row => row?.destination
                                }

                            ]}
                        />
                    </Col>
                </Row>

            </CustomModal>

        </div>
    );
};

export default PackagingPurchaseOrderModal;
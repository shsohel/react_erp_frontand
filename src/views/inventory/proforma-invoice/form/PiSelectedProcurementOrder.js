import moment from 'moment';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useSelector } from 'react-redux';


const PiSelectedProcurementOrder = () => {
    const { selectedSupplierOrders } = useSelector( ( { pis } ) => pis );

    return (
        <div>
            <DataTable
                //  subHeader
                subHeaderComponent={<div className='d-flex justify-content-between'>
                    {/* <Input
                                    id="styleNoId"
                                    name="styleNo"
                                    bsSize="sm"
                                    type="text"
                                    placeholder="Search Style No"
                                    onChange={e => { handleFilter( e ); }} />
                                <Input
                                    id="orderNoId"
                                    name="orderNo"
                                    type="text"
                                    bsSize="sm"
                                    placeholder="Search Order No"
                                    onChange={e => { handleFilter( e ); }} />
                                <Input
                                    id="orderQuantityId"
                                    name="orderQuantity"
                                    type="number"
                                    bsSize="sm"
                                    placeholder="Search Order Qty"
                                    onChange={e => { handleFilter( e ); }} /> */}
                </div>}
                noHeader
                dense={true}
                defaultSortAsc
                pagination
                persistTableHead
                className='react-custom-dataTable-other'
                paginationRowsPerPageOptions={[5, 10, 20, 25]}
                columns={[
                    {

                        name: "#",
                        id: 'isSelected',
                        width: '50px',
                        selector: row => row.isSelected,
                        center: true,
                        //   sortable: true,
                        cell: ( row, index ) => index + 1

                    },
                    {
                        id: "requisitionNumber",
                        name: 'Requisition No',
                        minWidth: '150px',
                        selector: 'requisitionNumber',
                        sortable: true,
                        center: true,
                        cell: row => row?.requisitionNumber
                    },
                    {
                        name: 'Order Date',
                        minWidth: '150px',
                        selector: 'requisitionNumber',
                        sortable: true,
                        center: true,
                        cell: row => moment( row?.orderDate ).format( "DD-MM-YYYY" )
                    },
                    {
                        name: 'Buyer',
                        minWidth: '150px',
                        selector: 'buyerName',
                        sortable: true,
                        center: true,
                        cell: row => row?.buyerName
                    },
                    {
                        name: 'Order Quantity',
                        minWidth: '150px',
                        selector: 'totalQuantity',
                        sortable: true,
                        center: true,
                        cell: row => row?.totalQuantity
                    },
                    {
                        name: 'Total Amount',
                        minWidth: '150px',
                        selector: 'totalAmount',
                        sortable: true,
                        center: true,
                        cell: row => row?.totalAmount
                    }

                ]}
                // data={randersData()}
                data={selectedSupplierOrders}
                sortIcon={<ChevronDown size={2} />}
                // paginationTotalRows={randersData().length}
                paginationTotalRows={selectedSupplierOrders.length}
            />
        </div>
    );
};

export default PiSelectedProcurementOrder;
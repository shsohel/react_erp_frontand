import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { CustomInput, Input } from 'reactstrap';
import { bindSupplierOrderOnChange } from '../store/actions';
// import TableFilterInsideRow from '../../../../utility/custom/TableFilterInsideRow';
import TableFilterInsideRow from '../../../../utility/custom/TableFilterInsideRow';
import { isZeroToFixed } from '../../../../utility/Utils';

const ProcurementOrders = () => {
    const dispatch = useDispatch();
    const { supplierOrder } = useSelector( ( { pis } ) => pis );
    const [allRowSelected, setAllRowSelected] = useState( false );

    const [filterObj, setFilterObj] = useState( {
        orderNumber: '',
        buyerName: '',
        budgetNumbers: '',
        buyerPONumbers: '',
        styleNumbers: '',
        supplier: '',
        source: '',
        amount: ''
        // orderQuantity: 0
    } );

    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : value
        } );
    };

    const handleAllRowSelect = ( e ) => {
        const { name, checked } = e.target;
        setAllRowSelected( checked );
        const updatedData = supplierOrder.map( so => ( { ...so, isSelected: checked } ) );
        dispatch( bindSupplierOrderOnChange( updatedData ) );
    };
    const handleSelectSingleRow = ( e, fieldId ) => {
        const { name, checked } = e.target;
        const updatedData = supplierOrder.map( so => {
            if ( so.fieldId === fieldId ) {
                so[name] = checked;
            }
            return so;
        } );
        dispatch( bindSupplierOrderOnChange( updatedData ) );
        const isAllRowSelected = supplierOrder.some( so => !so.isSelected === true );
        setAllRowSelected( !isAllRowSelected );
    };

    const randersData = () => {
        let filtered = [];
        if ( filterObj.orderNumber.length
            || filterObj?.buyerName.length
            || filterObj?.budgetNumbers.length
            || filterObj?.buyerPONumbers.length
            || filterObj?.styleNumbers.length
            || filterObj?.source.length
            || filterObj?.amount.length
            || filterObj?.supplier.length
        ) {
            filtered = supplierOrder?.filter(
                wh => wh.orderNumber?.toLowerCase().includes( filterObj.orderNumber?.toLowerCase() ) &&
                    wh.buyerName?.toLowerCase().includes( filterObj?.buyerName?.toLowerCase() ) &&
                    wh.budgetNumbers?.toLowerCase().includes( filterObj?.budgetNumbers?.toLowerCase() ) &&
                    wh.buyerPONumbers?.toLowerCase().includes( filterObj?.buyerPONumbers?.toLowerCase() ) &&
                    wh.styleNumbers?.toLowerCase().includes( filterObj?.styleNumbers?.toLowerCase() ) &&
                    wh.source?.toLowerCase().includes( filterObj?.source?.toLowerCase() ) &&
                    wh.supplier?.toLowerCase().includes( filterObj?.supplier?.toLowerCase() ) &&
                    isZeroToFixed( wh?.amount, 4 ).includes( filterObj.amount )
            );

        } else {
            filtered = supplierOrder;
        }
        return filtered;
    };


    const filterArray = [
        {
            id: 'isSelected',
            name: '',
            width: '50px'

        },
        {
            id: 'supplierOrderNumber',
            name: <Input
                id="orderNumberId"
                name="orderNumber"
                bsSize="sm"
                type="text"
                placeholder=""
                value={filterObj.orderNumber}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '150px'

        },

        {
            id: 'buyerId',
            name: <Input
                id="buyerNameId"
                name="buyerName"
                type="text"
                bsSize="sm"
                placeholder=""
                value={filterObj.buyerName}

                onChange={e => { handleFilter( e ); }} />,
            minWidth: '150px'

        },
        {
            id: 'budgetNumbersId',
            name: <Input
                id="budgetNumbersId"
                name="budgetNumbers"
                type="text"
                bsSize="sm"
                placeholder=""
                value={filterObj.budgetNumbers}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '150px'

        },
        {
            id: 'buyerPONumbers',
            name: <Input
                id="buyerPONumbersId"
                name="buyerPONumbers"
                type="text"
                bsSize="sm"
                placeholder=""
                value={filterObj.buyerPONumbers}

                onChange={e => { handleFilter( e ); }} />,
            minWidth: '150px'

        },
        {
            id: 'styles',
            name: <Input
                id="styleNumbersId"
                name="styleNumbers"
                type="text"
                bsSize="sm"
                placeholder=""
                value={filterObj.styleNumbers}

                onChange={e => { handleFilter( e ); }} />,
            minWidth: '150px'

        },

        {
            id: 'supplier',
            name: <Input
                id="supplierId"
                name="supplier"
                type="text"
                bsSize="sm"
                placeholder=""
                value={filterObj.supplier}

                onChange={e => { handleFilter( e ); }} />,
            minWidth: '150px'

        },
        {
            id: 'source',
            name: <Input
                id="sourceId"
                name="source"
                type="text"
                bsSize="sm"
                placeholder=""
                value={filterObj.source}

                onChange={e => { handleFilter( e ); }} />,
            width: '120px'

        },
        {
            id: 'amount',
            name: <Input
                id="amountId"
                name="amount"
                type="text"
                bsSize="sm"
                placeholder=""
                value={filterObj.amount}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '150px'

        }

    ];

    return (
        <div>
            <TableFilterInsideRow rowId="pi-procurement-order-id" tableId="pi-procurement-order-custom-dt" filterArray={filterArray} />

            <DataTable

                noHeader
                dense={true}
                defaultSortAsc
                pagination
                persistTableHead
                className='react-custom-dataTable-other pi-procurement-order-custom-dt'
                paginationRowsPerPageOptions={[5, 10, 20, 25]}
                columns={[
                    {
                        name: <CustomInput
                            type='checkbox'
                            className='custom-control-Primary p-0'
                            id="isSelectedId"
                            name='isSelected'
                            htmlFor="isSelectedId"
                            checked={allRowSelected}
                            inline
                            onChange={( e ) => handleAllRowSelect( e )}
                        />,
                        id: 'isSelected',
                        width: '50px',
                        selector: row => row.isSelected,
                        center: true,
                        //   sortable: true,
                        cell: ( row ) => (
                            <CustomInput
                                type='checkbox'
                                className='custom-control-Primary p-0'
                                id={row.fieldId.toString()}
                                name='isSelected'
                                htmlFor={row.fieldId.toString()}
                                checked={row.isSelected}
                                inline
                                onChange={( e ) => handleSelectSingleRow( e, row.fieldId )}
                            />
                        )

                    },
                    {
                        id: 'orderNumber',
                        name: 'IPO NO',
                        minWidth: '150px',
                        selector: 'orderNumber',
                        sortable: true,
                        center: true,
                        cell: row => row?.orderNumber
                    },

                    {
                        id: 'buyerId',
                        name: 'Buyer',
                        minWidth: '150px',
                        selector: 'buyerName',
                        sortable: true,
                        center: true,
                        cell: row => row?.buyerName
                    },
                    {
                        id: 'budgetNumbersId',
                        name: 'Budget',
                        minWidth: '150px',
                        selector: 'budgetNumbers',
                        sortable: true,
                        center: true,
                        cell: row => row?.budgetNumbers
                    },
                    {
                        id: 'buyerPONumbersId',
                        name: 'PO',
                        minWidth: '150px',
                        selector: 'buyerPONumbers',
                        sortable: true,
                        center: true,
                        cell: row => row?.buyerPONumbers
                    },
                    {
                        id: 'styleNumbersId',
                        name: 'Styles',
                        minWidth: '150px',
                        selector: 'styleNumbers',
                        sortable: true,
                        center: true,
                        cell: row => row?.styleNumbers
                    },
                    {
                        id: 'supplierId',
                        name: 'Supplier',
                        minWidth: '150px',
                        selector: 'supplier',
                        sortable: true,
                        center: true,
                        cell: row => row?.supplier
                    },
                    {
                        id: 'sourceId',
                        name: 'Source',
                        width: '120px',
                        selector: 'source',
                        sortable: true,
                        center: true,
                        cell: row => row?.source
                    },
                    {
                        id: 'amountId',
                        name: 'Amount',
                        minWidth: '150px',
                        selector: 'amount',
                        sortable: true,
                        center: true,
                        cell: row => isZeroToFixed( row?.amount, 4 )
                    }

                    // {
                    //     id: 'orderType',
                    //     name: 'Order Type',
                    //     minWidth: '150px',
                    //     selector: 'isNormalOrder',
                    //     sortable: true,
                    //     center: true,
                    //     cell: row => ( row?.isNormalOrder ? "IND" : 'BOM' )
                    // }

                ]}
                // data={randersData()}
                data={randersData()}
                sortIcon={<ChevronDown size={2} />}
                // paginationTotalRows={randersData().length}
                paginationTotalRows={randersData().length}
            />
        </div>
    );
};

export default ProcurementOrders;
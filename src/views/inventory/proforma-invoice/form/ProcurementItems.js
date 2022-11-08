import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Col, CustomInput, Input, Row } from 'reactstrap';
import TableFilterInsideRow from '../../../../utility/custom/TableFilterInsideRow';
import { bindProcurementItems } from '../store/actions';

const ProcurementItems = () => {
    const dispatch = useDispatch();
    const { procurementItems, piBasicInfo } = useSelector( ( { pis } ) => pis );
    const [allRowSelected, setAllRowSelected] = useState( false );

    const [filterObj, setFilterObj] = useState( {
        budgetNumber: '',
        supplierOrderNumber: '',
        itemCategory: '',
        itemSubCategory: '',
        itemCode: '',
        itemName: '',
        orderQuantity: '',
        orderRate: '',
        quantity: '',
        quantityRemaining: ''
    } );

    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        console.log( name );

        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : value
        } );
    };

    const handleAllRowSelect = ( e ) => {
        const { name, checked } = e.target;
        setAllRowSelected( checked );
        const updatedData = procurementItems.map( so => ( { ...so, isSelected: checked } ) );
        dispatch( bindProcurementItems( updatedData ) );
    };
    const handleSelectSingleRow = ( e, rowId ) => {
        console.log( rowId );
        const { name, checked } = e.target;
        const updatedData = procurementItems.map( so => {
            if ( so.rowId === rowId ) {
                so[name] = checked;
            }
            return so;
        } );
        dispatch( bindProcurementItems( updatedData ) );
        const isAllRowSelected = procurementItems.some( so => !so.isSelected === true );
        setAllRowSelected( !isAllRowSelected );
    };

    const randersData = () => {
        let filtered = [];
        if ( filterObj.supplierOrderNumber.length
            || filterObj.itemCategory.length
            || filterObj.itemSubCategory.length
            || filterObj.itemCode.length
            || filterObj.itemName.length
            || filterObj.orderRate.length
            || filterObj.quantity.length
            || filterObj.quantityRemaining.length
        ) {
            filtered = procurementItems?.filter(
                wh => wh.supplierOrderNumber?.toLowerCase().includes( filterObj.supplierOrderNumber?.toLowerCase() ) &&
                    wh.itemCategory?.toLowerCase().includes( filterObj.itemCategory?.toLowerCase() ) &&
                    wh.itemSubCategory?.toLowerCase().includes( filterObj.itemSubCategory?.toLowerCase() ) &&
                    wh.itemCode?.toLowerCase().includes( filterObj.itemCode?.toLowerCase() ) &&
                    wh.itemName?.toLowerCase().includes( filterObj.itemName?.toLowerCase() ) &&
                    wh.orderRate?.toString().includes( filterObj.orderRate ) &&
                    wh.quantity?.toString().includes( filterObj.quantity ) &&
                    wh.quantityRemaining?.toString().includes( filterObj.quantityRemaining )
            );
        } else {
            filtered = procurementItems;
        }
        return filtered;
    };


    console.log( procurementItems );

    const filterArray = [
        {
            name: '',
            id: 'isSelected',
            width: '50px',
            selector: row => row.isSelected
        },

        {
            id: "supplierOrderNumber",
            name: <Input
                id="supplierOrderNumberId"
                name="supplierOrderNumber"
                type="text"
                bsSize="sm"
                value={filterObj.supplierOrderNumber}
                onChange={e => { handleFilter( e ); }} />,
            width: '130px'

        },
        {
            name: <Input
                id="itemCategoryId"
                name="itemCategory"
                type="text"
                bsSize="sm"
                value={filterObj.itemCategory}
                onChange={e => { handleFilter( e ); }} />,
            width: '160px',
            id: 'itemCategory'

        },
        {
            name: <Input
                id="itemSubCategoryId"
                name="itemSubCategory"
                type="text"
                bsSize="sm"
                value={filterObj.itemSubCategory}
                onChange={e => { handleFilter( e ); }} />,
            width: '160px',
            id: 'itemSubCategory'

        },
        {
            name: <Input
                id="itemCodeId"
                name="itemCode"
                type="text"
                bsSize="sm"
                value={filterObj.itemCode}
                onChange={e => { handleFilter( e ); }} />,
            maxWidth: '110px',
            id: 'itemCode'

        },
        {
            name: <Input
                id="itemNameId"
                name="itemName"
                type="text"
                bsSize="sm"
                value={filterObj.itemName}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '400px',
            id: 'itemName'

        },

        {
            name: <Input
                id="orderRateId"
                name="orderRate"
                type="text"
                bsSize="sm"
                value={filterObj.orderRate}
                onChange={e => { handleFilter( e ); }} />,
            width: '110px',
            id: 'orderRate'

        },
        {
            name: <Input
                id="quantityId"
                name="quantity"
                type="text"
                bsSize="sm"
                value={filterObj.quantity}
                onChange={e => { handleFilter( e ); }} />,
            id: 'quantity',
            width: '130px'

        },
        {
            name: <Input
                id="quantityRemainingId"
                name="quantityRemaining"
                type="text"
                bsSize="sm"
                value={filterObj.quantityRemaining}
                onChange={e => { handleFilter( e ); }} />,
            id: 'quantityRemainingId',
            width: '130px'

        }
    ];

    return (
        <div>
            <Row>
                <Col>
                    <TableFilterInsideRow rowId="pi-item-modal-id" tableId="pi-item-modal-custom-dt" filterArray={filterArray} />

                    <DataTable

                        noHeader
                        dense={true}
                        defaultSortAsc
                        pagination
                        persistTableHead
                        className='react-custom-dataTable-other pi-item-modal-custom-dt'
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
                                        id={row.rowId.toString()}
                                        name='isSelected'
                                        htmlFor={row.rowId.toString()}
                                        checked={row.isSelected}
                                        inline
                                        onChange={( e ) => handleSelectSingleRow( e, row.rowId )}
                                    />
                                )

                            },

                            {
                                id: "supplierOrderNumber",
                                name: 'IPO NO',
                                width: '130px',
                                selector: row => row.supplierOrderNumber,
                                center: true,
                                cell: row => row.supplierOrderNumber
                            },
                            {
                                name: 'Item Category',
                                width: '160px',
                                selector: 'itemCategory',
                                sortable: true,
                                center: true,
                                cell: row => row.itemCategory
                            },
                            {
                                name: 'Item Sub-Category',
                                width: '160px',
                                selector: 'itemSubCategory',
                                sortable: true,
                                center: true,
                                cell: row => row.itemSubCategory
                            },
                            {
                                name: 'Item Code',
                                maxWidth: '110px',
                                selector: 'itemCode',
                                sortable: true,
                                center: true,
                                cell: row => row?.itemCode
                            },
                            {
                                name: 'Item Name',
                                minWidth: '400px',
                                selector: 'itemName',
                                sortable: true,
                                center: false,
                                cell: row => row?.itemName
                            },

                            {
                                name: 'Order Rate',
                                width: '110px',
                                selector: 'orderRate',
                                sortable: true,
                                center: true,
                                cell: row => row?.orderRate
                            },
                            {
                                name: 'Order Qty',
                                width: '130px',
                                selector: 'quantity',
                                sortable: true,
                                center: true,
                                cell: row => row?.quantity
                            },
                            {
                                name: 'Remaining Qty',
                                width: '130px',
                                selector: 'quantityRemaining',
                                sortable: true,
                                center: true,
                                cell: row => row?.quantityRemaining
                            }

                        ]}
                        data={randersData()}
                        //   data={procurementItems}
                        sortIcon={<ChevronDown size={2} />}
                        paginationTotalRows={randersData().length}
                    // paginationTotalRows={procurementItems.length}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default ProcurementItems;
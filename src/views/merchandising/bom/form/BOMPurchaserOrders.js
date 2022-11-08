import moment from 'moment';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { CustomInput, Input } from 'reactstrap';
import TableFilterInsideRow from '../../../../utility/custom/TableFilterInsideRow';
import { isZeroToFixed, randomIdGenerator } from '../../../../utility/Utils';
import { bindBomPurchaseOrders } from '../store/actions';

export const BOMPurchaserOrders = () => {
    const dispatch = useDispatch();
    const [filterObj, setFilterObj] = useState( {
        orderNumber: '',
        orderDate: '',
        styleNumbers: '',
        buyerName: '',
        destination: '',
        shipmentDate: '',
        season: '',
        year: '',
        currency: '',
        orderUom: '',
        ratePerUnit: '',
        totalOrderQuantity: '',
        totalOrderAmount: ''
    } );

    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : type === 'date' ? ( value.length ? moment( value ).format( "yyyy-MM-DD" ) : value ) : value
        } );
    };


    const { bomPurchaseOrders } = useSelector( ( { boms } ) => boms );

    const handleAllRowSelect = ( e, rowId ) => {

        const { name, checked } = e.target;
        const updatedData = bomPurchaseOrders.map( order => ( { ...order, isSelected: checked } ) );

        dispatch( bindBomPurchaseOrders( updatedData ) );
    };

    const handleSelectSingleRow = ( e, rowId ) => {
        const { name, checked } = e.target;
        const updatedData = bomPurchaseOrders.map( order => {
            if ( rowId === order.rowId ) {
                order["isSelected"] = checked;
            }
            return order;
        } );
        dispatch( bindBomPurchaseOrders( updatedData ) );
    };

    console.log( filterObj.ratePerUnit );

    const randersData = () => {
        let filtered = [];
        if ( filterObj.orderNumber.length ||
            filterObj.orderDate.length ||
            filterObj.styleNumbers.length ||
            filterObj.shipmentDate.length ||
            filterObj.season.length ||
            filterObj.destination.length ||
            filterObj.buyerName.length ||
            filterObj.year.length ||
            filterObj.currency.length ||
            filterObj.orderUom.length ||
            filterObj.ratePerUnit ||
            filterObj.totalOrderQuantity ||
            filterObj.totalOrderAmount

        ) {
            filtered =
                bomPurchaseOrders.filter(
                    wh => wh.orderNumber?.toLowerCase().includes( filterObj.orderNumber?.toLowerCase() ) &&
                        wh.orderDate?.includes( filterObj.orderDate ) &&
                        wh.styleNumbers?.toLowerCase().includes( filterObj.styleNumbers?.toLowerCase() ) &&
                        wh.shipmentDate.includes( filterObj.shipmentDate ) &&
                        wh.season?.toLowerCase().includes( filterObj.season?.toLowerCase() ) &&
                        wh.destination?.toLowerCase().includes( filterObj.destination?.toLowerCase() ) &&
                        wh.buyerName?.toLowerCase().includes( filterObj.buyerName?.toLowerCase() ) &&
                        wh.year?.toLowerCase().includes( filterObj.year?.toLowerCase() ) &&
                        wh.currency?.toLowerCase().includes( filterObj.currency?.toLowerCase() ) &&
                        wh.orderUom?.toLowerCase().includes( filterObj.orderUom?.toLowerCase() ) &&
                        isZeroToFixed( wh.ratePerUnit, 4 ).includes( filterObj.ratePerUnit.toString() ) &&
                        isZeroToFixed( wh.totalOrderAmount, 4 ).includes( filterObj.totalOrderAmount.toString().toLocaleLowerCase() ) &&
                        wh.totalOrderQuantity.toString().includes( filterObj.totalOrderQuantity.toString() )
                );
        } else {
            filtered = bomPurchaseOrders;
        }
        // return paginateArray( filtered, rowsPerPage, page );
        return filtered;
    };


    const filterArray = [
        {
            name: '',
            id: 1,
            minWidth: '50px'
        },
        {
            id: 2,
            name: '',
            minWidth: '40px'

        },
        {
            id: 3,
            name: <Input
                bsSize="sm"
                type="text"
                className="rounded-0"
                value={filterObj.orderNumber}
                name="orderNumber"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '150px'

        },

        {
            id: 4,
            name: <Input
                bsSize="sm"
                type="date"
                className="rounded-0"
                value={filterObj.orderDate}
                name="orderDate"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '160px'
        },

        {
            id: 5,
            name: <Input
                bsSize="sm"
                type="text"
                className="rounded-0"
                value={filterObj.styleNumbers}
                name="styleNumbers"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '150px'

        },
        {
            id: 6,
            name: <Input
                bsSize="sm"
                type="text"
                className="rounded-0"
                value={filterObj.buyerName}
                name="buyerName"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '150px'
        },

        {
            id: 7,
            name: <Input
                bsSize="sm"
                type="date"
                className="rounded-0"
                value={filterObj.shipmentDate}
                name="shipmentDate"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '160px'
        },
        {
            id: 8,
            name: <Input
                bsSize="sm"
                type="text"
                className="rounded-0"
                value={filterObj.destination}
                name="destination"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '160px'
        },
        {
            id: 9,
            name: <Input
                bsSize="sm"
                type="text"
                className="rounded-0"
                value={filterObj.season}
                name="season"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '150px'
        },
        {
            id: 10,
            name: <Input
                bsSize="sm"
                type="text"
                className="rounded-0"
                value={filterObj.year}
                name="year"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '150px'
        },
        {
            id: 11,
            name: <Input
                bsSize="sm"
                type="text"
                className="rounded-0"
                value={filterObj.currency}
                name="currency"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '150px'
        },
        {
            id: 12,
            name: <Input
                bsSize="sm"
                type="text"
                className="rounded-0"
                value={filterObj.orderUom}
                name="orderUom"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '150px'
        },
        {
            id: 13,
            name: <Input
                bsSize="sm"
                type="text"
                className="rounded-0"
                value={filterObj.ratePerUnit}
                name="ratePerUnit"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '150px'
        },

        {
            id: 14,
            name: <Input
                bsSize="sm"
                type="text"
                className="rounded-0"
                value={filterObj.totalOrderQuantity}
                name="totalOrderQuantity"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '150px'
        },
        {
            id: 15,
            name: <Input
                bsSize="sm"
                type="text"
                className="rounded-0"
                value={filterObj.totalOrderAmount}
                name="totalOrderAmount"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '150px'
        },
        {
            id: 16,
            name: '',
            minWidth: '150px'
        }

    ];

    return (
        <div >

            <TableFilterInsideRow rowId="rowIdTable" tableId="bom-po-table" filterArray={filterArray} />

            <DataTable
                pagination
                noHeader
                responsive
                // data={randersData()}
                data={randersData()}
                className='react-custom-dataTable-other bom-po-table '
                persistTableHead
                dense
                paginationTotalRows={randersData().length}
                columns={[
                    {
                        name: <CustomInput
                            type='checkbox'
                            className='custom-control-Primary p-0'
                            id="isSelectedId"
                            name='isSelectedAll'
                            htmlFor="isSelectedId"
                            checked={bomPurchaseOrders.length ? bomPurchaseOrders.every( so => so.isSelected === true ) : false}
                            inline
                            onChange={( e ) => handleAllRowSelect( e )}
                        />,
                        id: randomIdGenerator(),
                        minWidth: '50px',
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
                        id: 'serialId',
                        name: 'SL',
                        minWidth: '40px',
                        selector: row => row.cartonNoSeries,
                        center: true,
                        cell: ( row, index ) => index + 1
                    },
                    {
                        id: row => row.orderNumber,
                        name: 'PO No',
                        minWidth: '150px',
                        selector: row => row.orderNumber,
                        center: true,
                        sortable: true,

                        cell: row => row.orderNumber
                    },

                    {
                        id: row => row.orderDate,
                        name: 'PO Date',
                        minWidth: '160px',
                        selector: row => row.orderDate,
                        sortable: true,
                        center: true,
                        cell: row => moment( row.orderDate ).format( "DD-MM-YYYY" )
                    },

                    {
                        id: row => row.styleNumbers,
                        name: 'Style No',
                        minWidth: '150px',
                        selector: row => row.styleNumbers,
                        sortable: true,
                        center: true,
                        cell: row => row.styleNumbers
                    },
                    {
                        id: row => row.buyerName,
                        name: 'Buyer',
                        minWidth: '150px',
                        selector: row => row.buyerName,
                        sortable: true,
                        center: true,
                        cell: row => row.buyerName
                    },

                    {
                        id: row => row.shipmentDate,
                        name: 'Shipment Date',
                        sortable: true,
                        minWidth: '160px',
                        selector: row => row.shipmentDate,
                        center: true,
                        cell: row => moment( row.shipmentDate ).format( "DD-MM-YYYY" )
                    },
                    {
                        id: row => row.destination,
                        name: 'Destination',
                        sortable: true,
                        minWidth: '160px',
                        selector: row => row.destination,
                        center: true,
                        cell: row => row.destination
                    },
                    {
                        id: row => row.season,
                        name: 'Season',
                        minWidth: '150px',
                        selector: row => row.season,
                        sortable: true,
                        center: true,
                        cell: row => row.season
                    },
                    {
                        id: row => row.year,
                        name: 'Year',
                        minWidth: '150px',
                        selector: row => row.year,
                        sortable: true,
                        center: true,
                        cell: row => row.year
                    },
                    {
                        id: row => row.currency,
                        name: 'Currency',
                        sortable: true,
                        minWidth: '150px',
                        selector: row => row.currency,
                        center: true,
                        cell: row => row.currency
                    },
                    {
                        id: row => row.orderUom,
                        sortable: true,
                        name: 'UOM',
                        minWidth: '150px',
                        selector: row => row.orderUom,
                        center: true,
                        cell: row => row.orderUom
                    },
                    {
                        id: row => row.ratePerUnit,
                        name: 'Rate',
                        minWidth: '150px',
                        selector: row => row.ratePerUnit,
                        center: true,
                        cell: row => isZeroToFixed( row.ratePerUnit, 4 )
                    },

                    {
                        id: row => row.totalOrderQuantity,
                        name: 'Total Quantity',
                        minWidth: '150px',
                        selector: row => row.totalOrderQuantity,
                        center: true,
                        cell: row => row.totalOrderQuantity
                    },
                    {
                        id: row => row.totalOrderAmount,
                        name: 'Total Amount',
                        minWidth: '150px',
                        selector: row => row.totalOrderAmount,
                        center: true,
                        cell: row => isZeroToFixed( row.totalOrderAmount, 4 )
                    },
                    {
                        id: row => row.isSetOrder,
                        name: 'is Set Order?',
                        minWidth: '150px',
                        selector: row => row.isSetOrder,
                        center: true,
                        cell: row => <CustomInput
                            id={randomIdGenerator()}
                            type="checkbox"
                            onChange={e => e.preventDefault()}
                            checked={row.isSetOrder}

                        />
                    }

                ]}
            />
        </div>
    );
};

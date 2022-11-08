import '@custom-styles/merchandising/others/custom-table.scss';
import moment from 'moment';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { CustomInput, Input } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import TableFilterInsideRow from '../../../../utility/custom/TableFilterInsideRow';
import { randomIdGenerator } from '../../../../utility/Utils';
import { bindBudgetPurchaseOrderDetails, bindPODetails, getBudgetDetails } from '../store/actions';


export const POModal = ( { openModal, setOpenModal } ) => {
    const dispatch = useDispatch();
    const { buyerPODetails, budgetPurchaseOrderQuantityDetails } = useSelector( ( { budgets } ) => budgets );

    const [filterObj, setFilterObj] = useState( {
        styleNumber: '',
        shipmentDate: '',
        orderNumber: '',
        orderQuantity: 0
    } );

    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;

        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : value
        } );
    };

    const handleAllSelect = ( e ) => {
        const { name, value, checked } = e.target;
        const updatedData = buyerPODetails.map( order => ( { ...order, isInclude: checked } ) );
        dispatch( bindPODetails( updatedData ) );
    };

    const handleMainModalToggleClose = ( params ) => {
        setOpenModal( !openModal );
    };
    const handleModalSubmit = () => {

        const selectedItems = buyerPODetails.filter( order => order.isInclude === true );
        console.log( 'selectedItem', selectedItems );


        const totallyNewItems = selectedItems.filter( o => !budgetPurchaseOrderQuantityDetails.some( order => order.orderId === o.orderId && order.shipmentDate === o.shipmentDate && order.destination === o.destination ) );

        const newOrderDetails = totallyNewItems.map( order => ( {
            ...order,
            id: 0,
            rowId: randomIdGenerator()
        } ) );

        const finalSelected = [...budgetPurchaseOrderQuantityDetails, ...newOrderDetails];

        dispatch( bindBudgetPurchaseOrderDetails( finalSelected ) );


        const queryData = finalSelected.map( order => ( {
            orderId: order.orderId,
            styleId: order.styleId,
            shipmentDate: order.shipmentDate,
            destination: order.destination
        } ) );


        setOpenModal( !openModal );
        dispatch( getBudgetDetails( queryData ) );

    };


    const handleOnChange = ( e, id ) => {
        const { value, name, checked } = e.target;
        const updatedData = buyerPODetails.map( order => {
            if ( id === order.id ) {
                order[name] = checked;
            }
            return order;
        } );
        dispatch( bindPODetails( updatedData ) );
    };


    const randersData = () => {
        let filtered = [];
        if ( filterObj.styleNumber.length || filterObj.orderNumber.length || filterObj.shipmentDate.length || filterObj.orderQuantity ) {
            filtered = buyerPODetails?.filter(
                wh => wh.styleNumber?.toLowerCase().includes( filterObj.styleNumber?.toLowerCase() )
                    &&
                    wh.orderNumber?.toLowerCase().includes( filterObj.orderNumber?.toLowerCase() )
                    &&
                    wh.orderQuantity.toString().toLocaleLowerCase().includes( filterObj.orderQuantity.toString().toLocaleLowerCase() )
                    &&
                    wh.shipmentDate.includes( filterObj.shipmentDate )
            );
        } else {
            filtered = buyerPODetails;
        }
        return filtered;
    };
    const filterArray = [
        {
            name: '',
            id: 1,
            center: true,

            width: '40px'
        },
        {
            name: '',
            id: 2,
            width: '40px'
        },


        {
            id: 4,
            name: <Input
                name="styleNumber"
                onChange={( e ) => { handleFilter( e ); }}
                type="text"
                bsSize="sm"
            />,
            minWidth: '40px'
        },

        {
            id: 5,
            name: <Input
                name="orderNumber"
                type="text"
                bsSize="sm"
                onChange={( e ) => { handleFilter( e ); }}

            />,
            minWidth: '40px'

        },
        {
            id: 6,
            name: <Input
                name="orderQuantity"
                type="text"
                bsSize="sm"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '40px'
        },

        {
            id: 7,
            name: <Input
                id="shipmentDateId"
                name="shipmentDate"
                bsSize="sm"
                type="date"

                onChange={e => { handleFilter( e ); }}
            />,
            minWidth: '40px'
        },
        {
            id: 8,
            name: "",
            minWidth: '40px'
        }


    ];
    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog modal-lg'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModalToggleClose={handleMainModalToggleClose}
                handleMainModelSubmit={handleModalSubmit}
                title="Buyer Purchase Orders"
            >
                <div>
                    <TableFilterInsideRow rowId="rowIdTable" tableId="budget-search-po-table" filterArray={filterArray} />

                    <DataTable
                        pagination
                        // noDataComponent={<div> No Data are avaiable</div>}
                        noHeader
                        responsive
                        data={randersData()}
                        className='react-custom-dataTable-other budget-search-po-table '
                        persistTableHead
                        dense
                        paginationTotalRows={randersData().length}
                        columns={[
                            {
                                name: <CustomInput
                                    type='checkbox'
                                    className='custom-control-Primary p-0'
                                    id='allSelectedId'
                                    name='isInclude'
                                    htmlFor='allSelectedId'
                                    checked={randersData().some( order => order.isInclude === true )}
                                    inline
                                    onChange={( e ) => { handleAllSelect( e ); }}
                                />,
                                id: randomIdGenerator(),
                                width: '40px',
                                selector: row => row.isSelected,
                                center: true,
                                //   sortable: true,
                                cell: ( row ) => (
                                    <CustomInput
                                        type='checkbox'
                                        className='custom-control-Primary p-0'
                                        id={row.id}
                                        name='isInclude'
                                        htmlFor={`${row.id}`}
                                        checked={row.isInclude}
                                        inline
                                        onChange={( e ) => { handleOnChange( e, row.id ); }}
                                    />
                                )

                            },
                            {
                                id: 'serialId',
                                name: 'SL',
                                width: '40px',
                                selector: row => row.serialId,
                                center: true,
                                cell: ( row, index ) => index + 1
                            },
                            {
                                id: row => row.styleNumber,
                                name: 'Style No',
                                minWidth: '40px',
                                selector: row => row.styleNumber,
                                center: true,
                                cell: ( row, index ) => row.styleNumber
                            },
                            {
                                id: row => row.orderNumber,
                                name: 'PO No',
                                minWidth: '40px',
                                selector: row => row.orderNumber,
                                center: true,
                                cell: ( row, index ) => row.orderNumber
                            },
                            {
                                id: row => row.orderQuantity,
                                name: 'Qty',
                                minWidth: '40px',
                                selector: row => row.orderQuantity,
                                center: true,
                                cell: ( row, index ) => row.orderQuantity
                            },
                            {
                                id: row => row.shipmentDate,
                                name: 'Shipment Date',
                                minWidth: '40px',
                                selector: row => row.shipmentDate,
                                center: true,
                                cell: ( row, index ) => moment( row.shipmentDate ).format( 'DD-MM-YYYY' )
                            },
                            {
                                id: row => row.destination,
                                name: 'Destination',
                                minWidth: '40px',
                                selector: row => row.destination,
                                center: true,
                                cell: row => row.destination
                            }
                        ]}
                    />

                </div>


            </CustomModal >
        </div >
    );
};

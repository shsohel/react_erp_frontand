import { notify } from "@custom/notifications";
import classNames from "classnames";
import _ from 'lodash';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { MinusSquare, Trash2, XSquare } from 'react-feather';
import NumberFormat from "react-number-format";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, CustomInput, Input, Label, Row } from 'reactstrap';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import TableFilterInsideRow from '../../../../utility/custom/TableFilterInsideRow';
import { confirmObj } from '../../../../utility/enums';
import { isHaveDeferentObj, isZeroToFixed, randomIdGenerator } from '../../../../utility/Utils';
import { bindPiBasicInfo, bindSelectedProcurementItems } from '../store/actions';

const PiSelectedItem = () => {
    const dispatch = useDispatch();
    const { selectedProcurementItems, piBasicInfo } = useSelector( ( { pis } ) => pis );
    const [filterObj, setFilterObj] = useState( {
        budgetNumber: '',
        supplierOrderNumber: '',
        styleNumber: '',
        itemCategory: '',
        itemSubCategory: '',
        itemCode: '',
        itemName: '',
        uom: '',
        orderQty: '',
        quantityRemaining: '',
        quantity: '',
        orderRate: '',
        amount: ''
    } );

    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        console.log( name );

        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : value
        } );
    };


    const handleInputOnChange = ( e, row ) => {
        const { type, value, name } = e.target;
        const isName = name === 'quantity';

        if ( value !== '.' ) {

            if ( row.orderQty < Number( value ) ) {
                //
                notify( 'warning', 'IPI Quantity greater then Order Quantity!!!' );

            } else {
                const updatedData = selectedProcurementItems.map( order => {
                    if ( row.rowId === order.rowId ) {
                        order[name] = isName ? Number( value ) : value;
                    }
                    return order;
                } );
                // setBudgetFabricDetails( updatedData );
                dispatch( bindSelectedProcurementItems( updatedData ) );
            }
        }

    };
    /// ORder , Style, Budget, Item SubGroup Multiple Check
    const handleDuplicateObjCheck = ( selectRows ) => {
        console.log( 'hello' );
        // const budgetIdExitingItem = selectRows.filter( item => item.budgetId.length );
        const styleIdExitingItem = selectRows.filter( item => item.styleId?.length );
        const orderIdExitingItem = selectRows.filter( item => item.supplierOrderId?.length );
        const updatedObj = {
            ...piBasicInfo,
            // budgetNo: budgetIdExitingItem.length ? ( isHaveDeferentObj( 'budgetId', budgetIdExitingItem ) ? 'Multiple' : budgetIdExitingItem[0]?.budgetNumber ) : '',
            styleNo: styleIdExitingItem.length ? ( isHaveDeferentObj( 'styleId', styleIdExitingItem ) ? 'Multiple' : styleIdExitingItem[0]?.styleNumber ) : '',
            supplierPO: orderIdExitingItem.length ? ( isHaveDeferentObj( 'supplierOrderId', orderIdExitingItem ) ? 'Multiple' : orderIdExitingItem[0]?.supplierOrderNumber ) : ''
            // subGroup: selectRows.length ? ( isHaveDeferentObj( 'itemSubGroupId', selectRows ) ? 'Multiple' : selectRows[0]?.itemSubGroup ) : ''
        };
        dispatch( bindPiBasicInfo( updatedObj ) );
    };

    useEffect( () => {
        handleDuplicateObjCheck( selectedProcurementItems );
    }, [selectedProcurementItems.length] );

    const randersData = () => {
        let filtered = [];
        if ( filterObj.supplierOrderNumber.length
            || filterObj.styleNumber.length
            || filterObj.itemCategory.length
            || filterObj.itemSubCategory.length
            || filterObj.itemCode.length
            || filterObj.itemName.length
            || filterObj.uom.length
            || filterObj.orderQty.length
            || filterObj.quantityRemaining.length
            || filterObj.quantity.length
            || filterObj.orderRate.length
            || filterObj.amount.length
        ) {
            filtered = selectedProcurementItems?.filter(
                wh => wh.supplierOrderNumber?.toLowerCase().includes( filterObj.supplierOrderNumber?.toLowerCase() ) &&
                    wh.styleNumber?.toLowerCase().includes( filterObj.styleNumber?.toLowerCase() ) &&
                    wh.itemCategory?.toLowerCase().includes( filterObj.itemCategory?.toLowerCase() ) &&
                    wh.itemSubCategory?.toLowerCase().includes( filterObj.itemSubCategory?.toLowerCase() ) &&
                    wh.itemCode?.toLowerCase().includes( filterObj.itemCode?.toLowerCase() ) &&
                    wh.itemName?.toLowerCase().includes( filterObj.itemName?.toLowerCase() ) &&
                    wh.uom?.toLowerCase().includes( filterObj.uom?.toLowerCase() ) &&
                    isZeroToFixed( wh.orderQty, 4 ).includes( filterObj.orderQty ) &&
                    isZeroToFixed( wh.quantityRemaining, 4 ).includes( filterObj.quantityRemaining ) &&
                    isZeroToFixed( wh.quantity, 4 ).includes( filterObj.quantity ) &&
                    isZeroToFixed( wh.orderRate, 4 ).includes( filterObj.orderRate ) &&
                    isZeroToFixed( wh.orderRate * wh.quantity, 4 ).includes( filterObj.amount )
            );
        } else {
            filtered = selectedProcurementItems;
        }
        return filtered;
    };


    const [allRowSelected, setAllRowSelected] = useState( false );

    const handleAllRowSelect = ( e ) => {
        const { checked } = e.target;
        console.log( checked );
        setAllRowSelected( checked );
        const updatedSelectedItems = selectedProcurementItems.map( ( item => ( { ...item, selected: checked } ) ) );
        dispatch( bindSelectedProcurementItems( updatedSelectedItems ) );

    };

    const handleSelectSingleRow = ( e, rowId ) => {
        const { checked } = e.target;


        const updatedSelectedItems = selectedProcurementItems.map( item => {
            if ( item.rowId === rowId ) {
                item['selected'] = checked;
            }
            return item;
        } );
        dispatch( bindSelectedProcurementItems( updatedSelectedItems ) );

        const isAllRowSelected = selectedProcurementItems.some( so => !so.selected === true );
        setAllRowSelected( !isAllRowSelected );
    };

    const handleClearRowSelected = () => {
        const updatedSelectedItems = selectedProcurementItems.map( ( item => ( { ...item, selected: false } ) ) );
        dispatch( bindSelectedProcurementItems( updatedSelectedItems ) );
        setAllRowSelected( false );

    };

    const handleRemoveItem = ( rowId ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {

                const updatedObj = {
                    ...piBasicInfo,
                    isDeleteItemExiting: true
                };

                dispatch( bindPiBasicInfo( updatedObj ) );


                const updatedData = selectedProcurementItems.filter( order => order.rowId !== rowId );
                dispatch( bindSelectedProcurementItems( updatedData ) );


            }
        } );

    };

    const handleMultipleDelete = () => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                const updatedObj = {
                    ...piBasicInfo,
                    isDeleteItemExiting: true
                };
                dispatch( bindPiBasicInfo( updatedObj ) );

                const updatedData = selectedProcurementItems.filter( order => !order.selected );
                dispatch( bindSelectedProcurementItems( updatedData ) );
                setAllRowSelected( false );

            }
        } );
    };

    const filterArray = [
        {
            id: 'SL',
            name: '',
            width: '50px'

        },
        {
            id: 'action',
            name: '',
            width: '60px'


        },

        {
            id: "supplierOrderNumber",
            name: <Input
                id="requisitionNumberId"
                name="supplierOrderNumber"
                type="text"
                bsSize="sm"
                value={filterObj.supplierOrderNumber}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '100px'

        },
        {
            id: "styleNumber",
            name: <Input
                id="styleNumberId"
                name="styleNumber"
                type="text"
                bsSize="sm"
                value={filterObj.styleNumber}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '100px'

        },
        {
            name: <Input
                id="itemCategoryId"
                name="itemCategory"
                type="text"
                bsSize="sm"
                value={filterObj.itemCategory}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '150px',
            id: 'itemCategory'


        },
        {
            id: 'sfsfsf',
            name: <Input
                id="itemSubCategoryId"
                name="itemSubCategory"
                type="text"
                bsSize="sm"
                value={filterObj.itemSubCategory}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '160px'

        },
        {
            id: 'itemName',
            name: <Input
                id="itemNameId"
                name="itemName"
                type="text"
                bsSize="sm"
                value={filterObj.itemName}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '350px'


        },
        {
            id: 'itemCode',
            name: <Input
                id="itemCodeId"
                name="itemCode"
                type="text"
                bsSize="sm"
                value={filterObj.itemCode}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '150px'


        },


        {
            id: 'uom',
            name: <Input
                id="uomId"
                name="uom"
                type="text"
                bsSize="sm"
                value={filterObj.uom}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '100px'

        },
        {
            id: 'orderQty',
            name: <Input
                id="orderQtyId"
                name="orderQty"
                type="text"
                bsSize="sm"
                value={filterObj.orderQty}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '130px'

        },
        {
            id: 'quantityRemaining',
            name: <Input
                id="quantityRemainingId"
                name="quantityRemaining"
                type="text"
                bsSize="sm"
                value={filterObj.quantityRemaining}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '130px'

        },
        {
            id: 'quantity',
            name: <Input
                id="quantityId"
                name="quantity"
                type="text"
                bsSize="sm"
                value={filterObj.quantity}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '130px'

        },
        {
            id: 'orderRate',
            name: <Input
                id="orderRateId"
                name="orderRate"
                type="text"
                bsSize="sm"
                value={filterObj.orderRate}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '100px'
        },

        {
            id: 'amount',
            name: <Input
                id="amountId"
                name="amount"
                type="text"
                bsSize="sm"
                value={filterObj.amount}
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '100px'
        }
    ];

    console.log( randersData() );

    const hiddenOrDisplayCondition = selectedProcurementItems.some( item => item.selected );
    const selectItems = selectedProcurementItems.filter( item => item.selected ).length;
    return (
        <div>
            <TableFilterInsideRow rowId="pi-item-selected-id" tableId="pi-item-selected-custom-dt" filterArray={filterArray} />

            <Row hidden={!hiddenOrDisplayCondition}>
                <Col>
                    <div className='d-flex justify-content-between bg-light-primary align-items-center' style={{ padding: '0.5rem' }}>
                        <Label className="font-weight-bolder"> {selectItems} Item are selected! </Label>
                        <div>

                            <Button.Ripple
                                id="clearAllFabId"
                                tag={Label}
                                outline
                                onClick={() => { handleClearRowSelected(); }}
                                className='btn-icon p-0 mb-0 mr-1'
                                color='flat-success'
                            >
                                <XSquare
                                    size={18}
                                    id="clearAllFabId"
                                    color="green"
                                />
                            </Button.Ripple>
                            <Button.Ripple
                                id="addFabId"
                                tag={Label}
                                onClick={() => { handleMultipleDelete(); }}
                                className='btn-icon p-0 mb-0'
                                color='flat-success'
                            >
                                <Trash2 size={18} id="addFabId" color="red" />
                            </Button.Ripple>
                        </div>

                    </div>
                </Col>
            </Row>
            <DataTable
                // subHeader
                // subHeaderComponent={}
                pagination
                noHeader
                responsive
                // data={randersData()}
                data={_.orderBy( randersData(), ['itemCategoryId', 'itemSubCategoryId'] )}
                className='react-custom-dataTable-other pi-item-selected-custom-dt'
                persistTableHead
                dense
                paginationTotalRows={randersData.length}
                columns={[
                    {

                        id: randomIdGenerator(),
                        name: <CustomInput
                            type='checkbox'
                            className='custom-control-Primary p-0 '
                            id="isSelectedIdPI"
                            name='isSelectedAll'
                            htmlFor="isSelectedIdPI"
                            checked={allRowSelected}
                            inline
                            onChange={( e ) => handleAllRowSelect( e )}
                        />,
                        width: '50px',
                        selector: row => row.isSelected,
                        center: true,
                        //   sortable: true,
                        cell: ( row ) => (
                            <CustomInput
                                type='checkbox'
                                className='custom-control-Primary p-0'
                                id={row.rowId.toString()}
                                name='selected'
                                htmlFor={row.rowId.toString()}
                                checked={row.selected}
                                inline
                                onChange={( e ) => handleSelectSingleRow( e, row.rowId )}
                            />
                        )

                    },
                    {
                        id: 'action',
                        name: 'Action',
                        width: '60px',
                        center: true,
                        reorder: true,
                        cell: row => (
                            <Button.Ripple
                                id="deleteFabId"
                                tag={Label}
                                onClick={() => { handleRemoveItem( row.rowId, row.supplierOrderId ); }}
                                className='btn-icon p-0'
                                color='flat-danger'
                            >
                                <MinusSquare
                                    size={18}
                                    id="deleteFabId"
                                    color="red"
                                />
                            </Button.Ripple>

                        )

                    },

                    {
                        id: "supplierOrderNumber",
                        name: 'IPO No',
                        minWidth: '100px',
                        selector: row => row.supplierOrderNumber,
                        center: true,
                        cell: row => row.supplierOrderNumber,
                        reorder: true
                    },
                    {
                        id: "styleNumber",
                        name: 'Style No',
                        minWidth: '100px',
                        selector: row => row.styleNumber,
                        center: true,
                        cell: row => row.styleNumber,
                        reorder: true
                    },
                    {
                        name: 'Item Category',
                        minWidth: '150px',
                        selector: 'itemCategory',
                        sortable: true,
                        center: true,
                        cell: row => row.itemCategory,
                        reorder: true

                    },
                    {
                        name: 'Item Sub-Category',
                        minWidth: '160px',
                        selector: '#',
                        sortable: true,
                        center: true,
                        cell: row => row.itemSubCategory,
                        reorder: true

                    },
                    {
                        id: row => row.itemName,
                        allowOverflow: true,
                        name: 'Item Description',
                        center: false,
                        minWidth: '350px',
                        selector: row => row.itemName,
                        cell: row => row.itemName,
                        reorder: true

                    },
                    {
                        id: row => row.itemCode,
                        name: 'Item Code',
                        minWidth: '150px',
                        center: true,
                        selector: row => row.itemCode,
                        cell: row => row.itemCode,
                        reorder: true
                    },
                    {
                        id: row => row.uom,
                        name: 'UOM',
                        minWidth: '100px',
                        center: true,
                        selector: row => row.uom,
                        cell: row => row.uom,
                        reorder: true
                    },
                    {
                        id: 'orderQty',
                        name: 'IPO Qty',
                        minWidth: '130px',
                        center: true,
                        allowOverflow: true,
                        selector: row => row.orderQty,
                        cell: row => isZeroToFixed( row.orderQty, 4 ),
                        reorder: true
                    },
                    {
                        id: 'quantityRemaining',
                        name: 'Balance Qty',
                        minWidth: '130px',
                        center: true,
                        allowOverflow: true,
                        selector: row => row.quantityRemaining,
                        cell: row => isZeroToFixed( row.quantityRemaining, 4 ),
                        reorder: true
                    },
                    {
                        id: 'quantity',
                        name: 'IPI Qty',
                        minWidth: '130px',
                        center: true,
                        allowOverflow: true,
                        selector: row => row.quantity,
                        reorder: true,
                        cell: row => (
                            // <Input
                            //     type="number"
                            //     className="text-right"
                            //     name="quantity"
                            //     invalid={row.isFieldError && row.quantity === 0}
                            //     bsSize="sm"
                            //     value={row.quantity}
                            //     onChange={( e ) => { handleInputOnChange( e, row ); }}
                            //     onFocus={( e ) => e.target.select()}
                            // />
                            <NumberFormat
                                //  className={`form-control-sm form-control text-right` row.isFieldError && row.quantity === 0}
                                className={classNames( `form-control-sm form-control text-right ${( ( row.isFieldError && row.quantity === 0 ) ) && 'border-danger'}` )}
                                displayType="input"
                                value={row.quantity}
                                name="quantity"
                                decimalScale={4}
                                allowNegative={false}
                                fixedDecimalScale={row.quantity !== 0}
                                allowLeadingZeros={false}
                                onFocus={e => {
                                    e.target.select();
                                }}
                                onBlur={( e ) => { handleInputOnChange( e, row ); }}
                                onChange={( e ) => { handleInputOnChange( e, row ); }}
                            />
                        )
                    },
                    {
                        id: 'orderRate',
                        name: 'Rate',
                        minWidth: '100px',
                        center: true,
                        selector: row => row.orderRate,
                        cell: row => isZeroToFixed( row.orderRate, 4 ),
                        reorder: true

                        // (
                        //     <Input
                        //         type="number"
                        //         className="text-right"
                        //         name="orderRate"
                        //         bsSize="sm"
                        //         value={row.orderRate}
                        //         onChange={( e ) => { handleInputOnChange( e, row.fieldId ); }}
                        //         onFocus={( e ) => e.target.select()}
                        //     />
                        // )
                    },

                    {
                        id: row => row.amount,
                        name: 'Amount',
                        minWidth: '100px',
                        selector: row => row.amount,
                        center: true,
                        reorder: true,
                        cell: row => isZeroToFixed( row.orderRate * row.quantity, 4 )
                    }


                ]}
            />
        </div>
    );
};

export default PiSelectedItem;
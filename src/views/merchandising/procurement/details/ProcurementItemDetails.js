import _ from 'lodash';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Trash2, XSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Label, Row } from 'reactstrap';
import Input from 'reactstrap/lib/Input';
import { baseAxios } from '../../../../services';
import { inventoryApi } from '../../../../services/api-end-points/inventory';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import TableFilterInsideRow from '../../../../utility/custom/TableFilterInsideRow';
import { confirmObj } from '../../../../utility/enums';
import { isHaveDeferentObj, isZeroToFixed } from '../../../../utility/Utils';
import { bindProcurementBasicInfo, bindSelectedItemsForProcurement, itemDetailsWithMinOrder } from '../store/actions';
const ProcurementItemDetails = () => {
    const dispatch = useDispatch();
    const { dropDownItemGroups } = useSelector( ( { itemGroups } ) => itemGroups );

    const { selectedProcurementSelectedItems, procurementBasicInfo, itemDetailsWithMinOder } = useSelector( ( { procurements } ) => procurements );

    const [filterObj, setFilterObj] = useState( {
        budgetNumber: '',
        styleNumber: '',
        orderNumber: '',
        itemGroup: '',
        itemSubGroup: '',
        itemName: '',
        itemNumber: '',
        orderUom: '',
        bomQuantity: '',
        bomRatePerUnit: '',
        totalOrderQuantity: '',
        balanceToRaised: '',
        orderQuantity: '',
        orderRate: '',
        amount: '',
        remarks: ''
    } );


    const handleInputOnChange = ( e, row ) => {
        const { type, value, name } = e.target;

        const isName = name === 'orderQuantity' || name === "orderRate";

        if ( value !== '.' ) {
            const updatedData = selectedProcurementSelectedItems.map( order => {
                if ( row.rowId === order.rowId ) {
                    if ( name === "orderQuantity" ) {
                        order[name] = isName ? Number( value ) : value;
                        // order['minCountableOrderQuantity'] = order.bomUomRelativeFactor === order.orderUomRelativeFactor ? Number( value ) : Math.round( ( order.orderUomRelativeFactor / order.bomUomRelativeFactor ) * Number( value ) );
                        order['minCountableOrderQuantity'] = order.bomUomRelativeFactor === order.orderUomRelativeFactor ? Number( value ) : ( order.orderUomRelativeFactor / order.bomUomRelativeFactor ) * Number( value );

                    } else {
                        order[name] = isName ? Number( value ) : value;
                        order['baseOrderRate'] = name === "orderRate" ? Number( value ) / order.orderUomRelativeFactor : order.baseOrderRate;
                    }
                }
                return order;
            } );
            dispatch( bindSelectedItemsForProcurement( updatedData ) );
            console.log( updatedData );
            dispatch( itemDetailsWithMinOrder( updatedData ) );
        }

    };
    const handleControlDropdownChange = ( order, e, row ) => {
        const { action, name, option } = e;
        if ( name === 'orderUom' ) {
            const updatedData = selectedProcurementSelectedItems.map( ig => {
                if ( row.rowId === ig.rowId ) {

                    const modifiedOrderQty = ( ig.orderUomRelativeFactor / order.relativeFactor ) * ig.orderQuantity;

                    const modifiedMinCountableOrderQty = ( order.relativeFactor / ig.bomUomRelativeFactor ) * modifiedOrderQty;

                    const modifiedBomQty = ( ig.orderUomRelativeFactor / order.relativeFactor ) * ig.bomQuantity;

                    const modifiedTotalRequisitionQty = ( ig.orderUomRelativeFactor / order.relativeFactor ) * ig.totalOrderQuantity;

                    const modifiedBalanceToRaised = ( ig.orderUomRelativeFactor / order.relativeFactor ) * ig.balanceToRaised;

                    console.log( modifiedBalanceToRaised.toFixed( 4 ) );

                    ig[name] = order;
                    ig['minCountableOrderQuantity'] = modifiedMinCountableOrderQty;
                    ig['orderQuantity'] = modifiedOrderQty;
                    ig['bomQuantity'] = modifiedBomQty;
                    ig['balanceToRaised'] = modifiedBalanceToRaised;
                    ig['totalOrderQuantity'] = modifiedTotalRequisitionQty;
                    ig['orderUomRelativeFactor'] = order.relativeFactor;

                    ig['orderRate'] = ig.baseOrderRate * order.relativeFactor;
                    ig['bomRatePerUnit'] = ig.baseBomRate * order.relativeFactor;

                }
                return ig;
            } );
            dispatch( bindSelectedItemsForProcurement( updatedData ) );
            dispatch( itemDetailsWithMinOrder( updatedData ) );

        }
    };
    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : value
        } );
    };
    const handleOrderUomDropdownOnFocus = ( defaultUomSetId, uoms, rowId ) => {
        if ( !uoms.length && defaultUomSetId ) {
            baseAxios.get( `${inventoryApi.unitSet.root}/${defaultUomSetId}` )
                .then( response => {
                    const orderUomArray = response?.data?.details?.map( uom => ( {
                        value: uom.id,
                        label: uom.unitName,
                        relativeFactor: uom.relativeFactor
                    } ) );
                    const updatedData = selectedProcurementSelectedItems.map( i => {
                        if ( rowId === i.rowId ) {
                            i.uoms = orderUomArray;
                        }
                        return i;
                    } );
                    dispatch( bindSelectedItemsForProcurement( updatedData ) );
                } );
        }
    };
    const randersData = () => {
        let filtered = [];
        if ( filterObj.budgetNumber.length
            || filterObj.styleNumber.length
            || filterObj.orderNumber.length
            || filterObj.itemGroup.length
            || filterObj.itemSubGroup.length
            || filterObj.itemName.length
            || filterObj.itemNumber.length
            || filterObj.orderUom.length
            || filterObj.bomQuantity.length
            || filterObj.bomRatePerUnit.length
            || filterObj.totalOrderQuantity.length
            || filterObj.balanceToRaised.length
            || filterObj.orderQuantity.length
            || filterObj.orderRate.length
            || filterObj.amount.length
            || filterObj.remarks.length
        ) {
            filtered = selectedProcurementSelectedItems.filter(
                wh => wh.budgetNumber?.toLowerCase().includes( filterObj.budgetNumber?.toLowerCase() ) &&
                    wh.styleNumber?.toLowerCase().includes( filterObj.styleNumber?.toLowerCase() ) &&
                    wh.orderNumber?.toLowerCase().includes( filterObj.orderNumber?.toLowerCase() ) &&
                    wh.itemGroup?.toLowerCase().includes( filterObj.itemGroup?.toLowerCase() ) &&
                    wh.itemSubGroup?.toLowerCase().includes( filterObj.itemSubGroup?.toLowerCase() ) &&
                    wh.itemName?.toLowerCase().includes( filterObj.itemName?.toLowerCase() ) &&
                    wh.itemNumber?.toLowerCase().includes( filterObj.itemNumber?.toLowerCase() ) &&
                    wh.orderUom?.label?.toLowerCase().includes( filterObj.orderUom?.toLowerCase() ) &&
                    wh.remarks?.toLowerCase().includes( filterObj.remarks?.toLowerCase() ) &&
                    isZeroToFixed( wh.bomQuantity, 4 ).includes( filterObj.bomQuantity ) &&
                    isZeroToFixed( wh.bomRatePerUnit, 4 ).includes( filterObj.bomRatePerUnit ) &&
                    isZeroToFixed( wh.totalOrderQuantity, 4 ).includes( filterObj.totalOrderQuantity ) &&
                    isZeroToFixed( wh.balanceToRaised, 4 ).includes( filterObj.balanceToRaised ) &&
                    isZeroToFixed( wh.orderQuantity, 4 ).includes( filterObj.orderQuantity ) &&
                    isZeroToFixed( wh.orderRate, 4 ).includes( filterObj.orderRate ) &&
                    isZeroToFixed( wh.orderRate * wh.orderQuantity, 4 ).includes( filterObj.amount )
                //   wh.orderQuantity.toString().toLocaleLowerCase().includes( filterObj.orderQuantity.toString().toLocaleLowerCase() )
            );
        } else {
            filtered = selectedProcurementSelectedItems;
        }
        return filtered;
    };


    /// ORder , Style, Budget, Item SubGroup Multiple Check
    const handleDuplicateObjCheck = ( selectRows ) => {
        const budgetIdExitingItem = selectRows.filter( item => item.budgetId.length );
        const styleIdExitingItem = selectRows.filter( item => item.styleId.length );
        const orderIdExitingItem = selectRows.filter( item => item.orderId.length );
        const updatedObj = {
            ...procurementBasicInfo,
            budgetNo: budgetIdExitingItem.length ? ( isHaveDeferentObj( 'budgetId', budgetIdExitingItem ) ? 'Multiple' : budgetIdExitingItem[0]?.budgetNumber ) : '',
            styleNo: styleIdExitingItem.length ? ( isHaveDeferentObj( 'styleId', styleIdExitingItem ) ? 'Multiple' : styleIdExitingItem[0]?.styleNumber ) : '',
            exportedPONo: orderIdExitingItem.length ? ( isHaveDeferentObj( 'orderId', orderIdExitingItem ) ? 'Multiple' : orderIdExitingItem[0]?.orderNumber ) : '',
            subGroup: selectRows.length ? ( isHaveDeferentObj( 'itemSubGroupId', selectRows ) ? 'Multiple' : selectRows[0]?.itemSubGroup ) : ''
        };
        dispatch( bindProcurementBasicInfo( updatedObj ) );
    };

    useEffect( () => {
        handleDuplicateObjCheck( selectedProcurementSelectedItems );
    }, [selectedProcurementSelectedItems.length] );

    //if Min Qty Item Add , the item's uom never be change
    const handleItemExitingWithMinQtyValue = ( item ) => {
        const itemDetailsWithMinQty = selectedProcurementSelectedItems.filter( selectedItem => !selectedItem.budgetId.length );
        const isExit = itemDetailsWithMinQty.some( minItem => minItem.itemId === item.itemId );
        return isExit;
    };


    const [allRowSelected, setAllRowSelected] = useState( false );

    const handleAllRowSelect = ( e ) => {
        const { checked } = e.target;
        setAllRowSelected( checked );
        const updatedSelectedItems = selectedProcurementSelectedItems.map( ( item => ( { ...item, selected: checked } ) ) );
        dispatch( bindSelectedItemsForProcurement( updatedSelectedItems ) );

    };

    const handleSelectSingleRow = ( e, rowId ) => {
        const { checked } = e.target;


        const updatedSelectedItems = selectedProcurementSelectedItems.map( item => {
            if ( item.rowId === rowId ) {
                item['selected'] = checked;
            }
            return item;
        } );
        dispatch( bindSelectedItemsForProcurement( updatedSelectedItems ) );

        const isAllRowSelected = selectedProcurementSelectedItems.some( so => !so.selected === true );
        setAllRowSelected( !isAllRowSelected );
    };

    const handleClearRowSelected = () => {
        const updatedSelectedItems = selectedProcurementSelectedItems.map( ( item => ( { ...item, selected: false } ) ) );
        dispatch( bindSelectedItemsForProcurement( updatedSelectedItems ) );
        setAllRowSelected( false );

    };


    const handleRemoveItem = ( row ) => {

        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {

                const updatedObj = {
                    ...procurementBasicInfo,
                    isDeleteItemExiting: true
                };
                dispatch( bindProcurementBasicInfo( updatedObj ) );

                const updatedData = selectedProcurementSelectedItems.filter( order => order.rowId !== row.rowId );

                if ( handleItemExitingWithMinQtyValue( row ) && row.budgetId?.length ) {
                    const updatedDataWithoutMinOrder = updatedData.filter( order => order.itemId !== row.itemId );
                    dispatch( itemDetailsWithMinOrder( updatedDataWithoutMinOrder ) );
                    dispatch( bindSelectedItemsForProcurement( updatedDataWithoutMinOrder ) );

                } else {
                    dispatch( bindSelectedItemsForProcurement( updatedData ) );
                    dispatch( itemDetailsWithMinOrder( updatedData ) );
                }

                //isDeleteItemExiting


                ///MinOrder Data Update
                // const isExistingData = itemDetailsWithMinOder.some( i => row.itemSubGroupId === i.itemSubGroupId && row.itemGroupId === i.itemGroupId && row.itemId === i.itemId );
                // if ( isExistingData ) {
                //     const updatedData = itemDetailsWithMinOder.map( item => {
                //         if ( row.itemSubGroupId === item.itemSubGroupId && row.itemGroupId === item.itemGroupId && row.itemId === item.itemId ) {
                //             item['minOrderQty'] = item.minOrderQty - row.orderQuantity;
                //         }
                //         return item;
                //     } );
                //     dispatch( bindItemDetailsWithMinOrder( updatedData ) );
                // }
            }
        } );

    };

    const handleMultipleDelete = () => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                const updatedObj = {
                    ...procurementBasicInfo,
                    isDeleteItemExiting: true
                };
                dispatch( bindProcurementBasicInfo( updatedObj ) );

                const updatedData = selectedProcurementSelectedItems.filter( order => !order.selected );
                const selectedItem = selectedProcurementSelectedItems.filter( order => order.selected );
                const isItemWithMinQty = selectedItem.some( item => item.budgetId.length );
                if ( !isItemWithMinQty ) {
                    dispatch( bindSelectedItemsForProcurement( updatedData ) );

                    dispatch( itemDetailsWithMinOrder( updatedData ) );
                } else {
                    const updatedWithItemId = selectedProcurementSelectedItems.filter( item => !selectedItem.some( sItem => sItem.itemId === item.itemId ) );
                    dispatch( bindSelectedItemsForProcurement( updatedWithItemId ) );
                    dispatch( itemDetailsWithMinOrder( updatedWithItemId ) );
                }

                setAllRowSelected( false );
            }


        } );

    };

    const hiddenOrDisplayCondition = selectedProcurementSelectedItems.some( item => item.selected );
    const selectItems = selectedProcurementSelectedItems.filter( item => item.selected ).length;

    const filterArray = [

        {
            id: "budgetNumber",
            name: <Input
                id="budgetNumberId"
                name="budgetNumber"
                value={filterObj.budgetNumber}
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"

            />,
            width: '120px'
        },
        {
            id: "styleNumber",
            name: <Input
                id="styleNumberId"
                name="styleNumber"
                value={filterObj.styleNumber}

                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"

            />,
            width: '120px'
        },
        {
            id: "orderNumber",
            name: <Input
                id="orderNumberId"
                name="orderNumber"
                value={filterObj.orderNumber}
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
                placeholder=""
            />,
            minWidth: '130px'

        },
        {
            id: "itemGroup",
            name: <Input
                id="itemGroupId"
                name="itemGroup"
                value={filterObj.itemGroup}
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
                placeholder=""
            />,
            minWidth: '150px'
        },
        {
            id: "itemSubGroup",
            name: <Input
                id="itemSubGroupId"
                name="itemSubGroup"
                value={filterObj.itemSubGroup}
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
                placeholder=""
            />,
            minWidth: '180px'

        },
        {
            id: "itemName",
            allowOverflow: true,
            name: <Input
                id="itemDescriptionId"
                name="itemName"
                value={filterObj.itemName}
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
                placeholder=""
            />,

            minWidth: '500px'
        },
        {
            id: "itemNumber",
            name: <Input
                id="itemNumberId"
                name="itemNumber"
                value={filterObj.itemNumber}

                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
                placeholder=""
            />,
            minWidth: '150px'

        },
        {
            id: 'orderUOM',
            name: <Input
                id="orderUomId"
                name="orderUom"
                value={filterObj.orderUom}

                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
                placeholder=""
            />,
            minWidth: '110px'

        },
        {
            id: "bomQuantity",
            name: <Input
                id="bomQuantityId"
                name="bomQuantity"
                value={filterObj.bomQuantity}

                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
                placeholder=""
            />,
            minWidth: '100px'

        },
        {
            id: "bomRatePerUnit",
            name: <Input
                id="bomRatePerUnitId"
                name="bomRatePerUnit"
                value={filterObj.bomRatePerUnit}

                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
                placeholder=""
            />,
            minWidth: '100px'

        },
        {
            id: "poRaised",
            name: <Input
                id="totalOrderQuantityId"
                name="totalOrderQuantity"
                value={filterObj.totalOrderQuantity}

                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
            />,
            minWidth: '100px'

        },
        {
            id: "balanceToRaised",
            name: <Input
                id="balanceToRaisedId"
                name="balanceToRaised"
                value={filterObj.balanceToRaised}

                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
            />,
            minWidth: '150px'

        },
        {
            id: 'orderQuantity',
            name: <Input
                id="orderQuantityId"
                name="orderQuantity"
                value={filterObj.orderQuantity}

                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
            />,
            minWidth: '130px'

        },

        {
            id: 'orderRate',
            name: <Input
                id="orderRateId"
                name="orderRate"
                value={filterObj.orderRate}

                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
            />,
            minWidth: '100px'


        },

        {
            id: "amount",
            name: <Input
                id="amountId"
                name="amount"
                value={filterObj.amount}

                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
            />,
            minWidth: '100px'

        },
        {
            id: 'remarksId',
            name: <Input
                id="remarksId"
                name="remarks"
                value={filterObj.remarks}

                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
            />,
            minWidth: '100px'

        }

    ];
    return (
        <>
            <div>
                <TableFilterInsideRow
                    rowId="itemProDetailsId"
                    tableId="pro-item-details-custom-dt"
                    filterArray={filterArray}
                />
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
                <Row>
                    <Col>
                        <DataTable
                            pagination
                            noHeader
                            responsive
                            data={_.orderBy( randersData(), ['itemGroupId', 'itemSubGroupId'] )}
                            className='react-custom-dataTable-other pro-item-details-custom-dt'
                            persistTableHead
                            dense
                            paginationTotalRows={randersData().length}
                            columns={[


                                {
                                    id: "budgetNumber",
                                    reorder: true,
                                    name: 'Budget No',
                                    width: '120px',
                                    selector: row => row.budgetNumber,
                                    center: true,
                                    cell: row => row.budgetNumber
                                },
                                {
                                    id: "styleNumber",
                                    name: 'Style No',
                                    reorder: true,
                                    width: '120px',
                                    selector: row => row.styleNumber,
                                    center: true,
                                    cell: row => row.styleNumber
                                },
                                {
                                    id: "orderNumber",
                                    name: 'PO No',
                                    width: '130px',
                                    selector: row => row.orderNumber,
                                    center: true,
                                    cell: row => row.orderNumber
                                },
                                {
                                    id: "itemGroup",
                                    name: 'Item Group',
                                    width: '150px',
                                    selector: row => row.itemGroup,
                                    center: true,
                                    cell: row => row.itemGroup
                                },
                                {
                                    id: "itemSubGroup",
                                    name: 'Item Sub Group',
                                    width: '180px',
                                    selector: row => row.itemSubGroup,
                                    cell: row => row.itemSubGroup
                                },
                                {
                                    id: "itemName",
                                    allowOverflow: true,
                                    name: 'Item Description',

                                    minWidth: '500px',
                                    selector: row => row.itemName,
                                    cell: row => row.itemName
                                },
                                {
                                    id: "itemNumber",
                                    name: 'Item Code',
                                    minWidth: '150px',
                                    center: true,
                                    selector: row => row.itemNumber,
                                    cell: row => row.itemNumber
                                },
                                {
                                    id: 'orderUOM',
                                    name: 'UOM',
                                    minWidth: '110px',
                                    center: true,
                                    cell: row => row.orderUom?.label
                                },
                                {
                                    id: "bomQuantity",
                                    name: 'BOM Qty',
                                    minWidth: '100px',
                                    center: true,
                                    selector: row => row.bomQuantity,
                                    cell: row => isZeroToFixed( row.bomQuantity, 4 )
                                },
                                {
                                    id: "bomRatePerUnit",
                                    name: 'BOM Rate',
                                    minWidth: '100px',
                                    center: true,
                                    selector: row => row.bomRatePerUnit,
                                    cell: row => isZeroToFixed( row.bomRatePerUnit, 4 )
                                },
                                {
                                    id: "totalOrderQuantity",
                                    name: 'PO Raised',
                                    minWidth: '100px',
                                    center: true,
                                    selector: "totalOrderQuantity",
                                    cell: row => isZeroToFixed( row.totalOrderQuantity, 4 )
                                },
                                {
                                    id: "balanceToRaised",
                                    name: 'Balanced to Raised',
                                    minWidth: '150px',
                                    center: true,
                                    selector: "balanceToRaised",
                                    cell: row => isZeroToFixed( row.balanceToRaised, 4 )
                                },
                                {
                                    id: 'orderQuantity',
                                    name: 'Order Qty',
                                    minWidth: '130px',
                                    center: true,
                                    allowOverflow: true,
                                    selector: row => row.orderQuantity,
                                    cell: row => isZeroToFixed( row.orderQuantity, 4 )
                                },

                                {
                                    id: 'orderRate',
                                    name: 'Order Rate',
                                    minWidth: '100px',
                                    center: true,
                                    selector: row => row.orderRate,
                                    cell: row => isZeroToFixed( row.orderRate, 4 )
                                },

                                {
                                    id: row => row.amount,
                                    name: 'Amount',
                                    minWidth: '100px',
                                    selector: row => row.amount,
                                    center: true,
                                    cell: row => isZeroToFixed( row.orderRate * row.orderQuantity, 4 )
                                },
                                {
                                    id: 'remarksId',
                                    allowOverflow: true,
                                    name: 'Remarks',
                                    center: true,
                                    minWidth: '100px',
                                    selector: row => row.remarks,
                                    cell: row => row.remarks
                                }

                            ]}
                        />
                    </Col>
                </Row>


            </div>
        </>
    );
};

export default ProcurementItemDetails;

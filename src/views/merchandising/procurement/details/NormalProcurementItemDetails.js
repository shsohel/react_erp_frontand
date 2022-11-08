import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { PlusSquare, Trash2, XSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
// import CreatableSelect from 'react-select/creatable';
import { Button, Col, Label, Row } from 'reactstrap';
import Input from 'reactstrap/lib/Input';
import { baseAxios } from '../../../../services';
import { inventoryApi } from '../../../../services/api-end-points/inventory';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { notify } from '../../../../utility/custom/notifications';
import TableFilterInsideRow from '../../../../utility/custom/TableFilterInsideRow';
import { confirmObj } from '../../../../utility/enums';
import { isHaveDeferentObj, isZeroToFixed, randomIdGenerator } from '../../../../utility/Utils';
import { getDropDownItemGroupsByGroupName } from '../../../inventory/item-group/store/actions';
import { getDropDownItems } from '../../../inventory/item/store/actions';
import { getBuyersStyles } from '../../buyer/store/actions';
import { bindProcurementBasicInfo, bindProcurementItems } from '../store/actions';
const items = {
    style: null,
    styleId: '',
    styleNumber: '',
    itemGroup: null,
    itemGroupName: '',
    itemSubGroup: null,
    itemSubGroupName: '',
    itemSubGroups: [],
    item: null,
    itemId: "",
    itemName: "", ///Description
    itemCode: "", ///Code
    items: [],
    uom: '',
    ratePerUnit: 0,
    orderUom: null,
    orderUoms: [],
    orderQuantity: 0,
    orderRate: 0,
    orderUomRelativeFactor: 0,
    minOrderQuantity: 0,
    amount: 0,

    remarks: "",
    isEditable: false,
    isErrorField: false,
    selected: false

};

const NormalProcurementItemDetails = () => {
    const dispatch = useDispatch();
    const { procurementItems, procurementBasicInfo } = useSelector( ( { procurements } ) => procurements );
    const { dropDownItemGroups, dropDownItemGroupByGroups } = useSelector( ( { itemGroups } ) => itemGroups );
    const { buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );


    const [filterObj, setFilterObj] = useState( {
        budgetNumber: '',
        styleNumber: '',
        orderNumber: '',
        itemGroupName: '',
        itemSubGroupName: '',
        itemName: '',
        itemCode: '',
        orderUom: '',
        orderQuantity: '',
        orderRate: '',
        amount: '',
        remarks: ''

    } );

    const handleAddNewRow = () => {

        if ( procurementBasicInfo?.itemGroupType ) {
            dispatch( bindProcurementItems( [
                ...procurementItems, {
                    ...items,
                    rowId: randomIdGenerator(),
                    isEditable: true
                }
            ] ) );
        } else {
            notify( 'warning', 'Please Select at first the Item Group Type!!!' );
        }


    };

    const handleDuplicateItemRow = ( rowId ) => {
        const duplicateRow = procurementItems.filter( item => item.rowId === rowId ).map( item => (
            {
                ...item,
                id: null,
                rowId: randomIdGenerator(),
                isEditable: true
            }
        ) );

        dispatch( bindProcurementItems( [...procurementItems, ...duplicateRow] ) );
    };
    ///Row Editable
    const handleRowEditable = ( rowId ) => {
        const updatedRow = procurementItems.map( item => {
            if ( item.rowId === rowId ) {
                item['isEditable'] = !item.isEditable;
            }
            return item;
        } );
        dispatch( bindProcurementItems( updatedRow ) );
    };

    const handleItemDelete = ( rowId ) => {
        const updatedRow = procurementItems.filter( item => item.rowId !== rowId );
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                dispatch( bindProcurementItems( updatedRow ) );
            }
        } );
    };


    const handleItemGroupDropdownOnFocus = ( groupName ) => {
        if ( groupName ) {
            dispatch( getDropDownItemGroupsByGroupName( groupName ) );
        }
    };

    const handleItemSubGroupDropdownOnFocus = async ( itemGroupId, rowId, subGroups ) => {
        console.log( itemGroupId );
        console.log( subGroups );
        if ( itemGroupId && !subGroups.length ) {
            await baseAxios.get( `${inventoryApi.itemGroup.root}/${itemGroupId}/subCategories` ).then( response => {
                const updatedData = procurementItems.map( i => {
                    if ( rowId === i.rowId ) {
                        i.itemSubGroups = response?.data?.map( rd => ( {
                            value: rd.id,
                            label: rd.name
                        } ) );
                    }
                    return i;
                } );
                dispatch( bindProcurementItems( updatedData ) );
            } );
        }
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
                    const updatedData = procurementItems.map( i => {
                        if ( rowId === i.rowId ) {
                            i.orderUoms = orderUomArray;
                        }
                        return i;
                    } );
                    dispatch( bindProcurementItems( updatedData ) );
                } );
        }
    };

    const handleItemDropdownOnFocus = () => {
        dispatch( getDropDownItems() );
    };


    const handleStyleDropdownOnFocus = () => {
        if ( !buyerStylesDropdown.length ) {
            dispatch( getBuyersStyles( procurementBasicInfo?.buyer?.value ) );
        }
    };

    ///For Fabric Item Description GET
    const handleItemDescriptionOnFocus = ( itemGroupId, ItemSubGroupId, rowId ) => {
        const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/subCategories/${ItemSubGroupId}/items`;
        baseAxios.get( endPoint ).then( response => {
            const updatedData = procurementItems.map( item => {
                if ( rowId === item.rowId ) {
                    item.items = response.data.map( i => ( {
                        label: i.name,
                        value: i.id,
                        itemNumber: i.itemNumber
                    } ) );
                }
                return item;
            } );
            dispatch( bindProcurementItems( updatedData ) );
        } );

    };

    /// ORder , Style, Budget, Item SubGroup Multiple Check
    const handleDuplicateObjCheck = ( selectRows ) => {
        const styleIdExitingItem = selectRows.filter( item => item.styleId?.length );
        const updatedObj = {
            ...procurementBasicInfo,
            styleNo: styleIdExitingItem.length ? ( isHaveDeferentObj( 'styleId', styleIdExitingItem ) ? 'Multiple' : styleIdExitingItem[0]?.styleNumber ) : ''

        };
        dispatch( bindProcurementBasicInfo( updatedObj ) );
    };

    const handleControlDropdownChange = ( data, e, rowId ) => {
        const { name } = e;
        if ( name === 'item' ) {
            const updatedData = procurementItems.map( ig => {
                if ( rowId === ig.rowId ) {
                    ig[name] = data;
                    ig['itemCode'] = data.itemNumber ?? '';
                    ig['itemName'] = data.label ?? '';
                }
                return ig;
            } );
            dispatch( bindProcurementItems( updatedData ) );

        } else if ( name === 'itemGroup' ) {
            const updatedData = procurementItems.map( ig => {
                if ( rowId === ig.rowId ) {
                    ig[name] = data;
                    ig['itemGroupName'] = data?.label ?? '';
                    ig['itemSubGroupName'] = '';
                    ig['itemSubGroup'] = null;
                    ig['item'] = null;
                    ig['items'] = [];
                    ig['itemCode'] = '';
                    ig['itemName'] = '';
                    ig['orderUoms'] = [];
                    ig['orderUom'] = null;
                }
                return ig;
            } );
            dispatch( bindProcurementItems( updatedData ) );
        } else if ( name === 'itemSubGroup' ) {
            const updatedData = procurementItems.map( ig => {
                if ( rowId === ig.rowId ) {
                    console.log( data );
                    ig[name] = data;
                    ig['itemSubGroupName'] = data?.label ?? '';
                    ig['item'] = null;
                    ig['items'] = [];
                    ig['itemCode'] = '';
                    ig['itemName'] = '';
                }
                return ig;
            } );
            dispatch( bindProcurementItems( updatedData ) );
        } else if ( name === 'orderUom' ) {
            console.log( data );
            const updatedData = procurementItems.map( ig => {
                if ( rowId === ig.rowId ) {
                    ig[name] = data;
                    ig['orderUomRelativeFactor'] = data?.relativeFactor ?? 0;
                }
                return ig;
            } );
            dispatch( bindProcurementItems( updatedData ) );

        } else if ( name === 'style' ) {
            const updatedData = procurementItems.map( ig => {
                if ( rowId === ig.rowId ) {
                    ig[name] = data;
                    ig['styleId'] = data?.value ?? '';
                    ig['styleNumber'] = data?.label ?? '';
                }
                return ig;
            } );
            dispatch( bindProcurementItems( updatedData ) );
            handleDuplicateObjCheck( updatedData );
        }

    };

    const handleInputOnChange = ( e, row ) => {
        const { type, value, name, checked } = e.target;
        console.log( value );
        const isName = name === 'orderQuantity' || name === "orderRate";

        if ( value !== '.' ) {
            const updatedData = procurementItems.map( order => {
                if ( row.rowId === order.rowId ) {
                    order[name] = isName ? Number( value ) : value;
                }
                return order;
            } );
            // setBudgetFabricDetails( updatedData );
            dispatch( bindProcurementItems( updatedData ) );
        }
    };

    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : value
        } );
    };

    const randersData = () => {
        let filtered = [];
        if ( filterObj.budgetNumber.length
            || filterObj.styleNumber.length
            || filterObj.orderNumber.length
            || filterObj.itemGroupName.length
            || filterObj.itemSubGroupName.length
            || filterObj.itemName.length
            || filterObj.itemCode.length
            || filterObj.orderUom.length
            || filterObj.orderQuantity.length
            || filterObj.orderRate.length
            || filterObj.amount.length
            || filterObj.remarks.length
        ) {
            filtered = procurementItems.filter(
                wh => wh.itemGroupName?.toLowerCase().includes( filterObj.itemGroupName?.toLowerCase() ) &&
                    wh.styleNumber?.toLowerCase().includes( filterObj.styleNumber?.toLowerCase() ) &&
                    wh.itemSubGroupName?.toLowerCase().includes( filterObj.itemSubGroupName?.toLowerCase() ) &&
                    wh.itemName?.toLowerCase().includes( filterObj.itemName?.toLowerCase() ) &&
                    wh.itemCode?.toLowerCase().includes( filterObj.itemCode?.toLowerCase() ) &&
                    wh.orderUom?.label?.toLowerCase().includes( filterObj.orderUom?.toLowerCase() ) &&
                    isZeroToFixed( wh.orderQuantity, 4 ).includes( filterObj.orderQuantity ) &&
                    isZeroToFixed( wh.orderRate, 4 ).includes( filterObj.orderRate ) &&
                    isZeroToFixed( wh.orderRate * wh.orderQuantity, 4 ).includes( filterObj.amount ) &&
                    wh.remarks?.toLowerCase().includes( filterObj.remarks?.toLowerCase() )
                //   wh.orderQuantity.toString().toLocaleLowerCase().includes( filterObj.orderQuantity.toString().toLocaleLowerCase() )
            );
        } else {
            filtered = procurementItems;
        }
        return filtered;
    };


    useEffect( () => {
        handleDuplicateObjCheck( procurementItems );
    }, [procurementItems.length] );


    const [allRowSelected, setAllRowSelected] = useState( false );

    const handleAllRowSelect = ( e ) => {
        const { checked } = e.target;
        setAllRowSelected( checked );
        const updatedSelectedItems = procurementItems.map( ( item => ( { ...item, selected: checked } ) ) );
        dispatch( bindProcurementItems( updatedSelectedItems ) );

    };

    const handleSelectSingleRow = ( e, rowId ) => {
        const { checked } = e.target;


        const updatedSelectedItems = procurementItems.map( item => {
            if ( item.rowId === rowId ) {
                item['selected'] = checked;
            }
            return item;
        } );
        dispatch( bindProcurementItems( updatedSelectedItems ) );

        const isAllRowSelected = procurementItems.some( so => !so.selected === true );
        setAllRowSelected( !isAllRowSelected );
    };

    const handleClearRowSelected = () => {
        const updatedSelectedItems = procurementItems.map( ( item => ( { ...item, selected: false } ) ) );
        dispatch( bindProcurementItems( updatedSelectedItems ) );
        setAllRowSelected( false );

    };

    const handleMultipleDelete = () => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                const updatedData = procurementItems.filter( order => !order.selected );
                dispatch( bindProcurementItems( updatedData ) );
                setAllRowSelected( false );

            }


        } );

    };

    const hiddenOrDisplayCondition = procurementItems.some( item => item.selected );
    const selectItems = procurementItems.filter( item => item.selected ).length;
    const filterArray = [


        {
            id: 'styleId',
            name: <Input
                id="styleNumberId"
                name="styleNumber"
                value={filterObj?.styleNumber}
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
            />,
            minWidth: '150px'
        },
        {
            id: 'itemGroup',
            name: <Input
                id="itemGroupId"
                name="itemGroupName"
                value={filterObj?.itemGroupName}
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
            />,
            minWidth: '150px'
        },
        {
            id: 'itemSubGroup',
            name: <Input
                id="itemSubGroupId"
                name="itemSubGroupName"
                value={filterObj?.itemSubGroupName}
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
            />,
            minWidth: '180px'

        },
        {
            id: 'itemName',
            name: <Input
                id="itemDescriptionId"
                name="itemName"
                value={filterObj.itemName}
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
            />,
            minWidth: '400px'
        },
        {
            id: 'itemCode',
            name: <Input
                id="itemNumberId"
                name="itemCode"
                value={filterObj.itemCode}
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
            />,
            minWidth: '150px'

        },

        {
            id: "orderUom",
            name: <Input
                id="orderUomId"
                name="orderUom"
                value={filterObj.orderUom}
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
            />,
            minWidth: '110px'

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
            id: 'amount',
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
        <div>

            <TableFilterInsideRow
                rowId="item-details-np-id"
                tableId="normal-pro-item-details-custom-dt"
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
                        // subHeader
                        // subHeaderComponent={}
                        pagination
                        noHeader
                        responsive
                        data={randersData()}
                        className='react-custom-dataTable-other normal-pro-item-details-custom-dt'
                        persistTableHead
                        dense
                        paginationTotalRows={randersData()?.length}
                        columns={[


                            {
                                id: 'styleId',
                                name: 'Style',
                                minWidth: '150px',
                                selector: 'style',
                                center: true,
                                cell: row => row.style?.label
                            },
                            {
                                id: row => row.itemGroup,
                                name: 'Item Group',
                                minWidth: '150px',
                                selector: row => row.itemGroup,
                                center: true,
                                cell: row => row.itemGroup?.label
                            },
                            {
                                id: row => row.itemSubGroup,
                                name: 'Item Sub Group',
                                minWidth: '180px',
                                selector: row => row.itemSubGroup,
                                cell: row => row.itemSubGroup?.label

                            },
                            {
                                id: row => row.itemName,
                                allowOverflow: true,
                                name: 'Item Description',
                                minWidth: '400px',
                                selector: row => row.itemName,
                                cell: row => row.item?.label
                            },
                            {
                                id: row => row.itemCode,
                                name: 'Item Code',
                                minWidth: '150px',
                                center: true,
                                selector: row => row.itemCode,
                                cell: row => row.itemCode
                            },

                            {
                                id: "orderUom",
                                allowOverflow: true,
                                name: 'UOM',
                                center: true,
                                minWidth: '110px',
                                selector: row => row.orderUom,
                                cell: row => row.orderUom?.label
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

            <div>
                <Button.Ripple
                    id="addFabId"
                    tag={Label}
                    onClick={() => { handleAddNewRow(); }}
                    className='btn-icon'
                    color='flat-success'
                >
                    <PlusSquare id="addFabId" color="green" />
                </Button.Ripple>
            </div>
        </div>
    );
};

export default NormalProcurementItemDetails;

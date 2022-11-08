import classnames from 'classnames';
import _ from 'lodash';
import DataTable from "react-data-table-component";
import NumberFormat from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import { isZeroToFixed, randomIdGenerator } from "../../../../utility/Utils";
import { bindItemDetailsWithMinOrder, bindSelectedItemsForProcurement } from "../store/actions";


const ProcurementItemDetailsWithMinQty = () => {
    const dispatch = useDispatch();
    const {
        selectedProcurementSelectedItems,
        itemDetailsWithMinOder } = useSelector( ( { procurements } ) => procurements );

    ///For Min Order
    const handleItemDetailsUpdated = ( items, row ) => {

        items.map( item => {
            if ( item.rowId === row.rowId && item.minOrderQty > item.totalOrderQty ) {
                const newObj = _.find( selectedProcurementSelectedItems, { itemSubGroupId: row.itemSubGroupId, itemGroupId: row.itemGroupId, itemName: row.itemName } );
                const isExistingData = selectedProcurementSelectedItems.some( i => row.itemSubGroupId === i.itemSubGroupId && row.itemGroupId === i.itemGroupId && row.itemId === i.itemId && !i.budgetId.length );

                if ( isExistingData ) {
                    const updatedData = selectedProcurementSelectedItems.map( i => {
                        if ( row.itemSubGroupId === i.itemSubGroupId && row.itemGroupId === i.itemGroupId && row.itemId === i.itemId && !i.budgetId.length ) {
                            i['orderQuantity'] = ( i.bomUomRelativeFactor / i.orderUomRelativeFactor ) * ( item.minOrderQty - item.totalOrderQty );
                            i['minCountableOrderQuantity'] = i.bomUomRelativeFactor * ( item.minOrderQty - item.totalOrderQty );
                        }
                        return i;
                    } );
                    dispatch( bindSelectedItemsForProcurement( updatedData ) );
                } else {
                    const obj = {
                        ...newObj,
                        id: null,
                        budgetId: "",
                        budgetNumber: "",
                        styleId: "",
                        styleNumber: "",
                        orderId: "",
                        orderNumber: "",
                        bomQuantity: 0,
                        totalRequisitionQuantity: 0,
                        balancedQuantity: 0,
                        fieldId: randomIdGenerator(),
                        balanceToRaised: 0,
                        rowId: randomIdGenerator(),
                        orderQuantity: ( item.bomUomRelativeFactor / item.orderUomRelativeFactor ) * ( item.minOrderQty - item.totalOrderQty ),
                        minCountableOrderQuantity: item.bomUomRelativeFactor * ( item.minOrderQty - item.totalOrderQty )
                    };
                    dispatch( bindSelectedItemsForProcurement( [...selectedProcurementSelectedItems, obj] ) );
                }
            } else if ( item.rowId === row.rowId && item.minOrderQty === item.totalOrderQty ) {
                const updatedItem = selectedProcurementSelectedItems.filter( i => !( row.itemSubGroupId === i.itemSubGroupId && row.itemGroupId === i.itemGroupId && row.itemId === i.itemId && !i.budgetId.length ) );
                dispatch( bindSelectedItemsForProcurement( updatedItem ) );
            }

        } );
    };

    ///Min Quantity On Change
    const handleDataOnChangeItemMinOrder = ( e, row ) => {


        const { value, name } = e.target;
        console.log( value );
        if ( value !== '.' ) {
            const updatedData = itemDetailsWithMinOder.map( item => {
                if ( item.rowId === row.rowId ) {
                    item[name] = Number( value );
                }
                return item;
            } );
            dispatch( bindItemDetailsWithMinOrder( updatedData ) );

            handleItemDetailsUpdated( updatedData, row );
        }
    };


    return (
        <DataTable
            pagination
            noHeader
            responsive
            data={_.orderBy( itemDetailsWithMinOder, ['itemGroupId', 'itemSubGroupId'] )}
            className='react-custom-dataTable-other'
            persistTableHead
            dense
            paginationTotalRows={itemDetailsWithMinOder.length}
            columns={
                [

                    {
                        id: "itemGroup",
                        name: 'Item Group',
                        minWidth: '150px',
                        selector: row => row.itemGroup,
                        center: true,
                        cell: row => row.itemGroup
                    },
                    {
                        id: "itemSubGroup",
                        name: 'Item Sub Group',
                        minWidth: '180px',
                        selector: row => row.itemSubGroup,
                        cell: row => row.itemSubGroup
                    },
                    {
                        id: row => row.itemName,
                        allowOverflow: true,
                        name: 'Item Description',

                        minWidth: '500px',
                        selector: row => row.itemName,
                        cell: row => row.itemName
                    },
                    {
                        id: "bomUom",
                        name: 'UOM',
                        minWidth: '100px',
                        center: true,
                        selector: row => row.bomUom,
                        cell: row => row.bomUom
                    },
                    {
                        id: 'totalOrderQty',
                        name: 'Order Qty',
                        minWidth: '130px',
                        center: true,
                        allowOverflow: true,
                        selector: row => row.totalOrderQty,
                        cell: row => isZeroToFixed( row?.totalOrderQty, 4 )
                    },

                    {
                        id: 'minimumOrderQty',
                        name: 'Min Order Qty',
                        minWidth: '110px',
                        center: true,
                        selector: row => row.minOrderQty,
                        cell: row => (

                            <NumberFormat
                                className={classnames( `form-control-sm form-control text-right  ${row.minOrderQty < row.totalOrderQty && 'border-danger'}` )}
                                displayType="input"
                                value={row.minOrderQty}
                                name="minOrderQty"
                                decimalScale={4}
                                allowNegative={false}
                                fixedDecimalScale={row.minOrderQty !== 0}
                                allowLeadingZeros={false}
                                onFocus={e => {
                                    e.target.select();
                                }}
                                onBlur={( e ) => { handleDataOnChangeItemMinOrder( e, row ); }}
                            />
                        )
                    }

                ]}
        />
    );
};

export default ProcurementItemDetailsWithMinQty;
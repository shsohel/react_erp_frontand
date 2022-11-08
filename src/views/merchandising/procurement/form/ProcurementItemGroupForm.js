import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { CustomInput, Input } from 'reactstrap';
import TableFilterInsideRow from '../../../../utility/custom/TableFilterInsideRow';
import { bindBudgetItemDetailsOnChange } from '../../budget/store/actions';

export const ProcurementItemGroupForm = ( { data, setAllRowSelected } ) => {
    const dispatch = useDispatch();
    const [filterObj, setFilterObj] = useState( {
        itemNumber: '',
        itemName: ''
    } );

    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : value
        } );
    };

    const { buyerBudgetItemDetails } = useSelector( ( { budgets } ) => budgets );

    const handleSelectItemGroupOrder = ( e, itemSubGroupFieldId, itemFieldId ) => {
        const { checked } = e.target;
        const updatedData = buyerBudgetItemDetails.map( subGroup => {
            if ( subGroup.fieldId === itemSubGroupFieldId ) {
                subGroup['items'] = subGroup.items.map( iGroup => {
                    if ( iGroup.fieldId === itemFieldId ) {
                        iGroup['isSelected'] = checked;
                    }
                    return iGroup;
                } );

            }
            return subGroup;
        } );

        const updateSelected = updatedData.map( subGroup => {
            if ( subGroup.fieldId === itemSubGroupFieldId ) {
                const isAllItemGroupSelected = subGroup.items.some( itemGroup => !itemGroup.isSelected );
                subGroup['isSelected'] = !isAllItemGroupSelected;
            }
            return subGroup;
        } );
        dispatch( bindBudgetItemDetailsOnChange( updatedData ) );
        const isAllRowSelected = updateSelected.some( so => !so.isSelected === true );
        setAllRowSelected( !isAllRowSelected );
    };

    const randersData = () => {
        const items = [...data.items];
        let filtered = [];
        if ( filterObj.itemNumber.length || filterObj.itemName.length ) {
            filtered = items.filter(
                wh => wh.itemNumber?.toLowerCase().includes( filterObj.itemNumber?.toLowerCase() ) &&
                    wh.itemName?.toLowerCase().includes( filterObj.itemName?.toLowerCase() )
            );
        } else {
            filtered = items;
        }
        return filtered;
    };

    const filterArray = [
        {
            id: 'name',
            name: '',
            width: '110px'
        },

        {
            id: "itemNumber",
            name: <Input
                id="itemNumber"
                name="itemNumber"
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
                placeholder="Search by Item Number"
            />,
            minWidth: '200px'
        },
        {
            id: "itemName",
            name: <Input
                id="itemName"
                name="itemName"
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
                placeholder="Search by Item"
            />,
            minWidth: '200px'
        }
    ];

    return <div>
        <TableFilterInsideRow rowId="nestItemIdTable" tableId="pro-nest-item-dt" filterArray={filterArray} />

        <DataTable
            noHeader
            dense={true}
            pagination
            paginationTotalRows={randersData().length}
            paginationRowsPerPageOptions={[5, 10, 20, 25]}
            className='react-custom-dataTable-other pro-nest-item-dt border border-secondary'

            data={randersData()}
            columns={[
                {
                    id: 'name',
                    name: '',
                    width: '45px',
                    selector: 'S',
                    center: true,
                    sortable: false
                },
                {
                    id: 'selectedId',
                    name: '#',
                    width: '65px',
                    selector: '#',
                    center: true,
                    sortable: false,
                    cell: row => (
                        <CustomInput
                            type='checkbox'
                            className='custom-control-Primary p-0'
                            id={`${row.fieldId}`}
                            name='isSelectedItem'
                            htmlFor={`${row.fieldId}`}
                            checked={row.isSelected}
                            inline
                            onChange={( e ) => handleSelectItemGroupOrder( e, data.fieldId, row.fieldId )}
                        />
                    )
                },
                {
                    name: 'Item Number',
                    minWidth: '200px',
                    selector: row => row?.itemNumber,
                    sortable: true,
                    cell: row => row?.itemNumber
                },
                {
                    name: 'Item Description',
                    minWidth: '200px',
                    selector: row => row?.itemName,
                    sortable: true,
                    cell: row => row?.itemName
                }
            ]}
            sortIcon={<ChevronDown size={2} />}
        />
    </div>;
};

import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'reactstrap';
import TableFilterInsideRow from '../../../../utility/custom/TableFilterInsideRow';
import { isZeroToFixed } from '../../../../utility/Utils';
import { getDropDownItemGroups, getSubGroupDropdownByItemId } from '../../../inventory/item-group/store/actions';

const GeneratedBoms = () => {
    const dispatch = useDispatch();
    const { bomDetails } = useSelector( ( { boms } ) => boms );
    const { dropDownItemGroups, dropDownItemSubGroups
    } = useSelector( ( { itemGroups } ) => itemGroups );

    const [filterObj, setFilterObj] = useState( {
        groupName: '',
        itemGroup: '',
        itemSubGroup: '',
        itemCode: '',
        itemDescription: '',
        bomUom: '',
        ratePerUnit: '',
        currencyCode: '',
        bomQuantity: ''

    } );


    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : value
        } );
    };

    const handleFilterDropdown = ( data, e ) => {
        console.log( data );
        const { name } = e;
        setFilterObj( {
            ...filterObj,
            [name]: data,
            itemSubGroup: name === 'itemGroup' ? null : name === 'itemSubGroup' ? data : filterObj?.itemSubGroup
        } );
    };

    console.log( filterObj );

    const handleItemGroupOnFocus = () => {
        dispatch( getDropDownItemGroups() );
    };
    const handleItemSubGroupOnFocus = ( itemGroupId ) => {
        dispatch( getSubGroupDropdownByItemId( itemGroupId ) );
    };

    const randersData = () => {
        let filtered = [];
        if ( filterObj.groupName.length ||
            filterObj.itemGroup.length ||
            filterObj.itemSubGroup.length ||
            filterObj.itemCode.length ||
            filterObj.itemDescription.length ||
            filterObj.bomUom.length ||
            filterObj.ratePerUnit.length ||
            filterObj.currencyCode.length ||
            filterObj.bomQuantity.length
        ) {
            filtered =
                bomDetails.filter(
                    wh => wh.groupName?.toLowerCase().includes( filterObj.groupName?.toLowerCase() ) &&
                        wh.itemGroup?.toLowerCase().includes( filterObj.itemGroup?.toLowerCase() ) &&
                        wh.itemSubGroup?.toLowerCase().includes( filterObj.itemSubGroup?.toLowerCase() ) &&
                        wh.itemCode?.toLowerCase().includes( filterObj.itemCode?.toLowerCase() ) &&
                        wh.itemDescription?.toLowerCase().includes( filterObj.itemDescription?.toLowerCase() ) &&
                        wh.bomUom?.toLowerCase().includes( filterObj.bomUom?.toLowerCase() ) &&
                        isZeroToFixed( wh.ratePerUnit, 4 ).includes( filterObj.ratePerUnit.toString() ) &&
                        wh.currencyCode?.toLowerCase().includes( filterObj.currencyCode?.toLowerCase() ) &&
                        isZeroToFixed( wh.bomQuantity, 4 ).includes( filterObj.bomQuantity?.toString() )
                );
        } else {
            filtered = bomDetails;
        }
        // return paginateArray( filtered, rowsPerPage, page );
        return filtered;
    };

    const filterArray = [
        {
            id: 'serialId',
            name: '',
            width: '40px'
        },

        {
            id: 'groupName',
            name:

                <Input
                    bsSize="sm"
                    className="rounded-0"
                    type="text"
                    value={filterObj.groupName}
                    name="groupName"
                    onChange={( e ) => { handleFilter( e ); }}
                />,
            minWidth: '140px'
        },

        {
            id: "itemGroup",
            name: <Input
                bsSize="sm"
                className="rounded-0"
                type="text"
                value={filterObj.itemGroup}
                name="itemGroup"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '150px'
        },

        {
            id: "itemSubGroup",
            name:
                <Input
                    bsSize="sm"
                    className="rounded-0"
                    type="text"
                    value={filterObj.itemSubGroup}
                    name="itemSubGroup"
                    onChange={( e ) => { handleFilter( e ); }}
                />,
            minWidth: '160px'
        },
        {
            id: "itemCode",
            name: <Input
                bsSize="sm"
                className="rounded-0"
                type="text"
                value={filterObj.itemCode}
                name="itemCode"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            maxWidth: '120px'
        },


        {
            id: "itemDescription",
            name: <Input
                bsSize="sm"
                className="rounded-0"
                type="text"
                value={filterObj.itemDescription}
                name="itemDescription"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '530px'

        },

        {
            id: "bomUom",
            name: <Input
                bsSize="sm"
                className="rounded-0"
                type="text"
                value={filterObj.bomUom}
                name="bomUom"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            width: '100px'
        },

        {
            id: "ratePerUnit",
            name: <Input
                bsSize="sm"
                className="rounded-0"
                type="text"
                value={filterObj.ratePerUnit}
                name="ratePerUnit"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            width: '100px'
        },

        {
            id: "currencyCode",
            name: <Input
                bsSize="sm"
                className="rounded-0"
                type="text"
                value={filterObj.currencyCode}
                name="currencyCode"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            width: '100px'
        },
        {
            id: "bomQuantity",
            name: <Input
                bsSize="sm"
                className="rounded-0"
                type="text"
                value={filterObj.bomQuantity}
                name="bomQuantity"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '140px'
        }
    ];
    return (
        <div>
            <TableFilterInsideRow rowId="generateBom" tableId="custom-dt" filterArray={filterArray} />
            <DataTable
                pagination
                noHeader
                responsive
                data={randersData()}
                // data={bomDetails}
                className='react-custom-dataTable-other custom-dt'
                persistTableHead
                dense
                paginationTotalRows={randersData().length}
                columns={[
                    {
                        id: 'serialId',
                        name: 'SL',
                        width: '40px',
                        selector: row => row.serial,
                        center: true,
                        cell: ( row, index ) => index + 1
                    },

                    {
                        id: row => row.groupName,
                        name: 'Group',
                        minWidth: '140px',
                        selector: row => row.groupName,
                        sortable: true,
                        cell: row => row.groupName
                    },

                    {
                        id: row => row.itemGroup,
                        name: 'Item Group',
                        minWidth: '150px',
                        selector: row => row.itemGroup,
                        sortable: true,

                        cell: row => row.itemGroup
                    },

                    {
                        id: row => row.itemSubGroup,
                        name: 'Item Sub Group',
                        minWidth: '160px',
                        selector: row => row.itemSubGroup,
                        sortable: true,
                        cell: row => row.itemSubGroup
                    },
                    {
                        id: row => row.itemCode,
                        name: 'item Code.',
                        maxWidth: '120px',
                        selector: row => row.itemCode,
                        sortable: true,
                        //  center: true,
                        cell: row => ( row.itemCode.length ? row.itemCode : 'NA' ),
                        reorder: true
                    },


                    {
                        id: row => row.itemDescription,
                        name: 'item Des.',
                        sortable: true,
                        minWidth: '530px',
                        selector: row => row.itemDescription,
                        //  center: true,
                        cell: row => row.itemDescription,
                        reorder: true

                    },

                    {
                        id: row => row.bomUom,
                        name: 'UOM',
                        width: '100px',
                        selector: row => row.bomUom,
                        center: true,
                        cell: row => row.bomUom
                    },

                    {
                        id: row => row.ratePerUnit,
                        name: 'Rate',
                        width: '100px',
                        selector: row => row.ratePerUnit,
                        center: true,
                        cell: row => isZeroToFixed( row.ratePerUnit, 4 )
                    },

                    {
                        id: row => row.currencyCode,
                        name: 'Currency',
                        width: '100px',
                        selector: row => row.currencyCode,
                        sortable: true,
                        center: true,
                        cell: row => row.currencyCode
                    },
                    {
                        id: row => row.bomQuantity,
                        name: 'BOM Quantity',
                        minWidth: '140px',
                        selector: row => row.bomQuantity,
                        center: true,
                        cell: row => isZeroToFixed( row.bomQuantity, 4 )
                    }
                ]}
            />
        </div >
    );
};

export default GeneratedBoms;
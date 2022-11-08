import { store } from '@store/storeConfig/store';
import { Edit, MoreVertical, Plus, Trash2 } from 'react-feather';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { isPermit } from '../../../../utility/Utils';
import { deleteItemGroup, getItemGroupById, getItemSegmentByItemGroupId, getItemSegmentDropDownByItemGroupId, getSubGroupByItemId } from '../store/actions';


export const handleGetItemGroupColumns = ( userPermission, authPermissions ) => {
    const itemGroupTableColumns = [
        {
            name: 'Actions',
            maxWidth: '100px',
            center: true,
            cell: row => (
                <UncontrolledDropdown>
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu right>
                        {
                            isPermit( userPermission?.ItemGroupEdit, authPermissions ) && (
                                <DropdownItem
                                    hidden={!row.isActive}

                                    className='w-100'
                                    onClick={() => { store.dispatch( getItemGroupById( row.id ) ); }}
                                >
                                    <Edit color='green' size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        }
                        {
                            isPermit( userPermission?.ItemGroupDelete, authPermissions ) && (

                                <DropdownItem
                                    hidden={!row.isActive}

                                    className='w-100'
                                    onClick={() => store.dispatch( deleteItemGroup( row ) )}
                                >
                                    <Trash2 color='red' size={14} className='mr-50' />
                                    <span className='align-middle'>Delete</span>
                                </DropdownItem>
                            )
                        }

                        <DropdownItem
                            hidden={!row.isActive}
                            className='w-100'
                            // onClick={() => { store.dispatch( handleOpenAssignSubCategoryModal( true, row.id, row.name, row.subGroupName ) ); }}
                            onClick={() => { store.dispatch( getSubGroupByItemId( row ) ); }}

                        >
                            <Plus color='green' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>Assign Sub Group</span>
                        </DropdownItem>

                        <DropdownItem
                            hidden={!row.isActive}

                            className='w-100'
                            // onClick={() => { store.dispatch( handleOpenAssignItemSegmentModal( true, row.id, row.name, row.subGroupName ) ); }}
                            onClick={() => { store.dispatch( getItemSegmentByItemGroupId( row ) ); }}

                        >
                            <Plus color='green' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>Assign Item Segment</span>
                        </DropdownItem>

                        <DropdownItem
                            hidden={!row.isActive}

                            className='w-100'
                            // onClick={() => { store.dispatch( handleOpenAssignItemSegmentValueModal( true, row.id, row.name, row.subGroupName ) ); }}
                            onClick={() => { store.dispatch( getItemSegmentDropDownByItemGroupId( row ) ); }}
                        >
                            <Plus color='green' size={14} className='mr-50' />
                            <span color='primary' className='align-middle'>Assign Item Segment Value</span>
                        </DropdownItem>


                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        },
        {
            name: 'Item Group ',
            minWidth: '200px',
            selector: 'name',
            sortable: true,
            cell: row => row.name
        },
        // {
        //     name: ' Item Sub Group ',
        //     minWidth: '200px',
        //     selector: 'itemSubGroupName',
        //     sortable: true,
        //     cell: row => row.itemSubGroupName.map( s => s.name ).join( ',' )
        // },


        {
            name: 'Description',
            minWidth: '200px',
            selector: 'description',
            sortable: true,
            cell: row => row.description
        },
        {
            name: 'Item Prefix',
            minWidth: '200px',
            selector: 'itemPrefix',
            sortable: true,
            cell: row => row.itemPrefix
        },
        {
            name: 'Costing Method',
            width: '150px',
            selector: 'costingMethod',
            sortable: true,
            cell: row => row.costingMethod
        },
        {
            name: 'Default UOM Set',
            width: '150px',
            selector: 'defaultUomSet',
            sortable: true,
            cell: row => row.defaultUomSet
        },
        {
            name: 'Order UOM',
            width: '150px',
            selector: 'orderUom',
            sortable: true,
            cell: row => row.orderUom
        },
        {
            name: 'Consumption UOM',
            width: '160px',
            selector: 'consumptionUom',
            sortable: true,
            cell: row => row.consumptionUom
        },
        {
            name: 'Category',
            minWidth: '220px',
            selector: 'groupName',
            sortable: true,
            cell: row => row.groupName
        },
        {
            name: 'Sub Category',
            minWidth: '200px',
            selector: 'subGroupName',
            sortable: true,
            cell: row => row.subGroupName
        }


    ];
    return itemGroupTableColumns;
};

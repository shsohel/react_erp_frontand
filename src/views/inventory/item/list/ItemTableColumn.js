import { store } from '@store/storeConfig/store';

// import  store  from '@store/storeConfig/store';
import { Edit, MoreVertical, Trash2 } from 'react-feather';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { isPermit } from '../../../../utility/Utils';
import { deleteItem, getItemById } from '../store/actions';


export const handleGetItemColumns = ( userPermission, authPermissions ) => {
    const itemTableColumns = [
        {
            name: 'Actions',
            maxWidth: '100px',
            center: true,
            cell: row => (
                <UncontrolledDropdown >
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu
                        hidden={
                            !isPermit( userPermission?.ItemEdit, authPermissions ) &&
                            !isPermit( userPermission?.ItemDelete, authPermissions )
                        }
                        right
                    >

                        {
                            isPermit( userPermission?.ItemEdit, authPermissions ) && (
                                <DropdownItem
                                    hidden={!row.isActive}

                                    className='w-100'
                                    onClick={() => { store.dispatch( getItemById( row.itemId ) ); }}
                                >
                                    <Edit color='green' size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        }
                        {
                            isPermit( userPermission?.ItemDelete, authPermissions ) && (
                                <DropdownItem
                                    hidden={!row.isActive}
                                    className='w-100'
                                    onClick={() => store.dispatch( deleteItem( row.itemId ) )}
                                >
                                    <Trash2 color='red' size={14} className='mr-50' />
                                    <span className='align-middle'>Delete</span>
                                </DropdownItem>
                            )
                        }

                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        },
        {
            name: 'Item Number',
            maxWidth: '120px',
            selector: 'itemNumber',
            sortable: true,
            cell: row => row.itemNumber
        },
        {
            name: 'Item',
            selector: 'name',
            minWidth: '500px',
            sortable: true,
            cell: row => row.name
        },
        {
            name: 'Item Group',
            maxWidth: '200px',
            selector: 'categoryId',
            sortable: true,
            cell: row => row.category
        },
        {
            name: 'Item Sub Group',
            maxWidth: '200px',
            selector: 'subCategoryId',
            sortable: true,
            cell: row => row.subCategory
        },
        {
            name: 'SKU',
            maxWidth: '120px',
            selector: 'sku',
            sortable: true,
            cell: row => row.sku
        },
        {
            name: 'UOM',
            maxWidth: '80px',
            selector: 'costingMethod',
            sortable: true,
            cell: row => row.uom
        }


    ];
    return itemTableColumns;
};

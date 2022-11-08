import { store } from '@store/storeConfig/store';

import { Edit, MoreVertical, Trash2 } from 'react-feather';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { isPermit } from '../../../../../utility/Utils';
import { deleteStyleCategory, getStyleCategoryById, handleOpenStyleCategorySidebarForEdit } from '../store/actions';


export const handleGetStyleCategoryColumns = ( userPermission, authPermissions ) => {
    const styleCategoryTableColumns = [
        {
            name: 'Style Category Name',
            minWidth: '200px',
            selector: 'name',
            sortable: true,
            cell: row => row.name
        },
        {
            name: 'Description',
            minWidth: '200px',
            selector: 'description',
            sortable: true,
            cell: row => row.description
        },


        {
            name: 'Actions',
            maxWidth: '100px',
            center: true,
            cell: row => (
                <UncontrolledDropdown>
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu
                        right
                        hidden={
                            !isPermit( userPermission?.StyleCategoryEdit, authPermissions ) &&
                            !isPermit( userPermission?.StyleCategoryDelete, authPermissions )
                        }
                    >
                        {
                            isPermit( userPermission?.StyleCategoryEdit, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => { store.dispatch( getStyleCategoryById( row.id ) ); store.dispatch( handleOpenStyleCategorySidebarForEdit( true ) ); }}
                                >
                                    <Edit color='green' size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        }

                        {
                            isPermit( userPermission?.StyleCategoryDelete, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => store.dispatch( deleteStyleCategory( row.id ) )}
                                >
                                    <Trash2 color='red' size={14} className='mr-50' />
                                    <span className='align-middle'>Delete</span>
                                </DropdownItem>
                            )
                        }

                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        }

    ];
    return styleCategoryTableColumns;
};

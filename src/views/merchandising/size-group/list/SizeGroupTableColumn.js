import { store } from '@store/storeConfig/store';

import { Edit, MoreVertical, Trash2 } from 'react-feather';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { isPermit } from '../../../../utility/Utils';
import { deleteSizeGroup, getSizeGroupById } from '../store/actions';


export const handleGetSizeGroupColumns = ( userPermission, authPermissions ) => {
    const sizeGroupTableColumns = [
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
                            !isPermit( userPermission?.GarmentSizeGroupEdit, authPermissions ) &&
                            !isPermit( userPermission?.GarmentSizeGroupDelete, authPermissions )
                        }
                    >

                        {
                            isPermit( userPermission?.GarmentSizeGroupEdit, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => { store.dispatch( getSizeGroupById( row.id ) ); }}
                                >
                                    <Edit color='green' size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        }
                        {
                            isPermit( userPermission?.GarmentSizeGroupDelete, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => store.dispatch( deleteSizeGroup( row ) )}
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
            name: ' Group Name',
            width: '300px',
            selector: 'groupName',
            sortable: true,
            cell: row => row.groupName
        },
        {
            name: 'Size',
            minWidth: '200px',
            selector: 'sizes',
            sortable: true,
            cell: row => row?.sizes
        }


    ];
    return sizeGroupTableColumns;
};

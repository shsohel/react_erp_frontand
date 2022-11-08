import { store } from '@store/storeConfig/store';

import { Edit, MoreVertical, Trash2 } from 'react-feather';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { isPermit } from '../../../../utility/Utils';
import { deleteSize, getSizeById } from '../store/actions';


export const handleGetSizeColumns = ( userPermission, authPermissions ) => {
    const sizeTableColumns = [
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
                            !isPermit( userPermission?.GarmentSizeEdit, authPermissions ) &&
                            !isPermit( userPermission?.GarmentSizeDelete, authPermissions )}
                    >
                        {
                            isPermit( userPermission?.GarmentSizeEdit, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => { store.dispatch( getSizeById( row.id ) ); }}
                                >
                                    <Edit color='green' size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        }
                        {
                            isPermit( userPermission?.GarmentSizeDelete, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => store.dispatch( deleteSize( row ) )}
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
            name: 'Name',
            minWidth: '200px',
            selector: 'name',
            sortable: true,
            cell: row => row.name
        },
        {
            name: 'Short Code',
            minWidth: '200px',
            selector: 'shortCode',
            sortable: true,
            cell: row => row.shortCode
        }
        // {
        //     name: 'Description',
        //     minWidth: '200px',
        //     selector: 'description',
        //     sortable: true,
        //     cell: row => row.description
        // },

        // {
        //     name: 'Status',
        //     maxWidth: '108px',
        //     selector: 'status',
        //     sortable: false,
        //     cell: row => (
        //         <Badge className='text-capitalize' color={statusObj[row.status ? 'active' : 'inactive']} pill>
        //             {row.status ? 'active' : 'inactive'}
        //         </Badge>

        //     )
        // },

    ];
    return sizeTableColumns;
};

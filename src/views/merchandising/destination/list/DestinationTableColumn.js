import { store } from '@store/storeConfig/store';

import { MoreVertical, Trash2 } from 'react-feather';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { deleteDestination } from '../store/actions';


export const handleGetDestinationColumns = ( userPermission, authPermissions ) => {
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
                        hidden={false}
                    // hidden={
                    //     !isPermit( userPermission?.GarmentSizeEdit, authPermissions ) &&
                    //     !isPermit( userPermission?.GarmentSizeDelete, authPermissions )}
                    >
                        {/* {
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
                                    onClick={() => store.dispatch( deleteSize( row.id ) )}
                                >
                                    <Trash2 color='red' size={14} className='mr-50' />
                                    <span className='align-middle'>Delete</span>
                                </DropdownItem>
                            )
                        } */}

                        {/* <DropdownItem
                            className='w-100'
                            onClick={() => { store.dispatch( getDestinationById( row.id ) ); }}
                        >
                            <Edit color='green' size={14} className='mr-50' />
                            <span className='align-middle'>Edit</span>
                        </DropdownItem> */}


                        <DropdownItem
                            className='w-100'
                            onClick={() => store.dispatch( deleteDestination( row ) )}
                        >
                            <Trash2 color='red' size={14} className='mr-50' />
                            <span className='align-middle'>Delete</span>
                        </DropdownItem>


                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        },
        {
            name: 'Country',
            minWidth: '200px',
            selector: 'country',
            sortable: true,
            cell: row => row.country
        },
        {
            name: 'Destination',
            minWidth: '200px',
            selector: 'destination',
            sortable: true,
            cell: row => row.destination
        }


    ];
    return sizeTableColumns;
};

import Avatar from '@components/avatar';
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png';
import { store } from '@store/storeConfig/store';
import { Edit, MoreVertical, RefreshCcw, Trash2 } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { baseUrl } from '../../../../utility/enums';
import { isPermit } from '../../../../utility/Utils';
import { deleteUser, getUserById, retrieveUser } from '../store/actions';


export const handleGetUserColumns = ( userPermission, authPermissions ) => {
    const userTableColumn = [
        {
            name: 'User Name',
            minWidth: '200px',
            selector: 'userName',
            sortable: true,
            cell: row => row.userName
        },
        {
            name: 'Name',
            minWidth: '200px',
            selector: 'name',
            sortable: true,
            cell: row => row.name
        },
        {
            name: 'Email',
            minWidth: '200px',
            selector: 'email',
            sortable: true,
            cell: row => row.email
        },
        {
            name: 'Contact Number',
            minWidth: '200px',
            selector: 'contactNumber',
            sortable: true,
            cell: row => row.contactNumber
        },
        {
            name: 'Status',
            width: '180px',
            selector: 'status',
            sortable: true,
            cell: row => row.status
        },
        {
            name: 'Photo',
            width: '100px',
            selector: 'photo',
            center: true,
            sortable: true,
            cell: row => (
                <Avatar imgHeight='28' imgWidth='28' img={row.imageUrl.length ? `${baseUrl}/${row.imageUrl}` : defaultAvatar} />
            )
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
                    <DropdownMenu right positionFixed>
                        <DropdownItem
                            hidden={!row.isActive || !isPermit( userPermission?.UserEdit, authPermissions )}
                            className='w-100'
                            onClick={() => { store.dispatch( getUserById( row.id ) ); }}
                        >
                            <Edit color="green" size={14} className='mr-50' />
                            <span className='align-middle'> Edit </span>
                        </DropdownItem>

                        <DropdownItem
                            hidden={!row.isActive || !isPermit( userPermission?.UserDelete, authPermissions )}
                            className='w-100'
                            onClick={() => store.dispatch( deleteUser( row ) )}
                        >
                            <Trash2 color="red" size={14} className='mr-50' />
                            <span className='align-middle'>Delete</span>
                        </DropdownItem>
                        <DropdownItem
                            hidden={row.isActive || !isPermit( userPermission?.UserEdit, authPermissions )}
                            className='w-100'
                            onClick={() => store.dispatch( retrieveUser( row ) )}
                        >
                            <RefreshCcw color="green" size={14} className='mr-50' />
                            <span className='align-middle'>Retrieve</span>
                        </DropdownItem>

                    </DropdownMenu>
                </UncontrolledDropdown >
            )
        }
    ];
    return userTableColumn;
};
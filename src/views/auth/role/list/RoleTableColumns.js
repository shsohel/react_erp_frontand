import { store } from '@store/storeConfig/store';

import { Key, MoreVertical, Trash2 } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { isPermit } from '../../../../utility/Utils';
import { deleteRole, getRoleById, getRolePermissionByRoleId } from '../store/actions';


export const handleGetRoleColumns = ( userPermission, authPermissions ) => {
    const roleTableColumn = [
        {
            name: 'Name',
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
                    <DropdownMenu right positionFixed>
                        <DropdownItem
                            hidden={!isPermit( userPermission?.RoleAssignPermission, authPermissions )}
                            className='w-100'
                            onClick={() => { store.dispatch( getRolePermissionByRoleId( row ) ); }}
                        >
                            <Key color="green" size={14} className='mr-50' />
                            <span className='align-middle'> Permission </span>
                        </DropdownItem>

                        <DropdownItem
                            hidden={!isPermit( userPermission?.RoleEdit, authPermissions )}
                            className='w-100'
                            onClick={() => { store.dispatch( getRoleById( row.id ) ); }}
                        >
                            <Key color="green" size={14} className='mr-50' />
                            <span className='align-middle'> Edit </span>
                        </DropdownItem>

                        <DropdownItem
                            hidden={!isPermit( userPermission?.RoleDelete, authPermissions )}
                            className='w-100'
                            onClick={() => store.dispatch( deleteRole( row ) )}
                        >
                            <Trash2 color="red" size={14} className='mr-50' />
                            <span className='align-middle'>Delete</span>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown >
            )
        }
    ];
    return roleTableColumn;
};

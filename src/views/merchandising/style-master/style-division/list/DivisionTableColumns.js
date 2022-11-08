import { store } from '@store/storeConfig/store';

import { Edit, MoreVertical, Trash2 } from 'react-feather';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { isPermit } from '../../../../../utility/Utils';
import { deleteDivision, getDivisionById } from '../store/actions';


export const handleGetDivisionColumns = ( userPermission, authPermissions ) => {
    const divisionTableColumns = [
        {
            name: 'Division Name',
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
                            !isPermit( userPermission?.StyleDivisionEdit, authPermissions ) &&
                            !isPermit( userPermission?.StyleDivisionDelete, authPermissions )
                        }
                    >

                        {
                            isPermit( userPermission?.StyleDivisionEdit, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => { store.dispatch( getDivisionById( row.id ) ); }}
                                >
                                    <Edit color='green' size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        }
                        {
                            isPermit( userPermission?.StyleDivisionDelete, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => store.dispatch( deleteDivision( row.id ) )}
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

    return divisionTableColumns;
};
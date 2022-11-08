import Avatar from '@components/avatar';
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png';
import { store } from '@store/storeConfig/store';

import { Edit, MoreVertical, Trash2 } from 'react-feather';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { baseUrl } from '../../../../utility/enums';
import { isPermit } from '../../../../utility/Utils';
import { deleteSampleAssignee, getSampleAssigneeById } from '../store/actions';


export const handleGetSampleAgentColumns = ( userPermission, authPermissions ) => {

    const sampleAssigneeTableColumns = [
        {
            name: 'Name',
            minWidth: '200px',
            selector: 'name',
            sortable: true,
            cell: row => row.name
        },
        {
            name: 'Short Name',
            minWidth: '200px',
            selector: 'shortName',
            sortable: true,
            cell: row => row.shortName
        },
        {
            name: 'Email',
            minWidth: '200px',
            selector: 'email',
            sortable: true,
            cell: row => row.email
        },
        {
            name: 'Phone',
            minWidth: '200px',
            selector: 'phoneNumber',
            sortable: true,
            cell: row => row.phoneNumber
        },
        {
            name: 'photo',
            maxWidth: '100px',
            selector: 'photo',
            center: true,
            sortable: true,
            cell: row => (
                <Avatar img={row.imageUrl ? `${baseUrl}/${row.imageUrl}` : defaultAvatar} />
            )
        },
        {
            name: 'Actions',
            maxWidth: '100px',
            cell: row => (
                <UncontrolledDropdown>
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>

                    <DropdownMenu
                        hidden={
                            !isPermit( userPermission?.SampleAssigneeEdit, authPermissions ) &&
                            !isPermit( userPermission?.SampleAssigneeDelete, authPermissions )
                        }
                        right>
                        {
                            isPermit( userPermission?.SampleAssigneeEdit, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => { store.dispatch( getSampleAssigneeById( row.id ) ); }}
                                >
                                    <Edit color='green' size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        }
                        {
                            isPermit( userPermission?.SampleAssigneeDelete, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => store.dispatch( deleteSampleAssignee( row.id ) )}
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
    return sampleAssigneeTableColumns;
};
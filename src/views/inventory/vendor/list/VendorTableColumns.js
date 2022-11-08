
import Avatar from '@components/avatar';
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png';
import { Edit, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { baseUrl } from '../../../../utility/enums';

import { store } from '@store/storeConfig/store';

import { isPermit } from '../../../../utility/Utils';
import { deleteVendor } from '../store/actions';


export const handleGetVendorColumns = ( userPermission, authPermissions ) => {
    const vendorTableColumns = [
        {
            name: 'Actions',
            center: true,
            maxWidth: '100px',
            cell: row => (
                <UncontrolledDropdown>
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu
                        right
                        hidden={
                            !isPermit( userPermission?.VendorEdit, authPermissions ) &&
                            !isPermit( userPermission?.VendorDelete, authPermissions )
                        }
                    >
                        {/* <DropdownItem
                        tag={Link}
                        to={`/apps/user/view/${row.id}`}
                        className='w-100'
                        onClick={() => { }}
                    >
                        <FileText color='skyBlue' size={14} className='mr-50' />
                        <span color='primary' className='align-middle'>Details</span>
                    </DropdownItem> */}

                        {
                            isPermit( userPermission?.VendorEdit, authPermissions ) && (
                                <DropdownItem
                                    tag={Link}
                                    className='w-100'
                                    to={{ pathname: `/edit-vendor`, state: `${row.id}` }}
                                // onClick={() => { store.dispatch( getWarehouseById( row.id ) ); }}
                                >
                                    <Edit color='green' size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>

                            )
                        }
                        {
                            isPermit( userPermission?.VendorDelete, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'

                                    onClick={() => store.dispatch( deleteVendor( row.id ) )}
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
            id: 'nameId',
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
            name: 'Mobile',
            minWidth: '200px',
            selector: 'mobileNumber',
            sortable: true,
            cell: row => row.mobileNumber
        },
        {
            name: 'Photo',
            maxWidth: '100px',
            selector: 'photo',
            center: true,
            cell: row => (
                <Avatar img={row.imageUrl ? `${baseUrl}/${row.imageUrl}` : defaultAvatar} />
            )
        }


    ];
    return vendorTableColumns;
};
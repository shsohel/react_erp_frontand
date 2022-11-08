import Avatar from '@components/avatar';
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png';
import { store } from '@store/storeConfig/store';
import { Eye, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { baseUrl } from '../../../../utility/enums';
import { isPermit } from '../../../../utility/Utils';
import { deleteBuyer } from '../store/actions';


export const handleGetBuyerColumns = ( userPermission, authPermissions ) => {
    const buyerTableColumn = [
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
        // {
        //     name: 'Buyer Department ',
        //     minWidth: '200px',
        //     selector: 'buyerDepartment',
        //     sortable: true,
        //     cell: row => row?.buyerDepartment?.map( i => i.name ).join( ',' )
        // },
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

        // {
        //     name: 'Status',
        //     maxWidth: '108px',
        //     selector: 'status',
        //     sortable: true,
        //     cell: row => (
        //         <Badge className='text-capitalize' color={statusObj[row.status ? 'active' : 'inactive']} pill>
        //             {row.status ? 'active' : 'inactive'}
        //         </Badge>

        //     )
        // },

        {
            name: 'Actions',
            maxWidth: '100px',
            center: true,
            cell: row => (
                <UncontrolledDropdown>
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu right
                        positionFixed
                        hidden={
                            !isPermit( userPermission?.BuyerEdit, authPermissions ) &&
                            !isPermit( userPermission?.BuyerView, authPermissions ) &&
                            !isPermit( userPermission?.BuyerDelete, authPermissions )
                        }
                    >

                        {/* {
                            isPermit( userPermission?.BuyerEdit, authPermissions ) && (
                                <DropdownItem
                                    tag={Link}
                                    to={{ pathname: `/buyer-edit-form`, state: `${row.id}` }}
                                    className='w-100'
                                // onClick={() => { store.dispatch( getBuyerById( row.id ) ); }}
                                >
                                    <Edit color="green" size={14} className='mr-50' />
                                    <span className='align-middle'> Edit </span>
                                </DropdownItem>
                            )
                        } */}
                        {
                            isPermit( userPermission?.BuyerView, authPermissions ) && (
                                <DropdownItem
                                    tag={Link}
                                    to={{ pathname: `/buyer-details`, state: `${row.id}` }}

                                    className='w-100'
                                // onClick={() => { store.dispatch( getBuyerById( row.id ) ); }}
                                >
                                    <Eye color="green" size={14} className='mr-50' />
                                    <span className='align-middle'> View </span>
                                </DropdownItem>
                            )
                        }
                        {
                            isPermit( userPermission?.BuyerDelete, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => store.dispatch( deleteBuyer( row.id ) )}
                                >
                                    <Trash2 color="red" size={14} className='mr-50' />
                                    <span className='align-middle'>Delete</span>
                                </DropdownItem>
                            )
                        }


                    </DropdownMenu>
                </UncontrolledDropdown >
            )
        }
    ];

    return buyerTableColumn;

};
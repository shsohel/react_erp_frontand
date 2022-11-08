
import Avatar from '@components/avatar';
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png';
import { store } from '@store/storeConfig/store';
import { Edit, MoreVertical } from 'react-feather';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { baseUrl } from '../../../../utility/enums';
import { isPermit } from '../../../../utility/Utils';
import { getMerchandiserBuyer } from '../store/actions';


export const handleGetMerchandiserColumns = ( userPermission, authPermissions ) => {

    const buyerAgentTableColumns = [
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
            name: 'Photo',
            maxWidth: '100px',
            selector: 'photo',
            center: true,
            sortable: true,
            cell: row => (
                <Avatar img={row.imageUrl ? `${baseUrl}/${row.imageUrl}` : defaultAvatar} />
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
                    <DropdownMenu
                        right
                        hidden={
                            !isPermit( userPermission?.MerchandiserAssignBuyer, authPermissions )
                        }
                    >
                        {
                            isPermit( userPermission?.MerchandiserAssignBuyer, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => { store.dispatch( getMerchandiserBuyer( row.id ) ); }}
                                >
                                    <Edit color='green' size={14} className='mr-50' />
                                    <span className='align-middle'>Assign Buyer</span>
                                </DropdownItem>
                            )
                        }


                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        }

    ];
    return buyerAgentTableColumns;
};
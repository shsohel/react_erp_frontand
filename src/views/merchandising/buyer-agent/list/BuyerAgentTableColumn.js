
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
import { deleteBuyerAgent, getBuyerAgentById } from '../store/actions';


export const handleGetBuyerGetAgentColumns = ( userPermission, authPermissions ) => {
    const buyerAgentTableColumns = [
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
                            !isPermit( userPermission?.BuyerAgentEdit, authPermissions ) &&
                            !isPermit( userPermission?.BuyerAgentDelete, authPermissions )
                        }
                    >
                        {
                            isPermit( userPermission?.BuyerAgentEdit, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => { store.dispatch( getBuyerAgentById( row.id ) ); }}
                                >
                                    <Edit color='green' size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        }
                        {
                            isPermit( userPermission?.BuyerAgentDelete, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => store.dispatch( deleteBuyerAgent( row.id ) )}
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
    return buyerAgentTableColumns;
};
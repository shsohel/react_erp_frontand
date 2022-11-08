import Avatar from '@components/avatar';
import { store } from '@store/storeConfig/store';
import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { deleteItemSubGroup, getItemSubGroupById, handleOpenItemSubGroupSidebar } from '../store/actions';


// ** Renders Client Columns
const renderClient = row => {
    const stateNum = Math.floor( Math.random() * 6 ),
        states = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary'],
        color = states[stateNum];

    if ( row.avatar.length ) {
        return <Avatar className='mr-1' img={row.avatar} width='32' height='32' />;
    } else {
        return <Avatar color={color || 'primary'} className='mr-1' content={row.itemSubGroupName || 'Cotton Fabric'} initials />;
    }
};


export const ItemSubGroupTableColumns = [
    {
        name: 'Item Sub Group Name',
        minWidth: '200px',
        selector: 'itemSubGroupName',
        sortable: true,
        cell: row => row.itemSubGroupName
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
        cell: row => (
            <UncontrolledDropdown>
                <DropdownToggle tag='div' className='btn btn-sm'>
                    <MoreVertical size={14} className='cursor-pointer' />
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem
                        tag={Link}
                        to={`/apps/user/view/${row.id}`}
                        className='w-100'
                        onClick={() => { }}
                    >
                        <FileText color='skyBlue' size={14} className='mr-50' />
                        <span color='primary' className='align-middle'>Details</span>

                    </DropdownItem>

                    <DropdownItem
                        className='w-100'
                        onClick={() => { store.dispatch( getItemSubGroupById( row.id ) ); store.dispatch( handleOpenItemSubGroupSidebar( true ) ); }}
                    >
                        <Edit color='green' size={14} className='mr-50' />
                        <span className='align-middle'>Edit</span>
                    </DropdownItem>

                    <DropdownItem
                        className='w-100'
                        onClick={() => store.dispatch( deleteItemSubGroup( row.id ) )}
                    >
                        <Trash2 color='red' size={14} className='mr-50' />
                        <span className='align-middle'>Delete</span>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        )
    }

];

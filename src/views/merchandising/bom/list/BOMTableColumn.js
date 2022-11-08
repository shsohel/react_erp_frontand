import { store } from '@store/storeConfig/store';
import { Eye, MoreVertical, Trash2 } from 'react-feather';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { deleteBom, getBomById, handleOpenBomViewModal } from '../store/actions';

export const BomTableColumns = [

    {
        name: 'BOM NO.',
        minWidth: '200px',
        selector: 'bomNumber',
        sortable: true,
        cell: row => row.bomNumber
    },
    {
        name: 'Buyer',
        minWidth: '200px',
        selector: 'buyerName',
        sortable: true,
        cell: row => row.buyerName
    },
    {
        name: 'Purchase Order NO.',
        minWidth: '200px',
        selector: 'orderNumber',
        sortable: true,
        cell: row => row.orderNumber
    },
    {
        name: 'Styles NO.',
        minWidth: '200px',
        selector: 'stylesNumber',
        sortable: true,
        cell: row => row.stylesNumber
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

                        className='w-100'
                        onClick={() => { store.dispatch( getBomById( row.id ) ); store.dispatch( handleOpenBomViewModal( true, row.id ) ); }}

                    >
                        <Eye color='green' size={14} className='mr-50' />
                        <span className='align-middle'>View</span>
                    </DropdownItem>
                    <DropdownItem className='w-100' onClick={() => store.dispatch( deleteBom( row.id ) )}>
                        <Trash2 color="red" size={14} className='mr-50' />
                        <span className='align-middle'>Delete</span>
                    </DropdownItem>


                </DropdownMenu>
            </UncontrolledDropdown>
        )
    }

];

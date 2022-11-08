import { Edit, MoreVertical } from 'react-feather';
import { Link } from 'react-router-dom';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { isPermit } from '../../../../utility/Utils';


export const handleGetWarehouseColumns = ( userPermission, authPermissions ) => {
    const warehouseTableColumns = [
        {
            id: 'nameId',
            name: 'Name',
            minWidth: '200px',
            selector: row => row.name,
            sortable: true,
            cell: row => row.name
        },

        {
            name: 'Short Name',
            minWidth: '200px',
            selector: row => row.shortName,
            sortable: true,
            cell: row => row.shortName
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
                        hidden={!isPermit( userPermission?.WarehouseEdit, authPermissions )}
                        right>

                        {
                            isPermit( userPermission?.WarehouseEdit, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    tag={Link}
                                    to={{ pathname: `/edit-warehouse`, state: `${row.id}` }}
                                >
                                    <Edit color='green' size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        }


                        {/* <DropdownItem
                        className='w-100'
                        onClick={() => store.dispatch( deleteItemGroup( row.id ) )}
                    >
                        <Trash2 color='red' size={14} className='mr-50' />
                        <span className='align-middle'>Delete</span>
                    </DropdownItem> */}
                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        }

    ];
    return warehouseTableColumns;
};

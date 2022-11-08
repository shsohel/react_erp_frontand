import { store } from '@store/storeConfig/store';

import { Edit, MoreVertical, Trash2 } from 'react-feather';
import { InputGroupAddon } from 'reactstrap';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { isPermit } from '../../../../utility/Utils';
import { deleteColor, getColorById } from '../store/actions';


export const handleGetColorColumns = ( userPermission, authPermissions ) => {
    const colorTableColumns = [
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
                            !isPermit( userPermission?.GarmentColorEdit, authPermissions ) &&
                            !isPermit( userPermission?.GarmentColorDelete, authPermissions )
                        }
                    >
                        {
                            isPermit( userPermission?.GarmentColorEdit, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => { store.dispatch( getColorById( row.id ) ); }}
                                >
                                    <Edit color='green' size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        }
                        {
                            isPermit( userPermission?.GarmentColorDelete, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => store.dispatch( deleteColor( row ) )}
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
            name: 'Color Name',
            minWidth: '100px',
            selector: 'name',
            sortable: true,
            cell: row => row.name
        },
        {
            name: 'Color ',
            minWidth: '100px',
            selector: 'hexCode',
            sortable: true,
            cell: row => (
                <InputGroupAddon addonType='prepend'>
                    <span className="color-pick" style={{ backgroundColor: row.hexCode }}>
                    </span>

                </InputGroupAddon>
            )
        },

        {
            name: 'Color Code',
            minWidth: '200px',
            selector: 'hexCode',
            sortable: true,
            cell: row => row.hexCode
        }
        // {
        //     name: 'Description',
        //     minWidth: '200px',
        //     selector: 'description',
        //     sortable: true,
        //     cell: row => row.description
        // },

        // {
        //     name: 'Status',
        //     maxWidth: '108px',
        //     selector: 'status',
        //     sortable: false,
        //     cell: row => (
        //         <Badge className='text-capitalize' color={statusObj[row.status ? 'active' : 'inactive']} pill>
        //             {row.status ? 'active' : 'inactive'}
        //         </Badge>

        //     )
        // },


    ];
    return colorTableColumns;
};

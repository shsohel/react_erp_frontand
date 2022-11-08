import { store } from '@store/storeConfig/store';

import React from 'react';
import { Edit, MoreVertical, Trash2 } from 'react-feather';
import { Badge } from 'reactstrap';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { deleteStatus, getStatusById, handleOpenStatusSidebarForEdit } from '../store/actions';


const statusObj = {
    active: 'light-success',
    inactive: 'light-secondary'
};


export const StatusTableColumns = [

    {
        name: 'Status For',
        minWidth: '200px',
        selector: 'statusFor',
        sortable: true,
        cell: row => row.statusFor?.replace( /([a-z0-9])([A-Z])/g, '$1 $2' )
    },
    {
        name: 'Status Name',
        minWidth: '200px',
        selector: 'name',
        sortable: true,
        cell: row => row.name
    },
    {
        name: 'Status',
        maxWidth: '108px',
        selector: 'isActive',
        sortable: false,
        cell: row => (
            <Badge className='text-capitalize' color={statusObj[row.isActive ? 'active' : 'inactive']} pill>
                {row.isActive ? 'active' : 'inactive'}
            </Badge>

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
                <DropdownMenu right>
                    {/* <DropdownItem
                        tag={Link}
                        to={`/apps/user/view/${row.id}`}
                        className='w-100'
                        onClick={() => { }}
                    >
                        <FileText color='skyBlue' size={14} className='mr-50' />
                        <span color='primary' className='align-middle'>Details</span>

                    </DropdownItem> */}

                    <DropdownItem
                        className='w-100'
                        onClick={() => { store.dispatch( getStatusById( row.id ) ); store.dispatch( handleOpenStatusSidebarForEdit( true ) ); }}
                    >
                        <Edit color='green' size={14} className='mr-50' />
                        <span className='align-middle'>Edit</span>
                    </DropdownItem>

                    <DropdownItem
                        className='w-100'
                        onClick={() => store.dispatch( deleteStatus( row.id ) )}
                    >
                        <Trash2 color='red' size={14} className='mr-50' />
                        <span className='align-middle'>Delete</span>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        )
    }

];

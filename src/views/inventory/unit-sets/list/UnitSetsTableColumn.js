import { store } from '@store/storeConfig/store';

import React from 'react';
import { Edit, MoreVertical, PenTool } from 'react-feather';
import { Link } from 'react-router-dom';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { isPermit } from '../../../../utility/Utils';
import { getUnitSetById, handleOpenUnitSetEditSidebar } from '../store/actions';


export const handleGetUnitSetColumns = ( userPermission, authPermissions ) => {
    const unitSetTableColumns = [
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
                        hidden={!isPermit( userPermission?.UnitEdit, authPermissions )}
                        right
                    >

                        {
                            isPermit( userPermission?.UnitEdit, authPermissions ) && (
                                <DropdownItem
                                    className='w-100'
                                    onClick={() => { store.dispatch( getUnitSetById( row.id ) ); store.dispatch( handleOpenUnitSetEditSidebar( true ) ); }}
                                >
                                    <Edit color='green' size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        }
                        {
                            isPermit( userPermission?.UnitEdit, authPermissions ) && (
                                <DropdownItem
                                    tag={Link}
                                    to={`unit-set-assign-unit/${row.id}`}
                                    className='w-100'
                                >
                                    <PenTool color='#6610f2' size={14} className='mr-50' />
                                    <span className='align-middle'>Units</span>
                                </DropdownItem>

                            )
                        }


                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        },
        {
            name: 'Name',
            maxWidth: '250px',
            selector: 'name',
            sortable: true,
            cell: row => row?.name
        },
        {
            name: 'Descriptions',
            minWidth: '200px',
            selector: 'description',
            sortable: true,
            cell: row => row?.description
        }
    ];
    return unitSetTableColumns;
};

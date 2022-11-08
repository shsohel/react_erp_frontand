
import { store } from '@store/storeConfig/store';

import { Edit, Eye, MoreVertical, RotateCcw, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { CustomInput, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { CustomInputLabel } from '../../../../utility/custom/CustomInputLabel';
import { isPermit } from '../../../../utility/Utils';
import { cleanAllConsumptionState, deleteConsumption, retrieveConsumption } from '../store/actions';


export const handleConsumptionColumns = ( userPermission, authPermissions ) => {
    const consumptionsTableColumn = [
        {
            name: 'Actions',
            maxWidth: '80px',
            center: true,
            cell: row => (
                <UncontrolledDropdown>
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu right>
                        {/* {
                            isPermit( userPermission?.ConsumptionEdit, authPermissions ) && (
                                <DropdownItem
                                    hidden={!row.isActive}

                                    tag={Link}
                                    to={{ pathname: row.isPackagingConsumption ? `/edit-consumption-packaging` : row?.isSetConsumption ? `/set-consumptions-edit` : `/consumptions-edit`, state: `${row.id}` }}
                                    className='w-100'
                                    onClick={() => { store.dispatch( cleanAllConsumptionState() ); }}
                                >
                                    <Edit color="green" size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        } */}
                        {
                            isPermit( userPermission?.ConsumptionView, authPermissions ) && (
                                <DropdownItem
                                    hidden={!row.isActive}

                                    tag={Link}
                                    to={{ pathname: row.isPackagingConsumption ? `/edit-consumption-packaging` : row?.isSetConsumption ? `/set-consumptions-edit` : `/consumptions-details`, state: `${row.id}` }}
                                    className='w-100'
                                    onClick={() => { store.dispatch( cleanAllConsumptionState() ); }}
                                >
                                    <Eye color="green" size={14} className='mr-50' />
                                    <span className='align-middle'>View</span>
                                </DropdownItem>
                            )
                        }

                        {
                            isPermit( userPermission?.ConsumptionDelete, authPermissions ) && (
                                <DropdownItem
                                    hidden={!row.isActive}
                                    className='w-100'
                                    onClick={() => store.dispatch( deleteConsumption( row.id ) )}
                                >
                                    <Trash2 color="red" size={14} className='mr-50' />
                                    <span className='align-middle'>Delete</span>
                                </DropdownItem>
                            )
                        }


                        <DropdownItem
                            hidden={row.isActive}
                            className='w-100'
                            onClick={() => store.dispatch( retrieveConsumption( row.id ) )}
                        >
                            <RotateCcw color="green" size={14} className='mr-50' />
                            <span className='align-middle'>Retrieve</span>
                        </DropdownItem>

                    </DropdownMenu>
                </UncontrolledDropdown >
            )
        },
        {
            name: 'SYS ID',
            minWidth: '145px',
            selector: 'sysId',
            sortable: true,
            cell: row => row?.sysId
        },
        {
            name: 'Cons. No',
            minWidth: '200px',
            selector: 'consumptionNumber',
            sortable: true,
            cell: row => row?.consumptionNumber
        },
        {
            name: 'Style No',
            minWidth: '130px',
            selector: 'styles',
            sortable: true,
            cell: row => row?.styles
        },
        {
            name: 'Buyer',
            minWidth: '120px',
            selector: 'buyerName',
            sortable: true,
            cell: row => row?.buyerName
        },
        {
            name: 'Set Consumption ?',
            width: '180px',
            selector: 'isSetConsumption',
            sortable: true,
            center: true,

            cell: row => ( < CustomInput
                type='switch'
                label={< CustomInputLabel />}
                className='custom-control-success'
                id='consumptionTypeIconId'
                name='isSetConsumption'
                inline
                checked={row?.isSetConsumption}
                onChange={( e ) => e.preventDefault()}
                onClick={( e ) => e.preventDefault()}

            />
            )
        },
        // {
        //     name: 'Date',
        //     minWidth: '160px',
        //     selector: 'costingDate',
        //     sortable: true,
        //     cell: row => row?.costingDate
        // },
        // {
        //     name: 'Size Groups',
        //     minWidth: '160px',
        //     selector: 'sizeGroup',
        //     sortable: true,
        //     cell: row => row?.sizeGroup
        // },
        // {
        //     name: 'Color',
        //     minWidth: '140px',
        //     selector: 'colors',
        //     sortable: true,
        //     cell: row => row?.colors?.toString()
        // },
        // {
        //     name: 'UOM',
        //     minWidth: '80px',
        //     selector: 'uom',
        //     sortable: true,
        //     cell: row => row?.uom
        // },
        // {
        //     name: 'Qty.',
        //     minWidth: '80px',
        //     selector: 'quantity',
        //     sortable: true,
        //     cell: row => row?.quantity
        // },
        // {
        //     name: 'Total.',
        //     minWidth: '100px',
        //     selector: 'total',
        //     sortable: true,
        //     cell: row => row?.total
        // },


        {
            name: 'Actions',
            maxWidth: '80px',
            center: true,
            cell: row => (
                <UncontrolledDropdown>
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu right>
                        {
                            isPermit( userPermission?.ConsumptionEdit, authPermissions ) && (
                                <DropdownItem
                                    hidden={!row.isActive}

                                    tag={Link}
                                    to={{ pathname: row.isPackagingConsumption ? `/edit-consumption-packaging` : row?.isSetConsumption ? `/set-consumptions-edit` : `/consumptions-edit`, state: `${row.id}` }}
                                    className='w-100'
                                    onClick={() => { store.dispatch( cleanAllConsumptionState() ); }}
                                >
                                    <Edit color="green" size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        }

                        {
                            isPermit( userPermission?.ConsumptionDelete, authPermissions ) && (
                                <DropdownItem
                                    hidden={!row.isActive}
                                    className='w-100'
                                    onClick={() => store.dispatch( deleteConsumption( row.id ) )}
                                >
                                    <Trash2 color="red" size={14} className='mr-50' />
                                    <span className='align-middle'>Delete</span>
                                </DropdownItem>
                            )
                        }


                        <DropdownItem
                            hidden={row.isActive}
                            className='w-100'
                            onClick={() => store.dispatch( retrieveConsumption( row.id ) )}
                        >
                            <RotateCcw color="green" size={14} className='mr-50' />
                            <span className='align-middle'>Retrieve</span>
                        </DropdownItem>

                    </DropdownMenu>
                </UncontrolledDropdown >
            )
        }
    ];
    return consumptionsTableColumn;
};
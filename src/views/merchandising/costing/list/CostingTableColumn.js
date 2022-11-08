
import { store } from '@store/storeConfig/store';

import { Edit, MoreVertical, RotateCcw, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { CustomInput, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { CustomInputLabel } from '../../../../utility/custom/CustomInputLabel';
import { isPermit, isZeroToFixed } from '../../../../utility/Utils';
import { deleteCosting, getCostingById, retrieveCosting } from '../store/action';


export const handleGetCostingColumns = ( userPermission, authPermissions ) => {
    const costingTableColumn = [
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
                            isPermit( userPermission?.CostingEdit, authPermissions ) && (
                                <DropdownItem
                                    hidden={!row.isActive}
                                    tag={Link}
                                    // to={`/costings-edit/${row.id}`}
                                    to={{ pathname: row?.isSetCosting ? `/set-costings-edit` : `/costings-edit`, state: `${row.id}` }}
                                    className='w-100'
                                    onClick={() => { store.dispatch( getCostingById( null ) ); }}
                                >
                                    <Edit color="green" size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        } */}
                        {
                            isPermit( userPermission?.CostingView, authPermissions ) && (
                                <DropdownItem
                                    hidden={!row.isActive}
                                    tag={Link}
                                    // to={`/costings-edit/${row.id}`}
                                    to={{ pathname: row?.isSetCosting ? `/set-costings-details` : `/costings-details`, state: `${row.id}` }}
                                    className='w-100'
                                    onClick={() => { store.dispatch( getCostingById( null ) ); }}
                                >
                                    <Edit color="green" size={14} className='mr-50' />
                                    <span className='align-middle'>View</span>
                                </DropdownItem>
                            )
                        }
                        {
                            isPermit( userPermission?.CostingDelete, authPermissions ) && (
                                <DropdownItem
                                    hidden={!row.isActive}

                                    className='w-100'
                                    onClick={() => store.dispatch( deleteCosting( row.id ) )}
                                >
                                    <Trash2 color="red" size={14} className='mr-50' />
                                    <span className='align-middle'>Delete</span>
                                </DropdownItem>
                            )
                        }


                        <DropdownItem
                            hidden={row.isActive}
                            className='w-100'
                            onClick={() => store.dispatch( retrieveCosting( row.id ) )}
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
            name: 'Costing No',
            minWidth: '155px',
            selector: 'costingNumber',
            sortable: true,
            cell: row => row?.costingNumber
        },

        {
            name: 'Buyer',
            minWidth: '120px',
            selector: 'buyerName',
            sortable: true,
            cell: row => row?.buyerName
        },
        {
            name: 'Style',
            minWidth: '120px',
            selector: 'styles',
            sortable: true,
            cell: row => row?.styles
        },

        {
            name: 'Qty.',
            width: '80px',
            selector: 'costingQuantity',
            sortable: true,
            right: true,
            cell: row => row?.costingQuantity
        },
        {
            name: 'UOM',
            width: '80px',
            selector: 'costingUom',
            sortable: true,
            center: true,
            cell: row => row.costingUom
        },

        {
            name: 'Total Quoted Price',
            width: '160px',
            selector: 'totalQuotedPrice',
            sortable: true,
            right: true,
            cell: row => isZeroToFixed( row?.totalQuotedPrice, 4 )
        },
        {
            name: 'Currency',
            width: '150px',
            selector: 'currency',
            sortable: true,
            center: true,
            cell: row => row?.currency
        },


        {
            name: 'Set Costing ?',
            width: '150px',
            selector: 'isSetCosting',
            sortable: true,
            center: true,

            cell: row => (
                row?.isSetCosting ? ( < CustomInput
                    type='switch'
                    label={< CustomInputLabel />}
                    className='custom-control-success'
                    id='icon-success'
                    name='icon-success'
                    inline defaultChecked
                    onChange={( e ) => e.preventDefault()}
                    onClick={( e ) => e.preventDefault()}

                /> ) : < CustomInput
                    type='switch'
                    label={< CustomInputLabel />}
                    className='custom-control-success'
                    id='icon-success'
                    name='icon-success'
                    inline
                    onChange={( e ) => e.preventDefault()}
                    onClick={( e ) => e.preventDefault()}
                />
            )
        },
        {
            name: 'Status',
            width: '160px',
            selector: 'status',
            sortable: true,
            center: true,
            cell: row => row?.status
        }

    ];
    return costingTableColumn;
};

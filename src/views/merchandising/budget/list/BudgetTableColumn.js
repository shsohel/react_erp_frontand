import { store } from '@store/storeConfig/store';
import moment from 'moment';
import { Eye, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { isPermit } from '../../../../utility/Utils';
import { deleteBudget } from '../store/actions';


export const handleGetBudgetColumns = ( userPermission, authPermissions ) => {
    const budgetTableColumns = [
        {
            name: 'Actions',
            maxWidth: '100px',
            center: true,
            cell: row => (
                <UncontrolledDropdown>
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical
                            size={14} className='cursor-pointer'

                        />
                    </DropdownToggle>
                    <DropdownMenu
                        hidden={!isPermit( userPermission?.BudgetView, authPermissions ) && !isPermit( userPermission?.BudgetDelete, authPermissions )}
                        right
                    >
                        {/* {
                            isPermit( userPermission?.BudgetEdit, authPermissions ) && (
                                <DropdownItem
                                    tag={Link}
                                    to={{ pathname: `/edit-budget`, state: `${row.id}` }}
                                    className='w-100'
                                // onClick={() => { store.dispatch( getBudgetById( row.id ) ); }}
                                >
                                    <Edit3 color='green' size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        } */}
                        {
                            isPermit( userPermission?.BudgetView, authPermissions ) && (
                                <DropdownItem
                                    tag={Link}
                                    to={{ pathname: `/budget-details`, state: `${row.id}` }}
                                    className='w-100'
                                // onClick={() => { store.dispatch( getBudgetById( row.id ) ); }}
                                >
                                    <Eye color='green' size={14} className='mr-50' />
                                    <span className='align-middle'>View</span>
                                </DropdownItem>
                            )
                        }
                        {
                            isPermit( userPermission?.BudgetDelete, authPermissions ) && (
                                <DropdownItem className='w-100' onClick={() => store.dispatch( deleteBudget( row.id ) )}>
                                    <Trash2 color="red" size={14} className='mr-50' />
                                    <span className='align-middle'>Delete</span>
                                </DropdownItem>
                            )
                        }


                        {/* <DropdownItem
                        className='w-100'
                        tag={Link}
                        to={`/edit-budget/${row.id}`}
                    >
                        <Edit color='green' size={14} className='mr-50' />
                        <span className='align-middle'>Edit</span>
                    </DropdownItem> */}

                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        },
        {
            name: 'SYS ID',
            minWidth: '200px',
            selector: 'sysId',
            sortable: true,
            cell: row => row.sysId
        },
        {
            name: 'Budget No',
            minWidth: '200px',
            selector: 'budgetNumber',
            sortable: true,
            cell: row => row.budgetNumber
        },

        {
            name: 'Buyer',
            minWidth: '200px',
            selector: 'buyerName',
            sortable: true,
            cell: row => row.buyerName
        },
        {
            name: 'Style',
            minWidth: '200px',
            selector: 'styles',
            sortable: true,
            cell: row => row.styles
        },
        {
            name: 'Budget Category',
            minWidth: '200px',
            selector: 'budgetCategory',
            sortable: true,
            cell: row => row.budgetCategory
        },
        {
            name: 'Approved Date',
            minWidth: '200px',
            selector: 'approvalDate',
            sortable: true,
            cell: row => ( row.approvedDate ? moment( Date.parse( row.approvedDate ) ).format( 'DD/MM/YYYY' ) : '' )
        },
        {
            name: 'Status',
            maxWidth: '108px',
            selector: 'status',
            sortable: false,
            center: true,
            cell: row => row.status
        }


    ];
    return budgetTableColumns;
};

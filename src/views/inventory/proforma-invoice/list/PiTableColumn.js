import { store } from '@store/storeConfig/store';

import { Eye, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { isPermit } from '../../../../utility/Utils';
import { deletePI } from '../store/actions';


export const handleGetPiColumns = ( userPermission, authPermissions ) => {

    const piTableColumns = [
        {
            name: '#',
            width: '50px',
            center: true,
            cell: ( row, index ) => index + 1
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
                        hidden={!isPermit( userPermission?.ProformaInvoiceEdit, authPermissions ) &&
                            !isPermit( userPermission?.ProformaInvoiceDelete, authPermissions )}
                        right>
                        {/* {
                            isPermit( userPermission?.ProformaInvoiceEdit, authPermissions ) && (
                                <DropdownItem
                                    tag={Link}
                                    className='w-100'
                                    to={{ pathname: `/edit-pi`, state: `${row.id}` }}
                                >
                                    <Edit color="green" size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        } */}
                        {
                            isPermit( userPermission?.ProformaInvoiceView, authPermissions ) && (
                                <DropdownItem
                                    tag={Link}
                                    className='w-100'
                                    to={{ pathname: `/pi-details`, state: `${row.id}` }}
                                >
                                    <Eye color="green" size={14} className='mr-50' />
                                    <span className='align-middle'>View</span>
                                </DropdownItem>
                            )
                        }
                        {
                            isPermit( userPermission?.ProformaInvoiceDelete, authPermissions ) && (
                                <DropdownItem

                                    className='w-100'
                                    onClick={() => store.dispatch( deletePI( row.id ) )}
                                >
                                    <Trash2 color="red" size={14} className='mr-50' />
                                    <span className='align-middle'>Delete</span>
                                </DropdownItem>
                            )
                        }

                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        },

        {
            name: 'SYS ID',
            minWidth: '150px',
            selector: 'sysId',
            sortable: true,
            cell: row => row.sysId
        },
        {
            name: 'IPI NO',
            minWidth: '150px',
            selector: 'piNumber',
            sortable: true,
            cell: row => row.piNumber
        },
        {
            name: 'IPO NO',
            minWidth: '150px',
            selector: 'orderNumbers',
            sortable: true,
            cell: row => row.orderNumbers
        },
        {
            name: 'Buyer',
            minWidth: '160px',
            selector: 'buyerName',
            sortable: true,
            cell: row => row.buyerName
        },
        {
            name: 'Budget No',
            minWidth: '170px',
            selector: 'budgetNumbers',
            sortable: true,
            cell: row => row.budgetNumbers
        },
        {
            name: 'Style No',
            minWidth: '160px',
            selector: 'styleNumbers',
            sortable: true,
            cell: row => row.styleNumbers
        },
        {
            name: 'PO No',
            minWidth: '170px',
            selector: 'buyerPONumbers',
            sortable: true,
            cell: row => row.buyerPONumbers
        },

        {
            name: 'Supplier',
            minWidth: '160px',
            selector: 'supplier',
            sortable: true,
            cell: row => row.supplier
        },

        {
            name: 'Purpose',
            minWidth: '150px',
            selector: 'purpose',
            sortable: true,
            cell: row => row.purpose
        },

        {
            name: 'Pay Term',
            maxWidth: '108px',
            selector: 'payTerm',
            sortable: false,
            center: true,

            cell: row => row.payTerm
        },
        {
            name: 'Source',
            maxWidth: '108px',
            selector: 'source',
            sortable: false,
            center: true,

            cell: row => row.source ?? ''
        },
        {
            name: 'Amount',
            maxWidth: '108px',
            selector: 'amount',
            sortable: false,
            center: true,

            cell: row => row.amount
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

    return piTableColumns;
};

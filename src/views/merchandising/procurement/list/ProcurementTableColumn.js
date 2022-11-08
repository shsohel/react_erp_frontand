import { store } from '@store/storeConfig/store';

import { Eye, MoreVertical, Search, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';
import { isPermit } from '../../../../utility/Utils';
import { deleteProcurement, handleProcurementToPi } from '../store/actions';


export const handleGetProcurementColumns = ( userPermission, authPermissions ) => {
    const procurementTableColumns = [
        {
            name: '#',
            width: '50px',
            center: true,
            cell: ( row, index ) => index + 1
        },
        {
            name: 'Actions',
            width: '80px',
            center: true,
            cell: row => (
                <UncontrolledDropdown>
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu
                        right
                        hidden={!isPermit( userPermission?.ProformaInvoiceList, authPermissions ) &&
                            !isPermit( userPermission?.SupplierOrderEdit, authPermissions ) &&
                            !isPermit( userPermission?.SupplierOrderDelete, authPermissions )}
                    >


                        {/* {
                            isPermit( userPermission?.SupplierOrderEdit, authPermissions ) && (
                                <DropdownItem
                                    tag={Link}
                                    className='w-100'
                                    to={{ pathname: row.isNormalOrder ? `/edit-independent-procurement` : `/edit-procurement`, state: `${row.id}` }}
                                >
                                    <Edit color="green" size={14} className='mr-50' />
                                    <span className='align-middle'>Edit</span>
                                </DropdownItem>
                            )
                        } */}
                        {
                            isPermit( userPermission?.SupplierOrderView, authPermissions ) && (
                                <DropdownItem
                                    tag={Link}
                                    className='w-100'
                                    to={{ pathname: row.isNormalOrder ? `/independent-procurement-details` : `/procurement-details`, state: `${row.id}` }}
                                >
                                    <Eye color="green" size={14} className='mr-50' />
                                    <span className='align-middle'>View</span>
                                </DropdownItem>
                            )
                        }
                        {
                            isPermit( userPermission?.ProformaInvoiceList, authPermissions ) && (
                                <DropdownItem
                                    tag={Link}
                                    // target="_blank"

                                    className='w-100'
                                    to='/pis'
                                    onClick={() => store.dispatch( handleProcurementToPi( row ) )}

                                >
                                    <Search color="purple" size={14} className='mr-50' />
                                    <span className='align-middle'>IPI</span>
                                </DropdownItem>
                            )
                        }

                        {
                            isPermit( userPermission?.SupplierOrderDelete, authPermissions ) && (
                                <DropdownItem

                                    className='w-100'
                                    onClick={() => store.dispatch( deleteProcurement( row.id ) )}
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
            minWidth: '120px',
            selector: 'sysId',
            sortable: true,
            cell: row => row.sysId
        },
        {
            name: 'IPO No',
            minWidth: '150px',
            selector: 'orderNumber',
            sortable: true,
            cell: row => row.orderNumber
        },
        {
            name: 'Buyer',
            minWidth: '150px',
            selector: 'buyerName',
            sortable: true,
            cell: row => row.buyerName
        },
        {
            name: 'Supplier',
            minWidth: '150px',
            selector: 'supplier',
            sortable: true,
            cell: row => row.supplier
        },
        {
            name: 'Style No',
            minWidth: '150px',
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
            name: 'Budget NO',
            minWidth: '170px',
            selector: 'budgetNumbers',
            sortable: true,
            cell: row => row.budgetNumbers
        },

        {
            name: 'Order Nature',
            minWidth: '150px',
            selector: 'orderNature',
            sortable: true,
            cell: row => row.orderNature
        },
        {
            name: 'Source',
            minWidth: '150px',
            selector: 'source',
            sortable: true,
            cell: row => row.source ?? ''
        },
        {
            name: 'Amount',
            minWidth: '100px',
            selector: 'amount',
            sortable: true,
            right: true,
            cell: row => row.amount
        },
        // {
        //     name: 'Total Amount',
        //     minWidth: '200px',
        //     selector: 'totalAmount',
        //     sortable: true,
        //     cell: row => row.totalAmount
        // },

        {
            name: 'is Independent ?',
            width: '125px',
            selector: 'isNormalOrder',
            center: true,
            sortable: false,
            cell: row => (
                row.isNormalOrder ? "INDEPENDENT" : "BOM"
                // < CustomInput
                //     type='switch'
                //     label={< CustomInputLabel />}
                //     className='custom-control-success'
                //     id='icon-success'
                //     name='icon-success'
                //     inline
                //     checked={row.isNormalOrder}
                //     onChange={( e ) => e.preventDefault()}
                //     onClick={( e ) => e.preventDefault()}
                // />
            )
        },

        {
            name: 'Status',
            minWidth: '100px',
            selector: 'status',
            sortable: true,
            center: true,
            cell: row => row.status
        }


    ];
    return procurementTableColumns;
};

// import '@custom-styles/basic/custom-switch-erp.scss';
import { store } from '@store/storeConfig/store';

import React from 'react';
import { DollarSign, Edit, FileText, Mail, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { CustomInput, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { CustomInputLabel } from '../../../../utility/custom/CustomInputLabel';
import { deletePurchaseOrder } from '../store/actions';


const statusObj = {
    pending: 'light-warning',
    active: 'light-success',
    inactive: 'light-secondary'
};

export const purchaseOrderTableColumn = [
    {
        name: 'PO NO',
        minWidth: '140px',
        selector: 'orderNumber',
        sortable: true,
        cell: row => row.orderNumber
    },
    {
        name: 'Season',
        minWidth: '140px',
        selector: 'season',
        sortable: true,
        cell: row => row.season
    },
    {
        name: 'Year',
        minWidth: '140px',
        selector: 'year',
        sortable: true,
        cell: row => row.year
    },
    {
        name: 'Buyer',
        minWidth: '140px',
        selector: 'buyerName',
        sortable: true,
        cell: row => row?.buyerName
    },
    {
        name: 'Date',
        minWidth: '140px',
        selector: 'orderDate',
        sortable: true,
        cell: row => row.orderDate
    },
    {

        name: 'Quantity',
        minWidth: '140px',
        selector: 'totalOrderQuantity',
        sortable: true,
        cell: row => row.totalOrderQuantity
    },
    {
        name: 'is-Set Order',
        maxWidth: '120px',
        selector: 'isSetOrder',
        sortable: true,
        center: true,
        cell: row => (
            row?.isSetOrder ? ( < CustomInput
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
    // {
    //     name: 'Status',
    //     maxWidth: '108px',
    //     selector: 'status',
    //     sortable: true,
    //     cell: row => (
    //         <Badge className='text-capitalize' color={statusObj[row.status]} pill>
    //             {row.status}
    //         </Badge>
    //     )
    // },
    {
        name: 'Actions',
        maxWidth: '100px',
        cell: row => (
            <UncontrolledDropdown>
                <DropdownToggle tag='div' className='btn btn-sm'>
                    <MoreVertical size={14} className='cursor-pointer' />
                </DropdownToggle>
                <DropdownMenu right >
                    <DropdownItem
                        className='w-100'
                        tag={Link}
                        to={{
                            pathname: `/new-costing`,
                            state: {
                                orderId: row?.id,
                                orderNumber: row?.orderNumber,
                                buyerId: row?.buyerId,
                                buyerName: row?.buyerName
                            }
                        }}
                    >
                        <DollarSign color="green" size={14} className='mr-50' />
                        <span className='align-middle'>Costing</span>
                    </DropdownItem>
                    <DropdownItem
                        tag={Link}
                        className='w-100'
                        to={row?.isSetOrder ? `/new-set-packaging/${row?.id}` : `/new-single-packaging/${row?.id}`}
                    >
                        <DollarSign color="green" size={14} className='mr-50' />
                        <span className='align-middle'>Packaging</span>
                    </DropdownItem>
                    <DropdownItem
                        tag={Link}
                        to={{ pathname: `/purchase-order-details`, state: `${row.id}` }}
                        className='w-100'
                    >
                        <FileText color="skyBlue" size={14} className='mr-50' />
                        <span color="primary" className='align-middle'>Details</span>
                    </DropdownItem>
                    <DropdownItem
                        tag={Link}
                        className='w-100'
                        to={{ pathname: `/purchase-order-edit`, state: `${row.id}` }}
                    >
                        <Edit color="green" size={14} className='mr-50' />
                        <span className='align-middle'>Edit</span>
                    </DropdownItem>
                    <DropdownItem className='w-100' onClick={() => store.dispatch( deletePurchaseOrder( row.id ) )}>
                        <Trash2 color="red" size={14} className='mr-50' />
                        <span className='align-middle'>Delete</span>
                    </DropdownItem>
                    <DropdownItem
                        className='w-100'
                        onClick={( e ) => { e.preventDefault(); }}
                    >
                        <Mail color="green" size={14} className='mr-50' />
                        <span className='align-middle'>Forward</span>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown >
        )
    }
];

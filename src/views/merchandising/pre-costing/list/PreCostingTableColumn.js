
import Avatar from '@components/avatar';
import { store } from '@store/storeConfig/store';

import { Edit, FileText, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { deletePreCosting, getPreCostingById } from '../store/action';


// ** Renders Client Columns
const renderClient = row => {
    const stateNum = Math.floor( Math.random() * 6 ),
        states = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary'],
        color = states[stateNum];

    if ( row.avatar.length ) {
        return <Avatar className='mr-1' img={row.avatar} width='32' height='32' />;
    } else {
        return <Avatar color={color || 'primary'} className='mr-1' content={row.fullName || 'John Doe'} initials />;
    }
};


const statusObj = {
    pending: 'light-warning',
    active: 'light-success',
    inactive: 'light-secondary'
};

export const preCostingsTableColumn = [
    {
        name: 'Style No',
        minWidth: '130px',
        selector: 'styleNo',
        sortable: true,
        cell: row => row.styleNo
    },
    {
        name: 'Costing No',
        minWidth: '145px',
        selector: 'costingNo',
        sortable: true,
        cell: row => row.costingNo
    },
    {
        name: 'Buyer',
        minWidth: '120px',
        selector: 'buyerName',
        sortable: true,
        cell: row => row.buyer.buyerName
    },
    {
        name: 'Buyer Po No',
        minWidth: '160px',
        selector: 'buyerPoNo',
        sortable: true,
        cell: row => row.buyerPoNo
    },
    {
        name: 'Costing Date',
        minWidth: '160px',
        selector: 'costingDate',
        sortable: true,
        cell: row => row.costingDate
    },
    {
        name: 'Size Groups',
        minWidth: '160px',
        selector: 'sizeGroup',
        sortable: true,
        cell: row => row.sizeGroup
    },
    {
        name: 'Color',
        minWidth: '140px',
        selector: 'colors',
        sortable: true,
        cell: row => row.colors.toString()
    },
    {
        name: 'UOM',
        minWidth: '80px',
        selector: 'uom',
        sortable: true,
        cell: row => row.uom
    },
    {
        name: 'Qty.',
        minWidth: '80px',
        selector: 'quantity',
        sortable: true,
        cell: row => row.quantity
    },
    {
        name: 'Total.',
        minWidth: '100px',
        selector: 'total',
        sortable: true,
        cell: row => row.total
    },

    {
        name: 'Status',
        maxWidth: '108px',
        selector: 'status',
        sortable: false,
        cell: row => (
            <Badge className='text-capitalize' color={statusObj[row.status]} pill>
                {row.status}
            </Badge>
        )
    },
    {
        name: 'Actions',
        maxWidth: '80px',
        cell: row => (
            <UncontrolledDropdown>
                <DropdownToggle tag='div' className='btn btn-sm'>
                    <MoreVertical size={14} className='cursor-pointer' />
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem
                        tag={Link}
                        to={`/merchandising/pre-costing/view/${row.id}`}
                        className='w-100'
                        onClick={() => { }}
                    >
                        <FileText color="skyBlue" size={14} className='mr-50' />
                        <span color="primary" className='align-middle'>Details</span>
                    </DropdownItem>
                    <DropdownItem
                        tag={Link}
                        to={`/pre-costings-edit`}
                        className='w-100'
                        onClick={() => { store.dispatch( getPreCostingById( row.id ) ); }}
                    >
                        <Edit color="green" size={14} className='mr-50' />
                        <span className='align-middle'>Edit</span>
                    </DropdownItem>
                    <DropdownItem className='w-100' onClick={() => store.dispatch( deletePreCosting( row.id ) )}>
                        <Trash2 color="red" size={14} className='mr-50' />
                        <span className='align-middle'>Delete</span>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown >
        )
    }
];

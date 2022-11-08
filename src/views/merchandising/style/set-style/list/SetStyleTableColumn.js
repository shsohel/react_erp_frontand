
import Avatar from '@components/avatar';
import { store } from '@store/storeConfig/store';

import { Edit, MoreVertical, RefreshCcw, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { handleNewStylePurchaseOrder, handleOpenStyleConsumptions, handleOpenStyleCosting } from '../../../purchase-order/store/actions';
import { deleteSetStyle, retrieveSetStyle } from '../store/actions';


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

export const setStylesTableColumn = [
    {
        name: 'SYS ID',
        maxWidth: '150px',
        selector: 'sysId',
        sortable: true,
        cell: row => row.sysId
    },
    {
        name: 'Style No',
        minWidth: '200px',
        selector: 'styleNo',
        sortable: true,
        cell: row => row.styleNo
    },
    {
        name: 'Buyer',
        minWidth: '200px',
        selector: 'buyerName',
        sortable: true,
        cell: row => row.buyerName
    },
    {
        name: 'Season',
        minWidth: '200px',
        selector: 'season',
        sortable: true,
        cell: row => row.season
    },
    {
        name: 'Year',
        minWidth: '100px',
        selector: 'year',
        sortable: true,
        cell: row => row?.year
    },

    {
        name: 'Status',
        maxWidth: '150px',
        selector: 'status',
        sortable: false,
        cell: row => row?.status
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
                    <DropdownItem
                        hidden={!row.isActive}

                        tag={Link}
                        target="_blank"
                        className='w-100'
                        to={{
                            pathname: `/stye-purchase-order`,
                            state: {
                                id: row.id,
                                styleNo: row.styleNo
                            }
                        }}
                        onClick={() => store.dispatch( handleNewStylePurchaseOrder( row.id, row.styleNo, row.buyerName, row?.buyerId, 'set-styles', true, row?.status, row?.isSizeSpecific, row?.isColorSpecific ) )}
                    >
                        <Edit color="green" size={14} className='mr-50' />
                        <span className='align-middle'>Purchase Order</span>
                    </DropdownItem>
                    <DropdownItem
                        hidden={!row.isActive}

                        tag={Link}
                        target="_blank"
                        // forceRefresh={false}
                        className='w-100'
                        to={{
                            pathname: `/costings`,
                            state: {
                                column: "styleId",
                                operator: "string",
                                value: row.id,
                                isSetStyle: true
                            }
                        }}
                        onClick={() => store.dispatch( handleOpenStyleCosting( row.id, row.styleNo, true ) )}

                    >
                        <Edit color="green" size={14} className='mr-50' />
                        <span className='align-middle'>Costing</span>
                    </DropdownItem>
                    <DropdownItem
                        hidden={!row.isActive}

                        tag={Link}
                        target="_blank"
                        className='w-100'
                        to={{
                            pathname: `/consumptions`,
                            state: {
                                column: "styleId",
                                operator: "string",
                                value: row.id,
                                isSetStyle: true
                            }
                        }}
                        onClick={() => store.dispatch( handleOpenStyleConsumptions( row.id, row.styleNo, true ) )}

                    >
                        <Edit color="green" size={14} className='mr-50' />
                        <span className='align-middle'>Consumption</span>
                    </DropdownItem>
                    {/* <DropdownItem
                        tag={Link}
                        to={`/set-style-details/${row.id}`}
                        className='w-100'
                        onClick={() => { }}
                    >
                        <FileText color="skyBlue" size={14} className='mr-50' />
                        <span color="primary" className='align-middle'>Details</span>
                    </DropdownItem> */}
                    <DropdownItem
                        hidden={!row.isActive}

                        tag={Link}
                        to={`/edit-set-style/${row.id}`}
                        className='w-100'
                    //onClick={() => { store.dispatch( getSetStyleById( row.id ) ); }}
                    >
                        <Edit color="green" size={14} className='mr-50' />
                        <span className='align-middle'>Edit</span>
                    </DropdownItem>
                    <DropdownItem
                        hidden={!row.isActive}

                        className='w-100'
                        onClick={() => store.dispatch( deleteSetStyle( row.id ) )}>
                        <Trash2 color="red" size={14} className='mr-50' />
                        <span className='align-middle'>Delete</span>
                    </DropdownItem>
                    <DropdownItem
                        hidden={row.isActive}
                        className='w-100'
                        onClick={() => store.dispatch( retrieveSetStyle( row.id ) )}>
                        <RefreshCcw color="red" size={14} className='mr-50' />
                        <span className='align-middle'>Retrieve</span>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown >
        )
    }
];

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, Settings, XSquare } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardBody, DropdownItem, DropdownMenu, DropdownToggle, NavItem, NavLink, UncontrolledButtonDropdown, UncontrolledTooltip } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { deleteRangePurchaseOrder, getPurchaseOrdersByQuery } from '../store/actions';
import PurchaseOrderExpandRow from './PurchaseOrderExpandRow';
import { purchaseOrderTableColumn } from './PurchaseOrderTableColumns';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'poList',
        name: 'PO',
        link: "/purchase-order",
        isActive: true
    }
];

const PurchaseOrderList = ( { purchaseOrders, total, queryData, toggleForm } ) => {
    const dispatch = useDispatch();
    const { push } = useHistory();

    // ** Global States

    // ** Local States
    const [searchTerm, setSearchTerm] = useState( '' );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'asc' );
    const [sortedColumn, setSortedColumn] = useState( 'id' );
    const [currentDepartment, setCurrentDepartment] = useState( { value: '', label: 'Select Division', number: 0 } );
    const [currentStatus, setCurrentStatus] = useState( { value: '', label: 'Select Status', number: 0 } );
    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );

    useEffect( () => {
        dispatch(
            getPurchaseOrdersByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                status: currentStatus.value,
                q: searchTerm,
                sortedBy,
                sortedColumn
            } )
        );
    }, [dispatch, queryData.length] );
    // ** Function in get data on page change
    const handlePagination = page => {
        dispatch(
            getPurchaseOrdersByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                status: currentStatus.value,
                q: searchTerm,
                sortedBy,
                sortedColumn
            } )
        );
        setCurrentPage( page.selected + 1 );
    };

    // ** Function in get data on rows per page
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        dispatch(
            getPurchaseOrdersByQuery( {
                page: currentPage,
                perPage: value,
                status: currentStatus.value,
                q: searchTerm,
                sortedBy,
                sortedColumn
            } )
        );
        setRowsPerPage( value );
    };
    // ** Function in get data on search query change
    const handleFilter = val => {
        setSearchTerm( val );
        dispatch(
            getPurchaseOrdersByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                status: currentStatus.value,
                q: val,
                sortedBy,
                sortedColumn
            } )
        );
    };
    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( direction );
        setSortedColumn( selector );
        dispatch(
            getPurchaseOrdersByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                status: currentStatus.value,
                q: searchTerm,
                sortedBy: direction,
                sortedColumn: selector
            } )
        );
    };
    // ** Custom Pagination
    const CustomPagination = () => {
        const count = Number( Math.ceil( total / rowsPerPage ) );

        return (
            <ReactPaginate
                previousLabel={''}
                nextLabel={''}
                pageCount={count || 1}
                activeClassName='active'
                forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                onPageChange={page => handlePagination( page )}
                pageClassName={'page-item'}
                nextLinkClassName={'page-link'}
                nextClassName={'page-item next'}
                previousClassName={'page-item prev'}
                previousLinkClassName={'page-link'}
                pageLinkClassName={'page-link'}
                containerClassName={'pagination react-paginate justify-content-end my-2 pr-1'}
            />
        );
    };

    // ** Table data to render
    const dataToRender = () => {
        const filters = {
            status: currentStatus.value,
            division: currentDepartment.value,
            q: searchTerm
        };

        const isFiltered = Object.keys( filters ).some( function ( k ) {
            return filters[k].length > 0;
        } );


        if ( queryData.length > 0 ) {
            return queryData;
        } else if ( queryData.length === 0 && isFiltered ) {
            return [];
        } else {
            return purchaseOrders.slice( 0, rowsPerPage );
        }
    };

    // ** Start For Multiple Rows for Get IDs
    const handleRowSelected = ( rows ) => {
        const rowsId = rows.selectedRows.map( item => item.id );
        setSelectedRowId( rowsId );
        setClearSelectedRow( false );
    };
    // **Clear Delete Ids
    const handleClearSelected = () => {
        setClearSelectedRow( true );
        dispatch(
            getPurchaseOrdersByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                division: currentDepartment.value,
                status: currentStatus.value,
                q: searchTerm,
                sortedBy,
                sortedColumn
            } )
        );
    };

    // ** Delete Rang
    const handleDeletePurchaseOrderRange = () => {
        dispatch( deleteRangePurchaseOrder( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range

    const handleAddNew = () => {
        push( '/new-purchase-order' );
    };
    return (
        <div>
            <Card className="mt-3">
                <ActionMenu
                    breadcrumb={breadcrumb}
                    title='Purchase Orders'
                    middleNavButton={
                        <UncontrolledButtonDropdown>
                            <DropdownToggle color='flat-primary' className="p-0" size="sm">
                                <Settings size={18} />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => { console.log( 'hel' ); }}>
                                    Print
                                </DropdownItem>

                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                    }
                >
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="success"
                            onClick={() => { handleAddNew(); }}                    >
                            Add New
                        </NavLink>
                    </NavItem>
                </ActionMenu>
                <CardBody>
                    <div >
                        <TableCustomerHeader
                            handlePerPage={handlePerPage}
                            rowsPerPage={rowsPerPage}
                            searchTerm={searchTerm}
                        >
                            <Button.Ripple

                                onClick={() => console.log( 'E' )}
                                className='btn-icon'
                                color='flat-primary'
                                id='positionBottom'
                            >
                                <Filter size={18} />
                            </Button.Ripple>
                            <UncontrolledTooltip placement='bottom-end' target='positionBottom'>
                                Filter
                            </UncontrolledTooltip>
                        </TableCustomerHeader>
                        <DataTable
                            // style={{ minHeight: '0px' }}
                            onSelectedRowsChange={handleRowSelected}
                            onSort={handleSort}
                            // contextMessage={}
                            contextActions={<Button.Ripple onClick={() => { handleDeletePurchaseOrderRange(); }} className='btn-icon ' color='flat-danger'>
                                <XSquare size={24} />
                            </Button.Ripple>}
                            dense
                            highlightOnHover
                            persistTableHead
                            selectableRows
                            clearSelectedRows={clearSelectedRow}
                            responsive={true}
                            paginationServer
                            expandableRows={false}
                            expandableRowsComponent={<PurchaseOrderExpandRow data={data => data} />}
                            expandOnRowClicked
                            columns={purchaseOrderTableColumn}
                            sortIcon={<ChevronDown />}
                            className='react-dataTable text-nowrap'
                            data={dataToRender()}
                        />
                    </div>
                    <div>
                        <CustomPagination />
                    </div>
                </CardBody>

            </Card>

        </div>
    );
};

export default PurchaseOrderList;

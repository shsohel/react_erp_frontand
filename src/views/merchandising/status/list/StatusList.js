import { store } from '@store/storeConfig/store';

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, Settings, XSquare } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from "react-redux";
import { Button, CardBody, DropdownItem, DropdownMenu, DropdownToggle, NavItem, NavLink, UncontrolledButtonDropdown, UncontrolledTooltip } from "reactstrap";
import Card from 'reactstrap/lib/Card';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import StatusAddForm from '../form/StatusAddForm';
import StatusEditForm from '../form/StatusEditForm';
import { deleteRangeStatus, getStatusByQuery, handleOpenStatusSidebar, handleOpenStatusSidebarForEdit } from '../store/actions';
import { StatusTableColumns } from './StatusTableColumn';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'statusesList',
        name: 'Statuses',
        link: "/statuses",
        isActive: true
    }
];

const StatusList = () => {
    const defaultFilterValue = {
        name: ''
    };

    const defaultFilteredArrayValue = [
        {
            column: "name",
            value: ''
        }

    ];
    const dispatch = useDispatch();
    const [filterObj, setFilterObj] = useState( defaultFilterValue );

    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    // ** Global States
    const { statuses, total, selectedStatus, openStatusSidebar, openStatusSidebarForEdit, queryData } = useSelector( ( { statuses } ) => statuses );
    // ** Season States
    const [searchTerm, setSearchTerm] = useState( '' );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'name' );

    const [orderBy, setOrderBy] = useState( 'asc' );
    const [currentStatus, setCurrentStatus] = useState( { value: '', label: 'Select Status', number: 0 } );

    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );


    // ** Global Function to toggle sidebar for Buyer Department
    const toggleSidebar = () => store.dispatch( handleOpenStatusSidebar( !openStatusSidebar ) );
    const toggleSidebarForEdit = () => store.dispatch( handleOpenStatusSidebarForEdit( !openStatusSidebarForEdit ) );


    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };

    const filteredData = filteredArray.filter( filter => filter.value.length );

    const getAllColors = () => {
        dispatch( getStatusByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        getAllColors();
    }, [] );

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getStatusByQuery( paramsObj, [] ) );
    };

    const handleSearch = () => {
        dispatch(
            getStatusByQuery( paramsObj, filteredData )
        );
    };

    const handleFilterBoxOnChange = ( e ) => {
        const { name, value } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: value
        } );
        const updatedData = filteredArray.map( filter => {
            if ( name === filter.column ) {
                filter['value'] = value;
            }
            return filter;
        } );
        setFilteredArray( updatedData );
        //const updatedData= filteredArray.
    };


    // ** Function in get data on page change
    const handlePagination = page => {
        dispatch(
            getStatusByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };


    // ** Function in get data on rows per page
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        dispatch(
            getStatusByQuery( {
                page: currentPage,
                perPage: value,
                sortedBy,
                orderBy
            }, filteredData )
        );
        setRowsPerPage( value );
    };


    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getStatusByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction
            }, filteredData )
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
            return statuses.slice( 0, rowsPerPage );
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
            getStatusByQuery( {
                page: currentPage,
                perPage: rowsPerPage
                // status: currentStatus.value,
                // q: searchTerm,
                // sortedBy,
                // sortedColumn
            } )
        );
    };


    // ** Delete Rang
    const handleDeleteStatusRange = () => {
        dispatch( deleteRangeStatus( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range
    const handleAddNew = () => {
        toggleSidebar();

    };
    return (
        <div>
            <Card className="mt-3">
                <ActionMenu
                    breadcrumb={breadcrumb}
                    title='Status'
                    middleNavButton={
                        <UncontrolledButtonDropdown>
                            <DropdownToggle color='flat-primary' className="p-0" size="sm">
                                <Settings size={20} />
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
                            onSelectedRowsChange={handleRowSelected}
                            onSort={handleSort}
                            progressPending={!queryData.length}
                            progressComponent={
                                <CustomPreLoader />
                            }
                            // contextMessage={}
                            contextActions={<Button.Ripple onClick={() => { handleDeleteStatusRange(); }} className='btn-icon ' color='flat-danger'>
                                <XSquare size={24} />
                            </Button.Ripple>}
                            dense
                            subHeader={false}
                            highlightOnHover
                            selectableRows
                            clearSelectedRows={clearSelectedRow}
                            responsive={true}
                            paginationServer
                            expandOnRowClicked
                            persistTableHead
                            columns={StatusTableColumns}
                            sortIcon={<ChevronDown />}
                            className="react-custom-dataTable"
                            data={dataToRender()}
                        />
                    </div>
                    <div>
                        {
                            queryData.length > 0 && <div>
                                <CustomPagination />
                            </div>
                        }

                    </div>
                </CardBody>


            </Card>
            {/* Open Sidebar for Edit and Add */}
            {
                ( selectedStatus !== null && openStatusSidebarForEdit ) && < StatusEditForm data={selectedStatus} open={openStatusSidebarForEdit} toggleSidebarForEdit={toggleSidebarForEdit} />
            }
            {
                openStatusSidebar && <StatusAddForm open={openStatusSidebar} toggleSidebar={toggleSidebar} />
            }
        </div>
    );
};

export default StatusList;

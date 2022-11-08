
import { store } from '@store/storeConfig/store';

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, Settings, XSquare } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from "react-redux";
import { Button, DropdownItem, DropdownMenu, DropdownToggle, NavItem, NavLink, UncontrolledButtonDropdown, UncontrolledTooltip } from "reactstrap";
import Card from 'reactstrap/lib/Card';
import CardBody from 'reactstrap/lib/CardBody';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import CostingGroupAddForm from '../form/CostingGroupAddForm';
import CostingGroupEditForm from '../form/CostingGroupEditForm';
import { deleteRangeCostingGroup, getCostingGroupByQuery, handleOpenCostingGroupSidebar, handleOpenCostingGroupSidebarForEdit } from '../store/actions';
import CostingGroupExpandRow from './CostingGroupExpandRow';
import { CostingGroupTableColumns } from './CostingGroupTableColumns';


const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'costingGroupsList',
        name: 'Costing Groups',
        link: "/costing-groups",
        isActive: true
    }
];
const CostingGroupList = () => {
    const dispatch = useDispatch();
    // ** Global States
    const { costingGroups, total, selectedCostingGroup, openCostingGroupSidebar, openCostingGroupSidebarForEdit, queryData } = useSelector( ( { costingGroups } ) => costingGroups );
    // ** Season States
    const [searchTerm, setSearchTerm] = useState( '' );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'asc' );

    const [sortedColumn, setSortedColumn] = useState( 'name' );
    const [currentStatus, setCurrentStatus] = useState( { value: '', label: 'Select Status', number: 0 } );

    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );

    // ** Global Function to toggle sidebar for Season
    const toggleSidebar = () => store.dispatch( handleOpenCostingGroupSidebar( !openCostingGroupSidebar ) );
    const toggleSidebarForEdit = () => store.dispatch( handleOpenCostingGroupSidebarForEdit( !openCostingGroupSidebarForEdit ) );


    //#Hooks
    useEffect( () => {
        dispatch(
            getCostingGroupByQuery( {
                page: currentPage,
                perPage: rowsPerPage
                // status: currentStatus.value,
                // q: searchTerm,
                // sortedBy,
                // sortedColumn
            } )
        );
    }, [dispatch, queryData?.length] );


    // ** Function in get data on page change
    const handlePagination = page => {
        dispatch(
            getCostingGroupByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage
                // status: currentStatus.value,
                // q: searchTerm,
                // sortedBy,
                // sortedColumn
            } )
        );
        setCurrentPage( page.selected + 1 );
    };


    // ** Function in get data on rows per page
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        dispatch(
            getCostingGroupByQuery( {
                page: currentPage,
                perPage: value
                // status: currentStatus.value,
                // q: searchTerm,
                // sortedBy,
                // sortedColumn
            } )
        );
        setRowsPerPage( value );
    };


    // ** Function in get data on search query change
    const handleFilter = val => {
        setSearchTerm( val );
        dispatch(
            getCostingGroupByQuery( {
                page: currentPage,
                perPage: rowsPerPage
                // status: currentStatus.value,
                // q: val,
                // sortedBy,
                // sortedColumn
            } )
        );
    };


    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( direction );
        setSortedColumn( selector );
        dispatch(
            getCostingGroupByQuery( {
                page: currentPage,
                perPage: rowsPerPage
                // status: currentStatus.value,
                // q: searchTerm,
                // sortedBy: direction,
                // sortedColumn: selector
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
            return costingGroups.slice( 0, rowsPerPage );
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
            getCostingGroupByQuery( {
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
    const handleDeleteCostingGroupRange = () => {
        dispatch( deleteRangeCostingGroup( selectedRowId ) );
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
                    title='Costing Groups'
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
                            onSelectedRowsChange={handleRowSelected}
                            onSort={handleSort}
                            progressPending={!queryData.length}
                            progressComponent={
                                <CustomPreLoader />
                            }
                            // contextMessage={}
                            contextActions={<Button.Ripple onClick={() => { handleDeleteCostingGroupRange(); }} className='btn-icon ' color='flat-danger'>
                                <XSquare size={24} />
                            </Button.Ripple>}
                            dense
                            subHeader={false}
                            highlightOnHover
                            selectableRows
                            clearSelectedRows={clearSelectedRow}
                            responsive={true}
                            paginationServer
                            expandableRows={false}
                            expandableRowsComponent={<CostingGroupExpandRow data={data => data} />}
                            expandOnRowClicked
                            persistTableHead
                            columns={CostingGroupTableColumns}
                            sortIcon={<ChevronDown />}
                            className="react-custom-dataTable"
                            data={queryData}
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
                ( selectedCostingGroup !== null && openCostingGroupSidebarForEdit ) && < CostingGroupEditForm
                    data={selectedCostingGroup}
                    open={openCostingGroupSidebarForEdit}
                    toggleSidebarForEdit={toggleSidebarForEdit}
                />
            }
            {
                openCostingGroupSidebar && <CostingGroupAddForm
                    open={openCostingGroupSidebar}
                    toggleSidebar={toggleSidebar}
                />
            }
        </div>
    );
};

export default CostingGroupList;

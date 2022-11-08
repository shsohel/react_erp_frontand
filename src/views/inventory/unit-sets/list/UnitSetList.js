import { store } from '@store/storeConfig/store';

import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from "react-redux";
import { Button, CardBody, DropdownItem, DropdownMenu, DropdownToggle, NavItem, NavLink, UncontrolledButtonDropdown, UncontrolledTooltip } from "reactstrap";
import Card from 'reactstrap/lib/Card';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { isPermit } from '../../../../utility/Utils';
import UnitSetAddForm from '../form/UnitSetAddForm';
import UnitSetEditForm from '../form/UnitSetEditForm';
import { deleteRangeUnitSets, getUnitSetsByQuery, handleOpenUnitSetEditSidebar, handleOpenUnitSetSidebar } from '../store/actions';
import { handleGetUnitSetColumns } from './UnitSetsTableColumn';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    },
    {
        id: 'unitSets',
        name: 'Unit Sets',
        link: "/unit-set",
        isActive: true,
        hidden: false
    }
];


const UnitSetList = () => {

    const dispatch = useDispatch();
    // ** Global States
    const { total, selectedUnitSet, openUnitSetSidebar, openUnitSetEditSidebar, queryData } = useSelector( ( { unitSets } ) => unitSets );
    // ** Size States
    const [searchTerm, setSearchTerm] = useState( '' );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'asc' );

    const [sortedColumn, setSortedColumn] = useState( 'name' );
    const [currentStatus, setCurrentStatus] = useState( { value: '', label: 'Select Status', number: 0 } );

    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    const toggleSidebar = () => store.dispatch( handleOpenUnitSetSidebar( !openUnitSetSidebar ) );
    const toggleEditSidebar = () => store.dispatch( handleOpenUnitSetEditSidebar( !openUnitSetEditSidebar ) );

    useEffect( () => {
        dispatch(
            getUnitSetsByQuery( {
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
            getUnitSetsByQuery( {
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
            getUnitSetsByQuery( {
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
            getUnitSetsByQuery( {
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
            getUnitSetsByQuery( {
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


    // **Clear Delete Ids
    const handleClearSelected = () => {
        setClearSelectedRow( true );
        dispatch(
            getUnitSetsByQuery( {
                page: currentPage,
                perPage: rowsPerPage
                // status: currentStatus.value,
                // q: searchTerm,
                // sortedBy,
                // sortedColumn
            } )
        );
    };

    // ** Start For Multiple Rows for Get IDs
    const handleRowSelected = ( rows ) => {
        const rowsId = rows.selectedRows.map( item => item.id );
        setSelectedRowId( rowsId );
        setClearSelectedRow( false );
    };

    // ** Delete Rang
    const handleDeleteSizeRange = () => {
        dispatch( deleteRangeUnitSets( selectedRowId ) );
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
                    title='Unit Sets'
                    moreButton={isPermit( userPermission?.UnitCreate, authPermissions )}

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
                    <NavItem
                        className="mr-1"
                        hidden={!isPermit( userPermission?.UnitCreate, authPermissions )}
                    >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="success"
                            onClick={() => { handleAddNew(); }}  >
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
                            dense
                            onSelectedRowsChange={handleRowSelected}
                            onSort={handleSort}
                            progressPending={!queryData?.length}
                            progressComponent={
                                <CustomPreLoader />
                            }

                            subHeader={false}
                            highlightOnHover
                            clearSelectedRows={clearSelectedRow}
                            responsive={true}
                            paginationServer
                            expandableRows={false}
                            expandOnRowClicked
                            persistTableHead
                            columns={handleGetUnitSetColumns( userPermission, authPermissions )}
                            sortIcon={<ChevronDown />}
                            className="react-custom-dataTable"
                            data={queryData}
                        />
                    </div>
                    <div>
                        {
                            queryData?.length > 0 && <div>
                                <CustomPagination />
                            </div>
                        }

                    </div>
                </CardBody>
            </Card>
            {/* Open Sidebar for Edit and Add */}
            {
                openUnitSetSidebar ? <UnitSetAddForm open={openUnitSetSidebar} toggleSidebar={toggleSidebar} /> : null
            }

            {
                selectedUnitSet !== null && openUnitSetEditSidebar ? < UnitSetEditForm data={selectedUnitSet} open={openUnitSetEditSidebar} toggleSidebar={toggleEditSidebar} /> : null
            }

        </div>
    );
};

export default UnitSetList;

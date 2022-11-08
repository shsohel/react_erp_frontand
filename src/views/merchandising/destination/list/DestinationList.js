import { store } from '@store/storeConfig/store';

import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from "reactstrap";
import Card from 'reactstrap/lib/Card';
import CardBody from 'reactstrap/lib/CardBody';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import DestinationAddForm from '../form/DestinationAddForm';
import DestinationEditForm from '../form/DestinationEditForm';
import { bindDestinationData, deleteRangeDestination, getDestinationByQuery, handleOpenDestinationSidebar, handleOpenDestinationSidebarForEdit } from '../store/actions';
import { handleGetDestinationColumns } from './DestinationTableColumn';


const DestinationList = () => {
    const dispatch = useDispatch();
    const defaultFilterValue = {
        name: ''
    };

    const defaultFilteredArrayValue = [
        {
            column: "destination",
            value: ''
        }

    ];
    const { total, openDestinationSidebar, openDestinationSidebarForEdit, queryData, isDestinationDataLoaded } = useSelector( ( { destinations } ) => destinations );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( true );

    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( [
        {
            column: "destination",
            value: ''
        }
    ] );

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'destination' );

    const [orderBy, setOrderBy] = useState( 'asc' );

    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    // ** Global Function to toggle sidebar for Destination
    const toggleSidebar = () => store.dispatch( handleOpenDestinationSidebar( !openDestinationSidebar ) );
    const toggleSidebarForEdit = () => store.dispatch( handleOpenDestinationSidebarForEdit( !openDestinationSidebarForEdit ) );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const getAllDestinations = () => {
        dispatch( getDestinationByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        getAllDestinations();
    }, [] );

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getDestinationByQuery( paramsObj, [] ) );
    };

    const handleSearch = () => {
        dispatch(
            getDestinationByQuery( paramsObj, filteredData )
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
            getDestinationByQuery( {
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
            getDestinationByQuery( {
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
            getDestinationByQuery( {
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
            getDestinationByQuery( {
                page: currentPage,
                perPage: rowsPerPage
                // status: currentStatus.value,
                // sortedBy,
                // orderBy
            } )
        );
    };


    // ** Delete Rang
    const handleDeleteDestinationRange = () => {
        dispatch( deleteRangeDestination( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range
    const handleAddNew = () => {
        toggleSidebar();
        dispatch( bindDestinationData( null ) );
    };
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            hidden: false
        },
        {
            id: 'destinationList',
            name: 'Destination',
            link: "/destinations",
            isActive: true,
            hidden: false

        }

    ];
    return (
        <div>
            <Card className="mt-3">
                <ActionMenu
                    breadcrumb={breadcrumb}
                    title='Destinations'
                    // moreButton={isPermit( userPermission?.GarmentDestinationCreate, authPermissions )}
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
                    <NavItem
                        className="mr-1"
                        // hidden={!isPermit( userPermission?.GarmentDestinationCreate, authPermissions )}
                        hidden={false}
                    >
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
                        >
                            <Button.Ripple
                                onClick={() => setIsFilterBoxOpen( !isFilterBoxOpen )}
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
                        <AdvancedSearchBox isOpen={!isFilterBoxOpen}>
                            <Row>

                                <Col xs={3}>
                                    <Input
                                        placeholder="Destination Name"
                                        bsSize="sm"
                                        name="name"
                                        value={filterObj.name}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={7}>
                                </Col>
                                <Col lg={2} className="d-flex justify-content-end">
                                    <div className='d-inline-block'>
                                        <Button.Ripple
                                            onClick={() => { handleSearch(); }}
                                            className="ml-1 mb-sm-1 mb-xs-1"
                                            outline
                                            color="success"
                                            size="sm"
                                        >
                                            Search
                                        </Button.Ripple>

                                        <Button.Ripple
                                            onClick={() => { handleClearFilterBox(); }}
                                            className="ml-1 mb-sm-1 mb-xs-1"
                                            outline
                                            color="danger"
                                            size="sm"
                                        >
                                            Clear
                                        </Button.Ripple>
                                    </div>
                                </Col>


                            </Row>
                        </AdvancedSearchBox>
                        <DataTable
                            dense
                            onSelectedRowsChange={handleRowSelected}
                            onSort={handleSort}
                            defaultSortAsc
                            defaultSortField={sortedBy}
                            sortServer
                            progressPending={!isDestinationDataLoaded}
                            progressComponent={
                                <CustomPreLoader />
                            }

                            subHeader={false}
                            noHeader
                            highlightOnHover

                            clearSelectedRows={clearSelectedRow}
                            responsive={true}
                            paginationServer


                            persistTableHead
                            columns={handleGetDestinationColumns( userPermission, authPermissions )}
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
                openDestinationSidebarForEdit && < DestinationEditForm open={openDestinationSidebarForEdit} toggleSidebarForEdit={toggleSidebarForEdit} />
            }
            {
                openDestinationSidebar && <DestinationAddForm open={openDestinationSidebar} toggleSidebar={toggleSidebar} />
            }

        </div>
    );
};

export default DestinationList;

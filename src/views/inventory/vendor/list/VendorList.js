import CustomPreLoader from '@custom/CustomPreLoader';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from 'reactstrap';

import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { isPermit } from '../../../../utility/Utils';
import { bindVendorContactDataOnchange, bindVendorDataOnchange, getVendorByQuery } from '../store/actions';
import { handleGetVendorColumns } from './VendorTableColumns';
const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    },
    {
        id: 'vendorsId',
        name: 'Vendors',
        link: "/vendors",
        isActive: true,
        hidden: false
    }
];

const VendorList = () => {
    const dispatch = useDispatch();
    const defaultFilterValue = {
        name: '',
        email: '',
        phoneNumber: '',
        mobileNumber: ''

    };

    const defaultFilteredArrayValue = [
        {
            column: "name",
            value: ''
        },
        {
            column: "email",
            value: ''
        },
        {
            column: "phoneNumber",
            value: ''
        },
        {
            column: "mobileNumber",
            value: ''
        }

    ];
    const { push } = useHistory();
    const { queryData, total, isVendorDataLoaded } = useSelector( ( { vendors } ) => vendors );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

    const [searchTerm, setSearchTerm] = useState( '' );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'name' );

    const [orderBy, setOrderBy] = useState( 'asc' );
    const [currentStatus, setCurrentStatus] = useState( { value: '', label: 'Select Status', number: 0 } );
    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const getAllVendors = () => {
        dispatch( getVendorByQuery( paramsObj, filteredData ) );

    };
    useEffect( () => {
        getAllVendors();
    }, [] );
    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getVendorByQuery( paramsObj, [] ) );
    };
    const handleSearch = () => {
        setCurrentPage( 1 );

        dispatch(
            getVendorByQuery( { ...paramsObj, page: 1 }, filteredData )
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
            getVendorByQuery( {
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
            getVendorByQuery( {
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
            getVendorByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction
            }, filteredData )
        );
    };


    // ** Custom Pagination
    const CustomPagination = () => {

        return (
            <ReactPaginate
                previousLabel={''}
                nextLabel={''}
                pageCount={total || 1}
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

        if ( queryData?.length > 0 ) {
            return queryData;
        } else if ( queryData?.length === 0 && isFiltered ) {
            return [];
        } else {
            return queryData.slice( 0, rowsPerPage );
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
            getVendorByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                status: currentStatus.value,
                q: searchTerm,
                sortedBy,
                orderBy
            } )
        );
    };


    // ** Delete Rang
    const handleDeleteItemGroupRange = () => {
        //  dispatch( deleteRangeVendorGroup( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };

    // ** End For Multiple Select and Delete Range
    const handleAddNew = () => {
        push( '/new-vendor' );
        dispatch( bindVendorContactDataOnchange( null ) );
        dispatch( bindVendorDataOnchange( null ) );
    };

    return (
        <div>
            <Card className="mt-3">
                <ActionMenu
                    breadcrumb={breadcrumb}
                    title='Vendors'
                    moreButton={isPermit( userPermission?.VendorCreate, authPermissions )}

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
                        hidden={!isPermit( userPermission?.VendorCreate, authPermissions )}

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
                            searchTerm={searchTerm}
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
                        <AdvancedSearchBox isOpen={isFilterBoxOpen}>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col xs={12} sm={12} md={6} lg={3} className="mt-0 mt-sm-0  mt-md-0 mt-lg-0">
                                            <Input
                                                placeholder="Name"
                                                bsSize="sm"
                                                name="name"
                                                value={filterObj.name}
                                                onChange={( e ) => handleFilterBoxOnChange( e )}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-0 mt-lg-0">
                                            <Input
                                                placeholder="Email"
                                                bsSize="sm"
                                                name="email"
                                                value={filterObj.email}
                                                onChange={( e ) => handleFilterBoxOnChange( e )}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                            <Input
                                                placeholder="Phone"
                                                bsSize="sm"
                                                name="phoneNumber"
                                                value={filterObj.phoneNumber}
                                                onChange={( e ) => handleFilterBoxOnChange( e )}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                            <Input
                                                placeholder="Mobile"
                                                bsSize="sm"
                                                name="mobileNumber"
                                                value={filterObj.mobileNumber}
                                                onChange={( e ) => handleFilterBoxOnChange( e )}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12} sm={12} md={3} lg={3} xl={2} className="d-flex justify-content-end">
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
                            onSort={handleSort}
                            dense
                            defaultSortField={sortedBy}
                            defaultSortAsc
                            sortServer
                            progressPending={!isVendorDataLoaded}
                            progressComponent={
                                <CustomPreLoader />
                            }
                            noHeader
                            subHeader={false}
                            persistTableHead
                            highlightOnHover
                            responsive={true}
                            paginationServer
                            expandOnRowClicked
                            columns={handleGetVendorColumns( userPermission, authPermissions )}
                            sortIcon={<ChevronDown />}
                            className="react-custom-dataTable"
                            data={dataToRender()}
                        />
                    </div>
                    <div>
                        <CustomPagination />
                    </div>
                </CardBody>

            </Card>
        </div> );
};

export default VendorList;

import { store } from '@store/storeConfig/store';

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import CustomPreLoader from '@custom/CustomPreLoader';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from "react-redux";
import { Button, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from "reactstrap";
import Card from 'reactstrap/lib/Card';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { isPermit } from '../../../../utility/Utils';
import SegmentAddForm from '../form/SegmentAddForm';
import SegmentEditForm from '../form/SegmentEditForm';
import { deleteRangeSegment, getSegmentByQuery, handleOpenSegmentEditSidebar, handleOpenSegmentSidebar } from '../store/actions';
import SegmentExpandRow from './SegmentExpandRow';
import { handleGetSegmentColumns } from './SegmentTableColumn';
const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    },
    {
        id: 'segmentId',
        name: 'Segment',
        link: "/inventory-segment",
        isActive: true,
        hidden: false

    }
];


const SegmentList = () => {

    const dispatch = useDispatch();
    const defaultFilterValue = {
        name: ''
    };
    const defaultFilteredArrayValue = [
        {
            column: "name",
            value: ''
        }

    ];
    const {
        segments,
        total,
        selectedSegment,
        openSegmentSidebar,
        openSegmentEditSidebar,
        queryData,
        isSegmentDataLoaded,
        isSegmentDataOnProgress
    } = useSelector( ( { segments } ) => segments );

    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [isActive, setIsActive] = useState( true );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

    const [searchTerm, setSearchTerm] = useState( '' );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'asc' );

    const [orderBy, setOrderBy] = useState( 'name' );
    const [currentStatus, setCurrentStatus] = useState( { value: '', label: 'Select Status', number: 0 } );
    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );


    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    // ** Global Function to toggle sidebar for Division
    const toggleSidebar = () => store.dispatch( handleOpenSegmentSidebar( !openSegmentSidebar ) );
    const toggleEditSidebar = () => store.dispatch( handleOpenSegmentEditSidebar( !openSegmentEditSidebar ) );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const getAllSegments = () => {
        dispatch(
            getSegmentByQuery( paramsObj, filteredData )
        );
    };

    //#Hooks
    useEffect( () => {
        getAllSegments();
    }, [] );


    const handleSearch = () => {
        setCurrentPage( 1 );

        dispatch(
            getSegmentByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getSegmentByQuery( paramsObj, [] ) );
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
            getSegmentByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                status: currentStatus.value,
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
            getSegmentByQuery( {
                page: currentPage,
                perPage: value,
                status: currentStatus.value,
                sortedBy,
                orderBy
            }, filteredData )
        );
        setRowsPerPage( value );
    };


    // ** Function in get data on search query change
    const handleFilter = val => {
        setSearchTerm( val );
        dispatch(
            getSegmentByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                status: currentStatus.value,
                q: val,
                sortedBy,
                orderBy
            } )
        );
    };

    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( direction );
        setOrderBy( selector );
        dispatch(
            getSegmentByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                status: currentStatus.value,
                sortedBy: direction,
                orderBy: selector
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
            return filters[k]?.length > 0;
        } );


        if ( queryData?.length > 0 ) {
            return queryData;
        } else if ( queryData?.length === 0 && isFiltered ) {
            return [];
        } else {
            return segments.slice( 0, rowsPerPage );
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
            getSegmentByQuery( {
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
    const handleDeleteSegmentRange = () => {
        dispatch( deleteRangeSegment( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range

    const handleAddNew = () => {
        toggleSidebar();
    };

    return (
        <div>
            <UILoader blocking={isSegmentDataOnProgress} loader={<ComponentSpinner />} >

                <Card className="mt-3">
                    <ActionMenu
                        breadcrumb={breadcrumb}
                        title='Segments'
                        moreButton={isPermit( userPermission?.SegmentCreate, authPermissions )}

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
                            hidden={!isPermit( userPermission?.SegmentCreate, authPermissions )}
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
                                    onClick={() => getAllSegments()}
                                    className='btn-icon'
                                    size="sm"
                                    color='flat-primary'
                                    id='freshBtnId'
                                >
                                    <RefreshCw size={18} />
                                </Button.Ripple>
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
                                noHeader
                                onSelectedRowsChange={handleRowSelected}
                                onSort={handleSort}
                                progressPending={!isSegmentDataLoaded}
                                progressComponent={
                                    <CustomPreLoader />
                                }
                                // contextMessage={}
                                // contextActions={<Button.Ripple onClick={() => { handleDeleteSegmentRange(); }} className='btn-icon ' color='flat-danger'>
                                //     <XSquare size={24} />
                                // </Button.Ripple>}
                                dense
                                subHeader={false}
                                persistTableHead
                                highlightOnHover
                                // selectableRows
                                clearSelectedRows={clearSelectedRow}
                                responsive={true}
                                paginationServer
                                expandableRows={false}
                                expandableRowsComponent={<SegmentExpandRow data={data => data} />}
                                expandOnRowClicked
                                columns={handleGetSegmentColumns( userPermission, authPermissions )}
                                sortIcon={<ChevronDown />}
                                className="react-custom-dataTable"
                                data={dataToRender()}
                            />
                        </div>
                    </CardBody>

                    <div>
                        <CustomPagination />
                    </div>


                </Card>
            </UILoader>
            {/* Open Sidebar for Edit and Add */}

            {( selectedSegment !== null && openSegmentEditSidebar ) ? < SegmentEditForm data={selectedSegment} open={openSegmentEditSidebar} toggleSidebar={toggleEditSidebar} /> : null
            }
            {openSegmentSidebar ? <SegmentAddForm open={openSegmentSidebar} toggleSidebar={toggleSidebar} /> : null}
        </div>
    );
};

export default SegmentList;

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { store } from '@store/storeConfig/store';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, Settings, XSquare } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from "reactstrap";
import Card from 'reactstrap/lib/Card';
import CardBody from 'reactstrap/lib/CardBody';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { isPermit } from '../../../../utility/Utils';
import SizeAddForm from '../form/SizeAddForm';
import SizeEditForm from '../form/SizeEditForm';
import { bindSizeData, deleteRangeSize, getSizeByQuery, handleOpenSizeSidebar, handleOpenSizeSidebarForEdit } from '../store/actions';
import SizeExpandRow from './SizeExpandRow';
import { handleGetSizeColumns } from './SizeTableColumn';


const SizeList = () => {
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
    const { total,
        isSizeDataLoaded,
        isSizeDataOnProgress,
        openSizeSidebar,
        openSizeSidebarForEdit,
        queryData } = useSelector( ( { sizes } ) => sizes );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( [
        {
            column: "name",
            value: ''
        }
    ] );

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'name' );

    const [orderBy, setOrderBy] = useState( 'asc' );

    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    // ** Global Function to toggle sidebar for Size
    const toggleSidebar = () => store.dispatch( handleOpenSizeSidebar( !openSizeSidebar ) );
    const toggleSidebarForEdit = () => store.dispatch( handleOpenSizeSidebarForEdit( !openSizeSidebarForEdit ) );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const getAllSizes = () => {
        dispatch( getSizeByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        getAllSizes();
    }, [] );

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getSizeByQuery( paramsObj, [] ) );
    };

    const handleSearch = () => {
        dispatch(
            getSizeByQuery( paramsObj, filteredData )
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
            getSizeByQuery( {
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
        const count = Number( Math.ceil( total / value ) );

        const pageNumber = currentPage === count ? currentPage : 1;
        setCurrentPage( pageNumber );
        dispatch(
            getSizeByQuery( {
                page: pageNumber,
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
            getSizeByQuery( {
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
            getSizeByQuery( {
                page: currentPage,
                perPage: rowsPerPage
                // status: currentStatus.value,
                // sortedBy,
                // orderBy
            } )
        );
    };


    // ** Delete Rang
    const handleDeleteSizeRange = () => {
        dispatch( deleteRangeSize( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range
    const handleAddNew = () => {
        toggleSidebar();
        dispatch( bindSizeData( null ) );
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
            id: 'colorsList',
            name: 'Colors',
            link: "/colors",
            isActive: false,
            hidden: !isPermit( userPermission?.GarmentColorList, authPermissions )

        },
        {
            id: 'sizesList',
            name: 'Sizes',
            link: "/sizes",
            isActive: true,
            hidden: false
        },
        {
            id: 'sizeGroup',
            name: 'Size Groups',
            link: "/size-groups",
            isActive: false,
            hidden: !isPermit( userPermission?.GarmentSizeGroupList, authPermissions )
        }
    ];
    return (
        <div>
            <UILoader blocking={isSizeDataOnProgress} loader={<ComponentSpinner />} >

                <Card className="mt-3">
                    <ActionMenu
                        breadcrumb={breadcrumb}
                        title='Style Sizes'
                        moreButton={isPermit( userPermission?.GarmentSizeCreate, authPermissions )}
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
                            hidden={!isPermit( userPermission?.GarmentSizeCreate, authPermissions )}
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
                            <AdvancedSearchBox isOpen={isFilterBoxOpen}>
                                <Row>

                                    <Col xs={3}>
                                        <Input
                                            placeholder="Size Name"
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
                                progressPending={!isSizeDataLoaded}
                                progressComponent={
                                    <CustomPreLoader />
                                }
                                // contextMessage={}
                                contextActions={<Button.Ripple onClick={() => { handleDeleteSizeRange(); }} className='btn-icon ' color='flat-danger'>
                                    <XSquare size={24} />
                                </Button.Ripple>}
                                subHeader={false}
                                noHeader
                                highlightOnHover

                                responsive={true}
                                paginationServer
                                expandableRows={false}
                                expandableRowsComponent={<SizeExpandRow data={data => data} />}
                                expandOnRowClicked
                                persistTableHead
                                columns={handleGetSizeColumns( userPermission, authPermissions )}
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
                    openSizeSidebarForEdit && < SizeEditForm open={openSizeSidebarForEdit} toggleSidebarForEdit={toggleSidebarForEdit} />
                }
                {
                    openSizeSidebar && <SizeAddForm open={openSizeSidebar} toggleSidebar={toggleSidebar} />
                }
            </UILoader>
        </div>
    );
};

export default SizeList;

import { store } from '@store/storeConfig/store';

import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from "react-redux";
import { Button, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from "reactstrap";
import Card from 'reactstrap/lib/Card';
import ActionMenu from '../../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../../utility/custom/TableCustomerHeader';
import { isPermit } from '../../../../../utility/Utils';
import StyleDepartmentAddForm from '../form/StyleDepartmentAddForm';
import StyleDepartmentEditForm from '../form/StyleDepartmentEditForm';
import { deleteRangeDepartment, getDepartmentByQuery, getDepartmentProductCategories, handleOpenDepartmentSidebar, handleOpenDepartmentSidebarForEdit } from '../store/actions';
import StyleDepartmentExpandRow from './StyleDepartmentExpandRow';
import { handleGetDepartmentColumns } from './StyleDepartmentTableColumn';


const StyleDepartmentList = () => {

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
    // ** Global States
    const { departments,
        total,
        selectedDepartment,
        openDepartmentSidebar,
        openDepartmentSidebarForEdit,
        queryData,
        isStyleDepartmentDataLoaded
    } = useSelector( ( { departments } ) => departments );

    const [filterObj, setFilterObj] = useState( defaultFilterValue );

    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );


    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [searchTerm, setSearchTerm] = useState( '' );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'name' );

    const [orderBy, setOrderBy] = useState( 'asc' );
    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    // ** Global Function to toggle sidebar for Division
    const toggleSidebar = () => store.dispatch( handleOpenDepartmentSidebar( !openDepartmentSidebar ) );
    const toggleSidebarForEdit = () => store.dispatch( handleOpenDepartmentSidebarForEdit( !openDepartmentSidebarForEdit ) );
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const getAllDepartments = () => {
        dispatch(
            getDepartmentByQuery( paramsObj, filteredData )
        );
    };
    useEffect( () => {
        getAllDepartments();
    }, [] );


    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getDepartmentByQuery( paramsObj, [] ) );
    };

    const handleSearch = () => {
        setCurrentPage( 1 );
        dispatch(
            getDepartmentByQuery( { ...paramsObj, page: 1 }, filteredData )
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
            getDepartmentByQuery( {
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
            getDepartmentByQuery( {
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
            getDepartmentByQuery( {
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
            getDepartmentByQuery( {
                page: currentPage,
                perPage: rowsPerPage
                // status: currentStatus.value,
                // q: searchTerm,
                // sortedBy,
                // orderBy
            } )
        );
    };

    // ** Delete Rang
    const handleDeleteDepartmentRange = () => {
        dispatch( deleteRangeDepartment( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range
    const handleAddNew = () => {
        toggleSidebar();
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
            id: 'divisions',
            name: 'Division',
            link: "/divisions",
            isActive: false,
            hidden: !isPermit( userPermission?.StyleDivisionList, authPermissions )
        },
        {
            id: 'department',
            name: 'Department',
            link: "/style-department",
            isActive: true,
            hidden: false
        },
        {
            id: 'proCat',
            name: 'Product Category',
            link: "/style-product-category",
            isActive: false,
            hidden: !isPermit( userPermission?.ProductCategoryList, authPermissions )
        },
        {
            id: 'styleCategory',
            name: 'Style Category',
            link: "/style-category",
            isActive: false,
            hidden: !isPermit( userPermission?.StyleCategoryList, authPermissions )
        }
    ];

    return (
        <div>
            <Card className="mt-3">
                <ActionMenu
                    breadcrumb={breadcrumb}
                    title='Style Department'
                    moreButton={isPermit( userPermission?.StyleDepartmentCreate, authPermissions )}
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
                        hidden={!isPermit( userPermission?.StyleDepartmentCreate, authPermissions )}
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
                                onClick={() => getAllDepartments()}
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

                            onSort={handleSort}
                            progressPending={!isStyleDepartmentDataLoaded}
                            progressComponent={
                                <CustomPreLoader />
                            }
                            dense
                            subHeader={false}
                            highlightOnHover
                            clearSelectedRows={clearSelectedRow}
                            responsive={true}
                            paginationServer
                            onRowExpandToggled={( expanded, row ) => dispatch( getDepartmentProductCategories( row.id ) )}
                            expandableRows
                            expandableRowsComponent={<StyleDepartmentExpandRow data={data => data} />}
                            expandOnRowClicked
                            persistTableHead
                            columns={handleGetDepartmentColumns( userPermission, authPermissions )}
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
                openDepartmentSidebarForEdit && < StyleDepartmentEditForm data={selectedDepartment} open={openDepartmentSidebarForEdit} toggleSidebarForEdit={toggleSidebarForEdit} />
            }
            {
                openDepartmentSidebar && <StyleDepartmentAddForm open={openDepartmentSidebar} toggleSidebar={toggleSidebar} />
            }

        </div>
    );
};

export default StyleDepartmentList;

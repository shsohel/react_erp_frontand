import { store } from '@store/storeConfig/store';

import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from "reactstrap";
import Card from 'reactstrap/lib/Card';
import CardBody from 'reactstrap/lib/CardBody';
import ActionMenu from '../../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../../utility/custom/TableCustomerHeader';
import { isPermit } from '../../../../../utility/Utils';
import StyleProductCategoryAddForm from '../form/StyleProductCategoryAddForm';
import StyleProductCategoryEditForm from '../form/StyleProductCategoryEditForm';
import { deleteRangeProductCategory, getProductCategoryByQuery, getStyleCategoriesByProductCategoryId, handleOpenProductCategorySidebar, handleOpenProductCategorySidebarForEdit } from '../store/actions';
import StyleProductCategoryExpandRow from './StyleProductCategoryExpandRow';
import { handleGetProductCategoryColumns } from './StyleProductCategoryTableColumn';


const StyleProductCategoryList = () => {
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

    const {
        productCategories,
        total,
        selectedProductCategory,
        openProductCategorySidebar,
        openProductCategorySidebarForEdit,
        queryData,
        isStyleProductCategoryDataLoaded
    } = useSelector( ( { productCategories } ) => productCategories );


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

    // ** Global Function to toggle sidebar for Division
    const toggleSidebar = () => store.dispatch( handleOpenProductCategorySidebar( !openProductCategorySidebar ) );
    const toggleSidebarForEdit = () => store.dispatch( handleOpenProductCategorySidebarForEdit( !openProductCategorySidebarForEdit ) );
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const getAllStyleProductCategory = () => {
        dispatch(
            getProductCategoryByQuery( paramsObj, filteredData )
        );
    };

    useEffect( () => {
        getAllStyleProductCategory();
    }, [] );

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getProductCategoryByQuery( paramsObj, [] ) );
    };

    const handleSearch = () => {
        setCurrentPage( 1 );
        dispatch(
            getProductCategoryByQuery( { ...paramsObj, page: 1 }, filteredData )
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
            getProductCategoryByQuery( {
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
            getProductCategoryByQuery( {
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
            getProductCategoryByQuery( {
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
            getProductCategoryByQuery( {
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
    const handleDeleteProductCategoryRange = () => {
        dispatch( deleteRangeProductCategory( selectedRowId ) );
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
            isActive: false,
            hidden: !isPermit( userPermission?.StyleDepartmentList, authPermissions )
        },
        {
            id: 'proCat',
            name: 'Product Category',
            link: "/style-product-category",
            isActive: true,
            hidden: false
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
                    title='Product Categories'
                    moreButton={isPermit( userPermission?.ProductCategoryCreate, authPermissions )}
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
                        hidden={!isPermit( userPermission?.ProductCategoryCreate, authPermissions )}
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
                                onClick={() => getAllStyleProductCategory()}
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
                            defaultSortAsc
                            defaultSortField='name'
                            sortServer
                            progressPending={!isStyleProductCategoryDataLoaded}
                            progressComponent={
                                <CustomPreLoader />
                            }
                            // contextMessage={}

                            dense
                            subHeader={false}
                            highlightOnHover
                            clearSelectedRows={clearSelectedRow}
                            responsive={true}
                            paginationServer
                            onRowExpandToggled={( expanded, row ) => dispatch( getStyleCategoriesByProductCategoryId( row.id ) )}

                            expandableRows
                            expandableRowsComponent={<StyleProductCategoryExpandRow data={data => data} />}
                            expandOnRowClicked
                            persistTableHead
                            columns={handleGetProductCategoryColumns( userPermission, authPermissions )}
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
                openProductCategorySidebarForEdit && < StyleProductCategoryEditForm data={selectedProductCategory} open={openProductCategorySidebarForEdit} toggleSidebarForEdit={toggleSidebarForEdit} />
            }
            {
                openProductCategorySidebar && <StyleProductCategoryAddForm open={openProductCategorySidebar} toggleSidebar={toggleSidebar} />
            }
        </div>
    );
};

export default StyleProductCategoryList;

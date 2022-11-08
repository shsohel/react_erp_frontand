

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Delete, Filter, RefreshCw, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from 'reactstrap';
import ActionMenu from '../../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../../utility/custom/TableCustomerHeader';
import { selectYear, styleStatus } from '../../../../../utility/enums';
import { isPermit, selectThemeColors } from '../../../../../utility/Utils';
import { getUserDropdown } from '../../../../auth/user/store/actions';
import { getDropDownBuyerDepartments } from '../../../buyer-department/store/actions';
import { getDropDownBuyers } from '../../../buyer/store/actions';
import { getDropDownSeasons } from '../../../season/store/actions';
import { getDropDownStyleCategories } from '../../../style-master/style-category/store/actions';
import { getDropDownProductCategories } from '../../../style-master/style-product-category/store/actions';
import { deleteRangeStyle, getStyleById, getStylesByQuery, getUploadedFileBySingleStyleId, getUploadedImagesBySingleStyleId } from '../store/actions';
import StyleExpandRow from './StyleExpandRow';
import { handleGetStyleColumns } from './StyleTableColumn';


const StyleList = () => {
    const dispatch = useDispatch();
    const defaultFilterValue = {
        buyer: null,
        department: null,
        season: null,
        styleNo: '',
        sysId: '',
        merchandiser: null,
        styleCategory: null,
        productCategory: null,
        description: '',
        year: null,
        status: null
    };

    const defaultFilteredArrayValue = [
        {
            column: "sysId",
            value: ''
        },
        {
            column: "styleNo",
            value: ''
        },
        {
            column: "buyerId",
            value: ''
        },
        {
            column: "departmentId",
            value: ''
        },
        {
            column: "merchandiserId",
            value: ''
        },
        {
            column: "styleCategoryId",
            value: ''
        },
        {
            column: "productCategoryId",
            value: ''
        },
        {
            column: "description",
            value: ''
        },
        {
            column: "year",
            value: ''
        },
        {
            column: "season",
            value: ''
        },
        {
            column: "status",
            value: ''
        }

    ];

    // Merchandiser, Style Category, Product Category এবং Style Description
    const stateWithBuyer = JSON.parse( localStorage.getItem( 'buyerAndStyle' ) );

    const { total, queryData, isSingleStyleDataLoaded, isSingleStyleDataProgress } = useSelector( ( { styles } ) => styles );
    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );


    const { replace } = useHistory();

    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [isActive, setIsActive] = useState( true );

    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );

    const [sortedBy, setSortedBy] = useState( 'sysId' );
    const [orderBy, setOrderBy] = useState( 'asc' );


    const { dropDownBuyers, isBuyerDropdownLoaded } = useSelector( ( { buyers } ) => buyers );
    const { dropDownBuyerDepartments, isDropDownBuyerDepartmentsLoaded } = useSelector( ( { buyerDepartments } ) => buyerDepartments );
    const { dropDownSeasons, isDropDownSeasonsLoaded } = useSelector( ( { seasons } ) => seasons );
    const { userDropdown, isUserDropdownLoaded } = useSelector( ( { users } ) => users );
    const { dropDownStyleCategories, isDropDownStyleCategoriesLoaded } = useSelector( ( { styleCategories } ) => styleCategories );
    const { dropDownProductCategories, isDropDownProductCategoriesLoaded } = useSelector( ( { productCategories } ) => productCategories );
    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isActive
    };

    const filteredData = filteredArray.filter( filter => filter.value.length );


    const getAllStyles = () => {
        const newFilterArray = filteredArray.map( filter => {
            if ( filter.column === "buyerId" ) {
                filter['value'] = stateWithBuyer?.buyer?.value ?? '';
            } else if ( filter.column === "styleNo" ) {
                filter['value'] = stateWithBuyer?.style?.label ?? '';

            }
            return filter;
        } );

        setFilteredArray( newFilterArray );

        const filteredData = newFilterArray.filter( filter => filter.value?.length );

        dispatch( getStylesByQuery( paramsObj, filteredData ) );

        setFilterObj( {
            ...filterObj,
            buyer: stateWithBuyer?.buyer,
            styleNo: stateWithBuyer?.style?.label ?? ''
        } );
    };


    useEffect( () => {
        let subscribe = false;
        if ( !subscribe ) {
            getAllStyles();
        }
        return () => {
            subscribe = true;
        };

    }, [] );


    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getStylesByQuery( paramsObj, [] ) );

        const obj = {
            ...stateWithBuyer,
            buyer: null,
            style: null,
            styleDescription: '',
            styleCategory: ''
        };
        localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );
    };

    const handleSearch = () => {
        const filteredData = filteredArray.filter( filter => filter.value.length );

        dispatch(
            getStylesByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };
    const handleBuyerOnFocus = () => {
        if ( !dropDownBuyers.length ) {
            dispatch( getDropDownBuyers() );
        }
    };

    const handleDepartmentOnFocus = () => {
        if ( !dropDownBuyerDepartments.length ) {
            dispatch( getDropDownBuyerDepartments() );
        }
    };
    const handleStyleCategoryOnFocus = () => {
        if ( !dropDownStyleCategories.length ) {
            dispatch( getDropDownStyleCategories() );
        }
    };
    const handleProductCategoryOnFocus = () => {
        if ( !dropDownProductCategories.length ) {
            dispatch( getDropDownProductCategories() );
        }
    };
    const handleUserDropdownOnFocus = () => {
        if ( !userDropdown.length ) {
            dispatch( getUserDropdown() );
        }
    };

    const handleSeasonOnFocus = () => {
        if ( !dropDownSeasons.length ) {
            dispatch( getDropDownSeasons() );
        }
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

    const handleFilterDropdown = ( data, e ) => {
        const { name } = e;
        setFilterObj( {
            ...filterObj,
            [name]: data
        } );

        const updatedData = filteredArray.map( filter => {
            if ( name === 'buyer' && filter.column === 'buyerId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === "department" && filter.column === 'departmentId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === "merchandiser" && filter.column === 'merchandiserId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === "styleCategory" && filter.column === 'styleCategoryId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === "productCategory" && filter.column === 'productCategoryId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === "year" && filter.column === 'year' ) {
                filter['value'] = data ? data?.label : '';
            } else if ( name === "season" && filter.column === 'season' ) {
                filter['value'] = data ? data?.label : '';
            } else if ( name === "status" && filter.column === 'status' ) {
                filter['value'] = data ? data?.label : '';
            }
            return filter;
        } );
        setFilteredArray( updatedData );
    };

    const handleIsActive = ( checked ) => {
        setIsActive( checked );
        dispatch(
            getStylesByQuery( {
                page: 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                isActive: checked
            }, filteredData )
        );
    };

    const handlePagination = page => {
        dispatch(
            getStylesByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                isActive
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };

    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        const count = Number( Math.ceil( total / value ) );

        const pageNumber = currentPage === count ? currentPage : 1;
        setCurrentPage( pageNumber );
        dispatch(
            getStylesByQuery( {
                page: pageNumber,
                perPage: value,
                sortedBy,
                orderBy,
                isActive
            }, filteredData )
        );
        setRowsPerPage( value );
    };


    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getStylesByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                orderBy: direction,
                sortedBy: selector,
                isActive
            }, filteredData )
        );
    };


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


    const handleRowSelected = ( rows ) => {
        const rowsId = rows.selectedRows.map( item => item.id );
        setSelectedRowId( rowsId );
        setClearSelectedRow( false );
    };


    const handleClearSelected = () => {
        setClearSelectedRow( true );
        dispatch(
            getStylesByQuery( {
                page: currentPage,
                perPage: rowsPerPage
                // division: currentDepartment.value,
                // status: currentStatus.value,
                // q: searchTerm,
                // sortedBy,
                // sortedColumn
            } )
        );
    };


    const handleDeleteStyleRange = () => {
        dispatch( deleteRangeStyle( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };

    const handleAddNew = () => {
        replace( '/new-single-style' );
        dispatch( getStyleById( null ) );
        dispatch( getUploadedFileBySingleStyleId( null ) );
        dispatch( getUploadedImagesBySingleStyleId( null ) );
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
            id: 'stylesList',
            name: 'Single Styles',
            link: "/single-styles",
            isActive: true,
            hidden: false
        },
        {
            id: 'setStylesList',
            name: 'Set Styles',
            link: "/set-styles",
            isActive: false,
            hidden: true
        }

    ];

    console.log( selectedRowId );
    return (
        <div>
            <UILoader blocking={isSingleStyleDataProgress} loader={<ComponentSpinner />} >
                <Card className="mt-3">
                    <ActionMenu
                        breadcrumb={breadcrumb}
                        title='Single Style'
                        moreButton={isPermit( userPermission?.StyleCreate, authPermissions )}
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
                            hidden={!isPermit( userPermission?.StyleCreate, authPermissions )}
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
                        <div>

                            <TableCustomerHeader
                                handlePerPage={handlePerPage}
                                rowsPerPage={rowsPerPage}
                            >

                                {/* <div className='active-archive-btn-box'>
                                    <Button.Ripple
                                        onClick={() => handleIsActive( !isActive )}
                                        className="active-archive-btn"
                                        color='white'
                                        size="sm"

                                        id='activeId'
                                    >
                                        {isActive ? ' Archive' : 'Active '}
                                    </Button.Ripple>
                                </div> */}
                                <Button.Ripple
                                    onClick={() => getAllStyles()}
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
                                    size="sm"
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
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-0 mt-sm-0  mt-md-0 mt-lg-0">
                                                <Input
                                                    placeholder="SYS ID"
                                                    bsSize="sm"
                                                    name="sysId"
                                                    value={filterObj?.sysId}
                                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-0 mt-lg-0">

                                                <Input
                                                    placeholder="Style Number"
                                                    bsSize="sm"
                                                    name="styleNo"
                                                    value={filterObj.styleNo}
                                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-0 mt-lg-0">

                                                <Input
                                                    placeholder="Style Decription"
                                                    bsSize="sm"
                                                    name="description"
                                                    value={filterObj.description}
                                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                                <Select
                                                    id='buyerId'
                                                    isSearchable
                                                    isLoading={!isBuyerDropdownLoaded}
                                                    placeholder="Buyer"
                                                    name="buyer"
                                                    isClearable
                                                    maxMenuHeight={200}
                                                    menuShouldScrollIntoView
                                                    theme={selectThemeColors}
                                                    options={dropDownBuyers}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                    value={filterObj?.buyer}
                                                    onChange={( data, e ) => {
                                                        handleFilterDropdown( data, e );
                                                    }}
                                                    onFocus={() => { handleBuyerOnFocus(); }}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                                <Select
                                                    id='departmentId'
                                                    isSearchable
                                                    isLoading={!isDropDownBuyerDepartmentsLoaded}
                                                    placeholder="Department"
                                                    name="department"
                                                    isClearable
                                                    maxMenuHeight={200}
                                                    menuShouldScrollIntoView
                                                    theme={selectThemeColors}
                                                    options={dropDownBuyerDepartments}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                    value={filterObj?.department}
                                                    onChange={( data, e ) => {
                                                        handleFilterDropdown( data, e );
                                                    }}
                                                    onFocus={() => { handleDepartmentOnFocus(); }}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                                <Select
                                                    id='styleCategorytId'
                                                    isSearchable
                                                    isLoading={!isDropDownStyleCategoriesLoaded}
                                                    placeholder="Style Category"
                                                    name="styleCategory"
                                                    isClearable
                                                    maxMenuHeight={200}
                                                    menuShouldScrollIntoView
                                                    theme={selectThemeColors}
                                                    options={dropDownStyleCategories}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                    value={filterObj?.styleCategory}
                                                    onChange={( data, e ) => {
                                                        handleFilterDropdown( data, e );
                                                    }}
                                                    onFocus={() => { handleStyleCategoryOnFocus(); }}
                                                />
                                            </Col>


                                        </Row>
                                        <Row >
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1">
                                                <Select
                                                    id='productCategoryId'
                                                    isSearchable
                                                    isLoading={!isDropDownProductCategoriesLoaded}
                                                    placeholder="Prod. Category"
                                                    name="productCategory"
                                                    isClearable
                                                    maxMenuHeight={200}
                                                    menuShouldScrollIntoView
                                                    theme={selectThemeColors}
                                                    options={dropDownProductCategories}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                    value={filterObj?.productCategory}
                                                    onChange={( data, e ) => {
                                                        handleFilterDropdown( data, e );
                                                    }}
                                                    onFocus={() => { handleProductCategoryOnFocus(); }}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1">
                                                <Select
                                                    id='merchandiserId'
                                                    isSearchable
                                                    isLoading={!isUserDropdownLoaded}
                                                    placeholder="Merchandiser"
                                                    name="merchandiser"
                                                    isClearable
                                                    maxMenuHeight={200}
                                                    menuShouldScrollIntoView
                                                    theme={selectThemeColors}
                                                    options={userDropdown}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                    value={filterObj?.merchandiser}
                                                    onChange={( data, e ) => {
                                                        handleFilterDropdown( data, e );
                                                    }}
                                                    onFocus={() => { handleUserDropdownOnFocus(); }}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1">
                                                <Select
                                                    id='yearId'
                                                    isSearchable
                                                    //    isLoading={!dropDownBuyers.length}
                                                    placeholder="Year"
                                                    name="year"
                                                    isClearable
                                                    maxMenuHeight={200}
                                                    menuShouldScrollIntoView
                                                    theme={selectThemeColors}
                                                    options={selectYear}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                    value={filterObj?.year}
                                                    onChange={( data, e ) => {
                                                        handleFilterDropdown( data, e );
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1">
                                                <Select
                                                    id='buyerId'
                                                    isSearchable
                                                    placeholder="Season"
                                                    isLoading={!isDropDownSeasonsLoaded}
                                                    name="season"
                                                    isClearable
                                                    maxMenuHeight={200}
                                                    menuShouldScrollIntoView
                                                    theme={selectThemeColors}
                                                    options={dropDownSeasons}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                    value={filterObj?.season}
                                                    onChange={( data, e ) => {
                                                        handleFilterDropdown( data, e );
                                                    }}
                                                    onFocus={() => { handleSeasonOnFocus(); }}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1">
                                                <Select
                                                    id='statusId'
                                                    isSearchable
                                                    name="status"
                                                    placeholder="Status"
                                                    isClearable
                                                    maxMenuHeight={200}
                                                    menuShouldScrollIntoView
                                                    theme={selectThemeColors}
                                                    options={styleStatus}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    value={filterObj?.status}
                                                    onChange={( data, e ) => {
                                                        handleFilterDropdown( data, e );
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={3} className="mt-1">

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
                                className="react-custom-dataTable"
                                conditionalRowStyles={[
                                    {
                                        when: row => selectedRowId.some( s => s === row.id ),
                                        style: {
                                            backgroundColor: '#E1FEEB'
                                        }
                                    }
                                ]}
                                dense
                                progressPending={!isSingleStyleDataLoaded}
                                progressComponent={
                                    <CustomPreLoader />
                                }
                                highlightOnHover
                                selectableRows
                                responsive
                                noHeader
                                paginationServer
                                subHeader={false}
                                expandableRows={false}
                                sortIcon={<ChevronDown />}
                                expandOnRowClicked
                                clearSelectedRows={clearSelectedRow}
                                onSelectedRowsChange={handleRowSelected}
                                contextActions={<Delete color='red' size={28} onClick={() => { handleDeleteStyleRange(); }} />}
                                expandableRowsComponent={<StyleExpandRow data={data => data} />}
                                onSort={handleSort}
                                defaultSortField={sortedBy}
                                defaultSortAsc
                                sortServer
                                columns={handleGetStyleColumns( userPermission, authPermissions )}
                                persistTableHead
                                data={queryData}

                            />
                        </div>
                        <div>
                            <CustomPagination />
                        </div>
                    </CardBody>
                </Card>
            </UILoader>
        </div>
    );
};

export default StyleList;

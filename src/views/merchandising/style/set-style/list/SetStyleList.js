
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw, Settings, XSquare } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { Button, Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from 'reactstrap';
import ActionMenu from '../../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../../utility/custom/TableCustomerHeader';
import { selectYear, styleStatus } from '../../../../../utility/enums';
import { selectThemeColors } from '../../../../../utility/Utils';
import { getDropDownBuyerDepartments } from '../../../buyer-department/store/actions';
import { getDropDownBuyers } from '../../../buyer/store/actions';
import { getDropDownSeasons } from '../../../season/store/actions';
import { deleteRangeSetStyle, getSetStyleById, getSetStylesByQuery, getUploadedFileBySetStyleId, getUploadedImagesBySetStyleId } from '../store/actions';
import SetStyleExpandRow from './SetStyleExpandRow';
import { setStylesTableColumn } from './SetStyleTableColumn';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'stylesList',
        name: 'Single Styles',
        link: "/single-styles",
        isActive: false
    },
    {
        id: 'setStyleList',
        name: 'Set-Styles',
        link: "/set-styles",
        isActive: true
    }
];

const SetStyleList = () => {
    const dispatch = useDispatch();
    const defaultFilterValue = {
        buyer: null,
        department: null,
        season: null,
        styleNo: '',
        merchandiser: null,
        year: null,
        status: null
    };

    const defaultFilteredArrayValue = [
        {
            column: "styleNo",
            value: ''
        },
        {
            column: "BuyerName",
            value: ''
        },
        {
            column: "BuyerDepartment",
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

    const { setStyles, total, queryData, isSetStyleDataLoaded } = useSelector( ( { setStyles } ) => setStyles );

    const { push } = useHistory();
    const [isActive, setIsActive] = useState( true );

    const { dropDownBuyers } = useSelector( ( { buyers } ) => buyers );
    const { dropDownBuyerDepartments } = useSelector( ( { buyerDepartments } ) => buyerDepartments );
    const { dropDownSeasons } = useSelector( ( { seasons } ) => seasons );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

    const [searchTerm, setSearchTerm] = useState( '' );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'asc' );
    const [orderBy, setOrderBy] = useState( 'styleNo' );
    const [currentStatus, setCurrentStatus] = useState( { value: '', label: 'Select Status', number: 0 } );
    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );

    console.log( queryData );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isActive
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const getAllSetStyles = () => {
        dispatch( getSetStylesByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        getAllSetStyles();
    }, [] );

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( [
            {
                column: "styleNo",
                operator: "string",
                value: ''
            },
            {
                column: "BuyerName",
                operator: "string",
                value: ''
            },
            {
                column: "BuyerDepartment",
                operator: "string",
                value: ''
            },
            {
                column: "year",
                operator: "string",
                value: ''
            },
            {
                column: "season",
                operator: "string",
                value: ''
            },
            {
                column: "status",
                value: ''
            }
        ] );
        getAllSetStyles();
    };

    const handleSearch = () => {
        dispatch(
            getSetStylesByQuery( paramsObj, filteredData )
        );
    };
    const handleBuyerOnFocus = () => {
        dispatch( getDropDownBuyers() );
    };

    const handleDepartmentOnFocus = () => {
        dispatch( getDropDownBuyerDepartments() );
    };
    const handleSeasonOnFocus = () => {
        dispatch( getDropDownSeasons() );
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
            if ( name === 'buyer' && filter.column === 'BuyerName' ) {
                filter['value'] = data ? data?.label : '';
            } else if ( name === "department" && filter.column === 'BuyerDepartment' ) {
                filter['value'] = data ? data?.label : '';
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

        console.log( 'updatedData', JSON.stringify( updatedData, null, 2 ) );
    };
    const handleIsActive = ( checked ) => {
        setIsActive( checked );
        dispatch(
            getSetStylesByQuery( {
                page: 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                isActive: checked
            }, filteredData )
        );
    };

    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( direction );
        setOrderBy( selector );
        dispatch(
            getSetStylesByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                orderBy: selector,
                sortedBy: direction,
                isActive
            }, filteredData )
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
            getSetStylesByQuery( {
                page: currentPage,
                perPage: rowsPerPage
                // division: currentDepartment.value,
                // status: currentStatus.value,
                // q: searchTerm,
                // sortedBy,
                // orderBy
            } )
        );
    };

    // ** Delete Rang
    const handleDeleteStyleRange = () => {
        dispatch( deleteRangeSetStyle( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range
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
            return setStyles.slice( 0, rowsPerPage );
        }
    };
    // ** Function in get data on page change
    const handlePagination = page => {
        dispatch(
            getSetStylesByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                isActive
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };
    // ** Function in get data on rows per page
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        dispatch(
            getSetStylesByQuery( {
                page: currentPage,
                perPage: value,
                sortedBy,
                orderBy,
                isActive
            }, filteredData )
        );
        setRowsPerPage( value );
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
    const handleAddNew = () => {
        push( '/new-set-style' );
        dispatch( getSetStyleById( null ) );
        dispatch( getUploadedImagesBySetStyleId( null ) );
        dispatch( getUploadedFileBySetStyleId( null ) );
    };
    return (
        <div>
            <Card className="mt-3">
                <ActionMenu
                    breadcrumb={breadcrumb}
                    title='Set Styles'
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

                    <div>
                        <TableCustomerHeader
                            handlePerPage={handlePerPage}
                            rowsPerPage={rowsPerPage}
                            searchTerm={searchTerm}
                        >
                            <div className='active-archive-btn-box'>
                                <Button.Ripple
                                    onClick={() => handleIsActive( !isActive )}
                                    className="active-archive-btn"
                                    color='white'
                                    size="sm"

                                    id='activeId'
                                >
                                    {isActive ? ' Archive' : 'Active '}
                                </Button.Ripple>
                            </div>
                            <Button.Ripple
                                onClick={() => getAllSetStyles()}
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
                                    <CreatableSelect
                                        id='buyerId'
                                        isSearchable
                                        //  isLoading={!dropDownBuyers.length}
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
                                <Col>
                                    <CreatableSelect
                                        id='departmentId'
                                        isSearchable
                                        //  isLoading={!dropDownBuyers.length}
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
                                <Col>
                                    <CreatableSelect
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
                                <Col>
                                    <CreatableSelect
                                        id='buyerId'
                                        isSearchable
                                        placeholder="Season"
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
                                {/* <Col>
                                    <CreatableSelect
                                        id='merchandiserId'
                                        isSearchable
                                        isLoading={!dropDownBuyers.length}
                                        placeholder="Merchandiser"
                                        isClearable
                                        name="merchandiser"
                                        maxMenuHeight={200}
                                        menuShouldScrollIntoView
                                        theme={selectThemeColors}
                                        options={[]}
                                        classNamePrefix='dropdown'
                                        className="erp-dropdown-select"
                                        // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                        value={filterObj?.merchandiser}
                                        onChange={( data, e ) => {
                                            handleFilterDropdown( data, e );
                                        }}
                                    //    onFocus={() => { handleBuyerOnFocus(); }}
                                    />
                                </Col> */}
                                <Col>
                                    <CreatableSelect
                                        id='statusId'
                                        isSearchable
                                        isLoading={!dropDownBuyers.length}
                                        name="status"
                                        placeholder="Status"
                                        isClearable
                                        maxMenuHeight={200}
                                        menuShouldScrollIntoView
                                        theme={selectThemeColors}
                                        options={styleStatus}
                                        classNamePrefix='dropdown'
                                        className="erp-dropdown-select"
                                        // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                        value={filterObj?.status}
                                        onChange={( data, e ) => {
                                            handleFilterDropdown( data, e );
                                        }}
                                    //    onFocus={() => { handleBuyerOnFocus(); }}
                                    />
                                </Col>
                                <Col>
                                    <Input
                                        placeholder="Style Number"
                                        bsSize="sm"
                                        name="styleNo"
                                        value={filterObj.styleNo}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
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
                            className="react-custom-dataTable"
                            dense
                            progressPending={!isSetStyleDataLoaded}
                            progressComponent={
                                <CustomPreLoader />
                            }
                            highlightOnHover
                            selectableRows
                            noHeader
                            responsive
                            paginationServer
                            expandableRows={false}
                            persistTableHead
                            subHeader={false}
                            sortIcon={<ChevronDown />}
                            expandOnRowClicked
                            contextActions={<Button.Ripple onClick={() => { handleDeleteStyleRange(); }} className='btn-icon ' color='flat-danger'>
                                <XSquare size={24} />
                            </Button.Ripple>}
                            onSelectedRowsChange={handleRowSelected}
                            clearSelectedRows={clearSelectedRow}
                            expandableRowsComponent={<SetStyleExpandRow data={data => data} />}
                            onSort={handleSort}
                            columns={setStylesTableColumn}
                            data={dataToRender()}
                        />
                    </div>
                    <div>
                        <CustomPagination />
                    </div>
                </CardBody>

            </Card>

        </div>
    );
};

export default SetStyleList;

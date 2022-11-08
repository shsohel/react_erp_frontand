
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, Printer, RefreshCw, Settings, XSquare } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from "reactstrap";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
// import { budgetStatus } from 'utility/enums';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { budgetStatus } from '../../../../utility/enums';
import { isPermit, selectThemeColors } from '../../../../utility/Utils';
import { getBuyersStyles, getDropDownBuyers } from '../../buyer/store/actions';
import { getStylePurchaseOrderDropdown } from '../../purchase-order/store/actions';
import { cleanAllBudgetState, deleteRangeBudget, getBudgetById, getBudgetByQuery } from '../store/actions';
import BudgetExpandRow from './BudgetExpandRow';
import { handleGetBudgetColumns } from './BudgetTableColumn';


const BOMList = () => {
    const dispatch = useDispatch();
    const { push } = useHistory();
    const stateWithBuyer = JSON.parse( localStorage.getItem( 'buyerAndStyle' ) );

    const defaultFilterValue = {
        budgetNumber: '',
        buyer: null,
        style: null,
        order: null,
        budgetCategory: '',
        isApproved: true,
        approvalDate: '',
        status: null
    };

    const defaultFilteredArrayValue = [
        {
            column: "budgetNumber",
            value: ''
        },
        {
            column: "buyerId",
            value: ''
        },
        {
            column: "styleId",
            value: ''
        },
        {
            column: "orderId",
            value: ''
        },
        {
            column: "budgetCategory",
            value: ''
        },
        {
            column: "isApproved",
            value: ''
        },
        {
            column: "approvalDate",
            value: ''
        },
        {
            column: "status",
            value: ''
        }


    ];
    // ** Global States
    const {
        budgets,
        total,
        isBudgetDataLoaded,
        selectedBudget,
        queryData
    } = useSelector( ( { budgets } ) => budgets );

    const { stylePurchaseOrderDropdown } = useSelector( ( { purchaseOrders } ) => purchaseOrders );
    const { dropDownBuyers, buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [isActive, setIsActive] = useState( true );

    // ** buyerAgents States
    const [searchTerm, setSearchTerm] = useState( '' );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'budgetNumber' );

    const [orderBy, setOrderBy] = useState( 'asc' );
    const [currentCountry, setCurrentCountry] = useState( { value: '', label: 'Select Country', number: 0 } );
    const [currentStatus, setCurrentStatus] = useState( { value: '', label: 'Select Status', number: 0 } );
    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );
    const [isApproved, setIsApproved] = useState( true );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        // isApproved,
        isActive
    };
    const filteredData = filteredArray.filter( filter => filter.value?.length );


    const getAllBudgets = () => {

        const newFilterArray = filteredArray.map( filter => {
            if ( filter.column === "buyerId" ) {
                filter['value'] = stateWithBuyer?.buyer?.value ?? '';
            } else if ( filter.column === "styleId" ) {
                filter['value'] = stateWithBuyer?.style?.value ?? '';

            }
            return filter;
        } );

        setFilteredArray( newFilterArray );

        const filteredData = newFilterArray.filter( filter => filter.value?.length );

        dispatch( getBudgetByQuery( paramsObj, filteredData ) );

        setFilterObj( {
            ...filterObj,
            buyer: stateWithBuyer?.buyer,
            style: stateWithBuyer?.style
        } );
    };
    useEffect( () => {
        getAllBudgets();
    }, [] );
    const handleBuyerOnFocus = () => {
        dispatch( getDropDownBuyers() );
    };


    const handleStyleOnFocus = ( buyerId ) => {
        dispatch( getBuyersStyles( buyerId ) );
    };

    const handlePurchaseOrderOnFocus = () => {
        const style = [
            {
                column: "styleId",
                value: filterObj?.style?.value
            }
        ];
        dispatch( getStylePurchaseOrderDropdown( style ) );
    };
    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getBudgetByQuery( paramsObj, [] ) );

        const obj = {
            ...stateWithBuyer,
            buyer: null,
            style: null,
            styleDescription: '',
            styleCategory: '',
            status: '',
            isSetStyle: false
        };
        localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );
    };
    const handleSearch = () => {
        dispatch(
            getBudgetByQuery( paramsObj, filteredData )
        );
    };

    const handleIsActive = ( checked ) => {
        setIsActive( checked );
        dispatch(
            getBudgetByQuery( {
                page: 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                isActive: checked
            }, filteredData )
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

    const handleFilterDropdown = ( data, e ) => {
        const { name } = e;
        console.log( name );

        setFilterObj( {
            ...filterObj,
            [name]: data,
            ['style']: name === 'buyer' ? null : name === 'style' ? data : filterObj?.style,
            ['order']: name === 'buyer' ? null : name === 'style' ? null : name === 'order' ? data : filterObj?.style
        } );

        if ( name === 'style' ) {
            const obj = {
                ...stateWithBuyer,
                style: data,
                status: data?.status ?? '',
                styleDescription: data?.description ?? '',
                styleCategory: data?.styleCategory ?? '',
                isSetStyle: data?.isSetStyle ?? false

            };
            localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );
        }
        if ( name === 'buyer' ) {
            const obj = {
                ...stateWithBuyer,
                style: null,
                styleDescription: '',
                styleCategory: '',
                status: '',
                isSetStyle: false
            };
            localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );

        }
        const updatedData = filteredArray.map( filter => {
            if ( name === 'buyer' ) {

                if ( filter.column === 'styleId' ) {
                    filter['value'] = '';
                }
                if ( filter.column === 'buyerId' ) {
                    filter['value'] = data ? data?.value : '';
                }
                if ( filter.column === 'orderId' ) {
                    filter['value'] = '';
                }
            } else if ( name === 'style' ) {
                if ( filter.column === 'styleId' ) {
                    filter['value'] = data ? data?.value : '';
                }
                if ( filter.column === 'orderId' ) {
                    filter['value'] = '';
                }

            } else if ( name === 'order' && filter.column === 'orderId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'status' && filter.column === 'status' ) {
                filter['value'] = data ? data?.label : '';
            }
            return filter;
        } );
        setFilteredArray( updatedData );

    };

    const handleApprove = ( e ) => {
        const { checked } = e.target;
        setIsApproved( checked );
        dispatch(
            getBudgetByQuery( {
                page: 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                isActive,
                isApproved: checked
            }, filteredData )
        );
    };
    // ** Function in get data on page change
    const handlePagination = page => {
        dispatch(
            getBudgetByQuery( {
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
            getBudgetByQuery( {
                page: currentPage,
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
            getBudgetByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                isActive

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
            getBudgetByQuery( {
                page: currentPage,
                perPage: rowsPerPage
                // country: currentCountry.value,
                // status: currentStatus.value,
                // q: searchTerm,
                // sortedBy,
                // orderBy
            } )
        );
    };

    // ** Delete Rang
    const handleDeleteBudgetRange = () => {
        dispatch( deleteRangeBudget( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range
    const handleAddNew = () => {
        dispatch( getBudgetById( null ) );
        dispatch( cleanAllBudgetState() );
        push( '/add-budget' );
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
            id: 'styleList',
            name: 'Styles',
            link: stateWithBuyer?.isSetStyle ? "/set-styles" : "/single-styles",
            isActive: false,
            hidden: !isPermit( userPermission?.StyleList, authPermissions )
        },
        {
            id: 'po',
            name: 'PO',
            link: "/stye-purchase-order",
            isActive: false,
            hidden: !isPermit( userPermission?.PurchaseOrderList, authPermissions )
        },
        {
            id: 'costingsList',
            name: 'Costings',
            link: "/costings",
            isActive: false,
            hidden: !isPermit( userPermission?.CostingList, authPermissions )
        },
        {
            id: 'consumptions',
            name: 'Consumptions',
            link: "/consumptions",
            isActive: false,
            hidden: !isPermit( userPermission?.ConsumptionList, authPermissions )

        },
        {
            id: 'budgetList',
            name: 'Budgets',
            link: "/budget",
            isActive: true,
            hidden: false
        },
        {
            id: 'procurementList',
            name: 'IPO',
            link: "/procurements",
            isActive: false,
            hidden: !isPermit( userPermission?.SupplierOrderList, authPermissions )

        }
    ];
    return (
        <div>
            <Card className="mt-3">
                <ActionMenu
                    breadcrumb={breadcrumb}
                    title='Budgets'
                    moreButton={isPermit( userPermission?.BudgetCreate, authPermissions )}
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
                        hidden={!isPermit( userPermission?.BudgetCreate, authPermissions )}
                    >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="success"
                            onClick={() => { handleAddNew(); }}
                        >
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
                                onClick={() => getAllBudgets()}
                                className='btn-icon'
                                size="sm"
                                color='flat-primary'
                                id='freshBtnId'
                            >
                                <RefreshCw size={18} />
                            </Button.Ripple>
                            <UncontrolledTooltip placement='bottom-end' target='freshBtnId'>
                                Refresh
                            </UncontrolledTooltip>
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
                                        <Col xs={12} sm={12} md={6} lg={2} className="mt-0 mt-sm-0  mt-md-0 mt-lg-0">
                                            <Input
                                                placeholder="Budget No"
                                                bsSize="sm"
                                                name="budgetNumber"
                                                value={filterObj.budgetNumber}
                                                onChange={( e ) => handleFilterBoxOnChange( e )}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-0 mt-lg-0">
                                            <Select
                                                id='buyerId'
                                                isSearchable
                                                placeholder="Buyer"
                                                name="buyer"
                                                isClearable
                                                maxMenuHeight={200}
                                                menuShouldScrollIntoView
                                                theme={selectThemeColors}
                                                options={dropDownBuyers}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"
                                                // value={filterObj?.buyer}
                                                value={filterObj?.buyer}

                                                onChange={( data, e ) => {
                                                    handleFilterDropdown( data, e );
                                                }}
                                                onFocus={() => { handleBuyerOnFocus(); }}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                            <Select
                                                id='styleId'
                                                isSearchable
                                                placeholder="Style No"
                                                name="style"
                                                isClearable
                                                maxMenuHeight={200}
                                                menuShouldScrollIntoView
                                                theme={selectThemeColors}
                                                options={buyerStylesDropdown}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"
                                                // value={filterObj?.style}
                                                value={filterObj?.style}

                                                onChange={( data, e ) => {
                                                    handleFilterDropdown( data, e );
                                                }}
                                                onFocus={() => { handleStyleOnFocus( filterObj.buyer?.value ); }}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                            <Select
                                                id='orderId'
                                                isSearchable
                                                placeholder="Order No"
                                                name="order"
                                                isClearable
                                                maxMenuHeight={200}
                                                menuShouldScrollIntoView
                                                theme={selectThemeColors}
                                                options={stylePurchaseOrderDropdown}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"
                                                value={filterObj?.order}
                                                onChange={( data, e ) => {
                                                    handleFilterDropdown( data, e );
                                                }}
                                                onFocus={() => { handlePurchaseOrderOnFocus(); }}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                            <Select
                                                id='statusId'
                                                isSearchable
                                                placeholder="Status"
                                                name="status"
                                                isClearable
                                                maxMenuHeight={200}
                                                menuShouldScrollIntoView
                                                theme={selectThemeColors}
                                                options={budgetStatus}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"
                                                value={filterObj?.status}
                                                onChange={( data, e ) => {
                                                    handleFilterDropdown( data, e );
                                                }}
                                                onFocus={() => { handlePurchaseOrderOnFocus(); }}
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
                            onSelectedRowsChange={handleRowSelected}
                            onSort={handleSort}
                            defaultSortField={sortedBy}
                            defaultSortAsc
                            sortServer
                            progressPending={!isBudgetDataLoaded}
                            progressComponent={
                                <CustomPreLoader />
                            }
                            contextActions={<>
                                <Button.Ripple
                                    htmlFor="deleteItem"
                                    onClick={() => { handleDeleteBudgetRange(); }}
                                    className='btn-icon ' color='flat-danger'>
                                    <XSquare id="deleteItem" size={24} />
                                </Button.Ripple>

                                <Button.Ripple
                                    htmlFor="print"
                                    className='btn-icon '
                                    color='flat-primary'
                                >
                                    <Printer
                                        id="print"
                                        size={24} />
                                </Button.Ripple>
                            </>}

                            dense
                            subHeader={false}
                            noHeader
                            highlightOnHover
                            selectableRows
                            clearSelectedRows={clearSelectedRow}
                            responsive={true}
                            paginationServer
                            expandableRows={false}
                            expandableRowsComponent={<BudgetExpandRow data={data => data} />}
                            expandOnRowClicked
                            persistTableHead
                            columns={handleGetBudgetColumns( userPermission, authPermissions )}
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


        </div>
    );
};

export default BOMList;

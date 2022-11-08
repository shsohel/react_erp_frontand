import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Delete, Filter, RefreshCw, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { costingStatus } from '../../../../utility/enums';
import { isPermit, selectThemeColors } from '../../../../utility/Utils';
import { getBuyersStyles, getDropDownBuyers } from '../../buyer/store/actions';
import { getStylePurchaseOrderDropdown } from '../../purchase-order/store/actions';
import { clearAllCostingState, deleteRangeCosting, getCostingByQuery } from '../store/action';
import CostingExpandRow from './CostingExpandRow';
import { handleGetCostingColumns } from './CostingTableColumn';


const CostingList = () => {
    const dispatch = useDispatch();

    const defaultFilteredArrayValue = [
        {
            column: "costingNumber",
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
            column: "status",
            value: ''
        }
    ];
    const defaultFilterValue = {
        costingNumber: '',
        buyer: null,
        style: null,
        order: null,
        status: null
    };
    const { total, queryData, isCostingDataLoaded } = useSelector( ( { costings } ) => costings );

    const { push } = useHistory();
    const stateWithBuyer = JSON.parse( localStorage.getItem( 'buyerAndStyle' ) );

    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [isActive, setIsActive] = useState( true );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'costingNumber' );
    const [orderBy, setOrderBy] = useState( 'desc' );
    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );
    const { dropDownBuyers, buyerStylesDropdown, isBuyerDropdownLoaded, isBuyerStylesDropdownLoaded } = useSelector( ( { buyers } ) => buyers );
    const { stylePurchaseOrderDropdown, isStylePurchaseOrderDropdown } = useSelector( ( { purchaseOrders } ) => purchaseOrders );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isActive,
        isSetStyle: stateWithBuyer?.isSetStyle
    };


    const filteredData = filteredArray.filter( filter => filter.value?.length );


    const getAllCostings = () => {

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

        dispatch( getCostingByQuery( paramsObj, filteredData ) );

        setFilterObj( {
            ...filterObj,
            buyer: stateWithBuyer?.buyer,
            style: stateWithBuyer?.style
        } );
    };


    useEffect( () => {
        getAllCostings();
    }, [] );

    const handleSearch = () => {
        const filteredData = filteredArray.filter( filter => filter.value?.length );
        dispatch(
            getCostingByQuery( paramsObj, filteredData )
        );
    };
    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );

        dispatch( getCostingByQuery( paramsObj, [] ) );
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

    const handleBuyerOnFocus = () => {
        if ( !dropDownBuyers.length ) {
            dispatch( getDropDownBuyers() );
        }
    };


    const handleStyleOnFocus = ( buyerId ) => {
        if ( !buyerStylesDropdown.length ) {
            dispatch( getBuyersStyles( buyerId ) );
        }
    };


    const handlePurchaseOrderOnFocus = () => {
        const style = [
            {
                column: "styleId",
                value: stateWithBuyer?.style?.value
            }
        ];
        if ( !stylePurchaseOrderDropdown.length ) {
            dispatch( getStylePurchaseOrderDropdown( style ) );
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
            dispatch( getStylePurchaseOrderDropdown( [] ) );

        }
        if ( name === 'buyer' ) {
            const obj = {
                ...stateWithBuyer,
                buyer: data,
                style: null,
                styleDescription: '',
                styleCategory: '',
                status: '',
                isSetStyle: false
            };
            localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );
            dispatch( getBuyersStyles( null ) );
            dispatch( getStylePurchaseOrderDropdown( [] ) );
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

            } else if ( name === 'status' && filter.column === 'status' ) {
                filter['value'] = data ? data?.value : '';

            } else if ( name === 'order' && filter.column === 'orderId' ) {
                filter['value'] = data ? data?.value : '';
            }
            return filter;
        } );
        setFilteredArray( updatedData );

    };


    const handleIsActive = ( checked ) => {
        setIsActive( checked );
        dispatch(
            getCostingByQuery( {
                page: 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                isActive: checked
            }, filteredData )
        );
    };

    // ** Function in get data on page change
    const handlePagination = page => {
        dispatch(
            getCostingByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                isActive,
                isSetStyle: stateWithBuyer.isSetStyle
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };

    // ** Function in get data on rows per page
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        dispatch(
            getCostingByQuery( {
                page: currentPage,
                perPage: value,
                sortedBy,
                orderBy,
                isActive,
                isSetStyle: stateWithBuyer.isSetStyle
            }, filteredData )
        );
        setRowsPerPage( value );
    };


    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getCostingByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                isActive,
                isSetStyle: stateWithBuyer.isSetStyle
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
            getCostingByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy,
                orderBy
            } )
        );
    };

    // ** Delete Rang
    const handleDeletePreCostingRange = () => {
        dispatch( deleteRangeCosting( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range

    const handleAddNew = () => {
        dispatch( clearAllCostingState() );
        // dispatch( getCostingById( null ) );
        push( `/new-costing` );
    };

    const handleAddNewSet = () => {
        dispatch( clearAllCostingState() );
        push( `/new-set-costing` );
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
            hidden: false
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
            isActive: true,
            hidden: false
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
            isActive: false,
            hidden: !isPermit( userPermission?.BudgetList, authPermissions )
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
                    moreButton={isPermit( userPermission?.CostingCreate, authPermissions )}
                    title={`Costings | ${stateWithBuyer?.style?.label ?? 'None'}`}
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
                        hidden={!isPermit( userPermission?.CostingCreate, authPermissions )}
                    >
                        <NavLink
                            tag={Button}
                            size="sm"
                            //  disabled={!stateWithBuyer.style}
                            color="success"
                            onClick={() => { handleAddNew(); }}                    >
                            Add New
                        </NavLink>
                    </NavItem>
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            hidden={true}
                            size="sm"
                            //  disabled={!stateWithBuyer.style}
                            color="primary"
                            onClick={() => { handleAddNewSet(); }}                    >
                            Add New (Set)
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
                                onClick={() => getAllCostings()}
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
                                size="sm"
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
                                                placeholder="Costing Number"
                                                bsSize="sm"
                                                name="costingNumber"
                                                value={filterObj.costingNumber}
                                                onChange={( e ) => handleFilterBoxOnChange( e )}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-0 mt-lg-0">
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
                                                value={filterObj?.buyer ?? null}
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
                                                isLoading={!isBuyerStylesDropdownLoaded}
                                                placeholder="Style No"
                                                name="style"
                                                isClearable
                                                maxMenuHeight={200}
                                                menuShouldScrollIntoView
                                                theme={selectThemeColors}
                                                options={buyerStylesDropdown}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"
                                                value={filterObj?.style ?? null}
                                                onChange={( data, e ) => {
                                                    handleFilterDropdown( data, e );
                                                }}
                                                onFocus={() => { handleStyleOnFocus( stateWithBuyer.buyer?.value ); }}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                            <Select
                                                id='orderId'
                                                isSearchable
                                                isLoading={!isStylePurchaseOrderDropdown}
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
                                                options={costingStatus}
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
                                <Col lg={3} className="d-flex justify-content-end">
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
                            progressPending={!isCostingDataLoaded}
                            progressComponent={<CustomPreLoader />}
                            dense
                            noHeader
                            highlightOnHover
                            selectableRows
                            responsive
                            paginationServer
                            expandableRows
                            persistTableHead
                            sortIcon={<ChevronDown />}
                            expandOnRowClicked
                            clearSelectedRows={clearSelectedRow}
                            onSelectedRowsChange={handleRowSelected}
                            contextActions={<Delete color='red' size={28} onClick={() => { handleDeletePreCostingRange(); }} />}
                            expandableRowsComponent={<CostingExpandRow data={data => data} />}
                            onSort={handleSort}
                            defaultSortField={sortedBy}
                            defaultSortAsc
                            sortServer
                            columns={handleGetCostingColumns( userPermission, authPermissions )}
                            data={queryData}

                        />
                    </div>
                    <div>
                        <CustomPagination />
                    </div>
                </CardBody>

            </Card>
        </div >
    );
};

export default CostingList;

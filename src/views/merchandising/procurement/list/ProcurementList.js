

import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from 'reactstrap';
import Card from 'reactstrap/lib/Card';
import CardBody from 'reactstrap/lib/CardBody';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { procurementStatus, source } from '../../../../utility/enums';
import { isPermit, selectThemeColors } from '../../../../utility/Utils';
import { getVendorDropdown } from '../../../inventory/vendor/store/actions';
import { getWarehouseDropdown } from '../../../inventory/warehouse/store/actions';
import { getBudgetDropdownByBuyerId } from '../../budget/store/actions';
import { getBuyersStyles, getDropDownBuyers } from '../../buyer/store/actions';
import { getStylePurchaseOrderDropdown } from '../../purchase-order/store/actions';
import { bindProcurementBasicInfo, clearAllProcurementState, getProcurementByQuery } from '../store/actions';
import ProcurementExpandRow from './ProcurementExpandRow';
import { handleGetProcurementColumns } from './ProcurementTableColumn';


const ProcurementList = () => {
    const dispatch = useDispatch();
    const { push } = useHistory();
    const baseModule = localStorage.getItem( 'module' );

    const stateWithBuyer = JSON.parse( localStorage.getItem( 'buyerAndStyle' ) );

    const defaultFilterValue = {
        buyer: null,
        style: null,
        budget: null,
        sysId: '',
        orderNumber: '',
        supplier: null,
        status: null,
        source: null,
        amount: '',
        buyerPO: null

    };

    const defaultFilteredArrayValue = [
        {
            column: "sysId",
            value: ''
        },
        {
            column: "orderNumber",
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
            column: "buyerPOId",
            value: ''
        },
        {
            column: "budgetId",
            value: ''
        },
        {
            column: "supplierId",
            value: ''
        },
        {
            column: "status",
            value: ''
        },
        {
            column: "amount",
            value: ''
        },
        {
            column: "source",
            value: ''
        }


    ];
    const { total, queryData, procurementBasicInfo, isProcurementDataLoaded } = useSelector( ( { procurements } ) => procurements );
    const { dropDownBuyers, buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );
    const { budgetsDropdown } = useSelector( ( { budgets } ) => budgets );
    const { stylePurchaseOrderDropdown } = useSelector( ( { purchaseOrders } ) => purchaseOrders );
    const { vendorDropdown } = useSelector( ( { vendors } ) => vendors );

    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [isActive, setIsActive] = useState( true );

    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( '' );

    const [orderBy, setOrderBy] = useState( 'asc' );
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

    const filteredData = filteredArray.filter( filter => filter.value?.length );

    const getAllProcurements = () => {

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

        dispatch( getProcurementByQuery( paramsObj, filteredData ) );

        setFilterObj( {
            ...filterObj,
            buyer: stateWithBuyer?.buyer,
            style: stateWithBuyer?.style
        } );
    };

    useEffect( () => {
        getAllProcurements();
    }, [] );

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getProcurementByQuery( paramsObj, [] ) );

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
        const filteredData = filteredArray.filter( filter => filter.value?.length );

        dispatch(
            getProcurementByQuery( { ...paramsObj, page: 1 }, filteredData )
        );
    };

    const handleBuyerOnFocus = () => {
        dispatch( getDropDownBuyers() );
    };

    const handleStyleOnFocus = ( buyerId ) => {
        dispatch( getBuyersStyles( buyerId ) );
    };

    const handleBudgetDropdownOnFocus = ( buyerId ) => {
        dispatch( getBudgetDropdownByBuyerId( buyerId ) );
    };

    const handleVendorDropdownOnFocus = () => {
        dispatch( getVendorDropdown() );
    };

    const handleWarehouseDropdownOnFocus = () => {
        dispatch( getWarehouseDropdown() );
    };

    const handlePurchaseOrderOnFocus = () => {
        const style = [
            {
                column: "styleId",
                value: stateWithBuyer?.style?.value
            }
        ];
        dispatch( getStylePurchaseOrderDropdown( style ) );
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
            ['budget']: name === 'buyer' ? null : name === 'budget' ? data : filterObj?.budget,
            ['buyerPO']: name === 'buyer' || name === 'style' ? null : name === 'buyerPO' ? data : filterObj?.buyerPO
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
                buyer: data,
                style: null,
                styleDescription: '',
                styleCategory: '',
                status: '',
                isSetStyle: false
            };
            localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );

        }
        const updatedData = filteredArray.map( filter => {
            if ( name === 'buyer' && filter.column === 'buyerId' ) {
                filter['value'] = data ? data?.value : '';

            } else if ( name === 'supplier' && filter.column === 'supplierId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'style' && filter.column === 'styleId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'budget' && filter.column === 'budgetId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'status' && filter.column === 'status' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'buyerPO' && filter.column === 'buyerPOId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'source' && filter.column === 'source' ) {
                filter['value'] = data ? data?.value : '';
            }
            if ( name === 'buyer' && filter.column === 'styleId' ) {
                filter['value'] = '';
            }
            if ( name === 'buyer' && filter.column === 'buyerPOId' ) {
                filter['value'] = '';
            }
            if ( name === 'buyer' && filter.column === 'budgetId' ) {
                filter['value'] = '';
            }
            if ( name === 'style' && filter.column === 'buyerPOId' ) {
                filter['value'] = '';
            }

            return filter;
        } );
        setFilteredArray( updatedData );
    };

    const handleIsActive = ( checked ) => {
        setIsActive( checked );
        dispatch(
            getProcurementByQuery( {
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
            getProcurementByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy
                // isActive
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };

    // ** Function in get data on rows per page
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        dispatch(
            getProcurementByQuery( {
                page: currentPage,
                perPage: value,
                sortedBy,
                orderBy
                // isActive
            }, filteredData )
        );
        setRowsPerPage( value );
    };


    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getProcurementByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                orderBy: direction,
                sortedBy: selector
                // isActive
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
            getProcurementByQuery( {
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
    const handleDeleteProcurementRange = () => {
        // dispatch( deleteRangeProcurement( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range


    const handleAddNew = () => {
        // dispatch( getProcurementById( null ) );
        // dispatch( getBudgetBuyerPO( null ) );
        // dispatch( getBudgetItems( null ) );
        push( '/new-procurement' );
        // dispatch( bindProcurementItems( [] ) );
        dispatch( clearAllProcurementState() );
    };

    const handleNormalAddNew = () => {
        dispatch( clearAllProcurementState() );
        push( '/new-independent-procurement' );
        const updatedObj = {
            ...procurementBasicInfo,
            isNormalOrder: true
        };
        dispatch( bindProcurementBasicInfo( updatedObj ) );

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
            hidden: baseModule === "Inventory" || !isPermit( userPermission?.StyleList, authPermissions )
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
            hidden: baseModule === "Inventory" || !isPermit( userPermission?.CostingList, authPermissions )
        },
        {
            id: 'consumptions',
            name: 'Consumptions',
            link: "/consumptions",
            isActive: false,
            hidden: baseModule === "Inventory" || !isPermit( userPermission?.ConsumptionList, authPermissions )
        },
        {
            id: 'budgetList',
            name: 'Budgets',
            link: "/budget",
            isActive: false,
            hidden: baseModule === "Inventory" || !isPermit( userPermission?.BudgetList, authPermissions )

        },
        {
            id: 'procurementList',
            name: 'IPO',
            link: "/procurements",
            isActive: true,
            hidden: false

        },
        {
            id: 'ipIList',
            name: 'IPI',
            link: "/pis",
            isActive: false,
            hidden: !isPermit( userPermission?.ProformaInvoiceList, authPermissions )

        }
    ];

    console.log( 'filteredArray', JSON.stringify( filteredArray, null, 2 ) );
    return (
        <div>
            <Card className="mt-3">
                <ActionMenu
                    breadcrumb={breadcrumb}
                    title='IPO'
                    moreButton={isPermit( userPermission?.SupplierOrderCreate, authPermissions )}
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
                        hidden={!isPermit( userPermission?.SupplierOrderCreate, authPermissions )}
                    >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="success"
                            onClick={() => { handleAddNew(); }}                    >
                            Add New
                        </NavLink>

                    </NavItem>
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            hidden={!isPermit( userPermission?.SupplierOrderCreate, authPermissions )}
                            size="sm"
                            color="primary"
                            onClick={() => { handleNormalAddNew(); }}
                        >
                            Add New ( independent )
                        </NavLink>

                    </NavItem>
                </ActionMenu>
                <CardBody>

                    <div >
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
                                onClick={() => getAllProcurements()}
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
                                                placeholder="IPO No"
                                                bsSize="sm"
                                                name="orderNumber"
                                                value={filterObj.orderNumber}
                                                onChange={( e ) => handleFilterBoxOnChange( e )}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
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
                                                placeholder="Style"
                                                name="style"
                                                isClearable
                                                maxMenuHeight={200}
                                                menuShouldScrollIntoView
                                                theme={selectThemeColors}
                                                options={buyerStylesDropdown}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"

                                                value={filterObj?.style}
                                                onChange={( data, e ) => {
                                                    handleFilterDropdown( data, e );
                                                }}
                                                onFocus={() => { handleStyleOnFocus( filterObj?.buyer?.value ); }}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                            <Select
                                                id='orderId'
                                                isSearchable
                                                placeholder="Buyer PO"
                                                name="buyerPO"
                                                isClearable
                                                maxMenuHeight={200}
                                                menuShouldScrollIntoView
                                                theme={selectThemeColors}
                                                options={stylePurchaseOrderDropdown}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"
                                                value={filterObj?.buyerPO}
                                                onChange={( data, e ) => {
                                                    handleFilterDropdown( data, e );
                                                }}
                                                onFocus={() => { handlePurchaseOrderOnFocus(); }}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                            <Select
                                                id='budgetId'
                                                isSearchable
                                                placeholder="Budget"
                                                name="budget"
                                                isClearable
                                                maxMenuHeight={200}
                                                menuShouldScrollIntoView
                                                theme={selectThemeColors}
                                                options={budgetsDropdown}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"

                                                value={filterObj?.budget}
                                                onChange={( data, e ) => {
                                                    handleFilterDropdown( data, e );
                                                }}
                                                onFocus={() => { handleBudgetDropdownOnFocus( filterObj?.buyer?.value ); }}
                                            />
                                        </Col>

                                    </Row>
                                    <Row >

                                        <Col xs={12} sm={12} md={6} lg={2} className="mt-1">
                                            <Select
                                                id='supplierId'
                                                isSearchable
                                                placeholder="Supplier"
                                                name="supplier"
                                                isClearable
                                                maxMenuHeight={200}
                                                menuShouldScrollIntoView
                                                theme={selectThemeColors}
                                                options={vendorDropdown}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"

                                                value={filterObj?.supplier}
                                                onChange={( data, e ) => {
                                                    handleFilterDropdown( data, e );
                                                }}
                                                onFocus={() => { handleVendorDropdownOnFocus(); }}
                                            />
                                        </Col>

                                        <Col xs={12} sm={12} md={6} lg={2} className="mt-1">
                                            <Select
                                                id='source'
                                                isSearchable
                                                placeholder="Source"
                                                name="source"
                                                isClearable
                                                maxMenuHeight={200}
                                                menuShouldScrollIntoView
                                                theme={selectThemeColors}
                                                options={source}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"

                                                value={filterObj?.source}
                                                onChange={( data, e ) => {
                                                    handleFilterDropdown( data, e );
                                                }}

                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={2} className="mt-1">
                                            <Input
                                                className="text-right"
                                                placeholder="Amount"
                                                bsSize="sm"
                                                name="amount"
                                                value={filterObj.amount}
                                                onChange={( e ) => handleFilterBoxOnChange( e )}
                                                onFocus={( e ) => e.target.select()}

                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={2} className="mt-1">
                                            <Select
                                                id='statusId'
                                                isSearchable
                                                placeholder="Status"
                                                name="status"
                                                isClearable
                                                maxMenuHeight={200}
                                                menuShouldScrollIntoView
                                                theme={selectThemeColors}
                                                options={procurementStatus}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"

                                                value={filterObj?.status}
                                                onChange={( data, e ) => {
                                                    handleFilterDropdown( data, e );
                                                }}
                                                onFocus={() => { handleVendorDropdownOnFocus(); }}
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
                            progressPending={!isProcurementDataLoaded}
                            progressComponent={
                                <CustomPreLoader />
                            }
                            noHeader
                            dense
                            subHeader={false}
                            highlightOnHover
                            responsive={true}
                            paginationServer
                            expandableRows={false}
                            expandableRowsComponent={<ProcurementExpandRow data={data => data} />}
                            expandOnRowClicked
                            persistTableHead
                            columns={handleGetProcurementColumns( userPermission, authPermissions )}
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

export default ProcurementList;

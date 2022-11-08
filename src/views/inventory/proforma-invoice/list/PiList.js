

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from 'reactstrap';
import Card from 'reactstrap/lib/Card';
import CardBody from 'reactstrap/lib/CardBody';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { getVendorDropdown } from '../../vendor/store/actions';
import { bindSelectedProcurementItems, clearAllPIState, getDataFromIPO, getPiByQuery } from '../store/actions';
import { handleGetPiColumns } from './PiTableColumn';

import Select from 'react-select';
import { procurementStatus, selectPayTerm, selectPurpose, source } from '../../../../utility/enums';
import { isPermit, selectThemeColors } from '../../../../utility/Utils';
import { getBudgetDropdownByBuyerId } from '../../../merchandising/budget/store/actions';
import { getBuyersStyles, getDropDownBuyers } from '../../../merchandising/buyer/store/actions';
import { getProcurementDropdown } from '../../../merchandising/procurement/store/actions';
import { getStylePurchaseOrderDropdown } from '../../../merchandising/purchase-order/store/actions';


const PiList = () => {
    const dispatch = useDispatch();
    const { push } = useHistory();
    const Ipo = JSON.parse( localStorage.getItem( 'IPO' ) );

    const defaultFilterValue = {
        sysId: '',
        piNumber: '',
        piDate: '',
        supplier: null,
        buyer: null,
        orderNumber: null,
        style: null,
        buyerPO: null,
        purpose: null,
        invoiceValue: '',
        payTerm: null,
        source: null,
        amount: '',
        status: null
    };

    const defaultFilteredArrayValue = [
        {
            column: "sysId",
            value: ''
        },
        {
            column: "piNumber",
            value: ''
        },
        {
            column: "supplierId",
            value: ''
        },
        {
            column: "supplierOrderId",
            value: ''
        },
        {
            column: "piDate",
            value: ''
        },
        {
            column: "purpose",
            value: ''
        },
        {
            column: "buyerId",
            value: ''
        },
        {
            column: "budgetId",
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
            column: "payTerm",
            value: ''
        },
        {
            column: "amount",
            value: ''
        },
        {
            column: "source",
            value: ''
        },
        {
            column: "status",
            value: ''
        }
    ];


    const { total, queryData, isPiDataLoaded, isPiDataProgress } = useSelector( ( { pis } ) => pis );
    const { vendorDropdown } = useSelector( ( { vendors } ) => vendors );
    const { dropDownBuyers, buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );
    const { procurementDropdown } = useSelector( ( { procurements } ) => procurements );
    const { stylePurchaseOrderDropdown } = useSelector( ( { purchaseOrders } ) => purchaseOrders );
    const { budgetsDropdown } = useSelector( ( { budgets } ) => budgets );

    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [isActive, setIsActive] = useState( true );

    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'sysId' );

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

    const filteredData = filteredArray.filter( filter => filter?.value?.length );

    const getAllPis = () => {

        const newFilterArray = filteredArray.map( filter => {
            if ( filter.column === "supplierOrderId" ) {
                filter['value'] = Ipo?.ipoId ?? '';
            }
            return filter;
        } );

        setFilteredArray( newFilterArray );

        const filteredData = newFilterArray.filter( filter => filter.value?.length );

        dispatch( getPiByQuery( paramsObj, filteredData ) );
        setFilterObj( {
            ...filterObj,
            orderNumber: Ipo?.ipoId ? { label: Ipo?.orderNumber, value: Ipo?.ipoId } : null
        } );
    };

    useEffect( () => {
        getAllPis();
    }, [] );

    const handleVendorDropdownOnFocus = () => {
        dispatch( getVendorDropdown() );
    };
    const handleBuyerOnFocus = () => {
        dispatch( getDropDownBuyers() );
    };
    const handleProcurementOnFocus = () => {
        dispatch( getProcurementDropdown() );
    };

    const handlePurchaseOrderOnFocus = () => {
        const style = [
            {
                column: "styleId",
                value: filterObj?.style?.value ?? ''
            }
        ];
        dispatch( getStylePurchaseOrderDropdown( style ) );
    };

    const handleBudgetDropdownOnFocus = ( buyerId ) => {
        dispatch( getBudgetDropdownByBuyerId( buyerId ) );
    };

    const handleStyleOnFocus = ( buyerId ) => {
        dispatch( getBuyersStyles( buyerId ) );
    };
    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getPiByQuery( paramsObj, [] ) );

        const obj = {
            ...Ipo,
            orderNumber: '',
            ipoId: ''
        };
        localStorage.setItem( 'IPO', JSON.stringify( obj ) );
    };

    const handleSearch = () => {
        const filteredData = filteredArray.filter( filter => filter.value?.length );

        dispatch(
            getPiByQuery( { ...paramsObj, page: 1 }, filteredData )
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
        setFilterObj( {
            ...filterObj,
            [name]: data,
            ['style']: name === 'buyer' ? null : name === 'style' ? data : filterObj?.style,
            ['budget']: name === 'buyer' ? null : name === 'budget' ? data : filterObj?.budget,
            ['buyerPO']: name === 'buyer' || name === 'style' ? null : name === 'buyerPO' ? data : filterObj?.buyerPO
        } );

        if ( name === 'orderNumber' ) {
            const obj = {
                ...Ipo,
                orderNumber: data?.label ?? '',
                ipoId: data?.value ?? ''
            };
            localStorage.setItem( 'IPO', JSON.stringify( obj ) );
        }

        const updatedData = filteredArray.map( filter => {
            if ( name === 'buyer' && filter.column === 'buyerId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'style' && filter.column === 'styleId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'buyerPO' && filter.column === 'buyerPOId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'supplier' && filter.column === 'supplierId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'purpose' && filter.column === 'purpose' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'payTerm' && filter.column === 'payTerm' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'orderNumber' && filter.column === 'supplierOrderId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'source' && filter.column === 'source' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'budget' && filter.column === 'budgetId' ) {
                filter['value'] = data ? data?.value : '';
            } else if ( name === 'status' && filter.column === 'status' ) {
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
            getPiByQuery( {
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
            getPiByQuery( {
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
            getPiByQuery( {
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
            getPiByQuery( {
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
        const count = Number( Math.ceil( total / rowsPerPage ) );

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
            getPiByQuery( {
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
        if ( Ipo?.ipoId?.length ) {
            dispatch( getDataFromIPO( Ipo?.ipoId, push ) );
        } else {
            push( '/new-pi' );
            dispatch( clearAllPIState() );
            dispatch( bindSelectedProcurementItems( [] ) );
        }

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
            id: 'ipoList',
            name: 'IPO',
            link: "/procurements",
            isActive: false,
            hidden: !isPermit( userPermission?.SupplierOrderList, authPermissions )
        },
        {
            id: 'piList',
            name: 'IPI',
            link: "/pis",
            isActive: true,
            hidden: false
        }
    ];

    return (
        <div>
            <UILoader blocking={isPiDataProgress} loader={<ComponentSpinner />} >
                <Card className="mt-3">
                    <ActionMenu
                        breadcrumb={breadcrumb}
                        title='IPI'
                        moreButton={isPermit( userPermission?.ProformaInvoiceCreate, authPermissions )}
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
                            hidden={!isPermit( userPermission?.ProformaInvoiceCreate, authPermissions )}
                        >
                            <NavLink
                                tag={Button}
                                size="sm"
                                disabled={isPiDataProgress}
                                color="success"
                                onClick={() => { handleAddNew(); }}
                            >
                                Add New
                            </NavLink>
                        </NavItem>
                    </ActionMenu>
                    <CardBody>
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
                                onClick={() => getAllPis()}
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
                        <div >
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
                                                    placeholder="IPI No"
                                                    bsSize="sm"
                                                    name="piNumber"
                                                    value={filterObj.piNumber}
                                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                                <Select
                                                    id='orderNumber'
                                                    isSearchable
                                                    placeholder="IPO"
                                                    name="orderNumber"
                                                    isClearable
                                                    maxMenuHeight={200}
                                                    menuShouldScrollIntoView
                                                    theme={selectThemeColors}
                                                    options={procurementDropdown}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"

                                                    value={filterObj?.orderNumber}
                                                    onChange={( data, e ) => {
                                                        handleFilterDropdown( data, e );
                                                    }}
                                                    onFocus={() => { handleProcurementOnFocus(); }}
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
                                                    id='styleNumber'
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


                                        </Row>
                                        <Row >
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1">
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
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1">
                                                <Select
                                                    id='supplierId'
                                                    isSearchable
                                                    placeholder="Supplier"
                                                    name="supplier"
                                                    menuPosition="fixed"
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
                                                    id='purposeId'
                                                    isSearchable
                                                    placeholder="Purpose"
                                                    name="purpose"
                                                    menuPosition="fixed"
                                                    isClearable
                                                    maxMenuHeight={200}
                                                    menuShouldScrollIntoView
                                                    theme={selectThemeColors}
                                                    options={selectPurpose}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"

                                                    value={filterObj?.purpose}
                                                    onChange={( data, e ) => {
                                                        handleFilterDropdown( data, e );
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1">
                                                <Select
                                                    id='paytermId'
                                                    isSearchable
                                                    placeholder="Pay Term"
                                                    name="payTerm"
                                                    menuPosition="fixed"
                                                    isClearable
                                                    maxMenuHeight={200}
                                                    menuShouldScrollIntoView
                                                    theme={selectThemeColors}
                                                    options={selectPayTerm}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"

                                                    value={filterObj?.payTerm}
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
                                                    value={filterObj?.amount}
                                                    onChange={( e ) => handleFilterBoxOnChange( e )}
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


                                        </Row>
                                        <Row>
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1">
                                                <Select
                                                    id='status'
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
                                progressPending={!isPiDataLoaded}
                                progressComponent={
                                    <CustomPreLoader />
                                }
                                dense
                                subHeader={false}
                                highlightOnHover
                                responsive={true}
                                paginationServer
                                persistTableHead
                                columns={handleGetPiColumns( userPermission, authPermissions )}
                                sortIcon={<ChevronDown />}
                                className="react-custom-dataTable"
                                data={queryData}
                            />
                        </div>
                        <div>
                            {
                                queryData?.length > 0 && <div>
                                    <CustomPagination />
                                </div>
                            }

                        </div>
                    </CardBody>


                </Card>

            </UILoader>

        </div>
    );
};

export default PiList;

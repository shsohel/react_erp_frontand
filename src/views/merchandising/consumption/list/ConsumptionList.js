import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw, Settings, XSquare } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, CustomInput, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from 'reactstrap';
import Card from 'reactstrap/lib/Card';
import CardBody from 'reactstrap/lib/CardBody';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { isPermit, selectThemeColors } from '../../../../utility/Utils';
import { getBuyersStyles, getDropDownBuyers } from '../../buyer/store/actions';
import { getStylePurchaseOrderDropdown } from '../../purchase-order/store/actions';
import { cleanAllConsumptionState, deleteRangeConsumption, getConsumptionByQuery } from '../store/actions';
import ConsumptionExpandRow from './ConsumptionExpandRow';
import { handleConsumptionColumns } from './ConsumptionTableColumn';


const ConsumptionList = () => {
    const dispatch = useDispatch();
    const { replace } = useHistory();
    const defaultFilteredArrayValue = [

        {
            column: "consumptionNumber",
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
            column: "isPackagingConsumption",
            value: ''
        }
    ];
    const defaultFilterValue = {
        buyer: null,
        consumptionNumber: '',
        style: null,
        order: null
    };

    const stateWithBuyer = JSON.parse( localStorage.getItem( 'buyerAndStyle' ) );

    const { isConsumptionDataLoaded, total, queryData } = useSelector( ( { consumptions } ) => consumptions );
    const [isActive, setIsActive] = useState( true );
    const [isPackagingConsumption, setIsPackagingConsumption] = useState( false );

    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'consumptionNumber' );

    const [orderBy, setOrderBy] = useState( 'asc' );

    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );
    const { dropDownBuyers, buyerStylesDropdown, isBuyerDropdownLoaded, isBuyerStylesDropdownLoaded } = useSelector( ( { buyers } ) => buyers );
    const { stylePurchaseOrderDropdown, isStylePurchaseOrderDropdown } = useSelector( ( { purchaseOrders } ) => purchaseOrders );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isActive,
        isSetStyle: stateWithBuyer?.isSetStyle ?? false
    };

    const filteredData = filteredArray.filter( filter => filter.value?.length );


    const getAllConsumptions = () => {

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
        dispatch( getConsumptionByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        getAllConsumptions();
        // dispatch( getDefaultUOMDropdownByUnitId( defaultUnitId ) );
    }, [] );


    const handleSearch = () => {
        const filteredData = filteredArray.filter( filter => filter.value?.length );
        dispatch(
            getConsumptionByQuery( paramsObj, filteredData )
        );
    };
    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        setIsPackagingConsumption( false );
        dispatch( getConsumptionByQuery( paramsObj, [] ) );
        const obj = {
            ...stateWithBuyer,
            buyer: null,
            style: null,
            styleDescription: '',
            styleCategory: '',
            status: ''
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
                status: '',
                styleDescription: '',
                styleCategory: '',
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

            } else if ( name === 'order' && filter.column === 'orderId' ) {
                filter['value'] = data ? data?.value : '';
            }
            return filter;
        } );
        setFilteredArray( updatedData );

        console.log( 'updatedData', JSON.stringify( updatedData, null, 2 ) );
    };

    const handleIsActive = ( checked ) => {
        setIsActive( checked );
        dispatch(
            getConsumptionByQuery( {
                page: 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                isActive: checked,
                isSetStyle: stateWithBuyer?.isSetStyle

            }, filteredData )
        );
    };
    const handleIsPackagingConsumption = ( checked ) => {
        setIsPackagingConsumption( checked );
        const newFilterArray = filteredArray.map( filter => {
            if ( filter.column === "isPackagingConsumption" ) {
                filter['value'] = checked ? checked.toString() : '';
            }
            return filter;
        } );
        setFilteredArray( newFilterArray );

        const filteredData = newFilterArray.filter( filter => filter.value?.length );
        dispatch( getConsumptionByQuery( paramsObj, filteredData ) );
    };

    // ** Function in get data on page change
    const handlePagination = page => {
        dispatch(
            getConsumptionByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                isActive,
                isSetStyle: stateWithBuyer?.isSetStyle ?? false
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
            getConsumptionByQuery( {
                page: pageNumber,
                perPage: value,
                sortedBy,
                orderBy,
                isActive,

                isSetStyle: stateWithBuyer?.isSetStyle ?? false
            }, filteredData )
        );
        setRowsPerPage( value );
    };


    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getConsumptionByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                isActive,
                isSetStyle: stateWithBuyer?.isSetStyle ?? false
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
            getConsumptionByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy,
                orderBy
            } )
        );
    };

    // ** Delete Rang
    const handleDeleteConsumptionRange = () => {
        dispatch( deleteRangeConsumption( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range


    const handleAddNew = () => {
        replace( '/new-consumption' );
        dispatch( cleanAllConsumptionState() );
        //   dispatch( bindConsumptionBasicInfo( consumptionBasicInfoModel ) );
        // dispatch( getSetConsumptionById( null ) );
    };
    const handleAddNewSet = () => {
        replace( '/add-set-consumptions' );
        dispatch( cleanAllConsumptionState() );
    };
    const handleConsumptionPack = () => {
        replace( '/consumption-packaging' );
        dispatch( cleanAllConsumptionState() );
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
            id: 'styles',
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
            id: 'costingList',
            name: 'Costings',
            link: "/costings",
            isActive: false,
            hidden: !isPermit( userPermission?.CostingList, authPermissions )
        },
        {
            id: 'consumptionsList',
            name: 'Consumptions',
            link: "/consumptions",
            isActive: true,
            hidden: false
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
                    moreButton={isPermit( userPermission?.ConsumptionCreate, authPermissions )}
                    title={`Consumptions | ${stateWithBuyer?.style?.label ?? 'None'} `}
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
                        hidden={!isPermit( userPermission?.ConsumptionCreate, authPermissions )}
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
                    <NavItem className="mr-1" >
                        <NavLink
                            hidden
                            tag={Button}
                            size="sm"
                            color="primary"
                            onClick={() => { handleAddNewSet(); }}                    >
                            Add New(Set)
                        </NavLink>
                    </NavItem>
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            hidden={!isPermit( userPermission?.ConsumptionCreate, authPermissions )}
                            size="sm"
                            color="primary"
                            onClick={() => { handleConsumptionPack(); }}
                        >
                            Add New( Pack)
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
                            <div className='consumption-packaging-checkbox'>
                                <CustomInput
                                    id="packagingConsumption"
                                    className="font-weight-bolder"
                                    type="checkbox"
                                    label="Pack Consumptions"
                                    checked={isPackagingConsumption}
                                    onChange={( e ) => { handleIsPackagingConsumption( e.target.checked ); }}
                                />
                            </div>

                            <Button.Ripple
                                onClick={() => getAllConsumptions()}
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
                                        <Col xs={3}>
                                            <Input
                                                placeholder="Consumption Number"
                                                bsSize="sm"
                                                name="consumptionNumber"
                                                value={filterObj.consumptionNumber}
                                                onChange={( e ) => handleFilterBoxOnChange( e )}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Select
                                                id='buyerId'
                                                isSearchable
                                                placeholder="Buyer"
                                                isLoading={!isBuyerDropdownLoaded}
                                                name="buyer"
                                                isClearable
                                                maxMenuHeight={200}
                                                menuShouldScrollIntoView
                                                theme={selectThemeColors}
                                                options={dropDownBuyers}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"
                                                value={stateWithBuyer?.buyer}
                                                onChange={( data, e ) => {
                                                    handleFilterDropdown( data, e );
                                                }}
                                                onFocus={() => { handleBuyerOnFocus(); }}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Select
                                                id='buyerId'
                                                isSearchable
                                                placeholder="Style No"
                                                name="style"
                                                isClearable
                                                isLoading={!isBuyerStylesDropdownLoaded}
                                                maxMenuHeight={200}
                                                menuShouldScrollIntoView
                                                theme={selectThemeColors}
                                                options={buyerStylesDropdown}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"
                                                value={stateWithBuyer?.style}
                                                onChange={( data, e ) => {
                                                    handleFilterDropdown( data, e );
                                                }}
                                                onFocus={() => { handleStyleOnFocus( stateWithBuyer.buyer?.value ); }}
                                            />
                                        </Col>
                                        <Col xs={3}>
                                            <Select
                                                id='orderId'
                                                isSearchable
                                                placeholder="Order No"
                                                isLoading={!isStylePurchaseOrderDropdown}
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
                            onSelectedRowsChange={handleRowSelected}
                            onSort={handleSort}
                            defaultSortField={sortedBy}
                            defaultSortAsc
                            sortServer
                            // contextMessage={}
                            contextActions={<Button.Ripple onClick={() => { handleDeleteConsumptionRange(); }} className='btn-icon ' color='flat-danger'>
                                <XSquare size={24} />
                            </Button.Ripple>}
                            dense
                            noHeader
                            progressPending={!isConsumptionDataLoaded}
                            progressComponent={<CustomPreLoader />}
                            subHeader={false}
                            highlightOnHover
                            persistTableHead
                            selectableRows
                            clearSelectedRows={clearSelectedRow}
                            responsive={true}
                            paginationServer
                            expandableRows={false}
                            expandableRowsComponent={<ConsumptionExpandRow data={data => data} />}
                            expandOnRowClicked
                            columns={handleConsumptionColumns( userPermission, authPermissions )}
                            sortIcon={<ChevronDown />}
                            className="react-custom-dataTable"

                            data={queryData}
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

export default ConsumptionList;

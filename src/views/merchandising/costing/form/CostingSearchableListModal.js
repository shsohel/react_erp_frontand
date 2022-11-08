import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, CardBody, Col, CustomInput, Input, Row, UncontrolledTooltip } from 'reactstrap';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import { CustomInputLabel } from '../../../../utility/custom/CustomInputLabel';
import CustomModal from '../../../../utility/custom/CustomModal';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { costingStatus } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';
import { getBuyersStyles, getDropDownBuyers } from '../../buyer/store/actions';
import { getStylePurchaseOrderDropdown } from '../../purchase-order/store/actions';
import { deleteRangeCosting, getCostingByQuery } from '../store/action';

const CostingSearchableListModal = ( { openModal, setOpenModal, searchFor } ) => {
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
    const dispatch = useDispatch();
    const { push, replace } = useHistory();
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
                isActive: checked,
                isSetStyle: stateWithBuyer?.isSetStyle

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
                orderBy: direction,
                sortedBy: selector,
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

    const handleCostingData = ( costingId ) => {
        if ( searchFor === "costing-details" ) {
            replace( { pathname: `/costings-details`, state: costingId } );

        } else {
            replace( { pathname: `/costings-edit`, state: costingId } );

        }
        setOpenModal( !openModal );
    };


    const handleModelSubmit = () => {
        setOpenModal( !openModal );

    };
    const handleModalToggleClose = () => {
        setOpenModal( !openModal );
    };
    return (
        <CustomModal
            modalTypeClass='vertically-centered-modal'
            className='modal-dialog modal-xl'
            openModal={openModal}
            setOpenModal={setOpenModal}
            handleMainModelSubmit={handleModelSubmit}
            handleMainModalToggleClose={handleModalToggleClose}
            title="Costing List"
        >
            <div>
                <Card>
                    <CardBody>

                        <div>
                            <TableCustomerHeader
                                handlePerPage={handlePerPage}
                                rowsPerPage={rowsPerPage}
                            >

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
                                dense
                                progressPending={!isCostingDataLoaded}
                                progressComponent={<CustomPreLoader />}
                                noHeader
                                highlightOnHover
                                responsive
                                paginationServer
                                persistTableHead
                                sortIcon={<ChevronDown />}
                                onRowDoubleClicked={( row ) => { handleCostingData( row.id ); }}
                                onSort={handleSort}
                                columns={[

                                    {
                                        name: 'SYS ID',
                                        minWidth: '145px',
                                        selector: 'sysId',
                                        sortable: true,
                                        cell: row => row?.sysId
                                    },
                                    {
                                        name: 'Costing No',
                                        minWidth: '145px',
                                        selector: 'costingNumber',
                                        sortable: true,
                                        cell: row => row?.costingNumber
                                    },

                                    {
                                        name: 'Buyer',
                                        minWidth: '120px',
                                        selector: 'buyerName',
                                        sortable: true,
                                        cell: row => row?.buyerName
                                    },
                                    {
                                        name: 'Style',
                                        minWidth: '120px',
                                        selector: 'styles',
                                        sortable: true,
                                        cell: row => row?.styles
                                    },

                                    {
                                        name: 'Qty.',
                                        minWidth: '80px',
                                        selector: 'costingQuantity',
                                        sortable: true,
                                        cell: row => row?.costingQuantity
                                    },
                                    {
                                        name: 'UOM',
                                        minWidth: '80px',
                                        selector: 'costingUom',
                                        sortable: true,
                                        cell: row => row.costingUom
                                    },

                                    {
                                        name: 'Total.',
                                        minWidth: '100px',
                                        selector: 'totalQuotedPrice',
                                        sortable: true,
                                        cell: row => row?.totalQuotedPrice.toFixed( 4 )
                                    },
                                    {
                                        name: 'Currency',
                                        minWidth: '160px',
                                        selector: 'currency',
                                        sortable: true,
                                        cell: row => row?.currency
                                    },

                                    {
                                        name: 'Set Costing ?',
                                        minWidth: '200px',
                                        selector: 'isSetCosting',
                                        sortable: true,
                                        center: true,

                                        cell: row => (
                                            row?.isSetCosting ? ( < CustomInput
                                                type='switch'
                                                label={< CustomInputLabel />}
                                                className='custom-control-success'
                                                id='icon-success'
                                                name='icon-success'
                                                inline defaultChecked
                                                onChange={( e ) => e.preventDefault()}
                                                onClick={( e ) => e.preventDefault()}

                                            /> ) : < CustomInput
                                                type='switch'
                                                label={< CustomInputLabel />}
                                                className='custom-control-success'
                                                id='icon-success'
                                                name='icon-success'
                                                inline
                                                onChange={( e ) => e.preventDefault()}
                                                onClick={( e ) => e.preventDefault()}
                                            />
                                        )
                                    },
                                    {
                                        name: 'Status',
                                        minWidth: '100px',
                                        selector: 'status',
                                        sortable: true,
                                        cell: row => row?.status
                                    }

                                ]}
                                data={queryData}

                            />
                        </div>
                        <div>
                            <CustomPagination />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </CustomModal>
    );
};

export default CostingSearchableListModal;
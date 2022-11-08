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
import { selectThemeColors } from '../../../../utility/Utils';
import { getBuyersStyles, getDropDownBuyers } from '../../buyer/store/actions';
import { getStylePurchaseOrderDropdown } from '../../purchase-order/store/actions';
import ConsumptionExpandRow from '../list/ConsumptionExpandRow';
import { bindConsumptionBasicInfo, deleteRangeConsumption, getConsumptionByQuery } from '../store/actions';


const ConsumptionSearchModal = ( { openModal, setOpenModal, searchFor } ) => {
    const dispatch = useDispatch();
    const { replace, push, location } = useHistory();
    const defaultFilteredArrayValue = [

        {
            column: "consumptionNumber",
            operator: "string",
            value: ''
        },
        {
            column: "buyerId",
            operator: "string",
            value: ''
        },
        {
            column: "styleId",
            value: ''
        },
        {
            column: "orderId",
            value: ''
        }
    ];
    const defaultFilterValue = {
        buyer: null,
        consumptionNumber: '',
        style: null,
        order: null
    };

    // const { state } = useLocation();
    // const state = JSON.parse( localStorage.getItem( 'styleIdsForConsumption' ) );
    const stateWithBuyer = JSON.parse( localStorage.getItem( 'buyerAndStyle' ) );

    const { isConsumptionDataLoaded, total, queryData, consumptionBasicInfo } = useSelector( ( { consumptions } ) => consumptions );
    const [isActive, setIsActive] = useState( true );

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


    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isActive,
        isSetStyle: stateWithBuyer?.isSetStyle
    };

    const filteredData = filteredArray.filter( filter => filter.value?.length );


    const getAllConsumptions = () => {
        const stateArray = [
            {
                column: "buyerId",
                value: stateWithBuyer.buyer?.value
            },
            {
                column: "styleId",
                value: stateWithBuyer.style?.value
            }
        ];
        const newFilterArray = filteredArray.concat( stateArray );
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
    // ** Function in get data on page change
    const handlePagination = page => {
        dispatch(
            getConsumptionByQuery( {
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
            getConsumptionByQuery( {
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
            getConsumptionByQuery( {
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
    const handleModelSubmit = () => {
        setOpenModal( !openModal );
    };
    const handleModalToggleClose = () => {
        setOpenModal( !openModal );
    };

    const handleConsumptionData = ( rowId ) => {


        if ( searchFor === "Consumption Details" ) {
            replace( { pathname: '/consumptions-details', state: rowId } );
        } else {
            const updatedObj = {
                ...consumptionBasicInfo,
                dataAlreadyLoaded: false
            };
            dispatch( bindConsumptionBasicInfo( updatedObj ) );
            replace( { pathname: '/consumptions-edit', state: rowId } );
        }
        handleModalToggleClose();
    };

    return (
        <CustomModal
            modalTypeClass='vertically-centered-modal'
            className='modal-dialog modal-xl'
            openModal={openModal}
            setOpenModal={setOpenModal}
            handleMainModelSubmit={handleModelSubmit}
            handleMainModalToggleClose={handleModalToggleClose}
            title="Consumption List"
        >
            <Card>
                <CardBody>

                    <div >
                        <TableCustomerHeader
                            handlePerPage={handlePerPage}
                            rowsPerPage={rowsPerPage}
                        >
                            <Button.Ripple
                                onClick={() => getAllConsumptions()}
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
                            onSort={handleSort}
                            progressPending={!isConsumptionDataLoaded}
                            progressComponent={<CustomPreLoader />}
                            dense
                            noHeader
                            subHeader={false}
                            highlightOnHover
                            persistTableHead
                            responsive={true}

                            onRowDoubleClicked={( row ) => { handleConsumptionData( row.id ); }}
                            paginationServer
                            expandableRows={false}
                            expandableRowsComponent={<ConsumptionExpandRow data={data => data} />}
                            expandOnRowClicked
                            columns={[
                                {
                                    name: 'SYS ID',
                                    minWidth: '145px',
                                    selector: 'sysId',
                                    sortable: true,
                                    cell: row => row?.sysId
                                },
                                {
                                    name: 'Cons. No',
                                    minWidth: '200px',
                                    selector: 'consumptionNumber',
                                    sortable: true,
                                    cell: row => row?.consumptionNumber
                                },
                                {
                                    name: 'Style No',
                                    minWidth: '130px',
                                    selector: 'styles',
                                    sortable: true,
                                    cell: row => row?.styles
                                },
                                {
                                    name: 'Buyer',
                                    minWidth: '120px',
                                    selector: 'buyerName',
                                    sortable: true,
                                    cell: row => row?.buyerName
                                },
                                {
                                    name: 'Set Consumption ?',
                                    minWidth: '210px',
                                    selector: 'isSetConsumption',
                                    sortable: true,
                                    center: true,

                                    cell: row => (
                                        row?.isSetConsumption ? ( < CustomInput
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
                                }

                            ]}
                            sortIcon={<ChevronDown />}
                            className='react-dataTable'
                            data={queryData}
                        />
                    </div>
                    <div>
                        <CustomPagination />
                    </div>

                </CardBody>
            </Card>

        </CustomModal>
    );
};

export default ConsumptionSearchModal;
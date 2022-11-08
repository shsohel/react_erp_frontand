import { store } from '@store/storeConfig/store';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { isPermit } from '../../../../utility/Utils';
import { clearAllBuyerState, deleteRangeBuyer, getBuyerByQuery, handleOpenBuyerSidebar } from '../store/actions';
import BuyerExpandRow from './BuyerExpandRow';
import { handleGetBuyerColumns } from './BuyerTableColumns';


const BuyerList = () => {
    const defaultFilterValue = {
        name: '',
        email: '',
        phoneNumber: '',
        department: ''
    };

    const defaultFilteredArrayValue = [
        {
            column: "name",
            value: ''
        },
        {
            column: "email",
            value: ''
        },
        {
            column: "phoneNumber",
            value: ''
        },
        {
            column: "department",
            value: ''
        }

    ];
    const dispatch = useDispatch();
    const { replace } = useHistory();
    const {
        isBuyerDataLoaded,
        total,
        openBuyerSidebar,
        queryData
    } = useSelector( ( { buyers } ) => buyers );

    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

    const [searchTerm, setSearchTerm] = useState( '' );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'name' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [currentCountry, setCurrentCountry] = useState( { value: '', label: 'Select Country', number: 0 } );

    const [currentStatus, setCurrentStatus] = useState( { value: '', label: 'Select Status', number: 0 } );
    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );

    // ** Global Function to toggle sidebar for Buyer
    const toggleSidebar = () => store.dispatch( handleOpenBuyerSidebar( !openBuyerSidebar ) );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const getAllBuyers = () => {
        dispatch( getBuyerByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        getAllBuyers();
    }, [] );

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getBuyerByQuery( paramsObj, [] ) );
    };

    const handleSearch = () => {
        dispatch(
            getBuyerByQuery( paramsObj, filteredData )
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
            getBuyerByQuery( {
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
            getBuyerByQuery( {
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
            getBuyerByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction
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
            getBuyerByQuery( {
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
    const handleDeleteBuyerRange = () => {
        dispatch( deleteRangeBuyer( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range

    const handleAddNew = () => {
        replace( '/buyer-add-form' );
        dispatch( clearAllBuyerState() );
    };

    const breadcrumb = [
        {
            id: 'home',
            link: "/",
            name: 'Home',
            isActive: false,
            hidden: false
        },
        {
            id: 'buyerList',
            name: 'Buyer',
            link: "/buyers",
            isActive: true,
            hidden: false
        },
        {
            id: 'agentList',
            name: 'Agent',
            link: "/buyer-agents",
            isActive: false,
            hidden: !isPermit( userPermission?.BuyerAgentList, authPermissions )
        },
        {
            id: 'departmentList',
            name: 'Department',
            link: "/buyer-departments",
            isActive: false,
            hidden: !isPermit( userPermission?.BuyerDepartmentList, authPermissions )
        },
        {
            id: 'devList',
            name: 'Developer',
            link: "/buyer-product-developers",
            isActive: false,
            hidden: !isPermit( userPermission?.ProductDeveloperList, authPermissions )
        }
    ];

    return (
        <div >
            <Card className="mt-3">
                <ActionMenu
                    breadcrumb={breadcrumb}
                    title='Buyers'
                    moreButton={isPermit( userPermission?.BuyerCreate, authPermissions )}
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
                        hidden={!isPermit( userPermission?.BuyerCreate, authPermissions )}
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
                            <Button.Ripple
                                onClick={() => getAllBuyers()}
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

                                <Col xs={2}>
                                    <Input
                                        placeholder="Name"
                                        bsSize="sm"
                                        name="name"
                                        value={filterObj.name}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={2}>
                                    <Input
                                        placeholder="Email"
                                        bsSize="sm"
                                        name="email"
                                        value={filterObj.email}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={2}>
                                    <Input
                                        placeholder="Phone"
                                        bsSize="sm"
                                        name="phoneNumber"
                                        value={filterObj.phoneNumber}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    />
                                </Col>
                                <Col xs={2}>
                                    {/* <Input
                                        placeholder="Departments"
                                        bsSize="sm"
                                        name="department"
                                        value={filterObj.department}
                                        onChange={( e ) => handleFilterBoxOnChange( e )}
                                    /> */}
                                </Col>
                                <Col xs={2}>
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
                            onSort={handleSort}
                            defaultSortAsc
                            defaultSortField='name'
                            sortServer
                            //progressPending={queryData === []}
                            progressPending={!isBuyerDataLoaded}
                            progressComponent={
                                <CustomPreLoader />
                            }
                            // contextMessage={}

                            dense
                            noHeader
                            subHeader={false}
                            highlightOnHover
                            responsive={true}
                            paginationServer
                            expandableRows={false}
                            expandableRowsComponent={<BuyerExpandRow data={data => data} />}
                            expandOnRowClicked
                            persistTableHead
                            columns={handleGetBuyerColumns( userPermission, authPermissions )}
                            sortIcon={<ChevronDown />}
                            className="react-custom-dataTable"
                            data={queryData}
                        />
                    </div>
                    {
                        queryData.length > 0 &&
                        <div>
                            < CustomPagination />
                        </div>
                    }
                </CardBody>
            </Card>
        </div>
    );
};

export default BuyerList;

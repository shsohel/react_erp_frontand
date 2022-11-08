
import { store } from '@store/storeConfig/store';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from "react-redux";
import { Button, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from "reactstrap";
import Card from "reactstrap/lib/Card";
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { isPermit } from '../../../../utility/Utils';
import BuyerAgentAddForm from '../form/BuyerAgentAddForm';
import BuyerAgentEditForm from '../form/BuyerAgentEditForm';
import { clearAllAgentState, deleteRangeBuyerAgent, getBuyerAgentByQuery, handleOpenBuyerAgentSidebar, handleOpenBuyerAgentSidebarForEdit } from '../store/actions';
import BuyerAgentExpandRow from './BuyerAgentExpandRow';
import { handleGetBuyerGetAgentColumns } from './BuyerAgentTableColumn';


const BuyerAgentList = () => {
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
    const {
        isAgentDataLoaded,
        buyerAgents,
        total,
        selectedBuyerAgent,
        openBuyerAgentSidebar,
        openBuyerAgentEditSidebar,
        queryData } = useSelector( ( { buyerAgents } ) => buyerAgents );

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
    const toggleSidebar = () => store.dispatch( handleOpenBuyerAgentSidebar( !openBuyerAgentSidebar ) );
    const toggleSidebarForEdit = () => store.dispatch( handleOpenBuyerAgentSidebarForEdit( !openBuyerAgentEditSidebar ) );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const allAgents = () => {
        dispatch(
            getBuyerAgentByQuery( paramsObj, filteredData )
        );
    };

    useEffect( () => {
        allAgents();
    }, [] );

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getBuyerAgentByQuery( paramsObj, [] ) );
    };

    const handleSearch = () => {
        setCurrentPage( 1 );
        dispatch(
            getBuyerAgentByQuery( { ...paramsObj, page: 1 }, filteredData )
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
            getBuyerAgentByQuery( {
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
            getBuyerAgentByQuery( {
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
            getBuyerAgentByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction
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
            getBuyerAgentByQuery( {
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
        dispatch( deleteRangeBuyerAgent( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range

    const handleAddNew = () => {
        toggleSidebar();
        dispatch( clearAllAgentState() );
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
            id: 'buyerList',
            name: 'Buyer',
            link: "/buyers",
            isActive: false,
            hidden: !isPermit( userPermission?.BuyerList, authPermissions )

        },
        {
            id: 'agentList',
            name: 'Agent',
            link: "/buyer-agents",
            isActive: true,
            hidden: false
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
    return <div>
        <Card className="mt-3">
            <ActionMenu
                breadcrumb={breadcrumb}
                title='Buyer Agents'
                moreButton={isPermit( userPermission?.BuyerAgentCreate, authPermissions )}
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
                    hidden={!isPermit( userPermission?.BuyerAgentCreate, authPermissions )}
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
                            onClick={() => allAgents()}
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
                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-0 mt-sm-0  mt-md-0 mt-lg-0">
                                        <Input
                                            placeholder="Name"
                                            bsSize="sm"
                                            name="name"
                                            value={filterObj.name}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-0 mt-lg-0">
                                        <Input
                                            placeholder="Email"
                                            bsSize="sm"
                                            name="email"
                                            value={filterObj.email}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">

                                        <Input
                                            placeholder="Phone"
                                            bsSize="sm"
                                            name="phoneNumber"
                                            value={filterObj.phoneNumber}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                        <Input
                                            placeholder="Mobile"
                                            bsSize="sm"
                                            name="mobileNumber"
                                            value={filterObj.mobileNumber}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
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
                        defaultSortAsc
                        defaultSortField='name'
                        sortServer
                        progressPending={!isAgentDataLoaded}
                        progressComponent={
                            <CustomPreLoader />
                        }

                        dense
                        highlightOnHover
                        responsive={true}
                        paginationServer
                        expandableRows
                        expandableRowsComponent={<BuyerAgentExpandRow data={data => data} />}
                        expandOnRowClicked
                        persistTableHead
                        columns={handleGetBuyerGetAgentColumns( userPermission, authPermissions )}
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
        {/* Open Sidebar for Edit and Add */}

        {
            openBuyerAgentEditSidebar && < BuyerAgentEditForm open={openBuyerAgentEditSidebar} toggleSidebarForEdit={toggleSidebarForEdit} />
        }
        {
            openBuyerAgentSidebar && <BuyerAgentAddForm open={openBuyerAgentSidebar} toggleSidebar={toggleSidebar} />
        }


    </div>;
};

export default BuyerAgentList;

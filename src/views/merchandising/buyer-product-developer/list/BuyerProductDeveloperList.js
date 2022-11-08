import { store } from '@store/storeConfig/store';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from "reactstrap";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { isPermit } from '../../../../utility/Utils';
import BuyerProductDeveloperAddForm from '../form/BuyerProductDeveloperAddForm';
import BuyerProductDeveloperEditForm from '../form/BuyerProductDeveloperEditForm';
import { bindProductDeveloperBasicInfo, deleteRangeBuyerProductDeveloper, getBuyerProductDeveloperByQuery, handleOpenBuyerProductDeveloperSidebar, handleOpenBuyerProductDeveloperSidebarForEdit } from '../store/actions';
import BuyerProductDeveloperExpandRow from './BuyerProductDeveloperExpandRow';
import { handleGetProductDeveloperColumns } from './BuyerProductDeveloperTableColumns';


const BuyerProductDeveloperList = () => {
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
        productDevelopers,
        total,
        selectedProductDeveloper,
        openProductDeveloperSidebar,
        openProductDeveloperSidebarForEdit,
        queryData,
        isProductDeveloperDataLoaded
    } = useSelector( ( { productDevelopers } ) => productDevelopers );

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
    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );
    // ** Global Function to toggle sidebar for Buyer
    const toggleSidebar = () => store.dispatch( handleOpenBuyerProductDeveloperSidebar( !openProductDeveloperSidebar ) );
    const toggleSidebarForEdit = () => store.dispatch( handleOpenBuyerProductDeveloperSidebarForEdit( !openProductDeveloperSidebarForEdit ) );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );
    const getAllProductDevelopers = () => {
        dispatch(
            getBuyerProductDeveloperByQuery( paramsObj, filteredData )
        );
    };

    useEffect( () => {
        getAllProductDevelopers();
    }, [] );
    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getBuyerProductDeveloperByQuery( paramsObj, [] ) );
    };

    const handleSearch = () => {
        dispatch(
            getBuyerProductDeveloperByQuery( paramsObj, filteredData )
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
            getBuyerProductDeveloperByQuery( {
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
            getBuyerProductDeveloperByQuery( {
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
        setSortedBy( direction );
        setOrderBy( selector );
        dispatch(
            getBuyerProductDeveloperByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: direction,
                orderBy: selector
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
            getBuyerProductDeveloperByQuery( {
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
    const handleDeleteBuyerProductDeveloperRange = () => {
        dispatch( deleteRangeBuyerProductDeveloper( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range
    const handleAddNew = () => {
        toggleSidebar();
        dispatch( bindProductDeveloperBasicInfo( null ) );
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
            hidden: !isPermit( userPermission?.BuyerList, authPermissions )
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
            isActive: true,
            hidden: false
        }
    ];
    return (
        <div>
            <Card className="mt-3">
                <ActionMenu
                    breadcrumb={breadcrumb}
                    title='Product Developers'
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
                    <div >
                        <TableCustomerHeader
                            handlePerPage={handlePerPage}
                            rowsPerPage={rowsPerPage}
                            searchTerm={searchTerm}
                        >
                            <Button.Ripple
                                onClick={() => getAllProductDevelopers()}
                                className='btn-icon'
                                size="sm"
                                color='flat-primary'
                                id='freshBtnId'
                            >
                                <RefreshCw size={18} />
                            </Button.Ripple>
                            <Button.Ripple

                                onClick={() => console.log( 'E' )}
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
                            progressPending={!isProductDeveloperDataLoaded}
                            progressComponent={
                                <CustomPreLoader />
                            }
                            // contextMessage={}

                            dense
                            subHeader={false}
                            highlightOnHover
                            responsive={true}
                            paginationServer
                            expandableRows
                            expandableRowsComponent={<BuyerProductDeveloperExpandRow data={data => data} />}
                            expandOnRowClicked
                            persistTableHead
                            columns={handleGetProductDeveloperColumns( userPermission, authPermissions )}
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
                openProductDeveloperSidebarForEdit && < BuyerProductDeveloperEditForm open={openProductDeveloperSidebarForEdit} toggleSidebarForEdit={toggleSidebarForEdit} />
            }
            {
                openProductDeveloperSidebar && <BuyerProductDeveloperAddForm open={openProductDeveloperSidebar} toggleSidebar={toggleSidebar} />
            }

        </div>
    );
};

export default BuyerProductDeveloperList;

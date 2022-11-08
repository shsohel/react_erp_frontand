import { store } from '@store/storeConfig/store';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { userStatus } from '../../../../utility/enums';
import { isPermit, selectThemeColors } from '../../../../utility/Utils';
import UserAddForm from '../form/UserAddForm';
import UserEditForm from '../form/UserEditForm';
import { bindUserBasicInfo, getUsersByQuery, openUserAddFormSidebar, openUserEditFormSidebar } from '../store/actions';
import { handleGetUserColumns } from './UserTableColumns';

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import Select from 'react-select';


const UserList = () => {
    const defaultFilterValue = {
        name: '',
        userName: '',
        email: '',
        contactNumber: '',
        status: ''
    };
    const defaultFilteredArrayValue = [
        {
            column: "userName",
            value: ''
        },
        {
            column: "name",
            value: ''
        },
        {
            column: "email",
            value: ''
        },
        {
            column: "status",
            value: ''
        },
        {
            column: "contactNumber",
            value: ''
        }

    ];
    const dispatch = useDispatch();
    const {
        isUserDataLoaded,
        isUserDataProgress,
        total,
        queryData,
        userAddFormSidebarOpen,
        userEditFormSidebarOpen

    } = useSelector( ( { users } ) => users );
    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'name' );
    const [orderBy, setOrderBy] = useState( 'asc' );

    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );
    const [isActive, setIsActive] = useState( true );

    const toggleSidebar = () => store.dispatch( openUserAddFormSidebar( !userAddFormSidebarOpen ) );
    const toggleSidebarForEdit = () => store.dispatch( openUserEditFormSidebar( !userEditFormSidebarOpen ) );
    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isActive: true
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const getAllUsers = () => {
        dispatch( getUsersByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        getAllUsers();
    }, [] );

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getUsersByQuery( paramsObj, [] ) );
    };

    const handleSearch = () => {
        dispatch(
            getUsersByQuery( paramsObj, filteredData )
        );
    };


    const handleIsActive = ( checked ) => {
        setIsActive( checked );
        dispatch(
            getUsersByQuery( {
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
        setFilterObj( {
            ...filterObj,
            [name]: data
        } );


        const updatedData = filteredArray.map( filter => {
            if ( name === 'status' && filter.column === 'status' ) {
                filter['value'] = data ? data?.value : '';
            }
            return filter;
        } );
        setFilteredArray( updatedData );

    };


    // ** Function in get data on page change
    const handlePagination = page => {
        dispatch(
            getUsersByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                isActive,
                orderBy
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };

    // ** Function in get data on rows per page
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        dispatch(
            getUsersByQuery( {
                page: currentPage,
                perPage: value,
                sortedBy,
                isActive,
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
            getUsersByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                isActive,

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
            getUsersByQuery( {
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
    const handleDeleteRoleRange = () => {
        //  dispatch( deleteRangeBuyer( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range

    const handleAddNew = () => {
        dispatch( openUserAddFormSidebar( !userAddFormSidebarOpen ) );
        dispatch( bindUserBasicInfo() );
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
            id: 'roleList',
            name: 'Role',
            link: "/roles",
            isActive: false,
            hidden: !isPermit( userPermission?.RoleList, authPermissions )
        },
        {
            id: 'userList',
            name: 'User',
            link: "/users",
            isActive: true,
            hidden: false
        }
    ];


    return (
        <div >
            <UILoader blocking={isUserDataProgress} loader={<ComponentSpinner />} >

                <Card className="mt-3">
                    <ActionMenu
                        breadcrumb={breadcrumb}
                        title='User'
                        moreButton={isPermit( userPermission?.UserCreate, authPermissions )}
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
                        <NavItem className="mr-1"
                            hidden={!isPermit( userPermission?.UserCreate, authPermissions )}
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
                                    onClick={() => getAllUsers()}
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
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-0 mt-sm-0  mt-md-0 mt-lg-0">
                                                <Input
                                                    placeholder="User Name"
                                                    bsSize="sm"
                                                    name="userName"
                                                    value={filterObj.userName}
                                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                                />
                                            </Col>
                                            {/* <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-0 mt-lg-0">
                                            <Input
                                                placeholder="Name"
                                                bsSize="sm"
                                                name="name"
                                                value={filterObj.name}
                                                onChange={( e ) => handleFilterBoxOnChange( e )}
                                            />
                                        </Col> */}
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                                <Input
                                                    placeholder="Email"
                                                    bsSize="sm"
                                                    name="email"
                                                    value={filterObj.email}
                                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={2} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                                <Input
                                                    placeholder="Contact Number"
                                                    bsSize="sm"
                                                    name="contactNumber"
                                                    value={filterObj.contactNumber}
                                                    onChange={( e ) => handleFilterBoxOnChange( e )}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                                <Select
                                                    id='statusId'
                                                    isSearchable
                                                    placeholder="Status"
                                                    name="status"
                                                    isClearable
                                                    maxMenuHeight={200}
                                                    menuShouldScrollIntoView
                                                    theme={selectThemeColors}
                                                    options={userStatus}
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
                                defaultSortAsc
                                defaultSortField='name'
                                sortServer
                                //progressPending={queryData === []}
                                progressPending={!isUserDataLoaded}
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

                                expandOnRowClicked
                                persistTableHead
                                columns={handleGetUserColumns( userPermission, authPermissions )}
                                sortIcon={<ChevronDown />}
                                className="react-custom-dataTable"
                                data={queryData}
                            //  data={data}

                            />
                        </div>
                        {
                            queryData.length > 0 &&
                            <div>
                                < CustomPagination />
                            </div>
                        }
                        {
                            userAddFormSidebarOpen && <UserAddForm
                                open={userAddFormSidebarOpen}
                                toggleSidebar={toggleSidebar}
                            />
                        }
                        {
                            userEditFormSidebarOpen && <UserEditForm
                                open={userEditFormSidebarOpen}
                                toggleSidebar={toggleSidebarForEdit}
                            />
                        }


                    </CardBody>
                </Card>
            </UILoader>
        </div>
    );
};

export default UserList;

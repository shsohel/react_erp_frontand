import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
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
import { isPermit } from '../../../../utility/Utils';
import RoleAddForm from '../form/RoleAddForm';
import RoleEditForm from '../form/RoleEditForm';
import RolePermission from '../form/RolePermission';
import { bindRoleBasicInfo, getRolesByQuery, openRoleAddFormSidebar, openRoleEditFormSidebar } from '../store/actions';
import { handleGetRoleColumns } from './RoleTableColumns';


const data = [
    {
        id: 1,
        name: 'Buyer',
        description: 'Here is Buyer Role'
    },
    {
        id: 2,
        name: 'Merchandiser',
        description: 'Here is Merchandiser Role'
    }
];


const RoleList = () => {
    const defaultFilterValue = {
        name: ''
    };

    const defaultFilteredArrayValue = [
        {
            column: "name",
            value: ''
        }

    ];
    const dispatch = useDispatch();
    const {
        isRoleDataLoaded,
        isRoleDataProgress,
        total,
        queryData,
        roleAddFormSidebarOpen,
        roleEditFormSidebarOpen,
        rolePermissionModalOpen
    } = useSelector( ( { roles } ) => roles );

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

    const toggleSidebar = () => store.dispatch( openRoleAddFormSidebar( !roleAddFormSidebarOpen ) );
    const toggleSidebarForEdit = () => store.dispatch( openRoleEditFormSidebar( !roleEditFormSidebarOpen ) );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const getAllRoles = () => {
        dispatch( getRolesByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        getAllRoles();
    }, [] );

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getRolesByQuery( paramsObj, [] ) );
    };

    const handleSearch = () => {
        dispatch(
            getRolesByQuery( paramsObj, filteredData )
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
            getRolesByQuery( {
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
            getRolesByQuery( {
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
            getRolesByQuery( {
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
            getRolesByQuery( {
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
        dispatch( openRoleAddFormSidebar( !roleAddFormSidebarOpen ) );
        dispatch( bindRoleBasicInfo() );

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
            isActive: true,
            hidden: false
        },
        {
            id: 'userList',
            name: 'User',
            link: "/users",
            isActive: false,
            hidden: !isPermit( userPermission?.UserList, authPermissions )
        }
    ];

    return (
        <div >
            <UILoader blocking={isRoleDataProgress} loader={<ComponentSpinner />} >

                <Card className="mt-3">
                    <ActionMenu
                        breadcrumb={breadcrumb}
                        title='Roles'
                        moreButton={isPermit( userPermission?.RoleCreate, authPermissions )}
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
                            hidden={!isPermit( userPermission?.RoleCreate, authPermissions )}
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
                                <Button.Ripple
                                    onClick={() => getAllRoles()}
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


                            {/*  Filter  Section */}

                            <AdvancedSearchBox isOpen={isFilterBoxOpen}>
                                <Row>
                                    <Col>
                                        <Row>
                                            <Col xs={2}>
                                                <Input
                                                    placeholder="Role Name"
                                                    bsSize="sm"
                                                    name="name"
                                                    value={filterObj.name}
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

                            {/* For Loading to get Any Single Data */}

                            {/* <HorizontalLoader hidden={!isRoleDataProgress} /> */}

                            <DataTable
                                onSort={handleSort}
                                defaultSortAsc
                                defaultSortField='name'
                                sortServer
                                //progressPending={queryData === []}
                                progressPending={!isRoleDataLoaded}
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
                                columns={handleGetRoleColumns( userPermission, authPermissions )}
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
                            roleAddFormSidebarOpen && <RoleAddForm
                                open={roleAddFormSidebarOpen}
                                toggleSidebar={toggleSidebar}
                            />
                        }
                        {
                            roleEditFormSidebarOpen && <RoleEditForm
                                open={roleEditFormSidebarOpen}
                                toggleSidebar={toggleSidebarForEdit}
                            />
                        }
                        {
                            rolePermissionModalOpen && <RolePermission
                                openModal={rolePermissionModalOpen}
                            // toggleSidebar={toggleSidebarForEdit}
                            />
                        }
                    </CardBody>
                </Card>
            </UILoader>
        </div>
    );
};

export default RoleList;

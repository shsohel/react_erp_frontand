import { store } from '@store/storeConfig/store';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, RefreshCw, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from "react-redux";
import { Button, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from "reactstrap";
import Card from 'reactstrap/lib/Card';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import AssignItemSegmentForm from '../form/AssignItemSegmentForm';
import AssignItemSegmentValueForm from '../form/AssignItemSegmentValueForm';
import AssignItemSubCategories from '../form/AssignItemSubCategories';
import ItemGroupAddForm from '../form/ItemGroupAddForm';
import ItemGroupEditForm from '../form/ItemGroupEditForm';
import { deleteRangeItemGroup, getDropDownCategoryGroups, getItemGroupByQuery, handleOpenAssignItemSegmentModal, handleOpenAssignItemSegmentValueModal, handleOpenAssignSubCategoryModal, handleOpenItemGroupSidebar, handleOpenItemGroupSidebarForEdit } from '../store/actions';
import ItemGroupExpandRow from './ItemGroupExpandRow';


import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import CustomPreLoader from '@custom/CustomPreLoader';
import Select from 'react-select';
import { isPermit, selectThemeColors } from '../../../../utility/Utils';
import { handleGetItemGroupColumns } from './ItemGroupTableColumn';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    },
    {
        id: 'itemGroup',
        name: 'Item Group',
        link: "/inventory-item-group",
        isActive: true,
        hidden: false
    }
];


const ItemGroupList = () => {

    const dispatch = useDispatch();
    const defaultFilterValue = {
        name: '',
        groupName: '',
        subGroupName: '',
        categoryGroup: null,
        categorySubGroup: null
    };

    const defaultFilteredArrayValue = [
        {
            column: "name",
            value: ''
        },
        {
            column: "category",
            value: ''
        },
        {
            column: "subCategory",
            value: ''
        }

    ];

    const {
        isItemGroupDataLoaded,
        isItemGroupOnProgress,
        itemSubGroups,
        itemSegments,
        itemSegmentValues,
        itemSegmentsDropdown,
        total,
        selectedItemGroup,
        openAssignSubCategoryModal,
        openAssignItemSegmentModal,
        openAssignItemSegmentValueModal,
        openItemGroupSidebar,
        queryData,
        itemGroupId,
        openItemGroupSidebarForEdit
    } = useSelector( ( { itemGroups } ) => itemGroups );
    // console.log( queryData );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [isActive, setIsActive] = useState( true );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const { dropDownCategoryGroups, isDropDownCategoryGroupsLoaded } = useSelector( ( { itemGroups } ) => itemGroups );

    // ** Item Group States
    const [searchTerm, setSearchTerm] = useState( '' );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'name' );

    const [orderBy, setOrderBy] = useState( 'asc' );
    const [currentStatus, setCurrentStatus] = useState( { value: '', label: 'Select Status', number: 0 } );
    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );


    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    // ** Global Function to toggle sidebar for Item Group
    const toggleSidebar = () => store.dispatch( handleOpenItemGroupSidebar( !openItemGroupSidebar ) );
    const toggleSidebarForEdit = () => store.dispatch( handleOpenItemGroupSidebarForEdit( !openItemGroupSidebarForEdit ) );
    const toggleAssignSubCategoryModalOpen = () => store.dispatch( handleOpenAssignSubCategoryModal( !openAssignSubCategoryModal ) );
    const toggleAssignItemSegmentModalOpen = () => store.dispatch( handleOpenAssignItemSegmentModal( !openAssignItemSegmentModal ) );
    const toggleAssignItemSegmentValueModalOpen = () => store.dispatch( handleOpenAssignItemSegmentValueModal( !openAssignItemSegmentValueModal ) );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isActive
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );


    const getAllItemGroups = () => {
        dispatch( getItemGroupByQuery( paramsObj, filteredData ) );
    };


    useEffect( () => {
        getAllItemGroups();
    }, [] );


    const handleItemGroupOnFocus = () => {
        if ( !dropDownCategoryGroups.length ) {
            dispatch( getDropDownCategoryGroups() );
        }
    };

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getItemGroupByQuery( paramsObj, [] ) );
    };
    const handleFilterDropdown = ( data, e ) => {
        const { name } = e;

        setFilterObj( {
            ...filterObj,
            [name]: data,
            ['categorySubGroup']: name === 'categoryGroup' ? null : data
        } );
        const updatedData = filteredArray.map( filter => {
            if ( name === 'categoryGroup' && filter.column === 'category' ) {
                filter['value'] = data ? data?.label : '';
            } else if ( name === 'categorySubGroup' && filter.column === 'subCategory' ) {
                filter['value'] = data ? data?.label : '';
            }
            return filter;
        } );
        console.log( updatedData );
        setFilteredArray( updatedData );
    };
    const handleIsActive = ( checked ) => {
        setIsActive( checked );
        dispatch(
            getItemGroupByQuery( {
                page: 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                isActive: checked
            }, filteredData )
        );
    };

    const handleSearch = () => {
        setCurrentPage( 1 );

        dispatch(
            getItemGroupByQuery( { ...paramsObj, page: 1 }, filteredData )
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
            getItemGroupByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                sortedBy,
                orderBy,
                isActive
            }, filteredData )
        );
        setCurrentPage( page.selected + 1 );
    };


    // ** Function in get data on rows per page
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        dispatch(
            getItemGroupByQuery( {
                page: currentPage,
                perPage: value,
                sortedBy,
                orderBy,
                isActive
            }, filteredData )
        );
        setRowsPerPage( value );
    };


    // ** Function in get data on search query change
    const handleFilter = val => {
        setSearchTerm( val );
        dispatch(
            getItemGroupByQuery( {
                page: currentPage,
                perPage: rowsPerPage
                // status: currentStatus.value,
                // q: val,
                // sortedBy,
                // sortedColumn
            } )
        );
    };


    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( selector );
        setOrderBy( direction );
        dispatch(
            getItemGroupByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                sortedBy: selector,
                orderBy: direction,
                isActive
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
            getItemGroupByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                status: currentStatus.value,
                q: searchTerm,
                sortedBy,
                setOrderBy
            } )
        );
    };


    // ** Delete Rang
    const handleDeleteItemGroupRange = () => {
        dispatch( deleteRangeItemGroup( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range
    const handleAddNew = () => {
        toggleSidebar();
    };

    return (
        <div>
            <UILoader blocking={isItemGroupOnProgress} loader={<ComponentSpinner />} >
                <Card className='mt-3'>
                    <ActionMenu
                        breadcrumb={breadcrumb}
                        title='Item Groups'
                        moreButton={isPermit( userPermission?.ItemGroupCreate, authPermissions )}

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
                            hidden={!isPermit( userPermission?.ItemGroupCreate, authPermissions )}
                        >
                            <NavLink
                                tag={Button}
                                size="sm"
                                color="success"
                                onClick={() => { handleAddNew(); }}
                                disabled={isItemGroupOnProgress}
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
                                    onClick={() => getAllItemGroups()}
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
                                                <Select
                                                    id='categoryGroup'
                                                    isSearchable
                                                    isClearable
                                                    isLoading={!isDropDownCategoryGroupsLoaded}
                                                    name="categoryGroup"
                                                    theme={selectThemeColors}
                                                    options={dropDownCategoryGroups.filter( group => group.parentName === null )}
                                                    classNamePrefix='dropdown'

                                                    value={filterObj.categoryGroup}
                                                    onChange={( data, e ) => {
                                                        handleFilterDropdown( data, e );
                                                    }}
                                                    onFocus={() => { handleItemGroupOnFocus(); }}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                                <Select
                                                    id='orderUom'
                                                    isSearchable
                                                    isClearable
                                                    name="categorySubGroup"
                                                    theme={selectThemeColors}
                                                    options={dropDownCategoryGroups.filter( group => group.parentName === filterObj.categoryGroup?.label )}
                                                    classNamePrefix='dropdown'

                                                    value={filterObj?.categorySubGroup}
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
                                //   onSelectedRowsChange={handleRowSelected}
                                noHeader
                                persistTableHead
                                onSort={handleSort}
                                defaultSortField={sortedBy}
                                defaultSortAsc
                                sortServer
                                progressPending={!isItemGroupDataLoaded}
                                progressComponent={
                                    <CustomPreLoader />
                                }

                                // contextMessage={}
                                // contextActions={<Button.Ripple onClick={() => { handleDeleteItemGroupRange(); }} className='btn-icon ' color='flat-danger'>
                                //     <XSquare size={24} />
                                // </Button.Ripple>}
                                dense
                                subHeader={false}
                                highlightOnHover
                                //   selectableRows
                                clearSelectedRows={clearSelectedRow}
                                responsive={true}
                                paginationServer
                                expandableRows={false}
                                expandableRowsComponent={<ItemGroupExpandRow data={data => data} />}
                                expandOnRowClicked
                                columns={handleGetItemGroupColumns( userPermission, authPermissions )}
                                sortIcon={<ChevronDown />}
                                className="react-custom-dataTable"

                                data={queryData}
                            />
                        </div>
                    </CardBody>

                    <div>
                        <CustomPagination />
                    </div>
                </Card>
            </UILoader>

            {/* Open Sidebar for Edit and Add */}


            {
                openItemGroupSidebar && <ItemGroupAddForm open={openItemGroupSidebar} toggleSidebar={toggleSidebar} />
            }
            {
                ( selectedItemGroup !== null && openItemGroupSidebarForEdit ) && < ItemGroupEditForm data={selectedItemGroup} open={openItemGroupSidebarForEdit} toggleSidebar={toggleSidebarForEdit} />
            }
            {
                itemSubGroups !== null && openAssignSubCategoryModal ? <AssignItemSubCategories data={itemSubGroups} openAssignSubCategoryModal={openAssignSubCategoryModal} toggleAssignSubCategoryModalOpen={toggleAssignSubCategoryModalOpen} itemSubGroups={itemSubGroups} itemGroupId={itemGroupId} /> : null
            }
            {
                itemSegments !== null && openAssignItemSegmentModal ? <AssignItemSegmentForm data={itemSegments} openAssignItemSegmentModal={openAssignItemSegmentModal} toggleAssignItemSegmentModalOpen={toggleAssignItemSegmentModalOpen} itemSegments={itemSegments} itemGroupId={itemGroupId} /> : null
            }
            {
                itemSegmentValues !== null && openAssignItemSegmentValueModal ? <AssignItemSegmentValueForm itemSegmentsDropdown={itemSegmentsDropdown} openAssignItemSegmentValueModal={openAssignItemSegmentValueModal} toggleAssignItemSegmentValueModalOpen={toggleAssignItemSegmentValueModalOpen} itemSegmentValues={itemSegmentValues} itemGroupId={itemGroupId} /> : null
            }

        </div >
    );
};

export default ItemGroupList;

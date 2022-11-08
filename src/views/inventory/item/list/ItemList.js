import CustomPreLoader from '@custom/CustomPreLoader';
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
import ItemAddForm from '../form/ItemAddForm';
import ItemEditForm from '../form/ItemEditForm';
import { deleteRangeItem, getItemsByQuery, handleOpenItemEditSidebar, handleOpenItemSidebar } from '../store/actions';
import { handleGetItemColumns } from './ItemTableColumn';

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import Select from 'react-select';
import { isPermit, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownItemGroups, getSubGroupDropdownByItemId } from '../../item-group/store/actions';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    },
    {
        id: 'itemsId',
        name: 'Item',
        link: "/inventory-item",
        isActive: true,
        hidden: false
    }
];


const ItemList = () => {
    const defaultFilterValue = {
        name: '',
        itemGroup: '',
        itemSubGroup: '',
        itemNumber: ''
    };

    const defaultFilteredArrayValue = [
        {
            column: "name",
            value: ''
        },
        {
            column: "categoryId",
            value: ''
        },
        {
            column: "subCategoryId",
            value: ''
        },
        {
            column: "itemNumber",
            value: ''
        }

    ];

    const dispatch = useDispatch();
    const {
        items,
        total,
        openItemSidebar,
        openItemEditSidebar,
        queryData,
        isItemDataLoaded,
        isItemDataOnProgress
    } = useSelector( ( { items } ) => items );
    const { dropDownItemGroups,
        dropDownItemSubGroups,
        isDropDownItemGroupsDataLoaded,
        isDropDownItemSubGroupsDataLoaded
    } = useSelector( ( { itemGroups } ) => itemGroups );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );
    const [isActive, setIsActive] = useState( true );
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
    const toggleSidebar = () => store.dispatch( handleOpenItemSidebar( !openItemSidebar ) );
    const toggleEditSidebar = () => store.dispatch( handleOpenItemEditSidebar( !openItemEditSidebar ) );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy,
        isActive
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const getAllItems = () => {
        dispatch(
            getItemsByQuery( paramsObj, filteredData )
        );
    };

    useEffect( () => {
        getAllItems();
    }, [] );


    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getItemsByQuery( paramsObj, [] ) );
    };

    const handleSearch = () => {
        setCurrentPage( 1 );
        dispatch(
            getItemsByQuery( { ...paramsObj, page: 1 }, filteredData )
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
        if ( name === 'itemGroup' ) {
            dispatch( getSubGroupDropdownByItemId( data?.value ) );
        }
        setFilterObj( {
            ...filterObj,
            [name]: data,
            ['itemSubGroup']: name === 'itemGroup' ? null : data
        } );
        const updatedData = filteredArray.map( filter => {
            if ( name === 'itemGroup' && filter.column === 'categoryId' ) {
                filter['value'] = data ? data?.value.toString() : '';
            } else if ( name === 'itemSubGroup' && filter.column === 'subCategoryId' ) {
                filter['value'] = data ? data?.value.toString() : '';
            }
            return filter;
        } );
        console.log( updatedData );
        setFilteredArray( updatedData );

    };

    const handleItemGroupOnFocus = () => {
        if ( !dropDownItemGroups.length ) {
            dispatch( getDropDownItemGroups() );
        }
    };
    const handleItemSubGroupOnFocus = ( itemGroupId ) => {
        if ( !dropDownItemSubGroups.length ) {
            dispatch( getSubGroupDropdownByItemId( itemGroupId ) );
        }

    };

    const handleIsActive = ( checked ) => {
        setIsActive( checked );
        dispatch(
            getItemsByQuery( {
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
            getItemsByQuery( {
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
            getItemsByQuery( {
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
            getItemsByQuery( {
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
            getItemsByQuery( {
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


    // ** Table data to render
    const dataToRender = () => {
        const filters = {
            status: currentStatus.value,
            q: searchTerm
        };

        const isFiltered = Object.keys( filters ).some( function ( k ) {
            return filters[k].length > 0;
        } );


        if ( queryData?.length > 0 ) {
            return queryData;
        } else if ( queryData?.length === 0 && isFiltered ) {
            return [];
        } else {
            return items.slice( 0, rowsPerPage );
        }
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
            getItemsByQuery( {
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
        dispatch( deleteRangeItem( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range
    const handleAddNew = () => {
        toggleSidebar();
    };

    return (
        <div>
            <UILoader blocking={isItemDataOnProgress} loader={<ComponentSpinner />} >

                <Card className="mt-3">
                    <ActionMenu
                        breadcrumb={breadcrumb}
                        title='Items'
                        moreButton={isPermit( userPermission?.ItemCreate, authPermissions )}
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
                            hidden={!isPermit( userPermission?.ItemCreate, authPermissions )}
                        >
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
                                    onClick={() => getAllItems()}
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
                                                    id='itemGroupId'
                                                    isSearchable
                                                    placeholder="Item Group"
                                                    name="itemGroup"
                                                    isLoading={!isDropDownItemGroupsDataLoaded}
                                                    isClearable
                                                    maxMenuHeight={200}
                                                    menuShouldScrollIntoView
                                                    theme={selectThemeColors}
                                                    options={dropDownItemGroups}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    value={filterObj?.itemGroup}
                                                    onChange={( data, e ) => {
                                                        handleFilterDropdown( data, e );
                                                    }}
                                                    onFocus={() => { handleItemGroupOnFocus(); }}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">

                                                <Select
                                                    id='itemGroupId'
                                                    isSearchable
                                                    placeholder="Item Sub-Group"
                                                    name="itemSubGroup"
                                                    isLoading={!isDropDownItemSubGroupsDataLoaded}
                                                    isClearable
                                                    maxMenuHeight={200}
                                                    menuShouldScrollIntoView
                                                    theme={selectThemeColors}
                                                    options={dropDownItemSubGroups}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    value={filterObj?.itemSubGroup}
                                                    onChange={( data, e ) => {
                                                        handleFilterDropdown( data, e );
                                                    }}
                                                    onFocus={() => { handleItemSubGroupOnFocus( filterObj?.itemGroup?.value ?? null ); }}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={3} className="mt-1 mt-sm-1  mt-md-1 mt-lg-0">
                                                <Input
                                                    placeholder="Item Number"
                                                    bsSize="sm"
                                                    name="itemNumber"
                                                    value={filterObj.itemNumber}
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
                                progressPending={!isItemDataLoaded}
                                progressComponent={
                                    <CustomPreLoader />
                                }
                                onSort={handleSort}
                                defaultSortField={sortedBy}
                                defaultSortAsc
                                sortServer
                                persistTableHead
                                dense
                                subHeader={false}
                                highlightOnHover
                                responsive={true}
                                paginationServer
                                expandableRows={false}
                                // expandableRowsComponent={<ItemGroupExpandRow data={data => data} />}
                                expandOnRowClicked
                                columns={handleGetItemColumns( userPermission, authPermissions )}
                                sortIcon={<ChevronDown />}
                                className="react-custom-dataTable"
                                data={dataToRender()}
                            />
                        </div>
                    </CardBody>

                    <div>
                        <CustomPagination />
                    </div>
                </Card>
                {/* Open Sidebar for Edit and Add */}
                {
                    openItemSidebar ? <ItemAddForm open={openItemSidebar} toggleSidebar={toggleSidebar} /> : null
                }
                {
                    openItemEditSidebar ? < ItemEditForm open={openItemEditSidebar} toggleSidebar={toggleEditSidebar} /> : null
                }

            </UILoader>
        </div >
    );
};

export default ItemList;

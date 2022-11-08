import { store } from '@store/storeConfig/store';

import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, Settings, XSquare } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from 'reactstrap';
import Card from 'reactstrap/lib/Card';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { isPermit } from '../../../../utility/Utils';
import ColorAddForm from '../form/ColorAddForm';
import ColorEditForm from '../form/ColorEditForm';
import { bindColorData, deleteRangeColor, getColorByQuery, handleOpenColorSidebar, handleOpenColorSidebarForEdit } from '../store/actions';
import { handleGetColorColumns } from './ColorTableColumn';

import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
const ColorList = () => {
    const dispatch = useDispatch();
    const defaultFilterValue = {
        name: ''
    };

    const defaultFilteredArrayValue = [
        {
            column: "name",
            value: ''
        }

    ];
    const {
        total,
        selectedColor,
        openColorSidebar,
        openColorSidebarForEdit,
        isColorDataLoaded,
        isColorDataOnProgress,
        queryData } = useSelector( ( { colors } ) => colors );

    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );

    const [searchTerm, setSearchTerm] = useState( '' );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'name' );

    const [spinner, setSpinner] = useState( !queryData.length );


    const [orderBy, setOrderBy] = useState( 'asc' );


    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );


    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    // ** Global Function to toggle sidebar for Color
    const toggleSidebar = () => store.dispatch( handleOpenColorSidebar( !openColorSidebar ) );
    const toggleSidebarForEdit = () => store.dispatch( handleOpenColorSidebarForEdit( !openColorSidebarForEdit ) );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };

    useEffect( () => {
        const timeout = setTimeout( () => {
            setSpinner( false );
        }, 2000 );
        return () => clearTimeout( timeout );
    }, [spinner] );

    const filteredData = filteredArray.filter( filter => filter.value.length );

    const getAllColors = () => {
        dispatch( getColorByQuery( paramsObj, filteredData ) );
    };

    useEffect( () => {
        getAllColors();
    }, [] );

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getColorByQuery( paramsObj, [] ) );
    };

    const handleSearch = () => {
        dispatch(
            getColorByQuery( paramsObj, filteredData )
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
            getColorByQuery( {
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
            getColorByQuery( {
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
            getColorByQuery( {
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
            getColorByQuery( {
                page: currentPage,
                perPage: rowsPerPage
                // status: currentStatus.value,
                // q: searchTerm,
                // sortedBy,
                // orderBy
            } )
        );
    };

    // ** Delete Rang
    const handleDeleteColorRange = () => {
        dispatch( deleteRangeColor( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range
    const handleAddNew = () => {
        toggleSidebar();
        dispatch( bindColorData( null ) );

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
            id: 'colorsList',
            name: 'Colors',
            link: "/colors",
            isActive: true,
            hidden: false
        },
        {
            id: 'sizesList',
            name: 'Sizes',
            link: "/sizes",
            isActive: false,
            hidden: !isPermit( userPermission?.GarmentSizeList, authPermissions )
        },
        {
            id: 'sizeGroupsList',
            name: 'Size Groups',
            link: "/size-groups",
            isActive: false,
            hidden: !isPermit( userPermission?.GarmentSizeGroupList, authPermissions )
        }
    ];
    return (
        <div>
            <UILoader blocking={isColorDataOnProgress} loader={<ComponentSpinner />} >

                <Card className="mt-3">
                    <ActionMenu
                        breadcrumb={breadcrumb}
                        title='Colors'
                        moreButton={isPermit( userPermission?.GarmentColorCreate, authPermissions )}
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
                            hidden={!isPermit( userPermission?.GarmentColorCreate, authPermissions )}
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
                                            <Col xs={2}>
                                                <Input
                                                    placeholder="Color Name"
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
                            <DataTable
                                onSelectedRowsChange={handleRowSelected}
                                onSort={handleSort}
                                progressPending={!isColorDataLoaded}
                                defaultSortAsc
                                defaultSortField='name'
                                sortServer
                                progressComponent={
                                    <CustomPreLoader />
                                }
                                // contextMessage={}
                                contextActions={<Button.Ripple onClick={() => { handleDeleteColorRange(); }} className='btn-icon ' color='flat-danger'>
                                    <XSquare size={24} />
                                </Button.Ripple>}
                                noHeader
                                dense
                                subHeader={false}
                                highlightOnHover

                                responsive={true}
                                paginationServer

                                persistTableHead
                                columns={handleGetColorColumns( userPermission, authPermissions )}
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
                    openColorSidebarForEdit && < ColorEditForm data={selectedColor} open={openColorSidebarForEdit} toggleSidebarForEdit={toggleSidebarForEdit} />
                }
                {
                    openColorSidebar && <ColorAddForm open={openColorSidebar} toggleSidebar={toggleSidebar} />
                }
            </UILoader>
        </div>
    );
};

export default ColorList;

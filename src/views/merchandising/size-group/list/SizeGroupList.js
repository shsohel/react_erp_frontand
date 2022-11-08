
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { store } from '@store/storeConfig/store';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, Settings, XSquare } from 'react-feather';
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
import SizeGroupAddForm from '../form/SizeGroupAddForm';
import SizeGroupEditForm from '../form/SizeGroupEditForm';
import { deleteRangeSizeGroup, getSizeGroupByQuery, handleOpenSizeGroupSidebar, handleOpenSizeGroupSidebarForEdit } from '../store/actions';
import { handleGetSizeGroupColumns } from './SizeGroupTableColumn';


const SizeGroupList = () => {
    const dispatch = useDispatch();

    const defaultFilterValue = {
        groupName: ''
    };

    const defaultFilteredArrayValue = [
        {
            column: "groupName",
            value: ''
        }

    ];
    const { sizeGroups,
        total,
        selectedSizeGroup,
        openSizeGroupSidebar,
        openSizeGroupSidebarForEdit,
        queryData,
        isSizeGroupDataLoaded,
        isSizeGroupDataOnProgress

    } = useSelector( ( { sizeGroups } ) => sizeGroups );

    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

    console.log( queryData );

    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( [
        {
            column: "groupName",
            value: ''
        }
    ] );

    const [searchTerm, setSearchTerm] = useState( '' );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'groupName' );

    const [orderBy, setOrderBy] = useState( 'asc' );
    const [currentStatus, setCurrentStatus] = useState( { value: '', label: 'Select Status', number: 0 } );
    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    // ** Global Function to toggle sidebar for Size Group
    const toggleSidebar = () => store.dispatch( handleOpenSizeGroupSidebar( !openSizeGroupSidebar ) );
    const toggleSidebarForEdit = () => store.dispatch( handleOpenSizeGroupSidebarForEdit( !openSizeGroupSidebarForEdit ) );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };


    const filteredData = filteredArray.filter( filter => filter.value.length );


    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        dispatch( getSizeGroupByQuery( paramsObj, [] ) );
        setFilteredArray( defaultFilteredArrayValue );
    };

    const getAllSizeGroups = () => {
        dispatch( getSizeGroupByQuery( paramsObj, filteredData ) );

    };

    useEffect( () => {
        getAllSizeGroups();
    }, [] );


    const handleSearch = () => {
        dispatch(
            getSizeGroupByQuery( paramsObj, filteredData )
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
            getSizeGroupByQuery( {
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
        const count = Number( Math.ceil( total / value ) );

        const pageNumber = currentPage === count ? currentPage : 1;
        setCurrentPage( pageNumber );

        dispatch(
            getSizeGroupByQuery( {
                page: pageNumber,
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
            getSizeGroupByQuery( {
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


    // ** Table data to render
    const dataToRender = () => {
        const filters = {
            status: currentStatus.value,
            q: searchTerm
        };

        const isFiltered = Object.keys( filters ).some( function ( k ) {
            return filters[k].length > 0;
        } );


        if ( queryData.length > 0 ) {
            return queryData;
        } else if ( queryData.length === 0 && isFiltered ) {
            return [];
        } else {
            return sizeGroups.slice( 0, rowsPerPage );
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
            getSizeGroupByQuery( {
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
    const handleDeleteSizeGroupRange = () => {
        dispatch( deleteRangeSizeGroup( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range

    const handleAddNew = () => {
        toggleSidebar();

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
            isActive: false,
            hidden: !isPermit( userPermission?.GarmentColorList, authPermissions )

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
            isActive: true,
            hidden: false
        }
    ];

    return (
        <div>
            <UILoader blocking={isSizeGroupDataOnProgress} loader={<ComponentSpinner />} >

                <Card className="mt-3">
                    <ActionMenu
                        breadcrumb={breadcrumb}
                        title='Style Size Groups'
                        moreButton={isPermit( userPermission?.GarmentSizeGroupCreate, authPermissions )}

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
                            hidden={!isPermit( userPermission?.GarmentSizeGroupCreate, authPermissions )}

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
                                            placeholder="Style Group"
                                            bsSize="sm"
                                            name="groupName"
                                            value={filterObj.groupName}
                                            onChange={( e ) => handleFilterBoxOnChange( e )}
                                        />
                                    </Col>
                                    <Col xs={8}>
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
                                onSelectedRowsChange={handleRowSelected}
                                onSort={handleSort}
                                defaultSortAsc
                                defaultSortField='groupName'
                                sortServer
                                progressPending={!isSizeGroupDataLoaded}
                                progressComponent={
                                    <CustomPreLoader />
                                }
                                // contextMessage={}
                                contextActions={<Button.Ripple onClick={() => { handleDeleteSizeGroupRange(); }} className='btn-icon ' color='flat-danger'>
                                    <XSquare size={24} />
                                </Button.Ripple>}
                                dense
                                noHeader
                                subHeader={false}
                                highlightOnHover

                                responsive={true}
                                paginationServer

                                persistTableHead
                                columns={handleGetSizeGroupColumns( userPermission, authPermissions )}
                                sortIcon={<ChevronDown />}
                                className="react-custom-dataTable"
                                data={dataToRender()}
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
                    openSizeGroupSidebarForEdit && < SizeGroupEditForm data={selectedSizeGroup} open={openSizeGroupSidebarForEdit} toggleSidebarForEdit={toggleSidebarForEdit} />
                }
                {
                    openSizeGroupSidebar && <SizeGroupAddForm open={openSizeGroupSidebar} toggleSidebar={toggleSidebar} />
                }
            </UILoader>
        </div>
    );
};

export default SizeGroupList;

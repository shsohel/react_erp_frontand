import { store } from '@store/storeConfig/store';

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Filter, Settings, XSquare } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, NavItem, NavLink, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from "reactstrap";
import Card from 'reactstrap/lib/Card';
import CardBody from 'reactstrap/lib/CardBody';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { isPermit } from '../../../../utility/Utils';
import SeasonAddForm from '../form/SeasonAddForm';
import SeasonEditForm from '../form/SeasonEditForm';
import { deleteRangeSeason, getSeasonByQuery, handleOpenSeasonSidebar, handleOpenSeasonSidebarForEdit } from '../store/actions';
import SeasonExpandRow from './SeasonExpandRow';
import { handleGetSeasonColumns } from './SeasonTableColumn';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    },
    {
        id: 'seasonList',
        name: 'Seasons',
        link: "/seasons",
        isActive: true,
        hidden: false
    }
];

const SeasonList = () => {
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
        seasons,
        total,
        selectedSeason,
        openSeasonSidebar,
        openSeasonSidebarForEdit,
        queryData
    } = useSelector( ( { seasons } ) => seasons );

    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( true );

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

    const toggleSidebar = () => store.dispatch( handleOpenSeasonSidebar( !openSeasonSidebar ) );
    const toggleSidebarForEdit = () => store.dispatch( handleOpenSeasonSidebarForEdit( !openSeasonSidebarForEdit ) );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };

    const filteredData = filteredArray.filter( filter => filter.value.length );

    const getAllSeasons = () => {
        dispatch( getSeasonByQuery( paramsObj, filteredData ) );

    };

    useEffect( () => {
        getAllSeasons();
    }, [] );


    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getSeasonByQuery( paramsObj, [] ) );
    };

    const handleSearch = () => {
        dispatch(
            getSeasonByQuery( paramsObj, filteredData )
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
            getSeasonByQuery( {
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
            getSeasonByQuery( {
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
            getSeasonByQuery( {
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
            return seasons.slice( 0, rowsPerPage );
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
            getSeasonByQuery( {
                page: currentPage,
                perPage: rowsPerPage
                // status: currentStatus.value,
                // q: searchTerm,
                // sortedBy,
                // sortedColumn
            } )
        );
    };


    // ** Delete Rang
    const handleDeleteSeasonRange = () => {
        dispatch( deleteRangeSeason( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range

    const handleAddNew = () => {
        toggleSidebar();

    };
    return (
        <div>
            <Card className="mt-3">
                <ActionMenu
                    breadcrumb={breadcrumb}
                    title='Seasons'
                    moreButton={isPermit( userPermission?.SeasonCreate, authPermissions )}

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
                        hidden={!isPermit( userPermission?.SeasonCreate, authPermissions )}
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
                                <Col>
                                    <Row>
                                        <Col xs={12} sm={12} md={2} lg={2} xl={2} >
                                            <Input
                                                placeholder="Name"
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
                            defaultSortAsc
                            defaultSortField='name'
                            // progressPending={!queryData.length}
                            // progressComponent={
                            //     <CustomPreLoader />
                            // }
                            // contextMessage={}
                            contextActions={<Button.Ripple onClick={() => { handleDeleteSeasonRange(); }} className='btn-icon ' color='flat-danger'>
                                <XSquare size={24} />
                            </Button.Ripple>}
                            dense
                            noHeader
                            subHeader={false}
                            highlightOnHover
                            selectableRows
                            clearSelectedRows={clearSelectedRow}
                            responsive={true}
                            paginationServer
                            expandableRows={false}
                            expandableRowsComponent={<SeasonExpandRow data={data => data} />}
                            expandOnRowClicked
                            persistTableHead
                            columns={handleGetSeasonColumns( userPermission, authPermissions )}
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
                ( selectedSeason !== null && openSeasonSidebarForEdit ) && < SeasonEditForm
                    data={selectedSeason}
                    open={openSeasonSidebarForEdit}
                    toggleSidebarForEdit={toggleSidebarForEdit}
                />
            }
            {
                openSeasonSidebar && <SeasonAddForm
                    open={openSeasonSidebar}
                    toggleSidebar={toggleSidebar}
                />
            }
        </div>
    );
};

export default SeasonList;

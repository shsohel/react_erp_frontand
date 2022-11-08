import { store } from '@store/storeConfig/store';

import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { CheckSquare, ChevronDown, Edit3, Filter, List, PlusSquare, Settings } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from "react-redux";
import { Button, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, UncontrolledButtonDropdown, UncontrolledTooltip } from "reactstrap";
import Card from 'reactstrap/lib/Card';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import AdvancedSearchBox from '../../../../utility/custom/AdvancedSearchBox';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { isPermit } from '../../../../utility/Utils';
import VendorGroupFormNew from '../form/VendorGroupForm';
import { bindVendorBasicInfo, bindVendorGroup, bindVendorSubGroup, getVendorGroupsByQuery, getVendorSubGroupByVendorId, handleOpenVendorGroup, updateVendorGroup } from '../store/actions';

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
        name: 'Vendor Group',
        link: "/vendor-groups",
        isActive: true,
        hidden: false
    }
];


const VendorGroupList = () => {
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
        queryData,
        openVendorGroupSidebar,
        openVendorGroupSidebarEdit,
        openSubVendorGroupSidebar
    } = useSelector( ( { vendorGroups } ) => vendorGroups );
    const [filterObj, setFilterObj] = useState( defaultFilterValue );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState( false );

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
    const toggleModal = () => store.dispatch( handleOpenVendorGroup( !openVendorGroupSidebar ) );

    const paramsObj = {
        page: currentPage,
        perPage: rowsPerPage,
        sortedBy,
        orderBy
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    const getAllVendorGroups = () => {
        dispatch( getVendorGroupsByQuery( paramsObj, filteredData ) );
    };


    useEffect( () => {
        getAllVendorGroups();
    }, [] );

    const handleClearFilterBox = () => {
        setFilterObj( defaultFilterValue );
        setFilteredArray( defaultFilteredArrayValue );
        dispatch( getVendorGroupsByQuery( paramsObj, [] ) );
    };

    const handleSearch = () => {
        setCurrentPage( 1 );

        dispatch(
            getVendorGroupsByQuery( { ...paramsObj, page: 1 }, filteredData )
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
            getVendorGroupsByQuery( {
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
            getVendorGroupsByQuery( {
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
            getVendorGroupsByQuery( {
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
            getVendorGroupsByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                status: currentStatus.value,
                q: searchTerm,
                sortedBy,
                orderBy
            } )
        );
    };


    // ** Delete Rang
    const handleDeleteItemGroupRange = () => {
        // dispatch( deleteRangeItemGroup( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    const getSubGroup = ( vendorGroup ) => {
        dispatch( getVendorSubGroupByVendorId( vendorGroup.id ) );
        dispatch( bindVendorBasicInfo( vendorGroup ) );
    };

    const handleEditVendorGroup = ( id ) => {
        const updatedData = queryData.map( group => {
            if ( group.id === id ) {
                group['isEditable'] = !group.isEditable;
            }
            return group;
        } );
        dispatch( bindVendorGroup( updatedData ) );
        dispatch( bindVendorSubGroup( [] ) );
        dispatch( bindVendorBasicInfo( null ) );
    };
    const handleInputOnChange = ( e, id ) => {
        const { name, value } = e.target;
        const updatedData = queryData.map( group => {
            if ( group.id === id ) {
                group[name] = value;
            }
            return group;
        } );
        dispatch( bindVendorGroup( updatedData ) );
    };

    const handleGroupSubmit = ( group ) => {
        const submittedObj = {
            name: group.name
        };
        dispatch( updateVendorGroup( submittedObj, group.id ) );
    };

    const handleAddNew = () => {
        toggleModal();
        dispatch( bindVendorBasicInfo( null ) );
    };

    return (
        <div>
            <Card className='mt-3'>
                <ActionMenu
                    breadcrumb={breadcrumb}
                    moreButton={false}
                    title='Vendor Groups'
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
                            {
                                isPermit( userPermission?.VendorGroupCreate, authPermissions ) && (
                                    <Button.Ripple
                                        onClick={() => handleAddNew()}
                                        className='btn-icon'
                                        color='flat-primary'
                                        id='addNew'
                                    >
                                        <PlusSquare size={18} />
                                    </Button.Ripple>
                                )
                            }


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

                                    </Row>
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4} xl={3} className="d-flex justify-content-end">
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
                            persistTableHead
                            onSort={handleSort}
                            defaultSortField={sortedBy}
                            defaultSortAsc
                            sortServer
                            dense
                            subHeader={false}
                            noHeader
                            highlightOnHover
                            responsive={true}
                            paginationServer

                            columns={[
                                {
                                    id: 'nameId',
                                    name: 'Vendor Groups',
                                    minWidth: '200px',
                                    selector: 'name',
                                    sortable: true,
                                    cell: row => ( row.isEditable ? <Input
                                        id='groupNameId'
                                        bsSize="sm"
                                        name="name"
                                        value={row.name}
                                        onChange={( e ) => { handleInputOnChange( e, row.id ); }}
                                    /> : row.name )
                                },

                                {
                                    name: 'Actions',
                                    center: true,
                                    maxWidth: '150px',
                                    cell: row => <span>
                                        {
                                            isPermit( userPermission?.VendorGroupEdit, authPermissions ) && (
                                                <Button.Ripple id="editRowId"
                                                    tag={Label}
                                                    className='btn-icon p-0 ml-1'
                                                    color='flat-success'
                                                >
                                                    {row.isEditable ? <CheckSquare
                                                        size={16}
                                                        id="editRow"
                                                        color="#6610f2"
                                                        onClick={() => { handleGroupSubmit( row ); }}
                                                    /> : <Edit3
                                                        onClick={() => { handleEditVendorGroup( row.id ); }}
                                                        size={16}
                                                        id="editRow"
                                                        color="green"
                                                    />}
                                                </Button.Ripple>
                                            )
                                        }

                                        <Button.Ripple id="saveId"
                                            tag={Label}
                                            size="sm"
                                            className='btn-icon p-0 ml-1'
                                            color='flat-primary'
                                        >
                                            <List
                                                onClick={() => { getSubGroup( row ); }}
                                                size={16}
                                                id="editRow"
                                                color="purple"
                                            />
                                        </Button.Ripple>
                                    </span>
                                }

                            ]}
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
            {
                openVendorGroupSidebar && (
                    <VendorGroupFormNew openModal={openVendorGroupSidebar} toggleModal={toggleModal} />
                )
            }

        </div >
    );
};

export default VendorGroupList;

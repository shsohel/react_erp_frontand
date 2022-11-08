import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Delete, PlusSquare } from 'react-feather';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row } from 'reactstrap';
import TableCustomerHeader from '../../../../utility/custom/TableCustomerHeader';
import { selectThemeColors } from '../../../../utility/Utils';
import { deleteRangePreCosting, getPreCostingByQuery } from '../store/action';
import { preCostingsTableColumn } from './PreCostingTableColumn';

// **  Status filter options: Demo Array
const statusOptions = [
    { value: '', label: 'Select Status', number: 0 },
    { value: 'pending', label: 'Pending', number: 1 },
    { value: 'active', label: 'Active', number: 2 },
    { value: 'inactive', label: 'Inactive', number: 3 }
];


const PreCostingList = ( { preCostings, queryData, total, selectedPreCosting } ) => {
    const dispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState( '' );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'asc' );
    const [sortedColumn, setSortedColumn] = useState( 'styleNo' );
    const [currentStatus, setCurrentStatus] = useState( { value: '', label: 'Select Status', number: 0 } );
    const [selectedRowId, setSelectedRowId] = useState( [] );
    const [clearSelectedRow, setClearSelectedRow] = useState( false );

    useEffect( () => {
        dispatch(
            getPreCostingByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                status: currentStatus.value,
                q: searchTerm,
                sortedBy,
                sortedColumn
            } )
        );
    }, [dispatch, queryData.length] );
    // ** Function in get data on page change
    const handlePagination = page => {
        dispatch(
            getPreCostingByQuery( {
                page: page.selected + 1,
                perPage: rowsPerPage,
                status: currentStatus.value,
                q: searchTerm,
                sortedBy,
                sortedColumn
            } )
        );
        setCurrentPage( page.selected + 1 );
    };

    // ** Function in get data on rows per page
    const handlePerPage = e => {
        const value = parseInt( e.currentTarget.value );
        dispatch(
            getPreCostingByQuery( {
                page: currentPage,
                perPage: value,
                status: currentStatus.value,
                q: searchTerm,
                sortedBy,
                sortedColumn
            } )
        );
        setRowsPerPage( value );
    };

    // ** Function in get data on search query change
    const handleFilter = val => {
        setSearchTerm( val );
        dispatch(
            getPreCostingByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                status: currentStatus.value,
                q: val,
                sortedBy,
                sortedColumn
            } )
        );
    };

    const handleSort = ( column, direction ) => {
        const { selector } = column;
        setSortedBy( direction );
        setSortedColumn( selector );
        dispatch(
            getPreCostingByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                status: currentStatus.value,
                q: searchTerm,
                sortedBy: direction,
                sortedColumn: selector
            } )
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
            return preCostings.slice( 0, rowsPerPage );
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
            getPreCostingByQuery( {
                page: currentPage,
                perPage: rowsPerPage,
                status: currentStatus.value,
                q: searchTerm,
                sortedBy,
                sortedColumn
            } )
        );
    };

    // ** Delete Rang
    const handleDeletePreCostingRange = () => {
        dispatch( deleteRangePreCosting( selectedRowId ) );
        setSelectedRowId( [] );
        handleClearSelected();
    };
    // ** End For Multiple Select and Delete Range

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>Search Filter</CardTitle>
                </CardHeader>

                <CardBody>
                    <Row>
                        <Col md='4'>

                        </Col>

                        <Col md='4'>
                            <Select
                                theme={selectThemeColors}
                                isClearable={false}
                                className='react-select  mt-50'
                                classNamePrefix='select'
                                options={statusOptions}
                                value={currentStatus}

                                onChange={data => {
                                    setCurrentStatus( data );
                                    dispatch(
                                        getPreCostingByQuery( {
                                            page: currentPage,
                                            perPage: rowsPerPage,
                                            status: data.value,
                                            q: searchTerm,
                                            sortedBy,
                                            sortedColumn
                                        } )
                                    );
                                }}
                            />
                        </Col>
                        <Col md='4'>
                            <Input
                                id='search-buyer'
                                className='w-100 mt-50'
                                placeholder='Search'
                                type='text'
                                value={searchTerm}
                                onChange={e => handleFilter( e.target.value )}
                            />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <Card>
                <div>
                    <CardHeader>
                        <CardTitle tag='h2'>Pre Costing</CardTitle>
                    </CardHeader>
                    <TableCustomerHeader
                        handlePerPage={handlePerPage}
                        rowsPerPage={rowsPerPage}
                        searchTerm={searchTerm}
                    >
                        <Button.Ripple tag={Link} to='/new-pre-costing' className='btn-icon' color='flat-success'>
                            <PlusSquare size={24} />
                        </Button.Ripple>
                    </TableCustomerHeader>
                    <DataTable
                        className='react-dataTable'
                        dense
                        highlightOnHover
                        selectableRows
                        responsive
                        paginationServer
                        // expandableRows
                        sortIcon={<ChevronDown />}
                        // expandOnRowClicked
                        clearSelectedRows={clearSelectedRow}
                        onSelectedRowsChange={handleRowSelected}
                        contextActions={<Delete color='red' size={28} onClick={() => { handleDeletePreCostingRange(); }} />}
                        // expandableRowsComponent={<PreCostingExpandRow data={data => data} />}
                        onSort={handleSort}
                        columns={preCostingsTableColumn}
                        data={dataToRender()}

                    />
                </div>
                <div>
                    <CustomPagination />
                </div>
            </Card>
        </div>
    );
};

export default PreCostingList;

import classnames from 'classnames';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, MinusSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Col, Input, Label, Row } from 'reactstrap';
import { selectThemeColors } from '../../../../utility/Utils';
import { bindWarehouseDataOnchange } from '../store/actions';

const itemGroupDropdown = [
    {
        label: 'ItemGroup 01',
        value: 1
    },
    {
        label: 'ItemGroup 02',
        value: 2
    },
    {
        label: 'ItemGroup 03',
        value: 3
    },
    {
        label: 'ItemGroup 04',
        value: 4
    },
    {
        label: 'ItemGroup 05',
        value: 5
    },
    {
        label: 'ItemGroup 06',
        value: 6
    },
    {
        label: 'ItemGroup 07',
        value: 7
    },
    {
        label: 'ItemGroup 08',
        value: 8
    },
    {
        label: 'ItemGroup 09',
        value: 9
    },
    {
        label: 'ItemGroup 010',
        value: 10
    },
    {
        label: 'ItemGroup 11',
        value: 11
    }
];
const WarehouseAssignItemGroupForm = () => {
    const dispatch = useDispatch();
    const { warehouse } = useSelector( ( { warehouses } ) => warehouses );
    const { dropDownItemGroups } = useSelector( ( { itemGroups } ) => itemGroups );
    const [filterObj, setFilterObj] = useState( {
        itemGroupName: ''
    } );
    const handleFilter = ( e ) => {
        const { name, value } = e.target;

        setFilterObj( {
            ...filterObj,
            [name]: value
        } );
    };

    const handleItemGroupOnChange = ( data ) => {
        const addingItemGroupObj = {
            name: data?.label,
            itemGroupId: data?.value
        };
        const updatedObj = {
            ...warehouse,
            itemGroupList: [...warehouse.itemGroupList, addingItemGroupObj]
        };
        dispatch( bindWarehouseDataOnchange( updatedObj ) );
    };


    const handleRemoveItemGroup = ( itemGroupId ) => {
        const updatedData = warehouse.itemGroupList.filter( iGroup => iGroup.itemGroupId !== itemGroupId );
        const updatedObj = {
            ...warehouse,
            itemGroupList: updatedData
        };
        dispatch( bindWarehouseDataOnchange( updatedObj ) );
    };

    const randersData = () => {
        let filtered = [];
        if ( filterObj.itemGroupName.length ) {
            filtered = warehouse?.itemGroupList?.filter(
                wh => wh.itemGroupName?.toLowerCase().includes( filterObj.itemGroupName?.toLowerCase() )
            );
        } else {
            filtered = warehouse?.itemGroupList;
        }
        return filtered;
    };

    return <div>
        <Row>
            <Col className="p-1">
                <div className='d-flex mb-1'>
                    <div className='d-flex w-75 align-items-center'>
                        <div className='w-75 mr-1'>
                            <Select
                                id='itemGroupId'
                                placeholder="Select Item Group"
                                name="itemGroup"
                                isSearchable
                                menuPosition="fixed"
                                isClearable
                                theme={selectThemeColors}
                                options={dropDownItemGroups?.filter( iGroup => !warehouse?.itemGroupList?.some( wItem => wItem?.itemGroupId === iGroup.value ) )}
                                // options={[]}
                                classNamePrefix='dropdown'
                                // innerRef={register( { required: true } )}
                                className={classnames( 'erp-dropdown-select' )}
                                value={null}
                                onChange={( data ) => {
                                    handleItemGroupOnChange( data );
                                }}
                            />
                        </div>

                    </div>
                    <div className='w-25'>
                        <Input
                            name="itemGroupName"
                            bsSize="sm" placeholder="Search by Item Group"
                            onChange={e => { handleFilter( e ); }} />
                    </div>

                </div>
                <div >
                    <DataTable
                        // subHeader
                        // subHeaderComponent={<div className='d-flex justify-content-between'>

                        //     <Input
                        //         name="itemGroupName"
                        //         bsSize="sm" placeholder="Search"
                        //         onChange={e => { handleFilter( e ); }} />
                        // </div>}
                        noHeader
                        dense={true}
                        pagination
                        persistTableHead
                        //  paginationServer
                        className='react-custom-dataTable'
                        paginationRowsPerPageOptions={[5, 10, 20, 25]}
                        columns={[
                            {
                                id: 'serialNo',
                                name: '#',
                                width: '30px',
                                selector: '#',
                                sortable: false,
                                center: true,
                                cell: ( row, index ) => index + 1

                            },
                            {
                                id: 'name',
                                name: 'Group',
                                minWidth: '50px',
                                selector: 'name',
                                sortable: true,
                                cell: row => row?.name
                            },
                            {
                                id: 'actions',
                                name: 'Action',
                                width: '80px',
                                selector: 'action',
                                center: true,
                                cell: row => (
                                    <Button.Ripple
                                        id="editRow"
                                        tag={Label}
                                        onClick={() => { handleRemoveItemGroup( row.itemGroupId ); }}
                                        className='btn-icon p-0'
                                        color='flat-success'
                                    >
                                        <MinusSquare size={16} id="editRow" color="red" />
                                    </Button.Ripple>
                                )
                            }
                        ]}
                        data={randersData()}
                        sortIcon={<ChevronDown size={2} />}
                        //  paginationComponent={CustomPagination}
                        paginationTotalRows={randersData()?.length}
                    // paginationPerPage={perPage}
                    //  onChangeRowsPerPage={handlePerRowsChange}
                    //  onChangePage={handlePageChange}

                    />
                </div>

            </Col>

        </Row>
    </div>;
};

export default WarehouseAssignItemGroupForm;

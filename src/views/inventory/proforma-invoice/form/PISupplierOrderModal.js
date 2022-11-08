import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import TableFilterInsideRow from '../../../../utility/custom/TableFilterInsideRow';
import { bindPiBasicInfo } from '../store/actions';


const PISupplierOrderModal = ( { openModal, setOpenModal } ) => {
    const dispatch = useDispatch();
    const { vendorDropdown } = useSelector( ( { vendors } ) => vendors );
    const { piBasicInfo } = useSelector( ( { pis } ) => pis );

    const [filterObj, setFilterObj] = useState( {
        name: '',
        shortName: '',
        mobileNumber: '',
        email: ''
    } );


    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : value
        } );
    };


    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
    };

    const handleSetVendorDropdown = ( supplier ) => {

        const updatedObj = {
            ...piBasicInfo,
            ['supplier']: { value: supplier?.value, label: supplier?.label }
        };
        dispatch( bindPiBasicInfo( updatedObj ) );

        handleMainModalToggleClose();
    };


    const randersData = () => {
        let filtered = [];
        if ( filterObj.name.length
            || filterObj.shortName.length
            || filterObj.mobileNumber.length
            || filterObj.email.length
        ) {
            filtered = vendorDropdown.filter(
                wh => wh.name?.toLowerCase().includes( filterObj.name?.toLowerCase() ) &&
                    wh.shortName?.toLowerCase().includes( filterObj.shortName?.toLowerCase() ) &&
                    wh.mobileNumber?.toLowerCase().includes( filterObj.mobileNumber?.toLowerCase() ) &&
                    wh.email?.toLowerCase().includes( filterObj.email?.toLowerCase() )
            );
        } else {
            filtered = vendorDropdown;
        }
        return filtered;
    };
    const filterArray = [
        {
            name: '',
            width: '35px'
        },
        {
            id: 'supplierId',
            name: <Input
                id="supplierId"
                name="name"
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
                placeholder=""
            />,
            minWidth: '150px'
        },
        {
            id: "shortNameId",
            name: <Input
                id="shortNameId"
                name="shortName"
                onChange={( e ) => { handleFilter( e ); }}
                bsSize="sm"
                placeholder=""
            />,
            minWidth: '150px'
        }
    ];
    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog modal-md'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModalToggleClose={handleMainModalToggleClose}
                handleMainModelSubmit={handleMainModalToggleClose}
                title="Suppliers "
            >
                <TableFilterInsideRow rowId="procurementSupplier" tableId="procurementSupplier-dt" filterArray={filterArray} />
                <DataTable
                    // progressPending={!isProcurementDataLoaded}
                    // progressComponent={
                    //     <CustomPreLoader />
                    // }
                    conditionalRowStyles={[
                        {
                            when: row => row.value === piBasicInfo?.supplier?.value,
                            style: {
                                backgroundColor: '#E1FEEB'
                            }
                        }
                    ]}
                    onRowDoubleClicked={( row ) => { handleSetVendorDropdown( row ); }}
                    pagination
                    paginationTotalRows={randersData().length}
                    noHeader
                    dense
                    subHeader={false}
                    highlightOnHover
                    responsive={true}
                    persistTableHead
                    sortIcon={<ChevronDown />}
                    className="react-custom-dataTable-other procurementSupplier-dt"
                    data={randersData()}
                    columns={[
                        {
                            name: 'SL',
                            width: '35px',
                            selector: 'sl',
                            center: true,
                            cell: ( row, index ) => index + 1
                        },
                        {
                            name: 'Name',
                            minWidth: '150px',
                            selector: 'name',
                            sortable: true,
                            cell: row => row.name
                        },
                        {
                            name: 'Short Name',
                            minWidth: '150px',
                            selector: 'shortName',
                            sortable: true,
                            cell: row => row.shortName
                        }

                    ]}
                />
            </CustomModal>
        </div>
    );
};

export default PISupplierOrderModal;
import moment from 'moment';
import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Col, CustomInput, Input, Row } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { randomIdGenerator } from '../../../../utility/Utils';
import { bindCostingBasicInfo, bindSetCostingStylePurchaseOrderDetails, getStyleCostingDetails } from '../store/action';


const SetCostingStylePurchaseOrderModal = ( { openModal, setOpenModal } ) => {
    const dispatch = useDispatch();

    const { costingBasicInfo,
        setCostingStylePurchaseOrderDetails } = useSelector( ( { costings } ) => costings );

    const [filterObj, setFilterObj] = useState( {
        shipmentDate: '',
        orderNumber: '',
        setStyleNumber: ''
    } );

    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : value
        } );
    };

    const handleAllRowSelect = ( e ) => {
        const { name, checked } = e.target;
        const updatedData = setCostingStylePurchaseOrderDetails.map( so => ( { ...so, isSelected: checked } ) );
        dispatch( bindSetCostingStylePurchaseOrderDetails( updatedData ) );
    };

    const handleSelectSingleRow = ( e, rowId ) => {
        const { name, checked } = e.target;
        const updatedData = setCostingStylePurchaseOrderDetails.map( so => {
            if ( so.rowId === rowId ) {
                so[name] = checked;
            }
            return so;
        } );
        dispatch( bindSetCostingStylePurchaseOrderDetails( updatedData ) );

    };

    const randersData = () => {
        let filtered = [];
        if ( filterObj.orderNumber.length || filterObj.shipmentDate.length || filterObj.setStyleNumber.length ) {
            filtered = setCostingStylePurchaseOrderDetails?.filter(
                wh => wh.orderNumber?.toLowerCase().includes( filterObj.orderNumber?.toLowerCase() )
                    &&
                    wh.setStyleNumber?.toLowerCase().includes( filterObj.setStyleNumber?.toLowerCase() )
                    &&
                    wh.shipmentDate.includes( filterObj.shipmentDate )
            );
        } else {
            filtered = setCostingStylePurchaseOrderDetails;
        }
        return filtered;
    };

    const handleModelSubmit = () => {
        const { styleOrderDetails } = costingBasicInfo;

        const selectedItems = setCostingStylePurchaseOrderDetails.filter( ii => ii.isSelected );

        // const isRemainRow = styleOrderDetails.filter( finalSelected => selectedItems.some( s => s.orderId === finalSelected.orderId ) );

        //   const isNewRow = selectedItems.filter( finalSelected => !styleOrderDetails.some( s => s.orderId === finalSelected.orderId ) );
        // const newItemSelected = isNewRow.map( i => ( {
        //     ...i,
        //     rowId: randomIdGenerator()
        // } ) );

        const uniqItem = styleOrderDetails.filter( o => !selectedItems.some( order => order.orderId === o.orderId && order.shipmentDate === o.shipmentDate && order.setStyleId === o.setStyleId ) );
        console.log( uniqItem );

        const finalSelected = [...selectedItems, ...uniqItem];
        const updateObj = {
            ...costingBasicInfo,
            ['styleOrderDetails']: finalSelected
        };
        dispatch( bindCostingBasicInfo( updateObj ) );

        const queryData = finalSelected.map( order => ( {
            setStyleId: order.setStyleId,
            orderId: order.orderId
        } ) );

        // console.log( 'queryData', JSON.stringify( queryData, null, 2 ) );

        dispatch( getStyleCostingDetails( queryData ) );

        setOpenModal( !openModal );

    };
    const handleModalToggleClose = () => {
        setOpenModal( !openModal );
    };
    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog modal-lg'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModelSubmit={handleModelSubmit}
                handleMainModalToggleClose={handleModalToggleClose}
                title="Style Purchase Orders"
            >
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <DataTable
                            subHeader
                            subHeaderComponent={<div className='d-flex justify-content-between'>
                                <Input
                                    id="orderNoId"
                                    name="orderNumber"
                                    type="text"
                                    bsSize="sm"
                                    placeholder="Search PO No"
                                    onChange={e => { handleFilter( e ); }} />
                                <Input
                                    id="setStyleNumberId"
                                    name="setStyleNumber"
                                    type="text"
                                    bsSize="sm"
                                    placeholder="Search Style No"
                                    onChange={e => { handleFilter( e ); }} />
                                <Input
                                    id="styleNoId"
                                    name="shipmentDate"
                                    bsSize="sm"
                                    type="date"
                                    placeholder="Search Order No"

                                    onChange={e => { handleFilter( e ); }} />

                            </div>}
                            noHeader
                            dense={true}
                            defaultSortAsc
                            pagination
                            persistTableHead
                            className='react-custom-dataTable'
                            paginationRowsPerPageOptions={[5, 10, 20, 25]}
                            columns={[
                                {

                                    name: <CustomInput
                                        type='checkbox'
                                        className='custom-control-Primary p-0'
                                        id="isSelectedId"
                                        name='isSelectedAll'
                                        htmlFor="isSelectedId"
                                        checked={setCostingStylePurchaseOrderDetails.every( so => so.isSelected === true )}
                                        inline
                                        onChange={( e ) => handleAllRowSelect( e )}
                                    />,
                                    id: randomIdGenerator(),
                                    width: '50px',
                                    selector: row => row.isSelected,
                                    center: true,
                                    //   sortable: true,
                                    cell: ( row ) => (
                                        <CustomInput
                                            type='checkbox'
                                            className='custom-control-Primary p-0'
                                            id={row.rowId.toString()}
                                            name='isSelected'
                                            htmlFor={row.rowId.toString()}
                                            checked={row.isSelected}
                                            inline
                                            onChange={( e ) => handleSelectSingleRow( e, row.rowId )}
                                        />
                                    )

                                },
                                {
                                    name: 'SL',
                                    width: '30px',
                                    selector: 'SL',
                                    center: true,
                                    cell: ( row, index ) => index + 1
                                },
                                {
                                    name: 'Style',
                                    minWidth: '150px',
                                    selector: 'setStyleNumber',
                                    sortable: true,
                                    center: true,
                                    cell: row => row?.setStyleNumber
                                },
                                {
                                    name: 'PO No',
                                    minWidth: '150px',
                                    selector: 'orderNumber',
                                    sortable: true,
                                    center: true,
                                    cell: row => row?.orderNumber
                                },
                                {
                                    name: 'Currency',
                                    minWidth: '150px',
                                    selector: 'currencyCode',
                                    sortable: true,
                                    center: true,
                                    cell: row => row?.currencyCode
                                },
                                {
                                    name: 'Shipment Date',
                                    minWidth: '150px',
                                    selector: 'shipmentDate',
                                    sortable: true,
                                    center: true,
                                    cell: row => moment( row?.shipmentDate ).format( 'DD-MM-YYYY' )
                                }

                            ]}
                            data={randersData()}
                            sortIcon={<ChevronDown size={2} />}
                            paginationTotalRows={randersData().length}
                        />
                    </Col>
                </Row>

            </CustomModal>
        </div>
    );
};

export default SetCostingStylePurchaseOrderModal;
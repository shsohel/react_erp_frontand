import _ from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Col, CustomInput, Input, Row, Table } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { randomIdGenerator } from '../../../../utility/Utils';
import { bindConsumptionBasicInfo, bindSetConsumptionStylePurchaseOrderDetails, getConsumptionPackagingAccessories, getSetCostingInfoForConsumption } from '../store/actions';


const SetConsumptionStylePurchaseOrderModal = ( { openModal, setOpenModal } ) => {
    const dispatch = useDispatch();

    const { consumptionBasicInfo,
        setConsumptionStylePurchaseOrderDetails } = useSelector( ( { consumptions } ) => consumptions );

    const [filterObj, setFilterObj] = useState( {
        shipmentDate: '',
        orderNumber: ''
    } );

    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : value
        } );
    };

    const handleAllRowSelect = ( e ) => {
        const { checked } = e.target;
        const completedOrder = setConsumptionStylePurchaseOrderDetails.filter( o => o.isConsumptionCompleted === true );
        const updatedData = setConsumptionStylePurchaseOrderDetails.map( so => {
            if ( so.isCostingCompleted === true && so.isConsumptionCompleted === false ) {
                so.isSelected = checked;
            }
            return so;
        }
            // { ...so, isSelected: checked }
        );
        // const updatedData = consumptionPurchaseOrderDetails.filter( o => o.isConsumptionCompleted === false ).map( so => (
        //     { ...so, isSelected: checked }
        // ) );

        dispatch( bindSetConsumptionStylePurchaseOrderDetails( updatedData ) );
    };

    const handleSelectSingleRow = ( e, rowId ) => {
        const { name, checked } = e.target;
        const updatedData = setConsumptionStylePurchaseOrderDetails.map( so => {
            if ( so.rowId === rowId ) {
                so[name] = checked;
            }
            return so;
        } );
        dispatch( bindSetConsumptionStylePurchaseOrderDetails( updatedData ) );
    };
    const handleSelectSingleRowByOrderId = ( e, orderId ) => {
        const { name, checked } = e.target;
        const updatedData = setConsumptionStylePurchaseOrderDetails.map( so => {
            if ( so.orderId === orderId && so.isConsumptionCompleted === false && so.isCostingCompleted === true ) {
                so[name] = checked;
            }
            return so;
        } );
        dispatch( bindSetConsumptionStylePurchaseOrderDetails( updatedData ) );
    };

    const randersData = () => {
        let filtered = [];
        if ( filterObj.orderNumber.length || filterObj.shipmentDate.length ) {
            filtered = setConsumptionStylePurchaseOrderDetails?.filter(
                wh => wh.orderNumber?.toLowerCase().includes( filterObj.orderNumber?.toLowerCase() )
                    &&
                    wh.shipmentDate.includes( filterObj.shipmentDate )
            );
        } else {
            filtered = setConsumptionStylePurchaseOrderDetails;
        }
        return filtered;
    };


    const handleModelSubmit = () => {
        const { styleOrderDetails } = consumptionBasicInfo;

        const selectedItems = setConsumptionStylePurchaseOrderDetails.filter( ii => ii.isSelected );

        const isRemainRow = styleOrderDetails.filter( finalSelected => selectedItems.some( s => s.orderId === finalSelected.orderId ) );

        const isNewRow = selectedItems.filter( finalSelected => !styleOrderDetails.some( s => s.orderId === finalSelected.orderId ) );

        const newItemSelected = isNewRow.map( i => ( {
            ...i,
            rowId: randomIdGenerator()
        } ) );
        const finalSelectedItem = [...isRemainRow, ...newItemSelected];

        const updateObj = {
            ...consumptionBasicInfo,
            ['styleOrderDetails']: selectedItems
        };
        dispatch( bindConsumptionBasicInfo( updateObj ) );

        const queryData = finalSelectedItem.map( order => ( {
            orderId: order.orderId,
            setStyleId: order.setStyleId,
            costingId: order.costingId
        } ) );
        const queryDataForSet = finalSelectedItem.map( order => ( {
            orderId: order.orderId,
            styleId: order.setStyleId,
            costingId: order.costingId
        } ) );


        dispatch( getSetCostingInfoForConsumption( queryData ) );

        dispatch( getConsumptionPackagingAccessories( queryDataForSet ) );


        setOpenModal( !openModal );

    };
    const handleModalToggleClose = () => {
        setOpenModal( !openModal );
    };

    ///Expandable Components
    const PurchaseOrderColoSize = ( { data, orders } ) => {
        return (
            <Row>
                <Col xl={6} className="costing-custom-table  pt-1 pb-1">
                    {/* <Label className="font-weight-bolder"> SizeGroups and Color</Label> */}
                    <Table bordered>
                        <thead>
                            <tr>
                                <th className='sl'> #</th>
                                <th className='sl'> SL</th>
                                <th> Costing No</th>
                                <th> Costing Status </th>
                                <th> Consumption Status</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {
                                orders.filter( fo => fo.orderId === data.orderId ).map( ( order, index ) => (
                                    <tr key={index + 1}>
                                        <td className='sl'>{index + 1}</td>
                                        <td className='sl'>
                                            <CustomInput
                                                type='checkbox'
                                                disabled={order.isConsumptionCompleted === true || order.isCostingCompleted === false}
                                                className='custom-control-success p-0'
                                                id={`${order.rowId.toString()}${order.rowId.toString()}`}
                                                name='isSelected'
                                                htmlFor={`${order.rowId.toString()}${order.rowId.toString()}`}
                                                checked={order.isSelected}
                                                inline
                                                onChange={( e ) => handleSelectSingleRow( e, order.rowId )}
                                            />
                                        </td>
                                        <td>{order.costingNumber ?? 'NA'}</td>
                                        <td>{order.isCostingCompleted ? 'Completed ' : 'NA'}</td>
                                        <td>{order.isConsumptionCompleted ? 'Completed ' : 'NA'}</td>
                                    </tr>
                                ) )
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        );
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
                title="Style Purchase Orders (SET)"
            >
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <DataTable
                            conditionalRowStyles={[
                                {
                                    when: row => setConsumptionStylePurchaseOrderDetails.filter( o => o.orderId === row.orderId ).some( so => so.isSelected === true ),
                                    style: {
                                        backgroundColor: '#E1FEEB'
                                    }
                                }
                            ]}
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
                            expandableRows
                            expandableRowsComponent={
                                <PurchaseOrderColoSize orders={setConsumptionStylePurchaseOrderDetails} />
                            }

                            className='react-custom-dataTable bg-primacy'
                            paginationRowsPerPageOptions={[5, 10, 20, 25]}
                            columns={[
                                {

                                    name: <CustomInput
                                        type='checkbox'
                                        className='custom-control-Primary p-0'
                                        id="isSelectedId"
                                        name='isSelectedAll'
                                        htmlFor="isSelectedId"
                                        checked={setConsumptionStylePurchaseOrderDetails.filter( o => o.isCostingCompleted ).some( so => so.isSelected === true )}
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
                                            checked={setConsumptionStylePurchaseOrderDetails.filter( o => o.orderId === row.orderId && !o.isConsumptionCompleted ).some( so => so.isSelected === true )}
                                            inline
                                            onChange={( e ) => handleSelectSingleRowByOrderId( e, row.orderId )}
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
                                    name: 'PO No',
                                    reorder: true,
                                    minWidth: '150px',
                                    selector: 'orderNumber',
                                    sortable: true,
                                    center: true,
                                    cell: row => row?.orderNumber

                                },

                                {
                                    name: 'Set Style',
                                    minWidth: '100px',
                                    selector: 'setStyleNumber',
                                    sortable: true,
                                    center: true,
                                    cell: row => row?.setStyleNumber ?? 'NA'
                                },

                                {
                                    name: 'Shipment Date',
                                    minWidth: '100px',
                                    selector: 'shipmentDate',
                                    sortable: true,
                                    center: true,
                                    cell: row => moment( row?.shipmentDate ).format( 'DD-MM-YYYY' )
                                }

                            ]}
                            data={_.uniqBy( randersData(), 'orderId' )}
                            sortIcon={<ChevronDown size={2} />}
                            paginationTotalRows={randersData().length}
                        />
                    </Col>
                </Row>

            </CustomModal>
        </div>
    );
};

export default SetConsumptionStylePurchaseOrderModal;
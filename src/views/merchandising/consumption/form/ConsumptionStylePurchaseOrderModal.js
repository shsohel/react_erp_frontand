import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Col, CustomInput, Input, Row, Table } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { randomIdGenerator } from '../../../../utility/Utils';
import { bindConsumptionBasicInfo, bindConsumptionStylePurchaseOrderDetails, getCostingInfoForConsumption } from '../store/actions';

const ConsumptionStylePurchaseOrderModal = ( { openModal, setOpenModal } ) => {
    const dispatch = useDispatch();

    const {
        consumptionBasicInfo,
        consumptionPurchaseOrderDetails,
        isConsumptionPurchaseOrderDetailsDataProgress
    } = useSelector( ( { consumptions } ) => consumptions );

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
        const updatedData = consumptionPurchaseOrderDetails.map( c => ( { ...c, isSelected: checked } ) );
        // { ...so, isSelected: checked }

        // const updatedData = consumptionPurchaseOrderDetails.filter( o => o.isConsumptionCompleted === false ).map( so => (
        //     { ...so, isSelected: checked }
        // ) );

        dispatch( bindConsumptionStylePurchaseOrderDetails( updatedData ) );
    };

    const handleSelectSingleRow = ( e, rowId, shipmentDate ) => {
        const { name, checked } = e.target;
        const updatedData = consumptionPurchaseOrderDetails.map( so => {
            if ( so.rowId === rowId && so.shipmentDate === shipmentDate ) {
                so[name] = checked;
            }
            return so;
        } );
        dispatch( bindConsumptionStylePurchaseOrderDetails( updatedData ) );
    };
    const handleSelectSingleRowByOrderId = ( e, orderId, shipmentDate ) => {
        console.log( shipmentDate );
        const { name, checked } = e.target;
        const updatedData = consumptionPurchaseOrderDetails.map( so => {
            if ( so.orderId === orderId && so.shipmentDate === shipmentDate ) {
                so[name] = checked;
            }
            return so;
        } );
        dispatch( bindConsumptionStylePurchaseOrderDetails( updatedData ) );
    };

    const randersData = () => {
        let filtered = [];
        if ( filterObj.orderNumber.length || filterObj.shipmentDate.length ) {
            filtered = consumptionPurchaseOrderDetails?.filter(
                wh => wh.orderNumber?.toLowerCase().includes( filterObj.orderNumber?.toLowerCase() )
                    &&
                    wh.shipmentDate.includes( filterObj.shipmentDate )
            );
        } else {
            filtered = consumptionPurchaseOrderDetails;
        }
        return filtered;
    };


    const handleModelSubmit = () => {
        const { styleOrderDetails } = consumptionBasicInfo;
        const selectedItems = consumptionPurchaseOrderDetails.filter( ii => ii.isSelected );


        const uniqItem = styleOrderDetails.filter( o => !selectedItems.some( order => order.orderId === o.orderId && order.shipmentDate === o.shipmentDate && order.costingId === o.costingId ) );

        const finalSelectedItem = [...selectedItems, ...uniqItem];

        const updateObj = {
            ...consumptionBasicInfo,
            ['styleOrderDetails']: finalSelectedItem
        };
        dispatch( bindConsumptionBasicInfo( updateObj ) );
        console.log( finalSelectedItem );

        const queryData = finalSelectedItem.map( order => ( {
            orderId: order.orderId,
            styleId: order.styleId,
            costingId: order.costingId,
            setStyleId: order.setStyleId,
            shipmentDate: order.shipmentDate
        } ) );


        dispatch( getCostingInfoForConsumption( queryData ) );


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
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {
                                orders.filter( fo => fo.orderId === data.orderId && fo.shipmentDate === data.shipmentDate ).map( ( order, index ) => (
                                    <tr key={index + 1}>
                                        <td className='sl'>{index + 1}</td>
                                        <td className='sl'>
                                            <CustomInput
                                                type='checkbox'
                                                //  disabled={order.isConsumptionCompleted === true || order.isCostingCompleted === false}
                                                className='custom-control-success p-0'
                                                id={`${order.rowId.toString()}${order.rowId.toString()}`}
                                                name='isSelected'
                                                htmlFor={`${order.rowId.toString()}${order.rowId.toString()}`}
                                                checked={order.isSelected}
                                                inline
                                                onChange={( e ) => handleSelectSingleRow( e, order.rowId, order.shipmentDate )}
                                            />
                                        </td>
                                        <td>{order.costingNumber ?? 'NA'}</td>

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
                title="Style Purchase Orders"
            >
                <UILoader blocking={isConsumptionPurchaseOrderDetailsDataProgress} loader={<ComponentSpinner />} >
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <DataTable
                                conditionalRowStyles={[
                                    {
                                        when: row => consumptionPurchaseOrderDetails.filter( o => o.orderId === row.orderId && o.shipmentDate === row.shipmentDate ).some( so => so.isSelected === true ),
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
                                    <PurchaseOrderColoSize orders={consumptionPurchaseOrderDetails} />
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
                                            checked={consumptionPurchaseOrderDetails.some( so => so.isSelected === true )}
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
                                                id={`${row.rowId.toString()}-${row.shipmentDate}`}
                                                name='isSelected'
                                                htmlFor={`${row.rowId.toString()}-${row.shipmentDate}`}
                                                checked={consumptionPurchaseOrderDetails.filter( o => o.orderId === row.orderId && o.shipmentDate === row.shipmentDate ).some( so => so.isSelected === true )}
                                                inline
                                                onChange={( e ) => handleSelectSingleRowByOrderId( e, row.orderId, row.shipmentDate )}
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
                                        name: 'Style',
                                        minWidth: '100px',
                                        selector: 'styleNumber',
                                        sortable: true,
                                        center: true,
                                        cell: row => row?.styleNumber
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
                                    },
                                    {
                                        name: 'Destination',
                                        minWidth: '100px',
                                        selector: 'destination',
                                        sortable: true,
                                        center: true,
                                        cell: row => row?.destination
                                    }

                                ]}
                                data={_.uniqWith(
                                    randersData(),
                                    ( a, b ) => a.orderId === b.orderId &&
                                        a.shipmentDate === b.shipmentDate
                                )}
                                sortIcon={<ChevronDown size={2} />}
                                paginationTotalRows={randersData().length}
                            />
                        </Col>
                    </Row>
                </UILoader>

            </CustomModal>
        </div>
    );
};

export default ConsumptionStylePurchaseOrderModal;
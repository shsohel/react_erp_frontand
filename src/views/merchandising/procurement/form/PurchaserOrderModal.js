import '@custom-styles/merchandising/others/custom-table.scss';
import moment from 'moment';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CustomInput, Input, Table } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { randomIdGenerator } from '../../../../utility/Utils';


const initialOrders = [
    {
        id: randomIdGenerator(),
        orderId: 2,
        styleId: 3,
        styleNumber: 'STYLE024',
        orderNumber: 'PO-6454',
        orderQuantity: 2540,
        shipmentDate: '2021-12-09',
        exporter: 'RDM R',
        isInclude: false
    },
    {
        id: randomIdGenerator(),
        orderId: 6,
        styleId: 5,
        styleNumber: 'STYLE026',
        orderNumber: 'PO-6459',
        orderQuantity: 140,
        shipmentDate: '2021-12-05',
        exporter: 'RDM',
        isInclude: false

    }
];
const PurchaseOrderModal = ( { openModal, setOpenModal, setPurchaseOrder } ) => {
    const dispatch = useDispatch();
    const [orders, setOrders] = useState( initialOrders );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [total, setTotal] = useState( 20 );
    const [count, setCount] = useState( Number( Math.ceil( total / rowsPerPage ) ) );
    const { buyerPODetails } = useSelector( ( { budgets } ) => budgets );
    const [filteredOrderData, setFilteredOrderData] = useState( null );

    const handleMainModalToggleClose = ( params ) => {
        setOpenModal( !openModal );
    };
    const handleModalSubmit = () => {
        const filteredOrders = orders.filter( order => order.isInclude === true );
        const orderIds = filteredOrders.map( s => s.orderId ).toString();
        const styleIds = filteredOrders.map( s => s.styleId ).toString();
        setOpenModal( !openModal );
        // dispatch( getBudgetDetails( orderIds, styleIds ) );
        setFilteredOrderData( null );
        setPurchaseOrder( filteredOrders );
    };
    const handlePagination = page => {
        setCurrentPage( page.selected + 1 );
    };

    const handleOnChange = ( e, id ) => {
        const { value, name, checked } = e.target;
        const updatedData = orders.map( order => {
            if ( id === order.id ) {
                order[name] = checked;
            }
            return order;
        } );
        setOrders( updatedData );
        //  dispatch( bindPODetails( updatedData ) );
    };

    const handleFilterByStyleNo = ( query ) => {
        if ( query.length ) {
            const filteredData = buyerPODetails.filter( order => order.styleNumber.toLowerCase().includes( query.toLowerCase() ) );
            setFilteredOrderData( filteredData );
        } else {
            setFilteredOrderData( null );
        }
    };

    console.log( filteredOrderData );
    const afterFilterOrder = filteredOrderData ? filteredOrderData : buyerPODetails;

    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-lg'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModalToggleClose={handleMainModalToggleClose}
                handleMainModelSubmit={handleModalSubmit}
                title="Buyer Purchase Orders"
            >
                <div className='custom-table'>
                    <Table responsive bordered>
                        <thead className='text-center'>
                            <tr>
                                <th>#</th>
                                <th>Style</th>
                                <th>PO</th>
                                <th>Order Qty</th>
                                <th>Shipment Data</th>
                                <th>Exporter</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='text-center'>
                                </td>
                                <td className='text-center'>
                                    <Input onChange={( e ) => { handleFilterByStyleNo( e.target.value ); }} type="text" bsSize="sm" />
                                </td>
                                <td className='text-center'>
                                    <Input type="text" bsSize="sm" />
                                </td>
                                <td className='text-center'>
                                    <Input type="text" bsSize="sm" />
                                </td>
                                <td className='text-center'>
                                    <Input type="text" bsSize="sm" />
                                </td>
                                <td className='text-center'>
                                    <Input type="text" bsSize="sm" />
                                </td>
                            </tr>
                            {
                                orders?.map( order => (
                                    <tr key={order.id}>
                                        <td className='text-center'>
                                            <CustomInput
                                                type='checkbox'
                                                className='custom-control-Primary p-0'
                                                id={order.id}
                                                name='isInclude'
                                                htmlFor={`${order.id}`}
                                                checked={order.isInclude}
                                                inline
                                                onChange={( e ) => { handleOnChange( e, order.id ); }}
                                            />
                                        </td>
                                        <td className='text-center'>
                                            {order.styleNumber}
                                        </td>
                                        <td className='text-center'>
                                            {order.orderNumber}
                                        </td>
                                        <td className='text-center'>
                                            {order.orderQuantity}
                                        </td>
                                        <td className='text-center'>
                                            {moment( order?.shipmentDate ).format( 'DD-MM-YYYY' )}
                                        </td>
                                        <td className='text-center'>
                                            {order.exporter}
                                        </td>
                                    </tr>
                                ) )
                            }

                        </tbody>

                    </Table>

                </div>
            </CustomModal>
        </div>
    );
};
export default PurchaseOrderModal;
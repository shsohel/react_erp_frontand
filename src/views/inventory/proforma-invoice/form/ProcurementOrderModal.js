import { useState } from 'react';
import { Briefcase, Mail } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Nav, NavItem, NavLink, Row } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { randomIdGenerator } from '../../../../utility/Utils';
import { bindSelectedProcurementItems, getProcurementItemsByOrdersId } from '../store/actions';
import ProcurementItems from './ProcurementItems';
import ProcurementOrders from './ProcurementOrders';

const ProcurementOrderModal = ( { openModal, setOpenModal } ) => {
    const dispatch = useDispatch();
    const { supplierOrder, selectedProcurementItems, selectedSupplierOrders, procurementItems } = useSelector( ( { pis } ) => pis );


    const [active, setActive] = useState( '1' );

    const handleTabControl = tab => {
        console.log( tab );
        if ( active !== tab ) {
            setActive( tab );

        }
        if ( tab === "2" ) {
            const orderIds = supplierOrder.filter( order => order.isSelected === true ).map( order => order.id );
            //   console.log( 'supplierOrder', JSON.stringify( orderIds, null, 2 ) );

            dispatch( getProcurementItemsByOrdersId( orderIds ) );
        }
    };

    const handleModalSubmit = () => {
        const selectItems = procurementItems.filter( order => order.isSelected === true );

        const totallyNewItems = selectItems.filter( item => !selectedProcurementItems.some( s => s.itemId === item.itemId && s.supplierOrderId === item.supplierOrderId ) );

        const newItemSelected = totallyNewItems.map( i => ( {
            ...i,
            detailId: null,
            rowId: randomIdGenerator(),
            orderQty: i.quantity,
            quantity: i.quantityRemaining,
            uom: i.orderUom,
            amount: 0,
            remarks: '',
            isFieldError: false,
            selected: false
        } ) );

        const finalSelectedItem = [...selectedProcurementItems, ...newItemSelected];

        dispatch( bindSelectedProcurementItems( finalSelectedItem ) );

        setOpenModal( !openModal );

    };

    const isSupplierOrderSelected = supplierOrder.some( p => p.isSelected === true );
    const isSelectItems = procurementItems.some( order => order.isSelected === true );

    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
    };
    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog modal-xl'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModalToggleClose={handleMainModalToggleClose}
                handleMainModelSubmit={handleModalSubmit}
                title="Procurement Order and Item"
                isDisabledBtn={!( isSupplierOrderSelected === true && isSelectItems === true )}
                extraButton={true}
                buttonComponents={<>
                    <Button
                        id="nextId"
                        hidden={active === '2'}
                        disabled={!isSupplierOrderSelected}
                        size="sm"
                        color="primary"
                        onClick={() => {
                            handleTabControl( '2' );
                        }}
                    >
                        Next
                    </Button>
                    <Button
                        hidden={active === '1'}
                        id="previousId"
                        size="sm"
                        color="primary"
                        onClick={() => {
                            handleTabControl( '1' );
                        }}
                    >
                        Previous
                    </Button>
                </>
                }

            >
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    active={active === '1'}
                                    onClick={() => {
                                        handleTabControl( '1' );
                                    }}
                                >
                                    <Mail size={15} /> Purchase Order & Style

                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    disabled={!isSupplierOrderSelected}

                                    active={active === '2'}
                                    onClick={() => {
                                        handleTabControl( '2' );
                                    }}
                                >
                                    <Briefcase size={15} /> Item Group
                                </NavLink>
                            </NavItem>

                        </Nav>
                    </Col>

                </Row>
                {
                    active === '1' ? <Row>
                        <Col>
                            <ProcurementOrders />
                        </Col>
                    </Row> : active === '2' && <Row>
                        <Col>
                            <ProcurementItems />
                        </Col>
                    </Row>
                }
            </CustomModal>
        </div>
    );
};

export default ProcurementOrderModal;
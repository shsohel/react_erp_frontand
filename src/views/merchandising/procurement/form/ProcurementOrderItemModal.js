import classnames from 'classnames';
import moment from 'moment';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Briefcase, ChevronDown, Mail } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select, { components } from 'react-select';
import { Button, Col, CustomInput, Input, Nav, NavItem, NavLink, Row } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import TableFilterInsideRow from '../../../../utility/custom/TableFilterInsideRow';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { bindBudgetBuyerPoOnChange, getBudgetBuyerPO, getBudgetItems, getBuyerBudgetsDropdown } from '../../budget/store/actions';
import { bindProcurementBasicInfo, bindSelectedItemsForProcurement, itemDetailsWithMinOrder } from '../store/actions';
import CostingGroupTypeForm from './CostingGroupTypeForm';


const CustomOption = props => {
    const { children, data } = props;
    return (
        < components.Option {...props} >
            {`${children} ( ${data.styleNumbers})`}
        </ components.Option>
    );
};

const ProcurementOrderItemModal = ( { openModal, setOpenModal } ) => {
    const dispatch = useDispatch();
    const { buyerBudgetsDropdown } = useSelector( ( { budgets } ) => budgets );
    const { selectedProcurementSelectedItems, procurementBasicInfo } = useSelector( ( { procurements } ) => procurements );
    const { buyerBudgerPurchaseOrder, buyerBudgetItemDetails } = useSelector( ( { budgets } ) => budgets );

    const [active, setActive] = useState( '1' );
    const [allRowSelected, setAllRowSelected] = useState( false );

    const [filterObj, setFilterObj] = useState( {
        styleNumber: '',
        orderNo: '',
        orderQuantity: '',
        shipmentDate: '',
        destination: ''
    } );


    const handleItemGroupSearchBtn = () => {
        const selectedOrderAndStyle = buyerBudgerPurchaseOrder.filter( orderStyle => orderStyle.isSelected );
        const budgetIds = procurementBasicInfo.budget.map( budget => budget.value );
        const orderIds = selectedOrderAndStyle.map( order => order.orderId );
        const styleIds = selectedOrderAndStyle.map( style => style.styleId );
        dispatch( getBudgetItems( procurementBasicInfo?.itemGroupType?.value, budgetIds, orderIds, styleIds ) );
    };

    const handleTabControl = tab => {
        if ( active !== tab ) {
            setActive( tab );
            if ( tab === "2" ) {
                handleItemGroupSearchBtn();
            } else {
                dispatch( getBudgetItems( null ) );
            }
        }
    };

    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
    };


    const handleModalSubmit = () => {
        //Select Items
        const selectedItems = buyerBudgetItemDetails.map( i => i.items.filter( ii => ii.isSelected ) ).flat();
        //If SelectedItem Already Selected (Edit and New Page)

        const totallyNewItems = selectedItems.filter( i => !selectedProcurementSelectedItems.some( s => s.itemSubGroupId === i.itemSubGroupId && s.itemGroupId === i.itemGroupId && s.itemId === i.itemId && s.budgetId === i.budgetId ) );

        //Modified New Selected Item
        const newItemSelected = totallyNewItems.map( i => ( {
            ...i,
            id: null,
            rowId: randomIdGenerator(),
            bomUomRelativeFactor: i.bomUomRelativeFactor,
            orderUomRelativeFactor: i.bomUomRelativeFactor,
            uoms: [],
            orderUom: { value: i.bomUom, label: i.bomUom },
            baseBomRate: i.bomRatePerUnit / i.bomUomRelativeFactor,
            baseOrderRate: i.bomRatePerUnit / i.bomUomRelativeFactor,

            orderQuantity: i.bomQuantity - i.totalOrderQuantity,
            minCountableOrderQuantity: i.bomQuantity - i.totalOrderQuantity,
            balanceToRaised: i.bomQuantity - i.totalOrderQuantity,
            orderRate: i.bomRatePerUnit,
            minOrderQuantity: 0,
            amount: 0,
            remarks: '',
            selected: false
        } ) );

        //Updated Total Item Details
        const finalSelectedItem = [...selectedProcurementSelectedItems, ...newItemSelected];

        ///Global Action for Updated Total Item Details
        dispatch( bindSelectedItemsForProcurement( finalSelectedItem ) );

        ///Global Action for Update Min Order Qty after change Items
        dispatch( itemDetailsWithMinOrder( finalSelectedItem ) );

        ///Pop up Closing Action
        setOpenModal( !openModal );

    };
    const handleBudgetDropdownOnFocus = () => {
        dispatch( getBuyerBudgetsDropdown( procurementBasicInfo?.buyer?.value ) );
    };
    const handleBasicInfoDropdownChange = ( data, e ) => {
        const { name } = e;
        console.log( data );
        const updatedObj = {
            ...procurementBasicInfo,
            [name]: data
        };
        dispatch( bindProcurementBasicInfo( updatedObj ) );
        dispatch( getBudgetBuyerPO( null ) );

    };
    const handlePurchaseOrderAndStyleSearch = () => {
        const budgetIds = procurementBasicInfo.budget.map( budget => budget.value );
        dispatch( getBudgetBuyerPO( budgetIds, null, null ) );
    };


    const handleAllRowSelect = ( e, fieldId ) => {
        const { name, checked } = e.target;
        setAllRowSelected( checked );
        const updatedData = buyerBudgerPurchaseOrder.map( so => ( { ...so, isSelected: checked } ) );
        dispatch( bindBudgetBuyerPoOnChange( updatedData ) );

    };

    const handleSelectSingleRow = ( e, fieldId ) => {
        const { name, checked } = e.target;
        const updatedData = buyerBudgerPurchaseOrder.map( so => {
            if ( so.fieldId === fieldId ) {
                so[name] = checked;
            }
            return so;
        } );
        dispatch( bindBudgetBuyerPoOnChange( updatedData ) );


        const isAllRowSelected = buyerBudgerPurchaseOrder.some( so => !so.isSelected === true );
        setAllRowSelected( !isAllRowSelected );

    };

    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : value
        } );
    };

    const randersData = () => {
        let filtered = [];
        if ( filterObj.styleNumber.length
            || filterObj.orderNo.length
            || filterObj.orderQuantity.length
            || filterObj.shipmentDate.length
            || filterObj.destination.length
        ) {
            filtered = buyerBudgerPurchaseOrder?.filter(
                wh => wh.styleNumber?.toLowerCase().includes( filterObj.styleNumber?.toLowerCase() ) &&
                    wh.orderNumber?.toLowerCase().includes( filterObj.orderNo?.toLowerCase() ) &&
                    wh.destination?.toLowerCase().includes( filterObj.destination?.toLowerCase() ) &&
                    wh.shipmentDate.includes( filterObj.shipmentDate ) &&
                    wh.orderQuantity.toString().includes( filterObj.orderQuantity )
            );
        } else {
            filtered = buyerBudgerPurchaseOrder;
        }
        return filtered;
    };

    const allItems = buyerBudgetItemDetails.map( i => i.items.filter( ii => ii.isSelected ) ).flat();
    const selectedPurchaseOrder = buyerBudgerPurchaseOrder.some( p => p.isSelected === true );
    const selectedItems = allItems.some( item => item.isSelected === true );

    const filterArray = [
        {
            id: 'name',
            name: '',
            width: '50px'
        },
        {
            id: 'styleNumberId',
            name: <Input
                id="styleNumberId"
                name="styleNumber"
                type="text"
                bsSize="sm"
                placeholder="Style No"
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '150px'
        },
        {
            id: "orderNoId",
            name: <Input
                id="orderNoId"
                name="orderNo"
                type="text"
                bsSize="sm"
                placeholder="Search Order No"
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '150px'

        },
        {
            id: "orderQuantityId",
            name: <Input
                id="orderQuantityId"
                name="orderQuantity"
                type="text"
                bsSize="sm"
                placeholder="Search Order Qty"
                onChange={e => { handleFilter( e ); }} />,
            minWidth: '150px'

        },
        {
            id: "shipmentDate",
            name: <Input
                bsSize="sm"
                type="date"
                className="rounded-0"
                value={filterObj.shipmentDate}
                name="shipmentDate"
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '150px'

        },
        {
            id: "destination",
            name: <Input
                bsSize="sm"
                type="text"
                className="rounded-0"
                name="destination"
                value={filterObj.destination}
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '150px'

        }
    ];


    return <div>
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog modal-lg'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModalToggleClose={handleMainModalToggleClose}
                handleMainModelSubmit={handleModalSubmit}
                title="Buyer Purchase Orders"
                isDisabledBtn={!( selectedPurchaseOrder === true && selectedItems === true )}
                extraButton={true}
                buttonComponents={<>
                    <Button
                        id="nextId"
                        hidden={active === '2'}
                        disabled={!selectedPurchaseOrder}
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
                <div className='custom-table'>
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
                                        disabled={!selectedPurchaseOrder}

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
                            <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                                <Select
                                    id='budgetId'
                                    isMulti
                                    name="budget"
                                    isSearchable
                                    placeholder="Select Budget"
                                    menuPosition="fixed"
                                    menuPlacement="auto"
                                    isClearable
                                    theme={selectThemeColors}

                                    components={{
                                        Option: CustomOption
                                    }}

                                    options={buyerBudgetsDropdown}
                                    classNamePrefix='dropdown'
                                    className={classnames( 'erp-dropdown-select' )}
                                    value={procurementBasicInfo?.budget}
                                    onFocus={() => { handleBudgetDropdownOnFocus(); }}
                                    onChange={( data, e ) => {
                                        handleBasicInfoDropdownChange( data, e );
                                    }}
                                />
                            </Col>
                            <Col xs={12} sm={12} md={2} lg={2} xl={2} className='d-flex justify-content-end'>
                                <div >
                                    <Button
                                        onClick={() => { handlePurchaseOrderAndStyleSearch(); }}
                                        size="sm"
                                    >
                                        Search
                                    </Button>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} >
                                <TableFilterInsideRow rowId="procurementModalId" tableId="pro-custom-dt" filterArray={filterArray} />

                                <DataTable

                                    noHeader
                                    dense={true}
                                    defaultSortAsc
                                    pagination
                                    paginationRowsPerPageOptions={[5, 10, 20, 25]}
                                    persistTableHead
                                    className='react-custom-dataTable-other mt-1 pro-custom-dt'
                                    columns={[
                                        {

                                            name: <CustomInput
                                                type='checkbox'
                                                className='custom-control-Primary p-0 '
                                                id="isSelectedId"
                                                name='isSelectedAll'
                                                htmlFor="isSelectedId"
                                                checked={allRowSelected}
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
                                                    id={row.fieldId.toString()}
                                                    name='isSelected'
                                                    htmlFor={row.fieldId.toString()}
                                                    checked={row.isSelected}
                                                    inline
                                                    onChange={( e ) => handleSelectSingleRow( e, row.fieldId )}
                                                />
                                            )

                                        },
                                        {
                                            name: 'Style No',
                                            minWidth: '150px',
                                            selector: 'styleNumber',
                                            sortable: true,
                                            center: true,
                                            cell: row => row?.styleNumber
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
                                            name: 'Order Quantity',
                                            minWidth: '150px',
                                            selector: 'orderQuantity',
                                            sortable: true,
                                            center: true,
                                            cell: row => row?.orderQuantity
                                        },
                                        {
                                            name: 'Shipment Date',
                                            minWidth: '150px',
                                            selector: 'orderQuantity',
                                            sortable: true,
                                            center: true,
                                            cell: row => moment( row?.shipmentDate ).format( "DD/MM/YYYY" )
                                        },
                                        {
                                            name: 'Destination',
                                            minWidth: '150px',
                                            selector: 'destination',
                                            sortable: true,
                                            center: true,
                                            cell: row => row?.destination ?? ''
                                        }

                                    ]}
                                    data={randersData()}
                                    sortIcon={<ChevronDown size={2} />}
                                    paginationTotalRows={randersData().length}
                                />
                            </Col>
                        </Row> : active === '2' && <CostingGroupTypeForm />
                    }
                </div>
            </CustomModal>
        </div >
    </div >;
};

export default ProcurementOrderItemModal;

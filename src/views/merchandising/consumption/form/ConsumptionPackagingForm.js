import '@custom-styles/merchandising/form/consumption-pack-form.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { MinusSquare, MoreHorizontal } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { confirmObj } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';
import { getDropDownPackItemGroupsByGroupName } from '../../../inventory/item-group/store/actions';
import { getBuyersStyles, getDropDownBuyers } from '../../buyer/store/actions';
import { addPackConsumption, bindConsumptionBasicInfo, cleanAllConsumptionState, getConsumptionPackOrderDetails } from '../store/actions';
import ConsumptionPackagingAccessories from './ConsumptionPackagingAccessories';
import ConsumptionPackOrderModal from './ConsumptionPackOrderModal';
const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'costingList',
        name: 'List',
        link: "/consumptions",
        isActive: false
    },
    {
        id: 'newConsumption',
        name: 'Consumption Packaging',
        link: "",
        isActive: true
    }
];

const ConsumptionPackagingForm = () => {
    const dispatch = useDispatch();
    const { replace, push } = useHistory();
    const state = JSON.parse( localStorage.getItem( 'buyerAndStyle' ) );
    const { consumptionBasicInfo, consumptionPackagingAccessories } = useSelector( ( { consumptions } ) => consumptions );
    const { dropDownBuyers, buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );
    const [openPackOrderModal, setOpenPackOrderModal] = useState( false );


    useEffect( () => {
        //  dispatch( getDefaultUOMDropdownByUnitId( defaultUnitId ) );
        dispatch( getDropDownPackItemGroupsByGroupName( "Packaging%20and%20Labeling" ) );
    }, [] );

    const handleBuyerDataBind = () => {
        const updateObj = {
            ...consumptionBasicInfo,
            buyer: state.buyer,
            style: state?.style
        };

        dispatch( bindConsumptionBasicInfo( updateObj ) );
    };

    useEffect( () => {
        handleBuyerDataBind();
    }, [] );

    const handleBuyerDropdownOnFocus = () => {
        dispatch( getDropDownBuyers() );
    };

    const handleBuyerStyleDropdownOnFocus = ( buyerId ) => {
        console.log( buyerId );
        dispatch( getBuyersStyles( buyerId ) );
    };

    const handleStylePurchaseOrderModal = () => {
        setOpenPackOrderModal( !openPackOrderModal );
        dispatch( getConsumptionPackOrderDetails( consumptionBasicInfo?.buyer?.value, consumptionBasicInfo.style?.value ) );
    };

    const handleDeleteConsumptionPODetails = ( rowId ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                const updatedData = consumptionBasicInfo.packOrderDetails.filter( o => o.rowId !== rowId );
                const updateObj = {
                    ...consumptionBasicInfo,
                    ['packOrderDetails']: updatedData
                };
                dispatch( bindConsumptionBasicInfo( updateObj ) );
            }
        } );

    };

    const handleConsumptionInputOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...consumptionBasicInfo,
            [name]: value
        };
        dispatch( bindConsumptionBasicInfo( updatedObj ) );
    };


    const handleDropdownOnChange = ( data, event ) => {
        const { name } = event;
        console.log( name );
        if ( name === 'buyer' ) {
            const updatedObj = {
                ...consumptionBasicInfo,
                buyerId: data?.value ?? '',
                buyerName: data?.label ?? '',
                buyer: data,
                style: null,
                styleId: '',
                styleNumber: ''
            };
            dispatch( bindConsumptionBasicInfo( updatedObj ) );
            const obj = {
                ...state,
                buyer: data

            };
            localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );

        }
        if ( name === "style" ) {

            const updateObj = {
                ...consumptionBasicInfo,
                style: data,
                styleId: data.value ?? '',
                styleNumber: data.label ?? '',
                costing: null,
                costingId: '',
                costingNumber: '',
                isConsumptionNew: false

            };
            dispatch( bindConsumptionBasicInfo( updateObj ) );

            const obj = {
                ...state,
                style: data,
                styleDescription: data?.description ?? '',
                styleCategory: data?.styleCategory ?? '',
                isSetStyle: data?.isSetStyle

            };
            localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );
            //
        }
    };
    const onSubmit = () => {
        const obj =
        {
            consumptionNumber: "string",
            styleOrderDetails: [
                {
                    id: 0,
                    orderId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    orderNumber: "string",
                    styleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    styleNumber: "string",
                    setStyleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    setStyleNumber: "string",
                    styleCostingId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    styleCostingNumber: "string",
                    shipmentDate: "2022-09-05T08:51:28.175Z",
                    destination: "string",
                    isRestrictedToChange: true
                }
            ],
            packagingAccessoriesDetails: [
                {
                    id: 0,
                    orderId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    orderNumber: "string",
                    itemGroupId: 0,
                    itemGroup: "string",
                    itemSubGroupId: 0,
                    itemSubGroup: "string",
                    itemDescription: "string",
                    itemDescriptionTemplate: "string",
                    consumptionQuantity: 0,
                    consumptionUom: "string",
                    consumptionUomRelativeFactor: 0,
                    wastagePercent: 0,
                    orderUOM: "string",
                    orderUomRelativeFactor: 0,
                    currencyCode: "string",
                    ratePerUnit: 0,
                    purchaseType: "string",
                    isApproved: true,
                    remarks: "string",
                    status: "string"
                }
            ]
        };
        const packagingAccessoriesDetails = consumptionPackagingAccessories.map( pack => pack.details.map( detail => ( {
            id: 0,
            orderId: detail.orderId,
            orderNumber: detail.orderNumber,
            itemGroupId: detail.itemGroup?.value,
            itemGroup: detail.itemGroup?.label,
            itemSubGroupId: detail.itemSubGroup?.value,
            itemSubGroup: detail.itemSubGroup?.label,
            itemDescription: detail.itemDescriptionValue?.label.trim(),
            itemDescriptionTemplate: detail.itemDescriptionTemplate,
            consumptionQuantity: detail.consumptionQuantity,
            consumptionUom: detail.consumptionUom?.label,
            consumptionUomRelativeFactor: detail.consumptionUomRelativeFactor,
            wastagePercent: detail.wastagePercent,
            orderUOM: detail.orderUom?.label,
            orderUomRelativeFactor: detail.orderUomRelativeFactor,
            currencyCode: detail.currencyCode?.label,
            ratePerUnit: detail.ratePerUnit,
            purchaseType: detail?.purchaseType?.label,
            isApproved: detail.isApproved,
            remarks: "string",
            status: "string"
        } ) ) ).flat();


        const submitObj = {
            buyerId: consumptionBasicInfo.buyer?.value,
            buyerName: consumptionBasicInfo?.buyer?.label,
            styleId: consumptionBasicInfo.style?.value,
            styleNumber: consumptionBasicInfo.style?.label,
            consumptionNumber: consumptionBasicInfo.consumptionNumber,
            styleOrderDetails: consumptionBasicInfo?.packOrderDetails.map( order => ( {
                orderId: order.orderId,
                orderNumber: order.orderNumber,
                styleId: order.styleId,
                styleNumber: order.styleNumber,
                shipmentDate: order.shipmentDate,
                destination: order.destination
            } ) ),
            packagingAccessoriesDetails
        };
        console.log( JSON.stringify( submitObj, null, 2 ) );
        dispatch( addPackConsumption( submitObj, push ) );
    };
    const handleCancel = () => {
        replace( '/consumptions' );
        dispatch( cleanAllConsumptionState() );
    };
    return (
        <div>
            <Card className="mt-3">
                <CardBody>
                    <ActionMenu breadcrumb={breadcrumb} title='Consumption Packaging' >
                        <NavItem className="mr-1" >
                            <NavLink
                                tag={Button}
                                //  disabled={!isConsumptionDataLoaded}
                                size="sm"
                                color="primary"
                                onClick={() => { onSubmit(); }}
                            >Save</NavLink>
                        </NavItem>
                        <NavItem className="mr-1" >
                            <NavLink
                                tag={Button}
                                size="sm"
                                color="secondary"
                                onClick={() => { handleCancel(); }}
                            >
                                Cancel
                            </NavLink>
                        </NavItem>
                        {/* <OperationProgress progress={!isConsumptionDataLoaded} /> */}

                    </ActionMenu>
                    <Row>
                        <Col>
                            <div className='divider divider-left '>
                                <div className='divider-text text-secondary font-weight-bolder'>Consumption Basic Info</div>
                            </div>
                            <div className="border rounded rounded-3 p-1">
                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label' for='buyerId'> Consumption No</Label>
                                                    <Label className='custom-form-colons'> : </Label>
                                                    <div className='custom-form-group'>
                                                        <Input
                                                            bsSize="sm"
                                                            name="consumptionNumber"
                                                            value={consumptionBasicInfo?.consumptionNumber}
                                                            onChange={( e ) => {
                                                                handleConsumptionInputOnChange( e );
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label' for='buyerId'> Buyer</Label>
                                                    <Label className='custom-form-colons'> : </Label>
                                                    <div className='custom-form-group'>


                                                        <Select
                                                            id='buyerId'
                                                            name="buyer"
                                                            isSearchable
                                                            //  isLoading={!dropDownBuyers.length}
                                                            menuPosition="fixed"
                                                            // isHidden={!consumptionBasicInfo?.isClone}
                                                            isClearable
                                                            theme={selectThemeColors}
                                                            options={dropDownBuyers}
                                                            classNamePrefix='dropdown'
                                                            // innerRef={register( { required: true } )}
                                                            className='erp-dropdown-select'
                                                            value={consumptionBasicInfo?.buyer}
                                                            onChange={( data, e ) => {
                                                                handleDropdownOnChange( data, e );
                                                            }}
                                                            onFocus={() => handleBuyerDropdownOnFocus()}
                                                        />


                                                    </div>
                                                </div>
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label' for='styleId'> Style</Label>
                                                    <Label className='custom-form-colons'> : </Label>
                                                    <div className='custom-form-input-group'>
                                                        <div className='custom-input-group-prepend inside-btn'>

                                                            <Select
                                                                placeholder="Select"
                                                                id='styleId'
                                                                name="style"
                                                                isSearchable
                                                                //  isHidden={consumptionBasicInfo?.isClone}

                                                                isLoading={!buyerStylesDropdown.length}
                                                                isClearable
                                                                theme={selectThemeColors}
                                                                options={buyerStylesDropdown.filter( style => !style.isSetStyle )}
                                                                classNamePrefix='dropdown'
                                                                className="erp-dropdown-select"
                                                                value={consumptionBasicInfo?.style}
                                                                onChange={( data, e ) => {
                                                                    handleDropdownOnChange( data, e );
                                                                }}
                                                                onFocus={() => { handleBuyerStyleDropdownOnFocus( consumptionBasicInfo?.buyer?.value ); }}
                                                            />


                                                        </div>
                                                        <div className='custom-input-group-append inside-btn'>
                                                            <Button.Ripple
                                                                className='btn-icon'
                                                                outline
                                                                size="sm"
                                                                color='secondary'
                                                                onClick={() => { handleStylePurchaseOrderModal(); }}
                                                            >
                                                                <MoreHorizontal size={16} />
                                                            </Button.Ripple>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={8} xl={8} >
                                                <div className=' border rounded pt-0 pr-1 pb-1 pl-1 costing-custom-table' >
                                                    <Label className="font-weight-bolder"> Purchase Order :</Label>
                                                    <Table responsive bordered size="sm">
                                                        <thead className='text-center'>
                                                            <tr>
                                                                <th className='sl'>SL</th>
                                                                <th>PO NO</th>
                                                                <th>Shipt. Date</th>
                                                                <th>Destination</th>
                                                                <th className='action'>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className='text-center' >
                                                            {/* {
                                                                consumptionBasicInfo?.styleOrderDetails?.length > 0 ? (
                                                                    _.uniqBy( consumptionBasicInfo?.styleOrderDetails, 'orderId' )?.map( ( order, index ) => (
                                                                        <tr key={order?.rowId}>
                                                                            <td className='sl'>{index + 1}</td>
                                                                            <td>{order.orderNumber}</td>
                                                                            <td>{moment( order.shipmentDate ).format( "DD-MM-YYYY" )}</td>
                                                                        </tr>
                                                                    ) )
                                                                ) : <tr >
                                                                    <td className='sl'>0</td>
                                                                    <td>NA</td>
                                                                    <td>NA</td>
                                                                </tr>
                                                            } */}
                                                            {
                                                                consumptionBasicInfo?.packOrderDetails?.length > 0 ? (
                                                                    consumptionBasicInfo?.packOrderDetails?.map( ( order, index ) => (
                                                                        <tr key={order?.rowId}>
                                                                            <td className='sl'>{index + 1}</td>
                                                                            <td>{order.orderNumber}</td>
                                                                            <td>{moment( order.shipmentDate ).format( "DD-MM-YYYY" )}</td>
                                                                            <td>{order.destination}</td>
                                                                            <td className='action'>
                                                                                <Button.Ripple id="deleteCostingPO"
                                                                                    tag={Label}
                                                                                    onClick={() => { handleDeleteConsumptionPODetails( order.rowId ); }}
                                                                                    className='btn-icon p-0 '
                                                                                    color='flat-success'
                                                                                >
                                                                                    <MinusSquare size={18} id="deleteCostingPO" color="red" />
                                                                                </Button.Ripple>
                                                                            </td>
                                                                        </tr>
                                                                    ) )
                                                                ) : <tr >
                                                                    <td colSpan={5}>There are no records to display</td>
                                                                </tr>
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Col>

                                        </Row>

                                    </Col>
                                </Row>

                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className='divider divider-left '>
                                <div className='divider-text text-secondary font-weight-bolder'>Consumption Pack Details</div>
                            </div>
                            {/* <div hidden={isConsumptionDataLoaded}>
                                <CustomPreLoader />
                            </div> */}
                            <div className="border rounded rounded-3 p-1">
                                <Row>
                                    <Col>
                                        <ConsumptionPackagingAccessories />
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                    </Row>
                </CardBody>
            </Card>
            {
                openPackOrderModal && (
                    <ConsumptionPackOrderModal
                        openModal={openPackOrderModal}
                        setOpenModal={setOpenPackOrderModal}
                    />
                )
            }
        </div>
    );
};

export default ConsumptionPackagingForm;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Card, CardBody, Col, CustomInput, FormFeedback, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { selectThemeColors } from '../../../../utility/Utils';
import { getBuyersStyles, getDropDownBuyers } from '../../buyer/store/actions';
import { getCostingDropdownByOrderIdAndStyleId, getStylesDropdownByPOId } from '../../costing/store/action';
import { getPurchaseOrdersDropdownByBuyerId } from '../../purchase-order/store/actions';
import { consumptionBasicInfoModel } from '../model';
import { bindConsumptionBasicInfo, getConsumptionStylePurchaseOrderDetails, getCostingInfoForConsumption, getCostingInfoForSetConsumption } from '../store/actions';
import ConsumptionDetails from './ConsumptionDetailsForm';
import ConsumptionDetailsForSetStyle from './ConsumptionDetailsForSetStyle';


const Consumption = () => {
    const dispatch = useDispatch();
    const { consumptionBasicInfo } = useSelector( ( { consumptions } ) => consumptions );
    const { purchaseOrderStylesDropdown, costingDropdownByOrderIdAndStyleId } = useSelector( ( { costings } ) => costings );
    const { buyerPurchaseOrderDropdown } = useSelector( ( { purchaseOrders } ) => purchaseOrders );
    const { dropDownBuyers, buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );

    useEffect( () => {
        dispatch( getDropDownBuyers() );
    }, [] );

    const handleLinkToConsumptionAddForm = () => {
        const updateObj = {
            ...consumptionBasicInfo,
            isConsumptionNew: !consumptionBasicInfo.isConsumptionNew
        };
        dispatch( bindConsumptionBasicInfo( updateObj ) );
        if ( consumptionBasicInfo?.isSetStyle ) {
            dispatch( getCostingInfoForSetConsumption( consumptionBasicInfo?.orderId, consumptionBasicInfo?.style ) );
        } else {
            dispatch( getCostingInfoForConsumption( consumptionBasicInfo?.orderId, consumptionBasicInfo?.styleId, consumptionBasicInfo?.costingId ) );

        }
    };


    const handleBuyerDropdown = ( data ) => {
        if ( data ) {
            const updateObj = {
                ...consumptionBasicInfo,
                buyerId: data?.value,
                buyerName: data?.label,
                buyer: data,
                order: null,
                orderId: '',
                orderNumber: '',
                style: null,
                styleId: '',
                styleNumber: '',
                costing: null,
                costingId: '',
                costingNumber: '',
                isConsumptionNew: false
            };
            dispatch( bindConsumptionBasicInfo( updateObj ) );
            dispatch( getBuyersStyles( data?.value ) );

            //  dispatch( getPurchaseOrdersDropdownByBuyerId( data?.value ) );

        } else {
            dispatch( bindConsumptionBasicInfo( consumptionBasicInfoModel ) );
            dispatch( getPurchaseOrdersDropdownByBuyerId( null ) );
        }

    };

    const handleBuyerPODrowDown = ( data ) => {
        if ( data ) {
            const updateObj = {
                ...consumptionBasicInfo,
                order: data,
                orderId: data.value,
                orderNumber: data.label,
                style: null,
                styleId: '',
                styleNumber: '',
                costing: null,
                costingId: '',
                costingNumber: '',
                isConsumptionNew: false

            };
            dispatch( bindConsumptionBasicInfo( updateObj ) );
            dispatch( getStylesDropdownByPOId( data?.value ) );

        } else {
            const updateObj = {
                ...consumptionBasicInfo,
                order: null,
                orderId: '',
                orderNumber: '',
                style: null,
                styleId: '',
                styleNumber: '',
                costing: null,
                costingId: '',
                costingNumber: '',
                isConsumptionNew: false

            };
            dispatch( bindConsumptionBasicInfo( updateObj ) );
            dispatch( getStylesDropdownByPOId( null ) );

        }

    };
    const handleCostingDropDown = ( data ) => {
        if ( data ) {
            const updateObj = {
                ...consumptionBasicInfo,
                costing: data,
                costingId: data.value,
                costingNumber: data.label,
                isConsumptionNew: false

            };
            dispatch( bindConsumptionBasicInfo( updateObj ) );
        } else {
            const updateObj = {
                ...consumptionBasicInfo,
                costing: null,
                costingId: '',
                costingNumber: ''
            };
            dispatch( bindConsumptionBasicInfo( updateObj ) );
        }

    };

    const handlePOStyleDropDown = ( data ) => {
        if ( data ) {
            const updateObj = {
                ...consumptionBasicInfo,
                style: data,
                styleId: data.value,
                styleNumber: data.label,
                costing: null,
                costingId: '',
                costingNumber: '',
                isConsumptionNew: false

            };
            dispatch( bindConsumptionBasicInfo( updateObj ) );
            dispatch( getConsumptionStylePurchaseOrderDetails( consumptionBasicInfo?.buyer?.value, data?.value ) );
        } else {
            const updateObj = {
                ...consumptionBasicInfo,
                style: null,
                styleId: '',
                styleNumber: '',
                isConsumptionNew: false,
                costing: null,
                costingId: '',
                costingNumber: ''

            };
            dispatch( bindConsumptionBasicInfo( updateObj ) );
            // dispatch( getConsumptionStylePurchaseOrderDetails( consumptionBasicInfo?.buyer?.value, data?.value ) );
        }
    };

    const handleSetStyleLoaded = ( condition ) => {
        const updateObj = {
            ...consumptionBasicInfo,
            isSetStyle: condition,
            style: null,
            styleId: '',
            styleNumber: '',
            costing: null,
            costingId: '',
            costingNumber: '',
            isConsumptionNew: false
        };
        dispatch( bindConsumptionBasicInfo( updateObj ) );
    };

    const handleCostingOnFocus = ( orderId, styleId ) => {
        dispatch( getCostingDropdownByOrderIdAndStyleId( orderId, styleId ) );
    };


    const handleClear = () => {
        dispatch( bindConsumptionBasicInfo( consumptionBasicInfoModel ) );
    };


    return (
        <div>
            <Card className={` ${consumptionBasicInfo.isConsumptionNew && 'mt-3'}`}>
                <CardBody className="pt-0">
                    <Row >
                        <Col>
                            <div className='divider divider-left pt-0'>
                                <div className='divider-text text-secondary font-weight-bolder'>Control </div>
                            </div>
                            <div className="border rounded rounded-3 p-1">
                                <Row>
                                    <FormGroup tag={Col} xs={12} sm={12} md={6} lg={2} xl={2}>
                                        <Select
                                            placeholder="Select Buyer"
                                            id='BuyerId'
                                            isSearchable
                                            isDisabled={consumptionBasicInfo.isConsumptionNew}
                                            isClearable
                                            theme={selectThemeColors}
                                            options={dropDownBuyers}
                                            classNamePrefix='dropdown'
                                            className="erp-dropdown-select"
                                            value={consumptionBasicInfo?.buyer}
                                            onChange={data => {
                                                handleBuyerDropdown( data );
                                            }}
                                        >
                                        </Select>

                                    </FormGroup>

                                    {/* <FormGroup tag={Col} xs={12} sm={12} md={6} lg={consumptionBasicInfo.isSetStyle ? 5 : 3} xl={consumptionBasicInfo.isSetStyle ? 5 : 3}> */}
                                    <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3}>
                                        <InputGroup className="d-flex">
                                            <Select
                                                placeholder="Select PO Styles"
                                                isMulti={consumptionBasicInfo.isSetStyle}
                                                id='styleId'
                                                isSearchable
                                                isClearable
                                                theme={selectThemeColors}
                                                options={buyerStylesDropdown.filter( style => style.isSetStyle === consumptionBasicInfo.isSetStyle )}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select w-75"
                                                value={consumptionBasicInfo?.style}
                                                onChange={data => {
                                                    handlePOStyleDropDown( data );
                                                }}
                                            />
                                            <InputGroupAddon className="w-25" style={{ zIndex: 0 }} addonType="append">
                                                <Button.Ripple tag={InputGroupText} id="isSetStyle" onClick={() => { handleSetStyleLoaded( !consumptionBasicInfo.isSetStyle ); }} className='w-100 pt-0 pb-0' color='flat-primary'>
                                                    <span className="d-flex align-items-center">
                                                        <CustomInput
                                                            className="custom-checkbox-lg"
                                                            label={<span> For Set </span>}
                                                            id='isSetStyle'
                                                            name='isSetStyle'
                                                            size={2}
                                                            type='checkbox'
                                                            checked={consumptionBasicInfo.isSetStyle}
                                                            onChange={( e ) => { e.preventDefault(); }}
                                                        />
                                                    </span>
                                                </Button.Ripple>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <FormFeedback>Style is required!</FormFeedback>
                                    </FormGroup>
                                    <FormGroup tag={Col} xs={12} sm={12} md={6} lg={1} xl={1}>
                                        <Button.Ripple tag={InputGroupText} id="isSetStyle" onClick={() => { handleSetStyleLoaded( !consumptionBasicInfo.isSetStyle ); }} className='w-100 ' color='flat-primary'>
                                            <span className="d-flex align-items-center">
                                                <CustomInput
                                                    className="custom-checkbox-lg"
                                                    label={<span> For Set </span>}
                                                    id='isSetStyle'
                                                    name='isSetStyle'
                                                    size={2}
                                                    type='checkbox'
                                                    checked={consumptionBasicInfo.isSetStyle}
                                                    onChange={( e ) => { e.preventDefault(); }}
                                                />
                                            </span>
                                        </Button.Ripple>

                                    </FormGroup>
                                    <FormGroup tag={Col} xs={12} sm={12} md={6} lg={2} xl={2} className={`${consumptionBasicInfo.isSetStyle && 'd-none'}`}>
                                        <Select
                                            placeholder="Select Costing"
                                            id='costingId'
                                            isSearchable
                                            isClearable
                                            theme={selectThemeColors}
                                            options={costingDropdownByOrderIdAndStyleId}
                                            isDisabled={consumptionBasicInfo.isConsumptionNew}
                                            classNamePrefix='dropdown'
                                            className="erp-dropdown-select"
                                            onFocus={( e ) => { handleCostingOnFocus( consumptionBasicInfo?.orderId, consumptionBasicInfo?.styleId ); }}
                                            value={consumptionBasicInfo?.costing}
                                            onChange={data => {
                                                handleCostingDropDown( data );
                                            }}
                                        />
                                        <FormFeedback>Costing is required!</FormFeedback>
                                    </FormGroup>
                                    <Col className="d-flex justify-content-end" xs={12} sm={12} md={12} lg={3} xl={3}>
                                        <div className='d-inline-block'>
                                            <Button.Ripple
                                                onClick={() => { handleLinkToConsumptionAddForm(); }}
                                                className="ml-1"
                                                outline
                                                color="success"
                                                size="sm"
                                                disabled={consumptionBasicInfo.isConsumptionNew}

                                            >Next</Button.Ripple>
                                            <Button.Ripple
                                                onClick={() => { handleClear(); }}
                                                className="ml-1"
                                                outline
                                                color="danger"
                                                size="sm">Clear</Button.Ripple>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                    </Row>
                </CardBody>
            </Card>
            {
                consumptionBasicInfo.isConsumptionNew && (
                    consumptionBasicInfo?.isSetStyle ? <ConsumptionDetailsForSetStyle /> : <ConsumptionDetails />
                )
            }
        </div>
    );
};

export default Consumption;

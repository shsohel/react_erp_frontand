
import '@custom-styles/basic/action-bar-menu.scss';
import '@custom-styles/basic/custom-form.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import '@custom-styles/merchandising/others/po-details-table.scss';
import '@custom-styles/merchandising/select/po-details-select.scss';
import { baseAxios } from "@services";
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { Maximize2, Minimize2, MinusSquare, MoreVertical, PlusSquare, Settings } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import CreatableSelect from 'react-select/creatable';
import { Button, Card, CardBody, Col, Collapse, CustomInput, Form, FormFeedback, FormGroup, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import ResizableTable from '../../../../utility/custom/ResizableTable';
import { defaultUnitId, selectCurrency, selectDestination, selectShipmentMode, selectYear } from '../../../../utility/enums';
import { isObjEmpty, randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getDefaultUOMDropdownByUnitId } from '../../../inventory/unit-sets/store/actions';
import { getCascadeDropDownBuyerAgents } from '../../buyer-agent/store/actions';
import { getBuyersStyles, getDropDownBuyers } from '../../buyer/store/actions';
import { getDropDownSeasons } from '../../season/store/actions';
import { getDropDownSizeGroups } from '../../size-group/store/actions';
import { getOrderDropdownStatus } from '../../status/store/actions';
import { getDropDownSetStyles } from '../../style/set-style/store/actions';
import { getDropDownStyles } from '../../style/single-style/store/actions';
import { addPurchaseOrder, getPOSizeColorQuantitySummaryDetails } from "../store/actions";
import ColorSizeAdditionalFormModal from './ColorSizeAdditionalFormModal';
import SizeColorRation from './SizeColorRation';
import SizeRationNewForm from './SizeRationNewForm';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'poList',
        name: 'List',
        link: "/purchase-order",
        isActive: false
    },
    {
        id: 'purchaseOrder',
        name: 'PO',
        link: "#",
        isActive: true
    }
];

const PurchaseOrderAddForm = () => {
    const { replace, push } = useHistory();

    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState( false );
    const { dropDownBuyers, buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );
    const { lastPurchaseOrderId } = useSelector( ( { purchaseOrders } ) => purchaseOrders );
    const { dropDownBuyerAgents } = useSelector( ( { buyerAgents } ) => buyerAgents );
    const { dropDownSeasons } = useSelector( ( { seasons } ) => seasons );
    const { dropdownOrderStatus } = useSelector( ( { statuses } ) => statuses );
    const [buyer, setBuyer] = useState( null );
    const [buyerAgent, setBuyerAgent] = useState( null );
    const [season, setSeason] = useState( null );
    const [year, setYear] = useState( null );
    const [currency, setCurrency] = useState( null );
    // State For Checking SET ORDER
    const [isItSetOrder, setIsItSetOrder] = useState( false );
    const [isSizeRationOpen, setIsSizeRationOpen] = useState( false );
    const [isColorSizeCombinationOpen, setIsColorSizeCombinationOpen] = useState( false );
    const { defaultUOMDropdown } = useSelector( ( { unitSets } ) => unitSets );

    ///State for Order Details Table
    const [orderDetails, setOrderDetails] = useState( [
        {
            fieldId: randomIdGenerator(),
            rowNo: 1,
            style: null,
            sizeGroupDropdown: [],
            sizeGroups: null,
            destination: null,
            orderQuantity: 0,
            orderUOM: null,
            shipmentMode: null,
            shipmentDate: moment( new Date() ).format( 'yy-MM-DD' ),
            inspectionDate: moment( new Date() ).format( 'yy-MM-DD' ),
            rate: 0,
            amount: 0,
            excessQuantity: 0,
            wastageQuantity: 0,
            // exporter: null,
            ColorSize: null,
            SizeColor: null,
            ColorRation: null,
            status: null,
            colorSizeQuantity: [],
            isOpenCollapsibleRow: false
        }
    ] );
    ///State for Open Collapsible Table
    const [isOpen, setIsOpen] = useState( [
        {
            rowId: orderDetails[0].fieldId,
            yes: false
        }
    ] );

    //For Run Time
    useEffect( () => {
        dispatch( getDropDownBuyers() );
        dispatch( getDropDownSeasons() );
        dispatch( getDropDownStyles() );
        dispatch( getDropDownSizeGroups() );
        dispatch( getDropDownSetStyles() );
        dispatch( getOrderDropdownStatus() );
    }, [] );

    // For Error Handling and Form Submission
    const { register, errors, control, handleSubmit } = useForm();
    const handleUOMOnFocus = ( unitId ) => {
        dispatch( getDefaultUOMDropdownByUnitId( unitId ) );
    };


    //Form Submit
    const onSubmit = ( values ) => {
        // console.log( values );
        if ( isObjEmpty( errors ) ) {
            const odArray = orderDetails.map( od => ( {
                rowNo: od.rowNo,
                styleId: od.style?.value,
                styleNo: od.style?.label,
                sizeGroupId: isItSetOrder ? null : od.sizeGroups?.value,
                sizeGroupName: isItSetOrder ? null : od.sizeGroups?.label,
                orderUOM: od.orderUOM?.label,
                orderQuantity: od.orderQuantity,
                shipmentMode: od.shipmentMode?.label,
                shipmentDate: od.shipmentDate,
                inspectionDate: od.inspectionDate,
                ratePerUnit: od.rate,
                orderUOMRelativeFactor: od.orderUOMRelativeFactor,
                excessQuantityPercentage: od.excessQuantity,
                wastageQuantityPercentage: od.wastageQuantity,
                adjustedQuantity: ( Number( od.orderQuantity ) - ( ( Number( od.wastageQuantity ) / 100 ) * Number( od.orderQuantity ) ) + ( ( Number( od.excessQuantity ) / 100 ) * Number( od.orderQuantity ) ) ),
                deliveryDestination: od.destination?.label,
                status: od.status?.label,
                orderQuantitySizeAndColor: od.colorSizeQuantity
            } ) );
            const obj = {
                buyerId: buyer?.value,
                buyerName: buyer?.label,
                agentId: buyerAgent ? buyerAgent?.value : null,
                agentName: buyerAgent ? buyerAgent?.label : null,
                orderNumber: values.buyerOrderNo,
                orderDate: values.purchaseOrderDate,
                season: season?.label,
                year: year?.value,
                currencyCode: currency?.label,
                remarks: values.remarks,
                isSetOrder: isItSetOrder,
                totalOrderQuantity: Number( values.totalOrderQuantity ),
                orderDetails: odArray
            };
            console.log( JSON.stringify( obj, null, 2 ) );
            dispatch( addPurchaseOrder( obj, push ) );
        }
    };

    const handleBuyerDropdown = ( data ) => {
        if ( data ) {
            setBuyer( data );
            dispatch( getCascadeDropDownBuyerAgents( data.value ) );
            dispatch( getBuyersStyles( data.value ) );
            setBuyerAgent( null );
        } else {
            setBuyer( null );
            dispatch( getCascadeDropDownBuyerAgents( null ) );
            setBuyerAgent( null );
        }
    };


    ///For Details a Row Add
    const handleAddOrderDetailsRow = ( totalIndexNo ) => {
        console.log( totalIndexNo );
        const newRow = {
            fieldId: randomIdGenerator(),
            rowNo: totalIndexNo + 1,
            style: null,
            sizeGroupDropdown: [],
            sizeGroups: null,
            destination: null,
            orderQuantity: 0,
            orderUOM: null,
            shipmentMode: null,
            shipmentDate: moment( new Date() ).format( 'yy-MM-DD' ),
            inspectionDate: moment( new Date() ).format( 'yy-MM-DD' ),
            rate: 0,
            orderUOMRelativeFactor: 0,
            amount: 0,
            excessQuantity: 0,
            wastageQuantity: 0,
            // exporter: null,
            ColorSize: null,
            scss: false,
            colorRation: null,
            status: null,
            colorSizeQuantity: [],
            isOpenCollapsibleRow: false

        };
        const newIsOpenRow = {
            rowId: newRow.fieldId,
            yes: false
        };
        setIsOpen( [...isOpen, newIsOpenRow] );
        setOrderDetails( [...orderDetails, newRow] );
    };
    ///For Details a Row Remove
    const handleRemoveOrderDetailsRow = ( fieldId ) => {
        const updatedData = [...orderDetails];
        updatedData.splice(
            updatedData.findIndex( x => x.fieldId === fieldId ),
            1
        );
        setOrderDetails( updatedData );
    };

    const handleCollapsibleTableOpen = ( fieldId ) => {
        const updatedIsOpen = orderDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.isOpenCollapsibleRow = !i.isOpenCollapsibleRow;
            }
            return i;
        } );
        setOrderDetails( updatedIsOpen );
    };

    const handleStyleDropdown = async ( newValue, fieldId ) => {
        await baseAxios.get( `${merchandisingApi.style.get_style_sizes}/${newValue.value}/sizeGroups` )
            .then( response => {
                const updatedData = orderDetails.map( i => {
                    if ( fieldId === i.fieldId ) {
                        i.style = newValue;
                        i.sizeGroupDropdown = response?.data?.map( sg => ( {
                            value: sg.id,
                            label: sg.name
                        } ) );
                        i.sizeGroups = null;
                    }
                    return i;
                } );
                setOrderDetails( updatedData );

            } );
    };
    const handleSizeGroupsDropdown = ( newValue, fieldId ) => {
        const updatedData = orderDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.sizeGroups = newValue;
            }
            return i;
        } );
        setOrderDetails( updatedData );
    };

    const handleSetStyleDropdown = ( newValue, fieldId ) => {
        // console.log( newValue );

    };

    const handleDestinationDropdown = ( newValue, fieldId ) => {
        const updatedData = orderDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.destination = newValue;
            }
            return i;
        } );
        setOrderDetails( updatedData );
    };
    const handleUnitDropdown = ( newValue, fieldId ) => {
        const updatedData = orderDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.orderUOM = newValue;
                i.orderUOMRelativeFactor = newValue?.relativeFactor;
            }
            return i;
        } );
        setOrderDetails( updatedData );
    };
    const handleShipmentModeDropdown = ( newValue, fieldId ) => {
        const updatedData = orderDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.shipmentMode = newValue;
            }
            return i;
        } );
        setOrderDetails( updatedData );
    };
    // const handleExporterDropdown = ( newValue, fieldId ) => {
    //     const updatedData = orderDetails.map( i => {
    //         if ( fieldId === i.fieldId ) {
    //             i.exporter = newValue;
    //         }
    //         return i;
    //     } );
    //     setOrderDetails( updatedData );
    // };
    const handleActionStatusDropdown = ( newValue, fieldId ) => {
        const updatedData = orderDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.status = newValue;
            }
            return i;
        } );
        setOrderDetails( updatedData );
    };

    const handleOnChangeForOrderDetails = ( e, fieldId ) => {
        const { name, value, type } = e.target;
        // console.log( name );
        const updateData = orderDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                if ( name === "orderQuantity" || name === "rate" ) {
                    i["amount"] = name === "orderQuantity" ? Number( value ) * Number( i.rate ) : Number( i.orderQuantity ) * Number( value );
                    i[name] = ( type === "number" ) ? Number( value ) : ( type === "date" ) ? moment( value ).format( 'yy-MM-DD' ) : value;
                } else {
                    i[name] = type === "number" ? Number( value ) : ( type === "date" ) ? moment( value ).format( 'yy-MM-DD' ) : value;
                }
            }
            return i;
        } );
        setOrderDetails( updateData );
    };


    const handleOpenStyleDetailsForm = () => {
        setOpenModal( !openModal );
    };

    const handleOpenColorSizeCombination = () => {
        setIsColorSizeCombinationOpen( !isColorSizeCombinationOpen );
    };


    const [colorSizeRationIds, setColorSizeRationIds] = useState( null );
    const [sizeQuantityDetails, setSizeQuantityDetails] = useState( [] );
    const [sizeRationIds, setSizeRationIds] = useState( null );

    const handleOpenSizeRation = ( styleId, colorSizeQuantity, rowId ) => {
        setSizeRationIds(
            {
                styleId,
                rowId
            }
        );
        setIsSizeRationOpen( !isSizeRationOpen );
        if ( colorSizeQuantity.length ) {
            setSizeQuantityDetails( colorSizeQuantity.map( cs => ( { ...cs, fieldId: randomIdGenerator() } ) ) );
        } else {
            baseAxios.get( `${merchandisingApi.setStyle.root}/${styleId}/styleDetails/sizesAndColors` )
                .then( response => {
                    const styleDetails = response.data;
                    const sizeColorDetailsArray = styleDetails.map( rb => ( {
                        fieldId: randomIdGenerator(),
                        styleId: rb.styleId,
                        styleNo: rb.styleNo,
                        sizeId: rb.sizeId,
                        size: rb.size,
                        colorId: rb.colorId,
                        color: rb.color,
                        quantity: 0,
                        ratio: 0,
                        isInRatio: false
                    } ) );
                    setSizeQuantityDetails( sizeColorDetailsArray );
                } );
        }
    };
    const [isColorSizeRationOpen, setIsColorSizeRationOpen] = useState( false );

    const handleOpenColorSizeRation = ( styleId, sizeGroupId, rowId, colorSizeQuantity ) => {
        const obj = {
            styleId,
            sizeGroupId,
            rowId,
            colorSizeQuantity
        };
        setColorSizeRationIds( obj );
        setIsColorSizeRationOpen( !isColorSizeRationOpen );
    };

    const [openColorSizeAdditionalModal, setOpenColorSizeAdditionalModal] = useState( false );
    const handleColorSizeAdditionalModal = ( rowId, colorSizeQuantity, color ) => {
        const obj = {
            rowId,
            colorSizeQuantity,
            color
        };
        setColorSizeRationIds( obj );
        setOpenColorSizeAdditionalModal( !openColorSizeAdditionalModal );
        dispatch( getPOSizeColorQuantitySummaryDetails( colorSizeQuantity.map( cs => ( { ...cs, fieldId: randomIdGenerator() } ) ) ) );
    };

    const handleColorSizeBindingOnRow = ( rowId, quantity ) => {
        const updateData = orderDetails.map( details => {
            if ( rowId === details.fieldId ) {
                details['colorSizeQuantity'] = quantity;
            }
            return details;
        } );
        console.log( updateData );
        setOrderDetails( updateData );
        setSizeRationIds( null );
    };
    const handleCancel = () => {
        replace( '/purchase-order' );
    };

    const handleAddNewPackaging = () => {
        const obj = {
            poId: lastPurchaseOrderId,
            buyer
        };
        if ( isItSetOrder ) {
            replace( '/new-set-packaging', { obj } );
        } else {
            replace( '/new-single-packaging', { obj } );
        }
    };

    const sumOfTotalQuantity = () => {
        const total = _.sum( orderDetails.map( i => Number( i.orderQuantity ) ) );
        return total;
    };
    const sumOfTotalAmount = () => {
        const total = _.sum( orderDetails.map( i => Number( i.amount ) ) );
        return total;
    };

    const handleSetStyleCheck = ( e ) => {
        const { checked } = e.target;
        const newRow = {
            fieldId: randomIdGenerator(),
            style: null,
            sizeGroupDropdown: [],
            sizeGroups: null,
            destination: null,
            orderQuantity: 0,
            orderUOM: null,
            shipmentMode: null,
            shipmentDate: moment( new Date() ).format( 'yy-MM-DD' ),
            inspectionDate: moment( new Date() ).format( 'yy-MM-DD' ),
            rate: 0,
            orderUOMRelativeFactor: 0,
            amount: 0,
            excessQuantity: 0,
            wastageQuantity: 0,
            // exporter: null,
            ColorSize: null,
            scss: false,
            colorRation: null,
            status: null,
            colorSizeQuantity: []

        };
        const newIsOpenRow = {
            rowId: newRow.fieldId,
            yes: false
        };

        const confirmObjForOrder = {
            title: 'Are you sure?',
            text: "If you do , then your Order Details will be reset!",
            confirmButtonText: 'Yes !',
            cancelButtonText: 'No'
        };
        if ( orderDetails.some( details => details.style ) ) {
            confirmDialog( confirmObjForOrder ).then( e => {
                if ( e.isConfirmed ) {
                    setIsItSetOrder( checked );
                    setIsOpen( [newIsOpenRow] );
                    setOrderDetails( [newRow] );
                } else {
                    console.log( 'Nothing' );
                }
            } );
        } else {
            setIsItSetOrder( checked );
        }
    };


    return (
        <div >
            <Card className="mt-3">
                <CardBody>
                    <Form onSubmit={handleSubmit( onSubmit )}>
                        <ActionMenu breadcrumb={breadcrumb} title='New Purchase Order' >
                            <NavItem className="mr-1" >
                                <NavLink
                                    tag={Button}
                                    size="sm"
                                    color="primary"
                                    type="submit"
                                // onClick={() => { onSubmit(); }}
                                >Save</NavLink>
                            </NavItem>
                            <NavItem className="mr-1" >
                                <NavLink
                                    tag={Button}
                                    size="sm"
                                    color="secondary"
                                    onClick={() => { handleCancel(); }}                    >
                                    Cancel
                                </NavLink>
                            </NavItem>
                        </ActionMenu>

                        {/* <div className='divider divider-left '>
                            <div className='divider-text text-secondary font-weight-bolder'>Master Info</div>
                        </div> */}

                        <Row >
                            <Col>
                                <div className='divider divider-left mt-0'>
                                    <div className='divider-text text-secondary font-weight-bolder '>Master Info</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='shipmentModeId'> Buyer PO No</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <Input
                                                        id="buyerOrderNoId"
                                                        type="text"
                                                        name="buyerOrderNo"
                                                        bsSize="sm"
                                                        placeholder="Buyer Purchase Order No"
                                                        innerRef={register( { required: true } )}
                                                        className={classnames( { 'is-invalid': errors['buyerOrderNo'] } )}
                                                    />
                                                    {errors && errors.buyerOrderNo && <FormFeedback>Buyer PO No is required!</FormFeedback>}
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='shipmentModeId'> Purchase Order Date</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <Input
                                                        id="purchaseOrderDateId"
                                                        type="date"
                                                        name="purchaseOrderDate"
                                                        bsSize="sm"
                                                        placeholder="Purchase Order Date"
                                                        defaultValue={moment( new Date() ).format( 'yy-MM-DD' )}
                                                        innerRef={register( { required: true } )}
                                                        className={classnames( { 'is-invalid': errors['purchaseOrderDate'] } )}
                                                    />
                                                    {errors && errors.purchaseOrderDate && <FormFeedback>Purchase Order Date is required!</FormFeedback>}
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='shipmentModeId'> Description</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <Input
                                                        id="descriptionId"
                                                        type="text"
                                                        name="description"
                                                        bsSize="sm"
                                                        placeholder="Description"
                                                        innerRef={register( { required: false } )}
                                                        className={classnames( { 'is-invalid': errors['description'] } )}
                                                    />
                                                    {errors && errors.purchaseOrderDate && <FormFeedback>Purchase Order Date is required!</FormFeedback>}
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='shipmentModeId'> Season</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <CreatableSelect
                                                        id='seasonId'
                                                        name="season"
                                                        isSearchable
                                                        menuPosition={'fixed'}
                                                        isClearable
                                                        theme={selectThemeColors}
                                                        options={dropDownSeasons}
                                                        classNamePrefix='dropdown'
                                                        className="erp-dropdown-select"
                                                        innerRef={register( { required: true } )}
                                                        // className={classnames( 'react-select', { 'is-invalid': season === null } )}
                                                        value={season}
                                                        onChange={data => {
                                                            setSeason( data );
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='shipmentModeId'> Buyer</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <CreatableSelect
                                                        id='buyerId'
                                                        name="buyer"
                                                        isSearchable
                                                        menuPosition={'fixed'}
                                                        control={control}
                                                        isClearable
                                                        theme={selectThemeColors}
                                                        options={dropDownBuyers}
                                                        classNamePrefix='dropdown'
                                                        className="erp-dropdown-select" innerRef={register( { required: true } )}
                                                        value={buyer}
                                                        onChange={data => {
                                                            handleBuyerDropdown( data );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='shipmentModeId'> Buyer Agent</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <CreatableSelect
                                                        id='buyerAgentId'
                                                        name="buyerAgent"
                                                        isSearchable
                                                        menuPosition={'fixed'}
                                                        control={control}
                                                        isClearable
                                                        theme={selectThemeColors}
                                                        options={dropDownBuyerAgents}
                                                        classNamePrefix='dropdown'
                                                        className="erp-dropdown-select"
                                                        innerRef={register( { required: true } )}
                                                        // className={classnames( 'react-select', { 'is-invalid': buyer !== null } )}
                                                        value={buyerAgent}
                                                        onChange={data => {
                                                            setBuyerAgent( data );
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='shipmentModeId'> Year</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <CreatableSelect
                                                        id='yearId'
                                                        name="year"
                                                        isSearchable
                                                        menuPosition={'fixed'}
                                                        isClearable
                                                        theme={selectThemeColors}
                                                        options={selectYear}
                                                        classNamePrefix='dropdown'
                                                        className="erp-dropdown-select"
                                                        innerRef={register( { required: true } )}
                                                        // className={classnames( 'react-select', { 'is-invalid': year === null } )}
                                                        value={year}
                                                        onChange={data => {
                                                            setYear( data );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='shipmentModeId'> Currency</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <CreatableSelect
                                                        id='currencyId'
                                                        name="currency"
                                                        isSearchable
                                                        menuPosition={'fixed'}
                                                        isClearable
                                                        theme={selectThemeColors}
                                                        options={selectCurrency}
                                                        classNamePrefix='dropdown'
                                                        className="erp-dropdown-select"
                                                        innerRef={register( { required: true } )}
                                                        value={currency}
                                                        onChange={data => {
                                                            setCurrency( data );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='shipmentModeId'> Total Order Quantity</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <Input
                                                        id="totalOrderQuantityId"
                                                        type="number"
                                                        name="totalOrderQuantity"
                                                        bsSize="sm"
                                                        value={sumOfTotalQuantity()}
                                                        onChange={e => e.preventDefault()}
                                                        innerRef={register( { required: false } )}
                                                        className={classnames( 'text-right' )}
                                                    />
                                                </div>
                                            </div>

                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='shipmentModeId'> Total Amount</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <Input
                                                        id="totalAmountId"
                                                        type="number"
                                                        name="totalAmount"
                                                        bsSize="sm"
                                                        value={sumOfTotalAmount()}
                                                        onChange={e => e.preventDefault()}
                                                        innerRef={register( { required: false } )}
                                                        className={classnames( 'text-right' )}
                                                    />
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='shipmentModeId'> Is Set Order?</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <div className="po-set-switch">
                                                        <CustomInput
                                                            // classNamePrefix="switch"
                                                            type='switch'
                                                            id='set-order-Id'
                                                            label='Yes'
                                                            checked={isItSetOrder}
                                                            onChange={e => { handleSetStyleCheck( e ); }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} >
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label remarks' for='shipmentModeId'> Remarks</Label>
                                                <Label className='custom-form-colons remarks'> : </Label>
                                                <div className='custom-form-group remarks'>
                                                    <Input
                                                        style={{ height: '36px' }}
                                                        id="remarksId"
                                                        type="textarea"
                                                        name="remarks"
                                                        bsSize="sm"
                                                        placeholder="Remarks"
                                                        innerRef={register( { required: false } )}
                                                        className={classnames( { 'is-invalid': errors['remarks'] } )}
                                                    />
                                                    {errors && errors.remarks && <FormFeedback>Remarks No is required!</FormFeedback>}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                            </Col>
                        </Row>
                        <Row >
                            <Col>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Order Details</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row>
                                        <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12} >
                                            <div className="po-details-table">
                                                <ResizableTable bordered={true} mainClass="purchaseTable" tableId="purchaseTableId" className="po-details-table" size="sm" responsive={true} >
                                                    <thead className='thead-light table-bordered' >
                                                        <tr className='text-center'>
                                                            <th style={{ minWidth: '12px' }} ><strong>SL</strong></th>
                                                            <th style={{ minWidth: '12px' }} ><strong>#</strong></th>
                                                            <th style={{ minWidth: '109px' }}><strong>Style</strong></th>
                                                            <th style={{ minWidth: '109px' }}><strong>Size Range</strong></th>
                                                            <th style={{ minWidth: '109px' }} ><strong>Destination</strong></th>
                                                            <th style={{ minWidth: '109px' }} ><strong>Shipment Mode</strong></th>
                                                            <th ><strong>Shipment Date</strong></th>
                                                            <th ><strong>Inspection Date</strong></th>
                                                            <th ><strong>Order Qty</strong></th>
                                                            <th style={{ minWidth: '109px' }} className={isItSetOrder ? 'd-none' : 'd'}><strong>Order UOM</strong></th>
                                                            <th ><strong>Rate</strong></th>
                                                            <th ><strong>Amount</strong></th>
                                                            <th ><strong>Excess (%)</strong></th>
                                                            <th ><strong>Wastage (%)</strong></th>
                                                            {/* <th className=' text-center'><strong>Exporter</strong></th> */}
                                                            {/* <th style={{ minWidth: '5px' }}  ><strong>CS</strong></th>
                                                <th style={{ minWidth: '5px' }}  ><strong>SCSS</strong></th> */}
                                                            <th style={{ minWidth: '5px' }}  ><strong>RC</strong></th>
                                                            <th style={{ minWidth: '109px' }}><strong>Status</strong></th>
                                                            <th  ><strong>Action</strong></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-center">
                                                        {
                                                            orderDetails.map( i => (
                                                                <Fragment key={i.fieldId + i.fieldId} >
                                                                    <tr key={i.fieldId}>
                                                                        <td style={{ minWidth: '12px' }} >
                                                                            {i.rowNo}
                                                                        </td>
                                                                        <td style={{ minWidth: '12px' }} >
                                                                            <Button.Ripple for="collapseId" tag={Label} onClick={() => { handleCollapsibleTableOpen( i.fieldId ); }} className='btn-icon p-0' color='flat-primary' >
                                                                                <Maximize2 className={( isOpen.find( ( item => item.rowId === i.fieldId ) )?.yes ) ? 'd-none' : 'd'} id="collapseId" size={15} color="#7367f0" />
                                                                                <Minimize2 className={( ( isOpen.find( ( item => item.rowId === i.fieldId ) )?.yes ) ) ? 'd' : 'd-none'} id="collapseId" size={15} color="#28c76f" />
                                                                            </Button.Ripple>

                                                                        </td>
                                                                        <td className='text-left'>
                                                                            <CreatableSelect
                                                                                id='styleId'
                                                                                name="style"
                                                                                isSearchable
                                                                                menuPosition={'fixed'}
                                                                                theme={selectThemeColors}
                                                                                options={isItSetOrder ? buyerStylesDropdown.filter( bStyle => bStyle.isSetStyle ) : buyerStylesDropdown.filter( bStyle => !bStyle.isSetStyle )}
                                                                                classNamePrefix='dropdown'
                                                                                className="erp-dropdown-select"
                                                                                innerRef={register( { required: true } )}
                                                                                value={i.style}
                                                                                onChange={data => {
                                                                                    handleStyleDropdown( data, i.fieldId );
                                                                                }}
                                                                            />
                                                                        </td>
                                                                        <td className="text-left">
                                                                            <CreatableSelect
                                                                                id='sizeGroupId'
                                                                                name="sizeGroup"
                                                                                isSearchable
                                                                                menuPosition={'fixed'}
                                                                                theme={selectThemeColors}
                                                                                options={i.sizeGroupDropdown}
                                                                                classNamePrefix='dropdown'
                                                                                className="erp-dropdown-select"
                                                                                innerRef={register( { required: true } )}
                                                                                value={i.sizeGroups}
                                                                                onChange={data => {
                                                                                    handleSizeGroupsDropdown( data, i.fieldId );
                                                                                }}
                                                                            />
                                                                        </td>
                                                                        <td className='text-left'>
                                                                            <CreatableSelect
                                                                                id='destinationId'
                                                                                name="destination"
                                                                                isSearchable
                                                                                menuPosition={'fixed'}
                                                                                theme={selectThemeColors}
                                                                                options={selectDestination}
                                                                                classNamePrefix='dropdown'
                                                                                className="erp-dropdown-select"
                                                                                innerRef={register( { required: true } )}

                                                                                value={i.destination}
                                                                                onChange={data => {
                                                                                    handleDestinationDropdown( data, i.fieldId );
                                                                                }}
                                                                            />
                                                                        </td>

                                                                        <td className='text-left'>
                                                                            <CreatableSelect
                                                                                id='shipmentModeId'
                                                                                name="shipmentMode"
                                                                                isSearchable
                                                                                menuPosition={'fixed'}
                                                                                theme={selectThemeColors}
                                                                                options={selectShipmentMode}
                                                                                classNamePrefix='dropdown'
                                                                                className="erp-dropdown-select"
                                                                                innerRef={register( { required: true } )}
                                                                                value={i.shipmentMode}
                                                                                onChange={data => {
                                                                                    handleShipmentModeDropdown( data, i.fieldId );
                                                                                }}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Input
                                                                                id="shipmentDateId"
                                                                                bsSize="sm"
                                                                                className="text-right custom-date"
                                                                                name="shipmentDate"
                                                                                type="date"
                                                                                value={i.shipmentDate}
                                                                                onChange={e => { handleOnChangeForOrderDetails( e, i.fieldId ); }}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Input
                                                                                id="inspectionDateId"
                                                                                bsSize="sm"
                                                                                className="text-right custom-date"
                                                                                type="date"
                                                                                name="inspectionDate"
                                                                                value={i.inspectionDate}
                                                                                onChange={e => { handleOnChangeForOrderDetails( e, i.fieldId ); }}

                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Input
                                                                                id="orderQuantityId"
                                                                                bsSize="sm"
                                                                                className="text-right"
                                                                                type="number"
                                                                                name="orderQuantity"
                                                                                placeholder="0.00"
                                                                                value={i.orderQuantity}
                                                                                onChange={e => { handleOnChangeForOrderDetails( e, i.fieldId ); }}
                                                                                onFocus={e => { e.target.select(); }}
                                                                            />
                                                                        </td>
                                                                        <td className={isItSetOrder ? 'd-none' : 'd text-left'}>
                                                                            <CreatableSelect
                                                                                id='unitsId'
                                                                                name="unit"
                                                                                isSearchable
                                                                                menuPosition={'fixed'}
                                                                                theme={selectThemeColors}
                                                                                options={defaultUOMDropdown}
                                                                                classNamePrefix='dropdown'
                                                                                className="erp-dropdown-select"
                                                                                innerRef={register( { required: true } )}
                                                                                onFocus={() => { handleUOMOnFocus( defaultUnitId ); }}
                                                                                value={i.orderUOM}
                                                                                onChange={data => {
                                                                                    handleUnitDropdown( data, i.fieldId );
                                                                                }}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Input
                                                                                id="rateId"
                                                                                bsSize="sm"
                                                                                className="text-right"
                                                                                type="number"
                                                                                name="rate"
                                                                                value={i.rate}
                                                                                placeholder="0.00"
                                                                                onFocus={e => { e.target.select(); }}
                                                                                onChange={e => { handleOnChangeForOrderDetails( e, i.fieldId ); }}

                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Input
                                                                                id="amountId"
                                                                                bsSize="sm"
                                                                                readOnly
                                                                                className="text-right"
                                                                                type="number"
                                                                                name="amount"
                                                                                value={i.amount}
                                                                                placeholder="0.00"
                                                                                onFocus={e => { e.target.select(); }}
                                                                                onChange={e => { handleOnChangeForOrderDetails( e, i.fieldId ); }}

                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Input
                                                                                id="excessQuantityId"
                                                                                bsSize="sm"
                                                                                className="text-right"
                                                                                type="number"
                                                                                name="excessQuantity"
                                                                                placeholder="0.00"
                                                                                value={i.excessQuantity}
                                                                                onFocus={e => { e.target.select(); }}
                                                                                onChange={e => { handleOnChangeForOrderDetails( e, i.fieldId ); }}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <Input
                                                                                id="wastageQuantityId"
                                                                                bsSize="sm"
                                                                                className="text-right"
                                                                                type="number"
                                                                                name="wastageQuantity"
                                                                                placeholder="0.00"
                                                                                value={i.wastageQuantity}
                                                                                onFocus={e => { e.target.select(); }}
                                                                                onChange={e => { handleOnChangeForOrderDetails( e, i.fieldId ); }}
                                                                            />
                                                                        </td>

                                                                        <td style={{ minWidth: '5px' }} >
                                                                            {
                                                                                isItSetOrder ? <Button.Ripple
                                                                                    id="rcIds" tag={Label}
                                                                                    className='btn-icon p-0'
                                                                                    color='flat-danger'
                                                                                    onClick={() => { handleOpenSizeRation( i.style?.value, i.colorSizeQuantity, i.fieldId ); }}
                                                                                >
                                                                                    <MoreVertical size={18} id="rcIds" color="purple" />
                                                                                </Button.Ripple> : <Button.Ripple
                                                                                    id="rcIds" tag={Label}
                                                                                    className='btn-icon p-0'
                                                                                    color='flat-danger'
                                                                                    onClick={() => { handleOpenColorSizeRation( i.style?.value, i?.sizeGroups?.value, i.fieldId, i.colorSizeQuantity ); }}
                                                                                >
                                                                                    <MoreVertical size={18} id="rcIds" color="purple" />
                                                                                </Button.Ripple>
                                                                            }


                                                                        </td>
                                                                        <td className='text-left'>
                                                                            <CreatableSelect
                                                                                id='statusId'
                                                                                name="status"
                                                                                isSearchable
                                                                                menuPosition={'fixed'}
                                                                                theme={selectThemeColors}
                                                                                options={dropdownOrderStatus}
                                                                                classNamePrefix='dropdown'
                                                                                className="erp-dropdown-select"
                                                                                innerRef={register( { required: true } )}
                                                                                value={i.status}
                                                                                onChange={data => {
                                                                                    handleActionStatusDropdown( data, i.fieldId );
                                                                                }}
                                                                            />
                                                                        </td>
                                                                        <td >
                                                                            <span>
                                                                                <Button.Ripple id="deleteFabId" tag={Label} disabled={( orderDetails.length === 1 )} onClick={() => { handleRemoveOrderDetailsRow( i.fieldId ); }} className='btn-icon' color='flat-danger' >
                                                                                    <MinusSquare size={18} id="deleteFabId" color="red" />
                                                                                </Button.Ripple>
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan={7}>
                                                                            <Collapse isOpen={i.isOpenCollapsibleRow}>
                                                                                <Table bordered>
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>Color</th>
                                                                                            <th>Total Qty.</th>
                                                                                            <th>Rate</th>
                                                                                            <th>Total Amount</th>
                                                                                            <th>Adj. Qty.</th>
                                                                                            <th>Action</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {
                                                                                            ( Object.keys( _.groupBy( i?.colorSizeQuantity, 'colorName' ) ).map( ( color, index ) => (
                                                                                                <tr key={index + 1}>
                                                                                                    <td>{color}</td>
                                                                                                    <td>{_.sum( _.groupBy( i?.colorSizeQuantity, 'colorName' )[color]?.map( s => Number( s.quantity ) ) )}</td>
                                                                                                    <td>{i.rate}</td>
                                                                                                    <td>{_.sum( _.groupBy( i?.colorSizeQuantity, 'colorName' )[color]?.map( s => Number( s.quantity * i?.rate ) ) )}</td>
                                                                                                    <td>{( _.sum( _.groupBy( i?.colorSizeQuantity, 'colorName' )[color]?.map( s => Number( s.adjustedQuantity ) ) ) ).toFixed( 4 )}</td>
                                                                                                    <td>
                                                                                                        {/* <Settings
                                                                                                            size={20}
                                                                                                            color={'red'}
                                                                                                            onClick={() => { handleColorSizeAdditionalModal( i.fieldId, i.colorSizeQuantity, color ); }}
                                                                                                        /> */}
                                                                                                        <Button.Ripple id="additionalColorSizeId" tag={Label}
                                                                                                            onClick={() => { handleColorSizeAdditionalModal( i.fieldId, i.colorSizeQuantity, color ); }}
                                                                                                            className='btn-icon p-0'
                                                                                                            color='flat-success'
                                                                                                        >
                                                                                                            <Settings
                                                                                                                size={20}
                                                                                                                id="additionalColorSizeId"
                                                                                                                color="green"
                                                                                                            />
                                                                                                        </Button.Ripple>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            ) ) )
                                                                                        }
                                                                                    </tbody>
                                                                                </Table>
                                                                            </Collapse>

                                                                        </td>
                                                                    </tr>

                                                                </Fragment>
                                                            ) )
                                                        }
                                                    </tbody>
                                                </ResizableTable>
                                            </div>
                                            <Button.Ripple id="addFabId" tag={Label} onClick={() => { handleAddOrderDetailsRow( orderDetails.length ); }} className='btn-icon p-0' color='flat-success' >
                                                <PlusSquare id="addFabId" color="green" />
                                            </Button.Ripple>
                                        </FormGroup>
                                    </Row>
                                </div>
                            </Col>


                        </Row>
                        {/* <Row>
                            <Col className="d-flex flex-row-reverse">
                                <div className='d-inline-block mb-1 mt-1'>
                                    <Button.Ripple type="reset" className="ml-1 " outline color="secondary" size="sm">Reset</Button.Ripple>
                                    <Button.Ripple onClick={() => { handleCancel(); }} className="ml-1 " outline color="danger" size="sm">Cancel</Button.Ripple>
                                    <Button.Ripple type="submit" className="ml-1" outline color="success" size="sm">Submit</Button.Ripple>
                                </div>
                            </Col>
                        </Row> */}
                    </Form>
                </CardBody>
            </Card>
            {/* {
                ( colorSizeRationIds && isItSetOrder ) && <SizeRatio
                    openModal={isSizeRationOpen}
                    setOpenModal={setIsSizeRationOpen}
                    colorSizeRationIds={colorSizeRationIds}
                    setColorSizeRationIds={setColorSizeRationIds}
                    handleColorSizeBindingOnRow={handleColorSizeBindingOnRow}
                />
            } */}
            {
                ( isSizeRationOpen && isItSetOrder ) && <SizeRationNewForm
                    openModal={isSizeRationOpen}
                    setOpenModal={setIsSizeRationOpen}
                    sizeQuantityDetails={sizeQuantityDetails}
                    setSizeQuantityDetails={setSizeQuantityDetails}
                    sizeRationIds={sizeRationIds}
                    handleColorSizeBindingOnRow={handleColorSizeBindingOnRow}
                />
            }
            {
                ( colorSizeRationIds && !isItSetOrder ) && <SizeColorRation
                    openModal={isColorSizeRationOpen}
                    setOpenModal={setIsColorSizeRationOpen}
                    colorSizeRationIds={colorSizeRationIds}
                    setColorSizeRationIds={setColorSizeRationIds}
                    handleColorSizeBindingOnRow={handleColorSizeBindingOnRow}
                />
            }
            {
                openColorSizeAdditionalModal && <ColorSizeAdditionalFormModal
                    openModal={openColorSizeAdditionalModal}
                    setOpenModal={setOpenColorSizeAdditionalModal}
                    colorSizeRationIds={colorSizeRationIds}
                    setColorSizeRationIds={setColorSizeRationIds}
                    handleColorSizeBindingOnRow={handleColorSizeBindingOnRow}
                />
            }

        </div >
    );
};

export default PurchaseOrderAddForm;

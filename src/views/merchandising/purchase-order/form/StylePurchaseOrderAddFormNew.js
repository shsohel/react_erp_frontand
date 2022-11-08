import '@custom-styles/basic/custom-form.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import { baseAxios } from "@services";
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Copy, Edit3, MinusSquare, MoreVertical, PlusSquare } from 'react-feather';
import { useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { Button, Card, CardBody, Col, Input, Label, NavItem, NavLink, Row } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import {
    orderStatus,
    selectDestination,
    selectShipmentMode,
    selectYear
} from '../../../../utility/enums';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getCascadeDropDownBuyerAgents } from '../../buyer-agent/store/actions';
import { getBuyersStyles, getDropDownBuyers } from '../../buyer/store/actions';
import { getCurrencyDropdown } from '../../currency/store/actions';
import { getDropDownSeasons } from '../../season/store/actions';
import { getDropDownSizeGroups } from '../../size-group/store/actions';
import { getDropDownSetStyleSizeGroups } from '../../style/set-style/store/actions';
import { getSingleStyleSizeGroups } from '../../style/single-style/store/actions';
import {
    addStylePurchaseOrder,
    bindStylePurchaseOrder,
    bindStylePurchaseOrderDetails,
    deleteStylePurchaseOrderDetails,
    getStylePurchaseOrderDetails
} from '../store/actions';
import ColorRationForm from './ColorRationForm';
import ExpandableOrderQuantitySizeAndColorForm from './ExpandableOrderQuantitySizeAndColorForm';
import ExpandableSetOrderQuantitySizeAndColorForm from './ExpandableSetOrderQuantitySizeAndColorForm';
import SizeColorRation from './SizeColorRation';
import SizeRationNewForm from './SizeRationNewForm';

const StylePurchaseOrderAddFormNew = () => {
    const { replace, push, goBack } = useHistory();
    const dispatch = useDispatch();
    const state = JSON.parse( localStorage.getItem( 'styleOrder' ) );

    const { dropDownBuyers, buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );
    const {
        stylePurchaserOrder,
        stylePurchaseOrderDetails,
        isPurchaseOrderDataLoading
    } = useSelector( ( { purchaseOrders } ) => purchaseOrders );
    const { dropDownSeasons } = useSelector( ( { seasons } ) => seasons );
    const { singleStyleSizeGroups } = useSelector( ( { styles } ) => styles );
    const { dropdownSetStyleSizeGroups } = useSelector( ( { setStyles } ) => setStyles );
    const { currencyDropdown } = useSelector( ( { currencies } ) => currencies );


    const {
        register,
        errors,
        control,
        handleSubmit
    } = useForm();

    const isValidStatus = stylePurchaserOrder.status === 'Confirmed PO';

    useEffect( () => {
        dispatch( getDropDownSeasons() );
        dispatch( getCurrencyDropdown() );
    }, [] );


    useEffect( () => {
        const updatedObj = {
            ...stylePurchaserOrder,
            isSetStyle: state.isSetStyle,
            isSizeSpecific: state.isSizeSpecific,
            isColorSpecific: state.isColorSpecific,
            buyer: { value: state.buyerId, label: state.buyer },
            style: { value: state.styleId, label: state.styleNo },
            status: state.status
        };


        dispatch( bindStylePurchaseOrder( updatedObj ) );
        dispatch( getStylePurchaseOrderDetails( state.styleId, state.buyerId ) );

    }, [dispatch, state.styleId] );

    const handleSizeGroupOnFocus = () => {
        if ( !state.isSetStyle && !singleStyleSizeGroups.length ) {
            dispatch( getSingleStyleSizeGroups( state.styleId ) );
        } else {
            if ( !dropdownSetStyleSizeGroups.length ) {
                dispatch( getDropDownSetStyleSizeGroups( state.styleId ) );
            }
        }
    };

    ///Buyer Dropdown OnFocus
    const handleBuyerDropdownOnFocus = () => {
        dispatch( getDropDownBuyers() );
    };

    ///OnChange Buyer Dropdown
    const handleBuyerDropdown = ( data ) => {
        if ( data ) {
            const updatedObj = {
                ...stylePurchaserOrder,
                buyer: data
            };
            dispatch( getCascadeDropDownBuyerAgents( data.value ) );
            dispatch( getBuyersStyles( data.value ) );
            dispatch( bindStylePurchaseOrder( updatedObj ) );
        } else {
            dispatch( getCascadeDropDownBuyerAgents( null ) );
            dispatch( getBuyersStyles( null ) );
            dispatch( getStylePurchaseOrderDetails( null, null ) );
            const updatedObj = {
                ...stylePurchaserOrder,
                buyer: null,
                style: null
            };
            dispatch( bindStylePurchaseOrder( updatedObj ) );

        }
    };


    ///OnChange Style Dropdown
    const handleStyleDropdown = ( data ) => {
        console.log( data );
        const updatedObj = {
            ...stylePurchaserOrder,
            style: data,
            isSetStyle: data?.isSetStyle
        };
        dispatch( bindStylePurchaseOrder( updatedObj ) );
        dispatch( getStylePurchaseOrderDetails( data?.value, stylePurchaserOrder?.buyer?.value ) );
        if ( !data?.isSetStyle ) {
            dispatch( getSingleStyleSizeGroups( data?.value ) );
        } else {
            dispatch( getDropDownSizeGroups() );
        }
    };


    ///DropdownOnChange
    const handleDetailsDropdownOChange = ( data, e, rowId ) => {
        console.log( data );
        const { action, name, option } = e;
        console.log( name );
        const updatedRow = stylePurchaseOrderDetails.map( details => {
            if ( details.rowId === rowId ) {
                details[name] = data;
                if ( name === 'sizeGroup' ) {
                    details['orderQuantitySizeAndColor'] = [];
                    details['isDetailQuantityExist'] = false;
                }
            }
            return details;
        } );
        dispatch( bindStylePurchaseOrderDetails( updatedRow ) );
    };


    ///Row Editable
    const handleRowEditable = ( row, index ) => {
        const isAnyEditableStill = stylePurchaseOrderDetails.some( s => s.isEditable === true );
        console.log( isAnyEditableStill );
        const updatedRow = stylePurchaseOrderDetails.map( details => {
            if ( details.rowId === row.rowId ) {
                details['isEditable'] = !details.isEditable;
            }
            return details;
        } );
        dispatch( bindStylePurchaseOrderDetails( updatedRow ) );

        if ( !row.isEditable ) {
            //
            const submittedObj = {
                rowNo: index + 1,
                orderId: row.orderId,
                buyerOrderNumber: row.buyerOrderNumber,
                detailId: row.detailId,
                styleId: row.styleId,
                styleNumber: row.styleNumber,
                buyerId: row.buyerId,
                buyerName: row.buyerName,
                agentId: row.agentId,
                agentName: row.agentName,
                sizeGroupId: row.sizeGroup?.value,
                sizeGroupName: row.sizeGroup?.label,
                orderDate: row.orderDate,
                season: row.season?.label,
                year: row.year?.label,
                currencyCode: row.currency?.label,
                orderUOM: row.orderUOM,
                orderUOMRelativeFactor: row.orderUOMRelativeFactor,
                orderQuantity: row.orderQuantity,
                shipmentMode: row.shipmentMode?.label,
                shipmentDate: row.shipmentDate,
                inspectionDate: row.inspectionDate,
                ratePerUnit: Number( row.ratePerUnit ),
                excessQuantityPercentage: row.excessQuantityPercentage,
                wastageQuantityPercentage: row.wastageQuantityPercentage,
                adjustedQuantity: row.adjustedQuantity,
                deliveryDestination: row.deliveryDestination?.label,
                status: row.status?.label
            };
            // console.log( 'submittedObj', JSON.stringify( submittedObj, null, 2 ) );
        }


    };

    ///Input OnChange
    const handleInputOnChange = ( e, rowId ) => {
        const { name, type, value } = e.target;
        const updatedRow = stylePurchaseOrderDetails.map( details => {
            if ( details.rowId === rowId ) {
                details[name] = type === "number" ? Number( value ) : ( type === "date" ) ? moment( value ).format( 'yy-MM-DD' ) : ( name === "ratePerUnit" || name === "excessQuantityPercentage" || name === "wastageQuantityPercentage" ) ? Number( value ) : value;
            }
            return details;
        } );
        dispatch( bindStylePurchaseOrderDetails( updatedRow ) );
    };

    ///Add New Row
    const handleAddOrderDetailsRow = ( dataIndex ) => {
        const rowObj = {
            rowNo: dataIndex + 1,
            rowId: randomIdGenerator(),
            detailId: 0,
            orderId: null,
            buyerOrderNumber: '',
            orderDate: moment( new Date() ).format( 'yy-MM-DD' ),
            orderUOM: stylePurchaserOrder?.isSetStyle ? "SET" : "PCS",
            orderUOMRelativeFactor: 0,
            orderQuantity: 0,
            buyerId: stylePurchaserOrder?.buyer?.value,
            buyerName: stylePurchaserOrder?.buyer?.label,
            agentId: null,
            agentName: '',
            styleId: stylePurchaserOrder?.style?.value,
            styleNumber: stylePurchaserOrder?.style?.label,
            sizeGroup: null,
            season: null,
            year: null,
            currency: null,
            shipmentMode: null,
            shipmentDate: moment( new Date() ).format( 'yy-MM-DD' ),
            inspectionDate: moment( new Date() ).format( 'yy-MM-DD' ),
            ratePerUnit: 0,
            excessQuantityPercentage: 0,
            wastageQuantityPercentage: 0,
            adjustedQuantity: 0,
            deliveryDestination: null,
            exporter: null,
            status: null,
            orderQuantitySizeAndColor: [],
            isEditable: true,
            isDetailQuantityExist: false,
            isQuantityDetailsOpen: false,
            rowExpanded: false

        };
        dispatch( bindStylePurchaseOrderDetails( [...stylePurchaseOrderDetails, rowObj] ) );
    };
    const handleDuplicateOrderDetailsRow = ( rowId ) => {
        const duplicateRow = stylePurchaseOrderDetails.filter( details => details.rowId === rowId ).map( orderDetails => (
            {
                ...orderDetails,
                rowNo: stylePurchaseOrderDetails.length,
                rowId: randomIdGenerator(),
                orderId: null,
                sizeGroup: null,
                isEditable: true,
                detailId: 0,
                isDetailQuantityExist: false
            }
        ) );

        dispatch( bindStylePurchaseOrderDetails( [...stylePurchaseOrderDetails, ...duplicateRow] ) );

    };
    const handleRemoveOrderDetailsRow = ( rowId, orderId, detailId ) => {
        if ( detailId > 0 ) {
            dispatch( deleteStylePurchaseOrderDetails( orderId, detailId ) );
        } else {
            const updatedData = stylePurchaseOrderDetails.filter( details => details.rowId !== rowId );
            dispatch( bindStylePurchaseOrderDetails( updatedData ) );
        }
        // handlePODetails();
    };
    const [isColorSizeRationOpen, setIsColorSizeRationOpen] = useState( false );

    const [colorSizeRationIds, setColorSizeRationIds] = useState( null );

    const handleOpenColorSizeRation = ( styleId, sizeGroupId, rowId, colorSizeQuantity, orderDetailsId, quantityExit, orderQuantity ) => {

        setIsColorSizeRationOpen( !isColorSizeRationOpen );
        if ( colorSizeQuantity.length ) {
            setColorSizeRationIds(
                {
                    styleId,
                    sizeGroupId,
                    rowId,
                    colorSizeQuantity: colorSizeQuantity.map( cs => ( { ...cs, fieldId: randomIdGenerator() } ) ),
                    orderQuantity
                }

            );
        } else {
            if ( quantityExit ) {
                baseAxios.get( `${merchandisingApi.purchaseOrder.root}/orderDetails/${orderDetailsId}/quantityOnSizeAndColor` )
                    .then(
                        response => {
                            console.log( 'sizeColor' );
                            console.log( response.data );

                            const sizeColorDetails = response.data.map( rb => ( {
                                fieldId: randomIdGenerator(),
                                id: rb.id,
                                styleNo: rb.styleNo,
                                styleId: rb.styleId,
                                sizeId: rb.sizeId,
                                sizeName: rb.size,
                                colorId: rb.colorId,
                                colorValue: rb.color ? { label: rb.color, value: rb.colorId } : null,
                                ratePerUnit: rb.ratePerUnit,
                                color: rb.color,
                                asrtValue: rb.asrtValue,
                                quantity: rb.isInRatio ? rb.totalQuantity : rb.quantity,
                                ratio: rb.ratio,
                                adjustedQuantity: rb.adjustedQuantity,
                                sampleQuantity: rb.sampleQuantity,
                                wastagePercentage: rb.wastagePercentage,
                                excessPercentage: rb.excessPercentage,
                                isInRatio: rb.isInRatio,
                                totalQuantity: rb.totalQuantity
                            } ) );
                            setColorSizeRationIds(
                                {
                                    styleId,
                                    sizeGroupId,
                                    rowId,
                                    colorSizeQuantity: sizeColorDetails,
                                    orderQuantity
                                }

                            );
                        }
                    );
            } else {
                setColorSizeRationIds(
                    {
                        styleId,
                        sizeGroupId,
                        rowId,
                        colorSizeQuantity: [],
                        orderQuantity
                    }
                );
            }
        }
    };

    const [sizeRationIds, setSizeRationIds] = useState( null );
    const [isSizeRationOpen, setIsSizeRationOpen] = useState( false );
    const [sizeQuantityDetails, setSizeQuantityDetails] = useState( [] );

    const [isColorRationOpen, setIsColorRationOpen] = useState( false );
    const [colorRationIds, setColorRationIds] = useState( null );
    const [colorQuantityDetails, setColorQuantityDetails] = useState( [] );

    ////

    const handleOpenColorRation = ( rowId, styleId, sizeGroupId, orderQuantitySizeAndColor, isDetailQuantityExist, detailId, orderQuantity ) => {
        setColorRationIds(
            {
                styleId,
                rowId,
                sizeGroupId,
                orderQuantity,
                setStyleId: stylePurchaserOrder?.style?.value
            }
        );
        if ( orderQuantitySizeAndColor.length ) {
            setColorQuantityDetails( orderQuantitySizeAndColor.map( cs => ( { ...cs, fieldId: randomIdGenerator() } ) ) );
            setIsColorRationOpen( !isColorRationOpen );

        } else {
            if ( isDetailQuantityExist ) {
                baseAxios.get( `${merchandisingApi.purchaseOrder.root}/orderDetails/${detailId}/quantityOnSizeAndColor` )
                    .then(
                        response => {
                            console.log( 'quantity' );
                            console.log( response );

                            const sizeColorDetails = response.data.map( rb => ( {
                                fieldId: randomIdGenerator(),
                                id: rb.id,
                                styleNo: rb.styleNo,
                                styleId: rb.styleId,
                                ratePerUnit: rb.ratePerUnit,
                                sizeId: rb.sizeId,
                                sizeName: rb.size,
                                colorId: rb.colorId,
                                color: rb.color,
                                colorValue: rb.color ? { label: rb.color, value: rb.colorId } : null,
                                quantity: rb.quantity,
                                ratio: rb.ratio,
                                totalQuantity: rb.totalQuantity,
                                isInRatio: rb.isInRatio
                            } ) );
                            setColorQuantityDetails( sizeColorDetails );
                        }
                    );
                setIsColorRationOpen( !isColorRationOpen );

            } else {
                baseAxios.get(
                    sizeGroupId ? `${merchandisingApi.setStyle.root}/${styleId}/sizesAndColors?sizeGroupId=${sizeGroupId}` : `${merchandisingApi.setStyle.root}/${styleId}/sizesAndColors`
                )
                    .then( response => {
                        setIsColorRationOpen( !isColorRationOpen );

                        console.log( 'sdfdfdfdf' );
                        console.log( response );
                        const styleDetails = response.data;
                        const sizeColorDetailsArray = styleDetails.map( rb => ( {
                            fieldId: randomIdGenerator(),
                            styleId: rb.styleId,
                            styleNo: rb.styleNo,
                            sizeId: rb.sizeId,
                            sizeName: rb.size,
                            colorId: rb.colorId,
                            color: rb.color,
                            colorValue: rb.color ? { label: rb.color, value: rb.colorId } : null,
                            quantity: 0,
                            rationQuantity: rb.quantity * orderQuantity,
                            ratio: 0,
                            totalQuantity: rb.totalQuantity,
                            isInRatio: false
                        } ) );
                        setColorQuantityDetails( sizeColorDetailsArray );
                    } );
            }

        }
    };

    const handleOpenSizeRation = ( rowId, styleId, sizeGroupId, orderQuantitySizeAndColor, isDetailQuantityExist, detailId, orderQuantity ) => {
        setSizeRationIds(
            {
                styleId,
                rowId,
                sizeGroupId,
                orderQuantity
            }
        );
        if ( orderQuantitySizeAndColor.length ) {
            setSizeQuantityDetails( orderQuantitySizeAndColor.map( cs => ( { ...cs, fieldId: randomIdGenerator() } ) ) );
            setIsSizeRationOpen( !isSizeRationOpen );

        } else {
            if ( isDetailQuantityExist ) {
                baseAxios.get( `${merchandisingApi.purchaseOrder.root}/orderDetails/${detailId}/quantityOnSizeAndColor` )
                    .then(
                        response => {
                            console.log( response );

                            const sizeColorDetails = response.data.map( rb => ( {
                                fieldId: randomIdGenerator(),
                                id: rb.id,
                                styleNo: rb.styleNo,
                                styleId: rb.styleId,
                                sizeId: rb.sizeId,
                                colorValue: rb.color ? { label: rb.color, value: rb.colorId } : null,
                                sizeName: rb.size,
                                ratePerUnit: rb.ratePerUnit,
                                colorId: rb.colorId,
                                color: rb.color,
                                quantity: rb.quantity,
                                ratio: rb.ratio,
                                isInRatio: rb.isInRatio
                            } ) );
                            setSizeQuantityDetails( sizeColorDetails );
                        }
                    );
                setIsSizeRationOpen( !isSizeRationOpen );

            } else {
                baseAxios.get(
                    sizeGroupId ? `${merchandisingApi.setStyle.root}/${styleId}/sizesAndColors?sizeGroupId=${sizeGroupId}` : `${merchandisingApi.setStyle.root}/${styleId}/sizesAndColors`
                )
                    .then( response => {
                        setIsSizeRationOpen( !isSizeRationOpen );

                        console.log( response );
                        const styleDetails = response.data;
                        const sizeColorDetailsArray = styleDetails.map( rb => ( {
                            fieldId: randomIdGenerator(),
                            styleId: rb.styleId,
                            styleNo: rb.styleNo,
                            sizeId: rb.sizeId,
                            colorValue: rb.color ? { label: rb.color, value: rb.colorId } : null,
                            sizeName: rb.size,
                            colorId: rb.colorId,
                            color: rb.color,
                            quantity: 0,
                            rationQuantity: rb.quantity * orderQuantity,
                            ratio: 0,
                            isInRatio: false
                        } ) );
                        setSizeQuantityDetails( sizeColorDetailsArray );
                    } );
            }

        }
    };

    const handleColorSizeBindingOnRow = ( rowId, quantity ) => {
        console.log( 'quantity', quantity );
        const updatedData = stylePurchaseOrderDetails.map( detail => {
            if ( rowId === detail.rowId ) {
                detail['orderQuantitySizeAndColor'] = quantity;
            }
            return detail;
        } );
        dispatch( bindStylePurchaseOrderDetails( updatedData ) );
        //  setSizeRationIds( null );
    };


    const handleExpandRowOnClick = ( rowId, orderQuantitySizeAndColor, detailId, isDetailQuantityExist, rowExpanded ) => {
        console.log( orderQuantitySizeAndColor );

        if ( !orderQuantitySizeAndColor.length && isDetailQuantityExist ) {

            baseAxios.get( `${merchandisingApi.purchaseOrder.root}/orderDetails/${detailId}/quantityOnSizeAndColor` )
                .then(
                    response => {
                        console.log( 'RowExpand', response.data );
                        const sizeColorDetails = response.data.map( rb => ( {
                            fieldId: randomIdGenerator(),
                            id: rb.id,
                            styleNo: rb.styleNo,
                            styleId: rb.styleId,
                            sizeId: rb.sizeId,
                            ratePerUnit: rb.ratePerUnit,
                            sizeName: rb.size,
                            colorValue: rb.color ? { label: rb.color, value: rb.colorId } : null,
                            colorId: rb.colorId,
                            colorName: rb.color,
                            quantity: rb.isInRatio ? rb.totalQuantity : rb.quantity,
                            ratio: rb.ratio,
                            adjustedQuantity: rb.adjustedQuantity,
                            sampleQuantity: rb.sampleQuantity,
                            wastagePercentage: rb.wastagePercentage,
                            excessPercentage: rb.excessPercentage,
                            isInRatio: rb.isInRatio,
                            totalQuantity: rb.totalQuantity,
                            color: rb.color,
                            asrtValue: rb.asrtValue


                        } ) );
                        const updatedData = stylePurchaseOrderDetails.map( od => {
                            if ( rowId === od.rowId ) {
                                od.orderQuantitySizeAndColor = sizeColorDetails;
                                od.rowExpanded = rowExpanded;
                            }
                            return od;
                        } );
                        dispatch( bindStylePurchaseOrderDetails( updatedData ) );
                    }
                );
        } else {
            const updatedData = stylePurchaseOrderDetails.map( od => {
                if ( rowId === od.rowId ) {
                    od.orderQuantitySizeAndColor = orderQuantitySizeAndColor;
                    od.rowExpanded = rowExpanded;
                }
                return od;
            } );
            dispatch( bindStylePurchaseOrderDetails( updatedData ) );
        }
    };
    ///handle Submit
    const onSubmit = () => {
        const orderDetails = stylePurchaseOrderDetails.map( ( detail, index ) => ( {
            rowNo: index + 1,
            orderId: detail.orderId,
            buyerOrderNumber: detail.buyerOrderNumber,
            detailId: detail.detailId,
            styleId: detail.styleId,
            styleNumber: detail.styleNumber,
            buyerId: detail.buyerId,
            buyerName: detail.buyerName,
            agentId: detail.agentId,
            agentName: detail.agentName,
            sizeGroupId: detail.sizeGroup?.value,
            sizeGroupName: detail.sizeGroup?.label,
            orderDate: detail.orderDate,
            season: detail.season?.label,
            year: detail.year?.label,
            currencyCode: detail.currency?.label,
            orderUOM: detail.orderUOM,
            orderUOMRelativeFactor: detail.orderUOMRelativeFactor,
            orderQuantity: detail.orderQuantity,
            shipmentMode: detail.shipmentMode?.label,
            shipmentDate: detail.shipmentDate,
            inspectionDate: detail.inspectionDate,
            ratePerUnit: Number( detail.ratePerUnit ),
            excessQuantityPercentage: detail.excessQuantityPercentage,
            wastageQuantityPercentage: detail.wastageQuantityPercentage,
            adjustedQuantity: detail.adjustedQuantity,
            deliveryDestination: detail.deliveryDestination?.label,
            status: detail.status?.label,
            orderQuantitySizeAndColor: detail.orderQuantitySizeAndColor?.map( color => ( {
                styleId: color.styleId,
                sizeId: color.sizeId,
                size: color.sizeName,
                colorId: color.colorId,
                color: color.colorName,
                ratePerUnit: color.ratePerUnit,
                quantity: color.quantity,
                excessPercentage: color.excessPercentage,
                wastagePercentage: color.wastagePercentage,
                sampleQuantity: color.sampleQuantity,
                adjustedQuantity: color.adjustedQuantity,
                ratio: color.ratio,
                asrtValue: color.asrtValue,
                isInRatio: color.isInRatio
            } ) )
        } ) );
        console.log( 'orderDetails', JSON.stringify( orderDetails, null, 2 ) );
        dispatch( addStylePurchaseOrder( orderDetails, stylePurchaserOrder?.style?.value, stylePurchaserOrder?.buyer?.value ) );

    };
    ///Cancel Operation
    const handleCancel = () => {
        // dispatch( handleNewStylePurchaseOrder() );
        replace( state.backUrl );
    };

    ///Total Order Qty Show Up
    const sumOfTotalQuantity = () => {
        const total = _.sum( stylePurchaseOrderDetails.map( detail => Number( detail.orderQuantity ) ) );
        return total;
    };
    ///Total Order Amount Show up
    const sumOfTotalAmount = () => {
        const total = _.sum( stylePurchaseOrderDetails.map( detail => Number( detail.orderQuantity * detail.ratePerUnit ) ) );
        return total.toFixed( 4 );
    };
    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false
        },
        {
            id: 'poList',
            name: 'Styles',
            link: stylePurchaserOrder?.isSetStyle ? "set-styles" : "/single-styles",
            isActive: true
        }
    ];
    return (
        <div>
            <Card className="mt-3">
                <ActionMenu breadcrumb={breadcrumb} title='New Purchase Order' >
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            disabled={isPurchaseOrderDataLoading}
                            size="sm"
                            color="primary"
                            type="submit"
                            onClick={() => { onSubmit(); }}
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
                <CardBody>
                    <Row>
                        <Col>
                            <div className='divider divider-left mt-0'>
                                <div className='divider-text text-secondary font-weight-bolder '> {`Style's Purchaser Order Info`}</div>
                            </div>
                            <div className="border rounded rounded-3 p-1">
                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                        <div className='custom-form-main'>
                                            <Label className='custom-form-label' for='buyerId'>Buyer</Label>
                                            <Label className='custom-form-colons'> : </Label>
                                            <div className='custom-form-group'>
                                                <CreatableSelect
                                                    id='buyerId'
                                                    name="buyer"
                                                    isSearchable
                                                    isDisabled
                                                    menuPosition="fixed"
                                                    isLoading={!dropDownBuyers.length}
                                                    isClearable
                                                    theme={selectThemeColors}
                                                    options={dropDownBuyers}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    innerRef={register( { required: true } )}
                                                    // className={classnames( 'react-select', { 'is-invalid': season === null } )}
                                                    value={stylePurchaserOrder?.buyer}
                                                    onFocus={() => { handleBuyerDropdownOnFocus(); }}
                                                    onChange={data => {
                                                        handleBuyerDropdown( data );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='custom-form-main'>
                                            <Label className='custom-form-label' for='styleId'>Style</Label>
                                            <Label className='custom-form-colons'> : </Label>
                                            <div className='custom-form-group'>
                                                <CreatableSelect
                                                    id='styleId'
                                                    name="style"
                                                    isDisabled
                                                    isSearchable
                                                    isLoading={!buyerStylesDropdown.length}
                                                    menuPosition="fixed"
                                                    isClearable
                                                    theme={selectThemeColors}
                                                    options={buyerStylesDropdown}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    innerRef={register( { required: true } )}
                                                    // className={classnames( 'react-select', { 'is-invalid': season === null } )}
                                                    value={stylePurchaserOrder?.style}
                                                    onChange={data => {
                                                        handleStyleDropdown( data );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </Col>

                                    <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                        <div className='custom-form-main'>
                                            <Label className='custom-form-label' for='styleId'>Total Order Qty</Label>
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
                                            <Label className='custom-form-label' for='styleId'> Total Amount</Label>
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
                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                        {/* <div className='custom-form-main justify-content-center '>
                                            <div className='border p-1'>
                                                <div className='image-main-container'>
                                                    <div className='image-container'>
                                                        <img className='' src='https://via.placeholder.com/50' height={80} width={80} />

                                                    </div>
                                                </div>
                                            </div>

                                        </div> */}
                                    </Col>
                                    <Col>
                                        <div className='divider divider-left '>
                                            <div className='divider-text text-secondary font-weight-bolder'>Order Details</div>
                                        </div>
                                        <DataTable
                                            // subHeader
                                            // subHeaderComponent={}
                                            progressPending={isPurchaseOrderDataLoading}
                                            progressComponent={
                                                <CustomPreLoader />
                                            }
                                            pagination
                                            noHeader
                                            responsive
                                            data={stylePurchaseOrderDetails}
                                            className='react-custom-dataTable'
                                            persistTableHead
                                            dense
                                            expandableRows
                                            // expandableIcon={{ collapsed: <Trash2 hidden /> }}
                                            // expandableRows={!stylePurchaserOrder?.style?.isSetStyle}
                                            expandableRowExpanded={row => row.rowExpanded}
                                            expandableRowDisabled={row => !row.orderId}
                                            onRowExpandToggled={( expanded, row ) => { handleExpandRowOnClick( row.rowId, row.orderQuantitySizeAndColor, row.detailId, row.isDetailQuantityExist, expanded ); }}
                                            expandableRowsComponent={stylePurchaserOrder?.isSetStyle ? <ExpandableSetOrderQuantitySizeAndColorForm data={data => data} /> : < ExpandableOrderQuantitySizeAndColorForm data={data => data} />}
                                            onRowDoubleClicked={( row ) => { handleRowEditable( row ); }}
                                            paginationTotalRows={stylePurchaseOrderDetails.length}
                                            columns={[
                                                {
                                                    id: "sl",
                                                    reorder: true,
                                                    name: 'SL',
                                                    width: '30px',
                                                    selector: 'sl',
                                                    center: true,
                                                    ignoreRowClick: true,
                                                    cell: ( row, index ) => index + 1
                                                },
                                                {
                                                    id: "buttons",
                                                    reorder: true,
                                                    name: '#',
                                                    width: '100px',
                                                    ignoreRowClick: true,

                                                    selector: 'actions',
                                                    center: true,
                                                    cell: ( row, index ) => <span>
                                                        <Button.Ripple id="copyId"
                                                            tag={Label}
                                                            // disabled={( orderDetails.length === 1 )}
                                                            onClick={() => { handleDuplicateOrderDetailsRow( row.rowId ); }}
                                                            className='btn-icon p-0 '
                                                            color='flat-success'
                                                            disabled={!isValidStatus}

                                                        >
                                                            <Copy size={18} id="copyId" color="green" />
                                                        </Button.Ripple>
                                                        <Button.Ripple id="editRowId"
                                                            tag={Label}
                                                            // disabled={( orderDetails.length === 1 )}
                                                            onClick={() => { handleRowEditable( row, index ); }}
                                                            className='btn-icon p-0 ml-1'
                                                            color='flat-success'
                                                        >
                                                            <Edit3 size={18} id="editRowId" color={row.isEditable ? 'grey' : 'green'} />
                                                        </Button.Ripple>
                                                        <Button.Ripple id="deleteFabId"
                                                            tag={Label}
                                                            // disabled={( orderDetails.length === 1 )}
                                                            onClick={() => { handleRemoveOrderDetailsRow( row.rowId, row.orderId, row.detailId ); }}
                                                            className='btn-icon p-0 ml-1'
                                                            color='flat-danger'
                                                        >
                                                            <MinusSquare size={18} id="deleteFabId" color="red" />
                                                        </Button.Ripple>

                                                    </span>
                                                },
                                                {
                                                    id: "styleNumber",
                                                    reorder: true,
                                                    name: 'Style No',
                                                    minWidth: '100px',
                                                    sortable: true,
                                                    selector: row => row.styleNumber,
                                                    center: true,
                                                    cell: row => row.styleNumber
                                                },
                                                {
                                                    id: "buyerOrderNumber",
                                                    reorder: true,
                                                    name: 'PO No',
                                                    minWidth: '100px',
                                                    sortable: true,
                                                    selector: row => row.buyerOrderNumber,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <Input
                                                            type="text"
                                                            className="text-right"
                                                            name="buyerOrderNumber"
                                                            bsSize="sm"
                                                            value={row.buyerOrderNumber}
                                                            // invalid={stylePurchaseOrderDetails.some( order => row.buyerOrderNumber === order.buyerOrderNumber && row.sizeGroup?.value === order.sizeGroup?.value )}
                                                            //   invalid={stylePurchaseOrderDetails.filter( ( item, index ) => stylePurchaseOrderDetails.indexOf( item ) !== index )}
                                                            onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                            onFocus={( e ) => e.target.select()}
                                                        /> : row.buyerOrderNumber
                                                    )
                                                },
                                                {
                                                    id: "sizeGroupId",
                                                    reorder: true,
                                                    name: 'Size Group',
                                                    minWidth: '100px',
                                                    selector: row => row.sizeGroup?.label,
                                                    center: true,
                                                    sortable: true,
                                                    cell: row => (
                                                        row.isEditable ? <span className='w-100'> <CreatableSelect
                                                            id='sizeGroupId'
                                                            name="sizeGroup"
                                                            isSearchable
                                                            isDisabled={stylePurchaserOrder?.isSizeSpecific}
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={stylePurchaserOrder?.isSetStyle ? dropdownSetStyleSizeGroups : singleStyleSizeGroups}
                                                            classNamePrefix="dropdown"
                                                            className="erp-dropdown-select"
                                                            innerRef={register( { required: true } )}
                                                            value={row.sizeGroup}
                                                            onChange={( data, e ) => {
                                                                handleDetailsDropdownOChange( data, e, row.rowId );
                                                            }}
                                                            onFocus={() => { handleSizeGroupOnFocus(); }}
                                                        /> </span> : row?.sizeGroup?.label
                                                    )
                                                },
                                                {
                                                    id: "orderDate",
                                                    reorder: true,
                                                    name: 'Order Date',
                                                    minWidth: "150px",
                                                    selector: row => row.orderDate,
                                                    // style: { borderColor: 'red', border: '1px' },

                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <Input
                                                            type="date"
                                                            className="text-right"
                                                            name="orderDate"
                                                            bsSize="sm"
                                                            value={moment( row.orderDate ).format( "yy-MM-DD" )}
                                                            onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                            onFocus={( e ) => e.target.select()}
                                                        /> : moment( row.orderDate ).format( "DD-MM-YYYY" )
                                                    )
                                                },
                                                {
                                                    id: "seasonId",
                                                    reorder: true,
                                                    name: 'Season',
                                                    minWidth: '100px',
                                                    selector: row => row.season?.label,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <span className='w-100'> <CreatableSelect
                                                            id='seasonId'
                                                            name="season"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={dropDownSeasons}
                                                            classNamePrefix="dropdown"
                                                            className="erp-dropdown-select "
                                                            innerRef={register( { required: true } )}
                                                            value={row.season}
                                                            onChange={( data, e ) => {
                                                                handleDetailsDropdownOChange( data, e, row.rowId );
                                                            }}
                                                        /> </span> : row?.season?.label
                                                    )
                                                },
                                                {
                                                    id: "yearId",
                                                    reorder: true,
                                                    name: 'Year',
                                                    minWidth: '100px',
                                                    selector: row => row.year?.label,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <span className='w-100'> <CreatableSelect
                                                            id='yearId'
                                                            name="year"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={selectYear}
                                                            classNamePrefix="dropdown"
                                                            className="erp-dropdown-select "
                                                            innerRef={register( { required: true } )}
                                                            value={row.year}
                                                            onChange={( data, e ) => {
                                                                handleDetailsDropdownOChange( data, e, row.rowId );
                                                            }}
                                                        /> </span> : row?.year?.label
                                                    )
                                                },
                                                {
                                                    id: "deliveryDestinationId",
                                                    reorder: true,
                                                    name: 'Destination',
                                                    minWidth: '100px',
                                                    selector: row => row.deliveryDestination?.label,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <span className='w-100'> <CreatableSelect
                                                            id='deliveryDestinationId'
                                                            name="deliveryDestination"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={selectDestination}
                                                            classNamePrefix="dropdown"
                                                            className="erp-dropdown-select "
                                                            innerRef={register( { required: true } )}
                                                            value={row.deliveryDestination}
                                                            onChange={( data, e ) => {
                                                                handleDetailsDropdownOChange( data, e, row.rowId );
                                                            }}
                                                        /> </span> : row?.deliveryDestination?.label
                                                    )
                                                },
                                                {
                                                    id: "shipmentModeId",
                                                    reorder: true,
                                                    name: 'Shipt. Mode',
                                                    minWidth: '120px',
                                                    selector: row => row.shipmentMode?.label,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <span className='w-100'> <CreatableSelect
                                                            id='shipmentModeId'
                                                            name="shipmentMode"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={selectShipmentMode}
                                                            classNamePrefix="dropdown"
                                                            className="erp-dropdown-select"
                                                            innerRef={register( { required: true } )}
                                                            value={row.shipmentMode}
                                                            onChange={( data, e ) => {
                                                                handleDetailsDropdownOChange( data, e, row.rowId );
                                                            }}
                                                        /> </span> : row?.shipmentMode?.label
                                                    )
                                                },
                                                {
                                                    id: "shipmentDate",
                                                    reorder: true,
                                                    name: 'Shipt. Date',
                                                    minWidth: "152px",
                                                    selector: row => row.shipmentDate,
                                                    style: '',
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <Input
                                                            type="date"
                                                            className="text-right"
                                                            name="shipmentDate"
                                                            bsSize="sm"
                                                            // invalid
                                                            value={moment( row.shipmentDate ).format( "yy-MM-DD" )}
                                                            onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                            onFocus={( e ) => e.target.select()}
                                                        /> : moment( row.shipmentDate ).format( "DD-MM-YYYY" )
                                                    )
                                                },
                                                {
                                                    id: "inspectionDate",
                                                    reorder: true,
                                                    name: 'Insp. Date',
                                                    minWidth: "152px",
                                                    selector: row => row.inspectionDate,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <Input
                                                            type="date"
                                                            className="text-right"
                                                            name="inspectionDate"
                                                            bsSize="sm"
                                                            value={moment( row.inspectionDate ).format( "yy-MM-DD" )}
                                                            onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                            onFocus={( e ) => e.target.select()}
                                                        /> : moment( row.inspectionDate ).format( "DD-MM-YYYY" )
                                                    )
                                                },

                                                {
                                                    id: "orderQuantity",
                                                    reorder: true,
                                                    name: 'Order Qty',
                                                    minWidth: '100px',
                                                    selector: row => row.orderQuantity,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <Input
                                                            type="number"
                                                            className="text-right"
                                                            name="orderQuantity"
                                                            bsSize="sm"
                                                            value={row.orderQuantity}
                                                            onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                            onFocus={( e ) => e.target.select()}
                                                        /> : row.orderQuantity
                                                    )
                                                },
                                                // {
                                                //     id: "orderUOM",
                                                //     reorder: true,
                                                //     name: 'Order UOM',
                                                //     minWidth: '100px',
                                                //     selector: row => row?.orderUOM?.label,
                                                //     center: true,
                                                //     cell: row => (
                                                //         row.isEditable ? <span className='w-100'> <CreatableSelect
                                                //             id='orderUOMId'
                                                //             name="orderUOM"
                                                //             isSearchable
                                                //             menuPosition="fixed"
                                                //             theme={selectThemeColors}
                                                //             options={defaultUOMDropdown}
                                                //             classNamePrefix="dropdown"
                                                //             className="erp-dropdown-select "
                                                //             innerRef={register( { required: true } )}
                                                //             onFocus={() => { handleUOMOnFocus( defaultUnitId ); }}
                                                //             value={row.orderUOM}
                                                //             onChange={( data, e ) => {
                                                //                 handleDetailsDropdownOChange( data, e, row.rowId );
                                                //             }}
                                                //         /> </span> : row?.orderUOM?.label
                                                //     )
                                                // },
                                                {
                                                    id: "orderUOM",
                                                    reorder: true,
                                                    name: 'Order UOM',
                                                    minWidth: '100px',
                                                    selector: row => row?.orderUOM,
                                                    center: true,
                                                    cell: row => row.orderUOM
                                                },
                                                {
                                                    id: "ratePerUnit",
                                                    reorder: true,
                                                    name: 'Rate',
                                                    minWidth: '100px',
                                                    selector: row => row.ratePerUnit,
                                                    center: true,
                                                    // cell: row => (
                                                    //     row.isEditable ? <Input
                                                    //         type="number"
                                                    //         className="text-right"
                                                    //         name="ratePerUnit"
                                                    //         bsSize="sm"
                                                    //         value={row.ratePerUnit}
                                                    //         onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                    //         onFocus={( e ) => e.target.select()}
                                                    //     /> : row.ratePerUnit
                                                    // )
                                                    cell: row => ( row.isEditable ? <NumberFormat
                                                        className="form-control-sm form-control"
                                                        displayType="input"
                                                        value={row.ratePerUnit}
                                                        name="ratePerUnit"
                                                        // thousandSeparator={true}
                                                        // thousandsGroupStyle="thousand"
                                                        decimalScale={4}
                                                        fixedDecimalScale={row.ratePerUnit !== 0}
                                                        allowNegative={false}
                                                        allowLeadingZeros={false}
                                                        onFocus={e => {
                                                            e.target.select();
                                                        }}
                                                        onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                    /> : row.ratePerUnit.toFixed( 4 )
                                                    )
                                                },
                                                {
                                                    id: "amount",
                                                    reorder: true,
                                                    name: 'Amount',
                                                    minWidth: '100px',
                                                    selector: row => row.amount,
                                                    center: true,
                                                    cell: row => ( row.orderQuantity * row.ratePerUnit ).toFixed( 4 )
                                                },
                                                {
                                                    id: "currencyId",
                                                    reorder: true,
                                                    name: 'Currency',
                                                    minWidth: '100px',
                                                    selector: row => row.currency.label,
                                                    sortable: true,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <span className='w-100'> <CreatableSelect
                                                            id='currencyId'
                                                            name="currency"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={currencyDropdown}
                                                            classNamePrefix="dropdown"
                                                            className="erp-dropdown-select "
                                                            innerRef={register( { required: true } )}
                                                            value={row.currency}
                                                            onChange={( data, e ) => {
                                                                handleDetailsDropdownOChange( data, e, row.rowId );
                                                            }}
                                                        /> </span> : row?.currency?.label
                                                    )
                                                },
                                                {
                                                    id: "excessQuantityPercentage",
                                                    reorder: true,
                                                    name: 'Excess %',
                                                    minWidth: '100px',
                                                    selector: row => row.excessQuantityPercentage,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <NumberFormat
                                                            className="form-control-sm form-control"
                                                            displayType="input"
                                                            value={row.excessQuantityPercentage}
                                                            name="excessQuantityPercentage"
                                                            // thousandSeparator={true}
                                                            // thousandsGroupStyle="thousand"
                                                            decimalScale={2}
                                                            fixedDecimalScale={true}
                                                            allowNegative={false}
                                                            allowLeadingZeros={false}
                                                            onFocus={e => {
                                                                e.target.select();
                                                            }}
                                                            onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                        /> : row.excessQuantityPercentage.toFixed( 2 )
                                                    )
                                                },
                                                // {
                                                //     id: "excessQuantityPercentage",
                                                //     reorder: true,
                                                //     name: 'Excess %',
                                                //     minWidth: '100px',
                                                //     selector: row => row.excessQuantityPercentage,
                                                //     center: true,
                                                //     cell: row => (
                                                //         row.isEditable ? <Input
                                                //             type="number"
                                                //             className="text-right"
                                                //             name="excessQuantityPercentage"
                                                //             bsSize="sm"
                                                //             value={row.excessQuantityPercentage}
                                                //             onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                //             onFocus={( e ) => e.target.select()}
                                                //         /> : row.excessQuantityPercentage
                                                //     )
                                                // },
                                                {
                                                    id: "wastageQuantityPercentage",
                                                    reorder: true,
                                                    name: 'Wastage %',
                                                    minWidth: '100px',
                                                    selector: row => row.wastageQuantityPercentage,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <NumberFormat
                                                            className="form-control-sm form-control"
                                                            displayType="input"
                                                            value={row.wastageQuantityPercentage}
                                                            name="wastageQuantityPercentage"
                                                            // thousandSeparator={true}
                                                            // thousandsGroupStyle="thousand"
                                                            decimalScale={2}
                                                            fixedDecimalScale={true}
                                                            allowNegative={false}
                                                            allowLeadingZeros={false}
                                                            onFocus={e => {
                                                                e.target.select();
                                                            }}
                                                            onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                        /> : row.wastageQuantityPercentage.toFixed( 2 )
                                                    )
                                                },
                                                {
                                                    id: "adjustedQuantity",
                                                    reorder: true,
                                                    name: 'Adj. Qty',
                                                    minWidth: '100px',
                                                    selector: row => row.adjustedQuantity,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <NumberFormat
                                                            className="form-control-sm form-control"
                                                            displayType="input"
                                                            value={row.adjustedQuantity}
                                                            disabled
                                                            name="adjustedQuantity"

                                                            decimalScale={0}
                                                            fixedDecimalScale={true}
                                                            allowNegative={false}
                                                            allowLeadingZeros={false}
                                                            onFocus={e => {
                                                                e.target.select();
                                                            }}
                                                            onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                        /> : Math.ceil( row.adjustedQuantity )
                                                    )
                                                },
                                                // {
                                                //     id: "exporterId",
                                                //     reorder: true,
                                                //     name: 'Exporter',
                                                //     minWidth: '100px',
                                                //     selector: row => row.exporter?.label,
                                                //     center: true,
                                                //     sortable: true,
                                                //     cell: row => (
                                                //         row.isEditable ? <span className='w-100'> <CreatableSelect
                                                //             id='exporterId'
                                                //             name="exporter"
                                                //             isSearchable
                                                //             menuPosition="fixed"
                                                //             theme={selectThemeColors}
                                                //             options={[]}
                                                //             classNamePrefix="dropdown"
                                                //             className="erp-dropdown-select"
                                                //             innerRef={register( { required: true } )}
                                                //             value={row.exporter}
                                                //             onChange={( data, e ) => {
                                                //                 handleDetailsDropdownOChange( data, e, row.rowId );
                                                //             }}

                                                //         /> </span> : row?.exporter?.label
                                                //     )
                                                // },
                                                // {
                                                //     id: "wastageQuantityPercentage",
                                                //     reorder: true,
                                                //     name: 'Wastage %',
                                                //     minWidth: '100px',
                                                //     selector: row => row.wastageQuantityPercentage,
                                                //     center: true,
                                                //     cell: row => (
                                                //         row.isEditable ? <Input
                                                //             type="number"
                                                //             className="text-right"
                                                //             name="wastageQuantityPercentage"
                                                //             bsSize="sm"
                                                //             value={row.wastageQuantityPercentage}
                                                //             onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                //             onFocus={( e ) => e.target.select()}
                                                //         /> : row.wastageQuantityPercentage
                                                //     )
                                                // },
                                                {
                                                    id: "rc",
                                                    reorder: true,
                                                    name: 'RC',
                                                    width: '40px',
                                                    selector: 'actions',
                                                    center: true,
                                                    cell: row => <span>
                                                        {
                                                            stylePurchaserOrder?.isSetStyle ? (
                                                                <Button.Ripple
                                                                    id="srcIds" tag={Label}
                                                                    className='btn-icon p-0'
                                                                    color='flat-success'
                                                                    disabled={( stylePurchaserOrder.isColorSpecific && stylePurchaserOrder.isSizeSpecific )}
                                                                    onClick={() => {
                                                                        ( !stylePurchaserOrder.isColorSpecific && stylePurchaserOrder.isSizeSpecific ) ? handleOpenColorRation(
                                                                            row.rowId,
                                                                            row?.styleId,
                                                                            row?.sizeGroup?.value,
                                                                            row.orderQuantitySizeAndColor,
                                                                            row.isDetailQuantityExist,
                                                                            row?.detailId,
                                                                            row.orderQuantity
                                                                        ) : handleOpenSizeRation(
                                                                            row.rowId,
                                                                            row?.styleId,
                                                                            row?.sizeGroup?.value,
                                                                            row.orderQuantitySizeAndColor,
                                                                            row.isDetailQuantityExist,
                                                                            row?.detailId,
                                                                            row.orderQuantity
                                                                        );
                                                                    }}
                                                                >
                                                                    <MoreVertical size={18} id="srcIds" color="purple" />
                                                                </Button.Ripple>
                                                            ) : <Button.Ripple
                                                                id="rcIds" tag={Label}
                                                                className='btn-icon p-0'
                                                                color='flat-success'
                                                                onClick={() => {
                                                                    handleOpenColorSizeRation(
                                                                        row?.styleId,
                                                                        row?.sizeGroup?.value,
                                                                        row.rowId,
                                                                        row.orderQuantitySizeAndColor,
                                                                        row?.detailId,
                                                                        row.isDetailQuantityExist,
                                                                        row.orderQuantity
                                                                    );
                                                                }}
                                                            >
                                                                <MoreVertical size={18} id="rcIds" color="purple" />
                                                            </Button.Ripple>
                                                        }
                                                    </span>
                                                },
                                                {
                                                    id: "statusId",
                                                    reorder: true,
                                                    name: 'Status',
                                                    minWidth: '100px',
                                                    selector: row => row.status?.label,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <span className='w-100'> <CreatableSelect
                                                            id='statusId'
                                                            name="status"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={orderStatus}
                                                            classNamePrefix="dropdown"
                                                            className="erp-dropdown-select "
                                                            innerRef={register( { required: true } )}
                                                            value={row.status}
                                                            onChange={( data, e ) => {
                                                                handleDetailsDropdownOChange( data, e, row.rowId );
                                                            }}
                                                        /> </span> : row?.status?.label
                                                    )
                                                }
                                            ]}
                                        />
                                        <Button.Ripple id="addRowId"
                                            tag={Label}
                                            // disabled={( orderDetails.length === 1 )}
                                            onClick={() => { handleAddOrderDetailsRow( stylePurchaseOrderDetails.length ); }}
                                            className='btn-icon '
                                            color='flat-success'
                                            hidden={!isValidStatus}

                                        >
                                            <PlusSquare size={18} id="addRowId" color="green" />
                                        </Button.Ripple>
                                    </Col>
                                </Row>

                            </div>
                        </Col>
                    </Row>

                </CardBody>
                {
                    colorSizeRationIds && <SizeColorRation
                        openModal={isColorSizeRationOpen}
                        setOpenModal={setIsColorSizeRationOpen}
                        colorSizeRationIds={colorSizeRationIds}
                        setColorSizeRationIds={setColorSizeRationIds}
                        handleColorSizeBindingOnRow={handleColorSizeBindingOnRow}
                    />
                }
                {
                    isSizeRationOpen && <SizeRationNewForm
                        openModal={isSizeRationOpen}
                        setOpenModal={setIsSizeRationOpen}
                        sizeQuantityDetails={sizeQuantityDetails}
                        setSizeQuantityDetails={setSizeQuantityDetails}
                        sizeRationIds={sizeRationIds}
                        handleColorSizeBindingOnRow={handleColorSizeBindingOnRow}
                    />
                }
                {
                    isColorRationOpen && <ColorRationForm
                        openModal={isColorRationOpen}
                        setOpenModal={setIsColorRationOpen}
                        colorQuantityDetails={colorQuantityDetails}
                        setColorQuantityDetails={setColorQuantityDetails}
                        colorRationIds={colorRationIds}
                        handleColorSizeBindingOnRow={handleColorSizeBindingOnRow}
                    />
                }
            </Card>
        </div>
    );
};

export default StylePurchaseOrderAddFormNew;
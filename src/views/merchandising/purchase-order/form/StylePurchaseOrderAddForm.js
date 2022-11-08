import '@custom-styles/merchandising/form/purchase-order-form.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import { baseAxios } from "@services";
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Check, Copy, Edit3, MinusSquare, MoreVertical, PlusSquare, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Input, Label, NavItem, NavLink, Row } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import { notify } from '../../../../utility/custom/notifications';
import {
    orderStatus, selectPurchaser,
    selectShipmentMode,
    selectYear
} from '../../../../utility/enums';
import { isPermit, isZeroToFixed, randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getCascadeDropDownBuyerAgents } from '../../buyer-agent/store/actions';
import { getBuyersStyles, getDropDownBuyers } from '../../buyer/store/actions';
import { getCurrencyDropdown } from '../../currency/store/actions';
import { getDropDownDestinationsByBuyerId } from '../../destination/store/actions';
import { getDropDownSeasons } from '../../season/store/actions';
import { getDropDownSizeGroups } from '../../size-group/store/actions';
import { getDropDownSetStyleSizeGroups } from '../../style/set-style/store/actions';
import { getSingleStyleSizeGroups } from '../../style/single-style/store/actions';
import {
    addPurchaseOrder, bindStylePurchaseOrder,
    bindStylePurchaseOrderDetails,
    deleteStylePurchaseOrderDetails,
    getStylePurchaseOrderDetails
} from '../store/actions';
import ColorRationForm from './ColorRationForm';
import ExpandableOrderQuantitySizeAndColorForm from './ExpandableOrderQuantitySizeAndColorForm';
import ExpandableSetOrderQuantitySizeAndColorForm from './ExpandableSetOrderQuantitySizeAndColorForm';
import SizeColorRation from './SizeColorRation';
import SizeRationNewForm from './SizeRationNewForm';

const StylePurchaseOrderAddForm = () => {
    const currentDate = moment( Date.now() ).format( 'YYYY-MM-DD' );
    const { replace, push, goBack } = useHistory();
    const dispatch = useDispatch();
    const state = JSON.parse( localStorage.getItem( 'buyerAndStyle' ) );

    const { dropDownBuyers, buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );
    const { destinationDropdownBuyerWise } = useSelector( ( { destinations } ) => destinations );
    const {
        stylePurchaserOrder,
        stylePurchaseOrderDetails,
        isPurchaseOrderDataLoading
    } = useSelector( ( { purchaseOrders } ) => purchaseOrders );
    const { dropDownSeasons } = useSelector( ( { seasons } ) => seasons );
    const { singleStyleSizeGroups } = useSelector( ( { styles } ) => styles );
    const { dropdownSetStyleSizeGroups } = useSelector( ( { setStyles } ) => setStyles );
    const { currencyDropdown } = useSelector( ( { currencies } ) => currencies );
    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    console.log( isPurchaseOrderDataLoading );

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


    const getOrderDetails = () => {
        const updatedObj = {
            ...stylePurchaserOrder,
            isSetStyle: state?.isSetStyle ?? false,
            isSizeSpecific: state.isSizeSpecific,
            isColorSpecific: state.isColorSpecific,
            buyer: state.buyer,
            style: state.style,
            status: state.status
        };


        dispatch( bindStylePurchaseOrder( updatedObj ) );
        dispatch( getStylePurchaseOrderDetails( state.style?.value, state.buyer?.value ) );
    };


    useEffect( () => {
        getOrderDetails();
    }, [dispatch, state?.style?.value, state.buyer?.value] );

    const handleSizeGroupOnFocus = () => {
        if ( !state.isSetStyle && !singleStyleSizeGroups.length ) {
            dispatch( getSingleStyleSizeGroups( state.style?.value ) );
        } else {
            if ( !dropdownSetStyleSizeGroups.length ) {
                dispatch( getDropDownSetStyleSizeGroups( state.style?.value ) );
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

    const handleDestinationOnFocus = ( buyerId ) => {
        if ( !destinationDropdownBuyerWise.length ) {
            dispatch( getDropDownDestinationsByBuyerId( buyerId ) );
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
    const handleRowEditable = ( rowId ) => {
        const updatedRow = stylePurchaseOrderDetails.map( details => {
            if ( details.rowId === rowId ) {
                details['isEditable'] = !details.isEditable;
            }
            return details;
        } );
        dispatch( bindStylePurchaseOrderDetails( updatedRow ) );
    };

    const handleRowEditableCancel = () => {
        const confirmObj = {
            title: 'Cancel Edit?',
            text: 'Your edited data will be reset!',
            confirmButtonText: 'Yes !',
            cancelButtonText: 'No'
        };
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                getOrderDetails();
            }
        } );

    };

    ///Input OnChange
    const handleInputOnChange = ( e, rowId ) => {
        const { name, type, value } = e.target;
        if ( value !== '.' ) {
            const updatedRow = stylePurchaseOrderDetails.map( details => {
                if ( details.rowId === rowId ) {
                    details[name] = type === "number" ? Number( value ) : ( type === "date" ) ? moment( value ).format( 'yy-MM-DD' ) : ( name === "ratePerUnit" || name === "excessQuantityPercentage" || name === "wastageQuantityPercentage" || name === "orderQuantity" ) ? Number( value ) : value;
                }
                return details;
            } );
            dispatch( bindStylePurchaseOrderDetails( updatedRow ) );
        }

    };

    ///Add New Row
    const handleAddOrderDetailsRow = () => {
        const isAnyRowEditable = stylePurchaseOrderDetails.some( detail => detail.isEditable );
        const rowObj = {
            rowId: randomIdGenerator(),
            orderId: 0,
            orderNumber: '',
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
            status: { label: 'Approved', value: 'Approved' },
            orderQuantitySizeAndColor: [],
            isEditable: true,
            isDetailQuantityExist: false,
            isQuantityDetailsOpen: false,
            rowExpanded: false,
            isFieldError: false

        };
        if ( isAnyRowEditable ) {
            ///
            notify( 'warning', 'Please save previous editable order details!!!' );
        } else {
            dispatch( bindStylePurchaseOrderDetails( [...stylePurchaseOrderDetails, rowObj] ) );
        }
    };
    const handleDuplicateOrderDetailsRow = ( rowId ) => {
        const isAnyRowEditable = stylePurchaseOrderDetails.some( detail => detail.isEditable );
        if ( isAnyRowEditable ) {
            notify( 'warning', 'Please save previous editable order details!!!' );
        } else {
            const duplicateRow = stylePurchaseOrderDetails.filter( details => details.rowId === rowId ).map( orderDetails => (
                {
                    ...orderDetails,
                    rowNo: stylePurchaseOrderDetails.length,
                    rowId: randomIdGenerator(),
                    orderId: 0,
                    sizeGroup: null,
                    isEditable: true,
                    isDetailQuantityExist: false
                }
            ) );

            dispatch( bindStylePurchaseOrderDetails( [...stylePurchaseOrderDetails, ...duplicateRow] ) );
        }

    };
    const handleRemoveOrderDetailsRow = ( rowId, orderId ) => {
        if ( orderId !== 0 ) {
            dispatch( deleteStylePurchaseOrderDetails( orderId ) );
        } else {
            const updatedData = stylePurchaseOrderDetails.filter( details => details.rowId !== rowId );
            dispatch( bindStylePurchaseOrderDetails( updatedData ) );
        }
        // handlePODetails();
    };
    const [isColorSizeRationOpen, setIsColorSizeRationOpen] = useState( false );

    const [colorSizeRationIds, setColorSizeRationIds] = useState( null );

    const handleOpenColorSizeRation = ( styleId, sizeGroupId, rowId, colorSizeQuantity, orderId, quantityExit, orderQuantity ) => {

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
                baseAxios.get( `${merchandisingApi.purchaseOrder.root}/${orderId}/quantityOnSizeAndColor` )
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
        const updatedData = stylePurchaseOrderDetails.map( detail => {
            if ( rowId === detail.rowId ) {
                detail['orderQuantitySizeAndColor'] = quantity;
            }
            return detail;
        } );
        dispatch( bindStylePurchaseOrderDetails( updatedData ) );
    };


    const handleExpandRowOnClick = ( rowId, orderQuantitySizeAndColor, orderId, isDetailQuantityExist, rowExpanded ) => {
        console.log( orderQuantitySizeAndColor );

        if ( !orderQuantitySizeAndColor.length && isDetailQuantityExist ) {

            baseAxios.get( `${merchandisingApi.purchaseOrder.root}/${orderId}/quantityOnSizeAndColor` )
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

    const handleDateFormat = ( date ) => {
        const formattedDate = moment( date ).format( "yy-MM-DD" );
        return formattedDate;
    };


    const isValidatedArray = () => {
        const validationErrors = {};
        const errorField = stylePurchaseOrderDetails.map( ( od, index ) => {
            if ( !od.orderNumber.trim().length
                || !od.sizeGroup

                || !od.season
                || !od.year
                || !od.deliveryDestination
                || !od.shipmentMode
                || handleDateFormat( od.shipmentDate ) <= handleDateFormat( od.orderDate )
                || handleDateFormat( od.inspectionDate ) >= handleDateFormat( od.shipmentDate )
                || handleDateFormat( od.inspectionDate ) <= handleDateFormat( od.orderDate )
                || od.orderQuantity === 0
                || od.ratePerUnit === 0
                || !od.currency
                || !od.status
                || ( od.orderId === 0 && od.orderQuantitySizeAndColor.length === 0 )
            ) {
                console.log( od.orderDate );
                const rowNo = index + 1;
                Object.assign( validationErrors,
                    !od.orderNumber.trim().length &&
                    { orderNumber: `Order Number is Empty (${rowNo})` },
                    !od.sizeGroup &&
                    { sizeGroup: `Size Group is Empty (${rowNo})` },
                    !od.season &&
                    { season: `Season is Empty (${rowNo})` },

                    !od.orderNumber.trim().length &&
                    { orderNumber: `Order Number is Empty (${rowNo})` } );

                console.log( Object.values( validationErrors ) );
                // notify( 'errors', Object.values( validationErrors ) );


                od['isFieldError'] = true;
            } else {
                od['isFieldError'] = false;
            }
            return od;
        } );
        console.log( errorField.some( e => e.isFieldError ) );
        dispatch( bindStylePurchaseOrderDetails( errorField ) );

        return errorField.some( e => e.isFieldError );
    };


    const handleSingleSubmit = ( rowId, index ) => {
        const detail = stylePurchaseOrderDetails.find( detail => detail.rowId === rowId );
        const submittedOrder = {
            rowNo: index + 1,
            orderNumber: detail.orderNumber,
            orderId: detail.orderId === 0 ? null : detail.orderId,
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
            exporter: detail.exporter?.label,
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
        };

        if ( stylePurchaseOrderDetails.length && !isValidatedArray() ) {
            dispatch( addPurchaseOrder( submittedOrder, stylePurchaserOrder?.style?.value, stylePurchaserOrder?.buyer?.value ) );
        } else {
            // if ( stylePurchaseOrderDetails.some( od => od.detailId === 0 && od.orderQuantitySizeAndColor.length === 0 && od.isFieldError ) ) {
            //     notify( 'warning', 'Size and Color Quantity !' );

            // } else {
            //     notify( 'warning', 'Please Provide Validated Data!' );
            // }
            notify( 'warning', 'Please Provide Validated Data!' );

        }
    };
    ///Cancel Operation
    const handleCancel = () => {
        // dispatch( handleNewStylePurchaseOrder() );
        replace( stylePurchaserOrder?.isSetStyle ? "/set-styles" : "/single-styles" );
    };

    ///Total Order Qty Show Up
    const sumOfTotalQuantity = () => {
        const total = _.sum( stylePurchaseOrderDetails.map( detail => Number( detail.orderQuantity ) ) );
        return total;
    };
    ///Total Order Amount Show up
    const sumOfTotalAmount = () => {
        const total = _.sum( stylePurchaseOrderDetails.map( detail => Number( detail.orderQuantity * detail.ratePerUnit ) ) );
        return isZeroToFixed( total, 4 );
    };

    const isRowEditable = stylePurchaseOrderDetails.some( detail => detail.isEditable );

    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            hidden: false
        },
        {
            id: 'poList',
            name: 'Styles',
            link: stylePurchaserOrder?.isSetStyle ? "set-styles" : "/single-styles",
            isActive: false,
            hidden: false
        },
        {
            id: 'po',
            name: 'PO',
            link: "/stye-purchase-order",
            isActive: true,
            hidden: false
        },
        {
            id: 'costingsList',
            name: 'Costings',
            link: "/costings",
            isActive: false,
            hidden: !isPermit( userPermission?.CostingList, authPermissions )

        },
        {
            id: 'consumptions',
            name: 'Consumptions',
            link: "/consumptions",
            isActive: false,
            hidden: !isPermit( userPermission?.ConsumptionList, authPermissions )

        },
        {
            id: 'budgetList',
            name: 'Budgets',
            link: "/budget",
            isActive: false,
            hidden: !isPermit( userPermission?.BudgetList, authPermissions )
        },
        {
            id: 'procurementList',
            name: 'IPO',
            link: "/procurements",
            isActive: false,
            hidden: !isPermit( userPermission?.SupplierOrderList, authPermissions )
        }

    ];
    return (
        <div>
            <Card className="mt-3 purchase-order-form">
                <ActionMenu breadcrumb={breadcrumb} title='Purchase Order' >

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
                                                <Select
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
                                                <Select
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
                                    <Col hidden={!isPurchaseOrderDataLoading}>
                                        <CustomPreLoader />
                                    </Col>
                                    <Col hidden={isPurchaseOrderDataLoading}>
                                        <div className='divider divider-left '>
                                            <div className='divider-text text-secondary font-weight-bolder'>Order Details</div>
                                        </div>
                                        <DataTable
                                            pagination
                                            noHeader
                                            responsive
                                            data={stylePurchaseOrderDetails}
                                            className='react-custom-dataTable-other'
                                            persistTableHead
                                            dense
                                            expandableRows
                                            // expandableIcon={{ collapsed: <Trash2 hidden /> }}
                                            // expandableRows={!stylePurchaserOrder?.style?.isSetStyle}
                                            expandableRowExpanded={row => row.rowExpanded}
                                            expandableRowDisabled={row => !row.orderId}
                                            onRowExpandToggled={( expanded, row ) => { handleExpandRowOnClick( row.rowId, row.orderQuantitySizeAndColor, row.orderId, row.isDetailQuantityExist, expanded ); }}
                                            expandableRowsComponent={stylePurchaserOrder?.isSetStyle ? <ExpandableSetOrderQuantitySizeAndColorForm data={data => data} /> : < ExpandableOrderQuantitySizeAndColorForm data={data => data} />}
                                            // onRowDoubleClicked={( row ) => { handleRowEditable( row.rowId ); }}
                                            paginationTotalRows={stylePurchaseOrderDetails.length}
                                            columns={[
                                                {
                                                    id: "sl",
                                                    // style: { backgroundColor: 'red', position: 'fixed' },
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
                                                    width: '140px',
                                                    ignoreRowClick: true,
                                                    // style: { backgroundColor: 'red', position: 'fixed' },

                                                    selector: 'actions',
                                                    center: true,
                                                    cell: ( row, index ) => <span>
                                                        {
                                                            isPermit( userPermission?.PurchaseOrderCreate, authPermissions ) && (
                                                                <Button.Ripple id="copyId"
                                                                    tag={Label}
                                                                    onClick={() => { handleDuplicateOrderDetailsRow( row.rowId ); }}
                                                                    className='btn-icon p-0 '
                                                                    color='flat-success'
                                                                    disabled={!isValidStatus || isRowEditable}

                                                                >
                                                                    <Copy size={18} id="copyId" color="green" />
                                                                </Button.Ripple>

                                                            )
                                                        }
                                                        {
                                                            isPermit( userPermission?.PurchaseOrderEdit, authPermissions ) && (
                                                                <Button.Ripple id="editRowId"
                                                                    tag={Label}
                                                                    hidden={row.isEditable}
                                                                    onClick={() => { handleRowEditable( row.rowId ); }}
                                                                    className='btn-icon p-0 ml-1'
                                                                    color='flat-success'
                                                                    disabled={!isValidStatus || isRowEditable}

                                                                >
                                                                    <Edit3 size={18} id="editRowId" color='green' />
                                                                </Button.Ripple>
                                                            )
                                                        }
                                                        {
                                                            ( isPermit( userPermission?.PurchaseOrderEdit, authPermissions ) ||
                                                                isPermit( userPermission?.PurchaseOrderCreate, authPermissions ) ) && (
                                                                <Button.Ripple id="saveId"
                                                                    tag={Label}
                                                                    hidden={!row.isEditable}

                                                                    // disabled={( orderDetails.length === 1 )}
                                                                    onClick={() => { handleSingleSubmit( row.rowId, index ); }}
                                                                    className='btn-icon p-0 ml-1'
                                                                    color='flat-success'
                                                                >
                                                                    <Check size={18} id="saveId" color='green' />
                                                                </Button.Ripple>
                                                            )
                                                        }


                                                        <Button.Ripple id="cancelEdit"
                                                            tag={Label}
                                                            hidden={!row.isEditable || row.orderId === 0}
                                                            onClick={() => { handleRowEditableCancel( row ); }}
                                                            className='btn-icon p-0 ml-1'
                                                            color='flat-danger'
                                                        >
                                                            <X size={18} id="cancelEdit" color='red' />
                                                        </Button.Ripple>

                                                        {
                                                            isPermit( userPermission?.PurchaseOrderDelete, authPermissions ) && (
                                                                <Button.Ripple id="deleteFabId"
                                                                    tag={Label}
                                                                    // hidden={row.isEditable && row.orderId !== 0}
                                                                    // disabled={( orderDetails.length === 1 )}
                                                                    onClick={() => { handleRemoveOrderDetailsRow( row.rowId, row.orderId ); }}
                                                                    className='btn-icon p-0 ml-1'
                                                                    color='flat-danger'
                                                                >
                                                                    <MinusSquare size={18} id="deleteFabId" color="red" />
                                                                </Button.Ripple>
                                                            )
                                                        }
                                                        {
                                                            ( !isPermit( userPermission?.PurchaseOrderDelete, authPermissions ) && row.orderId === 0 ) && (
                                                                <Button.Ripple id="deleteFabId"
                                                                    tag={Label}
                                                                    // hidden={row.isEditable && row.orderId !== 0}
                                                                    // disabled={( orderDetails.length === 1 )}
                                                                    onClick={() => { handleRemoveOrderDetailsRow( row.rowId, row.orderId ); }}
                                                                    className='btn-icon p-0 ml-1'
                                                                    color='flat-danger'
                                                                >
                                                                    <MinusSquare size={18} id="deleteFabId" color="red" />
                                                                </Button.Ripple>
                                                            )
                                                        }


                                                    </span>
                                                },
                                                {
                                                    id: "styleNumber",
                                                    reorder: true,
                                                    name: 'Style No',
                                                    minWidth: '120px',
                                                    sortable: true,
                                                    selector: row => row.styleNumber,
                                                    center: true,
                                                    cell: row => row.styleNumber
                                                },
                                                {
                                                    id: "orderNumber",
                                                    reorder: true,
                                                    name: 'PO No',
                                                    minWidth: '200px',
                                                    sortable: true,
                                                    selector: row => row.orderNumber,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <Input
                                                            type="text"
                                                            invalid={!!( ( row.isFieldError && !row.orderNumber.trim().length ) )}
                                                            name="orderNumber"
                                                            bsSize="sm"
                                                            value={row.orderNumber}
                                                            // invalid={stylePurchaseOrderDetails.some( order => row.orderNumber === order.orderNumber && row.sizeGroup?.value === order.sizeGroup?.value )}
                                                            //   invalid={stylePurchaseOrderDetails.filter( ( item, index ) => stylePurchaseOrderDetails.indexOf( item ) !== index )}
                                                            onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                            onFocus={( e ) => e.target.select()}
                                                        /> : row.orderNumber
                                                    )
                                                },
                                                {
                                                    id: "sizeGroupId",
                                                    reorder: true,
                                                    name: 'Size Group',
                                                    minWidth: '150px',
                                                    selector: row => row.sizeGroup?.label,
                                                    center: true,
                                                    sortable: true,
                                                    cell: row => (
                                                        row.isEditable ? <span className='w-100'> <Select
                                                            id='sizeGroupId'
                                                            name="sizeGroup"
                                                            isSearchable
                                                            isDisabled={stylePurchaserOrder?.isSizeSpecific}
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={stylePurchaserOrder?.isSetStyle ? dropdownSetStyleSizeGroups : singleStyleSizeGroups}
                                                            classNamePrefix="dropdown"
                                                            className={classnames( `erp-dropdown-select ${( ( row.isFieldError && !row.sizeGroup ) ) && 'is-invalid'}` )}
                                                            //   invalid={!!( ( row.isFieldError && !row.sizeGroup ) )}
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
                                                    minWidth: '150px',
                                                    selector: row => row.season?.label,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <span className='w-100'> <Select
                                                            id='seasonId'
                                                            name="season"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={dropDownSeasons}
                                                            classNamePrefix="dropdown"
                                                            className={classnames( `erp-dropdown-select ${( ( row.isFieldError && !row.season ) ) && 'is-invalid'}` )}
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
                                                    minWidth: '110px',
                                                    selector: row => row.year?.label,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <span className='w-100'> <Select
                                                            id='yearId'
                                                            name="year"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={selectYear}
                                                            classNamePrefix="dropdown"
                                                            className={classnames( `erp-dropdown-select ${( ( row.isFieldError && !row.year ) ) && 'is-invalid'}` )}
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
                                                    minWidth: '150px',
                                                    selector: row => row.deliveryDestination?.label,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <span className='w-100'> <Select
                                                            id='deliveryDestinationId'
                                                            name="deliveryDestination"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={destinationDropdownBuyerWise}
                                                            classNamePrefix="dropdown"
                                                            className={classnames( `erp-dropdown-select ${( ( row.isFieldError && !row.deliveryDestination ) ) && 'is-invalid'}` )}
                                                            value={row.deliveryDestination}
                                                            onChange={( data, e ) => {
                                                                handleDetailsDropdownOChange( data, e, row.rowId );
                                                            }}
                                                            onFocus={() => {
                                                                handleDestinationOnFocus( state?.buyer?.value );
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
                                                        row.isEditable ? <span className='w-100'> <Select
                                                            id='shipmentModeId'
                                                            name="shipmentMode"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={selectShipmentMode}
                                                            classNamePrefix="dropdown"
                                                            className={classnames( `erp-dropdown-select ${( ( row.isFieldError && !row.shipmentMode ) ) && 'is-invalid'}` )}
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
                                                            invalid={( row.isFieldError && ( handleDateFormat( row.shipmentDate ) <= handleDateFormat( row.orderDate ) ) )}
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
                                                            invalid={( row.isFieldError && ( ( handleDateFormat( row.inspectionDate ) >= handleDateFormat( row.shipmentDate ) ) || ( handleDateFormat( row.inspectionDate ) <= handleDateFormat( row.orderDate ) ) ) )}

                                                            value={moment( row.inspectionDate ).format( "yy-MM-DD" )}
                                                            onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                            onFocus={( e ) => e.target.select()}
                                                        /> : moment( row.inspectionDate ).format( "DD-MM-YYYY" )
                                                    )
                                                },
                                                {
                                                    id: "exporterId",
                                                    reorder: true,
                                                    name: 'Exporter',
                                                    minWidth: '150px',
                                                    selector: row => row.exporter?.label,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <span className='w-100'> <Select
                                                            id='exporterId'
                                                            name="exporter"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={selectPurchaser}
                                                            classNamePrefix="dropdown"
                                                            className={classnames( `erp-dropdown-select ${( ( row.isFieldError && !row.status ) ) && 'is-invalid'}` )}
                                                            innerRef={register( { required: true } )}
                                                            value={row.exporter}
                                                            onChange={( data, e ) => {
                                                                handleDetailsDropdownOChange( data, e, row.rowId );
                                                            }}
                                                        /> </span> : row?.exporter?.label ?? ''
                                                    )
                                                },

                                                // {
                                                //     id: "orderQuantity",
                                                //     reorder: true,
                                                //     name: 'Order Qty',
                                                //     minWidth: '100px',
                                                //     selector: row => row.orderQuantity,
                                                //     center: true,
                                                //     cell: row => (
                                                //         row.isEditable ? <Input
                                                //             type="number"
                                                //             className="text-right"
                                                //             name="orderQuantity"
                                                //             bsSize="sm"

                                                //             value={row.orderQuantity}
                                                //             onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                //             onFocus={( e ) => e.target.select()}
                                                //         /> : row.orderQuantity
                                                //     )
                                                // },
                                                {
                                                    id: "orderQuantity",
                                                    reorder: true,
                                                    name: 'Order Qty',
                                                    minWidth: '100px',
                                                    selector: row => row.orderQuantity,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <NumberFormat
                                                            //   className="form-control-sm form-control"
                                                            className={classnames( `form-control-sm form-control ${( ( row.isFieldError && row.orderQuantity === 0 ) ) && 'border-danger'}` )}

                                                            displayType="input"
                                                            value={row.orderQuantity}
                                                            name="orderQuantity"
                                                            decimalScale={0}
                                                            allowNegative={false}
                                                            fixedDecimalScale={true}
                                                            allowLeadingZeros={false}
                                                            onFocus={e => {
                                                                e.target.select();
                                                            }}
                                                            onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                            onBlur={( e ) => { handleInputOnChange( e, row.rowId ); }}
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
                                                        className={classnames( `form-control-sm form-control ${( ( row.isFieldError && row.ratePerUnit === 0 ) ) && 'border-danger'}` )}
                                                        displayType="input"
                                                        value={row.ratePerUnit}
                                                        name="ratePerUnit"
                                                        // thousandSeparator={true}
                                                        // thousandsGroupStyle="thousand"
                                                        decimalScale={4}
                                                        fixedDecimalScale={row.ratePerUnit > 0}
                                                        allowNegative={false}
                                                        allowLeadingZeros={false}
                                                        onFocus={e => {
                                                            e.target.select();
                                                        }}
                                                        onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                        onBlur={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                    /> : isZeroToFixed( row.ratePerUnit, 4 )
                                                    )
                                                },
                                                {
                                                    id: "amount",
                                                    reorder: true,
                                                    name: 'Amount',
                                                    minWidth: '100px',
                                                    selector: row => row.amount,
                                                    center: true,
                                                    cell: row => isZeroToFixed( row.orderQuantity * row.ratePerUnit, 4 )
                                                },
                                                {
                                                    id: "currencyId",
                                                    reorder: true,
                                                    name: 'Currency',
                                                    minWidth: '120px',
                                                    selector: row => row.currency.label,
                                                    sortable: true,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <span className='w-100'> <Select
                                                            id='currencyId'
                                                            name="currency"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={currencyDropdown}
                                                            classNamePrefix="dropdown"
                                                            className={classnames( `erp-dropdown-select ${( ( row.isFieldError && !row.currency ) ) && 'is-invalid'}` )}
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
                                                            decimalScale={4}
                                                            fixedDecimalScale={row.excessQuantityPercentage > 0}
                                                            allowNegative={false}
                                                            allowLeadingZeros={false}
                                                            onFocus={e => {
                                                                e.target.select();
                                                            }}
                                                            onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                            onBlur={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                        /> : isZeroToFixed( row.excessQuantityPercentage, 4 )
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
                                                            className="form-control-sm form-control "
                                                            displayType="input"
                                                            value={row.wastageQuantityPercentage}
                                                            name="wastageQuantityPercentage"
                                                            // thousandSeparator={true}
                                                            // thousandsGroupStyle="thousand"
                                                            decimalScale={4}
                                                            fixedDecimalScale={row.wastageQuantityPercentage > 0}
                                                            allowNegative={false}
                                                            allowLeadingZeros={false}
                                                            onFocus={e => {
                                                                e.target.select();
                                                            }}
                                                            onChange={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                            onBlur={( e ) => { handleInputOnChange( e, row.rowId ); }}
                                                        /> : isZeroToFixed( row.wastageQuantityPercentage, 4 )
                                                    )
                                                },
                                                {
                                                    id: "adjustedQuantity",
                                                    reorder: true,
                                                    name: 'Adj. Qty',
                                                    minWidth: '100px',
                                                    selector: row => row.adjustedQuantity,
                                                    center: true,
                                                    cell: row => row.adjustedQuantity
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

                                                {
                                                    id: "rc",
                                                    reorder: true,
                                                    name: 'RC',
                                                    width: '40px',
                                                    selector: 'actions',
                                                    center: true,
                                                    cell: row => <span className={`${row.isFieldError && ( row.orderId === 0 && row.orderQuantitySizeAndColor.length === 0 ) ? 'bg-danger' : ''}`}>
                                                        {
                                                            stylePurchaserOrder?.isSetStyle ? (
                                                                <Button.Ripple
                                                                    id="srcIds" tag={Label}
                                                                    className='btn-icon p-0 '
                                                                    color='flat-success'
                                                                    disabled={( stylePurchaserOrder.isColorSpecific && stylePurchaserOrder.isSizeSpecific )}
                                                                    onClick={() => {
                                                                        ( !stylePurchaserOrder.isColorSpecific && stylePurchaserOrder.isSizeSpecific ) ? handleOpenColorRation(
                                                                            row.rowId,
                                                                            row?.styleId,
                                                                            row?.sizeGroup?.value,
                                                                            row.orderQuantitySizeAndColor,
                                                                            row.isDetailQuantityExist,
                                                                            // row?.detailId,
                                                                            row?.orderId,
                                                                            row.orderQuantity
                                                                        ) : handleOpenSizeRation(
                                                                            row.rowId,
                                                                            row?.styleId,
                                                                            row?.sizeGroup?.value,
                                                                            row.orderQuantitySizeAndColor,
                                                                            row.isDetailQuantityExist,
                                                                            //  row?.detailId,
                                                                            row?.orderId,
                                                                            row.orderQuantity
                                                                        );
                                                                    }}
                                                                >
                                                                    <MoreVertical size={18} id="srcIds" color="purple" />
                                                                </Button.Ripple>
                                                            ) : <Button.Ripple
                                                                id="rcIds" tag={Label}
                                                                disabled={!row.isEditable}
                                                                className='btn-icon p-0'
                                                                color='flat-success'
                                                                onClick={() => {
                                                                    handleOpenColorSizeRation(
                                                                        row?.styleId,
                                                                        row?.sizeGroup?.value,
                                                                        row.rowId,
                                                                        row.orderQuantitySizeAndColor,
                                                                        //   row?.detailId,
                                                                        row?.orderId,
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
                                                    minWidth: '130px',
                                                    selector: row => row.status?.label,
                                                    center: true,
                                                    cell: row => (
                                                        row.isEditable ? <span className='w-100'> <Select
                                                            id='statusId'
                                                            name="status"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={orderStatus}
                                                            classNamePrefix="dropdown"
                                                            className={classnames( `erp-dropdown-select ${( ( row.isFieldError && !row.status ) ) && 'is-invalid'}` )}
                                                            innerRef={register( { required: true } )}
                                                            value={row.status}
                                                            onChange={( data, e ) => {
                                                                handleDetailsDropdownOChange( data, e, row.rowId );
                                                            }}
                                                        /> </span> : row?.status?.label ?? ''
                                                    )
                                                }

                                            ]}
                                        />
                                        {isPermit( userPermission?.PurchaseOrderCreate, authPermissions ) && (
                                            <Button.Ripple id="addRowId"
                                                tag={Label}
                                                disabled={isRowEditable}
                                                onClick={() => { handleAddOrderDetailsRow( stylePurchaseOrderDetails.length ); }}
                                                className='btn-icon '
                                                color='flat-success'
                                                hidden={!isValidStatus}

                                            >
                                                <PlusSquare size={18} id="addRowId" color="green" />
                                            </Button.Ripple>
                                        )}

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

export default StylePurchaseOrderAddForm;
import Spinner from '@components/spinner/Fallback-spinner';
import '@custom-styles/basic/custom-form.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import '@custom-styles/merchandising/others/po-details-table.scss';
import '@custom-styles/merchandising/select/po-details-select.scss';
import { baseAxios } from "@services";
import _ from 'lodash';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { Maximize2, Minimize2, MinusSquare, MoreVertical, PlusSquare, Settings } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import CreatableSelect from 'react-select/creatable';
import { Button, Card, CardBody, Col, Collapse, CustomInput, Form, FormGroup, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import ResizableTable from '../../../../utility/custom/ResizableTable';
import { defaultUnitId, selectCurrency, selectDestination, selectShipmentMode, selectYear } from '../../../../utility/enums';
import { isObjEmpty, randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getDefaultUOMDropdownByUnitId } from '../../../inventory/unit-sets/store/actions';
import { getCascadeDropDownBuyerAgents } from '../../buyer-agent/store/actions';
import { getDropDownBuyers } from '../../buyer/store/actions';
import { getDropDownSeasons } from '../../season/store/actions';
import { getDropDownSizeGroups } from '../../size-group/store/actions';
import { getOrderDropdownStatus } from '../../status/store/actions';
import { getDropDownSetStyles } from '../../style/set-style/store/actions';
import { getDropDownStyles, getSingleStyleSizeGroups } from '../../style/single-style/store/actions';
import { bindPurchaseOrderDetails, bindPurchaseOrderInfoOnchange, deletePODetails, getColorSizeRationByPODetailsId, getPOSizeColorQuantitySummaryDetails, getPurchaseOrderById, getPurchaseOrderDetails, updatePurchaseOrder } from '../store/actions';
import ColorSizeAdditionalFormModal from './ColorSizeAdditionalFormModal';
import POStyleDetailsForm from './POStyleDetailsForm';
import SizeColorRation from './SizeColorRation';
import SizeRationNewForm from './SizeRationNewForm';


const PurchaseOrderEditForm = () => {
    const { replace, push } = useHistory();
    const { state } = useLocation();

    const poId = state;
    const dispatch = useDispatch();
    const { selectedPurchaseOrder,
        purchaseOrderDetails,
        isPODetailsDeleted,
        quantityOnSizeAndColor,
        orderDetailsSizeColorQuantitySummary
    } = useSelector( ( { purchaseOrders } ) => purchaseOrders );
    const [openModal, setOpenModal] = useState( false );
    const { dropDownBuyers } = useSelector( ( { buyers } ) => buyers );
    const { dropDownBuyerAgents } = useSelector( ( { buyerAgents } ) => buyerAgents );
    const { dropDownSeasons } = useSelector( ( { seasons } ) => seasons );
    const { dropDownStyles, singleStyleSizeGroups } = useSelector( ( { styles } ) => styles );
    const { dropdownOrderStatus } = useSelector( ( { statuses } ) => statuses );
    const { dropDownSetStyles } = useSelector( ( { setStyles } ) => setStyles );

    const [currency, setCurrency] = useState( null );

    ///Single PO Color-Size Ration
    const [colorSizeRationEditIds, setColorSizeRationEditIds] = useState( null );

    const [isColorSizeRationOpen, setIsColorSizeRationOpen] = useState( false );
    const [isColorSizeRationEditOpen, setIsColorSizeRationEditOpen] = useState( false );
    ///Set PO Size Ration
    const [isSizeRationOpen, setIsSizeRationOpen] = useState( false );
    const [isSizeRationEditOpen, setIsSizeRationEditOpen] = useState( false );
    const { defaultUOMDropdown } = useSelector( ( { unitSets } ) => unitSets );

    //Form Submit
    const { register, errors, control, handleSubmit } = useForm();

    useEffect( () => {
        dispatch( getDropDownSeasons() );
        dispatch( getDropDownBuyers() );
        dispatch( getDropDownStyles() );
        dispatch( getDropDownSizeGroups() );
        dispatch( getDropDownSetStyles() );
        dispatch( getOrderDropdownStatus() );

    }, [] );

    useEffect( () => {
        dispatch( getPurchaseOrderById( poId ) );
        dispatch( getPurchaseOrderDetails( poId ) );
    }, [dispatch, poId] );

    const handleUOMOnFocus = ( unitId ) => {
        dispatch( getDefaultUOMDropdownByUnitId( unitId ) );
    };
    const handleBuyerDropdown = ( data ) => {
        if ( data ) {
            dispatch( getCascadeDropDownBuyerAgents( data.value ) );

            const purchaseOrderBasicInfoObj = {
                ...selectedPurchaseOrder,
                buyer: data,
                buyerId: data.value,
                buyerName: data?.label,
                agent: null,
                agentId: '',
                agentName: ''
            };
            dispatch( bindPurchaseOrderInfoOnchange( purchaseOrderBasicInfoObj ) );
        } else {
            const purchaseOrderBasicInfoObj = {
                ...selectedPurchaseOrder,
                buyer: null,
                buyerId: '',
                buyerName: '',
                agent: null,
                agentId: '',
                agentName: ''
            };
            dispatch( bindPurchaseOrderInfoOnchange( purchaseOrderBasicInfoObj ) );
            dispatch( getCascadeDropDownBuyerAgents( null ) );
        }
    };
    const handleAgentDropdown = ( data ) => {
        if ( data ) {
            const purchaseOrderBasicInfoObj = {
                ...selectedPurchaseOrder,
                agent: data,
                agentId: data.value,
                agentName: data.label
            };
            dispatch( bindPurchaseOrderInfoOnchange( purchaseOrderBasicInfoObj ) );
        } else {
            const purchaseOrderBasicInfoObj = {
                ...selectedPurchaseOrder,
                agent: null,
                agentId: '',
                agentName: ''
            };
            dispatch( bindPurchaseOrderInfoOnchange( purchaseOrderBasicInfoObj ) );
        }
    };
    const handleSeasonDropdown = ( data ) => {
        if ( data ) {
            const purchaseOrderBasicInfoObj = {
                ...selectedPurchaseOrder,
                seasonValue: data,
                season: data.label
            };
            dispatch( bindPurchaseOrderInfoOnchange( purchaseOrderBasicInfoObj ) );
        } else {
            const purchaseOrderBasicInfoObj = {
                ...selectedPurchaseOrder,
                seasonValue: null,
                season: ''
            };
            dispatch( bindPurchaseOrderInfoOnchange( purchaseOrderBasicInfoObj ) );
        }
    };
    const handleYearDropdown = ( data ) => {
        if ( data ) {
            const purchaseOrderBasicInfoObj = {
                ...selectedPurchaseOrder,
                yearValue: data,
                year: data.label
            };
            dispatch( bindPurchaseOrderInfoOnchange( purchaseOrderBasicInfoObj ) );
        } else {
            const purchaseOrderBasicInfoObj = {
                ...selectedPurchaseOrder,
                yearValue: null,
                year: ''
            };
            dispatch( bindPurchaseOrderInfoOnchange( purchaseOrderBasicInfoObj ) );
        }
    };
    const handleCurrencyDropdown = ( data ) => {
        if ( data ) {
            const purchaseOrderBasicInfoObj = {
                ...selectedPurchaseOrder,
                currencyValue: data,
                currencyCode: data.label
            };
            dispatch( bindPurchaseOrderInfoOnchange( purchaseOrderBasicInfoObj ) );
        } else {
            const purchaseOrderBasicInfoObj = {
                ...selectedPurchaseOrder,
                currencyValue: null,
                currencyCode: ''
            };
            dispatch( bindPurchaseOrderInfoOnchange( purchaseOrderBasicInfoObj ) );
        }
    };
    const sumOfTotalQuantity = () => {
        const total = _.sum( purchaseOrderDetails.map( i => Number( i.orderQuantity ) ) );
        return total;
    };
    const sumOfTotalAmount = () => {
        const total = _.sum( purchaseOrderDetails.map( i => Number( i.amount ) ) );
        return total;
    };

    const handleInputOnChangeOrderMasterInfo = ( e ) => {
        const { name, value, type } = e.target;
        const purchaseOrderBasicInfoObj = {
            ...selectedPurchaseOrder,
            [name]: ( type === "number" ) ? Number( value ) : ( type === "date" ) ? moment( value ).format( 'yy-MM-DD' ) : value
        };
        dispatch( bindPurchaseOrderInfoOnchange( purchaseOrderBasicInfoObj ) );

    };


    const handleInputOnChangeForOrderDetails = ( e, fieldId ) => {
        const { name, value, type } = e.target;
        const updatedData = purchaseOrderDetails.map( od => {
            if ( fieldId === od.fieldId ) {
                if ( name === "orderQuantity" || name === "ratePerUnit" ) {
                    od["amount"] = name === "orderQuantity" ? Number( value ) * Number( od.ratePerUnit ) : Number( od.orderQuantity ) * Number( value );
                    od[name] = ( type === "number" ) ? Number( value ) : ( type === "date" ) ? moment( value ).format( 'yy-MM-DD' ) : value;
                } else {
                    od[name] = type === "number" ? Number( value ) : ( type === "date" ) ? moment( value ).format( 'yy-MM-DD' ) : value;
                }
            }
            return od;
        } );
        dispatch( bindPurchaseOrderDetails( updatedData ) );
    };

    const handleCollapsibleTableOpen = ( fieldId, detailsId, colorSizeQuantity, isDetailQuantityExist ) => {

        if ( !colorSizeQuantity.length && isDetailQuantityExist ) {

            baseAxios.get( `${merchandisingApi.purchaseOrder.root}/orderDetails/${detailsId}/quantityOnSizeAndColor` )
                .then(
                    response => {
                        const sizeColorDetails = response.data.map( rb => ( {
                            fieldId: randomIdGenerator(),
                            id: rb.id,
                            styleNo: rb.styleNo,
                            styleId: rb.styleId,
                            sizeId: rb.sizeId,
                            sizeName: rb.size,
                            colorId: rb.colorId,
                            colorName: rb.color,
                            quantity: rb.quantity,
                            ratio: rb.ratio,
                            adjustedQuantity: rb.adjustedQuantity,
                            sampleQuantity: rb.sampleQuantity,
                            wastagePercentage: rb.wastagePercentage,
                            excessPercentage: rb.excessPercentage,
                            isInRatio: rb.isInRatio
                        } ) );
                        const updatedData = purchaseOrderDetails.map( od => {
                            if ( fieldId === od.fieldId ) {
                                od.isOpenDetails = !od.isOpenDetails;
                                od.colorSizeQuantity = sizeColorDetails;
                            }
                            return od;
                        } );
                        dispatch( bindPurchaseOrderDetails( updatedData ) );
                    }
                );
        } else {
            const updatedData = purchaseOrderDetails.map( od => {
                if ( fieldId === od.fieldId ) {
                    od.isOpenDetails = !od.isOpenDetails;
                }
                return od;
            } );
            dispatch( bindPurchaseOrderDetails( updatedData ) );
        }
    };


    const handleRemoveOrderDetailsRow = ( fieldId, orderId, detailsId ) => {
        if ( detailsId ) {
            dispatch( deletePODetails( orderId, detailsId ) );
            if ( isPODetailsDeleted ) {
                const updatedData = [...purchaseOrderDetails];
                updatedData.splice(
                    updatedData.findIndex( x => x.fieldId === fieldId ),
                    1
                );
                dispatch( bindPurchaseOrderDetails( updatedData ) );

            }
        } else {
            const updatedData = [...purchaseOrderDetails];
            updatedData.splice(
                updatedData.findIndex( x => x.fieldId === fieldId ),
                1
            );
            dispatch( bindPurchaseOrderDetails( updatedData ) );
        }
        // handlePODetails();
    };
    const handleOpenStyleDetailsForm = ( params ) => {

    };
    ///For Details a Row Add
    const handleAddOrderDetailsRow = ( totalIndexNo ) => {
        const newRow = {
            fieldId: randomIdGenerator(),
            rowNo: totalIndexNo + 1,
            id: 0,
            purchaseOrderId: poId,
            styleId: null,
            styleNo: null,
            sizeGroupId: null,
            sizeGroupName: null,
            sizeGroupDropdown: [],
            destination: null,
            deliveryDestination: '',
            orderQuantity: 0,
            orderUOMRelativeFactor: 0,
            orderUOM: null,
            shipmentMode: null,
            shipmentDate: moment( new Date() ).format( 'yy-MM-DD' ),
            inspectionDate: moment( new Date() ).format( 'yy-MM-DD' ),
            ratePerUnit: 0,
            excessQuantityPercentage: 0,
            wastageQuantityPercentage: 0,
            adjustedQuantity: 0,
            status: 0,
            isDetailQuantityExist: false,
            amount: 0,
            isOpenDetails: false,
            colorSizeQuantity: []
        };

        dispatch( bindPurchaseOrderDetails( [...purchaseOrderDetails, newRow] ) );

    };

    const handleStyleDropdown = async ( newValue, fieldId, id ) => {
        await baseAxios.get( `${merchandisingApi.style.get_style_sizes}/${newValue.value}/sizeGroups` )
            .then( response => {
                const updatedData = purchaseOrderDetails.map( i => {
                    if ( fieldId === i.fieldId ) {
                        i.styleId = newValue.value;
                        i.styleNo = newValue.label;
                        i.style = newValue;
                        i.sizeGroupDropdown = response?.data?.map( sg => ( {
                            value: sg.id,
                            label: sg.name
                        } ) );
                        i.sizeGroup = null;
                    }
                    return i;
                } );
                dispatch( bindPurchaseOrderDetails( updatedData ) );
            } );
    };

    const handleSizeGroupOnFocus = ( styleId ) => {
        dispatch( getSingleStyleSizeGroups( styleId ) );
    };


    const handleSizeGroupsDropdown = ( newValue, fieldId ) => {
        const updatedData = purchaseOrderDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.sizeGroupId = newValue.value;
                i.sizeGroupName = newValue.label;
                i.sizeGroup = newValue;
            }
            return i;
        } );
        dispatch( bindPurchaseOrderDetails( updatedData ) );
    };
    const handleDestinationDropdown = ( newValue, fieldId ) => {
        const updatedData = purchaseOrderDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.deliveryDestination = newValue.label;
                i.destinationDropDown = newValue;
            }
            return i;
        } );
        dispatch( bindPurchaseOrderDetails( updatedData ) );
    };

    const handleShipmentModeDropdown = ( newValue, fieldId ) => {
        const updatedData = purchaseOrderDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.shipmentMode = newValue.label;
                i.shipmentModeDropDown = newValue;
            }
            return i;
        } );
        dispatch( bindPurchaseOrderDetails( updatedData ) );
    };

    const handleUnitDropdown = ( newValue, fieldId ) => {
        const updatedData = purchaseOrderDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.orderUOM = newValue.label;
                i.orderUOMDropDown = newValue;
                i.orderUOMRelativeFactor = newValue.relativeFactor;
            }
            return i;
        } );
        dispatch( bindPurchaseOrderDetails( updatedData ) );
    };
    const handleActionStatusDropdown = ( newValue, fieldId ) => {
        const updatedData = purchaseOrderDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.status = newValue.label;
                i.statusDropDown = newValue;
            }
            return i;
        } );
        dispatch( bindPurchaseOrderDetails( updatedData ) );
    };
    // console.log( 'purchaseOrderDetails', JSON.stringify( purchaseOrderDetails, null, 2 ) );
    const onSubmit = () => {
        if ( isObjEmpty( errors ) ) {
            const odArray = purchaseOrderDetails.map( pod => ( {
                rowNo: pod.rowNo,
                detailId: pod.id,
                purchaseOrderId: pod.purchaseOrderId,
                styleId: pod.styleId,
                styleNo: pod.styleNo,
                sizeGroupId: pod.sizeGroupId,
                sizeGroupName: pod.sizeGroupName,
                deliveryDestination: pod.deliveryDestination,
                orderQuantity: pod.orderQuantity,
                orderUOMRelativeFactor: pod.orderUOMRelativeFactor,
                orderUOM: pod.orderUOM,
                shipmentMode: pod.shipmentMode,
                shipmentDate: moment( new Date( pod.shipmentDate ) ).format( 'yy-MM-DD' ),
                inspectionDate: moment( new Date( pod.inspectionDate ) ).format( 'yy-MM-DD' ),
                ratePerUnit: pod.ratePerUnit,
                excessQuantityPercentage: pod.excessQuantityPercentage,
                wastageQuantityPercentage: pod.wastageQuantityPercentage,
                status: pod.status,
                isDetailQuantityExist: pod.isDetailQuantityExist,
                amount: pod.orderQuantity * pod.ratePerUnit,
                orderQuantitySizeAndColor: pod.colorSizeQuantity?.map( color => ( {
                    // styleId: color?.styleId,
                    // asrtValue: color.asrtValue,
                    // sizeId: s.sizeId,
                    // sizeName: s.sizeName,
                    // colorId: c.colorId,
                    // colorName: c.colorName,
                    // quantity: isRation ? 0 : s.quantity,
                    // ratio: isRation ? s.quantity : 0,
                    // isInRatio: isRation,
                    // adjustedQuantity: s.adjustedQuantity,
                    // sampleQuantity: s.sampleQuantity,
                    // wastagePercentage: s.wastagePercentage,
                    // excessPercentage: s.excessPercentage,

                    styleId: color.styleId,
                    sizeId: color.sizeId,
                    size: color.sizeName,
                    colorId: color.colorId,
                    color: color.colorName,
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
            const obj = {
                buyerId: selectedPurchaseOrder?.buyerId,
                buyerName: selectedPurchaseOrder?.buyerName,
                agentId: selectedPurchaseOrder.agent ? selectedPurchaseOrder?.agentId : null,
                agentName: selectedPurchaseOrder.agent ? selectedPurchaseOrder?.agentName : null,
                merchandiserId: null,
                orderNumber: selectedPurchaseOrder.orderNumber,
                orderDate: selectedPurchaseOrder.orderDate,
                season: selectedPurchaseOrder?.season,
                year: selectedPurchaseOrder?.year,
                currencyCode: selectedPurchaseOrder?.currencyCode,
                remarks: selectedPurchaseOrder.remarks,
                description: selectedPurchaseOrder.description,
                isSetOrder: selectedPurchaseOrder.isSetOrder,
                // totalOrderQuantity: purchaseOrderInfo.totalOrderQuantity,
                orderDetails: odArray
            };
            console.log( JSON.stringify( obj, null, 2 ) );
            dispatch( updatePurchaseOrder( obj, poId, push ) );
            // if ( isPOUpdated ) {
            //     handlePODetails();
            //     console.log( 'DONE' );
            // }
        }
    };


    // console.log( orderDetails );
    const [sizeQuantityDetails, setSizeQuantityDetails] = useState( [] );
    const [sizeRationIds, setSizeRationIds] = useState( null );
    const [colorSizeRationIds, setColorSizeRationIds] = useState( null );

    const handleOpenColorSizeRation = ( styleId, sizeGroupId, rowId, colorSizeQuantity, orderDetailsId, quantityExit ) => {

        setIsColorSizeRationOpen( !isColorSizeRationOpen );
        if ( colorSizeQuantity.length ) {
            setColorSizeRationIds(
                {
                    styleId,
                    sizeGroupId,
                    rowId,
                    colorSizeQuantity: colorSizeQuantity.map( cs => ( { ...cs, fieldId: randomIdGenerator() } ) )
                }

            );
        } else {
            if ( quantityExit ) {
                baseAxios.get( `${merchandisingApi.purchaseOrder.root}/orderDetails/${orderDetailsId}/quantityOnSizeAndColor` )
                    .then(
                        response => {
                            console.log( response.data );

                            const sizeColorDetails = response.data.map( rb => ( {
                                fieldId: randomIdGenerator(),
                                id: rb.id,
                                styleNo: rb.styleNo,
                                styleId: rb.styleId,
                                sizeId: rb.sizeId,
                                sizeName: rb.size,
                                colorId: rb.colorId,
                                color: rb.color,
                                quantity: rb.quantity,
                                ratio: rb.ratio,
                                adjustedQuantity: rb.adjustedQuantity,
                                sampleQuantity: rb.sampleQuantity,
                                wastagePercentage: rb.wastagePercentage,
                                excessPercentage: rb.excessPercentage,
                                isInRatio: rb.isInRatio
                            } ) );
                            setColorSizeRationIds(
                                {
                                    styleId,
                                    sizeGroupId,
                                    rowId,
                                    colorSizeQuantity: sizeColorDetails
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
                        colorSizeQuantity: []
                    }
                );
            }
        }
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

    const handleOpenColorSizeRationEdit = ( styleId, sizeGroupId, orderId, orderDetailsId ) => {
        const obj = {
            styleId,
            sizeGroupId,
            orderId,
            orderDetailsId
        };

        dispatch( getColorSizeRationByPODetailsId( orderDetailsId ) );

        setColorSizeRationEditIds( obj );
        setIsColorSizeRationEditOpen( !isColorSizeRationEditOpen );
    };

    const handleOpenSizeRation = ( styleId, colorSizeQuantity, rowId, quantityExit, poDetailsId ) => {
        setSizeRationIds(
            {
                styleId,
                rowId
            }
        );
        if ( colorSizeQuantity.length ) {
            setSizeQuantityDetails( colorSizeQuantity.map( cs => ( { ...cs, fieldId: randomIdGenerator() } ) ) );
            setIsSizeRationOpen( !isSizeRationOpen );

        } else {
            if ( quantityExit ) {
                baseAxios.get( `${merchandisingApi.purchaseOrder.root}/orderDetails/${poDetailsId}/quantityOnSizeAndColor` )
                    .then(
                        response => {
                            console.log( response.data );

                            const sizeColorDetails = response.data.map( rb => ( {
                                fieldId: randomIdGenerator(),
                                id: rb.id,
                                styleNo: rb.styleNo,
                                styleId: rb.styleId,
                                sizeId: rb.sizeId,
                                size: rb.size,
                                colorId: rb.colorId,
                                color: rb.color,
                                quantity: rb.quantity,
                                ratio: rb.ratio,
                                isInRatio: rb.isInRatio
                            } ) );
                            setSizeQuantityDetails( sizeColorDetails );
                        }
                    );
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

        }
    };
    const handleColorSizeBindingOnRow = ( rowId, quantity ) => {
        const updatedData = purchaseOrderDetails.map( details => {
            if ( rowId === details.fieldId ) {
                details['colorSizeQuantity'] = quantity;
            }
            return details;
        } );
        dispatch( bindPurchaseOrderDetails( updatedData ) );
        //  setSizeRationIds( null );
    };
    const handleOpenSizeRationEdit = ( styleId, sizeGroupId, orderId, orderDetailsId, orderQuantity ) => {
        const obj = {
            styleId,
            sizeGroupId,
            orderId,
            orderDetailsId,
            orderQuantity
        };
        // console.log( obj, null, 2 );
        setColorSizeRationEditIds( obj );
        dispatch( getColorSizeRationByPODetailsId( orderDetailsId ) );

        setIsSizeRationEditOpen( !isSizeRationOpen );
    };


    const groupedByColor = _.groupBy( orderDetailsSizeColorQuantitySummary, function ( d ) {
        return d.color;
    } );
    const groupByStyleNo = _.groupBy( orderDetailsSizeColorQuantitySummary, function ( d ) {
        return d.styleNo;
    } );


    const handlePODetailsQuantity = ( details, orderId, detailsId ) => {
        const modifiedDetails = details.map( additionalQty => ( {
            orderId,
            detailsId,
            id: additionalQty.id,
            color: additionalQty.color,
            colorId: additionalQty.colorId,
            quantity: additionalQty.quantity,
            size: additionalQty.size,
            sizeId: additionalQty.sizeId,
            styleId: additionalQty.styleId,
            styleNo: additionalQty.styleNo,
            excessPercentage: additionalQty?.excessPercentage,
            wastagePercentage: additionalQty?.wastagePercentage,
            sampleQuantity: additionalQty?.sampleQuantity,
            adjustedQuantity: additionalQty?.adjustedQuantity
        } ) );
        dispatch( getPOSizeColorQuantitySummaryDetails( modifiedDetails ) );
        setOpenModal( !openModal );
    };

    const handleReset = () => {
        dispatch( getPurchaseOrderById( null ) );
        dispatch( getPurchaseOrderDetails( null ) );
    };

    const handleCancel = () => {
        replace( '/purchase-order' );
        handleReset();
    };

    const handleAddNew = () => {
        push( '/new-purchase-order' );
        handleReset();
    };

    const checkLoading = !selectedPurchaseOrder;

    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },
        {
            id: 'poList',
            name: 'List',
            link: "/purchase-order",
            isActive: false,
            state: null

        },
        {
            id: 'costing',
            name: 'Costing',
            link: "/new-costing",
            isActive: false,
            state: {
                orderId: poId,
                orderNumber: selectedPurchaseOrder?.orderNumber,
                buyerId: selectedPurchaseOrder?.buyerId,
                buyerName: selectedPurchaseOrder?.buyerName
            }

        },
        {
            id: 'consumption',
            name: 'Consumption',
            link: "#",
            isActive: false,
            state: null
        }
    ];
    return (
        <div>
            {
                checkLoading ? <Spinner /> : (
                    <Card className="mt-3">
                        <CardBody>
                            <Form onSubmit={handleSubmit( onSubmit )}>
                                <ActionMenu breadcrumb={breadcrumb} title='Edit Purchase Order' >
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
                                    <NavItem className="mr-1" >
                                        <NavLink
                                            tag={Button}
                                            size="sm"
                                            color="success"
                                            onClick={() => { handleAddNew(); }}                    >
                                            Add New
                                        </NavLink>
                                    </NavItem>
                                </ActionMenu>
                                <Row >
                                    <Col>
                                        <div className='divider divider-left '>
                                            <div className='divider-text text-secondary font-weight-bolder'>Master Info</div>
                                        </div>
                                        <div className="border rounded rounded-3 p-1">
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='shipmentModeId'> Buyer PO No</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <Input
                                                                id="orderNumberId"
                                                                type="text"
                                                                name="orderNumber"
                                                                bsSize="sm"
                                                                placeholder="Buyer Purchase Order No"
                                                                value={selectedPurchaseOrder?.orderNumber}
                                                                onChange={( e ) => { handleInputOnChangeOrderMasterInfo( e ); }}
                                                            // innerRef={register( { required: true } )}
                                                            // className={classnames( { 'is-invalid': errors['buyerOrderNo'] } )}
                                                            />
                                                            {/* {errors && errors.buyerOrderNo && <FormFeedback>Buyer PO No is required!</FormFeedback>} */}
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='shipmentModeId'> Purchase Order Date</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <Input
                                                                id="orderDateId"
                                                                type="date"
                                                                name="orderDate"
                                                                bsSize="sm"
                                                                placeholder="Purchase Order Date"
                                                                value={moment( new Date( selectedPurchaseOrder?.orderDate ) ).format( 'yy-MM-DD' )}
                                                                onChange={( e ) => { handleInputOnChangeOrderMasterInfo( e ); }}
                                                            // innerRef={register( { required: true } )}
                                                            // className={classnames( { 'is-invalid': errors['purchaseOrderDate'] } )}
                                                            />
                                                            {/* {errors && errors.purchaseOrderDate && <FormFeedback>Purchase Order Date is required!</FormFeedback>} */}
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
                                                                value={selectedPurchaseOrder?.description}
                                                                onChange={( e ) => { handleInputOnChangeOrderMasterInfo( e ); }}
                                                            // innerRef={register( { required: true } )}
                                                            // className={classnames( { 'is-invalid': errors['remarks'] } )}
                                                            />
                                                            {/* {errors && errors.purchaseOrderDate && <FormFeedback>Purchase Order Date is required!</FormFeedback>} */}
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
                                                                value={selectedPurchaseOrder?.seasonValue}
                                                                onChange={data => {
                                                                    handleSeasonDropdown( data );
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
                                                                isClearable
                                                                theme={selectThemeColors}
                                                                options={dropDownBuyers}
                                                                captureMenuScroll
                                                                classNamePrefix='dropdown'
                                                                className="erp-dropdown-select"
                                                                value={selectedPurchaseOrder?.buyer}
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
                                                                isClearable
                                                                theme={selectThemeColors}
                                                                options={dropDownBuyerAgents}
                                                                classNamePrefix='dropdown'
                                                                className="erp-dropdown-select"
                                                                value={selectedPurchaseOrder?.agent}
                                                                onChange={data => {
                                                                    handleAgentDropdown( data );
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
                                                                value={selectedPurchaseOrder?.yearValue}
                                                                onChange={data => {
                                                                    handleYearDropdown( data );
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
                                                                // innerRef={register( { required: true } )}
                                                                // className={classnames( 'react-select', { 'is-invalid': currency === null } )}
                                                                value={selectedPurchaseOrder?.currencyValue}
                                                                defaultValue={currency}
                                                                onChange={data => {
                                                                    handleCurrencyDropdown( data );
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
                                                                disabled
                                                                className="text-right"
                                                                type="number"
                                                                bsSize="sm"
                                                                name="totalOrderQuantity"
                                                                // defaultValue={purchaseOrderInfo?.totalOrderQuantity}
                                                                value={sumOfTotalQuantity()}
                                                                onChange={e => e.preventDefault()}

                                                            // innerRef={register( { required: false } )}
                                                            // className={classnames( 'text-right' )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='shipmentModeId'>Total Amount</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <Input
                                                                disabled
                                                                id="totalAmountId"
                                                                type="number"
                                                                name="totalAmount"
                                                                bsSize="sm"
                                                                // value={sumOfTotalAmount()}
                                                                value={selectedPurchaseOrder?.totalOrderAmount}
                                                                onChange={e => e.preventDefault()}
                                                            // innerRef={register( { required: false } )}
                                                            // className={classnames( 'text-right' )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='shipmentModeId'>Is it Set order?</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <div className="po-set-switch">
                                                                <CustomInput
                                                                    // classNamePrefix="switch"
                                                                    type='switch'
                                                                    id='set-order-Id'
                                                                    label='Yes'
                                                                    checked={selectedPurchaseOrder?.isSetOrder}
                                                                    onChange={e => { e.preventDefault(); }}
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
                                                                defaultValue={selectedPurchaseOrder?.remarks}
                                                                onChange={( e ) => { handleInputOnChangeOrderMasterInfo( e ); }}
                                                            // innerRef={register( { required: true } )}
                                                            // className={classnames( { 'is-invalid': errors['remarks'] } )}
                                                            />
                                                            {/* {errors && errors.remarks && <FormFeedback>Remarks No is required!</FormFeedback>} */}
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>

                                    </Col>

                                </Row>
                                <Row>
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
                                                                    <th style={{ minWidth: '4px' }} ><strong>SL</strong></th>
                                                                    <th style={{ minWidth: '4px' }} ><strong>#</strong></th>
                                                                    <th style={{ minWidth: '119px' }}><strong>Style</strong></th>
                                                                    <th style={{ minWidth: '109px' }} ><strong>Size Range</strong></th>
                                                                    <th style={{ minWidth: '109px' }}><strong>Destination</strong></th>
                                                                    <th style={{ minWidth: '109px' }}><strong>Shipment Mode</strong></th>
                                                                    <th ><strong>Shipment Date</strong></th>
                                                                    <th ><strong>Inspection Date</strong></th>
                                                                    <th ><strong>Order Qty</strong></th>
                                                                    <th className={selectedPurchaseOrder?.isSetOrder ? 'd-none' : 'd'} ><strong>Order UOM</strong></th>
                                                                    <th ><strong>Rate</strong></th>
                                                                    <th ><strong>Amount</strong></th>
                                                                    <th ><strong>Excess (%)</strong></th>
                                                                    <th ><strong>Wastage (%)</strong></th>
                                                                    <th ><strong>Adjusted Qty</strong></th>
                                                                    {/* <th className=' text-center'><strong>Exporter</strong></th> */}
                                                                    {/* <th style={{ minWidth: '5px' }}  ><strong>CS</strong></th>
                                                <th style={{ minWidth: '5px' }}  ><strong>SCSS</strong></th> */}
                                                                    <th style={{ minWidth: '5px' }}  ><strong>RC</strong></th>
                                                                    <th ><strong>Status</strong></th>
                                                                    <th  ><strong>Action</strong></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="text-center">
                                                                {
                                                                    purchaseOrderDetails?.map( i => (
                                                                        <Fragment key={i.fieldId + i.fieldId} >
                                                                            <tr key={i.fieldId}>
                                                                                <td style={{ minWidth: '4px' }} >
                                                                                    {i.rowNo}
                                                                                </td>
                                                                                <td style={{ minWidth: '4px' }} >
                                                                                    <Button.Ripple for="collapseId" tag={Label} onClick={() => { handleCollapsibleTableOpen( i.fieldId, i.id, i.colorSizeQuantity, i?.id, i.isDetailQuantityExist ); }} className='btn-icon' color='flat-primary' >
                                                                                        <Maximize2 className={i.isOpenDetails ? 'd-none' : 'd'} id="collapseId" size={15} color="#7367f0" />
                                                                                        <Minimize2 className={i.isOpenDetails ? 'd' : 'd-none'} id="collapseId" size={15} color="#28c76f" />
                                                                                    </Button.Ripple>

                                                                                </td>
                                                                                <td className="text-nowrap pl-1 pr-1">
                                                                                    {
                                                                                        selectedPurchaseOrder?.isSetOrder ? <CreatableSelect
                                                                                            id='styleId'
                                                                                            name="style"
                                                                                            isSearchable
                                                                                            isDisabled={!!i.id}
                                                                                            menuPosition={'fixed'}
                                                                                            theme={selectThemeColors}
                                                                                            options={dropDownSetStyles}
                                                                                            classNamePrefix='dropdown'
                                                                                            className="erp-dropdown-select"
                                                                                            value={i.style}
                                                                                            onChange={data => {
                                                                                                handleStyleDropdown( data, i.fieldId );
                                                                                            }}
                                                                                        /> : <CreatableSelect
                                                                                            id='styleId'
                                                                                            name="style"
                                                                                            isSearchable
                                                                                            menuPosition={'fixed'}
                                                                                            isDisabled={!!i.id}
                                                                                            theme={selectThemeColors}
                                                                                            options={dropDownStyles}
                                                                                            classNamePrefix='dropdown'
                                                                                            className="erp-dropdown-select"
                                                                                            // className={classnames( 'po-details-select' )}
                                                                                            value={i.style}
                                                                                            onChange={data => {
                                                                                                handleStyleDropdown( data, i.fieldId );
                                                                                            }}
                                                                                        />
                                                                                    }

                                                                                </td>

                                                                                <td className="text-left">
                                                                                    <CreatableSelect
                                                                                        id='sizeGroupId'
                                                                                        name="sizeGroup"
                                                                                        isSearchable
                                                                                        menuPosition={'fixed'}
                                                                                        theme={selectThemeColors}
                                                                                        options={singleStyleSizeGroups}
                                                                                        classNamePrefix='dropdown'
                                                                                        className="erp-dropdown-select"
                                                                                        value={i?.sizeGroup}
                                                                                        onChange={data => {
                                                                                            handleSizeGroupsDropdown( data, i.fieldId );
                                                                                        }}
                                                                                        onFocus={() => { handleSizeGroupOnFocus( i.styleId ); }}
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
                                                                                        value={i.destinationDropDown}
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
                                                                                        value={i.shipmentModeDropDown}
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
                                                                                        value={moment( new Date( i.shipmentDate ) ).format( 'yy-MM-DD' )}
                                                                                        onChange={e => { handleInputOnChangeForOrderDetails( e, i.fieldId ); }}
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <Input
                                                                                        id="inspectionDateId"
                                                                                        bsSize="sm"
                                                                                        className="text-right custom-date"
                                                                                        type="date"
                                                                                        name="inspectionDate"
                                                                                        value={moment( new Date( i.inspectionDate ) ).format( 'yy-MM-DD' )}
                                                                                        onChange={e => { handleInputOnChangeForOrderDetails( e, i.fieldId ); }}

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
                                                                                        onChange={e => { handleInputOnChangeForOrderDetails( e, i.fieldId ); }}
                                                                                        onFocus={e => { e.target.select(); }}
                                                                                    />
                                                                                </td>
                                                                                <td className={selectedPurchaseOrder?.isSetOrder ? 'd-none' : 'd text-left'}>
                                                                                    <CreatableSelect
                                                                                        id='unitsId'
                                                                                        name="unit"
                                                                                        isSearchable
                                                                                        menuPosition={'fixed'}
                                                                                        theme={selectThemeColors}
                                                                                        options={defaultUOMDropdown}
                                                                                        classNamePrefix='dropdown'
                                                                                        className="erp-dropdown-select"
                                                                                        value={i.orderUOMDropDown}
                                                                                        onFocus={() => { handleUOMOnFocus( defaultUnitId ); }}

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
                                                                                        name="ratePerUnit"
                                                                                        value={i.ratePerUnit}
                                                                                        placeholder="0.00"
                                                                                        onFocus={e => { e.target.select(); }}
                                                                                        onChange={e => { handleInputOnChangeForOrderDetails( e, i.fieldId ); }}

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
                                                                                        onChange={e => { handleInputOnChangeForOrderDetails( e, i.fieldId ); }}

                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <Input
                                                                                        id="excessQuantityId"
                                                                                        bsSize="sm"
                                                                                        className="text-right"
                                                                                        type="number"
                                                                                        name="excessQuantityPercentage"
                                                                                        placeholder="0.00"
                                                                                        value={i.excessQuantityPercentage}
                                                                                        onFocus={e => { e.target.select(); }}
                                                                                        onChange={e => { handleInputOnChangeForOrderDetails( e, i.fieldId ); }}
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <Input
                                                                                        id="wastageQuantityId"
                                                                                        bsSize="sm"
                                                                                        className="text-right"
                                                                                        type="number"
                                                                                        name="wastageQuantityPercentage"
                                                                                        placeholder="0.00"
                                                                                        value={i.wastageQuantityPercentage}
                                                                                        onFocus={e => { e.target.select(); }}
                                                                                        onChange={e => { handleInputOnChangeForOrderDetails( e, i.fieldId ); }}
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <Input
                                                                                        id="adjustedQuantityId"
                                                                                        bsSize="sm"
                                                                                        className="text-right"
                                                                                        type="number"
                                                                                        name="adjustedQuantity"
                                                                                        disabled
                                                                                        placeholder="0.00"
                                                                                        value={i.adjustedQuantity}
                                                                                        onFocus={e => { e.target.select(); }}
                                                                                        onChange={e => { handleInputOnChangeForOrderDetails( e, i.fieldId ); }}
                                                                                    />
                                                                                </td>

                                                                                <td style={{ minWidth: '5px' }} >
                                                                                    {
                                                                                        selectedPurchaseOrder?.isSetOrder ? (
                                                                                            <Button.Ripple
                                                                                                id="srcIds" tag={Label}
                                                                                                className='btn-icon'
                                                                                                color='flat-danger'
                                                                                                onClick={() => { handleOpenSizeRation( i.style?.value, i.colorSizeQuantity, i.fieldId, i.isDetailQuantityExist, i?.id ); }}
                                                                                            >
                                                                                                <MoreVertical size={18} id="srcIds" color="purple" />
                                                                                            </Button.Ripple>
                                                                                        ) : <Button.Ripple
                                                                                            id="rcIds" tag={Label}
                                                                                            className='btn-icon'
                                                                                            color='flat-danger'
                                                                                            onClick={() => { handleOpenColorSizeRation( i.style?.value, i?.sizeGroupId, i.fieldId, i.colorSizeQuantity, i?.id, i.isDetailQuantityExist ); }}
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
                                                                                        value={i.statusDropDown}
                                                                                        onChange={data => {
                                                                                            handleActionStatusDropdown( data, i.fieldId );
                                                                                        }}
                                                                                    />
                                                                                </td>
                                                                                <td >
                                                                                    <span>
                                                                                        <Button.Ripple id="deleteFabId" tag={Label} disabled={( purchaseOrderDetails.length === 1 )} onClick={() => { handleRemoveOrderDetailsRow( i.fieldId, i.purchaseOrderId, i.id ); }} className='btn-icon' color='flat-danger' >
                                                                                            <MinusSquare size={18} id="deleteFabId" color="red" />
                                                                                        </Button.Ripple>
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                            <tr >
                                                                                <td colSpan={7}>
                                                                                    {
                                                                                        purchaseOrderDetails.some( ( i => i.fieldId === i.fieldId ) ) && (
                                                                                            <Collapse isOpen={i.isOpenDetails}>
                                                                                                <Table bordered>
                                                                                                    <thead className="text-center">
                                                                                                        {
                                                                                                            selectedPurchaseOrder?.isSetOrder ? <tr>
                                                                                                                <th>Style No</th>
                                                                                                                <th>Quantity</th>
                                                                                                                <th>Rate</th>
                                                                                                                <th>Amount</th>
                                                                                                                <th>Adjusted Qty</th>
                                                                                                                <th>Action</th>
                                                                                                            </tr> : <tr>
                                                                                                                <th>Color</th>
                                                                                                                <th>Quantity</th>
                                                                                                                <th>Rate</th>
                                                                                                                <th>Amount</th>
                                                                                                                <th>Adjusted Qty</th>
                                                                                                                <th>Action</th>
                                                                                                            </tr>
                                                                                                        }

                                                                                                    </thead>
                                                                                                    <tbody className="text-center">
                                                                                                        {selectedPurchaseOrder?.isSetOrder ? Object.keys( groupByStyleNo ).map( ( ii, inx ) => (
                                                                                                            <tr key={inx + 1}>
                                                                                                                <td>{ii}</td>
                                                                                                                <td>{_.sum( groupByStyleNo[ii]?.map( s => Number( s.quantity ) ) )}</td>
                                                                                                                <td>{i?.ratePerUnit}</td>
                                                                                                                <td>{_.sum( groupByStyleNo[ii]?.map( s => Number( s.quantity * i?.ratePerUnit ) ) )}</td>
                                                                                                                <td>{( _.sum( groupByStyleNo[ii]?.map( s => Number( s.adjustedQuantity ) ) ) ).toFixed( 4 )}</td>
                                                                                                                <td><Settings onClick={() => { handlePODetailsQuantity( groupByStyleNo[ii], i.purchaseOrderId, i.id ); }} /></td>
                                                                                                            </tr>
                                                                                                        ) ) : ( Object.keys( _.groupBy( i?.colorSizeQuantity, 'colorName' ) ).map( ( color, index ) => (
                                                                                                            <tr key={index + 1}>
                                                                                                                <td>{color}</td>
                                                                                                                <td>{_.sum( _.groupBy( i?.colorSizeQuantity, 'colorName' )[color]?.map( s => Number( s.quantity ) ) )}</td>
                                                                                                                <td>{i.ratePerUnit}</td>
                                                                                                                <td>{_.sum( _.groupBy( i?.colorSizeQuantity, 'colorName' )[color]?.map( s => Number( s.quantity * i?.ratePerUnit ) ) )}</td>
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
                                                                                        )
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                        </Fragment>
                                                                    ) )
                                                                }
                                                            </tbody>
                                                        </ResizableTable>
                                                    </div>
                                                    <Button.Ripple id="addFabId" tag={Label} onClick={() => { handleAddOrderDetailsRow( purchaseOrderDetails.length ); }} className='btn-icon' color='flat-success' >
                                                        <PlusSquare id="addFabId" color="green" />
                                                    </Button.Ripple>

                                                </FormGroup>
                                            </Row>
                                        </div>
                                    </Col>

                                </Row>
                            </Form>
                        </CardBody>
                        {
                            ( colorSizeRationIds && !selectedPurchaseOrder?.isSetOrder ) && <SizeColorRation
                                openModal={isColorSizeRationOpen}
                                setOpenModal={setIsColorSizeRationOpen}
                                colorSizeRationIds={colorSizeRationIds}
                                setColorSizeRationIds={setColorSizeRationIds}
                                handleColorSizeBindingOnRow={handleColorSizeBindingOnRow}
                            />
                        }
                        {/* {
                            ( quantityOnSizeAndColor.length > 0 && colorSizeRationEditIds && !selectedPurchaseOrder?.isSetOrder ) &&
                            <SizeColorRationEdit
                                openModal={isColorSizeRationEditOpen}
                                setOpenModal={setIsColorSizeRationEditOpen}
                                colorSizeRationEditIds={colorSizeRationEditIds}
                                setColorSizeRationEditIds={setColorSizeRationEditIds}
                                quantityOnSizeAndColor={quantityOnSizeAndColor}

                            />
                        } */}
                        {( isSizeRationOpen && selectedPurchaseOrder?.isSetOrder ) &&
                            <SizeRationNewForm
                                openModal={isSizeRationOpen}
                                setOpenModal={setIsSizeRationOpen}
                                sizeQuantityDetails={sizeQuantityDetails}
                                setSizeQuantityDetails={setSizeQuantityDetails}
                                sizeRationIds={sizeRationIds}
                                handleColorSizeBindingOnRow={handleColorSizeBindingOnRow}
                            />
                        }

                        <POStyleDetailsForm
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                        />
                        {
                            openColorSizeAdditionalModal && <ColorSizeAdditionalFormModal
                                openModal={openColorSizeAdditionalModal}
                                setOpenModal={setOpenColorSizeAdditionalModal}
                                colorSizeRationIds={colorSizeRationIds}
                                setColorSizeRationIds={setColorSizeRationIds}
                                handleColorSizeBindingOnRow={handleColorSizeBindingOnRow}
                            />
                        }
                    </Card>
                )
            }

        </div >
    );
};

export default PurchaseOrderEditForm;


import FallbackSpinner from '@components/spinner/Fallback-spinner';

import '@custom-styles/merchandising/form/costing-form.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Copy, MinusSquare, MoreHorizontal, Search, Settings } from 'react-feather';
import { useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Collapse, FormFeedback, InputGroup, InputGroupAddon, InputGroupText, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import Input from 'reactstrap/lib/Input';
import * as yup from 'yup';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomFloat from '../../../../utility/custom/CustomFloat';
import LabelBox from '../../../../utility/custom/LabelBox';
import { notify } from '../../../../utility/custom/notifications';
import { confirmObj, costingStatus, defaultUnitId, permissibleProcessObj } from '../../../../utility/enums';
import { isPermit, isZeroToFixed, selectThemeColors } from '../../../../utility/Utils';
import { getUserDropdown } from '../../../auth/user/store/actions';
import { getDefaultUOMDropdownByUnitId } from '../../../inventory/unit-sets/store/actions';
import { getBuyersStyles } from '../../buyer/store/actions';
import { getCurrencyDropdown } from '../../currency/store/actions';
import { bindCMCalculationForMachineInputOnChange, bindCMCalculationForSVMInputOnChange, bindCostingAccessoriesDetails, bindCostingBasicInfo, bindCostingFabricDetails, bindCostingSummaryInputOnChange, cloneCosting, deleteCostingPurchaseOrderDetails, getCostingById, getCostingStylePurchaseOrderDetails, getEditCostingSizeGroupAndColorsHistory, updateCosting } from '../store/action';
import CmCalculation from './CmCalculation';
import CostingDetailsForEdit from './CostingDetailsForEdit';
import CostingSearchableListModal from './CostingSearchableListModal';
import CostingStylePurchaseOrderModal from './CostingStylePurchaseOrderModal';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'costingList',
        name: 'Costings',
        link: "/costings",
        isActive: false
    },
    {
        id: 'costing',
        name: 'Edit',
        link: "#",
        isActive: true
    }
];


// Shipment Mode
const selectShipment = [
    { value: 1, label: 'Air' },
    { value: 2, label: 'Road' },
    { value: 3, label: 'Sea' }
];
// Shipment Mode
const selectTerm = [
    { value: 1, label: 'FOB' },
    { value: 2, label: 'CFR' },
    { value: 3, label: 'CIF' },
    { value: 4, label: 'EXW' }
];


const CostingEditForm = () => {
    const dispatch = useDispatch();
    const { replace, push, goBack } = useHistory();
    const { state } = useLocation();
    const costingId = state;
    const [openModal, setOpenModal] = useState( false );
    const {
        costingBasicInfo,
        costingGroupsSummary,
        costingFabricDetails,
        costingAccessoriesDetails,
        isCostingDataProgress
    } = useSelector( ( { costings } ) => costings );
    const { dropDownBuyers, buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );
    const { currencyDropdown, isCurrencyDropdownLoaded } = useSelector( ( { currencies } ) => currencies );
    const { defaultUOMDropdown, isDefaultUOMDropdownLoaded } = useSelector( ( { unitSets } ) => unitSets );
    const { userDropdown, isUserDropdownLoaded } = useSelector( ( { users } ) => users );
    const { userPermission, authenticateUser } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );


    const defaultUOMSet = defaultUOMDropdown?.find( uom => uom?.isBaseUnit === true );

    const [stylePurchaseOrderModel, setStylePurchaseOrderModel] = useState( false );

    const [costingSearchModalOpen, setCostingSearchModalOpen] = useState( false );


    const SignupSchema = yup.object().shape( {

        costingTerm: costingBasicInfo?.costingTerm ? yup.string() : yup.string().required( 'Costing Term is Required!!' ),
        currency: costingBasicInfo?.currencyCode ? yup.string() : yup.string().required( 'Currency Term is Required!!' ),
        shipmentMode: costingBasicInfo?.shipmentMode ? yup.string() : yup.string().required( 'ShipmentMode Term is Required!!' ),
        //password: yup.string().min( 6 ).required()
        test: yup.array().of( yup.object().shape(
            costingFabricDetails.map( i => ( {
                itemGroup: i?.itemGroup ? yup.string() : yup.string().required( 'Currency Term is Required!!' )
            } ) )
        ) )
    } );

    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );

    // useEffect( () => {
    //     //  dispatch( getDropDownStyles() );
    //   //  dispatch( getCurrencyDropdown() );
    //     //   dispatch( getDropDownBuyers() );

    // }, [] );

    useEffect( () => {
        dispatch( getCostingById( costingId ) );
    }, [dispatch, costingId] );


    useEffect( () => {
        const queryData = costingBasicInfo?.styleOrderDetails.map( order => ( {
            orderId: order.orderId,
            styleId: order.styleId
        } ) );
        dispatch( getEditCostingSizeGroupAndColorsHistory(
            queryData,
            costingBasicInfo?.colors,
            costingBasicInfo?.sizeGroups
        ) );
    }, [dispatch, costingBasicInfo?.styleOrderDetails] );


    const handleStylePurchaseOrderModalOpen = () => {
        setStylePurchaseOrderModel( !stylePurchaseOrderModel );
        dispatch( getCostingStylePurchaseOrderDetails( costingBasicInfo?.buyer?.value, costingBasicInfo?.style?.value ) );

    };

    const handleMerchandiserOnFocus = () => {
        if ( !userDropdown.length ) {
            dispatch( getUserDropdown() );
        }
    };
    const handleCurrencyOnFocus = () => {
        if ( !currencyDropdown.length ) {
            dispatch( getCurrencyDropdown() );
        }
    };


    const handleMerchandiserDropdownOnChange = ( data ) => {
        const updatedObj = {
            ...costingBasicInfo,
            merchandiser: data
        };
        dispatch( bindCostingBasicInfo( updatedObj ) );
    };

    ///DropdownOnChange
    const handleDetailsDropdownOChange = ( data, e ) => {
        const { action, name, option } = e;
        console.log( name );
        const updateObj = {
            ...costingBasicInfo,
            [name]: data,
            style: name === 'buyer' ? null : name === 'style' ? data : costingBasicInfo?.style,
            styleOrderDetails: name === 'buyer' ? [] : name === 'style' ? [] : costingBasicInfo?.styleOrderDetails
        };
        dispatch( bindCostingBasicInfo( updateObj ) );
        if ( name === 'buyer' ) {
            dispatch( getBuyersStyles( data?.value ) );
        }
        if ( name === 'style' ) {
            dispatch( getCostingStylePurchaseOrderDetails( data?.value ) );
        }
    };


    const handleInputOnChange = ( e ) => {
        const { type, name, value, checked } = e.target;
        if ( type === "checkbox" && !checked ) {
            const updateObj = {
                ...costingBasicInfo,
                [name]: type === 'number' ? Number( value ) : type === "checkbox" ? checked : value
            };
            dispatch( bindCostingBasicInfo( updateObj ) );
        } else {
            const updateObj = {
                ...costingBasicInfo,
                [name]: type === 'number' ? Number( value ) : type === "checkbox" ? checked : value
            };
            dispatch( bindCostingBasicInfo( updateObj ) );

        }
    };
    const handleUOMDropDown = ( data ) => {
        const updateObj = {
            ...costingBasicInfo,
            uom: data,
            uomRelativeFactor: data?.relativeFactor
        };
        console.log( updateObj );
        dispatch( bindCostingBasicInfo( updateObj ) );
    };

    const handleUOMOnFocus = ( unitId ) => {
        if ( !defaultUOMDropdown.length ) {
            dispatch( getDefaultUOMDropdownByUnitId( unitId ) );
        }
    };


    const handleCMOnChange = ( value ) => {
        const updateObj = {
            ...costingBasicInfo,
            ['costOfMakingPercentage']: Number( value.toFixed( 6 ) )
        };
        dispatch( bindCostingBasicInfo( updateObj ) );
    };


    const handleCancel = () => {
        replace( '/costings' );
        const obj = {
            buyer: { label: costingBasicInfo?.buyerName, value: costingBasicInfo?.buyerId },
            style: { label: costingBasicInfo?.styleNumber, value: costingBasicInfo?.styleId },
            styleDescription: costingBasicInfo?.styleDescription ?? '',
            styleCategory: costingBasicInfo?.styleCategory ?? '',
            isSetStyle: false
        };
        localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );
    };
    const handleCMCalculationOpen = () => {
        setOpenModal( !openModal );
        dispatch( bindCMCalculationForMachineInputOnChange( null ) );
        dispatch( bindCMCalculationForSVMInputOnChange( null ) );
    };
    const sumOfInHouseAmountTotal = () => {
        const total = _.sum( costingGroupsSummary.map( i => Number( i.inHouseAmount ) ) );
        return total;
    };
    const sumOfBuyerAmountTotal = () => {
        const total = _.sum( costingGroupsSummary.map( i => Number( i.buyerAmount ) ) );
        return total;
    };


    const handleCostingGroupChange = ( e, id ) => {
        const { name, value } = e.target;
        if ( value !== '.' ) {
            const updatedData = costingGroupsSummary.map( i => {
                if ( id === i.id ) {
                    if ( name === 'buyerAmount' ) {
                        //  i.buyerAmount = 0;
                        i[name] = Number( value );
                        i["inHouseAmount"] = Number( value );
                    }
                    if ( name === 'inHouseAmount' ) {
                        i[name] = Number( value );
                    }
                    if ( name === 'inPercentage' ) {

                        i[name] = Number( value );
                        if ( i.inPercentage === 0 ) {
                            i["buyerAmount"] = 0;
                        }
                    }
                }
                return i;
            } );


            const totalBuyerAmount = _.sum( updatedData.filter( u => !u.isCalculateInPercentage ).map( i => Number( i.buyerAmount ) ) );
            const totalPercentage = _.sum( updatedData.filter( u => u.isCalculateInPercentage ).map( i => Number( i.inPercentage ) ) );

            const calculateBuyerAmount = ( row, isCalculateInPercentage, inPercentage, buyerAmount ) => {

                let calculatedBuyerAmount = 0.00;

                if ( row === "CM" ) {
                    calculatedBuyerAmount = buyerAmount;
                } else {
                    calculatedBuyerAmount = isCalculateInPercentage ? ( inPercentage * totalBuyerAmount ) / ( 100 - totalPercentage ) : buyerAmount;
                }

                return calculatedBuyerAmount;
            };

            const modifiedData = updatedData.map( cs => ( {
                id: cs.id,
                name: cs.name,
                buyerAmount: calculateBuyerAmount( cs.name, cs.isCalculateInPercentage, cs.inPercentage, cs.buyerAmount ),


                inHouseAmount: ( ( name === "inHouseAmount" || cs.inHouseAmount !== 0 ) && !cs.isCalculateInPercentage ) ? cs.inHouseAmount : calculateBuyerAmount( cs.name, cs.isCalculateInPercentage, cs.inPercentage, cs.buyerAmount ),
                inPercentage: cs.inPercentage,
                isCalculateInPercentage: cs.isCalculateInPercentage
            } ) );

            const totalBuyerAmountWithCM = _.sum( modifiedData.map( i => Number( i.buyerAmount ) ) );

            const updatedAfterModified = modifiedData.map( c => {
                if ( c.name === "CM" ) {
                    c['inPercentage'] = ( c.buyerAmount * 100 ) / ( totalBuyerAmountWithCM );
                }
                return c;
            } );

            dispatch( bindCostingSummaryInputOnChange( updatedAfterModified ) );
        }
    };


    const handleDeleteCostingPODetails = ( id, rowId ) => {
        if ( id ) {
            dispatch( deleteCostingPurchaseOrderDetails( costingId, id, rowId ) );
        } else {
            confirmDialog( confirmObj ).then( async e => {
                if ( e.isConfirmed ) {
                    const updatedData = costingBasicInfo.styleOrderDetails.filter( o => o.rowId !== rowId );
                    const updateObj = {
                        ...costingBasicInfo,
                        ['styleOrderDetails']: updatedData
                    };
                    dispatch( bindCostingBasicInfo( updateObj ) );
                }
            } );
        }
    };

    const handleCostingSearchModal = () => {
        setCostingSearchModalOpen( !costingSearchModalOpen );


        // const obj = {
        //     buyer: { label: costingBasicInfo?.buyerName, value: costingBasicInfo?.buyerId },
        //     style: { label: costingBasicInfo?.styleNumber, value: costingBasicInfo?.styleId },
        //     styleDescription: costingBasicInfo?.styleDescription ?? '',
        //     styleCategory: costingBasicInfo?.styleCategory ?? '',
        //     isSetStyle: false
        // };
        // localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );
    };


    const isValidatedFabricDetails = () => {
        const errorField = costingFabricDetails.map( od => {
            if ( !od.itemGroup
                || !od.itemSubGroup
                || !od.itemDescriptionValue
                || od.consumptionQuantity === 0
                || od.consumptionRatePerUnit === 0
                || !od.consumptionUOMValue
            ) {
                od['isFieldError'] = true;
            } else {
                od['isFieldError'] = false;
            }
            return od;
        } );
        console.log( errorField.some( e => e.isFieldError ) );
        dispatch( bindCostingFabricDetails( errorField ) );

        return errorField.some( e => e.isFieldError );
    };
    const isValidatedAccessoriesDetails = () => {
        const errorField = costingAccessoriesDetails.map( od => {
            if ( !od.itemGroup
                || !od.itemSubGroup
                || od.consumptionQuantity === 0
                || od.consumptionRatePerUnit === 0
                || !od.consumptionUOMValue
            ) {
                od['isFieldError'] = true;
            } else {
                od['isFieldError'] = false;
            }
            return od;
        } );
        console.log( errorField.some( e => e.isFieldError ) );
        dispatch( bindCostingAccessoriesDetails( errorField ) );

        return errorField.some( e => e.isFieldError );
    };
    const onSubmit = () => {

        const fabricDetails = costingFabricDetails.map( ( fd, index ) => (
            {
                rowNo: index + 1,
                id: fd.id,
                itemGroupId: fd.itemGroupId,
                itemSubGroupId: fd.itemSubGroupId,
                itemDescription: fd.itemDescription,
                //   orderUOM: fd.unitName,
                consumptionUOM: fd.consumptionUOM,
                itemDescriptionTemplate: fd.itemDescriptionTemplate,
                wastagePercent: Number( fd.wastagePercent ),
                consumptionQuantity: Number( fd.consumptionQuantity ),
                consumptionRatePerUnit: Number( fd.consumptionRatePerUnit ),
                inHouseQuantity: Number( fd.inHouseConsumption ),
                inHouseRatePerUnit: Number( fd.inHouseRatePerUnit ),
                garmentPart: fd.garmentPart?.value ?? '',
                remarks: fd.remarks
            }
        ) );

        const accessoriesDetails = costingAccessoriesDetails.map( ( ad, index ) => ( {
            rowNo: index + 1,
            id: ad.id,
            itemGroupId: ad.itemGroupId,
            itemSubGroupId: ad.itemSubGroupId,
            //  orderUOM: ad.unitName,
            consumptionUOM: ad.consumptionUOM,
            wastagePercent: Number( ad.wastagePercent ),
            consumptionQuantity: Number( ad.consumptionQuantity ),
            consumptionRatePerUnit: Number( ad.consumptionRatePerUnit ),
            inHouseQuantity: Number( ad.inHouseConsumption ),
            inHouseRatePerUnit: Number( ad.inHouseRatePerUnit ),
            garmentPart: ad.garmentPart?.value ?? '',
            remarks: ad.remarks
        } ) );

        const otherDetails = costingGroupsSummary.filter( cgs => (
            cgs.name !== 'Accessories' &&
            cgs.name !== 'Fabric' &&
            cgs.name !== "Total" &&
            cgs.buyerAmount !== 0 &&
            cgs.inHouseAmount !== 0
        ) ).map( gs => ( {
            costingGroupId: gs.id,
            costingGroup: gs.name,
            totalBuyerCost: Number( gs.buyerAmount.toFixed( 6 ) ),
            totalInHouseCost: Number( gs.inHouseAmount.toFixed( 6 ) ),
            costInPercentage: Number( gs.inPercentage.toFixed( 6 ) )
        } ) );

        const submitObj = {
            costingNumber: costingBasicInfo?.costingNumber,
            buyerId: costingBasicInfo?.buyer?.value,
            buyerName: costingBasicInfo?.buyer?.label,
            costingUOM: costingBasicInfo?.uom ? costingBasicInfo?.uom?.label : defaultUOMSet?.label,
            uomRelativeFactor: costingBasicInfo?.uomRelativeFactor ?? defaultUOMSet?.relativeFactor,
            costingQuantity: Number( costingBasicInfo?.costingQuantity ),
            costingTerm: costingBasicInfo?.costingTerm?.label,
            shipmentMode: costingBasicInfo?.shipmentMode?.label,
            currency: costingBasicInfo?.currencyCode?.label,
            totalQuotedPrice: Number( sumOfBuyerAmountTotal().toFixed( 6 ) ),
            perUnitQuotedPrice: Number( sumOfBuyerAmountTotal().toFixed( 6 ) ),
            fobAmount: Number( sumOfBuyerAmountTotal().toFixed( 6 ) ),
            status: costingBasicInfo?.updateStatus?.label,
            merchandiserId: costingBasicInfo?.merchandiser?.value ?? authenticateUser?.id,
            shipmentDate: costingBasicInfo?.updateStatus?.label === 'Pre-Costing' ? costingBasicInfo?.shipmentDate : null,
            expectedQuantity: costingBasicInfo?.expectedQuantity,
            remarks: costingBasicInfo?.remarks,
            additionalInstruction: costingBasicInfo?.additionalInstruction,
            styleOrderAndSizeGroupAndColorDetails: costingBasicInfo.styleOrderDetails.map( order => ( {
                orderId: order?.orderId,
                orderNumber: order?.orderNumber,
                styleId: order.styleId,
                styleNumber: order.styleNumber,
                setStyleId: order.setStyleId,
                setStyleNumber: order.setStyleNumber,
                color: order.color,
                colorId: order.colorId,
                sizeGroup: order.sizeGroup,
                sizeGroupId: order.sizeGroup ? order.sizeGroupId : null,
                shipmentDate: order.shipmentDate,
                destination: order.destination
            } ) ),
            fabricDetails,
            accessoriesDetails,
            otherDetails
        };
        console.log( JSON.stringify( submitObj, null, 2 ) );

        if ( !isValidatedFabricDetails() && !isValidatedAccessoriesDetails() ) {
            dispatch( updateCosting( submitObj, costingId, costingBasicInfo?.updateStatus?.label, push ) );
        } else {
            if ( isValidatedFabricDetails() ) {
                notify( 'warning', 'Please provide all required of Fabric Details' );
            } else if ( isValidatedAccessoriesDetails() ) {
                notify( 'warning', 'Please provide all required of Accessories Details' );
            }
        }
    };

    const handleAddNew = () => {
        dispatch( bindCostingBasicInfo( null ) );
        dispatch( getCostingById( null ) );
        push( `/new-costing` );
    };

    const checkLoading = !costingBasicInfo?.sysId?.length || !costingGroupsSummary?.length;
    const [collapseMasterInfo, setCollapseMasterInfo] = useState( true );

    const handleCloneCosting = () => {
        dispatch( cloneCosting( costingBasicInfo, costingFabricDetails, costingAccessoriesDetails, costingGroupsSummary, replace ) );
    };

    const isPermittedByStatus = ( status, approvedById ) => {
        if ( status === "Approved" ) {
            const permitted = ( authenticateUser?.id === approvedById )
                || authenticateUser.permissibleProcesses.some( p => p === permissibleProcessObj.costing );
            return permitted;
        } else {
            return true;
        }
    };

    const handleGetPurchaseOrderAndFob = ( orders, fob ) => {
        const uniqOrders = _.uniqBy( orders, 'orderId' );
        const fobOrders = uniqOrders.filter( order => order.ratePerUnit < fob ).map( o => o.orderNumber );
        return fobOrders;
    };
    return (
        <div >
            <ActionMenu breadcrumb={breadcrumb} title='Edit Costing' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        type="submit"
                        // onClick={() => { onSubmit(); }}
                        onClick={handleSubmit( onSubmit )}
                        disabled={isCostingDataProgress}

                    >Save</NavLink>
                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => { handleCancel(); }}
                        disabled={isCostingDataProgress}

                    >
                        Cancel
                    </NavLink>
                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="success"
                        onClick={() => { handleAddNew(); }}
                        disabled={isCostingDataProgress}
                    >
                        Add New
                    </NavLink>
                </NavItem>
            </ActionMenu>
            {isCostingDataProgress ? <FallbackSpinner /> : (
                <Card className="mt-3 costing-form">
                    <CardBody>
                        <div >

                            <Row >
                                <Col>
                                    <div className='divider divider-left ' onClick={() => { setCollapseMasterInfo( !collapseMasterInfo ); }}>
                                        <div className='divider-text text-secondary font-weight-bolder'>Master Info
                                            <span >
                                                <Button.Ripple style={{ padding: '0.4rem' }} className='btn-icon' size="sm" color='flat-secondary'>
                                                    <ChevronUp
                                                        hidden={collapseMasterInfo}
                                                        size={18}
                                                        color='grey'
                                                        onClick={() => { setCollapseMasterInfo( !collapseMasterInfo ); }}
                                                    />
                                                    <ChevronDown
                                                        hidden={!collapseMasterInfo}
                                                        size={18}
                                                        color='grey'
                                                        onClick={() => { setCollapseMasterInfo( !collapseMasterInfo ); }}
                                                    />
                                                </Button.Ripple>

                                            </span></div>
                                    </div>
                                    <Collapse isOpen={collapseMasterInfo}>
                                        <div className="border rounded rounded-3 p-1">
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                                    <Row>
                                                        {/* <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label col-div-3 costing' for='costingNumberId'> SYS ID</Label>
                                                                <Label className='custom-form-colons col-div-3 costing'> : </Label>
                                                                <div className='custom-form-input-group col-div-3 costing font-weight-bolder'>
                                                                    {costingBasicInfo?.sysId}
                                                                </div>
                                                            </div>
                                                        </Col> */}
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='sysID'> SYS ID</Label>
                                                                <Label className='custom-form-colons'> : </Label>

                                                                <div className='custom-form-input-group'>
                                                                    <div className='custom-input-group-prepend inside-btn'>
                                                                        <Input
                                                                            id="sysID"
                                                                            className="mr-1"
                                                                            disabled
                                                                            name="sysId"
                                                                            type="text"
                                                                            bsSize="sm"
                                                                            value={costingBasicInfo?.sysId}
                                                                            onChange={( e ) => { handleInputOnChange( e ); }}
                                                                        />
                                                                    </div>
                                                                    <div className='custom-input-group-append inside-btn'>

                                                                        <Button.Ripple
                                                                            className='btn-icon '
                                                                            outline
                                                                            size="sm"
                                                                            color='primary'
                                                                            onClick={() => { handleCloneCosting(); }}

                                                                        >
                                                                            <Copy size={16} />
                                                                        </Button.Ripple>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='buyerId'> Buyer</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        id='buyerId'
                                                                        name="buyer"
                                                                        isDisabled
                                                                        isSearchable
                                                                        menuPosition="fixed"
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={dropDownBuyers}
                                                                        classNamePrefix='dropdown'
                                                                        innerRef={register( { required: true } )}
                                                                        className={classnames( 'erp-dropdown-select' )}
                                                                        value={costingBasicInfo?.buyer}
                                                                        onChange={( data, e ) => {
                                                                            handleDetailsDropdownOChange( data, e );

                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='styleId'> Style</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-input-group'>
                                                                    <div className='custom-input-group-prepend inside-btn'>
                                                                        <Select
                                                                            id='styleId'
                                                                            name="style"
                                                                            isDisabled
                                                                            isSearchable
                                                                            menuPosition="fixed"
                                                                            isClearable
                                                                            theme={selectThemeColors}
                                                                            options={buyerStylesDropdown}
                                                                            classNamePrefix='dropdown'
                                                                            innerRef={register( { required: true } )}
                                                                            className={classnames( 'erp-dropdown-select' )}
                                                                            value={costingBasicInfo?.style}
                                                                            onChange={( data, e ) => {
                                                                                handleDetailsDropdownOChange( data, e );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className='custom-input-group-append inside-btn'>
                                                                        <span>
                                                                            <Button.Ripple
                                                                                className='btn-icon'
                                                                                disabled={costingBasicInfo?.updateStatus?.label === 'Pre-Costing'}
                                                                                outline
                                                                                size="sm"
                                                                                color='secondary'
                                                                                onClick={() => { handleStylePurchaseOrderModalOpen(); }}

                                                                            >
                                                                                <MoreHorizontal color='green' size={16} />
                                                                            </Button.Ripple>
                                                                        </span>
                                                                        <span style={{ color: 'green', fontWeight: 'bolder', fontSize: "1.2rem" }}>*</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='styleDescriptionId'>Costing NO</Label>
                                                                <Label className='custom-form-colons '> : </Label>
                                                                <div className='custom-form-input-group'>
                                                                    <div className='custom-input-group-prepend inside-btn'>
                                                                        <Input
                                                                            id="costingNumberId"
                                                                            name="costingNumber"
                                                                            bsSize="sm"
                                                                            value={costingBasicInfo?.costingNumber}
                                                                            onChange={( e ) => handleInputOnChange( e )}
                                                                        />
                                                                    </div>
                                                                    <div className='custom-input-group-append inside-btn'>

                                                                        <Button.Ripple
                                                                            className='btn-icon '
                                                                            outline
                                                                            size="sm"
                                                                            color='primary'
                                                                            onClick={() => { handleCostingSearchModal(); }}

                                                                        >
                                                                            <Search size={16} />
                                                                        </Button.Ripple>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='styleDescriptionId'>Style Description</Label>
                                                                <Label className='custom-form-colons '> : </Label>
                                                                <div className='custom-form-group '>
                                                                    <Input
                                                                        id="styleDescriptionId"
                                                                        name="styleDescription"
                                                                        bsSize="sm"
                                                                        disabled
                                                                        value={costingBasicInfo?.styleDescription}
                                                                        onChange={( e ) => handleInputOnChange( e )}
                                                                    />
                                                                    {errors && errors?.styleDescription && <FormFeedback>Style Description is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='costingTermId'>Style Category</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Input
                                                                        id="styleDescriptionId"
                                                                        name="styleDescription"
                                                                        bsSize="sm"
                                                                        disabled
                                                                        value={costingBasicInfo?.styleCategory}
                                                                        onChange={( e ) => handleInputOnChange( e )}
                                                                    />
                                                                    {errors && errors?.styleDescription && <FormFeedback>Style Description is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='costingTermId'>Costing Term <span className='text-danger'>*</span></Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        id='costingTermId'
                                                                        name="costingTerm"
                                                                        isSearchable
                                                                        isClearable
                                                                        maxMenuHeight={200}
                                                                        menuShouldScrollIntoView
                                                                        theme={selectThemeColors}
                                                                        options={selectTerm}
                                                                        classNamePrefix='dropdown'
                                                                        className={classnames( `erp-dropdown-select ${( errors && errors.costingTerm && !costingBasicInfo?.costingTerm ) && 'is-invalid'}` )}
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                                        value={costingBasicInfo?.costingTerm}
                                                                        onChange={( data, e ) => {
                                                                            handleDetailsDropdownOChange( data, e );
                                                                        }}
                                                                    />
                                                                    {/* {errors && errors.costingTerm && <FormFeedback>Costing Term is required!</FormFeedback>} */}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            {/* <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='uomId'>UOM</Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-group'>
                                                                <Input
                                                                    id='uomId'
                                                                    bsSize="sm"
                                                                    type='text'
                                                                    name='costingUOM'
                                                                    value={costingBasicInfo?.costingUOM}
                                                                    onChange={( e => e.preventDefault() )}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div> */}
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='uomId'> Costing Per</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-input-group'>

                                                                    <div className='custom-input-group-prepend inside-number'>
                                                                        <Input
                                                                            id='costingQuantityId'
                                                                            bsSize="sm"
                                                                            name='costingQuantity'
                                                                            type='number'
                                                                            value={costingBasicInfo?.costingQuantity}
                                                                            onChange={( e ) => { handleInputOnChange( e ); }}
                                                                        />
                                                                    </div>
                                                                    <div className='custom-input-group-append inside-dropdown'>
                                                                        <Select
                                                                            id='uomId'
                                                                            isSearchable
                                                                            isClearable
                                                                            theme={selectThemeColors}
                                                                            options={defaultUOMDropdown}
                                                                            isLoading={!isDefaultUOMDropdownLoaded}
                                                                            classNamePrefix='dropdown'
                                                                            className="erp-dropdown-select"
                                                                            innerRef={register( { required: true } )}

                                                                            value={costingBasicInfo?.uom ? costingBasicInfo?.uom : defaultUOMSet}
                                                                            // value={}
                                                                            onChange={data => {
                                                                                handleUOMDropDown( data );
                                                                            }}
                                                                            onFocus={() => { handleUOMOnFocus( defaultUnitId ); }}
                                                                        />
                                                                        {errors && errors.uom && <FormFeedback>UOM is required!</FormFeedback>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='currencyId'>Currency <span className='text-danger'>*</span></Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        id='currencyId'
                                                                        name='currencyCode'
                                                                        isSearchable
                                                                        isClearable
                                                                        isLoading={!isCurrencyDropdownLoaded}
                                                                        theme={selectThemeColors}
                                                                        options={currencyDropdown}
                                                                        classNamePrefix='dropdown'
                                                                        className={classnames( `erp-dropdown-select ${( errors && errors.currency && !costingBasicInfo?.currencyCode ) && 'is-invalid'}` )}
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                                        value={costingBasicInfo?.currencyCode}
                                                                        onChange={( data, e ) => {
                                                                            handleDetailsDropdownOChange( data, e );
                                                                        }}
                                                                        onFocus={() => { handleCurrencyOnFocus(); }}
                                                                    />
                                                                    {/* {errors && errors.currencyId && <FormFeedback>Currency is required!</FormFeedback>} */}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='dateId'>Date</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <LabelBox text={moment( Date.parse( costingBasicInfo?.costingDate ) ).format( 'DD-MM-yyyy' )} />


                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='shipmentModeId'>Shipment Mode <span className='text-danger'>*</span></Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        id='shipmentModeId'
                                                                        name='shipmentMode'
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={selectShipment}
                                                                        classNamePrefix='dropdown'
                                                                        className={classnames( `erp-dropdown-select ${( errors && errors.shipmentMode && !costingBasicInfo?.shipmentMode ) && 'is-invalid'}` )}
                                                                        innerRef={register( { required: true } )}
                                                                        // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                                        value={costingBasicInfo?.shipmentMode}
                                                                        onChange={( data, e ) => {
                                                                            handleDetailsDropdownOChange( data, e );
                                                                        }}
                                                                    />
                                                                    {errors && errors.shipmentModeId && <FormFeedback>Shipment Mode is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div hidden={costingBasicInfo?.updateStatus?.label === 'Pre-Costing'} className='custom-form-main'>
                                                                <Label className='custom-form-label' for='fobId'>10hrs Production</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Input
                                                                        id='tenHourProductionId'
                                                                        type='number'
                                                                        bsSize="sm"
                                                                        name='tenHourProduction'
                                                                        placeholder='10hrs Production'
                                                                        innerRef={register( { required: true } )}
                                                                        invalid={errors.tenHourProduction && true}
                                                                        className={classnames( { 'is-invalid': errors['tenHourProduction'] } )}
                                                                        onFocus={e => { e.target.select(); }}

                                                                    />
                                                                    {errors && errors.tenHourProduction && <FormFeedback>10hrs Production is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                            <div hidden={costingBasicInfo?.updateStatus?.label !== 'Pre-Costing'} className='custom-form-main'>
                                                                <Label className='custom-form-label' for='shipmentDateId'>Shipment Date</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Input
                                                                        id='shipmentDateId'
                                                                        type={costingBasicInfo?.updateStatus?.label !== 'Pre-Costing' ? 'text' : 'date'}
                                                                        bsSize="sm"
                                                                        name='shipmentDate'
                                                                        disabled={costingBasicInfo?.updateStatus?.label !== 'Pre-Costing'}
                                                                        value={costingBasicInfo?.updateStatus?.label !== 'Pre-Costing' ? '' : costingBasicInfo?.shipmentDate}
                                                                        // value={costingBasicInfo?.costingDate}
                                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                                        className={classnames( { 'is-invalid': errors['dateId'] } )}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='fobId'>FOB</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Input
                                                                        id='fobId'
                                                                        type='number'
                                                                        name='fobAmount'
                                                                        bsSize="sm"
                                                                        value={isZeroToFixed( costingBasicInfo?.fobAmount, 6 )}
                                                                        placeholder='0'
                                                                        disabled
                                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                                    />
                                                                    {errors && errors.fobAmount && <FormFeedback>FOB is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='fobId'>CM %</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <InputGroup>
                                                                        <Input
                                                                            id='cmId'
                                                                            type='text'
                                                                            name='cm'
                                                                            bsSize="sm"
                                                                            disabled
                                                                            placeholder='0.00000'
                                                                            innerRef={register( { required: true } )}
                                                                            value={isZeroToFixed( costingGroupsSummary?.find( cgs => cgs.name === 'CM' )?.buyerAmount, 6 )}
                                                                            // value=""
                                                                            onChange={( e ) => { handleInputOnChange( e ); }}
                                                                            invalid={errors.cm && true}
                                                                            className={classnames( { 'is-invalid': errors['cm'] }, 'text-right' )}
                                                                        />
                                                                        <InputGroupAddon style={{ zIndex: 0 }} addonType="append">
                                                                            <Button.Ripple tag={InputGroupText} onClick={() => { handleCMCalculationOpen(); }} className='btn-icon pt-0 pb-0' color='flat-primary'>
                                                                                <Settings size={16} />
                                                                            </Button.Ripple>
                                                                        </InputGroupAddon>

                                                                        {errors && errors.cm && <FormFeedback>CM is required!</FormFeedback>}


                                                                    </InputGroup>
                                                                    <CmCalculation
                                                                        openModal={openModal}
                                                                        setOpenModal={setOpenModal}
                                                                        handleCMOnChange={handleCMOnChange}
                                                                        sumOfInHouseAmountTotal={sumOfInHouseAmountTotal}
                                                                        sumOfBuyerAmountTotal={sumOfBuyerAmountTotal}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='effectiveCMId'>Effective CM</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Input
                                                                        id='effectiveCMId'
                                                                        type='text'
                                                                        name='effectiveCM'
                                                                        bsSize="sm"
                                                                        placeholder='0.00000'
                                                                        disabled
                                                                        innerRef={register( { required: true } )}
                                                                        // value=""
                                                                        value={isZeroToFixed( costingGroupsSummary?.find( cgs => cgs.name === 'CM' )?.buyerAmount, 6 )}
                                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                                        invalid={errors.effectiveCM && true}
                                                                        className={classnames( { 'is-invalid': errors['effectiveCM'] }, 'text-right' )}
                                                                    />
                                                                    {errors && errors.effectiveCM && <FormFeedback>Effective CM is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='quotedId'>Quoted Price($)</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Input
                                                                        id='quotedId'
                                                                        type='number'
                                                                        name='totalQuotedPrice'
                                                                        bsSize="sm"
                                                                        disabled
                                                                        value={isZeroToFixed( costingBasicInfo?.totalQuotedPrice, 6 )}
                                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                                        placeholder='0.00'
                                                                    />
                                                                    {errors && errors.quotedPrice && <FormFeedback>Quoted Price is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='quotedPerUnitId'>Qtd. Price(Per PCS)</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Input
                                                                        id='quotedPerUnitId'
                                                                        type='number'
                                                                        name='perUnitQuotedPrice'
                                                                        disabled
                                                                        bsSize="sm"
                                                                        value={isZeroToFixed( costingBasicInfo?.perUnitQuotedPrice, 6 )}
                                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                                        placeholder='0.00'
                                                                    />
                                                                    {errors && errors.quotedPrice && <FormFeedback>Quoted Price is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='merchandiserId'>Merchandiser</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        isSearchable

                                                                        isClearable
                                                                        isLoading={!isUserDropdownLoaded}
                                                                        id='colorIds'
                                                                        theme={selectThemeColors}
                                                                        options={userDropdown}
                                                                        // options={selectColor}
                                                                        classNamePrefix='dropdown'
                                                                        innerRef={register( { required: true } )}
                                                                        className={classnames( `erp-dropdown-select` )}
                                                                        value={costingBasicInfo?.merchandiser ?? { value: authenticateUser?.id, label: authenticateUser?.name }}
                                                                        onChange={data => {
                                                                            handleMerchandiserDropdownOnChange( data );
                                                                        }}
                                                                        //  onCreateOption={data => { }}

                                                                        onFocus={() => { handleMerchandiserOnFocus(); }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row hidden={costingBasicInfo?.updateStatus?.label !== 'Pre-Costing'}>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='expectedQtyId'>Expected Qty.</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Input
                                                                        id='expectedQtyId'
                                                                        type='number'
                                                                        name='expectedQuantity'
                                                                        disabled={costingBasicInfo?.updateStatus?.label !== 'Pre-Costing'}
                                                                        value={costingBasicInfo?.updateStatus?.label === 'Pre-Costing' ? costingBasicInfo?.expectedQuantity : 0}
                                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                                        bsSize="sm"
                                                                        placeholder='0.00'
                                                                        className='text-right'
                                                                        onFocus={e => { e.target.select(); }}

                                                                    />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='fobId'>10hrs Production</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Input
                                                                        id='tenHourProductionId'
                                                                        type='number'
                                                                        bsSize="sm"
                                                                        name='tenHourProduction'
                                                                        placeholder='10hrs Production'
                                                                        innerRef={register( { required: true } )}
                                                                        invalid={errors.tenHourProduction && true}
                                                                        className={classnames( { 'is-invalid': errors['tenHourProduction'] } )}
                                                                        onFocus={e => { e.target.select(); }}

                                                                    />
                                                                    {errors && errors.tenHourProduction && <FormFeedback>10hrs Production is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >

                                                        </Col>

                                                    </Row>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                                    <div className=' border rounded pt-0 pr-1 pb-1 pl-1 costing-custom-table' >
                                                        <Label className="font-weight-bolder"> Purchase Order</Label>
                                                        <Table responsive bordered size="sm">
                                                            <thead className='text-center'>
                                                                <tr>
                                                                    <th className='sl'>SL</th>
                                                                    <th>PO NO</th>
                                                                    <th>Shipt. Date</th>
                                                                    <th>Size Group</th>
                                                                    <th>Color</th>
                                                                    <th>Dest.</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className='text-center' >

                                                                {costingBasicInfo?.styleOrderDetails?.map( ( order, index ) => (
                                                                    <tr key={order?.rowId}>
                                                                        <td className='sl'>{index + 1}</td>
                                                                        <td>{order.orderNumber}</td>
                                                                        <td>{moment( Date.parse( order.shipmentDate ) ).format( "DD-MM-YYYY" )}</td>
                                                                        <td>{order.sizeGroup}</td>
                                                                        <td>{order.color}</td>
                                                                        <td>{order.destination}</td>
                                                                        <td className='action'>
                                                                            <Button.Ripple id="deleteCostingPO"
                                                                                tag={Label}
                                                                                onClick={() => { handleDeleteCostingPODetails( order.id, order.rowId ); }}
                                                                                className='btn-icon p-0 '
                                                                                color='flat-success'
                                                                            >
                                                                                <MinusSquare size={18} id="deleteCostingPO" color="red" />
                                                                            </Button.Ripple>
                                                                        </td>
                                                                    </tr>
                                                                ) )
                                                                }

                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    {handleGetPurchaseOrderAndFob( costingBasicInfo?.styleOrderDetails, sumOfBuyerAmountTotal() ).length > 0 && (
                                                        <div style={{ color: 'red' }}>
                                                            {`FOB Amount greater then those (${handleGetPurchaseOrderAndFob( costingBasicInfo?.styleOrderDetails, sumOfBuyerAmountTotal() )}) orders amount.`}
                                                        </div>
                                                    )}

                                                </Col>
                                            </Row>
                                            <Row>
                                                {/* <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label col-div-6' for='pcsId'>Size Groups</Label>
                                                    <Label className='custom-form-colons col-div-6'> : </Label>
                                                    <div className='custom-form-group col-div-6'>
                                                        <CreatableSelect
                                                            id='sizeRangeId'
                                                            isSearchable
                                                            isClearable
                                                            isMulti
                                                            theme={selectThemeColors}
                                                            //     options={costingSizeGroupColorHistory?.sizeGroups}
                                                            options={_.uniqBy( costingSizeGroupColorHistory?.sizeGroups, 'value' )}
                                                            classNamePrefix='dropdown'
                                                            className="erp-dropdown-select"
                                                            innerRef={register( { required: true } )}
                                                            // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                            value={costingBasicInfo?.sizeGroups}
                                                            onChange={data => {
                                                                handleSizeGroupDropdown( data );
                                                            }}
                                                        />
                                                        {errors && errors.sizeRange && <FormFeedback>SizeRange is required!</FormFeedback>}
                                                    </div>
                                                </div>

                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label col-div-6' for='colorId'>Color</Label>
                                                    <Label className='custom-form-colons col-div-6'> : </Label>
                                                    <div className='custom-form-group col-div-6'>
                                                        <CreatableSelect
                                                            id='colorId'
                                                            name='color'
                                                            isSearchable
                                                            isClearable
                                                            isMulti
                                                            theme={selectThemeColors}
                                                            options={costingBasicInfo?.sizeGroups?.length > 0 ? _.uniqBy( costingBasicInfo?.colorsArray, 'value' ) : costingSizeGroupColorHistory?.colors?.filter( color => color.sizeGroup === null )}
                                                            classNamePrefix='dropdown'
                                                            className="erp-dropdown-select"
                                                            innerRef={register( { required: false } )}
                                                            invalid={errors.color && true}
                                                            // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                            value={costingBasicInfo?.colors}
                                                            onFocus={() => handleColorDropdownOnFocus( costingBasicInfo?.sizeGroups )}
                                                            onChange={data => {
                                                                handleColorDropdown( data );
                                                            }}
                                                        />
                                                        {errors && errors.color && <FormFeedback>Color is required!</FormFeedback>}
                                                    </div>
                                                </div>
                                            </Col> */}
                                                {/* <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label col-div-6 costings-remarks' for='remarksId'>Remarks</Label>
                                                        <Label className='custom-form-colons col-div-6 costings-remarks'> : </Label>
                                                        <div className='custom-form-group col-div-6 costings-remarks'>
                                                            <Input
                                                                style={{ height: '36px' }}
                                                                id='remarksId'
                                                                type='textarea'
                                                                name='remarks'
                                                                bsSize="sm"
                                                                placeholder='Remarks'
                                                                innerRef={register( { required: false } )}
                                                                value={costingBasicInfo?.remarks}
                                                                onChange={( e ) => { handleInputOnChange( e ); }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label col-div-6' for='remarksId'>Special Instruction</Label>
                                                        <Label className='custom-form-colons col-div-6'> : </Label>
                                                        <div className='custom-form-group col-div-6'>
                                                            <Input
                                                                style={{ height: '36px' }}
                                                                id='instructionId'
                                                                type='textarea'
                                                                bsSize="sm"
                                                                name='additionalInstruction'
                                                                placeholder='Special Instruction'
                                                                innerRef={register( { required: false } )}
                                                                value={costingBasicInfo?.additionalInstruction}
                                                                onChange={( e ) => { handleInputOnChange( e ); }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Col> */}
                                                <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label col-div-4 costings-remarks' for='remarksId'>Remarks</Label>
                                                        <Label className='custom-form-colons col-div-4 costings-remarks'> : </Label>
                                                        <div className='custom-form-group col-div-4 costings-remarks'>
                                                            <Input
                                                                style={{ height: '36px' }}
                                                                id='remarksId'
                                                                type='textarea'
                                                                name='remarks'
                                                                bsSize="sm"
                                                                placeholder='Remarks'
                                                                value={costingBasicInfo?.remarks}
                                                                onChange={( e ) => { handleInputOnChange( e ); }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label col-div-4 ' for='remarksId'>Special Instruction</Label>
                                                        <Label className='custom-form-colons col-div-4'> : </Label>
                                                        <div className='custom-form-group col-div-4'>
                                                            <Input
                                                                style={{ height: '36px' }}
                                                                id='instructionId'
                                                                type='textarea'
                                                                bsSize="sm"
                                                                name='additionalInstruction'
                                                                placeholder='Special Instruction'
                                                                value={costingBasicInfo?.additionalInstruction}
                                                                onChange={( e ) => { handleInputOnChange( e ); }}
                                                                className={classnames( { 'is-invalid': errors['additionalInstruction'] } )}
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                                    <div style={{ display: "flex", justifyContent: 'flex-end', alignItems: 'center' }}>
                                                        <span style={{ color: 'green', fontWeight: 'bolder', fontSize: "1.2rem", marginRight: '0.5rem' }}>*</span>
                                                        <span style={{ fontWeight: 'bold', fontSize: '0.7rem', fontStyle: 'italic' }}> Buyer PO  Modal Open Button</span>
                                                    </div>
                                                </Col>

                                            </Row>
                                        </div>
                                    </Collapse>

                                </Col>
                            </Row>

                            <Col xs={12} sm={12} md={4} lg={12} xl={12}  >
                                <CustomFloat title='Costing Summary'>
                                    <div className="pre-costing-summary-table">
                                        <Table bordered size='sm'>
                                            <thead className='thead-light'>
                                                <tr >
                                                    <th className='small'><strong>Group Name</strong></th>
                                                    <th className='text-center small'><strong>Buyer Amount</strong></th>
                                                    <th className='text-center  small'><strong>In House Amount</strong></th>
                                                    <th style={{ width: '15%' }} className='text-center  small'><strong>%</strong></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    _.orderBy( costingGroupsSummary, ['id'], ['asc'] ).map( i => (
                                                        <tr key={i.id}>
                                                            <td className='text-left small font-weight-bolder'>
                                                                {i.name}
                                                            </td>
                                                            <td className='text-center'>
                                                                <NumberFormat
                                                                    className="form-control-sm form-control"
                                                                    value={i.name === 'Total' ? isZeroToFixed( sumOfBuyerAmountTotal(), 6 ) : i.buyerAmount}
                                                                    displayType="input"
                                                                    name="buyerAmount"
                                                                    decimalScale={6}
                                                                    fixedDecimalScale={i.buyerAmount > 0}
                                                                    allowNegative={false}
                                                                    allowLeadingZeros={false}
                                                                    onFocus={e => {
                                                                        e.target.select();
                                                                    }}
                                                                    onBlur={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    onChange={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    disabled={i.name === 'Accessories' || i.name === 'Fabric' || i.name === 'Total' || i.isCalculateInPercentage}
                                                                />
                                                            </td>
                                                            <td className='text-center'>
                                                                <NumberFormat
                                                                    className="form-control-sm form-control"
                                                                    value={i.name === 'Total' ? isZeroToFixed( sumOfInHouseAmountTotal(), 6 ) : i.inHouseAmount}
                                                                    displayType="input"
                                                                    name="inHouseAmount"
                                                                    decimalScale={6}
                                                                    fixedDecimalScale={i.inHouseAmount > 0}
                                                                    allowNegative={false}
                                                                    allowLeadingZeros={false}
                                                                    onFocus={e => {
                                                                        e.target.select();
                                                                    }}
                                                                    onBlur={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    onChange={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    disabled={i.isCalculateInPercentage || i.name === 'Accessories' || i.name === 'Fabric' || i.name === 'Total'}
                                                                />
                                                            </td>
                                                            <td className='text-center'>
                                                                <NumberFormat
                                                                    className="form-control-sm form-control"
                                                                    value={i.name === 'Total' ? 0 : i.inPercentage}
                                                                    displayType="input"
                                                                    name="inPercentage"
                                                                    decimalScale={2}
                                                                    fixedDecimalScale={i.inPercentage > 0}
                                                                    allowNegative={false}
                                                                    allowLeadingZeros={false}
                                                                    onFocus={e => {
                                                                        e.target.select();
                                                                    }}
                                                                    onBlur={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    onChange={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    disabled={!i.isCalculateInPercentage}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ) )
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </CustomFloat>
                            </Col>
                            <Row  >
                                <Col>
                                    <div className='divider divider-left '>
                                        <div className='divider-text text-secondary font-weight-bolder'>Details</div>
                                    </div>
                                    <div className="border rounded rounded-3 p-1">
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <CostingDetailsForEdit />
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="border rounded rounded-3 p-1 mt-1">
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label' for='statusId'>Status</Label>
                                                    <Label className='custom-form-colons'> : </Label>
                                                    <div className='custom-form-group'>
                                                        {
                                                            isPermit( userPermission?.CostingCanApprove, authPermissions ) ? (

                                                                <Select
                                                                    id='statusId'
                                                                    //  isDisabled={!isPermit( userPermission?.CostingCanApprove, authPermissions ) || !( authenticateUser?.id === costingBasicInfo?.approvedById )}
                                                                    isDisabled={!isPermittedByStatus( costingBasicInfo?.status?.value, costingBasicInfo?.approvedById )}

                                                                    isSearchable
                                                                    menuPlacement="top"
                                                                    name="updateStatus"
                                                                    isClearable
                                                                    theme={selectThemeColors}
                                                                    options={costingStatus}
                                                                    classNamePrefix='dropdown'
                                                                    className="erp-dropdown-select"
                                                                    innerRef={register( { required: true } )}
                                                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                                    value={costingBasicInfo?.updateStatus}
                                                                    onChange={( data, e ) => {
                                                                        handleDetailsDropdownOChange( data, e );
                                                                    }}
                                                                />
                                                            ) : costingBasicInfo?.status?.value
                                                        }

                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label' for='statusId'>Approved By</Label>
                                                    <Label className='custom-form-colons'> : </Label>
                                                    <div className='custom-form-group'>
                                                        {costingBasicInfo?.approvedBy ?? ''}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label' for='statusId'>Approved Date</Label>
                                                    <Label className='custom-form-colons'> : </Label>
                                                    <div className='custom-form-group'>
                                                        {costingBasicInfo?.approveDate ? moment( Date.parse( costingBasicInfo?.approveDate ) ).format( 'DD/MM/YYYY' ) : ''}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>

                        </div>
                    </CardBody>
                </Card>
            )
            }

            {
                stylePurchaseOrderModel && (
                    <CostingStylePurchaseOrderModal
                        openModal={stylePurchaseOrderModel}
                        setOpenModal={setStylePurchaseOrderModel}
                    />
                )
            }
            {
                costingSearchModalOpen && (
                    <CostingSearchableListModal
                        openModal={costingSearchModalOpen}
                        setOpenModal={setCostingSearchModalOpen}
                        searchFor="costing-edit"
                    />
                )
            }
        </div >
    );
};

export default CostingEditForm;

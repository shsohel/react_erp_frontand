import Spinner from '@components/spinner/Fallback-spinner';
// import '@custom-styles/merchandising/form/costing-form.scss';
import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, MinusSquare, MoreHorizontal, Search, Settings } from 'react-feather';
import { useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Button, Card, CardBody, Col, Collapse, FormFeedback, InputGroup, InputGroupAddon, InputGroupText, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import Input from 'reactstrap/lib/Input';
import * as yup from 'yup';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomFloat from '../../../../utility/custom/CustomFloat';
import { notify } from '../../../../utility/custom/notifications';
import { confirmObj, costingStatus, defaultUnitId, permissibleProcessObj } from '../../../../utility/enums';
import { isPermit, isZeroToFixed, selectThemeColors } from '../../../../utility/Utils';
import { getUserDropdown } from '../../../auth/user/store/actions';
import { getDefaultUOMDropdownByUnitId } from '../../../inventory/unit-sets/store/actions';
import { clearAllBuyerState, getBuyersStyles, getDropDownBuyers } from '../../buyer/store/actions';
import { getCurrencyDropdown } from '../../currency/store/actions';
import { addCosting, bindCMCalculationForMachineInputOnChange, bindCMCalculationForSVMInputOnChange, bindCostingAccessoriesDetails, bindCostingBasicInfo, bindCostingFabricDetails, bindCostingSummaryInputOnChange, clearAllCostingState, getCostingSizeGroupAndColorsHistory, getCostingStylePurchaseOrderDetails, getStyleFabricDefaultCategory } from '../store/action';
import CmCalculation from './CmCalculation';
import CostingDetailsForm from './CostingDetailsForm';
import CostingSearchableListModal from './CostingSearchableListModal';
import CostingStylePurchaseOrderModal from './CostingStylePurchaseOrderModal';


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


const CostingAddForm = () => {
    const dispatch = useDispatch();
    const { push } = useHistory();
    const state = JSON.parse( localStorage.getItem( 'buyerAndStyle' ) );

    const { replace, location } = useHistory();

    const [costingSearchModalOpen, setCostingSearchModalOpen] = useState( false );

    const [openModal, setOpenModal] = useState( false );

    const { costingBasicInfo,
        costingFabricDetails,
        costingAccessoriesDetails,
        costingGroupsSummary,
        costingSizeGroupColorHistory,
        styleDefaultCategory,
        isCostingDataProgress
    } = useSelector( ( { costings } ) => costings );

    const { authenticateUser, userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    const { defaultUOMDropdown, isDefaultUOMDropdownLoaded } = useSelector( ( { unitSets } ) => unitSets );

    const defaultUOMSet = defaultUOMDropdown?.find( uom => uom?.isBaseUnit === true );
    const { userDropdown, isUserDropdownLoaded } = useSelector( ( { users } ) => users );

    const { dropDownBuyers, buyerStylesDropdown, isBuyerDropdownLoaded, isBuyerStylesDropdownLoaded } = useSelector( ( { buyers } ) => buyers );
    const { currencyDropdown, isCurrencyDropdownLoaded } = useSelector( ( { currencies } ) => currencies );

    const [stylePurchaseOrderModel, setStylePurchaseOrderModel] = useState( false );
    ///For Validation
    const SignupSchema = yup.object().shape( {

        costingTerm: costingBasicInfo?.costingTerm ? yup.string() : yup.string().required( 'Costing Term is Required!!' ),
        currency: costingBasicInfo?.currency ? yup.string() : yup.string().required( 'Currency Term is Required!!' ),
        shipmentMode: costingBasicInfo?.shipmentMode ? yup.string() : yup.string().required( 'ShipmentMode Term is Required!!' ),
        //password: yup.string().min( 6 ).required()
        test: yup.array().of( yup.object().shape(
            costingFabricDetails.map( i => ( {
                itemGroup: i?.itemGroup ? yup.string() : yup.string().required( 'Currency Term is Required!!' )
            } ) )
        ) )
    } );


    const { register, errors, handleSubmit, control } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );
    ///For Validation


    const handleBuyerDataBind = () => {
        const updateObj = {
            ...costingBasicInfo,
            buyer: state?.buyer,
            style: state?.style,
            styleDescription: state?.styleDescription,
            styleCategory: state?.styleCategory
        };

        dispatch( bindCostingBasicInfo( updateObj ) );
        dispatch( getStyleFabricDefaultCategory( state?.style?.value, false ) );

    };

    useEffect( () => {
        handleBuyerDataBind();
    }, [] );


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


    const handleCurrencyOnFocus = () => {
        if ( !currencyDropdown.length ) {
            dispatch( getCurrencyDropdown() );
        }
    };


    const handleInputOnChange = ( e ) => {
        const { type, name, value, checked } = e.target;

        if ( type === "checkbox" && !checked ) {
            const updateObj = {
                ...costingBasicInfo,
                [name]: type === 'number' ? Number( value ) : type === "checkbox" ? checked : value,
                costingNumber: ''
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


    const handleMerchandiserOnFocus = () => {
        dispatch( getUserDropdown() );
    };


    const handleMerchandiserDropdownOnChange = ( data ) => {
        const updatedObj = {
            ...costingBasicInfo,
            merchandiser: data
        };
        dispatch( bindCostingBasicInfo( updatedObj ) );
    };


    ///DropdownOnChange
    const handleDetailsDropdownOChange = ( data, e, rowId ) => {
        const { action, name, option } = e;
        const updateObj = {
            ...costingBasicInfo,
            [name]: data,
            style: name === 'buyer' ? null : name === 'style' ? data : costingBasicInfo?.style,
            styleOrderDetails: name === 'buyer' ? [] : name === 'style' ? [] : costingBasicInfo?.styleOrderDetails,
            styleDescription: name === 'buyer' ? "" : name === 'style' && data ? data?.description : '',
            styleCategory: name === 'buyer' ? "" : name === 'style' && data ? data?.styleCategory : ''
        };
        dispatch( bindCostingBasicInfo( updateObj ) );
        if ( name === 'buyer' ) {
            dispatch( getBuyersStyles( null ) );
            const obj = {
                ...state,
                buyer: data,
                style: null,
                styleDescription: '',
                styleCategory: '',
                status: '',
                isSetStyle: false
            };
            localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );
        }
        if ( name === 'style' ) {
            const obj = {
                ...state,
                style: data,
                status: data?.status ?? '',
                styleDescription: data?.description ?? '',
                styleCategory: data?.styleCategory ?? '',
                isSetStyle: data?.isSetStyle ?? false

            };
            localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );
            // dispatch( getStyleFabricDefaultCategory( data?.value ) );
            dispatch( getStyleFabricDefaultCategory( data?.value, true ) );


            // dispatch( getCostingStylePurchaseOrderDetails( costingBasicInfo?.buyer?.value, data?.value ) );
        }
    };
    const handleBuyerOnFocus = () => {
        if ( !dropDownBuyers.length ) {
            dispatch( getDropDownBuyers() );
        }
    };


    const handleStyleOnFocus = ( buyerId ) => {
        if ( !buyerStylesDropdown.length ) {
            dispatch( getBuyersStyles( buyerId ) );
        }
    };


    const handleStylePurchaseOrderModalOpen = () => {
        setStylePurchaseOrderModel( !stylePurchaseOrderModel );
        dispatch( getCostingStylePurchaseOrderDetails( costingBasicInfo?.buyer?.value, costingBasicInfo?.style?.value ) );
    };


    const handleCMOnChange = ( value ) => {
        const updateObj = {
            ...costingBasicInfo,
            ['costOfMakingPercentage']: Number( value.toFixed( 6 ) )
        };
        dispatch( bindCostingBasicInfo( updateObj ) );
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

    const handleCostingTermDropdown = ( data ) => {
        const updateObj = {
            ...costingBasicInfo,
            costingTerm: data,
            costingTermName: data?.label
        };
        dispatch( bindCostingBasicInfo( updateObj ) );
    };
    const handleShipmentModeDropdown = ( data ) => {
        const updateObj = {
            ...costingBasicInfo,
            shipmentMode: data,
            shipmentModeName: data?.label
        };
        dispatch( bindCostingBasicInfo( updateObj ) );
    };
    const handleCostingStatus = ( data ) => {
        const updateObj = {
            ...costingBasicInfo,
            status: data
        };
        dispatch( bindCostingBasicInfo( updateObj ) );
    };
    const handleCurrencyDropdown = ( data ) => {
        const updateObj = {
            ...costingBasicInfo,
            currency: data,
            currencyName: data?.label
        };
        dispatch( bindCostingBasicInfo( updateObj ) );
    };

    const handleDeleteCostingPODetails = ( rowId ) => {
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

    };
    const handleSizeGroupDropdown = ( data ) => {
        const filteredColorForSizeGroup = costingSizeGroupColorHistory.sizeGroups.filter( d => data.some( s => s.value === d.value ) );

        if ( data.length > 0 ) {
            const filteredColor = costingBasicInfo?.colors?.filter( c => data?.some( d => d.value === c.sizeGroupId ) );
            const updateObj = {
                ...costingBasicInfo,
                sizeGroups: data,
                colorsArray: filteredColorForSizeGroup?.map( cs => ( {
                    label: cs.color,
                    value: cs.colorId,
                    sizeGroupId: cs.value
                } ) ),
                colors: filteredColor
            };
            dispatch( bindCostingBasicInfo( updateObj ) );
        } else {
            const updateObj = {
                ...costingBasicInfo,
                sizeGroups: data,
                colorsArray: [],
                colors: []
            };
            dispatch( bindCostingBasicInfo( updateObj ) );
        }

    };

    const handleColorDropdown = ( data ) => {
        const updateObj = {
            ...costingBasicInfo,
            colors: data
        };
        dispatch( bindCostingBasicInfo( updateObj ) );
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
                // buyerAmount: cs.name === 'CM' ? cs.buyerAmount : cs.inPercentage === 0 ? cs.buyerAmount : ( 100 - cs.inPercentage ) > 0 ? ( cs.inPercentage * totalBuyerAmount ) / ( 100 - cs.inPercentage ) : 0,

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


    const handleUOMOnFocus = ( unitId ) => {
        if ( !defaultUOMDropdown.length ) {
            dispatch( getDefaultUOMDropdownByUnitId( unitId ) );
        }
    };

    // useEffect( () => {
    //     handleUOMDropDown( defaultUOMSet );
    // }, [dispatch, !costingBasicInfo.uom] );

    const cm = costingGroupsSummary.find( cgs => cgs.name === 'CM' )?.buyerAmount;

    const checkLoading = !costingBasicInfo;

    const [singleStyleOpen, setSingleStyleOpen] = useState( true );

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
                remarks: fd?.remarks
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
            remarks: ad?.remarks
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
            styleId: costingBasicInfo?.style?.value,
            styleNumber: costingBasicInfo?.style?.label,
            buyerId: costingBasicInfo?.buyer?.value,
            buyerName: costingBasicInfo?.buyer?.label,
            costingUOM: costingBasicInfo?.uom ? costingBasicInfo?.uom?.label : defaultUOMSet?.label,
            uomRelativeFactor: costingBasicInfo?.uomRelativeFactor ?? defaultUOMSet?.relativeFactor,
            costingQuantity: Number( costingBasicInfo?.costingQuantity ),
            // costingTerm: costingBasicInfo?.costingTermName,
            // shipmentMode: costingBasicInfo?.shipmentModeName,
            // currency: costingBasicInfo?.currencyName,
            costingTerm: costingBasicInfo?.costingTerm?.label,
            shipmentMode: costingBasicInfo?.shipmentMode?.label,
            currency: costingBasicInfo?.currency?.label,
            merchandiserId: costingBasicInfo?.merchandiser?.value ?? authenticateUser?.id,
            totalQuotedPrice: Number( sumOfBuyerAmountTotal().toFixed( 6 ) ),
            perUnitQuotedPrice: Number( sumOfBuyerAmountTotal().toFixed( 6 ) ),
            fobAmount: Number( sumOfBuyerAmountTotal().toFixed( 6 ) ),
            status: costingBasicInfo?.status?.label,
            remarks: costingBasicInfo?.remarks,
            shipmentDate: costingBasicInfo?.status?.label === 'Pre-Costing' ? costingBasicInfo?.shipmentDate : null,
            expectedQuantity: costingBasicInfo?.expectedQuantity,
            additionalInstruction: costingBasicInfo?.additionalInstruction,
            styleOrderAndSizeGroupAndColorDetails: costingBasicInfo?.styleOrderDetails?.map( order => ( {
                orderId: order?.orderId,
                orderNumber: order?.orderNumber,
                styleId: order.styleId,
                styleNumber: order.styleNumber,
                setStyleId: order.setStyleId,
                setStyleNumber: order.setStyleNumber,
                color: order.color,
                colorId: order.colorId,
                sizeGroup: order.sizeGroup,
                sizeGroupId: order.sizeGroupId,
                shipmentDate: order.shipmentDate,
                destination: order.destination
            } ) ),
            fabricDetails,
            accessoriesDetails,
            otherDetails
        };

        console.log( JSON.stringify( submitObj, null, 2 ) );

        // const isFabricValidated = fabricDetails.every( fb => !fb.itemGroupId.length && !fb.itemSubGroupId.length && !fb.itemDescription.length && fb.consumptionQuantity !== 0 && fb.consumptionRatePerUnit !== 0 );

        if ( !isValidatedFabricDetails() && !isValidatedAccessoriesDetails() ) {
            dispatch( addCosting( submitObj, push ) );
        } else {
            if ( isValidatedFabricDetails() ) {
                notify( 'warning', 'Please provide all required of Fabric Details' );
            } else if ( isValidatedAccessoriesDetails() ) {
                notify( 'warning', 'Please provide all required of Accessories Details' );
            }
        }


        //  console.log( isFabricValidated );

    };

    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false,
            state: null
        },
        {
            id: 'costingList',
            name: 'Costings',
            link: "/costings",
            isActive: false,
            state: null
        },
        {
            id: 'costingNew',
            name: 'New',
            link: "",
            isActive: true,
            state: costingBasicInfo?.orderId
        }
    ];
    const handleClear = () => {
        dispatch( bindCostingBasicInfo( null ) );
        dispatch( getCostingSizeGroupAndColorsHistory( null, null ) );
        replace( { state: null } );
    };

    const handleCancel = () => {
        replace( '/costings' );
        dispatch( clearAllCostingState( null ) );
        dispatch( clearAllBuyerState( null ) );
        replace( { state: null } );
    };


    const isPermittedByStatus = ( status, approvedById ) => {

        if ( status === "Approved" && approvedById ) {
            const permitted = !isPermit( userPermission?.CostingCanApprove, authPermissions )
                || !( authenticateUser?.id === costingBasicInfo?.approvedById )
                || !authenticateUser.permissibleProcesses.some( p => p === permissibleProcessObj.costing );
            return permitted;
        } else {
            const permitted = !isPermit( userPermission?.CostingCanApprove, authPermissions )
                || !authenticateUser.permissibleProcesses.some( p => p === permissibleProcessObj.costing );
            return permitted;
        }
    };

    const handleGetPurchaseOrderAndFob = ( orders, fob ) => {
        const uniqOrders = _.uniqBy( orders, 'orderId' );
        const fobOrders = uniqOrders.filter( order => order.ratePerUnit < fob ).map( o => o.orderNumber );
        return fobOrders;
    };

    return (
        <div>
            <ActionMenu breadcrumb={breadcrumb} title='New Costing' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        type="submit"
                        onClick={handleSubmit( onSubmit )}
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
            </ActionMenu>
            {isCostingDataProgress ? <Spinner /> : (

                <Card className="mt-3 costing-form">
                    <CardBody>
                        < >
                            <Row >
                                <Col>
                                    <div
                                        className='divider divider-left'
                                        onClick={() => { setSingleStyleOpen( !singleStyleOpen ); }}
                                    >
                                        <div
                                            className='divider-text text-secondary font-weight-bolder'>Master Info
                                            <span >
                                                <Button.Ripple
                                                    style={{ padding: '0.4rem' }}
                                                    className='btn-icon'
                                                    size="sm"
                                                    color='flat-secondary'
                                                >
                                                    <ChevronUp
                                                        hidden={singleStyleOpen}
                                                        size={18}
                                                        color='grey'
                                                        onClick={() => { setSingleStyleOpen( !singleStyleOpen ); }}
                                                    />
                                                    <ChevronDown
                                                        hidden={!singleStyleOpen}
                                                        size={18}
                                                        color='grey'
                                                        onClick={() => { setSingleStyleOpen( !singleStyleOpen ); }}
                                                    />
                                                </Button.Ripple>
                                            </span>
                                        </div>
                                    </div>
                                    {/* <div onClick={() => { setSingleStyleOpen( !singleStyleOpen ); }}>
                                    <div className='d-flex justify-content-between'>

                                        <div className='divider divider-left '>
                                            <div className='divider-text text-secondary font-weight-bolder'>Master Info</div>
                                        </div>
                                        <span >
                                            <Button.Ripple style={{ padding: '0.4rem' }} className='btn-icon' size="sm" color='flat-secondary'>
                                                <ChevronUp
                                                    hidden={singleStyleOpen}
                                                    size={18}
                                                    color='grey'
                                                    onClick={() => { setSingleStyleOpen( !singleStyleOpen ); }}
                                                />
                                                <ChevronDown
                                                    hidden={!singleStyleOpen}
                                                    size={18}
                                                    color='grey'
                                                    onClick={() => { setSingleStyleOpen( !singleStyleOpen ); }}
                                                />
                                            </Button.Ripple>

                                        </span>
                                    </div>
                                </div> */}
                                    <Collapse isOpen={singleStyleOpen}>


                                        <div className="border rounded rounded-3 p-1">
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >

                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='costingNumberId'> Costing No</Label>
                                                                <Label className='custom-form-colons'> : </Label>

                                                                <div className='custom-form-input-group'>
                                                                    <div className='custom-input-group-prepend inside-btn'>
                                                                        <Input
                                                                            id="costingNumberId"
                                                                            name="costingNumber"
                                                                            type="text"
                                                                            bsSize="sm"
                                                                            onFocus={( e ) => { e.target.select(); }}
                                                                            value={costingBasicInfo?.costingNumber}
                                                                            onChange={( e ) => { handleInputOnChange( e ); }}
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
                                                                    {/* <InputGroup>

                                                                    <Select
                                                                        id='buyerId'
                                                                        name="buyer"
                                                                        isSearchable
                                                                        ///    isDisabled
                                                                        menuPosition="fixed"
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={dropDownBuyers}
                                                                        classNamePrefix='dropdown'
                                                                        innerRef={register( { required: true } )}

                                                                        value={costingBasicInfo?.buyer}
                                                                        onChange={( data, e ) => {
                                                                            handleDetailsDropdownOChange( data, e );
                                                                        }}

                                                                        onFocus={() => { handleBuyerOnFocus(); }}

                                                                    />
                                                                    <InputGroupAddon style={{ zIndex: 0 }} addonType="append">
                                                                        <Button.Ripple tag={InputGroupText}
                                                                            onClick={() => { handleCostingSearchModal(); }}
                                                                            className='btn-icon pt-0 pb-0'
                                                                            color='flat-primary'
                                                                        >
                                                                            <Search size={16} />
                                                                        </Button.Ripple>
                                                                    </InputGroupAddon>
                                                                    {errors && errors.cm && <FormFeedback>CM is required!</FormFeedback>}
                                                                </InputGroup> */}
                                                                </div>

                                                            </div>
                                                            {/* <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='costingNumberId'> Costing No</Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-input-group'>
                                                                <Input
                                                                    id="costingNumberId"
                                                                    name="costingNumber"
                                                                    type="text"
                                                                    bsSize="sm"
                                                                    onFocus={( e ) => { e.target.select(); }}
                                                                    value={costingBasicInfo?.costingNumber}
                                                                    onChange={( e ) => { handleInputOnChange( e ); }}
                                                                />
                                                            </div>
                                                        </div> */}
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='buyerId'> Buyer</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Select
                                                                        id='buyerId'
                                                                        name="buyer"
                                                                        isSearchable
                                                                        isLoading={!isBuyerDropdownLoaded}
                                                                        ///    isDisabled
                                                                        menuPosition="fixed"
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={dropDownBuyers}
                                                                        classNamePrefix='dropdown'
                                                                        className={classnames( 'erp-dropdown-select' )}
                                                                        innerRef={register( { required: true } )}
                                                                        value={costingBasicInfo?.buyer}
                                                                        onChange={( data, e ) => {
                                                                            handleDetailsDropdownOChange( data, e );
                                                                        }}

                                                                        onFocus={() => { handleBuyerOnFocus(); }}

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
                                                                            isSearchable
                                                                            isLoading={!isBuyerStylesDropdownLoaded}
                                                                            //     isDisabled
                                                                            menuPosition="fixed"
                                                                            isClearable
                                                                            theme={selectThemeColors}
                                                                            options={buyerStylesDropdown.filter( style => style.isSetStyle === false )}
                                                                            classNamePrefix='dropdown'
                                                                            innerRef={register( { required: true } )}
                                                                            className={classnames( 'erp-dropdown-select' )}
                                                                            value={costingBasicInfo?.style}
                                                                            onChange={( data, e ) => {
                                                                                handleDetailsDropdownOChange( data, e );
                                                                            }}
                                                                            onFocus={() => { handleStyleOnFocus( costingBasicInfo?.buyer?.value ); }}

                                                                        />
                                                                        {/* <div style={{ display: "flex", justifyContent: 'flex-end', alignItems: 'center' }}>
                                                                        <span style={{ color: 'green', fontWeight: 'bolder', fontSize: "1.2rem", marginRight: '0.5rem' }}>*</span>
                                                                        <span style={{ fontWeight: 'bold', fontSize: '0.7rem', fontStyle: 'italic' }}> Buyer PO  Modal Open Button</span>
                                                                    </div> */}
                                                                    </div>
                                                                    <div className='custom-input-group-append inside-btn'>
                                                                        <span>
                                                                            <Button.Ripple
                                                                                className='btn-icon'
                                                                                disabled={costingBasicInfo?.status?.label === 'Pre-Costing'}
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
                                                        <Col xs={12} sm={12} md={12} lg={8} xl={8} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label col-div-8 costing' for='styleDescriptionId'>Style Description</Label>
                                                                <Label className='custom-form-colons col-div-8 costing'> : </Label>
                                                                <div className='custom-form-group col-div-8 costing'>
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
                                                                    <CreatableSelect
                                                                        id='costingTermId'
                                                                        isSearchable
                                                                        isClearable
                                                                        maxMenuHeight={200}
                                                                        menuShouldScrollIntoView
                                                                        theme={selectThemeColors}
                                                                        options={selectTerm}
                                                                        classNamePrefix='dropdown'
                                                                        //   className="erp-dropdown-select"

                                                                        innerRef={register( { required: true } )}
                                                                        className={classnames( `erp-dropdown-select ${( errors && errors.costingTerm && !costingBasicInfo?.costingTerm ) && 'is-invalid'}` )}

                                                                        // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                                        value={costingBasicInfo?.costingTerm}
                                                                        onChange={data => {
                                                                            handleCostingTermDropdown( data );
                                                                        }}
                                                                    />
                                                                    {/* {errors && errors?.costingTerm && <FormFeedback>Costing Term is required!</FormFeedback>} */}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='uomId'> Costing Per</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-input-group'>
                                                                    <div className='custom-input-group-prepend inside-number'>
                                                                        <Input
                                                                            name="costingQuantity"
                                                                            type="number"
                                                                            bsSize="sm"
                                                                            onFocus={( e ) => { e.target.select(); }}
                                                                            value={costingBasicInfo?.costingQuantity}
                                                                            onChange={( e ) => { handleInputOnChange( e ); }}
                                                                        />
                                                                        {errors && errors.pcs && <FormFeedback>PCS is required!</FormFeedback>}
                                                                    </div>
                                                                    <div className='custom-input-group-append inside-dropdown'>
                                                                        <Select
                                                                            id='uomId'
                                                                            isSearchable
                                                                            isClearable
                                                                            isLoading={!isDefaultUOMDropdownLoaded}
                                                                            theme={selectThemeColors}
                                                                            options={defaultUOMDropdown}
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
                                                                        isSearchable
                                                                        isClearable
                                                                        isLoading={!isCurrencyDropdownLoaded}
                                                                        theme={selectThemeColors}
                                                                        options={currencyDropdown}
                                                                        classNamePrefix='dropdown'

                                                                        innerRef={register( { required: true } )}
                                                                        value={costingBasicInfo?.currency}
                                                                        className={classnames( `erp-dropdown-select ${( errors && errors.currency && !costingBasicInfo?.currency ) && 'is-invalid'}` )}

                                                                        onChange={data => {
                                                                            handleCurrencyDropdown( data );
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
                                                                    <Input
                                                                        id='dateId'
                                                                        type='date'
                                                                        bsSize="sm"
                                                                        name='costingDate'
                                                                        defaultValue={moment( new Date() ).format( 'yy-MM-DD' )}
                                                                        // value={costingBasicInfo?.costingDate}
                                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                                        className={classnames( { 'is-invalid': errors['dateId'] } )}
                                                                    />
                                                                    {errors && errors.dateId && <FormFeedback>Date is required!</FormFeedback>}
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
                                                                        isSearchable
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={selectShipment}
                                                                        classNamePrefix='dropdown'
                                                                        innerRef={register( { required: true } )}
                                                                        className={classnames( `erp-dropdown-select ${( errors && errors.shipmentMode && !costingBasicInfo?.shipmentMode ) && 'is-invalid'}` )}
                                                                        value={costingBasicInfo?.shipmentMode}
                                                                        onChange={data => {
                                                                            handleShipmentModeDropdown( data );
                                                                        }}
                                                                    />
                                                                    {/* {errors && errors?.shipmentModeId && <FormFeedback>Shipment Mode is required!</FormFeedback>} */}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div hidden={costingBasicInfo?.status?.label === 'Pre-Costing'} className='custom-form-main'>
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
                                                            <div hidden={costingBasicInfo?.status?.label !== 'Pre-Costing'} className='custom-form-main'>
                                                                <Label className='custom-form-label' for='shipmentDateId'>Shipment Date</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Input
                                                                        id='shipmentDateId'
                                                                        type={costingBasicInfo?.status?.label !== 'Pre-Costing' ? 'text' : 'date'}
                                                                        bsSize="sm"
                                                                        name='shipmentDate'
                                                                        disabled={costingBasicInfo?.status?.label !== 'Pre-Costing'}
                                                                        value={costingBasicInfo?.status?.label !== 'Pre-Costing' ? '' : costingBasicInfo?.shipmentDate}
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
                                                                        bsSize="sm"
                                                                        name='fobAmount'
                                                                        placeholder='0'
                                                                        innerRef={register( { required: true } )}
                                                                        invalid={errors.fobAmount && true}
                                                                        value={isZeroToFixed( sumOfBuyerAmountTotal(), 6 )}
                                                                        disabled
                                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                                        className={classnames( { 'is-invalid': errors['fobAmount'] }, 'text-right' )}
                                                                        onFocus={e => { e.target.select(); }}
                                                                    />
                                                                    {errors && errors.fobAmount && <FormFeedback>FOB is required!</FormFeedback>}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='cmId'>CM%</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <InputGroup>

                                                                        <Input
                                                                            id="cmId"
                                                                            type="number"
                                                                            bsSize="sm"
                                                                            name="cm"
                                                                            disabled
                                                                            // value={costingGroupsSummary.find( cgs => cgs.name === 'CM' )?.buyerAmount}
                                                                            value={isZeroToFixed( cm, 6 )}
                                                                            onChange={e => e.preventDefault()}
                                                                            innerRef={register( { required: false } )}
                                                                            className={classnames( 'text-right' )}
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
                                                                        type='number'
                                                                        placeholder='0.00000'
                                                                        name='effectiveCM'
                                                                        bsSize="sm"
                                                                        disabled
                                                                        onChange={e => e.preventDefault()}
                                                                        // value={costingGroupsSummary.find( cgs => cgs.name === 'CM' )?.buyerAmount}
                                                                        value={isZeroToFixed( cm, 6 )}
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
                                                                        value={isZeroToFixed( sumOfBuyerAmountTotal(), 0 )}
                                                                        onChange={( e ) => { e.preventDefault(); }}
                                                                        disabled
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
                                                                <Label className='custom-form-label' for='quotedId'>Qtd. Price(Per PCS)</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Input
                                                                        id='quotedId'
                                                                        type='number'
                                                                        name='totalQuotedPrice'
                                                                        bsSize="sm"
                                                                        value={isZeroToFixed( costingBasicInfo?.totalQuotedPrice, 6 )}
                                                                        onChange={( e ) => { e.preventDefault(); }}
                                                                        disabled
                                                                        placeholder='0.00'
                                                                        className='text-right'
                                                                        onFocus={e => { e.target.select(); }}

                                                                    />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='merchandiserId'>Merchandiser</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    {/* <Input
                                                                    id='merchandiserId'
                                                                    type='text'
                                                                    disabled
                                                                    bsSize="sm"
                                                                    name='merchandiser'
                                                                    placeholder='Merchandiser'
                                                                    value={authenticateUser?.name}
                                                                    onChange={( e ) => { handleInputOnChange( e ); }}
                                                                    className={classnames( { 'is-invalid': errors['styleNo'] } )}
                                                                /> */}
                                                                    <Select
                                                                        isSearchable
                                                                        isLoading={!isUserDropdownLoaded}
                                                                        isClearable
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
                                                    <Row hidden={costingBasicInfo?.status?.label !== 'Pre-Costing'}>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='expectedQtyId'>Expected Qty.</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Input
                                                                        id='expectedQtyId'
                                                                        type='number'
                                                                        name='expectedQuantity'
                                                                        disabled={costingBasicInfo?.status?.label !== 'Pre-Costing'}
                                                                        value={costingBasicInfo?.status?.label === 'Pre-Costing' ? costingBasicInfo?.expectedQuantity : 0}
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
                                                                {/* {_.uniqWith( costingBasicInfo?.styleOrderDetails, ( a, b ) => a.orderId === b.orderId && a.shipmentDate === b.shipmentDate )?.map( ( order, index ) => (
                                                            <tr key={order?.rowId}>
                                                                <td className='sl'>{index + 1}</td>
                                                                <td>{order.orderNumber}</td>
                                                                <td>{moment( order.shipmentDate ).format( "DD-MM-YYYY" )}</td>
                                                                <td>{order.sizeGroup ? _.uniqBy( costingBasicInfo?.styleOrderDetails.filter( o => o.orderId === order.orderId && o.shipmentDate === order.shipmentDate ), 'sizeGroupId' ).map( sg => sg.sizeGroup ).join( ', ' ) : 'NA'}</td>
                                                                <td>{_.uniqBy( costingBasicInfo?.styleOrderDetails.filter( o => o.orderId === order.orderId && o.shipmentDate === order.shipmentDate ), 'colorId' ).map( sg => sg.color ).join( ', ' )}</td>
                                                            </tr>
                                                        ) )
                                                        } */}

                                                                {costingBasicInfo?.styleOrderDetails?.map( ( order, index ) => (
                                                                    <tr key={order?.rowId}>
                                                                        <td className='sl'>{index + 1}</td>
                                                                        <td>{order.orderNumber}</td>
                                                                        <td>{moment( order.shipmentDate ).format( "DD-MM-YYYY" )}</td>
                                                                        <td>{order.sizeGroup}</td>
                                                                        <td>{order.color}</td>
                                                                        <td>{order.destination}</td>
                                                                        <td className='action'>
                                                                            <Button.Ripple id="deleteCostingPO"
                                                                                tag={Label}
                                                                                onClick={() => { handleDeleteCostingPODetails( order.rowId ); }}
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
                                                    <th style={{ width: '18%' }} className='text-center  small'><strong>%</strong></th>
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
                                                                    onChange={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    onBlur={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    disabled={i.name === 'Accessories' || i.name === 'Fabric' || i.name === 'Total' || i.isCalculateInPercentage}
                                                                />
                                                            </td>
                                                            <td className=' text-center '>
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
                                                                    onChange={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    onBlur={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    disabled={i.isCalculateInPercentage || i.name === 'Accessories' || i.name === 'Fabric' || i.name === 'Total'}
                                                                />
                                                            </td>
                                                            <td className=' text-center '>
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
                                                                    onChange={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    onBlur={e => { handleCostingGroupChange( e, i.id ); }}
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
                                                <CostingDetailsForm />
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
                                                        <CreatableSelect
                                                            menuPlacement="top"
                                                            id='statusId'
                                                            isDisabled={!isPermit( userPermission?.CostingCanApprove, authPermissions )}

                                                            isSearchable
                                                            isClearable
                                                            theme={selectThemeColors}
                                                            options={costingStatus}
                                                            classNamePrefix='dropdown'
                                                            className="erp-dropdown-select"
                                                            innerRef={register( { required: true } )}
                                                            // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                            value={costingBasicInfo?.status}
                                                            onChange={data => {
                                                                handleCostingStatus( data );
                                                            }}
                                                        />
                                                        {errors && errors?.statusId && <FormFeedback>Status is required!</FormFeedback>}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label' for='statusId'>Approved By</Label>
                                                    <Label className='custom-form-colons'> : </Label>
                                                    <div className='custom-form-group'>

                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label' for='statusId'>Approved Date</Label>
                                                    <Label className='custom-form-colons'> : </Label>
                                                    <div className='custom-form-group'>

                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>

                        </>
                    </CardBody>
                </Card> )
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
                    />
                )
            }


        </div >
    );
};

export default CostingAddForm;

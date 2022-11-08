import '@custom-styles/basic/custom-form.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { MinusSquare, MoreHorizontal } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomPreLoader from '../../../../utility/custom/CustomPreLoader';
import { notify } from '../../../../utility/custom/notifications';
import OperationProgress from '../../../../utility/custom/OperationProgress';
import { confirmObj, defaultUnitId } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';
import { getDefaultUOMDropdownByUnitId } from '../../../inventory/unit-sets/store/actions';
import { getBuyersStyles, getDropDownBuyers } from '../../buyer/store/actions';
import { addConsumption, bindConsumptionBasicInfo, cleanAllConsumptionState, getConsumptionStylePurchaseOrderDetails } from '../store/actions';
import ConsumptionDetailsForm from './ConsumptionDetailsForm';
import ConsumptionStylePurchaseOrderModal from './ConsumptionStylePurchaseOrderModal';

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
        name: 'New Consumption',
        link: "#",
        isActive: true
    }
];
const ConsumptionCloneForm = () => {
    const dispatch = useDispatch();
    const { replace, push } = useHistory();
    const state = JSON.parse( localStorage.getItem( 'buyerAndStyle' ) );

    const {
        consumptionBasicInfo,
        consumptionFabricDetails,
        consumptionAccessoriesDetails,
        consumptionPackagingAccessories,
        isConsumptionDataLoaded
    } = useSelector( ( { consumptions } ) => consumptions );

    const { defaultUOMDropdown } = useSelector( ( { unitSets } ) => unitSets );
    const defaultUOMSet = defaultUOMDropdown?.find( uom => uom?.isBaseUnit === true );
    const { dropDownBuyers, buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );
    const [consumptionPurchaserOrderModal, setConsumptionPurchaserOrderModal] = useState( false );


    const handleBuyerDropdownOnFocus = () => {
        dispatch( getDropDownBuyers() );
    };
    useEffect( () => {
        dispatch( getDefaultUOMDropdownByUnitId( defaultUnitId ) );
    }, [] );

    const handleBuyerDataBind = () => {
        const updateObj = {
            ...consumptionBasicInfo,
            buyer: state.buyer,
            style: state?.style
        };
        console.log( updateObj );

        dispatch( bindConsumptionBasicInfo( updateObj ) );
    };

    useEffect( () => {
        // handleBuyerDataBind();
    }, [] );

    const handleBuyerStyleDropdownOnFocus = ( buyerId ) => {
        dispatch( getBuyersStyles( buyerId ) );
    };

    const handleStylePurchaseOrderModal = () => {
        setConsumptionPurchaserOrderModal( !consumptionPurchaserOrderModal );
        dispatch( getConsumptionStylePurchaseOrderDetails( consumptionBasicInfo?.buyer?.value, consumptionBasicInfo.style?.value ) );
    };


    const handleBuyerDropdown = ( data ) => {
        const updateObj = {
            ...consumptionBasicInfo,
            buyerId: data?.value,
            buyerName: data?.label,
            buyer: data,
            style: null,
            styleId: '',
            styleNumber: ''

        };
        dispatch( bindConsumptionBasicInfo( updateObj ) );
        // dispatch( getBuyersStyles( data?.value ) );
        dispatch( getBuyersStyles( null ) );

        const obj = {
            ...state,
            buyer: data,
            style: null,
            status: '',
            styleDescription: '',
            styleCategory: '',
            isSetStyle: false

        };
        localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );


    };


    const handlePOStyleDropDown = ( data ) => {

        const updateObj = {
            ...consumptionBasicInfo,
            style: data,
            styleId: data?.value ?? '',
            styleNumber: data?.label ?? '',
            costing: null,
            costingId: '',
            costingNumber: '',
            isConsumptionNew: false

        };
        dispatch( bindConsumptionBasicInfo( updateObj ) );
        //dispatch( bindConsumptionAccessoriesDetails( [] ) );
        dispatch( getConsumptionStylePurchaseOrderDetails( consumptionBasicInfo?.buyer?.value, data?.value ) );

        const obj = {
            ...state,
            style: data,
            status: data?.status ?? '',
            styleDescription: data?.description ?? '',
            styleCategory: data?.styleCategory ?? '',
            isSetStyle: data?.isSetStyle

        };
        localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );
    };

    const handleConsumptionInputOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...consumptionBasicInfo,
            [name]: value
        };
        dispatch( bindConsumptionBasicInfo( updatedObj ) );
    };

    const handleDeleteConsumptionPODetails = ( rowId ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                const updatedData = consumptionBasicInfo.styleOrderDetails.filter( o => o.rowId !== rowId );
                const updateObj = {
                    ...consumptionBasicInfo,
                    ['styleOrderDetails']: updatedData
                };
                dispatch( bindConsumptionBasicInfo( updateObj ) );
            }
        } );

    };

    const handleFabricRowSubRowNoGenerator = ( data, mainRow ) => {

        const filteredFabric = consumptionFabricDetails.filter( fabric => fabric.itemGroupId === data.itemGroupId && fabric.itemSubGroupId === data.itemSubGroupId );

        const fabricWithRowDefine = filteredFabric.map( ( fab, index ) => ( {
            ...fab,
            rowNo: mainRow,
            subRowNo: index + 1
        } ) );
        return fabricWithRowDefine;
    };

    const uniqFabric = _.uniqWith(
        consumptionFabricDetails,
        ( a, b ) => a.itemGroupId === b.itemGroupId &&
            a.itemSubGroupId === b.itemSubGroupId
    );

    const fabricWithSubGroupRowNo = uniqFabric.map( ( fabric, index ) => handleFabricRowSubRowNoGenerator( fabric, index + 1 ) ).flat();


    const handleAccessoriesRowSubRowNoGenerator = ( data, mainRow ) => {

        const filteredAccessories = consumptionAccessoriesDetails.filter( accessories => accessories.itemGroupId === data.itemGroupId && accessories.itemSubGroupId === data.itemSubGroupId );

        const accessoriesWithRowDefine = filteredAccessories.map( ( fab, index ) => ( {
            ...fab,
            rowNo: mainRow,
            subRowNo: index + 1
        } ) );
        return accessoriesWithRowDefine;
    };

    const uniqAccessories = _.uniqWith(
        consumptionAccessoriesDetails,
        ( a, b ) => a.itemGroupId === b.itemGroupId &&
            a.itemSubGroupId === b.itemSubGroupId
    );

    const accessoriesWithSubGroupRowNo = uniqAccessories.map( ( accessories, index ) => handleAccessoriesRowSubRowNoGenerator( accessories, index + 1 ) ).flat();

    const isItemDescriptionAllSegmentValueValid = ( segments ) => {
        const validated = segments.filter( sg => !sg.isColorSensitive && !sg.isSizeSensitive ).every( s => s.value !== null );
        return !validated;
    };

    const isFabricItemsErrors = () => {
        const validationErrors = {};
        let errors = [];
        const errorField = fabricWithSubGroupRowNo.filter( f => f.isRowEditableState ).map( fabric => {
            if (
                fabric.consumptionQuantity === 0
                || fabric.ratePerUnit === 0
                || fabric.consumptionPerGarment === 0
                || !fabric.consumptionPerGarmentUomValue
                || !fabric.orderUOMValue
                || !fabric.currencyValue
                || !fabric.purchaseTypeValue
                || isItemDescriptionAllSegmentValueValid( fabric?.itemSegments )
                || ( fabric.isSensibilityAlreadyLoadedOnRow && !fabric?.colorSensitivities.length && fabric?.hasAnyColorSensitivity )
                || ( fabric.isSensibilityAlreadyLoadedOnRow && !fabric?.sizeSensitivities.length && fabric?.hasAnySizeSensitivity )
            ) {
                Object.assign( validationErrors,
                    fabric.consumptionQuantity === 0 &&
                    { consumptionQty: `(Row:  ${fabric.rowNo}-(${fabric.subRowNo})) Fabric: Cons. Qty is Zero ` },
                    fabric.ratePerUnit === 0 &&
                    { ratePerUnit: `(Row:  ${fabric.rowNo}-(${fabric.subRowNo})) Fabric: Rate Qty is Zero` },
                    fabric.consumptionPerGarment === 0 &&
                    { consumptionPerGarment: `(Row:  ${fabric.rowNo}-(${fabric.subRowNo})) Fabric: Cons. Per Garment is Zero` },
                    !fabric.consumptionPerGarmentUomValue &&
                    { consumptionPerGarmentUom: `(Row:  ${fabric.rowNo}-(${fabric.subRowNo})) Fabric: Cons. Per Garment UOM is required` },
                    !fabric.orderUOMValue &&
                    { orderUOM: `(Row:  ${fabric.rowNo}-(${fabric.subRowNo})) Fabric: Order UOM is required` },
                    !fabric.currencyValue &&
                    { currency: `(Row:  ${fabric.rowNo}-(${fabric.subRowNo})) Fabric: Currency is required ` },
                    !fabric.purchaseTypeValue &&
                    { purchaseType: `(Row:  ${fabric.rowNo}-(${fabric.subRowNo})) Fabric: Purchase Type is required` },

                    isItemDescriptionAllSegmentValueValid( fabric?.itemSegments ) &&
                    { itemSegments: `(Row:  ${fabric.rowNo}-(${fabric.subRowNo})) Fabric: Please provide every segment value on Item Description` },

                    ( fabric.isSensibilityAlreadyLoadedOnRow && !fabric?.colorSensitivities.length && fabric?.hasAnyColorSensitivity ) &&
                    { colorSensitivities: `(Row:  ${fabric.rowNo}-(${fabric.subRowNo})) Fabric: Please provide color sensitivity!!!` },

                    ( fabric.isSensibilityAlreadyLoadedOnRow && !fabric?.sizeSensitivities.length && fabric?.hasAnySizeSensitivity ) &&
                    { hasAnySizeSensitivity: `(Row:  ${fabric.rowNo}-(${fabric.subRowNo})) Fabric: Please provide size sensitivity!!!` }

                );
                errors = [...errors, ...Object.values( validationErrors )];

                fabric['isFieldError'] = true;
            } else {
                fabric['isFieldError'] = false;
            }
            return fabric;
        } );
        // dispatch( bindStylePurchaseOrderDetails( errorField ) );
        if ( errors.length ) notify( 'errors', errors );
        return errorField.some( e => e.isFieldError );
    };
    const isAccessoriesItemsErrors = () => {
        const validationErrors = {};
        let errors = [];
        const errorField = accessoriesWithSubGroupRowNo.filter( a => a.isRowEditableState ).map( accessories => {
            if (
                accessories.consumptionQuantity === 0
                || accessories.ratePerUnit === 0
                || accessories.consumptionPerGarment === 0
                || !accessories.consumptionPerGarmentUomValue
                || !accessories.orderUOMValue
                || !accessories.currencyValue
                || !accessories.purchaseTypeValue
                || isItemDescriptionAllSegmentValueValid( accessories?.itemSegments )
                || ( accessories.isSensibilityAlreadyLoadedOnRow && !accessories?.colorSensitivities.length && accessories?.hasAnyColorSensitivity )
                || ( accessories.isSensibilityAlreadyLoadedOnRow && !accessories?.sizeSensitivities.length && accessories?.hasAnySizeSensitivity )
            ) {
                Object.assign( validationErrors,
                    accessories.consumptionQuantity === 0 &&
                    { consumptionQty: `(Row:  ${accessories.rowNo}-(${accessories.subRowNo})) Accessories: Cons. Qty is Zero ` },
                    accessories.ratePerUnit === 0 &&
                    { ratePerUnit: `(Row:  ${accessories.rowNo}-(${accessories.subRowNo})) Accessories: Rate Qty is Zero` },
                    accessories.consumptionPerGarment === 0 &&
                    { consumptionPerGarment: `(Row:  ${accessories.rowNo}-(${accessories.subRowNo})) Accessories: Cons. Per Garment is Zero` },
                    !accessories.consumptionPerGarmentUomValue &&
                    { consumptionPerGarmentUom: `(Row:  ${accessories.rowNo}-(${accessories.subRowNo})) Accessories: Cons. Per Garment UOM is required` },
                    !accessories.orderUOMValue &&
                    { orderUOM: `(Row:  ${accessories.rowNo}-(${accessories.subRowNo})) Accessories: Order UOM is required` },
                    !accessories.currencyValue &&
                    { currency: `(Row:  ${accessories.rowNo}-(${accessories.subRowNo})) Accessories: Currency is required ` },
                    !accessories.purchaseTypeValue &&
                    { purchaseType: `(Row:  ${accessories.rowNo}-(${accessories.subRowNo})) Accessories: Purchase Type is required` },

                    isItemDescriptionAllSegmentValueValid( accessories?.itemSegments ) &&
                    { itemSegments: `(Row:  ${accessories.rowNo}-(${accessories.subRowNo})) Accessories: Please provide every segment value on Item Description` },

                    ( accessories.isSensibilityAlreadyLoadedOnRow && !accessories?.colorSensitivities.length && accessories?.hasAnyColorSensitivity ) &&
                    { colorSensitivities: `(Row:  ${accessories.rowNo}-(${accessories.subRowNo})) Accessories: Please provide color sensitivity!!!` },

                    ( accessories.detailId === 0 && !accessories?.sizeSensitivities.length && accessories?.hasAnySizeSensitivity ) &&
                    { hasAnySizeSensitivity: `(Row:  ${accessories.rowNo}-(${accessories.subRowNo})) Accessories: Please provide size sensitivity!!!` }

                );
                errors = [...errors, ...Object.values( validationErrors )];

                accessories['isFieldError'] = true;
            } else {
                accessories['isFieldError'] = false;
            }
            return accessories;
        } );
        // dispatch( bindStylePurchaseOrderDetails( errorField ) );
        if ( errors.length ) notify( 'errors', errors );
        return errorField.some( e => e.isFieldError );
    };


    const handleSubmit = () => {
        const fabricDetails = fabricWithSubGroupRowNo.filter( f => f.isRowEditableState ).map( fabric => ( {
            rowNo: fabric.rowNo,
            subRowNo: fabric.subRowNo,
            costingGroupType: fabric.costingGroupType,
            itemGroupId: fabric.itemGroupId,
            itemSubGroupId: fabric.itemSubGroupId,
            itemDescription: fabric.itemDescription.trim(),
            itemDescriptionTemplate: fabric.itemDescriptionTemplate,
            consumptionQuantity: Number( fabric.consumptionQuantity ),
            consumptionUom: fabric.consumptionUom,
            wastagePercent: Number( fabric.wastagePercent ),
            consumptionPerGarment: fabric.consumptionPerGarment,
            consumptionPerGarmentUom: defaultUOMSet?.label,
            orderUOM: fabric.orderUOM,
            currencyCode: fabric.currencyCode,
            ratePerUnit: fabric.ratePerUnit,
            purchaseType: fabric.purchaseType,
            buyerSupplied: fabric.buyerSupplied,
            //preferredSupplier: fabric.preferredSupplier,
            isBomOnShipmentQty: fabric.isBomOnShipmentQty,
            remarks: fabric.remarks,
            consumptionPerGarmentRelativeFactor: defaultUOMSet?.relativeFactor,
            orderUomRelativeFactor: fabric.orderUomRelativeFactor,
            consumptionUomRelativeFactor: fabric.consumptionUomRelativeFactor,
            status: fabric.status,
            isAllDestinationApplicable: fabric.isAllDestinationApplicable,
            applicableDestinations: [],
            colorSensitivityType: fabric.colorSensitivityType,
            sizeSensitivityType: fabric.sizeSensitivityType,
            isApproved: fabric.isApproved,
            garmentPart: fabric.garmentPart?.value ?? '',

            supplierId: fabric.preferredSupplierValue?.value ?? null,

            // consumptionPurchaseOrderSizes,
            // consumptionPurchaseOrderColors,

            isAllSizeApplicable: fabric.isAllSizeApplicable,
            isAllColorApplicable: fabric.isAllColorApplicable,

            applicableSizes: fabric.isAllSizeApplicable ? [] : fabric.consumptionPurchaseOrderSizes.filter( s => s.isSelected === true ).map( size => size.sizeId ),
            applicableColors: fabric.isAllColorApplicable ? [] : fabric.consumptionPurchaseOrderColors.filter( s => s.isSelected === true ).map( color => color.colorId ),

            colorSensitivities: fabric?.colorSensitivities ? fabric?.colorSensitivities?.filter( cs => cs.value !== "" ).map( colorSens => ( {
                segmentId: colorSens.segmentId,
                colorId: colorSens.colorId,
                value: colorSens.value
            } ) ) : [],
            sizeSensitivities: fabric?.sizeSensitivities ? fabric?.sizeSensitivities?.filter( ss => ss.value !== "" ).map( sizeSens => ( {
                segmentId: sizeSens.segmentId,
                sizeId: sizeSens.sizeId,
                value: sizeSens.value
            } ) ) : []
        } ) );
        const accessoriesDetails = accessoriesWithSubGroupRowNo.filter( a => a.isRowEditableState ).map( accessories => ( {
            rowNo: accessories.rowNo,
            subRowNo: accessories.subRowNo,
            costingGroupType: accessories.costingGroupType,
            itemGroupId: accessories.itemGroupId,
            itemSubGroupId: accessories.itemSubGroupId,
            itemDescription: accessories.itemDescription.trim(),
            itemDescriptionTemplate: accessories.itemDescriptionTemplate,
            consumptionQuantity: accessories.consumptionQuantity,
            consumptionUom: accessories.consumptionUom,
            wastagePercent: accessories.wastagePercent,
            consumptionPerGarment: accessories.consumptionPerGarment,
            consumptionPerGarmentUom: accessories.consumptionPerGarmentUom,
            orderUOM: accessories.orderUOM,
            currencyCode: accessories.currencyCode,
            ratePerUnit: accessories.ratePerUnit,
            purchaseType: accessories.purchaseType,
            buyerSupplied: accessories.buyerSupplied,
            preferredSupplier: accessories.preferredSupplier,
            consumptionPerGarmentRelativeFactor: accessories.consumptionPerGarmentRelativeFactor,
            orderUomRelativeFactor: accessories.orderUomRelativeFactor,
            consumptionUomRelativeFactor: accessories.consumptionUomRelativeFactor,
            isBomOnShipmentQty: accessories.isBomOnShipmentQty,
            remarks: accessories.remarks,
            status: accessories.status,
            isAllDestinationApplicable: accessories.isAllDestinationApplicable,
            applicableDestinations: [],
            isApproved: accessories.isApproved,
            colorSensitivityType: accessories.colorSensitivityType,
            sizeSensitivityType: accessories.sizeSensitivityType,
            garmentPart: accessories.garmentPart?.value ?? '',

            isAllSizeApplicable: accessories.isAllSizeApplicable,
            isAllColorApplicable: accessories.isAllColorApplicable,

            supplierId: accessories.preferredSupplierValue?.value,


            applicableSizes: accessories.isAllSizeApplicable ? [] : accessories.consumptionPurchaseOrderSizes.filter( s => s.isSelected === true ).map( size => size.sizeId ),
            applicableColors: accessories.isAllColorApplicable ? [] : accessories.consumptionPurchaseOrderColors.filter( s => s.isSelected === true ).map( color => color.colorId ),

            colorSensitivities: accessories?.colorSensitivities ? accessories?.colorSensitivities?.filter( cs => cs.value !== "" )?.map( colorSens => ( {
                segmentId: colorSens.segmentId,
                colorId: colorSens.colorId,
                value: colorSens.value
            } ) ) : [],
            sizeSensitivities: accessories?.sizeSensitivities ? accessories?.sizeSensitivities?.filter( cs => cs.value !== "" )?.map( sizeSens => ( {
                segmentId: sizeSens.segmentId,
                sizeId: sizeSens.sizeId,
                value: sizeSens.value
            } ) ) : []
        } ) );
        const submitObj = {
            buyerId: consumptionBasicInfo.buyer?.value,
            buyerName: consumptionBasicInfo?.buyer?.label,
            styleId: consumptionBasicInfo.style?.value,
            styleNumber: consumptionBasicInfo.style?.label,
            consumptionNumber: consumptionBasicInfo.consumptionNumber,
            fabricDetails,
            styleOrderDetails: consumptionBasicInfo?.styleOrderDetails.map( order => ( {
                orderId: order.orderId,
                orderNumber: order.orderNumber,
                styleId: order.styleId,
                styleNumber: order.styleNumber,
                setStyleId: order.setStyleId,
                setStyleNumber: order.setStyleNumber,
                styleCostingId: order.costingId,
                shipmentDate: order.shipmentDate,
                destination: order.destination
            } ) ),
            accessoriesDetails
        };
        console.log( JSON.stringify( submitObj, null, 2 ) );
        if ( !isFabricItemsErrors() ) {
            if ( !isAccessoriesItemsErrors() ) {
                dispatch( addConsumption( submitObj, push ) );
            }
        }
    };

    console.log( consumptionBasicInfo );


    const handleCancel = () => {
        replace( '/consumptions' );
        dispatch( cleanAllConsumptionState() );
    };

    return (
        <div>
            <Card className="mt-3 consumption-form">
                <CardBody>
                    <ActionMenu breadcrumb={breadcrumb} title='New Consumption' >
                        <NavItem className="mr-1" >
                            <NavLink
                                tag={Button}
                                disabled={!isConsumptionDataLoaded}
                                size="sm"
                                color="primary"
                                onClick={() => { handleSubmit(); }}
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
                        <OperationProgress progress={!isConsumptionDataLoaded} />

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
                                                            isLoading={!dropDownBuyers.length}
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
                                                                handleBuyerDropdown( data, e );
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
                                                                isSearchable
                                                                //  isHidden={consumptionBasicInfo?.isClone}

                                                                isLoading={!buyerStylesDropdown.length}
                                                                isClearable
                                                                theme={selectThemeColors}
                                                                options={buyerStylesDropdown.filter( style => !style.isSetStyle )}
                                                                classNamePrefix='dropdown'
                                                                className="erp-dropdown-select"
                                                                value={consumptionBasicInfo?.style}
                                                                onChange={data => {
                                                                    handlePOStyleDropDown( data );
                                                                }}
                                                                onFocus={() => { handleBuyerStyleDropdownOnFocus( consumptionBasicInfo?.buyer?.value ); }}
                                                            />


                                                        </div>
                                                        <div className='custom-input-group-append inside-btn'>
                                                            <span>
                                                                <Button.Ripple
                                                                    className='btn-icon'
                                                                    outline
                                                                    size="sm"
                                                                    color='secondary'
                                                                    onClick={() => { handleStylePurchaseOrderModal(); }}
                                                                >
                                                                    <MoreHorizontal color='green' size={16} />
                                                                </Button.Ripple>
                                                            </span>
                                                            <span style={{ color: 'green', fontWeight: 'bolder', fontSize: "1.2rem" }}>*</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: 'flex-end', alignItems: 'center', marginTop: '25px' }}>
                                                    <span style={{ color: 'green', fontWeight: 'bolder', fontSize: "1.2rem", marginRight: '0.5rem' }}>*</span>
                                                    <span style={{ fontWeight: 'bold', fontSize: '0.7rem', fontStyle: 'italic' }}> Costing Modal Open Button</span>
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
                                                                <th>Costing NO</th>
                                                                <th>Shipt. Date</th>
                                                                <th>Destination</th>
                                                                <th>Actions</th>
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
                                                                consumptionBasicInfo?.styleOrderDetails?.length > 0 ? (
                                                                    consumptionBasicInfo?.styleOrderDetails?.map( ( order, index ) => (
                                                                        <tr key={order?.rowId}>
                                                                            <td className='sl'>{index + 1}</td>
                                                                            <td>{order.orderNumber}</td>
                                                                            <td>{order.costingNumber}</td>
                                                                            <td>{moment( order.shipmentDate ).format( "DD-MM-YYYY" )}</td>
                                                                            <td>{order.destination}</td>
                                                                            <td className='sl'>
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
                                                                    <td colSpan={6}>There are no records to display</td>
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
                                <div className='divider-text text-secondary font-weight-bolder'>Consumption Details</div>
                            </div>
                            <div hidden={isConsumptionDataLoaded}>
                                <CustomPreLoader />
                            </div>
                            <div hidden={!isConsumptionDataLoaded} className="border rounded rounded-3 p-1">
                                <Row>
                                    <Col>
                                        <ConsumptionDetailsForm />
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                    </Row>
                </CardBody>
            </Card>
            {
                consumptionPurchaserOrderModal && (
                    <ConsumptionStylePurchaseOrderModal
                        openModal={consumptionPurchaserOrderModal}
                        setOpenModal={setConsumptionPurchaserOrderModal}
                    />
                )
            }
        </div>
    );
};

export default ConsumptionCloneForm;

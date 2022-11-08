import { getVendorDropdown } from '@views/inventory/vendor/store/actions';
import { useState } from 'react';
import { Copy, Edit3, Map, MinusSquare, PlusSquare, Search, Settings } from 'react-feather';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Button, CustomInput, Input, Label, Progress } from 'reactstrap';
import { baseAxios } from '../../../../services';
import { inventoryApi } from '../../../../services/api-end-points/inventory';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import { confirmDialog, confirmOK } from '../../../../utility/custom/ConfirmDialog';
import { notify } from '../../../../utility/custom/notifications';
import ResizableTable from '../../../../utility/custom/ResizableTable';
import { confirmObj, permissibleProcessObj, selectDestination, selectPurchaseType, status } from '../../../../utility/enums';
import { insertAfterItemOfArray, isPermit, isZeroToFixed, randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownTrimItemGroupsByGroupName, getItemSegmentArrayByItemGroupId } from '../../../inventory/item-group/store/actions';
import { getCurrencyDropdown } from '../../currency/store/actions';
import { bindConsumptionAccessoriesDetails, deleteConsumptionDetailsItem, getConsumptionSizeColorSense, getConsumptionSizeColorSenseForEdit } from '../store/actions';
import ApplicableSizeAndColorModal from './ApplicableSizeAndColorModal';
import ConsumptionDescriptionGeneratorAccessories from './ConsumptionDescriptionGeneratorAccessories';
import DestinationModal from './DestinationModal';
import SizeColorSenseAccessoriesForm from './SizeColorSenseAccessoriesForm ';
const ExpandableAccessoriesDetails = ( { data } ) => {
    const dispatch = useDispatch();
    const {
        consumptionFabricDetails,
        consumptionAccessoriesDetails,
        consumptionDetailsSizeSens,
        consumptionDetailsColorSens,
        consumptionPurchaseOrderSizes,
        consumptionPurchaseOrderColors,
        consumptionBasicInfo
    } = useSelector( ( { consumptions } ) => consumptions );

    const { userPermission, authenticateUser } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    const { dropDownTrimItemGroups } = useSelector( ( { itemGroups } ) => itemGroups );
    const { defaultUOMDropdown } = useSelector( ( { unitSets } ) => unitSets );
    const [openModal, setOpenModal] = useState( false );
    const [openAccessoriesModal, setOpenAccessoriesModal] = useState( false );

    const [descriptionModalObjForAccessories, setDescriptionModalObjForAccessories] = useState( null );
    const [openDescriptionModalForAccessories, setOpenDescriptionModalForAccessories] = useState( false );
    const { currencyDropdown } = useSelector( ( { currencies } ) => currencies );
    const { vendorDropdown } = useSelector( ( { vendors } ) => vendors );

    const filteredAccessoriesDetails = consumptionAccessoriesDetails.filter( acc => acc.itemGroupId === data.itemGroupId && acc.itemSubGroupId === data.itemSubGroupId );


    const handleCurrencyOnFocus = () => {
        if ( !currencyDropdown.length ) {
            dispatch( getCurrencyDropdown() );
        }
    };

    const handleVendorOnFocus = () => {
        dispatch( getVendorDropdown() );
    };

    const handleAccessoriesItemOnFocus = () => {
        dispatch( getDropDownTrimItemGroupsByGroupName( "Accessories" ) );
    };


    const handleConsumptionUOMOnFocusForAccessories = ( defaultUomSetId, uomArray, fieldId ) => {

        if ( !uomArray.length && defaultUomSetId ) {
            baseAxios.get( `${inventoryApi.unitSet.root}/${defaultUomSetId}` )
                .then( response => {
                    const consumptionUomArray = response?.data?.details?.map( uom => ( {
                        value: uom.id,
                        label: uom.unitName,
                        relativeFactor: uom.relativeFactor
                    } ) );
                    const updatedData = consumptionAccessoriesDetails.map( i => {
                        if ( fieldId === i.fieldId ) {
                            i.consumptionUomArray = consumptionUomArray;
                        }
                        return i;
                    } );
                    dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
                } );
        }
    };


    const handleOrderUomOnFocusForAccessories = ( defaultUomSetId, uomArray, fieldId ) => {
        console.log( defaultUomSetId );
        if ( !uomArray.length && defaultUomSetId ) {
            baseAxios.get( `${inventoryApi.unitSet.root}/${defaultUomSetId}` )
                .then( response => {
                    const orderUomArray = response?.data?.details?.map( uom => ( {
                        value: uom.id,
                        label: uom.unitName,
                        relativeFactor: uom.relativeFactor
                    } ) );
                    const updatedData = consumptionAccessoriesDetails.map( i => {
                        if ( fieldId === i.fieldId ) {
                            i.orderUomArray = orderUomArray;
                        }
                        return i;
                    } );
                    dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
                } );
        }
    };


    const handleRemoveAccessoriesRow = ( accessories ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                if ( accessories.detailId > 0 ) {
                    console.log( "id", accessories.detailId );
                    dispatch( deleteConsumptionDetailsItem( consumptionBasicInfo?.id, accessories?.detailId, 'Accessories' ) );
                } else {
                    const updatedData = [...consumptionAccessoriesDetails];
                    updatedData.splice(
                        updatedData.findIndex( x => x.fieldId === accessories.fieldId ),
                        1
                    );
                    dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
                }

            }
        } );
    };


    const handleEditAccessoriesRow = accessories => {
        const updatedData = consumptionAccessoriesDetails.map( acc => {
            if ( accessories.fieldId === acc.fieldId ) {
                acc["isEdit"] = !acc.isEdit;
                acc["isRowEditableState"] = true;

            }
            return acc;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );

        if ( !consumptionBasicInfo?.styleOrderDetails?.length ) {
            notify( 'warning', 'Please choose a purchase order !!!' );
        } else {
            console.log( 'first', accessories.itemGroupId );
            console.log( 'detail Id', accessories.detailId );
            console.log( 'fabric.isEdit', accessories.isEdit );
            if ( accessories.itemGroupId > 0 ) {
                if ( accessories.detailId > 0 && accessories.isEdit === true ) {

                    if ( !accessories.isSensibilityAlreadyLoadedOnRow ) {
                        const endPoint = `${merchandisingApi.consumption.root}/details/${accessories.detailId}/colorAndSizeSensitivities`;
                        baseAxios.get( endPoint ).then( ( response ) => {
                            if ( response.status === status.success ) {
                                const { colorSensitivities, sizeSensitivities } = response.data;


                                const colorSense = colorSensitivities.map( cs => ( {
                                    randomGenerateId: randomIdGenerator(),
                                    colorId: cs.colorId,
                                    colorName: consumptionPurchaseOrderColors?.find(
                                        ( cn ) => cn.colorId === cs?.colorId
                                    )?.colorName,
                                    segmentId: cs.segmentId,
                                    segment: {
                                        label: cs.value,
                                        value: cs.value
                                    },
                                    value: cs.value,
                                    segmentValues: [],
                                    isValueLoading: false
                                } ) );

                                const sizeSense = sizeSensitivities.map( ss => ( {
                                    randomGenerateId: randomIdGenerator(),
                                    sizeId: ss.sizeId,
                                    sizeName: consumptionPurchaseOrderSizes?.find(
                                        ( sn ) => sn.sizeId === ss?.sizeId
                                    )?.sizeName,
                                    sizeGroupId: ss?.sizeGroupId,
                                    sizeGroup: consumptionPurchaseOrderSizes.find( sg => sg.sizeGroupId === ss.sizeGroupId )?.sizeGroup,
                                    segmentId: ss.segmentId,
                                    segment: {
                                        label: ss.value,
                                        value: ss.value
                                    },
                                    value: ss.value,
                                    segmentValues: [],
                                    isValueLoading: false
                                } ) );

                                const updatedData = consumptionAccessoriesDetails.map( acc => {
                                    if ( accessories.fieldId === acc.fieldId ) {
                                        acc["colorSensitivities"] = colorSense;
                                        acc["sizeSensitivities"] = sizeSense;
                                        acc["isSensibilityAlreadyLoadedOnRow"] = true;
                                    }
                                    return acc;
                                } );
                                dispatch( bindConsumptionAccessoriesDetails( updatedData ) );

                            }

                        } );

                    }


                }
            } else {
                notify( 'error', 'Please select a item Group at first!!!' );
            }
        }

    };

    const handleAddAccessoriesRow = () => {
        const newRow =
        {
            ...data,
            fieldId: randomIdGenerator(),
            detailId: 0,
            rowNo: 0,
            costingGroupType: 2,
            consumptionId: "",
            itemDescription: "",
            itemDescriptionArray: [],
            itemDescriptionValue: null,
            itemDescriptionTemplate: "",
            itemSegments: data.itemSegments.map( s => ( { ...s, value: null } ) ),

            consumptionQuantity: 0,
            //  defaultUomSetId: null,
            //  consumptionUomArray: [],
            //  consumptionUomValue: null, // Extra
            //  consumptionUom: "",
            wastagePercent: 0,
            consumptionPerGarment: 1,
            //  consumptionPerGarmentUomArray: [],
            //  consumptionPerGarmentUomValue: null, // Extra
            //   consumptionPerGarmentUom: "",
            //  consumptionPerGarmentRelativeFactor: 0,
            //  consumptionUomRelativeFactor: 0,
            //  orderUomRelativeFactor: 0,
            ////  orderUomArray: [],
            // orderUOMValue: null, ///Extra
            // orderUOM: "",
            //  currencyValue: null, //Extra
            // currencyCode: "",
            ratePerUnit: 0,
            // purchaseTypeValue: null, //Extra
            //  purchaseType: "",
            isBuyerSupplied: false,
            preferredSupplierValue: null,
            preferredSupplier: "",
            remarks: "",
            statusValue: null,
            garmentPart: null,

            status: "",
            isApproved: false,
            isAllDestinationApplicable: true,
            applicableDestinations: [],
            colorSensitivityType: 3,
            sizeSensitivityType: 3,
            colorSensitivities: [],
            sizeSensitivities: [],
            isAllSizeApplicable: true,
            isAllColorApplicable: true,
            isBomOnShipmentQty: true,
            applicableSizes: [],
            applicableColors: [],
            consumptionPurchaseOrderSizes,
            consumptionPurchaseOrderColors,
            applicableColorIds: [],
            applicableSizeIds: [],
            isRestrictedToChange: false,
            approvedById: null,
            approvedBy: null,
            isApprovedStatus: false,
            isEdit: true,
            isSensibilityAlreadyLoadedOnRow: true,
            isRowEditableState: true
        };
        dispatch( bindConsumptionAccessoriesDetails( [...consumptionAccessoriesDetails, newRow] ) );
    };


    ///For Accessories Input OnChange
    const handleItemGroupDropdownForAccessories = async ( newValue, fieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemGroup = newValue;
                i.itemSubGroupArray = newValue.sub;
                i.consumptionUomArray = [];
                i.orderUOM = newValue?.orderUom;
                i.consumptionUom = newValue?.consumptionUom;
                i.consumptionUomValue = {
                    value: newValue?.consumptionUomId,
                    label: newValue?.consumptionUom
                };
                i.orderUOMValue = {
                    value: newValue?.orderUomId,
                    label: newValue?.orderUom
                };
                i.defaultUomSetId = newValue?.defaultUomSetId;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
        await baseAxios.get( `${inventoryApi.itemGroup.root}/${newValue?.value}/subCategories` ).then( response => {
            const updatedData = consumptionAccessoriesDetails.map( i => {
                if ( fieldId === i.fieldId ) {
                    i.itemGroup = newValue;
                    i.itemGroupId = newValue?.value;
                    i.itemSubGroup = null;
                    i.itemSubGroupId = 0;
                    i.itemSubGroupArray = response?.data?.map( rd => ( {
                        value: rd.id,
                        label: rd.name
                    } ) );
                }
                return i;
            } );
            dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
        } );
    };

    const handleItemSubGroupDropdownForAccessories = ( newValue, fieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemSubGroup = newValue;
                i.itemSubGroupId = newValue?.value;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };

    const handleOnChangeForAccessories = ( e, fieldId, isApproved, itemDescription ) => {
        const { name, value, type, checked } = e.target;
        if ( name === 'isApprovedStatus' && ( !consumptionBasicInfo?.styleOrderDetails?.length || !itemDescription.length ) && !isApproved ) {
            if ( !itemDescription.length ) {
                notify( 'warning', 'Please provide a item description for this item!!!' );
            } else {
                notify( 'warning', 'Please choose a purchase order !!!' );
            }
        } else {
            const updatedData = consumptionAccessoriesDetails.map( i => {
                if ( fieldId === i.fieldId ) {
                    i[name] = ( type === "number" || name === "consumptionQuantity" || name === "wastagePercent" || name === "ratePerUnit" ) ? Number( value ) : type === "checkbox" ? checked : value;
                    i['baseRate'] = name === "ratePerUnit" ? Number( value ) / i.orderUomRelativeFactor : i.baseRate;
                }
                return i;
            } );
            dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
        }

    };

    const isPermitted = ( isApproved, isRestrictedToChange, approvedById ) => {
        console.log( authenticateUser?.id === approvedById );
        console.log( authenticateUser.permissibleProcesses.some( p => p === permissibleProcessObj.consumption ) );
        if ( isRestrictedToChange ) {
            return false;

        } else if ( isApproved ) {
            return ( authenticateUser?.id === approvedById ) || authenticateUser.permissibleProcesses.some( p => p === permissibleProcessObj.consumption );

        }
        return true;

    };

    const isItemDescriptionAllSegmentValueValid = ( segments ) => {
        console.log( segments.filter( sg => !sg.isColorSensitive && !sg.isSizeSensitive ).every( s => s.value !== null ) );
        console.log( segments.filter( sg => !sg.isColorSensitive && !sg.isSizeSensitive ) );
        const validated = segments.filter( sg => !sg.isColorSensitive && !sg.isSizeSensitive ).every( s => s.value !== null );
        return !validated;
    };

    const handleStatusChangeForAccessories = ( e, fieldId, isApproved, accessories ) => {

        const { name, value, type, checked } = e.target;
        if ( value !== '.' ) {
            if ( !isPermitted( accessories.isApproved, accessories.isRestrictedToChange, accessories.approvedById ) ) {

                confirmOK( {
                    ...confirmObj,
                    title: `Approved By`,
                    text: `<h4 class="text-primary mb-0">${accessories.approvedBy}</h4> <br/> <span> You can not Change This!?</span>`,
                    confirmButtonText: 'Close!'
                } ).then( async e => {
                    if ( e.isConfirmed ) {
                        //
                    }
                } );
            } else {
                if ( name === 'isApprovedStatus' && (
                    !consumptionBasicInfo?.styleOrderDetails?.length
                    || isItemDescriptionAllSegmentValueValid( accessories.itemSegments )
                    || ( accessories.isSensibilityAlreadyLoadedOnRow && !accessories?.colorSensitivities.length && accessories?.hasAnyColorSensitivity )
                    || ( accessories.isSensibilityAlreadyLoadedOnRow && !accessories?.sizeSensitivities.length && accessories?.hasAnySizeSensitivity )
                ) && !isApproved ) {
                    if ( isItemDescriptionAllSegmentValueValid( accessories?.itemSegments ) ) {
                        notify( 'warning', `Please provide every segment's value !!!` );
                    } else if ( !consumptionBasicInfo?.styleOrderDetails?.length ) {
                        notify( 'warning', 'Please choose a purchase order !!!' );
                    } else if ( accessories.isSensibilityAlreadyLoadedOnRow && !accessories?.colorSensitivities.length && accessories?.hasAnyColorSensitivity ) {
                        notify( 'warning', 'Please provide color sensitivity!!!' );

                    } else if ( accessories.isSensibilityAlreadyLoadedOnRow && !accessories?.sizeSensitivities.length && accessories?.hasAnySizeSensitivity ) {
                        notify( 'warning', 'Please provide Size sensitivity!!!' );
                    }
                } else {
                    if ( accessories.approvedById ) {
                        confirmDialog( {
                            ...confirmObj,
                            title: `Approved By`,
                            text: `<h4 class="text-primary mb-0">${accessories.approvedBy}</h4> <br/> <span> Are you sure to change?</span>`
                        } ).then( async e => {
                            if ( e.isConfirmed ) {
                                const updatedData = consumptionAccessoriesDetails.map( i => {
                                    if ( fieldId === i.fieldId ) {
                                        i[name] = checked;
                                    }
                                    return i;
                                } );
                                dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
                            }
                        } );
                    } else {
                        const updatedData = consumptionAccessoriesDetails.map( i => {
                            if ( fieldId === i.fieldId ) {
                                i[name] = checked;
                            }
                            return i;
                        } );
                        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
                    }

                }
            }

        }
    };


    const handleConsumptionUomDropdownForAccessories = ( newValue, fieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.consumptionUomValue = newValue; // Extra
                i.consumptionUom = newValue?.label;
                i.consumptionUomRelativeFactor = newValue.relativeFactor;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };
    const handleConsumptionPerGarmentUomDropdownForAccessories = ( newValue, fieldId ) => {
        console.log( 'accessories' );

        const updatedData = consumptionAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.consumptionPerGarmentUomValue = newValue; // Extra
                i.consumptionPerGarmentUom = newValue?.label;
                i.consumptionPerGarmentRelativeFactor = newValue?.relativeFactor;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );

    };
    const handleOrderUomDropdownForAccessories = ( newValue, fieldId ) => {
        console.log( newValue );
        const updatedData = consumptionAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.orderUOMValue = newValue; // Extra
                i.orderUOM = newValue?.label;
                i.ratePerUnit = i.baseRate * ( newValue?.relativeFactor ? newValue?.relativeFactor : 0 );
                i.orderUomRelativeFactor = newValue?.relativeFactor;

            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };
    const handleCurrencyDropdownForAccessories = ( newValue, fieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.currencyValue = newValue; // Extra
                i.currencyCode = newValue?.label;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };
    const handlePurchaseTypeDropdownForAccessories = ( newValue, fieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.purchaseTypeValue = newValue; // Extra
                i.purchaseType = newValue?.label;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };
    const handlePreferredSupplierDropdownForAccessories = ( newValue, fieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.preferredSupplierValue = newValue; // Extra
                i.preferredSupplier = newValue?.label;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };


    //For Accessories
    const handleDescriptionModalOpenForAccessories = ( itemGroupId, consumptionFieldIdForAccessories, itemDescriptionTemplate, itemGroup, itemSubGroup ) => {
        if ( itemGroupId ) {
            setDescriptionModalObjForAccessories( {
                itemGroupId,
                consumptionFieldIdForAccessories,
                itemDescriptionTemplate,
                itemGroup: itemGroup?.label,
                itemSubGroup: itemSubGroup?.label
            } );
            setOpenDescriptionModalForAccessories( !openDescriptionModalForAccessories );
            dispatch( getItemSegmentArrayByItemGroupId( itemGroupId, itemDescriptionTemplate ) );
        } else {
            notify( 'warning', 'Please select a item group!!!' );
        }

    };

    const handleItemDescriptionDropdownChangeForAccessories = ( data, fabricFieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( i => {
            if ( fabricFieldId === i.fieldId ) {
                i.itemDescription = data?.label ?? "";
                i.itemDescriptionTemplate = data?.itemDescriptionTemplate ?? "";
                i.itemDescriptionValue = data;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };
    const handleItemDescriptionOnFocusForAccessories = ( itemGroupId, ItemSubGroupId, fabricFieldId ) => {
        const endPoint = `${merchandisingApi.costing.root}/fabricDetails/itemGroup/${itemGroupId}/itemSubGroup/${ItemSubGroupId}/itemDescriptionSuggestions`;
        baseAxios.get( endPoint ).then( response => {
            const updatedData = consumptionAccessoriesDetails.map( i => {
                if ( fabricFieldId === i.fieldId ) {
                    i.itemDescriptionArray = response.data.map( i => ( {
                        label: i.itemDescription,
                        value: i.itemDescription,
                        itemDescriptionTemplate: i.itemDescriptionTemplate
                    } ) );
                }
                return i;
            } );
            dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
        } );

    };

    const handleGetColorSizeSensForAccessories = ( colorSensitivities, sizeSensitivities, itemGroupId, fieldId, colorSensitivityType, sizeSensitivityType, detailsId ) => {

        if ( !consumptionBasicInfo?.styleOrderDetails?.length ) {
            notify( 'warning', 'Please choose a purchase order !!!' );
        } else {
            if ( itemGroupId > 0 ) {
                if ( detailsId > 0 ) {
                    console.log( 'id', detailsId );
                    dispatch( getConsumptionSizeColorSenseForEdit(
                        colorSensitivities,
                        sizeSensitivities,
                        itemGroupId,
                        fieldId,
                        detailsId,
                        colorSensitivityType,
                        sizeSensitivityType
                    ) );
                } else {
                    dispatch( getConsumptionSizeColorSense(
                        colorSensitivities,
                        sizeSensitivities,
                        itemGroupId,
                        fieldId,
                        colorSensitivityType,
                        sizeSensitivityType
                    ) );
                }
                setOpenAccessoriesModal( !openAccessoriesModal );
            } else {
                notify( 'error', 'Please select a item Group at first!!!' );
            }
        }

    };

    const [applicableSizeAndColorModal, setApplicableSizeAndColorModal] = useState( false );
    const [applicableColorSize, setApplicableColorSize] = useState( null );


    const handleApplicableColorSizeModalOpen = ( colors, sizes, fieldId, type, isAllSizeApplicable, isAllColorApplicable, detailId, applicableColorIds,
        applicableSizeIds ) => {


        if ( !consumptionBasicInfo?.styleOrderDetails?.length ) {
            notify( 'warning', 'Please choose a purchase order !!!' );
        } else {
            if ( colors.length > 0 && sizes.length > 0 ) {
                setApplicableSizeAndColorModal( !applicableSizeAndColorModal );
                setApplicableColorSize( {
                    colors,
                    sizes,
                    fieldId,
                    type,
                    isAllSizeApplicable,
                    isAllColorApplicable
                } );
            } else {
                setApplicableColorSize( {
                    colors: isAllColorApplicable ? consumptionPurchaseOrderColors.map( color => ( { ...color, isSelected: true } ) ) : consumptionPurchaseOrderColors.map( color => ( { ...color, isSelected: applicableColorIds.some( dataColor => dataColor === color.colorId ) } ) ),
                    sizes: isAllSizeApplicable ? consumptionPurchaseOrderSizes.map( size => ( { ...size, isSelected: true } ) ) : consumptionPurchaseOrderSizes.map( size => ( { ...size, isSelected: applicableSizeIds.some( dataSize => dataSize === size.sizeId ) } ) ),
                    fieldId,
                    type,
                    isAllSizeApplicable,
                    isAllColorApplicable
                } );
                setApplicableSizeAndColorModal( !applicableSizeAndColorModal );
            }
        }
    };

    const handleDuplicateAccessoriesDetailsRow = ( fieldId, index ) => {
        const accessories = [...consumptionAccessoriesDetails];
        const targetAccessory = consumptionAccessoriesDetails.find( ad => ad.fieldId === fieldId );
        const updatedAccessory = {
            ...targetAccessory,
            fieldId: randomIdGenerator(),
            itemSegments: targetAccessory.itemSegments.map( s => ( {
                ...s,
                rowId: randomIdGenerator()
            } ) ),
            isApproved: false,
            isApprovedStatus: false,
            isBomOnShipmentQty: true,
            detailId: 0,
            approvedById: null,
            approvedBy: null,
            isEdit: true,
            isSensibilityAlreadyLoadedOnRow: true,
            isRowEditableState: true
        };

        const duplicatedArray = insertAfterItemOfArray( accessories, index, updatedAccessory );

        dispatch( bindConsumptionAccessoriesDetails( duplicatedArray ) );
    };

    const [destinationModalOpen, setDestinationModalOpen] = useState( false );
    const [destinationModalObj, setDestinationModalObj] = useState( null );
    const handleDestinationModalOpen = ( rowId, applicableDestinations, isAllDestinationApplicable ) => {
        const destination = selectDestination.map( d => ( { ...d, isSelected: isAllDestinationApplicable ? isAllDestinationApplicable : applicableDestinations?.some( des => des === d.value ) } ) );
        setDestinationModalObj( {
            rowId,
            applicableDestinations,
            isAllDestinationApplicable,
            type: 'Accessories',
            destination
        } );
        setDestinationModalOpen( !destinationModalOpen );
    };


    const segmentValuesLoaded = ( rowId, accessories, loading ) => {
        const updatedSegments = accessories.itemSegments.map( i => {
            if ( rowId === i.rowId ) {
                i.isValueLoading = loading;
            }
            return i;
        } );
        const updatedData = consumptionAccessoriesDetails.map( f => {
            if ( accessories.fieldId === f.fieldId ) {
                f['itemSegments'] = updatedSegments;
            }
            return f;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };

    const handleSegmentValueOnFocus = ( rowId, itemGroupId, segmentId, accessories, segmentValues ) => {
        if ( !segmentValues.length ) {
            segmentValuesLoaded( rowId, accessories, true );

            const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
            baseAxios.get( endPoint ).then( response => {
                if ( response.status === status.success ) {
                    const updatedSegments = accessories.itemSegments.map( i => {
                        if ( rowId === i.rowId ) {
                            i.segmentValues = response.data.map( i => ( {
                                label: i.value,
                                value: i.id
                            } ) );
                        }
                        return i;
                    } );
                    const updatedData = consumptionAccessoriesDetails.map( f => {
                        if ( accessories.fieldId === f.fieldId ) {
                            f['itemSegments'] = updatedSegments;
                        }
                        return f;
                    } );
                    dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
                    segmentValuesLoaded( rowId, accessories, false );

                }
            } ).catch( ( { response } ) => {
                segmentValuesLoaded( rowId, accessories, false );
            } );
        }

    };

    const handleSegmentValueChange = ( rowId, data, accessories ) => {
        const updatedSegments = accessories.itemSegments.map( i => {
            if ( rowId === i.rowId ) {
                i.value = data;
            }
            return i;
        } );

        const createDescriptionWithValue = updatedSegments?.filter( i => !!i.value ).map( i => ` ${i.value?.label ? i.value?.label : ''}` ).join( '' );
        const descriptionTemplate = updatedSegments.map( isa => ( {
            id: isa.segmentId,
            name: isa.segment,
            value: isa?.value?.label ?? ''
        } ) );
        const descriptionObj = { value: createDescriptionWithValue, label: createDescriptionWithValue };

        const updatedData = consumptionAccessoriesDetails.map( f => {
            if ( accessories.fieldId === f.fieldId ) {
                f['itemSegments'] = updatedSegments;
                f['itemDescriptionTemplate'] = JSON.stringify( descriptionTemplate );
                f['itemDescription'] = createDescriptionWithValue.trim();
                f['itemDescriptionArray'] = [...f.itemDescriptionArray, descriptionObj];
                f['itemDescriptionValue'] = descriptionObj;
            }
            return f;
        } );

        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };

    const handleInstantCreateSegmentValue = ( data, itemGroupId, segmentId, rowId, accessories ) => {
        segmentValuesLoaded( rowId, accessories, true );

        const obj = [
            {
                value: data,
                isDeleted: false
            }
        ];
        const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
        baseAxios.put( endPoint, obj ).then( response => {
            if ( response.status === status.success ) {
                if ( rowId ) {
                    handleSegmentValueOnFocus( rowId, itemGroupId, segmentId, accessories, [] );
                    handleSegmentValueChange( rowId, { label: data, value: data }, accessories );
                }
                segmentValuesLoaded( rowId, accessories, false );

            }
        } ).catch( ( { response } ) => {
            segmentValuesLoaded( rowId, accessories, false );
        } );
    };


    return (
        <div className='w-100 p-1'>
            <div>
                <Progress
                    hidden={filteredAccessoriesDetails[0]?.expanded}
                    color="info"
                    striped
                    animated
                    value={100}
                />
            </div>
            <ResizableTable
                hidden={!filteredAccessoriesDetails[0]?.expanded}

                mainClass={`resizeAccess-${randomIdGenerator().toString()}`}
                tableId={`accessTable-${randomIdGenerator().toString()}`}
                className="pre-costing-details-table table-bordered"
                size="sm"
                responsive={true}
            >
                <thead className='thead-light'>
                    <tr >
                        <th className='text-center'><strong>SL</strong></th>
                        <th className='text-center'><strong>Action</strong></th>
                        {
                            filteredAccessoriesDetails[0]?.itemSegments.map( ( segment, index ) => (
                                <th className='text-center' key={index + 1}>  {segment.segment}</th>
                            ) )
                        }
                        <th className='text-center'><strong>Con. Qty</strong></th>
                        <th className='text-center'><strong>Con. Unit</strong></th>
                        <th className='text-center'><strong>Wastage(%)</strong></th>
                        <th className='text-center'><strong>Con. Per Garments </strong></th>
                        <th className='text-center'><strong>Con. Per Garment UOM</strong></th>
                        <th className='text-center'><strong>Order UOM</strong></th>
                        <th className='text-center'><strong>Currency</strong></th>
                        <th className='text-center'><strong>Rate</strong></th>
                        <th className='text-center'><strong>Purchase Type</strong></th>
                        <th className='text-center'><strong>Preferred Supplier</strong></th>
                        <th className='text-center'><strong>Buyer Supplied</strong></th>
                        {/* <th className='text-center'><strong>Status</strong></th> */}
                        <th className='text-center'><strong>Color Size</strong></th>
                        <th className='text-center'><strong>Applicable Size And Color</strong></th>
                        <th className='text-center'><strong>Destination</strong></th>
                        <th className='text-center'><strong>Is Approved?</strong></th>
                        <th className='text-center'><strong>Bom On Ship Qty?</strong></th>

                        <th className='text-center'><strong>Remarks</strong></th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {
                        filteredAccessoriesDetails.map( ( i, index ) => (
                            <tr key={i.fieldId} >
                                <td>
                                    {index + 1}
                                </td>
                                <td style={{ minWidth: '100px' }} >
                                    <span>
                                        <Button.Ripple id="copyId"
                                            tag={Label}
                                            // disabled={( orderDetails.length === 1 )}
                                            onClick={() => { handleDuplicateAccessoriesDetailsRow( i.fieldId, index ); }}
                                            className='btn-icon p-0 '
                                            color='flat-success'
                                            //   disabled={!isValidStatus}
                                            disabled={i.isRestrictedToChange}

                                        >
                                            <Copy size={18} id="copyId" color="green" />
                                        </Button.Ripple>
                                        <Button.Ripple
                                            id="editFabric"
                                            disabled={i.isRestrictedToChange}
                                            tag={Label}
                                            onClick={() => { handleEditAccessoriesRow( i ); }}
                                            className='btn-icon p-0 ml-1'
                                            color='flat-success' >
                                            <Edit3
                                                size={18}
                                                id="editFabric"
                                                color="green" />
                                        </Button.Ripple>
                                        <Button.Ripple id="deleteFabId"
                                            tag={Label}
                                            disabled={i.isRestrictedToChange}
                                            onClick={() => { handleRemoveAccessoriesRow( i ); }}
                                            className='btn-icon p-0 ml-1'
                                            color='flat-danger'
                                        >
                                            <MinusSquare
                                                size={18}
                                                id="deleteFabId"
                                                color="red"
                                            />
                                        </Button.Ripple>
                                    </span>
                                </td>

                                {
                                    i?.itemSegments?.map( ( is, index ) => (
                                        <td key={index + 1} style={{ minWidth: '135px' }}>

                                            {
                                                i.isEdit ? (
                                                    <Input
                                                        hidden={!is.isColorSensitive && !is.isSizeSensitive}
                                                        disabled={i.isApproved || is?.isColorSensitive || is?.isSizeSensitive || i.isRestrictedToChange}
                                                        bsSize="sm"
                                                        value={is?.value?.label ?? ''}
                                                        onChange={( e ) => { e.preventDefault(); }}
                                                    />
                                                ) : <span
                                                    hidden={!is.isColorSensitive && !is.isSizeSensitive}
                                                    style={{ fontSize: '0.9rem', fontWeight: '500' }}
                                                >
                                                    {is?.value?.label ?? ''}
                                                </span>
                                            }

                                            {/* <Input
                                                hidden={!is.isColorSensitive && !is.isSizeSensitive}
                                                disabled={i.isApproved || is.isColorSensitive || is.isSizeSensitive || i.isRestrictedToChange}
                                                bsSize="sm"
                                                value={is?.value?.label ?? ''}
                                                onChange={( e ) => { e.preventDefault(); }}
                                            /> */}
                                            {
                                                i.isEdit ? (

                                                    <div hidden={is.isColorSensitive || is.isSizeSensitive}>
                                                        <CreatableSelect
                                                            isDisabled={i.isApproved || i.isRestrictedToChange}
                                                            id='segmentValueId'
                                                            name="value"
                                                            isClearable={false}
                                                            isSearchable
                                                            isValidNewOption={( inputValue ) => {
                                                                const isPermitted = isPermit( userPermission?.ItemGroupCreateSegmentValue, authPermissions ) && inputValue.trim().length;
                                                                return isPermitted;
                                                            }}
                                                            menuPosition={'fixed'}
                                                            menuPlacement="auto"
                                                            maxMenuHeight={200}

                                                            theme={selectThemeColors}
                                                            isLoading={is.isValueLoading}
                                                            options={is.segmentValues}
                                                            classNamePrefix='dropdown'
                                                            className="erp-dropdown-select w-100"
                                                            value={is.value}
                                                            onFocus={() => { handleSegmentValueOnFocus( is.rowId, is.itemGroupId, is.segmentId, i, is.segmentValues ); }}

                                                            onChange={data => {
                                                                handleSegmentValueChange( is.rowId, data, i );

                                                            }}

                                                            onCreateOption={( data ) => {
                                                                handleInstantCreateSegmentValue( data, is.itemGroupId, is.segmentId, is.rowId, i );
                                                            }}

                                                        />
                                                    </div> ) : <span
                                                        hidden={is.isColorSensitive || is.isSizeSensitive}
                                                        style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                                                    {is.value?.label ?? ''}
                                                </span>
                                            }
                                        </td>
                                    ) )
                                }


                                <td style={{ width: '405px' }} >
                                    <span hidden={i.isEdit}>
                                        {isZeroToFixed( i.consumptionQuantity, 4 )}
                                    </span>
                                    <NumberFormat
                                        className="form-control-sm form-control text-right"
                                        hidden={!i.isEdit}
                                        id={`consumptionQuantity-${i.fieldId}`}
                                        displayType="input"
                                        value={i.consumptionQuantity}
                                        name="consumptionQuantity"
                                        decimalScale={4}
                                        disabled={i.isApproved || i.isRestrictedToChange}
                                        fixedDecimalScale={i.consumptionQuantity > 0}
                                        allowNegative={false}
                                        allowLeadingZeros={false}
                                        onFocus={e => {
                                            e.target.select();
                                        }}
                                        onBlur={( e ) => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                        onChange={( e ) => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                    />
                                </td>

                                <td style={{ width: '105px' }} >
                                    <span hidden={i.isEdit}>
                                        {i.consumptionUomValue?.label}
                                    </span>
                                    <span hidden={!i.isEdit}>
                                        <Select
                                            id='consumptionUomId'
                                            name="consumptionUom"
                                            isClearable={false}
                                            isSearchable
                                            isDisabled={i.isApproved || i.isRestrictedToChange}
                                            menuPosition={'fixed'}
                                            theme={selectThemeColors}
                                            options={i.consumptionUomArray}
                                            classNamePrefix="dropdown"
                                            className="erp-dropdown-select"
                                            value={i.consumptionUomValue}
                                            onChange={data => {
                                                handleConsumptionUomDropdownForAccessories( data, i.fieldId );
                                            }}
                                            onFocus={() => {
                                                handleConsumptionUOMOnFocusForAccessories(
                                                    dropDownTrimItemGroups?.find( item => item.value === i.itemGroupId )?.defaultUomSetId, i.consumptionUomArray, i.fieldId );
                                            }}

                                        />
                                    </span>
                                </td>
                                <td >
                                    <span hidden={i.isEdit}>
                                        {isZeroToFixed( i.wastagePercent, 4 )}
                                    </span>
                                    <NumberFormat
                                        hidden={!i.isEdit}
                                        className="form-control-sm form-control text-right"
                                        id={`wastagePercent-${i.fieldId}`}
                                        displayType="input"
                                        value={i.wastagePercent}
                                        name="wastagePercent"
                                        decimalScale={2}
                                        disabled={i.isApproved || i.isRestrictedToChange}
                                        fixedDecimalScale={i.wastagePercent > 0}
                                        allowNegative={false}
                                        allowLeadingZeros={false}
                                        onFocus={e => {
                                            e.target.select();
                                        }}
                                        onBlur={( e ) => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                        onChange={( e ) => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                    />
                                </td>
                                <td  >
                                    <span hidden={i.isEdit}>
                                        {i.consumptionPerGarment}
                                    </span>
                                    <Input
                                        hidden={!i.isEdit}
                                        className="text-right"
                                        name="consumptionPerGarment"
                                        type="number"
                                        placeholder="Consumption Per Garment"
                                        disabled={i.isApproved || i.isRestrictedToChange}
                                        value={i.consumptionPerGarment}
                                        bsSize="sm"
                                        onFocus={( e ) => e.target.select()}
                                        onChange={( e ) => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                    //  onChange={( e ) => { e.preventDefault(); }}

                                    />
                                </td>
                                <td > <span hidden={i.isEdit}>
                                    {i.consumptionPerGarmentUomValue?.label}
                                </span>
                                    <span hidden={!i.isEdit}>
                                        <Select
                                            id='consumptionAccessPerGarmentUomId'
                                            name="consumptionPerGarmentUom"
                                            isClearable={false}
                                            isSearchable
                                            menuPosition={'fixed'}
                                            theme={selectThemeColors}
                                            isDisabled={i.isApproved || i.isRestrictedToChange}
                                            options={defaultUOMDropdown}
                                            classNamePrefix='dropdown'
                                            className="erp-dropdown-select"
                                            value={i.consumptionPerGarmentUomValue}
                                            onChange={data => {
                                                handleConsumptionPerGarmentUomDropdownForAccessories( data, i.fieldId );
                                            }}
                                        //  onFocus={() => { handlePerGarmentUOMAccessoriesOnFocus( dropDownTrimItemGroups?.find( item => item.value === i.itemGroupId )?.defaultUomSetId, i.orderUomArray, i.fieldId ); }}
                                        />
                                    </span>
                                </td>
                                <td > <span hidden={i.isEdit}>
                                    {i.orderUOMValue?.label}
                                </span>
                                    <span hidden={!i.isEdit}>
                                        <Select
                                            id='orderUOMId'
                                            name="orderUOM"
                                            isSearchable
                                            menuPosition={'fixed'}
                                            theme={selectThemeColors}
                                            options={i.orderUomArray}
                                            isDisabled={i.isApproved || i.isRestrictedToChange}
                                            classNamePrefix="dropdown"
                                            className="erp-dropdown-select"
                                            value={i.orderUOMValue}
                                            onChange={data => {
                                                handleOrderUomDropdownForAccessories( data, i.fieldId );
                                            }}
                                            onFocus={() => {
                                                handleOrderUomOnFocusForAccessories(
                                                    dropDownTrimItemGroups?.find( item => item.value === i.itemGroupId )?.defaultUomSetId, i.orderUomArray, i.fieldId );
                                            }}
                                        />
                                    </span>
                                </td>

                                <td style={{ width: '105px' }} >
                                    <span hidden={i.isEdit}>
                                        {i.currencyValue?.label}
                                    </span>
                                    <span hidden={!i.isEdit}>
                                        <Select
                                            id='currencyId'
                                            name="currencyCode"
                                            isClearable={false}
                                            isSearchable
                                            menuPosition={'fixed'}
                                            theme={selectThemeColors}
                                            isDisabled={i.isApproved || i.isRestrictedToChange}
                                            options={currencyDropdown}
                                            classNamePrefix="dropdown"
                                            className="erp-dropdown-select"
                                            value={i.currencyValue}
                                            onChange={data => {
                                                handleCurrencyDropdownForAccessories( data, i.fieldId );
                                            }}
                                            onFocus={() => { handleCurrencyOnFocus(); }}
                                        />
                                    </span>
                                </td>
                                <td >
                                    <span hidden={i.isEdit}>
                                        {isZeroToFixed( i.ratePerUnit, 4 )}
                                    </span>
                                    <NumberFormat
                                        hidden={!i.isEdit}
                                        className="form-control-sm form-control text-right"
                                        id={`ratePerUnit-${i.fieldId}`}
                                        displayType="input"
                                        value={i.ratePerUnit}
                                        name="ratePerUnit"
                                        decimalScale={4}
                                        disabled={i.isApproved || !i.orderUOMValue || i.isRestrictedToChange}
                                        fixedDecimalScale={i.ratePerUnit > 0}
                                        allowNegative={false}
                                        allowLeadingZeros={false}
                                        onFocus={e => {
                                            e.target.select();
                                        }}
                                        onBlur={( e ) => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                        onChange={( e ) => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                    />
                                </td>
                                <td  >
                                    <span hidden={i.isEdit}>
                                        {i.purchaseTypeValue?.label}
                                    </span>
                                    <span hidden={!i.isEdit}>

                                        <Select
                                            id='purchaseTypeId'
                                            name="purchaseType"
                                            isClearable={false}
                                            isSearchable
                                            menuPosition={'fixed'}
                                            isDisabled={i.isApproved || i.isRestrictedToChange}
                                            theme={selectThemeColors}
                                            options={selectPurchaseType}
                                            classNamePrefix="dropdown"
                                            className="erp-dropdown-select"
                                            value={i.purchaseTypeValue}
                                            onChange={data => {
                                                handlePurchaseTypeDropdownForAccessories( data, i.fieldId );
                                            }}
                                        />
                                    </span>
                                </td>
                                <td style={{ minWidth: '105px' }}>
                                    <span hidden={i.isEdit}>
                                        {i.preferredSupplierValue?.label}
                                    </span>
                                    <span hidden={!i.isEdit}>
                                        <Select
                                            id='preferredSupplierId'
                                            name="preferredSupplier"
                                            isClearable
                                            isSearchable
                                            menuPosition={'fixed'}
                                            isDisabled={i.isApproved || i.isRestrictedToChange}
                                            theme={selectThemeColors}
                                            options={vendorDropdown}
                                            classNamePrefix="dropdown"
                                            className="erp-dropdown-select"
                                            value={i.preferredSupplierValue}
                                            onChange={data => {
                                                handlePreferredSupplierDropdownForAccessories( data, i.fieldId );
                                            }}
                                            onFocus={() => { handleVendorOnFocus(); }}
                                        />
                                    </span>
                                </td>
                                <td style={{ width: '105px' }} >
                                    <span className="d-flex justify-content-center">
                                        <CustomInput
                                            id={`buyerSuppliedId-${i.fieldId}`}
                                            name='isBuyerSupplied'
                                            type='checkbox'
                                            disabled={!i.isEdit || i.isApproved || i.isRestrictedToChange}
                                            checked={i.isBuyerSupplied}
                                            onChange={e => handleOnChangeForAccessories( e, i.fieldId )}
                                        />
                                    </span>
                                </td>

                                <td style={{ width: '85px' }} >
                                    <Button.Ripple
                                        disabled={!i.isEdit || i.isApproved || i.isRestrictedToChange}
                                        size="sm"
                                        for={`${i.fieldId}`}
                                        tag={Label}
                                        onClick={() => {
                                            handleGetColorSizeSensForAccessories(
                                                i.colorSensitivities,
                                                i.sizeSensitivities,
                                                i.itemGroupId,
                                                i.fieldId,
                                                i.colorSensitivityType,
                                                i.sizeSensitivityType,
                                                i.detailId
                                            );
                                        }}
                                        className='btn-icon p-0'
                                        color='flat-danger' >
                                        <Settings
                                            size={18}
                                            id={`${i.fieldId}`}
                                            color="purple"
                                        />
                                    </Button.Ripple>

                                </td>
                                <td style={{ width: '55px' }} >
                                    <Button.Ripple
                                        disabled={!i.isEdit || i.isApproved || i.isRestrictedToChange}
                                        size="sm"
                                        for={`${i.fieldId}-acc`}
                                        tag={Label}
                                        onClick={() => {
                                            handleApplicableColorSizeModalOpen(
                                                i.consumptionPurchaseOrderColors,
                                                i.consumptionPurchaseOrderSizes,
                                                i.fieldId,
                                                'Accessories',
                                                i.isAllSizeApplicable,
                                                i.isAllColorApplicable,
                                                i.detailId,
                                                i.applicableColors,
                                                i.applicableSizes

                                            );
                                        }}
                                        className='btn-icon p-0'
                                        color='flat-danger' >
                                        <Search
                                            size={18}
                                            id={`${i.fieldId}-acc`}
                                            color="purple"
                                        />
                                    </Button.Ripple>
                                </td>
                                <td style={{ width: '55px' }} >
                                    <Button.Ripple
                                        disabled={!i.isEdit || i.isApproved || i.isRestrictedToChange}
                                        size="sm"
                                        for={`${i.fieldId}-fabric`}
                                        tag={Label}
                                        onClick={() => {
                                            handleDestinationModalOpen( i.fieldId, i.applicableDestinations, i.isAllDestinationApplicable );
                                        }}
                                        className='btn-icon p-0'
                                        color='flat-danger' >
                                        <Map
                                            size={18}
                                            id={`${i.fieldId}-fabric`}
                                            color="purple"
                                        />
                                    </Button.Ripple>
                                </td>
                                <td style={{ width: '105px' }} >
                                    <span className="d-flex justify-content-center">
                                        <CustomInput
                                            id={`approvedId-${i.fieldId}`}
                                            disabled={!i.isEdit}
                                            // disabled={i.isRestrictedToChange}
                                            // disabled={!isPermitted( i.isApproved, i.isRestrictedToChange, i.approvedById )}
                                            name='isApprovedStatus'
                                            type='checkbox'
                                            checked={i.isApprovedStatus}
                                            onChange={e => handleStatusChangeForAccessories( e, i.fieldId, i.isApproved, i )}
                                        />
                                    </span>
                                </td>
                                <td style={{ width: '205px' }} >
                                    <span className="d-flex justify-content-center">
                                        <CustomInput
                                            id={`isBomOnShipQtyId-${i.fieldId}`}
                                            name='isBomOnShipmentQty'
                                            disabled={!i.isEdit || i.isApproved || i.isRestrictedToChange}
                                            type='checkbox'
                                            checked={i.isBomOnShipmentQty}
                                            onChange={e => handleOnChangeForAccessories( e, i.fieldId )}
                                        />
                                    </span>
                                </td>
                                <td style={{ width: '205px' }} >
                                    <span hidden={i.isEdit}>
                                        {i.remarks}
                                    </span>
                                    <Input
                                        hidden={!i.isEdit}
                                        name="remarks"
                                        bsSize="sm"
                                        disabled={i.isApproved || i.isRestrictedToChange}
                                        value={i?.remarks}
                                        onChange={e => handleOnChangeForAccessories( e, i.fieldId )}
                                    />
                                </td>

                            </tr>
                        ) )
                    }

                </tbody>
            </ResizableTable>
            <Button.Ripple
                id="addAccId"
                tag={Label}
                onClick={() => { handleAddAccessoriesRow(); }}
                className='btn-icon'
                color='flat-success'
            >
                <PlusSquare
                    id="addAccId"
                    color="green"
                />
            </Button.Ripple>
            <div>
                {/* {
                    ( consumptionDetailsSizeSens && consumptionDetailsColorSens ) &&
                    ( <SizeColorSenseForm
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        consumptionFabricDetails={consumptionFabricDetails}
                        consumptionAccessoriesDetails={consumptionAccessoriesDetails}
                        consumptionDetailsSizeSens={consumptionDetailsSizeSens}
                        consumptionDetailsColorSens={consumptionDetailsColorSens}
                    /> )
                } */}
                {
                    openAccessoriesModal &&
                    ( <SizeColorSenseAccessoriesForm
                        openModal={openAccessoriesModal}
                        setOpenModal={setOpenAccessoriesModal}
                        consumptionAccessoriesDetails={consumptionAccessoriesDetails}
                        consumptionDetailsSizeSens={consumptionDetailsSizeSens}
                        consumptionDetailsColorSens={consumptionDetailsColorSens}
                    /> )
                }
                {
                    destinationModalOpen &&
                    <DestinationModal
                        openModal={destinationModalOpen}
                        setOpenModal={setDestinationModalOpen}
                        destinationModalObj={destinationModalObj}
                        setDestinationModalObj={setDestinationModalObj}
                    />
                }
                {
                    applicableColorSize &&
                    <ApplicableSizeAndColorModal
                        openModal={applicableSizeAndColorModal}
                        setOpenModal={setApplicableSizeAndColorModal}
                        applicableColorSize={applicableColorSize}
                        setApplicableColorSize={setApplicableColorSize}
                    />
                }

                {
                    ( descriptionModalObjForAccessories && openDescriptionModalForAccessories ) &&
                    <ConsumptionDescriptionGeneratorAccessories
                        descriptionModalObj={descriptionModalObjForAccessories}
                        openModal={openDescriptionModalForAccessories}
                        setOpenModal={setOpenDescriptionModalForAccessories}
                    />
                }

            </div>
        </div >
    );
};

export default ExpandableAccessoriesDetails;
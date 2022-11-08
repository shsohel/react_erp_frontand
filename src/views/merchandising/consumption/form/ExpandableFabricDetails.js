import { getVendorDropdown } from '@views/inventory/vendor/store/actions';
import classNames from 'classnames';
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
import { confirmObj, costingConsumptionBodyParts, permissibleProcessObj, selectDestination, selectPurchaseType, status } from '../../../../utility/enums';
import { insertAfterItemOfArray, isPermit, isZeroToFixed, randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getCurrencyDropdown } from '../../currency/store/actions';
import { bindConsumptionFabricDetails, deleteConsumptionDetailsItem, getConsumptionSizeColorSense, getConsumptionSizeColorSenseForEdit } from '../store/actions';
import ApplicableSizeAndColorModal from './ApplicableSizeAndColorModal';
import ConsumptionDescriptionGenerator from './ConsumptionDescriptionGenerator';
import DestinationModal from './DestinationModal';
import SizeColorSenseForm from './SizeColorSenseForm';


const ExpandableFabricDetails = ( { data } ) => {
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
    const { itemSegmentsArray } = useSelector( ( { itemGroups } ) => itemGroups );

    const { userPermission, authenticateUser } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    const { dropDownFabricItemGroups } = useSelector( ( { itemGroups } ) => itemGroups );
    const { defaultUOMDropdown } = useSelector( ( { unitSets } ) => unitSets );
    const defaultUOMSet = defaultUOMDropdown?.find( uom => uom?.isBaseUnit === true );
    const [openModal, setOpenModal] = useState( false );
    const [openAccessoriesModal, setOpenAccessoriesModal] = useState( false );
    const { vendorDropdown } = useSelector( ( { vendors } ) => vendors );

    const [descriptionModalObj, setDescriptionModalObj] = useState( null );
    const [openDescriptionModal, setOpenDescriptionModal] = useState( false );

    const { currencyDropdown } = useSelector( ( { currencies } ) => currencies );

    const filteredFabric = consumptionFabricDetails.filter( fabric => fabric.itemGroupId === data.itemGroupId && fabric.itemSubGroupId === data.itemSubGroupId );

    const handleAddNewFabricRow = () => {
        const newFabricObj = {
            ...data,
            fieldId: randomIdGenerator(),
            detailId: 0,
            rowNo: 0,
            costingGroupType: 1,
            consumptionId: "",
            itemDescription: "",
            itemDescriptionArray: [],
            itemDescriptionValue: null,
            itemDescriptionTemplate: "",
            itemSegments: data.itemSegments.map( s => ( { ...s, value: null } ) ),
            consumptionQuantity: 0,
            wastagePercent: 0,
            consumptionPerGarment: 1,
            ratePerUnit: 0,
            baseRate: 0,
            isBuyerSupplied: false,
            preferredSupplierValue: null,
            preferredSupplier: "",
            remarks: "",
            statusValue: null,
            garmentPart: null,
            isBomOnShipmentQty: true,
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
        dispatch( bindConsumptionFabricDetails( [...consumptionFabricDetails, newFabricObj] ) );

    };

    const handleVendorOnFocus = () => {
        dispatch( getVendorDropdown() );
    };


    const handleFabricDropdown = ( e, newValue, fieldId ) => {
        const { name } = e;
        if ( name === "garmentPart" ) {
            const updatedData = consumptionFabricDetails.map( i => {
                if ( fieldId === i.fieldId ) {
                    i[name] = newValue;
                }
                return i;
            } );
            dispatch( bindConsumptionFabricDetails( updatedData ) );
        }

    };
    const handlePerGarmentUOMFabricOnFocus = ( defaultUomSetId, uomArray, fieldId ) => {
        if ( !uomArray.length && defaultUomSetId ) {
            baseAxios.get( `${inventoryApi.unitSet.root}/${defaultUomSetId}` )
                .then( response => {
                    console.log( response?.data );
                    console.log( fieldId );
                    const consumptionPerGarmentUomArray = response?.data?.details?.map( uom => ( {
                        value: uom.id,
                        label: uom.unitName,
                        relativeFactor: uom.relativeFactor
                    } ) );
                    const updatedData = consumptionFabricDetails.map( i => {
                        if ( fieldId === i.fieldId ) {
                            i.consumptionPerGarmentUomArray = consumptionPerGarmentUomArray;
                        }
                        return i;
                    } );
                    dispatch( bindConsumptionFabricDetails( updatedData ) );
                } );
        }
    };


    const handleCurrencyDropdownForFabric = ( newValue, fieldId ) => {
        const updatedData = consumptionFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.currencyValue = newValue; // Extra
                i.currencyCode = newValue?.label;
            }
            return i;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
    };


    const handleDuplicateFabricDetailsRow = ( fieldId, index ) => {
        const fabrics = [...consumptionFabricDetails];
        const targetFabric = consumptionFabricDetails.find( fd => fd.fieldId === fieldId );
        const updatedFabric = {
            ...targetFabric,
            fieldId: randomIdGenerator(),
            itemSegments: targetFabric.itemSegments.map( s => ( {
                ...s,
                rowId: randomIdGenerator()
            } ) ),
            isApproved: false,
            isApprovedStatus: false,
            isBomOnShipmentQty: true,
            detailId: 0,
            approvedBy: null,
            approvedById: null,
            isEdit: true,
            isSensibilityAlreadyLoadedOnRow: true,
            isRowEditableState: true

        };

        const duplicatedArray = insertAfterItemOfArray( fabrics, index, updatedFabric );
        dispatch( bindConsumptionFabricDetails( duplicatedArray ) );
    };

    const handleRemoveFabricRow = ( fabric ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                if ( fabric.detailId > 0 ) {
                    ///
                    console.log( "id", fabric.detailId );
                    dispatch( deleteConsumptionDetailsItem( consumptionBasicInfo?.id, fabric?.detailId, 'Fabric' ) );
                } else {
                    const updatedData = [...consumptionFabricDetails];
                    updatedData.splice(
                        updatedData.findIndex( x => x.fieldId === fabric.fieldId ),
                        1
                    );
                    dispatch( bindConsumptionFabricDetails( updatedData ) );
                }

            }
        } );
    };

    const handleEditFabricRow = fabric => {
        const updatedData = consumptionFabricDetails.map( fab => {
            if ( fabric.fieldId === fab.fieldId ) {
                fab["isEdit"] = !fab.isEdit;
                fab["isRowEditableState"] = true;
            }
            return fab;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );

        if ( !consumptionBasicInfo?.styleOrderDetails?.length ) {
            notify( 'warning', 'Please choose a purchase order !!!' );
        } else {
            console.log( 'first', fabric.itemGroupId );
            console.log( 'detail Id', fabric.detailId );
            console.log( 'fabric.isEdit', fabric.isEdit );
            if ( fabric.itemGroupId > 0 ) {
                if ( fabric.detailId > 0 && fabric.isEdit === true ) {

                    if ( !fabric.isSensibilityAlreadyLoadedOnRow ) {
                        const endPoint = `${merchandisingApi.consumption.root}/details/${fabric.detailId}/colorAndSizeSensitivities`;
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

                                console.log( 'colorsense', colorSense );

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

                                console.log( 'sizeSense', sizeSense );
                                const updatedData = consumptionFabricDetails.map( fab => {
                                    if ( fabric.fieldId === fab.fieldId ) {
                                        fab["colorSensitivities"] = colorSense;
                                        fab["sizeSensitivities"] = sizeSense;
                                        fab["isSensibilityAlreadyLoadedOnRow"] = true;
                                    }
                                    return fab;
                                } );
                                dispatch( bindConsumptionFabricDetails( updatedData ) );

                            }

                        } );

                    }


                }
            } else {
                notify( 'error', 'Please select a item Group at first!!!' );
            }
        }

    };


    ///For Fabric Input OnChange
    const handleOnChangeForFabric = ( e, fieldId, isApproved, itemDescription ) => {
        const { name, value, type, checked } = e.target;
        if ( value !== '.' ) {
            if ( name === 'isApprovedStatus' && ( !consumptionBasicInfo?.styleOrderDetails?.length || !itemDescription.length ) && !isApproved ) {
                if ( !itemDescription.length ) {
                    notify( 'warning', 'Please provide a item description for this item!!!' );
                } else {
                    notify( 'warning', 'Please choose a purchase order !!!' );
                }
            } else {
                const updatedData = consumptionFabricDetails.map( i => {
                    if ( fieldId === i.fieldId ) {
                        i[name] = ( type === "number" || name === "consumptionQuantity" || name === "wastagePercent" || name === "ratePerUnit" ) ? Number( value ) : type === "checkbox" ? checked : value;

                        i['baseRate'] = name === "ratePerUnit" ? Number( value ) / i.orderUomRelativeFactor : i.baseRate;

                    }
                    return i;
                } );
                dispatch( bindConsumptionFabricDetails( updatedData ) );
            }
        }
    };
    const isPermitted = ( isApproved, isRestrictedToChange, approvedById ) => {
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
    const handleStatusChangeForFabric = ( e, fieldId, isApproved, fabric ) => {
        const { name, value, type, checked } = e.target;
        if ( value !== '.' ) {
            if ( !isPermitted( fabric.isApproved, fabric.isRestrictedToChange, fabric.approvedById ) ) {
                confirmOK( {
                    ...confirmObj,
                    title: `Approved By`,
                    text: `<h4 class="text-primary mb-0">${fabric.approvedBy}</h4> <br/> <span> You can not Change This!?</span>`,
                    confirmButtonText: 'Close!'
                } ).then( async e => {
                    if ( e.isConfirmed ) {
                        //
                    }
                } );
            } else {
                if ( name === 'isApprovedStatus' && (
                    !consumptionBasicInfo?.styleOrderDetails?.length
                    || isItemDescriptionAllSegmentValueValid( fabric?.itemSegments )
                    || ( fabric.isSensibilityAlreadyLoadedOnRow && !fabric?.colorSensitivities.length && fabric?.hasAnyColorSensitivity )
                    || ( fabric.isSensibilityAlreadyLoadedOnRow && !fabric?.sizeSensitivities.length && fabric?.hasAnySizeSensitivity )
                ) && !isApproved ) {
                    if ( isItemDescriptionAllSegmentValueValid( fabric?.itemSegments ) ) {
                        notify( 'warning', `Please provide every segment's value !!!` );
                    } else if ( !consumptionBasicInfo?.styleOrderDetails?.length ) {
                        notify( 'warning', 'Please choose a purchase order !!!' );
                    } else if ( fabric.isSensibilityAlreadyLoadedOnRow && !fabric?.colorSensitivities.length && fabric?.hasAnyColorSensitivity ) {
                        notify( 'warning', 'Please provide color sensitivity!!!' );

                    } else if ( fabric.isSensibilityAlreadyLoadedOnRow && !fabric?.sizeSensitivities.length && fabric?.hasAnySizeSensitivity ) {
                        notify( 'warning', 'Please provide Size sensitivity!!!' );
                    }
                } else {
                    if ( fabric.approvedById ) {
                        confirmDialog( {
                            ...confirmObj,
                            title: `Approved By`,
                            text: `<h4 class="text-primary mb-0">${fabric.approvedBy}</h4> <br/> <span> Are you sure to change?</span>`
                        } ).then( async e => {
                            if ( e.isConfirmed ) {
                                const updatedData = consumptionFabricDetails.map( i => {
                                    if ( fieldId === i.fieldId ) {
                                        i[name] = checked;
                                    }
                                    return i;
                                } );
                                dispatch( bindConsumptionFabricDetails( updatedData ) );
                            }
                        } );
                    } else {
                        const updatedData = consumptionFabricDetails.map( i => {
                            if ( fieldId === i.fieldId ) {
                                i[name] = checked;
                            }
                            return i;
                        } );
                        dispatch( bindConsumptionFabricDetails( updatedData ) );
                    }

                }
            }

        }
    };


    const handleConsumptionUomDropdownForFabric = ( newValue, fieldId ) => {
        const updatedData = consumptionFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.consumptionUomValue = newValue; // Extra
                i.consumptionUom = newValue?.label;
                i.consumptionUomRelativeFactor = newValue?.relativeFactor;
            }
            return i;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
    };
    const handleConsumptionUOMOnFocusForFabric = ( defaultUomSetId, uomArray, fieldId ) => {
        if ( !uomArray.length && defaultUomSetId ) {
            baseAxios.get( `${inventoryApi.unitSet.root}/${defaultUomSetId}` )
                .then( response => {
                    console.log( response?.data );
                    const consumptionUomArray = response?.data?.details?.map( uom => ( {
                        value: uom.id,
                        label: uom.unitName,
                        relativeFactor: uom.relativeFactor
                    } ) );
                    const updatedData = consumptionFabricDetails.map( i => {
                        if ( fieldId === i.fieldId ) {
                            i.consumptionUomArray = consumptionUomArray;
                        }
                        return i;
                    } );
                    dispatch( bindConsumptionFabricDetails( updatedData ) );
                } );
        }
    };
    const handleConsumptionPerGarmentUomDropdownForFabric = ( newValue, fieldId ) => {
        const updatedData = consumptionFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.consumptionPerGarmentUomValue = newValue;
                i.consumptionPerGarmentUom = newValue?.label;
                i.consumptionPerGarmentRelativeFactor = newValue?.relativeFactor;
            }
            return i;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
    };

    const handleOrderUomDropdownForFabric = ( newValue, fieldId ) => {

        const updatedData = consumptionFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.orderUOMValue = newValue; // Extra
                i.orderUOM = newValue?.label;
                i.ratePerUnit = i.baseRate * ( newValue?.relativeFactor ? newValue?.relativeFactor : 0 );
                i.orderUomRelativeFactor = newValue?.relativeFactor;
            }
            return i;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
    };

    const handlePurchaseTypeDropdownForFabric = ( newValue, fieldId ) => {
        const updatedData = consumptionFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.purchaseTypeValue = newValue; // Extra
                i.purchaseType = newValue?.label;
            }
            return i;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
    };
    const handlePreferredSupplierDropdownForFabric = ( newValue, fieldId ) => {
        const updatedData = consumptionFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.preferredSupplierValue = newValue; // Extra
                i.preferredSupplier = newValue?.label;
            }
            return i;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
    };

    const handleOrderUomOnFocusForFabric = ( defaultUomSetId, uomArray, fieldId ) => {
        if ( !uomArray.length && defaultUomSetId ) {
            baseAxios.get( `${inventoryApi.unitSet.root}/${defaultUomSetId}` )
                .then( response => {
                    const orderUomArray = response?.data?.details?.map( uom => ( {
                        value: uom.id,
                        label: uom.unitName,
                        relativeFactor: uom.relativeFactor
                    } ) );
                    const updatedData = consumptionFabricDetails.map( i => {
                        if ( fieldId === i.fieldId ) {
                            i.orderUomArray = orderUomArray;
                        }
                        return i;
                    } );
                    dispatch( bindConsumptionFabricDetails( updatedData ) );
                } );
        }
    };


    const handleCurrencyOnFocus = () => {
        if ( !currencyDropdown.length ) {
            dispatch( getCurrencyDropdown() );
        }
    };


    const handleGetColorSizeSensForFabric = ( colorSensitivities, sizeSensitivities, itemGroupId, fieldId, colorSensitivityType, sizeSensitivityType, detailsId ) => {
        if ( !consumptionBasicInfo?.styleOrderDetails?.length ) {
            notify( 'warning', 'Please choose a purchase order !!!' );
        } else {
            if ( itemGroupId > 0 ) {
                if ( detailsId > 0 ) {
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

                setOpenModal( !openModal );
            } else {
                notify( 'error', 'Please select a item Group at first!!!' );
            }
        }

    };

    const [applicableSizeAndColorModal, setApplicableSizeAndColorModal] = useState( false );
    const [applicableColorSize, setApplicableColorSize] = useState( null );


    const handleApplicableColorSizeModalOpen = async ( colors, sizes, fieldId, type, isAllSizeApplicable, isAllColorApplicable, detailId, applicableColorIds,
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

    // {
    //     itemSegmentsArray?.filter( itemSegment => itemSegment.isColorSensitive === false &&
    //         itemSegment.isSizeSensitive === false ).map( i => (
    //             <tr key={i.fieldId}>
    //                 <td>
    //                     {i.segment?.segmentName}
    //                 </td>
    //                 <td>
    //                     <CreatableSelect
    //                         id={`segmentValueId${i.fieldId}`}
    //                         name="segmentValue"
    //                         placeholder="Select Value"
    //                         isSearchable
    //                         menuPosition="fixed"
    //                         isClearable
    //                         theme={selectThemeColors}
    //                         options={i.segmentValues}
    //                         classNamePrefix='dropdown'
    //                         className={classnames( 'erp-dropdown-select' )}
    //                         value={i.value}
    //                         onFocus={() => { handleSegmentValueOnFocus( i.fieldId, i.itemGroupId, i.segment.segmentId ); }}
    //                         onChange={data => {
    //                             handleSegmentValueChange( i.fieldId, data );
    //                         }}
    //                     />
    //                 </td>

    //             </tr>
    //         ) )
    // }

    const [destinationModalOpen, setDestinationModalOpen] = useState( false );
    const [destinationModalObj, setDestinationModalObj] = useState( null );

    const handleDestinationModalOpen = ( rowId, applicableDestinations, isAllDestinationApplicable ) => {
        const destination = selectDestination.map( d => ( { ...d, isSelected: isAllDestinationApplicable ? isAllDestinationApplicable : applicableDestinations?.some( des => des === d.value ) } ) );
        setDestinationModalObj( {
            rowId,
            applicableDestinations,
            isAllDestinationApplicable,
            type: 'Fabric',
            destination
        } );
        setDestinationModalOpen( !destinationModalOpen );
    };

    const segmentValuesLoaded = ( rowId, fabric, loading ) => {

        const updatedSegments = fabric.itemSegments.map( i => {
            if ( rowId === i.rowId ) {
                i.isValueLoading = loading;
            }
            return i;
        } );
        const updatedData = consumptionFabricDetails.map( f => {
            if ( fabric.fieldId === f.fieldId ) {
                f['itemSegments'] = updatedSegments;
            }
            return f;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
    };

    const handleSegmentValueOnFocus = ( rowId, itemGroupId, segmentId, fabric, segmentValues ) => {
        if ( !segmentValues.length ) {
            segmentValuesLoaded( rowId, fabric, true );
            const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
            baseAxios.get( endPoint ).then( response => {
                if ( response.status === status.success ) {
                    const updatedSegments = fabric.itemSegments.map( i => {
                        if ( rowId === i.rowId ) {
                            i.segmentValues = response.data.map( i => ( {
                                label: i.value,
                                value: i.id
                            } ) );
                        }
                        return i;
                    } );
                    const updatedData = consumptionFabricDetails.map( f => {
                        if ( fabric.fieldId === f.fieldId ) {
                            f['itemSegments'] = updatedSegments;
                        }
                        return f;
                    } );
                    dispatch( bindConsumptionFabricDetails( updatedData ) );
                    segmentValuesLoaded( rowId, fabric, false );
                }

            } ).catch( ( { response } ) => {
                segmentValuesLoaded( rowId, fabric, false );
            } );
        }

    };

    const handleSegmentValueChange = ( rowId, data, fabric ) => {
        const updatedSegments = fabric.itemSegments.map( i => {
            if ( rowId === i.rowId ) {
                i.value = data;
            }
            return i;
        } );
        console.log( updatedSegments );

        const createDescriptionWithValue = updatedSegments?.filter( i => !!i.value ).map( i => ` ${i.value?.label ? i.value?.label : ''}` ).join( '' );
        const descriptionTemplate = updatedSegments.map( isa => ( {
            id: isa.segmentId,
            name: isa.segment,
            value: isa?.value?.label ?? ''
        } ) );
        const descriptionObj = { value: createDescriptionWithValue, label: createDescriptionWithValue };

        const updatedData = consumptionFabricDetails.map( f => {
            if ( fabric.fieldId === f.fieldId ) {
                f['itemSegments'] = updatedSegments;
                f['itemDescriptionTemplate'] = JSON.stringify( descriptionTemplate );
                f['itemDescription'] = createDescriptionWithValue.trim();
                f['itemDescriptionArray'] = [...f.itemDescriptionArray, descriptionObj];
                f['itemDescriptionValue'] = descriptionObj;
            }
            return f;
        } );

        dispatch( bindConsumptionFabricDetails( updatedData ) );
    };

    const handleInstantCreateSegmentValue = ( data, itemGroupId, segmentId, rowId, fabric ) => {

        segmentValuesLoaded( rowId, fabric, true );

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
                    handleSegmentValueOnFocus( rowId, itemGroupId, segmentId, fabric, [] );
                    handleSegmentValueChange( rowId, { label: data, value: data }, fabric );
                }
            }
        } ).catch( ( { response } ) => {
            segmentValuesLoaded( rowId, fabric, false );
        } );
    };


    return (
        <div className='w-100 p-1'>
            <div>
                <Progress
                    hidden={filteredFabric[0]?.expanded}
                    color="info"
                    striped
                    animated
                    value={100}
                />
            </div>
            <ResizableTable
                hidden={!filteredFabric[0]?.expanded}
                // mainClass="resizeFab"
                mainClass={`resizeFab-${randomIdGenerator().toString()}`}
                tableId={`fabricTableId-${randomIdGenerator().toString()}`}
                //  tableId="fabricTableId"
                className="pre-costing-details-table table-bordered"
                size="sm"
                responsive={true}
            >
                <thead className='thead-light'>
                    <tr >
                        <th>SL</th>
                        <th className='text-center'><strong>Action</strong></th>

                        {
                            filteredFabric[0]?.itemSegments.map( ( segment, index ) => (
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
                        <th className='text-center'><strong>Part</strong></th>
                        <th className='text-center'><strong>Remarks</strong></th>
                    </tr>
                </thead>
                <tbody className="text-center">

                    {
                        filteredFabric.map( ( i, index ) => (
                            <tr key={i.fieldId} >
                                <td>
                                    {index + 1}
                                </td>
                                <td style={{ minWidth: '100px' }} >
                                    <span>
                                        <Button.Ripple id="copyId"
                                            tag={Label}
                                            // disabled={( orderDetails.length === 1 )}
                                            onClick={() => { handleDuplicateFabricDetailsRow( i.fieldId, index ); }}
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
                                            onClick={() => { handleEditFabricRow( i ); }}
                                            className='btn-icon p-0 ml-1'
                                            color='flat-success' >
                                            <Edit3
                                                size={18}
                                                id="editFabric"
                                                color="green" />
                                        </Button.Ripple>
                                        <Button.Ripple
                                            id="deleteFabId"
                                            disabled={i.isRestrictedToChange}
                                            tag={Label}
                                            onClick={() => { handleRemoveFabricRow( i ); }}
                                            className='btn-icon p-0 ml-1'
                                            color='flat-danger' >
                                            <MinusSquare
                                                size={18}
                                                id="deleteFabId"
                                                color="red" />
                                        </Button.Ripple>
                                    </span>
                                </td>
                                {

                                    i?.itemSegments?.map( ( is, index ) => (
                                        <td key={index + 1} style={{ minWidth: '200px' }}>
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


                                            {
                                                i.isEdit ? (
                                                    <div hidden={is.isColorSensitive || is.isSizeSensitive}>
                                                        <CreatableSelect
                                                            isDisabled={i.isApproved || i.isRestrictedToChange}
                                                            isHidden={true}
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
                                                    </div>
                                                ) : <span
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
                                        hidden={!i.isEdit}
                                        className="form-control-sm form-control text-right"
                                        id={`consumptionQuantity-${i.fieldId}`}
                                        displayType="input"
                                        value={i.consumptionQuantity}
                                        name="consumptionQuantity"
                                        decimalScale={4}
                                        disabled={i.isApproved || i.isRestrictedToChange}
                                        fixedDecimalScale={i.consumptionQuantity > 0}
                                        allowNegative={false}
                                        allowLeadingZeros={false}
                                        onFocus={( e ) => {
                                            e.target.select();
                                        }}
                                        onBlur={( e ) => { handleOnChangeForFabric( e, i.fieldId ); }}
                                        onChange={( e ) => { handleOnChangeForFabric( e, i.fieldId ); }}
                                    />
                                </td>

                                <td style={{ minWidth: '115px' }} >
                                    <span hidden={i.isEdit}>
                                        {i.consumptionUomValue?.label}
                                    </span>
                                    <span hidden={!i.isEdit}>
                                        <Select
                                            id='consumptionUomId'
                                            name="consumptionUom"
                                            isClearable={false}
                                            isDisabled={i.isApproved || i.isRestrictedToChange}
                                            isSearchable
                                            menuPosition={'fixed'}
                                            theme={selectThemeColors}
                                            options={i.consumptionUomArray}
                                            classNamePrefix='dropdown'
                                            className="erp-dropdown-select"
                                            value={i.consumptionUomValue}
                                            onChange={data => {
                                                handleConsumptionUomDropdownForFabric( data, i.fieldId );
                                            }}
                                            onFocus={() => {
                                                handleConsumptionUOMOnFocusForFabric(
                                                    dropDownFabricItemGroups?.find( item => item.value === i.itemGroupId )?.defaultUomSetId, i.consumptionUomArray, i.fieldId );
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
                                        onBlur={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                        onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
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
                                        disabled={i.isApproved || i.isRestrictedToChange}
                                        placeholder="Consumption Per Garment"
                                        bsSize="sm"
                                        value={i.consumptionPerGarment}
                                        onFocus={( e ) => e.target.select()}
                                        onChange={( e ) => { handleOnChangeForFabric( e, i.fieldId ); }}
                                    />
                                </td>
                                <td >
                                    <span hidden={i.isEdit}>
                                        {i.consumptionPerGarmentUomValue?.label}
                                    </span>
                                    <span hidden={!i.isEdit}>
                                        <Select
                                            id='consumptionPerGarmentUomId'
                                            name="consumptionPerGarmentUom"
                                            isSearchable
                                            menuPosition={'fixed'}
                                            isDisabled={i.isApproved || i.isRestrictedToChange}

                                            // isDisabled
                                            theme={selectThemeColors}
                                            value={i.consumptionPerGarmentUomValue}
                                            classNamePrefix='dropdown'
                                            options={defaultUOMDropdown}
                                            className="erp-dropdown-select"
                                            onChange={data => {
                                                handleConsumptionPerGarmentUomDropdownForFabric( data, i.fieldId );
                                            }}
                                            onFocus={() => { handlePerGarmentUOMFabricOnFocus( dropDownFabricItemGroups?.find( item => item.value === i.itemGroupId )?.defaultUomSetId, i.orderUomArray, i.fieldId ); }}
                                        />
                                    </span>
                                </td>
                                <td >
                                    <span hidden={i.isEdit}>
                                        {i.orderUOMValue?.label}
                                    </span>
                                    <span hidden={!i.isEdit}>
                                        <Select
                                            id='orderUOMId'
                                            name="orderUOM"
                                            isSearchable
                                            isDisabled={i.isApproved || i.isRestrictedToChange}
                                            menuPosition="fixed"
                                            theme={selectThemeColors}
                                            options={i.orderUomArray}
                                            classNamePrefix="dropdown"
                                            className="erp-dropdown-select"
                                            value={i.orderUOMValue}
                                            onChange={data => {
                                                handleOrderUomDropdownForFabric( data, i.fieldId );
                                            }}
                                            onFocus={() => {
                                                handleOrderUomOnFocusForFabric(
                                                    dropDownFabricItemGroups?.find( item => item.value === i.itemGroupId )?.defaultUomSetId, i.orderUomArray, i.fieldId );
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
                                            isDisabled={i.isApproved || i.isRestrictedToChange}
                                            isSearchable
                                            menuPosition={'fixed'}
                                            theme={selectThemeColors}
                                            options={currencyDropdown}
                                            classNamePrefix='dropdown'
                                            className="erp-dropdown-select"
                                            value={i.currencyValue}
                                            onChange={data => {
                                                handleCurrencyDropdownForFabric( data, i.fieldId );
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
                                        onBlur={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                        onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
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
                                            isDisabled={i.isApproved || i.isRestrictedToChange}
                                            menuPosition={'fixed'}
                                            theme={selectThemeColors}
                                            options={selectPurchaseType}
                                            classNamePrefix='dropdown'
                                            className="erp-dropdown-select"
                                            value={i.purchaseTypeValue}
                                            onChange={data => {
                                                handlePurchaseTypeDropdownForFabric( data, i.fieldId );
                                            }}
                                        />
                                    </span>
                                </td>
                                <td style={{ minWidth: '150px' }}>
                                    <span hidden={i.isEdit}>
                                        {i.preferredSupplierValue?.label}
                                    </span>
                                    <span hidden={!i.isEdit}>
                                        <Select
                                            id='preferredSupplierId'
                                            name="preferredSupplier"
                                            isDisabled={i.isApproved || i.isRestrictedToChange}
                                            isClearable
                                            isSearchable
                                            menuPosition={'fixed'}
                                            theme={selectThemeColors}
                                            options={vendorDropdown}
                                            classNamePrefix="dropdown"
                                            className="erp-dropdown-select"
                                            value={i.preferredSupplierValue}
                                            onChange={data => {
                                                handlePreferredSupplierDropdownForFabric( data, i.fieldId );
                                            }}
                                            onFocus={() => { handleVendorOnFocus(); }}
                                        />
                                    </span>
                                </td>
                                <td style={{ width: '105px' }} >

                                    <span className="d-flex justify-content-center">
                                        <CustomInput
                                            disabled={!i.isEdit || i.isApproved || i.isRestrictedToChange}
                                            id={`buyerSuppliedId-${i.fieldId}`}
                                            name='isBuyerSupplied'
                                            type='checkbox'
                                            checked={i.isBuyerSupplied}
                                            onChange={e => handleOnChangeForFabric( e, i.fieldId )}
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
                                            handleGetColorSizeSensForFabric(
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
                                        for={`${i.fieldId}-fabric`}
                                        tag={Label}
                                        onClick={() => {
                                            handleApplicableColorSizeModalOpen(
                                                i.consumptionPurchaseOrderColors,
                                                i.consumptionPurchaseOrderSizes,
                                                i.fieldId,
                                                'Fabric',
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
                                            id={`${i.fieldId}-fabric`}
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
                                <td style={{ width: '205px' }} >
                                    <span className="d-flex justify-content-center">
                                        <CustomInput
                                            disabled={!i.isEdit}
                                            id={`approvedId-${i.fieldId}`}
                                            name='isApprovedStatus'
                                            type='checkbox'
                                            //  disabled={!isPermitted( i.isApproved, i.isRestrictedToChange, i.approvedById )}
                                            // disabled={i.isRestrictedToChange}
                                            checked={i.isApprovedStatus}
                                            onChange={e => handleStatusChangeForFabric( e, i.fieldId, i.isApproved, i )}
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
                                            onChange={e => handleOnChangeForFabric( e, i.fieldId )}
                                        />
                                    </span>
                                </td>
                                <td style={{ width: '105px' }} >
                                    <span hidden={i.isEdit}>
                                        {i.garmentPart?.label}
                                    </span>
                                    <span hidden={!i.isEdit}>
                                        <Select
                                            id='partId'
                                            name="garmentPart"
                                            isClearable
                                            isSearchable
                                            menuPosition={'fixed'}
                                            isDisabled={i.isApproved || i.isRestrictedToChange}
                                            theme={selectThemeColors}
                                            options={costingConsumptionBodyParts}
                                            classNamePrefix='dropdown'
                                            className={classNames( `erp-dropdown-select ${( ( i.isFieldError && !i.garmentPart ) ) && 'is-invalid'}` )}
                                            value={i.garmentPart}

                                            onChange={( data, e ) => {
                                                handleFabricDropdown( e, data, i.fieldId );
                                            }}
                                        />
                                    </span>
                                </td>
                                <td>
                                    <span hidden={i.isEdit}>
                                        {i.remarks}
                                    </span>
                                    <Input
                                        hidden={!i.isEdit}
                                        name="remarks"
                                        value={i?.remarks}
                                        bsSize="sm"
                                        disabled={i.isApproved || i.isRestrictedToChange}
                                        onChange={e => handleOnChangeForFabric( e, i.fieldId )}
                                    />
                                </td>


                            </tr>
                        ) )
                    }

                </tbody>
            </ResizableTable>
            <Button.Ripple
                id="addFabId"
                tag={Label}
                onClick={() => { handleAddNewFabricRow(); }}
                className='btn-icon' color='flat-success' >
                <PlusSquare id="addFabId" color="green" />
            </Button.Ripple>
            <div>
                {
                    openModal &&
                    ( <SizeColorSenseForm
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        consumptionFabricDetails={consumptionFabricDetails}
                        consumptionAccessoriesDetails={consumptionAccessoriesDetails}
                        consumptionDetailsSizeSens={consumptionDetailsSizeSens}
                        consumptionDetailsColorSens={consumptionDetailsColorSens}
                    /> )
                }
                {/* {
                    ( consumptionDetailsSizeSens && consumptionDetailsColorSens ) &&
                    ( <SizeColorSenseAccessoriesForm
                        openModal={openAccessoriesModal}
                        setOpenModal={setOpenAccessoriesModal}
                        consumptionAccessoriesDetails={consumptionAccessoriesDetails}
                        consumptionDetailsSizeSens={consumptionDetailsSizeSens}
                        consumptionDetailsColorSens={consumptionDetailsColorSens}
                    /> )
                } */}
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
                    destinationModalOpen &&
                    <DestinationModal
                        openModal={destinationModalOpen}
                        setOpenModal={setDestinationModalOpen}
                        destinationModalObj={destinationModalObj}
                        setDestinationModalObj={setDestinationModalObj}
                    />
                }
                {
                    ( descriptionModalObj && openDescriptionModal ) &&
                    <ConsumptionDescriptionGenerator
                        descriptionModalObj={descriptionModalObj}
                        openModal={openDescriptionModal}
                        setOpenModal={setOpenDescriptionModal}
                    />
                }

            </div>
        </div>
    );
};

export default ExpandableFabricDetails;
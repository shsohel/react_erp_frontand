import { getVendorDropdown } from '@views/inventory/vendor/store/actions';
import { useState } from 'react';
import { Map, Search, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CustomInput, Label, Progress } from 'reactstrap';
import { baseAxios } from '../../../../services';
import { inventoryApi } from '../../../../services/api-end-points/inventory';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { notify } from '../../../../utility/custom/notifications';
import ResizableTable from '../../../../utility/custom/ResizableTable';
import { confirmObj, permissibleProcessObj, selectDestination, status } from '../../../../utility/enums';
import { insertAfterItemOfArray, isZeroToFixed, randomIdGenerator } from '../../../../utility/Utils';
import { getDropDownTrimItemGroupsByGroupName, getItemSegmentArrayByItemGroupId } from '../../../inventory/item-group/store/actions';
import { getCurrencyDropdown } from '../../currency/store/actions';
import { bindConsumptionAccessoriesDetails, getConsumptionSizeColorSense, getConsumptionSizeColorSenseForEdit } from '../store/actions';
import ApplicableSizeAndColorModal from './ApplicableSizeAndColorModal';
import DestinationModal from './DestinationModal';
import SizeColorSenseForm from './SizeColorSenseForm';
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
        console.log( defaultUomSetId );
        console.log( defaultUomSetId );
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


    const handleRemoveAccessoriesRow = ( fieldId ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                const updatedData = [...consumptionAccessoriesDetails];
                updatedData.splice(
                    updatedData.findIndex( x => x.fieldId === fieldId ),
                    1
                );
                dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
            }
        } );
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
            isApprovedStatus: false

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
            detailId: 0
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

    const handleSegmentValueOnFocus = ( rowId, itemGroupId, segmentId, accessories, segmentValues ) => {
        if ( !segmentValues.length ) {
            const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
            baseAxios.get( endPoint ).then( response => {
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
            }
        } ).catch( err => console.log( err ) );
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

                                {
                                    i?.itemSegments?.map( ( is, index ) => (
                                        <td key={index + 1} style={{ minWidth: '235px' }}>
                                            <div hidden={!is.isColorSensitive && !is.isSizeSensitive}>
                                                {is?.value?.label ?? ''}
                                            </div>


                                            <div hidden={is.isColorSensitive || is.isSizeSensitive}>
                                                {is.value?.label}
                                            </div>

                                        </td>
                                    ) )
                                }


                                <td style={{ width: '405px' }} >
                                    {isZeroToFixed( i.consumptionQuantity, 4 )}
                                </td>

                                <td style={{ width: '105px' }} >
                                    {i.consumptionUomValue?.label}
                                </td>
                                <td >
                                    {isZeroToFixed( i.wastagePercent, 2 )}
                                </td>
                                <td  >
                                    {i.consumptionPerGarment}
                                </td>
                                <td >
                                    {i.consumptionPerGarmentUomValue?.label}
                                </td>
                                <td >
                                    {i.orderUOMValue?.label}
                                </td>

                                <td style={{ width: '105px' }} >
                                    {i.currencyValue?.label}
                                </td>
                                <td >
                                    {isZeroToFixed( i.ratePerUnit, 4 )}
                                </td>
                                <td  >
                                    {i.purchaseTypeValue?.label}
                                </td>
                                <td style={{ minWidth: '105px' }}>
                                    {i.preferredSupplierValue?.label}
                                </td>
                                <td style={{ width: '105px' }} >
                                    <span className="d-flex justify-content-center">
                                        <CustomInput
                                            id={`buyerSuppliedId-${i.fieldId}`}
                                            name='isBuyerSupplied'
                                            type='checkbox'
                                            checked={i.isBuyerSupplied}
                                            onChange={e => { }}
                                        />
                                    </span>
                                </td>

                                <td style={{ width: '85px' }} >
                                    <Button.Ripple
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
                                            // disabled={i.isRestrictedToChange}
                                            name='isApprovedStatus'
                                            type='checkbox'
                                            checked={i.isApprovedStatus}
                                            onChange={e => { }}
                                        />
                                    </span>
                                </td>
                                <td style={{ width: '205px' }} >
                                    <span className="d-flex justify-content-center">
                                        <CustomInput
                                            id={`isBomOnShipQtyId-${i.fieldId}`}
                                            name='isBomOnShipmentQty'
                                            type='checkbox'
                                            checked={i.isBomOnShipmentQty}
                                            onChange={e => { }}
                                        />
                                    </span>
                                </td>
                                <td style={{ width: '205px' }} >
                                    {i?.remarks}
                                </td>

                            </tr>
                        ) )
                    }

                </tbody>
            </ResizableTable>

            <div>

                {/* {
                    ( consumptionDetailsSizeSens && consumptionDetailsColorSens ) &&
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
                } */}

                {
                    openAccessoriesModal &&
                    ( <SizeColorSenseForm
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

            </div>
        </div >
    );
};

export default ExpandableAccessoriesDetails;
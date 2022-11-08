import { getVendorDropdown } from '@views/inventory/vendor/store/actions';
import { useState } from 'react';
import { Map, Search, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CustomInput, Label, Progress } from 'reactstrap';
import { baseAxios } from '../../../../services';
import { inventoryApi } from '../../../../services/api-end-points/inventory';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { notify } from '../../../../utility/custom/notifications';
import ResizableTable from '../../../../utility/custom/ResizableTable';
import { confirmObj, permissibleProcessObj, selectDestination, status } from '../../../../utility/enums';
import { insertAfterItemOfArray, isZeroToFixed, randomIdGenerator } from '../../../../utility/Utils';
import { getCurrencyDropdown } from '../../currency/store/actions';
import { bindConsumptionFabricDetails, getConsumptionSizeColorSense, getConsumptionSizeColorSenseForEdit } from '../store/actions';
import ApplicableSizeAndColorModal from './ApplicableSizeAndColorModal';
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
            isApprovedStatus: false

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
            detailId: 0
        };

        const duplicatedArray = insertAfterItemOfArray( fabrics, index, updatedFabric );
        dispatch( bindConsumptionFabricDetails( duplicatedArray ) );
    };

    const handleRemoveFabricRow = ( fieldId ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                const updatedData = [...consumptionFabricDetails];
                updatedData.splice(
                    updatedData.findIndex( x => x.fieldId === fieldId ),
                    1
                );
                dispatch( bindConsumptionFabricDetails( updatedData ) );
            }
        } );
    };
    const handleItemDescriptionDropdownChange = ( data, fabricFieldId ) => {
        const updatedData = consumptionFabricDetails.map( i => {
            if ( fabricFieldId === i.fieldId ) {
                i.itemDescription = data?.label ?? '';
                i.itemDescriptionTemplate = data?.itemDescriptionTemplate ?? '';
                i.itemDescriptionValue = data;
            }
            return i;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
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
                console.log( 'id' );
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

    const handleSegmentValueOnFocus = ( rowId, itemGroupId, segmentId, fabric, segmentValues ) => {
        if ( !segmentValues.length ) {
            const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
            baseAxios.get( endPoint ).then( response => {
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
        } ).catch( err => console.log( err ) );
    };

    const isPermitted = ( isApproved, isRestrictedToChange, approvedById ) => {
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

                                {

                                    i?.itemSegments?.map( ( is, index ) => (
                                        <td key={index + 1} style={{ minWidth: '235px' }}>
                                            {/* <Label
                                                className="font-weight-bold "
                                                hidden={!is.isColorSensitive && !is.isSizeSensitive}
                                            >
                                                {is.value?.label}
                                            </Label> */}

                                            <div
                                                hidden={!is.isColorSensitive && !is.isSizeSensitive}

                                            >
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

                                <td style={{ minWidth: '115px' }} >
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
                                <td style={{ minWidth: '150px' }}>
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
                                            id={`approvedId-${i.fieldId}`}
                                            name='isApprovedStatus'
                                            type='checkbox'
                                            // disabled={i.isRestrictedToChange}
                                            checked={i.isApprovedStatus}
                                            onChange={e => { }}

                                        />

                                    </span>
                                </td>
                                <td style={{ width: '205px' }} >
                                    <span className="d-flex justify-content-center">
                                        <CustomInput
                                            id={`isBomOnShipQtyId-${i.fieldId}`}
                                            type='checkbox'
                                            checked={i.isBomOnShipmentQty}
                                            onChange={e => { }}

                                        />
                                    </span>
                                </td>
                                <td style={{ width: '105px' }} >
                                    {i.garmentPart?.label}
                                </td>
                                <td>
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
                    ( <SizeColorSenseForm
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        consumptionFabricDetails={consumptionFabricDetails}
                        consumptionAccessoriesDetails={consumptionAccessoriesDetails}
                        consumptionDetailsSizeSens={consumptionDetailsSizeSens}
                        consumptionDetailsColorSens={consumptionDetailsColorSens}
                    /> )
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
                    ( descriptionModalObj && openDescriptionModal ) &&
                    <ConsumptionDescriptionGenerator
                        descriptionModalObj={descriptionModalObj}
                        openModal={openDescriptionModal}
                        setOpenModal={setOpenDescriptionModal}
                    />
                } */}


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

            </div>
        </div>
    );
};

export default ExpandableFabricDetails;
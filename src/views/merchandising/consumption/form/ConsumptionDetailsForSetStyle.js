import '@custom-styles/merchandising/others/pre-costing-collapse.scss';
import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import '@custom-styles/merchandising/select/pre-costing-select.scss';
import { notify } from '@custom/notifications';
import { baseAxios } from '@services';
import React, { useEffect, useState } from 'react';
import { MinusSquare, PlusSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {
    Button, CustomInput,
    Input,
    Label,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import { inventoryApi } from '../../../../services/api-end-points/inventory';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import ResizableTable from '../../../../utility/custom/ResizableTable';
import { defaultUnitId } from '../../../../utility/enums';
import {
    randomIdGenerator,
    selectThemeColors
} from '../../../../utility/Utils';
import { getDropDownPackItemGroupsByGroupName, getDropDownTrimItemGroupsByGroupName } from '../../../inventory/item-group/store/actions';
import {
    getDefaultUOMDropdownByUnitId,
    getOrderAndConsumptionUOMDropdown
} from '../../../inventory/unit-sets/store/actions';
import { getCurrencyDropdown } from '../../currency/store/actions';
import {
    bindConsumptionAccessoriesDetails,
    getConsumptionSizeColorSense,
    getConsumptionSizeColorSenseForEdit,
    getItemSubGroupForConsumptionAccessories
} from '../store/actions';
import ConsumptionDescriptionGeneratorAccessories from './ConsumptionDescriptionGeneratorAccessories';
import ConsumptionPackagingAccessories from './ConsumptionPackagingAccessories';
import SizeColorSenseAccessoriesForm from './SizeColorSenseAccessoriesForm ';


const selectPurchaseType = [
    {
        value: 'IMPORT',
        label: 'IMPORT'
    },
    {
        value: 'LOCAL',
        label: 'LOCAL'
    }
];


const selectSupplier = [
    {
        value: 1,
        label: 'Milon'
    },
    {
        value: 2,
        label: 'Devid'
    }
];

const ConsumptionDetailsForSetStyle = () => {
    const {
        consumptionBasicInfo,
        consumptionAccessoriesDetails,
        consumptionDetailsSizeSens,
        consumptionDetailsColorSens
    } = useSelector( ( { consumptions } ) => consumptions );
    const { dropDownTrimItemGroups } = useSelector( ( { itemGroups } ) => itemGroups );
    const { orderMDropdown, consumptionUOMDropdown } = useSelector(
        ( { unitSets } ) => unitSets
    );
    const { currencyDropdown } = useSelector( ( { currencies } ) => currencies );

    ///For Fabric Item Description Modal
    const [descriptionModalObj, setDescriptionModalObj] = useState( null );
    const [openDescriptionModal, setOpenDescriptionModal] = useState( false );
    ///For Fabric Item Description Modal
    const [
        descriptionModalObjForAccessories,
        setDescriptionModalObjForAccessories
    ] = useState( null );
    const [
        openDescriptionModalForAccessories,
        setOpenDescriptionModalForAccessories
    ] = useState( false );
    const [openAccessoriesModal, setOpenAccessoriesModal] = useState( false );

    const { defaultUOMDropdown } = useSelector( ( { unitSets } ) => unitSets );
    const dispatch = useDispatch();

    const [active, setActive] = useState( '1' );
    const [openCustomizer, setOpenCustomizer] = useState( false );

    useEffect( () => {
        dispatch( getDropDownPackItemGroupsByGroupName( "Packaging%20and%20Labeling" ) );
        dispatch( getDropDownTrimItemGroupsByGroupName( "TRIM" ) );

    }, [] );

    const handleCurrencyOnFocus = () => {
        dispatch( getCurrencyDropdown() );
    };

    const handleAccessoriesItemOnFocus = () => {
        dispatch( getDropDownTrimItemGroupsByGroupName( "TRIM" ) );
    };

    //All
    const handlePerGarmentUOMOnFocus = ( unitId ) => {
        dispatch( getDefaultUOMDropdownByUnitId( unitId ) );
    };
    const handleRemoveAccessoriesRow = ( fieldId ) => {
        const updatedData = [...consumptionAccessoriesDetails];
        updatedData.splice(
            updatedData.findIndex( ( x ) => x.fieldId === fieldId ),
            1
        );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };

    const handleAddAccessoriesRow = () => {
        const newRow = {
            fieldId: randomIdGenerator(),
            detailId: 0,
            costingGroupType: 1,
            consumptionId: "",
            itemGroup: null, //Extra
            itemGroupId: 0,
            itemSubGroup: null, //Extra
            itemSubGroupArray: [], //Extra
            itemSubGroupId: 0,
            itemDescription: "",
            itemDescriptionArray: [],
            itemDescriptionValue: null,
            itemDescriptionTemplate: "",
            consumptionQuantity: 0,

            defaultUomSetId: null,
            consumptionUomArray: [],
            consumptionUomValue: null, // Extra
            consumptionUom: "",

            wastagePercent: 0,
            consumptionPerGarment: 1,
            consumptionPerGarmentUomValue: null, // Extra
            consumptionPerGarmentUom: "",
            consumptionPerGarmentRelativeFactor: 0,
            consumptionUomRelativeFactor: 0,

            orderUomArray: [],
            orderUomRelativeFactor: 0,
            orderUOMValue: null, ///Extra
            orderUOM: "",

            currencyValue: null, //Extra
            currencyCode: "",
            ratePerUnit: 0,
            purchaseTypeValue: null, //Extra
            purchaseType: "",
            buyerSupplied: false,
            preferredSupplierValue: null,
            preferredSupplier: "",
            remarks: "",
            statusValue: null,
            status: "",
            isApproved: false,
            colorSensitivityType: 3,
            sizeSensitivityType: 3,
            colorSensitivities: null,
            sizeSensitivities: null
        };
        dispatch(
            bindConsumptionAccessoriesDetails( [
                ...consumptionAccessoriesDetails,
                newRow
            ] )
        );
    };


    const handleConsumptionUOMOnFocusForAccessories = ( defaultUomSetId, uomArray, fieldId ) => {

        if ( !uomArray.length && defaultUomSetId ) {
            baseAxios.get( `${inventoryApi.unitSet.root}/${defaultUomSetId}` )
                .then( response => {
                    const consumptionUomArray = response?.data?.details?.map( uom => ( {
                        value: uom.id,
                        label: uom.unitName,
                        description: uom.description,
                        isBaseUnit: uom.isBaseUnit,
                        relativeFactor: uom.relativeFactor,
                        uomSetId: uom.uomSetId
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
    const handleConsumptionPerGarmentUomDropdownForAccessories = ( newValue, fieldId ) => {
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

    const handleOrderUomOnFocusForAccessories = ( defaultUomSetId, uomArray, fieldId ) => {

        console.log( defaultUomSetId );
        if ( !uomArray.length && defaultUomSetId ) {
            baseAxios.get( `${inventoryApi.unitSet.root}/${defaultUomSetId}` )
                .then( response => {
                    console.log( response );
                    const orderUomArray = response?.data?.details?.map( uom => ( {
                        value: uom.id,
                        label: uom.unitName,
                        description: uom.description,
                        isBaseUnit: uom.isBaseUnit,
                        relativeFactor: uom.relativeFactor,
                        uomSetId: uom.uomSetId
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

    ///For Accessories Input OnChange
    const handleItemGroupDropdownForAccessories = async ( newValue, fieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( ( i ) => {
            if ( fieldId === i.fieldId ) {
                i.itemGroup = newValue;
                i.itemSubGroupArray = newValue.sub;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
        await baseAxios
            .get( `${inventoryApi.itemGroup.root}/${newValue?.value}/subCategories` )
            .then( ( response ) => {
                const updatedData = consumptionAccessoriesDetails.map( ( i ) => {
                    if ( fieldId === i.fieldId ) {
                        i.itemGroup = newValue;
                        i.itemGroupId = newValue?.value;
                        i.itemSubGroup = null;
                        i.itemSubGroupId = 0;
                        i.itemSubGroupArray = response?.data?.map( ( rd ) => ( {
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
        const updatedData = consumptionAccessoriesDetails.map( ( i ) => {
            if ( fieldId === i.fieldId ) {
                i.itemSubGroup = newValue;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };
    const handleOnChangeForAccessories = ( e, fieldId ) => {
        const { name, value, type, checked } = e.target;
        const updatedData = consumptionAccessoriesDetails.map( ( i ) => {
            if ( fieldId === i.fieldId ) {
                i[name] =
                    type === 'number' ? Number( value ) : type === 'checkbox' ? checked : value;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };

    const handleConsumptionUomDropdownForAccessories = ( newValue, fieldId ) => {
        console.log( newValue );
        const updatedData = consumptionAccessoriesDetails.map( ( i ) => {
            if ( fieldId === i.fieldId ) {
                i.consumptionUomValue = newValue; // Extra
                i.consumptionUom = newValue?.label;
                i.consumptionUomRelativeFactor = newValue.relativeFactor;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };
    const handleUOMOnFocusAll = ( itemId ) => {
        dispatch( getOrderAndConsumptionUOMDropdown( itemId ) );
    };
    const handleconsumptionPerGarmentUomDropdownForAccessories = (
        newValue,
        fieldId
    ) => {
        const updatedData = consumptionAccessoriesDetails.map( ( i ) => {
            if ( fieldId === i.fieldId ) {
                i.consumptionPerGarmentUomValue = newValue; // Extra
                i.consumptionPerGarmentUom = newValue?.label;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };
    const handleOrderUomDropdownForAccessories = ( newValue, fieldId ) => {
        console.log( newValue );
        const updatedData = consumptionAccessoriesDetails.map( ( i ) => {
            if ( fieldId === i.fieldId ) {
                i.orderUOMValue = newValue; // Extra
                i.orderUOM = newValue?.label;
                i.orderUomRelativeFactor = newValue?.relativeFactor;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };
    const handleCurrencyDropdownForAccessories = ( newValue, fieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( ( i ) => {
            if ( fieldId === i.fieldId ) {
                i.currencyValue = newValue; // Extra
                i.currencyCode = newValue?.label;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };
    const handlePurchaseTypeDropdownForAccessories = ( newValue, fieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( ( i ) => {
            if ( fieldId === i.fieldId ) {
                i.purchaseTypeValue = newValue; // Extra
                i.purchaseType = newValue?.label;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };
    const handlePreferredSupplierDropdownForAccessories = ( newValue, fieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( ( i ) => {
            if ( fieldId === i.fieldId ) {
                i.preferredSupplierValue = newValue; // Extra
                i.preferredSupplier = newValue?.label;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };
    const handleStatusDropdownForAccessories = ( newValue, fieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( ( i ) => {
            if ( fieldId === i.fieldId ) {
                i.statusValue = newValue; // Extra
                i.status = newValue?.label;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };

    const toggle = ( tab ) => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };

    const handleToggle = ( e ) => {
        e.preventDefault();
        setOpenCustomizer( !openCustomizer );
    };

    ///For Accessories
    const handleItemDescriptionDropdownChangeForAccessories = (
        data,
        fabricFieldId
    ) => {
        const updatedData = consumptionAccessoriesDetails.map( ( i ) => {
            if ( fabricFieldId === i.fieldId ) {
                i.itemDescription = data?.label;
                i.itemDescriptionTemplate = data?.itemDescriptionTemplate;
                i.itemDescriptionValue = data;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };

    const handleItemDescriptionOnFocusForAccessories = (
        itemGroupId,
        ItemSubGroupId,
        fabricFieldId
    ) => {
        const endPoint = `${merchandisingApi.costing.root}/fabricDetails/itemGroup/${itemGroupId}/itemSubGroup/${ItemSubGroupId}/itemDescriptionSuggestions`;
        baseAxios.get( endPoint ).then( ( response ) => {
            const updatedData = consumptionAccessoriesDetails.map( ( i ) => {
                if ( fabricFieldId === i.fieldId ) {
                    i.itemDescriptionArray = response.data.map( ( i ) => ( {
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
    };

    //For Accessories
    const handleDescriptionModalOpenForAccessories = (
        itemGroupId,
        consumptionFieldIdForAccessories
    ) => {
        setDescriptionModalObjForAccessories( {
            itemGroupId,
            consumptionFieldIdForAccessories
        } );
        setOpenDescriptionModalForAccessories( !openDescriptionModalForAccessories );
    };


    return (
        <>
            <Nav tabs>

                <NavItem>
                    <NavLink
                        active={active === '1'}
                        onClick={() => {
                            toggle( '1' );
                        }}
                    >
                        Accessories
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === '3'}
                        onClick={() => {
                            toggle( '3' );
                        }}
                    >
                        Pack Accessories
                    </NavLink>
                </NavItem>
            </Nav>
            {
                active === "1" && <div>
                    <div>
                        <ResizableTable
                            mainClass="resizeAccess"
                            tableId="accessTable"
                            className="pre-costing-details-table table-bordered"
                            size="sm"
                            responsive={true}
                        >
                            <thead className='thead-light'>
                                <tr >
                                    <th className=' text-center'><strong>Item Group</strong></th>
                                    <th className='text-center'><strong>Item Sub</strong></th>
                                    <th className='text-center'><strong>Item Description</strong></th>
                                    <th className='text-center'><strong>Con. Qty</strong></th>
                                    <th className='text-center'><strong>Con. Unit</strong></th>
                                    <th className='text-center'><strong>Wastage(%)</strong></th>
                                    <th className='text-center'><strong>Con. Per Garments </strong></th>
                                    <th className='text-center'><strong>Con. Per Garment Uom</strong></th>
                                    <th className='text-center'><strong>Order UOM</strong></th>
                                    <th className='text-center'><strong>Currency</strong></th>
                                    <th className='text-center'><strong>Rate</strong></th>
                                    <th className='text-center'><strong>Purchase Type</strong></th>
                                    <th className='text-center'><strong>Preferred Supplier</strong></th>
                                    <th className='text-center'><strong>Buyer Supplied</strong></th>
                                    {/* <th className='text-center'><strong>Status</strong></th> */}
                                    {/* <th className='text-center'><strong>Color Size</strong></th> */}
                                    <th className='text-center'><strong>Is Approved?</strong></th>
                                    <th className='text-center'><strong>Action</strong></th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {
                                    consumptionAccessoriesDetails.map( i => (
                                        <tr key={i.fieldId}>
                                            <td style={{ minWidth: '105px' }}>
                                                <CreatableSelect
                                                    id={`itemGroupId-${i.fieldId}`}
                                                    name="itemGroupId"
                                                    isClearable={false}
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    theme={selectThemeColors}
                                                    options={dropDownTrimItemGroups}
                                                    classNamePrefix="dropdown"
                                                    className="erp-dropdown-select"
                                                    value={i?.itemGroup}
                                                    onChange={data => {
                                                        handleItemGroupDropdownForAccessories( data, i.fieldId );
                                                    }}
                                                    onFocus={() => handleAccessoriesItemOnFocus()}
                                                />
                                            </td>
                                            <td style={{ minWidth: '205px' }} >
                                                <CreatableSelect
                                                    id={`itemSubGroupId-${i.fieldId}`}
                                                    name="itemSubGroupId"
                                                    isClearable={false}
                                                    isSearchable
                                                    theme={selectThemeColors}
                                                    menuPosition={'fixed'}
                                                    options={i.itemSubGroupArray}
                                                    classNamePrefix="dropdown"
                                                    className="erp-dropdown-select"
                                                    onFocus={() => { dispatch( getItemSubGroupForConsumptionAccessories( i.fieldId, i.itemGroupId ) ); }}
                                                    value={i.itemSubGroup}
                                                    onChange={data => {
                                                        handleItemSubGroupDropdownForAccessories( data, i.fieldId );
                                                    }}
                                                />
                                            </td>
                                            <td style={{ minWidth: '405px' }} >
                                                <div className="d-flex w-100 align-items-center">
                                                    <Select
                                                        options={i.itemDescriptionArray}
                                                        value={i.itemDescriptionValue}
                                                        isClearable
                                                        menuPosition="fixed"
                                                        classNamePrefix="dropdown"
                                                        className="erp-dropdown-select w-100"
                                                        // menuPlacement="top"
                                                        onChange={( data ) => { handleItemDescriptionDropdownChangeForAccessories( data, i.fieldId ); }}
                                                        onFocus={() => { handleItemDescriptionOnFocusForAccessories( i?.itemGroupId, i?.itemSubGroupId, i.fieldId ); }}
                                                    />
                                                    <span >
                                                        <Button.Ripple
                                                            for="addItemDescriptionId"
                                                            tag={Label}
                                                            onClick={() => { handleDescriptionModalOpenForAccessories( i?.itemGroupId, i.fieldId ); }}
                                                            className='btn-icon p-0'
                                                            color='flat-success' >
                                                            <PlusSquare color='green' id="addItemDescriptionId" />
                                                        </Button.Ripple>
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ width: '405px' }} >
                                                <Input
                                                    className="text-right"
                                                    name="consumptionQuantity"
                                                    type="number"
                                                    placeholder="Consumption Qty"
                                                    value={i.consumptionQuantity}
                                                    bsSize="sm"
                                                    onFocus={( e ) => e.target.select()}
                                                    onChange={( e ) => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                                />
                                            </td>

                                            <td style={{ width: '105px' }} >
                                                <CreatableSelect
                                                    id='consumptionUomId'
                                                    name="consumptionUom"
                                                    isClearable={false}
                                                    isSearchable
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
                                            </td>
                                            <td >
                                                <Input
                                                    className="text-right"
                                                    name="wastagePercent"
                                                    type="number"
                                                    placeholder="Wastage Percent"
                                                    bsSize="sm"
                                                    onFocus={( e ) => e.target.select()}
                                                    value={i.wastagePercent}
                                                    onChange={( e ) => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                                />
                                            </td>
                                            <td  >
                                                <Input
                                                    className="text-right"
                                                    name="consumptionPerGarment"
                                                    type="number"
                                                    placeholder="Consumption Per Garment"
                                                    value={i.consumptionPerGarment}
                                                    bsSize="sm"
                                                    onFocus={( e ) => e.target.select()}
                                                    // onChange={( e ) => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                                    onChange={( e ) => { e.preventDefault(); }}

                                                />
                                            </td>
                                            <td >
                                                <CreatableSelect
                                                    id='consumptionPerGarmentUomId'
                                                    name="consumptionPerGarmentUom"
                                                    isClearable={false}
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    theme={selectThemeColors}
                                                    options={defaultUOMDropdown}
                                                    classNamePrefix="dropdown"
                                                    className="erp-dropdown-select"
                                                    value={i.consumptionPerGarmentUomValue}
                                                    onChange={data => {
                                                        handleConsumptionPerGarmentUomDropdownForAccessories( data, i.fieldId );
                                                    }}
                                                    onFocus={() => { handlePerGarmentUOMOnFocus( defaultUnitId ); }}
                                                />
                                            </td>
                                            <td >
                                                <CreatableSelect
                                                    id='orderUOMId'
                                                    name="orderUOM"
                                                    isClearable
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    theme={selectThemeColors}
                                                    options={i.orderUomArray}
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
                                            </td>

                                            <td style={{ width: '105px' }} >
                                                <CreatableSelect
                                                    id='currencyId'
                                                    name="currencyCode"
                                                    isClearable={false}
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    theme={selectThemeColors}
                                                    options={currencyDropdown}
                                                    classNamePrefix="dropdown"
                                                    className="erp-dropdown-select"
                                                    value={i.currencyValue}
                                                    onChange={data => {
                                                        handleCurrencyDropdownForAccessories( data, i.fieldId );
                                                    }}
                                                    onFocus={() => { handleCurrencyOnFocus(); }}
                                                />
                                            </td>
                                            <td >
                                                <Input
                                                    id={`ratePerUnit-${i.fieldId}`}
                                                    name="ratePerUnit"
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    value={i.ratePerUnit}
                                                    placeholder="Rate Per Unit"
                                                    onChange={e => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td  >
                                                <CreatableSelect
                                                    id='purchaseTypeId'
                                                    name="purchaseType"
                                                    isClearable={false}
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    theme={selectThemeColors}
                                                    options={selectPurchaseType}
                                                    classNamePrefix="dropdown"
                                                    className="erp-dropdown-select"
                                                    value={i.purchaseTypeValue}
                                                    onChange={data => {
                                                        handlePurchaseTypeDropdownForAccessories( data, i.fieldId );
                                                    }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }}>
                                                <CreatableSelect
                                                    id='preferredSupplierId'
                                                    name="preferredSupplier"
                                                    isClearable={false}
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    theme={selectThemeColors}
                                                    options={selectSupplier}
                                                    classNamePrefix="dropdown"
                                                    className="erp-dropdown-select"
                                                    value={i.preferredSupplierValue}
                                                    onChange={data => {
                                                        handlePreferredSupplierDropdownForAccessories( data, i.fieldId );
                                                    }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <span className="d-flex justify-content-center">
                                                    <CustomInput
                                                        id={`buyerSuppliedId-${i.fieldId}`}
                                                        name='buyerSupplied'
                                                        type='checkbox'
                                                        checked={i.buyerSupplied}
                                                        onChange={e => handleOnChangeForAccessories( e, i.fieldId )}
                                                    />
                                                </span>
                                            </td>


                                            {/* <td style={{ width: '85px' }} >
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

                                    </td> */}
                                            <td style={{ width: '105px' }} >
                                                <span className="d-flex justify-content-center">
                                                    <CustomInput
                                                        id={`approvedId-${i.fieldId}`}
                                                        name='isApproved'
                                                        type='checkbox'
                                                        checked={i.isApproved}
                                                        onChange={e => handleOnChangeForAccessories( e, i.fieldId )}
                                                    />
                                                </span>
                                            </td>
                                            <td style={{ width: '85px' }} >
                                                <span>
                                                    <Button.Ripple id="deleteFabId" tag={Label} disabled={( consumptionAccessoriesDetails.length === 1 )} onClick={() => { handleRemoveAccessoriesRow( i.fieldId ); }} className='btn-icon p-0' color='flat-danger' >
                                                        <MinusSquare size={18} id="deleteFabId" color="red" />
                                                    </Button.Ripple>
                                                </span>
                                            </td>
                                        </tr>
                                    ) )
                                }

                            </tbody>
                        </ResizableTable>
                    </div>
                    <Button.Ripple
                        id="addAccId"
                        tag={Label}
                        onClick={() => {
                            handleAddAccessoriesRow();
                        }}
                        className="btn-icon p-0"
                        color="flat-success"
                    >
                        <PlusSquare id="addAccId" color="green" />
                    </Button.Ripple>
                </div>

            }
            {
                active === "3" && <div>
                    <ConsumptionPackagingAccessories />
                </div>
            }


            {descriptionModalObjForAccessories &&
                openDescriptionModalForAccessories && (
                    <ConsumptionDescriptionGeneratorAccessories
                        descriptionModalObj={descriptionModalObjForAccessories}
                        openModal={openDescriptionModalForAccessories}
                        setOpenModal={setOpenDescriptionModalForAccessories}
                    />
                )}
            {consumptionDetailsSizeSens && consumptionDetailsColorSens && (
                <SizeColorSenseAccessoriesForm
                    openModal={openAccessoriesModal}
                    setOpenModal={setOpenAccessoriesModal}
                    consumptionAccessoriesDetails={consumptionAccessoriesDetails}
                    consumptionDetailsSizeSens={consumptionDetailsSizeSens}
                    consumptionDetailsColorSens={consumptionDetailsColorSens}
                />
            )}


        </>
    );
};

export default ConsumptionDetailsForSetStyle;

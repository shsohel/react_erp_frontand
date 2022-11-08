import '@custom-styles/merchandising/others/pre-costing-collapse.scss';
import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import '@custom-styles/merchandising/select/pre-costing-select.scss';
import { baseAxios } from "@services";
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { MinusSquare, Plus, Settings } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Button, CustomInput, Input, Label } from 'reactstrap';
import { inventoryApi } from '../../../../services/api-end-points/inventory';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import ResizableTable from '../../../../utility/custom/ResizableTable';
import { selectCurrency, selectStatus } from '../../../../utility/enums';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownItemGroups } from '../../../inventory/item-group/store/actions';
import { getDefaultUOMDropdownByUnitId, getOrderAndConsumptionUOMDropdown } from '../../../inventory/unit-sets/store/actions';
import { bindConsumptionFabricDetails, getConsumptionSizeColorSense, getItemSubGroupForConsumptionFabric } from '../store/actions';

const ConsumptionFabricDetailsForm = () => {
    const {
        consumptionBasicInfo,
        consumptionFabricDetails,
        consumptionAccessoriesDetails,
        consumptionDetailsSizeSens,
        consumptionDetailsColorSens
    } = useSelector( ( { consumptions } ) => consumptions );
    const dispatch = useDispatch();
    const { replace } = useHistory();
    const { orderMDropdown, consumptionUOMDropdown } = useSelector( ( { unitSets } ) => unitSets );
    const { dropDownItemGroups } = useSelector( ( { itemGroups } ) => itemGroups );
    const [openModal, setOpenModal] = useState( false );
    const [openAccessoriesModal, setOpenAccessoriesModal] = useState( false );
    ///For Fabric Item Description Modal
    const [descriptionModalObj, setDescriptionModalObj] = useState( null );
    const [openDescriptionModal, setOpenDescriptionModal] = useState( false );
    const { defaultUOMDropdown } = useSelector( ( { unitSets } ) => unitSets );

    useEffect( () => {
        dispatch( getDropDownItemGroups() );
    }, [] );


    //All
    const handlePerGarmentUOMOnFocus = ( unitId ) => {
        dispatch( getDefaultUOMDropdownByUnitId( unitId ) );
    };


    //Fabric
    const handleItemGroupDropdownForFabric = async ( newValue, fieldId ) => {
        const updatedData = consumptionFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemGroup = newValue;
                i.itemSubGroupArray = newValue.sub;
            }
            return i;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
        await baseAxios.get( `${inventoryApi.itemGroup.root}/${newValue?.value}/subCategories` ).then( response => {
            const updatedData = consumptionFabricDetails.map( i => {
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
            dispatch( bindConsumptionFabricDetails( updatedData ) );
        } );
    };

    const handleItemSubGroupDropdownForFabric = ( newValue, fieldId ) => {
        const updatedData = consumptionFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemSubGroup = newValue;
                i.itemSubGroupId = newValue?.value;
            }
            return i;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
    };

    ///For Fabric Input OnChange
    const handleOnChangeForFabric = ( e, fieldId ) => {
        const { name, value, type, checked } = e.target;
        const updatedData = consumptionFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i[name] = type === "number" ? Number( value ) : type === "checkbox" ? checked : value;
            }
            return i;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
    };

    const handleUOMOnFocusAll = ( itemId ) => {
        dispatch( getOrderAndConsumptionUOMDropdown( itemId ) );
    };


    const handleConsumptionUomDropdownForFabric = ( newValue, fieldId ) => {
        const updatedData = consumptionFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.consumptionUomValue = newValue; // Extra
                i.consumptionUom = newValue?.label;
            }
            return i;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
    };

    const handleconsumptionPerGarmentUomDropdownForFabric = ( newValue, fieldId ) => {
        const updatedData = consumptionFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.consumptionPerGarmentUomValue = newValue; // Extra
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
            }
            return i;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
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
    const handleStatusDropdownForFabric = ( newValue, fieldId ) => {
        const updatedData = consumptionFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.statusValue = newValue; // Extra
                i.status = newValue?.label;
            }
            return i;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
    };


    const handleAddFabricRow = () => {
        // const updatedData = [...consumptionFabricDetails];
        // updatedData.push( { ...updatedData[1] } ); // extend by copying the last
        // updatedData[2].fieldId = randomIdGenerator();
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
            consumptionUomValue: null, // Extra
            consumptionUom: "",
            wastagePercent: 0,
            consumptionPerGarment: 0,
            consumptionPerGarmentUomValue: null, // Extra
            consumptionPerGarmentUom: "",
            consumptionPerGarmentRelativeFactor: 0,
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
            colorSensitivities: [],
            sizeSensitivities: []
        };
        dispatch( bindConsumptionFabricDetails( [...consumptionFabricDetails, newRow] ) );

    };


    const handleRemoveFabricRow = ( fieldId ) => {
        const updatedData = [...consumptionFabricDetails];
        updatedData.splice(
            updatedData.findIndex( x => x.fieldId === fieldId ),
            1
        );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
    };

    ///For Fabric
    const handleItemDescriptionDropdownChange = ( data, fabricFieldId ) => {
        const updatedData = consumptionFabricDetails.map( i => {
            if ( fabricFieldId === i.fieldId ) {
                i.itemDescription = data?.label;
                i.itemDescriptionTemplate = data?.itemDescriptionTemplate;
                i.itemDescriptionValue = data;
            }
            return i;
        } );
        dispatch( bindConsumptionFabricDetails( updatedData ) );
    };

    const handleItemDescriptionOnFocus = ( itemGroupId, ItemSubGroupId, fabricFieldId ) => {
        const endPoint = `${merchandisingApi.costing.root}/fabricDetails/itemGroup/${itemGroupId}/itemSubGroup/${ItemSubGroupId}/itemDescriptionSuggestions`;
        baseAxios.get( endPoint ).then( response => {
            const updatedData = consumptionFabricDetails.map( i => {
                if ( fabricFieldId === i.fieldId ) {
                    i.itemDescriptionArray = response.data.map( i => ( {
                        label: i.itemDescription,
                        value: i.itemDescription,
                        itemDescriptionTemplate: i.itemDescriptionTemplate
                    } ) );
                }
                return i;
            } );
            dispatch( bindConsumptionFabricDetails( updatedData ) );
        } );

    };
    //For Fabric
    const handleDescriptionModalOpen = ( itemGroupId, consumptionFieldId ) => {
        setDescriptionModalObj( { itemGroupId, consumptionFieldId } );
        setOpenDescriptionModal( !openDescriptionModal );
    };


    return (
        <div>
            <ResizableTable
                mainClass="resizeFabs"
                tableId="fabricTableIds"
                className="pre-costing-details-table table-bordered"
                size="sm" responsive={true}
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
                        <th className='text-center'><strong>Status</strong></th>
                        <th className='text-center'><strong>Color Size</strong></th>
                        <th className='text-center'><strong>Is Approved?</strong></th>
                        <th className='text-center'><strong>Action</strong></th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {
                        consumptionFabricDetails.map( i => (
                            <tr key={i.fieldId}>
                                <td style={{ width: '105px' }}>
                                    <CreatableSelect
                                        id={`itemGroupId-${i.fieldId}`}
                                        name="itemGroupId"
                                        isClearable={false}
                                        isSearchable
                                        menuPosition={'fixed'}
                                        theme={selectThemeColors}
                                        options={dropDownItemGroups}
                                        classNamePrefix='select'
                                        // innerRef={register( { required: true } )}
                                        isOptionSelected
                                        className={classnames( 'costing-select ' )}
                                        value={i?.itemGroup}
                                        onChange={data => {
                                            handleItemGroupDropdownForFabric( data, i.fieldId );
                                        }}
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
                                        classNamePrefix='select'
                                        onFocus={() => { dispatch( getItemSubGroupForConsumptionFabric( i.fieldId, i.itemGroupId ) ); }}
                                        // innerRef={register( { required: true } )}
                                        className={classnames( 'costing-select' )}
                                        value={i.itemSubGroup}
                                        onChange={data => {
                                            handleItemSubGroupDropdownForFabric( data, i.fieldId );
                                        }}
                                    />
                                </td>
                                <td style={{ minWidth: '405px' }} >
                                    <div className="d-flex w-100">
                                        <Select
                                            options={i.itemDescriptionArray}
                                            value={i.itemDescriptionValue}
                                            isClearable
                                            menuPosition="fixed"
                                            className='react-select  w-100'
                                            classNamePrefix='select'
                                            // menuPlacement="top"
                                            onChange={( data ) => { handleItemDescriptionDropdownChange( data, i.fieldId ); }}
                                            onFocus={() => { handleItemDescriptionOnFocus( i?.itemGroupId, i?.itemSubGroupId, i.fieldId ); }}
                                        />
                                        <span >
                                            <Button.Ripple
                                                for="addItemDescriptionId"
                                                tag={Label}
                                                onClick={() => { handleDescriptionModalOpen( i?.itemGroupId, i.fieldId ); }}
                                                className='btn-icon p-0'
                                                color='' >
                                                <Plus size={28} id="addItemDescriptionId" />
                                            </Button.Ripple>
                                        </span>
                                    </div>
                                </td>
                                <td style={{ width: '405px' }} >
                                    <Input
                                        name="consumptionQuantity"
                                        type="number"
                                        placeholder="Consumption Qty"
                                        bsSize="sm"
                                        value={i.consumptionQuantity}
                                        onChange={( e ) => { handleOnChangeForFabric( e, i.fieldId ); }}
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
                                        options={consumptionUOMDropdown}
                                        classNamePrefix='select'
                                        className={classnames( 'costing-select' )}
                                        value={i.consumptionUomValue}
                                        onChange={data => {
                                            handleConsumptionUomDropdownForFabric( data, i.fieldId );
                                        }}
                                        onFocus={() => { handleUOMOnFocusAll( i?.itemGroupId ); }}
                                    />
                                </td>
                                <td >
                                    <Input
                                        name="wastagePercent"
                                        type="number"
                                        placeholder="Wastage Percent"
                                        bsSize="sm"
                                        value={i.wastagePercent}
                                        onChange={( e ) => { handleOnChangeForFabric( e, i.fieldId ); }}
                                    />
                                </td>
                                <td  >
                                    <Input
                                        name="consumptionPerGarment"
                                        type="number"
                                        placeholder="Consumption Per Garment"
                                        bsSize="sm"
                                        value={i.consumptionPerGarment}
                                        onChange={( e ) => { handleOnChangeForFabric( e, i.fieldId ); }}

                                    />
                                </td>
                                <td >
                                    <CreatableSelect
                                        id='consumptionPerGarmentUomId'
                                        name="consumptionPerGarmentUom"
                                        isSearchable
                                        menuPosition={'fixed'}
                                        theme={selectThemeColors}
                                        options={defaultUOMDropdown}
                                        classNamePrefix='select'
                                        className={classnames( 'costing-select' )}
                                        value={i.consumptionPerGarmentUomValue}
                                        onChange={data => {
                                            handleconsumptionPerGarmentUomDropdownForFabric( data, i.fieldId );
                                        }}
                                        onFocus={() => { handlePerGarmentUOMOnFocus( 11 ); }}
                                    />
                                </td>
                                <td >
                                    <CreatableSelect
                                        id='orderUOMId'
                                        name="orderUOM"
                                        isSearchable
                                        menuPosition={'fixed'}
                                        theme={selectThemeColors}
                                        options={orderMDropdown}
                                        classNamePrefix='select'
                                        className={classnames( 'costing-select' )}
                                        value={i.orderUOMValue}
                                        onChange={data => {
                                            handleOrderUomDropdownForFabric( data, i.fieldId );
                                        }}
                                        onFocus={() => { handleUOMOnFocusAll( i?.itemGroupId ); }}
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
                                        options={selectCurrency}
                                        classNamePrefix='select'
                                        className={classnames( 'costing-select' )}
                                        value={i.currencyValue}
                                        onChange={data => {
                                            handleCurrencyDropdownForFabric( data, i.fieldId );
                                        }}
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
                                        onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
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
                                        //   options={selectPurchaseType}
                                        classNamePrefix='select'
                                        className={classnames( 'costing-select' )}
                                        value={i.purchaseTypeValue}
                                        onChange={data => {
                                            handlePurchaseTypeDropdownForFabric( data, i.fieldId );
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
                                        //   options={selectSupplier}
                                        classNamePrefix='select'
                                        className={classnames( 'costing-select' )}
                                        value={i.preferredSupplierValue}
                                        onChange={data => {
                                            handlePreferredSupplierDropdownForFabric( data, i.fieldId );
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
                                            onChange={e => handleOnChangeForFabric( e, i.fieldId )}
                                        />
                                    </span>
                                </td>
                                <td style={{ width: '105px' }}>
                                    <CreatableSelect
                                        id='status'
                                        name="status"
                                        isClearable={false}
                                        isSearchable
                                        menuPosition={'fixed'}
                                        theme={selectThemeColors}
                                        options={selectStatus}
                                        classNamePrefix='select'
                                        className={classnames( 'costing-select' )}
                                        value={i.statusValue}
                                        onChange={data => {
                                            handleStatusDropdownForFabric( data, i.fieldId );
                                        }}
                                    />
                                </td>


                                <td style={{ width: '85px' }} >
                                    <Button.Ripple
                                        size="sm"
                                        for={`${i.fieldId}`}
                                        tag={Label}
                                        onClick={() => {
                                            dispatch( getConsumptionSizeColorSense(
                                                i.colorSensitivities,
                                                i.sizeSensitivities,
                                                consumptionBasicInfo?.styleId,
                                                i.itemGroupId,
                                                i.fieldId,
                                                i.colorSensitivityType,
                                                i.sizeSensitivityType
                                            ) ); setOpenModal( !openModal );
                                        }}
                                        className='btn-icon'
                                        color='flat-danger' >
                                        <Settings
                                            size={18}
                                            id={`${i.fieldId}`}
                                            color="purple"
                                        />
                                    </Button.Ripple>
                                </td>
                                <td style={{ width: '105px' }} >
                                    <span className="d-flex justify-content-center">
                                        <CustomInput
                                            id={`approvedId-${i.fieldId}`}
                                            name='isApproved'
                                            type='checkbox'
                                            checked={i.isApproved}
                                            onChange={e => handleOnChangeForFabric( e, i.fieldId )}
                                        />
                                    </span>
                                </td>
                                <td style={{ width: '85px' }} >
                                    <span>
                                        <Button.Ripple id="deleteFabId" tag={Label} onClick={() => { handleRemoveFabricRow( i.fieldId ); }} className='btn-icon' color='flat-danger' >
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
    );
};

export default ConsumptionFabricDetailsForm;

import { baseAxios } from '@services';
import React, { useEffect, useState } from 'react';
import { MinusSquare, Plus, PlusSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Button, CustomInput, Input, Label, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { inventoryApi } from '../../../../services/api-end-points/inventory';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import ResizableTable from '../../../../utility/custom/ResizableTable';
import { selectCurrency } from '../../../../utility/enums';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownItemGroups } from '../../../inventory/item-group/store/actions';
import { getDefaultUOMDropdownByUnitId, getOrderAndConsumptionUOMDropdown } from '../../../inventory/unit-sets/store/actions';
import { bindConsumptionAccessoriesDetails, bindConsumptionFabricDetails, getItemSubGroupForConsumptionAccessories } from '../store/actions';
import ConsumptionDescriptionGeneratorAccessories from './ConsumptionDescriptionGeneratorAccessories';
const selectStatus = [
    {
        value: 1,
        label: 'APPROVED'
    },
    {
        value: 2,
        label: 'PENDING'
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

const ConsumptionSetEditDetails = () => {
    const dispatch = useDispatch();
    const { replace, push } = useHistory();

    const {
        selectedConsumption,
        consumptionFabricDetails,
        consumptionAccessoriesDetails,
        consumptionDetailsSizeSens,
        consumptionDetailsColorSens
    } = useSelector( ( { consumptions } ) => consumptions );
    const { orderMDropdown, consumptionUOMDropdown } = useSelector( ( { unitSets } ) => unitSets );
    const { dropDownItemGroups } = useSelector( ( { itemGroups } ) => itemGroups );
    const [openModal, setOpenModal] = useState( false );
    const [openAccessoriesModal, setOpenAccessoriesModal] = useState( false );
    ///For Fabric Item Description Modal
    const [descriptionModalObj, setDescriptionModalObj] = useState( null );
    const [openDescriptionModal, setOpenDescriptionModal] = useState( false );
    ///For Fabric Item Description Modal
    const [descriptionModalObjForAccessories, setDescriptionModalObjForAccessories] = useState( null );
    const [openDescriptionModalForAccessories, setOpenDescriptionModalForAccessories] = useState( false );
    const { defaultUOMDropdown } = useSelector( ( { unitSets } ) => unitSets );
    const [active, setActive] = useState( '1' );

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


    const handleUOMOnFocusAll = ( itemId ) => {
        dispatch( getOrderAndConsumptionUOMDropdown( itemId ) );
    };


    const handleRemoveAccessoriesRow = ( fieldId ) => {
        const updatedData = [...consumptionAccessoriesDetails];
        updatedData.splice(
            updatedData.findIndex( x => x.fieldId === fieldId ),
            1
        );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };

    const handleAddAccessoriesRow = () => {
        const newRow =
        {
            fieldId: randomIdGenerator(),
            detailId: 0,
            costingGroupType: 1,
            consumptionId: '',
            itemGroup: null, //Extra
            itemGroupId: 0,
            itemSubGroup: null, //Extra
            itemSubGroupArray: [], //Extra
            itemSubGroupId: 0,
            itemDescription: '',
            itemDescriptionArray: [],
            itemDescriptionValue: null,
            itemDescriptionTemplate: '',
            consumptionQuantity: 0,
            consumptionUomValue: null, // Extra
            consumptionUom: '',
            wastagePercent: 0,
            consumptionPerGarment: 0,
            consumptionPerGarmentUomValue: null, // Extra
            consumptionPerGarmentUom: '',
            consumptionPerGarmentRelativeFactor: 0,
            consumptionUomRelativeFactor: 0,
            orderUOMValue: null, ///Extra
            orderUOM: '',
            currencyValue: null, //Extra
            currencyCode: '',
            ratePerUnit: 0,
            purchaseTypeValue: null, //Extra
            purchaseType: '',
            buyerSupplied: false,
            preferredSupplierValue: null,
            preferredSupplier: '',
            remarks: '',
            statusValue: null,
            status: '',
            colorSensitivityType: 3,
            sizeSensitivityType: 3,
            isApproved: false,
            colorSensitivities: null,
            sizeSensitivities: null
        };
        dispatch( bindConsumptionAccessoriesDetails( [...consumptionAccessoriesDetails, newRow] ) );

    };

    ///For Accessories Input OnChange
    const handleItemGroupDropdownForAccessories = async ( newValue, fieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemGroup = newValue;
                i.itemSubGroupArray = newValue.sub;
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
    const handleOnChangeForAccessories = ( e, fieldId ) => {
        const { name, value, type, checked } = e.target;
        const updatedData = consumptionAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i[name] = type === 'number' ? Number( value ) : type === 'checkbox' ? checked : value;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
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
    const handleconsumptionPerGarmentUomDropdownForAccessories = ( newValue, fieldId ) => {
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
        const updatedData = consumptionAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.orderUOMValue = newValue; // Extra
                i.orderUOM = newValue?.label;
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

    const handleStatusDropdownForAccessories = ( newValue, fieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.statusValue = newValue; // Extra
                i.status = newValue?.label;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
    };

    const toggle = tab => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };


    //For Accessories
    const handleDescriptionModalOpenForAccessories = ( itemGroupId, consumptionFieldIdForAccessories ) => {
        setDescriptionModalObjForAccessories( { itemGroupId, consumptionFieldIdForAccessories } );
        setOpenDescriptionModalForAccessories( !openDescriptionModalForAccessories );
    };

    ///For Accessories
    const handleItemDescriptionDropdownChangeForAccessories = ( data, fabricFieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( i => {
            if ( fabricFieldId === i.fieldId ) {
                i.itemDescription = data?.label;
                i.itemDescriptionTemplate = data?.itemDescriptionTemplate;
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

    const handleCancel = () => {
        replace( '/consumptions' );
    };

    return (
        <div>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        active={active === '2'}
                        onClick={() => {
                            toggle( '1' );
                        }}
                    >
                        Accessories
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={active} style={{ backgroundColor: 'white', border: 'solid #dddddd 1px' }}>
                <TabPane tabId='1' >
                    <div >
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
                                    <th className='text-center'><strong>Is Approved?</strong></th>
                                    <th className='text-center'><strong>Action</strong></th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {
                                    consumptionAccessoriesDetails.map( i => (
                                        <tr key={i.fieldId}>
                                            <td style={{ minWidth: '205px' }}>
                                                <CreatableSelect
                                                    id={`itemGroupId-${i.fieldId}`}
                                                    name="itemGroupId"
                                                    isClearable={false}
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    theme={selectThemeColors}
                                                    options={dropDownItemGroups}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    value={i?.itemGroup}
                                                    onChange={data => {
                                                        handleItemGroupDropdownForAccessories( data, i.fieldId );
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
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    onFocus={() => { dispatch( getItemSubGroupForConsumptionAccessories( i.fieldId, i.itemGroupId ) ); }}
                                                    value={i.itemSubGroup}
                                                    onChange={data => {
                                                        handleItemSubGroupDropdownForAccessories( data, i.fieldId );
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
                                                        classNamePrefix='dropdown'
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
                                                    value={i.consumptionQuantity}
                                                    bsSize="sm"
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
                                                    options={consumptionUOMDropdown}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    value={i.consumptionUomValue}
                                                    onChange={data => {
                                                        handleConsumptionUomDropdownForAccessories( data, i.fieldId );
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
                                                    onChange={( e ) => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                                />
                                            </td>
                                            <td  >
                                                <Input
                                                    name="consumptionPerGarment"
                                                    type="number"
                                                    placeholder="Consumption Per Garment"
                                                    bsSize="sm"
                                                    value={i.consumptionPerGarment}
                                                    onChange={( e ) => { handleOnChangeForAccessories( e, i.fieldId ); }}

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
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    value={i.consumptionPerGarmentUomValue}
                                                    onChange={data => {
                                                        handleconsumptionPerGarmentUomDropdownForAccessories( data, i.fieldId );
                                                    }}
                                                    onFocus={() => { handlePerGarmentUOMOnFocus( 11 ); }}
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
                                                    options={orderMDropdown}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    value={i.orderUOMValue}
                                                    onChange={data => {
                                                        handleOrderUomDropdownForAccessories( data, i.fieldId );
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
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    value={i.currencyValue}
                                                    onChange={data => {
                                                        handleCurrencyDropdownForAccessories( data, i.fieldId );
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
                                                    classNamePrefix='dropdown'
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
                                                    classNamePrefix='dropdown'
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
                                            {/* <td style={{ width: '105px' }}>
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
                                                        handleStatusDropdownForAccessories( data, i.fieldId );
                                                    }}
                                                />
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
                                                    <Button.Ripple
                                                        id="deleteFabId"
                                                        tag={Label}
                                                        disabled={( consumptionAccessoriesDetails.length === 1 )}
                                                        onClick={() => { handleRemoveAccessoriesRow( i.fieldId ); }}
                                                        className='btn-icon p-0'
                                                        color='flat-danger'
                                                    >
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
                        onClick={() => { handleAddAccessoriesRow(); }}
                        className='btn-icon p-0'
                        color='flat-success'
                    >
                        <PlusSquare id="addAccId" color="green" />
                    </Button.Ripple>

                    {
                        ( descriptionModalObjForAccessories && openDescriptionModalForAccessories ) &&
                        <ConsumptionDescriptionGeneratorAccessories
                            descriptionModalObj={descriptionModalObjForAccessories}
                            openModal={openDescriptionModalForAccessories}
                            setOpenModal={setOpenDescriptionModalForAccessories}
                        />
                    }

                </TabPane>

            </TabContent>

        </div>
    );
};

export default ConsumptionSetEditDetails;

import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import { baseAxios } from "@services";
import React, { useEffect, useState } from 'react';
import { MinusSquare, PlusSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Button, Input, Label } from 'reactstrap';
import { inventoryApi } from '../../../../services/api-end-points/inventory';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import ResizableTable from "../../../../utility/custom/ResizableTable";
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownPackItemGroupsByGroupName, getSubGroupDropdownByItemId } from '../../../inventory/item-group/store/actions';
import { bindSetPackagingAccessoriesDetails } from '../store/action';
import SetPackagingItemDescriptionGenerator from './SetPackagingItemDescriptionGenerator';

const SetPackagingAccessoriesDetails = () => {
    const dispatch = useDispatch();
    const { setPackagingAccessoriesDetails } = useSelector( ( { packaging } ) => packaging );
    const { dropDownPackItemGroups } = useSelector( ( { itemGroups } ) => itemGroups );
    const [descriptionModalObj, setDescriptionModalObj] = useState( null );
    const [openDescriptionModal, setOpenDescriptionModal] = useState( false );


    useEffect( () => {
        dispatch( bindSetPackagingAccessoriesDetails( [
            {
                fieldId: randomIdGenerator(),
                rowNo: 1,
                itemGroup: null,
                itemGroupId: 0,
                itemSubGroup: null,
                itemSubGroupId: 0,
                itemSubGroupArray: [],
                itemDescriptionArray: [],
                itemDescriptionValue: null,
                itemDescription: '',
                itemDescriptionTemplate: '',
                defaultUomSetId: null,
                consumptionUomArray: [],
                consumptionUom: null,
                wastagePercent: 0,
                consumptionQuantity: 0,
                consumptionRatePerUnit: 0,
                inHouseQuantity: 0,
                inHouseRatePerUnit: 0,
                inHouseCost: 0,
                totalCost: 0
            }
        ]
        ) );
    }, [dispatch, !setPackagingAccessoriesDetails.length] );

    useEffect( () => {
        dispatch( getDropDownPackItemGroupsByGroupName( "Packaging%20and%20Labeling" ) );
    }, [] );

    const handleAddRowAccessories = ( totalIndexNo ) => {
        const newObj = {
            fieldId: randomIdGenerator(),
            rowNo: totalIndexNo + 1,
            itemGroup: null,
            itemGroupId: 0,
            itemSubGroup: null,
            itemSubGroupId: 0,
            itemSubGroupArray: [],
            itemDescriptionArray: [],
            itemDescriptionValue: null,
            itemDescription: '',
            itemDescriptionTemplate: '',
            defaultUomSetId: null,
            consumptionUomArray: [],
            consumptionUom: null,
            wastagePercent: 0,
            consumptionQuantity: 0,
            consumptionRatePerUnit: 0,
            inHouseQuantity: 0,
            inHouseRatePerUnit: 0,
            inHouseCost: 0,
            totalCost: 0
        };
        dispatch( bindSetPackagingAccessoriesDetails( [...setPackagingAccessoriesDetails, newObj] ) );
    };

    const handleDescriptionModalOpen = ( itemGroupId, costingFieldId ) => {
        setDescriptionModalObj( { itemGroupId, costingFieldId } );
        setOpenDescriptionModal( !openDescriptionModal );
    };

    const handleRemoveAccessoriesDetailsRow = ( fieldId ) => {
        const updatedData = setPackagingAccessoriesDetails?.filter( s => s.fieldId !== fieldId );
        dispatch( bindSetPackagingAccessoriesDetails( updatedData ) );
    };


    const handleItemGroupDropdown = ( data, fieldId ) => {
        console.log( data );
        const updatedData = setPackagingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemGroup = data;
                i.itemGroupId = data?.value;
                i.itemSubGroup = null;
                i.itemSubGroupId = 0;
                i.itemSubGroupArray = null;
                i.consumptionUomArray = [];
                i.consumptionUom = {
                    value: data?.consumptionUomId,
                    label: data?.consumptionUom
                };
                i.defaultUomSetId = data?.defaultUomSetId;
            }
            return i;
        } );
        dispatch( bindSetPackagingAccessoriesDetails( updatedData ) );
        dispatch( getSubGroupDropdownByItemId( null ) );
    };

    const handleItemSubGroupDropdown = ( data, fieldId ) => {
        const updatedData = setPackagingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemSubGroup = data;
                i.itemSubGroupId = data?.value;
            }
            return i;
        } );
        dispatch( bindSetPackagingAccessoriesDetails( updatedData ) );
    };

    const handleItemDescriptionOnFocus = ( itemGroupId, itemSubGroupId, fieldId ) => {
        const endPoint = `${merchandisingApi.costing.root}/fabricDetails/itemGroup/${itemGroupId}/itemSubGroup/${itemSubGroupId}/itemDescriptionSuggestions`;
        baseAxios.get( endPoint ).then( response => {
            console.log( response );
            const updatedData = setPackagingAccessoriesDetails.map( i => {
                if ( fieldId === i.fieldId ) {
                    i.itemDescriptionArray = response.data.map( i => ( {
                        label: i.itemDescription,
                        value: i.itemDescription,
                        itemDescriptionTemplate: i.itemDescriptionTemplate
                    } ) );
                }
                return i;
            } );
            dispatch( bindSetPackagingAccessoriesDetails( updatedData ) );
        } );
    };

    const handleItemDescriptionDropdown = ( data, fieldId ) => {
        const updatedData = setPackagingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemDescriptionValue = data;
                i.itemDescription = data?.value;
                i.itemDescriptionTemplate = data?.itemDescriptionTemplate;
            }
            return i;
        } );
        dispatch( bindSetPackagingAccessoriesDetails( updatedData ) );
    };

    const handleItemSubGroupOnFocus = ( itemGroupId, fieldId ) => {
        const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/subCategories`;
        baseAxios.get( endPoint ).then( response => {
            const updatedData = setPackagingAccessoriesDetails.map( cad => {
                if ( fieldId === cad.fieldId ) {
                    cad.itemSubGroupArray = response?.data?.map( rd => ( {
                        value: rd.id,
                        label: rd.name
                    } ) );
                }
                return cad;
            } );
            dispatch( bindSetPackagingAccessoriesDetails( updatedData ) );
        } );
    };


    const handleConsumptionUOMOnFocus = ( defaultUomSetId, uomArray, fieldId ) => {
        console.log( defaultUomSetId );
        console.log( defaultUomSetId );
        if ( !uomArray.length && defaultUomSetId ) {
            baseAxios.get( `${inventoryApi.unitSet.root}/${defaultUomSetId}` )
                .then( response => {
                    const consumptionUomArray = response?.data?.details?.map( uom => ( {
                        value: uom.id,
                        label: uom.unitName
                    } ) );
                    const updatedData = setPackagingAccessoriesDetails.map( i => {
                        if ( fieldId === i.fieldId ) {
                            i.consumptionUomArray = consumptionUomArray;
                        }
                        return i;
                    } );
                    dispatch( bindSetPackagingAccessoriesDetails( updatedData ) );
                } );
        }
    };

    //For  Unit Change
    const handleConsumptionUOMChange = ( newValue, fieldId ) => {
        const updatedData = setPackagingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.consumptionUom = newValue;
            }
            return i;
        } );
        dispatch( bindSetPackagingAccessoriesDetails( updatedData ) );
    };

    const handleOnChangeForAccessories = ( e, fieldId ) => {
        const { name, value, type } = e.target;
        const updatedData = setPackagingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i[name] = type === 'number' ? Number( value ) : value;
            }
            return i;
        } );
        dispatch( bindSetPackagingAccessoriesDetails( updatedData ) );

    };

    return (
        <div>
            <div>
                <div >
                    <ResizableTable
                        mainClass="resizeAccess"
                        tableId="accessTable"
                        className="pre-costing-details-table table-bordered"
                        size="sm"
                        responsive={true}
                    >
                        <thead className='thead-light' >
                            <tr >
                                <th style={{ width: '4px' }} className='text-center'><strong>SL</strong></th>
                                <th style={{ minWidth: '180px' }} className=' text-center'><strong>Item Group</strong></th>
                                <th style={{ minWidth: '180px' }} className='text-center'><strong>Item Sub</strong></th>
                                <th className='text-center'><strong>Item Description</strong></th>
                                <th className='text-center'><strong>Cons. UOM</strong></th>
                                <th className='text-center'><strong>Process Loss(%)</strong></th>
                                <th className='text-center'><strong>Cons(Qty.)</strong></th>
                                <th className='text-center'><strong>Cost Per Unit</strong></th>
                                <th ><strong>In-House Cons.(Qty.)</strong></th>
                                <th ><strong>In-House Rate Per Unit</strong></th>
                                <th ><strong>In-House Cost Per Unit</strong></th>
                                <th className='text-center'><strong>Action</strong></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {
                                setPackagingAccessoriesDetails?.map( ( acc, index ) => (
                                    <tr key={acc.fieldId} >
                                        <td style={{ width: '4px' }} >{index + 1}</td>
                                        <td style={{ width: '105px' }} >
                                            <CreatableSelect
                                                id='itemGroupId'
                                                pageSize={4}
                                                isClearable={false}
                                                isSearchable
                                                menuPosition={'fixed'}
                                                theme={selectThemeColors}
                                                options={dropDownPackItemGroups}
                                                classNamePrefix='dropdown'
                                                className='erp-dropdown-select'
                                                value={acc.itemGroup}
                                                onChange={data => {
                                                    handleItemGroupDropdown( data, acc.fieldId );
                                                }}
                                            />
                                        </td>
                                        <td style={{ width: '105px' }} >
                                            <CreatableSelect
                                                id='itemSubGroupId'
                                                isClearable
                                                isLoading={!acc.itemSubGroupArray}
                                                isSearchable
                                                menuPosition={'fixed'}
                                                theme={selectThemeColors}
                                                options={acc?.itemSubGroupArray}
                                                classNamePrefix='dropdown'
                                                className='erp-dropdown-select'
                                                value={acc.itemSubGroup}
                                                onFocus={() => { handleItemSubGroupOnFocus( acc?.itemGroupId, acc.fieldId ); }}
                                                onChange={data => {
                                                    handleItemSubGroupDropdown( data, acc.fieldId );
                                                }}
                                            />
                                        </td>
                                        <td style={{ minWidth: '405px' }} >
                                            <div className="d-flex w-100  align-items-center">
                                                {/* <CreatableSelect
                                                    id={`itemSubGroup-${acc.fieldId}`}
                                                    isClearable
                                                    isSearchable
                                                    isLoading={!dropdownItemDescription.length}
                                                    menuPosition="fixed"
                                                    theme={selectThemeColors}
                                                    options={dropdownItemDescription}
                                                    classNamePrefix='dropdown'
                                                    className="erp-dropdown-select"
                                                    value={acc?.itemDescriptionValue}
                                                    onFocus={() => { handleItemDescriptionOnFocus( acc.itemGroupId, acc.itemSubGroupId, acc.fieldId ); }}
                                                    onChange={data => {
                                                        handleItemDescriptionDropdown( data, acc.fieldId );
                                                    }}
                                                /> */}
                                                <Select
                                                    options={acc.itemDescriptionArray}
                                                    value={acc.itemDescriptionValue}
                                                    isClearable
                                                    menuPosition="fixed"
                                                    classNamePrefix='dropdown'
                                                    className='erp-dropdown-select w-100'
                                                    // menuPlacement="top"
                                                    onFocus={() => { handleItemDescriptionOnFocus( acc.itemGroupId, acc.itemSubGroupId, acc.fieldId ); }}
                                                    onChange={data => {
                                                        handleItemDescriptionDropdown( data, acc.fieldId );
                                                    }}
                                                />
                                                <span >
                                                    <Button.Ripple
                                                        for="addItemDescriptionId"
                                                        tag={Label}
                                                        onClick={() => { handleDescriptionModalOpen( acc?.itemGroupId, acc.fieldId ); }}
                                                        className='btn-icon p-0'
                                                        color='flat-success' >
                                                        <PlusSquare size={25} color='green' id="addItemDescriptionId" />
                                                    </Button.Ripple>
                                                </span>
                                            </div>
                                        </td>

                                        <td style={{ width: '105px' }} >
                                            <CreatableSelect
                                                id='consumptionUnitId'
                                                isClearable
                                                isLoading={!acc.consumptionUomArray.length}
                                                isSearchable
                                                menuPosition="fixed"
                                                theme={selectThemeColors}
                                                options={acc.consumptionUomArray}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"
                                                value={acc?.consumptionUom}

                                                onFocus={() => {
                                                    handleConsumptionUOMOnFocus(
                                                        dropDownPackItemGroups?.find( item => item.value === acc.itemGroupId )?.defaultUomSetId, acc.consumptionUomArray, acc.fieldId );
                                                }}
                                                onChange={data => {
                                                    handleConsumptionUOMChange( data, acc.fieldId );
                                                }}
                                            />
                                        </td>

                                        <td style={{ width: '105px' }} >
                                            <Input
                                                id={`wastagePercent-${acc.fieldId}`}
                                                className="text-right"
                                                bsSize="sm"
                                                type='number'
                                                name="wastagePercent"
                                                value={acc.wastagePercent}
                                                placeholder="0"
                                                onChange={e => { handleOnChangeForAccessories( e, acc.fieldId ); }}
                                                onFocus={e => { e.target.select(); }}
                                            />
                                        </td>
                                        <td style={{ width: '105px' }}>
                                            <Input
                                                id={`consumptionQuantity-${acc.fieldId}`}
                                                className="text-right"
                                                bsSize="sm"
                                                type='number'
                                                name="consumptionQuantity"
                                                value={acc.consumptionQuantity}
                                                placeholder="0"
                                                onChange={e => { handleOnChangeForAccessories( e, acc.fieldId ); }}
                                                onFocus={e => { e.target.select(); }}
                                            />
                                        </td>
                                        <td style={{ width: '105px' }} >
                                            <Input
                                                id={`consumptionRatePerUnit-${acc.fieldId}`}
                                                className="text-right"
                                                bsSize="sm"
                                                type='number'
                                                name="consumptionRatePerUnit"
                                                value={acc.consumptionRatePerUnit}
                                                placeholder="0"
                                                onChange={e => { handleOnChangeForAccessories( e, acc.fieldId ); }}
                                                onFocus={e => { e.target.select(); }}
                                            />
                                        </td>
                                        <td style={{ width: '105px' }}>
                                            <Input
                                                id={`inHouseQuantity-${acc.fieldId}`}
                                                className="text-right"
                                                bsSize="sm"
                                                type='number'
                                                name="inHouseQuantity"
                                                value={acc.inHouseQuantity}
                                                placeholder="0"
                                                onChange={e => { handleOnChangeForAccessories( e, acc.fieldId ); }}
                                                onFocus={e => { e.target.select(); }}
                                            />
                                        </td>
                                        <td style={{ width: '105px' }} >
                                            <Input
                                                id={`inHouseRatePerUnit-${acc.fieldId}`}
                                                className="text-right"
                                                bsSize="sm"
                                                type='number'
                                                name="inHouseRatePerUnit"
                                                value={acc.inHouseRatePerUnit}
                                                placeholder="0"
                                                onChange={e => { handleOnChangeForAccessories( e, acc.fieldId ); }}
                                                onFocus={e => { e.target.select(); }}
                                            />
                                        </td>
                                        <td style={{ width: '105px' }} >
                                            <Input
                                                id={`inHouseCost-${acc.fieldId}`}
                                                className="text-right"
                                                bsSize="sm"
                                                type='number'
                                                name="inHouseCost"
                                                disabled
                                                value={acc.inHouseQuantity * acc.inHouseRatePerUnit}
                                                placeholder="0"
                                                onChange={e => { handleOnChangeForAccessories( e, acc.fieldId ); }}
                                                onFocus={e => { e.target.select(); }}
                                            />
                                        </td>
                                        <td style={{ width: '85px' }} >
                                            <span>
                                                <Button.Ripple id="deleteAccId" tag={Label} disabled={( setPackagingAccessoriesDetails.length === 1 )} onClick={() => { handleRemoveAccessoriesDetailsRow( acc.fieldId ); }} className='btn-icon p-0' color='flat-danger' >
                                                    <MinusSquare size={18} id="deleteAccId" color="red" />
                                                </Button.Ripple>
                                            </span>
                                        </td>
                                    </tr>
                                ) )
                            }

                        </tbody>
                    </ResizableTable>

                </div>
            </div>
            {
                ( descriptionModalObj && openDescriptionModal ) &&
                <SetPackagingItemDescriptionGenerator
                    descriptionModalObj={descriptionModalObj}
                    openModal={openDescriptionModal}
                    setOpenModal={setOpenDescriptionModal}
                />
            }
            <div>
                <Button.Ripple
                    id="adPackAccId"
                    tag={Label}
                    onClick={() => { handleAddRowAccessories( setPackagingAccessoriesDetails.length ); }}
                    className='btn-icon'
                    color='flat-success'
                >
                    <PlusSquare size={16} id="adPackAccId" color="green" />
                </Button.Ripple>
            </div>

        </div>
    );
};

export default SetPackagingAccessoriesDetails;

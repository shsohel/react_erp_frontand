import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import { baseAxios } from "@services";
import React, { useEffect, useState } from 'react';
import { Edit3, MinusSquare, PlusSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Input, Label } from 'reactstrap';
import { inventoryApi } from '../../../../services/api-end-points/inventory';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import { notify } from '../../../../utility/custom/notifications';
import ResizableTable from "../../../../utility/custom/ResizableTable";
import { status } from '../../../../utility/enums';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownPackItemGroupsByGroupName, getItemSegmentArrayByItemGroupId, getSubGroupDropdownByItemId } from '../../../inventory/item-group/store/actions';
import { bindPackagingAccessoriesDetails } from '../store/action';
import PackagingItemDescriptionGenerator from './PackagingItemDescriptionGenerator';

const SinglePackagingAccessoriesDetails = () => {
    const dispatch = useDispatch();
    const { singlePackagingAccessoriesDetails } = useSelector( ( { packaging } ) => packaging );
    const { dropDownPackItemGroups } = useSelector( ( { itemGroups } ) => itemGroups );
    const [descriptionModalObj, setDescriptionModalObj] = useState( null );
    const [openDescriptionModal, setOpenDescriptionModal] = useState( false );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    useEffect( () => {
        dispatch( bindPackagingAccessoriesDetails( [
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
    }, [dispatch, !singlePackagingAccessoriesDetails.length] );


    const handleOnFocusItemGroup = () => {
        dispatch( getDropDownPackItemGroupsByGroupName( "Packaging%20and%20Labeling" ) );
    };

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
        dispatch( bindPackagingAccessoriesDetails( [...singlePackagingAccessoriesDetails, newObj] ) );
    };

    // const handleDescriptionModalOpen = ( itemGroupId, costingFieldId ) => {
    //     setDescriptionModalObj( { itemGroupId, costingFieldId } );
    //     setOpenDescriptionModal( !openDescriptionModal );
    // };

    const handleDescriptionModalOpen = ( itemGroup, itemSubGroup, itemDescriptionTemplate, fieldId ) => {
        console.log( itemDescriptionTemplate );
        if ( itemGroup?.value ) {
            setDescriptionModalObj( {
                itemGroupId: itemGroup?.value,
                fieldId,
                itemDescriptionTemplate,
                itemGroup: itemGroup?.label,
                itemSubGroup: itemSubGroup?.label
            } );
            setOpenDescriptionModal( !openDescriptionModal );
            dispatch( getItemSegmentArrayByItemGroupId( itemGroup?.value, itemDescriptionTemplate ) );

        } else {
            notify( 'warning', 'Please select a item group!!!' );
        }
    };

    const handleRemoveAccessoriesDetailsRow = ( fieldId ) => {
        const updatedData = singlePackagingAccessoriesDetails?.filter( s => s.fieldId !== fieldId );
        dispatch( bindPackagingAccessoriesDetails( updatedData ) );
    };


    const handleItemGroupDropdown = ( data, fieldId ) => {
        const updatedData = singlePackagingAccessoriesDetails.map( i => {
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
        dispatch( bindPackagingAccessoriesDetails( updatedData ) );
        dispatch( getSubGroupDropdownByItemId( null ) );
    };
    const handleItemSubGroupDropdown = ( data, fieldId ) => {
        const updatedData = singlePackagingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemSubGroup = data;
                i.itemSubGroupId = data?.value;
            }
            return i;
        } );
        dispatch( bindPackagingAccessoriesDetails( updatedData ) );
    };

    const handleItemDescriptionOnFocus = ( itemGroupId, itemSubGroupId, fieldId ) => {
        const endPoint = `${merchandisingApi.packaging.root}/itemCategories/${itemGroupId}/itemSubCategories/${itemSubGroupId}/itemDescriptions`;
        baseAxios.get( endPoint ).then( response => {
            const updatedData = singlePackagingAccessoriesDetails.map( i => {
                if ( fieldId === i.fieldId ) {
                    i.itemDescriptionArray = response.data.map( i => ( {
                        label: i.itemDescription,
                        value: i.itemDescription,
                        itemDescriptionTemplate: i.itemDescriptionTemplate
                    } ) );
                }
                return i;
            } );
            dispatch( bindPackagingAccessoriesDetails( updatedData ) );
        } );
    };

    const handleItemDescriptionDropdown = ( data, fieldId ) => {
        const updatedData = singlePackagingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemDescriptionValue = data;
                i.itemDescription = data?.value;
                i.itemDescriptionTemplate = data?.itemDescriptionTemplate;
            }
            return i;
        } );
        dispatch( bindPackagingAccessoriesDetails( updatedData ) );
    };
    const handleItemSubGroupOnFocus = ( itemGroupId, fieldId ) => {
        const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/subCategories`;
        baseAxios.get( endPoint ).then( response => {
            if ( response.status === status.success ) {
                const itemSubGroupArray = response?.data?.map( rd => ( {
                    value: rd.id,
                    label: rd.name
                } ) );

                const updatedData = singlePackagingAccessoriesDetails.map( cad => {
                    if ( fieldId === cad.fieldId ) {
                        cad["itemSubGroupArray"] = itemSubGroupArray;
                    }
                    return cad;
                } );
                dispatch( bindPackagingAccessoriesDetails( updatedData ) );
            }


        } );
    };


    const handleConsumptionUOMOnFocus = ( defaultUomSetId, uomArray, fieldId ) => {
        if ( !uomArray.length && defaultUomSetId ) {
            baseAxios.get( `${inventoryApi.unitSet.root}/${defaultUomSetId}` )
                .then( response => {
                    const consumptionUomArray = response?.data?.details?.map( uom => ( {
                        value: uom.id,
                        label: uom.unitName
                    } ) );
                    const updatedData = singlePackagingAccessoriesDetails.map( i => {
                        if ( fieldId === i.fieldId ) {
                            i.consumptionUomArray = consumptionUomArray;
                        }
                        return i;
                    } );
                    dispatch( bindPackagingAccessoriesDetails( updatedData ) );
                } );
        }
    };
    //For  Unit Change
    const handleConsumptionUOMChange = ( newValue, fieldId ) => {
        const updatedData = singlePackagingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.consumptionUom = newValue;
            }
            return i;
        } );
        dispatch( bindPackagingAccessoriesDetails( updatedData ) );
    };
    const handleOnChangeForAccessories = ( e, fieldId ) => {
        const { name, value, type } = e.target;
        const updatedData = singlePackagingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i[name] = type === 'number' ? Number( value ) : value;
            }
            return i;
        } );
        dispatch( bindPackagingAccessoriesDetails( updatedData ) );

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
                                <th className='text-center'><strong>Rate Per Unit</strong></th>
                                <th ><strong>In-House Cons.(Qty.)</strong></th>
                                <th ><strong>In-House Rate Per Unit</strong></th>
                                <th ><strong>In-House Cost</strong></th>
                                <th className='text-center'><strong>Action</strong></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {
                                singlePackagingAccessoriesDetails?.map( ( acc, index ) => (
                                    <tr key={acc.fieldId} >
                                        <td style={{ width: '4px' }} >{index + 1}</td>
                                        <td style={{ width: '105px' }} >
                                            <Select
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
                                                onFocus={() => { handleOnFocusItemGroup(); }}
                                            />
                                        </td>
                                        <td style={{ width: '105px' }} >
                                            <Select
                                                id='itemSubGroupId'
                                                isClearable
                                                isLoading={!acc.itemSubGroupArray}
                                                isSearchable
                                                menuPosition={'fixed'}
                                                theme={selectThemeColors}
                                                options={acc?.itemSubGroupArray ?? []}
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
                                                <span className='description-btn' >
                                                    <Button.Ripple
                                                        htmlFor="addItemDescriptionId"
                                                        outline
                                                        onClick={() => { handleDescriptionModalOpen( acc?.itemGroup, acc.itemSubGroup, acc?.itemDescriptionTemplate, acc.fieldId ); }}
                                                        className='btn-icon '
                                                        size="sm"
                                                        color='primary' >
                                                        <Edit3 size={16} color='#7367f0' id="addItemDescriptionId" />
                                                    </Button.Ripple>
                                                </span>
                                            </div>
                                        </td>

                                        <td style={{ width: '105px' }} >
                                            <Select
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
                                                <Button.Ripple id="deleteAccId" tag={Label} disabled={( singlePackagingAccessoriesDetails.length === 1 )} onClick={() => { handleRemoveAccessoriesDetailsRow( acc.fieldId ); }} className='btn-icon p-0' color='flat-danger' >
                                                    <MinusSquare size={18} id="deleteAccId" color="red" />
                                                </Button.Ripple>
                                            </span>
                                        </td>
                                    </tr>
                                ) )
                            }

                        </tbody>
                    </ResizableTable>

                    {/* <Button.Ripple id="addAccId" tag={Label} onClick={() => { handleAddAccessoriesRow( singlePackagingAccessoriesDetails.length ); }} className='btn-icon' color='flat-success' >
                        <PlusSquare id="addAccId" color="green" />
                    </Button.Ripple> */}
                </div>
            </div>
            {
                ( descriptionModalObj && openDescriptionModal ) &&
                <PackagingItemDescriptionGenerator
                    descriptionModalObj={descriptionModalObj}
                    openModal={openDescriptionModal}
                    setOpenModal={setOpenDescriptionModal}
                />
            }
            <div>
                <Button.Ripple
                    id="adPackAccId"
                    tag={Label}
                    onClick={() => { handleAddRowAccessories( singlePackagingAccessoriesDetails.length ); }}
                    className='btn-icon'
                    color='flat-success'
                >
                    <PlusSquare size={16} id="adPackAccId" color="green" />
                </Button.Ripple>
            </div>

        </div>
    );
};

export default SinglePackagingAccessoriesDetails;

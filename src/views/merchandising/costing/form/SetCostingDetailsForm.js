
import '@custom-styles/merchandising/others/pre-costing-collapse.scss';
import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import '@custom-styles/merchandising/select/pre-costing-select.scss';
import { baseAxios } from "@services";
import { inventoryApi } from '@services/api-end-points/inventory';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { MinusSquare, PlusSquare } from 'react-feather';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { Button, Input, Label } from 'reactstrap';
import ResizableTable from '../../../../utility/custom/ResizableTable';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownTrimItemGroupsByGroupName } from '../../../inventory/item-group/store/actions';
import { getOrderAndConsumptionUOMDropdown } from '../../../inventory/unit-sets/store/actions';
import { bindCostingAccessoriesDetails } from '../store/action';

const SetCostingDetailsForm = () => {
    const dispatch = useDispatch();
    //for Table
    const { dropDownTrimItemGroups } = useSelector( ( { itemGroups } ) => itemGroups );
    const { costingAccessoriesDetails } = useSelector( ( { costings } ) => costings );
    const { orderMDropdown, consumptionUOMDropdown } = useSelector( ( { unitSets } ) => unitSets );

    const [active, setActive] = useState( '1' );

    //Start For Tab and Collapsible
    const toggle = tab => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };
    //End For Tab and Collapsible
    useEffect( () => {
        dispatch( getDropDownTrimItemGroupsByGroupName( "TRIM" ) );
    }, [] );


    useEffect( () => {
        dispatch( bindCostingAccessoriesDetails( [
            {
                fieldId: randomIdGenerator(),
                itemGroup: null,
                itemGroupId: 0,
                itemSubGroup: null,
                itemSubGroupId: 0,
                itemSubGroupArray: null,
                uom: null,
                unitName: '',
                defaultUomSetId: null,
                consumptionUOMArray: [],
                consumptionUOM: null,
                consumptionUOMName: '',
                wastagePercent: 0,
                consumptionQuantity: 0,
                consumptionRatePerUnit: 0,
                costPerUnit: 0,
                inHouseConsumption: 0,
                inHouseRatePerUnit: '',
                inHouseQuantity: 0,
                totalCost: 0
            }
        ] ) );
    }, [dispatch, !costingAccessoriesDetails.length] );


    const handleAddAccessoriesRow = () => {
        const newRow = {
            fieldId: randomIdGenerator(),
            itemGroup: null,
            itemGroupId: 0,
            itemSubGroup: null,
            itemSubGroupId: 0,
            itemSubGroupArray: null,
            uom: null,
            unitName: '',
            defaultUomSetId: null,
            consumptionUOMArray: [],
            consumptionUOM: null,
            consumptionUOMName: '',
            wastagePercent: 0,
            consumptionQuantity: 0,
            consumptionRatePerUnit: 0,
            costPerUnit: 0,
            inHouseConsumption: 0,
            inHouseRatePerUnit: '',
            inHouseQuantity: 0,
            totalCost: 0
        };
        dispatch( bindCostingAccessoriesDetails( [...costingAccessoriesDetails, newRow] ) );
    };
    const handleRemoveAccessoriesRow = ( fieldId ) => {
        const updatedData = [...costingAccessoriesDetails];
        updatedData.splice(
            updatedData.findIndex( x => x.fieldId === fieldId ),
            1
        );
        dispatch( bindCostingAccessoriesDetails( updatedData ) );
    };

    const handleUOMOnFocusAll = ( itemId ) => {
        dispatch( getOrderAndConsumptionUOMDropdown( itemId ) );
    };

    ///For Accessories  Item Group Change
    const handleItemGroupForAccessories = async ( newValue, fieldId ) => {
        await baseAxios.get( `${inventoryApi.itemGroup.root}/${newValue?.value}/subCategories` ).then( response => {
            const updatedData = costingAccessoriesDetails.map( i => {
                if ( fieldId === i.fieldId ) {
                    i.itemGroup = newValue;
                    i.itemGroupId = newValue?.value;
                    i.itemSubGroup = null;
                    i.itemSubGroupId = 0;
                    i.itemSubGroupArray = response?.data?.map( rd => ( {
                        value: rd.id,
                        label: rd.name
                    } ) );
                    i.consumptionUOMArray = [];
                    i.consumptionUOM = {
                        value: newValue?.consumptionUomId,
                        label: newValue?.consumptionUom
                    };
                    i.defaultUomSetId = newValue?.defaultUomSetId;
                }
                return i;
            } );
            dispatch( bindCostingAccessoriesDetails( updatedData ) );
        } );
    };
    //For Accessories Item Sub Group
    const handleItemSubGroupForAccessories = ( newValue, fieldId ) => {
        const updatedData = costingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemSubGroup = newValue;
                i.itemSubGroupId = newValue?.value;
            }
            return i;
        } );
        dispatch( bindCostingAccessoriesDetails( updatedData ) );
    };

    //For Accessories Item
    const handleUnitChangeForAccessories = ( newValue, fieldId ) => {
        const updatedData = costingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.uom = newValue;
                i.unitName = newValue?.label;
            }
            return i;
        } );
        dispatch( bindCostingAccessoriesDetails( updatedData ) );
    };
    const handleConsumptionUnitChangeForAccessories = ( newValue, fieldId ) => {
        const updatedData = costingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.consumptionUOM = newValue;
                i.consumptionUOMName = newValue?.label;
            }
            return i;
        } );
        dispatch( bindCostingAccessoriesDetails( updatedData ) );
    };

    const handleConsumptionUomOnFocus = ( defaultUomSetId, uomArray, fieldId ) => {
        if ( !uomArray.length && defaultUomSetId ) {
            baseAxios.get( `${inventoryApi.unitSet.root}/${defaultUomSetId}` )
                .then( response => {
                    const consumptionUOMArray = response?.data?.details?.map( uom => ( {
                        value: uom.id,
                        label: uom.unitName
                    } ) );
                    const updatedData = costingAccessoriesDetails.map( i => {
                        if ( fieldId === i.fieldId ) {
                            i.consumptionUOMArray = consumptionUOMArray;
                        }
                        return i;
                    } );
                    dispatch( bindCostingAccessoriesDetails( updatedData ) );
                } );
        }
    };

    ///Input Change For Accessories
    // const handleOnChangeForAccessories = ( e, fieldId ) => {
    //     const { name, value, type } = e.target;
    //     const updatedData = costingAccessoriesDetails.map( i => {
    //         if ( fieldId === i.fieldId ) {
    //             i[name] = type === "number" ? Number( value ) : value;
    //         }
    //         return i;
    //     } );
    //     dispatch( bindCostingAccessoriesDetails( updatedData ) );

    // };
    const handleOnChangeForAccessories = ( e, fieldId ) => {
        const { name, value, type } = e.target;
        const updatedData = costingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                if ( name === "consumptionQuantity" || name === "consumptionRatePerUnit" ) {
                    const pLost = ( i.wastagePercent * ( name === "consumptionQuantity" ? Number( value ) * Number( i.consumptionRatePerUnit ) : Number( i.consumptionQuantity ) * Number( value ) ) ) / 100;

                    const totalCost = name === "consumptionQuantity" ? ( Number( value ) * Number( i.consumptionRatePerUnit ) ) + pLost : ( Number( i.consumptionQuantity ) * Number( value ) ) + pLost;

                    i["totalCost"] = totalCost;

                    i[name] = Number( value );

                } else if ( name === 'wastagePercent' ) {
                    const pLost = ( Number( value ) * ( Number( i.consumptionQuantity ) * Number( i.consumptionRatePerUnit ) ) ) / 100;
                    const totalCost = ( Number( i.consumptionQuantity ) * Number( i.consumptionRatePerUnit ) ) + pLost;

                    i["totalCost"] = totalCost;

                    i[name] = Number( value );

                } else {
                    i[name] = Number( value );
                }
            }
            return i;
        } );
        dispatch( bindCostingAccessoriesDetails( updatedData ) );

    };

    const totalCosting = () => {
        const total = _.sum( costingAccessoriesDetails.map( cd => Number( cd.totalCost ) ) );
        return total.toFixed( 6 );
    };

    return (
        <>

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
                            <th className='text-center'><strong>Cons. UOM</strong></th>
                            <th className='text-center'><strong>Process Loss(%)</strong></th>
                            <th className='text-center'><strong>Cons(Qty.)</strong></th>
                            <th className='text-center'><strong>Cost Per Unit</strong></th>
                            <th className='text-center'><strong>Total Cost</strong></th>

                            <th className='text-center'><strong>Action</strong></th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {
                            costingAccessoriesDetails?.map( i => (
                                <tr key={i.fieldId} >
                                    <td style={{ width: '105px' }} >
                                        <CreatableSelect
                                            id='itemGroupId'
                                            menuPlacement="top"
                                            isClearable={false}
                                            isSearchable
                                            menuPosition={'fixed'}
                                            theme={selectThemeColors}
                                            options={dropDownTrimItemGroups}
                                            classNamePrefix='dropdown'
                                            className="erp-dropdown-select"
                                            value={i.itemGroup}
                                            onChange={data => {
                                                handleItemGroupForAccessories( data, i.fieldId );
                                            }}
                                        />
                                    </td>
                                    <td style={{ width: '105px' }} >
                                        <CreatableSelect
                                            id='itemSubGroupId'
                                            isClearable={false}
                                            isSearchable
                                            menuPosition={'fixed'}
                                            theme={selectThemeColors}
                                            options={i?.itemSubGroupArray}
                                            classNamePrefix='dropdown'
                                            className="erp-dropdown-select"
                                            value={i.itemSubGroup}
                                            onChange={data => {
                                                handleItemSubGroupForAccessories( data, i.fieldId );
                                            }}
                                        />
                                    </td>


                                    <td style={{ width: '105px' }} >
                                        <CreatableSelect
                                            id='consumptionUnitId'
                                            isClearable={false}
                                            isSearchable
                                            menuPosition={'fixed'}
                                            theme={selectThemeColors}
                                            options={i.consumptionUOMArray}
                                            classNamePrefix='dropdown'
                                            className="erp-dropdown-select"
                                            value={i.consumptionUOM}
                                            onChange={data => {
                                                handleConsumptionUnitChangeForAccessories( data, i.fieldId );
                                            }}
                                            onFocus={() => { handleConsumptionUomOnFocus( i?.defaultUomSetId, i.consumptionUOMArray, i.fieldId ); }}

                                        />
                                    </td>
                                    <td style={{ width: '105px' }} >
                                        {/* <Input
                                            id={`wastagePercent-${i.fieldId}`}
                                            className="text-right"
                                            bsSize="sm"
                                            type='number'
                                            name="wastagePercent"
                                            value={i.wastagePercent}
                                            placeholder="0"
                                            onChange={e => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                            onFocus={e => { e.target.select(); }}
                                        /> */}
                                        <NumberFormat
                                            className="form-control-sm form-control text-right"
                                            id={`wastagePercent-${i.fieldId}`}
                                            displayType="input"
                                            value={i.wastagePercent}
                                            name="wastagePercent"
                                            // thousandSeparator={true}
                                            // thousandsGroupStyle="thousand"
                                            decimalScale={6}
                                            fixedDecimalScale={true}
                                            allowNegative={false}
                                            allowLeadingZeros={false}
                                            onFocus={e => {
                                                e.target.select();
                                            }}
                                            onChange={e => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                        />
                                    </td>
                                    <td style={{ width: '105px' }}>
                                        <Input
                                            id={`consumptionQuantity-${i.fieldId}`}
                                            className="text-right"
                                            bsSize="sm"
                                            type='number'
                                            name="consumptionQuantity"
                                            value={i.consumptionQuantity}
                                            placeholder="0"
                                            onChange={e => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                            onFocus={e => { e.target.select(); }}
                                        />
                                    </td>
                                    <td style={{ width: '105px' }} >
                                        {/* <Input
                                            id={`consumptionRatePerUnit-${i.fieldId}`}
                                            className="text-right"
                                            bsSize="sm"
                                            type='number'
                                            name="consumptionRatePerUnit"
                                            value={i.consumptionRatePerUnit}
                                            placeholder="0"
                                            onChange={e => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                            onFocus={e => { e.target.select(); }}
                                        /> */}

                                        <NumberFormat
                                            className="form-control-sm form-control text-right"
                                            id={`consumptionRatePerUnit-${i.fieldId}`}
                                            displayType="input"
                                            value={i.consumptionRatePerUnit}
                                            name="consumptionRatePerUnit"
                                            // thousandSeparator={true}
                                            // thousandsGroupStyle="thousand"
                                            decimalScale={6}
                                            fixedDecimalScale={true}
                                            allowNegative={false}
                                            allowLeadingZeros={false}
                                            onFocus={e => {
                                                e.target.select();
                                            }}
                                            onChange={e => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                        />

                                    </td>
                                    <td style={{ width: '105px' }} >
                                        <Input
                                            id={`consumptionRatePerUnit-${i.fieldId}`}
                                            className="text-right"
                                            bsSize="sm"
                                            type='number'
                                            disabled
                                            name="consumptionRatePerUnit"
                                            value={i.totalCost.toFixed( 6 )}
                                            placeholder="0"
                                            onChange={e => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                            onFocus={e => { e.target.select(); }}
                                        />
                                    </td>
                                    <td style={{ width: '25px' }} >
                                        <span>
                                            <Button.Ripple id="deleteAccId" tag={Label} disabled={( costingAccessoriesDetails.length === 1 )} onClick={() => { handleRemoveAccessoriesRow( i.fieldId ); }} className='btn-icon p-0' color='flat-danger' >
                                                <MinusSquare size={18} id="deleteAccId" color="red" />
                                            </Button.Ripple>
                                        </span>
                                    </td>
                                </tr>
                            ) )
                        }
                        <tr>
                            <td colSpan={5}></td>
                            <td>Total</td>
                            <td className='text-right'>{totalCosting()}</td>
                            <td></td>
                        </tr>

                    </tbody>
                </ResizableTable>
            </div>

            <Button.Ripple id="addAccId" tag={Label} onClick={() => { handleAddAccessoriesRow(); }} className='btn-icon' color='flat-success' >
                <PlusSquare size={18} id="addAccId" color="green" />
            </Button.Ripple>
        </>
    );
};
export default SetCostingDetailsForm;

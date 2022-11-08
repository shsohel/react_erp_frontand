
import '@custom-styles/merchandising/others/pre-costing-collapse.scss';
import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import '@custom-styles/merchandising/select/pre-costing-select.scss';
import { baseAxios } from "@services";
import { inventoryApi } from '@services/api-end-points/inventory';
import classnames from 'classnames';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Copy, MinusSquare, PlusSquare } from 'react-feather';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Button, Input, Label, Nav, NavItem, NavLink } from 'reactstrap';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { notify } from '../../../../utility/custom/notifications';
import ResizableTable from '../../../../utility/custom/ResizableTable';
import { confirmObj } from '../../../../utility/enums';
import { insertAfterItemOfArray, randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownFabricItemGroupsByGroupName, getDropDownTrimItemGroupsByGroupName, getItemSegmentArrayByItemGroupId } from '../../../inventory/item-group/store/actions';
import { getOrderAndConsumptionUOMDropdown } from '../../../inventory/unit-sets/store/actions';
import { bindCostingAccessoriesDetails, bindCostingFabricDetails, bindCostingSummaryInputOnChange } from '../store/action';
import CostingDescriptionGenerator from './CostingDescriptionGenerator';
const CostingCloneDetailsForm = () => {
    const dispatch = useDispatch();
    //for Table
    const { dropDownFabricItemGroups, dropDownTrimItemGroups } = useSelector( ( { itemGroups } ) => itemGroups );
    const { OrderMDropdown, consumptionUOMDropdown } = useSelector( ( { unitSets } ) => unitSets );
    const { costingFabricDetails, costingAccessoriesDetails, costingGroupsSummary, styleDefaultCategory } = useSelector( ( { costings } ) => costings );
    const [active, setActive] = useState( '1' );
    const [openDescriptionModal, setOpenDescriptionModal] = useState( false );

    const [descriptionModalObj, setDescriptionModalObj] = useState( null );

    //Start For Tab and Collapsible
    const toggle = tab => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };
    //End For Tab and Collapsible
    useEffect( () => {
        dispatch( getDropDownTrimItemGroupsByGroupName( "Accessories" ) );
        dispatch( getDropDownFabricItemGroupsByGroupName( "Fabric" ) );
    }, [] );


    const handleCostingSummaryEffectOnFabricAndAccessoriesChange = ( FabricOrAccessoriesData, type ) => {
        const summary = costingGroupsSummary?.map( ii => {
            if ( ii.name === 'Fabric' && type === 'Fabric' ) {
                const totalFabricAmount = _.sum( FabricOrAccessoriesData?.map( i => Number( i.totalCost ) ) );
                const totalInHouseAmount = _.sum( FabricOrAccessoriesData?.map( i => Number( i.inHouseCostPerUnit ) ) );
                ii['buyerAmount'] = totalFabricAmount;
                ii['inHouseAmount'] = totalInHouseAmount === 0 ? totalFabricAmount : totalInHouseAmount;
            } else if ( ii.name === 'Accessories' && type === 'Accessories' ) {
                const totalFabricAmount = _.sum( FabricOrAccessoriesData?.map( i => Number( i.totalCost ) ) );
                const totalInHouseAmount = _.sum( FabricOrAccessoriesData?.map( i => Number( i.inHouseCostPerUnit ) ) );
                ii['buyerAmount'] = totalFabricAmount;
                ii['inHouseAmount'] = totalInHouseAmount === 0 ? totalFabricAmount : totalInHouseAmount;
            }
            return ii;
        } );

        const totalBuyerAmount = _.sum( summary.filter( u => !u.isCalculateInPercentage ).map( i => Number( i.buyerAmount ) ) );

        const totalPercentage = _.sum( summary.filter( u => u.isCalculateInPercentage ).map( i => Number( i.inPercentage ) ) );

        const calculateBuyerAmount = ( row, isCalculateInPercentage, inPercentage, buyerAmount ) => {

            let calculatedBuyerAmount = 0.00;

            if ( row === "CM" ) {
                calculatedBuyerAmount = buyerAmount;
            } else {
                calculatedBuyerAmount = isCalculateInPercentage ? ( inPercentage * totalBuyerAmount ) / ( 100 - totalPercentage ) : buyerAmount;
            }

            return calculatedBuyerAmount;
        };

        const modifiedData = summary.map( cs => ( {
            id: cs.id,
            name: cs.name,
            buyerAmount: calculateBuyerAmount( cs.name, cs.isCalculateInPercentage, cs.inPercentage, cs.buyerAmount ),
            // buyerAmount: cs.name === 'CM' ? cs.buyerAmount : cs.inPercentage === 0 ? cs.buyerAmount : ( 100 - cs.inPercentage ) > 0 ? ( cs.inPercentage * totalBuyerAmount ) / ( 100 - cs.inPercentage ) : 0,

            inHouseAmount: cs.isCalculateInPercentage ? calculateBuyerAmount( cs.name, cs.isCalculateInPercentage, cs.inPercentage, cs.buyerAmount ) : cs.inHouseAmount,
            inPercentage: cs.inPercentage,
            isCalculateInPercentage: cs.isCalculateInPercentage
        } ) );

        const totalBuyerAmountWithCM = _.sum( modifiedData.map( i => Number( i.buyerAmount ) ) );

        const updatedAfterModified = modifiedData.map( c => {
            if ( c.name === "CM" ) {
                c['inPercentage'] = ( c.buyerAmount * 100 ) / ( totalBuyerAmountWithCM );
            }
            return c;
        } );

        dispatch( bindCostingSummaryInputOnChange( updatedAfterModified ) );
    };

    const handleAddFabricRow = () => {
        if ( !costingFabricDetails.length ) {
            const newRow = {
                ...styleDefaultCategory,
                fieldId: randomIdGenerator(),
                id: 0,
                // itemGroup: null,
                // itemGroupId: 0,
                // itemSubGroup: null,
                // itemSubGroupId: 0,
                itemSubGroupArray: null,
                itemDescriptionArray: [],
                // itemDescriptionValue: null,
                // itemDescription: '',
                // itemDescriptionTemplate: '',
                //   uom: null,
                // unitName: '',
                //   defaultUomSetId: null,
                consumptionUOMArray: [],

                wastagePercent: 0,
                consumptionQuantity: 0,
                consumptionRatePerUnit: 0,
                inHouseConsumption: 0,
                inHouseRatePerUnit: 0,
                inHouseCostPerUnit: 0,
                remarks: '',
                isFieldError: false,
                totalCost: 0
            };
            dispatch( bindCostingFabricDetails( [...costingFabricDetails, newRow] ) );
        } else {
            const newRow = {

                fieldId: randomIdGenerator(),
                id: 0,
                itemGroup: null,
                itemGroupId: 0,
                itemSubGroupId: 0,
                itemSubGroup: null,
                itemSubGroupArray: null,
                itemDescriptionArray: [],
                itemDescriptionValue: null,
                itemDescription: '',
                itemDescriptionTemplate: '',
                uom: null,
                unitName: '',
                defaultUomSetId: null,
                consumptionUOMArray: [],
                consumptionUOMValue: null,
                consumptionUOM: '',
                wastagePercent: 0,
                consumptionQuantity: 0,
                consumptionRatePerUnit: 0,
                inHouseConsumption: 0,
                inHouseRatePerUnit: 0,
                inHouseCostPerUnit: 0,
                remarks: '',
                isFieldError: false,
                totalCost: 0
            };
            dispatch( bindCostingFabricDetails( [...costingFabricDetails, newRow] ) );
        }
    };
    const handleRemoveFabricRow = ( fieldId ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                const updatedData = [...costingFabricDetails];
                updatedData.splice(
                    updatedData.findIndex( x => x.fieldId === fieldId ),
                    1
                );
                dispatch( bindCostingFabricDetails( updatedData ) );

                handleCostingSummaryEffectOnFabricAndAccessoriesChange( updatedData, 'Fabric' );
            }
        } );

    };


    const handleAddAccessoriesRow = () => {
        const newRow = {
            fieldId: randomIdGenerator(),
            id: 0,
            itemGroup: null,
            itemGroupId: 0,
            itemSubGroup: null,
            itemSubGroupId: 0,
            itemSubGroupArray: null,
            uom: null,
            unitName: '',
            defaultUomSetId: null,
            consumptionUOMArray: [],
            consumptionUOMValue: null,
            consumptionUOM: '',
            wastagePercent: 0,
            consumptionQuantity: 0,
            consumptionRatePerUnit: 0,
            inHouseConsumption: 0,
            inHouseRatePerUnit: 0,
            inHouseCostPerUnit: 0,
            remarks: '',
            isFieldError: false,

            totalCost: 0
        };
        dispatch( bindCostingAccessoriesDetails( [...costingAccessoriesDetails, newRow] ) );
    };
    const handleRemoveAccessoriesRow = ( fieldId ) => {

        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                const updatedData = [...costingAccessoriesDetails];
                updatedData.splice(
                    updatedData.findIndex( x => x.fieldId === fieldId ),
                    1
                );
                dispatch( bindCostingAccessoriesDetails( updatedData ) );

                handleCostingSummaryEffectOnFabricAndAccessoriesChange( updatedData, 'Accessories' );
            }
        } );
    };

    ///For Fabric Item Group DropDown Change
    const handleItemGroupForFabric = async ( newValue, fieldId ) => {
        console.log( 'newValue', JSON.stringify( newValue, null, 2 ) );
        const updatedData = costingFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemGroup = newValue;
                i.itemGroupId = newValue?.value;
                i.itemSubGroup = null;
                i.itemSubGroupId = 0;
                i.itemSubGroupArray = null;
                i.consumptionUOMArray = [];
                i.consumptionUOM = newValue?.consumptionUom;
                i.consumptionUOMValue = {
                    value: newValue?.consumptionUomId,
                    label: newValue?.consumptionUom
                };
                i.defaultUomSetId = newValue?.defaultUomSetId;
            }
            return i;
        } );
        dispatch( getOrderAndConsumptionUOMDropdown( null ) );
        dispatch( bindCostingFabricDetails( updatedData ) );
    };


    const handleItemSubGroupDropdownOnFocusForFabric = async ( itemGroupId, fieldId ) => {
        if ( itemGroupId ) {
            await baseAxios.get( `${inventoryApi.itemGroup.root}/${itemGroupId}/subCategories` ).then( response => {
                const updatedData = costingFabricDetails.map( i => {
                    if ( fieldId === i.fieldId ) {
                        i.itemSubGroupArray = response?.data?.map( rd => ( {
                            value: rd.id,
                            label: rd.name
                        } ) );
                    }
                    return i;
                } );
                dispatch( bindCostingFabricDetails( updatedData ) );
            } );
        }
    };

    ///For Fabric Item Sub Group DropDown Change
    const handleItemSubGroupForFabric = ( newValue, fieldId ) => {
        const updatedData = costingFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemSubGroup = newValue;
                i.itemSubGroupId = newValue?.value;
            }
            return i;
        } );
        dispatch( bindCostingFabricDetails( updatedData ) );

    };
    //For Fabric Unit Change
    const handleConsumptionUOMChangeForFabric = ( newValue, fieldId ) => {
        const updatedData = costingFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.consumptionUOMValue = newValue;
                i.consumptionUOM = newValue?.label;
            }
            return i;
        } );
        dispatch( bindCostingFabricDetails( updatedData ) );
    };

    const handleConsumptionUOMOnFocusForFabric = ( defaultUomSetId, uomArray, fieldId ) => {
        if ( !uomArray.length && defaultUomSetId ) {
            baseAxios.get( `${inventoryApi.unitSet.root}/${defaultUomSetId}` )
                .then( response => {
                    const consumptionUOMArray = response?.data?.details?.map( uom => ( {
                        value: uom.id,
                        label: uom.unitName
                    } ) );
                    const updatedData = costingFabricDetails.map( i => {
                        if ( fieldId === i.fieldId ) {
                            i.consumptionUOMArray = consumptionUOMArray;
                        }
                        return i;
                    } );
                    dispatch( bindCostingFabricDetails( updatedData ) );
                } );
        }
    };


    ///For Fabric Input OnChange
    const handleOnChangeForFabric = ( e, fieldId ) => {
        const { name, value, type } = e.target;
        const updatedData = costingFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                if ( name === "consumptionQuantity" || name === "consumptionRatePerUnit" ) {
                    const pLost = ( i.wastagePercent * ( name === "consumptionQuantity" ? Number( value ) * Number( i.consumptionRatePerUnit ) : Number( i.consumptionQuantity ) * Number( value ) ) ) / 100;
                    const totalCost = name === "consumptionQuantity" ? ( Number( value ) * Number( i.consumptionRatePerUnit ) ) + pLost : ( Number( i.consumptionQuantity ) * Number( value ) ) + pLost;
                    i["totalCost"] = totalCost;
                    //    i[name] = type === "number" ? Number( value ) : Number( value );
                    i[name] = Number( value );

                    //    i['inHouseConsumption'] = ( name === "consumptionQuantity" && i.inHouseConsumption === 0 ) ? Number( value ) : i.inHouseConsumption;
                    //   i['inHouseRatePerUnit'] = ( name === "consumptionRatePerUnit" && i.inHouseRatePerUnit === 0 ) ? Number( value ) : i.inHouseRatePerUnit;
                    //   i['inHouseCostPerUnit'] = i.inHouseCostPerUnit === 0 ? totalCost : i.inHouseCostPerUnit;

                } else if ( name === "inHouseConsumption" || name === "inHouseRatePerUnit" ) {
                    const pLost = ( i.wastagePercent * ( name === "inHouseConsumption" ? Number( value ) * Number( i.inHouseRatePerUnit ) : Number( i.inHouseConsumption ) * Number( value ) ) ) / 100;
                    const totalInHouseCost = name === "inHouseConsumption" ? ( Number( value ) * Number( i.inHouseRatePerUnit ) ) + pLost : ( Number( i.inHouseConsumption ) * Number( value ) ) + pLost;
                    i["inHouseCostPerUnit"] = totalInHouseCost;

                    //  i[name] = type === "number" ? Number( value ) : Number( value );
                    i[name] = Number( value );


                } else if ( name === "wastagePercent" ) {
                    const pLost = ( Number( value ) * ( Number( i.consumptionQuantity ) * Number( i.consumptionRatePerUnit ) ) ) / 100;
                    const totalCost = ( Number( i.consumptionQuantity ) * Number( i.consumptionRatePerUnit ) ) + pLost;
                    i["totalCost"] = totalCost;

                    const inHouseLost = ( Number( value ) * ( Number( i.inHouseConsumption ) * Number( i.inHouseRatePerUnit ) ) ) / 100;
                    const totalInHouseCost = ( Number( i.inHouseConsumption ) * Number( i.inHouseRatePerUnit ) ) + inHouseLost;
                    i['inHouseCostPerUnit'] = i.inHouseCostPerUnit === 0 ? totalCost : totalInHouseCost;

                    //  i[name] = type === "number" ? Number( value ) : Number( value );
                    i[name] = Number( value );

                } else {
                    // i[name] = type === "number" ? Number( value ) : value;
                    i[name] = type === 'text' ? value : Number( value );
                }
            }
            return i;
        } );
        dispatch( bindCostingFabricDetails( updatedData ) );

        handleCostingSummaryEffectOnFabricAndAccessoriesChange( updatedData, 'Fabric' );
    };

    ///For Fabric
    const handleItemDescriptionDropdownChange = ( data, fabricFieldId ) => {
        const updatedData = costingFabricDetails.map( i => {
            if ( fabricFieldId === i.fieldId ) {
                i.itemDescription = data?.label;
                i.itemDescriptionTemplate = data?.itemDescriptionTemplate;
                i.itemDescriptionValue = data;
            }
            return i;
        } );
        dispatch( bindCostingFabricDetails( updatedData ) );
    };
    ///For Fabric Item Description GET
    const handleItemDescriptionOnFocus = ( itemGroupId, ItemSubGroupId, fabricFieldId ) => {
        const endPoint = `${merchandisingApi.costing.root}/fabricDetails/itemGroup/${itemGroupId}/itemSubGroup/${ItemSubGroupId}/itemDescriptionSuggestions`;
        baseAxios.get( endPoint ).then( response => {
            const updatedData = costingFabricDetails.map( i => {
                if ( fabricFieldId === i.fieldId ) {
                    i.itemDescriptionArray = response.data.map( i => ( {
                        label: i.itemDescription,
                        value: i.itemDescription,
                        itemDescriptionTemplate: i.itemDescriptionTemplate
                    } ) );
                }
                return i;
            } );
            dispatch( bindCostingFabricDetails( updatedData ) );
        } );

    };


    ///For Accessories  Item Group Change
    const handleItemGroupForAccessories = async ( newValue, fieldId ) => {
        const updatedData = costingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemGroup = newValue;
                i.itemGroupId = newValue?.value;
                i.itemSubGroup = null;
                i.itemSubGroupId = 0;
                i.itemSubGroupArray = null;
                i.consumptionUOMArray = [];
                i.consumptionUOM = newValue?.consumptionUom;
                i.consumptionUOMValue = {
                    value: newValue?.consumptionUomId,
                    label: newValue?.consumptionUom
                };
                i.defaultUomSetId = newValue?.defaultUomSetId;
            }
            return i;
        } );
        dispatch( getOrderAndConsumptionUOMDropdown( null ) );
        dispatch( bindCostingAccessoriesDetails( updatedData ) );
    };

    const handleItemSubGroupDropdownOnFocusForAccessories = async ( itemGroupId, fieldId ) => {
        if ( itemGroupId ) {
            await baseAxios.get( `${inventoryApi.itemGroup.root}/${itemGroupId}/subCategories` ).then( response => {
                const updatedData = costingAccessoriesDetails.map( i => {
                    if ( fieldId === i.fieldId ) {
                        i.itemSubGroupArray = response?.data?.map( rd => ( {
                            value: rd.id,
                            label: rd.name
                        } ) );
                    }
                    return i;
                } );
                dispatch( bindCostingAccessoriesDetails( updatedData ) );
            } );
        }
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

    //For Accessories Unit Change
    const handleConsumptionUOMChangeForForAccessories = ( newValue, fieldId ) => {
        const updatedData = costingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.consumptionUOMValue = newValue;
                i.consumptionUOM = newValue?.label;
            }
            return i;
        } );
        dispatch( bindCostingAccessoriesDetails( updatedData ) );
    };

    //For Accessories Unit Change
    const handleConsumptionUOMOnFocusAccessories = ( defaultUomSetId, uomArray, fieldId ) => {
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
    const handleOnChangeForAccessories = ( e, fieldId ) => {
        const { name, value, type } = e.target;
        const updatedData = costingAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                if ( name === "consumptionQuantity" || name === "consumptionRatePerUnit" ) {
                    const pLost = ( i.wastagePercent * ( name === "consumptionQuantity" ? Number( value ) * Number( i.consumptionRatePerUnit ) : Number( i.consumptionQuantity ) * Number( value ) ) ) / 100;

                    const totalCost = name === "consumptionQuantity" ? ( Number( value ) * Number( i.consumptionRatePerUnit ) ) + pLost : ( Number( i.consumptionQuantity ) * Number( value ) ) + pLost;

                    i["totalCost"] = totalCost;

                    // i[name] = type === "number" ? Number( value ) : value;
                    i[name] = Number( value );

                } else if ( name === "inHouseConsumption" || name === "inHouseRatePerUnit" ) {
                    const pLost = ( i.wastagePercent * ( name === "inHouseConsumption" ? Number( value ) * Number( i.inHouseRatePerUnit ) : Number( i.inHouseConsumption ) * Number( value ) ) ) / 100;
                    const inHouseCostPerUnit = name === "inHouseConsumption" ? ( Number( value ) * Number( i.inHouseRatePerUnit ) ) + pLost : ( Number( i.inHouseConsumption ) * Number( value ) ) + pLost;

                    i["inHouseCostPerUnit"] = inHouseCostPerUnit;
                    i[name] = Number( value );

                } else if ( name === 'wastagePercent' ) {
                    const pLost = ( Number( value ) * ( Number( i.consumptionQuantity ) * Number( i.consumptionRatePerUnit ) ) ) / 100;
                    const totalCost = ( Number( i.consumptionQuantity ) * Number( i.consumptionRatePerUnit ) ) + pLost;

                    i["totalCost"] = totalCost;

                    i[name] = Number( value );

                    const inHouseLost = ( Number( value ) * ( Number( i.inHouseConsumption ) * Number( i.inHouseRatePerUnit ) ) ) / 100;
                    const totalInHouseCost = ( Number( i.inHouseConsumption ) * Number( i.inHouseRatePerUnit ) ) + inHouseLost;
                    i['inHouseCostPerUnit'] = i.inHouseCostPerUnit === 0 ? totalCost : totalInHouseCost;


                    //  dispatch( bindCostingSummaryInputOnChange( updatedData ) );
                } else {
                    i[name] = type === "text" ? value : Number( value );
                }
            }
            return i;
        } );
        dispatch( bindCostingAccessoriesDetails( updatedData ) );

        handleCostingSummaryEffectOnFabricAndAccessoriesChange( updatedData, 'Accessories' );

    };

    const handleDuplicateFabricDetailsRow = ( fieldId, index ) => {
        const fabrics = [...costingFabricDetails];
        const targetFabric = costingFabricDetails.find( fd => fd.fieldId === fieldId );
        const updatedFabric = { ...targetFabric, fieldId: randomIdGenerator() };

        const duplicatedArray = insertAfterItemOfArray( fabrics, index, updatedFabric );

        dispatch( bindCostingFabricDetails( duplicatedArray ) );


        handleCostingSummaryEffectOnFabricAndAccessoriesChange( duplicatedArray, 'Fabric' );

    };

    const handleDuplicateAccessoriesDetailsRow = ( fieldId, index ) => {
        const accessories = [...costingAccessoriesDetails];
        const targetAccessory = costingAccessoriesDetails.find( fd => fd.fieldId === fieldId );
        const updatedAccessory = { ...targetAccessory, fieldId: randomIdGenerator() };

        const duplicatedArray = insertAfterItemOfArray( accessories, index, updatedAccessory );

        dispatch( bindCostingAccessoriesDetails( duplicatedArray ) );
        handleCostingSummaryEffectOnFabricAndAccessoriesChange( duplicatedArray, 'Accessories' );

    };

    const handleDescriptionModalOpen = ( itemGroupId, costingFieldId, itemDescriptionTemplate, itemGroup, itemSubGroup ) => {
        if ( itemGroupId ) {
            setDescriptionModalObj( {
                itemGroupId,
                costingFieldId,
                itemDescriptionTemplate,
                itemGroup: itemGroup?.label,
                itemSubGroup: itemSubGroup?.label
            } );
            setOpenDescriptionModal( !openDescriptionModal );
            dispatch( getItemSegmentArrayByItemGroupId( itemGroupId, itemDescriptionTemplate ) );

        } else {
            notify( 'warning', 'Please select a item group!!!' );
        }

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
                        <span>Fabric</span>
                        {/* <span><Tool size={16}> </Tool>Fabric </span> */}

                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === '2'}
                        onClick={() => {
                            toggle( '2' );
                        }}
                    >
                        Accessories
                    </NavLink>
                </NavItem>
            </Nav>
            {
                active === '1' && <div>
                    <div>
                        <ResizableTable
                            mainClass="resizeFab"
                            tableId="fabricTableId"
                            className="pre-costing-details-table table-bordered"
                            size="sm" responsive={true}
                        >
                            <thead className='thead-light' >
                                <tr >
                                    <th style={{ minWidth: '4px' }} className='text-center'><strong>SL</strong></th>
                                    <th className='text-center'><strong>Action</strong></th>
                                    <th style={{ minWidth: '180px' }} className=' text-center'><strong>Item Group</strong></th>
                                    <th style={{ minWidth: '180px' }} className='text-center'><strong>Item Sub</strong></th>
                                    <th className='text-center'><strong>Item Description</strong></th>
                                    <th className='text-center'><strong>Cons. UOM</strong></th>
                                    <th className='text-center'><strong>Process Loss(%)</strong></th>
                                    <th className='text-center'><strong>Cons(Qty.)</strong></th>
                                    <th className='text-center'><strong>Cost Per Unit</strong></th>
                                    <th className='text-center'><strong>Total Cost</strong></th>
                                    <th ><strong>In-House Cons.(Qty.)</strong></th>
                                    <th ><strong>In-House Rate Per Unit</strong></th>
                                    <th ><strong>In-House Cost Per Unit</strong></th>
                                    <th ><strong>Remarks</strong></th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {
                                    costingFabricDetails?.map( ( i, index ) => (
                                        <tr key={i.fieldId} >
                                            <td style={{ minWidth: '4px' }} >{index + 1}</td>
                                            <td style={{ minWidth: '85px' }} >
                                                <span>
                                                    <Button.Ripple id="copyId"
                                                        tag={Label}
                                                        // disabled={( orderDetails.length === 1 )}
                                                        onClick={() => { handleDuplicateFabricDetailsRow( i.fieldId, index ); }}
                                                        className='btn-icon p-0 '
                                                        color='flat-success'
                                                    //   disabled={!isValidStatus}

                                                    >
                                                        <Copy
                                                            size={18}
                                                            id="copyId"
                                                            color="green"
                                                        />
                                                    </Button.Ripple>
                                                    <Button.Ripple
                                                        id="deleteFabId"
                                                        tag={Label}

                                                        onClick={() => { handleRemoveFabricRow( i.fieldId ); }}
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
                                            <td style={{ width: '105px' }} >
                                                <Select
                                                    id={`itemGroupId-${i.fieldId}`}
                                                    isClearable
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    theme={selectThemeColors}
                                                    options={dropDownFabricItemGroups}
                                                    // innerRef={register( { required: true } )}
                                                    classNamePrefix='dropdown'
                                                    className={classnames( `erp-dropdown-select ${( ( i.isFieldError && !i.itemGroup ) ) && 'is-invalid'}` )}
                                                    value={i?.itemGroup}
                                                    onChange={data => {
                                                        handleItemGroupForFabric( data, i.fieldId );
                                                    }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <Select
                                                    id={`itemSubGroupId-${i.fieldId}`}
                                                    isClearable
                                                    isLoading={!i.itemSubGroupArray}
                                                    //  menuPlacement="top"
                                                    isSearchable
                                                    theme={selectThemeColors}
                                                    menuPosition={'fixed'}
                                                    options={i.itemSubGroupArray}
                                                    classNamePrefix='dropdown'
                                                    className={classnames( `erp-dropdown-select ${( ( i.isFieldError && !i.itemSubGroup ) ) && 'is-invalid'}` )}
                                                    onFocus={() => { handleItemSubGroupDropdownOnFocusForFabric( i?.itemGroupId, i.fieldId ); }}

                                                    value={i.itemSubGroup}
                                                    onChange={data => {
                                                        handleItemSubGroupForFabric( data, i.fieldId );
                                                    }}
                                                />
                                            </td>
                                            <td style={{ minWidth: '405px' }} >
                                                <div className="d-flex w-100  align-items-center">
                                                    <Select
                                                        options={i.itemDescriptionArray}
                                                        value={i.itemDescriptionValue}
                                                        isClearable
                                                        menuPosition="fixed"
                                                        classNamePrefix='dropdown'
                                                        className={classnames( `erp-dropdown-select w-100 ${( ( i.isFieldError && !i.itemDescriptionValue ) ) && 'is-invalid'}` )}
                                                        // menuPlacement="top"
                                                        onChange={( data ) => { handleItemDescriptionDropdownChange( data, i.fieldId ); }}
                                                        onFocus={() => { handleItemDescriptionOnFocus( i?.itemGroupId, i?.itemSubGroupId, i.fieldId ); }}
                                                    />
                                                    <span >
                                                        <Button.Ripple
                                                            for="addItemDescriptionId"
                                                            tag={Label}
                                                            onClick={() => { handleDescriptionModalOpen( i?.itemGroupId, i.fieldId, i.itemDescriptionTemplate, i.itemGroup, i.itemSubGroup ); }}
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
                                                    isLoading={!i.consumptionUOMArray.length}
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    theme={selectThemeColors}
                                                    options={i.consumptionUOMArray}
                                                    classNamePrefix='dropdown'
                                                    className={classnames( `erp-dropdown-select ${( ( i.isFieldError && !i.consumptionUOMValue ) ) && 'is-invalid'}` )}
                                                    value={i.consumptionUOMValue}
                                                    onFocus={() => { handleConsumptionUOMOnFocusForFabric( i?.defaultUomSetId, i.consumptionUOMArray, i.fieldId ); }}
                                                    onChange={data => {
                                                        handleConsumptionUOMChangeForFabric( data, i.fieldId );
                                                    }}
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
                                                    onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                /> */}
                                                <NumberFormat
                                                    className="form-control-sm form-control"
                                                    value={i.wastagePercent}
                                                    displayType="input"
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
                                                    onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }}>
                                                {/* <Input
                                                    id={`consumptionQuantity-${i.fieldId}`}
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    name="consumptionQuantity"
                                                    value={i.consumptionQuantity}
                                                    placeholder="0"
                                                    onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                /> */}

                                                <NumberFormat
                                                    className={classnames( `form-control-sm form-control text-right ${( ( i.isFieldError && i.consumptionQuantity === 0 ) ) && 'border-danger'}` )}
                                                    id={`consumptionQuantity-${i.fieldId}`}
                                                    displayType="input"
                                                    value={i.consumptionQuantity}
                                                    name="consumptionQuantity"
                                                    // thousandSeparator={true}
                                                    // thousandsGroupStyle="thousand"
                                                    decimalScale={6}
                                                    fixedDecimalScale={true}
                                                    allowNegative={false}
                                                    allowLeadingZeros={false}
                                                    onFocus={e => {
                                                        e.target.select();
                                                    }}
                                                    onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <NumberFormat
                                                    className={classnames( `form-control-sm form-control text-right ${( ( i.isFieldError && i.consumptionRatePerUnit === 0 ) ) && 'border-danger'}` )}
                                                    id={`consumptionRatePerUnit-${i.fieldId}`}
                                                    displayType="input"
                                                    value={i.consumptionRatePerUnit}
                                                    name="consumptionRatePerUnit"
                                                    decimalScale={6}
                                                    fixedDecimalScale={true}
                                                    allowNegative={false}
                                                    allowLeadingZeros={false}
                                                    onFocus={e => {
                                                        e.target.select();
                                                    }}
                                                    onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <Input
                                                    id={`totalCost-${i.fieldId}`}
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    name="totalCost"
                                                    value={i.totalCost.toFixed( 6 )}
                                                    disabled
                                                    placeholder="0"
                                                    onChange={e => { }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }}>
                                                <NumberFormat
                                                    className="form-control-sm form-control text-right"
                                                    id={`inHouseConsumption-${i.fieldId}`}
                                                    displayType="input"
                                                    value={i.inHouseConsumption}
                                                    name="inHouseConsumption"
                                                    decimalScale={6}
                                                    fixedDecimalScale={true}
                                                    allowNegative={false}
                                                    allowLeadingZeros={false}
                                                    onFocus={e => {
                                                        e.target.select();
                                                    }}
                                                    onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >

                                                <NumberFormat
                                                    className="form-control-sm form-control text-right"
                                                    id={`inHouseRatePerUnit-${i.fieldId}`}
                                                    displayType="input"
                                                    value={i.inHouseRatePerUnit}
                                                    name="inHouseRatePerUnit"
                                                    // thousandSeparator={true}
                                                    // thousandsGroupStyle="thousand"
                                                    decimalScale={6}
                                                    fixedDecimalScale={true}
                                                    allowNegative={false}
                                                    allowLeadingZeros={false}
                                                    onFocus={e => {
                                                        e.target.select();
                                                    }}
                                                    onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <Input
                                                    id={`inHouseCostPerUnit-${i.fieldId}`}
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    name="inHouseCostPerUnit"
                                                    disabled
                                                    value={i.inHouseCostPerUnit.toFixed( 6 )}
                                                    placeholder="0"
                                                    onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}

                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <Input
                                                    id={`remarks-${i.fieldId}`}
                                                    bsSize="sm"
                                                    type='text'
                                                    name="remarks"

                                                    value={i.remarks}
                                                    placeholder="remarks"
                                                    onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}

                                                />
                                            </td>

                                        </tr>
                                    ) )
                                }

                            </tbody>
                        </ResizableTable>
                    </div>
                    {
                        ( descriptionModalObj && openDescriptionModal ) &&
                        <CostingDescriptionGenerator
                            descriptionModalObj={descriptionModalObj}
                            openModal={openDescriptionModal}
                            setOpenModal={setOpenDescriptionModal}
                        />
                    }


                    <Button.Ripple id="addFabId" tag={Label} onClick={() => { handleAddFabricRow( costingFabricDetails.length ); }} className='btn-icon' color='flat-success' >
                        <PlusSquare id="addFabId" color="green" />
                    </Button.Ripple>
                </div>
            }
            {
                active === '2' && <div>
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
                                    <th className='text-center'><strong>Action</strong></th>
                                    <th style={{ minWidth: '180px' }} className=' text-center'><strong>Item Group</strong></th>
                                    <th style={{ minWidth: '180px' }} className='text-center'><strong>Item Sub</strong></th>
                                    <th className='text-center'><strong>Cons. UOM</strong></th>
                                    <th className='text-center'><strong>Process Loss(%)</strong></th>
                                    <th className='text-center'><strong>Cons(Qty.)</strong></th>
                                    <th className='text-center'><strong>Cost Per Unit</strong></th>
                                    <th className='text-center'><strong>Total Cost</strong></th>
                                    <th ><strong>In-House Cons.(Qty.)</strong></th>
                                    <th ><strong>In-House Rate Per Unit</strong></th>
                                    <th ><strong>In-House Cost Per Unit</strong></th>
                                    <th ><strong>Remarks</strong></th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {
                                    costingAccessoriesDetails?.map( ( i, index ) => (
                                        <tr key={i.fieldId} >
                                            <td style={{ width: '4px' }} >{index + 1}</td>
                                            <td style={{ width: '80px' }} >
                                                <span>
                                                    <Button.Ripple id="copyId"
                                                        tag={Label}
                                                        // disabled={( orderDetails.length === 1 )}
                                                        onClick={() => { handleDuplicateAccessoriesDetailsRow( i.fieldId, index ); }}
                                                        className='btn-icon p-0 '
                                                        color='flat-success'
                                                    //   disabled={!isValidStatus}

                                                    >
                                                        <Copy
                                                            size={18}
                                                            id="copyId"
                                                            color="green"
                                                        />
                                                    </Button.Ripple>
                                                    <Button.Ripple
                                                        id="deleteAccId"
                                                        tag={Label}

                                                        onClick={() => { handleRemoveAccessoriesRow( i.fieldId ); }}
                                                        className='btn-icon p-0 ml-1'
                                                        color='flat-danger'
                                                    >
                                                        <MinusSquare
                                                            size={18}
                                                            id="deleteAccId"
                                                            color="red"
                                                        />
                                                    </Button.Ripple>
                                                </span>
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <CreatableSelect
                                                    id='itemGroupId'
                                                    pageSize={4}
                                                    isClearable={false}
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    theme={selectThemeColors}
                                                    options={dropDownTrimItemGroups}
                                                    classNamePrefix='dropdown'
                                                    className={classnames( `erp-dropdown-select ${( ( i.isFieldError && !i.itemGroup ) ) && 'is-invalid'}` )}
                                                    value={i.itemGroup}
                                                    onChange={data => {
                                                        handleItemGroupForAccessories( data, i.fieldId );
                                                    }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <CreatableSelect
                                                    id='itemSubGroupId'
                                                    isClearable
                                                    isLoading={!i.itemSubGroupArray}
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    theme={selectThemeColors}
                                                    options={i?.itemSubGroupArray}
                                                    classNamePrefix='dropdown'
                                                    className={classnames( `erp-dropdown-select ${( ( i.isFieldError && !i.itemSubGroup ) ) && 'is-invalid'}` )}
                                                    value={i.itemSubGroup}
                                                    onFocus={() => { handleItemSubGroupDropdownOnFocusForAccessories( i?.itemGroupId, i.fieldId ); }}
                                                    onChange={data => {
                                                        handleItemSubGroupForAccessories( data, i.fieldId );
                                                    }}
                                                />
                                            </td>

                                            <td style={{ width: '105px' }} >
                                                <CreatableSelect
                                                    id='consumptionUnitId'
                                                    isClearable
                                                    isLoading={!i.consumptionUOMArray.length}
                                                    isSearchable
                                                    menuPosition="fixed"
                                                    theme={selectThemeColors}
                                                    options={i.consumptionUOMArray}
                                                    classNamePrefix='dropdown'
                                                    className={classnames( `erp-dropdown-select ${( ( i.isFieldError && !i.consumptionUOMValue ) ) && 'is-invalid'}` )}
                                                    value={i.consumptionUOMValue}
                                                    onFocus={() => { handleConsumptionUOMOnFocusAccessories( i?.defaultUomSetId, i.consumptionUOMArray, i.fieldId ); }}
                                                    onChange={data => {
                                                        handleConsumptionUOMChangeForForAccessories( data, i.fieldId );
                                                    }}
                                                />
                                            </td>

                                            <td style={{ width: '105px' }} >
                                                <NumberFormat
                                                    className="form-control-sm form-control text-right"
                                                    id={`wastagePercent-${i.fieldId}`}
                                                    displayType="input"
                                                    value={i.wastagePercent}
                                                    name="wastagePercent"
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
                                                <NumberFormat
                                                    className={classnames( `form-control-sm form-control text-right ${( ( i.isFieldError && i.consumptionQuantity === 0 ) ) && 'border-danger'}` )}
                                                    id={`consumptionQuantity-${i.fieldId}`}
                                                    displayType="input"
                                                    value={i.consumptionQuantity}
                                                    name="consumptionQuantity"
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
                                                <NumberFormat
                                                    className={classnames( `form-control-sm form-control text-right ${( ( i.isFieldError && i.consumptionRatePerUnit === 0 ) ) && 'border-danger'}` )}
                                                    id={`consumptionRatePerUnit-${i.fieldId}`}
                                                    displayType="input"
                                                    value={i.consumptionRatePerUnit}
                                                    name="consumptionRatePerUnit"
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
                                                    id={`totalCost-${i.fieldId}`}
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    name="totalCost"
                                                    disabled
                                                    value={i.totalCost.toFixed( 6 )}
                                                    placeholder="0"
                                                    onChange={e => { }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }}>
                                                <NumberFormat
                                                    className="form-control-sm form-control text-right"
                                                    id={`inHouseConsumption-${i.fieldId}`}
                                                    displayType="input"
                                                    name="inHouseConsumption"
                                                    value={i.inHouseConsumption}
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
                                                <NumberFormat
                                                    className="form-control-sm form-control text-right"
                                                    id={`inHouseRatePerUnit-${i.fieldId}`}
                                                    displayType="input"
                                                    value={i.inHouseRatePerUnit}
                                                    name="inHouseRatePerUnit"
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
                                                    id={`inHouseCostPerUnit-${i.fieldId}`}
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    name="inHouseCostPerUnit"
                                                    disabled
                                                    value={i.inHouseCostPerUnit.toFixed( 6 )}
                                                    placeholder="0"
                                                    onChange={e => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <Input
                                                    id={`remarks-${i.fieldId}`}
                                                    bsSize="sm"
                                                    type='text'
                                                    name="remarks"
                                                    value={i.remarks}
                                                    placeholder="remarks"
                                                    onChange={e => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}

                                                />
                                            </td>

                                        </tr>
                                    ) )
                                }

                            </tbody>
                        </ResizableTable>
                    </div>

                    <Button.Ripple id="addAccId" tag={Label} onClick={() => { handleAddAccessoriesRow( costingAccessoriesDetails.length ); }} className='btn-icon' color='flat-success' >
                        <PlusSquare id="addAccId" color="green" />
                    </Button.Ripple>
                </div>
            }
        </>
    );
};
export default CostingCloneDetailsForm;

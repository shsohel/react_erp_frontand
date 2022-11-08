
import '@custom-styles/merchandising/others/pre-costing-collapse.scss';
import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import '@custom-styles/merchandising/select/pre-costing-select.scss';
import { baseAxios } from '@services';
import { inventoryApi } from '@services/api-end-points/inventory';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { notify } from '../../../../utility/custom/notifications';
import ResizableTable from '../../../../utility/custom/ResizableTable';
import { confirmObj } from '../../../../utility/enums';
import { insertAfterItemOfArray, isZeroToFixed, randomIdGenerator } from '../../../../utility/Utils';
import { getDropDownFabricItemGroupsByGroupName, getDropDownTrimItemGroupsByGroupName, getItemSegmentArrayByItemGroupId } from '../../../inventory/item-group/store/actions';
import { getOrderAndConsumptionUOMDropdown } from '../../../inventory/unit-sets/store/actions';
import { bindCostingAccessoriesDetails, bindCostingFabricDetails, bindCostingSummaryInputOnChange } from '../store/action';
const CostingDetailsTable = () => {
    const dispatch = useDispatch();
    //for Table
    const { dropDownFabricItemGroups, dropDownTrimItemGroups } = useSelector( ( { itemGroups } ) => itemGroups );
    const { OrderMDropdown, consumptionUOMDropdown } = useSelector( ( { unitSets } ) => unitSets );
    const { costingFabricDetails, costingAccessoriesDetails, costingGroupsSummary, styleDefaultCategory } = useSelector( ( { costings } ) => costings );
    const [active, setActive] = useState( '1' );
    const [openDescriptionModal, setOpenDescriptionModal] = useState( false );
    const { itemSegmentsArray } = useSelector( ( { itemGroups } ) => itemGroups );

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
    const handleAddFabricRow = ( totalIndexNo ) => {
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
                garmentPart: null,
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
                // inHouseQuantity: 0,
                inHouseConsumption: 0,
                inHouseRatePerUnit: 0,
                inHouseCostPerUnit: 0,
                garmentPart: null,
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
            // inHouseQuantity: 0,
            inHouseConsumption: 0,
            inHouseRatePerUnit: 0,
            inHouseCostPerUnit: 0,
            garmentPart: null,
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

    const handleFabricDropdown = ( e, newValue, fieldId ) => {
        const { name } = e;
        if ( name === "garmentPart" ) {
            const updatedData = costingFabricDetails.map( i => {
                if ( fieldId === i.fieldId ) {
                    i[name] = newValue;
                }
                return i;
            } );
            dispatch( bindCostingFabricDetails( updatedData ) );
        }

    };

    ///For Fabric Item Group DropDown Change
    const handleItemGroupForFabric = async ( newValue, fieldId ) => {
        const updatedData = costingFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemGroup = newValue;
                i.itemGroupId = newValue?.value;
                i.itemSubGroup = null;
                i.itemSubGroupId = 0;
                i.itemSubGroupArray = [];
                i.consumptionUOMArray = [];
                i.consumptionUOM = newValue?.consumptionUom;
                i.consumptionUOMValue = {
                    value: newValue?.consumptionUomId,
                    label: newValue?.consumptionUom
                };
                i.itemDescriptionArray = [];
                i.itemDescriptionValue = null;
                i.itemDescription = '';
                i.itemDescriptionTemplate = '';
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

    //
    ///For Fabric Item Sub Group DropDown Change
    const handleItemSubGroupForFabric = ( newValue, fieldId ) => {
        const updatedData = costingFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemSubGroup = newValue;
                i.itemSubGroupId = newValue?.value;
                i.itemDescriptionArray = [];
                i.itemDescription = '';
                i.itemDescriptionTemplate = '';
                i.itemDescriptionValue = null;
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
        if ( value !== '.' ) {

            const updatedData = costingFabricDetails.map( i => {
                if ( fieldId === i.fieldId ) {
                    if ( name === "consumptionQuantity" || name === "consumptionRatePerUnit" ) {
                        const pLost = ( i.wastagePercent * ( name === "consumptionQuantity" ? Number( value ) * Number( i.consumptionRatePerUnit ) : Number( i.consumptionQuantity ) * Number( value ) ) ) / 100;
                        const totalCost = name === "consumptionQuantity" ? ( Number( value ) * Number( i.consumptionRatePerUnit ) ) + pLost : ( Number( i.consumptionQuantity ) * Number( value ) ) + pLost;
                        i["totalCost"] = totalCost;
                        i[name] = Number( value );

                        //    i['inHouseConsumption'] = ( name === "consumptionQuantity" && i.inHouseConsumption === 0 ) ? Number( value ) : i.inHouseConsumption;
                        //   i['inHouseRatePerUnit'] = ( name === "consumptionRatePerUnit" && i.inHouseRatePerUnit === 0 ) ? Number( value ) : i.inHouseRatePerUnit;
                        //   i['inHouseCostPerUnit'] = i.inHouseCostPerUnit === 0 ? totalCost : i.inHouseCostPerUnit;

                    } else if ( name === "inHouseConsumption" || name === "inHouseRatePerUnit" ) {
                        const pLost = ( i.wastagePercent * ( name === "inHouseConsumption" ? Number( value ) * Number( i.inHouseRatePerUnit ) : Number( i.inHouseConsumption ) * Number( value ) ) ) / 100;
                        const totalInHouseCost = name === "inHouseConsumption" ? ( Number( value ) * Number( i.inHouseRatePerUnit ) ) + pLost : ( Number( i.inHouseConsumption ) * Number( value ) ) + pLost;
                        i["inHouseCostPerUnit"] = totalInHouseCost;

                        i[name] = Number( value );

                    } else if ( name === "wastagePercent" ) {
                        const pLost = ( Number( value ) * ( Number( i.consumptionQuantity ) * Number( i.consumptionRatePerUnit ) ) ) / 100;
                        const totalCost = ( Number( i.consumptionQuantity ) * Number( i.consumptionRatePerUnit ) ) + pLost;
                        i["totalCost"] = totalCost;
                        //    i['inHouseCostPerUnit'] = i.inHouseCostPerUnit === 0 ? totalCost : i.inHouseCostPerUnit;
                        const inHouseLost = ( Number( value ) * ( Number( i.inHouseConsumption ) * Number( i.inHouseRatePerUnit ) ) ) / 100;
                        const totalInHouseCost = ( Number( i.inHouseConsumption ) * Number( i.inHouseRatePerUnit ) ) + inHouseLost;
                        i['inHouseCostPerUnit'] = i.inHouseCostPerUnit === 0 ? totalCost : totalInHouseCost;
                        i[name] = type === "number" ? Number( value ) : Number( value );

                    } else {
                        i[name] = type === 'text' ? value : Number( value );
                    }
                }
                return i;
            } );
            dispatch( bindCostingFabricDetails( updatedData ) );
            handleCostingSummaryEffectOnFabricAndAccessoriesChange( updatedData, 'Fabric' );
        }
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
            // dispatch( bindSegmentDescriptionArray( updatedData ) );
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
                i.itemSubGroupArray = [];
                i.consumptionUOMArray = [];
                i.consumptionUOM = newValue?.consumptionUom;
                i.consumptionUOMValue = {
                    value: newValue?.consumptionUomId,
                    label: newValue?.consumptionUom
                };
                i.defaultUomSetId = newValue?.defaultUomSetId;
                i.itemDescriptionArray = [];
                i.itemDescriptionValue = null;
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
                i.itemDescriptionArray = [];
                i.itemDescriptionValue = null;
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
        if ( value !== '.' ) {

            const updatedData = costingAccessoriesDetails.map( i => {
                if ( fieldId === i.fieldId ) {
                    if ( name === "consumptionQuantity" || name === "consumptionRatePerUnit" ) {
                        const pLost = ( i.wastagePercent * ( name === "consumptionQuantity" ? Number( value ) * Number( i.consumptionRatePerUnit ) : Number( i.consumptionQuantity ) * Number( value ) ) ) / 100;

                        const totalCost = name === "consumptionQuantity" ? ( Number( value ) * Number( i.consumptionRatePerUnit ) ) + pLost : ( Number( i.consumptionQuantity ) * Number( value ) ) + pLost;

                        i["totalCost"] = totalCost;

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

                    } else {
                        i[name] = type === 'text' ? value : Number( value );
                    }
                }
                return i;
            } );
            dispatch( bindCostingAccessoriesDetails( updatedData ) );

            handleCostingSummaryEffectOnFabricAndAccessoriesChange( updatedData, 'Accessories' );
        }
    };

    const handleDuplicateFabricDetailsRow = ( fieldId, index ) => {
        const fabrics = [...costingFabricDetails];
        const targetFabric = costingFabricDetails.find( fd => fd.fieldId === fieldId );
        const updatedFabric = { ...targetFabric, fieldId: randomIdGenerator(), id: 0 };

        const duplicatedArray = insertAfterItemOfArray( fabrics, index, updatedFabric );

        dispatch( bindCostingFabricDetails( duplicatedArray ) );


        handleCostingSummaryEffectOnFabricAndAccessoriesChange( duplicatedArray, 'Fabric' );


    };

    const handleDuplicateAccessoriesDetailsRow = ( fieldId, index ) => {
        const accessories = [...costingAccessoriesDetails];
        const targetAccessory = costingAccessoriesDetails.find( fd => fd.fieldId === fieldId );
        const updatedAccessory = { ...targetAccessory, fieldId: randomIdGenerator(), id: 0 };

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
                                    <th className=' text-center'><strong>SL</strong></th>

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
                                    <th ><strong>Part</strong></th>
                                    <th ><strong>Remarks</strong></th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {
                                    costingFabricDetails?.map( ( i, index ) => (
                                        <tr key={i.fieldId} >
                                            <td>{index + 1}</td>

                                            <td style={{ width: '105px' }} >
                                                {i?.itemGroup?.label}
                                            </td>
                                            <td  >
                                                {i.itemSubGroup?.label}
                                            </td>
                                            <td style={{ minWidth: '405px' }} >
                                                <div className="d-flex w-100  align-items-center">
                                                    {i.itemDescriptionValue?.label}
                                                </div>
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                {i?.consumptionUOMValue?.label}
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                {isZeroToFixed( i.wastagePercent, 6 )}
                                            </td>
                                            <td style={{ width: '105px' }}>
                                                {isZeroToFixed( i.consumptionQuantity, 6 )}
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                {isZeroToFixed( i.consumptionRatePerUnit, 6 )}
                                            </td>
                                            <td style={{ width: '105px' }}>
                                                {isZeroToFixed( i.totalCost, 6 )}
                                            </td>
                                            <td style={{ width: '105px' }}>
                                                {isZeroToFixed( i.inHouseConsumption, 6 )}
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                {isZeroToFixed( i.inHouseRatePerUnit, 6 )}
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                {isZeroToFixed( i.inHouseCostPerUnit, 6 )}
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                {i.garmentPart?.label}
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                {i.remarks}
                                            </td>


                                        </tr>
                                    ) )
                                }

                            </tbody>
                        </ResizableTable>
                    </div>


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
                                    <th style={{ width: '4px' }} className=' text-center'><strong>SL</strong></th>
                                    <th style={{ minWidth: '120px' }} className=' text-center'><strong>Item Group</strong></th>
                                    <th style={{ minWidth: '120px' }} className='text-center'><strong>Item Sub</strong></th>
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
                                            <td style={{ width: '4px' }}>{index + 1}</td>

                                            <td  >
                                                {i.itemGroup?.label}
                                            </td>
                                            <td  >
                                                {i.itemSubGroup?.label}
                                            </td>

                                            <td style={{ width: '105px' }} >
                                                {i.consumptionUOMValue?.label}
                                            </td>

                                            <td style={{ width: '105px' }} >
                                                {isZeroToFixed( i.wastagePercent, 6 )}
                                            </td>
                                            <td style={{ width: '105px' }}>
                                                {isZeroToFixed( i.consumptionQuantity, 6 )}
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                {isZeroToFixed( i.consumptionRatePerUnit, 6 )}
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                {isZeroToFixed( i.totalCost, 6 )}
                                            </td>
                                            <td style={{ width: '105px' }}>
                                                {isZeroToFixed( i.inHouseConsumption, 6 )}
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                {isZeroToFixed( i.inHouseRatePerUnit, 6 )}
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                {isZeroToFixed( i.inHouseCostPerUnit, 6 )}
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                {i.remarks}
                                            </td>


                                        </tr>
                                    ) )
                                }

                            </tbody>
                        </ResizableTable>
                    </div>


                </div>
            }
        </>
    );
};
export default CostingDetailsTable;


import '@custom-styles/merchandising/others/pre-costing-collapse.scss';
import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import '@custom-styles/merchandising/select/pre-costing-select.scss';
import classnames from 'classnames';
import _ from 'lodash';
import React, { useState } from 'react';
import { MinusSquare, PlusSquare } from 'react-feather';
import CreatableSelect from 'react-select/creatable';
import { Button, Input, Label, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import ResizableTable from '../../../../utility/custom/ResizableTable';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
const initialState = [
    { id: 1, costingGroupName: 'Fabric', buyerAmount: 0, inHouseAmount: 0 },
    { id: 2, costingGroupName: 'Accessories', buyerAmount: 0, inHouseAmount: 0 },
    { id: 3, costingGroupName: 'CM', buyerAmount: 0, inHouseAmount: 0 },
    { id: 4, costingGroupName: 'Print', buyerAmount: 0, inHouseAmount: 0 },
    { id: 5, costingGroupName: 'Wash', buyerAmount: 0, inHouseAmount: 0 },
    { id: 6, costingGroupName: 'Embroidery', buyerAmount: 0, inHouseAmount: 0 },
    { id: 7, costingGroupName: 'Profit', buyerAmount: 0, inHouseAmount: 0 },
    { id: 8, costingGroupName: 'Commission', buyerAmount: 0, inHouseAmount: 0 },
    { id: 9, costingGroupName: 'Logistics & Transport', buyerAmount: 0, inHouseAmount: 0 },
    { id: 10, costingGroupName: 'Other', buyerAmount: 0, inHouseAmount: 0 },
    { id: 11, costingGroupName: 'Total', buyerAmount: 0, inHouseAmount: 0 }
];

const selectItemGroups = [
    {
        value: 1,
        label: 'Fabric',
        sub: [
            {
                value: 1,
                label: 'Cotton Fabric'
            },
            {
                value: 2,
                label: 'Polyester Fabric'
            }
        ]
    },
    {
        value: 2,
        label: 'Zipper',
        sub: [
            {
                value: 1,
                label: 'Metal Zipper'
            },
            {
                value: 2,
                label: 'Plastic Zipper'
            }
        ]
    }
];
const selectUnits = [
    {
        value: 1,
        label: 'PCS'
    },
    {
        value: 2,
        label: 'DOZEN'
    },
    {
        value: 3,
        label: 'Meter'
    }
];


const PreCostingDetails = () => {
    //for Table
    const [active, setActive] = useState( '1' );
    // For Collapsible
    const [openCustomizer, setOpenCustomizer] = useState( false );
    const [costingSummery, setCostingSummery] = useState( initialState );
    ///For Fabric
    const [fabricDetails, setFabricDetails] = useState( [
        {
            fieldId: randomIdGenerator(),
            itemGroup: null,
            itemSubGroup: null,
            itemSubGroupArray: null,
            itemDescription: '',
            uom: null,
            processLoss: 0,
            consumptionQuantity: 0,
            costPerUnit: 0,
            inHouseConsumption: 0,
            inHouseRatePerUnit: '',
            inHouseCostPerUnit: 0
        }
    ] );

    const [accessoriesDetails, setAccessoriesDetails] = useState( [
        {
            fieldId: randomIdGenerator(),
            itemGroup: null,
            itemSubGroup: null,
            itemSubGroupArray: null,
            itemDescription: '',
            uom: null,
            processLoss: 0,
            consumptionQuantity: 0,
            costPerUnit: 0,
            inHouseConsumption: 0,
            inHouseRatePerUnit: '',
            inHouseCostPerUnit: 0
        }
    ] );

    //Start For Tab and Collapsible
    const toggle = tab => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };
    const handleToggle = e => {
        e.preventDefault();
        setOpenCustomizer( !openCustomizer );
    };
    //End For Tab and Collapsible

    const handleAddFabricRow = () => {
        const newRow = {
            fieldId: randomIdGenerator(),
            itemGroup: null,
            itemSubGroupArray: null,
            itemSubGroup: null,
            itemDescription: '',
            uom: null,
            processLoss: 0,
            consumptionQuantity: 0,
            costPerUnit: 0,
            inHouseConsumption: 0,
            inHouseRatePerUnit: '',
            inHouseCostPerUnit: 0
        };
        setFabricDetails( [...fabricDetails, newRow] );
    };
    const handleRemoveFabricRow = ( fieldId ) => {
        const updatedData = [...fabricDetails];
        updatedData.splice(
            updatedData.findIndex( x => x.fieldId === fieldId ),
            1
        );
        setFabricDetails( updatedData );
    };
    const handleAddAccessoriesRow = () => {
        const newRow = {
            fieldId: randomIdGenerator(),
            itemGroup: null,
            itemSubGroup: null,
            itemSubGroupArray: null,
            itemDescription: '',
            uom: null,
            processLoss: 0,
            consumptionQuantity: 0,
            costPerUnit: 0,
            inHouseConsumption: 0,
            inHouseRatePerUnit: 0,
            inHouseCostPerUnit: 0
        };
        setAccessoriesDetails( [...accessoriesDetails, newRow] );
    };
    const handleRemoveAccessoriesRow = ( fieldId ) => {
        const updatedData = [...accessoriesDetails];
        updatedData.splice(
            updatedData.findIndex( x => x.fieldId === fieldId ),
            1
        );
        setAccessoriesDetails( updatedData );
    };

    const handleItemGroupForFabric = ( newValue, fieldId ) => {
        const updatedData = fabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemGroup = newValue;
                i.itemSubGroupArray = newValue.sub;
            }
            return i;
        } );
        setFabricDetails( updatedData );

    };
    const handleItemSubGroupForFabric = ( newValue, fieldId ) => {
        const updatedData = fabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemSubGroup = newValue;
            }
            return i;
        } );
        setFabricDetails( updatedData );
    };
    const handleItemGroupForAccessories = ( newValue, fieldId ) => {
        const updatedData = accessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemGroup = newValue;
                i.itemSubGroupArray = newValue.sub;
            }
            return i;
        } );
        setAccessoriesDetails( updatedData );
    };
    const handleItemSubGroupForAccessories = ( newValue, fieldId ) => {
        const updatedData = accessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemSubGroup = newValue;
            }
            return i;
        } );
        setAccessoriesDetails( updatedData );
    };
    const handleUnitChangeForFabric = ( newValue, fieldId ) => {
        const updatedData = fabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.uom = newValue.label;
            }
            return i;
        } );
        setFabricDetails( updatedData );
    };
    const handleUnitChangeForAccessories = ( newValue, fieldId ) => {
        const updatedData = accessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.uom = newValue.label;
            }
            return i;
        } );
        setAccessoriesDetails( updatedData );
    };

    const handleOnChangeForFabric = ( e, fieldId ) => {
        const { name, value, type } = e.target;
        const updateData = fabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i[name] = type === "number" ? Number( value ) : value;
            }
            return i;
        } );
        setFabricDetails( updateData );
    };

    const handleOnChangeForAccessories = ( e, fieldId ) => {
        const { name, value, type } = e.target;
        const updateData = accessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i[name] = type === "number" ? Number( value ) : value;
            }
            return i;
        } );
        setAccessoriesDetails( updateData );
    };


    const sumOfInHouseAmountTotal = () => {
        const total = _.sum( costingSummery.map( i => Number( i.inHouseAmount ) ) );
        return total;
    };
    const sumOfBuyerAmountTotal = () => {
        const total = _.sum( costingSummery.map( i => Number( i.buyerAmount ) ) );
        return total;
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
            <TabContent activeTab={active} style={{ backgroundColor: 'white', border: 'solid #dddddd 1px' }}>
                <TabPane tabId='1'>
                    <div>
                        <ResizableTable
                            mainClass="resizeFab"
                            tableId="fabricTableId"
                            className="pre-costing-details-table table-bordered"
                            size="sm" responsive={true}
                        >
                            <thead className='thead-dark' >
                                <tr >
                                    <th className=' text-center'><strong>Item Group</strong></th>
                                    <th className='text-center'><strong>Item Sub</strong></th>
                                    <th className='text-center'><strong>Item Description</strong></th>
                                    <th className='text-center'><strong>UOM</strong></th>
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
                                    fabricDetails.map( i => (
                                        <tr key={i.fieldId} >
                                            <td style={{ width: '105px' }} >
                                                <CreatableSelect
                                                    id={`itemGroupId-${i.fieldId}`}
                                                    isClearable={false}
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    theme={selectThemeColors}
                                                    options={selectItemGroups}
                                                    classNamePrefix='select'
                                                    // innerRef={register( { required: true } )}
                                                    className={classnames( 'costing-select ' )}
                                                    value={fabricDetails?.itemGroup}
                                                    onChange={data => {
                                                        handleItemGroupForFabric( data, i.fieldId );
                                                    }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <CreatableSelect
                                                    id={`itemSubGroupId-${i.fieldId}`}
                                                    isClearable={false}
                                                    isSearchable
                                                    theme={selectThemeColors}
                                                    menuPosition={'fixed'}
                                                    options={i.itemSubGroupArray}
                                                    classNamePrefix='select'
                                                    // innerRef={register( { required: true } )}
                                                    className={classnames( 'costing-select' )}
                                                    value={fabricDetails.itemSubGroup}
                                                    onChange={data => {
                                                        handleItemSubGroupForFabric( data, i.fieldId );
                                                    }}
                                                />
                                            </td>
                                            <td style={{ width: '405px' }} >
                                                <Input placeholder="Description" bsSize="sm" />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <CreatableSelect
                                                    id='unitId'
                                                    isClearable={false}
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    theme={selectThemeColors}
                                                    options={selectUnits}
                                                    classNamePrefix='select'
                                                    // innerRef={register( { required: true } )}
                                                    className={classnames( 'costing-select' )}
                                                    value={fabricDetails.uom}
                                                    onChange={data => {
                                                        handleUnitChangeForFabric( data, i.fieldId );
                                                    }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <Input
                                                    id={`processLoss-${i.fieldId}`}
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    name="processLoss"
                                                    value={i.processLoss}
                                                    placeholder="0"
                                                    onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
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
                                                    onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <Input
                                                    id={`costPerUnit-${i.fieldId}`}
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    name="costPerUnit"
                                                    value={i.costPerUnit}
                                                    placeholder="0"
                                                    onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }}>
                                                <Input
                                                    id={`inHouseConsumption-${i.fieldId}`}
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    name="inHouseConsumption"
                                                    value={i.inHouseConsumption}
                                                    placeholder="0"
                                                    onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <Input
                                                    id={`inHouseRatePerUnit-${i.fieldId}`}
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    name="inHouseRatePerUnit"
                                                    value={i.inHouseRatePerUnit}
                                                    placeholder="0"
                                                    onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <Input
                                                    id={`inHouseCostPerUnit-${i.fieldId}`}
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    name="inHouseCostPerUnit"
                                                    value={i.inHouseCostPerUnit}
                                                    placeholder="0"
                                                    onChange={e => { handleOnChangeForFabric( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}

                                                />
                                            </td>
                                            <td style={{ width: '85px' }} >
                                                <span>
                                                    <Button.Ripple id="deleteFabId" tag={Label} disabled={( fabricDetails.length === 1 )} onClick={() => { handleRemoveFabricRow( i.fieldId ); }} className='btn-icon' color='flat-danger' >
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


                    <Button.Ripple id="addFabId" tag={Label} onClick={() => { handleAddFabricRow(); }} className='btn-icon' color='flat-success' >
                        <PlusSquare id="addFabId" color="green" />
                    </Button.Ripple>
                </TabPane>
                <TabPane tabId='2' >
                    <div >
                        <ResizableTable
                            mainClass="resizeAccess"
                            tableId="accessTable"
                            className="pre-costing-details-table table-bordered"
                            size="sm"
                            responsive={true}
                        >
                            <thead className='thead-dark' >
                                <tr >
                                    <th className=' text-center'><strong>Item Group</strong></th>
                                    <th className='text-center'><strong>Item Sub</strong></th>
                                    <th className='text-center'><strong>Item Description</strong></th>
                                    <th className='text-center'><strong>UOM</strong></th>
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
                                    accessoriesDetails.map( i => (
                                        <tr key={i.fieldId} >
                                            <td style={{ width: '105px' }} >
                                                <CreatableSelect
                                                    id='itemGroupId'
                                                    isClearable={false}
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    theme={selectThemeColors}
                                                    options={selectItemGroups}
                                                    classNamePrefix='select'
                                                    // innerRef={register( { required: true } )}
                                                    className={classnames( 'costing-select ' )}
                                                    value={accessoriesDetails.itemGroup}
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
                                                    classNamePrefix='select'
                                                    // innerRef={register( { required: true } )}
                                                    className={classnames( 'costing-select' )}
                                                    value={accessoriesDetails.itemSubGroup}
                                                    onChange={data => {
                                                        handleItemSubGroupForAccessories( data, i.fieldId );
                                                    }}
                                                />
                                            </td>
                                            <td style={{ width: '405px' }} >
                                                <Input placeholder="Description" bsSize="sm" />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <CreatableSelect
                                                    id='unitId'
                                                    isClearable={false}
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    theme={selectThemeColors}
                                                    options={selectUnits}
                                                    classNamePrefix='select'
                                                    // innerRef={register( { required: true } )}
                                                    className={classnames( 'costing-select' )}
                                                    value={accessoriesDetails.uom}
                                                    onChange={data => {
                                                        handleUnitChangeForAccessories( data, i.fieldId );
                                                    }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <Input
                                                    id={`processLoss-${i.fieldId}`}
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    name="processLoss"
                                                    value={i.processLoss}
                                                    placeholder="0"
                                                    onChange={e => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
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
                                                <Input
                                                    id={`costPerUnit-${i.fieldId}`}
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    name="costPerUnit"
                                                    value={i.costPerUnit}
                                                    placeholder="0"
                                                    onChange={e => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }}>
                                                <Input
                                                    id={`inHouseConsumption-${i.fieldId}`}
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    name="inHouseConsumption"
                                                    value={i.inHouseConsumption}
                                                    placeholder="0"
                                                    onChange={e => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <Input
                                                    id={`inHouseRatePerUnit-${i.fieldId}`}
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    name="inHouseRatePerUnit"
                                                    value={i.inHouseRatePerUnit}
                                                    placeholder="0"
                                                    onChange={e => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td style={{ width: '105px' }} >
                                                <Input
                                                    id={`inHouseCostPerUnit-${i.fieldId}`}
                                                    className="text-right"
                                                    bsSize="sm"
                                                    type='number'
                                                    name="inHouseCostPerUnit"
                                                    value={i.inHouseCostPerUnit}
                                                    placeholder="0"
                                                    onChange={e => { handleOnChangeForAccessories( e, i.fieldId ); }}
                                                    onFocus={e => { e.target.select(); }}
                                                />
                                            </td>
                                            <td style={{ width: '85px' }} >
                                                <span>
                                                    <Button.Ripple id="deleteAccId" tag={Label} disabled={( accessoriesDetails.length === 1 )} onClick={() => { handleRemoveAccessoriesRow( i.fieldId ); }} className='btn-icon' color='flat-danger' >
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

                    <Button.Ripple id="addAccId" tag={Label} onClick={() => { handleAddAccessoriesRow(); }} className='btn-icon' color='flat-success' >
                        <PlusSquare id="addAccId" color="green" />
                    </Button.Ripple>
                </TabPane>
            </TabContent>
        </>
    );
};
export default PreCostingDetails;


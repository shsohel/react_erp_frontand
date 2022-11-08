import '@custom-styles/merchandising/others/consumption-pak-table.scss';
import React, { useEffect, useState } from 'react';
import { MinusSquare } from 'react-feather';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, CustomInput, Input, Label, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { baseAxios } from '../../../../services';
import { inventoryApi } from '../../../../services/api-end-points/inventory';
import ResizableTable from '../../../../utility/custom/ResizableTable';
import { selectPurchaseType } from '../../../../utility/enums';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownPackItemGroupsByGroupName } from '../../../inventory/item-group/store/actions';
import { getCurrencyDropdown } from '../../currency/store/actions';
import { bindConsumptionPackagingAccessories } from '../store/actions';
import ConsumptionDescriptionGeneratorPackAccessories from './ConsumptionDescriptionGeneratorPackAccessories';

const ConsumptionPackagingAccessories = () => {
    const dispatch = useDispatch();
    const { consumptionPackagingAccessories, consumptionBasicInfo } = useSelector( ( { consumptions } ) => consumptions );
    const { dropDownPackItemGroups } = useSelector( ( { itemGroups } ) => itemGroups );
    const [descriptionModalObj, setDescriptionModalObj] = useState( null );
    const [openDescriptionModal, setOpenDescriptionModal] = useState( false );
    const [active, setActive] = useState( consumptionPackagingAccessories[0]?.orderId || 1 );
    const { currencyDropdown } = useSelector( ( { currencies } ) => currencies );

    const { defaultUOMDropdown } = useSelector( ( { unitSets } ) => unitSets );
    const defaultUOMSet = defaultUOMDropdown?.find( uom => uom?.isBaseUnit === true );


    const toggle = tab => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };


    useEffect( () => {
        setActive( consumptionPackagingAccessories[0]?.orderId );
    }, [active === undefined, consumptionPackagingAccessories[0]?.orderId !== undefined] );


    console.log( consumptionPackagingAccessories[0]?.orderId, active );

    const handleCurrencyOnFocus = () => {
        dispatch( getCurrencyDropdown() );
    };

    const handleItemGroupDropdown = ( data, rowId ) => {
        const updatedData = consumptionPackagingAccessories.map( d => ( {
            ...d,
            details: d.details.map( detail => {
                if ( rowId === detail.rowId ) {
                    detail.itemGroup = data;
                    detail.itemSubGroup = null;
                    detail.itemSubGroupArray = [];
                }
                return detail;
            } )
        } ) );
        dispatch( bindConsumptionPackagingAccessories( updatedData ) );
    };
    const handleItemSubGroupOnFocus = ( itemGroupId, rowId ) => {
        const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/subCategories`;
        baseAxios.get( endPoint ).then( ( response ) => {
            const updatedData = consumptionPackagingAccessories.map( d => ( {
                ...d,
                details: d.details.map( detail => {
                    if ( rowId === detail.rowId ) {
                        detail.itemSubGroupArray = response?.data?.map( ( rd ) => ( {
                            value: rd.id,
                            label: rd.name
                        } ) );
                    }
                    return detail;
                } )
            } ) );
            dispatch( bindConsumptionPackagingAccessories( updatedData ) );
        } );
    };
    const handleItemSubGroupDropdown = ( data, rowId ) => {
        const updatedData = consumptionPackagingAccessories.map( d => ( {
            ...d,
            details: d.details.map( detail => {
                if ( rowId === detail.rowId ) {
                    detail.itemSubGroup = data;
                }
                return detail;
            } )
        } ) );
        dispatch( bindConsumptionPackagingAccessories( updatedData ) );
    };
    const handleItemDescriptionOnFocus = () => { };
    const handleItemDescriptionDropdown = () => { };

    const handleDescriptionModalOpen = ( itemGroupId, consumptionFieldId ) => {
        console.log( itemGroupId );
        setDescriptionModalObj( { itemGroupId, consumptionFieldId } );
        setOpenDescriptionModal( !openDescriptionModal );
    };

    const handleConsumptionUOMOnFocus = ( defaultUomSetId, uomArray, rowId ) => {
        if ( !uomArray.length && defaultUomSetId ) {
            baseAxios.get( `${inventoryApi.unitSet.root}/${defaultUomSetId}` )
                .then( response => {
                    const consumptionUomArray = response?.data?.details?.map( uom => ( {
                        value: uom.id,
                        label: uom.unitName,
                        relativeFactor: uom.relativeFactor
                    } ) );
                    const updatedData = consumptionPackagingAccessories.map( d => ( {
                        ...d,
                        details: d.details.map( detail => {
                            if ( rowId === detail.rowId ) {
                                detail.consumptionUomArray = consumptionUomArray;
                            }
                            return detail;
                        } )
                    } ) );
                    dispatch( bindConsumptionPackagingAccessories( updatedData ) );
                } );
        }
    };

    const handleConsumptionUOMChange = ( data, rowId ) => {
        const updatedData = consumptionPackagingAccessories.map( d => ( {
            ...d,
            details: d.details.map( detail => {
                if ( rowId === detail.rowId ) {
                    detail.consumptionUom = data;
                    detail.consumptionUomRelativeFactor = data?.relativeFactor;
                }
                return detail;
            } )
        } ) );
        dispatch( bindConsumptionPackagingAccessories( updatedData ) );
    };

    ///Input Change
    const handleOnChangePackAccessories = ( e, rowId ) => {
        const { name, value, type, checked } = e.target;

        const updatedData = consumptionPackagingAccessories.map( d => ( {
            ...d,
            details: d.details.map( detail => {
                if ( rowId === detail.rowId ) {
                    // detail[name] = type === 'number' ? Number( value ) : value;
                    detail[name] = type === "number" ? Number( value ) : type === "checkbox" ? checked : ( name === 'wastagePercent' || name === 'ratePerUnit' ) ? Number( value ) : value;
                }
                return detail;
            } )
        } ) );

        dispatch( bindConsumptionPackagingAccessories( updatedData ) );
    };

    const handleRemoveAccessoriesDetailsRow = ( rowId, mainRowId ) => {
        const updatedData = consumptionPackagingAccessories.map( d => ( {
            ...d,
            details: d.details.filter( detail => detail.rowId !== rowId )
        } ) );

        const detailsEmptyLengthRemove = updatedData.filter( d => d.details.length );
        console.log();
        dispatch( bindConsumptionPackagingAccessories( detailsEmptyLengthRemove ) );
    };


    const handleOrderUomDropdownForPackAccessories = ( data, rowId ) => {
        const updatedData = consumptionPackagingAccessories.map( d => ( {
            ...d,
            details: d.details.map( detail => {
                if ( rowId === detail.rowId ) {
                    detail.orderUom = data;
                    detail.orderUomRelativeFactor = data?.relativeFactor;
                }
                return detail;
            } )
        } ) );
        dispatch( bindConsumptionPackagingAccessories( updatedData ) );

    };
    const handleOrderUomOnFocusForPackAccessories = async ( defaultUomSetId, uomArray, rowId ) => {
        console.log( 'uom' );
        if ( !dropDownPackItemGroups.length ) {
            dispatch( getDropDownPackItemGroupsByGroupName( "Packaging%20and%20Labeling" ) );
        }

        console.log( 'default', defaultUomSetId );

        if ( !uomArray.length && defaultUomSetId ) {
            await baseAxios.get( `${inventoryApi.unitSet.root}/${defaultUomSetId}` )
                .then( response => {
                    console.log( response );
                    const orderUomArray = response?.data?.details?.map( uom => ( {
                        value: uom.id,
                        label: uom.unitName,
                        relativeFactor: uom.relativeFactor
                    } ) );
                    const updatedData = consumptionPackagingAccessories.map( d => ( {
                        ...d,
                        details: d.details.map( detail => {
                            if ( rowId === detail.rowId ) {
                                detail.orderUomArray = orderUomArray;
                            }
                            return detail;
                        } )
                    } ) );
                    dispatch( bindConsumptionPackagingAccessories( updatedData ) );
                } );
        }
    };

    const handleCurrencyDropdownForAccessories = ( data, rowId ) => {
        const updatedData = consumptionPackagingAccessories.map( d => ( {
            ...d,
            details: d.details.map( detail => {
                if ( rowId === detail.rowId ) {
                    detail.currencyCode = data;
                }
                return detail;
            } )
        } ) );
        dispatch( bindConsumptionPackagingAccessories( updatedData ) );
    };
    const handlePurchaseTypeDropdownForAccessories = ( data, rowId ) => {
        const updatedData = consumptionPackagingAccessories.map( d => ( {
            ...d,
            details: d.details.map( detail => {
                if ( rowId === detail.rowId ) {
                    detail.purchaseType = data;
                }
                return detail;
            } )
        } ) );
        dispatch( bindConsumptionPackagingAccessories( updatedData ) );
    };


    return (
        <div className='nav-vertical'>
            <Nav tabs className='nav-left border-right'>
                {
                    consumptionPackagingAccessories.map( t => (
                        <NavItem key={t.rowId}>
                            <NavLink
                                active={active === t.orderId}
                                onClick={() => {
                                    toggle( t.orderId );
                                }}
                            >
                                {t.orderNumber}
                            </NavLink>
                        </NavItem>
                    ) )
                }

            </Nav>
            <TabContent activeTab={active}>
                {
                    consumptionPackagingAccessories.map( t => (
                        <TabPane
                            key={t.rowId}
                            tabId={t.orderId}
                            className=" "
                        >
                            <ResizableTable
                                mainClass={`resizeAccess-${randomIdGenerator().toString()}`}
                                tableId={`accessTable-${randomIdGenerator().toString()}`}
                                className="consumption-pak-table table-bordered"
                                size="sm"
                                responsive={true}
                            >
                                <thead className='thead-light' >
                                    <tr >
                                        <th className='text-center sl'><strong>SL</strong></th>
                                        <th style={{ minWidth: '180px' }} className=' text-center'><strong>Item Group</strong></th>
                                        <th style={{ minWidth: '180px' }} className='text-center'><strong>Item Sub</strong></th>
                                        <th className='text-center'><strong>Item Description</strong></th>
                                        <th className='text-center'><strong>Cons. UOM</strong></th>
                                        <th className='text-center'><strong>Process Loss(%)</strong></th>
                                        <th className='text-center'><strong>Cons(Qty.)</strong></th>
                                        <th className='text-center'><strong>Rate Per Unit</strong></th>

                                        <th className='text-center'><strong>Order Uom</strong></th>
                                        <th className='text-center'><strong>Currency</strong></th>
                                        <th className='text-center'><strong>Purchase Type</strong></th>

                                        <th className='text-center'><strong>Is Approved?</strong></th>
                                        <th className='text-center action'><strong>Action</strong></th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {
                                        t.details?.map( ( acc, index ) => (
                                            <tr key={acc.rowId} >
                                                <td className='sl' >{index + 1}</td>
                                                <td style={{ width: '105px' }} >
                                                    <Select
                                                        id='itemGroupId'
                                                        pageSize={4}
                                                        isDisabled
                                                        isClearable={false}
                                                        isSearchable
                                                        menuPosition={'fixed'}
                                                        theme={selectThemeColors}
                                                        options={dropDownPackItemGroups}
                                                        classNamePrefix='dropdown'
                                                        className='erp-dropdown-select'
                                                        value={acc.itemGroup}
                                                        onChange={data => {
                                                            handleItemGroupDropdown( data, acc.rowId );
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ width: '105px' }} >
                                                    <Select
                                                        id='itemSubGroupId'
                                                        isClearable
                                                        isLoading={!acc.itemSubGroupArray}
                                                        isSearchable
                                                        isDisabled
                                                        menuPosition={'fixed'}
                                                        theme={selectThemeColors}
                                                        options={acc?.itemSubGroupArray}
                                                        classNamePrefix='dropdown'
                                                        className='erp-dropdown-select'
                                                        value={acc.itemSubGroup}
                                                        onFocus={() => { handleItemSubGroupOnFocus( acc?.itemGroup?.value, acc.rowId ); }}
                                                        onChange={data => {
                                                            handleItemSubGroupDropdown( data, acc.rowId );
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ minWidth: '405px' }} >
                                                    <div className="d-flex w-100  align-items-center">

                                                        <Select
                                                            options={acc.itemDescriptionArray}
                                                            value={acc.itemDescriptionValue}
                                                            isClearable
                                                            isDisabled
                                                            menuPosition="fixed"
                                                            classNamePrefix='dropdown'
                                                            className='erp-dropdown-select w-100'
                                                            // menuPlacement="top"
                                                            onFocus={() => { handleItemDescriptionOnFocus( acc.itemGroupId, acc.itemSubGroupId, acc.rowId ); }}
                                                            onChange={data => {
                                                                handleItemDescriptionDropdown( data, acc.rowId );
                                                            }}
                                                        />

                                                    </div>
                                                </td>

                                                <td style={{ width: '105px' }} >
                                                    <Select
                                                        id='consumptionUnitId'
                                                        isClearable
                                                        isLoading={!acc.consumptionUomArray.length}
                                                        isSearchable
                                                        isDisabled
                                                        menuPosition="fixed"
                                                        theme={selectThemeColors}
                                                        options={acc.consumptionUomArray}
                                                        classNamePrefix='dropdown'
                                                        className="erp-dropdown-select"
                                                        value={acc?.consumptionUom}

                                                        onFocus={() => {
                                                            handleConsumptionUOMOnFocus(
                                                                dropDownPackItemGroups?.find( item => item.value === acc.itemGroupId )?.defaultUomSetId, acc.consumptionUomArray, acc.rowId );
                                                        }}
                                                        onChange={data => {
                                                            handleConsumptionUOMChange( data, acc.rowId );
                                                        }}
                                                    />
                                                </td>

                                                <td style={{ minWidth: '115px' }} >

                                                    <NumberFormat
                                                        className="form-control-sm form-control text-right"
                                                        id={`wastagePercent-${acc.rowId}`}
                                                        displayType="input"
                                                        name="wastagePercent"
                                                        value={acc.wastagePercent}
                                                        decimalScale={4}
                                                        disabled={acc.isApproved}
                                                        fixedDecimalScale={true}
                                                        allowNegative={false}
                                                        allowLeadingZeros={false}
                                                        onFocus={e => {
                                                            e.target.select();
                                                        }}
                                                        onChange={e => { handleOnChangePackAccessories( e, acc.rowId ); }}
                                                    />
                                                </td>
                                                <td style={{ width: '105px' }}>
                                                    <Input
                                                        id={`consumptionQuantity-${acc.rowId}`}
                                                        className="text-right"
                                                        bsSize="sm"
                                                        disabled
                                                        type='number'
                                                        name="consumptionQuantity"
                                                        value={acc.consumptionQuantity}
                                                        placeholder="0"
                                                        onChange={e => { handleOnChangePackAccessories( e, acc.rowId ); }}
                                                        onFocus={e => { e.target.select(); }}
                                                    />
                                                </td>
                                                <td style={{ width: '105px' }} >

                                                    <NumberFormat
                                                        className="form-control-sm form-control text-right"
                                                        id={`ratePerUnit-${acc.rowId}`}
                                                        displayType="input"
                                                        value={acc.ratePerUnit}
                                                        name="ratePerUnit"

                                                        decimalScale={4}
                                                        disabled={acc.isApproved}
                                                        fixedDecimalScale={true}
                                                        allowNegative={false}
                                                        allowLeadingZeros={false}
                                                        onFocus={e => {
                                                            e.target.select();
                                                        }}
                                                        onChange={e => { handleOnChangePackAccessories( e, acc.rowId ); }}
                                                    />
                                                </td>
                                                <td >
                                                    <Select
                                                        id='orderUOMId'
                                                        name="orderUOM"
                                                        isDisabled={acc.isApproved}
                                                        isSearchable
                                                        menuPosition="fixed"
                                                        theme={selectThemeColors}
                                                        options={acc.orderUomArray}
                                                        classNamePrefix="dropdown"
                                                        className="erp-dropdown-select"
                                                        value={acc.orderUom}
                                                        onChange={data => {
                                                            handleOrderUomDropdownForPackAccessories( data, acc.rowId );
                                                        }}
                                                        onFocus={() => {
                                                            handleOrderUomOnFocusForPackAccessories(
                                                                dropDownPackItemGroups?.find( item => item.value === acc.itemGroup?.value )?.defaultUomSetId, acc.orderUomArray, acc.rowId );
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ width: '105px' }} >
                                                    <Select
                                                        id='currencyId'
                                                        name="currencyCode"
                                                        isDisabled={acc.isApproved}
                                                        isClearable={false}
                                                        isSearchable
                                                        menuPosition={'fixed'}
                                                        theme={selectThemeColors}
                                                        options={currencyDropdown}
                                                        classNamePrefix="dropdown"
                                                        className="erp-dropdown-select"
                                                        value={acc.currencyCode}
                                                        onChange={data => {
                                                            handleCurrencyDropdownForAccessories( data, acc.rowId );
                                                        }}
                                                        onFocus={() => { handleCurrencyOnFocus(); }}
                                                    />
                                                </td>
                                                <td  >
                                                    <Select
                                                        id='purchaseTypeId'
                                                        name="purchaseType"
                                                        isDisabled={acc.isApproved}
                                                        isClearable={false}
                                                        isSearchable
                                                        menuPosition={'fixed'}
                                                        theme={selectThemeColors}
                                                        options={selectPurchaseType}
                                                        classNamePrefix="dropdown"
                                                        className="erp-dropdown-select"
                                                        value={acc.purchaseType}
                                                        onChange={data => {
                                                            handlePurchaseTypeDropdownForAccessories( data,
                                                                acc.rowId );
                                                        }}
                                                    />
                                                </td>

                                                <td style={{ width: '105px' }} >
                                                    <span className="d-flex justify-content-center">
                                                        <CustomInput
                                                            id={`isApproved-${acc.rowId}`}
                                                            name='isApproved'
                                                            type='checkbox'
                                                            checked={acc.isApproved}
                                                            onChange={e => handleOnChangePackAccessories( e, acc.rowId )}
                                                        />
                                                    </span>
                                                </td>
                                                <td className='action' >
                                                    <span>
                                                        <Button.Ripple
                                                            id="deleteAccId"
                                                            tag={Label}
                                                            disabled={acc.isApproved}
                                                            // disabled={( t.details.length === 1 )}
                                                            onClick={() => { handleRemoveAccessoriesDetailsRow( acc.rowId, t.rowId ); }}
                                                            className='btn-icon p-0'
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
                                            </tr>
                                        ) )
                                    }

                                </tbody>
                            </ResizableTable>
                            {/* <Button.Ripple id="addAccId" tag={Label} onClick={() => { handleAddAccessoriesRow( t.orderId, t.orderNumber ); }} className='btn-icon' color='flat-success' >
                                <PlusSquare id="addAccId" color="green" />
                            </Button.Ripple> */}
                        </TabPane>
                    ) )
                }

            </TabContent>
            {/* <Button.Ripple hidden={consumptionPackagingAccessories.length !== 0} id="addAccId" tag={Label} onClick={() => { handleAddAccessoriesRowFromEmpty(); }} className='btn-icon' color='flat-success' >
                <PlusSquare id="addAccId" color="green" />
            </Button.Ripple> */}

            {
                ( descriptionModalObj && openDescriptionModal ) &&
                <ConsumptionDescriptionGeneratorPackAccessories
                    descriptionModalObj={descriptionModalObj}
                    openModal={openDescriptionModal}
                    setOpenModal={setOpenDescriptionModal}
                />
            }
        </div>
    );
};

export default ConsumptionPackagingAccessories;
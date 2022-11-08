import '@custom-styles/merchandising/others/pre-costing-collapse.scss';
import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import '@custom-styles/merchandising/select/pre-costing-select.scss';
import { baseAxios } from "@services";
import _ from 'lodash';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { X } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Col, Label, Nav, NavItem, NavLink, Row } from 'reactstrap';
import { inventoryApi } from '../../../../services/api-end-points/inventory';
import { notify } from '../../../../utility/custom/notifications';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownFabricItemGroupsByGroupName, getDropDownPackItemGroupsByGroupName, getDropDownTrimItemGroupsByGroupName, getItemSegmentArrayByItemGroupId } from '../../../inventory/item-group/store/actions';
import { bindConsumptionAccessoriesDetails, bindConsumptionFabricDetails, getConsumptionPackagingAccessories, getItemSubGroupForConsumptionAccessories, getItemSubGroupForConsumptionFabric } from '../store/actions';
import ExpandableAccessoriesDetails from './ExpandableAccessoriesDetails';
import ExpandableFabricDetails from './ExpandableFabricDetails';

const ConsumptionDetailsForm = () => {
    const dispatch = useDispatch();
    const {
        consumptionFabricDetails,
        consumptionAccessoriesDetails,
        consumptionBasicInfo,
        isConsumptionDataLoaded,
        consumptionPurchaseOrderSizes,
        consumptionPurchaseOrderColors
    } = useSelector( ( { consumptions } ) => consumptions );

    const { dropDownFabricItemGroups, dropDownTrimItemGroups } = useSelector( ( { itemGroups } ) => itemGroups );
    const [active, setActive] = useState( '1' );
    const { defaultUOMDropdown } = useSelector( ( { unitSets } ) => unitSets );
    const defaultUOMSet = defaultUOMDropdown?.find( uom => uom?.isBaseUnit === true );


    useEffect( () => {
        dispatch( getDropDownPackItemGroupsByGroupName( "Packaging%20and%20Labeling" ) );
        dispatch( getDropDownFabricItemGroupsByGroupName( "Fabric" ) );
        dispatch( getDropDownTrimItemGroupsByGroupName( "Accessories" ) );

    }, [] );


    const handleFabricItemOnFocus = () => {
        dispatch( getDropDownFabricItemGroupsByGroupName( "Fabric" ) );
    };
    const handleAccessoriesItemOnFocus = () => {
        dispatch( getDropDownTrimItemGroupsByGroupName( "Accessories" ) );
    };

    const handleItemSegments = ( itemGroupId, itemSegments, itemSubGroupId, expanded, type ) => {
        const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segments`;

        const getExitingSegmentValue = ( segmentId, itemDescriptionTemplate ) => {
            const itemDecExit = itemDescriptionTemplate ? JSON.parse( itemDescriptionTemplate ) : [];
            const value = {
                label: itemDecExit.find( i => i.id === segmentId )?.value,
                value: itemDecExit.find( i => i.id === segmentId )?.value
            };
            return value;
        };

        if ( itemGroupId && !itemSegments.length ) {
            baseAxios.get( endPoint )
                .then( response => {
                    const responseArray = response?.data?.map( rd => ( {

                        itemGroupId,
                        isColorSensitive: rd.isColorSensitive,
                        isSizeSensitive: rd.isSizeSensitive,
                        segment: rd.segmentName,
                        segmentId: rd.segmentId,
                        segmentValues: [],
                        value: null
                    } ) );
                    if ( type === "Fabric" ) {
                        const updatedData = consumptionFabricDetails.map( fabric => {
                            if ( itemGroupId === fabric.itemGroupId && itemSubGroupId === fabric.itemSubGroupId ) {
                                fabric.itemSegments = responseArray.map( s => ( {
                                    ...s,
                                    rowId: randomIdGenerator(),
                                    value: getExitingSegmentValue( s.segmentId, fabric.itemDescriptionTemplate )?.label?.length ? getExitingSegmentValue( s.segmentId, fabric.itemDescriptionTemplate ) : null
                                } ) );
                                fabric.expanded = expanded;
                            }
                            return fabric;
                        } );
                        dispatch( bindConsumptionFabricDetails( updatedData ) );
                    } else {
                        const updatedData = consumptionAccessoriesDetails.map( acc => {
                            if ( itemGroupId === acc.itemGroupId && itemSubGroupId === acc.itemSubGroupId ) {
                                acc.itemSegments = responseArray.map( s => ( {
                                    ...s,
                                    rowId: randomIdGenerator(),
                                    value: getExitingSegmentValue( s.segmentId, acc.itemDescriptionTemplate )?.label?.length ? getExitingSegmentValue( s.segmentId, acc.itemDescriptionTemplate ) : null
                                } ) );
                                acc.expanded = expanded;
                            }
                            return acc;
                        } );
                        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
                    }

                } );
        }
    };
    //Fabric
    const handleItemGroupDropdownForFabric = async ( newValue, fieldId ) => {

        const updatedData = consumptionFabricDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemGroup = newValue;
                i.itemGroupId = newValue?.value;
                i.itemSubGroupArray = [];
                i.itemSubGroup = null;
                i.itemSubGroupId = 0;
                i.consumptionUomArray = [];
                i.orderUOM = newValue?.orderUom;
                i.consumptionUom = newValue?.consumptionUom;
                i.consumptionUomValue = {
                    value: newValue?.consumptionUomId,
                    label: newValue?.consumptionUom
                };
                i.orderUOMValue = {
                    value: newValue?.orderUomId,
                    label: newValue?.orderUom
                };
                i.defaultUomSetId = newValue?.defaultUomSetId;
            }
            return i;
        } );

        dispatch( bindConsumptionFabricDetails( updatedData ) );


        if ( newValue ) {
            await baseAxios.get( `${inventoryApi.itemGroup.root}/${newValue?.value}/subCategories` ).then( response => {
                const updatedData = consumptionFabricDetails.map( i => {
                    if ( fieldId === i.fieldId ) {
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
        }


    };

    const handleItemSubGroupDropdownForFabric = ( newValue, fieldId, itemGroup ) => {
        const isDuplicateItem = consumptionFabricDetails.some( ft => ft.itemSubGroupId === newValue?.value && ft.itemGroup?.value === itemGroup?.value );

        if ( isDuplicateItem ) {
            notify( 'default', 'Item Group and Sub Group row already existing!!!' );

        } else {
            const updatedData = consumptionFabricDetails.map( i => {
                if ( fieldId === i.fieldId ) {
                    i.itemSubGroup = newValue;
                    i.itemSubGroupId = newValue?.value;

                }
                return i;
            } );
            const isExpandable = !!newValue?.value;
            const { itemGroupId, itemSegments } = consumptionFabricDetails.find( fd => fd.fieldId === fieldId );
            handleItemSegments( itemGroupId, itemSegments, newValue?.value, isExpandable, 'Fabric' );

            dispatch( bindConsumptionFabricDetails( updatedData ) );
        }

    };


    const toggle = tab => {
        if ( active !== tab ) {
            setActive( tab );
            if ( tab === "3" ) {
                //
                const queryData = consumptionBasicInfo?.styleOrderDetails.map( ( order ) => ( {
                    orderId: order.orderId,
                    setStyleId: order.setStyleId,
                    styleId: order.styleId,
                    costingId: order.styleCostingId,
                    shipmentDate: order.shipmentDate
                } ) );
                dispatch( getConsumptionPackagingAccessories( queryData ) );

            }
        }
    };


    const handleFabricExpandRowOnClick = ( row ) => {
        if ( row.itemGroupId ) {
            // setDescriptionModalObj( {
            //     itemGroupId,
            //     consumptionFieldId,
            //     itemDescriptionTemplate,
            //     itemGroup: itemGroup?.label,
            //     itemSubGroup: itemSubGroup?.label
            // } );
            // setOpenDescriptionModal( !openDescriptionModal );
            dispatch( getItemSegmentArrayByItemGroupId( row.itemGroupId ) );

        } else {
            notify( 'warning', 'Please select a item group!!!' );
        }

    };
    const getFabricTotalStatus = ( row ) => {
        const filteredFabric = consumptionFabricDetails.filter( fabric => fabric.itemGroupId === row.itemGroupId && fabric.itemSubGroupId === row.itemSubGroupId );
        const fabricStatus = filteredFabric.map( fabric => fabric.isApproved );
        let status = '';

        if ( fabricStatus.every( i => i === true ) ) {
            status = 'Approved';
            return status;
        } else {
            if ( fabricStatus.some( i => i === true ) ) {
                status = 'Partial';
            } else {
                status = 'None';
            }
            return status;
        }


    };
    const getAccessoriesTotalStatus = ( row ) => {
        const filteredAccessories = consumptionAccessoriesDetails.filter( fabric => fabric.itemGroupId === row.itemGroupId && fabric.itemSubGroupId === row.itemSubGroupId );
        const accessoriesStatus = filteredAccessories.map( fabric => fabric.isApproved );
        let status = '';

        if ( accessoriesStatus.every( i => i === true ) ) {
            status = 'Approved';
            return status;
        } else {
            if ( accessoriesStatus.some( i => i === true ) ) {
                status = 'Partial';
            } else {
                status = 'None';
            }
            return status;
        }


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
            itemSegments: [],
            consumptionQuantity: 0,
            defaultUomSetId: null,
            consumptionUomArray: [],
            consumptionUomValue: null, // Extra
            consumptionUom: "",
            wastagePercent: 0,
            consumptionPerGarment: 1,
            consumptionPerGarmentUomValue: defaultUOMSet ? { label: defaultUOMSet.label, value: defaultUOMSet.label } : null, // Extra
            consumptionPerGarmentUom: defaultUOMSet?.label,
            consumptionPerGarmentRelativeFactor: defaultUOMSet?.relativeFactor,
            consumptionPerGarmentUomArray: [],
            consumptionUomRelativeFactor: 0,
            orderUomRelativeFactor: 0,
            orderUomArray: [],
            orderUOMValue: null, ///Extra
            orderUOM: "",

            currencyValue: { label: "USD", value: 'USD' }, //Extra
            currencyCode: 'USD',
            ratePerUnit: 0,
            baseRate: 0,
            purchaseTypeValue: { label: "IMPORT", value: 'IMPORT' }, //Extra
            purchaseType: 'IMPORT',

            isBuyerSupplied: false,
            preferredSupplierValue: null,
            preferredSupplier: "",
            remarks: "",
            statusValue: null,
            garmentPart: null,

            isBomOnShipmentQty: false,
            status: "",
            isApproved: false,
            isAllDestinationApplicable: true,
            applicableDestinations: [],
            colorSensitivityType: 3,
            sizeSensitivityType: 3,
            colorSensitivities: [],
            sizeSensitivities: [],
            isAllSizeApplicable: true,
            isAllColorApplicable: true,
            applicableSizes: [],
            applicableColors: [],
            consumptionPurchaseOrderSizes,
            consumptionPurchaseOrderColors,
            applicableColorIds: [],
            applicableSizeIds: [],
            expanded: false,
            isNew: true,
            isRestrictedToChange: false,
            approvedById: null,
            isApprovedStatus: false

        };
        dispatch( bindConsumptionFabricDetails( [...consumptionFabricDetails, newRow] ) );

    };

    const handleRemoveFabricItem = ( fieldId ) => {
        const updatedData = consumptionFabricDetails.filter( fd => fd.fieldId !== fieldId );

        dispatch( bindConsumptionFabricDetails( updatedData ) );

    };


    const handleAddAccessoriesRow = () => {
        const newRow =
        {
            fieldId: randomIdGenerator(),
            detailId: 0,
            rowNo: 0,
            costingGroupType: 2,
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
            itemSegments: [],
            consumptionQuantity: 0,
            defaultUomSetId: null,
            consumptionUomArray: [],
            consumptionUomValue: null, // Extra
            consumptionUom: "",
            wastagePercent: 0,
            consumptionPerGarment: 1,
            consumptionPerGarmentUomArray: [],
            consumptionPerGarmentUomValue: defaultUOMSet ? { label: defaultUOMSet.label, value: defaultUOMSet.label } : null, // Extra
            consumptionPerGarmentUom: defaultUOMSet?.label,
            consumptionPerGarmentRelativeFactor: defaultUOMSet?.relativeFactor,
            consumptionUomRelativeFactor: 0,
            orderUomRelativeFactor: 0,
            orderUomArray: [],
            orderUOMValue: null, ///Extra
            orderUOM: "",
            currencyValue: { label: "USD", value: 'USD' }, //Extra
            currencyCode: 'USD',
            ratePerUnit: 0,
            baseRate: 0,
            purchaseTypeValue: { label: "IMPORT", value: 'IMPORT' }, //Extra
            purchaseType: 'IMPORT',

            preferredSupplierValue: null,
            preferredSupplier: "",
            remarks: "",
            statusValue: null,
            garmentPart: null,
            status: "",
            isApproved: false,
            isAllDestinationApplicable: true,
            applicableDestinations: [],
            colorSensitivityType: 3,
            sizeSensitivityType: 3,
            colorSensitivities: [],
            sizeSensitivities: [],
            isAllSizeApplicable: true,
            isAllColorApplicable: true,
            isBomOnShipmentQty: false,
            applicableSizes: [],
            applicableColors: [],
            consumptionPurchaseOrderSizes,
            consumptionPurchaseOrderColors,
            applicableColorIds: [],
            applicableSizeIds: [],
            isBuyerSupplied: false,
            expanded: false,
            isNew: true,
            isRestrictedToChange: false,
            approvedById: null,
            isApprovedStatus: false
        };
        dispatch( bindConsumptionAccessoriesDetails( [...consumptionAccessoriesDetails, newRow] ) );
    };
    const handleRemoveAccessoriesItem = ( fieldId ) => {
        const updatedData = consumptionAccessoriesDetails.filter( fd => fd.fieldId !== fieldId );

        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );

    };
    ///For Accessories Input OnChange
    const handleItemGroupDropdownForAccessories = async ( newValue, fieldId ) => {
        const updatedData = consumptionAccessoriesDetails.map( i => {
            if ( fieldId === i.fieldId ) {
                i.itemGroup = newValue;
                i.itemGroupId = newValue?.value;
                i.itemSubGroup = null;
                i.itemSubGroupId = 0;
                i.itemSubGroupArray = [];
                i.consumptionUomArray = [];
                i.orderUOM = newValue?.orderUom;
                i.consumptionUom = newValue?.consumptionUom;
                i.consumptionUomValue = {
                    value: newValue?.consumptionUomId,
                    label: newValue?.consumptionUom
                };
                i.orderUOMValue = {
                    value: newValue?.orderUomId,
                    label: newValue?.orderUom
                };
                i.defaultUomSetId = newValue?.defaultUomSetId;
            }
            return i;
        } );
        dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
        if ( newValue ) {
            await baseAxios.get( `${inventoryApi.itemGroup.root}/${newValue?.value}/subCategories` ).then( response => {
                const updatedData = consumptionAccessoriesDetails.map( i => {
                    if ( fieldId === i.fieldId ) {
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
        }

    };
    const handleItemSubGroupDropdownForAccessories = ( newValue, fieldId, itemGroup ) => {
        const isDuplicateItem = consumptionAccessoriesDetails.some( ft => ft.itemSubGroupId === newValue?.value && ft.itemGroup?.value === itemGroup?.value );


        if ( isDuplicateItem ) {
            notify( 'default', 'Item Group and Sub Group row already existing!!!.' );

        } else {
            const updatedData = consumptionAccessoriesDetails.map( i => {
                if ( fieldId === i.fieldId ) {
                    i.itemSubGroup = newValue;
                    i.itemSubGroupId = newValue?.value;
                }
                return i;
            } );
            const isExpandable = !!newValue?.value;
            const { itemGroupId, itemSegments } = consumptionAccessoriesDetails.find( fd => fd.fieldId === fieldId );
            handleItemSegments( itemGroupId, itemSegments, newValue?.value, isExpandable, 'Accessories' );
            dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
        }

    };
    const uniqFabric = _.uniqWith(
        consumptionFabricDetails,
        ( a, b ) => a.itemGroupId === b.itemGroupId &&
            a.itemSubGroupId === b.itemSubGroupId
    );
    const uniqAccessories = _.uniqWith(
        consumptionAccessoriesDetails,
        ( a, b ) => a.itemGroupId === b.itemGroupId &&
            a.itemSubGroupId === b.itemSubGroupId
    );

    // useEffect( () => {
    //     setTimeout( function () {
    //         const isVisible = document.getElementById( 'vtn' );
    //         if ( isVisible ) {
    //             document.getElementById( "vtn" ).disabled = false;
    //         }

    //     }, 1000 );
    // } );


    return (
        <>
            <Row>
                <Col>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                active={active === '1'}
                                onClick={() => {
                                    toggle( '1' );
                                }}
                            >
                                <span>Fabric</span>

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
                        {/* <NavItem>
                            <NavLink
                                active={active === '3'}
                                onClick={() => {
                                    toggle( '3' );
                                }}
                            >
                                Pack Accessories
                            </NavLink>
                        </NavItem> */}
                    </Nav>
                    {
                        active === '1' && <div>
                            <DataTable
                                noHeader
                                responsive
                                data={uniqFabric}
                                className='consumption-dataTable'
                                persistTableHead
                                dense
                                expandableRows
                                expandableRowExpanded={row => ( row.expanded && !!row.itemSubGroup )}

                                expandableRowDisabled={row => !row.itemSubGroup}
                                onRowExpandToggled={( expanded, row ) => handleItemSegments( row.itemGroupId, row.itemSegments, row.itemSubGroupId, expanded, 'Fabric' )}
                                expandableRowsComponent={<ExpandableFabricDetails data={( data ) => data} />}
                                // expandableIcon={{ collapsed: <PlusSquare id='' />, expanded: <svg>...</svg> }}
                                columns={[
                                    {
                                        id: "slId",
                                        reorder: true,
                                        name: 'SL',
                                        width: '30px',
                                        selector: 'sl',
                                        center: true,
                                        ignoreRowClick: true,
                                        cell: ( row, index ) => index + 1
                                    },
                                    {
                                        id: "itemGroupId",
                                        reorder: true,
                                        name: 'ItemGroup',
                                        width: '200px',
                                        selector: 'itemGroup',
                                        center: true,
                                        ignoreRowClick: true,
                                        cell: ( row, index ) => ( row?.isNew ? <Select
                                            id={`itemGroupId-${row.fieldId}`}
                                            name="itemGroupId"
                                            isClearable={true}
                                            isDisabled={!row?.isNew}
                                            isSearchable
                                            menuPosition={'fixed'}
                                            theme={selectThemeColors}
                                            options={dropDownFabricItemGroups}
                                            isOptionSelected
                                            classNamePrefix='dropdown'
                                            className="erp-dropdown-select w-100"
                                            value={row?.itemGroup}
                                            onChange={data => {
                                                handleItemGroupDropdownForFabric( data, row.fieldId );
                                            }}
                                            onFocus={() => { handleFabricItemOnFocus(); }}
                                        /> : row?.itemGroup?.label )
                                    },
                                    {
                                        id: "itemSubGroupId",
                                        reorder: true,
                                        name: 'itemSubGroup',
                                        width: '200px',
                                        selector: 'itemSubGroup',
                                        center: true,
                                        ignoreRowClick: true,
                                        cell: ( row, index ) => ( row?.isNew ? <Select
                                            id={`itemSubGroupId-${row.fieldId}`}
                                            name="itemSubGroupId"
                                            isDisabled={!row?.isNew}
                                            isClearable={true}
                                            isSearchable
                                            theme={selectThemeColors}
                                            menuPosition={'fixed'}
                                            options={row.itemSubGroupArray}
                                            classNamePrefix='dropdown'
                                            className="erp-dropdown-select w-100"
                                            onFocus={() => { dispatch( getItemSubGroupForConsumptionFabric( row.fieldId, row.itemGroupId ) ); }}
                                            // innerRef={register( { required: true } )}
                                            value={row.itemSubGroup}
                                            onChange={data => {
                                                handleItemSubGroupDropdownForFabric( data, row.fieldId, row?.itemGroup );
                                            }}
                                        /> : row.itemSubGroup?.label )
                                    },
                                    {
                                        id: "status",
                                        reorder: true,
                                        name: 'Status',
                                        width: '200px',
                                        selector: 'isApproved',
                                        center: true,
                                        ignoreRowClick: true,
                                        cell: ( row, index ) => getFabricTotalStatus( row )
                                    },
                                    {
                                        id: "actionId",
                                        reorder: true,
                                        name: '',
                                        width: '100px',
                                        selector: 'isApproved',
                                        center: true,
                                        ignoreRowClick: true,
                                        cell: ( row, index ) => <Button.Ripple
                                            id="addFabId"
                                            hidden={!( !row.itemSubGroup && row.isNew )}
                                            tag={Label}
                                            onClick={() => { handleRemoveFabricItem( row.fieldId ); }}
                                            className='btn-icon p-0'
                                            color='flat-success'
                                        >
                                            <X
                                                size={18}
                                                id="addFabId"
                                                color="red"
                                            />
                                        </Button.Ripple>
                                    }

                                ]}
                            />


                        </div>}


                    {
                        active === '2' && <div>
                            <div >
                                <DataTable

                                    noHeader
                                    responsive
                                    data={uniqAccessories}
                                    className='consumption-dataTable'
                                    persistTableHead
                                    dense
                                    expandableRowDisabled={row => !row.itemSubGroup}
                                    expandableRowExpanded={row => ( row.expanded && !!row.itemSubGroup )}
                                    onRowExpandToggled={( expanded, row ) => handleItemSegments( row.itemGroupId, row.itemSegments, row.itemSubGroupId, expanded, 'Accessories' )}

                                    expandableRows
                                    expandableRowsComponent={<ExpandableAccessoriesDetails data={( data ) => data} />}

                                    columns={[
                                        {
                                            id: "sl",
                                            reorder: true,
                                            name: 'SL',
                                            width: '30px',
                                            selector: 'sl',
                                            center: true,
                                            ignoreRowClick: true,
                                            cell: ( row, index ) => index + 1
                                        },
                                        {
                                            id: "itemGroupId",
                                            reorder: true,
                                            name: 'ItemGroup',
                                            width: '200px',
                                            selector: 'itemGroup',
                                            center: true,
                                            ignoreRowClick: true,
                                            cell: ( row, index ) => ( row?.isNew ? <Select
                                                id={`itemGroupId-${row.fieldId}`}
                                                name="itemGroupId"
                                                isClearable={true}
                                                isSearchable
                                                //  isDisabled={i.isApproved}
                                                menuPosition={'fixed'}
                                                theme={selectThemeColors}
                                                options={dropDownTrimItemGroups}
                                                classNamePrefix="dropdown"
                                                className="erp-dropdown-select w-100"
                                                value={row?.itemGroup}
                                                onChange={data => {
                                                    handleItemGroupDropdownForAccessories( data, row.fieldId );
                                                }}
                                                onFocus={() => { handleAccessoriesItemOnFocus(); }}

                                            /> : row?.itemGroup?.label )
                                        },
                                        {
                                            id: "itemSubGroupId",
                                            reorder: true,
                                            name: 'itemSubGroup',
                                            width: '200px',
                                            selector: 'itemSubGroup',
                                            center: true,
                                            ignoreRowClick: true,
                                            cell: ( row, index ) => ( row?.isNew ? < Select
                                                id={`itemSubGroupId-${row.fieldId}`
                                                }
                                                name="itemSubGroupId"
                                                isClearable={true}
                                                isSearchable
                                                isDisabled={row.isApproved}
                                                theme={selectThemeColors}
                                                menuPosition={'fixed'}
                                                options={row.itemSubGroupArray}
                                                classNamePrefix="dropdown"
                                                className="erp-dropdown-select w-100"
                                                onFocus={() => { dispatch( getItemSubGroupForConsumptionAccessories( row.fieldId, row.itemGroupId ) ); }}
                                                value={row.itemSubGroup}
                                                onChange={data => {
                                                    handleItemSubGroupDropdownForAccessories( data, row.fieldId, row.itemGroup );
                                                }}
                                            /> : row.itemSubGroup?.label )
                                        },
                                        {
                                            id: "status",
                                            reorder: true,
                                            name: 'Status',
                                            width: '200px',
                                            selector: 'isApproved',
                                            center: true,
                                            ignoreRowClick: true,
                                            cell: ( row, index ) => getAccessoriesTotalStatus( row )
                                        },
                                        {
                                            id: "actionId",
                                            reorder: true,
                                            name: '',
                                            width: '100px',
                                            selector: 'isApproved',
                                            center: true,
                                            ignoreRowClick: true,
                                            cell: ( row, index ) => <Button.Ripple
                                                id="addFabId"
                                                hidden={!( !row.itemSubGroup && row.isNew )}
                                                tag={Label}
                                                onClick={() => { handleRemoveAccessoriesItem( row.fieldId ); }}
                                                className='btn-icon p-0'
                                                color='flat-success'
                                            >
                                                <X
                                                    size={18}
                                                    id="addFabId"
                                                    color="red"
                                                />
                                            </Button.Ripple>
                                        }


                                    ]}
                                />

                            </div>

                        </div>
                    }
                    {/* {
                        active === "3" && <div className='border p-1'>
                            <ConsumptionPackagingAccessories />
                        </div>
                    } */}


                </Col>

            </Row>


        </>
    );
};

export default ConsumptionDetailsForm;

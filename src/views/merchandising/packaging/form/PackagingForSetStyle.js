/* eslint-disable no-unused-expressions */

import '@custom-styles/basic/custom-form.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import '@custom-styles/merchandising/others/packaging-sc-combination-table.scss';
import React, { Fragment, useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import CreatableSelect from 'react-select/creatable';
import { Button, Card, CardBody, Col, Collapse, CustomInput, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { selectSizeType, sizeTypeEnumObj } from '../../../../utility/enums';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownBuyers } from '../../buyer/store/actions';
import { getPurchaseOrdersDropdownByBuyerId, getStylesByPOById } from '../../purchase-order/store/actions';
import { getSizeDropDownBySetStyleIds } from '../../size/store/actions';
import SetPackagingDetails from '../details/SetPackagingDetails';
import { setPackagingInfoModel } from '../models';
import { addSetPackaging, bindSetPackagingBasic, bindSetPackagingDetails, bindSetPackagingStyleSizeDetails, clearPackAllState, getSetPackingDetail, updateSetPackaging } from '../store/action';
import SetPackagingAccessoriesDetails from './SetPackagingAccessoriesDetails';


const PackagingForSetStyle = () => {
    const { replace } = useHistory();
    const { styleSizesDropdown } = useSelector( ( { sizes } ) => sizes );

    const dispatch = useDispatch();
    const { dropDownStyles } = useSelector( ( { styles } ) => styles );
    // const { styleSizesDropdown } = useSelector( ( { sizes } ) => sizes );
    const { dropDownBuyers, buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );
    const { selectedPurchaseOrder, buyerPurchaseOrderDropdown, POStyles } = useSelector( ( { purchaseOrders } ) => purchaseOrders );
    const { setPackagingAccessoriesDetails, setPackingStyleSizeDetails, setPackagingInfo } = useSelector( ( { packaging } ) => packaging );


    const [packagingInfoOpen, setPackagingInfoOpen] = useState( true );
    const [packagingDetailsOpen, setPackagingDetailsOpen] = useState( true );


    const getStyleSizeFieldId = setPackingStyleSizeDetails.map( i => i.fieldId );

    const { register, errors, control, handleSubmit } = useForm();


    ///Buyer Dropdown OnFocus
    const handleBuyerDropdownOnFocus = () => {
        dispatch( getDropDownBuyers() );
    };
    const handleBuyerDropdown = ( data ) => {
        const updatedObj = {
            ...setPackagingInfoModel,
            buyer: data,
            style: [],
            purchaseOrder: []
        };
        // setPackagingInfo( updatedObj );
        dispatch( bindSetPackagingBasic( updatedObj ) );
        dispatch( getPurchaseOrdersDropdownByBuyerId( data?.value ) );
        dispatch( bindSetPackagingStyleSizeDetails( [] ) );
        dispatch( bindSetPackagingDetails( [] ) );

    };

    const handlePoDropdown = ( data ) => {
        console.log( data );
        const updatedObj = {
            ...setPackagingInfo,
            purchaseOrder: data
        };
        dispatch( bindSetPackagingBasic( updatedObj ) );
        dispatch( getStylesByPOById( data?.value ) );
        dispatch( getSetPackingDetail( data?.value ) );
    };


    const handleChangeSizeType = ( data ) => {
        const updatedObj = {
            ...setPackagingInfo,
            size: [],
            packagingType: data
        };
        dispatch( bindSetPackagingBasic( updatedObj ) );
        const updateData = setPackingStyleSizeDetails?.map( s => ( {
            fieldId: s.fieldId,
            styleName: s.styleName,
            styleId: s.styleId,
            size: []
        } ) );
        // setSizeStyleDetails( updateData );
        dispatch( bindSetPackagingStyleSizeDetails( updateData ) );

    };


    ///When Color Dropdown Onchange
    const handleStyleDropdownChange = ( data ) => {
        console.log( data );
        const updatedObj = {
            ...setPackagingInfo,
            style: data
        };
        dispatch( bindSetPackagingBasic( updatedObj ) );

        const queryData = data.map( s => ( {
            orderId: setPackagingInfo.purchaseOrder?.value,
            styleId: s?.value
        } ) );

        if ( data?.length > 0 ) {
            dispatch( getSizeDropDownBySetStyleIds( queryData ) );
        }
        //   setStyle( data );


        ///New Style Data Checking
        const comparerForAdd = ( otherArray ) => {
            return function ( current ) {
                return otherArray.filter( function ( other ) {
                    return other.styleName === current.label;
                } ).length === 0;
            };
        };

        ///Delete Style Data Checking
        const comparerForDelete = ( otherArray ) => {
            return function ( current ) {
                return otherArray.filter( function ( other ) {
                    return other.label === current.styleName;
                } ).length === 0;
            };
        };
        //New Style Object
        const findLastSelectedStyle = data.find( comparerForAdd( setPackingStyleSizeDetails ) );
        //Delete Style Object
        const findLastDeletedStyle = setPackingStyleSizeDetails.find( comparerForDelete( data ) );

        //New Style Data Entry
        if ( findLastSelectedStyle !== undefined ) {
            const lastObjModified = {
                fieldId: randomIdGenerator(),
                styleName: findLastSelectedStyle.label,
                styleId: findLastSelectedStyle.value,
                size: setPackingStyleSizeDetails?.some( c => c.size ) ? ( setPackingStyleSizeDetails?.map( ( cs => cs.size.map( s => ( {
                    fieldId: randomIdGenerator(),
                    sizeId: s.sizeId,
                    sizeName: s.sizeName,
                    inputValue: 0
                } ) ) )
                ) )[0] : []
            };
            const updatedArray = [...setPackingStyleSizeDetails, lastObjModified];
            dispatch( bindSetPackagingStyleSizeDetails( updatedArray ) );

        }
        //Remove Style Data
        if ( findLastDeletedStyle !== undefined ) {
            if ( data.length === 0 ) {
                const lastUpdated = [...setPackingStyleSizeDetails];
                lastUpdated.splice(
                    lastUpdated.findIndex(
                        x => x.styleName === findLastDeletedStyle.styleName
                    )
                );
                // setSizeStyleDetails( lastUpdated );
                dispatch( bindSetPackagingStyleSizeDetails( lastUpdated ) );

                const updatedObj = {
                    ...setPackagingInfo,
                    size: [],
                    style: []
                };
                dispatch( bindSetPackagingBasic( updatedObj ) );
            } else {
                const lastUpdated = [...setPackingStyleSizeDetails];
                lastUpdated.splice(
                    lastUpdated.findIndex(
                        x => x.styleName === findLastDeletedStyle.styleName
                    ), 1
                );
                dispatch( bindSetPackagingStyleSizeDetails( lastUpdated ) );
            }
        }
    };

    // When Size Dropdown Change
    const handleSizeDropdownChange = ( data ) => {
        let dataManipulation = [];
        if ( data === null || data === [] ) {
            dataManipulation = [];
        } else if ( Array.isArray( data ) ) {
            dataManipulation = data;
        } else {
            dataManipulation.push( data );
        }
        //    setSize( dataManipulation );
        const updatedObj = {
            ...setPackagingInfo,
            size: dataManipulation
        };
        dispatch( bindSetPackagingBasic( updatedObj ) );
        //For Entry and  Delete Size Checking
        const getAllModifiedSize = ( setPackingStyleSizeDetails?.map( c => ( {
            size: c.size
        } ) ) );
        const getOldSizeArray = getAllModifiedSize[0]?.size;

        //Find New Size Entry
        const comparerForAdd = ( otherArray ) => {
            return function ( current ) {
                return otherArray?.filter( function ( other ) {
                    return other.sizeName === current.label;
                } ).length === 0;
            };
        };
        //Find Deleted Size Entry
        const comparerForDelete = ( otherArray ) => {
            return function ( current ) {
                return otherArray?.filter( function ( other ) {
                    return other.label === current.sizeName;
                } ).length === 0;
            };
        };
        const findLastSelectedSize = dataManipulation?.find( comparerForAdd( getOldSizeArray ) );
        const findLastDeletedSize = getOldSizeArray?.find( comparerForDelete( dataManipulation ) );

        /// New Entry Push
        if ( findLastSelectedSize !== undefined ) {
            const updateInputValue = setPackingStyleSizeDetails?.map( ii => {
                if ( getStyleSizeFieldId.some( i => ii.fieldId === i ) ) {
                    ii.fieldId;
                    ii.styleName;
                    ii.styleId;
                    ii.size.push( {
                        fieldId: randomIdGenerator(),
                        sizeId: findLastSelectedSize.value,
                        sizeName: findLastSelectedSize.label,
                        inputValue: 0
                    } );
                }
                return ii;
            } );
            dispatch( bindSetPackagingStyleSizeDetails( updateInputValue ) );
        }

        /// After Deleted
        if ( findLastDeletedSize !== undefined ) {
            if ( dataManipulation.length === 0 ) {
                const updateInputValue = setPackingStyleSizeDetails?.map( ii => {
                    if ( getStyleSizeFieldId.some( i => ii.fieldId === i ) ) {
                        ii?.size.splice(
                            ii.size.findIndex( s => s.sizeName === findLastDeletedSize.sizeName ) );
                    }
                    return ii;
                } );
                dispatch( bindSetPackagingStyleSizeDetails( updateInputValue ) );
            } else {
                const updateInputValue = setPackingStyleSizeDetails?.map( ii => {
                    if ( getStyleSizeFieldId.some( i => ii.fieldId === i ) ) {
                        ii?.size.splice(
                            ii.size.findIndex(
                                s => s.sizeName === findLastDeletedSize.sizeName
                            ), 1
                        );
                    }
                    return ii;
                } );
                dispatch( bindSetPackagingStyleSizeDetails( updateInputValue ) );
            }

        }
    };

    const handleSizeInputValueOnChange = ( e, fieldId, sizeFieldId ) => {
        const updateInputValue = setPackingStyleSizeDetails?.map( i => {
            if ( fieldId === i.fieldId ) {
                i?.size.map( is => {
                    if ( ( ( sizeFieldId === is.fieldId ) ) ) {
                        is.inputValue = e.target.value;
                    }
                    return is;
                } );
            }
            return i;
        } );
        dispatch( bindSetPackagingStyleSizeDetails( updateInputValue ) );

    };


    const handleCancel = () => {
        replace( '/home' );
        dispatch( clearPackAllState() );
    };

    const handlePackagingInfoClear = () => {
        // setSizeStyleDetails( defaultValueSizeStyleDetails );
        //  setPackagingInfo( defaultPackagingInfoObject );
        const updatedObj = {
            ...setPackagingInfo,
            size: [],
            packagingType: null
        };
        dispatch( bindSetPackagingBasic( updatedObj ) );
        //  setStyle( [] );
        //    setSizeType( null );
    };

    const handleInputChange = ( e ) => {
        const { name, value, type, checked } = e.target;

        const updatedObj = {
            ...setPackagingInfo,
            [name]: type === 'number' ? Number( value ) : type === 'checkbox' ? checked : value
        };
        dispatch( bindSetPackagingBasic( updatedObj ) );

    };

    const onSubmit = () => {
        const submitObj = {
            id: setPackagingInfo.id,
            detailId: setPackagingInfo.detailId,
            buyerId: setPackagingInfo.buyer?.value,
            styleId: setPackagingInfo.style?.value,
            orderId: setPackagingInfo.purchaseOrder?.value,
            totalPackSize: setPackagingInfo.totalPackSize,
            cartonNoSeries: setPackagingInfo.cartonSeriesNo,
            netWeight: setPackagingInfo.netWeight,
            grossWeight: setPackagingInfo.grossWeight,
            length: setPackagingInfo.length,
            width: setPackagingInfo.width,
            height: setPackagingInfo.height,
            packagingType: setPackagingInfo.packagingType?.value,
            packagingDetails: setPackingStyleSizeDetails.map( i => (
                i.size.map( ii => ( {
                    colorId: null,
                    styleId: i.styleId,
                    sizeId: ii.sizeId,
                    quantity: Number( ii.inputValue )
                } ) )
            ) ).flat(),

            accessories: setPackagingAccessoriesDetails.map( acc => ( {
                id: acc.id,
                itemGroupId: acc.itemGroup?.value,
                itemGroupName: acc.itemGroup?.label,
                itemSubGroupId: acc.itemSubGroup?.value,
                itemSubGroupName: acc.itemSubGroup?.label,
                itemDescription: acc.itemDescriptionValue?.label,
                itemDescriptionTemplate: acc.itemDescriptionTemplate,
                consumptionUOM: acc.consumptionUom?.label,
                wastagePercent: acc.wastagePercent,
                consumptionRatePerUnit: acc.consumptionRatePerUnit,
                consumptionQuantity: acc.consumptionQuantity,
                consumptionCost: acc.consumptionCost,
                inHouseQuantity: acc.inHouseQuantity,
                inHouseRatePerUnit: acc.inHouseRatePerUnit,
                inHouseCost: acc.inHouseQuantity * acc.inHouseRatePerUnit,
                remarks: "string"
            } ) )
        };
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );

        if ( setPackagingInfo.id ) {
            dispatch( updateSetPackaging( submitObj, setPackagingInfo.id ) );

        } else {
            dispatch( addSetPackaging( submitObj ) );
        }
        // const fieldIdForPackagingDetails = randomIdGenerator();
        // const unitPerPackSum = _.sum( sizeColorDetails.map( i => _.sum( i.size.map( s => Number( s.inputValue ) ) ) ) );

    };

    const handlePackingInfoClear = () => {
        dispatch( clearPackAllState() );
    };


    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false
        },
        {
            id: 'Purchaser Order',
            name: 'List',
            link: "/purchase-order",
            isActive: false
        }
    ];

    return (
        <div>
            <Card className="mt-3">
                <ActionMenu breadcrumb={breadcrumb} title='Set Packaging' >
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="primary"
                            type="submit"
                            onClick={() => { onSubmit(); }}
                        >Save</NavLink>
                    </NavItem>
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="secondary"
                            onClick={() => { handleCancel(); }}                    >
                            Cancel
                        </NavLink>
                    </NavItem>
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="secondary"
                            onClick={() => { handlePackingInfoClear(); }}                    >
                            Clear
                        </NavLink>
                    </NavItem>
                </ActionMenu>
                <CardBody>
                    <div className='mb-1 border rounded rounded-3'>
                        <Row className="p-1">
                            <Col lg={3}>
                                <div className='custom-form-main'>
                                    <Label className='custom-form-label' for='buyerId'>Buyer</Label>
                                    <Label className='custom-form-colons'> : </Label>
                                    <div className='custom-form-group'>
                                        <CreatableSelect
                                            id='buyerId'
                                            name="buyer"
                                            isSearchable
                                            menuPosition="fixed"
                                            isLoading={!dropDownBuyers.length}
                                            isClearable
                                            theme={selectThemeColors}
                                            options={dropDownBuyers}
                                            classNamePrefix='dropdown'
                                            className="erp-dropdown-select"
                                            innerRef={register( { required: true } )}
                                            // className={classnames( 'react-select', { 'is-invalid': season === null } )}
                                            value={setPackagingInfo?.buyer}
                                            onFocus={() => { handleBuyerDropdownOnFocus(); }}
                                            onChange={data => {
                                                handleBuyerDropdown( data );
                                            }}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col lg={3}>
                                <div className='custom-form-main'>
                                    <Label className='custom-form-label' for='purchaseOrderId'>PO</Label>
                                    <Label className='custom-form-colons'> : </Label>
                                    <div className='custom-form-group'>
                                        <CreatableSelect
                                            id='purchaseOrderId'
                                            name="purchaseOrder"
                                            isSearchable
                                            isLoading={!buyerPurchaseOrderDropdown.length}
                                            menuPosition="fixed"
                                            isClearable
                                            theme={selectThemeColors}
                                            options={buyerPurchaseOrderDropdown.filter( order => order.isSetOrder === true )}
                                            classNamePrefix='dropdown'
                                            className="erp-dropdown-select"
                                            innerRef={register( { required: true } )}
                                            // className={classnames( 'react-select', { 'is-invalid': season === null } )}
                                            value={setPackagingInfo?.purchaseOrder}
                                            onChange={data => {
                                                handlePoDropdown( data );
                                            }}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col lg={3}>
                                <div className='custom-form-main'>
                                    <div className='custom-form-group font-weight-bolder'>
                                        <CustomInput
                                            type='switch'
                                            label="Repeatable Create?"
                                            id="isRepeatableCreateId"
                                            bsSize="sm"
                                            name='isRepeatableCreate'
                                            htmlFor="isRepeatableCreateId"
                                            checked={setPackagingInfo?.isRepeatableCreate}
                                            onChange={( e ) => { handleInputChange( e ); }}
                                        />
                                    </div>
                                </div>

                            </Col>

                        </Row>
                    </div>

                    <Row className='border-bottom'>
                        <Col>
                            <div onClick={() => { setPackagingInfoOpen( !packagingInfoOpen ); }}>
                                <div className='d-flex justify-content-between'>
                                    <span className={packagingInfoOpen ? 'font-weight-bolder border-bottom-success border-2' : 'font-weight-bolder'}>
                                        Packaging Info
                                    </span>
                                    <span >
                                        <Button.Ripple style={{ padding: '0.4rem' }} className='btn-icon' size="sm" color='flat-secondary'>
                                            <ChevronUp
                                                hidden={packagingInfoOpen}
                                                size={18}
                                                color='grey'
                                                onClick={() => { setPackagingInfoOpen( !packagingInfoOpen ); }}
                                            />
                                            <ChevronDown
                                                hidden={!packagingInfoOpen}
                                                size={18}
                                                color='grey'
                                                onClick={() => { setPackagingInfoOpen( !packagingInfoOpen ); }}
                                            />
                                        </Button.Ripple>

                                    </span>
                                </div>
                            </div>
                            <Collapse isOpen={packagingInfoOpen}>
                                <div className="p-1">
                                    {/* <Row className="border rounded rounded-3 p-1 mb-1">
                                        <Col>
                                        </Col>
                                    </Row> */}
                                    <Row className="border rounded rounded-3 p-1">
                                        <Col>
                                            <Row>
                                                <Col xs={12} sm={12} md={7} lg={7}>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='packagingTypeId'>Types</Label>
                                                                <Label className='custom-form-colons '> : </Label>
                                                                <div className='custom-form-group '>
                                                                    <CreatableSelect
                                                                        id='packagingTypeId'
                                                                        name="packagingType"
                                                                        isSearchable
                                                                        menuPosition={'fixed'}
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={selectSizeType}
                                                                        value={setPackagingInfo.packagingType}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        onChange={data => { handleChangeSizeType( data ); }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='styleId'>Ctn. Series No</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Input
                                                                        id='cartoonNoId'
                                                                        name="cartonSeriesNo"
                                                                        type="text"
                                                                        bsSize="sm"
                                                                        value={setPackagingInfo.cartonSeriesNo}
                                                                        innerRef={register( { required: true } )}
                                                                        onChange={e => { handleInputChange( e ); }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='styleId'>Style</Label>
                                                                <Label className='custom-form-colons '> : </Label>
                                                                <div className='custom-form-group '>
                                                                    <CreatableSelect
                                                                        id='styleId'
                                                                        name="style"
                                                                        isMulti
                                                                        isSearchable
                                                                        menuPosition="fixed"
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={POStyles.filter( style => style.isSetStyle === true )}
                                                                        value={setPackagingInfo.style}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        onChange={data => handleStyleDropdownChange( data )}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='sizeId'>Size</Label>
                                                                <Label className='custom-form-colons '> : </Label>
                                                                <div className='custom-form-group '>
                                                                    <CreatableSelect
                                                                        id='sizeId'
                                                                        name="size"
                                                                        isMulti={setPackagingInfo.packagingType?.label === sizeTypeEnumObj.assortSize}
                                                                        isSearchable
                                                                        isDisabled={setPackagingInfo.style.length === 0 || !setPackagingInfo.packagingType}
                                                                        menuPosition={'fixed'}
                                                                        // control={control}
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={styleSizesDropdown}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        // innerRef={register( { required: true } )}
                                                                        value={setPackagingInfo.size}
                                                                        onChange={data => { handleSizeDropdownChange( data ); }}
                                                                    />
                                                                </div>
                                                            </div>

                                                        </Col>
                                                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                            <Row>
                                                                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                    <div className='custom-form-main'>
                                                                        <Label className='custom-form-label ' for='lengthId'>Length</Label>
                                                                        <Label className='custom-form-colons '> : </Label>
                                                                        <div className='custom-form-group '>
                                                                            <Input
                                                                                id='lengthId'
                                                                                type='number'
                                                                                name="length"
                                                                                value={setPackagingInfo?.length}
                                                                                placeholder='0.00'
                                                                                bsSize="sm"
                                                                                className='text-right'
                                                                                onFocus={e => e.target.select()}
                                                                                onChange={e => { handleInputChange( e ); }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className='custom-form-main'>
                                                                        <Label className='custom-form-label ' for='widthId'>Width</Label>
                                                                        <Label className='custom-form-colons'> : </Label>
                                                                        <div className='custom-form-group'>
                                                                            <Input
                                                                                id='widthId'
                                                                                type='number'
                                                                                name="width"
                                                                                bsSize="sm"
                                                                                value={setPackagingInfo?.width}
                                                                                placeholder='0.00'
                                                                                className='text-right'
                                                                                onFocus={e => e.target.select()}
                                                                                onChange={e => { handleInputChange( e ); }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className='custom-form-main'>
                                                                        <Label className='custom-form-label ' for='heightId'>Height</Label>
                                                                        <Label className='custom-form-colons '> : </Label>
                                                                        <div className='custom-form-group '>
                                                                            <Input
                                                                                id='heightId'
                                                                                type='number'
                                                                                name="height"
                                                                                bsSize="sm"
                                                                                value={setPackagingInfo?.height}
                                                                                placeholder='0.00'
                                                                                className='text-right'
                                                                                onFocus={e => e.target.select()}
                                                                                onChange={e => { handleInputChange( e ); }}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                </Col>
                                                                <Col xs={12} sm={12} md={6} lg={6} xl={6}>

                                                                    <div className='custom-form-main'>
                                                                        <Label className='custom-form-label ' for='netWeightId'>Net wt.</Label>
                                                                        <Label className='custom-form-colons'> : </Label>
                                                                        <div className='custom-form-group'>
                                                                            <Input
                                                                                className="text-right"
                                                                                id='netWeightId'
                                                                                name="netWeight"
                                                                                type="number"
                                                                                bsSize="sm"
                                                                                value={setPackagingInfo.netWeight}
                                                                                innerRef={register( { required: true } )}
                                                                                onFocus={e => { e.target.select(); }}
                                                                                onChange={e => { handleInputChange( e ); }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className='custom-form-main'>
                                                                        <Label className='custom-form-label ' for='grossWeightId'>Gross wt.</Label>
                                                                        <Label className='custom-form-colons '> : </Label>
                                                                        <div className='custom-form-group '>
                                                                            <Input
                                                                                className="text-right"
                                                                                id='grossWeightId'
                                                                                name="grossWeight"
                                                                                type="number"
                                                                                bsSize="sm"
                                                                                value={setPackagingInfo.grossWeight}
                                                                                innerRef={register( { required: true } )}
                                                                                onFocus={e => { e.target.select(); }}
                                                                                onChange={e => { handleInputChange( e ); }}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className='custom-form-main'>
                                                                        <Label className='custom-form-label ' for='sizeColorTypeId'>Ttl Pack Size</Label>
                                                                        <Label className='custom-form-colons '> : </Label>
                                                                        <div className='custom-form-group '>
                                                                            <Input
                                                                                className="text-right"
                                                                                id='totalPackSizeId'
                                                                                name="totalPackSize"
                                                                                type="number"
                                                                                bsSize="sm"
                                                                                value={setPackagingInfo.totalPackSize}
                                                                                innerRef={register( { required: true } )}
                                                                                onFocus={e => { e.target.select(); }}
                                                                                onChange={e => { handleInputChange( e ); }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>


                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={12} sm={12} md={5} lg={5}>
                                                    <div className='border rounded pt-0 pr-1 pb-1 pl-1'>
                                                        <Label className="text-dark font-weight-bolder" for='totalPackSizeId'>Pack Details </Label>

                                                        {
                                                            ( setPackagingInfo.size?.length > 0 ) ? <>
                                                                <div className="packing-scc-table">
                                                                    <Table size="sm" bordered >
                                                                        <thead className='thead-light  text-center'>
                                                                            <tr>
                                                                                <th style={{ width: '15px' }} className="text-nowrap">SL.</th >
                                                                                <th style={{ width: '120px' }} className="text-nowrap">Style</th>
                                                                                {
                                                                                    setPackingStyleSizeDetails?.map( i => (
                                                                                        i?.size?.map( is => (
                                                                                            <Fragment key={is.sizeName}>
                                                                                                <th>{is.sizeName}</th>
                                                                                            </Fragment>
                                                                                        ) )
                                                                                    ) )[0]
                                                                                }
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="text-center">
                                                                            {
                                                                                setPackingStyleSizeDetails?.map( ( i, idx ) => (
                                                                                    <tr key={i.fieldId}>
                                                                                        <td className="text-nowrap">{idx + 1}</td>
                                                                                        <td className="text-nowrap">{i.styleName}</td>
                                                                                        {
                                                                                            i?.size?.map( ( is ) => (
                                                                                                <Fragment key={is.sizeName}>
                                                                                                    <td>
                                                                                                        <Input
                                                                                                            className="text-right"
                                                                                                            type="number"
                                                                                                            bsSize="sm"
                                                                                                            onFocus={e => e.target.select()}
                                                                                                            value={is.inputValue}
                                                                                                            onChange={e => {
                                                                                                                handleSizeInputValueOnChange( e, i.fieldId, is.fieldId );
                                                                                                            }}
                                                                                                        />
                                                                                                    </td>
                                                                                                </Fragment>
                                                                                            ) )
                                                                                        }
                                                                                    </tr>
                                                                                ) )
                                                                            }
                                                                        </tbody>
                                                                    </Table>
                                                                </div>
                                                            </> : <>
                                                                <div className="packing-scc-table">
                                                                    <Table size="sm" bordered>
                                                                        <thead className='thead-light  text-center'>
                                                                            <tr>
                                                                                <th style={{ width: '15px' }} className="text-nowrap">SL.</th>
                                                                                <th style={{ width: '95px' }} className="text-nowrap">Style</th>
                                                                                <th style={{ width: '95px' }} className="text-nowrap">Size</th>

                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="text-center">
                                                                            {setPackingStyleSizeDetails?.map( ( i, idx ) => (
                                                                                <tr key={i.fieldId}>
                                                                                    <td className="text-nowrap">{idx + 1}</td>
                                                                                    <td className="text-nowrap">{i.styleName}</td>
                                                                                    <td className="text-nowrap">NA</td>

                                                                                </tr>
                                                                            ) )}
                                                                        </tbody>
                                                                    </Table>
                                                                </div>
                                                            </>
                                                        }
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <Label className="text-dark font-weight-bolder" for='totalPackSizeId'>Accessories Details</Label>
                                                    <SetPackagingAccessoriesDetails />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                        </Col>
                    </Row>
                    <Row className="mt-1 ">
                        <Col >
                            <div onClick={() => { setPackagingDetailsOpen( !packagingDetailsOpen ); }}>
                                <div className='d-flex  justify-content-between'>
                                    <span className={packagingDetailsOpen ? 'font-weight-bolder border-bottom-success border-2' : 'font-weight-bolder'}>
                                        Packaging Details
                                    </span>

                                    <span >
                                        <Button.Ripple style={{ padding: '0.4rem' }} className='btn-icon' size="sm" color='flat-secondary'>
                                            <ChevronUp
                                                size={18}
                                                hidden={packagingDetailsOpen}
                                                color='grey'
                                                onClick={() => { setPackagingDetailsOpen( !packagingDetailsOpen ); }}
                                            />
                                            <ChevronDown
                                                hidden={!packagingDetailsOpen}
                                                size={18}
                                                color='grey'
                                                onClick={() => { setPackagingDetailsOpen( !packagingDetailsOpen ); }}
                                            />
                                        </Button.Ripple>

                                    </span>
                                </div>
                            </div>
                            <Collapse isOpen={packagingDetailsOpen}>
                                <div className=" p-1">
                                    <Row className="border rounded rounded-3 p-1">
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <SetPackagingDetails />
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

        </div>
    );
};

export default PackagingForSetStyle;

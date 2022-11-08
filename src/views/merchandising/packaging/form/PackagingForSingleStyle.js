/* eslint-disable no-unused-expressions */
import '@custom-styles/merchandising/form/single-pack-form.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import '@custom-styles/merchandising/others/packaging-sc-combination-table.scss';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, MoreHorizontal } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Select from 'react-select';
import {
    Button,
    Card,
    CardBody,
    Col,
    Collapse, CustomInput, Input,
    Label,
    NavItem,
    NavLink,
    Row, Table
} from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { selectSizeColorType, sizeColorTypeEnumObj } from '../../../../utility/enums';
import { isPermit, randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getBuyersStyles, getDropDownBuyers } from '../../buyer/store/actions';
import SinglePackagingDetails from '../details/SinglePackagingDetails';
import { packagingInfoModel } from '../models';
import { addSinglePackaging, bindPackagingAccessoriesDetails, bindSinglePackagingBasic, bindSinglePackagingColorSizeDetails, getPackagingColorDropdown, getPackagingPurchaseOrder, getPackagingSizeDropdown, getSinglePackingDetail, getUomDropdownByUnitSetName, updateSinglePackaging } from '../store/action';
import PackagingPurchaseOrderModal from './PackagingPurchaseOrderModal';
import SinglePackagingAccessoriesDetails from './SinglePackagingAccessoriesDetails';


const PackagingForSingleStyle = () => {
    const { replace } = useHistory();
    const dispatch = useDispatch();
    const {
        singlePackagingAccessoriesDetails,
        packagingInfo,
        singlePackingColorSizeDetails,
        packagingColorDropdown,
        packagingSizeDropdown,
        dropdownUom
    } = useSelector( ( { packaging } ) => packaging );


    const [openPackagingPurchaseOrderModal, setOpenPackagingPurchaseOrderModal] = useState( false );

    const { register, errors, control, handleSubmit } = useForm();
    const getSizeColorFieldId = singlePackingColorSizeDetails?.map( i => i.fieldId );

    const [packagingInfoOpen, setPackagingInfoOpen] = useState( true );
    const [packagingDetailsOpen, setPackagingDetailsOpen] = useState( true );
    const { dropDownBuyers, buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    useEffect( () => {
        dispatch( getUomDropdownByUnitSetName( 'length' ) );
    }, [dispatch, !dropdownUom.length] );


    const handlePurchaseOrderModal = () => {
        setOpenPackagingPurchaseOrderModal( !openPackagingPurchaseOrderModal );
        dispatch( getPackagingPurchaseOrder( packagingInfo?.buyer?.value, packagingInfo?.style?.value ) );
    };

    ///Buyer Dropdown OnFocus
    const handleBuyerDropdownOnFocus = () => {
        dispatch( getDropDownBuyers() );
    };

    ///OnChange Buyer Dropdown
    const handleBuyerDropdown = ( data ) => {
        const updatedObj = {
            ...packagingInfoModel,
            isRepeatableCreate: packagingInfo?.isRepeatableCreate,
            lengthUom: packagingInfo?.lengthUom,
            widthUom: packagingInfo?.widthUom,
            heightUom: packagingInfo?.heightUom,
            buyer: data
        };
        dispatch( bindSinglePackagingBasic( updatedObj ) );
        dispatch( getSinglePackingDetail( null ) );
        dispatch( bindSinglePackagingColorSizeDetails( [] ) );
        dispatch( bindPackagingAccessoriesDetails( null ) );
        dispatch( getBuyersStyles( null ) );
    };

    const handleStyleDropdownOnFocus = () => {
        dispatch( getBuyersStyles( packagingInfo?.buyer?.value ) );

    };

    const handleStyleDropDownChange = ( data ) => {
        const updatedObj = {
            ...packagingInfoModel,
            buyer: packagingInfo?.buyer,
            style: data,
            isRepeatableCreate: packagingInfo?.isRepeatableCreate,
            lengthUom: packagingInfo?.lengthUom,
            widthUom: packagingInfo?.widthUom,
            heightUom: packagingInfo?.heightUom
        };
        dispatch( bindSinglePackagingBasic( updatedObj ) );
        dispatch( getSinglePackingDetail( null ) );
        dispatch( bindSinglePackagingColorSizeDetails( [] ) );
        dispatch( bindPackagingAccessoriesDetails( null ) );

    };

    const handleSizeDropdownOnFocus = () => {
        if ( !packagingSizeDropdown.length ) {
            dispatch( getPackagingSizeDropdown( packagingInfo?.orderId, packagingInfo?.style?.value ) );
        }
    };

    const handleColorDropdownOnFocus = () => {
        if ( !packagingColorDropdown.length ) {
            dispatch( getPackagingColorDropdown( packagingInfo?.orderId, packagingInfo?.style?.value ) );
        }
    };


    const handleChangeSizeColorType = ( data ) => {
        const updatedObj = {
            ...packagingInfo,
            color: [],
            size: [],
            packagingType: data
        };
        dispatch( bindSinglePackagingBasic( updatedObj ) );
        //setColorSizeType( data );
        dispatch( bindSinglePackagingColorSizeDetails( [] ) );

    };
    const handleUomDropdownOnChange = ( data, e ) => {
        const { name } = e;

        if ( name === 'lengthUom' ) {
            console.log( name );
            const updatedObj = {
                ...packagingInfo,
                [name]: data,
                length: ( data.relativeFactor / packagingInfo?.lengthUom?.relativeFactor ) * packagingInfo?.length
            };
            dispatch( bindSinglePackagingBasic( updatedObj ) );
        } else if ( name === 'widthUom' ) {
            console.log( name );
            const updatedObj = {
                ...packagingInfo,
                [name]: data,
                width: ( data.relativeFactor / packagingInfo?.widthUom?.relativeFactor ) * packagingInfo?.width
            };
            dispatch( bindSinglePackagingBasic( updatedObj ) );
        } else if ( name === 'heightUom' ) {
            console.log( name );
            const updatedObj = {
                ...packagingInfo,
                [name]: data,
                height: ( data.relativeFactor / packagingInfo?.heightUom?.relativeFactor ) * packagingInfo?.height
            };
            dispatch( bindSinglePackagingBasic( updatedObj ) );
        }


    };


    const handleColorDropDownChange = ( data ) => {
        //Color Dropdown Data on color State
        let dataManipulation = [];
        if ( data === null || data === [] ) {
            dataManipulation = [];
        } else if ( Array.isArray( data ) ) {
            dataManipulation = data;
        } else {
            dataManipulation = [data];
        }

        console.log( dataManipulation );
        const updatedObj = {
            ...packagingInfo,
            color: dataManipulation
        };
        dispatch( bindSinglePackagingBasic( updatedObj ) );


        ///New Color Data Checking
        const comparerForAdd = ( otherArray ) => {
            return function ( current ) {
                return otherArray.filter( function ( other ) {
                    return other.colorName === current.label;
                } ).length === 0;
            };
        };
        ///Delete Color Data Checking
        const comparerForDelete = ( otherArray ) => {
            return function ( current ) {
                return otherArray.filter( function ( other ) {
                    return other.label === current.colorName;
                } ).length === 0;
            };
        };
        // //New Color Object
        const findLastDeletedColor = singlePackingColorSizeDetails?.find( comparerForDelete( dataManipulation ) );
        const findLastSelectedColor = dataManipulation?.find( comparerForAdd( singlePackingColorSizeDetails ) );
        //   console.log( 'new', findLastSelectedColor );
        // //Delete Color Object
        //   console.log( 'delete', findLastSelectedColor );

        // //New Color Data Entry
        if ( findLastSelectedColor !== undefined ) {
            const lastObjModified = {
                fieldId: randomIdGenerator(),
                colorId: findLastSelectedColor.value,
                colorName: findLastSelectedColor.label,
                size: singlePackingColorSizeDetails?.some( c => c.size ) ? ( singlePackingColorSizeDetails?.map( ( cs => cs.size.map( s => ( {
                    fieldId: randomIdGenerator(),
                    sizeId: s.sizeId,
                    sizeName: s.sizeName,
                    inputValue: 0
                } ) ) )
                ) )[0] : []
            };
            // sizeColorDetails.push( lastObjModified );
            ///  console.log( 'modified', lastObjModified );

            if ( Array.isArray( data ) ) {
                const updatedArray = [...singlePackingColorSizeDetails, lastObjModified];
                dispatch( bindSinglePackagingColorSizeDetails( updatedArray ) );

            } else {
                const updatedArray = [lastObjModified];
                dispatch( bindSinglePackagingColorSizeDetails( updatedArray ) );
            }

        }

        // //Remove Color Data
        if ( ( findLastDeletedColor !== undefined && Array.isArray( data ) ) || ( findLastDeletedColor !== undefined && data === null ) ) {
            if ( dataManipulation.length === 0 ) {
                const lastUpdated = [...singlePackingColorSizeDetails];
                lastUpdated.splice(
                    lastUpdated.findIndex(
                        x => x.colorName === findLastDeletedColor.colorName
                    )
                );
                // setSizeColorDetails( lastUpdated );
                dispatch( bindSinglePackagingColorSizeDetails( lastUpdated ) );

                const updatedObj = {
                    ...packagingInfo,
                    size: [],
                    color: dataManipulation
                };
                // setColor( dataManipulation );
                dispatch( bindSinglePackagingBasic( updatedObj ) );
            } else {
                const lastUpdated = [...singlePackingColorSizeDetails];
                lastUpdated.splice(
                    lastUpdated.findIndex(
                        x => x.colorName === findLastDeletedColor.colorName
                    ), 1
                );
                // setSizeColorDetails( lastUpdated );
                dispatch( bindSinglePackagingColorSizeDetails( lastUpdated ) );

            }
        }
    };

    ///While Size Dropdown
    const handleSizeDropDownChange = ( data ) => {
        let dataManipulation = [];
        if ( data === null || data === [] ) {
            dataManipulation = [];
        } else if ( Array.isArray( data ) ) {
            dataManipulation = data;
        } else {
            dataManipulation.push( data );
        }
        const updatedObj = {
            ...packagingInfo,
            size: dataManipulation
        };
        dispatch( bindSinglePackagingBasic( updatedObj ) );
        //For Entry and  Delete Size Checking
        const getAllModifiedSize = ( singlePackingColorSizeDetails?.map( c => ( {
            size: c.size
        } ) ) );
        const getOldSizeArray = getAllModifiedSize[0].size;

        //Find New Size Entry
        const comparerForAdd = ( otherArray ) => {
            return function ( current ) {
                return otherArray.filter( function ( other ) {
                    return other.sizeName === current.label;
                } ).length === 0;
            };
        };
        //Find Deleted Size Entry
        const comparerForDelete = ( otherArray ) => {
            return function ( current ) {
                return otherArray.filter( function ( other ) {
                    return other.label === current.sizeName;
                } ).length === 0;
            };
        };
        const findLastSelectedSize = dataManipulation?.find( comparerForAdd( getOldSizeArray ) );
        const findLastDeletedSize = getOldSizeArray.find( comparerForDelete( dataManipulation ) );

        /// New Entry Push
        if ( findLastSelectedSize !== undefined ) {
            const updateInputValue = singlePackingColorSizeDetails?.map( ii => {
                if ( getSizeColorFieldId.some( i => ii.fieldId === i ) ) {
                    ii.fieldId;
                    ii.colorId;
                    ii.colorName;
                    ii.size.push( {
                        fieldId: randomIdGenerator(),
                        sizeId: findLastSelectedSize.value,
                        sizeName: findLastSelectedSize.label,
                        inputValue: 0
                    } );
                }
                return ii;
            } );
            dispatch( bindSinglePackagingColorSizeDetails( updateInputValue ) );
        }

        /// After Deleted
        if ( findLastDeletedSize !== undefined ) {
            if ( dataManipulation.length === 0 ) {
                const updateInputValue = singlePackingColorSizeDetails?.map( ii => {
                    if ( getSizeColorFieldId.some( i => ii.fieldId === i ) ) {
                        ii?.size.splice(
                            ii.size.findIndex( s => s.sizeName === findLastDeletedSize.sizeName ) );
                    }
                    return ii;
                } );
                dispatch( bindSinglePackagingColorSizeDetails( updateInputValue ) );

            } else {
                const updateInputValue = singlePackingColorSizeDetails?.map( ii => {
                    if ( getSizeColorFieldId.some( i => ii.fieldId === i ) ) {
                        ii?.size.splice(
                            ii.size.findIndex( s => s.sizeName === findLastDeletedSize.sizeName ), 1 );
                    }
                    return ii;
                } );
                dispatch( bindSinglePackagingColorSizeDetails( updateInputValue ) );

            }
        }
    };


    ///Input Value Onchange
    const handleSizeInputValueOnChange = ( e, fieldId, sizeFieldId ) => {
        const updateInputValue = singlePackingColorSizeDetails?.map( i => {
            if ( fieldId === i.fieldId ) {
                i?.size.map( is => {
                    if ( ( ( sizeFieldId === is.fieldId ) ) ) {
                        is.inputValue = Number( e.target.value );
                    }
                    return is;
                } );
            }
            return i;
        } );
        dispatch( bindSinglePackagingColorSizeDetails( updateInputValue ) );

    };

    const defaultUom = dropdownUom.find( uom => uom.label.toLowerCase().includes( 'cm' ) );

    const onSubmit = () => {
        console.log( defaultUom?.relativeFactor / packagingInfo.lengthUom?.relativeFactor );
        const submitObj = {
            id: packagingInfo.id,
            detailId: packagingInfo.detailId,
            buyerId: packagingInfo.buyer?.value,
            styleId: packagingInfo.style?.value,

            orderId: packagingInfo.orderId,
            orderNumber: packagingInfo.orderNumber,
            shipmentDate: packagingInfo.shipmentDate,
            destination: packagingInfo.destination,

            totalPackSize: packagingInfo.totalPackSize,
            cartonNoSeries: packagingInfo.cartonSeriesNo,
            netWeight: packagingInfo.netWeight,
            grossWeight: packagingInfo.grossWeight,
            length: packagingInfo.length,
            width: packagingInfo.width,
            height: packagingInfo.height,

            lengthUom: packagingInfo.lengthUom?.label,
            lengthInCm: ( defaultUom?.relativeFactor / packagingInfo.lengthUom?.relativeFactor ) * packagingInfo.length,

            widthUom: packagingInfo.widthUom?.label,
            widthInCm: ( defaultUom?.relativeFactor / packagingInfo.widthUom?.relativeFactor ) * packagingInfo.width,

            heightUom: packagingInfo.heightUom?.label,
            heightInCm: ( defaultUom?.relativeFactor / packagingInfo.heightUom?.relativeFactor ) * packagingInfo.height,

            packagingType: packagingInfo.packagingType?.value,
            packagingDetails: singlePackingColorSizeDetails.map( i => (
                i.size.map( ii => ( {
                    colorId: i.colorId,
                    id: ii.id ?? 0,
                    styleId: packagingInfo.style.value,
                    sizeId: ii.sizeId,
                    quantity: Number( ii.inputValue )
                } ) )
            ) ).flat(),

            accessories: singlePackagingAccessoriesDetails.map( acc => ( {
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
        if ( packagingInfo.id ) {
            dispatch( updateSinglePackaging( submitObj, packagingInfo.id ) );
        } else {
            console.log( 'I am from Submit' );
            dispatch( addSinglePackaging( submitObj ) );
        }

    };


    const handleInputChange = ( e ) => {
        const { name, value, type, checked } = e.target;
        const updateObj =
        {
            ...packagingInfo,
            [name]: type === 'number' ? Number( value ) : type === 'checkbox' ? checked : value
        };

        dispatch( bindSinglePackagingBasic( updateObj ) );
    };

    const handlePackingInfoClear = () => {
        const updateObj = {
            ...packagingInfoModel,
            lengthUom: packagingInfo?.lengthUom,
            widthUom: packagingInfo?.widthUom,
            heightUom: packagingInfo?.heightUom
        };
        dispatch( bindSinglePackagingBasic( updateObj ) );
        dispatch( bindSinglePackagingColorSizeDetails( [] ) );
        dispatch( getSinglePackingDetail( null ) );
        dispatch( bindPackagingAccessoriesDetails( [] ) );
    };


    const handleCancel = () => {
        replace( '/home' );
        handlePackingInfoClear();
    };


    console.log( typeof ( packagingInfo?.shipmentDate ) );

    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false
        },
        {
            id: 'packaging',
            name: 'New',
            link: "#",
            isActive: true
        }
    ];
    return (
        <div>
            <Card className="mt-3 single-pack-form">
                <ActionMenu
                    breadcrumb={breadcrumb}
                    title='Single Packaging'

                >
                    <NavItem
                        className="mr-1"
                        hidden={
                            !isPermit( userPermission?.PackagingCreate, authPermissions ) &&
                            !isPermit( userPermission?.PackagingEdit, authPermissions )
                        }
                    >
                        <NavLink
                            tag={Button}

                            size="sm"
                            color="primary"
                            type="submit"
                            onClick={() => { onSubmit(); }}
                        >
                            Save
                        </NavLink>
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


                <CardBody >
                    <div className='mb-1 border rounded rounded-3'>
                        <div>
                            {/* {
                                ( getProgressValue === 100 || getProgressValue === Infinity ) ? null : <Spinner />
                            } */}

                        </div>
                        <Row className="p-1">

                            <Col lg={2} md={6} sm={12}>
                                <div className='custom-form-main'>
                                    <Label className='custom-form-label' for='buyerId'>Buyer</Label>
                                    <Label className='custom-form-colons'> : </Label>
                                    <div className='custom-form-group'>
                                        <Select
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
                                            value={packagingInfo?.buyer}
                                            onFocus={() => { handleBuyerDropdownOnFocus(); }}
                                            onChange={data => {
                                                handleBuyerDropdown( data );
                                            }}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col lg={2} md={6} sm={12}>
                                <div className='custom-form-main'>
                                    <Label className='custom-form-label' for='styleId'>Style</Label>
                                    <Label className='custom-form-colons'> : </Label>
                                    <div className='custom-form-input-group'>
                                        <div className='custom-input-group-prepend inside-btn'>
                                            <Select
                                                id='styleId'
                                                name="style"
                                                isSearchable
                                                menuPosition="fixed"
                                                isClearable
                                                theme={selectThemeColors}
                                                options={buyerStylesDropdown.filter( style => style.isSetStyle === false )}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"
                                                value={packagingInfo.style}
                                                onChange={data => { handleStyleDropDownChange( data ); }}
                                                onFocus={() => { handleStyleDropdownOnFocus(); }}
                                            />
                                        </div>
                                        <div className='custom-input-group-append inside-btn'>
                                            <span>
                                                <Button.Ripple
                                                    className='btn-icon'
                                                    outline
                                                    size="sm"
                                                    color='secondary'
                                                    onClick={() => { handlePurchaseOrderModal(); }}
                                                >
                                                    <MoreHorizontal color='green' size={16} />
                                                </Button.Ripple>
                                            </span>
                                            <span style={{ color: 'green', fontWeight: 'bolder', fontSize: "1.2rem" }}>*</span>

                                        </div>
                                    </div>
                                </div>

                            </Col>
                            <Col lg={2} md={6} sm={12}>
                                <div className='custom-form-main'>
                                    <Label className='custom-form-label' for='orderNumberId'>PO</Label>
                                    <Label className='custom-form-colons'> : </Label>
                                    <div className='custom-form-input-group'>
                                        {packagingInfo?.orderNumber}
                                    </div>
                                </div>

                            </Col>
                            <Col lg={2} md={6} sm={12}>
                                <div className='custom-form-main'>
                                    <Label className='custom-form-label' for='destinationId'>Ship. Date</Label>
                                    <Label className='custom-form-colons'> : </Label>
                                    <div className='custom-form-input-group'>
                                        {packagingInfo?.shipmentDate?.length ? moment( packagingInfo?.shipmentDate ).format( "DD/MM/YYYY" ) : ''}
                                    </div>
                                </div>

                            </Col>
                            <Col lg={2} md={6} sm={12}>
                                <div className='custom-form-main'>
                                    <Label className='custom-form-label' for='destinationId'>Destination</Label>
                                    <Label className='custom-form-colons'> : </Label>
                                    <div className='custom-form-input-group'>
                                        {packagingInfo?.destination}
                                    </div>
                                </div>

                            </Col>
                            <Col lg={2} md={6} sm={12}>
                                <div className=' font-weight-bolder custom-input-box '>
                                    <CustomInput
                                        type='switch'
                                        label="Repeatable Create?"
                                        id="isRepeatableCreateId"
                                        bsSize="sm"
                                        name='isRepeatableCreate'
                                        htmlFor="isRepeatableCreateId"
                                        checked={packagingInfo?.isRepeatableCreate}
                                        onChange={( e ) => { handleInputChange( e ); }}
                                    />
                                </div>

                            </Col>
                        </Row>

                    </div>
                    <Row>
                        <Col>
                            <div style={{ display: "flex", justifyContent: 'flex-end', alignItems: 'center', paddingRight: '4px' }}>
                                <span style={{ color: 'green', fontWeight: 'bolder', fontSize: "1.2rem", marginRight: '0.5rem' }}>*</span>
                                <span style={{ fontWeight: 'bold', fontSize: '0.7rem', fontStyle: 'italic' }}> Buyer PO Modal Open Button</span>
                            </div>
                        </Col>
                    </Row>

                    <Row className='border-bottom '>
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
                                    <Row className="border rounded rounded-3 p-1">
                                        <Col>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={7}>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={5} xl={5}>

                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='styleId'>Ctn. Series No</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <Input
                                                                        id='cartoonNoId'
                                                                        name="cartonSeriesNo"
                                                                        type="text"
                                                                        bsSize="sm"
                                                                        value={packagingInfo.cartonSeriesNo}
                                                                        innerRef={register( { required: true } )}
                                                                        onChange={e => { handleInputChange( e ); }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='sizeColorTypeId'>Types</Label>
                                                                <Label className='custom-form-colons '> : </Label>
                                                                <div className='custom-form-group '>
                                                                    <Select
                                                                        id='sizeColorTypeId'
                                                                        name="packagingType"
                                                                        isSearchable
                                                                        menuPosition="fixed"
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={selectSizeColorType}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        value={packagingInfo?.packagingType}
                                                                        onChange={data => { handleChangeSizeColorType( data ); }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='colorId'>Color</Label>
                                                                <Label className='custom-form-colons '> : </Label>
                                                                <div className='custom-form-group '>
                                                                    <Select
                                                                        id='colorId'
                                                                        name="color"
                                                                        isMulti={packagingInfo?.packagingType?.label === sizeColorTypeEnumObj.assortColorAndSolidSize || packagingInfo?.packagingType?.label === sizeColorTypeEnumObj.assortColorAndAssortSize}
                                                                        isSearchable
                                                                        menuPosition="fixed"
                                                                        isDisabled={!packagingInfo.style || !packagingInfo?.packagingType?.label}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={packagingColorDropdown}
                                                                        value={packagingInfo?.color}
                                                                        onChange={data => { handleColorDropDownChange( data ); }}
                                                                        onFocus={() => { handleColorDropdownOnFocus(); }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='sizeId'>Size</Label>
                                                                <Label className='custom-form-colons '> : </Label>
                                                                <div className='custom-form-group '>
                                                                    <Select
                                                                        id='sizeId'
                                                                        name="size"
                                                                        isMulti={packagingInfo?.packagingType?.label === sizeColorTypeEnumObj.solidColorAndAssortSize || packagingInfo?.packagingType?.label === sizeColorTypeEnumObj.assortColorAndAssortSize}
                                                                        isSearchable
                                                                        isDisabled={!packagingInfo?.color.length}
                                                                        menuPosition="fixed"
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={packagingSizeDropdown}
                                                                        classNamePrefix='dropdown'
                                                                        className="erp-dropdown-select"
                                                                        value={packagingInfo?.size}
                                                                        onChange={data => { handleSizeDropDownChange( data ); }}
                                                                        onFocus={() => { handleSizeDropdownOnFocus(); }}
                                                                    />
                                                                </div>
                                                            </div>


                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={7} xl={7}>
                                                            <Row>
                                                                <Col xs={12} sm={12} md={12} lg={7} xl={7}>
                                                                    <div className='custom-form-main'>
                                                                        <Label className='custom-form-measurement-label' for='lengthId'>Length</Label>
                                                                        <Label className='custom-form-colons '> : </Label>
                                                                        <div className='custom-form-measurement-input-group'>
                                                                            <div className='value-input'>
                                                                                <Input
                                                                                    id='lengthId'
                                                                                    type='number'
                                                                                    name="length"
                                                                                    value={packagingInfo?.length}
                                                                                    placeholder='0.00'
                                                                                    bsSize="sm"
                                                                                    className='text-right'
                                                                                    onFocus={e => e.target.select()}
                                                                                    onChange={e => { handleInputChange( e ); }}
                                                                                />
                                                                            </div>
                                                                            <div className='uom-option'>
                                                                                <Select
                                                                                    id='lengthUomId'
                                                                                    name="lengthUom"
                                                                                    placeholder="UOM"
                                                                                    isSearchable
                                                                                    menuPosition="fixed"

                                                                                    theme={selectThemeColors}
                                                                                    options={dropdownUom}
                                                                                    classNamePrefix='dropdown'
                                                                                    className="erp-dropdown-select"
                                                                                    value={packagingInfo?.lengthUom}
                                                                                    onChange={( e, data ) => { handleUomDropdownOnChange( e, data ); }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='custom-form-main'>
                                                                        <Label className='custom-form-measurement-label' for='widthId'>Width</Label>
                                                                        <Label className='custom-form-colons'> : </Label>

                                                                        <div className='custom-form-measurement-input-group'>
                                                                            <div className='value-input'>
                                                                                <Input
                                                                                    id='widthId'
                                                                                    type='number'
                                                                                    name="width"
                                                                                    bsSize="sm"
                                                                                    value={packagingInfo?.width}
                                                                                    placeholder='0.00'
                                                                                    className='text-right'
                                                                                    onFocus={e => e.target.select()}
                                                                                    onChange={e => { handleInputChange( e ); }}
                                                                                />
                                                                            </div>
                                                                            <div className='uom-option'>
                                                                                <Select
                                                                                    id='widthUomId'
                                                                                    name="widthUom"
                                                                                    placeholder="UOM"
                                                                                    isSearchable
                                                                                    menuPosition="fixed"

                                                                                    theme={selectThemeColors}
                                                                                    options={dropdownUom}
                                                                                    classNamePrefix='dropdown'
                                                                                    className="erp-dropdown-select"
                                                                                    value={packagingInfo?.widthUom}
                                                                                    onChange={( e, data ) => { handleUomDropdownOnChange( e, data ); }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='custom-form-main'>
                                                                        <Label className='custom-form-measurement-label' for='heightId'>Height</Label>
                                                                        <Label className='custom-form-colons '> : </Label>

                                                                        <div className='custom-form-measurement-input-group'>
                                                                            <div className='value-input'>
                                                                                <Input
                                                                                    id='heightId'
                                                                                    type='number'
                                                                                    name="height"
                                                                                    bsSize="sm"
                                                                                    value={packagingInfo?.height}
                                                                                    placeholder='0.00'
                                                                                    className='text-right'
                                                                                    onFocus={e => e.target.select()}
                                                                                    onChange={e => { handleInputChange( e ); }}
                                                                                />
                                                                            </div>
                                                                            <div className='uom-option'>
                                                                                <Select
                                                                                    id='heightUomId'
                                                                                    name="heightUom"
                                                                                    placeholder="UOM"
                                                                                    isSearchable
                                                                                    menuPosition="fixed"

                                                                                    theme={selectThemeColors}
                                                                                    options={dropdownUom}
                                                                                    classNamePrefix='dropdown'
                                                                                    className="erp-dropdown-select"
                                                                                    value={packagingInfo?.heightUom}
                                                                                    onChange={( data, e ) => { handleUomDropdownOnChange( data, e ); }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </Col>
                                                                <Col xs={12} sm={12} md={12} lg={5} xl={5}>

                                                                    <div className='custom-form-main'>
                                                                        <Label className='custom-form-label ' for='netWeightId'>Net wt.</Label>
                                                                        <Label className='custom-form-colons'> : </Label>

                                                                        <div className='custom-form-group '>
                                                                            <Input
                                                                                className="text-right"
                                                                                id='netWeightId'
                                                                                name="netWeight"
                                                                                type="number"
                                                                                bsSize="sm"
                                                                                value={packagingInfo.netWeight}
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
                                                                                value={packagingInfo.grossWeight}
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
                                                                                value={packagingInfo.totalPackSize}
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
                                                <Col xs={12} sm={12} md={12} lg={5}>
                                                    <div className='border rounded pt-0 pr-1 pb-1 pl-1'>
                                                        <Label className="text-dark font-weight-bolder" for='totalPackSizeId'>Pack Details </Label>

                                                        {
                                                            ( packagingInfo?.size?.length > 0 ) ? <>
                                                                <div className="packing-scc-table">
                                                                    <Table size="sm" bordered>
                                                                        <thead className='thead-light  text-center'>
                                                                            <tr>
                                                                                <th style={{ width: '15px' }} className="text-nowrap">SL.</th>
                                                                                <th style={{ width: '95px' }} className="text-nowrap">Color</th>
                                                                                {singlePackingColorSizeDetails?.map( i => (
                                                                                    i?.size?.map( is => (
                                                                                        <Fragment key={is.sizeName}>
                                                                                            <th>{is.sizeName}</th>
                                                                                        </Fragment>
                                                                                    ) )
                                                                                ) )[0]}
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="text-center">
                                                                            {singlePackingColorSizeDetails?.map( ( i, idx ) => (
                                                                                <tr key={i.fieldId}>
                                                                                    <td className="text-nowrap">{idx + 1}</td>
                                                                                    <td className="text-nowrap">{i.colorName}</td>
                                                                                    {i?.size?.map( ( is ) => (
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
                                                                                                    }} />
                                                                                            </td>
                                                                                        </Fragment>
                                                                                    ) )}
                                                                                </tr>
                                                                            ) )}
                                                                        </tbody>
                                                                    </Table>
                                                                </div>
                                                            </> : <>
                                                                <div className="packing-scc-table">
                                                                    <Table size="sm" bordered>
                                                                        <thead className='thead-light  text-center'>
                                                                            <tr>
                                                                                <th style={{ width: '15px' }} className="text-nowrap">SL.</th>
                                                                                <th style={{ width: '95px' }} className="text-nowrap">Color</th>
                                                                                <th style={{ width: '95px' }} className="text-nowrap">Size</th>

                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="text-center">
                                                                            {singlePackingColorSizeDetails?.map( ( i, idx ) => (
                                                                                <tr key={i.fieldId}>
                                                                                    <td className="text-nowrap">{idx + 1}</td>
                                                                                    <td className="text-nowrap">{i.colorName}</td>
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
                                                    <SinglePackagingAccessoriesDetails />
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
                                            <SinglePackagingDetails />
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                        </Col>
                    </Row>


                </CardBody>
            </Card>

            {
                openPackagingPurchaseOrderModal && (
                    <PackagingPurchaseOrderModal
                        openModal={openPackagingPurchaseOrderModal}
                        setOpenModal={setOpenPackagingPurchaseOrderModal}
                    />
                )
            }
        </div>
    );
};

export default PackagingForSingleStyle;

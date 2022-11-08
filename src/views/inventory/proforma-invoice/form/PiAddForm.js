import FallbackSpinner from '@components/spinner/Fallback-spinner';
import '@custom-styles/inventory/form/pi-custom-form.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import moment from 'moment';
import { useState } from 'react';
import { MoreHorizontal, Search } from 'react-feather';
import { useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Input, Label, NavItem, NavLink, Row } from 'reactstrap';
import * as yup from 'yup';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { procurementStatus, selectPayTerm, selectPurchaser, selectPurpose, selectShipmentMode, selectTerm, source } from '../../../../utility/enums';
import { isPermit, isZeroToFixed, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownBuyers } from '../../../merchandising/buyer/store/actions';
import { getCurrencyDropdown } from '../../../merchandising/currency/store/actions';
import { getVendorDropdown } from '../../vendor/store/actions';
import { addPi, bindPiBasicInfo, bindSelectedProcurementItems, bindSelectedSupplierOrders, clearAllPIState, getProcurementItemsByOrdersId, getSupplierOrders } from '../store/actions';
import PiDocuments from './PiDocuments';
import PiSelectedItem from './PiSelectedItem';
import ProcurementOrderModal from './ProcurementOrderModal';

import _ from 'lodash';
import { notify } from '../../../../utility/custom/notifications';
import PiSearchableListModal from './PiSearchableListModal';
import PISupplierOrderModal from './PISupplierOrderModal';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: '/',
        isActive: false
    },
    {
        id: 'pis',
        name: 'IPI List',
        link: '/pis',
        isActive: false
    }
];
const PiAddForm = () => {
    const { push } = useHistory();
    const dispatch = useDispatch();
    const { piBasicInfo, selectedProcurementItems, isPiDataProgress } = useSelector( ( { pis } ) => pis );
    const { currencyDropdown } = useSelector( ( { currencies } ) => currencies );

    const { vendorDropdown } = useSelector( ( { vendors } ) => vendors );
    const { dropDownBuyers } = useSelector( ( { buyers } ) => buyers );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );


    const [procurementOrderModalOpen, setProcurementOrderModalOpen] = useState( false );
    const [searchMOdalOpen, setSearchMOdalOpen] = useState( false );

    const [openSupplierModal, setOpenSupplierModal] = useState( false );

    const [dropdownDataLoaded, setDropdownDataLoaded] = useState( {
        buyer: false,
        supplier: false
    } );

    const validationSchema = yup.object().shape( {
        piNumber: piBasicInfo.piNumber.length ? yup.string() : yup.string().required( 'IPI is required!' ),
        supplier: piBasicInfo?.supplier ? yup.string() : yup.string().required( 'Supplier is required!' ),
        buyer: piBasicInfo?.buyer ? yup.string() : yup.string().required( 'Buyer is required!' ),
        piDate: piBasicInfo?.piDate.length ? yup.date() : yup.date().required( 'IPI Date is required!' ),
        purchaser: piBasicInfo?.purchaser ? yup.string() : yup.string().required( 'Purchaser is required!' ),
        purpose: piBasicInfo?.purpose ? yup.string() : yup.string().required( 'Purpose is required!' ),
        tradeTerm: piBasicInfo?.tradeTerm ? yup.string() : yup.string().required( 'Trade term is required!' ),
        payTerm: piBasicInfo?.payTerm ? yup.string() : yup.string().required( 'Pay term is required!' ),
        source: piBasicInfo?.source ? yup.string() : yup.string().required( 'Source is required!' ),
        currency: piBasicInfo?.currency ? yup.string() : yup.string().required( 'Pay term is required!' ),
        conversionRate: yup.number().required( 'Currency Conversion is required!' ),
        //  conversionRate: piBasicInfo?.conversionRate !== 0 ? yup.number() : yup.number().required( 'Currency Conversion is required!' ),
        shipmentMode: piBasicInfo?.shipmentMode ? yup.string() : yup.string().required( 'Ship Mode  is required!' ),
        shipmentDate: yup.date().required( 'Ship Date is required!' ),
        etaDate: yup.date().required( 'ETA is required!' )
        // itemValue: piBasicInfo?.itemValue ? yup.string() : yup.string().required( 'itemValue is required!' ),
        //   serviceCharge: piBasicInfo?.serviceCharge ? yup.string() : yup.string().required( 'serviceCharge is required!' ),
        //  additionalCharge: piBasicInfo?.additionalCharge ? yup.string() : yup.string().required( 'additionalCharge is required!' ),
        //  deductionAmount: piBasicInfo?.deductionAmount ? yup.string() : yup.string().required( 'deductionAmount is required!' ),
        //  piValue: piBasicInfo?.piValue ? yup.number() : yup.number().required( 'piValue is required!' )

    } );

    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );
    console.log( errors );


    const handleVendorDropdownOnFocus = () => {
        dispatch( getVendorDropdown() );
    };

    const handleBuyerDropdownOnFocus = () => {
        dispatch( getDropDownBuyers() );
        setDropdownDataLoaded( {
            ...dropdownDataLoaded,
            buyer: true
        } );
    };

    const handleCurrencyDropdownOnFocus = () => {
        dispatch( getCurrencyDropdown() );
    };


    const handleSearchModalOpen = () => {
        setSearchMOdalOpen( !searchMOdalOpen );
    };

    const handleSupplierOrderModal = () => {
        setOpenSupplierModal( !openSupplierModal );
        dispatch( getVendorDropdown() );

    };

    const handleBasicInfoDropdownChange = ( data, e ) => {
        const { action, name, option } = e;
        if ( name === 'supplier' ) {
            const updatedObj = {
                ...piBasicInfo,
                [name]: data
            };
            dispatch( bindPiBasicInfo( updatedObj ) );
            dispatch( getProcurementItemsByOrdersId( [] ) );
            dispatch( bindSelectedSupplierOrders( [] ) );
            dispatch( bindSelectedProcurementItems( [] ) );

        } else if ( name === 'currency' ) {
            const updatedObj = {
                ...piBasicInfo,
                [name]: data,
                ['conversionRate']: data?.conversionRate ?? 0,
                ['conversionCurrencyCode']: currencyDropdown?.find( cc => cc.isBaseCurrency === true )?.label
            };
            dispatch( bindPiBasicInfo( updatedObj ) );

        } else {
            const updatedObj = {
                ...piBasicInfo,
                [name]: data
            };
            dispatch( bindPiBasicInfo( updatedObj ) );
        }

    };

    const handleBasicInfoInputOnChange = ( e ) => {
        const { name, value, checked, type } = e.target;
        const updatedObj = {
            ...piBasicInfo,
            [name]: type === 'number' ? Number( value ) : type === 'date' ? moment( value ).format( 'yy-MM-DD' ) : type === "checkbox" ? checked : value
        };
        dispatch( bindPiBasicInfo( updatedObj ) );
    };

    const handleBasicInfoInputNumberOnChange = ( e ) => {
        const { name, value } = e.target;
        const isName = name === 'serviceCharge' || name === "additionalCharge" || name === "deductionAmount";
        if ( value !== '.' ) {
            const updatedObj = {
                ...piBasicInfo,
                [name]: isName ? Number( value ) : value
            };
            dispatch( bindPiBasicInfo( updatedObj ) );
        }
    };


    const handleProcurementOrderModalOpen = () => {
        setProcurementOrderModalOpen( !procurementOrderModalOpen );
        dispatch( getSupplierOrders( piBasicInfo.buyer?.value, piBasicInfo.supplier?.value, piBasicInfo.source?.value ) );

    };


    const isValidatedArray = () => {
        const errorField = selectedProcurementItems.map( od => {
            if ( od.quantity === 0 ) {
                console.log( od.quantity === 0 );
                od['isFieldError'] = true;
            } else {
                od['isFieldError'] = false;
            }
            return od;
        } );
        //   console.log( errorField.some( e => e.isFieldError ) );
        dispatch( bindSelectedProcurementItems( errorField ) );

        console.log( errorField );

        return errorField.some( e => e.isFieldError );
    };
    const onSubmit = () => {
        const orderDetails = selectedProcurementItems.map( ( item, index ) => ( {
            rowNo: index + 1,
            supplierOrderId: item.supplierOrderId,
            supplierOrderNumber: item.supplierOrderNumber,
            groupType: item.groupType,
            categoryId: item.itemCategoryId,
            category: item.itemCategory,
            subCategoryId: item.itemSubCategoryId,
            subCategory: item.itemSubCategory,
            itemCode: item.itemCode,
            itemName: item.itemName,
            itemId: item.itemId,
            rate: item.orderRate,
            quantity: item.quantity,
            amount: item.quantity * item.orderRate,
            styleId: item.styleId,
            styleNumber: item.styleNumber,
            orderId: item.orderId,
            orderNumber: item.orderNumber,
            budgetId: item.budgetId,
            budgetNumber: item.budgetNumber,
            uom: item.uom

        } ) );
        const submitObj = {
            supplierId: piBasicInfo?.supplier?.value,
            buyerId: piBasicInfo?.buyer?.value,
            buyerName: piBasicInfo?.buyer?.label,
            piNumber: piBasicInfo.piNumber,
            piDate: piBasicInfo?.piDate,
            purchaser: piBasicInfo?.purchaser?.label ?? '',
            purpose: piBasicInfo?.purpose?.label ?? '',
            tradeTerm: piBasicInfo?.tradeTerm?.label,
            payTerm: piBasicInfo?.payTerm?.label,
            currencyCode: piBasicInfo?.currency?.label,
            currencyRate: piBasicInfo?.conversionRate,
            conversionCurrencyCode: piBasicInfo?.conversionCurrencyCode,
            shipmentMode: piBasicInfo?.shipmentMode?.label,
            shipmentDate: piBasicInfo?.shipmentDate,
            etaDate: piBasicInfo?.etaDate,
            itemValue: piBasicInfo?.itemValue,
            serviceCharge: piBasicInfo?.serviceCharge,
            source: piBasicInfo?.source?.value,
            additionalCharge: piBasicInfo?.additionalCharge,
            deductionAmount: piBasicInfo?.deductionAmount,
            piValue: piBasicInfo?.piValue,
            termsAndConditions: piBasicInfo?.termsAndConditions,
            files: piBasicInfo?.files,
            status: piBasicInfo?.status?.label,

            orderDetails
        };

        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );

        if ( submitObj.orderDetails.length ) {
            if ( !isValidatedArray() ) {
                dispatch( addPi( submitObj, push ) );
            } else {
                notify( 'warning', 'Please Provide Validated Data!' );
            }
        } else {
            notify( 'warning', 'Please add at least an item!!!' );
        }


    };

    ///Total Order Qty Show Up
    const totalItemValue = () => {
        const total = _.sum( selectedProcurementItems.map( item => item.quantity * item.orderRate ) );
        return total;
    };
    const totalPOvalue = () => {
        const total = ( totalItemValue() + piBasicInfo?.serviceCharge + piBasicInfo?.additionalCharge ) - piBasicInfo?.deductionAmount;
        return total;
    };
    const handleCancel = () => {
        dispatch( clearAllPIState() );
        // dispatch( bindSupplierOrderOnChange( null ) );
        // dispatch( bindSelectedSupplierOrders( [] ) );
        // dispatch( bindProcurementItems( [] ) );
        // dispatch( bindSelectedProcurementItems( [] ) );
        push( '/pis' );
    };
    return (
        <div>
            <ActionMenu breadcrumb={breadcrumb} title='New IPI' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        disabled={isPiDataProgress}
                        size="sm"
                        color="primary"
                        type="submit"
                        onClick={handleSubmit( onSubmit )}
                    >Save</NavLink>
                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => { handleCancel(); }}
                    >
                        Cancel
                    </NavLink>
                </NavItem>
            </ActionMenu>
            {isPiDataProgress ? <FallbackSpinner /> : (
                <Card className="mt-3 pi-custom-form">
                    <CardBody>
                        <Row>
                            <Col>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Proforma Invoice (IPI)</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='sysId'> IPI ID</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-input-group'>
                                                    <div className='custom-input-group-prepend inside-btn'>
                                                        <Input
                                                            id="sysId"
                                                            type="text"
                                                            name="sysId"
                                                            placeholder="IPI ID"
                                                            bsSize="sm"
                                                            disabled
                                                            value={piBasicInfo?.sysId}
                                                            onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}

                                                        />
                                                    </div>
                                                    <div className='custom-input-group-append inside-btn'>
                                                        <Button.Ripple
                                                            className='btn-icon'
                                                            outline
                                                            size="sm"
                                                            color='secondary'
                                                            onClick={() => { handleSearchModalOpen(); }}
                                                        >
                                                            <Search size={16} />
                                                        </Button.Ripple>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='piNumberId'> IPI NO <span className='text-danger'>*</span></Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <Input
                                                        id="piNumberId"
                                                        type="text"
                                                        name="piNumber"
                                                        placeholder="IPI Number"
                                                        bsSize="sm"
                                                        value={piBasicInfo?.piNumber}
                                                        onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                                                        className={classnames( { 'is-invalid': errors['piNumber'] && !piBasicInfo.piNumber?.length } )}
                                                    />
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='buyerId'> Buyer <span className='text-danger'>*</span></Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <Select
                                                        id='buyerId'
                                                        //   isLoading={( !dropdownDataLoaded.length && !dropdownDataLoaded.buyer )}
                                                        name="buyer"
                                                        isSearchable
                                                        menuPosition="fixed"
                                                        isClearable
                                                        theme={selectThemeColors}
                                                        options={dropDownBuyers}
                                                        classNamePrefix='dropdown'
                                                        innerRef={register( { required: true } )}
                                                        className={classnames( `erp-dropdown-select ${( errors && errors.buyer && !piBasicInfo?.buyer ) && 'is-invalid'}` )}
                                                        value={piBasicInfo?.buyer}
                                                        onChange={( data, e ) => {
                                                            handleBasicInfoDropdownChange( data, e );
                                                        }}
                                                        onFocus={() => { handleBuyerDropdownOnFocus(); }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='supplierId'> Supplier <span className='text-danger'>*</span></Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-input-group'>
                                                    <div className='custom-input-group-prepend inside-btn'>
                                                        <Select
                                                            id='supplierId'
                                                            name="supplier"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            isClearable
                                                            theme={selectThemeColors}
                                                            options={vendorDropdown}
                                                            classNamePrefix='dropdown'
                                                            innerRef={register( { required: true } )}
                                                            className={classnames( `erp-dropdown-select ${( errors && errors.supplier && !piBasicInfo?.supplier ) && 'is-invalid'}` )}
                                                            value={piBasicInfo?.supplier}
                                                            onChange={( data, e ) => {
                                                                handleBasicInfoDropdownChange( data, e );
                                                            }}
                                                            onFocus={() => { handleVendorDropdownOnFocus(); }}
                                                        />
                                                    </div>
                                                    <div className='custom-input-group-append inside-btn'>
                                                        <Button.Ripple
                                                            className='btn-icon'
                                                            outline
                                                            size="sm"
                                                            color='secondary'
                                                            onClick={() => { handleSupplierOrderModal(); }}
                                                        >
                                                            <Search size={16} />
                                                        </Button.Ripple>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='purposeId'> Purpose <span className='text-danger'>*</span></Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <Select
                                                        id='purposeId'
                                                        name="purpose"
                                                        isSearchable
                                                        menuPosition="fixed"
                                                        isClearable
                                                        theme={selectThemeColors}
                                                        options={selectPurpose}
                                                        classNamePrefix='dropdown'
                                                        innerRef={register( { required: true } )}
                                                        className={classnames( `erp-dropdown-select ${( errors && errors.purpose && !piBasicInfo?.purpose ) && 'is-invalid'}` )}
                                                        value={piBasicInfo?.purpose}
                                                        onChange={( data, e ) => {
                                                            handleBasicInfoDropdownChange( data, e );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='sourceId'>Source <span className='text-danger'>*</span></Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-input-group'>
                                                    <div className='custom-input-group-prepend inside-btn'>
                                                        <Select
                                                            id='sourceId'
                                                            name="source"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            isClearable
                                                            theme={selectThemeColors}
                                                            options={source}
                                                            classNamePrefix='dropdown'
                                                            innerRef={register( { required: true } )}
                                                            className={classnames( `erp-dropdown-select ${( errors && errors.source && !piBasicInfo?.source ) && 'is-invalid'}` )}
                                                            value={piBasicInfo?.source}
                                                            onChange={( data, e ) => {
                                                                handleBasicInfoDropdownChange( data, e );
                                                            }}
                                                        />
                                                    </div>
                                                    <div className='custom-input-group-append inside-btn'>
                                                        <span>
                                                            <Button.Ripple
                                                                disabled={!( piBasicInfo?.buyer && piBasicInfo?.supplier && piBasicInfo?.source )}
                                                                className='btn-icon'
                                                                outline
                                                                size="sm"
                                                                color='secondary'
                                                                onClick={() => { handleProcurementOrderModalOpen(); }}
                                                            >
                                                                <MoreHorizontal size={16} />
                                                            </Button.Ripple>
                                                        </span>
                                                        <span style={{ color: 'green', fontWeight: 'bolder', fontSize: "1.2rem" }}>*</span>


                                                    </div>
                                                </div>
                                                {/* <div className='custom-form-group'>
                                                    <Select
                                                        id='sourceId'
                                                        name="source"
                                                        isSearchable
                                                        menuPosition="fixed"
                                                        isClearable
                                                        theme={selectThemeColors}
                                                        options={source}
                                                        classNamePrefix='dropdown'
                                                        innerRef={register( { required: true } )}
                                                        className={classnames( `erp-dropdown-select ${( errors && errors.source && !piBasicInfo?.source ) && 'is-invalid'}` )}
                                                        value={piBasicInfo?.source}
                                                        onChange={( data, e ) => {
                                                            handleBasicInfoDropdownChange( data, e );
                                                        }}
                                                    />
                                                </div> */}
                                            </div>

                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='supplierId'> Style <span className='text-danger'>*</span></Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>

                                                    <Input
                                                        id="styleId"
                                                        type="text"
                                                        name="styleNo"
                                                        placeholder="Style"
                                                        bsSize="sm"
                                                        disabled
                                                        value={piBasicInfo?.styleNo}
                                                        onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}

                                                    />

                                                </div>
                                            </div>


                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='supplierPOId'> Supplier PO </Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <Input
                                                        id="supplierPOId"
                                                        type="text"
                                                        name="supplierPO"
                                                        placeholder="Supplier PO"
                                                        bsSize="sm"
                                                        disabled
                                                        value={piBasicInfo?.supplierPO}
                                                        onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}

                                                    />
                                                </div>
                                            </div>

                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='piDateId'> IPI Date <span className='text-danger'>*</span></Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <Input
                                                        id="piDateId"
                                                        type="date"
                                                        name="piDate"
                                                        placeholder="IPI Date"
                                                        bsSize="sm"
                                                        value={piBasicInfo?.piDate}
                                                        onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                                                        innerRef={register( { required: true } )}
                                                        className={classnames( { 'is-invalid': errors['piDate'] } )}
                                                    />
                                                </div>
                                            </div>


                                        </Col>

                                        <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={6} xl={6}>


                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='currencyId'> Currency <span className='text-danger'>*</span></Label>
                                                        <Label className='custom-form-colons'> : </Label>

                                                        <div className='custom-form-input-group'>
                                                            <div className='custom-input-group-prepend'>
                                                                <Select
                                                                    id='currencyId'
                                                                    name="currency"
                                                                    isSearchable
                                                                    menuPosition="fixed"
                                                                    isClearable
                                                                    theme={selectThemeColors}
                                                                    options={currencyDropdown}
                                                                    classNamePrefix='dropdown'
                                                                    innerRef={register( { required: true } )}
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.currency && !piBasicInfo?.currency ) && 'is-invalid'}` )}
                                                                    value={piBasicInfo?.currency}
                                                                    onChange={( data, e ) => {
                                                                        handleBasicInfoDropdownChange( data, e );
                                                                    }}
                                                                    onFocus={() => { handleCurrencyDropdownOnFocus(); }}

                                                                />
                                                            </div>
                                                            <div className='custom-input-group-append'>
                                                                <Input
                                                                    //  className="text-right"
                                                                    type="number"
                                                                    name="conversionRate"
                                                                    bsSize="sm"
                                                                    innerRef={register( { required: true } )}
                                                                    placeholder="৳ Conversion Rate"
                                                                    value={piBasicInfo?.conversionRate}
                                                                    onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                                                                    onFocus={( e ) => e.target.select()}
                                                                    className={classnames( { 'is-invalid': errors['conversionRate'] } )}

                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='etaId'> Item Value</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <Input
                                                                bsSize="sm"
                                                                disabled
                                                                value={isZeroToFixed( totalItemValue(), 4 )}
                                                                name="itemValue"
                                                                onFocus={e => {
                                                                    e.target.select();
                                                                }}
                                                                onChange={( e ) => { handleBasicInfoInputNumberOnChange( e ); }}
                                                            />

                                                        </div>
                                                    </div>

                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='etaId'> Service Charge</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <NumberFormat
                                                                className={classnames( `form-control-sm form-control ${( errors.serviceCharge ) && 'is-invalid'}` )}
                                                                value={piBasicInfo?.serviceCharge}
                                                                displayType="input"
                                                                name="serviceCharge"
                                                                decimalScale={4}
                                                                fixedDecimalScale={piBasicInfo?.serviceCharge !== 0}
                                                                allowNegative={false}
                                                                allowLeadingZeros={false}
                                                                onFocus={e => {
                                                                    e.target.select();
                                                                }}
                                                                onChange={( e ) => { handleBasicInfoInputNumberOnChange( e ); }}
                                                                onBlur={( e ) => { handleBasicInfoInputNumberOnChange( e ); }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='etaId'> Additional Charge</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <NumberFormat
                                                                className={classnames( `form-control-sm form-control ${( errors.additionalCharge ) && 'is-invalid'}` )}
                                                                value={piBasicInfo?.additionalCharge}
                                                                displayType="input"
                                                                name="additionalCharge"
                                                                decimalScale={4}
                                                                fixedDecimalScale={piBasicInfo?.additionalCharge !== 0}
                                                                allowNegative={false}
                                                                allowLeadingZeros={false}
                                                                onFocus={e => {
                                                                    e.target.select();
                                                                }}
                                                                onChange={( e ) => { handleBasicInfoInputNumberOnChange( e ); }}
                                                                onBlur={( e ) => { handleBasicInfoInputNumberOnChange( e ); }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='etaId'> Deduction Amount</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <NumberFormat
                                                                className={classnames( `form-control-sm form-control ${( errors.deductionAmount ) && 'is-invalid'}` )}
                                                                value={piBasicInfo?.deductionAmount}
                                                                displayType="input"
                                                                name="deductionAmount"
                                                                decimalScale={4}
                                                                fixedDecimalScale={piBasicInfo?.deductionAmount !== 0}
                                                                allowNegative={false}
                                                                allowLeadingZeros={false}
                                                                onFocus={e => {
                                                                    e.target.select();
                                                                }}
                                                                onChange={( e ) => { handleBasicInfoInputNumberOnChange( e ); }}
                                                                onBlur={( e ) => { handleBasicInfoInputNumberOnChange( e ); }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='etaId'> IPI Value</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <Input
                                                                bsSize="sm"
                                                                disabled
                                                                value={isZeroToFixed( totalPOvalue(), 4 )}
                                                                name="itemValue"
                                                                onFocus={e => {
                                                                    e.target.select();
                                                                }}
                                                                onChange={( e ) => { handleBasicInfoInputNumberOnChange( e ); }}
                                                            />
                                                        </div>
                                                    </div>

                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='shipModeId'> Ship Mode <span className='text-danger'>*</span></Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <Select
                                                                id='shipModeId'
                                                                name="shipmentMode"
                                                                isSearchable
                                                                menuPosition="fixed"
                                                                isClearable
                                                                theme={selectThemeColors}
                                                                options={selectShipmentMode}
                                                                classNamePrefix='dropdown'
                                                                innerRef={register( { required: true } )}
                                                                className={classnames( `erp-dropdown-select ${( errors && errors.shipmentMode && !piBasicInfo?.shipmentMode ) && 'is-invalid'}` )}
                                                                value={piBasicInfo?.shipmentMode}
                                                                onChange={( data, e ) => {
                                                                    handleBasicInfoDropdownChange( data, e );
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='shipDateId'> Ship Date <span className='text-danger'>*</span></Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <Input
                                                                id="shipDateId"
                                                                type="date"
                                                                name="shipmentDate"
                                                                bsSize="sm"
                                                                value={piBasicInfo?.shipmentDate}
                                                                onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                                                                innerRef={register( { required: true } )}
                                                                className={classnames( { 'is-invalid': errors['shipmentDate'] } )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='tradeTermId'> Trade Term <span className='text-danger'>*</span></Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <Select
                                                                id='tradeTermId'
                                                                name="tradeTerm"
                                                                isSearchable
                                                                menuPosition="fixed"
                                                                isClearable
                                                                theme={selectThemeColors}
                                                                options={selectTerm}
                                                                classNamePrefix='dropdown'
                                                                innerRef={register( { required: true } )}
                                                                className={classnames( `erp-dropdown-select ${( errors && errors.tradeTerm && !piBasicInfo?.tradeTerm ) && 'is-invalid'}` )}
                                                                value={piBasicInfo?.tradeTerm}
                                                                onChange={( data, e ) => {
                                                                    handleBasicInfoDropdownChange( data, e );
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='payTermId'> Pay Term <span className='text-danger'>*</span></Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <Select
                                                                id='payTermId'
                                                                name="payTerm"
                                                                isSearchable
                                                                menuPosition="fixed"
                                                                isClearable
                                                                theme={selectThemeColors}
                                                                options={selectPayTerm}
                                                                classNamePrefix='dropdown'
                                                                innerRef={register( { required: true } )}
                                                                className={classnames( `erp-dropdown-select ${( errors && errors.payTerm && !piBasicInfo?.payTerm ) && 'is-invalid'}` )}
                                                                value={piBasicInfo?.payTerm}
                                                                onChange={( data, e ) => {
                                                                    handleBasicInfoDropdownChange( data, e );
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='purchaserId'> Purchaser</Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <Select
                                                                id='purchaserId'
                                                                name="purchaser"
                                                                isSearchable
                                                                menuPosition="fixed"
                                                                isClearable
                                                                theme={selectThemeColors}
                                                                options={selectPurchaser}
                                                                classNamePrefix='dropdown'
                                                                innerRef={register( { required: true } )}
                                                                className={classnames( `erp-dropdown-select ${( errors && errors.purchaser && !piBasicInfo?.purchaser ) && 'is-invalid'}` )}
                                                                value={piBasicInfo?.purchaser}
                                                                onChange={( data, e ) => {
                                                                    handleBasicInfoDropdownChange( data, e );
                                                                }}
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label' for='etaId'> ETA <span className='text-danger'>*</span></Label>
                                                        <Label className='custom-form-colons'> : </Label>
                                                        <div className='custom-form-group'>
                                                            <Input
                                                                id="etaId"
                                                                type="date"
                                                                name="etaDate"
                                                                bsSize="sm"
                                                                value={piBasicInfo?.etaDate}
                                                                onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                                                                innerRef={register( { required: true } )}
                                                                className={classnames( { 'is-invalid': errors['etaDate'] } )}
                                                            />
                                                        </div>
                                                    </div>

                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label col-div-12' for='budgetId'> Term and Condition</Label>
                                                        <Label className='custom-form-colons col-div-12'> : </Label>
                                                        <div className='custom-form-group col-div-12'>
                                                            <Input
                                                                type="textarea"
                                                                name="termsAndConditions"
                                                                bsSize="sm"
                                                                value={piBasicInfo?.termsAndConditions}
                                                                onChange={( e ) => { handleBasicInfoInputOnChange( e ); }}
                                                                onFocus={( e ) => e.target.select()}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: 'flex-end', alignItems: 'center' }}>
                                                        <span style={{ color: 'green', fontWeight: 'bolder', fontSize: "1.2rem", marginRight: '0.5rem' }}>*</span>
                                                        <span style={{ fontWeight: 'bold', fontSize: '0.7rem', fontStyle: 'italic' }}> IPO and Item Details Modal Open Button</span>
                                                    </div>


                                                </Col>
                                            </Row>

                                        </Col>


                                    </Row>

                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={3}>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Documents</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <PiDocuments />
                                </div>
                            </Col>
                        </Row>
                        <Row >
                            {/* <Col>
                            <div className='divider divider-left '>
                                <div className='divider-text text-secondary font-weight-bolder'>Order Details</div>
                            </div>
                            <div className="border rounded rounded-3 p-1">
                                <PiSelectedProcurementOrder />
                            </div>
                        </Col> */}

                        </Row>
                        <Row >
                            <Col>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Item Details</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row>
                                        <Col>
                                            <PiSelectedItem />
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="border rounded rounded-3 p-1 mt-1">
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='statusId'>Status</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>
                                                    <Select
                                                        id='pOrderId'
                                                        isDisabled={!isPermit( userPermission?.ProformaInvoiceCanApprove, authPermissions )}

                                                        name="status"
                                                        isSearchable
                                                        menuPosition="fixed"
                                                        isClearable
                                                        theme={selectThemeColors}
                                                        options={procurementStatus}
                                                        classNamePrefix='dropdown'
                                                        innerRef={register( { required: true } )}
                                                        className={classnames( `erp-dropdown-select ${( errors && errors.status && !piBasicInfo?.status ) && 'is-invalid'}` )}
                                                        value={piBasicInfo?.status}
                                                        onChange={( data, e ) => {
                                                            handleBasicInfoDropdownChange( data, e );
                                                        }} />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='statusId'>Approved By</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>

                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                            <div className='custom-form-main'>
                                                <Label className='custom-form-label' for='statusId'>Approved Date</Label>
                                                <Label className='custom-form-colons'> : </Label>
                                                <div className='custom-form-group'>

                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            )
            }
            {
                procurementOrderModalOpen &&
                <ProcurementOrderModal
                    openModal={procurementOrderModalOpen}
                    setOpenModal={setProcurementOrderModalOpen}
                />
            }
            {
                searchMOdalOpen && (
                    <PiSearchableListModal
                        setOpenModal={setSearchMOdalOpen}
                        openModal={searchMOdalOpen}
                    />
                )
            }
            {
                openSupplierModal && (
                    <PISupplierOrderModal
                        setOpenModal={setOpenSupplierModal}
                        openModal={openSupplierModal}
                    />
                )
            }
        </div >
    );
};

export default PiAddForm;
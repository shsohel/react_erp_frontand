import classnames from 'classnames';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { Col, Input, Label, Row } from 'reactstrap';
import { selectTerm } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';
import { getCurrencyCodeDropdown } from '../../../merchandising/currency/store/actions';
import { bindVendorDataOnchange } from '../store/actions';
// defaultCurrency": "string",
// "paymentTerm": "string",
//     "receiptReminderDay": 0,
const VendorPurchaseInfoForm = () => {
    const [purchaseTerm, setPurchaseTerm] = useState( null );
    const dispatch = useDispatch();
    const { vendorBasicInfo } = useSelector( ( { vendors } ) => vendors );
    const { currencyCodeDropdown } = useSelector( ( { currencies } ) => currencies );
    useEffect( () => {
        dispatch( getCurrencyCodeDropdown() );
    }, [] );

    const handleBasicInputOnChange = ( e ) => {
        const { name, value, checked, type } = e.target;
        const updatedObj = {
            ...vendorBasicInfo,
            [name]: type === 'number' ? Number( value ) : type === 'date' ? moment( value ).format( 'yy-MM-DD' ) : value
        };
        dispatch( bindVendorDataOnchange( updatedObj ) );
    };
    const handleBasicInfoDropdownChange = ( data, e ) => {
        const { action, name, option } = e;
        const updatedObj = {
            ...vendorBasicInfo,
            [name]: data
        };
        dispatch( bindVendorDataOnchange( updatedObj ) );
    };
    return <div>
        <div className='m-auto'>
            <Row>
                <Col xs={12} sm={12} md={12} lg={5} xl={5}>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='defaultCurrencyId'> Default Currency</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <CreatableSelect
                                id='defaultCurrencyId'
                                name="defaultCurrency"
                                placeholder="Select City"
                                isSearchable
                                menuPosition="fixed"
                                isClearable
                                theme={selectThemeColors}
                                options={currencyCodeDropdown}
                                classNamePrefix='dropdown'
                                // className={classnames( `erp-dropdown-select ${( errors && errors.city && !vendorBasicInfo.city ) && 'is-invalid'}` )}
                                className={classnames( `erp-dropdown-select` )}
                                value={vendorBasicInfo?.defaultCurrency}
                                onChange={( data, e ) => {
                                    handleBasicInfoDropdownChange( data, e );
                                }}
                            />
                        </div>
                    </div>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='paymentTermId'> Payment Term</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <CreatableSelect
                                id='paymentTermId'
                                name="paymentTerm"
                                isSearchable
                                menuPosition="fixed"
                                isClearable
                                theme={selectThemeColors}
                                options={selectTerm}
                                classNamePrefix='dropdown'
                                // innerRef={register( { required: true } )}
                                className={classnames( 'erp-dropdown-select' )}
                                value={vendorBasicInfo?.paymentTerm}
                                onChange={( data, e ) => {
                                    handleBasicInfoDropdownChange( data, e );
                                }}
                            />
                        </ div>
                    </div>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='receiptReminderDayId'> Receipt Remainder day</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <Input
                                id="receiptReminderDayId"
                                type="number"
                                name="receiptReminderDay"
                                bsSize="sm"
                                placeholder="Receipt Remainder day"
                                value={vendorBasicInfo?.receiptReminderDay}
                                onChange={( e ) => { handleBasicInputOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </ div>
                    </div>
                </Col>
            </Row>
        </div>
    </div>;
};

export default VendorPurchaseInfoForm;

import moment from 'moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Input, Label, Row } from 'reactstrap';
import { bindVendorDataOnchange } from '../store/actions';

const VendorBankInfoForm = () => {
    const dispatch = useDispatch();
    const { vendorBasicInfo } = useSelector( ( { vendors } ) => vendors );
    const handleBasicInputOnChange = ( e ) => {
        const { name, value, checked, type } = e.target;
        const updatedObj = {
            ...vendorBasicInfo,
            [name]: type === 'number' ? Number( value ) : type === 'date' ? moment( value ).format( 'yy-MM-DD' ) : value
        };
        dispatch( bindVendorDataOnchange( updatedObj ) );
    };
    return <div>
        <div className='m-auto'>
            <Row>
                <Col xs={12} sm={12} md={12} lg={5} xl={5}>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='bankAccountNameId'> Account Name</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <Input
                                id="bankAccountNameId"
                                name="bankAccountName"
                                bsSize="sm"
                                placeholder="Bank Account Name"
                                value={vendorBasicInfo?.bankAccountName}
                                onChange={( e ) => { handleBasicInputOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </div>
                    </div>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='bankAccountNumberId'> Account NO</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <Input
                                id="bankAccountNumberId"
                                name="bankAccountNumber"
                                bsSize="sm"
                                placeholder="Bank Account Number"
                                value={vendorBasicInfo?.bankAccountNumber}
                                onChange={( e ) => { handleBasicInputOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </div>
                    </div>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='bankNameId'>Bank Name</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <Input
                                id="bankNameId"
                                name="bankName"
                                bsSize="sm"
                                placeholder="Bank Name"
                                value={vendorBasicInfo?.bankName}
                                onChange={( e ) => { handleBasicInputOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </div>
                    </div>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='bankAddressId'>Bank Address</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <Input
                                id="bankAddressId"
                                name="bankAddress"
                                bsSize="sm"
                                placeholder="Bank Address"
                                value={vendorBasicInfo?.bankAddress}
                                onChange={( e ) => { handleBasicInputOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </div>
                    </div>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='branchCodeId'>Branch Code</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <Input
                                id="branchCodeId"
                                name="branchCode"
                                bsSize="sm"
                                placeholder="Branch Code"
                                value={vendorBasicInfo?.branchCode}
                                onChange={( e ) => { handleBasicInputOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </div>
                    </div>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='swiftCodeId'>Swift Code</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <Input
                                id="swiftCodeId"
                                name="swiftCode"
                                bsSize="sm"
                                placeholder="Swift Code"
                                value={vendorBasicInfo?.swiftCode}
                                onChange={( e ) => { handleBasicInputOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    </div>;
};

export default VendorBankInfoForm;

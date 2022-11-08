/* eslint-disable no-var */

import classnames from 'classnames';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Briefcase, DollarSign, Mail, MinusSquare, UploadCloud } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Col, FormFeedback, Input, Label, Nav, NavItem, NavLink, Row, Spinner } from 'reactstrap';
import { selectedCity, selectedCountry, selectedState } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';
import { getVendorGroupDropdown, getVendorSubGroupDropdownByVendorId, vendorSubGroupAddForInstantCreate } from '../../vendor-group/store/actions';
import { bindVendorDataOnchange, vendorImageUpload } from '../store/actions';
import VendorBankInfoForm from './VendorBankInfoForm';
import VendorContactInfoForm from './VendorContactInfoForm';
import VendorPurchaseInfoForm from './VendorPurchaseInfoForm';
const VendorGeneralInfoForm = ( { errors } ) => {
    const dispatch = useDispatch();
    const { dropdownVendorGroups, dropdownVendorSubGroup } = useSelector( ( { vendorGroups } ) => vendorGroups );
    const { vendorBasicInfo, isImageUploading } = useSelector( ( { vendors } ) => vendors );
    const [active, setActive] = useState( '1' );


    useEffect( () => {
        //dispatch( getVendorGroupDropdown() );
    }, [] );


    const handleTabControl = tab => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };

    const handlePhotoChange = e => {
        const { files } = e.target;

        var dataWithPhoto = new FormData();
        dataWithPhoto.append( 'file', files[0], files[0]?.name );
        dataWithPhoto.append( 'isDefault', false );

        dispatch( vendorImageUpload( files[0], dataWithPhoto ) );

    };


    const handlePhotoRemove = () => {
        const updatedObj = {
            ...vendorBasicInfo,
            photo: null,
            imageEditUrl: ''
        };
        dispatch( bindVendorDataOnchange( updatedObj ) );
    };
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
        if ( name === 'group' ) {
            dispatch( getVendorSubGroupDropdownByVendorId( null ) );
            const updatedObj = {
                ...vendorBasicInfo,
                [name]: data,
                tags: []
            };
            dispatch( bindVendorDataOnchange( updatedObj ) );
        }
    };

    const handleVendorGroupOnFocus = () => {
        dispatch( getVendorGroupDropdown() );
    };

    const handleVendorSubGroupOnFocus = ( vendorId ) => {
        dispatch( getVendorSubGroupDropdownByVendorId( vendorId ) );
    };

    const handleVendorSubGroupOnCreate = ( data ) => {
        dispatch( vendorSubGroupAddForInstantCreate( data, vendorBasicInfo?.group?.value ) );
    };
    return <div>

        <div className='m-auto'>
            <Row>
                <Col xs={12} sm={12} md={12} lg={5} xl={5} className="pr-xs-1 pr-sm-1 pr-md-1 pr-lg-3 pr-xl-3">
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='nameId'> Name</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group two'>
                            <div>
                                <Input
                                    id="nameId"
                                    name="name"
                                    bsSize="sm"
                                    placeholder="Name"
                                    value={vendorBasicInfo?.name}
                                    onChange={( e ) => { handleBasicInputOnChange( e ); }}
                                    onFocus={( e ) => e.target.select()}
                                    invalid={errors?.name && true}

                                />

                                {errors && errors?.name && <FormFeedback>{errors?.name?.message}</FormFeedback>}
                            </div>

                            <div>
                                <Input
                                    id="shortNameId"
                                    name="shortName"
                                    bsSize="sm"
                                    placeholder="Short Name"
                                    value={vendorBasicInfo?.shortName}
                                    onChange={( e ) => { handleBasicInputOnChange( e ); }}
                                    onFocus={( e ) => e.target.select()}
                                />
                            </div>

                        </div>
                    </div>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='fullAddressId'> Address</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <Input
                                id="fullAddressId"
                                name="fullAddress"
                                bsSize="sm"
                                placeholder="Address"
                                value={vendorBasicInfo?.fullAddress}
                                onChange={( e ) => { handleBasicInputOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </div>
                    </div>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='contactNameId'></Label>
                        <Label className='custom-form-colons'>  </Label>
                        <div className='custom-form-input-group'>
                            <div className='custom-input-group-prepend'>
                                <Select
                                    id='cityId'
                                    name="city"
                                    placeholder="City"
                                    isSearchable
                                    menuPosition="fixed"
                                    isClearable
                                    theme={selectThemeColors}
                                    options={selectedCity}
                                    classNamePrefix='dropdown'
                                    // className={classnames( `erp-dropdown-select ${( errors && errors.city && !vendorBasicInfo.city ) && 'is-invalid'}` )}
                                    className={classnames( `erp-dropdown-select` )}
                                    value={vendorBasicInfo?.city}
                                    onChange={( data, e ) => {
                                        handleBasicInfoDropdownChange( data, e );
                                    }}
                                />
                            </div>
                            <div className='custom-input-group-append'>
                                <Select
                                    id='stateId'
                                    name="state"
                                    placeholder="State"
                                    isSearchable
                                    menuPosition="fixed"
                                    isClearable
                                    theme={selectThemeColors}
                                    options={selectedState}
                                    classNamePrefix='dropdown'
                                    className={classnames( `erp-dropdown-select` )}
                                    //className={classnames( `erp-dropdown-select ${( errors && errors.state && !contactInfo.state ) && 'is-invalid'}` )}
                                    value={vendorBasicInfo?.state}
                                    onChange={( data, e ) => {
                                        handleBasicInfoDropdownChange( data, e );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='postalCodeId'></Label>
                        <Label className='custom-form-colons'>  </Label>
                        <div className='custom-form-input-group'>
                            <div className='custom-input-group-prepend'>
                                <Input
                                    id="postalCodeId"
                                    name="postalCode"
                                    bsSize="sm"
                                    placeholder="Postal Code"
                                    value={vendorBasicInfo?.postalCode}
                                    onChange={( e ) => { handleBasicInputOnChange( e ); }}
                                    onFocus={( e ) => e.target.select()}
                                // invalid={( errors && errors.postalCode && !contactInfo.postalCode.length ) && true}
                                />
                            </div>
                            <div className='custom-input-group-append'>
                                <Select
                                    id='countryId'
                                    name="country"
                                    placeholder="Country"
                                    isSearchable
                                    menuPosition="fixed"
                                    isClearable
                                    theme={selectThemeColors}
                                    options={selectedCountry}
                                    classNamePrefix='dropdown'
                                    className={classnames( `erp-dropdown-select` )}

                                    //   className={classnames( `erp-dropdown-select ${( errors && errors.country && !contactInfo.country ) && 'is-invalid'}` )}
                                    value={vendorBasicInfo?.country}
                                    onChange={( data, e ) => {
                                        handleBasicInfoDropdownChange( data, e );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='emailId'> Email</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <Input
                                id="emailId"
                                name="email"
                                bsSize="sm"
                                placeholder="Email"
                                value={vendorBasicInfo?.email}
                                onChange={( e ) => { handleBasicInputOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={5} xl={5} className="pl-xs-1 pl-sm-1 pl-md-1 pl-lg-3 pl-xl-3">
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='phoneNumberId'> Phone</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <Input
                                id="phoneNumberId"
                                name="phoneNumber"
                                bsSize="sm"
                                placeholder="Phone"
                                value={vendorBasicInfo?.phoneNumber}
                                onChange={( e ) => { handleBasicInputOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </div>
                    </div>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='mobileNumberId'> Mobile</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <Input
                                id="mobileNumberId"
                                name="mobileNumber"
                                bsSize="sm"
                                placeholder="Mobile"
                                value={vendorBasicInfo?.mobileNumber}
                                onChange={( e ) => { handleBasicInputOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </div>
                    </div>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='webSiteId'> Website</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <Input
                                id="webSiteId"
                                name="webSite"
                                bsSize="sm"
                                placeholder="Website"
                                value={vendorBasicInfo?.webSite}
                                onChange={( e ) => { handleBasicInputOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </div>
                    </div>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='groupId'> Group</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <Select
                                id='groupId'
                                name="group"
                                placeholder="Group"
                                isLoading={!dropdownVendorGroups.length}
                                isSearchable
                                menuPosition="fixed"
                                isClearable
                                theme={selectThemeColors}
                                options={dropdownVendorGroups}
                                classNamePrefix='dropdown'
                                className={classnames( `erp-dropdown-select ${( errors && errors.group && !vendorBasicInfo?.group ) && 'is-invalid'}` )}

                                value={vendorBasicInfo?.group}
                                onChange={( data, e ) => {
                                    handleBasicInfoDropdownChange( data, e );
                                }}
                                onFocus={() => { handleVendorGroupOnFocus(); }}
                            />
                        </div>
                    </div>
                    <div className='custom-form-main'>
                        <Label className='custom-form-label' for='tagsId'>Tags</Label>
                        <Label className='custom-form-colons'> : </Label>
                        <div className='custom-form-group'>
                            <Select
                                id='tagsId'
                                name="tags"
                                isMulti
                                isDisabled={!vendorBasicInfo?.group?.value}
                                placeholder="Tags"
                                // isLoading={!dropdownVendorSubGroup.length}
                                isSearchable
                                menuPosition="fixed"
                                isClearable
                                theme={selectThemeColors}
                                options={dropdownVendorSubGroup}
                                classNamePrefix='dropdown'
                                // className={classnames( `erp-dropdown-select ${( errors && errors.city && !contactInfo.city ) && 'is-invalid'}` )}
                                value={vendorBasicInfo?.tags}
                                onChange={( data, e ) => {
                                    handleBasicInfoDropdownChange( data, e );
                                }}
                                onFocus={() => { handleVendorSubGroupOnFocus( vendorBasicInfo?.group?.value ); }}
                                onCreateOption={data => { handleVendorSubGroupOnCreate( data ); }}
                            />
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={2} xl={2}>

                    <div className='custom-form-main justify-content-end '>
                        {/* <div className='h-100 w-100 d-flex align-items-top justify-content-center'>
                            <img className='border p-1' src='https://via.placeholder.com/50' height={160} width={160} />
                        </div> */}
                        <div className='border p-1'>
                            <div className='image-main-container'>
                                <div className='image-container'>
                                    {isImageUploading ? <div className='d-flex justify-content-center align-items-center' style={{ height: '150px', width: '150px' }}>
                                        <Spinner color="success" />
                                    </div> : <img className=''
                                        src={vendorBasicInfo.imageEditUrl?.length ? vendorBasicInfo.imageEditUrl : vendorBasicInfo.imageUrl?.length ? vendorBasicInfo.imageUrl : 'https://via.placeholder.com/50'}
                                        height={150}
                                        width={150}
                                    />}

                                    <div className="image-overlay">
                                        <div className="image-button">
                                            <Button.Ripple
                                                tag={Label}
                                                for="photoUploadId"
                                                size="sm"
                                                color="primary"
                                                className="p-0 mr-1" >
                                                <UploadCloud htmlFor="photoUploadId" size={20} />
                                                <input
                                                    className='d-none'
                                                    type="file"
                                                    name="photo"
                                                    accept='.png,.jpg'
                                                    id="photoUploadId"
                                                    onChange={e => handlePhotoChange( e )}
                                                />
                                            </Button.Ripple>
                                            <Button.Ripple
                                                hidden={!vendorBasicInfo.imageEditUrl?.length}
                                                tag={Label}
                                                for="photoDeleteId"
                                                size="sm"
                                                color="danger"
                                                className="p-0"
                                            >
                                                <MinusSquare id="photoDeleteId" size={20} onClick={() => { handlePhotoRemove(); }} />
                                            </Button.Ripple>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </Col>
            </Row>
            <Row>
                <Col className="erp-custom-tab-control mt-3">
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                active={active === '1'}
                                onClick={() => {
                                    handleTabControl( '1' );
                                }}
                            >
                                <Mail size={15} /> Contacts

                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={active === '2'}
                                onClick={() => {
                                    handleTabControl( '2' );
                                }}
                            >
                                <Briefcase size={15} /> Bank Info
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={active === '3'}
                                onClick={() => {
                                    handleTabControl( '3' );
                                }}
                            >
                                <DollarSign size={15} /> Purchase
                            </NavLink>
                        </NavItem>
                    </Nav>
                    {
                        active === '1' ? <VendorContactInfoForm /> : active === '2' ? <VendorBankInfoForm /> : active === '3' ? <VendorPurchaseInfoForm /> : null
                    }

                </Col>
            </Row>
        </div>
    </div>;
};

export default VendorGeneralInfoForm;

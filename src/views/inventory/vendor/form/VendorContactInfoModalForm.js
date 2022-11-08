import '@custom-styles/merchandising/others/custom-table.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import moment from 'moment';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { Card, CardBody, Col, Input, Label, Row } from 'reactstrap';
import * as yup from 'yup';
import CustomModal from '../../../../utility/custom/CustomModal';
import { selectedCity, selectedCountry, selectedState } from '../../../../utility/enums';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { bindVendorContactDataOnchange, bindVendorDataOnchange } from '../store/actions';

const VendorContactInfoModalForm = ( {
    openContactFormModal,
    setOpenContactFormModal
} ) => {
    const dispatch = useDispatch();
    const { vendorBasicInfo, vendorContactInfo } = useSelector( ( { vendors } ) => vendors );

    const validationSchema = yup.object().shape( {
        name: !vendorContactInfo.name.length ? yup.string().required( 'Name is required!' ) : yup.string(),
        title: !vendorContactInfo.title.length ? yup.string().required( 'Title is required!' ) : yup.string(),
        fullAddress: !vendorContactInfo.fullAddress.length ? yup.string().required( 'Full Address is required!' ) : yup.string(),
        city: !vendorContactInfo.city ? yup.string().notRequired( 'City is required!' ) : yup.string(),
        state: !vendorContactInfo.state ? yup.string().notRequired( 'State is required!' ) : yup.string(),
        postalCode: !vendorContactInfo.postalCode.length ? yup.string().notRequired( 'Postal Code is required!' ) : yup.string(),
        country: !vendorContactInfo.country ? yup.string().notRequired( 'Country is required!' ) : yup.string(),
        jobPosition: !vendorContactInfo.jobPosition.length ? yup.string().required( 'Job Position Code is required!' ) : yup.string(),
        email: !vendorContactInfo.email.length ? yup.string().email().required( 'Email is required!' ) : yup.string(),
        phoneNumber: !vendorContactInfo.phoneNumber.length ? yup.string().required( 'Phone Number is required!' ) : yup.string(),
        mobileNumber: !vendorContactInfo.mobileNumber.length ? yup.string().required( 'Mobile is required!' ) : yup.string(),
        notes: !vendorContactInfo.notes.length ? yup.string().notRequired( 'Note is required!' ) : yup.string()

    } );

    const { register, handleSubmit, formState: { errors } } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );


    const handleContactInfoOnChange = ( e ) => {
        const { name, value, checked, type } = e.target;
        const updatedObj = {
            ...vendorContactInfo,
            [name]: type === 'number' ? Number( value ) : type === 'date' ? moment( value ).format( 'yy-MM-DD' ) : value
        };
        dispatch( bindVendorContactDataOnchange( updatedObj ) );
    };

    const handleBasicInfoDropdownChange = ( data, e ) => {
        const { action, name, option } = e;
        // setContactInfo( {
        //     ...vendorContactInfo,
        //     [name]: data
        // } );
        const updatedObj = {
            ...vendorContactInfo,
            [name]: data
        };

        dispatch( bindVendorContactDataOnchange( updatedObj ) );
    };
    console.log( 'vendorBasicInfo.contacts', JSON.stringify( vendorBasicInfo.contacts, null, 2 ) );
    console.log( 'vendorContactInfo', JSON.stringify( vendorContactInfo, null, 2 ) );

    const handleSegmentAssignModalSubmit = () => {
        const newContactObj = {
            id: vendorContactInfo.id,
            rowId: vendorContactInfo.rowId,
            name: vendorContactInfo.name,
            title: vendorContactInfo.title,
            jobPosition: vendorContactInfo.jobPosition,
            email: vendorContactInfo.email,
            phoneNumber: vendorContactInfo.phoneNumber,
            mobileNumber: vendorContactInfo.mobileNumber,
            fullAddress: vendorContactInfo.fullAddress,
            state: vendorContactInfo.state?.label ?? '',
            city: vendorContactInfo.city?.label ?? '',
            country: vendorContactInfo.country?.label ?? '',
            postalCode: vendorContactInfo.postalCode,
            notes: vendorContactInfo.notes
        };
        console.log( 'newContactObj', JSON.stringify( newContactObj, null, 2 ) );
        if ( vendorContactInfo.rowId > 0 ) {
            const updatedData = vendorBasicInfo.contacts.map( c => {
                if ( c.rowId === newContactObj.rowId ) {
                    c = newContactObj;
                    //   console.log( c.rowId === newContactObj.rowId );
                }
                return c;
            } );
            dispatch( bindVendorDataOnchange( {
                ...vendorBasicInfo,
                contacts: updatedData
            } ) );
            setOpenContactFormModal( !openContactFormModal );

        } else {

            setOpenContactFormModal( !openContactFormModal );
            dispatch( bindVendorDataOnchange( {
                ...vendorBasicInfo,
                contacts: [...vendorBasicInfo.contacts, { ...newContactObj, id: 0, rowId: randomIdGenerator() }]
            } ) );
        }

        dispatch( bindVendorContactDataOnchange( null ) );

    };

    const handleSegmentAssignModalClose = () => {
        setOpenContactFormModal( !openContactFormModal );
    };


    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-lg'
                openModal={openContactFormModal}
                handleMainModelSubmit={handleSubmit( handleSegmentAssignModalSubmit )}
                handleMainModalToggleClose={handleSegmentAssignModalClose}
                title="New Contact Info"
            >
                <Card className="mb-0">
                    <CardBody>
                        <div className='m-auto w-100'>
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={6} xl={6} >
                                    <div className='custom-form-main'>
                                        <Label className='custom-form-label' for='nameId'> Name</Label>
                                        <Label className='custom-form-colons'> : </Label>
                                        <div className='custom-form-group'>
                                            <Input
                                                id='nameId'
                                                type='text'
                                                name='name'
                                                placeholder='Contact Name'
                                                bsSize='sm'
                                                value={vendorContactInfo.name}
                                                onChange={( e ) => handleContactInfoOnChange( e )}
                                                onFocus={( e ) => e.target.select()}
                                                invalid={( errors && errors.name && !vendorContactInfo.name.length ) && true}
                                            />
                                        </div>
                                    </div>
                                    <div className='custom-form-main'>
                                        <Label className='custom-form-label' for='titleId'> Title</Label>
                                        <Label className='custom-form-colons'> : </Label>
                                        <div className='custom-form-group'>
                                            <Input
                                                id="titleId"
                                                type="text"
                                                placeholder="Title"
                                                name="title"
                                                bsSize="sm"
                                                value={vendorContactInfo.title}
                                                onChange={( e ) => { handleContactInfoOnChange( e ); }}
                                                onFocus={( e ) => e.target.select()}
                                                invalid={( errors && errors.title && !vendorContactInfo.title.length ) && true}
                                            />
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
                                                value={vendorContactInfo.fullAddress}
                                                onChange={( e ) => { handleContactInfoOnChange( e ); }}
                                                invalid={( errors && errors.fullAddress && !vendorContactInfo.fullAddress.length ) && true}
                                            />
                                        </div>
                                    </div>
                                    <div className='custom-form-main'>
                                        <Label className='custom-form-label' for='contactNameId'></Label>
                                        <Label className='custom-form-colons'>  </Label>
                                        <div className='custom-form-input-group'>
                                            <div className='custom-input-group-prepend'>
                                                <CreatableSelect
                                                    id='cityId'
                                                    name="city"
                                                    placeholder="City"
                                                    isSearchable
                                                    menuPosition="fixed"
                                                    isClearable
                                                    theme={selectThemeColors}
                                                    options={selectedCity}
                                                    classNamePrefix='dropdown'
                                                    className={classnames( `erp-dropdown-select ${( errors && errors.city && !vendorContactInfo.city ) && 'is-invalid'}` )}
                                                    value={vendorContactInfo?.city}
                                                    onChange={( data, e ) => {
                                                        handleBasicInfoDropdownChange( data, e );
                                                    }}
                                                />
                                            </div>
                                            <div className='custom-input-group-append'>
                                                <CreatableSelect
                                                    id='stateId'
                                                    name="state"
                                                    placeholder="State"
                                                    isSearchable
                                                    menuPosition="fixed"
                                                    isClearable
                                                    theme={selectThemeColors}
                                                    options={selectedState}
                                                    classNamePrefix='dropdown'
                                                    className={classnames( `erp-dropdown-select ${( errors && errors.state && !vendorContactInfo.state ) && 'is-invalid'}` )}
                                                    value={vendorContactInfo?.state}
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
                                                    value={vendorContactInfo?.postalCode}
                                                    onChange={( e ) => { handleContactInfoOnChange( e ); }}
                                                    onFocus={( e ) => e.target.select()}
                                                    invalid={( errors && errors.postalCode && !vendorContactInfo.postalCode.length ) && true}
                                                />
                                            </div>
                                            <div className='custom-input-group-append'>
                                                <CreatableSelect
                                                    id='countryId'
                                                    name="country"
                                                    placeholder="Country"
                                                    isSearchable
                                                    menuPosition="fixed"
                                                    isClearable
                                                    theme={selectThemeColors}
                                                    options={selectedCountry}
                                                    classNamePrefix='dropdown'
                                                    className={classnames( `erp-dropdown-select ${( errors && errors.country && !vendorContactInfo.country ) && 'is-invalid'}` )}
                                                    value={vendorContactInfo?.country}
                                                    onChange={( data, e ) => {
                                                        handleBasicInfoDropdownChange( data, e );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={6} xl={6} >
                                    <div className='custom-form-main'>
                                        <Label className='custom-form-label' for='jobPositionId'> Job Position</Label>
                                        <Label className='custom-form-colons'> : </Label>
                                        <div className='custom-form-group'>
                                            <Input
                                                id="jobPositionId"
                                                type="text"
                                                name="jobPosition"
                                                bsSize="sm"
                                                placeholder="Job Position"
                                                value={vendorContactInfo.jobPosition}
                                                onChange={( e ) => { handleContactInfoOnChange( e ); }}
                                                invalid={( errors && errors.jobPosition && !vendorContactInfo.jobPosition.length ) && true}
                                            />
                                        </div>
                                    </div>
                                    <div className='custom-form-main'>
                                        <Label className='custom-form-label' for='emailId'> Email</Label>
                                        <Label className='custom-form-colons'> : </Label>
                                        <div className='custom-form-group'>
                                            <Input
                                                id="emailId"
                                                type="email"
                                                name="email"
                                                bsSize="sm"
                                                placeholder="Email"
                                                value={vendorContactInfo.email}
                                                onChange={( e ) => { handleContactInfoOnChange( e ); }}
                                                invalid={( errors && errors.email && !vendorContactInfo.email.length ) && true}
                                            />
                                        </div>
                                    </div>
                                    <div className='custom-form-main'>
                                        <Label className='custom-form-label' for='phoneNumberId'> Phone</Label>
                                        <Label className='custom-form-colons'> : </Label>
                                        <div className='custom-form-group'>
                                            <Input
                                                id="phoneNumberId"
                                                name="phoneNumber"
                                                bsSize="sm"
                                                placeholder="Phone Number"
                                                value={vendorContactInfo.phoneNumber}
                                                onChange={( e ) => { handleContactInfoOnChange( e ); }}
                                                invalid={( errors && errors.phoneNumber && !vendorContactInfo.phoneNumber.length ) && true}

                                            />
                                        </div>
                                    </div>
                                    <div className='custom-form-main'>
                                        <Label className='custom-form-label' for='mobileId'> Mobile</Label>
                                        <Label className='custom-form-colons'> : </Label>
                                        <div className='custom-form-group'>
                                            <Input
                                                id="mobileId"
                                                type="text"
                                                name="mobileNumber"
                                                bsSize="sm"
                                                placeholder="Mobile"
                                                value={vendorContactInfo.mobileNumber}
                                                onChange={( e ) => { handleContactInfoOnChange( e ); }}
                                                invalid={( errors && errors.mobileNumber && !vendorContactInfo.mobileNumber.length ) && true}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={12}>
                                    <div className='custom-form-main'>
                                        <Label className='custom-form-label note' for='noteId'> Note</Label>
                                        <Label className='custom-form-colons note'> : </Label>
                                        <div className='custom-form-group note'>
                                            <Input
                                                id="noteId"
                                                name="notes"
                                                bsSize="sm"
                                                type="textarea"
                                                value={vendorContactInfo.notes}
                                                onChange={( e ) => { handleContactInfoOnChange( e ); }}
                                                invalid={( errors && errors.notes && !vendorContactInfo.notes.length ) && true}
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </CardBody>

                </Card>
            </CustomModal>
        </div >
    );
};

export default VendorContactInfoModalForm;

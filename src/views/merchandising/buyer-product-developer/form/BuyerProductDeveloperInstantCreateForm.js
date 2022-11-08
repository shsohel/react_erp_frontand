/* eslint-disable no-var */
import Sidebar from '@components/sidebar';
import classnames from 'classnames';
import { Edit, Upload, XCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Card, FormFeedback, FormGroup, FormText, Input, Label, Spinner } from 'reactstrap';
import defaultImage from "../../../../assets/images/avatars/avatar-blank.png";
import { selectedCity, selectedCountry, selectedState } from '../../../../utility/enums';
import { bindProductDeveloperBasicInfo, productDeveloperImageUpload } from '../store/actions';

import { yupResolver } from "@hookform/resolvers/yup";
import Select from 'react-select';
import * as yup from 'yup';
import { selectThemeColors, validateEmail } from '../../../../utility/Utils';

const defaultImageSrc = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

const BuyerProductDeveloperInstantCreateForm = ( { open, toggleSidebar, handleProductDeveloperCreationSubmit } ) => {
    const dispatch = useDispatch();
    const {
        productDeveloperBasicInfo,
        isProDevImageUploading
    } = useSelector( ( { productDevelopers } ) => productDevelopers );

    const validationSchema = yup.object().shape( {
        name: productDeveloperBasicInfo.name.length ? yup.string() : yup.string().required( 'Name is required!' ),
        //  shortName: yup.string().notRequired( 'Short Name is required!' ),
        email: productDeveloperBasicInfo.email.length ? validateEmail( productDeveloperBasicInfo.email ) ? yup.string() : yup.string().required( 'Invalid email format' ) : yup.string().required( 'Email & Format is required!' )
        // fullAddress: yup.string().notRequired( 'Address is required!' ),
        // phoneNumber: yup.string().notRequired( 'Phone Number  is required!' ),
        // country: yup.string().notRequired( 'Country  is required!' ),
        // city: yup.string().notRequired( 'City  is required!' ),
        // state: yup.string().notRequired( 'State  is required!' ),
        // postalCode: yup.string().notRequired( 'Postal Code  is required!' )
    } );

    const { errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );


    const handlePhotoUpload = e => {
        const { files } = e.target;
        const obj = {
            For: 'Agent',
            Category: '',
            Description: '',
            IsDefault: true
        };

        var dataWithPhoto = new FormData();
        for ( var key in obj ) {
            dataWithPhoto.append( key, obj[key] );
        }
        dataWithPhoto.append( 'File', files[0], files[0]?.name );
        dispatch( productDeveloperImageUpload( files[0], dataWithPhoto ) );
    };


    const handlePhotoRemove = () => {
        const updatedObj = {
            ...productDeveloperBasicInfo,
            image: null,
            imageEditUrl: ''
        };
        dispatch( bindProductDeveloperBasicInfo( updatedObj ) );
    };


    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...productDeveloperBasicInfo,
            [name]: value
        };
        dispatch( bindProductDeveloperBasicInfo( updatedObj ) );
    };

    const handleDropdown = ( data, e ) => {
        const { action, name, option } = e;
        const updatedObj = {
            ...productDeveloperBasicInfo,
            [name]: data
        };
        dispatch( bindProductDeveloperBasicInfo( updatedObj ) );
    };


    const onSubmit = () => {
        const submitObj = {
            name: productDeveloperBasicInfo.name,
            shortName: productDeveloperBasicInfo.shortName,
            email: productDeveloperBasicInfo.email,
            phoneNumber: productDeveloperBasicInfo.phoneNumber,
            fullAddress: productDeveloperBasicInfo.fullAddress,
            postalCode: productDeveloperBasicInfo.postalCode,
            state: productDeveloperBasicInfo.state?.label,
            city: productDeveloperBasicInfo.city?.label,
            country: productDeveloperBasicInfo.country?.label,
            image: productDeveloperBasicInfo.image
        };
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );

        handleProductDeveloperCreationSubmit( submitObj );
    };


    const handleCancel = () => {
        toggleSidebar();
        dispatch( bindProductDeveloperBasicInfo( null ) );

    };
    return (
        <Sidebar

            size='lg'
            open={open}
            title='New Buyer Product Developer'
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
        >
            <>
                <FormGroup>
                    <Label for="name">
                        Name <span className="text-danger">*</span>
                    </Label>
                    <Input
                        name="name"
                        id="name"
                        bsSize="sm"
                        placeholder="Kevin Pietersen"
                        invalid={( errors.name && !productDeveloperBasicInfo?.name?.length ) && true}
                        value={productDeveloperBasicInfo?.name}
                        onChange={( e ) => { handleInputOnChange( e ); }}
                    />
                    {errors && errors.name && (
                        <FormFeedback>Name is required!</FormFeedback>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label for="email">
                        Email
                    </Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        bsSize="sm"
                        placeholder="kavin@example.com"
                        invalid={( errors.email && ( !productDeveloperBasicInfo?.email?.length || !validateEmail( productDeveloperBasicInfo.email ) ) ) && true}
                        value={productDeveloperBasicInfo?.email}
                        onChange={( e ) => { handleInputOnChange( e ); }}
                    />
                    <FormText color="muted">
                        You can use letters, numbers & periods
                    </FormText>
                    {errors && errors.email && (
                        <FormFeedback>Email is required!</FormFeedback>
                    )}
                </FormGroup>
                <FormGroup>
                    <Label for="phoneNumber">
                        Phone
                    </Label>
                    <Input
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        bsSize="sm"
                        placeholder="(+880) 1811-275653"
                        invalid={( errors.phoneNumber && !productDeveloperBasicInfo?.phoneNumber?.length ) && true}
                        value={productDeveloperBasicInfo?.phoneNumber}
                        onChange={( e ) => { handleInputOnChange( e ); }}
                    />
                    {errors && errors.phoneNumber && (
                        <FormFeedback>Phone is required!</FormFeedback>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label for="fullAddress">Address:</Label>
                    <Input
                        name="fullAddress"
                        type="textarea"
                        id="fullAddress"
                        bsSize="sm"
                        placeholder="Write fullAddress"
                        invalid={( errors.fullAddress && !productDeveloperBasicInfo?.fullAddress?.length ) && true}
                        value={productDeveloperBasicInfo?.fullAddress}
                        onChange={( e ) => { handleInputOnChange( e ); }}
                    />
                    {errors && errors.fullAddress && (
                        <FormFeedback>Address is required!</FormFeedback>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label for="country">Country</Label>
                    <Select
                        id='countryId'
                        isSearchable
                        name="country"
                        isClearable
                        theme={selectThemeColors}
                        options={selectedCountry}
                        classNamePrefix='dropdown'
                        className={classnames( `erp-dropdown-select ${( errors && errors.country && !productDeveloperBasicInfo?.country ) && 'is-invalid'}` )}
                        value={productDeveloperBasicInfo?.country}
                        onChange={( data, e ) => {
                            handleDropdown( data, e );
                        }}
                    />
                    {errors && errors.country && (
                        <FormFeedback>{errors.country.message}</FormFeedback>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label for="state">State</Label>
                    <Select
                        id='stateId'
                        isSearchable
                        name="state"
                        isClearable
                        theme={selectThemeColors}
                        options={selectedState}
                        classNamePrefix='dropdown'
                        className={classnames( `erp-dropdown-select ${( errors && errors.state && !productDeveloperBasicInfo?.state ) && 'is-invalid'}` )}
                        value={productDeveloperBasicInfo?.state}
                        onChange={( data, e ) => {
                            handleDropdown( data, e );
                        }}
                    />
                    {errors && errors.state && (
                        <FormFeedback>{errors.state.message}</FormFeedback>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label for="city">City</Label>
                    <Select
                        id='cityId'
                        isSearchable
                        name="city"
                        isClearable
                        theme={selectThemeColors}
                        options={selectedCity}
                        classNamePrefix='dropdown'
                        className={classnames( `erp-dropdown-select ${( errors && errors.city && !productDeveloperBasicInfo?.city ) && 'is-invalid'}` )}
                        value={productDeveloperBasicInfo?.city}
                        onChange={( data, e ) => {
                            handleDropdown( data, e );
                        }}
                    />
                    {errors && errors.city && (
                        <FormFeedback>{errors.city.message}</FormFeedback>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label for="postalCode">
                        Postal Code
                    </Label>
                    <Input
                        name="postalCode"
                        id="postalCode"
                        placeholder="6118"
                        bsSize="sm"
                        invalid={( errors.postalCode && !productDeveloperBasicInfo?.postalCode?.length ) && true}
                        value={productDeveloperBasicInfo?.postalCode}
                        onChange={( e ) => { handleInputOnChange( e ); }}
                    />
                    {errors && errors.postalCode && (
                        <FormFeedback>{errors.postalCode.message}</FormFeedback>
                    )}
                </FormGroup>
                <FormGroup>
                    <div className="main-div">
                        <Card className="img-holder">
                            {isProDevImageUploading ? <div
                                className='d-flex justify-content-center align-items-center'
                                style={{ height: '120px', width: '120px' }}>
                                <Spinner color="success" />
                            </div> : <img
                                src={
                                    productDeveloperBasicInfo.imageEditUrl.length ? `${productDeveloperBasicInfo.imageEditUrl}` : defaultImage
                                }
                                alt="Buyer Image"
                                className="image"
                            />

                            }


                            {productDeveloperBasicInfo.imageEditUrl.length ? (
                                <div className="overlay">
                                    <div className="text">
                                        <ButtonGroup size="sm">
                                            <Button.Ripple
                                                id="change-img"
                                                tag={Label}
                                                className="btn-icon "
                                                color="relief-success"
                                            >
                                                <Edit size={20} />

                                                <input
                                                    type="file"
                                                    hidden
                                                    id="change-img"
                                                    onChange={( e ) => { handlePhotoUpload( e ); }}
                                                    accept="image/*"
                                                />
                                            </Button.Ripple>
                                            <Button.Ripple
                                                tag={Label}
                                                className="btn-icon "
                                                color="relief-danger"
                                            >
                                                <XCircle
                                                    size={20}
                                                    onClick={() => {
                                                        handlePhotoRemove();
                                                    }}
                                                />
                                            </Button.Ripple>
                                        </ButtonGroup>
                                    </div>
                                </div>
                            ) : (
                                <div className="overlay">
                                    <div className="text">
                                        <Button.Ripple
                                            id="change-img"
                                            tag={Label}
                                            className="btn-icon "
                                            color="relief-primary"
                                        >
                                            {/* <span className='align-middle' >Upload</span> */}
                                            <Upload size={20} />
                                            <input
                                                type="file"
                                                hidden
                                                id="change-img"
                                                onChange={( e ) => { handlePhotoUpload( e ); }}
                                                accept="image/*"
                                            />
                                        </Button.Ripple>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </FormGroup>

                <Button.Ripple
                    onClick={handleSubmit( onSubmit )}
                    type='submit'
                    size="sm"
                    className='mr-1'
                    color='primary'
                >
                    Submit
                </Button.Ripple>
                <Button
                    type='reset'
                    className='mr-1'
                    size="sm" color='danger'
                    outline
                    onClick={() => { handleCancel(); }}
                >
                    Cancel
                </Button>
            </>
        </Sidebar>
    );
};

export default BuyerProductDeveloperInstantCreateForm;

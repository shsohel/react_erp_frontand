/* eslint-disable no-var */
import Sidebar from "@components/sidebar";
import { yupResolver } from "@hookform/resolvers/yup";
import classnames from "classnames";
import { Edit, Upload, XCircle } from "react-feather";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import {
    Button, FormFeedback,
    FormGroup,
    FormText,
    Input,
    Label,
    Spinner
} from "reactstrap";
import Card from "reactstrap/lib/Card";
import * as yup from 'yup';
import defaultImage from "../../../../assets/images/avatars/avatar-blank.png";
import { selectedCity, selectedCountry, selectedState } from "../../../../utility/enums";
import { selectThemeColors, validateEmail } from "../../../../utility/Utils";
import { bindSampleAssigneeBasicInfo, sampleAssigneeImageUpload, updateSampleAssignee } from "../store/actions";


const SampleAssigneeEditForm = ( { open, toggleSidebar } ) => {
    const dispatch = useDispatch();
    const { sampleAssigneeBasicInfo, isSampleAssigneeImageUploading } = useSelector( ( { sampleAssignees } ) => sampleAssignees );

    const validationSchema = yup.object().shape( {
        name: sampleAssigneeBasicInfo.name.length ? yup.string() : yup.string().required( 'Name is required!' ),
        //  shortName: yup.string().notRequired( 'Short Name is required!' ),
        email: sampleAssigneeBasicInfo.email.length ? validateEmail( sampleAssigneeBasicInfo.email ) ? yup.string() : yup.string().required( 'Invalid email format' ) : yup.string().required( 'Email & Format is required!' )
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
            For: 'Sample Assignee',
            Category: '',
            Description: '',
            IsDefault: true
        };

        var dataWithPhoto = new FormData();
        for ( var key in obj ) {
            dataWithPhoto.append( key, obj[key] );
        }
        dataWithPhoto.append( 'File', files[0], files[0]?.name );
        dispatch( sampleAssigneeImageUpload( files[0], dataWithPhoto ) );
    };


    const handlePhotoRemove = () => {
        const updatedObj = {
            ...sampleAssigneeBasicInfo,
            image: null,
            imageEditUrl: ''
        };
        dispatch( bindSampleAssigneeBasicInfo( updatedObj ) );
    };

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...sampleAssigneeBasicInfo,
            [name]: value
        };
        dispatch( bindSampleAssigneeBasicInfo( updatedObj ) );
    };

    const handleDropdown = ( data, e ) => {
        const { action, name, option } = e;
        const updatedObj = {
            ...sampleAssigneeBasicInfo,
            [name]: data
        };
        dispatch( bindSampleAssigneeBasicInfo( updatedObj ) );
    };


    // ** Function to handle form submit
    const onSubmit = () => {
        const submitObj = {
            id: sampleAssigneeBasicInfo.id,
            name: sampleAssigneeBasicInfo.name,
            shortName: sampleAssigneeBasicInfo.shortName,
            email: sampleAssigneeBasicInfo.email,
            phoneNumber: sampleAssigneeBasicInfo.phoneNumber,
            fullAddress: sampleAssigneeBasicInfo.fullAddress,
            postalCode: sampleAssigneeBasicInfo.postalCode,
            state: sampleAssigneeBasicInfo.state?.label,
            city: sampleAssigneeBasicInfo.city?.label,
            country: sampleAssigneeBasicInfo.country?.label,
            image: sampleAssigneeBasicInfo.image ?? null
        };
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( updateSampleAssignee( submitObj, sampleAssigneeBasicInfo.id ) );

    };

    const handleCancel = () => {
        toggleSidebar();
        dispatch( bindSampleAssigneeBasicInfo( null ) );
    };


    return (
        <Sidebar
            size="lg"
            open={open}
            title="Edit Sample Assignee"
            headerClassName="mb-1"
            contentClassName="pt-0"
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
                        invalid={( errors.name && !sampleAssigneeBasicInfo?.name?.length ) && true}
                        value={sampleAssigneeBasicInfo?.name}
                        onChange={( e ) => { handleInputOnChange( e ); }}
                    />
                    {errors && errors.name && (
                        <FormFeedback>{errors.name.message}</FormFeedback>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label for="shortName">
                        Short Name
                    </Label>
                    <Input
                        name="shortName"
                        id="shortName"
                        bsSize="sm"
                        placeholder="Kevin Pietersen"
                        invalid={( errors.shortName && !sampleAssigneeBasicInfo?.shortName?.length ) && true}
                        value={sampleAssigneeBasicInfo?.shortName}
                        onChange={( e ) => { handleInputOnChange( e ); }}
                    />
                    {errors && errors.shortName && (
                        <FormFeedback>{errors.shortName.message}</FormFeedback>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label for="email">
                        Email <span className="text-danger">*</span>
                    </Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        bsSize="sm"
                        placeholder="kavin@example.com"
                        invalid={( errors.email && ( !sampleAssigneeBasicInfo?.email?.length || !validateEmail( sampleAssigneeBasicInfo.email ) ) ) && true}
                        value={sampleAssigneeBasicInfo?.email}
                        onChange={( e ) => { handleInputOnChange( e ); }}
                    />
                    <FormText color="muted">
                        You can use letters, numbers & periods
                    </FormText>
                    {errors && errors.email && (
                        <FormFeedback>{errors.email.message}</FormFeedback>
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
                        invalid={( errors.phoneNumber && !sampleAssigneeBasicInfo?.phoneNumber?.length ) && true}
                        value={sampleAssigneeBasicInfo?.phoneNumber}
                        onChange={( e ) => { handleInputOnChange( e ); }}
                    />
                    {errors && errors.phoneNumber && (
                        <FormFeedback>{errors.phoneNumber.message}</FormFeedback>
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
                        invalid={( errors.fullAddress && !sampleAssigneeBasicInfo?.fullAddress?.length ) && true}
                        value={sampleAssigneeBasicInfo?.fullAddress}
                        onChange={( e ) => { handleInputOnChange( e ); }}
                    />
                    {errors && errors.fullAddress && (
                        <FormFeedback>{errors.fullAddress.message}</FormFeedback>
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
                        className={classnames( `erp-dropdown-select ${( errors && errors.country && !sampleAssigneeBasicInfo?.country ) && 'is-invalid'}` )}
                        value={sampleAssigneeBasicInfo?.country}
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
                        className={classnames( `erp-dropdown-select ${( errors && errors.state && !sampleAssigneeBasicInfo?.state ) && 'is-invalid'}` )}
                        value={sampleAssigneeBasicInfo?.state}
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
                        className={classnames( `erp-dropdown-select ${( errors && errors.city && !sampleAssigneeBasicInfo?.city ) && 'is-invalid'}` )}
                        value={sampleAssigneeBasicInfo?.city}
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
                        invalid={( errors.postalCode && !sampleAssigneeBasicInfo?.postalCode?.length ) && true}
                        value={sampleAssigneeBasicInfo?.postalCode}
                        onChange={( e ) => { handleInputOnChange( e ); }}
                    />
                    {errors && errors.postalCode && (
                        <FormFeedback>{errors.postalCode.message}</FormFeedback>
                    )}
                </FormGroup>

                <FormGroup>


                    <div className="main-div">
                        <Card className="img-holder">
                            {isSampleAssigneeImageUploading ? <div
                                className='d-flex justify-content-center align-items-center'
                                style={{ height: '120px', width: '120px' }}>
                                <Spinner color="success" />
                            </div> : <img
                                src={sampleAssigneeBasicInfo.imageEditUrl.length ? `${sampleAssigneeBasicInfo.imageEditUrl}` : sampleAssigneeBasicInfo.imageUrl.length ? `${sampleAssigneeBasicInfo.imageUrl}` : defaultImage}

                                alt="Buyer Image"
                                className="image"
                            />
                            }

                            {/* <img
                                src={photo.imageEditUrl.length ? `${photo.imageEditUrl}` : photo.imageUrl.length ? `${photo.imageUrl}` : defaultImage}
                                alt="Example"
                                className="image"
                            /> */}

                            <div className="overlay" >
                                <div className="text">
                                    <Button.Ripple
                                        for='agentPhotoUploadId'
                                        hidden={!sampleAssigneeBasicInfo.imageUrl.length}

                                        tag={Label}
                                        className='btn-icon p-0 mr-1'
                                        color='relief-success'
                                    >
                                        <Edit size={20} />

                                        <input
                                            type='file'
                                            hidden
                                            id='agentPhotoUploadId'
                                            onChange={( e ) => { handlePhotoUpload( e ); }}
                                            accept='image/*'
                                        />
                                    </Button.Ripple>

                                    <Button.Ripple
                                        for='agentPhotoNewUploadId'
                                        hidden={!!sampleAssigneeBasicInfo.imageUrl.length}
                                        tag={Label}
                                        className='btn-icon p-0 mr-1'
                                        color='relief-primary'
                                    >

                                        <Upload size={20} />
                                        <input
                                            type='file'
                                            hidden
                                            id='agentPhotoNewUploadId'
                                            onChange={( e ) => { handlePhotoUpload( e ); }}
                                            accept='image/*' />
                                    </Button.Ripple>

                                    <Button.Ripple
                                        tag={Label}
                                        hidden={!sampleAssigneeBasicInfo.imageEditUrl.length}
                                        for="agentPhotoRemoveId"
                                        className='btn-icon p-0'
                                        color='relief-danger'
                                    >
                                        <XCircle
                                            size={20}
                                            id="agentPhotoRemoveId"
                                            onClick={() => { handlePhotoRemove(); }}
                                        />
                                    </Button.Ripple>
                                </div>
                            </div>
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

export default SampleAssigneeEditForm;

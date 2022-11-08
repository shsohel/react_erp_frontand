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
import { selectThemeColors, validateEmail } from "../../../../utility/Utils";
import { agentImageUpload, bindAgentBasicInfo } from "../store/actions";
//Country Array Demo
const selectedCountry = [
    { value: "bangladesh", label: "Bangladesh" },
    { value: "india", label: "India" },
    { value: "pakistan", label: "pakistan" },
    { value: "nepal", label: "Nepal" }
];

//State Array Demo
const selectedCState = [
    { value: "bangladesh", label: "Bangladesh" },
    { value: "india", label: "India" },
    { value: "pakistan", label: "pakistan" },
    { value: "nepal", label: "Nepal" }
];

//Country Array Demo
const selectedCity = [
    { value: "chittagong", label: "Chittagong" },
    { value: "dhaka", label: "Dhaka" },
    { value: "rajshahi", label: "rajshahi" },
    { value: "feni", label: "Feni" }
];
const BuyerAgentInstantCreateForm = ( { open, toggleSidebar, handleAgentCreationSubmit } ) => {
    const dispatch = useDispatch();
    const { agentBasicInfo, isAgentImageUploading } = useSelector( ( { buyerAgents } ) => buyerAgents );
    const validationSchema = yup.object().shape( {
        name: agentBasicInfo.name.length ? yup.string() : yup.string().required( 'Name is required!' ),
        //  shortName: yup.string().notRequired( 'Short Name is required!' ),
        email: agentBasicInfo.email.length ? validateEmail( agentBasicInfo.email ) ? yup.string() : yup.string().required( 'Invalid email format' ) : yup.string().required( 'Email & Format is required!' )
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
        dispatch( agentImageUpload( files[0], dataWithPhoto ) );
    };


    const handlePhotoRemove = () => {
        const updatedObj = {
            ...agentBasicInfo,
            image: null,
            imageEditUrl: ''
        };
        dispatch( bindAgentBasicInfo( updatedObj ) );
    };

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...agentBasicInfo,
            [name]: value
        };
        dispatch( bindAgentBasicInfo( updatedObj ) );
    };

    const handleDropdown = ( data, e ) => {
        const { action, name, option } = e;
        const updatedObj = {
            ...agentBasicInfo,
            [name]: data
        };
        dispatch( bindAgentBasicInfo( updatedObj ) );
    };


    // ** Function to handle form submit
    const onSubmit = () => {
        const submitObj = {
            name: agentBasicInfo.name,
            shortName: agentBasicInfo.shortName,
            email: agentBasicInfo.email,
            phoneNumber: agentBasicInfo.phoneNumber,
            fullAddress: agentBasicInfo.fullAddress,
            postalCode: agentBasicInfo.postalCode,
            state: agentBasicInfo.state?.label,
            city: agentBasicInfo.city?.label,
            country: agentBasicInfo.country?.label,
            image: agentBasicInfo.image
        };
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        ///   dispatch( addBuyerAgent( submitObj ) );
        handleAgentCreationSubmit( submitObj );

    };

    const handleCancel = () => {
        toggleSidebar();
        dispatch( bindAgentBasicInfo( null ) );
    };


    return (
        <Sidebar
            size="lg"
            open={open}
            title="New Buyer Agent"
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
                        invalid={( errors.name && !agentBasicInfo?.name?.length ) && true}
                        value={agentBasicInfo?.name}
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
                        invalid={( errors.shortName && !agentBasicInfo?.shortName?.length ) && true}
                        value={agentBasicInfo?.shortName}
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
                        invalid={( errors.email && ( !agentBasicInfo?.email?.length || !validateEmail( agentBasicInfo.email ) ) ) && true}
                        value={agentBasicInfo?.email}
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
                        invalid={( errors.phoneNumber && !agentBasicInfo?.phoneNumber?.length ) && true}
                        value={agentBasicInfo?.phoneNumber}
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
                        invalid={( errors.fullAddress && !agentBasicInfo?.fullAddress?.length ) && true}
                        value={agentBasicInfo?.fullAddress}
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
                        className={classnames( `erp-dropdown-select ${( errors && errors.country && !agentBasicInfo?.country ) && 'is-invalid'}` )}
                        value={agentBasicInfo?.country}
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
                        options={selectedCountry}
                        classNamePrefix='dropdown'
                        className={classnames( `erp-dropdown-select ${( errors && errors.state && !agentBasicInfo?.state ) && 'is-invalid'}` )}
                        value={agentBasicInfo?.state}
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
                        options={selectedCountry}
                        classNamePrefix='dropdown'
                        className={classnames( `erp-dropdown-select ${( errors && errors.city && !agentBasicInfo?.city ) && 'is-invalid'}` )}
                        value={agentBasicInfo?.city}
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
                        invalid={( errors.postalCode && !agentBasicInfo?.postalCode?.length ) && true}
                        value={agentBasicInfo?.postalCode}
                        onChange={( e ) => { handleInputOnChange( e ); }}
                    />
                    {errors && errors.postalCode && (
                        <FormFeedback>{errors.postalCode.message}</FormFeedback>
                    )}
                </FormGroup>

                <FormGroup>
                    <div className="main-div">
                        <Card className="img-holder">
                            {isAgentImageUploading ? <div
                                className='d-flex justify-content-center align-items-center'
                                style={{ height: '120px', width: '120px' }}>
                                <Spinner color="success" />
                            </div> : <img
                                src={
                                    agentBasicInfo.imageEditUrl.length ? `${agentBasicInfo.imageEditUrl}` : defaultImage
                                }
                                alt="Buyer Image"
                                className="image"
                            />

                            }

                            {agentBasicInfo?.imageEditUrl.length ? (
                                <div className="overlay">
                                    <div className="text">
                                        {/* <ButtonGroup size="sm"> */}
                                        <Button.Ripple
                                            id="change-img"
                                            tag={Label}
                                            className="btn-icon p-0 mr-1"
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
                                            className="btn-icon p-0 "
                                            color="relief-danger"
                                        >
                                            <XCircle
                                                size={20}
                                                onClick={() => {
                                                    handlePhotoRemove();
                                                }}
                                            />
                                        </Button.Ripple>
                                        {/* </ButtonGroup> */}
                                    </div>
                                </div>
                            ) : (
                                <div className="overlay">
                                    <div className="text">
                                        <Button.Ripple
                                            id="change-img"
                                            tag={Label}
                                            className="btn-icon p-0"
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

export default BuyerAgentInstantCreateForm;

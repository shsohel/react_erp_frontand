/* eslint-disable no-var */
import Sidebar from '@components/sidebar';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import { Edit, Upload, XCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Col, FormFeedback, FormGroup, FormText, Input, Label, Row, Spinner } from 'reactstrap';
import Card from 'reactstrap/lib/Card';
// import { getDropDownBuyers } from 'views/merchandising/buyer/store/actions';
import * as yup from 'yup';
import defaultImage from "../../../../assets/images/avatars/avatar-blank.png";
import { permissibleProcess } from '../../../../utility/enums';
import { selectThemeColors, validateEmail } from '../../../../utility/Utils';
import { getRoleDropdown } from "../../../auth/role/store/actions";
import { getDropDownBuyers } from '../../buyer/store/actions';
import { bindMerchandiserBasicInfo, merchandiserImageUpload, updateMerchandiser } from '../store/actions';
//Country Array Demo
const selectedCountry = [
    { value: 'bangladesh', label: 'Bangladesh' },
    { value: 'india', label: 'India' },
    { value: 'pakistan', label: 'pakistan' },
    { value: 'nepal', label: 'Nepal' }
];


const MerchandiserEditForm = ( { open, toggleSidebarForEdit } ) => {
    const dispatch = useDispatch();
    const { merchandiserBasicInfo, isAgentImageUploading } = useSelector( ( { merchandisers } ) => merchandisers );
    const { roleDropdown, isRoleDropdownLoaded } = useSelector( ( { roles } ) => roles );
    const { dropDownBuyers } = useSelector( ( { buyers } ) => buyers );

    const validationSchema = yup.object().shape( {
        //   userName: merchandiserBasicInfo?.userName?.length ? yup.string() : yup.string().required( 'User Name is required!' ),
        firstName: merchandiserBasicInfo?.firstName?.length ? yup.string() : yup.string().required( 'First Name is required!' ),
        lastName: merchandiserBasicInfo?.lastName?.length ? yup.string() : yup.string().required( 'Last Name is required!' ),

        email: merchandiserBasicInfo?.email?.length ? validateEmail( merchandiserBasicInfo.email ) ? yup.string() : yup.string().required( 'Invalid email format' ) : yup.string().required( 'Email & Format is required!' ),
        buyers: merchandiserBasicInfo?.buyers?.length ? yup.string() : yup.string().required( 'Buyers is required!' )
        //  role: merchandiserBasicInfo?.role ? yup.string() : yup.string().required( 'Role is required!' )

    } );

    const { errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );

    const handlePhotoUpload = ( e ) => {
        const { files } = e.target;
        const obj = {
            For: 'Merchandiser',
            Category: '',
            Description: '',
            IsDefault: true
        };

        var dataWithPhoto = new FormData();
        for ( var key in obj ) {
            dataWithPhoto.append( key, obj[key] );
        }
        dataWithPhoto.append( 'File', files[0], files[0]?.name );
        dispatch( merchandiserImageUpload( files[0], dataWithPhoto ) );

    };
    const handlePhotoRemove = () => {
        const updatedObj = {
            ...merchandiserBasicInfo,
            image: null,
            imageEditUrl: ''
        };
        dispatch( bindMerchandiserBasicInfo( updatedObj ) );
    };

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...merchandiserBasicInfo,
            [name]: value
        };
        dispatch( bindMerchandiserBasicInfo( updatedObj ) );
    };

    const handleDropdown = ( data, e ) => {
        const { action, name, option } = e;
        const updatedObj = {
            ...merchandiserBasicInfo,
            [name]: data
        };
        dispatch( bindMerchandiserBasicInfo( updatedObj ) );
    };

    const handleRoleOnFocus = () => {
        if ( !roleDropdown.length ) {
            dispatch( getRoleDropdown() );
        }
    };

    const handleBuyerDropdownOnFocus = () => {
        if ( !dropDownBuyers.length ) {
            dispatch( getDropDownBuyers() );
        }
    };


    // ** Function to handle form submit
    const onSubmit = () => {

        const submitObj = {
            //  userName: merchandiserBasicInfo.userName,
            email: merchandiserBasicInfo.email,
            firstName: merchandiserBasicInfo.firstName,
            lastName: merchandiserBasicInfo.lastName,
            contactNumber: merchandiserBasicInfo.contactNumber,
            //   defaultRole: merchandiserBasicInfo?.role?.value,
            buyers: merchandiserBasicInfo?.buyers?.map( buyer => buyer.value ),
            permissibleProcess: merchandiserBasicInfo?.permissibleProcess?.map( buyer => buyer.value ),

            media: merchandiserBasicInfo.image ?? null
        };

        dispatch( updateMerchandiser( submitObj, merchandiserBasicInfo.id ) );
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );


    };

    const handleCancel = () => {
        toggleSidebarForEdit();
        dispatch( bindMerchandiserBasicInfo( null ) );
    };


    return (
        <Sidebar
            size='lg'
            open={open}
            width={700}

            title='Edit Merchandiser'
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebarForEdit}
        >
            <>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="firstName">
                                First Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                                name="firstName"
                                id="firstName"
                                bsSize="sm"
                                placeholder="Kevin"
                                invalid={( errors.firstName && !merchandiserBasicInfo?.firstName?.length ) && true}
                                value={merchandiserBasicInfo?.firstName}
                                onChange={( e ) => { handleInputOnChange( e ); }}
                            />
                            {errors && errors.firstName && (
                                <FormFeedback>{errors.firstName.message}</FormFeedback>
                            )}
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="lastName">
                                Last Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                                name="lastName"
                                id="lastName"
                                bsSize="sm"
                                placeholder="Pretersen"
                                invalid={( errors.lastName && !merchandiserBasicInfo?.lastName?.length ) && true}
                                value={merchandiserBasicInfo?.lastName}
                                onChange={( e ) => { handleInputOnChange( e ); }}
                            />
                            {errors && errors.lastName && (
                                <FormFeedback>{errors.lastName.message}</FormFeedback>
                            )}
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    {/* <Col>
                        <FormGroup>
                            <Label for="userName">
                                User Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                                name="userName"
                                id="userName"
                                bsSize="sm"
                                placeholder="pretersen20"
                                invalid={( errors.userName && !merchandiserBasicInfo?.userName?.length ) && true}
                                value={merchandiserBasicInfo?.userName}
                                onChange={( e ) => { handleInputOnChange( e ); }}
                            />
                            {errors && errors.userName && (
                                <FormFeedback>{errors.userName.message}</FormFeedback>
                            )}
                        </FormGroup>
                    </Col> */}
                    <Col>
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
                                invalid={( errors.email && ( !merchandiserBasicInfo?.email?.length || !validateEmail( merchandiserBasicInfo.email ) ) ) && true}
                                value={merchandiserBasicInfo?.email}
                                onChange={( e ) => { handleInputOnChange( e ); }}
                            />
                            <FormText color="muted">
                                You can use letters, numbers & periods
                            </FormText>
                            {errors && errors.email && (
                                <FormFeedback>{errors.email.message}</FormFeedback>
                            )}
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="contactNumber">
                                Contact Number <span className="text-danger">*</span>
                            </Label>
                            <Input
                                name="contactNumber"
                                id="contactNumber"
                                bsSize="sm"
                                placeholder="Contact Number"
                                invalid={( errors.contactNumber && !merchandiserBasicInfo?.contactNumber?.length ) && true}
                                value={merchandiserBasicInfo?.contactNumber}
                                onChange={( e ) => { handleInputOnChange( e ); }}
                            />
                            {errors && errors.contactNumber && (
                                <FormFeedback>{errors.contactNumber.message}</FormFeedback>
                            )}
                        </FormGroup>
                    </Col>
                </Row>


                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="buyersId">Buyer:</Label>
                            <Select
                                id='buyersId'
                                isSearchable
                                name="buyers"
                                isMulti
                                isClearable
                                isLoading={!isRoleDropdownLoaded}
                                theme={selectThemeColors}
                                options={dropDownBuyers}
                                classNamePrefix='dropdown'
                                className={classnames( `erp-dropdown-select ${( errors && errors.buyers && !merchandiserBasicInfo?.buyers.length ) && 'is-invalid'}` )}
                                value={merchandiserBasicInfo?.buyers}
                                onChange={( data, e ) => {
                                    handleDropdown( data, e );
                                }}
                                onFocus={() => { handleBuyerDropdownOnFocus(); }}

                            />
                            {errors && errors.buyers && (
                                <FormFeedback>{errors.buyers.message}</FormFeedback>
                            )}
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="permissibleProcessId">Permissible Process:</Label>
                            <Select
                                id='permissibleProcessId'
                                isSearchable
                                name="permissibleProcess"
                                isMulti
                                isClearable
                                theme={selectThemeColors}
                                options={permissibleProcess}
                                classNamePrefix='dropdown'
                                className={classnames( `erp-dropdown-select ${( errors && errors.permissibleProcess && !merchandiserBasicInfo?.permissibleProcess.length ) && 'is-invalid'}` )}
                                value={merchandiserBasicInfo?.permissibleProcess}
                                onChange={( data, e ) => {
                                    handleDropdown( data, e );
                                }}


                            />
                            {errors && errors.permissibleProcess && (
                                <FormFeedback>{errors.permissibleProcess.message}</FormFeedback>
                            )}
                        </FormGroup>
                    </Col>
                </Row>

                {/* <Row>
                    <Col>
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
                                className={classnames( `erp-dropdown-select ${( errors && errors.country && !merchandiserBasicInfo?.country ) && 'is-invalid'}` )}
                                value={merchandiserBasicInfo?.country}
                                onChange={( data, e ) => {
                                    handleDropdown( data, e );
                                }}
                            />
                            {errors && errors.country && (
                                <FormFeedback>{errors.country.message}</FormFeedback>
                            )}
                        </FormGroup>
                    </Col>
                    <Col>
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
                                className={classnames( `erp-dropdown-select ${( errors && errors.state && !merchandiserBasicInfo?.state ) && 'is-invalid'}` )}
                                value={merchandiserBasicInfo?.state}
                                onChange={( data, e ) => {
                                    handleDropdown( data, e );
                                }}
                            />
                            {errors && errors.state && (
                                <FormFeedback>{errors.state.message}</FormFeedback>
                            )}
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
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
                                className={classnames( `erp-dropdown-select ${( errors && errors.city && !merchandiserBasicInfo?.city ) && 'is-invalid'}` )}
                                value={merchandiserBasicInfo?.city}
                                onChange={( data, e ) => {
                                    handleDropdown( data, e );
                                }}
                            />
                            {errors && errors.city && (
                                <FormFeedback>{errors.city.message}</FormFeedback>
                            )}
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="postalCode">
                                Postal Code
                            </Label>
                            <Input
                                name="postalCode"
                                id="postalCode"
                                placeholder="6118"
                                bsSize="sm"
                                invalid={( errors.postalCode && !merchandiserBasicInfo?.postalCode?.length ) && true}
                                value={merchandiserBasicInfo?.postalCode}
                                onChange={( e ) => { handleInputOnChange( e ); }}
                            />
                            {errors && errors.postalCode && (
                                <FormFeedback>{errors.postalCode.message}</FormFeedback>
                            )}
                        </FormGroup>

                    </Col>
                </Row>


                <Row>

                    <Col>
                        <FormGroup>
                            <Label for="fullAddress">Address:</Label>
                            <Input
                                name="fullAddress"
                                type="textarea"
                                id="fullAddress"
                                bsSize="sm"
                                placeholder="Write fullAddress"
                                invalid={( errors.fullAddress && !merchandiserBasicInfo?.fullAddress?.length ) && true}
                                value={merchandiserBasicInfo?.fullAddress}
                                onChange={( e ) => { handleInputOnChange( e ); }}
                            />
                            {errors && errors.fullAddress && (
                                <FormFeedback>{errors.fullAddress.message}</FormFeedback>
                            )}
                        </FormGroup>
                    </Col>

                </Row> */}
                <Row>
                    <Col>
                        <FormGroup>
                            <div className="main-div">
                                <Card className="img-holder">
                                    {isAgentImageUploading ? <div
                                        className='d-flex justify-content-center align-items-center'
                                        style={{ height: '120px', width: '120px' }}>
                                        <Spinner color="success" />
                                    </div> : <img
                                        src={
                                            merchandiserBasicInfo.imageEditUrl.length ? `${merchandiserBasicInfo.imageEditUrl}` : defaultImage
                                        }
                                        alt="Buyer Image"
                                        className="image"
                                    />

                                    }

                                    {merchandiserBasicInfo?.imageEditUrl.length ? (
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

                    </Col>

                </Row>

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

export default MerchandiserEditForm;

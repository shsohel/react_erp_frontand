/* eslint-disable no-var */
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import _ from 'lodash';
import { useEffect, useState } from "react";
import { Edit, Upload, XCircle } from "react-feather";
import { useForm } from "react-hook-form";
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from 'react-router-dom';
import Select from 'react-select';
import {
    Button, Card, Col, FormFeedback, FormGroup, FormText, Input, Label, Media, NavItem, NavLink, Row, Spinner
} from "reactstrap";
import CardBody from "reactstrap/lib/CardBody";
import * as yup from 'yup';
import defaultImage from "../../../../assets/images/avatars/avatar-blank.png";
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { selectedCountry, selectedState } from '../../../../utility/enums';
import { isPermit, selectThemeColors } from '../../../../utility/Utils';
import { bindBuyerBasicInfo, buyerImageUpload, clearAllBuyerState, getBuyerById, updateBuyer } from '../store/actions';
import BuyerDetailsForAdd from './BuyerDetailsForAdd';


const BuyerEditForm = ( data ) => {
    const { replace, push } = useHistory();
    const dispatch = useDispatch();
    const { state } = useLocation();
    // const fileBasePath = ( photoData?.length > 0 ? baseUrl : localUrl );
    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );
    const buyerId = state;
    const { buyerBasicInfo, isImageUploading, isBuyerDataOnProgress } = useSelector( ( { buyers } ) => buyers );
    //  console.log( 'buyerBasicInfo', JSON.stringify( buyerBasicInfo, null, 2 ) );

    const [photo, setPhoto] = useState( { url: data?.photo } );

    const [buyerAssignFormData, setBuyerAssignFormData] = useState( {
        buyerDepartment: [],
        buyerAgent: [],
        buyerProductDeveloper: [],
        buyerSizeGroups: [],
        buyerColors: []

    } );

    useEffect( () => {
        dispatch( getBuyerById( buyerId ) );

    }, [dispatch, buyerId] );

    const handlePhotoUpload = ( e ) => {
        setPhoto( {
            url: URL.createObjectURL( e.target.files[0] )
        } );
    };


    const phone = "^(?:\\+88|01)?\\d{11}\r?$";
    const validationSchema = yup.object().shape( {
        name: buyerBasicInfo.name.length ? yup.string() : yup.string().required( 'Name is required!' ),
        shortName: yup.string().notRequired( 'Short Name is required!' ),
        email: yup.string().email( 'Invalid email format' ).notRequired( 'Email is required!' ),
        fullAddress: yup.string().notRequired( 'Address is required!' ),
        phoneNumber: yup.string().notRequired( 'Phone Number  is required!' ),
        country: yup.string().notRequired( 'Country  is required!' ),
        city: yup.string().notRequired( 'City  is required!' ),
        state: yup.string().notRequired( 'State  is required!' ),
        postalCode: yup.string().notRequired( 'Postal Code  is required!' )
    } );

    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );


    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...buyerBasicInfo,
            [name]: value
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );
    };

    const handleDropdown = ( data, e ) => {
        const { action, name, option } = e;
        const updatedObj = {
            ...buyerBasicInfo,
            [name]: data
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );
    };


    const handleRetrievePhoto = () => {
        const updatedObj = {
            ...buyerBasicInfo,
            photo: null,
            imageEditUrl: ''
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );
    };


    const handlePhotoChange = e => {
        const { files } = e.target;
        var dataWithPhoto = new FormData();
        dataWithPhoto.append( 'for', 'buyer' );
        dataWithPhoto.append( 'file', files[0], files[0]?.name );
        dispatch( buyerImageUpload( files[0], dataWithPhoto ) );

    };
    const onSubmit = () => {
        //For Department
        const deletedDepartment = buyerBasicInfo.buyerDepartment.filter( dd => dd.isDeleted ).map( d => ( { departmentId: d.id, isDeleted: d.isDeleted } ) );
        const addedDepartment = buyerBasicInfo.buyerDepartment.filter( dd => dd.isNew ).map( d => ( { departmentId: d.id, isDeleted: d.isDeleted } ) );
        const updatedDepartment = [...addedDepartment, ...deletedDepartment];

        //For Agent
        const deletedAgent = buyerBasicInfo.buyerAgent.filter( dd => dd.isDeleted ).map( d => ( { agentId: d.id, isDeleted: d.isDeleted } ) );
        const addedAgent = buyerBasicInfo.buyerAgent.filter( dd => dd.isNew ).map( d => ( { agentId: d.id, isDeleted: d.isDeleted } ) );
        const updatedAgent = [...addedAgent, ...deletedAgent];

        //For ProductDeveloper
        const deletedProductDeveloper = buyerBasicInfo.buyerProductDeveloper.filter( dd => dd.isDeleted ).map( d => ( { productDeveloperId: d.id, isDeleted: d.isDeleted } ) );
        const addedProductDeveloper = buyerBasicInfo.buyerProductDeveloper.filter( dd => dd.isNew ).map( d => ( { productDeveloperId: d.id, isDeleted: d.isDeleted } ) );
        const updatedProductDeveloper = [...addedProductDeveloper, ...deletedProductDeveloper];

        //For Colors
        const deletedColors = buyerBasicInfo.buyerColors.filter( dd => dd.isDeleted ).map( d => ( { colorId: d.id, isDeleted: d.isDeleted } ) );
        const addedColors = buyerBasicInfo.buyerColors.filter( dd => dd.isNew ).map( d => ( { colorId: d.id, isDeleted: d.isDeleted } ) );
        const updatedColors = [...addedColors, ...deletedColors];

        //For Colors
        const deletedSizeGroups = buyerBasicInfo.buyerSizeGroups.filter( dd => dd.isDeleted ).map( d => ( { sizeGroupId: d.id, isDeleted: d.isDeleted } ) );
        const addedSizeGroups = buyerBasicInfo.buyerSizeGroups.filter( dd => dd.isNew ).map( d => ( { sizeGroupId: d.id, isDeleted: d.isDeleted } ) );
        const updatedSizeGroups = [...addedSizeGroups, ...deletedSizeGroups];
        //For Destination
        const deletedDestinations = buyerBasicInfo.buyerDestinations.filter( dd => dd.isDeleted ).map( d => ( { destination: d.id, isDeleted: d.isDeleted } ) );
        console.log( deletedDestinations );
        const addedDestinations = buyerBasicInfo.buyerDestinations.filter( dd => dd.isNew ).map( d => ( { destination: d.id, isDeleted: d.isDeleted } ) );
        const updatedDestinations = [...addedDestinations, ...deletedDestinations];
        console.log( updatedDestinations );

        const submitObj = {
            name: buyerBasicInfo.name,
            shortName: buyerBasicInfo.shortName,
            email: buyerBasicInfo.email,
            phoneNumber: buyerBasicInfo.phoneNumber,
            fullAddress: buyerBasicInfo.fullAddress,
            postalCode: buyerBasicInfo.postalCode,
            state: buyerBasicInfo.state ? buyerBasicInfo.state?.value : '',
            city: buyerBasicInfo.city ? buyerBasicInfo.city?.value : '',
            country: buyerBasicInfo.city ? buyerBasicInfo.country?.value : '',
            departmentIds: _.uniqBy( updatedDepartment, 'departmentId' ),
            agentIds: _.uniqBy( updatedAgent, 'agentId' ),
            productDeveloperIds: _.uniqBy( updatedProductDeveloper, 'productDeveloperId' ),
            sizeGroupIds: _.uniqBy( updatedSizeGroups, 'sizeGroupId' ),
            colorIds: _.uniqBy( updatedColors, 'colorId' ),
            destinations: _.uniqBy( updatedDestinations, 'destination' ),
            image: buyerBasicInfo.image
        };
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );


        dispatch( updateBuyer( buyerBasicInfo.id, submitObj ) );

    };

    const handleCancel = () => {
        replace( '/buyers' );
        dispatch( clearAllBuyerState() );


    };
    const handleAddNew = () => {
        replace( '/buyer-add-form' );
        dispatch( clearAllBuyerState() );

    };

    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: "/",
            isActive: false
        },
        {
            id: 'buyerList',
            name: 'List',
            link: "/buyers",
            isActive: false
        },
        {
            id: 'buyer',
            name: 'Buyer Edit',
            link: "/buyer-edit-form",
            state: buyerId,
            isActive: true
        }
    ];


    return (
        <div>
            <UILoader blocking={isBuyerDataOnProgress} loader={<ComponentSpinner />} >

                <Card className="mt-3">
                    {/* <CardHeader>Edit Buyer</CardHeader> */}
                    <CardBody>

                        <Row>
                            <Col lg={6} md={6} sm={12} xs={12}>
                                <div >
                                    <ActionMenu
                                        breadcrumb={breadcrumb}
                                        title='Edit Buyer'
                                        moreButton={isPermit( userPermission?.BuyerCreate, authPermissions )}
                                    >
                                        <NavItem className="mr-1" >
                                            <NavLink
                                                tag={Button}
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
                                                onClick={() => { handleCancel(); }}                    >
                                                Cancel
                                            </NavLink>
                                        </NavItem>
                                        <NavItem
                                            className="mr-1"
                                            hidden={!isPermit( userPermission?.BuyerCreate, authPermissions )}

                                        >
                                            <NavLink
                                                tag={Button}
                                                size="sm"
                                                color="success"
                                                onClick={() => { handleAddNew(); }}                    >
                                                Add New
                                            </NavLink>
                                        </NavItem>
                                    </ActionMenu>

                                    <Card style={{ minHeight: "480px" }}>
                                        <CardBody className="">
                                            <Row >
                                                <Col lg={4} sm={12} xs={12} md={12} xl={3}>
                                                    <Media className="mb-2">
                                                        <Media left>
                                                            <div className="main-div">
                                                                <Card className="img-holder">
                                                                    {isImageUploading ? <div
                                                                        className='d-flex justify-content-center align-items-center'
                                                                        style={{ height: '120px', width: '120px' }}>
                                                                        <Spinner color="success" />
                                                                    </div> : <img
                                                                        src={
                                                                            buyerBasicInfo.imageEditUrl.length ? `${buyerBasicInfo.imageEditUrl}` : buyerBasicInfo.imageUrl.length ? `${buyerBasicInfo.imageUrl}` : defaultImage
                                                                        }
                                                                        alt="Buyer Image"
                                                                        className="image"
                                                                    />

                                                                    }
                                                                    <div className="overlay">
                                                                        <div className="text">
                                                                            {/* <ButtonGroup size="sm"> */}
                                                                            <Button.Ripple
                                                                                for="buyerPhotoUploadId"
                                                                                hidden={!buyerBasicInfo.imageUrl.length}
                                                                                tag={Label}
                                                                                className="btn-icon p-0 mr-1"
                                                                                color="relief-success"
                                                                            >
                                                                                <Edit size={20} />
                                                                                <input
                                                                                    type="file"
                                                                                    hidden
                                                                                    id="buyerPhotoUploadId"
                                                                                    onChange={( e ) => { handlePhotoChange( e ); }}
                                                                                    accept="image/*"
                                                                                />
                                                                            </Button.Ripple>


                                                                            <Button.Ripple
                                                                                tag={Label}
                                                                                className="btn-icon p-0 mr-1"
                                                                                color="relief-primary"
                                                                                hidden={!!buyerBasicInfo.imageUrl.length}
                                                                                for="buyerPhotoNewUploadId"
                                                                            >
                                                                                <Upload size={20} />
                                                                                <input
                                                                                    type="file"
                                                                                    hidden
                                                                                    id="buyerPhotoNewUploadId"
                                                                                    onChange={( e ) => { handlePhotoChange( e ); }}
                                                                                    accept="image/*"
                                                                                />
                                                                            </Button.Ripple>
                                                                            <Button.Ripple
                                                                                tag={Label}
                                                                                className="btn-icon p-0"
                                                                                color="relief-danger"
                                                                                hidden={!buyerBasicInfo.imageEditUrl.length}
                                                                                for="buyerPhotoRemoveId"
                                                                            >
                                                                                <XCircle
                                                                                    size={20}
                                                                                    id="buyerPhotoRemoveId"
                                                                                    onClick={() => {
                                                                                        handleRetrievePhoto();
                                                                                    }}
                                                                                />
                                                                            </Button.Ripple>

                                                                            {/* </ButtonGroup> */}
                                                                        </div>
                                                                    </div>

                                                                </Card>
                                                            </div>
                                                        </Media>
                                                    </Media>
                                                </Col>
                                                <Col lg={8} sm={12} xs={12} md={12} xl={9}>
                                                    <div className="row ">
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label for='name'>
                                                                    Name <span className='text-danger'>*</span>
                                                                </Label>
                                                                <Input
                                                                    name='name'
                                                                    id='name'
                                                                    placeholder='Walmart'
                                                                    bsSize="sm"
                                                                    //defaultValue={buyerName ? buyerName : ''}
                                                                    // value={buyerName ? buyerName : ''}
                                                                    /// innerRef={register( { required: true } )}
                                                                    invalid={errors.name && !buyerBasicInfo.name.length}
                                                                    /// className={classnames( { 'is-invalid': ( errors['name'] && !buyerBasicInfo.name.length ) } )}
                                                                    // className={classnames( { 'is-invalid': ( errors['name'] && !buyerBasicInfo.name.length ) } )}
                                                                    value={buyerBasicInfo.name}
                                                                    onChange={( e ) => handleInputOnChange( e )}
                                                                />
                                                                {/* <FormText color='muted'>You can use letters, numbers & periods</FormText> */}
                                                                {errors && errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label for='shortName'>
                                                                    Short Name
                                                                </Label>
                                                                <Input
                                                                    name='shortName'
                                                                    id='shortName'
                                                                    placeholder='Walmart'
                                                                    bsSize="sm"
                                                                    invalid={errors.shortName && true}
                                                                    className={classnames( { 'is-invalid': errors['shortName'] } )}
                                                                    value={buyerBasicInfo.shortName}
                                                                    onChange={( e ) => handleInputOnChange( e )}
                                                                />
                                                                {errors && errors.shortName && <FormFeedback>{errors.shortName.message}</FormFeedback>}

                                                            </FormGroup>
                                                        </Col>
                                                    </div>
                                                    <div className="row">
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label for='email'>
                                                                    Email
                                                                </Label>
                                                                <Input
                                                                    // type='email'
                                                                    name='email'
                                                                    id='email'
                                                                    bsSize="sm"
                                                                    placeholder='john.doe@example.com'
                                                                    invalid={errors.email && true}
                                                                    className={classnames( { 'is-invalid': errors['email'] } )}
                                                                    value={buyerBasicInfo.email}
                                                                    onChange={( e ) => handleInputOnChange( e )}
                                                                />
                                                                <FormText color='muted'>You can use letters, numbers & periods</FormText>
                                                                {errors && errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label for='phoneNumber'>
                                                                    Phone
                                                                </Label>
                                                                <NumberFormat
                                                                    name='phoneNumber'
                                                                    id='phoneNumber'
                                                                    allowLeadingZeros={true}
                                                                    //  format="##### ### ###"
                                                                    bsSize="sm"
                                                                    type='tel'

                                                                    customInput={Input}
                                                                    placeholder='(+880) 1811-275653'
                                                                    invalid={errors.phoneNumber && true}
                                                                    className={classnames( { 'is-invalid': errors['phoneNumber'] } )}
                                                                    value={buyerBasicInfo.phoneNumber}
                                                                    onChange={( e ) => handleInputOnChange( e )}
                                                                />

                                                                {errors && errors.phoneNumber && <FormFeedback>{errors.phoneNumber.message}</FormFeedback>}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label for='faxNo'>
                                                                    Fax NO
                                                                </Label>
                                                                <Input
                                                                    type='tel'
                                                                    name='faxNo'
                                                                    id='faxNo'
                                                                    bsSize="sm"
                                                                    placeholder=''
                                                                    invalid={errors.faxNo && true}
                                                                    className={classnames( { 'is-invalid': errors['faxNo'] } )}
                                                                    value={buyerBasicInfo.faxNo}
                                                                    onChange={( e ) => handleInputOnChange( e )}
                                                                />
                                                                {errors && errors.faxNo && <FormFeedback>{errors.faxNo.message}</FormFeedback>}
                                                            </FormGroup>
                                                        </Col>
                                                    </div>
                                                </Col>

                                                <Col lg="12">
                                                    <div className="row">
                                                        <Col lg="12">
                                                            <FormGroup>
                                                                <Label for='fullAddress'>
                                                                    Address:
                                                                </Label>
                                                                <Input
                                                                    name='fullAddress'
                                                                    type="textarea"
                                                                    id='fullAddress'
                                                                    bsSize="sm"
                                                                    placeholder='Write address'
                                                                    innerRef={register( { required: true } )}
                                                                    invalid={errors.fullAddress && true}
                                                                    className={classnames( { 'is-invalid': errors['fullAddress'] } )}
                                                                    value={buyerBasicInfo.fullAddress}
                                                                    onChange={( e ) => handleInputOnChange( e )}
                                                                />
                                                                {errors && errors.fullAddress && <FormFeedback>{errors.fullAddress.message}</FormFeedback>}
                                                            </FormGroup>

                                                        </Col>
                                                    </div>
                                                    <div className="row">
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label for='country'>
                                                                    Country
                                                                </Label>
                                                                <Select
                                                                    id='countryId'
                                                                    isSearchable
                                                                    name="country"
                                                                    isClearable
                                                                    theme={selectThemeColors}
                                                                    options={selectedCountry}
                                                                    classNamePrefix='dropdown'
                                                                    innerRef={register( { required: true } )}
                                                                    invalid={errors.costingMethod && true}
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.country && !buyerBasicInfo?.country ) && 'is-invalid'}` )}
                                                                    value={buyerBasicInfo?.country}
                                                                    onChange={( data, e ) => {
                                                                        handleDropdown( data, e );
                                                                    }}
                                                                />
                                                                {( errors && errors.country && !buyerBasicInfo?.country ) && <FormFeedback>{errors.country.message}</FormFeedback>}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label for='state'>
                                                                    State
                                                                </Label>
                                                                <Select
                                                                    id='stateId'
                                                                    isSearchable
                                                                    name="state"
                                                                    isClearable
                                                                    theme={selectThemeColors}
                                                                    options={selectedState}
                                                                    classNamePrefix='dropdown'
                                                                    innerRef={register( { required: true } )}
                                                                    invalid={errors.state && true}
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.state && !buyerBasicInfo?.state ) && 'is-invalid'}` )}
                                                                    value={buyerBasicInfo?.state}
                                                                    onChange={( data, e ) => {
                                                                        handleDropdown( data, e );
                                                                    }}
                                                                />
                                                                {( errors && errors.state && !buyerBasicInfo?.state ) && <FormFeedback>{errors.state.message}</FormFeedback>}
                                                            </FormGroup>
                                                        </Col>
                                                    </div>
                                                    <div className="row">
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label for='city'>
                                                                    City
                                                                </Label>
                                                                <Select
                                                                    id='cityId'
                                                                    isSearchable
                                                                    name="city"
                                                                    isClearable
                                                                    theme={selectThemeColors}
                                                                    options={selectedState}
                                                                    classNamePrefix='dropdown'
                                                                    innerRef={register( { required: true } )}
                                                                    invalid={errors.city && true}
                                                                    className={classnames( `erp-dropdown-select ${( errors && errors.city && !buyerBasicInfo?.city ) && 'is-invalid'}` )}
                                                                    value={buyerBasicInfo?.city}
                                                                    onChange={( data, e ) => {
                                                                        handleDropdown( data, e );
                                                                    }}
                                                                />
                                                                {( errors && errors.city && !buyerBasicInfo?.city ) && <FormFeedback>{errors.city.message}</FormFeedback>}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label for='postalCode'>
                                                                    Postal Code
                                                                </Label>
                                                                <Input
                                                                    name='postalCode'
                                                                    id='postalCode'
                                                                    placeholder='6118'
                                                                    bsSize="sm"
                                                                    innerRef={register( { required: false } )}
                                                                    invalid={errors.postalCode && true}
                                                                    className={classnames( { 'is-invalid': errors['postalCode'] } )}
                                                                    value={buyerBasicInfo?.postalCode}
                                                                    onChange={( e ) => {
                                                                        handleInputOnChange( e );
                                                                    }}
                                                                />
                                                                {errors && errors.postalCode && <FormFeedback>{errors.postalCode.message}</FormFeedback>}
                                                            </FormGroup>

                                                        </Col>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>

                                </div>
                            </Col>


                            <Col lg={6} md={6} sm={12} xs={12} >
                                <Card style={{ minHeight: "480px" }}>
                                    <BuyerDetailsForAdd
                                        buyerAssignFormData={buyerAssignFormData}
                                        setBuyerAssignFormData={setBuyerAssignFormData}
                                    />
                                </Card>
                            </Col>

                        </Row>
                    </CardBody>
                </Card>

            </UILoader>
        </div>
    );
};

export default BuyerEditForm;

import '@custom-styles/auth/form/user-form.scss';
import { notify } from '@custom/notifications';
import { yupResolver } from '@hookform/resolvers/yup';
import { baseAxios } from '@services';
import { userManagementApi } from '@services/api-end-points/user-management';
import { getAuthUser } from '@src/redux/actions/auth';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import '@styles/react/pages/page-account-settings.scss';
import { useState } from 'react';
import { Edit, Lock, Upload, User, XCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Nav, NavItem, NavLink, Row, Spinner, TabContent, TabPane } from 'reactstrap';
import * as yup from 'yup';
import defaultImage from "../../../assets/images/avatars/avatar-blank.png";
import ActionMenu from '../../../layouts/components/menu/action-menu';
import CustomModal from '../../../utility/custom/CustomModal';
import { baseUrl, status } from '../../../utility/enums';
import SecurityTabContent from './SecurityTabContent';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'userList',
        name: 'Profile',
        link: "#",
        isActive: true
    }
];

// import React from 'react';

// const fdfd = () => {
//     return (
//         <div>UserProfile</div>
//     );
// };

const UserUpdateConfirmModal = ( { openModal, submitModal, closeModal, handleUserInfoOnChange, profileData } ) => {

    return (
        <CustomModal
            modalTypeClass='vertically-centered-modal'
            className='modal-dialog-centered modal-sm'
            openModal={openModal}
            handleMainModelSubmit={submitModal}
            handleMainModalToggleClose={closeModal}
            title="Confirm to update"
        >
            <Label className='form-label' for='password'>
                Your Password
            </Label>
            <Input
                id='password'
                type="password"
                name='password'
                placeholder='Password'
                bsSize="sm"
                value={profileData?.password ?? ''}
                onChange={( e ) => { handleUserInfoOnChange( e ); }}
            />
        </CustomModal>
    );
};

const UserProfile = () => {
    const dispatch = useDispatch();
    const { authenticateUser } = useSelector( ( { auth } ) => auth );
    const [profileData, setProfileData] = useState( { ...authenticateUser, avatarUrl: `${baseUrl}/${authenticateUser.imageUrl}`, avatar: null, password: '' } );
    const [isUserImageUploading, setIsUserImageUploading] = useState( false );
    const SignupSchema = yup.object().shape( {
        // buyer: userBasicInfo?.buyer ? yup.string() : yup.string().required( 'Buyer Term is Required!!' ),
        // supplier: userBasicInfo?.supplier ? yup.string() : yup.string().required( 'Supplier Term is Required!!' ),
        // itemGroupType: userBasicInfo?.itemGroupType ? yup.string() : yup.string().required( 'Item Group Type Term is Required!!' ),
        // shipmentMode: userBasicInfo?.shipmentMode ? yup.string() : yup.string().required( 'Shipment Mode is Required!!' ),
        // currency: userBasicInfo?.currency ? yup.string() : yup.string().required( 'Currency is Required!!' ),
        // warehouse: userBasicInfo?.warehouse ? yup.string() : yup.string().required( 'Warehouse is Required!!' ),
        // payTerm: userBasicInfo?.payTerm ? yup.string() : yup.string().required( 'Pay Term is Required!!' ),
        // source: userBasicInfo?.source ? yup.string() : yup.string().required( 'Source is Required!!' ),
        // shippingTerm: userBasicInfo?.shippingTerm ? yup.string() : yup.string().required( 'Shipping Term is Required!!' ),
        // orderNature: userBasicInfo?.orderNature ? yup.string() : yup.string().required( 'Requisition Nature is Required!!' ),
        // status: userBasicInfo?.status ? yup.string() : yup.string().required( 'Status is Required!!' )
    } );
    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );

    const handleUserInfoOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...profileData,
            [name]: value
        };
        setProfileData( updatedObj );
    };


    const userImageUpload = ( file, formData ) => {
        setIsUserImageUploading( true );
        const path = `/api/userAccess/medias/upload/image`;
        // const apiEndPoint = `${merchandisingApi.buyer.root}/uploadImage`;
        baseAxios.post( path, formData )
            .then( response => {
                if ( response.status === status.success ) {
                    const updatedObj = {
                        ...profileData,
                        avatarUrl: URL.createObjectURL( file ),
                        avatar: response.data
                    };
                    setProfileData( updatedObj );

                    // dispatch( bindUserBasicInfo( updatedObj ) );

                    setIsUserImageUploading( false );
                }
            } ).catch( ( { response } ) => {
                // if ( response.status === status.severError ) {
                //     notify( 'error', `Please contact the support team!!!` );
                // } else {
                //     notify( 'error', `${response.data.errors.join( ', ' )}` );
                // }
                setIsUserImageUploading( false );
            } );
    };

    const handlePhotoUpload = e => {
        const { files } = e.target;
        const obj = {
            For: 'User',
            Category: '',
            Description: '',
            IsDefault: true
        };

        const dataWithPhoto = new FormData();
        for ( const key in obj ) {
            dataWithPhoto.append( key, obj[key] );
        }
        dataWithPhoto.append( 'File', files[0], files[0]?.name );
        userImageUpload( files[0], dataWithPhoto );
    };

    const handlePhotoRemove = () => {
        const updatedObj = {
            ...profileData,
            avatar: null,
            avatarUrl: ''
        };
        setProfileData( updatedObj );
    };

    const [openUserProfileModal, setOpenUserProfileModal] = useState( false );

    const handleModalClose = () => {
        setOpenUserProfileModal( !openUserProfileModal );
        setProfileData( {
            ...profileData,
            password: ''
        } );

    };

    const confirmToSubmit = () => {
        const submittedObj = {
            id: "fc0ea55c-cd1a-477e-b9fa-37a4c093c882",
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
            contactNumber: profileData.contactNumber,
            password: profileData.password,
            media: profileData?.avatar ?? {}

        };

        const apiEndPoint = `${userManagementApi.user.root}/${profileData?.id}/profile`;
        baseAxios.put( apiEndPoint, submittedObj ).then( response => {
            if ( response.status === status.success ) {
                notify( 'success', 'Profile has been updated successfully' );
                dispatch( getAuthUser() );
                handleModalClose();
            }
        } ).catch( ( { response } ) => {
            console.log( response );
            if ( response?.status === status?.severError || response === undefined ) {
                notify( 'error', `Please contact the support team!!!` );
            } else if ( response?.status === status?.conflict ) {
                //
                notify( 'error', `${response?.data.detail}` );

            } else {
                notify( 'errors', response?.data.errors );
            }
        } );

    };

    const onSubmit = () => {
        handleModalClose();
    };

    const handleCancel = () => {

    };

    const [activeTab, setActiveTab] = useState( '1' );
    const [data, setData] = useState( null );

    const toggleTab = tab => {
        setActiveTab( tab );
    };

    const profilePhoto = profileData?.avatarUrl?.length ? `${profileData?.avatarUrl}` : defaultImage;


    return (
        <div>
            <div className="mt-3">
                <ActionMenu
                    breadcrumb={breadcrumb}
                    title='Profile Details'
                    moreButton={false}
                >
                    {/* <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            type="submit"
                            // onClick={handleSubmit( onSubmit )}
                            size="sm"
                            color="primary"
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
                    </NavItem> */}
                </ActionMenu>
                <div>


                    <Row>
                        <Col xs={12}>
                            <Nav pills className='mb-2'>
                                <NavItem>
                                    <NavLink active={activeTab === '1'} onClick={() => toggleTab( '1' )}>
                                        <User size={18} className='mr-50' />
                                        <span className='fw-bold '>Account</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink active={activeTab === '2'} onClick={() => toggleTab( '2' )}>
                                        <Lock size={18} className='mr-50' />
                                        <span className='fw-bold'>Security</span>
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId='1'>
                                    {/* <AccountTabContent data={data.general} /> */}
                                    <Card>
                                        <CardHeader className='border-bottom'>
                                            <CardTitle tag='h4'>Profile Details</CardTitle>
                                        </CardHeader>
                                        <CardBody className='py-2 my-25'>
                                            <div className='d-flex'>
                                                <div className='me-25'>
                                                    <div className="main-div">
                                                        <Card className="img-holder">
                                                            {isUserImageUploading ? <div
                                                                className='d-flex justify-content-center align-items-center'
                                                                style={{ height: '120px', width: '120px' }}>
                                                                <Spinner color="success" />
                                                            </div> : <img
                                                                src={profilePhoto}
                                                                alt="Buyer Image"
                                                                className="image"
                                                            />

                                                            }

                                                            {profileData?.avatarUrl.length ? (
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
                                                </div>
                                                {/* <div className='d-flex align-items-end mt-75 px-1'>
                                                    <div>
                                                        <Button tag={Label} className='mb-75 mr-1' size='sm' color='primary'>
                                                            Upload
                                                            <Input type='file' hidden accept='image/*' />
                                                        </Button>
                                                        <Button className='mb-75' color='secondary' size='sm' outline>
                                                            Reset
                                                        </Button>
                                                        <p className='mb-0'>Allowed JPG, GIF or PNG. Max size of 800kB</p>
                                                    </div>
                                                </div> */}
                                            </div>
                                            <div className='mt-2 pt-50' >
                                                <Row>
                                                    <Col sm='6' className='mb-1'>
                                                        <Label className='form-label' for='firstName'>
                                                            First Name
                                                        </Label>
                                                        <Input
                                                            id='firstName'
                                                            name='firstName'
                                                            placeholder=''
                                                            bsSize="sm"
                                                            value={profileData?.firstName ?? ''}
                                                            onChange={( e ) => { handleUserInfoOnChange( e ); }}
                                                        />
                                                        {/* {errors && errors.firstName && <FormFeedback>Please enter a valid First Name</FormFeedback>} */}
                                                    </Col>
                                                    <Col sm='6' className='mb-1'>
                                                        <Label className='form-label' for='lastName'>
                                                            Last Name
                                                        </Label>
                                                        <Input
                                                            id='lastName'
                                                            name='lastName'
                                                            placeholder=''
                                                            bsSize="sm"
                                                            value={profileData?.lastName ?? ''}
                                                            onChange={( e ) => { handleUserInfoOnChange( e ); }}
                                                        />
                                                        {/* {errors.lastName && <FormFeedback>Please enter a valid Last Name</FormFeedback>} */}
                                                    </Col>
                                                    <Col sm='6' className='mb-1'>
                                                        <Label className='form-label' for='emailInput'>
                                                            E-mail
                                                        </Label>
                                                        <Input
                                                            id='emailInput'
                                                            type='email'
                                                            name='email'
                                                            placeholder='Email'
                                                            bsSize="sm"
                                                            value={profileData?.email ?? ''}
                                                            onChange={( e ) => { handleUserInfoOnChange( e ); }}
                                                        />
                                                    </Col>

                                                    <Col sm='6' className='mb-1'>
                                                        <Label className='form-label' for='contactNumber'>
                                                            Contact Number
                                                        </Label>
                                                        <Input
                                                            id='contactNumber'
                                                            name='contactNumber'
                                                            className='form-control'
                                                            placeholder='1 234 567 8900'
                                                            bsSize="sm"
                                                            value={profileData?.contactNumber ?? ''}
                                                            onChange={( e ) => { handleUserInfoOnChange( e ); }}
                                                        />
                                                    </Col>
                                                    <Col sm='6' className='mb-1'>
                                                        <Label className='form-label' for='phNumber'>
                                                            User Name
                                                        </Label>
                                                        <Input
                                                            disabled
                                                            id='userName'
                                                            name='userName'
                                                            className='form-control'
                                                            placeholder='1 234 567 8900'
                                                            bsSize="sm"
                                                            value={profileData?.userName ?? ''}
                                                            onChange={() => { }}
                                                        />
                                                    </Col>
                                                    <Col sm='6' className='mb-1'>
                                                        <Label className='form-label' for='phNumber'>
                                                            Role
                                                        </Label>
                                                        <Input
                                                            disabled
                                                            id='roles'
                                                            name='roles'
                                                            className='form-control'
                                                            placeholder='1 234 567 8900'
                                                            bsSize="sm"
                                                            value={profileData?.roles.join( ', ' ).toString() ?? ''}
                                                            onChange={() => { }}
                                                        />
                                                    </Col>


                                                    <Col className='mt-2' sm='12'>
                                                        <Button
                                                            type='submit'
                                                            className='mr-1'
                                                            color='primary'
                                                            size="sm"
                                                            onClick={handleSubmit( onSubmit )}

                                                        >
                                                            Save changes
                                                        </Button>

                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </TabPane>
                                <TabPane tabId='2'>
                                    <SecurityTabContent />
                                </TabPane>

                            </TabContent>
                        </Col>
                    </Row>
                    {
                        openUserProfileModal && (
                            <UserUpdateConfirmModal
                                openModal={openUserProfileModal}
                                closeModal={handleModalClose}
                                submitModal={confirmToSubmit}
                                handleUserInfoOnChange={handleUserInfoOnChange}
                                profileData={profileData}
                            />
                        )
                    }
                </div>
            </div>

        </div>
    );
};

export default UserProfile;
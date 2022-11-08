import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/auth/form/user-form.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { Edit, Upload, XCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Card, FormGroup, Input, Label } from 'reactstrap';
import Spinner from 'reactstrap/lib/Spinner';
import * as yup from 'yup';
import defaultImage from "../../../../assets/images/avatars/avatar-blank.png";
import { permissibleProcess } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';
import { getRoleDropdown } from '../../role/store/actions';
import { bindUserBasicInfo, updateUser, userImageUpload } from '../store/actions';

const UserEditForm = ( { open, toggleSidebar } ) => {
    const dispatch = useDispatch();
    const { userBasicInfo, isUserImageUploading, isUserDataSubmitProgress } = useSelector( ( { users } ) => users );
    const { roleDropdown, isRoleDropdownLoaded } = useSelector( ( { roles } ) => roles );

    console.log( isRoleDropdownLoaded );

    const SignupSchema = yup.object().shape( {
        userName: userBasicInfo?.userName?.length ? yup.string() : yup.string().required( 'User Name is Required!!' ),
        firstName: userBasicInfo?.firstName?.length ? yup.string() : yup.string().required( 'First Name is Required!!' ),
        lastName: userBasicInfo?.lastName?.length ? yup.string() : yup.string().required( 'Last Name is Required!!' ),
        email: userBasicInfo?.email?.length ? yup.string() : yup.string().required( 'Email is Required!!' ),
        // password: userBasicInfo?.password.length ? yup.string() : yup.string().required( 'Password is Required!!' ),
        // confirmPassword: userBasicInfo?.confirmPassword.length ? yup.string() : yup.string().required( 'Confirm Password is Required!!' ),
        roles: userBasicInfo?.roles?.length ? yup.string() : yup.string().required( 'Role is Required!!' )
    } );
    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );

    console.log( userBasicInfo );

    const handleRoleOnFocus = () => {
        if ( !roleDropdown.length ) {
            dispatch( getRoleDropdown() );
        }
    };

    const handleUserInfoOnChange = ( e ) => {
        const { name, value } = e.target;
        console.log( name );
        const updatedObj = {
            ...userBasicInfo,
            [name]: value
        };
        dispatch( bindUserBasicInfo( updatedObj ) );

    };

    const handleDropdown = ( data, e ) => {
        const { action, name, option } = e;
        const updatedObj = {
            ...userBasicInfo,
            [name]: data
        };
        dispatch( bindUserBasicInfo( updatedObj ) );
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
        dispatch( userImageUpload( files[0], dataWithPhoto ) );
    };
    const handlePhotoRemove = () => {
        const updatedObj = {
            ...userBasicInfo,
            avatar: null,
            avatarUrl: ''
        };
        dispatch( bindUserBasicInfo( updatedObj ) );
    };

    const onSubmit = () => {
        const submittedObj = {
            id: userBasicInfo?.id,
            // userName: userBasicInfo?.userName,
            email: userBasicInfo?.email,
            firstName: userBasicInfo?.firstName,
            lastName: userBasicInfo?.lastName,
            contactNumber: userBasicInfo?.contactNumber,
            media: {
                name: userBasicInfo?.avatar?.name,
                generatedName: userBasicInfo?.avatar?.generatedName,
                extension: userBasicInfo?.avatar?.extension
            },
            roles: userBasicInfo?.roles?.map( role => role.value ),
            permissibleProcesses: userBasicInfo?.permissibleProcesses?.map( p => p.value )

        };
        console.log( 'submittedObj', JSON.stringify( submittedObj, null, 2 ) );
        dispatch( updateUser( submittedObj ) );
    };
    const handleCancel = () => {
        dispatch( bindUserBasicInfo( null ) );
        toggleSidebar();
    };
    return (
        <div>
            <Sidebar
                size='lg'
                open={open}
                title='Edit User'
                headerClassName='mb-1'
                contentClassName='pt-0'
                toggleSidebar={toggleSidebar}
            >
                <>
                    <UILoader blocking={isUserDataSubmitProgress} loader={<ComponentSpinner />}  >
                        <FormGroup>
                            <Label for='userNameId'>
                                User Name <span className='text-danger'>*</span>
                            </Label>
                            <Input
                                id="userNameId"
                                type="text"
                                name="userName"
                                bsSize="sm"
                                value={userBasicInfo?.userName}
                                invalid={( errors.userName && !userBasicInfo?.userName?.length ) && true}
                                disabled
                                onChange={( e ) => { handleUserInfoOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}

                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for='firstNameId'>
                                First  Name <span className='text-danger'>*</span>
                            </Label>
                            <Input
                                id="firstNameId"
                                type="text"
                                name="firstName"
                                bsSize="sm"
                                value={userBasicInfo?.firstName}
                                invalid={( errors.firstName && !userBasicInfo?.firstName?.length ) && true}

                                onChange={( e ) => { handleUserInfoOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for='lastNameId'>
                                Last  Name <span className='text-danger'>*</span>
                            </Label>
                            <Input
                                id="lastNameId"
                                type="text"
                                name="lastName"
                                bsSize="sm"
                                value={userBasicInfo?.lastName}
                                invalid={( errors.lastName && !userBasicInfo?.lastName?.length ) && true}

                                onChange={( e ) => { handleUserInfoOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for='name'>
                                Email <span className='text-danger'>*</span>
                            </Label>
                            <Input
                                id="emailId"
                                type="email"
                                name="email"
                                disabled
                                bsSize="sm"
                                value={userBasicInfo?.email}
                                invalid={( errors.email && !userBasicInfo?.email?.length ) && true}

                                onChange={( e ) => { handleUserInfoOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for='contactNumberId'>
                                Contact Number <span className='text-danger'>*</span>
                            </Label>
                            <Input
                                id="contactNumberId"
                                type="text"
                                name="contactNumber"
                                bsSize="sm"
                                value={userBasicInfo?.contactNumber}
                                invalid={( errors.contactNumber && !userBasicInfo?.contactNumber?.length ) && true}

                                onChange={( e ) => { handleUserInfoOnChange( e ); }}
                                onFocus={( e ) => e.target.select()}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for='rolesId'>
                                Role <span className='text-danger'>*</span>
                            </Label>
                            <Select
                                id='rolesId'
                                isLoading={!isRoleDropdownLoaded}
                                isSearchable
                                isMulti
                                name="roles"
                                isClearable
                                theme={selectThemeColors}
                                options={roleDropdown}
                                classNamePrefix='dropdown'
                                className={classNames( `erp-dropdown-select ${( errors && errors.role && !userBasicInfo?.roles?.length ) && 'is-invalid'}` )}
                                value={userBasicInfo?.roles}
                                onChange={( data, e ) => {
                                    handleDropdown( data, e );
                                }}
                                onFocus={() => { handleRoleOnFocus(); }}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="permissibleProcessId">Permissible Process:</Label>
                            <Select
                                id='permissibleProcessId'
                                isSearchable
                                name="permissibleProcesses"
                                isMulti
                                isClearable
                                theme={selectThemeColors}
                                options={permissibleProcess}
                                classNamePrefix='dropdown'
                                className={classNames( `erp-dropdown-select ${( errors && errors.permissibleProcesses && !userBasicInfo?.permissibleProcesses.length ) && 'is-invalid'}` )}
                                value={userBasicInfo?.permissibleProcesses}
                                onChange={( data, e ) => {
                                    handleDropdown( data, e );
                                }}


                            />

                        </FormGroup>
                        <FormGroup>
                            <div className="main-div">
                                <Card className="img-holder">
                                    {isUserImageUploading ? <div
                                        className='d-flex justify-content-center align-items-center'
                                        style={{ height: '120px', width: '120px' }}>
                                        <Spinner color="success" />
                                    </div> : <img
                                        src={
                                            userBasicInfo?.avatarUrl?.length ? `${userBasicInfo?.avatarUrl}` : defaultImage
                                        }
                                        alt="Buyer Image"
                                        className="image"
                                    />

                                    }

                                    {userBasicInfo?.avatarUrl.length ? (
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
                    </UILoader>
                </>

            </Sidebar>

        </div>
    );
};

export default UserEditForm;
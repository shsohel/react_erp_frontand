import InputPassword from '@components/input-password-toggle';
import themeConfig from '@configs/themeConfig';
import { yupResolver } from '@hookform/resolvers/yup';
import '@styles/base/pages/page-auth.scss';
import { useState } from 'react';
import { ChevronLeft } from 'react-feather';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { Button, Card, CardBody, CardTitle, FormFeedback, FormGroup, Label } from 'reactstrap';
import * as yup from 'yup';
import { baseAxios } from '../../services';
import { userManagementApi } from '../../services/api-end-points/user-management';
import { notify } from '../../utility/custom/notifications';
import { status } from '../../utility/enums';
import { convertQueryString, getIdFromUrl } from '../../utility/Utils';

const ResetPassword = () => {
  const { push } = useHistory();

  const [userPassword, setUserPassword] = useState( {
    newPassword: "",
    confirmPassword: ""
  } );

  const SignupSchema = yup.object().shape( {
    newPassword: userPassword?.newPassword.length ? yup.string() : yup.string().required( 'Password is Required!!' ),
    confirmPassword: userPassword?.confirmPassword.length ? yup.string() : yup.string().required( 'Confirm Password is Required!!' )
  } );
  const { errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );

  console.log( errors );
  const handleInputOnChange = ( e ) => {
    const { name, value } = e.target;
    setUserPassword( {
      ...userPassword,
      [name]: value
    } );
  };
  // const urlParams = new URLSearchParams( window.location.search );
  // const token = urlParams.get( 'token' ).replace( / /g, '+' );

  const onSubmit = () => {
    const userId = getIdFromUrl();
    const urlParams = new URLSearchParams( window.location.search );
    const token = urlParams.get( 'token' ).replace( / /g, '+' );
    const apiEndPoint = `${userManagementApi.auth}/authenticatedUser/${userId}/resetPassword?${convertQueryString( token )}`;
    baseAxios.post( apiEndPoint, userPassword ).then( response => {
      if ( response.status === status.success ) {
        notify( 'success', 'Your newPassword has been set , you are an authenticated user now!' );
        push( '/login' );
      } else {
        notify( 'warning', 'Something gonna wrong!! Contact the support team.' );
      }
    } ).catch( ( { response } ) => {
      console.log( response );
      if ( response.status === status.severError ) {
        notify( 'error', `Please contact the support team!!!` );
      } else if ( response.status === status.conflict ) {
        // console.log( response?.data?.detail );
        notify( 'warning', `${response?.data?.detail}` );
      } else {
        notify( 'error', 'Password Reset Failed' );
      }
    } );
  };
  return (
    <div className='auth-wrapper auth-v1 px-2'>
      <div className='auth-inner py-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>

              <img src={themeConfig.app.appLogoImage} width={35} alt='logo' />

            </Link>
            <CardTitle tag='h4' className='mb-1'>
              Reset Password 🔒
            </CardTitle>

            <div className='auth-reset-newPassword-form mt-2'>
              <FormGroup>
                <Label className='form-label' for='new-newPassword'>
                  New Password
                </Label>
                <InputPassword
                  className='input-group-merge'
                  id='new-newPassword'
                  name="newPassword"
                  value={userPassword?.newPassword}
                  invalid={( errors.newPassword && !userPassword?.newPassword?.length ) && true}
                  autoFocus
                  onChange={( e ) => { handleInputOnChange( e ); }}
                />
                {errors && errors.newPassword && (
                  <FormFeedback>{errors.newPassword.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label className='form-label' for='confirm-newPassword'>
                  Confirm Password
                </Label>
                <InputPassword
                  className='input-group-merge'
                  id='confirm-newPassword'
                  name="confirmPassword"
                  value={userPassword?.confirmPassword}
                  invalid={( errors.confirmPassword && !userPassword?.confirmPassword?.length ) && true}

                  onChange={( e ) => { handleInputOnChange( e ); }}
                />
                {errors && errors.confirmPassword && (
                  <FormFeedback>{errors.confirmPassword.message}</FormFeedback>
                )}
              </FormGroup>
              <Button.Ripple
                color='primary'
                block
                onClick={handleSubmit( onSubmit )}
              >
                Confirm
              </Button.Ripple>
            </div>
            <p className='text-center mt-2'>
              <Link to='/login'>
                <ChevronLeft className='mr-25' size={14} />
                <span className='align-middle'>Back to login</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;

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
import { getIdFromUrl } from '../../utility/Utils';

const UserConfirmation = () => {
  const { push } = useHistory();

  const [userConfirmation, setUserConfirmation] = useState( {
    password: "",
    confirmPassword: ""
  } );

  const SignupSchema = yup.object().shape( {
    password: userConfirmation?.password.length ? yup.string() : yup.string().required( 'Password is Required!!' ),
    confirmPassword: userConfirmation?.confirmPassword.length ? yup.string() : yup.string().required( 'Confirm Password is Required!!' )
  } );
  const { errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );

  console.log( errors );
  const handleInputOnChange = ( e ) => {
    const { name, value } = e.target;
    setUserConfirmation( {
      ...userConfirmation,
      [name]: value
    } );
  };
  const onSubmit = () => {
    const userId = getIdFromUrl();
    const apiEndPoint = `${userManagementApi.root}/UserRegistrations/${userId}/confirm`;
    baseAxios.patch( apiEndPoint, userConfirmation ).then( response => {
      if ( response.status === status.success ) {
        notify( 'success', 'Your password has been set , you are an authenticated user now!' );
        push( '/login' );
      } else {
        notify( 'warning', 'Something gonna wrong!! Contact the support team.' );
      }
    } ).catch( ( { response } ) => {
      console.log( response );
      if ( response.status === status.severError ) {
        notify( 'error', `Please contact the support team!!!` );
      } else {
        notify( 'error', 'User already Confirm' );
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
              Set New Password 🔒
            </CardTitle>
            <div className='auth-reset-password-form mt-2'>
              <FormGroup>
                <Label className='form-label' for='new-password'>
                  New Password
                </Label>
                <InputPassword
                  className='input-group-merge'
                  id='new-password'
                  name="password"
                  value={userConfirmation?.password}
                  invalid={( errors.password && !userConfirmation?.password?.length ) && true}
                  autoFocus
                  onChange={( e ) => { handleInputOnChange( e ); }}
                />
                {errors && errors.password && (
                  <FormFeedback>{errors.password.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <Label className='form-label' for='confirm-password'>
                  Confirm Password
                </Label>
                <InputPassword
                  className='input-group-merge'
                  id='confirm-password'
                  name="confirmPassword"
                  value={userConfirmation?.confirmPassword}
                  invalid={( errors.confirmPassword && !userConfirmation?.confirmPassword?.length ) && true}

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

export default UserConfirmation;

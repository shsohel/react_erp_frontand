/* eslint-disable space-in-parens */

// ** Reactstrap Imports
import classnames from 'classnames';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormFeedback, FormGroup, Row } from 'reactstrap';

// ** Third Party Components
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogout } from '../../../redux/actions/auth';
import { baseAxios } from '../../../services';
import { userManagementApi } from '../../../services/api-end-points/user-management';
import { notify } from '../../../utility/custom/notifications';
import { status } from '../../../utility/enums';

// ** Demo Components

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
};
const SecurityTabContent = () => {
  const dispatch = useDispatch();
  const { authenticateUser } = useSelector( ( { auth } ) => auth );

  const passwordValidatedSting = /^.*(?=.{6,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
  const validationMessage = "Password must contain at least 6 characters, one uppercase, one number and one special case character";


  const SignupSchema = yup.object().shape( {
    currentPassword: yup.string().required( 'Current Password is required' ),
    newPassword: yup.string().required( 'New Password is required' )
      .matches( /^\S*$/, 'Whitespace is not allowed' )
      .min( 6, 'Password min Length 6 Character' )
      .matches(
        passwordValidatedSting,
        validationMessage
      ),
    confirmPassword: yup
      .string()
      .required( 'Confirm Password is required' )
      .matches( /^\S*$/, 'Whitespace is not allowed' )
      .min( 6, 'Password min Length 6 Character' )
      .matches(
        passwordValidatedSting,
        validationMessage
      )
      .oneOf( [yup.ref( `newPassword` ), null], 'Passwords must match with new password' )
  } );

  const { register, errors, handleSubmit, trigger, reset } = useForm( {
    resolver: yupResolver( SignupSchema )
  } );
  console.log( errors );

  const onSubmit = ( data ) => {
    trigger();
    const apiEndPoint = `${userManagementApi.user.root}/${authenticateUser?.id}/setNewPassword`;
    baseAxios.post( apiEndPoint, data ).then( response => {
      if ( response.status === status.success ) {
        //
        notify( 'success', `Password has been reset successfully !!!` );
        reset( defaultValues );
        dispatch( handleLogout() );

      }
    } ).catch( ( { response } ) => {
      console.log( response );
      if ( response?.status === status?.severError || response === undefined ) {
        notify( 'error', `Please contact the support team!!!` );
      } else {
        notify( 'errors', response?.data.errors );
      }
    } );
    console.log( data );


  };

  return (

    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Change Password</CardTitle>
        </CardHeader>
        <CardBody className='pt-1'>
          <Form onSubmit={handleSubmit( onSubmit )}>
            <Row>
              <Col sm='6'>
                <FormGroup>
                  <InputPasswordToggle
                    bsSize="sm"
                    label='Current Password'
                    htmlFor='currentPassword'
                    name='currentPassword'
                    placeholder=" "
                    innerRef={register( { required: true } )}
                    className={classnames( 'input-group-merge', {
                      'is-invalid': errors['currentPassword']
                    } )}
                  />
                  {errors.currentPassword && (
                    <FormFeedback className='d-block'>{errors.currentPassword.message}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm='6'>
                <FormGroup>
                  <InputPasswordToggle
                    bsSize="sm"
                    label='New Password'
                    htmlFor='newPassword'
                    name='newPassword'
                    placeholder=" "
                    innerRef={register( { required: true } )}
                    className={classnames( 'input-group-merge', {
                      'is-invalid': errors['newPassword']
                    } )}
                  />
                  {errors.newPassword && (
                    <FormFeedback className='d-block'>{errors.newPassword.message}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col sm='6'>
                <FormGroup>
                  <InputPasswordToggle
                    bsSize="sm"
                    label='Confirm Password'
                    htmlFor='confirmPassword'
                    name='confirmPassword'
                    placeholder=" "
                    innerRef={register( { required: true } )}
                    className={classnames( 'input-group-merge', {
                      'is-invalid': errors['confirmPassword']
                    } )}

                  />
                  {errors.confirmPassword && (
                    <FormFeedback className='d-block'>{errors.confirmPassword.message}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col xs={12}>
                <p className='fw-bolder'>Password requirements:</p>
                <ul className='ps-1 ms-25'>
                  <li className='mb-50'>Minimum 6 characters long - the more, the better</li>
                  <li className='mb-50'>At least one lowercase character and one uppercase </li>
                  <li className='mb-50'>At least one number, symbol</li>
                  <li>Whitespace not allow</li>
                </ul>
              </Col>
              <Col className='mt-1' sm='12'>
                <Button.Ripple
                  type='submit'
                  className='mr-1'
                  color='primary'
                  size="sm"

                >
                  Save changes
                </Button.Ripple>

              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>

    </Fragment>
  );
};

export default SecurityTabContent;

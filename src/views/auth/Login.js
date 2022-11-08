import InputPasswordToggle from '@components/input-password-toggle';
import Loader from '@components/spinner/Fallback-spinner';
import themeConfig from '@configs/themeConfig';
import '@styles/base/pages/page-auth.scss';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Button, Card, CardBody, CardTitle, Form, FormGroup, Input, Label } from 'reactstrap';
import { handleLogin } from "../../redux/actions/auth";

const Login = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { isUserLoggedIn } = useSelector( ( { auth } ) => auth );
  const { register, errors, handleSubmit } = useForm();

  const [user, setUser] = useState( {
    userName: '',
    password: ''
  } );

  const onSubmit = () => {
    console.log( user );
    dispatch( handleLogin( user, push ) );
  };

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    setUser( {
      ...user,
      [name]: value
    } );
  };

  return (
    <div className='auth-wrapper auth-v1 px-2'>
      <div hidden={isUserLoggedIn}>
        <Loader />

      </div>
      <div className='auth-inner py-2 ' hidden={!isUserLoggedIn}>
        <Card className='mb-0'>
          <CardBody>
            <CardTitle tag='h4' className='mt-1'>
              <div className="d-flex justify-content-between">
                <Label className=" h3 font-weight-bolder" >
                  Login
                </Label>
                <img src={themeConfig.app.appLogoImage} width={35} alt='logo' />
              </div>
            </CardTitle>

            <Form className='auth-login-form mt-2' onSubmit={handleSubmit( onSubmit )}>
              <FormGroup>
                <Label className="form-label font-weight-bolder" >
                  User Name
                </Label>
                <Input
                  tabIndex="1"
                  type='text'
                  bsSize="sm"
                  name='userName'
                  placeholder='User Name'
                  // innerRef={register( { required: true } )}
                  // className={classNames( { 'is-invalid': errors['email'] } )}
                  value={user.userName}
                  autoFocus
                  onChange={( e ) => { handleOnChange( e ); }}
                />
              </FormGroup>
              <FormGroup>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label font-weight-bolder' for='login-password'>
                    Password
                  </Label>
                  <Link to='/forgot-password'>
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <InputPasswordToggle
                  className="input-group-merge "
                  bsSize="sm"
                  tabIndex="2"
                  placeholder='Password'

                  //  inputClassName={classNames( { 'is-invalid': errors['password'] } )}
                  name="password"
                  // innerRef={register( { required: true } )}
                  //   className={classNames( { 'is-invalid': errors['password'] } )}
                  value={user.password}
                  onChange={( e ) => { handleOnChange( e ); }}

                />
              </FormGroup>
              {/* <FormGroup>
                <CustomInput type='checkbox' className='custom-control-Primary' id='remember-me' label='Remember Me' />
              </FormGroup> */}
              <Button.Ripple
                tabIndex="3"

                color="primary"
                type="submit"
                size="sm"
                block
              // onClick={() => onSubmit()}
              // onClick={() => onSubmit()}
              >
                Sign in
              </Button.Ripple>
            </Form>

          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Login;

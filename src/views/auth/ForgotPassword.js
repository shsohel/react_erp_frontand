import themeConfig from '@configs/themeConfig';
import '@styles/base/pages/page-auth.scss';
import { useState } from 'react';
import { ChevronLeft } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardText, CardTitle, Form, FormGroup, Input, Label } from 'reactstrap';
import { handleForgotPassword } from '../../redux/actions/auth';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const [userName, setUserName] = useState( '' );
    const { register, errors, handleSubmit } = useForm();

    const onSubmit = () => {
        console.log( userName );
        dispatch( handleForgotPassword( userName ) );
    };
    const handleOnChange = ( e ) => {
        const { value } = e.target;
        setUserName( value );
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
                            Forgot Password? 🔒
                        </CardTitle>
                        <CardText className='mb-2'>
                            Enter your User Name and we will send you instructions to reset your password
                        </CardText>
                        <Form className='auth-forgot-password-form mt-2' onSubmit={handleSubmit( onSubmit )}>
                            <FormGroup>
                                <Label className='form-label font-weight-bolder' for='login-email'>
                                    User Name
                                </Label>
                                <Input
                                    type='text'
                                    id='login-email'
                                    bsSize="sm"
                                    placeholder='shsohel'
                                    value={userName}
                                    onChange={( e ) => { handleOnChange( e ); }}
                                    autoFocus
                                />
                            </FormGroup>
                            <Button.Ripple
                                color='primary'
                                block
                                type="submit"
                                size="sm"
                            >
                                Send reset link
                            </Button.Ripple>
                        </Form>
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

export default ForgotPassword;

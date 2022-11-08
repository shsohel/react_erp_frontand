import Sidebar from '@components/sidebar';
import { isObjEmpty } from '@utils';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import InputGroup from 'reactstrap/lib/InputGroup';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import { bindColorData } from '../store/actions';


const ColorInstantCreateForm = ( { open, toggleSidebar, handleCreateColorSubmit } ) => {
    const dispatch = useDispatch();
    const { color } = useSelector( ( { colors } ) => colors );

    const handleDataOnChange = ( e ) => {
        const { name, type, value } = e.target;
        const updatedObj = {
            ...color,
            [name]: value
        };
        dispatch( bindColorData( updatedObj ) );
    };


    const { register, errors, handleSubmit } = useForm();
    const onSubmit = () => {
        if ( isObjEmpty( errors ) ) {
            const submittedObj = {
                name: color.name,
                hexCode: color.hexCode
            };
            handleCreateColorSubmit( submittedObj );

        }
    };

    const handleCancel = () => {
        toggleSidebar();
    };
    return (
        <Sidebar
            size='lg'
            open={open}
            title='New Style Color '
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
        >
            <Form onSubmit={handleSubmit( onSubmit )}>

                <FormGroup>
                    <Label for='name'>
                        Color Name <span className='text-danger'>*</span>
                    </Label>
                    <Input
                        name='name'
                        id='name'
                        type='text'
                        bsSize="sm"
                        placeholder='Green'
                        innerRef={register( { required: true } )}
                        invalid={errors.name && true}
                        className={classnames( { 'is-invalid': errors['name'] } )}
                        value={color.name}
                        onChange={( e ) => { handleDataOnChange( e ); }}
                    />
                    {errors && errors.name && <FormFeedback>Name is required!</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for='hexCode'>
                        Color Code
                    </Label>

                    <InputGroup>
                        <InputGroupAddon addonType='prepend' style={{
                            padding: '2.5px 5px',
                            border: '1px solid #0000002e',
                            borderRadius: '5px 0 0 5px'
                        }} >
                            <span className="color-pick" style={{ backgroundColor: color.hexCode }}>
                                <input className="color-input"
                                    id='colorId'
                                    name='hexCode'
                                    type='color'
                                    value={color.hexCode}
                                    onChange={( e ) => { handleDataOnChange( e ); }}
                                />
                            </span>


                        </InputGroupAddon>
                        <Input type='text'
                            id='colorId'
                            name='hexCode'
                            bsSize="sm"
                            placeholder='#008000'
                            innerRef={register( { required: true } )}
                            invalid={errors.hexCode && true}
                            className={classnames( { 'is-invalid': errors['hexCode'] } )}
                            value={color.hexCode.toUpperCase()}
                            onChange={( e ) => { handleDataOnChange( e ); }}
                        />
                        {errors && errors.hexCode && <FormFeedback>Name is required!</FormFeedback>}
                    </InputGroup>

                </FormGroup>

                <Button.Ripple type='submit' size="sm" className='mr-1' color='primary'>
                    Submit
                </Button.Ripple>
                <Button.Ripple type='reset' className='mr-1' color='danger' size="sm" outline onClick={() => { handleCancel(); }}>
                    Cancel
                </Button.Ripple>

            </Form>

        </Sidebar >
    );
};

export default ColorInstantCreateForm;

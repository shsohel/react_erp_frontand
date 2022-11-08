import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import InputGroup from 'reactstrap/lib/InputGroup';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import * as yup from 'yup';
import { bindColorData, updateColor } from '../store/actions';

const ColorEditForm = ( { open, toggleSidebarForEdit, data } ) => {
    const dispatch = useDispatch();
    const { color, isColorDataSubmitProgress } = useSelector( ( { colors } ) => colors );
    const validationSchema = yup.object().shape( {
        name: color.name.length ? yup.string() : yup.string().required( 'Name is required!' )

    } );

    const { errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );
    const handleDataOnChange = ( e ) => {
        const { name, type, value } = e.target;
        const updatedObj = {
            ...color,
            [name]: value
        };
        dispatch( bindColorData( updatedObj ) );
    };

    // ** Function to handle form submit
    const onSubmit = () => {
        dispatch(
            updateColor( {
                id: color.id,
                name: color.name,
                hexCode: color.hexCode
            } )
        );
    };

    const handleCancel = () => {
        toggleSidebarForEdit();
        dispatch( bindColorData( null ) );
    };
    return (
        <Sidebar
            size='lg'
            open={open}
            title='Edit Style Color '
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebarForEdit}
        >
            <>
                <UILoader blocking={isColorDataSubmitProgress} loader={<ComponentSpinner />} >

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
                            invalid={( errors.name && !color.name?.length ) && true}
                            value={color.name}
                            onChange={( e ) => { handleDataOnChange( e ); }}
                        />
                        {errors && errors.name && <FormFeedback>Name is required!</FormFeedback>}

                    </FormGroup>
                    <FormGroup>
                        <Label for='hexCode'>
                            Color Code <span className='text-danger'>*</span>
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
                                invalid={errors.hexCode && true}
                                className={classnames( { 'is-invalid': errors['hexCode'] } )}
                                value={color.hexCode.toUpperCase()}
                                onChange={( e ) => { handleDataOnChange( e ); }}
                            />
                            {errors && errors.hexCode && <FormFeedback>Name is required!</FormFeedback>}
                        </InputGroup>
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
                    <Button.Ripple
                        type='reset'
                        className='mr-1'
                        size="sm" color='danger'
                        outline
                        onClick={() => { handleCancel(); }}
                    >
                        Cancel
                    </Button.Ripple>
                </UILoader>
            </>

        </Sidebar>
    );
};

export default ColorEditForm;

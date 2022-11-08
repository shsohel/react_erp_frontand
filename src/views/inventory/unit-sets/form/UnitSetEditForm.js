

import Sidebar from '@components/sidebar';
import { isObjEmpty } from '@utils';
import classnames from 'classnames';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { getUnitSetById, updateUnitSet } from '../store/actions';

const UnitSetEditForm = ( { open, toggleSidebar, data } ) => {
    const dispatch = useDispatch();
    const { register, errors, handleSubmit } = useForm();
    const onSubmit = ( values ) => {
        if ( isObjEmpty( errors ) ) {
            const submittedObj = {
                name: values.name,
                description: values.description
            };
            dispatch( updateUnitSet( submittedObj, data.id ) );
        }
    };

    const handleCancel = () => {
        toggleSidebar();
        dispatch( getUnitSetById( null ) );
    };

    return (
        <Sidebar

            size='lg'
            open={open}
            title='Edit Unit Sets'
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}

        >
            <Form onSubmit={handleSubmit( onSubmit )}>

                <FormGroup>
                    <Label for='name'>
                        Name <span className='text-danger'>*</span>
                    </Label>
                    <Input
                        name='name'
                        id='name'
                        bsSize="sm"
                        placeholder='XL'
                        defaultValue={data.name}
                        innerRef={register( { required: true } )}
                        invalid={errors.name && true}
                        className={classnames( { 'is-invalid': errors['name'] } )}
                    />
                    {errors && errors.name && <FormFeedback>Name is required!</FormFeedback>}

                </FormGroup>

                <FormGroup>
                    <Label for='shortCode'>
                        Short Code <span className='text-danger'>*</span>
                    </Label>
                    <Input
                        name='description'
                        id='description'
                        bsSize="sm"
                        placeholder='XL'
                        defaultValue={data.description}
                        innerRef={register( { required: true } )}
                        invalid={errors.description && true}
                        className={classnames( { 'is-invalid': errors['description'] } )}
                    />
                    {errors && errors.description && <FormFeedback>Short Code is required!</FormFeedback>}

                </FormGroup>

                <Button.Ripple type='submit' size="sm" className='mr-1' color='primary'>
                    Submit
                </Button.Ripple>

                <Button size="sm" className='mr-1' color='danger' outline onClick={() => { handleCancel(); }}>
                    Cancel
                </Button>


            </Form>

        </Sidebar>
    );
};

export default UnitSetEditForm;

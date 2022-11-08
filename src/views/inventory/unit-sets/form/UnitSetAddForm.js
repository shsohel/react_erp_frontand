import Sidebar from '@components/sidebar';
import { isObjEmpty } from '@utils';
import classnames from 'classnames';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { addUnitSet } from '../store/actions';

const UnitSetAddForm = ( { open, toggleSidebar } ) => {
    const dispatch = useDispatch();
    const { register, errors, handleSubmit } = useForm();
    const onSubmit = values => {
        if ( isObjEmpty( errors ) ) {
            dispatch(
                addUnitSet( {
                    name: values.name,
                    description: values.description,
                    details: []
                } )
            );

        }
    };


    const handleCancel = () => {
        toggleSidebar();
    };

    return (
        <Sidebar
            size='lg'
            open={open}
            title='New Unit Sets'
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
                        placeholder='PCS'
                        bsSize="sm"
                        innerRef={register( { required: true } )}
                        invalid={errors.name && true}
                        className={classnames( { 'is-invalid': errors['name'] } )}
                    />
                    {errors && errors.name && <FormFeedback>Name is required!</FormFeedback>}

                </FormGroup>

                <FormGroup>
                    <Label for='description'>
                        Descriptions<span className='text-danger'>*</span>
                    </Label>
                    <Input
                        name='description'
                        id='description'
                        bsSize="sm"
                        placeholder='Descriptions '
                        innerRef={register( { required: false } )}
                        invalid={errors.shortCode && true}
                        className={classnames( { 'is-invalid': errors['description'] } )}
                    />
                    {errors && errors.description && <FormFeedback>Description is required!</FormFeedback>}

                </FormGroup>

                <Button.Ripple size="sm" type='submit' className='mr-1' color='primary'>
                    Submit
                </Button.Ripple>

                <Button size="sm" type='reset' className='mr-1' color='danger' outline onClick={() => { handleCancel(); }}>
                    Cancel
                </Button>


            </Form>

        </Sidebar>
    );
};

export default UnitSetAddForm;

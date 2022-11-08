import Sidebar from '@components/sidebar';
import { isObjEmpty } from '@utils';
import classnames from 'classnames';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { getAllStatusTypes, selectedStatusNull, updateStatus } from '../store/actions';

const StatusEditForm = ( { open, toggleSidebarForEdit, data } ) => {
    // ** Store Vars
    const dispatch = useDispatch();
    const { statusTypes } = useSelector( ( { statuses } ) => statuses );
    //** State */

    //Hook

    useEffect( () => {
        dispatch(
            getAllStatusTypes()
        );
    }, [] );
    const { register, errors, handleSubmit } = useForm();
    // ** Function to handle form submit
    const onSubmit = ( values ) => {
        if ( isObjEmpty( errors ) ) {
            dispatch(
                updateStatus( {
                    id: data.id,
                    name: values.name,
                    statusFor: values.statusFor,
                    isActive: values.isActive
                } )
            );
        }

    };

    const handleCancel = () => {
        toggleSidebarForEdit();
        dispatch( selectedStatusNull() );
    };
    return (
        <Sidebar

            size='lg'
            open={open}
            title='Edit Status '
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebarForEdit}

        >
            <Form onSubmit={handleSubmit( onSubmit )}>

                <FormGroup>
                    <Label for='name'>
                        Name <span className='text-danger'>*</span>
                    </Label>
                    <Input
                        name='name'
                        bsSize="sm"
                        id='name'
                        placeholder='Approved'
                        defaultValue={data.name}

                        innerRef={register( { required: true } )}
                        invalid={errors.name && true}
                        className={classnames( { 'is-invalid': errors['name'] } )}
                    />
                    {errors && errors.name && <FormFeedback>Name is required!</FormFeedback>}

                </FormGroup>

                <FormGroup>
                    <Label for='statusFor'>
                        Status For
                    </Label>
                    <Input
                        name='statusFor'
                        type="select"
                        bsSize="sm"
                        id='statusFor'
                        defaultValue={data.statusFor}
                        innerRef={register( { required: true } )}
                        invalid={errors.statusFor && true}
                        className={classnames( { 'is-invalid': errors['statusFor'] } )}

                    >
                        {
                            statusTypes.map( ( item, index ) => (
                                <option key={index} value={item}>{item}</option>
                            ) )
                        }
                    </Input>
                    {errors && errors.statusFor && <FormFeedback>Status For is required!</FormFeedback>}

                </FormGroup>
                {/* <FormGroup>
                    <Label for='statusFor'>
                        Status For <span className='text-danger'>*</span>
                    </Label>
                    <Input
                        type='statusFor'
                        name='statusFor'
                        id='statusFor'
                        placeholder='Write statusFor'
                        defaultValue={data.statusFor}

                        innerRef={register( { required: true } )}
                        invalid={errors.statusFor && true}
                        className={classnames( { 'is-invalid': errors['statusFor'] } )}
                    />

                    {errors && errors.statusFor && <FormFeedback>Status For is required!</FormFeedback>}
                </FormGroup> */}


                <FormGroup check className="mt-1 mb-1">
                    <Input
                        name="isActive"
                        type="checkbox"
                        id="acceptId"
                        defaultChecked={data.isActive}
                        innerRef={register( { required: false } )}
                    />
                    <span> IsActive</span>

                </FormGroup>

                <Button.Ripple type='submit' size="sm" className='mr-1' color='primary'>

                    Submit
                </Button.Ripple>

                <Button type='reset' className='mr-1' size="sm" color='danger' outline onClick={() => { handleCancel(); }}>

                    Cancel
                </Button>
            </Form>

        </Sidebar >
    );
};

export default StatusEditForm;

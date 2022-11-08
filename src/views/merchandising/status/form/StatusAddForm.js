import Sidebar from '@components/sidebar';
import { isObjEmpty } from '@utils';
import classnames from 'classnames';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { addStatus, getAllStatusTypes } from '../store/actions';

const StatusAddForm = ( { open, toggleSidebar } ) => {
    const dispatch = useDispatch();
    const { statusTypes } = useSelector( ( { statuses } ) => statuses );


    useEffect( () => {
        dispatch( getAllStatusTypes() );
    }, [] );

    // ** Vars React HOOK Form
    const { register, errors, handleSubmit } = useForm();
    // ** Function to handle form submit
    const onSubmit = values => {
        if ( isObjEmpty( errors ) ) {
            dispatch(
                addStatus( {
                    name: values.name,
                    statusFor: values.statusFor,
                    isActive: values.isActive
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
            title='New Status '
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
                        placeholder='Approved'
                        innerRef={register( { required: true } )}
                        invalid={errors.name && true}
                        className={classnames( { 'is-invalid': errors['name'] } )}
                    />
                    {errors && errors.name && <FormFeedback>Name is required!</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="statusFor">Status For</Label>
                    <Input
                        name="statusFor"
                        type="select"
                        bsSize="sm"
                        id="statusFor"
                        innerRef={register( { required: true } )}
                        invalid={errors.statusFor && true}
                        className={classnames( { "is-invalid": errors["statusFor"] } )}
                    >
                        {statusTypes?.map( ( item, index ) => (
                            <option key={index} value={item}>
                                {item?.replace( /([a-z0-9])([A-Z])/g, '$1 $2' )}
                            </option>
                        ) )}
                    </Input>
                    {errors && errors.statusFor && (
                        <FormFeedback>Status For is required!</FormFeedback>
                    )}
                </FormGroup>

                <FormGroup >
                    <FormGroup check className="mt-1">
                        <Input
                            name="isActive"
                            type="checkbox"
                            id="acceptId"
                            defaultChecked={true}
                            innerRef={register( { required: false } )}

                        />
                        <span> IsActive</span>
                    </FormGroup>

                </FormGroup>
                <Button.Ripple type='submit' size="sm" className='mr-1' color='primary'>
                    Submit
                </Button.Ripple>

                <Button type='reset' className='mr-1' size="sm" color='danger' outline onClick={() => { handleCancel(); }}>
                    Cancel
                </Button>
            </Form>

        </Sidebar>
    );
};

export default StatusAddForm;

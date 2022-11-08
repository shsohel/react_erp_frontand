
import Sidebar from '@components/sidebar';
import { isObjEmpty } from '@utils';
import classnames from 'classnames';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { addCostingGroup } from '../store/actions';
const CostingGroupAddForm = ( { open, toggleSidebar } ) => {
    const dispatch = useDispatch();


    // ** Vars React HOOK Form
    const { register, errors, handleSubmit } = useForm();
    // ** Function to handle form submit
    const onSubmit = values => {
        console.log( isObjEmpty( errors ) );
        if ( isObjEmpty( errors ) ) {
            const submitObj = {
                name: values.name,
                description: values.description,
                isCalculateInPercentage: values.isCalculateInPercentage
            };
            console.log( JSON.stringify( submitObj, null, 2 ) );
            dispatch(
                addCostingGroup( submitObj )
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
            title='New Costing Group '
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
                        placeholder='Profit'
                        bsSize="sm"
                        innerRef={register( { required: true } )}
                        invalid={errors.name && true}
                        className={classnames( { 'is-invalid': errors['name'] } )}
                    />
                    {errors && errors.name && <FormFeedback>Name is required!</FormFeedback>}

                </FormGroup>
                <FormGroup>
                    <Label for='description'>
                        Description
                    </Label>
                    <Input
                        type='description'
                        name='description'
                        bsSize="sm"
                        id='description'
                        placeholder='Write Description'
                        innerRef={register( { required: false } )}
                        invalid={errors.description && true}
                        className={classnames( { 'is-invalid': errors['description'] } )}
                    />
                    {errors && errors.description && <FormFeedback>Description is required!</FormFeedback>}
                </FormGroup>

                <FormGroup >
                    <FormGroup check className="mt-1">
                        <Input
                            name="isCalculateInPercentage"
                            type="checkbox"
                            id="isCalculateInPercentageId"
                            innerRef={register( { required: false } )}

                        />
                        <span> is Calculate In Percentage?</span>
                    </FormGroup>

                </FormGroup>

                <Button.Ripple type='submit' size="sm" className='mr-1' color='primary'>
                    Submit
                </Button.Ripple>
                <Button type='reset' size="sm" className='mr-1' color='danger' outline onClick={() => { handleCancel(); }}>
                    Cancel
                </Button>
            </Form>

        </Sidebar>
    );
};

export default CostingGroupAddForm;

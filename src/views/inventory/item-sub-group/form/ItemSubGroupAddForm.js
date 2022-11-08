import Sidebar from '@components/sidebar';
import { isObjEmpty } from '@utils';
import classnames from 'classnames';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { addItemSubGroup } from '../store/actions';

const ItemSubGroupAddForm = ( { open, toggleSidebar } ) => {
    const dispatch = useDispatch();

    // ** Vars React HOOK Form
    const { register, errors, handleSubmit } = useForm();
    // ** Function to handle form submit
    const onSubmit = values => {
        if ( isObjEmpty( errors ) ) {
            toggleSidebar();
            dispatch(
                addItemSubGroup( {
                    itemSubGroupName: values.itemSubGroupName,
                    description: values.description
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
            title='New Item Sub Group '
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}

        >
            <Form onSubmit={handleSubmit( onSubmit )}>

                <FormGroup>
                    <Label for='itemSubGroupName'>
                        Name <span className='text-danger'>*</span>
                    </Label>
                    <Input
                        name='itemSubGroupName'
                        id='itemSubGroupName'
                        placeholder='Cotton Fabric'
                        innerRef={register( { required: true } )}
                        invalid={errors.itemSubGroupName && true}
                        className={classnames( { 'is-invalid': errors['itemSubGroupName'] } )}
                    />
                    {errors && errors.itemSubGroupName && <FormFeedback>Name is required!</FormFeedback>}

                </FormGroup>
                <FormGroup>
                    <Label for='description'>
                        Description <span className='text-danger'>*</span>
                    </Label>
                    <Input
                        type='description'
                        name='description'
                        id='description'
                        placeholder=' Description'
                        innerRef={register( { required: true } )}
                        invalid={errors.description && true}
                        className={classnames( { 'is-invalid': errors['description'] } )}
                    />

                    {errors && errors.description && <FormFeedback>Description is required!</FormFeedback>}
                </FormGroup>

                <Button.Ripple type='submit' className='mr-1' color='primary'>

                    Submit
                </Button.Ripple>

                <Button type='reset' className='mr-1' outline color='secondary' >

                    Reset
                </Button>
                <Button type='reset' className='mr-1' color='danger' outline onClick={() => { handleCancel(); }}>

                    Cancel
                </Button>


            </Form>

        </Sidebar>
    );
};

export default ItemSubGroupAddForm;

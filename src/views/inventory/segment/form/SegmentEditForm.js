import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { isObjEmpty } from '@utils';
import classnames from 'classnames';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { getSegmentById, updateSegment } from '../store/actions';
const SegmentEditForm = ( { open, toggleSidebar, data } ) => {
    const dispatch = useDispatch();
    const { isSegmentDataSubmitProgress } = useSelector( ( { segments } ) => segments );

    const { register, errors, handleSubmit } = useForm();

    const onSubmit = values => {
        if ( isObjEmpty( errors ) ) {
            // toggleSidebar();
            dispatch(
                updateSegment( {
                    id: data.id,
                    name: values.name,
                    description: values.description
                } )
            );
        }
    };


    const handleCancel = () => {
        toggleSidebar();
        dispatch( getSegmentById( null ) );
    };
    return (
        <Sidebar

            size='lg'
            open={open}
            title='Edit Segment '
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}

        >
            <UILoader blocking={isSegmentDataSubmitProgress} loader={<ComponentSpinner />} >

                <Form onSubmit={handleSubmit( onSubmit )}>

                    <FormGroup>
                        <Label for='name'>
                            Name <span className='text-danger'>*</span>
                        </Label>
                        <Input
                            name='name'
                            id='name'
                            bsSize="sm"
                            defaultValue={data?.name}
                            placeholder='Cotton Fabric'
                            innerRef={register( { required: true } )}
                            invalid={errors.name && true}
                            className={classnames( { 'is-invalid': errors['name'] } )}
                        />
                        {errors && errors.name && <FormFeedback>Name is required!</FormFeedback>}

                    </FormGroup>
                    <FormGroup>
                        <Label for='description'>
                            Description <span className='text-danger'>*</span>
                        </Label>
                        <Input
                            type='description'
                            name='description'
                            id='description'
                            bsSize="sm"
                            defaultValue={data?.description}
                            placeholder=' Description'
                            innerRef={register( { required: true } )}
                            invalid={errors.description && true}
                            className={classnames( { 'is-invalid': errors['description'] } )}
                        />

                        {errors && errors.description && <FormFeedback>Description is required!</FormFeedback>}
                    </FormGroup>

                    <Button.Ripple
                        type='submit'
                        className='mr-1'
                        color='primary'
                        size="sm"

                    >
                        Submit
                    </Button.Ripple>
                    <Button
                        className='mr-1'
                        color='danger'
                        outline
                        onClick={() => { handleCancel(); }}
                        size="sm"
                    >

                        Cancel
                    </Button>


                </Form>
            </UILoader>
        </Sidebar>
    );
};

export default SegmentEditForm;

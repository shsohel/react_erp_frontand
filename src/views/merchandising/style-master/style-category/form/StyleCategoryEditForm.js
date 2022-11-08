import Sidebar from '@components/sidebar';
import { isObjEmpty } from '@utils';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { selectedStyleCategoryNull, updateStyleCategory } from '../store/actions';

const StyleCategoryEditForm = ( { open, toggleSidebarForEdit, data } ) => {
    const dispatch = useDispatch();
    const { register, errors, handleSubmit } = useForm();

    const onSubmit = values => {
        if ( isObjEmpty( errors ) ) {
            dispatch(
                updateStyleCategory( {
                    id: data.id,
                    name: values.name,
                    description: values.description
                } )
            );
        }

    };

    const handleCancel = () => {
        toggleSidebarForEdit();
        dispatch( selectedStyleCategoryNull() );
    };
    return (
        <Sidebar
            size='lg'
            open={open}
            title='Edit Style Category '
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
                        id='name'
                        placeholder='Boys'
                        defaultValue={data.name}
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
                        id='description'
                        bsSize="sm"
                        placeholder='Write Description'
                        defaultValue={data.description}

                        innerRef={register( { required: false } )}
                        invalid={errors.description && true}
                        className={classnames( { 'is-invalid': errors['description'] } )}
                    />
                    {errors && errors.description && <FormFeedback>Description is required!</FormFeedback>}
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

export default StyleCategoryEditForm;

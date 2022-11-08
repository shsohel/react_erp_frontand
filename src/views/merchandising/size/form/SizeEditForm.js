import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import * as yup from 'yup';
import { bindSizeData, updateSize } from '../store/actions';

const SizeEditForm = ( { open, toggleSidebarForEdit } ) => {
    const dispatch = useDispatch();
    const { size, isSizeDataSubmitProgress } = useSelector( ( { sizes } ) => sizes );

    const validationSchema = yup.object().shape( {
        name: size.name.length ? yup.string() : yup.string().required( 'Name is required!' )

    } );

    const { errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );
    const handleDataOnChange = ( e ) => {
        const { name, type, value } = e.target;
        const updatedObj = {
            ...size,
            [name]: value
        };
        dispatch( bindSizeData( updatedObj ) );
    };

    // ** Function to handle form submit
    const onSubmit = () => {
        dispatch(
            updateSize( {
                id: size.id,
                name: size.name,
                shortCode: size.shortCode
            } )
        );
    };

    const handleCancel = () => {
        toggleSidebarForEdit();
        dispatch( bindSizeData( null ) );
    };

    return (
        <Sidebar
            size='lg'
            open={open}
            title='Edit Style Size '
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebarForEdit}
        >
            <>
                <UILoader blocking={isSizeDataSubmitProgress} loader={<ComponentSpinner />} >

                    <FormGroup>
                        <Label for='name'>
                            Name <span className='text-danger'>*</span>
                        </Label>
                        <Input
                            name='name'
                            id='name'
                            bsSize="sm"
                            placeholder='XL'
                            invalid={( errors.name && !size.name?.length ) && true}
                            value={size.name}
                            onChange={( e ) => { handleDataOnChange( e ); }}
                        />
                        {errors && errors.name && <FormFeedback>Name is required!</FormFeedback>}
                    </FormGroup>

                    <FormGroup>
                        <Label for='shortCode'>
                            Short Code <span className='text-danger'>*</span>
                        </Label>
                        <Input
                            name='shortCode'
                            id='shortCode'
                            bsSize="sm"
                            placeholder='XL'
                            invalid={( errors.shortCode && !size.shortCode?.length ) && true}
                            value={size.shortCode}
                            onChange={( e ) => { handleDataOnChange( e ); }}
                        />
                        {errors && errors.shortCode && <FormFeedback>Name is required!</FormFeedback>}

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
                    <Button
                        type='reset'
                        className='mr-1'
                        size="sm" color='danger'
                        outline
                        onClick={() => { handleCancel(); }}
                    >
                        Cancel
                    </Button>
                </UILoader>
            </>

        </Sidebar>
    );
};

export default SizeEditForm;

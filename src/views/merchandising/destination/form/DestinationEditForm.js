import Sidebar from '@components/sidebar';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import * as yup from 'yup';
import { bindDestinationData, updateDestination } from '../store/actions';

const DestinationEditForm = ( { open, toggleSidebarForEdit } ) => {
    const dispatch = useDispatch();
    const { destination } = useSelector( ( { destinations } ) => destinations );

    const validationSchema = yup.object().shape( {
        name: destination.name.length ? yup.string() : yup.string().required( 'Name is required!' )

    } );

    const { errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );
    const handleDataOnChange = ( e ) => {
        const { name, type, value } = e.target;
        const updatedObj = {
            ...destination,
            [name]: value
        };
        dispatch( bindDestinationData( updatedObj ) );
    };

    // ** Function to handle form submit
    const onSubmit = () => {
        dispatch(
            updateDestination( {
                id: destination.id,
                name: destination.name,
                shortCode: destination.shortCode
            } )
        );
    };

    const handleCancel = () => {
        toggleSidebarForEdit();
        dispatch( bindDestinationData( null ) );
    };

    return (
        <Sidebar
            size='lg'
            open={open}
            title='Edit Destination'
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebarForEdit}
        >
            <>
                <FormGroup>
                    <Label for='name'>
                        Name <span className='text-danger'>*</span>
                    </Label>
                    <Input
                        name='name'
                        id='name'
                        bsSize="sm"
                        placeholder='XL'
                        invalid={( errors.name && !destination.name?.length ) && true}
                        value={destination.name}
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
                        placeholder='Destination'
                        invalid={( errors.shortCode && !destination.shortCode?.length ) && true}
                        value={destination.shortCode}
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
            </>

        </Sidebar>
    );
};

export default DestinationEditForm;

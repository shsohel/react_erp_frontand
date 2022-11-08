import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import * as yup from 'yup';
import { countries } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';
import { addDestination, bindDestinationData } from '../store/actions';

const DestinationAddForm = ( { open, toggleSidebar } ) => {
    const dispatch = useDispatch();
    const { destination, isDestinationDataSubmitProgress } = useSelector( ( { destinations } ) => destinations );

    const validationSchema = yup.object().shape( {
        country: destination?.country ? yup.string() : yup.string().required( 'Country is required!' ),
        destination: destination?.destination?.length ? yup.string() : yup.string().required( 'Name is required!' )

    } );

    const { errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );

    const handleDropdownOnChange = ( data, e ) => {
        const { action, name, option } = e;
        const updatedObj = {
            ...destination,
            [name]: data
        };
        dispatch( bindDestinationData( updatedObj ) );

    };

    const handleDataOnChange = ( e ) => {
        const { name, type, value } = e.target;
        const updatedObj = {
            ...destination,
            [name]: value
        };
        dispatch( bindDestinationData( updatedObj ) );
    };


    const onSubmit = () => {
        dispatch(
            addDestination( {
                country: destination.country?.value ?? '',
                destination: destination.destination
            } )
        );
    };
    const handleCancel = () => {
        toggleSidebar();
        dispatch( bindDestinationData( null ) );

    };


    return (
        <Sidebar
            destination='lg'
            open={open}
            title='New Destination'
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
        >
            <>
                <UILoader blocking={isDestinationDataSubmitProgress} loader={<ComponentSpinner />}  >
                    <FormGroup>
                        <Label for='countryId'>
                            Country <span className='text-danger'>*</span>
                        </Label>
                        <Select
                            id='countryId'
                            name="country"
                            menuPosition="auto"
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={countries}
                            classNamePrefix='dropdown'
                            className={classNames( `erp-dropdown-select ${( errors && errors.country && !destination.country ) && 'is-invalid'}` )}
                            value={destination.country}
                            onChange={( data, e ) => {
                                handleDropdownOnChange( data, e );
                            }}
                        />
                        {( errors && errors.consumptionUOM && !destination.country ) && <FormFeedback>{errors.country.message}</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                        <Label for='destinationId'>
                            Destination <span className='text-danger'>*</span>
                        </Label>
                        <Input
                            name='destination'
                            id='destinationId'
                            bsSize="sm"
                            placeholder='Destination'
                            invalid={( errors.destination && !destination.destination?.length ) && true}
                            value={destination.destination}
                            onChange={( e ) => { handleDataOnChange( e ); }}
                        />
                        {errors && errors.destination && <FormFeedback>Destination is required!</FormFeedback>}
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
                        size="sm"
                        color='danger'
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

export default DestinationAddForm;

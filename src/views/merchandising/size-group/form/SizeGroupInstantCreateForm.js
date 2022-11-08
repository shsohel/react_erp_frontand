import Sidebar from '@components/sidebar';
import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import classnames from 'classnames';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import SortableSelect from '../../../../utility/custom/SortableSelect';
import { status } from '../../../../utility/enums';
import { createOption, isObjEmpty, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownSizes } from '../../size/store/actions';
import { bindSizeGroupData } from '../store/actions';


const SizeGroupInstantCreateForm = ( { open, toggleSidebar, handleCreateSizeGroupSubmit } ) => {
    const dispatch = useDispatch();
    const { dropDownSizes } = useSelector( ( { sizes } ) => sizes );
    const { sizeGroup } = useSelector( ( { sizeGroups } ) => sizeGroups );

    const { register, errors, handleSubmit } = useForm();


    useEffect( () => {
        dispatch( getDropDownSizes() );
    }, [] );

    const handleDataOnChange = ( e ) => {
        const { name, type, value } = e.target;
        const updatedObj = {
            ...sizeGroup,
            [name]: value
        };
        dispatch( bindSizeGroupData( updatedObj ) );
    };

    const handleDropdownChange = ( data, e ) => {
        const { action, name, option } = e;
        const updatedObj = {
            ...sizeGroup,
            [name]: data
        };
        dispatch( bindSizeGroupData( updatedObj ) );
    };

    const handleSizeCreation = ( newValue ) => {
        baseAxios.post( `${merchandisingApi.size.root}`,
            {
                name: newValue,
                shortCode: newValue
            }
        )
            .then( res => {
                if ( res.status === status.success ) {
                    const newOption = createOption( newValue, res.data );
                    const updatedObj = {
                        ...sizeGroup,
                        sizes: [...sizeGroup?.sizes, newOption]
                    };
                    dispatch( bindSizeGroupData( updatedObj ) );
                    dispatch( getDropDownSizes() );
                    // notify( 'success', 'The Size has been added Successfully!' );
                } else {
                    notify( 'error', 'The Size  has been added Failed!' );
                }
            } );
    };

    const onSubmit = () => {
        const sizes = sizeGroup?.sizes.map( ( size, index ) => ( {
            sizeId: size?.value,
            size: size?.label,
            position: index + 1
        } ) );
        if ( isObjEmpty( errors ) ) {
            const submittedObj = {
                name: sizeGroup.name,
                sizes
            };
            handleCreateSizeGroupSubmit( submittedObj );
        }
    };

    const handleCancel = () => {
        toggleSidebar();
    };


    return (
        <Sidebar
            size='lg'
            open={open}
            title='New Style Size Group '
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
                        placeholder='XL'
                        bsSize="sm"
                        innerRef={register( { required: true } )}
                        invalid={errors.name && true}
                        className={classnames( { 'is-invalid': errors['name'] } )}
                        value={sizeGroup.name}
                        onChange={( e ) => { handleDataOnChange( e ); }}
                    />
                    {errors && errors.name && <FormFeedback>Name is required!</FormFeedback>}

                </FormGroup>

                <FormGroup>
                    <Label className="text-dark font-weight-bold" for='sizeIds'> Select Size </Label>
                    <SortableSelect
                        id='sizeIds'
                        name="sizes"
                        isMulti
                        isSearchable
                        isClearable
                        draggable
                        theme={selectThemeColors}
                        options={dropDownSizes}
                        //    isOptionSelected={!lastCreatedId}
                        classNamePrefix='dropdown'
                        className="erp-dropdown-select"
                        innerRef={register( { required: true } )}
                        onCreateOption={data => { handleSizeCreation( data ); }}
                        value={sizeGroup?.sizes}
                        onChange={( data, e ) => {
                            handleDropdownChange( data, e );
                        }}
                    />
                    {errors && errors.sizeIds && <FormFeedback>Size is required!</FormFeedback>}

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

export default SizeGroupInstantCreateForm;

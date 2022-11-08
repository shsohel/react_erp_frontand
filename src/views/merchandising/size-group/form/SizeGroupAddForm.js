import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { notify } from "@custom/notifications";
import { yupResolver } from '@hookform/resolvers/yup';
import { baseAxios } from "@services";
import classNames from 'classnames';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import * as yup from 'yup';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import SortableSelect from '../../../../utility/custom/SortableSelect';
import { status } from '../../../../utility/enums';
import { createOption, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownSizes } from '../../size/store/actions';
import { addSizeGroup, bindSizeGroupData } from '../store/actions';
const SizeGroupAddForm = ( { open, toggleSidebar } ) => {
    const dispatch = useDispatch();
    const { dropDownSizes } = useSelector( ( { sizes } ) => sizes );
    const { sizeGroup, isSizeGroupDataSubmitProgress } = useSelector( ( { sizeGroups } ) => sizeGroups );

    const validationSchema = yup.object().shape( {
        name: sizeGroup.name.length ? yup.string() : yup.string().required( 'Name is required!' ),
        sizes: sizeGroup?.sizes.length ? yup.string() : yup.string().required( 'Sizes is required!' )

    } );

    const { errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );


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
        console.log( name );
        const updatedObj = {
            ...sizeGroup,
            [name]: data.map( ( size, index ) => ( { ...size, position: index + 1 } ) )
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
                        sizes: [...sizeGroup?.sizes, { ...newOption, position: sizeGroup?.sizes.length + 1 }]
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
        const sizes = sizeGroup?.sizes.map( s => ( {
            sizeId: s.value,
            size: s.label,
            position: s.position
        } ) );
        const submittedObj = {
            name: sizeGroup.name,
            sizes
        };
        console.log( 'submittedObj', JSON.stringify( submittedObj, null, 2 ) );
        dispatch( addSizeGroup( submittedObj ) );

    };

    const handleCancel = () => {
        toggleSidebar();
        dispatch( bindSizeGroupData( null ) );
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
            <>
                <UILoader blocking={isSizeGroupDataSubmitProgress} loader={<ComponentSpinner />} >
                    <FormGroup>
                        <Label for='name'>
                            Name <span className='text-danger'>*</span>
                        </Label>
                        <Input
                            name='name'
                            id='name'
                            placeholder='XL'
                            bsSize="sm"
                            invalid={( errors.name && !sizeGroup.name?.length ) && true}
                            value={sizeGroup.name}
                            onChange={( e ) => { handleDataOnChange( e ); }}
                        />
                        {errors && errors.name && <FormFeedback>Name is required!</FormFeedback>}

                    </FormGroup>

                    <FormGroup>
                        <Label className="text-dark font-weight-bold" for='sizeIds'> Select Size </Label>

                        <SortableSelect
                            value={sizeGroup?.sizes}
                            draggable
                            name="sizes"
                            theme={selectThemeColors}
                            classNamePrefix='dropdown'
                            className={classNames( `erp-dropdown-select ${( errors && errors.sizes && !sizeGroup?.sizes.length ) && 'is-invalid'}` )}

                            options={dropDownSizes}
                            onCreateOption={data => { handleSizeCreation( data ); }}
                            onChange={( data, e ) => {
                                handleDropdownChange( data, e );
                            }}
                        />
                        {errors && errors.sizes && <FormFeedback>Size is required!</FormFeedback>}

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

export default SizeGroupAddForm;

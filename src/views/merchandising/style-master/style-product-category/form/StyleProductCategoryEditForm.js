import Sidebar from '@components/sidebar';
import { notify } from "@custom/notifications";
import { yupResolver } from '@hookform/resolvers/yup';
import { baseAxios } from "@services";
import classnames from 'classnames';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { Button, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import * as yup from 'yup';
import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import { status } from '../../../../../utility/enums';
import { createOption, selectThemeColors } from '../../../../../utility/Utils';
import { getDropDownStyleCategories } from '../../style-category/store/actions';
import { bindStyleProductCategoryData, selectedProductCategoryNull, updateProductCategory } from '../store/actions';


const StyleProductCategoryEditForm = ( { open, toggleSidebarForEdit, data } ) => {
    const dispatch = useDispatch();
    const { dropDownStyleCategories } = useSelector( ( { styleCategories } ) => styleCategories );
    const { styleProductCategory } = useSelector( ( { productCategories } ) => productCategories );

    ///For Validation Start
    const SignupSchema = yup.object().shape( {
        name: styleProductCategory?.name.length ? yup.string() : yup.string().required( 'Name is Required!!' )

    } );

    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );

    const handleDataOnChange = ( e ) => {
        const { name, type, value } = e.target;
        const updatedObj = {
            ...styleProductCategory,
            [name]: value
        };
        dispatch( bindStyleProductCategoryData( updatedObj ) );
    };

    const handleDropdownChange = ( data, e ) => {
        const { action, name, option } = e;
        const updatedObj = {
            ...styleProductCategory,
            [name]: data
        };
        dispatch( bindStyleProductCategoryData( updatedObj ) );
    };

    const handleStyleCategoryCreation = ( newValue ) => {
        baseAxios.post( `${merchandisingApi.styleCategory.root}`, { name: newValue, description: newValue } ).then( res => {
            if ( res.status === status.success ) {
                const newOption = createOption( newValue, res.data );
                const updatedObj = {
                    ...styleProductCategory,
                    styleCategories: [...styleProductCategory.styleCategories, newOption]
                };
                dispatch( bindStyleProductCategoryData( updatedObj ) );
                // dispatch( getDropDownStyleCategories() );
                // notify( 'success', 'The Style Category has been added Successfully!' );
            } else {
                notify( 'error', 'The Style Category has been added Failed!' );
            }
        } );
    };


    const onSubmit = () => {
        const styleCategoryIds = styleProductCategory.styleCategories.map( i => i.value );
        dispatch(
            updateProductCategory( {
                id: styleProductCategory.id,
                name: styleProductCategory.name,
                styleCategoryIds,
                description: styleProductCategory.description
            } )
        );
    };


    useEffect( () => {
        dispatch( getDropDownStyleCategories() );
    }, [] );
    const handleCancel = () => {
        toggleSidebarForEdit();
        dispatch( selectedProductCategoryNull() );
    };
    return (
        <Sidebar
            size='lg'
            open={open}
            title='Edit Style Product Category '
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
                        placeholder='Boys'
                        bsSize="sm"
                        invalid={( errors.name && !styleProductCategory?.name.length ) && true}
                        value={styleProductCategory?.name}
                        onChange={( e ) => { handleDataOnChange( e ); }}
                    />
                    {errors && errors.name && <FormFeedback>Name is required!</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label className="text-dark font-weight-bold" for='styleCategoryIds'> Select Style Category </Label>
                    <CreatableSelect
                        id='styleCategoryIds'
                        isMulti
                        isSearchable
                        isClearable
                        theme={selectThemeColors}
                        options={dropDownStyleCategories}
                        classNamePrefix='dropdown'
                        name="styleCategories"
                        className="erp-dropdown-select"
                        innerRef={register( { required: true } )}
                        onCreateOption={data => { handleStyleCategoryCreation( data ); }}
                        value={styleProductCategory.styleCategories}
                        onChange={( data, e ) => {
                            handleDropdownChange( data, e );
                        }}
                    />
                    {errors && errors.styleCategoryIds && <FormFeedback>Style Category is required!</FormFeedback>}
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
                        innerRef={register( { required: false } )}
                        invalid={errors.description && true}
                        className={classnames( { 'is-invalid': errors['description'] } )}
                        value={styleProductCategory?.description}
                        onChange={( e ) => { handleDataOnChange( e ); }}
                    />
                    {errors && errors.description && <FormFeedback>Description is required!</FormFeedback>}
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

export default StyleProductCategoryEditForm;

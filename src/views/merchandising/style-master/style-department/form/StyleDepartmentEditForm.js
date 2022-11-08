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
import { getDropDownProductCategories } from '../../style-product-category/store/actions';
import { bindStyleDepartmentData, selectedDepartmentNull, updateDepartment } from '../store/actions';

const StyleDepartmentEditForm = ( { open, toggleSidebarForEdit, data } ) => {
    const dispatch = useDispatch();
    const { dropDownProductCategories } = useSelector( ( { productCategories } ) => productCategories );
    const { styleDepartment } = useSelector( ( { departments } ) => departments );
    ///For Validation Start
    const SignupSchema = yup.object().shape( {
        name: styleDepartment?.name.length ? yup.string() : yup.string().required( 'Name is Required!!' )

    } );

    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );
    useEffect( () => {
        dispatch( getDropDownProductCategories() );
    }, [] );


    const onSubmit = () => {
        const productCategoryIds = styleDepartment?.productCategories.map( i => i.value );
        dispatch(
            updateDepartment( {
                id: styleDepartment.id,
                name: styleDepartment.name,
                productCategoryIds,
                description: styleDepartment.description
            } )
        );
    };


    const handleDataOnChange = ( e ) => {
        const { name, type, value } = e.target;
        const updatedObj = {
            ...styleDepartment,
            [name]: value
        };
        dispatch( bindStyleDepartmentData( updatedObj ) );
    };

    const handleDropdownChange = ( data, e ) => {
        const { action, name, option } = e;
        const updatedObj = {
            ...styleDepartment,
            [name]: data
        };
        dispatch( bindStyleDepartmentData( updatedObj ) );
    };

    const handleDepartmentCategoryCreation = ( newValue ) => {
        baseAxios.post( `${merchandisingApi.productCategory.add_product_category}`,
            {
                name: newValue,
                description: newValue,
                styleCategoryIds: []
            }
        )
            .then( res => {
                if ( res.status === status.success ) {
                    const newOption = createOption( newValue, res.data );
                    const updatedObj = {
                        ...styleDepartment,
                        productCategories: [...styleDepartment?.productCategories, newOption]
                    };
                    dispatch( bindStyleDepartmentData( updatedObj ) );
                    dispatch( getDropDownProductCategories() );
                    // notify( 'success', 'The Product Category has been added Successfully!' );
                } else {
                    notify( 'error', 'The Product Category  has been added Failed!' );
                }
            } );
    };

    const handleCancel = () => {
        toggleSidebarForEdit();
        dispatch( selectedDepartmentNull() );
    };
    return (
        <Sidebar
            size='lg'
            open={open}
            title='Edit Style Department '
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
                        placeholder='Boys'
                        value={styleDepartment.name}
                        invalid={( errors.name && !styleDepartment.name.length ) && true}
                        onChange={( e ) => { handleDataOnChange( e ); }}
                    />
                    {errors && errors.name && <FormFeedback>Name is required!</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label className="text-dark font-weight-bold" for='productCategoryIds'> Select Product Category </Label>
                    <CreatableSelect
                        id='productCategoryIds'
                        name="productCategories"
                        isMulti
                        isSearchable
                        isClearable
                        theme={selectThemeColors}
                        options={dropDownProductCategories}
                        classNamePrefix='dropdown'
                        className="erp-dropdown-select"
                        innerRef={register( { required: false } )}
                        onCreateOption={data => { handleDepartmentCategoryCreation( data ); }}
                        value={styleDepartment?.productCategories}
                        onChange={( data, e ) => {
                            handleDropdownChange( data, e );
                        }}
                    />
                    {errors && errors.productCategoryIds && <FormFeedback>Product Category is required!</FormFeedback>}

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
                        value={styleDepartment?.description}
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

export default StyleDepartmentEditForm;

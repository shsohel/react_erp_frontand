import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { isObjEmpty } from '@utils';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { selectCostingMethod } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';
import { getUnitSetsDropdown, getUomDropdownByUnitSetId } from '../../unit-sets/store/actions';
import { getDropDownCategoryGroups, selectedItemGroupNull, updateItemGroup } from '../store/actions';


const itemGroupEditForm = ( { open, toggleSidebar, data } ) => {
    const dispatch = useDispatch();
    console.log( data );
    const { dropDownCategoryGroups, isItemGroupDataSubmitProgress } = useSelector( ( { itemGroups } ) => itemGroups );
    const { dropDownUnitSet, dropdownUnitSetUom } = useSelector( ( { unitSets } ) => unitSets );
    const [costingMethod, setCostingMethod] = useState( { label: data?.costingMethod, value: data?.costingMethod } );
    const [orderUOM, setOrderUOM] = useState( data?.orderUom ? { label: data?.orderUom, value: data?.orderUomId } : null );
    const [consumptionUOM, setConsumptionUOM] = useState( data?.consumptionUom ? { label: data?.consumptionUom, value: data?.consumptionUomId } : null );

    const [defaultUomSet, setDefaultUomSet] = useState( data?.defaultUomSet ? { label: data?.defaultUomSet, value: data?.defaultUomSetId } : null );
    const [defaultUom, setDefaultUom] = useState( data?.defaultUom ? { label: data?.defaultUom, value: data?.defaultUomId } : null );
    const [categoryGroup, setCategoryGroup] = useState( dropDownCategoryGroups?.find( group => group.value === data?.groupName ) );
    const [categorySubGroup, setCategorySubGroup] = useState( dropDownCategoryGroups?.find( group => group.value === data?.subGroupName ) );


    useEffect( () => {
        dispatch( getUnitSetsDropdown() );
        dispatch( getDropDownCategoryGroups() );
    }, [] );

    const { register, errors, handleSubmit } = useForm();
    const onSubmit = values => {

        if ( isObjEmpty( errors ) ) {
            const submittedObj = {
                name: values.name,
                description: values.description,
                itemPrefix: values.itemPrefix,
                defaultUomSetId: defaultUomSet?.value,
                defaultUomId: defaultUom?.value,
                orderUomId: orderUOM?.value,
                consumptionUomId: consumptionUOM?.value,
                costingMethod: costingMethod?.value,
                groupName: categoryGroup?.value,
                subGroupName: categorySubGroup?.value
            };
            console.log( 'submittedObj', JSON.stringify( submittedObj, null, 2 ) );
            dispatch(
                updateItemGroup( data?.id, submittedObj )
            );
            // dispatch(
            //     selectedItemGroupNull()
            // );
            // toggleSidebar();
        }
    };

    const handleCategoryGroup = ( data ) => {
        setCategoryGroup( data );
        setCategorySubGroup( null );
    };

    const handleUnitSetDropdown = ( data ) => {
        setDefaultUomSet( data );
        setDefaultUom( null );
        setOrderUOM( null );
        setConsumptionUOM( null );
        dispatch( getUomDropdownByUnitSetId( data?.value ) );
    };

    const handleDefaultUomOnFocus = ( uoms ) => {
        console.log( uoms );
        if ( !uoms.length ) {
            dispatch( getUomDropdownByUnitSetId( defaultUomSet?.value ) );
        }
    };


    const handleCancel = () => {
        toggleSidebar();
        dispatch(
            selectedItemGroupNull()
        );
    };
    return (
        <Sidebar
            size='lg'
            open={open}
            title='Edit Item Group '
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={handleCancel}
        >
            <UILoader blocking={isItemGroupDataSubmitProgress} loader={<ComponentSpinner />} >
                <Form onSubmit={handleSubmit( onSubmit )}>
                    <FormGroup>
                        <Label for='name'>
                            Name <span className='text-danger'>*</span>
                        </Label>
                        <Input
                            name='name'
                            id='name'
                            defaultValue={data?.name}
                            bsSize="sm"
                            placeholder='Fabric'
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
                            bsSize="sm"
                            id='description'
                            defaultValue={data?.description}
                            placeholder='Write Description'
                            innerRef={register( { required: false } )}
                            invalid={errors.description && true}
                            className={classnames( { 'is-invalid': errors['description'] } )}
                        />
                        {errors && errors.description && <FormFeedback>Description is required!</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                        <Label for='itemPrefix'>
                            Item Prefix <span className='text-danger'>*</span>
                        </Label>
                        <Input
                            type='itemPrefix'
                            name='itemPrefix'
                            id='itemPrefix'
                            bsSize="sm"
                            defaultValue={data?.itemPrefix}
                            placeholder='Write itemPrefix'
                            innerRef={register( { required: true } )}
                            invalid={errors.itemPrefix && true}
                            className={classnames( { 'is-invalid': errors['itemPrefix'] } )}
                        />
                        {errors && errors.itemPrefix && <FormFeedback>Item Prefix is required!</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                        <Label for='costingMethod'>
                            Costing Method <span className='text-danger'>*</span>
                        </Label>
                        <CreatableSelect
                            id='costingMethod'
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={selectCostingMethod}
                            classNamePrefix='dropdown'
                            className='erp-dropdown-select'
                            innerRef={register( { required: true } )}
                            value={costingMethod}
                            onChange={data => {
                                setCostingMethod( data );
                            }}
                        />
                        {errors && errors.costingMethod && <FormFeedback>Costing Method is required!</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                        <Label for='orderUom'>
                            Category Group<span className='text-danger'>*</span>
                        </Label>
                        <CreatableSelect
                            id='orderUom'
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={dropDownCategoryGroups.filter( group => group.parentName === null )}
                            classNamePrefix='dropdown'
                            innerRef={register( { required: true } )}
                            className={classnames( `erp-dropdown-select ${( errors && errors.categoryGroup && !categoryGroup ) && 'is-invalid'}` )}
                            value={categoryGroup}
                            onChange={data => {
                                handleCategoryGroup( data );
                            }}
                        />
                        {( errors && errors.categoryGroup && !categoryGroup ) && <FormFeedback>{errors.categoryGroup.message}</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                        <Label for='orderUom'>
                            Category Sub Group<span className='text-danger'>*</span>
                        </Label>
                        <CreatableSelect
                            id='orderUom'
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={dropDownCategoryGroups.filter( group => group.parentName === categoryGroup?.label )}
                            classNamePrefix='dropdown'
                            innerRef={register( { required: true } )}
                            className={classnames( `erp-dropdown-select ${( errors && errors.categorySubGroup && !categorySubGroup ) && 'is-invalid'}` )}
                            value={categorySubGroup}
                            onChange={data => {
                                setCategorySubGroup( data );
                            }}
                        />
                        {( errors && errors.categorySubGroup && !categorySubGroup ) && <FormFeedback>{errors.categorySubGroup.message}</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                        <Label for='orderUom'>
                            Default UOM Set<span className='text-danger'>*</span>
                        </Label>
                        <CreatableSelect
                            id='orderUom'
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={dropDownUnitSet}
                            classNamePrefix='dropdown'
                            innerRef={register( { required: true } )}
                            className={classnames( `erp-dropdown-select ${( errors && errors.defaultUomSet && !defaultUomSet ) && 'is-invalid'}` )}
                            value={defaultUomSet}
                            onChange={data => {
                                handleUnitSetDropdown( data );
                            }}
                        />
                        {( errors && errors.defaultUomSet && !defaultUomSet ) && <FormFeedback>{errors.defaultUomSet.message}</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                        <Label for='orderUom'>
                            Default UOM <span className='text-danger'>*</span>
                        </Label>
                        <CreatableSelect
                            id='orderUom'
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={dropdownUnitSetUom}
                            classNamePrefix='dropdown'
                            innerRef={register( { required: true } )}
                            className={classnames( `erp-dropdown-select ${( errors && errors.defaultUom && !defaultUom ) && 'is-invalid'}` )}
                            value={defaultUom}
                            onChange={data => {
                                setDefaultUom( data );
                            }}
                            onFocus={() => { handleDefaultUomOnFocus( dropdownUnitSetUom ); }}
                        />
                        {( errors && errors.defaultUom && !defaultUom ) && <FormFeedback>{errors.defaultUom.message}</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                        <Label for='orderUom'>
                            Order UOM <span className='text-danger'>*</span>
                        </Label>
                        <CreatableSelect
                            id='orderUom'
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={dropdownUnitSetUom}
                            classNamePrefix='dropdown'
                            className={classnames( `erp-dropdown-select ${( errors && errors.orderUOM && !orderUOM ) && 'is-invalid'}` )}
                            innerRef={register( { required: true } )}
                            value={orderUOM}
                            onChange={data => {
                                setOrderUOM( data );
                            }}
                            onFocus={() => { handleDefaultUomOnFocus( dropdownUnitSetUom ); }}

                        />
                        {errors && errors.orderUOM && <FormFeedback>Default Uom  is required!</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                        <Label for='defaultUom'>
                            Consumption UOM <span className='text-danger'>*</span>
                        </Label>
                        <CreatableSelect
                            id='consumptionUOM'
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={dropdownUnitSetUom}
                            classNamePrefix='dropdown'
                            className='erp-dropdown-select'
                            innerRef={register( { required: true } )}
                            value={consumptionUOM}
                            onChange={data => {
                                setConsumptionUOM( data );
                            }}
                            onFocus={() => { handleDefaultUomOnFocus( dropdownUnitSetUom ); }}

                        />
                        {errors && errors.consumptionUOM && <FormFeedback>Default Uom  is required!</FormFeedback>}
                    </FormGroup>


                    <Button.Ripple type='submit' size="sm" className='mr-1' color='primary'>
                        Submit
                    </Button.Ripple>

                    <Button size="sm" className='mr-1' color='danger' outline onClick={() => { handleCancel(); }}>
                        Cancel
                    </Button>
                </Form>
            </UILoader>


        </Sidebar>
    );
};

export default itemGroupEditForm;

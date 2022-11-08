import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { yupResolver } from '@hookform/resolvers/yup';
import { isObjEmpty } from '@utils';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, CustomInput, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import * as yup from 'yup';
import { selectCostingMethod } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';
import { getUnitSetsDropdown, getUomDropdownByUnitSetId } from '../../unit-sets/store/actions';
import { addItemGroup, getDropDownCategoryGroups } from '../store/actions';

const ItemGroupAddForm = ( { open, toggleSidebar } ) => {
    const dispatch = useDispatch();
    const { dropDownUnitSet, dropdownUnitSetUom } = useSelector( ( { unitSets } ) => unitSets );
    const { dropDownCategoryGroups, isItemGroupDataSubmitProgress } = useSelector( ( { itemGroups } ) => itemGroups );
    const [isMultipleCreate, setIsMultipleCreate] = useState( false );
    const [orderSetUOM, setOrderSetUOM] = useState( null );
    const [costingMethod, setCostingMethod] = useState( null );
    const [consumptionSetUOM, setConsumptionSetUOM] = useState( null );
    const [defaultUomSet, setDefaultUomSet] = useState( null );
    const [defaultUom, setDefaultUom] = useState( null );
    const [categoryGroup, setCategoryGroup] = useState( null );
    const [categorySubGroup, setCategorySubGroup] = useState( null );

    useEffect( () => {
        dispatch( getUnitSetsDropdown() );
        dispatch( getDropDownCategoryGroups() );
    }, [] );

    const validationSchema = yup.object().shape( {
        name: yup.string().required( 'Group Name is required!' ),
        description: yup.string().notRequired( 'Description is required!' ),
        itemPrefix: yup.string().required( 'Prefix is required!' ),
        costingMethod: costingMethod ? yup.string() : yup.string().required( 'Costing Method is required!' ),
        orderUOM: orderSetUOM ? yup.string() : yup.string().notRequired( 'Order UOM is required!' ),
        consumptionUOM: consumptionSetUOM ? yup.string() : yup.string().notRequired( 'Consumption UOM is required!' ),
        categoryGroup: categoryGroup ? yup.string() : yup.string().required( 'Category Group is required!' ),
        categorySubGroup: categorySubGroup ? yup.string() : yup.string().required( 'Category Sub Group is required!' ),
        defaultUomSet: defaultUomSet ? yup.string() : yup.string().required( 'Default Uom Set is required!' ),
        defaultUom: defaultUom ? yup.string() : yup.string().notRequired( 'Default Uom is required!' )
    } );

    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );


    // ** Function to handle form submit
    const onSubmit = values => {
        if ( isObjEmpty( errors ) ) {
            const submittedObj = {
                name: values.name,
                description: values.description,
                itemPrefix: values.itemPrefix,
                defaultUomSetId: defaultUomSet?.value,
                defaultUomId: defaultUom?.value,
                orderUomId: orderSetUOM?.value,
                consumptionUomId: consumptionSetUOM?.value,
                costingMethod: costingMethod?.value,
                groupName: categoryGroup?.value,
                subGroupName: categorySubGroup?.value
            };
            console.log( JSON.stringify( submittedObj, null, 2 ) );
            dispatch(
                addItemGroup( submittedObj, isMultipleCreate )
            );
        }
    };

    const handleCategoryGroup = ( data ) => {
        console.log( data );
        setCategoryGroup( data );
        setCategorySubGroup( null );
    };

    const handleUnitSetDropdown = ( data ) => {
        setDefaultUomSet( data );
        setDefaultUom( null );
        setOrderSetUOM( null );
        setConsumptionSetUOM( null );
        dispatch( getUomDropdownByUnitSetId( data?.value ) );
    };


    const handleCancel = () => {
        toggleSidebar();
    };
    return (
        <Sidebar
            size='lg'
            open={open}
            title='New Item Group '
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
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
                            bsSize="sm"
                            placeholder='Fabric'
                            innerRef={register( { required: true } )}
                            invalid={errors.name && true}
                            className={classnames( { 'is-invalid': errors['name'] } )}
                        />
                        {errors && errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}

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
                            placeholder='Write Description'
                            innerRef={register( { required: true } )}
                            invalid={errors.description && true}
                            className={classnames( { 'is-invalid': errors['description'] } )}
                        />
                        {errors && errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
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
                            placeholder='Write itemPrefix'
                            innerRef={register( { required: true } )}
                            invalid={errors.itemPrefix && true}
                            className={classnames( { 'is-invalid': errors['itemPrefix'] } )}
                        />
                        {errors && errors.itemPrefix && <FormFeedback>{errors.itemPrefix.message}</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                        <Label for='costingMethod'>
                            Costing Method <span className='text-danger'>*</span>
                        </Label>
                        <Select
                            id='costingMethod'
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={selectCostingMethod}
                            classNamePrefix='dropdown'
                            innerRef={register( { required: true } )}
                            invalid={errors.costingMethod && true}
                            // className={classnames( { 'is-invalid': errors['costingMethod'] } )}
                            // className={classnames( 'is-invalid' )}
                            className={classnames( `erp-dropdown-select ${( errors && errors.costingMethod && !costingMethod ) && 'is-invalid'}` )}
                            value={costingMethod}
                            onChange={data => {
                                setCostingMethod( data );
                            }}
                        />
                        {( errors && errors.costingMethod && !costingMethod ) && <FormFeedback>{errors.costingMethod.message}</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                        <Label for='orderUom'>
                            Category Group<span className='text-danger'>*</span>
                        </Label>
                        <Select
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
                        <Select
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
                        <Select
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
                        <Select
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
                        />
                        {( errors && errors.defaultUom && !defaultUom ) && <FormFeedback>{errors.defaultUom.message}</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                        <Label for='orderUom'>
                            Order UOM <span className='text-danger'>*</span>
                        </Label>
                        <Select
                            id='orderUom'
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={dropdownUnitSetUom}
                            classNamePrefix='dropdown'
                            innerRef={register( { required: true } )}
                            className={classnames( `erp-dropdown-select ${( errors && errors.orderUOM && !orderSetUOM ) && 'is-invalid'}` )}
                            value={orderSetUOM}
                            onChange={data => {
                                setOrderSetUOM( data );
                            }}
                        />
                        {( errors && errors.orderUOM && !orderSetUOM ) && <FormFeedback>{errors.orderUOM.message}</FormFeedback>}
                    </FormGroup>

                    <FormGroup>
                        <Label for='consumptionUom'>
                            Consumption UOM <span className='text-danger'>*</span>
                        </Label>
                        <Select
                            id='consumptionUom'
                            menuPosition="auto"
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={dropdownUnitSetUom}
                            classNamePrefix='dropdown'
                            innerRef={register( { required: true } )}
                            className={classnames( `erp-dropdown-select ${( errors && errors.consumptionUOM && !consumptionSetUOM ) && 'is-invalid'}` )}
                            value={consumptionSetUOM}
                            onChange={data => {
                                setConsumptionSetUOM( data );
                            }}
                        />
                        {( errors && errors.consumptionUOM && !consumptionSetUOM ) && <FormFeedback>{errors.consumptionUOM.message}</FormFeedback>}
                    </FormGroup>
                    {/* <FormGroup>
                    <Label for='groupTypeId'>
                        Group Type <span className='text-secondary'>*</span>
                    </Label>
                    <CreatableSelect
                        id='groupTypeId'
                        menuPosition="auto"
                        isSearchable
                        isClearable
                        theme={selectThemeColors}
                        options={selectGroupType}
                        classNamePrefix='dropdown'
                        innerRef={register( { required: false } )}
                        className={classnames( `erp-dropdown-select ${( errors && errors.groupType && !groupType ) && 'is-invalid'}` )}
                        value={groupType}
                        onChange={data => {
                            setGroupType( data );
                        }}
                    />
                    {( errors && errors.groupType && !consumptionSetUOM ) && <FormFeedback>{errors.groupType.message}</FormFeedback>}
                </FormGroup> */}
                    <FormGroup >
                        <div className='custom-input-box'>
                            < CustomInput
                                type='checkbox'
                                label='Is Create Again?'
                                className='custom-control-primary'
                                id='icon-success'
                                name='icon-success'
                                checked={isMultipleCreate}
                                onChange={( e ) => setIsMultipleCreate( e.target.checked )}
                            />
                        </div>

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

export default ItemGroupAddForm;

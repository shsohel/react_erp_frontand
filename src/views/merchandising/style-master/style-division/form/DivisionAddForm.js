import Sidebar from '@components/sidebar';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { Button, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { baseAxios } from '../../../../../services';
import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import { status } from '../../../../../utility/enums';
import { selectThemeColors } from '../../../../../utility/Utils';
import { getDropDownDepartments } from '../../style-department/store/actions';
import { addDivision, bindStyleDivisionData } from '../store/actions';

import * as yup from 'yup';

const DivisionAddForm = ( { open, toggleSidebar } ) => {
    const dispatch = useDispatch();
    const { dropDownDepartments, lastCreatedId } = useSelector( ( { departments } ) => departments );
    const { styleDivision } = useSelector( ( { divisions } ) => divisions );
    const [department, setDepartment] = useState( [] );

    ///For Validation Start
    const SignupSchema = yup.object().shape( {
        name: styleDivision?.name.length ? yup.string() : yup.string().required( 'Name is Required!!' )

    } );

    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );
    useEffect( () => {
        dispatch( getDropDownDepartments() );
    }, [] );

    const handleStyleDepartmentCreation = ( newValue ) => {
        const instantCreateObj = {
            name: newValue,
            productCategoryIds: [],
            description: newValue
        };
        baseAxios
            .post( `${merchandisingApi.department.root}`, instantCreateObj )
            .then( response => {
                if ( response.status === status.success ) {
                    dispatch( bindStyleDivisionData( {
                        ...styleDivision,
                        styleDepartments: [
                            ...styleDivision.styleDepartments, {
                                value: response.data,
                                label: newValue
                            }
                        ]
                    } ) );
                    dispatch( getDropDownDepartments() );
                }
            } );
    };


    // ** Vars React HOOK Form
    // ** Function to handle form submit
    const onSubmit = () => {
        const styleDepartmentIds = styleDivision?.styleDepartments.map( i => i.value );
        dispatch(
            addDivision( {
                name: styleDivision.name,
                styleDepartmentIds,
                description: styleDivision.description
            } )
        );

    };

    const handleDataOnChange = ( e ) => {
        const { name, type, value } = e.target;
        const updatedObj = {
            ...styleDivision,
            [name]: value
        };
        dispatch( bindStyleDivisionData( updatedObj ) );
    };

    const handleDropdownChange = ( data, e ) => {
        const { action, name, option } = e;
        const updatedObj = {
            ...styleDivision,
            [name]: data
        };
        dispatch( bindStyleDivisionData( updatedObj ) );
    };


    const handleCancel = () => {
        toggleSidebar();
    };

    return (
        <Sidebar
            size='lg'
            open={open}
            title='New Style Division '
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
        >
            <>
                <FormGroup>
                    <Label for='name'>
                        Name <span className='text-danger'>*</span>
                    </Label>
                    <Input
                        name='name'
                        id='name'
                        placeholder='Knit'
                        bsSize="sm"
                        invalid={( errors.name && !styleDivision.name?.length ) && true}
                        value={styleDivision.name}
                        onChange={( e ) => handleDataOnChange( e )}
                    />
                    {errors && errors.name && <FormFeedback>Name is required!</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label className="text-dark font-weight-bold" for='styleDepartmentIds'> Select Department </Label>
                    <CreatableSelect
                        id='styleDepartmentIds'
                        name="styleDepartments"
                        isMulti
                        isSearchable
                        isClearable
                        theme={selectThemeColors}
                        options={dropDownDepartments}
                        classNamePrefix='dropdown'
                        className={classnames( 'erp-dropdown-select' )}
                        innerRef={register( { required: false } )}
                        onCreateOption={data => { handleStyleDepartmentCreation( data ); }}
                        value={styleDivision.styleDepartments}
                        onChange={( data, e ) => {
                            handleDropdownChange( data, e );
                        }}
                    />
                    {errors && errors.styleDepartmentIds && <FormFeedback>department is required!</FormFeedback>}
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
                        value={styleDivision.description}
                        onChange={( e ) => handleDataOnChange( e )}
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

export default DivisionAddForm;

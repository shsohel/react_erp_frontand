
import Sidebar from '@components/sidebar';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { Button, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import * as yup from 'yup';
import { baseAxios } from '../../../../../services';
import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import { status } from '../../../../../utility/enums';
import { selectThemeColors } from '../../../../../utility/Utils';
import { getDropDownDepartments } from '../../style-department/store/actions';
import { bindStyleDivisionData, selectedDivisionNull, updateDivision } from '../store/actions';


const DivisionEditForm = ( { open, toggleSidebarForEdit, data } ) => {
    const dispatch = useDispatch();
    const { dropDownDepartments } = useSelector( ( { departments } ) => departments );
    const { styleDivision } = useSelector( ( { divisions } ) => divisions );

    ///For Validation Start
    const SignupSchema = yup.object().shape( {
        name: styleDivision?.name.length ? yup.string() : yup.string().required( 'Name is Required!!' )

    } );

    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );

    useEffect( () => {
        dispatch( getDropDownDepartments() );
    }, [] );

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

    // ** Function to handle form submit
    const onSubmit = () => {
        const styleDepartmentIds = styleDivision?.styleDepartments.map( i => i.value );
        dispatch(
            updateDivision( {
                id: styleDivision.id,
                name: styleDivision.name,
                styleDepartmentIds,
                description: styleDivision.description
            } )
        );


    };


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
    //Events
    const handleCancel = () => {
        toggleSidebarForEdit();
        dispatch( selectedDivisionNull() );
    };


    return (
        <Sidebar
            size='lg'
            open={open}
            title='Edit Style Division '
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
                        placeholder='Knit'
                        value={styleDivision.name}
                        onChange={( e ) => handleDataOnChange( e )}
                        invalid={( errors.name && !styleDivision.name.length ) && true}
                    />
                    {errors && errors.name && <FormFeedback>Name is required!</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label className="text-dark font-weight-bold" for='styleDepartmentIds'> Select Department </Label>
                    <CreatableSelect
                        id='styleDepartmentIds'
                        isMulti
                        isSearchable
                        name="styleDepartments"
                        isClearable
                        theme={selectThemeColors}
                        options={dropDownDepartments}
                        classNamePrefix='dropdown'
                        className="erp-dropdown-select"
                        innerRef={register( { required: false } )}
                        value={styleDivision.styleDepartments}
                        onCreateOption={data => { handleStyleDepartmentCreation( data ); }}
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
                        defaultValue={styleDivision.description}
                        innerRef={register( { required: false } )}
                        invalid={errors.description && true}
                        className={classnames( { 'is-invalid': errors['description'] } )}
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

export default DivisionEditForm;

import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/auth/form/role-form.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button, FormGroup, Input, Label
} from 'reactstrap';
import * as yup from 'yup';
import { bindRoleBasicInfo, updateRole } from '../store/actions';

const RoleEditForm = ( { toggleSidebar, open } ) => {
    const dispatch = useDispatch();
    const { roleBasicInfo, isRoleDataSubmitProgress } = useSelector( ( { roles } ) => roles );

    const validationSchema = yup.object().shape( {
        name: roleBasicInfo.name.length ? yup.string() : yup.string().required( 'Name is required!' )

    } );

    const { errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...roleBasicInfo,
            [name]: value
        };
        dispatch( bindRoleBasicInfo( updatedObj ) );

    };

    const onSubmit = () => {

        dispatch( updateRole( roleBasicInfo, roleBasicInfo?.id ) );

    };
    const handleClear = () => {

    };
    const handleCancel = () => {
        toggleSidebar();
        dispatch( bindRoleBasicInfo( null ) );
    };
    return (
        <Sidebar
            size='lg'
            open={open}
            title='Edit Role'
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
        >
            <>
                <UILoader blocking={isRoleDataSubmitProgress} loader={<ComponentSpinner />} overlayColor='rgba(115, 103, 240, 1)' >

                    <FormGroup>
                        <Label for='name'>
                            Name <span className='text-danger'>*</span>
                        </Label>
                        <Input
                            id="roleName"
                            type="text"
                            name="name"
                            bsSize="sm"
                            placeholder="Role"
                            //  innerRef={register( { required: true } )}
                            invalid={!!( errors.name && !roleBasicInfo?.name.length )}
                            value={roleBasicInfo?.name}
                            onChange={( e ) => { handleInputOnChange( e ); }}

                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for='roleDescription'>
                            Description
                        </Label>

                        <Input
                            id="roleDescription"
                            type="text"
                            name="description"
                            bsSize="sm"
                            placeholder="Description"
                            //  innerRef={register( { required: true } )}
                            // invalid={!!( errors.styleNo && !singleStyleBasicInfo?.styleNo.length )}
                            value={roleBasicInfo?.description}
                            onChange={( e ) => { handleInputOnChange( e ); }}

                        />

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
                    <Button.Ripple
                        type='reset'
                        className='mr-1'
                        size="sm" color='danger'
                        outline
                        onClick={() => { handleCancel(); }}
                    >
                        Cancel
                    </Button.Ripple>
                </UILoader>
            </>

        </Sidebar >

    );
};

export default RoleEditForm;
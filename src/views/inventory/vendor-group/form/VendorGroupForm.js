import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FormGroup, Input, Label } from 'reactstrap';
import * as yup from 'yup';
import CustomModal from '../../../../utility/custom/CustomModal';
import { addVendorGroup, bindVendorBasicInfo } from '../store/actions';

const VendorGroupFormNew = ( { openModal, toggleModal } ) => {
    const dispatch = useDispatch();
    const { vendorGroupBasicInfo } = useSelector( ( { vendorGroups } ) => vendorGroups );

    const validationSchema = yup.object().shape( {
        name: vendorGroupBasicInfo?.name?.length ? yup.string() : yup.string().required( 'Group Name is required!' )
    } );

    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );

    const handleInputOnChange = ( e ) => {
        const { name, value, type } = e.target;
        const updatedData = {
            ...vendorGroupBasicInfo,
            [name]: value
        };
        dispatch( bindVendorBasicInfo( updatedData ) );
    };


    const handleMainModelSubmit = () => {
        const submittedObj = {
            name: vendorGroupBasicInfo.name
        };
        dispatch( addVendorGroup( submittedObj ) );
    };
    const handleMainModalToggleClose = () => {
        toggleModal();
    };

    const handleCancel = () => {
        toggleModal();
    };

    console.log( openModal );

    return (
        <CustomModal
            modalTypeClass='vertically-centered-modal'
            className='modal-dialog-top modal-md'
            openModal={openModal}
            handleMainModelSubmit={handleSubmit( handleMainModelSubmit )}
            handleMainModalToggleClose={handleMainModalToggleClose}

            title="Size Color Additional Quantity"

        >
            <FormGroup>
                <Label for='name'>
                    Name <span className='text-danger'>*</span>
                </Label>
                <Input
                    name='name'
                    id='name'
                    bsSize="sm"
                    placeholder='Vendor Group'
                    invalid={errors.name && !vendorGroupBasicInfo.name?.length}
                    value={vendorGroupBasicInfo.name}
                    onChange={( e ) => { handleInputOnChange( e ); }}

                />

            </FormGroup>

        </CustomModal>
    );

};

export default VendorGroupFormNew;
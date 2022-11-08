import '@custom-styles/merchandising/others/custom-table.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import { store } from '@store/storeConfig/store';
import { CheckSquare, Edit3, MinusSquare, PlusSquare } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, Col, Input, Label, Row, Table } from 'reactstrap';
import * as yup from 'yup';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { confirmObj } from '../../../../utility/enums';
import { randomIdGenerator } from '../../../../utility/Utils';
import { bindVendorBasicInfo, bindVendorSubGroup, getVendorSubGroupByVendorId, handleOpenVendorGroupEdit, updateVendorSubGroup } from '../store/actions';

const VendorGroupEditFormNew = () => {
    const dispatch = useDispatch();
    const {
        vendorGroupBasicInfo,
        vendorSubGroups,
        openVendorGroupSidebarEdit
    } = useSelector( ( { vendorGroups } ) => vendorGroups );

    const toggleEditSidebar = () => store.dispatch( handleOpenVendorGroupEdit( !openVendorGroupSidebarEdit ) );

    const validationSchema = yup.object().shape( {
        name: yup.string().required( 'Group Name is required!' ),
        subGroup: yup.string().notRequired( 'Vendor Sub Group is required!' )
    } );

    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );


    const handleCancel = () => {
        toggleEditSidebar();
        dispatch( bindVendorBasicInfo( null ) );
    };

    const getSubGroup = () => {
        dispatch( getVendorSubGroupByVendorId( vendorGroupBasicInfo.id ) );
    };
    const addNewSubGroupRowAdd = () => {
        const newObj = {
            rowId: randomIdGenerator(),
            name: '',
            isEditable: true,
            isNew: true
        };
        const updatedData = [...vendorSubGroups, newObj];
        dispatch( bindVendorSubGroup( updatedData ) );
    };

    const handleRowSubGroupDataOnChange = ( e, rowId ) => {
        const { name, value } = e.target;
        const updatedData = vendorSubGroups.map( subGroup => {
            if ( subGroup.rowId === rowId ) {
                subGroup[name] = value;
            }
            return subGroup;
        } );
        dispatch( bindVendorSubGroup( updatedData ) );
    };
    const handleRemoveSubGroupRow = ( rowId ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                const updatedData = vendorSubGroups.filter( subGroup => subGroup.rowId !== rowId );
                dispatch( bindVendorSubGroup( updatedData ) );
            }
        } );

    };

    const handleSubGroupSubmit = ( group, isNew ) => {
        console.log( group.map( g => g.name ) );

        const submittedObj = group.map( g => g.name );

        dispatch( updateVendorSubGroup( submittedObj, vendorGroupBasicInfo.id ) );
    };
    const handleClearSubGroup = () => {
        dispatch( bindVendorSubGroup( [] ) );
        dispatch( bindVendorBasicInfo( null ) );
    };

    const handleEditControl = ( rowId ) => {
        const updatedData = vendorSubGroups.map( subGroup => {
            if ( subGroup.rowId === rowId ) {
                subGroup['isEditable'] = !subGroup.isEditable;
            }
            return subGroup;
        } );
        dispatch( bindVendorSubGroup( updatedData ) );
    };

    return (
        <Card className="mt-3">
            <CardBody>
                <h5> Vendor Sub Group</h5>

                <Table className="mt-1 custom-table" bordered size="sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th style={{ width: '5px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody >
                        {vendorSubGroups.length ? vendorSubGroups.map( subGroup => (
                            <tr className='text-center' key={subGroup.rowId}>
                                <td className='p-0'>
                                    <Input
                                        disabled={!subGroup.isEditable}
                                        name='name'
                                        id='name'
                                        bsSize="sm"
                                        placeholder='Sub Group'
                                        value={subGroup.name}
                                        onChange={( e ) => { handleRowSubGroupDataOnChange( e, subGroup.rowId ); }}
                                    />
                                </td>
                                <td style={{ width: '5px' }}>
                                    <span className="d-flex justify-content-center">
                                        <Button.Ripple
                                            id="editRow"
                                            tag={Label}
                                            onClick={() => { handleEditControl( subGroup.rowId ); }}
                                            className='btn-icon p-0'
                                            color='flat-success'
                                        >
                                            {
                                                subGroup.isEditable ? (
                                                    <CheckSquare
                                                        size={16}
                                                        id="editRow"
                                                        color="#6610f2"
                                                    /> ) : (
                                                    <Edit3
                                                        size={16}
                                                        id="editRow"
                                                        color="green"
                                                    /> )
                                            }

                                        </Button.Ripple>
                                        <Button.Ripple
                                            id="deleteRow"
                                            tag={Label}
                                            onClick={() => { handleRemoveSubGroupRow( subGroup.rowId ); }}
                                            className='btn-icon p-0'
                                            color='flat-danger'
                                        >
                                            <MinusSquare size={16} id="editRow" color="red" />
                                        </Button.Ripple>
                                    </span>
                                </td>
                            </tr>
                        ) ) : <tr className='text-center'>
                            <td colSpan={2}>There no Sub Group Available Here </td>
                        </tr>}
                    </tbody>
                </Table>
                <Row className="mt-1">
                    <Col className="d-flex justify-content-between">
                        <Button.Ripple
                            hidden={!vendorGroupBasicInfo?.id}
                            className='btn-icon p-0'
                            color='flat-success'
                            id="subGroupAddBtn"
                            onClick={() => { addNewSubGroupRowAdd(); }}
                        >
                            <PlusSquare id="subGroupAddBtn" size={22} />
                        </Button.Ripple>
                        <span>
                            <Button.Ripple
                                className="mr-1"
                                hidden={!vendorGroupBasicInfo.id}
                                size="sm"
                                color='secondary'
                                id="clearId"
                                onClick={() => { handleClearSubGroup( vendorSubGroups ); }}
                            >
                                Clear
                            </Button.Ripple>
                            <Button.Ripple
                                hidden={!vendorGroupBasicInfo.id}
                                //  disabled={!vendorSubGroups.length}
                                size="sm"
                                color='primary'
                                id="subGroupId"
                                onClick={() => { handleSubGroupSubmit( vendorSubGroups ); }}
                            >
                                Save
                            </Button.Ripple>
                        </span>

                    </Col>
                </Row>

            </CardBody>

        </Card>
    );
};

export default VendorGroupEditFormNew;
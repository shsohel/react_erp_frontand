import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/merchandising/others/custom-table.scss';
import { useState } from 'react';
import { PlusSquare, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomModal from '../../../../utility/custom/CustomModal';
import { confirmObj } from '../../../../utility/enums';
import { isPermit, randomIdGenerator } from '../../../../utility/Utils';
import { updateItemSubGroup } from '../../item-sub-group/store/actions';
import { deleteItemSubGroup, itemSubGroupAddToTableRow, itemSubGroupRemoveFromTableRow } from '../store/actions';


const AssignItemSubCategories = ( {
    openAssignSubCategoryModal,
    toggleAssignSubCategoryModalOpen,
    itemSubGroups,
    itemGroupId } ) => {
    const dispatch = useDispatch();
    const {
        itemGroup,
        isItemGroupDataSubmitProgress
    } = useSelector( ( { itemGroups } ) => itemGroups );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    const [itemSubGroup, setItemSubGroup] = useState( {
        name: '',
        description: ''
    } );

    const handleInputChange = ( e ) => {
        const { name, value } = e.target;
        setItemSubGroup( {
            ...itemSubGroup,
            [name]: value
        } );
    };

    const handleSegmentAssignModalSubmit = () => {
        const submitArray = itemSubGroups?.map( isg => ( {
            id: isg.id,
            parentCategoryId: isg.parentCategoryId,
            name: isg.name,
            description: isg.description
        } ) );
        dispatch(
            updateItemSubGroup( itemGroupId, submitArray )
        );
    };

    const handleSegmentAssignModalClose = () => {
        toggleAssignSubCategoryModalOpen();
    };

    const handleAddItemSubGroupToTable = () => {
        const newObj = {
            rowId: randomIdGenerator(),
            id: 0,
            parentCategoryId: itemGroupId,
            name: itemSubGroup.name,
            description: itemSubGroup.description
        };
        const updateItemGroups = [...itemSubGroups, newObj];
        dispatch( itemSubGroupAddToTableRow( updateItemGroups ) );
        setItemSubGroup( {
            name: '',
            description: ''
        } );
    };

    const handleItemSubGroupOnChange = ( rowId, e ) => {
        const { name, value } = e.target;
        console.log( value );
        const updatedData = itemSubGroups.map( subGroup => {
            if ( subGroup.rowId === rowId ) {
                subGroup[name] = value;
            }
            return subGroup;
        } );
        dispatch( itemSubGroupAddToTableRow( updatedData ) );

    };

    const handleRemoveItemSubGroupFromTable = ( subGroup ) => {

        confirmDialog( confirmObj ).then( e => {

            if ( e.isConfirmed ) {
                if ( subGroup.id === 0 ) {
                    const updatedData = [...itemSubGroups];
                    updatedData.splice(
                        updatedData.findIndex( x => x.rowId === subGroup.rowId ),
                        1
                    );
                    dispatch( itemSubGroupRemoveFromTableRow( updatedData ) );
                } else {
                    dispatch( deleteItemSubGroup( subGroup, itemGroupId ) );
                }

            }
        } );

    };


    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-lg'
                openModal={openAssignSubCategoryModal}
                handleMainModelSubmit={handleSegmentAssignModalSubmit}
                handleMainModalToggleClose={handleSegmentAssignModalClose}
                title="Add Sub Group"
                isDisabledBtn={isItemGroupDataSubmitProgress}

            >
                <UILoader blocking={isItemGroupDataSubmitProgress} loader={<ComponentSpinner />} >
                    <Card className="mb-0">
                        <CardBody>
                            <Row>
                                <Col>
                                    <div className="font-weight-bold d-flex justify-content-start ">
                                        <div className="pr-2"> Item Group : <label className="font-weight-bolder pl-1 " >{itemGroup?.groupName}</label>  </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="d-flex justify-content-center align-self-center mt-1">
                                <Col sm={4} xs={4} lg={4}>
                                    <FormGroup >
                                        <Label for='name' >
                                            Name <span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            name='name'
                                            id='name'
                                            bsSize="sm"
                                            placeholder='Sub Category'
                                            value={itemSubGroup.name}
                                            onChange={handleInputChange}

                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm={6} xs={6} lg={6}>
                                    <FormGroup>
                                        <Label for='description'>
                                            Description <span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            type='description'
                                            name='description'
                                            id='description'
                                            bsSize="sm"
                                            placeholder='Write Description'
                                            value={itemSubGroup.description}
                                            onChange={handleInputChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm={2} xs={2} lg={2}>
                                    <FormGroup className="align-self-center mt-1 ">
                                        <Button.Ripple
                                            color='flat-success'
                                            onClick={() => { handleAddItemSubGroupToTable(); }}
                                        >
                                            <PlusSquare size={24} />
                                        </Button.Ripple>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12" className="item-sub-group-custom-table">
                                    <Table bordered responsive >
                                        <thead className="text-center">
                                            <tr>
                                                <th className='sl'>SL</th>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-center">
                                            {
                                                itemSubGroups?.map( ( item, index ) => (
                                                    <tr key={index}>
                                                        <td className='sl'>{index + 1}</td>
                                                        <td>
                                                            <Input
                                                                bsSize="sm"
                                                                value={item.name}
                                                                name="name"
                                                                onChange={( e ) => { handleItemSubGroupOnChange( item.rowId, e ); }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                bsSize="sm"
                                                                value={item.description}
                                                                name="description"
                                                                onChange={( e ) => { handleItemSubGroupOnChange( item.rowId, e ); }}
                                                            />

                                                        </td>
                                                        <td className='action'>
                                                            <Button.Ripple
                                                                tag={Label}
                                                                disabled={( !isPermit( userPermission?.ItemGroupSubGroupDelete, authPermissions ) && item.id !== 0 )}
                                                                for="subGroupRemoveId"
                                                                color='flat-danger'
                                                                className="ml-1 p-0 "
                                                                size="sm"
                                                                onClick={() => { handleRemoveItemSubGroupFromTable( item ); }}
                                                            >
                                                                <Trash2 id="subGroupRemoveId" size={16} />
                                                            </Button.Ripple>
                                                        </td>
                                                    </tr>
                                                ) )
                                            }

                                        </tbody>
                                    </Table>

                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </UILoader>

            </CustomModal>
        </div >
    );
};

export default AssignItemSubCategories;

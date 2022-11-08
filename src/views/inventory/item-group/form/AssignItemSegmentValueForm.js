import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/merchandising/others/custom-table.scss';
import { useState } from 'react';
import { PlusSquare, RefreshCw, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Input, Label, Row, Table } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { updateItemSegmentValue } from '../../item-segment-value/store/actions';
import { getItemSegmentValueByItemGroupId, itemSegmentValueOnChange } from '../store/actions';

const AssignItemSegmentValueForm = ( {
    openAssignItemSegmentValueModal,
    toggleAssignItemSegmentValueModalOpen,
    itemSegmentValues,
    itemSegmentsDropdown,
    itemGroupId } ) => {
    const dispatch = useDispatch();
    const {
        itemGroup,
        isItemGroupDataSubmitProgress
    } = useSelector( ( { itemGroups } ) => itemGroups );
    const [segment, setSegment] = useState( null );


    const handleSegmentChange = ( data ) => {
        if ( data ) {
            setSegment( data );
            dispatch( getItemSegmentValueByItemGroupId( itemGroupId, data?.value ) );

        } else {
            setSegment( null );
            dispatch( getItemSegmentValueByItemGroupId( null, null ) );
        }
    };
    const handleSegmentValueAddInputBox = ( segmentId ) => {
        const valueObj = {
            rowId: randomIdGenerator(),
            id: 0,
            itemGroupId,
            segmentId: segment.value,
            value: "",
            isDeleted: false,
            isDeletedSuccess: false,
            isNew: true
        };
        const updatedSegmentValues = [...itemSegmentValues, valueObj];
        dispatch( itemSegmentValueOnChange( updatedSegmentValues ) );

    };
    const handleSegmentValueRemoveInputBox = ( rowId ) => {
        const updatedSegmentValues = itemSegmentValues.map( value => {
            if ( rowId === value.rowId ) {
                //
                value['isDeleted'] = !value.isDeleted;
                value['isDeletedSuccess'] = !value.isDeletedSuccess;
            }
            return value;
        } );
        dispatch( itemSegmentValueOnChange( updatedSegmentValues ) );


    };

    const handleValueOnChange = ( rowId, e ) => {
        const { value } = e.target;
        const updatedSegmentValues = itemSegmentValues.map( sv => {
            if ( rowId === sv.rowId ) {
                sv.value = value;
            }
            return sv;
        } );
        dispatch( itemSegmentValueOnChange( updatedSegmentValues ) );

    };

    const handleSegmentAssignModalSubmit = () => {
        const itemSegmentId = segment.value;
        const submitArray = itemSegmentValues.map( isv => ( {
            id: isv.id,
            value: isv.value,
            isDeleted: isv.isDeleted
        } ) );


        dispatch( updateItemSegmentValue( itemGroupId, itemSegmentId, submitArray ) );
    };

    const handleSegmentAssignModalClose = () => {
        toggleAssignItemSegmentValueModalOpen();
        dispatch( getItemSegmentValueByItemGroupId( null, null ) );
    };

    console.log( JSON.stringify( itemSegmentValues, null, 2 ) );

    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-lg'
                openModal={openAssignItemSegmentValueModal}
                handleMainModelSubmit={handleSegmentAssignModalSubmit}
                handleMainModalToggleClose={handleSegmentAssignModalClose}
                title="Add Item Segment"
                isDisabledBtn={isItemGroupDataSubmitProgress || !itemSegmentValues.length}

            >
                <UILoader blocking={isItemGroupDataSubmitProgress} loader={<ComponentSpinner />} >

                    <Card className="mb-0">
                        <CardBody className="item-segment-value-custom-table">
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <div className="font-weight-bold d-flex justify-content-start ">
                                        <div className="pr-2"> Item Group : <label className="font-weight-bolder pl-1 " >{itemGroup?.groupName}</label>  </div>
                                    </div>
                                    <Label className="font-weight-bolder">Item Segment</Label>
                                    <Select
                                        id='segmentId'
                                        name="segment"
                                        placeholder="Select Item Segment"
                                        isSearchable
                                        menuPosition="fixed"
                                        isClearable
                                        theme={selectThemeColors}
                                        options={itemSegmentsDropdown}
                                        classNamePrefix='dropdown'
                                        className="erp-dropdown-select"
                                        value={segment}
                                        onChange={data => {
                                            handleSegmentChange( data );
                                        }}
                                    />
                                </Col>
                                {
                                    itemSegmentValues &&
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className=" mt-1">
                                        <Table bordered responsive size="sm" >
                                            <thead>
                                                <tr>
                                                    <th>Value</th>
                                                    <th className='text-center' style={{ maxWidth: '20px' }}>Action</th>
                                                </tr>

                                            </thead>
                                            <tbody>
                                                {
                                                    itemSegmentValues.map( i => (
                                                        <tr key={i.rowId}>
                                                            <td className='p-0'>
                                                                <Input
                                                                    type="text"
                                                                    invalid={i.isDeletedSuccess}
                                                                    value={i.value}
                                                                    // disabled={!i.isNew}
                                                                    onChange={( e ) => { handleValueOnChange( i.rowId, e ); }}
                                                                    bsSize="sm"
                                                                />
                                                            </td>
                                                            <td style={{ maxWidth: '20px' }} className='text-center'>
                                                                {/* <Button.Ripple
                                                                id="deleteInputId"
                                                                tag={Label}
                                                                onClick={() => { handleSegmentValueRemoveInputBox( i.rowId ); }}
                                                                className='btn-icon'
                                                                color='flat-success'
                                                            >
                                                                <Trash2 size={20} id="deleteInputId" color="red" />
                                                            </Button.Ripple> */}
                                                                <span className='delete-btn'>
                                                                    {
                                                                        i.isDeletedSuccess ? (
                                                                            <RefreshCw onClick={() => { handleSegmentValueRemoveInputBox( i.rowId ); }} size={20} id="deleteInputId" color="green" />
                                                                        ) : (
                                                                            <Trash2 onClick={() => { handleSegmentValueRemoveInputBox( i.rowId ); }} size={20} id="deleteInputId" color="red" />
                                                                        )
                                                                    }

                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                    )}
                                            </tbody>
                                        </Table>
                                        {/* <Label className="font-weight-bolder">Item value</Label>
                                    {
                                        itemSegmentValues.map( i => (
                                            <Fragment key={i.rowId}>
                                                <div className="d-flex justify-content-center aligns-content-center">
                                                    <Input
                                                        type="text"
                                                        className="mt-1"
                                                        value={i.value}
                                                        onChange={( e ) => { handleValueOnChange( i.rowId, e ); }}
                                                        bsSize="sm"
                                                    />
                                                    <span>
                                                        <Button.Ripple
                                                            id="deleteInputId"
                                                            tag={Label}
                                                            onClick={() => { handleSegmentValueRemoveInputBox( i.rowId ); }}
                                                            className='btn-icon mt-1'
                                                            color='flat-success'
                                                        >
                                                            <Trash2 size={20} id="deleteInputId" color="red" />
                                                        </Button.Ripple>
                                                    </span>
                                                </div>

                                            </Fragment>
                                        ) )
                                    } */}
                                        <Button.Ripple
                                            id="addInputId"
                                            className='btn-icon mr-auto'
                                            tag={Label}
                                            disabled={!segment}
                                            onClick={() => { handleSegmentValueAddInputBox(); }}
                                            color='flat-success'
                                        >
                                            <PlusSquare size={20} id="addInputId" color="green" />
                                        </Button.Ripple>
                                    </Col>
                                }
                            </Row>


                        </CardBody>

                    </Card>
                </UILoader>
            </CustomModal>
        </div >
    );
};

export default AssignItemSegmentValueForm;

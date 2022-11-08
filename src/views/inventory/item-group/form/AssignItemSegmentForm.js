import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/merchandising/others/custom-table.scss';
import classnames from 'classnames';
import { useEffect } from 'react';
import { PlusSquare, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Card, CardBody, Col, CustomInput, Label, Row, Table } from 'reactstrap';
import { CustomInputLabel } from '../../../../utility/custom/CustomInputLabel';
import CustomModal from '../../../../utility/custom/CustomModal';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { updateItemSegment } from '../../item-segment/store/actions';
import { getDropDownSegments } from '../../segment/store/actions';
import { itemSegmentAddToTableRow } from '../store/actions';

const AssignItemSegmentForm = ( {
    openAssignItemSegmentModal,
    toggleAssignItemSegmentModalOpen,
    itemSegments,
    itemGroupId } ) => {
    const dispatch = useDispatch();
    const {
        itemGroup,
        isItemGroupDataSubmitProgress
    } = useSelector( ( { itemGroups } ) => itemGroups );
    const { dropDownSegments } = useSelector( ( { segments } ) => segments );


    useEffect( () => {
        dispatch( getDropDownSegments() );
    }, [] );

    const handleSegmentAddRow = () => {
        const newObj = {
            rowId: randomIdGenerator(),
            itemGroupId,
            itemGroupName: '',
            segmentId: 0,
            segmentName: '',
            segment: null,
            isColorSense: false,
            isSizeSense: false
        };

        const updatedData = [...itemSegments, newObj];
        dispatch( itemSegmentAddToTableRow( updatedData ) );
    };


    const handleSegmentRemove = rowId => {
        const updatedData = [...itemSegments];
        updatedData.splice(
            updatedData.findIndex( x => x.rowId === rowId ),
            1
        );
        dispatch( itemSegmentAddToTableRow( updatedData ) );

    };


    const handleSegmentChange = ( rowId, data ) => {
        const updateData = itemSegments.map( asv => {
            if ( rowId === asv.rowId ) {
                asv.segmentId = data?.value;
                asv.segmentName = data?.label;
                asv.segment = data;
            }
            return asv;
        } );
        dispatch( itemSegmentAddToTableRow( updateData ) );

    };
    const handleColorSenseChange = ( rowId, e ) => {
        const { checked } = e.target;
        const updatedData = itemSegments.map( asv => {
            if ( rowId === asv.rowId ) {
                asv.isColorSense = checked;
                asv.isSizeSense = checked ? false : asv.isSizeSense;
            }
            if ( rowId !== asv.rowId ) {
                asv.isColorSense = false;
            }
            return asv;
        } );
        dispatch( itemSegmentAddToTableRow( updatedData ) );
    };

    const handleSizeSenseChange = ( rowId, e ) => {
        const { checked } = e.target;
        const updatedData = itemSegments.map( asv => {
            if ( rowId === asv.rowId ) {
                asv.isSizeSense = checked;
                asv.isColorSense = checked ? false : asv.isColorSense;
            }
            if ( rowId !== asv.rowId ) {
                asv.isSizeSense = false;
            }
            return asv;
        } );
        dispatch( itemSegmentAddToTableRow( updatedData ) );
    };


    const handleSegmentAssignModalSubmit = () => {
        const submitArray = itemSegments?.map( asv => ( {
            segmentId: asv.segmentId,
            segmentName: asv.segmentName,
            isColorSensitive: asv.isColorSense,
            isSizeSensitive: asv.isSizeSense

        } ) );
        dispatch( updateItemSegment( itemGroupId, submitArray ) );
    };

    const handleSegmentAssignModalClose = () => {
        toggleAssignItemSegmentModalOpen();
    };


    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-lg'
                openModal={openAssignItemSegmentModal}
                handleMainModelSubmit={handleSegmentAssignModalSubmit}
                handleMainModalToggleClose={handleSegmentAssignModalClose}
                title="Add Item Segment"
                isDisabledBtn={isItemGroupDataSubmitProgress}

            >
                <UILoader blocking={isItemGroupDataSubmitProgress} loader={<ComponentSpinner />} >

                    <Card className="mb-0">
                        <CardBody>
                            <Row>
                                <Col className="item-segment-custom-table" xs={12} sm={12} md={12} lg={12} xl={12}  >
                                    <div className="font-weight-bold d-flex justify-content-start ">
                                        <div className="pr-2"> Item Group : <label className="font-weight-bolder pl-1 " >{itemGroup?.groupName}</label>  </div>
                                    </div>
                                    <Table bordered className="text-center mt-1" >
                                        <thead >
                                            <tr>
                                                <th>Segment</th>
                                                <th>Color Sense</th>
                                                <th>Size Sense</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody  >
                                            {itemSegments?.map( ( i, indx ) => (
                                                <tr key={i.rowId}>
                                                    <td>
                                                        <Select
                                                            id='segmentId'
                                                            name="segment"
                                                            placeholder="Select a Segment"
                                                            isSearchable
                                                            menuPosition="fixed"
                                                            isClearable={true}
                                                            theme={selectThemeColors}
                                                            options={dropDownSegments.filter( ii => !itemSegments.some( s => ii.value === s.segmentId ) )}
                                                            classNamePrefix='dropdown'
                                                            className={classnames( 'erp-dropdown-select' )}
                                                            //   defaultInputValue={i.segmentName}
                                                            value={i.segment}
                                                            onChange={data => {
                                                                handleSegmentChange( i.rowId, data );
                                                            }}
                                                        />
                                                    </td>
                                                    <td >
                                                        <span className="d-flex justify-content-center">
                                                            <CustomInput

                                                                label={<CustomInputLabel />}
                                                                id={`colorSenseId-${i.rowId}`}
                                                                name='colorSense'
                                                                type='switch'
                                                                checked={i.isColorSense}
                                                                onChange={e => handleColorSenseChange( i.rowId, e )}
                                                            />
                                                        </span>

                                                    </td>
                                                    <td>
                                                        <span className="d-flex justify-content-center">
                                                            <CustomInput
                                                                label={<CustomInputLabel />}
                                                                id={`sizeSenseId-${i.rowId}`}
                                                                name='sizeSense'
                                                                type='switch'
                                                                checked={i.isSizeSense}
                                                                onChange={e => handleSizeSenseChange( i.rowId, e )}
                                                            />
                                                        </span>
                                                    </td>
                                                    <td style={{ width: "125px" }}>
                                                        <span >
                                                            <Button.Ripple id="deleteSegRowId" tag={Label} onClick={() => { handleSegmentRemove( i.rowId ); }} className='btn-icon p-0' color='flat-danger' >
                                                                <Trash2 size={18} id="deleteSegRowId" color="red" />
                                                            </Button.Ripple>

                                                        </span>
                                                    </td>
                                                </tr>
                                            ) )}

                                        </tbody>

                                    </Table>
                                </Col>
                            </Row>
                            <Row >
                                <Col className="d-flex " xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Button.Ripple
                                        id="AddSegRowId"
                                        tag={Label}
                                        onClick={() => { handleSegmentAddRow(); }}
                                        className='btn-icon ml-auto'
                                        color='flat-success'
                                    >
                                        <PlusSquare size={18} id="AddSegRowId" color="green" />
                                    </Button.Ripple>
                                </Col>
                            </Row>
                        </CardBody>

                    </Card>
                </UILoader>
            </CustomModal>
        </div >
    );
};

export default AssignItemSegmentForm;

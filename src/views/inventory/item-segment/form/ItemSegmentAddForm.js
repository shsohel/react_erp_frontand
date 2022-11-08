import '@custom-styles/merchandising/others/custom-table.scss';
import classNames from 'classnames';
import React, { useState } from 'react';
import { PlusSquare, Trash2 } from 'react-feather';
import Select from 'react-select';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, CustomInput, Label, Row, Table } from 'reactstrap';
import { CustomInputLabel } from '../../../../utility/custom/CustomInputLabel';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';

const selectItemGroup = [
    { value: 1, label: 'Group-1' },
    { value: 2, label: 'Group-2' },
    { value: 3, label: 'Group-3' }
];
const selectItemSubGroup = [
    { value: 1, label: 'Sub-Group-1' },
    { value: 2, label: 'Sub-Group-2' },
    { value: 3, label: 'Sub-Group-3' }
];
const selectItemSegment = [
    { value: 1, label: 'Reference' },
    { value: 2, label: 'Composition' },
    { value: 3, label: 'Construction' }
];
const ItemSegmentAddForm = () => {
    const [itemGroup, setItemGroup] = useState( null );
    const [segment, setSegment] = useState( null );
    const [assignSegmentValue, setAssignSegmentValue] = useState( [] );

    const handleSegmentAddRow = () => {
        const newObj = {
            fieldId: randomIdGenerator(),
            itemGroupId: itemGroup?.value,
            ItemGroupName: itemGroup?.label,
            segmentId: 0,
            segmentName: '',
            segment: null,
            isColorSense: false,
            isSizeSense: false
        };
        setAssignSegmentValue( [...assignSegmentValue, newObj] );
    };


    const handleSegmentRemove = fieldId => {
        const isConfirm = window.confirm( 'Are you sure?' );
        if ( isConfirm ) {
            const updatedData = [...assignSegmentValue];
            updatedData.splice(
                updatedData.findIndex( x => x.fieldId === fieldId ),
                1
            );
            setAssignSegmentValue( updatedData );
        }
    };


    const handleItemGroupChange = ( data ) => {
        setItemGroup( data );
        if ( data ) {
            const newObj =
            {
                fieldId: randomIdGenerator(),
                itemGroupId: data?.value,
                itemGroupName: data?.label,
                segmentId: 0,
                segmentName: '',
                segment: null,
                isColorSense: true,
                isSizeSense: false
            };
            setAssignSegmentValue( [newObj] );
        } else {
            setAssignSegmentValue( [] );
        }

    };


    const handleSegmentChange = ( fieldId, data ) => {
        const updateData = assignSegmentValue.map( asv => {
            if ( fieldId === asv.fieldId ) {
                asv.segmentId = data?.value;
                asv.segment = data;
            }
            return asv;
        } );
        setAssignSegmentValue( updateData );
    };
    const handleColorSenseChange = ( fieldId, e ) => {
        const { checked } = e.target;
        console.log( checked );
        const updateData = assignSegmentValue.map( asv => {
            if ( fieldId === asv.fieldId ) {
                asv.isColorSense = checked ? checked : asv.isColorSense;
                asv.isSizeSense = checked ? false : asv.isSizeSense;
            }
            if ( fieldId !== asv.fieldId ) {
                asv.isColorSense = false;
            }
            return asv;
        } );
        setAssignSegmentValue( updateData );
    };

    const handleSizeSenseChange = ( fieldId, e ) => {
        const { checked } = e.target;
        const updateData = assignSegmentValue.map( asv => {
            if ( fieldId === asv.fieldId ) {
                asv.isSizeSense = checked ? checked : asv.isSizeSense;
                asv.isColorSense = checked ? false : asv.isColorSense;
            }
            if ( fieldId !== asv.fieldId ) {
                asv.isSizeSense = false;
            }
            return asv;
        } );
        setAssignSegmentValue( updateData );
    };

    const handleSubmit = ( params ) => {
        const submitArray = assignSegmentValue?.map( asv => ( {
            CategoryId: asv.itemGroupId,
            CategoryName: asv.itemGroupName,
            segmentId: asv.segmentId,
            segmentName: asv.segmentName,
            isColorSensitive: asv.isColorSense,
            isSizeSensitive: asv.isSizeSense

        } ) );
        console.log( JSON.stringify( submitArray, null, 2 ) );

    };


    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>Item Segment</CardTitle>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Label className="font-weight-bolder">Item Group </Label>
                            <Select
                                id='itemGroupId'
                                name="itemGroup"
                                placeholder="Select Item Group"
                                isSearchable
                                menuPosition='fixed'
                                isClearable
                                theme={selectThemeColors}
                                options={selectItemGroup}
                                classNamePrefix='select'
                                className={classNames( 'react-select' )}
                                value={itemGroup}
                                onChange={data => {
                                    handleItemGroupChange( data );
                                }}
                            />
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col className="item-segment-custom-table" xs={12} sm={12} md={12} lg={12} xl={12} >
                            <Table bordered responsive className="text-center">
                                <thead>
                                    <tr>
                                        <th>Segment</th>
                                        <th>Color Sense</th>
                                        <th>Size Sense</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {assignSegmentValue?.map( ( i, indx ) => (
                                        <tr key={i.fieldId}>
                                            <td>
                                                <Select
                                                    id='segmentId'
                                                    name="segment"
                                                    placeholder="Select a Segment"
                                                    isSearchable
                                                    menuPosition={'fixed'}
                                                    isClearable={true}
                                                    theme={selectThemeColors}
                                                    options={selectItemSegment.filter( ii => !assignSegmentValue.some( s => ii.value === s.segmentId ) )}
                                                    classNamePrefix='select'
                                                    className={classNames( 'react-select' )}

                                                    value={i.segment}
                                                    onChange={data => {
                                                        handleSegmentChange( i.fieldId, data );
                                                    }}
                                                />
                                            </td>
                                            <td >
                                                <span className="d-flex justify-content-center">
                                                    <CustomInput
                                                        label={<CustomInputLabel />}
                                                        id={`colorSenseId-${i.fieldId}`}
                                                        name='colorSense'
                                                        type='switch'
                                                        checked={i.isColorSense}
                                                        onChange={e => handleColorSenseChange( i.fieldId, e )}
                                                    />
                                                </span>

                                            </td>
                                            <td>
                                                <span className="d-flex justify-content-center">
                                                    <CustomInput
                                                        label={<CustomInputLabel />}
                                                        id={`sizeSenseId-${i.fieldId}`}
                                                        name='sizeSense'
                                                        type='switch'
                                                        checked={i.isSizeSense}
                                                        onChange={e => handleSizeSenseChange( i.fieldId, e )}
                                                    />
                                                </span>
                                            </td>
                                            <td style={{ width: "125px" }}>
                                                <span >
                                                    <Button.Ripple id="deleteSegRowId" tag={Label} onClick={() => { handleSegmentRemove( i.fieldId ); }} className='btn-icon' color='flat-danger' >
                                                        <Trash2 size={18} id="deleteSegRowId" color="red" />
                                                    </Button.Ripple>
                                                    <Button.Ripple id="AddSegRowId" tag={Label} disabled={( assignSegmentValue.at( -1 ) !== i )} onClick={() => { handleSegmentAddRow(); }} className='btn-icon' color='flat-success' >
                                                        <PlusSquare size={18} id="AddSegRowId" color="green" />
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
                                id="submitBtnId"
                                className='btn-icon ml-auto mt-1'
                                size="sm"
                                color="primary"
                                onClick={() => { handleSubmit(); }}

                            >
                                Save
                            </Button.Ripple>
                        </Col>
                    </Row>
                </CardBody>

            </Card>
        </div>
    );
};

export default ItemSegmentAddForm;

import '@custom-styles/merchandising/others/custom-table.scss';
import React, { Fragment, useState } from 'react';
import { PlusSquare, Trash2 } from 'react-feather';
import CreatableSelect from 'react-select/creatable';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Row } from 'reactstrap';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
const selectItemCategory = [
    { value: 1, label: 'Category-1' },
    { value: 2, label: 'Category-2' },
    { value: 3, label: 'Category-3' }
];
const selectItemSubCategory = [
    { value: 1, label: 'Sub-Category-1' },
    { value: 2, label: 'Sub-Category-2' },
    { value: 3, label: 'Sub-Category-3' }
];
const selectItemSegment = [
    { value: 1, label: 'Reference' },
    { value: 2, label: 'Composition' },
    { value: 3, label: 'Construction' }
];
const createOption = ( label ) => ( {
    label,
    value: label
} );
const ItemSegmentValueAddForm = () => {
    const [itemCategory, setItemCategory] = useState( null );
    const [segmentValueAssign, setSegmentValueAssign] = useState( null );

    const handleItemCategoryChange = ( data ) => {
        setItemCategory( data );
        if ( data ) {
            const segmentValueObj = {
                categoryId: data?.value,
                segment: null,
                segmentId: 0,
                segmentValues: [
                    {
                        valueId: randomIdGenerator(),
                        input: ''
                    }
                ]
            };
            setSegmentValueAssign( segmentValueObj );
        } else {
            setSegmentValueAssign( null );

        }

    };

    const handleSegmentChange = ( data ) => {
        setSegmentValueAssign( {
            ...segmentValueAssign,
            segment: data,
            segmentId: data?.value
        } );
    };
    const handleSegmentValueAddInputBox = ( segmentId ) => {
        const valueObj = {
            valueId: randomIdGenerator(),
            input: ''
        };

        setSegmentValueAssign( {
            ...segmentValueAssign,
            segmentValues: [...segmentValueAssign.segmentValues, valueObj]
        } );

    };
    const handleSegmentValueRemoveInputBox = ( inputId ) => {
        const segmentValue = [...segmentValueAssign.segmentValues];
        segmentValue.splice(
            segmentValue.findIndex( x => x.valueId === inputId ),
            1
        );
        setSegmentValueAssign( {
            ...segmentValueAssign,
            segmentValues: segmentValue
        } );

    };

    const handleValueOnChange = ( inputId, e ) => {
        const { value } = e.target;
        const { segmentValues } = segmentValueAssign;
        const updatedSegmentValues = segmentValues.map( sv => {
            if ( inputId === sv.valueId ) {
                sv.input = value;
            }
            return sv;
        } );
        setSegmentValueAssign( {
            ...segmentValueAssign,
            segmentValues: updatedSegmentValues
        } );

    };
    const handleSubmit = () => {

        const { segmentValues, categoryId, segmentId } = segmentValueAssign;
        const submitArray = segmentValues.map( sv => ( {
            categoryId,
            segmentId,
            value: sv.input

        } ) );
        console.log( JSON.stringify( submitArray, null, 2 ) );


    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>Assign Item Segment Value</CardTitle>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Label className="font-weight-bolder">Item Group </Label>
                            <CreatableSelect
                                id='itemGroupId'
                                name="itemGroup"
                                placeholder="Select Item Group"
                                isSearchable
                                menuPosition='fixed'
                                isClearable
                                theme={selectThemeColors}
                                options={selectItemCategory}
                                classNamePrefix='dropdown'
                                className="erp-dropdown-select"
                                value={itemCategory}
                                onChange={data => {
                                    handleItemCategoryChange( data );
                                }}
                            />
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Label className="font-weight-bolder">Item Segment</Label>
                            <CreatableSelect
                                id='segmentId'
                                name="segment"
                                placeholder="Select Item Segment"
                                isSearchable
                                menuPosition='fixed'
                                isClearable
                                theme={selectThemeColors}
                                options={selectItemSegment}
                                classNamePrefix='dropdown'
                                className="erp-dropdown-select"
                                value={segmentValueAssign?.segment}
                                onChange={data => {
                                    handleSegmentChange( data );
                                }}
                            />
                        </Col>
                        {
                            segmentValueAssign?.segment &&
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} >
                                <Label className="font-weight-bolder">Item value</Label>
                                {
                                    segmentValueAssign?.segmentValues?.map( i => (
                                        <Fragment key={i.valueId}>
                                            <div className="d-flex justify-content-center aligns-content-center">
                                                <Input
                                                    type="text"
                                                    className="mt-1"
                                                    value={i.input}
                                                    onChange={( e ) => { handleValueOnChange( i.valueId, e ); }}
                                                    bsSize="sm"
                                                />
                                                <span>
                                                    <Button.Ripple
                                                        id="deleteInputId"
                                                        disabled={( segmentValueAssign?.segmentValues.length === 1 )}
                                                        tag={Label}
                                                        onClick={() => { handleSegmentValueRemoveInputBox( i.valueId ); }}
                                                        className='btn-icon mt-1'
                                                        color='flat-success'
                                                    >
                                                        <Trash2 size={20} id="deleteInputId" color="red" />
                                                    </Button.Ripple>
                                                </span>
                                            </div>

                                        </Fragment>
                                    ) )
                                }
                                <Button.Ripple
                                    id="addInputId"
                                    className='btn-icon mr-auto'
                                    tag={Label}
                                    onClick={() => { handleSegmentValueAddInputBox(); }}
                                    color='flat-success'
                                >
                                    <PlusSquare size={20} id="addInputId" color="green" />
                                </Button.Ripple>
                            </Col>
                        }
                    </Row>
                    <Row >
                        <Col className="d-flex " xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Button.Ripple
                                id="submitBtnId"
                                className='btn-icon ml-auto mt-1'
                                size="sm"
                                color="primary"
                                onClick={() => { handleSubmit(); }}
                                disabled={( !segmentValueAssign?.segment )}
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

export default ItemSegmentValueAddForm;

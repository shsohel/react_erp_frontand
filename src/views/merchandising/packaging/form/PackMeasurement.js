import React from 'react';
import { Card, CardBody, Col, Input, Label, Row } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';

const PackMeasurement = ( {
    openModal,
    setOpenModal,
    measurement,
    setMeasurement
} ) => {


    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
    };
    const handleSizeColorRationSubmit = () => {
        setOpenModal( !openModal );
    };

    const handlePackMeasurement = ( e ) => {
        const { value, name } = e.target;
        setMeasurement( {
            ...measurement,
            [name]: Number( value )
        } );

    };
    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-md'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModelSubmit={handleSizeColorRationSubmit}
                handleMainModalToggleClose={handleMainModalToggleClose}
                title="Pack Measurement"
            >
                <Card className="mb-1">
                    <CardBody>
                        <Row>
                            <Col >
                                <Label for="lengthId" className="font-weight-bolder">Length</Label>
                                <Input
                                    id='lengthId'
                                    type='number'
                                    bsSize="sm"
                                    name="length"
                                    value={measurement?.length}
                                    placeholder='0.00'
                                    className='text-right'
                                    onFocus={e => e.target.select()}
                                    onChange={e => { handlePackMeasurement( e ); }}
                                />
                            </Col>
                            <Col >
                                <Label for="widthId" className="font-weight-bolder">Width</Label>
                                <Input
                                    id='widthId'
                                    type='number'
                                    bsSize="sm"
                                    name="width"
                                    value={measurement?.width}
                                    placeholder='0.00'
                                    className='text-right'
                                    onFocus={e => e.target.select()}
                                    onChange={e => { handlePackMeasurement( e ); }}
                                />
                            </Col>
                            <Col >
                                <Label for="heightId" className="font-weight-bolder">Height</Label>
                                <Input
                                    id='heightId'
                                    type='number'
                                    bsSize="sm"
                                    name="height"
                                    value={measurement?.height}
                                    placeholder='0.00'
                                    className='text-right'
                                    onFocus={e => e.target.select()}
                                    onChange={e => { handlePackMeasurement( e ); }}
                                />
                            </Col>
                        </Row>

                    </CardBody>
                </Card>

            </CustomModal>
        </div>
    );
};

export default PackMeasurement;

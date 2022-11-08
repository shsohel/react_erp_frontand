
import React from 'react';
import { Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';


const CmCalculationForEdit = ( { openModal, setOpenModal } ) => {

    const handleMainModelSubmit = () => {
        setOpenModal( !openModal );

    };
    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );

    };
    return (
        <div>

            <CustomModal modalTypeClass='vertically-centered-modal' className='modal-dialog-centered modal-lg' openModal={openModal} setOpenModal={setOpenModal} title="CM Calculation:"
                handleMainModelSubmit={handleMainModelSubmit}
                handleMainModalToggleClose={handleMainModalToggleClose}
            >
                <Card outline >
                    <CardBody>
                        <Row>
                            <Col sm='6'>
                                <FormGroup row>
                                    <Label className="font-weight-bold" size='sm' sm='4' for='smv'>
                                        SMV:
                                    </Label>
                                    <Col sm='8'>
                                        <Input type='number' id='smv' bsSize='sm' placeholder='0.000' />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='efficiency'>
                                        Efficiency:
                                    </Label>
                                    <Col sm='8'>
                                        <Input type='number' id='efficiency' bsSize='sm' placeholder='0.000' />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='smv'>
                                        Per. Min. Cost:
                                    </Label>
                                    <Col sm='8'>
                                        <Input type='number' id='smv' bsSize='sm' placeholder='0.000' />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='pcs'>
                                        Pcs:
                                    </Label>
                                    <Col sm='8'>
                                        <Input type='number' id='pcs' bsSize='sm' placeholder='0.000' />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='cm'>
                                        CM:
                                    </Label>
                                    <Col sm='8'>
                                        <Input type='number' id='cm' bsSize='sm' placeholder='0.000' />
                                    </Col>
                                </FormGroup>

                            </Col>

                            <Col sm='6'>
                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='noFmc'>
                                        No of Mc:
                                    </Label>
                                    <Col sm='8'>
                                        <Input type='number' id='noFmc' bsSize='sm' placeholder='0.000' />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='productivity'>
                                        Productivity:
                                    </Label>
                                    <Col sm='8'>
                                        <Input type='number' id='productivity' bsSize='sm' placeholder='0.000' />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='minCost'>
                                        Per. Min. Cost:
                                    </Label>
                                    <Col sm='8'>
                                        <Input type='number' id='minCost' bsSize='sm' placeholder='0.000' />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='pcs'>
                                        Pcs:
                                    </Label>
                                    <Col sm='8'>
                                        <Input type='number' id='pcs' bsSize='sm' placeholder='0.000' />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='cm'>
                                        CM:
                                    </Label>
                                    <Col sm='8'>
                                        <Input type='number' id='cm' bsSize='sm' placeholder='0.000' />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

            </CustomModal>
        </div>
    );
};

export default CmCalculationForEdit;


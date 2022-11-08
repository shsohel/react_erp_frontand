import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { bindCMCalculationForMachineInputOnChange, bindCMCalculationForSVMInputOnChange, bindCostingSummaryInputOnChange } from '../store/action';


const CmCalculationForEdit = ( { openModal, setOpenModal, sumOfBuyerAmountTotal } ) => {
    const dispatch = useDispatch();
    const { costingGroupsSummary, cmCalculationForMachine, cmCalculationForSMV } = useSelector( ( { costings } ) => costings );


    const handleMainModelSubmit = () => {
        setOpenModal( !openModal );
        const cmValue = cmCalculationForSMV?.cm !== 0 || null ? cmCalculationForSMV?.cm : cmCalculationForMachine?.cm;
        //  handleCMOnChange( cmValue );
        const prevCmValue = costingGroupsSummary.find( cgs => cgs.name === "CM" ).buyerAmount;
        const per = ( cmValue * 100 ) / ( sumOfBuyerAmountTotal() + cmValue - prevCmValue );
        const updatedData = costingGroupsSummary.map( i => {
            if ( 'CM' === i.name ) {
                i['buyerAmount'] = isNaN( cmValue ) ? 0 : isFinite( cmValue ) ? cmValue : 0;
                i['inHouseAmount'] = isNaN( cmValue ) ? 0 : isFinite( cmValue ) ? cmValue : 0;
                i['inPercentage'] = isNaN( per ) ? 0 : isFinite( cmValue ) ? per : 0;
            }
            return i;
        } );
        dispatch( bindCostingSummaryInputOnChange( updatedData ) );
        //    dispatch( bindCMCalculationForSVMInputOnChange( null ) );

    };
    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
        dispatch( bindCMCalculationForMachineInputOnChange( null ) );
        dispatch( bindCMCalculationForSVMInputOnChange( null ) );
    };

    const handleInputOnChangeForSVM = ( e ) => {
        const { name, value, type } = e.target;
        const { smv, efficiency, perMinCost, pcs, cm } = cmCalculationForSMV;

        const cmValue = name === "smv" ? ( ( Number( value ) * perMinCost ) / efficiency ) : name === "perMinCost" ? ( ( smv * Number( value ) ) / efficiency ) : name === "efficiency" ? ( ( smv * perMinCost ) / Number( value ) ) : name === "pcs" && ( Number( value ) === 0 ? ( ( smv * perMinCost ) / efficiency ) : ( cm * Number( value ) ) );

        const updatedObj = {
            ...cmCalculationForSMV,
            ["cm"]: isNaN( cmValue ) ? 0 : isFinite( cmValue ) ? cmValue : 0,
            [name]: Number( value )
        };

        dispatch( bindCMCalculationForSVMInputOnChange( updatedObj ) );
        dispatch( bindCMCalculationForMachineInputOnChange( null ) );


    };
    const handleInputOnChangeForMachine = ( e ) => {
        const { name, value, type } = e.target;
        const { noOfMachine, productivity, perMinCost, pcs, cm } = cmCalculationForMachine;
        const cmValue = name === 'noOfMachine' ? ( ( Number( value ) * perMinCost ) / productivity ) : name === 'perMinCost' ? ( ( noOfMachine * Number( value ) ) / productivity ) : name === 'productivity' ? ( ( noOfMachine * perMinCost ) / Number( value ) ) : name === "pcs" && ( Number( value ) === 0 ? ( ( noOfMachine * perMinCost ) / productivity ) : ( cm * Number( value ) ) );

        const updatedObj = {
            ...cmCalculationForMachine,
            ["cm"]: isNaN( cmValue ) ? 0 : isFinite( cmValue ) ? cmValue : 0,
            [name]: type === 'number' ? Number( value ) : value
        };

        dispatch( bindCMCalculationForMachineInputOnChange( updatedObj ) );
        dispatch( bindCMCalculationForSVMInputOnChange( null ) );
    };


    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-lg'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModelSubmit={handleMainModelSubmit}
                handleMainModalToggleClose={handleMainModalToggleClose}
                title="CM Calculation:"
            >
                <Card outline className="mb-0" >
                    <CardBody>
                        <Row>
                            <Col sm='6'>
                                <FormGroup row>
                                    <Label className="font-weight-bold" size='sm' sm='4' for='smv'>
                                        SMV:
                                    </Label>
                                    <Col sm='8'>
                                        <Input
                                            id='smv'
                                            type='number'
                                            name="smv"
                                            bsSize='sm'
                                            placeholder='0.000'
                                            value={cmCalculationForSMV.smv}
                                            onFocus={( e ) => { e.target.select(); }}
                                            onChange={( e ) => { handleInputOnChangeForSVM( e ); }}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='efficiency'>
                                        Efficiency:
                                    </Label>
                                    <Col sm='8'>
                                        <Input
                                            type='number'
                                            id='efficiency'
                                            name='efficiency'
                                            bsSize='sm'
                                            placeholder='0.000'
                                            value={cmCalculationForSMV.efficiency}
                                            onFocus={( e ) => { e.target.select(); }}
                                            onChange={( e ) => { handleInputOnChangeForSVM( e ); }}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='smv'>
                                        Per. Min. Cost:
                                    </Label>
                                    <Col sm='8'>
                                        <Input
                                            type='number'
                                            id='smv'
                                            name="perMinCost"
                                            bsSize='sm'
                                            placeholder='0.000'
                                            value={cmCalculationForSMV.perMinCost}
                                            onFocus={( e ) => { e.target.select(); }}
                                            onChange={( e ) => { handleInputOnChangeForSVM( e ); }}

                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='pcs'>
                                        Pcs:
                                    </Label>
                                    <Col sm='8'>
                                        <Input
                                            type='number'
                                            id='pcs'
                                            name="pcs"
                                            bsSize='sm'
                                            placeholder='0.000'

                                            value={cmCalculationForSMV.pcs}
                                            onFocus={( e ) => { e.target.select(); }}
                                            onChange={( e ) => { handleInputOnChangeForSVM( e ); }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col sm='6'>
                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='noFmc'>
                                        No of Mc:
                                    </Label>
                                    <Col sm='8'>
                                        <Input
                                            type='number'
                                            id='noOfMachine'
                                            name="noOfMachine"
                                            bsSize='sm'
                                            placeholder='0.000'
                                            value={cmCalculationForMachine.noOfMachine}
                                            onFocus={( e ) => { e.target.select(); }}
                                            onChange={( e ) => { handleInputOnChangeForMachine( e ); }}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='productivity'>
                                        Productivity:
                                    </Label>
                                    <Col sm='8'>
                                        <Input
                                            type='number'
                                            id='productivity'
                                            name="productivity"
                                            bsSize='sm'
                                            placeholder='0.000'
                                            value={cmCalculationForMachine.productivity}
                                            onFocus={( e ) => { e.target.select(); }}
                                            onChange={( e ) => { handleInputOnChangeForMachine( e ); }}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='minCost'>
                                        Per. Min. Cost:
                                    </Label>
                                    <Col sm='8'>
                                        <Input
                                            type='number'
                                            id='perMinCost'
                                            name="perMinCost"
                                            bsSize='sm'
                                            placeholder='0.000'
                                            value={cmCalculationForMachine.perMinCost}
                                            onFocus={( e ) => { e.target.select(); }}
                                            onChange={( e ) => { handleInputOnChangeForMachine( e ); }}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label sm='4' className="font-weight-bold" size='sm' for='pcs'>
                                        Pcs:
                                    </Label>
                                    <Col sm='8'>
                                        <Input
                                            type='number'
                                            id='pcs'
                                            name="pcs"
                                            bsSize='sm'
                                            placeholder='0.000'
                                            value={cmCalculationForMachine.pcs}
                                            onFocus={( e ) => { e.target.select(); }}
                                            onChange={( e ) => { handleInputOnChangeForMachine( e ); }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup row>
                                    <Label sm='2' className="font-weight-bold" size='sm' for='cm'>
                                        CM:
                                    </Label>
                                    <Col sm='10'  >
                                        <p style={{ padding: '0.37rem', paddingLeft: '0.6rem' }} className="border rounded font-weight-bold">{cmCalculationForSMV?.cm !== 0 || null ? Number( cmCalculationForSMV?.cm.toFixed( 4 ) ) : Number( cmCalculationForMachine?.cm.toFixed( 4 ) )}</p>
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

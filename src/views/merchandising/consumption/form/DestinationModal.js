import '@custom-styles/merchandising/others/custom-table.scss';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, CustomInput, FormGroup, Row, Table } from 'reactstrap';
import { CustomInputLabel } from '../../../../utility/custom/CustomInputLabel';
import CustomModal from '../../../../utility/custom/CustomModal';
import { notify } from '../../../../utility/custom/notifications';
import { bindConsumptionAccessoriesDetails, bindConsumptionFabricDetails } from '../store/actions';

const DestinationModal = ( { openModal, setOpenModal, destinationModalObj, setDestinationModalObj } ) => {
    const dispatch = useDispatch();
    const {
        consumptionFabricDetails,
        consumptionAccessoriesDetails

    } = useSelector( ( { consumptions } ) => consumptions );

    const allDestination = destinationModalObj?.destination?.every( d => d.isSelected );


    const handleModelSubmit = () => {
        console.log( destinationModalObj.rowId );
        const updateDestination = destinationModalObj?.destination.filter( des => des.isSelected === true ).map( d => d.label );

        if ( !updateDestination.length ) {
            notify( 'error', `Please select at least a Destination` );

        } else {
            if ( destinationModalObj.type === 'Fabric' ) {
                const updatedData = consumptionFabricDetails.map( fabric => {
                    if ( destinationModalObj.rowId === fabric.fieldId ) {
                        fabric['applicableDestinations'] = updateDestination;
                        fabric['isAllDestinationApplicable'] = allDestination;
                    }
                    return fabric;
                } );

                console.log( updatedData );

                dispatch( bindConsumptionFabricDetails( updatedData ) );
                setDestinationModalObj( null );

            } else {
                const updatedData = consumptionAccessoriesDetails.map( acc => {
                    if ( destinationModalObj.rowId === acc.fieldId ) {
                        acc['applicableDestinations'] = updateDestination;
                        acc['isAllDestinationApplicable'] = allDestination;
                    }
                    return acc;
                } );

                dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
                setDestinationModalObj( null );

            }

            setOpenModal( !openModal );
        }


    };
    const handleModalToggleClose = () => {
        setOpenModal( !openModal );
    };


    const handleAllDestination = ( e ) => {
        const { checked } = e.target;
        const updatedData = destinationModalObj?.destination.map( des => ( { ...des, isSelected: checked } ) );
        const obj = {
            ...destinationModalObj,
            destination: updatedData
        };
        setDestinationModalObj( obj );
    };

    const handleDestination = ( e, id ) => {
        const { checked } = e.target;
        const updatedData = destinationModalObj?.destination.map( des => {
            if ( id === des.value ) {
                des['isSelected'] = checked;
            }
            return des;
        } );
        console.log( updatedData );
        const obj = {
            ...destinationModalObj,
            destination: updatedData
        };
        setDestinationModalObj( obj );
    };


    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog modal-md'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModelSubmit={handleModelSubmit}
                handleMainModalToggleClose={handleModalToggleClose}
                title="Applicable Colors and Sizes"
            >
                <div>
                    <Row >
                        <Col lg={6} md={6} xs={6} sm={6} >
                            <FormGroup row className="text-nowrap pl-1">
                                <Col >
                                    <FormGroup >
                                        <CustomInput
                                            type='switch'
                                            label={<CustomInputLabel />}
                                            id='icon-color'
                                            name='icon-color'
                                            inline
                                            checked={allDestination}

                                            onChange={( e ) => { handleAllDestination( e ); }}
                                        >All Destination</CustomInput>

                                    </FormGroup>
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table responsive size="sm" bordered style={{ border: 'solid 1px' }} className="custom-table">
                                <thead>
                                    <tr className="thead-light "  >
                                        <th className="text-nowrap text-left">Destination</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td className="align-top">
                                            <div className="overflow-div">
                                                {destinationModalObj?.destination?.map( c => (
                                                    <div key={c.value} style={{ padding: '0.3rem' }}>
                                                        <CustomInput
                                                            type='checkbox'
                                                            className='custom-control-Primary'
                                                            id={c.value}
                                                            label={c.label}
                                                            name={c.label}
                                                            htmlFor={c.value}
                                                            // defaultChecked
                                                            checked={c.isSelected}
                                                            inline
                                                            onChange={( e ) => { handleDestination( e, c.value ); }}
                                                        />
                                                    </div>
                                                ) )}

                                            </div>
                                        </td>

                                    </tr>
                                </tbody>
                            </Table>
                        </Col>

                    </Row>
                </div>

            </CustomModal>
        </div>
    );
};

export default DestinationModal;
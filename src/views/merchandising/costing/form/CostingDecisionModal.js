import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { CustomInput } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { selectThemeColors } from '../../../../utility/Utils';
import { getCostingSizeGroupAndColorsHistory } from '../store/action';
const selectExitingCosting = [
    { value: 'Costing-1011', label: "Costing-1011" },
    { value: 'Costing-1022', label: "Costing-1022" },
    { value: 'Costing-1033', label: "Costing-1033" }

];

const defaultDecisionValue = {
    isNewCosting: true,
    isExitingCosting: false
};
const CostingDecisionModal = ( { openModal, setOpenModal, setFormDecision } ) => {
    const dispatch = useDispatch();
    const { costingBasicInfo } = useSelector( ( { costings } ) => costings );
    const [makingDecision, setMakingDecision] = useState( defaultDecisionValue );

    const [exitingCostings, setExitingCostings] = useState( null );

    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
        setFormDecision( null );
    };

    const handleDecisionSubmit = () => {
        setOpenModal( !openModal );
        setFormDecision( makingDecision );
        dispatch( getCostingSizeGroupAndColorsHistory( costingBasicInfo?.orderId, costingBasicInfo?.styleId ) );
    };

    const handleDecisionChange = ( e ) => {
        const { value, name } = e.target;

        if ( name === "isNewCosting" ) {
            setMakingDecision( {
                isNewCosting: value,
                isExitingCosting: !value
            } );

        } else {
            setMakingDecision( {
                isNewCosting: !value,
                isExitingCosting: value
            } );
            setExitingCostings( null );
        }

    };


    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-sm'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModalToggleClose={handleMainModalToggleClose}
                handleMainModelSubmit={handleDecisionSubmit}
                title="New Costing"
            >
                <div style={{ minHeight: '120px' }}>
                    <CustomInput
                        name="isNewCosting"
                        type='radio'
                        className='custom-control-success m-1 font-weight-bold'
                        id='isNewCostingID'
                        label='New Costing'
                        checked={makingDecision.isNewCosting}
                        onChange={e => handleDecisionChange( e )}
                    />
                    <CustomInput
                        name="isExitingCosting"
                        type='radio'
                        className='custom-control-success m-1 font-weight-bold'
                        id='isExitingCostingId'
                        label='From Exiting Costing'
                        checked={makingDecision.isExitingCosting}
                        onChange={e => handleDecisionChange( e )}

                    />
                    {
                        makingDecision.isExitingCosting &&
                        <Select
                            placeholder="Select an Exiting Costing"
                            id='styleId'
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={selectExitingCosting}
                            classNamePrefix='select'
                            className="m-1"
                            value={exitingCostings}
                            onChange={data => {
                                setExitingCostings( data );
                            }}
                        />
                    }

                </div>

            </CustomModal>

        </div>
    );
};

export default CostingDecisionModal;

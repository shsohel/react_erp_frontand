import React from 'react';
import { Col, Row } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';

const CostingDetailModal = ( { openModal, setOpenModal } ) => {
    const handleModelSubmit = () => {
        setOpenModal( !openModal );
    };
    const handleModalToggleClose = () => {
        setOpenModal( !openModal );
    };
    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog modal-xl'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModelSubmit={handleModelSubmit}
                handleMainModalToggleClose={handleModalToggleClose}
                title="Costing Details"
            >
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    </Col>
                </Row>

            </CustomModal>
        </div>
    );
};

export default CostingDetailModal;
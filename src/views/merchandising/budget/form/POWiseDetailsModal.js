import React from 'react';
import { Table } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';

export const POWiseDetailsModal = ( { openModal, setOpenModal } ) => {

    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
    };
    const handleModalSubmit = () => {
        setOpenModal( !openModal );
    };


    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-lg'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModalToggleClose={handleMainModalToggleClose}
                handleMainModelSubmit={handleModalSubmit}
                title="PO Wise Details"
            >
                <div className='custom-table'>
                    <Table responsive bordered className="text-center">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Style No</th>
                                <th>PO NO</th>
                                <th>Request Amount</th>
                                <th>Costing Amount</th>
                                <th>Tolerance Amount</th>
                                <th>Costing Amount with Tolerance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>SH-654</td>
                                <td>6542</td>
                                <td>0.0000</td>
                                <td>0.0000</td>
                                <td>0.0000</td>
                                <td>0.0000</td>

                            </tr>
                        </tbody>

                    </Table>
                </div>


            </CustomModal>
        </div>
    );
};

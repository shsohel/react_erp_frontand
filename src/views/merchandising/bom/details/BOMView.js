import '@custom-styles/merchandising/others/custom-table.scss';
import '@custom-styles/merchandising/others/pre-costing-collapse.scss';
import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import '@custom-styles/merchandising/select/pre-costing-select.scss';
import _ from 'lodash';
import React from 'react';
import { Card, CardBody, Col, Row, Table } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';

const BOMView = ( { openBomViewModal, toggleBomViewModalOpen, data } ) => {

    const handleSegmentAssignModalSubmit = () => {
        toggleBomViewModalOpen();
    };
    const handleSegmentAssignModalClose = () => {
        toggleBomViewModalOpen();
    };
    const groupByGroupName = _.groupBy( data?.bomDetails, function ( d ) {
        return d.groupName;
    } );
    return (
        <>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-xl'
                openModal={openBomViewModal}
                handleMainModelSubmit={handleSegmentAssignModalSubmit}
                handleMainModalToggleClose={handleSegmentAssignModalClose}
                title="BOM Details"
            >
                <Card className="p-0 ">
                    <CardBody >
                        <Row className="p-0">
                            <Col lg='12' className='pr-0 mt-xl-0 mb-2 font-weight-bold'>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className='pr-1'>BOM No</td>
                                            <td>
                                                <span >: {data?.bomNumber}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='pr-1 '>PO No</td>
                                            <td>: {data?.orderNumber}</td>
                                        </tr>
                                        <tr>
                                            <td className='pr-1'>Buyer</td>
                                            <td>: {data?.buyerName}</td>
                                        </tr>
                                        <tr>
                                            <td className='pr-1'>Purchase Order Date</td>
                                            <td>: 20-May-2021</td>
                                        </tr>
                                        <tr>
                                            <td className='pr-1'>Style No</td>
                                            <td>: {data?.stylesNumber}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>


                        <Table size="sm" bordered responsive className='custom-table '>
                            <thead className="thead-secondary text-capitalize" >
                                <tr >
                                    <th className='text-center'><strong>Bom Item Group</strong></th>
                                    <th className='text-center'><strong>Item Group</strong></th>
                                    <th className='text-center'><strong>Item Sub Group</strong></th>
                                    <th className='text-center'><strong>Item Description</strong></th>
                                    <th className='text-center'><strong>Required Quantity</strong></th>
                                    <th className='text-center'><strong>UOM</strong></th>
                                </tr>
                            </thead>
                            <tbody className="text-center" >
                                {
                                    Object.keys( groupByGroupName ).map( ( bom ) => {
                                        return groupByGroupName[bom].map( ( bomDetails, index ) => ( index === 0 ? (
                                            <tr key={index + 1} className='text-left pl-1'>
                                                <td rowSpan={groupByGroupName[bom].length} className='text-center'>
                                                    {bomDetails.groupName}
                                                </td>
                                                <td>
                                                    {bomDetails.itemGroup}
                                                </td>
                                                <td>
                                                    {bomDetails.itemSubGroup}
                                                </td>
                                                <td className='text-left' >
                                                    {bomDetails.itemDescription}
                                                </td>
                                                <td  >
                                                    {bomDetails.bomQuantity}
                                                </td>
                                                <td  >
                                                    {bomDetails.bomUom}
                                                </td>
                                            </tr>
                                        ) : <tr key={index + 1} className='text-left'>
                                            <td>
                                                {bomDetails.itemGroup}
                                            </td>
                                            <td  >
                                                {bomDetails.itemSubGroup}
                                            </td>
                                            <td className='text-left' >
                                                {bomDetails.itemDescription}
                                            </td>
                                            <td  >
                                                {bomDetails.bomQuantity}
                                            </td>
                                            <td  >
                                                {bomDetails.bomUom}
                                            </td>
                                        </tr> ) );
                                    } )
                                }
                                {/* {
                                    data?.bomDetails?.map( ( bom, index ) => (
                                        <tr key={index + 1} >
                                            <td  >
                                                {bom.groupName}
                                            </td>
                                            <td  >
                                                {bom.itemGroupId}
                                            </td>
                                            <td  >
                                                {bom.itemSubGroupId}
                                            </td>
                                            <td className='text-left' >
                                                {bom.itemDescription}
                                            </td>
                                            <td  >
                                                {bom.bomQuantity}
                                            </td>
                                            <td  >
                                                {bom.bomUom}
                                            </td>
                                        </tr>
                                    ) )
                                } */}

                            </tbody>
                        </Table>
                    </CardBody>

                </Card>
            </CustomModal>
        </>
    );
};

export default BOMView;

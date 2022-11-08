import '@custom-styles/merchandising/others/custom-table.scss';
import '@custom-styles/merchandising/others/pre-costing-collapse.scss';
import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import '@custom-styles/merchandising/select/pre-costing-select.scss';
import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Card, Col, Row, Table } from 'reactstrap';


const BOMGenerateAndView = () => {
    const { replace } = useHistory();
    const { selectedBom } = useSelector( ( { boms } ) => boms );
    console.log( selectedBom );
    const groupByGroupName = _.groupBy( selectedBom?.bomDetails, function ( d ) {
        return d.groupName;
    } );
    return (
        <> {
            selectedBom ? (
                <div>
                    <Card className="p-1" >
                        <div className="divider divider-left divider-secondary">
                            <div className="divider-text text-secondary font-weight-bolder">BOM Information</div>
                        </div>
                        <div className="border rounded rounded-3 p-1 ">
                            <Row className="p-0">
                                <Col lg='12' className='pr-0 mt-xl-0 mb-2 font-weight-bold'>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className='pr-1'>BOM No</td>
                                                <td>
                                                    <span >: {selectedBom?.bomNumber}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='pr-1 '>PO No</td>
                                                <td>: {selectedBom?.orderNumber}</td>
                                            </tr>
                                            <tr>
                                                <td className='pr-1'>Buyer</td>
                                                <td>: {selectedBom?.buyerName}</td>
                                            </tr>
                                            <tr>
                                                <td className='pr-1'>Purchase Order Date</td>
                                                <td>: 20-May-2021</td>
                                            </tr>
                                            <tr>
                                                <td className='pr-1'>Style No</td>
                                                <td>: {selectedBom?.stylesNumber}</td>
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

                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </div>
            ) : null
        }

        </>
    );
};

export default BOMGenerateAndView;


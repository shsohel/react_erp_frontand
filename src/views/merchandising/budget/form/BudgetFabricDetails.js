import _ from 'lodash';
import { Fragment, useState } from 'react';
import { Maximize2, Minimize2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Collapse, Label, Table } from 'reactstrap';
import { isZeroToFixed } from '../../../../utility/Utils';
import { getBudgetDetailsByGroupType } from '../store/actions';
import { POWiseDetailsModal } from './POWiseDetailsModal';


export const BudgetFabricDetails = () => {
    const dispatch = useDispatch();
    const [openPOWiseDetailsModal, setOpenPOWiseDetailsModal] = useState( false );

    const { budgetCostingAndBomSummaryDetails, budgetPurchaseOrderQuantityDetails } = useSelector( ( { budgets } ) => budgets );


    const handleCollapsibleTableOpen = ( rowId, itemGroupId, itemSubGroupId, isRowOpen ) => {
        dispatch( getBudgetDetailsByGroupType( rowId, "Fabric", itemGroupId, itemSubGroupId, isRowOpen ) );
    };

    const handlePOWiseDetailsOpen = () => {
        setOpenPOWiseDetailsModal( !openPOWiseDetailsModal );
    };

    const totalOrderQuantity = _.sum( budgetPurchaseOrderQuantityDetails?.map( order => Number( order.orderQuantity ) ) );

    return (
        <div >
            <Table responsive bordered className="custom-table text-center ">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Item Group</th>
                        <th>Item Sub-Group</th>
                        <th>Costing Amount</th>
                        <th>BOM Amount</th>
                        <th>Additional BOM Amount</th>
                        <th>Costing/PC(Avg)</th>
                        <th>BOM Amount/PC(Avg)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        budgetCostingAndBomSummaryDetails.filter( f => f.groupName === "Fabric" ).map( ( fabric, index ) => (
                            <Fragment key={index + 1}>
                                <tr className={fabric.totalCostingAmount < fabric.totalBomAmount ? 'bg-light-danger font-weight-bold' : ''}  >
                                    <td style={{ width: '4px' }} >
                                        <Button.Ripple for="collapseId" tag={Label}
                                            onClick={() => { handleCollapsibleTableOpen( fabric.rowId, fabric.itemGroupId, fabric.itemSubGroupId, fabric.isRowOpen ); }} className='btn-icon p-0' color='flat-primary' >
                                            <Maximize2 className={fabric.isRowOpen ? 'd-none' : 'd'} id="collapseId" size={15} color="#7367f0" />
                                            <Minimize2 className={fabric.isRowOpen ? 'd' : 'd-none'} id="collapseId" size={15} color="#28c76f" />
                                        </Button.Ripple>

                                    </td>
                                    <td>{fabric.itemGroup}</td>
                                    <td>{fabric.itemSubGroup}</td>
                                    <td className='text-right' >{isZeroToFixed( fabric.totalCostingAmount, 4 )}</td>
                                    <td className='text-right' >{isZeroToFixed( fabric.totalBomAmount, 4 )}</td>
                                    <td className='text-right' >0</td>
                                    <td className='text-right' >{isZeroToFixed( fabric.avgCostingRate, 4 )}</td>
                                    <td className='text-right' >{isZeroToFixed( fabric.avgBomRate, 4 )}</td>
                                    <td>
                                        <Button.Ripple
                                            for="searchId"
                                            tag={Label}
                                            onClick={() => { handlePOWiseDetailsOpen(); }}
                                            className='btn-icon p-0' color='flat-primary'
                                        >
                                            {/* <Search id="searchId" size={15} color="#7367f0" /> */}
                                        </Button.Ripple>

                                    </td>
                                </tr>
                                <tr >
                                    <td colSpan={8} className={fabric.isRowOpen ? 'p-2' : ''}>
                                        {
                                            budgetCostingAndBomSummaryDetails.some( ( i => i.rowId === i.rowId ) ) && (
                                                <Collapse isOpen={fabric.isRowOpen}>
                                                    <Table bordered >
                                                        <thead className="text-center">
                                                            <tr>
                                                                <th>Style</th>
                                                                <th>Item Description</th>
                                                                <th>BOM Amount</th>
                                                                <th>Additional BOM Amount</th>
                                                                <th>BOM Amount /PC(avg)</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody className="text-center">
                                                            {fabric?.details?.map( ( ( s, index ) => (
                                                                <tr key={index + 1}>
                                                                    <td>
                                                                        {s.styleNumber}
                                                                    </td>
                                                                    <td className="text-left">{s.itemDescription}</td>
                                                                    <td className='text-right'>{isZeroToFixed( s.totalBomAmount, 4 )}</td>
                                                                    <td className='text-right'>0</td>
                                                                    <td className='text-right' >{isZeroToFixed( s.avgBomRate, 4 )}</td>
                                                                </tr>
                                                            ) ) )}
                                                            <tr className='font-weight-bolder bg-light-primary text-right'>
                                                                <td className='text-right font' colSpan={2}>Total</td>
                                                                <td>{isZeroToFixed( _.sum( fabric?.details.map( fab => fab.totalBomAmount ) ), 4 )}</td>
                                                                <td colSpan={2}></td>
                                                            </tr>

                                                        </tbody>
                                                    </Table>

                                                </Collapse>
                                            )
                                        }
                                    </td>
                                </tr>
                            </Fragment>
                        ) )
                    }
                    {
                        budgetCostingAndBomSummaryDetails.length ? <tr className='font-weight-bolder text-right'>
                            <td>Total</td>
                            <td></td>
                            <td></td>
                            <td>{isZeroToFixed( _.sum( budgetCostingAndBomSummaryDetails.filter( f => f.groupName === "Fabric" ).map( acc => acc.totalCostingAmount ) ), 4 )}</td>
                            <td>{isZeroToFixed( _.sum( budgetCostingAndBomSummaryDetails.filter( f => f.groupName === "Fabric" ).map( bom => bom.totalBomAmount ) ), 4 )}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr> : <tr >
                            <td className='text-center' colSpan={9}>
                                There are no Fabrics records to display
                            </td>

                        </tr>
                    }


                </tbody>

            </Table>
            <POWiseDetailsModal
                openModal={openPOWiseDetailsModal}
                setOpenModal={setOpenPOWiseDetailsModal}
            />
        </div >
    );
};

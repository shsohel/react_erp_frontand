import _ from 'lodash';
import { Fragment, useState } from 'react';
import { Maximize2, Minimize2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Collapse, Label, Table } from 'reactstrap';
import { isZeroToFixed, randomIdGenerator } from '../../../../utility/Utils';
import { getBudgetDetailsByGroupType } from '../store/actions';
import { POWiseDetailsModal } from './POWiseDetailsModal';
const fabricInitial = [
    {
        id: randomIdGenerator(),
        itemGroup: 'Knit Fabric',
        itemSubGroup: 'Knit Fabric',
        preCostingAmount: 57487.44,
        bomAmount: 544,
        additionalBomAmount: 54,
        isRowOpen: false
    },
    {
        id: randomIdGenerator(),
        itemGroup: 'Knit Fabric KG',
        itemSubGroup: 'Knit Fabric KG',
        preCostingAmount: 57487.44,
        bomAmount: 600,
        additionalBomAmount: 58,
        isRowOpen: false
    }
];

export const BudgetPackDetails = () => {
    const dispatch = useDispatch();
    const [budgetFabricDetails, setBudgetFabricDetails] = useState( fabricInitial );
    const [openPOWiseDetailsModal, setOpenPOWiseDetailsModal] = useState( false );

    const { budgetCostingAndBomSummaryDetails, budgetPurchaseOrderQuantityDetails } = useSelector( ( { budgets } ) => budgets );


    const handleCollapsibleTableOpen = ( rowId, itemGroupId, itemSubGroupId, isRowOpen ) => {
        dispatch( getBudgetDetailsByGroupType( rowId, "Packaging", itemGroupId, itemSubGroupId, isRowOpen ) );
    };

    const handlePOWiseDetailsOpen = () => {
        setOpenPOWiseDetailsModal( !openPOWiseDetailsModal );
    };

    const totalOrderQuantity = _.sum( budgetPurchaseOrderQuantityDetails?.map( order => Number( order.orderQuantity ) ) );


    return (
        <div>
            <Table responsive bordered className="custom-table text-center">
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
                        budgetCostingAndBomSummaryDetails.filter( f => f.groupName === "Packaging" ).map( ( pack, index ) => (
                            <Fragment key={index + 1}>
                                <tr className={pack.totalCostingAmount < pack.totalBomAmount ? 'bg-light-danger font-weight-bold' : ''}  >
                                    <td style={{ width: '4px' }} >
                                        <Button.Ripple for="collapseId" tag={Label}
                                            onClick={() => { handleCollapsibleTableOpen( pack.rowId, pack.itemGroupId, pack.itemSubGroupId, pack.isRowOpen ); }}
                                            className='btn-icon p-0'
                                            color='flat-primary' >
                                            <Maximize2 className={pack.isRowOpen ? 'd-none' : 'd'} id="collapseId" size={15} color="#7367f0" />
                                            <Minimize2 className={pack.isRowOpen ? 'd' : 'd-none'} id="collapseId" size={15} color="#28c76f" />
                                        </Button.Ripple>

                                    </td>
                                    <td>{pack.itemGroup}</td>
                                    <td>{pack.itemSubGroup}</td>
                                    <td className='text-right'>{isZeroToFixed( pack.totalCostingAmount, 4 )}</td>
                                    <td className='text-right'>{isZeroToFixed( pack.totalBomAmount, 4 )}</td>
                                    <td className='text-right'>0</td>
                                    <td className='text-right'>{isZeroToFixed( pack.avgCostingRate, 4 )}</td>
                                    <td className='text-right'>{isZeroToFixed( pack.avgBomRate, 4 )}</td>
                                    <td>
                                        <Button.Ripple
                                            for="searchId"
                                            tag={Label}
                                            onClick={() => { handlePOWiseDetailsOpen(); }}
                                            className='btn-icon p-0'
                                            color='flat-primary'
                                        >
                                            {/* <Search id="searchId" size={15} color="#7367f0" /> */}
                                        </Button.Ripple>

                                    </td>
                                </tr>
                                <tr >
                                    <td colSpan={8} className={pack.isRowOpen ? 'p-2' : ''}>
                                        {
                                            budgetCostingAndBomSummaryDetails.some( ( i => i.rowId === i.rowId ) ) && (
                                                <Collapse isOpen={pack.isRowOpen}>
                                                    <Table bordered>
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
                                                            {pack?.details?.map( ( ( s, index ) => (
                                                                <tr key={index + 1}>
                                                                    <td>{s.styleNumber}</td>
                                                                    <td className="text-left">{s.itemDescription}</td>
                                                                    <td className='text-right'>{isZeroToFixed( s.totalBomAmount, 4 )}</td>
                                                                    <td className='text-right'>0</td>
                                                                    <td className='text-right' >{isZeroToFixed( s.avgBomRate, 4 )}</td>
                                                                </tr>
                                                            ) ) )}
                                                            <tr className='font-weight-bolder bg-light-primary text-right'>
                                                                <td className='text-right font' colSpan={2}>Total</td>
                                                                <td>{isZeroToFixed( _.sum( pack?.details.map( fab => fab.totalBomAmount ) ), 4 )}</td>
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
                            <td>{isZeroToFixed( _.sum( budgetCostingAndBomSummaryDetails.filter( f => f.groupName === "Packaging" ).map( acc => acc.totalCostingAmount ) ), 4 )}</td>
                            <td>{isZeroToFixed( _.sum( budgetCostingAndBomSummaryDetails.filter( f => f.groupName === "Packaging" ).map( bom => bom.totalBomAmount ) ), 4 )}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr> : <tr >
                            <td className='text-center' colSpan={9}>
                                There are no Packaging Accessories records to display
                            </td>

                        </tr>
                    }


                </tbody>

            </Table>
            <POWiseDetailsModal
                openModal={openPOWiseDetailsModal}
                setOpenModal={setOpenPOWiseDetailsModal}
            />
        </div>
    );
};

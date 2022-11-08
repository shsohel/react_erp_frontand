import _ from 'lodash';
import { Fragment } from 'react';
import DataTable from 'react-data-table-component';
import { Edit3, MinusSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Button, Label, Table } from 'reactstrap';
import { isPermit } from '../../../../utility/Utils';
import { deletePackagingDetails, getSinglePackagingById } from '../store/action';

const SinglePackagingDetails = () => {
    const dispatch = useDispatch();
    const { singlePackagingDetails } = useSelector( ( { packaging } ) => packaging );
    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );
    const { replace } = useHistory();


    const handleRemovePackagingDetailsRow = ( packId, detailId ) => {

        dispatch( deletePackagingDetails( packId, detailId ) );

    };
    const handleEditPackagingDetailsRow = ( packId, detailId ) => {
        dispatch( getSinglePackagingById( packId, detailId ) );

    };
    const handleCancel = () => {
        replace( '/purchase-order' );
    };


    const handleColorWiseQtyTotal = ( colorId, details ) => {
        const totalQty = _.sum( details.filter( c => c.colorId === colorId ).map( q => q.quantity ) );
        return totalQty;
    };

    const ExpandablePackDetails = ( { data } ) => {
        console.log( data.packagingDetails );
        return (
            <div className='custom-table w-50 pt-1 pb-1'>
                <Table size="sm" bordered responsive>
                    <thead className='thead-light  text-center'>
                        <tr className='bg-light-primary'>
                            <th style={{ width: '10px' }} className="text-nowrap">SL.</th>
                            <th style={{ width: '95px' }} className="text-nowrap">Color</th>
                            {
                                _.uniqBy( data.packagingQuantityDetails, 'size' )?.map( ( s, index ) => (
                                    <Fragment key={index + 1}>
                                        <th>{s.size}</th>
                                    </Fragment>
                                ) )
                            }
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {_.uniqBy( data.packagingQuantityDetails, 'colorId' ).map( ( i, idx ) => (
                            <tr key={idx + 2}>
                                <td style={{ width: '10px' }} className="text-nowrap">{idx + 1}</td>
                                <td className="text-nowrap">{i.color}</td>
                                {data.packagingQuantityDetails.filter( c => c.colorId === i.colorId ).map( ( q, index ) => (
                                    <Fragment key={index + 1}>
                                        <td>
                                            {q.quantity}
                                        </td>
                                    </Fragment>
                                ) )}
                                <td> {handleColorWiseQtyTotal( i.colorId, data.packagingQuantityDetails )}</td>
                            </tr>
                        ) )}
                    </tbody>
                </Table>
            </div >
        );
    };

    return (
        <div >
            <DataTable
                expandableRows
                // subHeader
                // subHeaderComponent={}
                pagination
                noHeader
                responsive
                // data={randersData()}
                data={singlePackagingDetails}
                className='react-custom-dataTable'
                persistTableHead
                dense
                expandableRowsComponent={<ExpandablePackDetails data={data => data} />}
                paginationTotalRows={singlePackagingDetails.length}
                columns={[
                    {
                        id: 'serialId',
                        name: 'SL',
                        width: '40px',
                        selector: row => row.cartonNoSeries,
                        center: true,
                        cell: ( row, index ) => index + 1
                    },
                    {
                        id: row => row.cartonSerialNo,
                        name: 'Serial No',
                        minWidth: '150px',
                        selector: row => row.cartonSerialNo,
                        center: true,
                        cell: row => row.cartonSerialNo
                    },
                    {
                        id: row => row.cartonNoSeries,
                        name: 'Ctn. S. No',
                        minWidth: '150px',
                        selector: row => row.cartonNoSeries,
                        center: true,
                        cell: row => row.cartonNoSeries
                    },
                    {
                        id: row => row.length,
                        name: 'Length',
                        minWidth: '150px',
                        selector: row => row.length,
                        center: true,
                        cell: row => row.length
                    },
                    {
                        id: row => row.width,
                        name: 'Width',
                        minWidth: '150px',
                        selector: row => row.width,
                        center: true,
                        cell: row => row.width
                    },
                    {
                        id: row => row.height,
                        name: 'Height',
                        minWidth: '150px',
                        selector: row => row.height,
                        center: true,
                        cell: row => row.height
                    },
                    {
                        id: row => row.netWeight,
                        name: 'Net Weight',
                        minWidth: '150px',
                        selector: row => row.netWeight,
                        center: true,
                        cell: row => row.netWeight
                    },
                    {
                        id: row => row.grossWeight,
                        name: 'Gross Weight',
                        minWidth: '150px',
                        selector: row => row.grossWeight,
                        center: true,
                        cell: row => row.grossWeight
                    },
                    {
                        id: row => row.totalPackSize,
                        name: 'Ttl. Pack Size',
                        minWidth: '150px',
                        selector: row => row.totalPackSize,
                        center: true,
                        cell: row => row.totalPackSize
                    },
                    {
                        id: 'actionId',
                        name: 'Action',
                        width: '100px',
                        selector: 'actionId',
                        center: true,
                        cell: row => (
                            <span>
                                {
                                    isPermit( userPermission?.PackagingEdit, authPermissions ) &&
                                    ( <Button.Ripple
                                        id="editActionId"
                                        tag={Label}
                                        onClick={() => { handleEditPackagingDetailsRow( row.packagingId, row.detailId ); }}
                                        className='btn-icon p-0 mr-1'
                                        color='flat-success'
                                    >
                                        <Edit3 size={18} id="editActionId" color="green" />
                                    </Button.Ripple> )
                                }
                                {
                                    isPermit( userPermission?.PackagingDelete, authPermissions ) && (
                                        <Button.Ripple
                                            id="deleteActionId"
                                            tag={Label}
                                            onClick={() => { handleRemovePackagingDetailsRow( row.packagingId, row.detailId ); }}
                                            className='btn-icon p-0'
                                            color='flat-danger'
                                        >
                                            <MinusSquare size={18} id="deleteActionId" color="red" />
                                        </Button.Ripple>
                                    )
                                }

                            </span>
                        )
                    }

                ]}
            />

        </div >
    );
};

export default SinglePackagingDetails;

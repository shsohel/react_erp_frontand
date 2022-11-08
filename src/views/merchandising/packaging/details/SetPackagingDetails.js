import _ from 'lodash';
import React, { Fragment, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Edit3, MinusSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Button, Label, Table } from 'reactstrap';
import { deletePackagingDetails, getSetPackagingById } from '../store/action';


const SetPackagingDetails = () => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState( [] );
    const { setPackagingDetails } = useSelector( ( { packaging } ) => packaging );

    const { replace } = useHistory();
    const handleCollapsibleTableOpen = ( fieldId ) => {
        const updatedData = setPackagingDetails?.map( details => {
            if ( fieldId === details.fieldId ) {
                details['isRowOpen'] = !details.isRowOpen;
            }
            return details;
        } );
        //   dispatch( bindPackagingDetails( updatedData ) );
    };
    const handleRemovePackagingDetailsRow = ( packId, detailId ) => {
        dispatch( deletePackagingDetails( packId, detailId ) );

    };
    const handleEditPackagingDetailsRow = ( packagingId, detailId ) => {

        dispatch( getSetPackagingById( packagingId, detailId ) );
    };
    const handleCancel = () => {
        replace( '/purchase-order' );
    };

    const ExpandablePackDetails = ( { data } ) => {
        console.log( data.packagingDetails );
        return (
            <div className='custom-table w-25 pt-1 pb-1'>
                <Table size="sm" bordered responsive>
                    <thead className='thead-light  text-center'>
                        <tr className='bg-light-primary'>
                            <th style={{ width: '15px' }} className="text-nowrap">SL.</th>
                            <th style={{ width: '95px' }} className="text-nowrap">Style</th>
                            {
                                _.uniqBy( data.packagingDetails, 'size' )?.map( ( s, index ) => (
                                    <Fragment key={index + 1}>
                                        <th>{s.size}</th>
                                    </Fragment>
                                ) )
                            }
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {_.uniqBy( data.packagingDetails, 'styleId' ).map( ( i, idx ) => (
                            <tr key={idx + 2}>
                                <td className="text-nowrap">{idx + 1}</td>
                                <td className="text-nowrap">{i.styleNumber}</td>
                                {data.packagingDetails.filter( c => c.styleId === i.styleId ).map( ( q, index ) => (
                                    <Fragment key={index + 1}>
                                        <td>
                                            {q.quantity}
                                        </td>
                                    </Fragment>
                                ) )}
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
                data={setPackagingDetails}
                className='react-custom-dataTable'
                persistTableHead
                dense
                expandableRowsComponent={<ExpandablePackDetails data={data => data} />}
                paginationTotalRows={setPackagingDetails.length}
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
                                <Button.Ripple
                                    id="editActionId"
                                    tag={Label}
                                    onClick={() => { handleEditPackagingDetailsRow( row.packagingId, row.detailId ); }}
                                    className='btn-icon p-0 mr-1'
                                    color='flat-success'
                                >
                                    <Edit3 size={18} id="editActionId" color="green" />
                                </Button.Ripple>
                                <Button.Ripple
                                    id="deleteActionId"
                                    tag={Label}
                                    onClick={() => { handleRemovePackagingDetailsRow( row.packagingId, row.detailId ); }}
                                    className='btn-icon p-0'
                                    color='flat-danger'
                                >
                                    <MinusSquare size={18} id="deleteActionId" color="red" />
                                </Button.Ripple>
                            </span>
                        )
                    }

                ]}
            />

        </div >
    );
};

export default SetPackagingDetails;

import '@custom-styles/merchandising/others/custom-table.scss';
import _ from 'lodash';
import React, { Fragment } from 'react';
import { X } from 'react-feather';
import { Button, Table } from 'reactstrap';
import { randomIdGenerator } from '../../../../../utility/Utils';

const SingleStyleDocumentTableForEdit = ( { tableData, handleFileRemoveFromTable } ) => {
    const sortArray = tableData?.sort( function ( a, b ) {
        return ( b.revisionNo ) - ( a.revisionNo );
    } );
    const grouped = _.groupBy( sortArray, function ( d ) {
        return d.category;
    } );

    return (
        <Table size="sm" bordered responsive className='custom-table'>
            <thead className="thead-dark text-capitalize">
                <tr>
                    <th >Category</th>
                    <th>Revision No</th>
                    <th>Date</th>
                    <th>File Name</th>
                    <th>File Type</th>
                    <th className='text-center'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    Object.keys( grouped ).length === 0 && (
                        <tr >
                            <td className="pt-1 pb-1 text-center" colSpan="6"><span >Documents</span></td>

                        </tr>
                    )
                }

                {Object.keys( grouped ).map( ( item, n ) => {
                    return grouped[item].map( ( i, index ) => ( index === 0 ? (

                        <tr key={randomIdGenerator()}>
                            <td rowSpan={grouped[item].length} >
                                {i.category}
                            </td>
                            <td className="text-center" key={randomIdGenerator()} rowSpan="1" >
                                {i.revisionNo}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1">
                                {i.uploaded}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1">
                                {i.name}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1">
                                {i.type}/{i.fileExtension}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1" className="text-center">
                                <Fragment>
                                    <Button.Ripple onClick={() => { handleFileRemoveFromTable( i.id ); }}
                                        className='btn-icon' color='flat-danger'>
                                        <X size={16} />
                                    </Button.Ripple>
                                </Fragment>
                            </td>
                        </tr>
                    ) : (
                        <tr key={randomIdGenerator()}>
                            <td className="text-center" key={randomIdGenerator()} rowSpan="1">
                                {i.revisionNo}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1">
                                {i.uploaded}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1">
                                {i.name}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1">
                                {i.type}/{i.fileExtension}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1" className="text-center">
                                <Fragment>
                                    <Button.Ripple onClick={() => { handleFileRemoveFromTable( i.id ); }}
                                        className='btn-icon' color='flat-danger'>
                                        <X size={16} />
                                    </Button.Ripple>
                                </Fragment>
                            </td>
                        </tr>
                    ) )
                    );
                } )}
            </tbody>
        </Table >
    );
};

export default SingleStyleDocumentTableForEdit;

import '@custom-styles/merchandising/others/custom-table.scss';
import _ from 'lodash';
import React, { Fragment } from 'react';
import { Download } from 'react-feather';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { formatDate, randomIdGenerator } from '../../../../../utility/Utils';
import { downloadSingleStyleFile } from '../../single-style/store/actions';

const SetStyleDocumentDetails = ( { tableData } ) => {
    const dispatch = useDispatch();
    const { push } = useHistory();
    const sortArray = tableData.sort( function ( a, b ) {
        return ( b.revisionNo ) - ( a.revisionNo );
    } );
    const grouped = _.groupBy( sortArray, function ( d ) {
        return d.category;
    } );

    const handleFileDownload = ( mediaId ) => {
        dispatch( downloadSingleStyleFile( mediaId, push ) );

    };


    return (
        <Table size="sm" bordered responsive className='custom-table '>
            <thead className="thead-secondary text-capitalize">
                <tr className="text-center p-0">
                    <th >Category</th>
                    <th>Revision No</th>
                    <th>Date</th>
                    <th>File Name</th>
                    <th>File Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys( grouped ).map( ( item, n ) => {
                    return grouped[item].map( ( i, index ) => ( index === 0 ? (
                        <tr key={randomIdGenerator()} className="text-center p-0">
                            <td rowSpan={grouped[item].length} >
                                {i.category}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1" >
                                {i.revisionNo}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1">
                                {formatDate( i.uploaded )}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1">
                                {i.name}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1">
                                {i.type}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1">
                                <Fragment>
                                    <Button.Ripple
                                        onClick={() => handleFileDownload( i.id )}
                                        className='btn-icon' color='flat-primary'>
                                        <Download size={16} />
                                    </Button.Ripple>
                                </Fragment>
                            </td>

                        </tr>
                    ) : (
                        <tr key={randomIdGenerator()} className="text-center p-0">
                            <td key={randomIdGenerator()} rowSpan="1" >
                                {i.revisionNo}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1">
                                {formatDate( i.uploaded )}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1">
                                {i.name}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1">
                                {i.type}
                            </td>
                            <td key={randomIdGenerator()} rowSpan="1" className="text-center">
                                <Fragment>
                                    <Button.Ripple
                                        onClick={() => handleFileDownload( i.id )}
                                        className='btn-icon' color='flat-primary'>
                                        <Download size={16} />
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

export default SetStyleDocumentDetails;

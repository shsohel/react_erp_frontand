import '@custom-styles/merchandising/others/custom-table.scss';
import _ from 'lodash';
import { Fragment } from 'react';
import { Download } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { confirmDialog } from '../../../../../utility/custom/ConfirmDialog';
import { confirmObj } from '../../../../../utility/enums';
import { randomIdGenerator } from '../../../../../utility/Utils';
import { singleStyleFileDelete } from '../store/actions';

const DocumentTable = () => {

    const dispatch = useDispatch();
    const { push } = useHistory();
    const { singleStyleBasicInfo } = useSelector( ( { styles } ) => styles );

    const sortArray = singleStyleBasicInfo?.fileUrls?.sort( ( a, b ) => {
        return ( b.revisionNo ) - ( a.revisionNo );
    } );

    const grouped = _.groupBy( sortArray, ( d ) => {
        return d.category;
    } );
    const handleSingleStyleFileDownload = ( url ) => {
        // dispatch( downloadSingleStyleFile( mediaId, push ) );
        console.log( 'url', JSON.stringify( url, null, 2 ) );
        window.open(
            `${url}`,
            '_blank'
        );
    };


    const handleFileRemoveFromTable = file => {
        console.log( file );
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                ///
                dispatch( singleStyleFileDelete( file ) );
            }
        } );
    };

    return (
        <div className='custom-table'>
            <Table size="sm" bordered responsive >
                <thead className="thead-secondary">
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
                                <td className="pt-1 pb-1 text-center" colSpan="6"><span >No have any documents</span></td>
                            </tr>
                        )
                    }

                    {Object.keys( grouped ).map( ( item, n ) => {
                        return grouped[item].map( ( i, index ) => ( index === 0 ? (

                            <tr key={randomIdGenerator()}>
                                <td rowSpan={grouped[item].length} >
                                    {i.category}
                                </td>
                                <td className="text-center" key={randomIdGenerator()}  >
                                    {i.revisionNo}
                                </td>
                                <td key={randomIdGenerator()} >
                                    {i.uploaded}
                                </td>
                                <td key={randomIdGenerator()} >
                                    {i.name}
                                </td>
                                <td key={randomIdGenerator()} >
                                    {i.fileExtension}
                                </td>
                                <td key={randomIdGenerator()} className="text-center">
                                    <Fragment>

                                        <Button.Ripple
                                            onClick={() => { handleSingleStyleFileDownload( i.fileUrl ); }}
                                            className='btn-icon p-0' color='flat-primary'>
                                            <Download size={16} />
                                        </Button.Ripple>
                                    </Fragment>
                                </td>
                            </tr>
                        ) : (
                            <tr key={randomIdGenerator()} >
                                <td className="text-center " key={randomIdGenerator()} >
                                    {i.revisionNo}
                                </td>
                                <td key={randomIdGenerator()}>
                                    {i.uploaded}
                                </td>
                                <td key={randomIdGenerator()}>
                                    {i.name}
                                </td>
                                <td key={randomIdGenerator()} >
                                    {i.fileExtension}
                                </td>
                                <td key={randomIdGenerator()} className="text-center">
                                    <Fragment>

                                        <Button.Ripple
                                            onClick={() => { handleSingleStyleFileDownload( i.fileUrl ); }}
                                            className='btn-icon p-0' color='flat-primary'>
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
        </div>

    );
};

export default DocumentTable;

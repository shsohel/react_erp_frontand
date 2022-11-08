import { notify } from '@custom/notifications';
import { Fragment } from 'react';
import DataTable from 'react-data-table-component';
import { useDropzone } from 'react-dropzone';
import { ChevronDown, Download, PlusSquare, X } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Row } from 'reactstrap';
import AutoProgress from '../../../../utility/custom/AutoProgress';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { confirmObj } from '../../../../utility/enums';
import { piFileDelete, piFileUpload } from '../store/actions';
const initialFilesUpload = {
    id: 0,
    name: '',
    file: null,
    category: '',
    description: ''
};

const PiDocuments = () => {
    const dispatch = useDispatch();
    const { piBasicInfo, isFileUploadComplete } = useSelector( ( { pis } ) => pis );


    //Function for Document Upload Start
    const handleFileUpload = async files => {
        const singleFile = files[0];
        const uploadObj = {
            name: singleFile.name,
            file: singleFile
        };
        dispatch( piFileUpload( uploadObj ) );

    };

    const { getRootProps, getInputProps } = useDropzone( {
        accept: 'application/pdf, .pdf, .doc, .docx, .xls, .csv, .xlsx, application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        maxFiles: 1,
        multiple: false,
        maxSize: 2097152,
        onDrop: ( acceptedFiles, fileRejections ) => {
            if ( acceptedFiles.length ) {
                handleFileUpload( acceptedFiles );
            } else {
                const message = fileRejections[0]?.errors[0]?.message;
                const fileError = fileRejections[0].errors[0].code === 'file-too-large';
                if ( fileError ) {
                    notify( 'error', 'File size must be within 2 MB.' );
                } else {
                    notify( 'error', `${message}` );

                }
            }
        }
    } );

    const handleFileRemove = ( file ) => {
        console.log( file );
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                dispatch( piFileDelete( file ) );
            }
        } );
    };
    const handleFileDownload = ( url ) => {
        console.log( 'url', JSON.stringify( url, null, 2 ) );
        window.open(
            `${url}`,
            '_blank'
        );
    };
    return (
        <div>
            <Row >
                <Col >
                    <DataTable
                        subHeader={false}
                        noHeader
                        dense={true}
                        defaultSortAsc
                        progressPending={!isFileUploadComplete}
                        progressComponent={
                            <AutoProgress />
                        }
                        //  pagination
                        persistTableHead
                        className='react-custom-dataTable-other'
                        //   paginationRowsPerPageOptions={[5, 10, 20, 25]}
                        columns={[
                            {

                                name: "#",
                                id: 'isSelected',
                                width: '45px',
                                selector: row => row.isSelected,
                                center: true,
                                //   sortable: true,
                                cell: ( row, index ) => index + 1

                            },
                            {
                                id: "name",
                                name: 'Name',
                                minWidth: '150px',
                                selector: 'name',
                                sortable: true,
                                // center: true,
                                cell: row => row?.name
                            },
                            {
                                id: "extns",
                                name: 'Ext.',
                                width: '45px',
                                selector: 'extension',
                                sortable: false,
                                center: true,
                                cell: row => row?.extension
                            },
                            {
                                id: "action",
                                name: 'Action',
                                minWidth: '60px',
                                maxWidth: '70px',
                                selector: 'name',
                                sortable: false,
                                center: true,
                                cell: row => (
                                    <Fragment>
                                        <Button.Ripple onClick={() => { handleFileRemove( row ); }}
                                            className='btn-icon p-0 mr-1' color='flat-danger'>
                                            <X size={16} />
                                        </Button.Ripple>
                                        <Button.Ripple
                                            onClick={() => { handleFileDownload( row.fileUrl ); }}
                                            className='btn-icon p-0' color='flat-primary'>
                                            <Download size={16} />
                                        </Button.Ripple>
                                    </Fragment>
                                )
                            }


                        ]}
                        // data={randersData()}
                        data={piBasicInfo.fileUrls}
                        sortIcon={<ChevronDown size={2} />}
                    // paginationTotalRows={randersData().length}
                    //  paginationTotalRows={piBasicInfo.fileUrls.length}
                    />
                    <div {...getRootProps()}>

                        < input hidden {...getInputProps()} id="uploadId" />
                        <Button.Ripple
                            id="uploadId"
                            className='btn-icon p-0'
                            color='flat-primary'
                        >
                            <PlusSquare size={22} />
                        </Button.Ripple>

                    </div>
                </Col>


            </Row>

        </div>
    );
};

export default PiDocuments;
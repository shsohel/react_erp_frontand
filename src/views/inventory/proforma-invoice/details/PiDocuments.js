import { Fragment } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Download } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Row } from 'reactstrap';
import AutoProgress from '../../../../utility/custom/AutoProgress';


const PiDocuments = () => {
    const dispatch = useDispatch();
    const { piBasicInfo, isFileUploadComplete } = useSelector( ( { pis } ) => pis );


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

                </Col>


            </Row>

        </div>
    );
};

export default PiDocuments;
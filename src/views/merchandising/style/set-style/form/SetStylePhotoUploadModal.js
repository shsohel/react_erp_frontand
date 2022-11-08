
import Avatar from '@components/avatar';
import { notify } from '@custom/notifications';
import React from 'react';
import Dropzone from 'react-dropzone';
import { CheckSquare, Plus, Square, XSquare } from 'react-feather';
import { useSelector } from 'react-redux';
import { Button, ButtonGroup, Col, Label, Row, Table } from 'reactstrap';
import CustomModal from '../../../../../utility/custom/CustomModal';

const SetStylePhotoUploadModal = ( { openModal, setOpenModal, handlePhotoAddToTable, photos, handlePhotoRemoveFromTable, handleDefaultPhotoOnTable, handlePhotoUploadToCarousel } ) => {
    const {
        lastSetStyleId,
        isSetStylePhotoUploadComplete } = useSelector( ( { setStyles } ) => setStyles );
    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
    };
    const handlePhotoSubmit = () => {
        handlePhotoUploadToCarousel();
        setOpenModal( !openModal );

    };
    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-md'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModalToggleClose={handleMainModalToggleClose}
                handleMainModelSubmit={handlePhotoSubmit}
                title="Photo Upload"
            >
                <Row>
                    <Col xl={12}>
                        <Dropzone maxSize={2097152} accept=".png, .jpg, .jpeg" onDrop={( acceptedFiles, fileRejections ) => {
                            if ( acceptedFiles.length ) {
                                handlePhotoAddToTable( acceptedFiles );
                            } else {
                                const message = fileRejections[0]?.errors[0]?.message;
                                const fileError = fileRejections[0].errors[0].code === 'file-too-large';
                                if ( fileError ) {
                                    notify( 'error', 'File size must be within 2 MB.' );
                                } else {
                                    notify( 'error', `${message}` );
                                }
                            }
                        }}>
                            {( { getRootProps, getInputProps } ) => (
                                <span
                                    {...getRootProps( { onDrop: event => event.stopPropagation() } )}
                                >
                                    <input
                                        // disabled={!lastSetStyleId}
                                        {...getInputProps()} />
                                    <Button.Ripple
                                        outline
                                        id='change-img'
                                        tag={Label}
                                        color='primary'
                                        size="sm"
                                    // disabled={!lastSetStyleId}
                                    >
                                        <Plus size={16} />

                                    </Button.Ripple>
                                </span>
                            )}
                        </Dropzone>
                    </Col>
                    <Col xl={12} className="custom-table">
                        {
                            photos.length > 0 &&
                            <Table size="sm" responsive bordered>
                                <thead className="thead-light">
                                    <tr>
                                        <td className="text-center">Photo</td>
                                        <td >File </td>
                                        <td className="text-center">Actions</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        photos.map( ( photo ) => (
                                            <tr key={photo.id}>
                                                <td className="text-center"> <Avatar img={photo.url} /></td>
                                                <td>{photo.photoName}</td>
                                                <td className="text-center">
                                                    <ButtonGroup >
                                                        <Button.Ripple id="deleteId" onClick={() => { handlePhotoRemoveFromTable( photo.id ); }} className='btn-icon' color='flat-danger'>
                                                            <XSquare size={18} />
                                                        </Button.Ripple>
                                                        <Button.Ripple id='defaultId' onClick={() => { handleDefaultPhotoOnTable( photo.id ); }} className='btn-icon' color='flat-success'>
                                                            {
                                                                photo.isDefault ? <CheckSquare size={18} /> : <Square color='grey' size={18} />
                                                            }
                                                        </Button.Ripple>
                                                    </ButtonGroup>
                                                </td>
                                            </tr>
                                        ) )
                                    }
                                </tbody>
                            </Table>
                        }
                    </Col>

                </Row>
            </CustomModal>
        </div>
    );
};

export default SetStylePhotoUploadModal;

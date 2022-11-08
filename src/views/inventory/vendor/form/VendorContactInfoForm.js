import React, { useState } from 'react';
import { Edit2, MoreVertical, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from 'reactstrap';
import { vendorContactInfoModel } from '../model';
import { bindVendorContactDataOnchange, bindVendorDataOnchange } from '../store/actions';
import VendorContactInfoModalForm from './VendorContactInfoModalForm';


const VendorContactInfoForm = () => {
    const dispatch = useDispatch();
    const { vendorBasicInfo } = useSelector( ( { vendors } ) => vendors );
    const [openContactFormModal, setOpenContactFormModal] = useState( false );


    const handleContactFormOpen = () => {
        setOpenContactFormModal( !openContactFormModal );
        dispatch( bindVendorContactDataOnchange( vendorContactInfoModel ) );
    };

    const handleEditContact = ( contact ) => {
        console.log( contact );
        dispatch( bindVendorContactDataOnchange( contact ) );
        setOpenContactFormModal( !openContactFormModal );
    };

    const handleContactDelete = ( contactId ) => {
        const updatedData = vendorBasicInfo.contacts.filter( c => c.id !== contactId );
        dispatch( bindVendorDataOnchange( {
            ...vendorBasicInfo,
            contacts: updatedData
        } ) );
    };

    return (
        <div>
            <div className="m-auto w-100">
                <Row className="mb-1">
                    <Col className="">
                        <Button
                            size="sm"
                            onClick={() => {
                                handleContactFormOpen();
                            }}
                            color="primary"
                        >
                            Add

                        </Button>
                    </Col>
                </Row>
                <Row style={{ minHeight: '100px' }}>
                    {vendorBasicInfo?.contacts?.map( cd => (
                        <Col key={cd.id} xs={6} sm={6} md={6} lg={2} xl={2}>
                            <div className="custom-form-box-main">
                                <div style={{ position: 'absolute', top: '10px', right: '20px' }}>
                                    <UncontrolledDropdown>
                                        <DropdownToggle tag='div' className='btn btn-sm'>
                                            <MoreVertical size={14} className='cursor-pointer' />
                                        </DropdownToggle>
                                        <DropdownMenu >
                                            <DropdownItem
                                                className='w-100'
                                                onClick={() => { handleEditContact( cd ); }}
                                            >
                                                <Edit2 color='skyBlue' size={14} className='mr-50' />
                                                <span color='primary' className='align-middle'>Edit</span>
                                            </DropdownItem>

                                            <DropdownItem
                                                className='w-100'
                                                onClick={() => { handleContactDelete( cd.id ); }}
                                            >
                                                <Trash2 color='green' size={14} className='mr-50' />
                                                <span className='align-middle'>Delete</span>
                                            </DropdownItem>

                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                                <div className="form-box">
                                    <p className="name">{cd.name}</p>
                                    <p className='details-list'>{cd.jobPosition}</p>
                                    <p className='details-list'>{cd.email}</p>
                                    <p className='details-list'> {cd.phoneNumber}</p>
                                </div>
                            </div>
                        </Col>
                    ) )}
                </Row>
                {/* <Row>
                    <Col xs={6} sm={6} md={6} lg={2} xl={2}>
                        <div className="custom-form-box-main" >
                            <div style={{ position: 'absolute', top: '10px', right: '20px' }}>

                                <UncontrolledDropdown>
                                    <DropdownToggle tag='div' className='btn btn-sm'>
                                        <MoreVertical size={14} className='cursor-pointer' />
                                    </DropdownToggle>
                                    <DropdownMenu left>
                                        <DropdownItem
                                            className='w-100'
                                            onClick={() => { }}
                                        >
                                            <Edit2 color='skyBlue' size={14} className='mr-50' />
                                            <span color='primary' className='align-middle'>Edit</span>
                                        </DropdownItem>

                                        <DropdownItem
                                            className='w-100'
                                            onClick={() => { }}
                                        >
                                            <Trash2 color='green' size={14} className='mr-50' />
                                            <span className='align-middle'>Delete</span>
                                        </DropdownItem>

                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>
                            <div className="form-box">
                                <p className="name">MD Sakhawat Hossain</p>
                                <p className='details-list'>Software Developer</p>
                                <p className='details-list'>shsohel@gmail.com</p>
                                <p className='details-list'> 01811275653</p>
                            </div>
                        </div>
                    </Col>
                </Row> */}
            </div>

            {openContactFormModal && (
                <VendorContactInfoModalForm
                    openContactFormModal={openContactFormModal}
                    setOpenContactFormModal={setOpenContactFormModal}
                />
            )}
        </div>
    );
};

export default VendorContactInfoForm;

/* eslint-disable no-var */
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/basic/custom-tab-control.scss';
import '@custom-styles/inventory/vendor-form.scss';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Card, CardBody, Col, NavItem, NavLink, Row } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { clearAllVendorState, getVendorById, updateVendor } from '../store/actions';
import VendorGeneralInfoForm from './VendorGeneralInfoForm';
const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: '/',
        isActive: false
    },
    {
        id: 'vendorList',
        name: 'Vendors',
        link: '/vendors',
        isActive: false
    }
];
const VendorEditForm = () => {
    const dispatch = useDispatch();
    const { replace, push } = useHistory();
    const { state } = useLocation();
    const vendorId = state;

    const { vendorBasicInfo, isVendorDataOnProgress } = useSelector( ( { vendors } ) => vendors );
    //  console.log( 'vendorBasicInfo', JSON.stringify( vendorBasicInfo, null, 2 ) );

    useEffect( () => {
        dispatch( getVendorById( vendorId ) );
    }, [dispatch, vendorId] );

    const handleSubmit = () => {
        console.log( 'Submit' );

        const submitObj = {
            groupId: vendorBasicInfo?.group?.value ?? '',
            name: vendorBasicInfo.name,
            shortName: vendorBasicInfo.shortName,
            email: vendorBasicInfo.email,
            phoneNumber: vendorBasicInfo.phoneNumber,
            mobileNumber: vendorBasicInfo.mobileNumber,
            webSite: vendorBasicInfo.webSite,
            fullAddress: vendorBasicInfo.fullAddress,
            state: vendorBasicInfo.state?.value ?? '',
            postalCode: vendorBasicInfo.postalCode,
            city: vendorBasicInfo.city?.value ?? '',
            country: vendorBasicInfo.country?.value ?? '',
            bankAccountNumber: vendorBasicInfo.bankAccountNumber,
            bankAccountName: vendorBasicInfo.bankAccountName,
            bankName: vendorBasicInfo.bankName,
            bankAddress: vendorBasicInfo.bankAddress,
            branchCode: vendorBasicInfo.branchCode,
            swiftCode: vendorBasicInfo.swiftCode,
            defaultCurrency: vendorBasicInfo.defaultCurrency?.value ?? '',
            paymentTerm: vendorBasicInfo.paymentTerm?.label ?? '',
            receiptReminderDay: vendorBasicInfo.receiptReminderDay,
            tags: vendorBasicInfo.tags.map( tag => tag.value ),
            image: vendorBasicInfo.image,

            contacts: vendorBasicInfo.contacts.map( contact => ( {
                id: contact.id,
                name: contact.name,
                title: contact.title,
                jobPosition: contact.jobPosition,
                email: contact.email,
                phoneNumber: contact.phoneNumber,
                mobileNumber: contact.mobileNumber,
                fullAddress: contact.fullAddress,
                state: contact.state,
                postalCode: contact.postalCode,
                city: contact.city,
                country: contact.country,
                notes: contact.notes
            } ) )
        };

        console.log( 'first', JSON.stringify( submitObj, null, 2 ) );
        dispatch( updateVendor( submitObj, vendorId ) );
    };
    const handleCancel = () => {
        replace( '/vendors' );
    };

    const handleAddNew = () => {
        replace( '/new-vendor' );
        dispatch( clearAllVendorState() );
    };


    return <div>
        <ActionMenu breadcrumb={breadcrumb} title='Edit Vendor'>
            <NavItem className="mr-1">
                <NavLink
                    tag={Button}
                    size="sm"
                    color="primary"
                    onClick={() => { handleSubmit(); }}
                >Save</NavLink>
            </NavItem>
            <NavItem className="mr-1">
                <NavLink
                    tag={Button}
                    size="sm"
                    color="success"
                    onClick={() => { handleAddNew(); }}
                >Add New</NavLink>
            </NavItem>
            <NavItem className="mr-1" >
                <NavLink
                    tag={Button}
                    size="sm"
                    color="secondary"
                    onClick={() => { handleCancel(); }}
                >
                    Cancel
                </NavLink>
            </NavItem>
        </ActionMenu>
        <div>
            <UILoader blocking={isVendorDataOnProgress} loader={<ComponentSpinner />} >
                <Card className="mt-3">
                    <CardBody>
                        <Row>
                            <Col>
                                <div className='divider divider-left mt-0'>
                                    <div className='divider-text text-secondary font-weight-bolder'>Basic Information</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <VendorGeneralInfoForm handleSubmit={handleSubmit} />
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </UILoader>
        </div>

    </div>;
};

export default VendorEditForm;

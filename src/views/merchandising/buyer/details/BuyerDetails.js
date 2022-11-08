import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from 'react-router';
import {
    Button,
    Card,
    CardBody, Col,
    FormGroup,
    Label,
    Media,
    NavItem, NavLink, Row
} from "reactstrap";
import ActionMenu from "../../../../layouts/components/menu/action-menu";
import { isPermit } from '../../../../utility/Utils';
import '../../../test/practices/Practice.css';
import { clearAllBuyerState, getBuyerById } from "../store/actions";
import BuyerDetailsViewTable from "./BuyerDetailsViewTable";

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'buyerList',
        name: 'List',
        link: "/buyers",
        isActive: false
    },
    {
        id: 'buyer',
        name: 'Buyer',
        link: "#",
        isActive: true
    }
];

const BuyerDetails = ( data ) => {
    const { replace, push } = useHistory();
    const dispatch = useDispatch();
    //const buyerId = getIdFromUrl();
    const { state } = useLocation();
    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );
    const buyerId = state;

    const { buyerBasicInfo,
        buyerAgentsByBuyerId,
        buyerProductDeveloperByBuyerId,
        buyerDepartmentByBuyerId,
        isBuyerDataOnProgress
    } = useSelector( ( { buyers } ) => buyers );

    useEffect( () => {
        if ( buyerId ) {
            dispatch( getBuyerById( buyerId ) );
        }
    }, [dispatch, buyerId] );


    const handleCancel = () => {
        replace( '/buyers' );
    };

    const handleEdit = () => {
        push( {
            pathname: `/buyer-edit-form`,
            state: buyerId
        } );
    };
    const handleAddNew = () => {
        replace( '/buyer-add-form' );
        dispatch( clearAllBuyerState() );
    };


    return (
        <div>
            <div className="mt-3">
                <ActionMenu
                    breadcrumb={breadcrumb}
                    title=' Buyer Details'
                    moreButton={isPermit( userPermission?.BuyerCreate, authPermissions )
                        || isPermit( userPermission?.BuyerEdit, authPermissions )}
                >
                    <NavItem
                        className="mr-1"
                        hidden={!isPermit( userPermission?.BuyerEdit, authPermissions )}
                    >
                        <NavLink
                            tag={Button}
                            className="btn btn-primary"
                            size="sm"
                            color="primary"
                            type="submit"
                            onClick={() => { handleEdit(); }}
                        >Edit</NavLink>
                    </NavItem>

                    <NavItem
                        className="mr-1"
                        hidden={!isPermit( userPermission?.BuyerCreate, authPermissions )}
                    >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="success"
                            onClick={() => { handleAddNew(); }}
                        >
                            Add New
                        </NavLink>
                    </NavItem>

                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Button}
                            size="sm"
                            color="secondary"
                            onClick={() => { handleCancel(); }}                    >
                            Cancel
                        </NavLink>
                    </NavItem>
                </ActionMenu>
            </div>
            <UILoader blocking={isBuyerDataOnProgress} loader={<ComponentSpinner />} >

                <Card >
                    {/* <CardHeader>
                        Buyer Details
                    </CardHeader> */}
                    <CardBody >
                        <Row>
                            <Col lg={6} md={6} sm={12} xs={12}>
                                <Card style={{ minHeight: "450px" }}>
                                    <CardBody className="pb-3">
                                        <div className="row">
                                            <Col lg={3} sm={12} xs={12} md={12} xl={3}>
                                                <Media className="mb-2">
                                                    <Media left>
                                                        <div className="main-div">
                                                            <Card className="img-holder">
                                                                <img
                                                                    src={buyerBasicInfo?.imageUrl}
                                                                    alt="Example"
                                                                    className="image"
                                                                />
                                                            </Card>
                                                        </div>
                                                    </Media>
                                                </Media>
                                            </Col>
                                            <Col lg={9} sm={12} xs={12} md={12} xl={9}>
                                                <div className="row ">
                                                    <Col sm={12} xs={12} lg="6">
                                                        <FormGroup>
                                                            <Label for="name"> Name </Label>
                                                            <p
                                                                className=" font-weight-bold border-bottom padding-bottom"
                                                            >
                                                                {buyerBasicInfo?.name}
                                                            </p>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col sm={12} xs={12} lg={6}>
                                                        <FormGroup>
                                                            <Label for="shortName"> Short Name </Label>
                                                            <p
                                                                className=" font-weight-bold border-bottom padding-bottom"
                                                            >
                                                                {buyerBasicInfo?.shortName}
                                                            </p>
                                                        </FormGroup>
                                                    </Col>
                                                </div>
                                                <div className="row text-nowrap">
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="email"> Email </Label>
                                                            <p
                                                                className=" font-weight-bold border-bottom padding-bottom"
                                                            >
                                                                {buyerBasicInfo?.email}
                                                            </p>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="phone"> Phone </Label>
                                                            <p
                                                                className=" font-weight-bold border-bottom padding-bottom"
                                                            >
                                                                {buyerBasicInfo?.phoneNumber}
                                                            </p>
                                                        </FormGroup>
                                                    </Col>
                                                </div>
                                            </Col>

                                            <Col lg="12">
                                                <div className="row">
                                                    <Col lg="12">
                                                        <FormGroup>
                                                            <Label for="fullAddress"> Address:</Label>
                                                            <p
                                                                className=" font-weight-bold border-bottom padding-bottom"
                                                            >
                                                                {buyerBasicInfo?.fullAddress.length ? buyerBasicInfo?.fullAddress : 'NA'}
                                                            </p>
                                                        </FormGroup>
                                                    </Col>
                                                </div>
                                                <div className="row">
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="country">Country</Label>
                                                            <p
                                                                className=" font-weight-bold border-bottom padding-bottom"
                                                            >
                                                                {buyerBasicInfo?.country?.label ?? "NA"}
                                                            </p>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="state"> State </Label>
                                                            <p
                                                                className=" font-weight-bold border-bottom padding-bottom"
                                                            >
                                                                {buyerBasicInfo?.state?.label ?? "NA"}
                                                            </p>
                                                        </FormGroup>
                                                    </Col>
                                                </div>
                                                <div className="row">
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="city">City</Label>
                                                            <p
                                                                className=" font-weight-bold border-bottom padding-bottom"
                                                            >
                                                                {buyerBasicInfo?.city?.label ?? "NA"}
                                                            </p>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="postalCode"> Postal Code</Label>
                                                            <p
                                                                className="font-weight-bold border-bottom padding-bottom"
                                                            >
                                                                {buyerBasicInfo?.postalCode?.length ? buyerBasicInfo?.postalCode : 'NA'}
                                                            </p>
                                                        </FormGroup>
                                                    </Col>
                                                </div>

                                            </Col>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={12} >
                                <Card style={{ minHeight: "450px" }}>
                                    <BuyerDetailsViewTable
                                        buyerDepartment={buyerDepartmentByBuyerId}
                                        buyerAgents={buyerAgentsByBuyerId}
                                        buyerProductDeveloperByBuyerId={buyerProductDeveloperByBuyerId} />
                                </Card>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </UILoader>

        </div>
    );
};

export default BuyerDetails;

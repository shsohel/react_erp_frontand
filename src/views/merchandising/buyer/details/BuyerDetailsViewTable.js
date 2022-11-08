
import React, { useState } from 'react';
import { Codesandbox, Feather, User } from 'react-feather';
import { Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import BuyerAgentDetails from './BuyerAgentDetails';
import BuyerColorDetails from './BuyerColorDetails';
import BuyerDepartmentDetails from './BuyerDepartmentDetails';
import BuyerDestinationDetails from './BuyerDestinationDetails';
import BuyerProductDeveloperDetails from './BuyerProductDeveloperDetails';
import BuyerSizeGroupDetails from './BuyerSizeGroupDetails';

const BuyerDetailsViewTable = () => {
    const [active, setActive] = useState( '1' );

    const toggle = tab => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };
    return (
        <React.Fragment>
            <Nav tabs >
                <NavItem>
                    <NavLink
                        active={active === '1'}
                        onClick={() => {
                            toggle( '1' );
                        }}
                    >

                        <Codesandbox size={14} />
                        Department
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === '2'}
                        onClick={() => {
                            toggle( '2' );
                        }}
                    >
                        <User size={14} />
                        Agent
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        active={active === '3'}
                        onClick={() => {
                            toggle( '3' );
                        }}
                    >
                        <User size={14} />
                        Product Developer
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === '4'}
                        onClick={() => {
                            toggle( '4' );
                        }}
                    >
                        <User size={14} />
                        Size Group
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === '5'}
                        onClick={() => {
                            toggle( '5' );
                        }}
                    >
                        <Feather size={14} />
                        Color
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === '6'}
                        onClick={() => {
                            toggle( '6' );
                        }}
                    >
                        <User size={14} />
                        Destination
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent className='py-50' activeTab={active}>
                <TabPane tabId='1'>
                    <Col lg={12} sm={12} md={12} xs={12} xl={12}>
                        <BuyerDepartmentDetails />
                    </Col>
                </TabPane>
                <TabPane tabId='2'>
                    <Col lg={12} sm={12} md={12} xs={12} xl={12}>
                        <BuyerAgentDetails />
                    </Col>
                </TabPane>
                <TabPane tabId='3'>
                    <Col lg={12} sm={12} md={12} xs={12} xl={12}>
                        <BuyerProductDeveloperDetails />
                    </Col>

                </TabPane>
                <TabPane tabId='4'>
                    <Col lg={12} sm={12} md={12} xs={12} xl={12}>
                        <BuyerSizeGroupDetails />
                    </Col>
                </TabPane>
                <TabPane tabId='5'>
                    <Col lg={12} sm={12} md={12} xs={12} xl={12}>
                        <BuyerColorDetails />
                    </Col>
                </TabPane>
                <TabPane tabId='6'>
                    <Col lg={12} sm={12} md={12} xs={12} xl={12}>
                        <BuyerDestinationDetails />
                    </Col>
                </TabPane>
            </TabContent>
        </React.Fragment>
    );
};
export default BuyerDetailsViewTable;

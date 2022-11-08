import { useState } from "react";
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import ProcurementItemDetails from "./ProcurementItemDetails";
import ProcurementItemDetailsWithMinQty from "./ProcurementItemDetailsWithMinQty";

const ProcurementItemDetailForm = () => {
    const [active, setActive] = useState( '1' );
    //Start For Tab and Collapsible
    const toggle = tab => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };
    return (
        <div>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        active={active === '1'}
                        onClick={() => {
                            toggle( '1' );
                        }}
                    >
                        <span>Item Details</span>
                        {/* <span><Tool size={16}> </Tool>Fabric </span> */}

                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === '2'}
                        onClick={() => {
                            toggle( '2' );
                        }}
                    >
                        <span>Item MOQ Details</span>
                    </NavLink>
                </NavItem>
            </Nav>

            <TabContent activeTab={active}>
                <TabPane tabId="1">
                    <Row>
                        <Col >
                            <ProcurementItemDetails />
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="2">
                    <Row>
                        <Col>
                            <ProcurementItemDetailsWithMinQty />
                        </Col>

                    </Row>
                </TabPane>
            </TabContent>
        </div>
    );
};

export default ProcurementItemDetailForm;
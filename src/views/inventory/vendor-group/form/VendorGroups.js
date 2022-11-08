import { Col, Row } from "reactstrap";
import VendorGroupList from "../list/VendorGroupList";
import VendorSubGroupForm from "./VendorSubGroupForm";

const VendorGroups = () => {
    return (
        <div>
            <Row>
                <Col>
                    <VendorGroupList />
                </Col>
                <Col>
                    <VendorSubGroupForm />
                </Col>
            </Row>
        </div>
    );
};

export default VendorGroups;
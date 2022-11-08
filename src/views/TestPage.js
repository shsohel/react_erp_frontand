import { Col, Row } from 'reactstrap';
import LabelBox from '../utility/custom/LabelBox';

// import Permission from './test/PermissionArray';
const TestPage = () => {

    return (
        <>
            <Row>
                <Col xs={1}>
                    <LabelBox text="Viewport is the browser window size. 1vw = 1% of viewport width. If the viewport is 50cm wide, 1vw is 0.5cm." />
                </Col>


            </Row>

        </>
    );
};
export default TestPage;

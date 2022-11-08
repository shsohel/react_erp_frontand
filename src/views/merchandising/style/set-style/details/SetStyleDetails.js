import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, Col, CustomInput, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ActionMenu from '../../../../../layouts/components/menu/action-menu';
import { getIdFromUrl } from '../../../../../utility/Utils';
import '../../../../test/practices/Practice.css';
import { getSetStyleById, getUploadedFileBySetStyleId, getUploadedImagesBySetStyleId } from '../store/actions';
import SetStyleDocumentDetails from './SetStyleDocumentDetails';
import SetStylePhotoDetails from './SetStylePhotoDetails';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'setStyleList',
        name: 'List',
        link: "/set-styles",
        isActive: false
    },
    {
        id: 'setStyle',
        name: 'Set Style Details',
        link: "#",
        isActive: true
    }
];


const SetStyleDetails = () => {
    const { replace } = useHistory();
    const dispatch = useDispatch();
    const setStyleId = getIdFromUrl();
    const {
        selectedSetStyle,
        setStyleFiles,
        setStyleImages } = useSelector( ( { setStyles } ) => setStyles );

    useEffect( () => {
        dispatch( getSetStyleById( setStyleId ) );
        dispatch( getUploadedImagesBySetStyleId( setStyleId ) );
        dispatch( getUploadedFileBySetStyleId( setStyleId ) );
    }, [dispatch, setStyleId] );

    const handleCancel = () => {
        replace( '/set-styles' );
        dispatch( getSetStyleById( null ) );
        dispatch( getUploadedImagesBySetStyleId( null ) );
        dispatch( getUploadedFileBySetStyleId( null ) );
    };

    return (
        <div >
            <Card className="p-1 mt-3">
                {/* <CardHeader  >
                    <CardTitle className="text-dark font-weight-bold" tag='h2'>Set Style Details</CardTitle>
                </CardHeader> */}
                <ActionMenu breadcrumb={breadcrumb} title='Set Style Details' >
                    <NavItem className="mr-1" >
                        <NavLink
                            tag={Link}
                            className="btn btn-primary"
                            size="sm"
                            type="submit"
                            to={`/edit-set-style/${setStyleId}`}
                        >Edit</NavLink>
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
                <CardBody>
                    <Row>
                        <Col xs='12' sm='12' md='8' lg='8' xl='8'>
                            <div className='divider divider-left divider-secondary'>
                                <div className='divider-text text-secondary font-weight-bolder'>Set Style Info</div>
                            </div>
                            <div className="border rounded rounded-3 p-1">
                                <Row className="">
                                    <Col xs='12' sm='12' md='12' lg='3' xl='3'>
                                        <Label className="text-dark font-weight-bold " for='styleNo'>Buyer Style No</Label>
                                        <p className="h4 font-weight-bold  ">{!selectedSetStyle?.styleNo ? "NA" : selectedSetStyle?.styleNo}</p>
                                    </Col>
                                    <Col lg='3' className="">
                                        <Label className="text-dark font-weight-bold" for='season'>Season</Label>
                                        <p className="h4 font-weight-bold  ">{selectedSetStyle?.season}</p>
                                    </Col>
                                    <Col lg='3' className="">
                                        <Label className="text-dark font-weight-bold" for='year'>Year</Label>
                                        <p className="h4 font-weight-bold  ">{selectedSetStyle?.year}</p>
                                    </Col>
                                    <Col lg='3' className="">
                                        <Label className="text-dark font-weight-bold" for='description'>Description</Label>
                                        <p className="h4 font-weight-bold text-secondary">{!selectedSetStyle?.description ? "NA" : selectedSetStyle?.description}</p>

                                    </Col>
                                </Row>
                            </div>

                            <div className='divider divider-left divider-secondary'>
                                <div className='divider-text text-secondary font-weight-bolder'>Buyer Info</div>
                            </div>
                            <div className="border rounded rounded-3 p-1">
                                <Row >

                                    <Col lg='3' className="">
                                        <Label className="text-dark font-weight-bold" for='buyer'>Buyer</Label>
                                        <p className="h4 font-weight-bold  ">{!selectedSetStyle?.buyerName ? "NA" : selectedSetStyle?.buyerName}</p>
                                    </Col>
                                    <Col lg='3' className="">
                                        <Label className="text-dark font-weight-bold" for='buyerDepartment'>Buyer Department</Label>
                                        <p className="h4 font-weight-bold  text-secondary">{!selectedSetStyle?.buyerDepartment ? "NA" : selectedSetStyle?.buyerDepartment}</p>

                                    </Col>
                                    <Col lg='3' className="">
                                        <Label className="text-dark font-weight-bold" for='buyerAgent'>Buyer Agent</Label>
                                        <p className="h4 font-weight-bold  ">{selectedSetStyle?.agentName}</p>

                                    </Col>
                                    <Col lg='3' className="">
                                        <Label className="text-dark font-weight-bold" for='buyerProductdeveloper'>Buyer Product Developer</Label>
                                        <p className="h4 font-weight-bold text-secondary ">{selectedSetStyle?.buyerProductDeveloperId ? selectedSetStyle?.buyerProductDeveloper : "NA"}</p>

                                    </Col>
                                </Row>
                            </div>

                            <div className='divider divider-left divider-secondary'>
                                <div className='divider-text text-secondary font-weight-bolder'>Status , Sample Assignee and Production Process</div>
                            </div>
                            <div className="border rounded rounded-3 p-1">
                                <Row >

                                    <Col lg='4' className="">
                                        <Label className="text-dark font-weight-bold" for='status'>Status</Label>
                                        <p className="h4 font-weight-bold  ">{!selectedSetStyle?.status ? "NA" : selectedSetStyle?.status}</p>
                                    </Col>
                                    <Col lg='4' className="">
                                        <Label className="text-dark font-weight-bold" for='assigneeId'>Sample Assignee</Label>
                                        <p className="h4 font-weight-bold text-secondary ">{!selectedSetStyle?.sampleAssignee ? "NA" : selectedSetStyle?.sampleAssignee}</p>
                                    </Col>
                                    <Col lg='4' className="">
                                        <Label className="text-dark font-weight-bold" for='departmentId'>Production Process</Label>
                                        <p className="h4 font-weight-bold text-secondary ">{!selectedSetStyle?.productionProcess ? "NA" : selectedSetStyle?.productionProcess}</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col xl='4' lg='4' md='4' sm='12' >
                            <div className='divider divider-left divider-secondary'>
                                <div className='divider-text text-secondary font-weight-bolder'>Photo</div>
                            </div>
                            <div className="border rounded rounded-3 p-1">
                                <Row className=" mt-0 ml-1 mb-2">
                                    <Col lg='12' className="">
                                        <SetStylePhotoDetails
                                            photoData={setStyleImages}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>

                    <div className='divider divider-left divider-secondary'>
                        <div className='divider-text text-secondary font-weight-bolder'>Remarks and Special Instructions</div>
                    </div>
                    <div className="border rounded rounded-3 p-1">
                        <Row >
                            <Col lg='6' className="">
                                <Label className="text-dark font-weight-bold" for='remarksId'>Remarks</Label>
                                <p className="h4 font-weight-bold  ">{!selectedSetStyle?.remarks ? "NA" : selectedSetStyle?.remarks}</p>

                            </Col>
                            <Col lg='6' className="">
                                <Label className="text-dark font-weight-bold" for='spInstructionId'>Special Instruction</Label>
                                <p className="h4 font-weight-bold  ">{!selectedSetStyle?.additionalInstruction ? "NA" : selectedSetStyle?.additionalInstruction}</p>

                            </Col>
                        </Row>
                    </div>

                    <div className='divider divider-left divider-secondary'>
                        <div className='divider-text text-secondary font-weight-bolder'>Set Style Details</div>
                    </div>
                    <div className="border rounded rounded-3 p-1">
                        <Row className="gx-5">

                            <Col xl='8' lg='8' md='12' sm='12'>
                                <div className="border rounded rounded-3 p-1">
                                    <Table className="custom-table" bordered>
                                        <thead>
                                            <tr>
                                                <th>Style No</th>
                                                <th>Size</th>
                                                <th>Color</th>
                                                <th>Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                selectedSetStyle?.styleDetails?.map( ( item, index ) => (
                                                    <tr key={index}>
                                                        <td>{item.styleNo}</td>
                                                        <td>{item.size}</td>
                                                        <td>{item.color}</td>
                                                        <td>{item.quantity}</td>
                                                    </tr>
                                                ) )
                                            }

                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                            <Col xl='4' lg='4' md='12' sm='12'>
                                <div className="border rounded rounded-3 p-1 divider-secondary">
                                    <Row>
                                        <Col lg='6' className="">
                                            < CustomInput
                                                type='switch'
                                                label="Size Specific"
                                                className='custom-control-success'
                                                id='icon-success'
                                                name='icon-success'
                                                checked={selectedSetStyle?.isSizeSpecific}
                                                onChange={( e ) => e.preventDefault()}
                                                onClick={( e ) => e.preventDefault()}

                                            />
                                        </Col>
                                        <Col lg='6' className="">
                                            < CustomInput
                                                type='switch'
                                                label="Color Specific"
                                                className='custom-control-success'
                                                id='icon-success'
                                                name='icon-success'
                                                checked={selectedSetStyle?.isColorSpecific}
                                                onChange={( e ) => e.preventDefault()}
                                                onClick={( e ) => e.preventDefault()}

                                            />
                                        </Col>
                                    </Row>
                                </div>

                            </Col>
                        </Row>
                    </div>

                    <div className='divider divider-left divider-secondary '>
                        <div className='divider-text text-secondary font-weight-bolder'>Documents</div>
                    </div>
                    <div className="border rounded rounded-3 p-1">
                        <Row >

                            <Col lg='12' >
                                <SetStyleDocumentDetails
                                    tableData={setStyleFiles}
                                />
                            </Col>
                        </Row>
                    </div>
                    {/* <Row>
                        <Col className="d-flex flex-row-reverse">
                            <div className='d-inline-block mb-1 mt-1'>
                                <Button.Ripple onClick={() => { handleCancel(); }} className="ml-1 " outline color="secondary" size="sm">Back to List</Button.Ripple>
                                <Button.Ripple disabled={!!lastSetStyleId} className="ml-1" type="submit" outline color="success" size="sm">Edit</Button.Ripple>
                            </div >
                        </Col >
                    </Row > */}
                </CardBody>

            </Card>
        </div>
    );
};

export default SetStyleDetails;



// import '@custom-styles/merchandising/others/custom-table.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Button, Card, CardBody, Col, Form, FormGroup, Label, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import ResizableTable from '../../../../utility/custom/ResizableTable';
import { getSetCostingById } from '../store/action';


const SetCostingDetails = () => {
    const dispatch = useDispatch();
    const { replace } = useHistory();
    const { state } = useLocation();
    const setCostingId = state;
    const [active, setActive] = useState( '1' );

    const [openModal, setOpenModal] = useState( false );
    const {
        costingAccessoriesDetails,
        selectedSetCosting,
        setStyleCostingPreviousHistory
    } = useSelector( ( { costings } ) => costings );


    //Start For Tab and Collapsible
    const toggle = tab => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };

    useEffect( () => {
        dispatch( getSetCostingById( setCostingId ) );
    }, [dispatch, setCostingId] );

    const handleCancel = () => {
        replace( '/costings' );
    };
    const totalQuotedPrice = () => {
        const totalQuotedPrice = _.sum( selectedSetCosting?.styleCostingDetails?.map( i => Number( i.styleTotalCost ) ) );
        const totalAccessoriesAmount = _.sum( selectedSetCosting?.accessoriesDetails?.map( i => Number( i.consumptionCost ) ) );
        return Number( ( totalQuotedPrice + totalAccessoriesAmount ).toFixed( 4 ) );
    };

    const onSubmit = () => {

    };


    const breadcrumb = [
        {
            id: 'home',
            name: 'Home',
            link: '/',
            isActive: false
        },
        {
            id: 'costingList',
            name: 'List',
            link: '/costings',
            isActive: false
        },
        {
            id: 'costings',
            name: 'Costing',
            link: '#',
            isActive: true
        }
    ];


    return (
        <div>
            <Card className="p-1">
                {/* <CardHeader>
                    <CardTitle className="text-dark font-weight-bold" tag='h2'>New Costing</CardTitle>
                </CardHeader> */}
                <CardBody>
                    <Form >
                        <ActionMenu breadcrumb={breadcrumb} title='Costing Details' >
                            <NavItem className="mr-1" >
                                <NavLink
                                    tag={Button}
                                    size="sm"
                                    color="primary"
                                    onClick={() => { onSubmit(); }}
                                >Save</NavLink>
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
                        <Row >
                            <Col>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Master Info</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row>
                                        <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                            <Label className="text-dark font-weight-bolder" for='buyerId'>Buyer</Label>
                                            <p>
                                                {selectedSetCosting?.buyerName}
                                            </p>
                                        </FormGroup>
                                        <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                            <Label className="text-dark font-weight-bolder" for='styleId'>Buyer PO</Label>
                                            <p>
                                                {selectedSetCosting?.orderNumber}
                                            </p>
                                        </FormGroup>
                                        <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                            <Label className="text-dark font-weight-bolder" for='styleId'>Style</Label>
                                            <p>
                                                {selectedSetCosting?.styleNumber}
                                            </p>
                                        </FormGroup>
                                        <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                            <Label className="text-dark font-weight-bolder" for='styleId'>Total Quoted Price</Label>
                                            <p>{totalQuotedPrice()}</p>
                                        </FormGroup>
                                        <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12} >
                                            <Label className="text-dark font-weight-bolder" for='remarksId'>Costing Information</Label>
                                            <Table bordered className="custom-table text-center">
                                                <thead>
                                                    <tr>
                                                        <th>Costing No</th>
                                                        <th>Style No</th>
                                                        <th>Costing Qty</th>
                                                        <th>Costing UOM</th>
                                                        <th>Costing Per Unit Price</th>
                                                        <th>Total Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        selectedSetCosting?.styleCostingDetails?.map( cph => (
                                                            <tr key={cph.costingNumber}>
                                                                <td>{cph.styleCosting}</td>
                                                                <td>{cph.styleNumber}</td>
                                                                <td>{cph.costingQuantity}</td>
                                                                <td>{cph.costingUom}</td>
                                                                <td>{cph.stylePerUnitCost}</td>
                                                                <td>{cph.styleTotalCost}</td>
                                                            </tr>
                                                        ) )
                                                    }

                                                </tbody>
                                            </Table>
                                        </FormGroup>
                                    </Row>
                                </div>
                            </Col>

                        </Row>


                        <Row  >
                            <Col>
                                <div className='divider divider-left '>
                                    <div className='divider-text text-secondary font-weight-bolder'>Details</div>
                                </div>
                                <div className="border rounded rounded-3 p-1">
                                    <Row>
                                        <Col>
                                            <Nav tabs>
                                                <NavItem>
                                                    <NavLink
                                                        active={active === '1'}
                                                        onClick={() => {
                                                            toggle( '1' );
                                                        }}
                                                    >
                                                        <span>Accessories</span>
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                            <TabContent activeTab={active} style={{ backgroundColor: 'white', border: 'solid #dddddd 1px' }}>

                                                <TabPane tabId='1' >
                                                    <div >
                                                        <ResizableTable
                                                            mainClass="resizeAccess"
                                                            tableId="accessTable"
                                                            className="pre-costing-details-table table-bordered"
                                                            size="sm"
                                                            responsive={true}
                                                        >
                                                            <thead className='thead-light'>
                                                                <tr>
                                                                    <th className=' text-center'><strong>Item Group</strong></th>
                                                                    <th className='text-center'><strong>Item Sub</strong></th>
                                                                    <th className='text-center'><strong>Cons. UOM</strong></th>
                                                                    <th className='text-center'><strong>Process Loss(%)</strong></th>
                                                                    <th className='text-center'><strong>Cons(Qty.)</strong></th>
                                                                    <th className='text-center'><strong>Cost Per Unit</strong></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="text-center">
                                                                {
                                                                    selectedSetCosting?.accessoriesDetails?.map( i => (
                                                                        <tr key={i.fieldId} >
                                                                            <td style={{ width: '105px' }} >
                                                                                {i.itemGroupName}
                                                                            </td>
                                                                            <td style={{ width: '105px' }} >

                                                                                {i.itemSubGroupName}

                                                                            </td>


                                                                            <td style={{ width: '105px' }} >

                                                                                {i.consumptionUOM}

                                                                            </td>
                                                                            <td style={{ width: '105px' }} >
                                                                                {i.wastagePercent}
                                                                            </td>
                                                                            <td style={{ width: '105px' }}>
                                                                                {i.consumptionQuantity}
                                                                            </td>
                                                                            <td style={{ width: '105px' }} >
                                                                                {i.consumptionRatePerUnit}
                                                                            </td>

                                                                        </tr>
                                                                    ) )
                                                                }

                                                            </tbody>
                                                        </ResizableTable>
                                                    </div>


                                                </TabPane>
                                            </TabContent>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>

                        </Row>

                    </Form>
                </CardBody>
            </Card>

        </div >
    );
};

export default SetCostingDetails;

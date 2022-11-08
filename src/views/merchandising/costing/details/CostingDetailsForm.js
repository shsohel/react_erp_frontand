
import FallbackSpinner from '@components/spinner/Fallback-spinner';

import '@custom-styles/merchandising/form/costing-form.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Collapse, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import * as yup from 'yup';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomFloat from '../../../../utility/custom/CustomFloat';
import LabelBox from '../../../../utility/custom/LabelBox';
import { confirmObj, costingStatus, permissibleProcessObj } from '../../../../utility/enums';
import { isPermit, isZeroToFixed, selectThemeColors } from '../../../../utility/Utils';
import CostingSearchableListModal from '../form/CostingSearchableListModal';
import { bindCostingBasicInfo, cloneCosting, costingStatusChange, getCostingById, getEditCostingSizeGroupAndColorsHistory } from '../store/action';
import CostingDetailsTable from './CostingDetailsTable';


const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'costingList',
        name: 'Costings',
        link: "/costings",
        isActive: false
    },
    {
        id: 'costing',
        name: 'Edit',
        link: "#",
        isActive: true
    }
];


// Shipment Mode
const selectShipment = [
    { value: 1, label: 'Air' },
    { value: 2, label: 'Road' },
    { value: 3, label: 'Sea' }
];
// Shipment Mode
const selectTerm = [
    { value: 1, label: 'FOB' },
    { value: 2, label: 'CFR' },
    { value: 3, label: 'CIF' },
    { value: 4, label: 'EXW' }
];


const CostingDetailsForm = () => {
    const dispatch = useDispatch();
    const { replace, push, goBack } = useHistory();
    const { state } = useLocation();
    const costingId = state;
    const {
        costingBasicInfo,
        costingGroupsSummary,
        costingFabricDetails,
        costingAccessoriesDetails,
        isCostingDataProgress
    } = useSelector( ( { costings } ) => costings );
    const { userPermission, authenticateUser } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );


    const [costingSearchModalOpen, setCostingSearchModalOpen] = useState( false );


    const SignupSchema = yup.object().shape( {

        costingTerm: costingBasicInfo?.costingTerm ? yup.string() : yup.string().required( 'Costing Term is Required!!' ),
        currency: costingBasicInfo?.currencyCode ? yup.string() : yup.string().required( 'Currency Term is Required!!' ),
        shipmentMode: costingBasicInfo?.shipmentMode ? yup.string() : yup.string().required( 'ShipmentMode Term is Required!!' ),
        //password: yup.string().min( 6 ).required()
        test: yup.array().of( yup.object().shape(
            costingFabricDetails.map( i => ( {
                itemGroup: i?.itemGroup ? yup.string() : yup.string().required( 'Currency Term is Required!!' )
            } ) )
        ) )
    } );

    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );


    useEffect( () => {
        dispatch( getCostingById( costingId ) );
    }, [dispatch, costingId] );


    useEffect( () => {
        const queryData = costingBasicInfo?.styleOrderDetails.map( order => ( {
            orderId: order.orderId,
            styleId: order.styleId
        } ) );
        dispatch( getEditCostingSizeGroupAndColorsHistory(
            queryData,
            costingBasicInfo?.colors,
            costingBasicInfo?.sizeGroups
        ) );
    }, [dispatch, costingBasicInfo?.styleOrderDetails] );


    ///DropdownOnChange
    const handleDetailsDropdownOChange = ( data, e ) => {
        const { name } = e;
        if ( costingBasicInfo?.status?.value === 'Approved' ) {
            confirmDialog( {
                ...confirmObj,
                title: `Approved By`,
                text: `<h4 class="text-primary mb-0">${costingBasicInfo.approvedBy}</h4> <br/> <span> Are you sure to change?</span>`
            } ).then( async e => {
                if ( e.isConfirmed ) {
                    const updateObj = {
                        ...costingBasicInfo,
                        [name]: data
                    };
                    dispatch( bindCostingBasicInfo( updateObj ) );
                }
            } );
        } else {
            const updateObj = {
                ...costingBasicInfo,
                [name]: data
            };
            dispatch( bindCostingBasicInfo( updateObj ) );
        }
    };


    const handleCancel = () => {
        replace( '/costings' );
        const obj = {
            buyer: { label: costingBasicInfo?.buyerName, value: costingBasicInfo?.buyerId },
            style: { label: costingBasicInfo?.styleNumber, value: costingBasicInfo?.styleId },
            styleDescription: costingBasicInfo?.styleDescription ?? '',
            styleCategory: costingBasicInfo?.styleCategory ?? '',
            isSetStyle: false
        };
        localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );
    };

    const sumOfInHouseAmountTotal = () => {
        const total = _.sum( costingGroupsSummary.map( i => Number( i.inHouseAmount ) ) );
        return total;
    };
    const sumOfBuyerAmountTotal = () => {
        const total = _.sum( costingGroupsSummary.map( i => Number( i.buyerAmount ) ) );
        return total;
    };


    const handleCostingSearchModal = () => {
        setCostingSearchModalOpen( !costingSearchModalOpen );


        // const obj = {
        //     buyer: { label: costingBasicInfo?.buyerName, value: costingBasicInfo?.buyerId },
        //     style: { label: costingBasicInfo?.styleNumber, value: costingBasicInfo?.styleId },
        //     styleDescription: costingBasicInfo?.styleDescription ?? '',
        //     styleCategory: costingBasicInfo?.styleCategory ?? '',
        //     isSetStyle: false
        // };
        // localStorage.setItem( 'buyerAndStyle', JSON.stringify( obj ) );
    };


    const onSubmit = () => {
        dispatch( costingStatusChange( costingId, costingBasicInfo?.updateStatus?.label ) );

    };

    const handleAddNew = () => {
        dispatch( bindCostingBasicInfo( null ) );
        dispatch( getCostingById( null ) );
        push( `/new-costing` );
    };
    const handleEdit = () => {

        replace( { pathname: `/costings-edit`, state: costingId } );
    };

    const checkLoading = !costingBasicInfo?.sysId?.length || !costingGroupsSummary?.length;
    const [collapseMasterInfo, setCollapseMasterInfo] = useState( true );

    const handleCloneCosting = () => {
        dispatch( cloneCosting( costingBasicInfo, costingFabricDetails, costingAccessoriesDetails, costingGroupsSummary, replace ) );
    };

    // console.log( 'permisible', authenticateUser.permissibleProcesses.some( p => p === 'Costing' ) );
    // console.log( 'can Aprrove', isPermit( userPermission?.CostingCanApprove, authPermissions ) );
    // console.log( 'user', authenticateUser?.id === costingBasicInfo?.approvedById );


    const isPermittedByStatus = ( status, approvedById ) => {
        if ( status === "Approved" ) {
            const permitted = ( authenticateUser?.id === approvedById )
                || authenticateUser.permissibleProcesses.some( p => p === permissibleProcessObj.costing );
            return permitted;
        } else {
            return true;
        }
    };

    const isEditButtonHidden = ( status ) => {
        let hidden = false;
        if ( status === 'Approved' ) {
            hidden = true;
        } else if ( status !== 'Approved' ) {
            hidden = !isPermit( userPermission?.CostingEdit, authPermissions );
        }
        return hidden;
    };

    const handleGetPurchaseOrderAndFob = ( orders, fob ) => {
        const uniqOrders = _.uniqBy( orders, 'orderId' );
        const fobOrders = uniqOrders.filter( order => order.ratePerUnit < fob ).map( o => o.orderNumber );
        return fobOrders;
    };

    return (
        <div >
            <ActionMenu breadcrumb={breadcrumb} title='Costing Details' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        type="submit"
                        // onClick={() => { onSubmit(); }}
                        onClick={handleSubmit( onSubmit )}
                        disabled={isCostingDataProgress}

                    >Save</NavLink>
                </NavItem>
                <NavItem
                    className="mr-1"
                    hidden={isEditButtonHidden( costingBasicInfo?.status?.label )}
                >
                    <NavLink
                        tag={Button}

                        size="sm"
                        color="success"
                        // onClick={() => { onSubmit(); }}
                        onClick={() => { handleEdit(); }}
                        disabled={isCostingDataProgress}

                    >Edit</NavLink>
                </NavItem>
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="secondary"
                        onClick={() => { handleCancel(); }}
                        disabled={isCostingDataProgress}

                    >
                        Cancel
                    </NavLink>
                </NavItem>
                <NavItem
                    className="mr-1"
                    hidden={!isPermit( userPermission?.CostingCreate, authPermissions )}
                >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="success"
                        onClick={() => { handleAddNew(); }}
                        disabled={isCostingDataProgress}
                    >
                        Add New
                    </NavLink>
                </NavItem>
            </ActionMenu>
            {isCostingDataProgress ? <FallbackSpinner /> : (
                <Card className="mt-3 costing-form">
                    <CardBody>
                        <div >

                            <Row >
                                <Col>
                                    <div className='divider divider-left ' onClick={() => { setCollapseMasterInfo( !collapseMasterInfo ); }}>
                                        <div className='divider-text text-secondary font-weight-bolder'>Master Info
                                            <span >
                                                <Button.Ripple style={{ padding: '0.4rem' }} className='btn-icon' size="sm" color='flat-secondary'>
                                                    <ChevronUp
                                                        hidden={collapseMasterInfo}
                                                        size={18}
                                                        color='grey'
                                                        onClick={() => { setCollapseMasterInfo( !collapseMasterInfo ); }}
                                                    />
                                                    <ChevronDown
                                                        hidden={!collapseMasterInfo}
                                                        size={18}
                                                        color='grey'
                                                        onClick={() => { setCollapseMasterInfo( !collapseMasterInfo ); }}
                                                    />
                                                </Button.Ripple>

                                            </span></div>
                                    </div>
                                    <Collapse isOpen={collapseMasterInfo}>
                                        <div className="border rounded rounded-3 p-1">
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                                    <Row>
                                                        {/* <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label col-div-3 costing' for='costingNumberId'> SYS ID</Label>
                                                                <Label className='custom-form-colons col-div-3 costing'> : </Label>
                                                                <div className='custom-form-input-group col-div-3 costing font-weight-bolder'>
                                                                    {costingBasicInfo?.sysId}
                                                                </div>
                                                            </div>
                                                        </Col> */}
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='sysID'> SYS ID</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                {/* <LabelBox /> */}
                                                                <div className='custom-form-group'>
                                                                    <LabelBox text={costingBasicInfo?.sysId} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='buyerId'> Buyer</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <LabelBox text={costingBasicInfo?.buyer?.label} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='styleId'> Style</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>

                                                                    <LabelBox text={costingBasicInfo?.style?.label} />

                                                                </div>
                                                            </div>

                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='styleDescriptionId'>Costing NO</Label>
                                                                <Label className='custom-form-colons '> : </Label>
                                                                <div className='custom-form-input-group'>
                                                                    <div className='custom-input-group-prepend inside-btn'>
                                                                        <LabelBox text={costingBasicInfo?.costingNumber} />
                                                                    </div>
                                                                    <div className='custom-input-group-append inside-btn'>

                                                                        <Button.Ripple
                                                                            className='btn-icon '
                                                                            outline
                                                                            size="sm"
                                                                            color='primary'
                                                                            onClick={() => { handleCostingSearchModal(); }}

                                                                        >
                                                                            <Search size={16} />
                                                                        </Button.Ripple>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label ' for='styleDescriptionId'>Style Description</Label>
                                                                <Label className='custom-form-colons '> : </Label>
                                                                <div className='custom-form-group '>
                                                                    <LabelBox text={costingBasicInfo?.styleDescription} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='costingTermId'>Style Category</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <LabelBox text={costingBasicInfo?.styleCategory} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='costingTermId'>Costing Term <span className='text-danger'>*</span></Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <LabelBox text={costingBasicInfo?.costingTerm?.label} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >

                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='uomId'> Costing Per</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-input-group'>

                                                                    <div className='custom-input-group-prepend inside-number'>
                                                                        <LabelBox text={costingBasicInfo?.costingQuantity} />
                                                                    </div>
                                                                    <div className='custom-input-group-append inside-dropdown'>
                                                                        <LabelBox text={costingBasicInfo?.uom?.label} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='currencyId'>Currency <span className='text-danger'>*</span></Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <LabelBox text={costingBasicInfo?.currencyCode?.label} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='dateId'>Date</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <LabelBox text={moment( Date.parse( costingBasicInfo?.costingDate ) ).format( 'DD-MM-yyyy' )} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='shipmentModeId'>Shipment Mode <span className='text-danger'>*</span></Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <LabelBox text={costingBasicInfo?.shipmentMode?.label} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div hidden={costingBasicInfo?.updateStatus?.label === 'Pre-Costing'} className='custom-form-main'>
                                                                <Label className='custom-form-label' for='quotedPerUnitId'>10hrs Production</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>

                                                                    <LabelBox text={`NA`} />
                                                                </div>
                                                            </div>
                                                            <div hidden={costingBasicInfo?.updateStatus?.label !== 'Pre-Costing'} className='custom-form-main'>
                                                                <Label className='custom-form-label' for='shipmentDateId'>Shipment Date</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <LabelBox text={costingBasicInfo?.updateStatus?.label === 'Pre-Costing' ? costingBasicInfo.shipmentDate : ""} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='fobId'>FOB</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <LabelBox text={isZeroToFixed( costingBasicInfo?.fobAmount, 6 )} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='fobId'>CM %</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <LabelBox text={isZeroToFixed( costingGroupsSummary?.find( cgs => cgs.name === 'CM' )?.buyerAmount, 6 )} />

                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='effectiveCMId'>Effective CM</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <LabelBox text={isZeroToFixed( costingGroupsSummary?.find( cgs => cgs.name === 'CM' )?.buyerAmount, 6 )} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='quotedId'>Quoted Price($)</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <LabelBox text={isZeroToFixed( costingBasicInfo?.totalQuotedPrice, 6 )} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='quotedPerUnitId'>Qtd. Price(Per PCS)</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>

                                                                    <LabelBox text={isZeroToFixed( costingBasicInfo?.perUnitQuotedPrice, 6 )} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='merchandiserId'>Merchandiser</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    {/* {costingBasicInfo?.merchandiser?.label ?? authenticateUser?.name} */}
                                                                    <LabelBox text={costingBasicInfo?.merchandiser?.label ?? ''} />

                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row hidden={costingBasicInfo?.updateStatus?.label !== 'Pre-Costing'}>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='expectedQuantityId'>Expected Qty.</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>
                                                                    <LabelBox text={costingBasicInfo?.expectedQuantity} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                            <div className='custom-form-main'>
                                                                <Label className='custom-form-label' for='quotedPerUnitId'>10hrs Production</Label>
                                                                <Label className='custom-form-colons'> : </Label>
                                                                <div className='custom-form-group'>

                                                                    <LabelBox text={`NA`} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} sm={12} md={12} lg={4} xl={4} >

                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                                    <div className=' border rounded pt-0 pr-1 pb-1 pl-1 costing-custom-table' >
                                                        <Label className="font-weight-bolder"> Purchase Order</Label>
                                                        <Table responsive bordered size="sm">
                                                            <thead className='text-center'>
                                                                <tr>
                                                                    <th className='sl'>SL</th>
                                                                    <th>PO NO</th>
                                                                    <th>Shipt. Date</th>
                                                                    <th>Size Group</th>
                                                                    <th>Color</th>
                                                                    <th>Dest.</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className='text-center' >

                                                                {costingBasicInfo?.styleOrderDetails?.map( ( order, index ) => (
                                                                    <tr key={order?.rowId}>
                                                                        <td className='sl'>{index + 1}</td>
                                                                        <td>{order.orderNumber}</td>
                                                                        <td>
                                                                            {moment( Date.parse( order.shipmentDate ) ).format( "DD-MM-yyyy" )}
                                                                        </td>
                                                                        <td>{order.sizeGroup}</td>
                                                                        <td>{order.color}</td>
                                                                        <td>{order.destination}</td>

                                                                    </tr>
                                                                ) )
                                                                }

                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    {handleGetPurchaseOrderAndFob( costingBasicInfo?.styleOrderDetails, sumOfBuyerAmountTotal() ).length > 0 && (
                                                        <div style={{ color: 'red' }}>
                                                            {`FOB Amount greater then those (${handleGetPurchaseOrderAndFob( costingBasicInfo?.styleOrderDetails, sumOfBuyerAmountTotal() )}) orders amount.`}
                                                        </div>
                                                    )}

                                                </Col>
                                            </Row>
                                            <Row>

                                                <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label col-div-4 costings-remarks' for='remarksId'>Remarks</Label>
                                                        <Label className='custom-form-colons col-div-4 costings-remarks'> : </Label>
                                                        <div className='custom-form-group col-div-4 costings-remarks'>
                                                            <LabelBox text={costingBasicInfo?.remarks} />
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                                    <div className='custom-form-main'>
                                                        <Label className='custom-form-label col-div-4 ' for='remarksId'>Special Instruction</Label>
                                                        <Label className='custom-form-colons col-div-4'> : </Label>
                                                        <div className='custom-form-group col-div-4'>
                                                            <LabelBox text={costingBasicInfo?.additionalInstruction} />
                                                        </div>
                                                    </div>
                                                </Col>


                                            </Row>
                                        </div>
                                    </Collapse>

                                </Col>
                            </Row>

                            <Col xs={12} sm={12} md={4} lg={12} xl={12}  >
                                <CustomFloat title='Costing Summary'>
                                    <div className="pre-costing-summary-table">
                                        <Table bordered size='sm'>
                                            <thead className='thead-light'>
                                                <tr >
                                                    <th className='small'><strong>Group Name</strong></th>
                                                    <th className='text-center small'><strong>Buyer Amount</strong></th>
                                                    <th className='text-center  small'><strong>In House Amount</strong></th>
                                                    <th style={{ width: '15%' }} className='text-center  small'><strong>%</strong></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    _.orderBy( costingGroupsSummary, ['id'], ['asc'] ).map( i => (
                                                        <tr key={i.id}>
                                                            <td className='text-left small font-weight-bolder' style={{ padding: '5px' }}>
                                                                {i.name}
                                                            </td>
                                                            <td className='text-right ' style={{ padding: '4px' }}>
                                                                {/* <NumberFormat
                                                                    className="form-control-sm form-control"
                                                                    value={i.name === 'Total' ? isZeroToFixed( sumOfBuyerAmountTotal(), 6 ) : i.buyerAmount}
                                                                    displayType="input"
                                                                    name="buyerAmount"
                                                                    decimalScale={6}
                                                                    fixedDecimalScale={i.buyerAmount > 0}
                                                                    allowNegative={false}
                                                                    allowLeadingZeros={false}
                                                                    onFocus={e => {
                                                                        e.target.select();
                                                                    }}
                                                                    onBlur={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    onChange={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    disabled
                                                                /> */}
                                                                {i.name === 'Total' ? isZeroToFixed( sumOfBuyerAmountTotal(), 6 ) : isZeroToFixed( i.buyerAmount, 6 )}
                                                            </td>
                                                            <td className='text-right' style={{ padding: '4px' }}>
                                                                {/* <NumberFormat
                                                                    className="form-control-sm form-control"
                                                                    value={i.name === 'Total' ? isZeroToFixed( sumOfInHouseAmountTotal(), 6 ) : i.inHouseAmount}
                                                                    displayType="input"
                                                                    name="inHouseAmount"
                                                                    decimalScale={6}
                                                                    fixedDecimalScale={i.inHouseAmount > 0}
                                                                    allowNegative={false}
                                                                    allowLeadingZeros={false}
                                                                    onFocus={e => {
                                                                        e.target.select();
                                                                    }}
                                                                    onBlur={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    onChange={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    disabled
                                                                /> */}
                                                                {i.name === 'Total' ? isZeroToFixed( sumOfInHouseAmountTotal(), 6 ) : isZeroToFixed( i.inHouseAmount, 4 )}
                                                            </td>
                                                            <td className='text-right' style={{ padding: '4px' }}>
                                                                {/* <NumberFormat
                                                                    className="form-control-sm form-control"
                                                                    value={i.name === 'Total' ? 0 : i.inPercentage}
                                                                    displayType="input"
                                                                    name="inPercentage"
                                                                    decimalScale={2}
                                                                    fixedDecimalScale={i.inPercentage > 0}
                                                                    allowNegative={false}
                                                                    allowLeadingZeros={false}
                                                                    onFocus={e => {
                                                                        e.target.select();
                                                                    }}
                                                                    onBlur={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    onChange={e => { handleCostingGroupChange( e, i.id ); }}
                                                                    disabled
                                                                /> */}

                                                                {i.name === 'Total' ? 0 : isZeroToFixed( i.inPercentage, 4 )}
                                                            </td>
                                                        </tr>
                                                    ) )
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </CustomFloat>
                            </Col>
                            <Row  >
                                <Col>
                                    <div className='divider divider-left '>
                                        <div className='divider-text text-secondary font-weight-bolder'>Details</div>
                                    </div>
                                    <div className="border rounded rounded-3 p-1">
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <CostingDetailsTable />
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="border rounded rounded-3 p-1 mt-1">
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label' for='statusId'>Status</Label>
                                                    <Label className='custom-form-colons'> : </Label>
                                                    <div className='custom-form-group'>
                                                        {
                                                            isPermit( userPermission?.CostingCanApprove, authPermissions ) ? (
                                                                <Select
                                                                    id='statusId'
                                                                    //  isDisabled={!isPermit( userPermission?.CostingCanApprove, authPermissions ) || !( authenticateUser?.id === costingBasicInfo?.approvedById )}
                                                                    isDisabled={!isPermittedByStatus( costingBasicInfo?.status?.value, costingBasicInfo?.approvedById )}

                                                                    isSearchable
                                                                    menuPlacement="top"
                                                                    name="updateStatus"
                                                                    isClearable
                                                                    theme={selectThemeColors}
                                                                    options={costingStatus}
                                                                    classNamePrefix='dropdown'
                                                                    className="erp-dropdown-select"
                                                                    innerRef={register( { required: true } )}
                                                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                                                    value={costingBasicInfo?.updateStatus}
                                                                    onChange={( data, e ) => {
                                                                        handleDetailsDropdownOChange( data, e );
                                                                    }}
                                                                />
                                                            ) : costingBasicInfo?.status?.value
                                                        }


                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label' for='statusId'>Approved By</Label>
                                                    <Label className='custom-form-colons'> : </Label>
                                                    <div className='custom-form-group'>
                                                        {costingBasicInfo?.approvedBy ?? ''}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label' for='statusId'>Approved Date</Label>
                                                    <Label className='custom-form-colons'> : </Label>
                                                    <div className='custom-form-group'>
                                                        {costingBasicInfo?.approveDate ? moment( Date.parse( costingBasicInfo?.approveDate ) ).format( 'DD/MM/YYYY' ) : ''}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>

                        </div>
                    </CardBody>
                </Card>
            )
            }


            {
                costingSearchModalOpen && (
                    <CostingSearchableListModal
                        openModal={costingSearchModalOpen}
                        setOpenModal={setCostingSearchModalOpen}
                        searchFor="costing-details"
                    />
                )
            }
        </div >
    );
};

export default CostingDetailsForm;

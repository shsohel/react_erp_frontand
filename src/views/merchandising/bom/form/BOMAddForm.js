import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/basic/custom-form.scss';
import { notify } from "@custom/notifications";
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Select from 'react-select';
import { Button, Card, CardBody, Col, CustomInput, Label, NavItem, NavLink, Row } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { isPermit, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownBuyers } from '../../buyer/store/actions';
import BOMGenerateAndView from '../details/BOMGenerateAndView';
import { bindBomBasicInfo, bindDetails, bomGenerationByOrderId, bomReGenerationByOrderId, clearAllBomState, getBomPurchaseOrders, getBOMSByOrderIds, getBOMSByOrderIdsBeforeGenerate } from '../store/actions';
import { BOMPurchaserOrders } from './BOMPurchaserOrders';
import GeneratedBoms from './GeneratedBoms';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    },

    {
        id: 'bom',
        name: 'BOM',
        link: "#",
        isActive: true,
        hidden: false
    }
];

const BOMAddForm = () => {
    const { replace } = useHistory();
    const dispatch = useDispatch();
    const { dropDownBuyers, isBuyerDropdownLoaded } = useSelector( ( { buyers } ) => buyers );
    const { bomBasicInfo, bomPurchaseOrders, isBomPurchaseOrdersDataOnProgress, isBomItemDetailsDataOnProgress } = useSelector( ( { boms } ) => boms );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );


    const handleBuyerOnFocus = () => {
        if ( !dropDownBuyers.length ) {
            dispatch( getDropDownBuyers() );
        }
    };


    const handleBomGenerate = () => {
        const selectedOrdersId = bomPurchaseOrders.filter( o => o.isSelected === true ).map( order => (
            {
                orderId: order.orderId,
                styleId: order.styleId,
                destination: order.destination,
                shipmentDate: moment.utc( order.shipmentDate )
            }
        ) );

        const regenerateIds = bomPurchaseOrders.filter( o => o.isSelected === true ).map( order => ( {
            bomId: order.bomId,
            orderId: order.orderId,
            styleId: order.styleId,
            destination: order.destination,
            shipmentDate: moment.utc( order.shipmentDate )

        } ) );

        if ( bomBasicInfo.isRegenerate ) {
            if ( regenerateIds.length ) {
                dispatch( bomReGenerationByOrderId( regenerateIds, bomBasicInfo?.buyer?.value, 'regenerate' ) );
            } else {
                notify( 'error', 'Please select at least a purchaser order!' );
            }
        } else {
            if ( selectedOrdersId.length ) {
                dispatch( bomGenerationByOrderId( selectedOrdersId, bomBasicInfo.buyer?.value, 'pending' ) );
            } else {
                notify( 'error', 'Please select at least a purchaser order!' );
            }
        }
    };

    const handleBomView = () => {
        const selectedOrdersId = bomPurchaseOrders.filter( o => o.isSelected === true ).map( order => order.bomId );
        dispatch( getBOMSByOrderIds( selectedOrdersId ) );
    };

    const handleBomViewBeforeGenerate = () => {
        const queryData = bomPurchaseOrders.filter( o => o.isSelected === true ).map( order => ( {
            orderId: order.orderId,
            styleId: order.styleId,
            destination: order.destination,
            shipmentDate: moment.utc( order.shipmentDate )

        } ) );
        dispatch( getBOMSByOrderIdsBeforeGenerate( queryData ) );
    };

    const handleBuyerDropdown = ( data ) => {
        const bomStatus = bomBasicInfo?.isPending ? 'pending' : bomBasicInfo?.isGenerated ? 'generated' : 'regenerate';
        const updateObj = {
            ...bomBasicInfo,
            buyerId: data?.value,
            buyerName: data?.label,
            buyer: data
        };
        dispatch( bindBomBasicInfo( updateObj ) );
        dispatch( getBomPurchaseOrders( data?.value, bomStatus ) );
    };

    const handleRadioChange = ( e ) => {
        const { name, type, value, checked } = e.target;
        const bomStatus = name === 'isPending' ? 'pending' : name === 'isGenerated' ? 'generated' : 'regenerate';

        const updateObj = {
            ...bomBasicInfo,
            isPending: name === 'isPending' ? checked : !checked,
            isGenerated: name === 'isGenerated' ? checked : !checked,
            isRegenerate: name === 'isRegenerate' ? checked : !checked
        };
        dispatch( bindBomBasicInfo( updateObj ) );
        dispatch( getBomPurchaseOrders( bomBasicInfo?.buyer?.value, bomStatus ) );
        dispatch( bindDetails( [] ) );

    };


    const handleClear = () => {
        dispatch( clearAllBomState() );
    };

    const handleCancel = () => {
        replace( '/bom' );
        handleClear();
    };
    return (
        <>
            <Card className="mt-3">
                <CardBody className="">
                    <div >
                        <ActionMenu breadcrumb={breadcrumb} title='BOM' >
                            <NavItem className="mr-1" >
                                <NavLink
                                    tag={Button}
                                    size="sm"
                                    color="secondary"
                                    onClick={() => { handleClear(); }}
                                >
                                    Clear
                                </NavLink>
                            </NavItem>
                        </ActionMenu>
                        <div className=' border rounded rounded-3'>
                            <Row className="p-1">
                                <Col lg={3}>
                                    <div className='custom-form-main'>
                                        <Label className='custom-form-label' for='styleId'>Buyer</Label>
                                        <Label className='custom-form-colons'> : </Label>
                                        <div className='custom-form-group'>
                                            <Select
                                                placeholder="Select Buyer"
                                                id='BuyerId'
                                                isLoading={!isBuyerDropdownLoaded}
                                                menuPosition="fixed"
                                                isSearchable
                                                isClearable
                                                theme={selectThemeColors}
                                                options={dropDownBuyers}
                                                classNamePrefix='dropdown'
                                                className="erp-dropdown-select"
                                                value={bomBasicInfo?.buyer}
                                                onChange={data => {
                                                    handleBuyerDropdown( data );
                                                }}
                                                onFocus={() => { handleBuyerOnFocus(); }}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <Row style={{ padding: '5px', marginLeft: '2px', marginRight: '2px' }} className="border rounded">
                                        <Col>

                                            <div className=' font-weight-bold custom-input-box'>
                                                <CustomInput
                                                    type='radio'
                                                    label="Pending"
                                                    id="isPendingId"
                                                    bsSize="sm"
                                                    name='isPending'
                                                    htmlFor="isPendingId"
                                                    checked={bomBasicInfo?.isPending}
                                                    onChange={( e ) => { handleRadioChange( e ); }}
                                                />
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className=' font-weight-bold custom-input-box'>
                                                <CustomInput
                                                    type='radio'
                                                    label="Generated"
                                                    id="isGeneratedId"
                                                    bsSize="sm"
                                                    name='isGenerated'
                                                    htmlFor="isGeneratedId"
                                                    checked={bomBasicInfo?.isGenerated}
                                                    onChange={( e ) => { handleRadioChange( e ); }}
                                                />
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className=' font-weight-bold custom-input-box'>
                                                <CustomInput
                                                    type='radio'
                                                    label="Re-Generate"
                                                    id="isRegenerateId"
                                                    bsSize="sm"
                                                    name='isRegenerate'
                                                    htmlFor="isRegenerateId"
                                                    checked={bomBasicInfo?.isRegenerate}
                                                    onChange={( e ) => { handleRadioChange( e ); }}
                                                />
                                            </div>
                                        </Col>
                                    </Row>


                                </Col>


                                <Col lg={3} className="d-flex justify-content-end mt-lg-0 mt-1">
                                    <div className='d-inline-block'>
                                        {
                                            ( isPermit( userPermission?.BOMReGenerate, authPermissions )
                                                || isPermit( userPermission?.BOMGenerate, authPermissions ) ) && (
                                                <Button.Ripple
                                                    onClick={() => { handleBomGenerate(); }}
                                                    className="ml-1 mb-sm-1 mb-xs-1"
                                                    outline
                                                    hidden={bomBasicInfo.isGenerated}
                                                    color="success"
                                                    size="sm"
                                                >
                                                    Generate
                                                </Button.Ripple>
                                            )
                                        }

                                        {
                                            isPermit( userPermission?.BOMView, authPermissions ) && (
                                                <>
                                                    <Button.Ripple
                                                        onClick={() => { handleBomView(); }}
                                                        className="ml-1 mb-sm-1 mb-xs-1"
                                                        outline
                                                        color="primary"
                                                        size="sm"
                                                        hidden={bomBasicInfo.isPending || bomBasicInfo.isRegenerate}
                                                    >
                                                        View
                                                    </Button.Ripple>
                                                    <Button.Ripple
                                                        onClick={() => { handleBomViewBeforeGenerate(); }}
                                                        className="ml-1 mb-sm-1 mb-xs-1"
                                                        outline
                                                        color="primary"
                                                        size="sm"
                                                        hidden={bomBasicInfo.isGenerated}
                                                    >
                                                        View
                                                    </Button.Ripple>
                                                </>
                                            )
                                        }


                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <Row>
                            <Col>
                                <div className='divider divider-left pt-0'>
                                    <div className='divider-text text-secondary font-weight-bolder'>Purchase Order </div>
                                </div>
                                <UILoader blocking={isBomPurchaseOrdersDataOnProgress} loader={<ComponentSpinner />} >

                                    <div className="border rounded rounded-3 p-1" style={{ minHeight: '200px' }}>
                                        <Row>
                                            <Col>
                                                <BOMPurchaserOrders />
                                            </Col>
                                        </Row>
                                    </div>
                                </UILoader>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className='divider divider-left pt-0'>
                                    <div className='divider-text text-secondary font-weight-bolder'>BOM </div>
                                </div>
                                <UILoader blocking={isBomItemDetailsDataOnProgress} loader={<ComponentSpinner />} >

                                    <div className="border rounded rounded-3 p-1" style={{ minHeight: '200px' }}>
                                        <Row>
                                            <Col>
                                                <GeneratedBoms />
                                            </Col>
                                        </Row>
                                    </div>
                                </UILoader>
                            </Col>
                        </Row>
                    </div>
                </CardBody>
            </Card>
            <BOMGenerateAndView />
        </>

    );
};

export default BOMAddForm;

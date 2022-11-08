import '@custom-styles/basic/custom-form.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import '@custom-styles/merchandising/others/pre-costing-collapse.scss';
import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import '@custom-styles/merchandising/select/pre-costing-select.scss';
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { MoreHorizontal } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { Button, Card, CardBody, Col, CustomInput, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { selectThemeColors } from '../../../../utility/Utils';
import { getDropDownPackItemGroupsByGroupName } from '../../../inventory/item-group/store/actions';
import { getDropDownBuyers } from '../../buyer/store/actions';
import { getCurrencyDropdown } from '../../currency/store/actions';
import { consumptionBasicInfoModel } from '../model';
import { bindConsumptionAccessoriesDetails, bindConsumptionBasicInfo, getConsumptionById, getSetConsumptionById, getSetConsumptionStylePurchaseOrderDetails, updateSetConsumption } from '../store/actions';
import ConsumptionDetailsForSetStyle from './ConsumptionDetailsForSetStyle';
import SetConsumptionStylePurchaseOrderModal from './SetConsumptionStylePurchaseOrderModal';
const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: '/',
        isActive: false
    },
    {
        id: 'consumptions',
        name: 'List',
        link: '/consumptions',
        isActive: false
    },
    {
        id: 'editConsumption',
        name: 'Consumption',
        link: '#',
        isActive: true
    }
];
const ConsumptionSetEditForm = () => {
    const dispatch = useDispatch();
    const { replace } = useHistory();
    const {
        selectedSetConsumption,
        consumptionBasicInfo,
        consumptionFabricDetails,
        consumptionAccessoriesDetails,
        consumptionPackagingAccessories
    } = useSelector( ( { consumptions } ) => consumptions );
    const { dropDownBuyers } = useSelector( ( { buyers } ) => buyers );
    const { state } = useLocation();
    const consumptionId = state;
    const [consumptionPurchaserOrderModal, setConsumptionPurchaserOrderModal] = useState( false );


    useEffect( () => {
        dispatch( getSetConsumptionById( consumptionId ) );
    }, [dispatch, consumptionId] );


    useEffect( () => {
        dispatch( getCurrencyDropdown() );
        dispatch( getDropDownPackItemGroupsByGroupName( "Packaging%20and%20Labeling" ) );
    }, [] );

    const handleStylePurchaseOrderModal = () => {
        setConsumptionPurchaserOrderModal( !consumptionPurchaserOrderModal );
        dispatch( getSetConsumptionStylePurchaseOrderDetails( consumptionBasicInfo.buyer?.value ) );

    };

    const handleInputOnChange = ( e ) => {
        const { type, name, value, checked } = e.target;

        if ( type === "checkbox" && !checked ) {
            const updateObj = {
                ...consumptionBasicInfo,
                [name]: type === 'number' ? Number( value ) : type === "checkbox" ? checked : value,
                costingNumber: ''
            };
            dispatch( bindConsumptionBasicInfo( updateObj ) );
        } else {
            const updateObj = {
                ...consumptionBasicInfo,
                [name]: type === 'number' ? Number( value ) : type === "checkbox" ? checked : value
            };
            dispatch( bindConsumptionBasicInfo( updateObj ) );
        }
    };
    const handleBuyerDropdown = ( data ) => {
        if ( data ) {
            const updateObj = {
                ...consumptionBasicInfo,
                buyerId: data?.value,
                buyerName: data?.label,
                buyer: data,
                style: null,
                styleId: '',
                styleNumber: ''

            };
            dispatch( bindConsumptionBasicInfo( updateObj ) );
            dispatch( getSetConsumptionStylePurchaseOrderDetails( data?.value ) );
            dispatch( bindConsumptionAccessoriesDetails( [] ) );

        } else {
            dispatch( bindConsumptionBasicInfo( consumptionBasicInfoModel ) );
            dispatch( getSetConsumptionStylePurchaseOrderDetails( data?.value ) );
            dispatch( bindConsumptionAccessoriesDetails( [] ) );
        }
    };
    const handleBuyerDropdownOnFocus = () => {
        if ( !dropDownBuyers.length ) {
            dispatch( getDropDownBuyers() );
        }
    };

    const onSubmit = () => {
        const setStyleOrderDetails = consumptionBasicInfo.styleOrderDetails.map( order => ( {
            orderId: order.orderId,
            orderNumber: order.orderNumber,
            setStyleId: order.setStyleId,
            setStyleNumber: order.setStyleNumber,
            styleCostingId: order.costingId
        } ) );

        const accessoriesDetails = consumptionAccessoriesDetails.map( acc => ( {
            id: acc.detailId,
            itemGroupId: acc.itemGroup?.value,
            itemSubGroupId: acc.itemSubGroup?.value,
            itemDescription: acc.itemDescription,
            itemDescriptionTemplate: acc.itemDescriptionTemplate,
            consumptionQuantity: acc.consumptionQuantity,
            consumptionUom: acc.consumptionUomValue?.label,
            consumptionUomRelativeFactor: acc.consumptionUomRelativeFactor,
            wastagePercent: acc.wastagePercent,
            consumptionPerGarment: acc.consumptionPerGarment,
            consumptionPerGarmentUom: acc.consumptionPerGarmentUomValue?.label,
            consumptionPerGarmentRelativeFactor: acc.consumptionPerGarmentRelativeFactor,
            orderUOM: acc.orderUOMValue?.label,
            orderUomRelativeFactor: acc.orderUomRelativeFactor,
            currencyCode: acc.currencyValue?.label,
            ratePerUnit: acc.ratePerUnit,
            purchaseType: acc.purchaseTypeValue?.label,
            isApproved: true,
            remarks: "string",
            status: acc.statusValue?.label

        } ) );
        const packagingAccessoriesDetails = consumptionPackagingAccessories.map( pack => pack.details.map( detail => ( {
            orderId: detail.orderId,
            orderNumber: detail.orderNumber,
            itemGroupId: detail.itemGroup?.value,
            itemGroup: detail.itemGroup?.label,
            itemSubGroupId: detail.itemSubGroup?.value,
            itemSubGroup: detail.itemSubGroup?.label,
            itemDescription: detail.itemDescriptionValue?.label,
            itemDescriptionTemplate: detail.itemDescriptionTemplate,
            consumptionQuantity: detail.consumptionQuantity,
            consumptionUom: detail.consumptionUom?.label,
            consumptionUomRelativeFactor: detail.consumptionUomRelativeFactor,
            wastagePercent: detail.wastagePercent,
            orderUOM: detail.orderUom?.label,
            orderUomRelativeFactor: detail.orderUomRelativeFactor,
            currencyCode: detail.currencyCode?.label,
            ratePerUnit: detail.ratePerUnit,
            purchaseType: detail?.purchaseType?.label,
            isApproved: detail.isApproved,
            remarks: "string",
            status: "string"
        } ) ) ).flat();
        const submittedObj = {
            buyerId: consumptionBasicInfo?.buyer?.value,
            buyerName: consumptionBasicInfo?.buyer?.label,
            consumptionNumber: consumptionBasicInfo?.consumptionNumber,
            setStyleOrderDetails,
            accessoriesDetails,
            packagingAccessoriesDetails
        };
        console.log( 'submitedObj', JSON.stringify( submittedObj, null, 2 ) );
        dispatch( updateSetConsumption( submittedObj, consumptionId ) );
    };
    const handleCancel = () => {
        replace( '/consumptions' );
        dispatch( getConsumptionById( null ) );
        dispatch( getSetConsumptionById( null ) );
    };
    const handleAddNew = () => {
        replace( '/new-consumption' );
        dispatch( getConsumptionById( null ) );
        dispatch( getSetConsumptionById( null ) );
        dispatch( bindConsumptionBasicInfo( consumptionBasicInfoModel ) );
    };

    return (
        <div>
            <Card className="mt-3">
                <CardBody>
                    <ActionMenu breadcrumb={breadcrumb} title='Edit Set Consumption' >
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
                    <Row>
                        <Col xl={12}>
                            <div className='divider divider-left '>
                                <div className='divider-text text-secondary font-weight-bolder'>Master Info</div>
                            </div>
                            <div className="border rounded rounded-3 p-1">
                                <Row>
                                    <Col>
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={4} xl={4} >
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label' for='consumptionNumberId'> Cons. No</Label>
                                                    <Label className='custom-form-colons'> : </Label>
                                                    <div className='custom-form-input-group'>
                                                        <div className='custom-input-group-prepend inside-switch'>
                                                            <Input
                                                                id="consumptionNumberId"
                                                                name="consumptionNumber"
                                                                type="text"
                                                                bsSize="sm"
                                                                disabled={!consumptionBasicInfo?.isConsumptionNumberInput}
                                                                onFocus={( e ) => { e.target.select(); }}
                                                                value={consumptionBasicInfo?.consumptionNumber}
                                                                onChange={( e ) => { handleInputOnChange( e ); }}
                                                            />
                                                        </div>
                                                        <div className='custom-input-group-append inside-switch'>

                                                            <CustomInput
                                                                type='switch'
                                                                id="customInputId"
                                                                bsSize="sm"
                                                                name='isConsumptionNumberInput'
                                                                htmlFor="customInputId"
                                                                checked={consumptionBasicInfo?.isConsumptionNumberInput}
                                                                onChange={( e ) => { handleInputOnChange( e ); }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='custom-form-main'>
                                                    <Label className='custom-form-label' for='buyerId'> Buyer</Label>
                                                    <Label className='custom-form-colons'> : </Label>
                                                    <div className='custom-form-input-group'>
                                                        <div className='custom-input-group-prepend inside-btn'>
                                                            <CreatableSelect
                                                                id='buyerId'
                                                                name="buyer"
                                                                isDisabled
                                                                isSearchable
                                                                menuPosition="fixed"
                                                                isClearable
                                                                theme={selectThemeColors}
                                                                options={dropDownBuyers}
                                                                classNamePrefix='dropdown'
                                                                // innerRef={register( { required: true } )}
                                                                className={classnames( 'erp-dropdown-select' )}
                                                                value={consumptionBasicInfo?.buyer}
                                                                onChange={( data, e ) => {
                                                                    handleBuyerDropdown( data, e );
                                                                }}
                                                                onFocus={() => { handleBuyerDropdownOnFocus(); }}
                                                            />
                                                        </div>
                                                        <div className='custom-input-group-append inside-btn'>

                                                            <Button.Ripple
                                                                className='btn-icon'
                                                                outline
                                                                size="sm"
                                                                color='secondary'
                                                                onClick={() => { handleStylePurchaseOrderModal(); }}

                                                            >
                                                                <MoreHorizontal size={16} />
                                                            </Button.Ripple>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={8} xl={8} >
                                                <div className=' border rounded pt-0 pr-1 pb-1 pl-1 costing-custom-table' >
                                                    <Label className="font-weight-bolder"> Purchase Order :</Label>
                                                    <Table responsive bordered size="sm">
                                                        <thead className='text-center'>
                                                            <tr>
                                                                <th className='sl'>SL</th>
                                                                <th>Costing No</th>
                                                                <th>Set Style No</th>
                                                                <th>PO No</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className='text-center' >
                                                            {
                                                                consumptionBasicInfo?.styleOrderDetails?.map( ( cph, index ) => (
                                                                    <tr key={cph.rowId}>
                                                                        <td className='sl'>{index + 1}</td>
                                                                        <td>{cph.costingNumber}</td>
                                                                        <td>{cph.setStyleNumber}</td>
                                                                        <td>{cph.orderNumber}</td>
                                                                    </tr>
                                                                ) )
                                                            }

                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>


                                </Row>

                            </div>
                        </Col>

                    </Row>
                    <Row  >
                        <Col>
                            <div className='divider divider-left '>
                                <div className='divider-text text-secondary font-weight-bolder'>Accessories Details</div>
                            </div>
                            <div className="border rounded rounded-3 p-1">
                                <Row>
                                    <Col>
                                        <ConsumptionDetailsForSetStyle />
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                    </Row>
                </CardBody>
            </Card>
            {
                consumptionPurchaserOrderModal && (
                    <SetConsumptionStylePurchaseOrderModal
                        openModal={consumptionPurchaserOrderModal}
                        setOpenModal={setConsumptionPurchaserOrderModal}
                    />
                )
            }
        </div>
    );
};

export default ConsumptionSetEditForm;

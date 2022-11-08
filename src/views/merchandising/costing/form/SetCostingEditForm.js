// import '@custom-styles/merchandising/others/custom-table.scss';
import Spinner from '@components/spinner/Fallback-spinner';
import '@custom-styles/basic/custom-form.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Eye, MinusSquare, MoreHorizontal } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import CreatableSelect from 'react-select/creatable';
import { Button, Card, CardBody, Col, Form, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import Input from 'reactstrap/lib/Input';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { confirmObj } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';
import { getDropDownBuyers } from '../../buyer/store/actions';
import CostingDetailModal from '../details/CostingDetailModal';
import { bindCostingBasicInfo, bindSetCostingStylePurchaseOrderDetails, bindStyleCostingDetails, getCostingById, getSetCostingById, getSetCostingStylePurchaseOrderDetails, updateSetCosting } from '../store/action';
import SetCostingDetailsForm from './SetCostingDetailsForm';
import SetCostingStylePurchaseOrderModal from './SetCostingStylePurchaseOrderModal';

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
    }
];


const CostingEditFormForSetStyle = () => {
    const dispatch = useDispatch();
    const { replace, push } = useHistory();
    const { state } = useLocation();
    const setCostingId = state;
    const { dropDownBuyers } = useSelector( ( { buyers } ) => buyers );
    const [openModal, setOpenModal] = useState( false );
    const { costingBasicInfo,
        costingAccessoriesDetails,
        setStyleCostingPreviousHistory,
        stylesCostingDetails
    } = useSelector( ( { costings } ) => costings );

    const [costingDetailsModalOpen, setCostingDetailsModalOpen] = useState( false );

    useEffect( () => {
        dispatch( getSetCostingById( setCostingId ) );
    }, [dispatch, setCostingId] );

    const { register, errors, handleSubmit } = useForm();

    const [openStylePurchaseOrderModal, setOpenStylePurchaseOrderModal] = useState( false );

    const handleStylePurchaseOrderModal = () => {
        setOpenStylePurchaseOrderModal( !openStylePurchaseOrderModal );
        dispatch( getSetCostingStylePurchaseOrderDetails( costingBasicInfo?.buyer?.value ) );

    };
    ///DropdownOnChange
    const handleDetailsDropdownOChange = ( data, e ) => {
        const { action, name, option } = e;
        console.log( name );
        const updateObj = {
            ...costingBasicInfo,
            [name]: data
        };

        dispatch( bindCostingBasicInfo( updateObj ) );
    };


    useEffect( () => {
        dispatch( getDropDownBuyers() );
    }, [] );


    const handleInputOnChange = ( e ) => {
        const { type, name, value, checked } = e.target;

        if ( type === "checkbox" && !checked ) {
            const updateObj = {
                ...costingBasicInfo,
                [name]: type === 'number' ? Number( value ) : type === "checkbox" ? checked : value,
                userCostingNumber: ''
            };
            dispatch( bindCostingBasicInfo( updateObj ) );
        } else {
            const updateObj = {
                ...costingBasicInfo,
                [name]: type === 'number' ? Number( value ) : type === "checkbox" ? checked : value
            };
            dispatch( bindCostingBasicInfo( updateObj ) );
        }
    };


    const handleCancel = () => {
        replace( '/costings' );
    };
    // const totalQuotedPrice = () => {
    //     const totalAccessoriesAmount = _.sum( costingAccessoriesDetails?.map( i => Number( i.consumptionQuantity * i.consumptionRatePerUnit ) ) );
    //     const totalQuotedPrice = _.sum( setStyleCostingPreviousHistory?.map( i => Number( i.styleTotalCost ) ) );
    //     return Number( ( totalQuotedPrice + totalAccessoriesAmount ).toFixed( 4 ) );
    // };


    const onSubmit = () => {
        const accessoriesDetails = costingAccessoriesDetails.map( ad => ( {
            itemGroupId: ad.itemGroupId,
            itemSubGroupId: ad.itemSubGroupId,
            consumptionUOM: ad.consumptionUOM?.label,
            wastagePercent: Number( ad.wastagePercent ),
            consumptionQuantity: Number( ad.consumptionQuantity ),
            consumptionRatePerUnit: Number( ad.consumptionRatePerUnit ),
            inHouseQuantity: Number( ad.inHouseQuantity ),
            inHouseRatePerUnit: Number( ad.inHouseQuantity ),
            remarks: ""
        } ) );

        const submitObj = {
            buyerId: costingBasicInfo?.buyer?.value,
            costingNumber: costingBasicInfo?.costingNumber,
            styleOrderDetails: costingBasicInfo?.styleOrderDetails.map( order => ( {
                setStyleId: order.setStyleId,
                setStyleNumber: order.setStyleNumber,
                orderId: order.orderId,
                orderNumber: order.orderNumber,
                shipmentDate: order.shipmentDate,
                currencyCode: order.currencyCode
            } ) ),
            accessoriesDetails,
            styleCostingDetails: stylesCostingDetails.map( costing => ( {
                styleId: costing.styleId,
                setStyleId: costing.setStyleId,
                orderId: costing.orderId,
                styleNumber: costing.styleNumber,
                styleCostingId: costing.costingId,
                styleCosting: costing.costingNumber,
                perUnitCost: costing.perUnitCost
            } ) )
        };
        console.log( JSON.stringify( submitObj, null, 2 ) );
        dispatch( updateSetCosting( submitObj, setCostingId ) );


        // if ( submitObj.styleOrderDetails.length ) {
        //     if ( submitObj.styleCostingDetails.length ) {
        //         dispatch( updateSetCosting( submitObj, setCostingId ) );
        //     } else {
        //         notify( 'warning', 'Costing Details is Empty!!!' );
        //     }
        // } else {
        //     notify( 'error', 'Please select at list a Purchase Order!' );
        // }

    };

    const handleAddNew = () => {
        dispatch( bindCostingBasicInfo( null ) );
        dispatch( getSetCostingById( null ) );
        dispatch( getCostingById( null ) );
        push( `/new-set-costing` );
    };

    const rowWiseUnitPrice = ( orderId, setStyleId ) => {
        const styleCosting = stylesCostingDetails.filter( costing => costing.orderId === orderId && costing.setStyleId === setStyleId );
        const rowWiseTotaled = _.sum( styleCosting.map( c => Number( c.perUnitCost ) ) );
        const total = _.sum( costingAccessoriesDetails.map( cd => Number( cd.totalCost ) ) );

        return rowWiseTotaled + total;
    };

    const handleRemoveCostingsDetails = ( rowId ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                const updatedCostingDetails = stylesCostingDetails.filter( c => c.rowId !== rowId );
                dispatch( bindStyleCostingDetails( updatedCostingDetails ) );
            }
        } );
    };
    const handleRemovePurchaseOrdersDetails = ( rowId ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                console.log( rowId );
                const updatedPurchaseOrder = costingBasicInfo.styleOrderDetails?.filter( order => order.rowId !== rowId );
                const filteredOrder = costingBasicInfo.styleOrderDetails?.filter( order => order.rowId === rowId );
                dispatch( bindSetCostingStylePurchaseOrderDetails( filteredOrder ) );


                const orderCosting = stylesCostingDetails.filter( costing => filteredOrder.some( data => costing.orderId !== data.orderId && costing.setStyleId !== data.setStyleId ) );
                console.log( orderCosting );
                dispatch( bindStyleCostingDetails( orderCosting ) );

                const updatedObj = {
                    ...costingBasicInfo,
                    styleOrderDetails: updatedPurchaseOrder
                };
                dispatch( bindCostingBasicInfo( updatedObj ) );
            }
        } );

    };

    const handleCostingDetails = ( costingId ) => {
        console.log( costingId );
        setCostingDetailsModalOpen( !costingDetailsModalOpen );
        // dispatch( getCostingById( costingId ) );
    };
    const checkLoading = !costingBasicInfo;

    const CostingDetailsCollapsibleTable = ( { data } ) => {

        return (
            <div className='p-2'>
                <h5> Costing Details:</h5>
                <Table bordered className="costing-custom-table text-center">
                    <thead style={{ zIndex: 0 }}>
                        <tr>
                            <th className='sl'>SL</th>
                            <th>Costing No</th>
                            <th>Style No</th>
                            <th>Size Group</th>
                            <th>Color</th>
                            <th>Per Unit Cost</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            stylesCostingDetails.filter( costing => costing.orderId === data.orderId && costing.setStyleId === data.setStyleId )?.map( ( cph, index ) => (
                                <tr key={cph.rowId}>
                                    <td className='sl'>{index + 1}</td>
                                    <td>{cph.costingNumber}</td>
                                    <td>{cph.styleNumber}</td>
                                    <td>{cph.sizeGroup ?? 'NA'}</td>
                                    <td>{cph.color}</td>
                                    <td>{cph.perUnitCost}</td>
                                    <td className='sl'>
                                        <span>
                                            <Button.Ripple
                                                id="deleteAccId"
                                                tag={Label}

                                                onClick={() => { handleRemoveCostingsDetails( cph.rowId ); }}
                                                className='btn-icon p-0 mr-1'
                                                color='flat-danger' >
                                                <MinusSquare size={18} id="deleteAccId" color="red" />
                                            </Button.Ripple>
                                            <Button.Ripple
                                                id="deleteAccId"
                                                tag={Label}

                                                onClick={() => { handleCostingDetails( cph.costingId ); }}
                                                className='btn-icon p-0'
                                                color='flat-success' >
                                                <Eye size={18} id="deleteAccId" color="green" />
                                            </Button.Ripple>
                                        </span>

                                    </td>
                                    {/* <td className={index > 0 && 'd-none'} rowSpan={stylesCostingDetails.length}>{rowWiseUnitPrice()}</td> */}
                                </tr>
                            ) )
                        }
                    </tbody>
                </Table>
            </div>

        );
    };


    return (
        <div>
            {checkLoading ? <Spinner /> : (
                <Card className="mt-3">
                    {/* <CardHeader>
                    <CardTitle className="text-dark font-weight-bold" tag='h2'>New Costing</CardTitle>
                </CardHeader> */}
                    <CardBody >
                        <Form >
                            <ActionMenu breadcrumb={breadcrumb} title='Edit Set Costing' >
                                <NavItem className="mr-1" >
                                    <NavLink
                                        tag={Button}
                                        size="sm"
                                        color="primary"
                                        onClick={() => { onSubmit(); }}
                                    >
                                        Save
                                    </NavLink>
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
                                <NavItem className="mr-1" >
                                    <NavLink
                                        tag={Button}
                                        size="sm"
                                        color="success"
                                        onClick={() => { handleAddNew(); }}
                                    >
                                        Add New
                                    </NavLink>
                                </NavItem>
                            </ActionMenu>
                            <Row >
                                <Col xl={12}>
                                    <div className='divider divider-left '>
                                        <div className='divider-text text-secondary font-weight-bolder'>Master Info</div>
                                    </div>
                                    <div className="border rounded rounded-3 p-1">
                                        <Row>
                                            <Col xl={12}>
                                                <Row>
                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='costingNumberId'> Costing No</Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-input-group'>
                                                                <Input
                                                                    id="costingNumberId"
                                                                    name="userCostingNumber"
                                                                    type="text"
                                                                    bsSize="sm"
                                                                    onFocus={( e ) => { e.target.select(); }}
                                                                    value={costingBasicInfo?.costingNumber}
                                                                    onChange={( e ) => { handleInputOnChange( e ); }}
                                                                />

                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={3} xl={3} >
                                                        <div className='custom-form-main'>
                                                            <Label className='custom-form-label' for='buyerId'> Buyer</Label>
                                                            <Label className='custom-form-colons'> : </Label>
                                                            <div className='custom-form-input-group'>
                                                                <div className='custom-input-group-prepend inside-btn'>
                                                                    <CreatableSelect
                                                                        id='buyerId'
                                                                        name="buyer"
                                                                        isSearchable
                                                                        menuPosition="fixed"
                                                                        isClearable
                                                                        theme={selectThemeColors}
                                                                        options={dropDownBuyers}
                                                                        classNamePrefix='dropdown'
                                                                        innerRef={register( { required: true } )}
                                                                        className={classnames( 'erp-dropdown-select' )}
                                                                        value={costingBasicInfo?.buyer}
                                                                        onChange={( data, e ) => {
                                                                            handleDetailsDropdownOChange( data, e );
                                                                        }}
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

                                                </Row>
                                                <Row>
                                                    <Col xl={12} className="mt-2">
                                                        <Label className="text-dark font-weight-bolder" for='remarksId'>Order Details</Label>
                                                        <DataTable

                                                            noHeader
                                                            dense={true}
                                                            defaultSortAsc
                                                            //    pagination
                                                            persistTableHead
                                                            expandableRows
                                                            expandableRowsComponent={<CostingDetailsCollapsibleTable data={data => data} />}
                                                            className='react-custom-dataTable'
                                                            paginationRowsPerPageOptions={[5, 10, 20, 25]}
                                                            columns={[

                                                                {
                                                                    name: 'SL',
                                                                    width: '30px',
                                                                    selector: 'SL',
                                                                    center: true,
                                                                    cell: ( row, index ) => index + 1
                                                                },
                                                                {
                                                                    name: 'Set Style',
                                                                    minWidth: '150px',
                                                                    selector: 'setStyleNumber',
                                                                    sortable: true,
                                                                    center: true,
                                                                    cell: row => row?.setStyleNumber
                                                                },

                                                                {
                                                                    name: 'Shipment Date',
                                                                    minWidth: '150px',
                                                                    selector: 'shipmentDate',
                                                                    sortable: true,
                                                                    center: true,
                                                                    cell: row => moment( row?.shipmentDate ).format( 'DD-MM-YYYY' )
                                                                },
                                                                {
                                                                    name: 'Shipment Date',
                                                                    minWidth: '150px',
                                                                    selector: 'shipmentDate',
                                                                    sortable: true,
                                                                    center: true,
                                                                    cell: row => moment( row?.shipmentDate ).format( 'DD-MM-YYYY' )
                                                                },
                                                                {
                                                                    name: 'Total Quoted Price',
                                                                    minWidth: '150px',
                                                                    selector: '',
                                                                    center: true,
                                                                    // cell: row => rowWiseUnitPrice( row.orderId, row.setStyleId ).toFixed( 6 )
                                                                    cell: row => rowWiseUnitPrice( row.orderId, row.setStyleId ).toFixed( 6 )
                                                                }
                                                                // {
                                                                //     name: 'Action',
                                                                //     width: '60px',
                                                                //     selector: '',
                                                                //     center: true,
                                                                //     cell: row => <Button.Ripple
                                                                //         id="deleteAccId"
                                                                //         tag={Label}

                                                                //         onClick={() => { handleRemovePurchaseOrdersDetails( row.rowId ); }}
                                                                //         className='btn-icon p-0'
                                                                //         color='flat-danger' >
                                                                //         <MinusSquare size={18} id="deleteAccId" color="red" />
                                                                //     </Button.Ripple>
                                                                // }

                                                            ]}
                                                            // data={costingBasicInfo.styleOrderDetails}
                                                            data={_.uniqWith(
                                                                costingBasicInfo.styleOrderDetails,
                                                                ( a, b ) => a.orderId === b.orderId &&
                                                                    a.shipmentDate === b.shipmentDate &&
                                                                    a.setStyleId === b.setStyleId
                                                            )}
                                                            sortIcon={<ChevronDown size={2} />}
                                                            paginationTotalRows={costingBasicInfo.styleOrderDetails.length}
                                                        />
                                                        {/* <div className="d-flex justify-content-end ">
                                                        <p className='font-weight-bold mr-5'>
                                                            Total:   {TotalUnitPrice()}
                                                        </p>
                                                    </div> */}
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
                                                <SetCostingDetailsForm />
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>

                            </Row>

                        </Form>
                    </CardBody>
                </Card >
            )
            }
            {
                openStylePurchaseOrderModal && (
                    <SetCostingStylePurchaseOrderModal
                        openModal={openStylePurchaseOrderModal}
                        setOpenModal={setOpenStylePurchaseOrderModal}
                    />
                )
            }
            {
                costingDetailsModalOpen && (
                    <CostingDetailModal
                        openModal={costingDetailsModalOpen}
                        setOpenModal={setCostingDetailsModalOpen}
                    />
                )
            }
        </div >
    );
};

export default CostingEditFormForSetStyle;

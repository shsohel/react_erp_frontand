import '@custom-styles/merchandising/others/pre-costing-details-table.scss';
import classnames from 'classnames';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Settings } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormFeedback, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Label, Row, Table } from 'reactstrap';
import Input from 'reactstrap/lib/Input';
import CustomFloat from '../../../../utility/custom/CustomFloat';
import { selectThemeColors } from '../../../../utility/Utils';
import { getDropDownStyles } from '../../style/single-style/store/actions';
import CmCalculation from './CmCalculation';
import PreCostingDetails from './PreCostingDetails';


const selectUnit = [
    {
        value: 'PCS',
        label: 'PCS'
    },
    {
        value: 'DZN',
        label: 'DZN'
    },
    {
        value: 'Pair',
        label: 'Pair'
    }
];
// Currency
const selectCurrency = [
    { value: 1, label: 'BDT' },
    { value: 2, label: 'USA' }
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

const selectSizeGroups = [
    { value: 'S-M', label: 'S-M' },
    { value: 'S-X', label: 'S-X' },
    { value: 'S-XXL', label: 'S-XXK' },
    { value: 'M-XLL', label: 'M-XLL' }
];
const selectColor = [
    { value: 'red', label: 'Red' },
    { value: 'black', label: 'Black' },
    { value: 'blue', label: 'Blue' }
];


const initialState = [
    { id: 1, costingGroupName: 'Fabric', buyerAmount: 0, inHouseAmount: 0 },
    { id: 2, costingGroupName: 'Accessories', buyerAmount: 0, inHouseAmount: 0 },
    { id: 3, costingGroupName: 'CM', buyerAmount: 0, inHouseAmount: 0 },
    { id: 4, costingGroupName: 'Print', buyerAmount: 0, inHouseAmount: 0 },
    { id: 5, costingGroupName: 'Wash', buyerAmount: 0, inHouseAmount: 0 },
    { id: 6, costingGroupName: 'Embroidery', buyerAmount: 0, inHouseAmount: 0 },
    { id: 7, costingGroupName: 'Profit', buyerAmount: 0, inHouseAmount: 0 },
    { id: 8, costingGroupName: 'Commission', buyerAmount: 0, inHouseAmount: 0 },
    { id: 9, costingGroupName: 'Logistics & Transport', buyerAmount: 0, inHouseAmount: 0 },
    { id: 10, costingGroupName: 'Other', buyerAmount: 0, inHouseAmount: 0 },
    { id: 11, costingGroupName: 'Total', buyerAmount: 0, inHouseAmount: 0 }
];
const PreCostingAddForm = ( { history } ) => {
    const { replace } = history;
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState( false );

    const { dropDownStyles } = useSelector( ( { styles } ) => styles );
    const [styles, setStyles] = useState( null );
    const [units, setUnits] = useState( null );
    const [shipmentMode, setShipmentMode] = useState( null );
    const [costingTerm, setCostingTerm] = useState( null );
    const [currency, setCurrency] = useState( null );
    const [color, setColor] = useState( null );
    const [sizeGroups, setSizeGroups] = useState( null );

    const [costingSummery, setCostingSummery] = useState( initialState );

    useEffect( () => {
        dispatch(
            getDropDownStyles()
        );
    }, [] );

    const { register, errors, handleSubmit } = useForm();

    const onSubmit = ( values ) => {

        // if ( isObjEmpty( errors ) ) {
        //     dispatch(

        //     );
        // }
    };

    const handleCancel = () => {
        replace( '/pre-costings' );
    };
    const handleCMCalculationOpen = () => {
        setOpenModal( !openModal );
    };
    const sumOfInHouseAmountTotal = () => {
        const total = _.sum( costingSummery.map( i => Number( i.inHouseAmount ) ) );
        return total;
    };
    const sumOfBuyerAmountTotal = () => {
        const total = _.sum( costingSummery.map( i => Number( i.buyerAmount ) ) );
        return total;
    };

    const handleCostingGroupChange = ( e, id ) => {
        const { name, value } = e.target;
        const updatedData = costingSummery.map( i => {
            if ( id === i.id ) {
                i[name] = value;
            }
            return i;
        } );
        setCostingSummery( updatedData );
    };

    return (
        <div>
            <Card className="p-1">
                <CardHeader>
                    <CardTitle className="text-dark font-weight-bold" tag='h2'>New Pre-Costing</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit( onSubmit )}>
                        <Row className="border rounded rounded-3 ">
                            <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12} className="mt-n1">
                                <Badge color='primary'>
                                    {`Master Info`}
                                </Badge>
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='styleId'>Style</Label>
                                <CreatableSelect
                                    id='styleId'
                                    isSearchable
                                    isClearable
                                    theme={selectThemeColors}
                                    options={dropDownStyles}
                                    classNamePrefix='select'
                                    innerRef={register( { required: true } )}
                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                    value={styles}
                                    onChange={data => {
                                        setStyles( data );
                                    }}
                                />
                                {errors && errors.session && <FormFeedback>Style is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='buyerId'>Buyer</Label>
                                <Input
                                    id='buyerId'
                                    type='text'
                                    defaultValue={styles?.buyer?.name}
                                    readOnly
                                    name='buyerName'
                                />
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='expectedQtyId'>Expected Qty.</Label>
                                <Input
                                    id='expectedQtyId'
                                    type='number'
                                    name='expectedQuantity'
                                    placeholder='0'
                                    innerRef={register( { required: true } )}
                                    invalid={errors.expectedQuantity && true}
                                    className={classnames( { 'is-invalid': errors['expectedQuantity'] }, 'text-right' )}
                                    onFocus={e => { e.target.select(); }}
                                />
                                {errors && errors.expectedQuantity && <FormFeedback>Expected Qty is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='uomId'>UOM</Label>
                                <CreatableSelect
                                    id='uomId'
                                    isSearchable
                                    isClearable
                                    theme={selectThemeColors}
                                    options={selectUnit}
                                    classNamePrefix='select'
                                    innerRef={register( { required: true } )}
                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                    value={units}
                                    onChange={data => {
                                        setUnits( data );
                                    }}
                                />
                                {errors && errors.uom && <FormFeedback>UOM is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='costingTermId'>Costing Term</Label>
                                <CreatableSelect
                                    id='costingTermId'
                                    isSearchable
                                    isClearable
                                    maxMenuHeight={200}
                                    menuShouldScrollIntoView
                                    theme={selectThemeColors}
                                    options={selectTerm}
                                    classNamePrefix='select'
                                    innerRef={register( { required: true } )}
                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                    value={costingTerm}
                                    onChange={data => {
                                        setCostingTerm( data );
                                    }}
                                />
                                {errors && errors.costingTerm && <FormFeedback>Costing Term is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='dateId'>Date</Label>
                                <Input
                                    id='dateId'
                                    type='date'
                                    name='dateId'
                                    innerRef={register( { required: true } )}
                                    invalid={errors.dateId && true}
                                    className={classnames( { 'is-invalid': errors['dateId'] } )}
                                />
                                {errors && errors.dateId && <FormFeedback>Date is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='shipmentModeId'>Shipment Mode</Label>
                                <CreatableSelect
                                    id='shipmentModeId'
                                    isSearchable
                                    isClearable
                                    theme={selectThemeColors}
                                    options={selectShipment}
                                    classNamePrefix='select'
                                    innerRef={register( { required: true } )}
                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                    value={shipmentMode}
                                    onChange={data => {
                                        setShipmentMode( data );
                                    }}
                                />
                                {errors && errors.shipmentModeId && <FormFeedback>Shipment Mode is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='currencyId'>Currency</Label>
                                <CreatableSelect
                                    id='currencyId'
                                    isSearchable
                                    isClearable
                                    theme={selectThemeColors}
                                    options={selectCurrency}
                                    classNamePrefix='select'
                                    innerRef={register( { required: true } )}
                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                    value={currency}
                                    onChange={data => {
                                        setCurrency( data );
                                    }}
                                />
                                {errors && errors.currencyId && <FormFeedback>Currency is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={6} xl={6} >
                                <Label className="text-dark font-weight-bold" for='styleId'>Size Ranges</Label>
                                <CreatableSelect
                                    id='sizeRangeId'
                                    isSearchable
                                    isClearable
                                    theme={selectThemeColors}
                                    options={selectSizeGroups}
                                    classNamePrefix='select'
                                    innerRef={register( { required: true } )}
                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                    value={sizeGroups}
                                    onChange={data => {
                                        setSizeGroups( data );
                                    }}
                                />
                                {errors && errors.sizeRange && <FormFeedback>SizeRange is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={6} xl={6} >
                                <Label className="text-dark font-weight-bold" for='colorId'>Colors</Label>
                                <CreatableSelect
                                    id='colorId'
                                    name='color'
                                    isSearchable
                                    isClearable
                                    theme={selectThemeColors}
                                    options={selectColor}
                                    classNamePrefix='select'
                                    innerRef={register( { required: false } )}
                                    invalid={errors.color && true}
                                    // className={classnames( 'react-select', { 'is-invalid': session === null } )}
                                    value={color}
                                    onChange={data => {
                                        setColor( data );
                                    }}
                                />
                                {errors && errors.color && <FormFeedback>Color is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='fobId'>FOB</Label>
                                <Input
                                    id='fobId'
                                    type='text'
                                    name='fob'
                                    placeholder='0'
                                    innerRef={register( { required: true } )}
                                    invalid={errors.fob && true}
                                    className={classnames( { 'is-invalid': errors['fob'] }, 'text-right' )}
                                />
                                {errors && errors.fob && <FormFeedback>FOB is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='cmId'>CM %</Label>
                                <InputGroup>
                                    <Input
                                        id='cmId'
                                        type='text'
                                        name='cm'
                                        placeholder='0.00000'
                                        innerRef={register( { required: true } )}
                                        invalid={errors.cm && true}
                                        className={classnames( { 'is-invalid': errors['cm'] }, 'text-right' )}
                                    />
                                    <InputGroupAddon addonType="append">
                                        <Button.Ripple tag={InputGroupText} onClick={() => { handleCMCalculationOpen(); }} className='btn-icon' color='flat-primary'>
                                            <Settings size={16} />
                                        </Button.Ripple>
                                    </InputGroupAddon>

                                    {errors && errors.cm && <FormFeedback>CM is required!</FormFeedback>}


                                </InputGroup>
                                <CmCalculation openModal={openModal} setOpenModal={setOpenModal} />
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='tenHourProductionId'>10hrs Production</Label>
                                <Input
                                    id='tenHourProductionId'
                                    type='text'
                                    name='tenHourProduction'
                                    placeholder='10hrs Production'
                                    innerRef={register( { required: true } )}
                                    invalid={errors.tenHourProduction && true}
                                    className={classnames( { 'is-invalid': errors['tenHourProduction'] } )}
                                />
                                {errors && errors.tenHourProduction && <FormFeedback>10hrs Production is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='commercialExpenseId'>Commercial Expense (%)</Label>
                                <Input
                                    id='commercialExpenseId'
                                    type='text'
                                    name='commercialExpense'
                                    placeholder='0'
                                    innerRef={register( { required: true } )}
                                    invalid={errors.commercialExpense && true}
                                    className={classnames( { 'is-invalid': errors['commercialExpense'] }, 'text-right' )}
                                />
                                {errors && errors.commercialExpense && <FormFeedback>Commercial Expense is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='profitMarginId'>Profit Margin (%)</Label>
                                <Input
                                    id='profitMarginId'
                                    type='text'
                                    name='profitMargin'
                                    placeholder='0'
                                    innerRef={register( { required: true } )}
                                    invalid={errors.profitMargin && true}
                                    className={classnames( { 'is-invalid': errors['profitMargin'] }, 'text-right' )}
                                />
                                {errors && errors.profitMargin && <FormFeedback>Profit Margin is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='bhCommissionId'>BH Commission (%)</Label>
                                <Input
                                    id='bhCommissionId'
                                    type='text'
                                    name='bHCommission'
                                    placeholder='0'
                                    innerRef={register( { required: true } )}
                                    invalid={errors.bHCommission && true}
                                    className={classnames( { 'is-invalid': errors['bHCommission'] }, 'text-right' )}
                                />
                                {errors && errors.bHCommission && <FormFeedback>BH Commission is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='quotedId'>Quoted Price($)</Label>
                                <Input
                                    id='quotedId'
                                    type='text'
                                    name='quotedPrice'
                                    placeholder='0.00'
                                    innerRef={register( { required: true } )}
                                    invalid={errors.quotedPrice && true}
                                    className={classnames( { 'is-invalid': errors['quotedPrice'] }, 'text-right' )}
                                />
                                {errors && errors.quotedPrice && <FormFeedback>Quoted Price is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={3} xl={3} >
                                <Label className="text-dark font-weight-bold" for='effectiveCMId'>Effective CM</Label>
                                <Input
                                    id='effectiveCMId'
                                    type='text'
                                    name='effectiveCM'
                                    placeholder='0.00000'
                                    innerRef={register( { required: true } )}
                                    invalid={errors.effectiveCM && true}
                                    className={classnames( { 'is-invalid': errors['effectiveCM'] }, 'text-right' )}
                                />
                                {errors && errors.effectiveCM && <FormFeedback>Effective CM is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={6} xl={6} >
                                <Label className="text-dark font-weight-bold" for='remarksId'>Remarks</Label>
                                <Input
                                    id='remarksId'
                                    type='textarea'
                                    name='remarks'
                                    placeholder='Remarks'
                                    innerRef={register( { required: true } )}
                                    invalid={errors.remarks && true}
                                    className={classnames( { 'is-invalid': errors['expectedQuantity'] } )}
                                />
                                {errors && errors.remarks && <FormFeedback>Remarks Qty is required!</FormFeedback>}
                            </FormGroup>
                            <FormGroup tag={Col} xs={12} sm={12} md={6} lg={6} xl={6} >
                                <Label className="text-dark font-weight-bold" for='instructionId'>Special Instruction</Label>
                                <Input
                                    id='instructionId'
                                    type='textarea'
                                    name='specialInstruction'
                                    placeholder='Special Instruction'
                                    innerRef={register( { required: true } )}
                                    invalid={errors.specialInstruction && true}
                                    className={classnames( { 'is-invalid': errors['specialInstruction'] } )}
                                />
                                {errors && errors.specialInstruction && <FormFeedback>Special Instruction is required!</FormFeedback>}
                            </FormGroup>
                        </Row>

                        <Col xs={12} sm={12} md={4} lg={12} xl={12}  >
                            <CustomFloat title='Costing Summary'>
                                {/* <Table size='sm'>
                                    <thead>
                                        <tr className='bg-light'>
                                            <td className=' small'><strong>Costing Groups</strong></td>
                                            <td className='text-right small'><strong>Buyer Amount</strong></td>
                                            <td className='text-right small'><strong>In House Amount</strong></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {costingSummery.length &&
                                            costingSummery.map( i => (
                                                <tr key={i.id}>
                                                    <td className='text-left small'> <strong>{i.costingGroupName}</strong></td>
                                                    <td className='text-right'>{i.buyerAmount}</td>
                                                    <td className='text-right'>{i.inHouseAmount}</td>
                                                </tr>
                                            ) )
                                        }
                                    </tbody>
                                </Table> */}
                                <div className="pre-costing-summary-table">
                                    <Table bordered size='sm'>
                                        <thead className='thead-dark'>
                                            <tr >
                                                <th className='small'><strong>Group Name</strong></th>
                                                <th className=' text-center small'><strong>Buyer Amount</strong></th>
                                                <th className='  text-center  small'><strong>In House Amount</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {costingSummery.length &&
                                                costingSummery.map( i => (
                                                    <tr key={i.id}>
                                                        <td className='text-left small'>
                                                            <strong>{i.costingGroupName}</strong>
                                                        </td>
                                                        <td className='text-center'>
                                                            <Input
                                                                type='number'
                                                                name="buyerAmount"
                                                                onChange={e => { handleCostingGroupChange( e, i.id ); }}
                                                                value={i.costingGroupName === 'Total' ? sumOfBuyerAmountTotal() : i.buyerAmount}
                                                                bsSize="sm"
                                                                onFocus={e => {
                                                                    e.target.select();
                                                                }}
                                                                readOnly={i.costingGroupName === 'Accessories' || i.costingGroupName === 'Fabric' || i.costingGroupName === 'Total'}
                                                            />
                                                        </td>
                                                        <td className=' text-center '>
                                                            <Input
                                                                type='number'
                                                                name="inHouseAmount"
                                                                onChange={e => { handleCostingGroupChange( e, i.id ); }}
                                                                onFocus={e => {
                                                                    e.target.select();
                                                                }}
                                                                value={i.costingGroupName === 'Total' ? sumOfInHouseAmountTotal() : i.inHouseAmount}
                                                                bsSize="sm"
                                                                readOnly={i.costingGroupName === 'Accessories' || i.costingGroupName === 'Fabric' || i.costingGroupName === 'Total'}
                                                            />
                                                        </td>
                                                    </tr>
                                                ) )
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </CustomFloat>
                        </Col>
                        <Row className="border rounded rounded-3 mt-3" >
                            <FormGroup tag={Col} xs={12} sm={12} md={12} lg={12} xl={12} className="mt-n1">
                                <Badge color='primary'>
                                    {`Details`}
                                </Badge>
                            </FormGroup>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <PreCostingDetails />
                            </Col>.
                        </Row>
                        <Row>
                            <Col className="d-flex flex-row-reverse">
                                <div className='d-inline-block mb-1 mt-1'>
                                    <Button.Ripple type="reset" className="ml-1 " outline color="secondary" size="sm">Reset</Button.Ripple>
                                    <Button.Ripple onClick={() => { handleCancel(); }} className="ml-1 " outline color="danger" size="sm">Cancel</Button.Ripple>
                                    <Button.Ripple onClick={( e ) => { e.preventDefault(); }} className="ml-1" type="submit" outline color="success" size="sm">Submit</Button.Ripple>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
        </div >
    );
};

export default PreCostingAddForm;

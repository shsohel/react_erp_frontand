import '@custom-styles/merchandising/others/custom-table.scss';
import React, { useEffect } from 'react';
import { CheckSquare, Edit3, MinusSquare, PlusSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardBody, Col, CustomInput, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { getIdFromUrl, randomIdGenerator } from '../../../../utility/Utils';
import { bindUnitSetUnitOnChange, getUnitSetUnitsById, updateUnitSetUnit } from '../store/actions';
const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'unitSetList',
        name: 'Unit Sets',
        link: "/unit-set",
        isActive: false
    },
    {
        id: 'units',
        name: 'Unit',
        link: "#",
        isActive: true
    }
];

const AssignUnitsForm = () => {
    const dispatch = useDispatch();
    const { push } = useHistory();
    const { unitSetUnits } = useSelector( ( { unitSets } ) => unitSets );
    const unitSetId = getIdFromUrl();

    useEffect( () => {
        dispatch( getUnitSetUnitsById( unitSetId ) );
    }, [dispatch, unitSetId] );

    const handleOnChangeUnits = ( id, e ) => {
        const { name, type, value, checked } = e.target;
        const updatedDetails = unitSetUnits.details.map( unit => {
            if ( id === unit.id ) {
                unit[name] = type === 'number' ? Number( value ) : type === 'checkbox' ? checked : value;
            } else {
                if ( type === 'checkbox' ) {
                    unit[name] = false;
                }
            }
            return unit;
        } );
        const updatedData = {
            ...unitSetUnits,
            details: updatedDetails
        };
        dispatch( bindUnitSetUnitOnChange( updatedData ) );
    };

    const handleUnitsEditControl = ( id ) => {
        const updatedDetails = unitSetUnits.details.map( unit => {
            if ( id === unit.id ) {
                unit.isEdit = !unit.isEdit;
            }
            return unit;
        } );
        const updatedData = {
            ...unitSetUnits,
            details: updatedDetails
        };
        dispatch( bindUnitSetUnitOnChange( updatedData ) );
    };

    const handleAddRowToUnit = () => {
        const obj = {
            id: randomIdGenerator(),
            uomSetId: 0,
            unitName: '',
            description: '',
            relativeFactor: 0,
            isBaseUnit: false,
            isEdit: true
        };
        const updatedData = {
            ...unitSetUnits,
            details: [...unitSetUnits.details, obj]
        };
        dispatch( bindUnitSetUnitOnChange( updatedData ) );
    };

    const handleRemoveUnit = ( unitId ) => {
        const { details } = unitSetUnits;
        const updateData = details.filter( d => d.id !== unitId );
        const updatedAfterRemoveDetails = {
            ...unitSetUnits,
            details: updateData
        };
        dispatch( bindUnitSetUnitOnChange( updatedAfterRemoveDetails ) );
    };


    const handleSubmit = () => {
        const submittedData = unitSetUnits.details?.map( unit => (
            {
                uomSetId: 0,
                unitName: unit.unitName,
                description: unit.description,
                relativeFactor: unit.relativeFactor,
                isBaseUnit: unit.isBaseUnit
            }
        ) );
        dispatch( updateUnitSetUnit( submittedData, unitSetId ) );
    };

    const handleCancel = () => {
        push( '/unit-set' );
    };


    return (
        <div>
            <ActionMenu breadcrumb={breadcrumb} title='Units' >
                <NavItem className="mr-1" >
                    <NavLink
                        tag={Button}
                        size="sm"
                        color="primary"
                        onClick={() => { handleSubmit(); }}
                    >Save</NavLink>
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
            <Card className="p-1 mt-3">
                <CardBody>
                    <Row>
                        <Col xs='3' sm='3' md='3' lg='3' xl='3' className="text-nowrap" >
                            <Label className="text-dark font-weight-bold pb-1" for='styleNo'>Unit Set Name</Label>
                            <p className="h4 font-weight-bold" > {unitSetUnits?.name}</p>
                        </Col>
                        <Col xs='3' sm='3' md='3' lg='3' xl='3' className="text-nowrap">
                            <Label className="text-dark font-weight-bold pb-1" for='season'>Descriptions</Label>
                            <p className="h4 font-weight-bold" >
                                {unitSetUnits?.description}
                            </p>
                        </Col>
                    </Row>

                    <div className='divider divider-left divider-primary'>
                        <div className='divider-text text-secondary font-weight-bolder'> Units</div>
                    </div>

                    <div className="border p-1">
                        <Row className="custom-table">
                            <Col className="pl-1 pr-0">
                                <Table responsive bordered >
                                    <thead className="text-center">
                                        <tr>
                                            <th>Unit Code</th>
                                            <th>Unit Description</th>
                                            <th>Factor</th>
                                            <th>Base Unit</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {
                                            unitSetUnits?.details?.map( unit => (
                                                <tr key={unit.id} >
                                                    <td>
                                                        <Input
                                                            type="text"
                                                            name="unitName"
                                                            value={unit.unitName}
                                                            bsSize="sm"
                                                            disabled={!unit.isEdit}
                                                            onChange={( e ) => { handleOnChangeUnits( unit.id, e ); }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Input
                                                            type="text"
                                                            name="description"
                                                            value={unit.description}
                                                            bsSize="sm"
                                                            disabled={!unit.isEdit}
                                                            onChange={( e ) => { handleOnChangeUnits( unit.id, e ); }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Input
                                                            type="number"
                                                            name="relativeFactor"
                                                            value={unit.relativeFactor}
                                                            bsSize="sm"
                                                            disabled={!unit.isEdit}
                                                            onChange={( e ) => { handleOnChangeUnits( unit.id, e ); }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <span className="d-flex justify-content-center">
                                                            <CustomInput
                                                                id={`baseUnit-${unit.id}`}
                                                                disabled={!unit.isEdit}
                                                                name='isBaseUnit'
                                                                type='checkbox'
                                                                checked={unit.isBaseUnit}
                                                                onChange={( e ) => { handleOnChangeUnits( unit.id, e ); }}
                                                            />
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="d-flex justify-content-center">
                                                            <Button.Ripple
                                                                id="editRow"
                                                                tag={Label}
                                                                onClick={() => { handleUnitsEditControl( unit.id ); }}
                                                                className='btn-icon p-0'
                                                                color='flat-success'
                                                            >
                                                                {
                                                                    unit.isEdit ? <CheckSquare hidden={unit.uomSetId === 0} size={16} id="editRow" color="#6610f2" /> : <Edit3 size={16} id="editRow" color="green" />

                                                                }

                                                            </Button.Ripple>
                                                            <Button.Ripple
                                                                hidden={unit.uomSetId > 0}
                                                                id="editRow"
                                                                tag={Label}
                                                                onClick={() => { handleRemoveUnit( unit.id ); }}
                                                                className='btn-icon p-0'
                                                                color='flat-success'
                                                            >
                                                                <MinusSquare size={16} id="editRow" color="red" />
                                                            </Button.Ripple>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ) )
                                        }

                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row >
                            <Col className="d-flex " xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Button.Ripple
                                    id="AddSegRowId"
                                    tag={Label}
                                    onClick={() => { handleAddRowToUnit(); }}
                                    className='btn-icon'
                                    color='flat-success'
                                >
                                    <PlusSquare size={18} id="AddSegRowId" color="green" />

                                </Button.Ripple>
                            </Col>
                        </Row>

                    </div>
                </CardBody>
            </Card>

        </div>
    );
};

export default AssignUnitsForm;

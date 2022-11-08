import FallbackSpinner from '@components/spinner/Fallback-spinner';
import '@custom-styles/basic/custom-form.scss';
import '@custom-styles/basic/custom-tab-control.scss';
import '@custom-styles/merchandising/others/custom-table.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Layers } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Input, Label, Nav, NavItem, NavLink, Row } from 'reactstrap';
import * as yup from 'yup';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { selectedCity, selectedCountry, selectedState } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';
import { getDropDownItemGroups } from '../../item-group/store/actions';
import { getVendorGroupDropdown } from '../../vendor-group/store/actions';
import { addWarehouse, bindWarehouseDataOnchange } from '../store/actions';
import WarehouseAssignItemGroupForm from './WarehouseAssignItemGroupForm';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: '/',
        isActive: false
    },
    {
        id: 'warehouseList',
        name: 'List',
        link: '/warehouses',
        isActive: false
    },
    {
        id: 'warehouse',
        name: 'New',
        link: '/new-warehouse',
        isActive: true
    }
];

const WarehouseAddForm = () => {
    const dispatch = useDispatch();
    const { replace, push } = useHistory();
    const { warehouse, isWarehouseOnProgress } = useSelector( ( { warehouses } ) => warehouses );
    const { dropDownItemGroups } = useSelector( ( { itemGroups } ) => itemGroups );

    const [active, setActive] = useState( '1' );
    const handleTabControl = tab => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };


    const SignupSchema = yup.object().shape( {
        name: warehouse?.name?.length ? yup.string() : yup.string().required( 'Warehouse Name is Required!!' )

    } );

    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( SignupSchema ) } );
    console.log( errors );

    useEffect( () => {
        dispatch( getDropDownItemGroups() );
        dispatch( getVendorGroupDropdown() );
    }, [] );


    const handleWarehouseBasicInputOnChange = ( e ) => {
        const { name, value, checked, type } = e.target;
        const updatedObj = {
            ...warehouse,
            [name]: type === 'number' ? Number( value ) : type === 'date' ? moment( value ).format( 'yy-MM-DD' ) : value
        };
        dispatch( bindWarehouseDataOnchange( updatedObj ) );
    };

    const handleBasicInfoDropdownChange = ( data, e ) => {
        const { action, name, option } = e;
        const updatedObj = {
            ...warehouse,
            [name]: data
        };
        dispatch( bindWarehouseDataOnchange( updatedObj ) );
    };


    const onSubmit = () => {
        const submitObj = {
            name: warehouse.name,
            shortName: warehouse.shortName,
            fullAddress: warehouse.fullAddress,
            state: warehouse.state?.label ?? '',
            postalCode: warehouse.postalCode,
            city: warehouse.city?.label ?? '',
            country: warehouse.country?.label ?? '',
            tags: [],
            categoryIds: warehouse.itemGroupList.map( ig => ig.itemGroupId )
        };
        console.log( 'submitObj', JSON.stringify( submitObj, null, 2 ) );
        dispatch( addWarehouse( submitObj, push ) );
    };


    const handleCancel = () => {
        replace( '/warehouses' );
        dispatch( bindWarehouseDataOnchange( null ) );
    };


    return <div>
        <ActionMenu breadcrumb={breadcrumb} title='New Warehouse' >
            < NavItem className="mr-1" >
                <NavLink
                    tag={Button}
                    size="sm"
                    color="primary"
                    disabled={isWarehouseOnProgress}
                    type="submit"
                    onClick={handleSubmit( onSubmit )}
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
        {isWarehouseOnProgress ? <FallbackSpinner /> : (
            <Card style={{ minHeight: '710px' }} className="mt-3">
                <CardBody>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={5} xl={5}>
                            <div className='divider divider-left mt-0'>
                                <div className='divider-text text-secondary font-weight-bolder'>Master Info</div>
                            </div>
                            <div className="border rounded rounded-3 p-1">
                                <Row>
                                    <Col>
                                        <div className='custom-form-main'>
                                            <Label className='custom-form-label' for='nameId'>Name</Label>
                                            <Label className='custom-form-colons'> : </Label>
                                            <div className='custom-form-group'>
                                                <Input
                                                    id='nameId'
                                                    type="text"
                                                    bsSize="sm"
                                                    name="name"
                                                    value={warehouse?.name}
                                                    placeholder="Name"

                                                    onChange={( e ) => { handleWarehouseBasicInputOnChange( e ); }}
                                                    onFocus={( e ) => e.target.select()}
                                                    className={classnames( { 'is-invalid': errors['name'] && !warehouse.name?.length } )}
                                                />
                                            </div>
                                        </div>
                                        <div className='custom-form-main'>
                                            <Label className='custom-form-label' for='shortNameId'>Short Name</Label>
                                            <Label className='custom-form-colons'> : </Label>
                                            <div className='custom-form-group'>
                                                <Input
                                                    id="shortNameId"
                                                    type="text"
                                                    bsSize="sm"
                                                    name="shortName"
                                                    value={warehouse?.shortName}
                                                    placeholder="Short Name"
                                                    onChange={( e ) => { handleWarehouseBasicInputOnChange( e ); }}
                                                    onFocus={( e ) => e.target.select()}
                                                />
                                            </div>
                                        </div>
                                        <div className='custom-form-main'>
                                            <Label className='custom-form-label' for='fullAddressId'> Address</Label>
                                            <Label className='custom-form-colons'> : </Label>
                                            <div className='custom-form-group'>
                                                <Input
                                                    id="fullAddressId"
                                                    name="fullAddress"
                                                    bsSize="sm"
                                                    placeholder="Address"
                                                    value={warehouse?.fullAddress}
                                                    onChange={( e ) => { handleWarehouseBasicInputOnChange( e ); }}
                                                    onFocus={( e ) => e.target.select()}
                                                />
                                            </div>
                                        </div>
                                        <div className='custom-form-main'>
                                            <Label className='custom-form-label' for='cityId'></Label>
                                            <Label className='custom-form-colons'>  </Label>
                                            <div className='custom-form-input-group'>
                                                <div className='custom-input-group-prepend'>
                                                    <Select
                                                        id='cityId'
                                                        name="city"
                                                        placeholder="City"
                                                        isSearchable
                                                        menuPosition="fixed"
                                                        isClearable
                                                        theme={selectThemeColors}
                                                        options={selectedCity}
                                                        classNamePrefix='dropdown'
                                                        // innerRef={register( { required: true } )}
                                                        className={classnames( 'erp-dropdown-select' )}
                                                        value={warehouse?.city}
                                                        onChange={( data, e ) => {
                                                            handleBasicInfoDropdownChange( data, e );
                                                        }}
                                                    />
                                                </div>
                                                <div className='custom-input-group-append'>
                                                    <Select
                                                        id='stateId'
                                                        name="state"
                                                        placeholder="State"
                                                        isSearchable
                                                        menuPosition="fixed"
                                                        isClearable
                                                        theme={selectThemeColors}
                                                        options={selectedState}
                                                        classNamePrefix='dropdown'
                                                        // innerRef={register( { required: true } )}
                                                        className={classnames( 'erp-dropdown-select' )}
                                                        value={warehouse?.state}
                                                        onChange={( data, e ) => {
                                                            handleBasicInfoDropdownChange( data, e );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='custom-form-main'>
                                            <Label className='custom-form-label' for='postalCodeId'></Label>
                                            <Label className='custom-form-colons'>  </Label>
                                            <div className='custom-form-input-group'>
                                                <div className='custom-input-group-prepend'>
                                                    <Input
                                                        id="postalCodeId"
                                                        name="postalCode"
                                                        bsSize="sm"
                                                        placeholder="Postal Code"
                                                        value={warehouse?.postalCode}
                                                        onChange={( e ) => { handleWarehouseBasicInputOnChange( e ); }}
                                                        onFocus={( e ) => e.target.select()}
                                                    />
                                                </div>
                                                <div className='custom-input-group-append'>
                                                    <Select
                                                        id='countryId'
                                                        name="country"
                                                        placeholder="Country"
                                                        isSearchable
                                                        menuPosition="fixed"
                                                        isClearable
                                                        theme={selectThemeColors}
                                                        options={selectedCountry}
                                                        classNamePrefix='dropdown'
                                                        // innerRef={register( { required: true } )}
                                                        className={classnames( 'erp-dropdown-select' )}
                                                        value={warehouse?.country}
                                                        onChange={( data, e ) => {
                                                            handleBasicInfoDropdownChange( data, e );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </Col>
                                </Row>
                            </div>

                        </Col>
                        <Col xs={12} sm={12} md={12} lg={7} xl={7} className="erp-custom-tab-control mt-md-1 mt-lg-0 mt-xl-0 mt-1 mt-sm-1">
                            <div >
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            active={active === '1'}
                                            onClick={() => {
                                                handleTabControl( '1' );
                                            }}
                                        >
                                            <Layers size={15} />
                                            Assign Item Groups

                                        </NavLink>
                                    </NavItem>

                                </Nav>
                                {
                                    active === '1' ? <WarehouseAssignItemGroupForm /> : active === '2' ? <div> </div> : active === '3' ? <div> </div> : null
                                }
                            </div>

                        </Col>

                    </Row>

                </CardBody>
            </Card>
        )
        }
    </div>;
};

export default WarehouseAddForm;

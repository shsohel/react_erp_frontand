import '@custom-styles/merchandising/others/custom-table.scss';
import classnames from 'classnames';
import React, { useEffect } from 'react';
import { CheckSquare, Edit3, MinusSquare, PlusSquare } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Card, CardBody, Col, CustomInput, Input, Label, NavItem, NavLink, Row, Table } from 'reactstrap';
import ActionMenu from '../../../../layouts/components/menu/action-menu';
import { notify } from '../../../../utility/custom/notifications';
import { randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { addCurrency, bindCurrencies, getCurrencies, getCurrencyCodeDropdown, updateCurrency } from '../store/actions';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'currencies',
        name: 'Currency',
        link: "#",
        isActive: true
    }
];

const CurrencyForm = () => {
    const dispatch = useDispatch();
    const { currencies, currencyCodeDropdown } = useSelector( ( { currencies } ) => currencies );

    useEffect( () => {
        dispatch( getCurrencies() );
    }, [] );

    const handleCurrencyDropdownOnFocus = () => {
        if ( !currencyCodeDropdown.length ) {
            dispatch( getCurrencyCodeDropdown() );
        }
    };


    const handleCurrencyOnChange = ( fieldId, e ) => {
        const { name, value, checked, type } = e.target;
        const updatedData = currencies.map( currency => {
            if ( fieldId === currency.fieldId ) {
                currency[name] = type === 'number' ? Number( value ) : type === 'checkbox' ? checked : value;
            } else {
                if ( type === 'checkbox' ) {
                    currency[name] = false;
                }
            }
            return currency;
        } );
        dispatch( bindCurrencies( updatedData ) );
    };


    const handleCurrencyDropdownChange = ( data, e, fieldId ) => {
        const { action, name, option } = e;
        const updatedData = currencies.map( currency => {
            if ( fieldId === currency.fieldId ) {
                currency[name] = data ? { ...data, label: data.code } : null;
                currency['code'] = data?.code ?? '';
                currency['sign'] = data?.symbol_native ?? '';
            }
            return currency;
        } );
        dispatch( bindCurrencies( updatedData ) );
    };

    const handleEditControl = ( fieldId, currencyFormValue ) => {
        const validationErrors = {};

        if ( currencyFormValue.isEdit ) {
            if (
                !currencyFormValue.currency
                || currencyFormValue.rate === 0
            ) {
                const updatedData = currencies.map( currency => {
                    if ( fieldId === currency.fieldId ) {
                        currency['isErrorField'] = true;
                    }
                    return currency;
                } );
                dispatch( bindCurrencies( updatedData ) );

                Object.assign( validationErrors,
                    !currencyFormValue.currency &&
                    { code: 'Currency is Empty' },
                    currencyFormValue.rate === 0 &&
                    { rate: 'Rate is Zero' } );

                notify( 'errors', Object.values( validationErrors ) );

            } else {
                if ( currencyFormValue.id ) {
                    const submitObj = {
                        code: currencyFormValue.code,
                        sign: currencyFormValue.sign,
                        rate: currencyFormValue.rate,
                        isBase: currencyFormValue.isBase
                    };
                    dispatch( updateCurrency( submitObj, currencyFormValue.id ) );
                } else {
                    const submitObj = {
                        code: currencyFormValue.code,
                        sign: currencyFormValue.sign,
                        rate: currencyFormValue.rate,
                        isBase: currencyFormValue.isBase
                    };
                    dispatch( addCurrency( submitObj ) );
                }
            }

        } else {
            const updatedData = currencies.map( currency => {
                if ( fieldId === currency.fieldId ) {
                    currency['isEdit'] = !currency.isEdit;
                }
                return currency;
            } );
            dispatch( bindCurrencies( updatedData ) );
        }

    };


    const handleRemoveCurrency = ( fieldId ) => {
        console.log( fieldId );
        const updatedData = currencies.filter( currency => currency.fieldId !== fieldId );
        dispatch( bindCurrencies( updatedData ) );
    };

    const handleAddRowToCurrency = () => {
        const newObj = {
            id: null,
            fieldId: randomIdGenerator(),
            currency: null,
            code: '',
            sign: '',
            rate: 0,
            isEdit: true,
            isBase: false,
            isErrorField: false
        };
        dispatch( bindCurrencies( [...currencies, newObj] ) );
    };


    return <div>
        <ActionMenu breadcrumb={breadcrumb} title='Currency' >
            <NavItem className="mr-1" >
                <NavLink
                    tag={Button}
                    size="sm"
                    color="secondary"
                // onClick={() => { handleCancel(); }}
                >
                    Cancel
                </NavLink>
            </NavItem>
        </ActionMenu>
        <Card className="mt-3">

            <CardBody>
                <Row>
                    <Col>
                        <div className='divider divider-left '>
                            <div className='divider-text text-secondary font-weight-bolder'>Currency</div>
                        </div>
                        <div className="border rounded rounded-3 p-1 custom-table">
                            <Row>
                                <Col>
                                    <Table responsive bordered >
                                        <thead className="text-center">
                                            <tr>
                                                <th>Code</th>
                                                <th>Sign</th>
                                                <th>Conversion Rate</th>
                                                <th>Is Base Currency?</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-center">
                                            {
                                                currencies?.map( currency => (
                                                    <tr key={currency.fieldId} >
                                                        <td>
                                                            <div style={{ minWidth: '180px' }}>
                                                                <Select
                                                                    id={currency.id}
                                                                    name="currency"
                                                                    isSearchable
                                                                    menuPosition="fixed"
                                                                    isClearable
                                                                    isDisabled={currency.id}
                                                                    theme={selectThemeColors}
                                                                    options={currencyCodeDropdown.filter( c => !currencies?.some( tc => tc.code === c.code ) )}
                                                                    classNamePrefix='dropdown'
                                                                    // className={classnames( 'erp-dropdown-select' )}
                                                                    className={classnames( `erp-dropdown-select ${( ( currency.isErrorField && !currency.currency ) ) && 'is-invalid'}` )}
                                                                    value={currency?.currency}
                                                                    onChange={( data, e ) => {
                                                                        handleCurrencyDropdownChange( data, e, currency.fieldId );
                                                                    }}
                                                                    onFocus={() => { handleCurrencyDropdownOnFocus(); }}
                                                                />
                                                            </div>

                                                        </td>
                                                        {/* <td>
                                                            <Input
                                                                type="text"
                                                                name="code"
                                                                value={currency.code}
                                                                bsSize="sm"
                                                                disabled
                                                                onChange={( e ) => { handleCurrencyOnChange( currency.fieldId, e ); }}
                                                            />
                                                        </td> */}
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                name="sign"
                                                                value={currency.sign}
                                                                bsSize="sm"
                                                                disabled
                                                                onChange={( e ) => { handleCurrencyOnChange( currency.fieldId, e ); }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="number"
                                                                className="text-right"
                                                                name="rate"
                                                                value={currency.rate}
                                                                bsSize="sm"
                                                                disabled={!currency.isEdit}
                                                                onChange={( e ) => { handleCurrencyOnChange( currency.fieldId, e ); }}
                                                                invalid={currency.isErrorField && currency.rate === 0}
                                                                onFocus={( e ) => e.target.select()}
                                                            />
                                                        </td>
                                                        <td>
                                                            <span className="d-flex justify-content-center">
                                                                <CustomInput
                                                                    id={`baseUnit-${currency.fieldId}`}
                                                                    disabled={!currency.isEdit}
                                                                    name='isBase'
                                                                    type='checkbox'
                                                                    checked={currency.isBase}
                                                                    onChange={( e ) => { handleCurrencyOnChange( currency.fieldId, e ); }}
                                                                />
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="d-flex justify-content-center">
                                                                <Button.Ripple
                                                                    id="editRow"
                                                                    tag={Label}
                                                                    onClick={() => { handleEditControl( currency.fieldId, currency ); }}
                                                                    className='btn-icon p-0'
                                                                    color='flat-success'
                                                                >
                                                                    {
                                                                        currency.isEdit ? <CheckSquare size={16} id="editRow" color="#6610f2" /> : <Edit3 size={16} id="editRow" color="green" />

                                                                    }

                                                                </Button.Ripple>
                                                                <Button.Ripple
                                                                    hidden={!!currency.id}
                                                                    id="editRow"
                                                                    tag={Label}
                                                                    onClick={() => { handleRemoveCurrency( currency.fieldId ); }}
                                                                    className='btn-icon p-0 ml-1'
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
                                <Col className="d-flex mt-1" xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Button.Ripple
                                        id="AddSegRowId"
                                        tag={Label}
                                        onClick={() => { handleAddRowToCurrency(); }}
                                        className='btn-icon'
                                        color='flat-success'
                                    >
                                        <PlusSquare size={18} id="AddSegRowId" color="green" />

                                    </Button.Ripple>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    </div >;
};

export default CurrencyForm;

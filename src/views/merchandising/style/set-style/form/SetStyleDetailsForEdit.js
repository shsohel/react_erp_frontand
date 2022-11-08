import React, { Fragment } from 'react';
import { MinusSquare, Plus } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { SlideDown } from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';
import { Button, FormGroup, Input, Label, Row } from 'reactstrap';
import Col from 'reactstrap/lib/Col';
import { randomIdGenerator, selectThemeColors } from '../../../../../utility/Utils';
import { getBuyersStyles } from '../../../buyer/store/actions';
import { getSingleStyleColorsDropdown } from '../../single-style/store/actions';
import { bindSetStyleBasicInfo, getStyleSizesDropdownByStyleId } from '../store/actions';


const selectSizeGroups = [
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'X', label: 'X' },
    { value: 'XL', label: 'XL' }
];
const selectColor = [
    { value: 'red', label: 'Red' },
    { value: 'black', label: 'Black' },
    { value: 'blue', label: 'Blue' }
];
const selectStyleNo = [
    { value: '4369SMS32-1', label: '4369SMS32-1' },
    { value: '4369SMS32-2', label: '4369SMS32-2' },
    { value: '4369SMS32-3', label: '4369SMS32-3' }
];
const SetStyleDetailsForEdit = () => {
    const dispatch = useDispatch();
    const {
        setStyleBasicInfo } = useSelector( ( { setStyles } ) => setStyles );
    const { dropDownColors } = useSelector( ( { colors } ) => colors );

    const { buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );
    const { singleStyleColors } = useSelector( ( { styles } ) => styles );
    const { dropdownStyleSizes } = useSelector( ( { setStyles } ) => setStyles );

    // useEffect( () => {
    //     dispatch( getDropDownSizes() );
    //     dispatch( getDropDownColors() );
    //     dispatch( getDropDownStyles() );
    // }, [] );


    const handleStyleRowAdd = () => {
        const { styleCombination } = setStyleBasicInfo;

        const newRow = {
            fieldId: randomIdGenerator(),
            styleId: '',
            styleNo: ' sd.styleNo',
            styleValue: null,
            sizeId: '',
            size: '',
            sizeValue: null,
            colorId: '',
            color: '',
            colorValue: null,
            quantity: 0
        };
        const updatedObj = {
            ...setStyleBasicInfo,
            styleCombination: [...styleCombination, newRow]
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleStyleRowRemove = ( fieldId ) => {
        const { styleCombination } = setStyleBasicInfo;
        const updatedData = [...styleCombination];
        updatedData.splice(
            updatedData.findIndex( x => x.fieldId === fieldId ),
            1
        );
        const updatedObj = {
            ...setStyleBasicInfo,
            styleCombination: updatedData
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleOnChangeOfAddedRow = ( e, fieldId ) => {
        const { name, value, type } = e.target;
        const { styleCombination } = setStyleBasicInfo;
        const updatedData = styleCombination.map( i => {
            if ( fieldId === i.fieldId ) {
                i[name] = type === 'number' ? Number( value ) : value;
            }
            return i;
        } );
        const updatedObj = {
            ...setStyleBasicInfo,
            styleCombination: updatedData
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleStyleNoDropDownChange = ( newValue, fieldId ) => {
        const { styleCombination } = setStyleBasicInfo;
        const updatedData = styleCombination.map( i => {
            if ( fieldId === i.fieldId ) {
                i.styleId = newValue?.value;
                i.styleNo = newValue?.label;
                i.styleValue = newValue;
            }
            return i;
        } );
        const updatedObj = {
            ...setStyleBasicInfo,
            styleCombination: updatedData
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleColorDropDownChange = ( newValue, fieldId ) => {
        const { styleCombination } = setStyleBasicInfo;
        const updatedData = styleCombination.map( i => {
            if ( fieldId === i.fieldId ) {
                i.colorId = newValue?.value;
                i.color = newValue?.label;
                i.colorValue = newValue;
            }
            return i;
        } );
        const updatedObj = {
            ...setStyleBasicInfo,
            styleCombination: updatedData
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleSizeDropDownChange = ( newValue, fieldId ) => {
        const { styleCombination } = setStyleBasicInfo;
        const updatedData = styleCombination.map( i => {
            if ( fieldId === i.fieldId ) {
                i.sizeId = newValue?.value;
                i.size = newValue?.label;
                i.sizeValue = newValue;
            }
            return i;
        } );
        const updatedObj = {
            ...setStyleBasicInfo,
            styleCombination: updatedData
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleSizeOnFocus = ( styleId ) => {
        dispatch( getStyleSizesDropdownByStyleId( styleId ) );
    };

    const handleStyleOnFocus = ( styles ) => {
        if ( !styles.length ) {
            dispatch( getBuyersStyles( setStyleBasicInfo?.buyer?.value ) );
        }

    };
    const handleColorOnFocus = ( styleId ) => {
        dispatch( getSingleStyleColorsDropdown( styleId ) );
    };

    const { register, errors, handleSubmit } = useForm();

    return (
        <Fragment>
            {
                setStyleBasicInfo?.styleCombination?.map( ( item, index ) => (

                    <SlideDown key={item.fieldId} >
                        <Row  >
                            <FormGroup tag={Col} xs='6' sm='6' md='3' lg='3' xl='3' className="">
                                <Label className="font-weight-bolder" hidden={index > 0} for={`styleNo-${item.id}`}>Style No</Label>
                                <CreatableSelect
                                    id={`styleNo-${item.id}`}
                                    isSearchable
                                    isClearable
                                    theme={selectThemeColors}
                                    options={buyerStylesDropdown?.filter( bStyle => !bStyle.isSetStyle )}
                                    // options={selectStyleNo}
                                    classNamePrefix='dropdown'
                                    className="erp-dropdown-select"
                                    value={item.styleValue}
                                    onChange={( data ) => { handleStyleNoDropDownChange( data, item.fieldId ); }}
                                    onFocus={() => { handleStyleOnFocus( buyerStylesDropdown ); }}
                                />
                            </FormGroup>
                            <FormGroup tag={Col} xs='6' sm='6' md='3' lg='3' xl='3' className="">
                                <Label for={`sizeRangeId-${item.id}`} hidden={index > 0}>Size</Label>
                                <CreatableSelect
                                    id={`sizeRangeId-${item.id}`}
                                    isDisabled={!setStyleBasicInfo?.isSizeSpecific}
                                    isSearchable
                                    isClearable
                                    theme={selectThemeColors}
                                    options={dropdownStyleSizes}
                                    classNamePrefix='dropdown'
                                    className="erp-dropdown-select"
                                    value={item?.sizeValue}
                                    onFocus={() => { handleSizeOnFocus( item.styleValue?.value ); }}
                                    onChange={data => {
                                        handleSizeDropDownChange( data, item.fieldId );
                                    }}

                                />
                            </FormGroup>
                            <FormGroup tag={Col} xs='6' sm='6' md='2' lg='2' xl='2' className="">
                                <Label for={`quantityId-${item.id}`} hidden={index > 0}>Quantity</Label>
                                <Input
                                    id={`quantityId-${item.id}`}
                                    type='number'
                                    name='quantity'
                                    bsSize="sm"
                                    defaultValue={item?.quantity}
                                    onChange={( e ) => { handleOnChangeOfAddedRow( e, item.fieldId ); }}
                                    placeholder='Quantity'
                                />
                            </FormGroup>
                            <FormGroup tag={Col} xs='6' sm='6' md='3' lg='3' xl='3' className="">
                                <Label for={`colorId-${item.id}`} hidden={index > 0}>Color</Label>
                                <CreatableSelect
                                    isSearchable
                                    isClearable
                                    id={`colorId-${item.id}`}
                                    name='color'
                                    isDisabled={!setStyleBasicInfo?.isColorSpecific}
                                    theme={selectThemeColors}
                                    // options={selectColor}
                                    options={singleStyleColors}

                                    classNamePrefix='dropdown'
                                    className="erp-dropdown-select"
                                    value={item.colorValue}
                                    onChange={data => {
                                        handleColorDropDownChange( data, item.fieldId );
                                    }}
                                    onFocus={() => { handleColorOnFocus( item.styleValue?.value ); }}


                                // onChange={( data ) => { handleColorDropDownChange( data, item.fieldId ); }}
                                />
                            </FormGroup>
                            {/* <FormGroup tag={Col} xs='12' sm='12' md='1' lg='1' xl='1' className="d-flex justify justify-content-start  mt-1">
                                <Button.Ripple id="deleteEditSetStyleDetailsId" tag={Label}
                                    disabled={( setStyleBasicInfo?.styleDetails?.length === 1 )}
                                    className='btn-icon' color='flat-danger' >
                                    <MinusSquare id="deleteEditSetStyleDetailsId" color="red" className='d-none d-sm-block' />
                                    <Button.Ripple
                                        id="deleteEditSetStyleDetailsId"
                                        outline
                                        color='danger'
                                        className='d-block d-sm-none'
                                        onClick={() => { handleStyleRowRemove( item.fieldId ); }}
                                    > Delete </Button.Ripple>
                                </Button.Ripple>
                            </FormGroup> */}
                            <FormGroup tag={Col} xs='12' sm='12' md='1' lg='1' xl='1' >
                                <div className="text-center">
                                    <Label className="font-weight-bolder text-right" hidden={index > 0} for={`colorId-${item.id}`}>Action</Label>

                                </div>
                                <div className="text-center">
                                    <Button.Ripple size="sm" id="deleteId" tag={Label}
                                        disabled={( setStyleBasicInfo?.styleDetails?.length === 1 )} className='btn-icon p-0' color='flat-danger' >
                                        <MinusSquare id="deleteId" color="red" className='d-none d-sm-block' />
                                        <Button.Ripple id="deleteId"
                                            outline color='danger'
                                            className='d-block d-sm-none '
                                            onClick={() => { handleStyleRowRemove( item.fieldId ); }}
                                        > Delete </Button.Ripple>
                                    </Button.Ripple>
                                </div>

                            </FormGroup>
                        </Row>

                    </SlideDown>
                ) )
            }
            <Row>
                <FormGroup tag={Col} xs='12' sm='12' md='6' lg='12' xl='12' >
                    <Button.Ripple
                        size="sm"
                        // hidden={( index !== ( setStyleBasicInfo?.styleDetails?.length - 1 ) )}
                        className='btn-icon' color='primary'
                        onClick={() => { handleStyleRowAdd(); }}>
                        <Plus size={14} />
                        <span className='align-middle'>Add New</span>
                    </Button.Ripple>
                </FormGroup>
            </Row>

        </Fragment >

    );
};

export default SetStyleDetailsForEdit;

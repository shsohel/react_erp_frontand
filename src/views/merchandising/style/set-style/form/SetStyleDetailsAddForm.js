import React, { Fragment, useEffect } from 'react';
import { MinusSquare, Plus } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import SlideDown from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';
import { Button, FormGroup, Input, Label, Row } from 'reactstrap';
import Col from 'reactstrap/lib/Col';
import { randomIdGenerator, selectThemeColors } from '../../../../../utility/Utils';
import { getDropDownColors } from '../../../color/store/actions';
import { getDropDownSizes } from "../../../size/store/actions";
import { getDropDownStyles, getSingleStyleColorsDropdown } from "../../single-style/store/actions";
import { bindSetStyleBasicInfo, getStyleSizesDropdownByStyleId } from "../store/actions";


const SetStyleInfoAddForm = () => {
    const dispatch = useDispatch();
    const {
        setStyleBasicInfo
    } = useSelector( ( { setStyles } ) => setStyles );


    const { dropDownColors } = useSelector( ( { colors } ) => colors );

    const { dropdownStyleSizes } = useSelector( ( { setStyles } ) => setStyles );
    const { singleStyleColors } = useSelector( ( { styles } ) => styles );
    const { buyerStylesDropdown } = useSelector( ( { buyers } ) => buyers );

    useEffect( () => {
        dispatch( getDropDownSizes() );
        dispatch( getDropDownColors() );
        dispatch( getDropDownStyles() );
    }, [] );


    const handleStyleRowAdd = () => {
        const newRow = { fieldId: randomIdGenerator(), styleNo: null, size: null, color: null, quantity: '' };
        const updatedObj = {
            ...setStyleBasicInfo,
            styleCombination: [...setStyleBasicInfo?.styleCombination, newRow]
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );

        // setStyleCombination(
        //     [...styleCombination, newRow]
        // );
    };

    const handleStyleRowRemove = ( fieldId ) => {
        const updatedData = [...setStyleBasicInfo?.styleCombination];
        updatedData.splice(
            updatedData.findIndex( x => x.fieldId === fieldId ),
            1
        );
        //  setStyleCombination( updatedData );
        const updatedObj = {
            ...setStyleBasicInfo,
            styleCombination: updatedData
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleOnChangeOfAddedRow = ( e, fieldId ) => {
        const { name, value, type } = e.target;
        const updatedData = setStyleBasicInfo?.styleCombination.map( i => {
            if ( fieldId === i.fieldId ) {
                i[name] = type === 'number' ? Number( value ) : value;
            }
            return i;
        } );
        //  setStyleCombination( updateData );
        const updatedObj = {
            ...setStyleBasicInfo,
            styleCombination: updatedData
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleStyleNoDropDownChange = ( newValue, fieldId ) => {
        const updateData = setStyleBasicInfo?.styleCombination.map( i => {
            if ( fieldId === i.fieldId ) {
                i.styleNo = newValue;
            }
            return i;
        } );

        //  setStyleCombination( updateData );
        const updatedObj = {
            ...setStyleBasicInfo,
            styleCombination: updateData
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleColorDropDownChange = ( newValue, fieldId ) => {
        const updateData = setStyleBasicInfo?.styleCombination.map( i => {
            if ( fieldId === i.fieldId ) {
                i.color = newValue;
            }
            return i;
        } );
        //  setStyleCombination( updateDate );
        const updatedObj = {
            ...setStyleBasicInfo,
            styleCombination: updateData
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleSizeDropDownChange = ( newValue, fieldId ) => {
        const updateData = setStyleBasicInfo?.styleCombination.map( i => {
            if ( fieldId === i.fieldId ) {
                i.size = newValue;
            }
            return i;
        } );
        //   setStyleCombination( updateDate );
        const updatedObj = {
            ...setStyleBasicInfo,
            styleCombination: updateData
        };
        dispatch( bindSetStyleBasicInfo( updatedObj ) );
    };

    const handleSizeOnFocus = ( styleId ) => {
        dispatch( getStyleSizesDropdownByStyleId( styleId ) );
    };
    const handleColorOnFocus = ( styleId ) => {
        dispatch( getSingleStyleColorsDropdown( styleId ) );
    };
    // console.log( buyerStylesDropdown );

    return (
        <Fragment>
            {
                setStyleBasicInfo?.styleCombination.map( ( item, index ) => (
                    <SlideDown key={item.fieldId}>
                        <Row  >
                            <FormGroup tag={Col} xs='6' sm='6' md='3' lg='3' xl='3' className="">
                                <Label className="font-weight-bolder" hidden={index > 0} for={`styleNo-${item.id}`}>Style No</Label>
                                <CreatableSelect
                                    id={`styleNo-${item.id}`}
                                    isSearchable
                                    isClearable
                                    theme={selectThemeColors}
                                    options={buyerStylesDropdown.filter( bStyle => !bStyle.isSetStyle )}
                                    classNamePrefix='dropdown'
                                    className="erp-dropdown-select"
                                    value={setStyleBasicInfo?.styleCombination.styleNo}
                                    onChange={( data ) => { handleStyleNoDropDownChange( data, item.fieldId ); }}

                                />
                            </FormGroup>
                            <FormGroup tag={Col} xs='6' sm='6' md='3' lg='3' xl='3' className="">
                                <Label className="font-weight-bolder" hidden={index > 0} for={`sizeRangeId-${item.id}`}>Size</Label>
                                <CreatableSelect
                                    id={`sizeRangeId-${item.id}`}
                                    isDisabled={!setStyleBasicInfo?.isSizeSpecific}
                                    isSearchable
                                    isClearable
                                    theme={selectThemeColors}
                                    // options={selectSizeGroups}
                                    options={dropdownStyleSizes}
                                    classNamePrefix='dropdown'
                                    className="erp-dropdown-select"
                                    value={item.size}
                                    // onChange={( data ) => { handleSizeDropDownChange( data, item.fieldId ); }}
                                    onChange={data => {
                                        handleSizeDropDownChange( data, item.fieldId );
                                    }}
                                    onFocus={() => { handleSizeOnFocus( item.styleNo?.value ); }}
                                    onCreateOption={data => {
                                        // handleSizeInstantCreate( data );
                                    }}
                                />
                            </FormGroup>
                            <FormGroup tag={Col} xs='6' sm='6' md='2' lg='2' xl='2' className="">
                                <Label className="font-weight-bolder" hidden={index > 0} for={`quantityId-${item.id}`}>Quantity</Label>
                                <Input
                                    id={`quantityId-${item.id}`}
                                    type='number'
                                    name='quantity'
                                    bsSize='sm'
                                    onChange={( e ) => { handleOnChangeOfAddedRow( e, item.fieldId ); }}
                                    placeholder='Quantity'
                                />
                            </FormGroup>
                            <FormGroup tag={Col} xs='6' sm='6' md='3' lg='3' xl='3' className="">
                                <Label className="font-weight-bolder" hidden={index > 0} for={`colorId-${item.id}`}>Color</Label>
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
                                    value={item.color}
                                    onChange={data => {
                                        handleColorDropDownChange( data, item.fieldId );
                                    }}
                                    onFocus={() => { handleColorOnFocus( item.styleNo?.value ); }}

                                    onCreateOption={data => {
                                        // handleColorInstantCreate( data );
                                    }}
                                // onChange={( data ) => { handleColorDropDownChange( data, item.fieldId ); }}
                                />
                            </FormGroup>
                            <FormGroup tag={Col} xs='12' sm='12' md='1' lg='1' xl='1' >
                                <div className="text-center">
                                    <Label className="font-weight-bolder text-right" hidden={index > 0} for={`colorId-${item.id}`}>Action</Label>

                                </div>
                                <div className="text-center">
                                    <Button.Ripple size="sm" id="deleteId" tag={Label} disabled={( setStyleBasicInfo?.styleCombination.length === 1 )} className='btn-icon p-0' color='flat-danger' >
                                        <MinusSquare id="deleteId" color="red" className='d-none d-sm-block' />
                                        <Button.Ripple id="deleteId" outline color='danger' className='d-block d-sm-none ' onClick={() => { handleStyleRowRemove( item.fieldId ); }} > Delete </Button.Ripple>
                                    </Button.Ripple>
                                </div>

                            </FormGroup>
                        </Row>
                        <Row>
                            <FormGroup tag={Col} xs='12' sm='12' md='6' lg='12' xl='12' >
                                <Button.Ripple
                                    size="sm"
                                    hidden={( index !== ( setStyleBasicInfo?.styleCombination.length - 1 ) )}
                                    className='btn-icon' color='primary'
                                    onClick={() => { handleStyleRowAdd(); }}>
                                    <Plus size={14} />
                                    <span className='align-middle'>Add New</span>
                                </Button.Ripple>
                            </FormGroup>
                        </Row>
                    </SlideDown>
                ) )
            }
        </Fragment>

    );
};

export default SetStyleInfoAddForm;

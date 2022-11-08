/* eslint-disable no-unused-expressions */
import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import _ from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import { MoreVertical } from "react-feather";
import NumberFormat from "react-number-format";
import Select from 'react-select';
import { Button, Card, CardBody, Col, CustomInput, FormGroup, Progress, Row, Table, UncontrolledTooltip } from 'reactstrap';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import { CustomInputLabel } from "../../../../utility/custom/CustomInputLabel";
import CustomModal from '../../../../utility/custom/CustomModal';
import CustomNestedModal from "../../../../utility/custom/CustomNestedModal";
import { randomIdGenerator, selectThemeColors } from "../../../../utility/Utils";

const SizeColorRation = ( {
    openModal,
    setOpenModal,
    colorSizeRationIds,
    setColorSizeRationIds,
    handleColorSizeBindingOnRow
} ) => {

    const [nestedModelOpen, setNestedModelOpen] = useState( false );
    const [isRation, setIsRation] = useState( false );
    const [color, setColor] = useState( [] );
    const [size, setSize] = useState( [] );
    const [colorSize, setColorSize] = useState( null );
    const [allColor, setAllColor] = useState( true );
    const [allSize, setAllSize] = useState( true );
    const isAllColor = color.some( c => !c.isRemain === true );
    const isAllSize = size.some( c => !c.isRemain === true );
    //  console.log( colorSizeRationIds?.colorSizeQuantity );

    const handleStyleColor = async ( styleId ) => {
        await baseAxios.get( `${merchandisingApi.style.get_style_sizes}/${styleId}/colors` )
            .then( response => {
                setColor( response?.data?.map( c => ( {
                    id: c.id,
                    name: c.name,
                    value: c.id,
                    label: c.name,
                    isRemain: colorSizeRationIds?.colorSizeQuantity.length ? colorSizeRationIds?.colorSizeQuantity.some( cq => cq.colorId === c.id ) : true
                } ) ) );
            } );
    };

    const handleGetSizes = async ( sizeGroupId ) => {
        await baseAxios.get( `${merchandisingApi.sizeGroup.root}/${sizeGroupId}/sizes` )
            .then( response => {
                //     console.log( response );
                setSize( response?.data?.sizes.map( s => ( {
                    sizeId: s.sizeId,
                    name: s.size,
                    position: s.position,
                    isRemain: colorSizeRationIds?.colorSizeQuantity.length ? colorSizeRationIds?.colorSizeQuantity.some( cq => cq.sizeId === s.sizeId ) : true
                } ) ) );
                if ( colorSizeRationIds.colorSizeQuantity?.length ) {
                    setIsRation( colorSizeRationIds?.colorSizeQuantity.some( cs => cs.isInRatio === true ) );
                    setColorSize(
                        color.filter( c => colorSizeRationIds?.colorSizeQuantity.some( cq => cq.colorId === c.id ) ).map( c => ( {
                            fieldId: randomIdGenerator(),
                            colorId: c.id,
                            colorName: c.name,
                            colorValue: c.name ? { label: c.name, value: c.id } : null,
                            assortValue: colorSizeRationIds?.colorSizeQuantity.find( cs => cs.colorId === c.id )?.asrtValue,
                            isRemain: c.isRemain,
                            totalSizeQty: _.sum( colorSizeRationIds?.colorSizeQuantity.filter( cs => cs.colorId === c.id ).map( s => (
                                s.isInRatio ? s.ratio * colorSizeRationIds?.colorSizeQuantity.find( cs => cs.colorId === c.id )?.asrtValue : s.quantity )
                            ) ),
                            sizes: colorSizeRationIds?.colorSizeQuantity.filter( cs => cs.colorId === c.id )?.map( s => ( {
                                fieldId: randomIdGenerator(),
                                sizeId: s.sizeId,
                                sizeName: s.sizeName,
                                ratePerUnit: s.ratePerUnit,
                                position: response?.data?.sizes?.find( rs => rs.sizeId === s.sizeId )?.position,
                                quantity: s.isInRatio ? s.ratio : s.quantity,
                                ratio: s.ratio,
                                isInRatio: s.isInRatio,
                                adjustedQuantity: s.adjustedQuantity,
                                sampleQuantity: s.sampleQuantity,
                                totalQuantity: s.totalQuantity,
                                wastagePercentage: s.wastagePercentage,
                                excessPercentage: s.excessPercentage,
                                isRemain: true
                            } ) )
                        } ) )
                    );
                } else {
                    setColorSize(
                        color.map( c => ( {
                            fieldId: randomIdGenerator(),
                            colorId: c.id,
                            colorName: c.name,
                            colorValue: c.name ? { label: c.name, value: c.id } : null,
                            assortValue: 0,
                            isRemain: c.isRemain,
                            totalSizeQty: 0,
                            sizes: response?.data?.sizes.map( s => ( {
                                fieldId: randomIdGenerator(),
                                sizeId: s.sizeId,
                                sizeName: s.size,
                                position: s.position,
                                quantity: 0,
                                ratio: 0,
                                ratePerUnit: 0,
                                isInRatio: false,
                                adjustedQuantity: 0,
                                sampleQuantity: 0,
                                wastagePercentage: 0,
                                excessPercentage: 0,
                                isRemain: true,
                                totalQuantity: 0
                            } ) )
                        } ) )
                    );
                }

            } );
    };

    useEffect( () => {
        if ( colorSizeRationIds ) {
            handleStyleColor( colorSizeRationIds?.styleId );
            handleGetSizes( colorSizeRationIds?.sizeGroupId );
        }

    }, [color.length === 0] );

    const handleRationCheck = ( e ) => {
        const { checked } = e.target;
        setIsRation( checked );
        const updateAssortValue = colorSize?.map( cs => {
            cs.totalSizeQty = 0;
            cs.sizes = cs.sizes.map( size => ( { ...size, quantity: 0, ratio: 0 } ) );
            return cs;
        } );
        setColorSize( updateAssortValue );
    };

    const handleColorCheck = ( e, colorId ) => {
        const { checked } = e.target;
        const updateColor = color.map( c => {
            if ( colorId === c.id ) {
                c.isRemain = checked;
            }
            return c;
        } );
        setColor( updateColor );

        const isAllUpdateColor = updateColor.some( c => !c.isRemain === true );
        setAllColor( !isAllUpdateColor );

        const updateColorSize = colorSize.map( c => {
            if ( colorId === c.colorId ) {
                c.isRemain = checked;
            }
            return c;
        } );
        setColorSize( updateColorSize );

    };

    const handleSizeCheck = ( e, sizeId ) => {
        const { checked } = e.target;
        const updatedSize = size.map( s => {
            if ( sizeId === s.sizeId ) {
                s.isRemain = checked;
            }
            return s;
        } );
        setSize( updatedSize );


        const isAllUpdateSize = updatedSize.some( c => !c.isRemain === true );
        setAllSize( !isAllUpdateSize );

        const updatedColorSize = colorSize.map( cs => {
            cs.fieldId,
                cs.colorId,
                cs.colorName,
                cs.assortValue,
                cs.totalSizeQty,
                cs.colorValue,
                cs.isRemain,
                cs.sizes.map( s => {
                    if ( sizeId === s.sizeId ) {
                        s.isRemain = checked;
                    }
                    return s;
                } );
            return cs;
        } );
        setColorSize( updatedColorSize );
    };


    const handleSizeInputValueOnChange = ( e, fieldId, sizeFieldId ) => {
        const { value } = e.target;
        const updateInputValue = colorSize?.map( i => {
            if ( fieldId === i.fieldId ) {
                i.sizes?.map( s => {
                    if ( sizeFieldId === s.fieldId ) {
                        s.quantity = Number( value );
                    }
                    return s;
                } );
                i.totalSizeQty = isRation ? _.sum( i.sizes.map( s => Number( s.quantity ) ) ) * i.assortValue : _.sum( i.sizes.map( s => Number( s.quantity ) ) );
            }
            return i;
        } );
        setColorSize( updateInputValue );
    };
    const handleAssortValueChange = ( e, colorFieldId ) => {
        const { value } = e.target;
        const updateAssortValue = colorSize?.map( cs => {
            if ( colorFieldId === cs.fieldId ) {
                cs.assortValue = Number( value );
                cs.totalSizeQty = isRation ? _.sum( cs.sizes.map( s => Number( s.quantity ) ) ) * cs.assortValue : _.sum( cs.sizes.map( s => Number( s.quantity ) ) );
            }
            return cs;
        } );
        setColorSize( updateAssortValue );
    };


    const handleColorSizeDecisionChange = () => {
        const deferentColorArrays = color.filter( c => !colorSize.some( cs => c.id === cs.colorId ) );
        const getAllSizes = colorSize.map( cs => cs.sizes )[0]?.flat();
        const deferentSizeArrays = size.filter( c => !getAllSizes.some( cs => c.sizeId === cs.sizeId ) );
        const modifiedNewColorSize = deferentColorArrays.map( c => ( {
            fieldId: randomIdGenerator(),
            colorId: c.id,
            colorName: c.name,
            colorValue: c.name ? { label: c.name, value: c.id } : null,
            assortValue: 0,
            totalSizeQty: 0,
            isRemain: c.isRemain,
            sizes: getAllSizes.map( s => ( {
                fieldId: randomIdGenerator(),
                sizeId: s.sizeId,
                position: s.position,
                sizeName: s.name,
                ratePerUnit: 0,
                quantity: 0,
                ratio: 0,
                isRemain: s.isRemain,
                isInRatio: false
            } ) )
        } ) );
        const concatColorArray = colorSize.concat( modifiedNewColorSize );
        const filterColor = concatColorArray.filter( c => c.isRemain === true );

        const afterModificationSize = filterColor.map( cs => ( {
            fieldId: randomIdGenerator(),
            colorId: cs.colorId,
            colorName: cs.colorName,
            colorValue: cs.colorValue,
            assortValue: cs.assortValue,
            totalSizeQty: cs.totalSizeQty,

            isRemain: cs.isRemain,
            sizes: cs.sizes.concat( deferentSizeArrays.map( sj => ( {
                fieldId: randomIdGenerator(),
                sizeId: sj.sizeId,
                sizeName: sj.name,
                position: sj.position,
                ratePerUnit: 0,
                quantity: 0,
                ratio: 0,
                isRemain: sj.isRemain,
                isInRatio: false
            } ) ) ).filter( s => s.isRemain === true )
        } ) );
        setColorSize( afterModificationSize );

    };

    const handleAllColor = ( e ) => {
        const { checked } = e.target;
        setAllColor( checked );
        const updateColor = color.map( c => {
            c.isRemain = checked;
            return c;
        } );
        setColor( updateColor );

        const updateColorSize = colorSize.map( c => {
            c.isRemain = checked;
            return c;
        } );
        setColorSize( updateColorSize );
    };

    const handleAllSize = ( e ) => {
        const { checked } = e.target;
        setAllSize( checked );
        const updatedSize = size.map( s => {
            s.isRemain = checked;
            return s;
        } );
        setSize( updatedSize );

        const updatedColorSize = colorSize.map( cs => {
            cs.fieldId,
                cs.colorId,
                cs.colorName,
                cs.colorValue,
                cs.assortValue,
                cs.totalSizeQty,
                cs.isRemain,
                cs.sizes.map( s => {
                    s.isRemain = checked;
                } );
            return cs;
        } );
        setColorSize( updatedColorSize );
    };


    const handleNestedModelOpen = () => {
        setAllColor( !isAllColor );
        setAllSize( !isAllSize );
        setNestedModelOpen( !nestedModelOpen );
    };
    const handleNestedModelSubmit = () => {
        const isAnyColorSelected = color.some( c => c.isRemain === true );
        const isAnySizeSelected = size.some( c => c.isRemain === true );

        if ( isAnyColorSelected ) {
            if ( isAnySizeSelected ) {
                handleColorSizeDecisionChange();
                setNestedModelOpen( !nestedModelOpen );
            } else {
                notify( 'warning', 'Please at least a size select!!' );
            }

        } else {
            notify( 'warning', 'Please at least a color select!!' );

        }

    };
    const totalOrderQuantity = colorSizeRationIds?.orderQuantity;
    const colorSizeTotalQuantity = _.sum( colorSize?.map( sc => ( isRation ? _.sum( sc.sizes.map( s => Number( s.quantity ) ) ) * sc.assortValue : _.sum( sc.sizes.map( s => Number( s.quantity ) ) ) ) ) );

    ///Final Submit
    const handleSizeColorRationSubmit = () => {
        if ( totalOrderQuantity === colorSizeTotalQuantity ) {
            console.log( colorSize.map( s => s.sizes.some( q => q.quantity !== 0 ) ) );
            const isAllRowQuantityIsNotZero = colorSize.map( s => s.sizes.some( q => q.quantity !== 0 ) );
            if ( isAllRowQuantityIsNotZero.some( s => s === false ) ) {
                ///
                console.log( 'one is false' );
                notify( 'error', 'Empty Color wise Size Qty. never acceptable' );
            } else {

                const submitArray = colorSize.map( c => (
                    c.sizes.map( s => ( {
                        fieldId: s.fieldId,
                        styleId: colorSizeRationIds?.styleId,
                        asrtValue: isRation ? c.assortValue : 0,
                        colorValue: c.colorValue,
                        sizeId: s.sizeId,
                        sizeName: s.sizeName,
                        position: s.position,
                        colorId: c.colorId,
                        colorName: c.colorName,
                        ratePerUnit: s.ratePerUnit,
                        quantity: isRation ? 0 : s.quantity,
                        ratio: isRation ? s.quantity : 0,
                        isInRatio: isRation,
                        adjustedQuantity: s.adjustedQuantity,
                        sampleQuantity: s.sampleQuantity,
                        wastagePercentage: s.wastagePercentage,
                        excessPercentage: s.excessPercentage,
                        totalQuantity: s.quantity
                    } ) )
                ) ).flat();


                handleColorSizeBindingOnRow( colorSizeRationIds.rowId, submitArray );
                setOpenModal( !openModal );
                setColorSizeRationIds( null );

            }

        } else {
            notify( 'warning', 'Expectable Total Quantity is not equal!!' );
        }

    };

    const handleColorDropdownChange = ( data, fieldId ) => {
        const updatedColorSize = colorSize.map( color => {
            if ( color.fieldId === fieldId ) {
                color['colorId'] = data?.value;
                color['colorName'] = data?.label;
                color['colorValue'] = data;
            }
            return color;
        } );
        setColorSize( updatedColorSize );
    };

    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
        setColorSizeRationIds( null );
    };


    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-lg'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModelSubmit={handleSizeColorRationSubmit}
                handleMainModalToggleClose={handleMainModalToggleClose}
                title="Size Color Ratio"
            >
                <Card className="p-0" >
                    <CardBody className="custom-table">
                        <div className="d-flex justify-content-between">
                            <div >
                                <p className="font-weight-bolder"> Total Order Quantity: {colorSizeRationIds?.orderQuantity}</p>
                            </div>
                            <div>
                                <Button.Ripple onClick={() => { handleNestedModelOpen(); }} className='btn-icon mt-n3' color='flat-success' id='positionBottom'>
                                    <MoreVertical className='cursor-pointer' size={15} />
                                </Button.Ripple>
                                <UncontrolledTooltip placement='left' target='positionBottom'>
                                    Size and Color Variation
                                </UncontrolledTooltip>
                            </div>
                        </div>
                        {colorSize && color.length > 0 ? (
                            <Table responsive bordered className='text-center font-weight-bold'>
                                <thead className="thead-light">
                                    <tr className="text-nowrap" >
                                        <th>SL</th>
                                        <th>Color</th>
                                        {isRation &&
                                            <th>Assort Value</th>
                                        }

                                        {/* {
                                            colorSize?.map( cs => (
                                                cs?.sizes?.map( s => (
                                                    <Fragment key={s.fieldId}>
                                                        <th>{s.sizeName}</th>
                                                    </Fragment>
                                                ) )
                                            ) )[0]
                                        } */}
                                        {
                                            colorSize?.map( cs => (
                                                _.sortBy( cs?.sizes, 'position' ).map( s => (
                                                    <Fragment key={s.fieldId}>
                                                        <th>{s.sizeName}</th>
                                                    </Fragment>
                                                ) )
                                            ) )[0]
                                        }
                                        <th hidden={!isRation} >Total Ratio</th>
                                        <th>Qty.</th>
                                        <th>Total Qty.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {_.sortBy( colorSize, 'colorName' )?.map( ( sc, idx ) => (
                                        <tr key={sc.fieldId}>
                                            <td className="sl">{idx + 1}</td>
                                            <td hidden={isRation}>{sc.colorName}</td>
                                            <td hidden={!isRation} >
                                                <div style={{ minWidth: "180px" }}>
                                                    <Select
                                                        id='colorId'
                                                        name="colorName"
                                                        isSearchable
                                                        // isClearable
                                                        menuPosition="fixed"
                                                        theme={selectThemeColors}
                                                        options={color.filter( cr => !colorSize?.some( cc => cc.colorId === cr.id ) )}
                                                        // dropDownBuyerDepartments.filter( f => !buyerBasicInfo.buyerDepartment?.some( i => i.id === f.value && i.isDeleted === false ) );
                                                        classNamePrefix="dropdown"
                                                        className="erp-dropdown-select w-100"
                                                        value={sc.colorValue}
                                                        onChange={( data ) => {
                                                            handleColorDropdownChange( data, sc.fieldId );
                                                        }}
                                                    />
                                                </div>

                                            </td>

                                            {isRation &&
                                                <td>
                                                    {/* <Input
                                                        id={`${idx + sc.colorName}`}
                                                        className="text-right  font-weight-bold"
                                                        name="assortValue"
                                                        htmlFor={`${idx + sc.colorName}`}
                                                        type="number"
                                                        bsSize="sm"
                                                        value={sc.assortValue}
                                                        onFocus={e => e.target.select()}
                                                        onChange={( e ) => { handleAssortValueChange( e, sc.fieldId ); }}
                                                    /> */}
                                                    <NumberFormat
                                                        className="form-control-sm form-control"
                                                        id={`${idx + sc.colorName}`}
                                                        name="assortValue"
                                                        htmlFor={`${idx + sc.colorName}`}
                                                        value={sc.assortValue}
                                                        onFocus={( e ) => { e.target.select(); }}
                                                        displayType="input"
                                                        decimalScale={0}
                                                        fixedDecimalScale={true}
                                                        allowNegative={false}
                                                        allowLeadingZeros={false}
                                                        onChange={( e ) => { handleAssortValueChange( e, sc.fieldId ); }}
                                                    />
                                                </td>
                                            }

                                            {
                                                _.sortBy( sc.sizes, 'position' )?.map( s => (
                                                    <td key={s.fieldId}>
                                                        {/* <Input
                                                            className="text-right font-weight-bold"
                                                            id={`${s.sizeId}-${sc.colorId}`}
                                                            name={`${s.sizeName}-${sc.colorId}`}
                                                            htmlFor={`${s.sizeId}-${sc.colorId}`}
                                                            type="number"
                                                            bsSize="sm"
                                                            onFocus={e => e.target.select()}
                                                            value={s.quantity}
                                                            onChange={( e ) => {
                                                                handleSizeInputValueOnChange( e, sc.fieldId, s.fieldId );
                                                            }}
                                                        /> */}
                                                        <NumberFormat
                                                            className="form-control-sm form-control"
                                                            id={`${s.sizeId}-${sc.colorId}`}
                                                            name={`${s.sizeName}-${sc.colorId}`}
                                                            htmlFor={`${s.sizeId}-${sc.colorId}`}
                                                            value={s.quantity}
                                                            onFocus={( e ) => { e.target.select(); }}
                                                            displayType="input"
                                                            decimalScale={0}
                                                            fixedDecimalScale={true}
                                                            allowNegative={false}
                                                            allowLeadingZeros={false}
                                                            onChange={( e ) => {
                                                                handleSizeInputValueOnChange( e, sc.fieldId, s.fieldId );
                                                            }}
                                                        />
                                                        {/* <label>{++s.quantity}</label> */}
                                                    </td>
                                                ) )
                                            }
                                            <td hidden={!isRation}>{isRation ? _.sum( sc.sizes.map( s => Number( s.quantity ) ) ) : ''}</td>
                                            <td>{isRation ? _.sum( sc.sizes.map( s => Number( s.quantity ) ) ) * sc.assortValue : _.sum( sc.sizes.map( s => Number( s.quantity ) ) )}</td>
                                            <td hidden={idx > 0} rowSpan={colorSize.length}>{colorSizeTotalQuantity}</td>
                                        </tr>
                                    ) )}
                                    {/* <tr>
                                        <td colSpan={2} className="text-right">Total</td>
                                        {
                                            isRation &&
                                            <td >
                                                Total Assort
                                            </td>
                                        }

                                        {colorSize?.map( cs => (
                                            cs?.sizes?.map( s => (
                                                <Fragment key={s.sizeId}>
                                                    <td>{_.sum( Number( s.quantity ) )}</td>
                                                </Fragment>
                                            ) )
                                        ) )[0]}

                                        <td>Total</td>
                                    </tr> */}
                                </tbody>
                            </Table>
                        ) : <Progress
                            animated
                            color="info"
                            value={100}
                        />}

                        <div className="d-flex flex-row-reverse mt-1">
                            <CustomInput
                                type='checkbox'
                                className='custom-control-Primary'
                                id='Primary'
                                label='is In Ratio?'
                                checked={isRation}
                                onChange={e => { handleRationCheck( e ); }}
                                inline
                            />
                        </div>
                    </CardBody>
                    <CustomNestedModal
                        modalTypeClass='vertically-centered-modal'
                        className='modal-dialog-centered modal-md'
                        openModal={nestedModelOpen}
                        setOpenModal={setNestedModelOpen}
                        title={`Color & Size Variation`}
                        handleNestedModelOpen={handleNestedModelOpen}
                        handleNestedModelSubmit={handleNestedModelSubmit}
                    >
                        <Card >
                            <CardBody className="custom-table-color-selection p-1">
                                {/* <CardTitle tag="h4" style={{ color: '#7367f0' }}>Color Size</CardTitle> */}
                                <Row >
                                    <Col lg={6} md={6} xs={6} sm={6} >
                                        <FormGroup row className="text-nowrap pl-1">
                                            <Col >
                                                <FormGroup >
                                                    <CustomInput
                                                        type='switch'
                                                        label={<CustomInputLabel />}
                                                        id='icon-color'
                                                        name='icon-color'
                                                        inline
                                                        checked={allColor}
                                                        onChange={( e ) => { handleAllColor( e ); }}
                                                    >All Color</CustomInput>

                                                </FormGroup>
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col lg={6} md={6} xs={6} sm={6}>
                                        <FormGroup row className="text-nowrap pl-3 ">
                                            <Col>
                                                <FormGroup >
                                                    <CustomInput
                                                        type='switch'
                                                        label={<CustomInputLabel />}
                                                        id='icon-size'
                                                        name='icon-size'
                                                        inline
                                                        checked={allSize}
                                                        onChange={( e ) => { handleAllSize( e ); }}
                                                    >All Size</CustomInput>
                                                </FormGroup>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Table responsive size="sm" bordered style={{ border: 'solid 1px' }} >
                                    <thead>
                                        <tr className="thead-light"  >
                                            <th className="text-nowrap">Style Color</th>
                                            <th className="text-nowrap pl-2">Style Size</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td className="align-top">
                                                <div className="overflow-div">
                                                    <FormGroup >
                                                        {_.sortBy( color, 'name' )?.map( c => (
                                                            <Fragment key={c.id}>
                                                                <FormGroup>
                                                                    <CustomInput
                                                                        type='checkbox'
                                                                        className='custom-control-Primary'
                                                                        id={c.id}
                                                                        label={c.name}
                                                                        name={c.name}
                                                                        htmlFor={c.id}
                                                                        // defaultChecked
                                                                        checked={c.isRemain}
                                                                        inline
                                                                        onChange={( e ) => { handleColorCheck( e, c.id ); }}
                                                                    />
                                                                </FormGroup>
                                                            </Fragment>
                                                        ) )}
                                                    </FormGroup>

                                                </div>
                                            </td>
                                            <td className="align-top">
                                                <div className="overflow-div">
                                                    <FormGroup >
                                                        {
                                                            _.sortBy( size, 'position' )?.map( s => (
                                                                <Fragment key={s.sizeId}>
                                                                    <FormGroup  >
                                                                        <CustomInput
                                                                            type='checkbox'
                                                                            className='custom-control-Primary'
                                                                            id={s.sizeId}
                                                                            htmlFor={s.sizeId}
                                                                            checked={s.isRemain}
                                                                            label={s.name}
                                                                            onChange={( e ) => { handleSizeCheck( e, s.sizeId ); }}
                                                                        />

                                                                    </FormGroup>
                                                                </Fragment>
                                                            ) )
                                                        }
                                                    </FormGroup>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>

                            </CardBody>
                        </Card>
                    </CustomNestedModal>
                </Card>
            </CustomModal>
        </div>
    );
};

export default SizeColorRation;

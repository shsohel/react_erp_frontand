/* eslint-disable no-unused-expressions */
import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import _ from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import { MoreVertical } from "react-feather";
import { useDispatch } from 'react-redux';
import { Button, Card, CardBody, Col, CustomInput, FormGroup, Input, Row, Spinner, Table, UncontrolledTooltip } from 'reactstrap';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import { CustomInputLabel } from "../../../../utility/custom/CustomInputLabel";
import CustomModal from '../../../../utility/custom/CustomModal';
import CustomNestedModal from "../../../../utility/custom/CustomNestedModal";
import { randomIdGenerator } from "../../../../utility/Utils";
import { addSinglePOSizeColorRation, getColorSizeRationByPODetailsId } from '../store/actions';


const SizeColorRationEdit = ( {
    openModal,
    setOpenModal,
    colorSizeRationEditIds,
    setColorSizeRationEditIds,
    quantityOnSizeAndColor
} ) => {
    const dispatch = useDispatch();
    const [nestedModelOpen, setNestedModelOpen] = useState( false );
    const [isRation, setIsRation] = useState( false );
    const [color, setColor] = useState( [] );
    const [size, setSize] = useState( [] );
    const [colorSize, setColorSize] = useState( null );
    const [allColor, setAllColor] = useState( true );
    const [allSize, setAllSize] = useState( true );


    const handleStyleColor = async ( styleId ) => {
        await baseAxios.get( `${merchandisingApi.style.get_style_sizes}/${styleId}/colors` )
            .then( response => {
                setColor( response?.data?.map( c => ( {
                    id: c.id,
                    name: c.name,
                    isRemain: true
                } ) ) );
            } );
    };

    const handleGetSizes = async ( sizeGroupId ) => {
        await baseAxios.get( `${merchandisingApi.sizeGroup.get_size_group_by_id}/${sizeGroupId}` )
            .then( response => {
                setSize( response?.data?.sizes.map( s => ( {
                    sizeId: s.sizeId,
                    name: s.name,
                    isRemain: true
                } ) ) );

                const findColor = color.filter( c => quantityOnSizeAndColor.some( x => c.id === x.colorId ) );
                setIsRation( quantityOnSizeAndColor.some( q => q.isInRatio === true ) );

                setColorSize(
                    findColor.map( c => ( {
                        fieldId: randomIdGenerator(),
                        colorId: c.id,
                        colorName: c.name,
                        assortValue: quantityOnSizeAndColor.find( f => c.id === f.colorId ).asrtValue,
                        isRemain: true,
                        totalSizeQty: _.sum( quantityOnSizeAndColor.filter( f => c.id === f.colorId ).map( s => Number( s.quantity ) ) ),
                        sizes: quantityOnSizeAndColor.filter( f => c.id === f.colorId ).map( s => ( {
                            fieldId: randomIdGenerator(),
                            id: s.id,
                            sizeId: s.sizeId,
                            sizeName: s.size,
                            quantity: s.quantity,
                            ratio: s.ratio,
                            isInRatio: s.isInRatio,
                            isRemain: true
                        } ) )
                    } ) )
                );
                // setColorSize(
                //     color.map( c => ( {
                //         fieldId: randomIdGenerator(),
                //         colorId: c.id,
                //         colorName: c.name,
                //         isRemain: c.isRemain,
                //         sizes: response?.data?.sizes.map( s => ( {
                //             fieldId: randomIdGenerator(),
                //             sizeId: s.sizeId,
                //             sizeName: s.name,
                //             quantity: 0,
                //             ratio: 0,
                //             isInRatio: false,
                //             isRemain: true
                //         } ) )
                //     } ) )
                // );
            } );
    };

    useEffect( () => {
        if ( colorSizeRationEditIds ) {
            handleStyleColor( colorSizeRationEditIds?.styleId );
            handleGetSizes( colorSizeRationEditIds?.sizeGroupId );
        }

    }, [dispatch, !color.length, !quantityOnSizeAndColor.length] );

    const handleRationCheck = ( e ) => {
        const { checked } = e.target;
        setIsRation( checked );
        const updateAssortValue = colorSize?.map( cs => {
            cs.totalSizeQty = checked ? _.sum( cs.sizes.map( s => Number( s.ratio ) ) ) * cs.assortValue : _.sum( cs.sizes.map( s => Number( s.quantity ) ) );
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
                        if ( isRation ) {
                            s.ratio = Number( value );
                        } else {
                            s.quantity = Number( value );
                        }
                    }
                    return s;
                } );
                i.totalSizeQty = isRation ? _.sum( i.sizes.map( s => Number( s.ratio ) ) ) * i.assortValue : _.sum( i.sizes.map( s => Number( s.quantity ) ) );
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
            isRemain: c.isRemain,
            assortValue: c.assortValue,
            totalSizeQty: c.totalSizeQty,
            ///Here A Problems
            sizes: getAllSizes.filter( sf => sf.isRemain === true ).map( s => ( {
                fieldId: randomIdGenerator(),
                sizeId: s.sizeId,
                sizeName: s.name,
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
            assortValue: cs.assortValue,
            totalSizeQty: cs.totalSizeQty,
            isRemain: cs.isRemain,
            sizes: cs.sizes.concat( deferentSizeArrays.map( sj => ( {
                fieldId: randomIdGenerator(),
                sizeId: sj.sizeId,
                sizeName: sj.name,
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
        const colorIsRemain = color.map( c => ( {
            id: c.id,
            name: c.name,
            isRemain: !!colorSize.some( cs => cs.colorId === c.id )
        } ) );
        setColor( colorIsRemain );

        const isAllColor = colorIsRemain.some( c => !c.isRemain === true );

        const sizeIsRemain = size.map( s => ( {
            sizeId: s.sizeId,
            name: s.name,
            isRemain: !!colorSize.some( cs => cs.sizes.some( sc => sc.sizeId === s.sizeId ) )
        } ) );

        setSize( sizeIsRemain );

        const isAllSize = sizeIsRemain.some( c => !c.isRemain === true );

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

    ///Final Submit
    const handleSizeColorRationSubmit = () => {
        const submitArray = colorSize.map( c => (
            c.sizes.map( s => ( {
                id: s.id,
                styleId: colorSizeRationEditIds?.styleId,
                asrtValue: isRation ? c.assortValue : 0,
                sizeId: s.sizeId,
                colorId: c.colorId,
                quantity: isRation ? 0 : s.quantity,
                ratio: isRation ? s.ratio : 0,
                isInRatio: isRation
            } ) )
        ) ).flat();


        dispatch( addSinglePOSizeColorRation(
            colorSizeRationEditIds?.orderId,
            colorSizeRationEditIds?.orderDetailsId,
            submitArray ) );
        setOpenModal( !openModal );
        //   setColorSizeRationEditIds( null );
        // dispatch( getColorSizeRationByPODetailsId( null ) );
    };

    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
        setColorSizeRationEditIds( null );
        dispatch( getColorSizeRationByPODetailsId( null ) );
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
                title="Edit Size Color Ratio"
            >
                <Card className="p-0" >
                    <CardBody className="custom-table">
                        <div className="d-flex flex-row-reverse">
                            <Button.Ripple onClick={() => { handleNestedModelOpen(); }} className='btn-icon mt-n3' color='flat-success' id='positionBottom'>
                                <MoreVertical className='cursor-pointer' size={15} />
                            </Button.Ripple>
                            <UncontrolledTooltip placement='left' target='positionBottom'>
                                Size and Color Variation
                            </UncontrolledTooltip>
                        </div>
                        {colorSize && color.length > 0 ? (
                            <Table responsive bordered className='text-center'>
                                <thead className="thead-light">
                                    <tr className="text-nowrap" >
                                        <th>SL</th>
                                        <th>Color</th>
                                        {isRation &&
                                            <th>Assort Value</th>
                                        }
                                        {
                                            colorSize?.map( cs => (
                                                cs?.sizes?.map( s => (
                                                    <Fragment key={s.sizeId}>
                                                        <th>{s.sizeName}</th>
                                                    </Fragment>
                                                ) )
                                            ) )[0]
                                        }
                                        <th>Total</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {colorSize?.map( ( sc, idx ) => (
                                        <tr key={sc.fieldId}>
                                            <td>{idx + 1}</td>
                                            <td>{sc.colorName}</td>
                                            {isRation &&
                                                <td>
                                                    <Input
                                                        id={`${idx + sc.colorName}`}
                                                        className="text-right font-weight-bold"
                                                        name="assortValue"
                                                        htmlFor={`${idx + sc.colorName}`}
                                                        type="number"
                                                        bsSize="sm"
                                                        value={sc.assortValue}
                                                        onFocus={e => e.target.select()}
                                                        onChange={( e ) => { handleAssortValueChange( e, sc.fieldId ); }}
                                                    />
                                                </td>
                                            }
                                            {
                                                sc.sizes?.map( s => (
                                                    <td key={s.fieldId}>
                                                        <Input
                                                            className="text-right"
                                                            id={`${s.sizeId}-${sc.colorId}`}
                                                            name={`${s.sizeName}-${sc.colorId}`}
                                                            htmlFor={`${s.sizeId}-${sc.colorId}`}
                                                            type="number"
                                                            bsSize="sm"
                                                            onFocus={e => e.target.select()}
                                                            value={isRation ? s.ratio : s.quantity}
                                                            onChange={( e ) => {
                                                                handleSizeInputValueOnChange( e, sc.fieldId, s.fieldId );
                                                            }}
                                                        >
                                                        </Input>
                                                    </td>
                                                ) )
                                            }
                                            <td>{sc.totalSizeQty}</td>

                                        </tr>
                                    ) )}
                                </tbody>
                            </Table>
                        ) : <Spinner />}

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
                                                        {color?.map( c => (
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
                                                            size?.map( s => (
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

export default SizeColorRationEdit;

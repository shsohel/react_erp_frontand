import { merchandisingApi } from "@api/merchandising";
import { baseAxios } from "@services";
import _ from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import { Check, MoreVertical, X } from 'react-feather';
import { useDispatch } from "react-redux";
import { Button, Card, CardBody, Input, Table, UncontrolledTooltip } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import CustomNestedModal from '../../../../utility/custom/CustomNestedModal';
import { randomIdGenerator } from '../../../../utility/Utils';
import { getDropDownColors } from "../../color/store/actions";
import { getDropDownSizeGroups } from "../../size-group/store/actions";
import { getDropDownSizes } from "../../size/store/actions";
const Label2 = () => (
    <Fragment>
        <span className='switch-icon-left'>
            <Check size={14} />
        </span>
        <span className='switch-icon-right'>
            <X size={14} />
        </span>
    </Fragment>
);


const SizeRatio = ( { openModal, setOpenModal, colorSizeRationIds, setColorSizeRationIds, handleColorSizeBindingOnRow } ) => {
    const dispatch = useDispatch();
    const [isRation, setIsRation] = useState( false );
    const [nestedModelOpen, setNestedModelOpen] = useState( false );

    const [setStyle, setSetStyle] = useState( null );

    const [sizeGroups, setSizeGroups] = useState( null );
    const [color, setColor] = useState( null );

    const [sizeQuantityDetails, setSizeQuantityDetails] = useState( [] );

    const handleSizeRationSubmit = () => {
        const submitArray = sizeQuantityDetails.map( sqd => ( {
            styleId: sqd.styleId,
            sizeId: sqd.sizeId,
            size: sqd.size,
            colorId: sqd.colorId,
            quantity: sqd.quantity,
            ratio: 0,
            asrtValue: 0,
            isInRatio: isRation
        } ) );

        console.log( JSON.stringify( submitArray, null, 2 ) );
        handleColorSizeBindingOnRow( colorSizeRationIds?.rowId, submitArray );

        // dispatch( addSinglePOSizeColorRation(
        //     colorSizeRationIds?.orderId,
        //     colorSizeRationIds?.orderDetailsId,
        //     submitArray ) );
        setOpenModal( !openModal );
        setSizeQuantityDetails( [] );

    };
    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
        setColorSizeRationIds( null );
    };
    const handleNestedModelOpen = () => {
        setNestedModelOpen( !nestedModelOpen );
    };

    const handleSizeQuantityBinding = async ( setStyleId ) => {
        if ( colorSizeRationIds.colorSizeQuantity.length ) {
            setSizeQuantityDetails( colorSizeRationIds.colorSizeQuantity.map( cs => ( { ...cs, fieldId: randomIdGenerator() } ) ) );
        } else {
            await baseAxios.get( `${merchandisingApi.setStyle.root}/${setStyleId}/styleDetails/sizesAndColors` )
                .then( response => {
                    const styleDetails = response.data;
                    const sizeColorDetailsArray = styleDetails.map( rb => ( {
                        fieldId: randomIdGenerator(),
                        styleId: rb.styleId,
                        styleNo: rb.styleNo,
                        sizeId: rb.sizeId,
                        size: rb.size,
                        colorId: rb.colorId,
                        color: rb.color,
                        quantity: 0,
                        ratio: 0,
                        isInRatio: false
                    } ) );
                    setSizeQuantityDetails( sizeColorDetailsArray );
                } );
        }
    };


    const handleSizeQuantityOnChange = ( e, sizeId ) => {
        const { value } = e.target;
        const updatedData = sizeQuantityDetails.map( i => {
            if ( sizeId === i.sizeId ) {
                i.quantity = Number( value );
            }
            return i;
        } );
        setSizeQuantityDetails( updatedData );
    };


    const handleGetSetStyleDetailsById = async ( setStyleId ) => {
        await baseAxios.get( `${merchandisingApi.setStyle.root}/${setStyleId}/styleDetails` )
            .then( res => {
                console.log( res );
                const responseBody = res?.data;
                setSetStyle( responseBody );
            } );
    };


    useEffect( () => {
        if ( colorSizeRationIds ) {
            handleGetSetStyleDetailsById( colorSizeRationIds.styleId );
            handleSizeQuantityBinding( colorSizeRationIds.styleId );
        }
        dispatch( getDropDownSizeGroups() );
        dispatch( getDropDownSizes() );
        dispatch( getDropDownColors() );
    }, [dispatch, colorSizeRationIds.styleId] );


    const handleNestedModelSubmit = async () => {
        // const objForSubmit = {
        //     isSizeSpecific: setStyle.isSizeSpecific,
        //     isColorSpecific: setStyle.isColorSpecific,
        //     sizeGroupId: sizeGroups ? sizeGroups.value : null,
        //     colorId: color ? color.value : null,
        //     styleDetails: setStyleDetails.map( sd => ( {
        //         styleId: sd.styleId,
        //         sizeId: sd.sizeId,
        //         size: sd.size,
        //         colorId: sd.colorId,
        //         color: sd.colorId,
        //         quantity: sd.quantity
        //     } ) )
        // };
        //  dispatch( setStyleDetailsUpdate( objForSubmit, colorSizeRationIds.styleId ) );


        setNestedModelOpen( !nestedModelOpen );
    };

    console.log( 'sizeQuantityDetails', JSON.stringify( sizeQuantityDetails, null, 2 ) );

    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-lg'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModalToggleClose={handleMainModalToggleClose}
                handleMainModelSubmit={handleSizeRationSubmit}
                title="Add Size Quantity"
            >
                <Card outline >
                    <CardBody className="custom-table">
                        <div className="d-flex justify-content-between">
                            <div className=" ">
                                <p className="font-weight-bolder"> Total Order Quantity: {colorSizeRationIds.orderQuantity}</p>
                            </div>
                            <div className="">
                                <Button.Ripple onClick={() => { handleNestedModelOpen(); }} className='btn-icon mt-n3' color='flat-success' id='positionBottom'>
                                    <MoreVertical className='cursor-pointer' size={15} />
                                </Button.Ripple>
                                <UncontrolledTooltip placement='left' target='positionBottom'>
                                    SET STYLE DETAILS
                                </UncontrolledTooltip>
                            </div>

                        </div>
                        <Table bordered className="text-center">
                            <thead>
                                <tr>
                                    {
                                        _.uniqBy( sizeQuantityDetails, 'sizeId' ).map( size => (
                                            <Fragment key={size.fieldId}>
                                                <th>{size.size}</th>
                                            </Fragment>
                                        ) )
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {
                                        _.uniqBy( sizeQuantityDetails, 'sizeId' ).map( size => (
                                            <Fragment key={size.fieldId}>
                                                <td>
                                                    <Input
                                                        id="quantityId"
                                                        className="text-right"
                                                        bsSize="sm"
                                                        name="quantity"
                                                        value={size.quantity}
                                                        onChange={( e ) => { handleSizeQuantityOnChange( e, size.sizeId ); }}
                                                        onFocus={( e ) => e.target.select()}
                                                    />
                                                </td>
                                            </Fragment>
                                        ) )
                                    }
                                </tr>
                            </tbody>
                        </Table>
                    </CardBody>
                    <CustomNestedModal
                        modalTypeClass='vertically-centered-modal'
                        className='modal-dialog-centered modal-lg'
                        openModal={nestedModelOpen}
                        setOpenModal={setNestedModelOpen}
                        title={` Set Style Details `}
                        handleNestedModelOpen={handleNestedModelOpen}
                        handleNestedModelSubmit={handleNestedModelSubmit}
                    >
                        <Card  >
                            <CardBody className="custom-table-color-size">
                                <div className="d-flex justify-content-between">
                                    <div >
                                        <p className="font-weight-bolder">Color:  {!setStyle?.isColorSpecific ? `${setStyle?.colorName} For All` : "NA"}  </p>
                                    </div>
                                    <div sm={12} md={6} lg={6} className="justify-content-end">
                                        <p className=" font-weight-bolder">Size Group:  {!setStyle?.isSizeSpecific ? `${setStyle?.sizeGroupName} For All` : "NA"} </p>
                                    </div>
                                </div>

                                <Table responsive bordered className="font-weight-bold">
                                    <thead className="thead-light table-bordered">
                                        <tr>
                                            <th className="text-nowrap">Style No</th>
                                            <th className="text-nowrap"> Color</th>
                                            <th className="text-nowrap">Size</th>
                                            <th className="text-nowrap">Quantity</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {setStyle?.styleDetails?.map( ( ssd, index ) => (
                                            <tr key={index + 1}>
                                                <td className="text-nowrap">
                                                    {ssd.styleNo}
                                                </td>
                                                <td>
                                                    {setStyle?.isColorSpecific ? ssd.color : "NA"}
                                                </td>
                                                <td>
                                                    {setStyle?.isSizeSpecific ? ssd.size : "NA"}
                                                </td>
                                                <td style={{ width: '160px', paddingLeft: '5px', paddingRight: '5px' }}>
                                                    {ssd.quantity}
                                                </td>
                                            </tr>
                                        ) )}
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

export default SizeRatio;

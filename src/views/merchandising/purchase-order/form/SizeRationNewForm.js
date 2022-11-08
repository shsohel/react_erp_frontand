import { merchandisingApi } from "@api/merchandising";
import { baseAxios } from "@services";
import _ from 'lodash';
import React, { Fragment, useState } from 'react';
import { MoreVertical } from 'react-feather';
import { useDispatch } from "react-redux";
import { Button, Card, CardBody, Input, Table, UncontrolledTooltip } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import CustomNestedModal from '../../../../utility/custom/CustomNestedModal';
import { notify } from "../../../../utility/custom/notifications";


const SizeRationNewForm = ( { openModal,
    setOpenModal,
    sizeQuantityDetails,
    setSizeQuantityDetails,
    handleColorSizeBindingOnRow,
    sizeRationIds
} ) => {
    const dispatch = useDispatch();
    const [isRation, setIsRation] = useState( false );
    const [nestedModelOpen, setNestedModelOpen] = useState( false );

    const [setStyle, setSetStyle] = useState( null );

    const totalOrderQuantity = sizeRationIds?.orderQuantity;
    const sizeTotalQuantity = _.sum( _.uniqBy( sizeQuantityDetails, 'sizeId' ).map( s => Number( s.quantity ) ) );
    console.log( sizeTotalQuantity );

    const handleSizeRationSubmit = () => {
        if ( totalOrderQuantity === sizeTotalQuantity ) {
            const submitArray = sizeQuantityDetails.map( sqd => ( {
                styleId: sqd.styleId,
                sizeId: sqd.sizeId,
                colorId: sqd.colorId,
                color: sqd.color,
                sizeName: sqd.sizeName,
                quantity: sqd.quantity,
                ratio: 0,
                asrtValue: 0,
                isInRatio: isRation
            } ) );

            handleColorSizeBindingOnRow( sizeRationIds?.rowId, submitArray );
            setOpenModal( !openModal );
            setSizeQuantityDetails( [] );
        } else {
            notify( 'warning', 'Expectable Total Quantity is not equal!!' );
        }


    };
    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
    };
    const handleNestedModelOpen = () => {
        setNestedModelOpen( !nestedModelOpen );
        baseAxios.get( `${merchandisingApi.setStyle.root}/${sizeRationIds?.styleId}/styleDetails` )
            .then( res => {
                console.log( res );
                const responseBody = res?.data;
                setSetStyle( responseBody );
            } );
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

    const handleNestedModelSubmit = async () => {

        setNestedModelOpen( !nestedModelOpen );
    };

    const sortedSizeQuantityDetails = _.sortBy( sizeQuantityDetails, 'sizeName' );

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
                                <p className="font-weight-bolder"> Total Order Quantity: {sizeRationIds?.orderQuantity}</p>
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
                                        _.uniqBy( sortedSizeQuantityDetails, 'sizeId' ).map( size => (
                                            <Fragment key={size.fieldId}>
                                                <th>{size.sizeName}</th>
                                            </Fragment>
                                        ) )
                                    }
                                    <th>Total Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {
                                        _.uniqBy( sortedSizeQuantityDetails, 'sizeId' ).map( size => (
                                            <Fragment key={size.fieldId}>
                                                <td>
                                                    <Input
                                                        id="quantityId"
                                                        type="number"
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
                                    <td>{sizeTotalQuantity}</td>
                                    {/* {
                                        _.uniqWith( sizeQuantityDetails, ( a, b ) => a.sizeId === b.sizeId && a.colorId === b.colorId && a.quantity === b.quantity ).map( size => (
                                            <Fragment key={size.fieldId}>
                                                <td>
                                                    <Input
                                                        id="quantityId"
                                                        type="number"
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
                                    } */}
                                    {/* {
                                        sizeQuantityDetails.filter( f => f.quantity ).map( size => (
                                            <Fragment key={size.fieldId}>
                                                <td>
                                                    <Input
                                                        id="quantityId"
                                                        type="number"
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
                                    } */}
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
                                {/* <div className="d-flex justify-content-between">
                                    <div >
                                        <p className="font-weight-bolder">Color:  {!setStyle?.isColorSpecific ? `${setStyle?.colorName} For All` : "NA"}  </p>
                                    </div>
                                    <div sm={12} md={6} lg={6} className="justify-content-end">
                                        <p className=" font-weight-bolder">Size Group:  {!setStyle?.isSizeSpecific ? `${setStyle?.sizeGroupName} For All` : "NA"} </p>
                                    </div>
                                </div> */}

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
                                        {_.sortBy( setStyle?.styleDetails, 'color' )?.map( ( ssd, index ) => (
                                            <tr key={index + 1}>
                                                <td className="text-nowrap">
                                                    {ssd.styleNo}
                                                </td>
                                                <td>
                                                    {ssd.color}
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

export default SizeRationNewForm;

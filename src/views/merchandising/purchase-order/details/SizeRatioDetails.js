import { merchandisingApi } from "@api/merchandising";
import { baseAxios } from "@services";
import React, { useEffect, useState } from 'react';
import { MoreVertical } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, Spinner, Table, UncontrolledTooltip } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import CustomNestedModal from '../../../../utility/custom/CustomNestedModal';
import { getColorSizeRationByPODetailsId } from "../store/actions";

const SizeRatioDetails = ( { openModal, setOpenModal, colorSizeRationIds, setColorSizeRationIds } ) => {
    const dispatch = useDispatch();
    const { quantityOnSizeAndColor } = useSelector( ( { purchaseOrders } ) => purchaseOrders );
    const [nestedModelOpen, setNestedModelOpen] = useState( false );
    const [setStyle, setSetStyle] = useState( null );


    const handleSizeRationSubmit = () => {
        setOpenModal( !openModal );
        dispatch( getColorSizeRationByPODetailsId( null ) );
        setColorSizeRationIds( null );
    };
    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
        setColorSizeRationIds( null );
        dispatch( getColorSizeRationByPODetailsId( null ) );
    };
    const handleNestedModelOpen = () => {
        setNestedModelOpen( !nestedModelOpen );
    };


    const handleGetSetStyleDetailsById = async ( setStyleId ) => {
        await baseAxios.get( `${merchandisingApi.setStyle.root}/${setStyleId}/styleDetails` )
            .then( res => {
                const responseBody = res?.data;
                setSetStyle( responseBody );
            } );
    };


    useEffect( () => {
        handleGetSetStyleDetailsById( colorSizeRationIds.styleId );
    }, [dispatch, colorSizeRationIds.styleId] );


    const handleNestedModelSubmit = async () => {
        setNestedModelOpen( !nestedModelOpen );
    };


    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-lg'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModalToggleClose={handleMainModalToggleClose}
                handleMainModelSubmit={handleSizeRationSubmit}
                title="Size Quantity" >
                <Card outline >{ }
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
                        {quantityOnSizeAndColor.length > 0 ? <Table bordered className="text-center">
                            <thead>
                                <tr>
                                    <th>Style </th>
                                    <th>Color </th>
                                    <th> Size</th>
                                    <th> Total Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quantityOnSizeAndColor?.map( ( item, index ) => (
                                    <tr key={index + 1}>
                                        <td >
                                            {item.styleNo}
                                        </td>
                                        <td rowSpan="1"  >
                                            {item.color}
                                        </td>
                                        <td rowSpan="1">
                                            {item.size}
                                        </td>

                                        <td rowSpan="1" >
                                            {item.quantity}
                                        </td>
                                    </tr>
                                ) )
                                }


                            </tbody>
                        </Table> : ( <Spinner /> )
                        }

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

export default SizeRatioDetails;


import { merchandisingApi } from "@api/merchandising";
import { baseAxios } from "@services";
import React, { useState } from 'react';
import { MoreVertical } from 'react-feather';
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { Button, Card, CardBody, Input, Table, UncontrolledTooltip } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import CustomNestedModal from '../../../../utility/custom/CustomNestedModal';
import { selectThemeColors } from "../../../../utility/Utils";
import { getDropDownSetStyleColors } from "../../style/set-style/store/actions";


const ColorRationForm = ( { openModal,
    setOpenModal,
    colorQuantityDetails,
    setColorQuantityDetails,
    handleColorSizeBindingOnRow,
    colorRationIds
} ) => {
    const dispatch = useDispatch();
    const [isRation, setIsRation] = useState( false );
    const [nestedModelOpen, setNestedModelOpen] = useState( false );
    const { dropDownColors } = useSelector( ( { colors } ) => colors );
    const { dropdownSetStyleColors } = useSelector( ( { setStyles } ) => setStyles );

    const [setStyle, setSetStyle] = useState( null );


    const handleColorDropdownOnFocus = () => {
        if ( !dropdownSetStyleColors.length ) {
            dispatch( getDropDownSetStyleColors( colorRationIds?.setStyleId ) );
        }
    };

    console.log( colorQuantityDetails );

    const handleSizeRationSubmit = () => {
        const submitArray = colorQuantityDetails.map( sqd => ( {
            styleId: sqd.styleId,
            sizeId: sqd.sizeId,
            colorId: sqd.colorId,
            color: sqd.color,
            sizeName: sqd.sizeName,
            colorValue: sqd.colorValue,
            quantity: sqd.quantity,
            ratio: 0,
            asrtValue: 0,
            isInRatio: isRation
        } ) );

        handleColorSizeBindingOnRow( colorRationIds?.rowId, submitArray );
        setOpenModal( !openModal );
        setColorQuantityDetails( [] );

    };
    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
    };
    const handleNestedModelOpen = () => {
        setNestedModelOpen( !nestedModelOpen );
        baseAxios.get( `${merchandisingApi.setStyle.root}/${colorRationIds?.styleId}/styleDetails` )
            .then( res => {
                console.log( res );
                const responseBody = res?.data;
                setSetStyle( responseBody );
            } );
    };


    const handleColorQuantityOnChange = ( e ) => {
        const { value } = e.target;
        const updatedData = colorQuantityDetails.map( i => {
            i.quantity = Number( value );
            return i;
        } );
        setColorQuantityDetails( updatedData );
    };
    const handleColorOnChange = ( data ) => {
        const updatedData = colorQuantityDetails.map( i => {
            i.color = data?.label;
            i.colorId = data?.value;
            i.colorValue = data;

            return i;
        } );
        setColorQuantityDetails( updatedData );
    };

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
                title="Add Color Quantity"
            >
                <Card outline >
                    <CardBody className="custom-table">
                        <div className="d-flex justify-content-between">
                            <div className=" ">
                                <p className="font-weight-bolder"> Total Order Quantity: {colorRationIds?.orderQuantity}</p>
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
                        <Table bordered className="text-center custom-table">
                            <thead >
                                <tr>
                                    <th>Color</th>
                                    <th>Quantity</th>

                                </tr>
                            </thead>
                            <tbody>
                                {colorQuantityDetails.map( ( cs, index ) => (
                                    <tr key={index + 1}>
                                        <td>
                                            <Select
                                                id='colorId'
                                                name="color"
                                                isSearchable
                                                menuPosition="fixed"
                                                theme={selectThemeColors}
                                                options={dropdownSetStyleColors}
                                                classNamePrefix="dropdown"
                                                className="erp-dropdown-select "
                                                value={cs.colorValue}
                                                onChange={( data, e ) => {
                                                    handleColorOnChange( data );
                                                }}
                                                onFocus={() => { handleColorDropdownOnFocus(); }}
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                id="quantityId"
                                                type="number"
                                                className="text-right"
                                                bsSize="sm"
                                                name="quantity"
                                                value={cs.quantity}
                                                onChange={( e ) => {
                                                    handleColorQuantityOnChange( e );
                                                }}
                                                onFocus={( e ) => e.target.select()}
                                            />
                                        </td>

                                    </tr>
                                ) )[0]}

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
                                                    {ssd.color ?? "NA"}
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

export default ColorRationForm;

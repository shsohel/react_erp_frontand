import '@custom-styles/merchandising/others/custom-table.scss';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, CustomInput, FormGroup, Row, Table } from 'reactstrap';
import { CustomInputLabel } from '../../../../utility/custom/CustomInputLabel';
import CustomModal from '../../../../utility/custom/CustomModal';
import { notify } from '../../../../utility/custom/notifications';
import { bindConsumptionAccessoriesDetails, bindConsumptionFabricDetails } from '../store/actions';

const ApplicableSizeAndColorModal = ( { openModal, setOpenModal, applicableColorSize, setApplicableColorSize } ) => {
    const dispatch = useDispatch();
    const {
        consumptionFabricDetails,
        consumptionAccessoriesDetails

    } = useSelector( ( { consumptions } ) => consumptions );
    const allColor = applicableColorSize?.isAllColorApplicable;
    const allSize = applicableColorSize.isAllSizeApplicable;


    const handleModelSubmit = () => {
        const updatedColors = applicableColorSize.colors.filter( color => color.isSelected === true );
        const updatedSizes = applicableColorSize.sizes.filter( color => color.isSelected === true );

        if ( !updatedColors.length ) {
            notify( 'error', `Please select at least a color` );

        } else if ( !updatedSizes.length ) {
            notify( 'error', `Please select at least a size` );
        } else {
            if ( applicableColorSize.type === 'Fabric' ) {
                const updatedData = consumptionFabricDetails.map( fabric => {
                    if ( applicableColorSize.fieldId === fabric.fieldId ) {
                        fabric['consumptionPurchaseOrderSizes'] = applicableColorSize.sizes;
                        fabric['consumptionPurchaseOrderColors'] = applicableColorSize.colors;
                        fabric['isAllSizeApplicable'] = allSize;
                        fabric['isAllColorApplicable'] = allColor;
                    }
                    return fabric;
                } );

                dispatch( bindConsumptionFabricDetails( updatedData ) );
                setApplicableColorSize( null );

            } else {
                const updatedData = consumptionAccessoriesDetails.map( acc => {
                    if ( applicableColorSize.fieldId === acc.fieldId ) {
                        acc['consumptionPurchaseOrderSizes'] = applicableColorSize.sizes;
                        acc['consumptionPurchaseOrderColors'] = applicableColorSize.colors;
                        acc['isAllSizeApplicable'] = allSize;
                        acc['isAllColorApplicable'] = allColor;
                    }
                    return acc;
                } );

                dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
                setApplicableColorSize( null );

            }

            setOpenModal( !openModal );
        }


    };
    const handleModalToggleClose = () => {
        setOpenModal( !openModal );
        setApplicableColorSize( null );
    };


    const handleAllColor = ( e ) => {
        const { checked } = e.target;
        const updatedData = applicableColorSize.colors.map( color => ( { ...color, isSelected: checked } ) );
        const obj = {
            ...applicableColorSize,
            isAllColorApplicable: checked,
            colors: updatedData
        };
        setApplicableColorSize( obj );
    };

    const handleAllSize = ( e ) => {
        const { checked } = e.target;
        const updatedData = applicableColorSize.sizes.map( size => ( { ...size, isSelected: checked } ) );
        const obj = {
            ...applicableColorSize,
            isAllSizeApplicable: checked,
            sizes: updatedData
        };
        setApplicableColorSize( obj );
    };

    const handleColor = ( e, colorId ) => {
        const { checked } = e.target;
        const updatedData = applicableColorSize.colors.map( color => {
            if ( colorId === color.colorId ) {
                color['isSelected'] = checked;
            }
            return color;
        } );
        const obj = {
            ...applicableColorSize,
            isAllColorApplicable: updatedData?.every( color => color.isSelected === true ),
            colors: updatedData
        };
        setApplicableColorSize( obj );
    };

    const handleSize = ( e, sizeId ) => {
        const { checked } = e.target;
        const updatedData = applicableColorSize.sizes.map( size => {
            if ( sizeId === size.sizeId ) {
                size['isSelected'] = checked;
            }
            return size;
        } );
        const obj = {
            ...applicableColorSize,
            isAllSizeApplicable: updatedData?.every( size => size.isSelected === true ),
            sizes: updatedData
        };
        setApplicableColorSize( obj );
    };


    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog modal-md'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModelSubmit={handleModelSubmit}
                handleMainModalToggleClose={handleModalToggleClose}
                title="Applicable Colors and Sizes"
            >
                <div>
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
                    <Row>
                        <Col>
                            <Table responsive size="sm" bordered style={{ border: 'solid 1px' }} className="custom-table">
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
                                                {applicableColorSize?.colors?.map( c => (
                                                    <div key={c.colorId} style={{ padding: '0.3rem' }}>
                                                        <CustomInput
                                                            type='checkbox'
                                                            className='custom-control-Primary'
                                                            id={c.colorId}
                                                            label={c.colorName}
                                                            name={c.colorName}
                                                            htmlFor={c.colorId}
                                                            // defaultChecked
                                                            checked={c.isSelected}
                                                            inline
                                                            onChange={( e ) => { handleColor( e, c.colorId ); }}
                                                        />
                                                    </div>
                                                ) )}

                                            </div>
                                        </td>
                                        <td className="align-top">
                                            <div className="overflow-div">
                                                {
                                                    applicableColorSize?.sizes?.map( s => (
                                                        <div key={s.sizeId} style={{ padding: '0.3rem' }}>
                                                            <CustomInput
                                                                type='checkbox'
                                                                className='custom-control-Primary'
                                                                id={s.sizeId}
                                                                htmlFor={s.sizeId}
                                                                checked={s.isSelected}
                                                                label={s.sizeName}
                                                                onChange={( e ) => { handleSize( e, s.sizeId ); }}
                                                            />

                                                        </div>
                                                    ) )
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>

                    </Row>
                </div>

            </CustomModal>
        </div>
    );
};

export default ApplicableSizeAndColorModal;
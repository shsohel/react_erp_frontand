import React, { Fragment, useState } from 'react';
import { Check, X } from 'react-feather';
import CreatableSelect from 'react-select/creatable';
import { Card, CardBody, Col, CustomInput, Input, Row, Table } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { selectColor, selectSize, selectSizeGroups, selectStyleNo } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';

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

const ColorSizeCombination = ( { openModal, setOpenModal } ) => {
    /// Color Size Spacification
    const [colorSizeSpecification, setColorSizeSpecification] = useState( {
        colorSpecific: false,
        sizeSpecific: false
    } );
    const [sizeGroups, setSizeGroups] = useState( null );
    const [size, setSize] = useState( null );
    const [colors, setColors] = useState( null );
    const [color, setColor] = useState( null );
    const [styleNo, setStyleNo] = useState( null );
    // fsf
    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
        console.log( 'To' );

    };

    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-lg'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModalToggleClose={handleMainModalToggleClose}
                title="Hello" >
                <Card  >
                    <CardBody className="custom-table-color-size">
                        <Row className="pr-1 text-nowrap pb-1 ">
                            <Col sm={12} md={6} lg={3}>
                                <CustomInput
                                    className="pb-1"
                                    type='switch'
                                    label={<Label2 />}
                                    id='color-specific'
                                    name="colorSpecific"
                                    checked={colorSizeSpecification.colorSpecific}
                                    inline
                                    onChange={( e ) => { setColorSizeSpecification( { ...colorSizeSpecification, colorSpecific: e.target.checked } ); }}
                                >
                                    Color
                                </CustomInput>

                            </Col>
                            <Col sm={12} md={6} lg={3} className="pb-1">
                                <CreatableSelect
                                    id='colorSpecific'
                                    isDisabled={colorSizeSpecification.colorSpecific}
                                    isSearchable
                                    isClearable
                                    theme={selectThemeColors}
                                    options={selectColor}
                                    classNamePrefix='select'
                                    value={colors}
                                    onChange={data => {
                                        setColors( data );
                                    }}
                                />

                            </Col>
                            <Col sm={12} md={6} lg={3} className="pb-1">

                                <CustomInput
                                    type='switch'
                                    label={<Label2 />}
                                    id='size-specific'
                                    inline
                                    name="sizeSpecific"
                                    checked={colorSizeSpecification.sizeSpecific}
                                    onChange={( e ) => { setColorSizeSpecification( { ...colorSizeSpecification, sizeSpecific: e.target.checked } ); }}
                                >
                                    Size Groups
                                </CustomInput>

                            </Col>
                            <Col sm={12} md={6} lg={3}>
                                <CreatableSelect
                                    id='sizeGroupSpecific'
                                    isDisabled={colorSizeSpecification.sizeSpecific}
                                    isSearchable
                                    isClearable
                                    theme={selectThemeColors}
                                    options={selectSizeGroups}
                                    classNamePrefix='select'
                                    value={sizeGroups}
                                    onChange={data => {
                                        setSizeGroups( data );
                                    }}
                                />


                            </Col>
                        </Row>

                        <Table responsive>
                            <thead className="thead-light table-bordered">
                                <tr>
                                    <th className="text-nowrap">Style No</th>
                                    <th className="text-nowrap"> Color</th>
                                    <th className="text-nowrap">Size</th>
                                    <th className="text-nowrap">Quantity</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td className="text-nowrap">
                                        <CreatableSelect
                                            id='styleNo'
                                            isSearchable
                                            menuPosition="fixed"
                                            isClearable
                                            theme={selectThemeColors}
                                            options={selectStyleNo}
                                            classNamePrefix='select'
                                            value={styleNo}
                                            onChange={data => {
                                                setStyleNo( data );
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <CreatableSelect
                                            id='colordropDown'
                                            isDisabled={!colorSizeSpecification?.colorSpecific}
                                            isSearchable
                                            menuPosition="fixed"
                                            isClearable
                                            theme={selectThemeColors}
                                            options={selectColor}
                                            classNamePrefix='select'
                                            value={color}
                                            onChange={data => {
                                                setColor( data );
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <CreatableSelect
                                            id='sizeSpecific'
                                            isDisabled={!colorSizeSpecification?.sizeSpecific}
                                            menuPosition="fixed"
                                            isSearchable
                                            isClearable
                                            theme={selectThemeColors}
                                            options={selectSize}
                                            classNamePrefix='select'
                                            value={size}
                                            onChange={data => {
                                                setSize( data );
                                            }}
                                        />


                                    </td>
                                    <td style={{ width: '200px' }}>
                                        <Input className="text-right" type='number' id='noFmc' bsSize='sm' placeholder='0.000' />
                                    </td>
                                </tr>

                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
                {/* 

                <ModalFooter >
                    <Button color='primary' onClick={() => setOpenModal( !openModal )}>
                        Submit
                    </Button>
                </ModalFooter> */}
            </CustomModal>
        </div>
    );
};

export default ColorSizeCombination;


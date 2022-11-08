import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/merchandising/others/custom-table.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardTitle, Col, FormGroup, Label, Row, Table } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import LabelBox from '../../../../utility/custom/LabelBox';
import { bindConsumptionSizeColorSense } from '../store/actions';
const selectSensitivityCategoryForColor = [
    {
        value: 1,
        label: 'As per Gmt Color'

    },
    {
        value: 2,
        label: 'For All Gmt Color'

    },
    {
        value: 3,
        label: 'Color Mapping'

    }
];
const selectSensitivityCategoryForSize = [
    { value: 1, label: 'As per Gmt Size' },
    { value: 2, label: 'For All Gmt Size' },
    { value: 3, label: 'Size Mapping' }
];

// AsPerAsGarmentColor = 1,
// ForAllGarmentColor = 2,
// ColorMapping = 3
const customStyles = {
    menu: ( provided, state ) => ( {
        ...provided,
        width: state.selectProps.width,
        borderBottom: '1px dotted pink',
        color: state.selectProps.menuColor,
        padding: 20
    } )
};

const SizeColorSenseForm = ( {
    openModal,
    setOpenModal,
    consumptionFabricDetails,
    consumptionDetailsSizeSens,
    consumptionDetailsColorSens } ) => {

    const dispatch = useDispatch();

    const { isSizeColorSenseDataOnProgress } = useSelector( ( { consumptions } ) => consumptions );

    const [colorSensCondition, setColorSensCondition] = useState( null );
    const [sizeSensCondition, setSizeSensCondition] = useState( null );

    const [segmentColorValue, setSegmentColorValue] = useState( null );

    const [segmentSizeValue, setSegmentSizeValue] = useState( null );


    useEffect( () => {
        setSegmentColorValue( consumptionDetailsColorSens?.colorSensitivityType === 2 ? consumptionDetailsColorSens?.colorSens[0]?.segment : null );
        setSegmentSizeValue( consumptionDetailsSizeSens?.sizeSensitivityType === 2 && consumptionDetailsSizeSens?.sizeSense[0]?.segment );
        const colorSense = selectSensitivityCategoryForColor.find( colorSens => consumptionDetailsColorSens?.colorSensitivityType === colorSens.value );
        setColorSensCondition( colorSense );
        const sizeSense = selectSensitivityCategoryForSize.find( sizeSens => consumptionDetailsSizeSens?.sizeSensitivityType === sizeSens.value );
        setSizeSensCondition( sizeSense );
    }, [consumptionDetailsColorSens?.colorSensitivityType, consumptionDetailsSizeSens?.sizeSensitivityType] );


    ///Modal Close
    const handleSegmentAssignModalClose = () => {
        dispatch( bindConsumptionSizeColorSense( null, null ) );
        setOpenModal( !openModal );
        setSegmentColorValue( null );
        setSegmentSizeValue( null );
        setColorSensCondition( null );
        setSizeSensCondition( null );
    };


    ///Final Submit
    const handleSegmentAssignModalSubmit = () => {
        setOpenModal( !openModal );
    };


    return (
        <div>
            <CustomModal
                style={{ width: '900px' }}
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-lg'
                openModal={openModal}
                setOpenModal={setOpenModal}
                title="Color Size Sensitivity"
                handleMainModelSubmit={handleSegmentAssignModalSubmit}
                handleMainModalToggleClose={handleSegmentAssignModalClose}
            >

                <UILoader blocking={isSizeColorSenseDataOnProgress} loader={<ComponentSpinner />} >

                    <div style={{ minHeight: '200px' }}>
                        <Row className="custom-table">
                            <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                                {consumptionDetailsColorSens?.segmentId ? <Card className="p-1">
                                    <CardTitle className="text-center" >
                                        Color Sensitivity
                                    </CardTitle>
                                    <Row >
                                        <FormGroup tag={Col} className="text-nowrap ">
                                            <Label className="text-dark font-weight-bold" for='colorSensitivity'> Color Sensitivity</Label>
                                            <LabelBox text={colorSensCondition?.label} />
                                        </FormGroup>

                                        <FormGroup tag={Col} className="text-nowrap ">
                                            <Label className="text-dark font-weight-bold" for='colorSenseSingleSegmentId'>{` Select ${consumptionDetailsColorSens?.segmentName}`} </Label>
                                            <LabelBox text={segmentColorValue?.label} />
                                        </FormGroup>
                                    </Row>
                                    {
                                        colorSensCondition?.label === 'Color Mapping' &&
                                        <Table responsive size="sm" bordered  >
                                            <thead className='text-center'>
                                                <tr className="thead-light"  >
                                                    <th className="text-nowrap">Gmt. Color</th>
                                                    <th className="text-nowrap pl-2">{consumptionDetailsColorSens?.segmentName}</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {
                                                    consumptionDetailsColorSens?.colorSens?.map( i => (
                                                        <tr key={i.colorId}>
                                                            <td className="w-50">{i.colorName}</td>
                                                            <td className="w-50" >
                                                                {i.segment?.label}

                                                            </td>
                                                        </tr>
                                                    ) )
                                                }
                                            </tbody>
                                        </Table>
                                    }


                                </Card> : <div className='d-flex justify-content-center h-100'>
                                    <div className="align-self-center"> The have no Color Sensitivity</div>
                                </div>
                                }

                            </Col>
                            <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                                {
                                    consumptionDetailsSizeSens?.segmentId ? <Card className="p-1">
                                        <CardTitle className="text-center">
                                            Size Sensitivity
                                        </CardTitle>

                                        <Row>

                                            <FormGroup tag={Col} className="text-nowrap">
                                                <Label className="text-dark font-weight-bold" for='sizeSeneConditionId'> Size Sensitivity</Label>
                                                <LabelBox text={sizeSensCondition?.label} />

                                            </FormGroup>

                                            <FormGroup tag={Col}>
                                                <Label className="text-dark font-weight-bold" for='segmentSizeValueId'>{` Select ${consumptionDetailsSizeSens?.segmentName}`} </Label>
                                                <LabelBox text={segmentSizeValue?.label} />
                                            </FormGroup>


                                        </Row>

                                        {
                                            sizeSensCondition?.label === 'Size Mapping' &&
                                            <Table responsive size="sm" bordered  >
                                                <thead>
                                                    <tr className="thead-light"  >
                                                        <th className="text-nowrap">Gmt. Size</th>
                                                        <th className="text-nowrap pl-2">{consumptionDetailsSizeSens?.segmentName}</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        consumptionDetailsSizeSens?.sizeSense?.map( size => (
                                                            <tr key={size.sizeId}>
                                                                <td className="w-50">
                                                                    ({size?.sizeGroup})  {size.sizeName}
                                                                </td>
                                                                <td className="w-50">
                                                                    {size.segment?.label}
                                                                </td>
                                                            </tr>
                                                        ) )
                                                    }
                                                </tbody>
                                            </Table>
                                        }


                                    </Card> : <div className='d-flex justify-content-center h-100'>
                                        <div className="align-self-center"> The have no Size Sensitivity</div>
                                    </div>
                                }

                            </Col>
                        </Row>
                    </div>

                </UILoader>


            </CustomModal>

        </div>
    );
};

export default SizeColorSenseForm;

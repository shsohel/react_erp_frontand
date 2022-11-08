import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/merchandising/others/custom-table.scss';
import { baseAxios } from '@services';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Card, CardTitle, Col, FormGroup, Label, Row, Table } from 'reactstrap';
import { inventoryApi } from '../../../../services/api-end-points/inventory';
import CustomModal from '../../../../utility/custom/CustomModal';
import { notify } from '../../../../utility/custom/notifications';
import { status } from '../../../../utility/enums';
import { isPermit, selectThemeColors } from '../../../../utility/Utils';
import { bindConsumptionAccessoriesDetails, bindConsumptionSizeColorSense } from '../store/actions';

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


const SizeColorSenseAccessoriesForm = ( {
    openModal,
    setOpenModal,
    consumptionAccessoriesDetails,
    consumptionDetailsSizeSens,
    consumptionDetailsColorSens } ) => {

    const dispatch = useDispatch();
    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );
    const { isSizeColorSenseDataOnProgress } = useSelector( ( { consumptions } ) => consumptions );

    const [colorSegmentValueDropdown, setColorSegmentValueDropdown] = useState( [] );
    const [sizeSegmentValuesDropdown, setSizeSegmentValuesDropdown] = useState( [] );

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

    const handleColorSensCondition = ( data ) => {
        setColorSensCondition( data );
        const { colorSens } = consumptionDetailsColorSens;
        const updatedData = colorSens.map( cs => ( {
            ...cs,
            segment: null,
            segmentId: consumptionDetailsColorSens.segmentId,
            value: ''
        } ) );
        const updatedObj = {
            ...consumptionDetailsColorSens,
            colorSens: updatedData
        };
        dispatch( bindConsumptionSizeColorSense( updatedObj, consumptionDetailsSizeSens ) );
        setSegmentColorValue( null );
    };

    const handleSizeSensCondition = ( data ) => {
        setSizeSensCondition( data );
        const { sizeSense } = consumptionDetailsSizeSens;
        const updatedData = sizeSense.map( cs => {
            cs.segment = null;
            cs.segmentId = consumptionDetailsSizeSens.segmentId;
            cs.value = '';
            return cs;
        } );
        const updatedObj = {
            ...consumptionDetailsSizeSens,
            sizeSense: updatedData
        };
        dispatch( bindConsumptionSizeColorSense( consumptionDetailsColorSens, updatedObj ) );
        setSegmentSizeValue( null );
    };

    ///Modal Close
    const handleSegmentAssignModalClose = () => {
        dispatch( bindConsumptionSizeColorSense( null, null ) );
        setOpenModal( !openModal );
        setSegmentColorValue( null );
        setSegmentSizeValue( null );
        setColorSensCondition( null );
        setSizeSensCondition( null );
    };
    const itemSegmentTemplateToJson = ( itemSegments ) => {
        const descriptionTemplate = itemSegments.map( isa => ( {
            id: isa.segmentId,
            name: isa.segment,
            value: isa?.value?.label ?? ''
        } ) );

        return JSON.stringify( descriptionTemplate );
    };
    const colorSensCheck = ( segmentId ) => {
        let proceeded = true;
        if ( segmentId ) {
            const { colorSens } = consumptionDetailsColorSens;
            if ( colorSensCondition?.label !== 'As per Gmt Color' ) {
                proceeded = colorSens.some( color => color.segment !== null );
            }
        }
        return proceeded;
    };

    const sizeSensCheck = ( segmentId ) => {
        let proceeded = true;
        if ( segmentId ) {
            const { sizeSense } = consumptionDetailsSizeSens;
            if ( sizeSensCondition?.label !== 'As per Gmt Size' ) {
                proceeded = sizeSense.some( size => size.segment !== null );
            }
        }
        return proceeded;
    };

    ///Final Submit
    const handleSegmentAssignModalSubmit = () => {

        if ( colorSensCheck( consumptionDetailsColorSens?.segmentId ) ) {
            if ( sizeSensCheck( consumptionDetailsSizeSens?.segmentId ) ) {

                if ( sizeSensCondition && colorSensCondition ) {
                    const updatedData = consumptionAccessoriesDetails.map( cfd => {
                        const { colorSens } = consumptionDetailsColorSens;
                        const { sizeSense } = consumptionDetailsSizeSens;

                        if ( cfd.fieldId === consumptionDetailsColorSens.fieldId ) {
                            if ( colorSensCondition?.label === 'As per Gmt Color' ) {
                                cfd.colorSensitivityType = colorSensCondition?.value;
                                cfd.colorSensitivities = colorSens.map( cs => ( {
                                    ...cs,
                                    segmentId: consumptionDetailsColorSens.segmentId,
                                    segment: { value: cs.colorId, label: cs.colorName },
                                    value: cs.colorName
                                } ) );
                            } else {
                                if ( colorSensCondition?.label === 'For All Gmt Color' ) {
                                    cfd.itemSegments = cfd.itemSegments.map( s => {
                                        if ( s.isColorSensitive ) {
                                            s['value'] = colorSens[0].segment;
                                        }
                                        return s;
                                    } );
                                } else {
                                    cfd.itemSegments = cfd.itemSegments.map( s => {
                                        if ( s.isColorSensitive ) {
                                            s['value'] = null;
                                        }
                                        return s;
                                    } );
                                }
                                cfd.colorSensitivityType = colorSensCondition?.value;
                                cfd.colorSensitivities = colorSens;
                                cfd['itemDescriptionTemplate'] = itemSegmentTemplateToJson( cfd.itemSegments );
                                cfd['isSensibilityAlreadyLoadedOnRow'] = true;

                            }
                        }
                        if ( cfd.fieldId === consumptionDetailsSizeSens.fieldId ) {
                            if ( sizeSensCondition?.label === 'As per Gmt Size' ) {
                                cfd.sizeSensitivityType = sizeSensCondition?.value;

                                cfd.sizeSensitivities = sizeSense.map( cs => ( {
                                    ...cs,
                                    segmentId: consumptionDetailsSizeSens.segmentId,
                                    segment: { value: cs.sizeId, label: cs.sizeName },
                                    value: cs.sizeName
                                } ) );
                            } else {
                                if ( sizeSensCondition?.label === 'For All Gmt Size' ) {
                                    cfd.itemSegments = cfd.itemSegments.map( s => {
                                        if ( s.isSizeSensitive ) {
                                            s['value'] = sizeSense[0].segment;
                                        }
                                        return s;
                                    } );
                                } else {
                                    cfd.itemSegments = cfd.itemSegments.map( s => {
                                        if ( s.isSizeSensitive ) {
                                            s['value'] = null;
                                        }
                                        return s;
                                    } );
                                }
                                cfd.sizeSensitivityType = sizeSensCondition?.value;
                                cfd.sizeSensitivities = sizeSense;
                                cfd['itemDescriptionTemplate'] = itemSegmentTemplateToJson( cfd.itemSegments );
                                cfd['isSensibilityAlreadyLoadedOnRow'] = true;
                            }
                        }
                        return cfd;
                    } );
                    dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
                    setSegmentColorValue( null );
                    setOpenModal( !openModal );

                } else {

                    // const updatedData = consumptionAccessoriesDetails.map( cfd => {
                    //     if ( cfd.fieldId === consumptionDetailsColorSens.fieldId ) {
                    //         cfd.colorSensitivityType = 3;
                    //         cfd.colorSensitivities = [];
                    //     }
                    //     if ( cfd.fieldId === consumptionDetailsSizeSens.fieldId ) {

                    //         cfd.sizeSensitivityType = 3;
                    //         cfd.sizeSensitivities = [];

                    //     }
                    //     return cfd;
                    // } );
                    // dispatch( bindConsumptionAccessoriesDetails( updatedData ) );
                    setOpenModal( !openModal );
                }
                dispatch( bindConsumptionSizeColorSense( null, null ) );
                setSegmentColorValue( null );
                setSegmentSizeValue( null );
                setColorSensCondition( null );
                setSizeSensCondition( null );
            } else {
                notify( 'warning', `Please define at least a value in Size Sensitivity` );
            }
        } else {
            notify( 'warning', `Please define at least a value in Color Sensitivity` );
        }


    };

    const handleColorDropdownLoading = ( rowId, loading ) => {
        const { colorSens } = consumptionDetailsColorSens;
        const updatedValue = colorSens.map( cs => {
            if ( rowId === cs.randomGenerateId ) {
                cs.isValueLoading = loading;
            }
            return cs;
        } );
        const updatedObj = {
            ...consumptionDetailsColorSens,
            colorSens: updatedValue
        };
        dispatch( bindConsumptionSizeColorSense( updatedObj, consumptionDetailsSizeSens ) );
    };

    const handleColorSegmentValueOnFocus = async ( itemGroupId, segmentId, values, rowId ) => {
        if ( !values.length ) {
            handleColorDropdownLoading( rowId, true );
            const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
            await baseAxios.get( endPoint ).then( response => {
                if ( response.status === status.success ) {
                    setColorSegmentValueDropdown( response.data.map( i => ( {
                        label: i.value,
                        // value: i.id,
                        value: i.value
                    } ) ) );
                    handleColorDropdownLoading( rowId, false );
                }
            } ).catch( ( { response } ) => {
                handleColorDropdownLoading( rowId, false );

            } );
        }
    };

    ///For Single Color Dropdown On Focus
    const [isColorValueLoading, setIsColorValueLoading] = useState( false );
    const handleColorSegmentValueSingleOnFocus = async ( itemGroupId, segmentId, values ) => {
        if ( !values.length ) {
            setIsColorValueLoading( true );
            const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
            await baseAxios.get( endPoint ).then( response => {
                if ( response.status === status.success ) {
                    setColorSegmentValueDropdown( response.data.map( i => ( {
                        label: i.value,
                        // value: i.id,
                        value: i.value
                    } ) ) );
                    setIsColorValueLoading( false );
                }
            } ).catch( ( { response } ) => {

                setIsColorValueLoading( false );

            } );
        }
    };

    const handleSizeDropdownLoading = ( rowId, loading ) => {
        const { sizeSense } = consumptionDetailsSizeSens;
        const updatedValue = sizeSense.map( cs => {
            if ( rowId === cs.randomGenerateId ) {
                cs.isValueLoading = loading;
            }
            return cs;
        } );
        const updatedObj = {
            ...consumptionDetailsSizeSens,
            sizeSense: updatedValue
        };
        dispatch( bindConsumptionSizeColorSense( consumptionDetailsColorSens, updatedObj ) );
    };

    const handleSizeSegmentValueOnFocus = async ( itemGroupId, segmentId, values, rowId ) => {
        if ( !values.length ) {
            handleSizeDropdownLoading( rowId, true );
            const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
            await baseAxios.get( endPoint ).then( response => {
                if ( response.status === status.success ) {
                    setSizeSegmentValuesDropdown( response.data.map( i => ( {
                        label: i.value,
                        // value: i.id,
                        value: i.value

                    } ) ) );
                    handleSizeDropdownLoading( rowId, false );
                }

            } ).catch( ( { response } ) => {
                handleSizeDropdownLoading( rowId, false );
            } );
        }
    };


    const [isSizeValueLoading, setIsSizeValueLoading] = useState( false );
    ///Single Size Dropdown On Focus Handling
    const handleSizeSingleSegmentValueOnFocus = async ( itemGroupId, segmentId, values ) => {
        if ( !values.length ) {
            setIsSizeValueLoading( true );
            const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
            await baseAxios.get( endPoint ).then( response => {
                if ( response.status === status.success ) {
                    setSizeSegmentValuesDropdown( response.data.map( i => ( {
                        label: i.value,
                        // value: i.id,
                        value: i.value

                    } ) ) );
                    setIsSizeValueLoading( false );
                }

            } ).catch( ( { response } ) => {
                setIsSizeValueLoading( false );
            } );
        }
    };

    //Color Sens
    const handleColorValueDropDown = ( randomGenerateId, data ) => {
        const { colorSens } = consumptionDetailsColorSens;
        const updatedValue = colorSens.map( cs => {
            if ( randomGenerateId === cs.randomGenerateId ) {
                cs.segmentId = consumptionDetailsColorSens.segmentId;
                cs.segment = data;
                cs.value = data?.label ? data?.label : '';
            }
            return cs;
        } );
        const updatedObj = {
            ...consumptionDetailsColorSens,
            colorSens: updatedValue
        };
        dispatch( bindConsumptionSizeColorSense( updatedObj, consumptionDetailsSizeSens ) );
    };

    //For Color Sens
    const handleColorSegmentValueForBothDropdown = ( data ) => {
        setSegmentColorValue( data );
        const { colorSens } = consumptionDetailsColorSens;
        const updatedValue = colorSens.map( cs => ( {
            ...cs,
            segmentId: consumptionDetailsColorSens.segmentId,
            segment: data,
            value: data?.label ? data?.label : ''
        } ) );
        const updatedObj = {
            ...consumptionDetailsColorSens,
            colorSens: updatedValue
        };
        dispatch( bindConsumptionSizeColorSense( updatedObj, consumptionDetailsSizeSens ) );
    };

    ///For Size Sens
    const handleSizeValueDropDown = ( randomGenerateId, data ) => {
        const { sizeSense } = consumptionDetailsSizeSens;
        const updatedValue = sizeSense.map( cs => {
            if ( randomGenerateId === cs.randomGenerateId ) {
                cs.segmentId = consumptionDetailsSizeSens.segmentId;
                cs.segment = data;
                cs.value = data?.label ? data?.label : '';
            }
            return cs;
        } );
        const updatedObj = {
            ...consumptionDetailsSizeSens,
            sizeSense: updatedValue
        };
        dispatch( bindConsumptionSizeColorSense( consumptionDetailsColorSens, updatedObj ) );
    };

    const handleSizeSegmentValueForBothDropdown = ( data ) => {
        setSegmentSizeValue( data );
        const { sizeSense } = consumptionDetailsSizeSens;
        const updatedValue = sizeSense.map( cs => ( {
            ...cs,
            segmentId: consumptionDetailsSizeSens.segmentId,
            segment: data,
            value: data?.label ? data?.label : ''
        } ) );
        const updatedObj = {
            ...consumptionDetailsSizeSens,
            sizeSense: updatedValue
        };
        dispatch( bindConsumptionSizeColorSense( consumptionDetailsColorSens, updatedObj ) );
    };


    const handleInstantCreateColorSegmentValue = ( data, itemGroupId, segmentId, rowId ) => {
        const obj = [
            {
                value: data,
                isDeleted: false
            }
        ];
        if ( rowId ) {
            handleColorDropdownLoading( rowId, true );
        } else {
            setIsColorValueLoading( true );
        }

        const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
        baseAxios.put( endPoint, obj ).then( response => {
            if ( response.status === status.success ) {
                if ( rowId ) {
                    handleColorSegmentValueOnFocus( itemGroupId, segmentId, [], rowId );
                    handleColorValueDropDown( rowId, { label: data, value: data } );
                } else {
                    handleColorSegmentValueSingleOnFocus( itemGroupId, segmentId, [] );
                    handleColorSegmentValueForBothDropdown( { label: data, value: data } );
                }

            }
        } ).catch( ( { response } ) => {
            handleColorDropdownLoading( rowId, false );
            setIsColorValueLoading( false );

        } );
    };


    const handleInstantCreateSizeSegmentValue = ( data, itemGroupId, segmentId, rowId ) => {
        const obj = [
            {
                value: data,
                isDeleted: false
            }
        ];

        if ( rowId ) {
            handleSizeDropdownLoading( rowId, true );
        } else {
            setIsSizeValueLoading( true );
        }


        const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
        baseAxios.put( endPoint, obj ).then( response => {
            if ( response.status === status.success ) {
                if ( rowId ) {
                    handleSizeSegmentValueOnFocus( itemGroupId, segmentId, [], rowId );
                    handleSizeValueDropDown( rowId, { label: data, value: data } );
                } else {
                    handleSizeSingleSegmentValueOnFocus( itemGroupId, segmentId, [] );
                    handleSizeSegmentValueForBothDropdown( { label: data, value: data } );
                }
            }
        } ).catch( ( { response } ) => {
            handleSizeDropdownLoading( rowId, false );
            setIsSizeValueLoading( false );

        } );
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
                                        <FormGroup tag={Col} className="text-nowrap">
                                            <Label className="text-dark font-weight-bold" for='colorSensitivity'> Color Sensitivity</Label>
                                            <Select
                                                id='colorSensitivity'
                                                name='colorSensitivity'
                                                // menuPosition="fixed"
                                                isSearchable

                                                theme={selectThemeColors}
                                                options={selectSensitivityCategoryForColor}
                                                classNamePrefix="dropdown"
                                                className="erp-dropdown-select"
                                                value={colorSensCondition}
                                                onChange={data => {
                                                    handleColorSensCondition( data );
                                                }}
                                            />
                                        </FormGroup>

                                        <FormGroup tag={Col} className="text-nowrap ">
                                            <Label className="text-dark font-weight-bold" for='colorSenseSingleSegmentId'>{` Select ${consumptionDetailsColorSens?.segmentName}`} </Label>
                                            <CreatableSelect
                                                id='colorSenseSingleSegmentId'
                                                name="colorSenseSingleSegment"
                                                //    menuPosition="fixed"
                                                isSearchable
                                                isClearable
                                                classNamePrefix="dropdown"
                                                className="erp-dropdown-select"
                                                theme={selectThemeColors}
                                                isDisabled={colorSensCondition?.label === 'Color Mapping' || colorSensCondition?.label === 'As per Gmt Color' || !colorSensCondition}
                                                isValidNewOption={( inputValue ) => {
                                                    const isPermitted = isPermit( userPermission?.ItemGroupCreateSegmentValue, authPermissions ) && inputValue.trim().length;
                                                    return isPermitted;
                                                }}
                                                isLoading={isColorValueLoading}

                                                options={colorSegmentValueDropdown}
                                                value={segmentColorValue}
                                                onFocus={() => {
                                                    handleColorSegmentValueSingleOnFocus(
                                                        consumptionDetailsColorSens.categoryId,
                                                        consumptionDetailsColorSens.segmentId,
                                                        colorSegmentValueDropdown );
                                                }}
                                                onChange={( data ) => { handleColorSegmentValueForBothDropdown( data ); }}
                                                onCreateOption={( data ) => {
                                                    handleInstantCreateColorSegmentValue( data, consumptionDetailsColorSens.categoryId, consumptionDetailsColorSens.segmentId );
                                                }}
                                            />
                                        </FormGroup>
                                    </Row>
                                    {
                                        colorSensCondition?.label === 'Color Mapping' &&
                                        <Table size="sm" bordered  >
                                            <thead>
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
                                                            <td className="w-50">
                                                                <CreatableSelect
                                                                    id='colorSenseId'
                                                                    name='colorSense'
                                                                    menuPosition="fixed"
                                                                    isSearchable
                                                                    isClearable
                                                                    theme={selectThemeColors}
                                                                    isValidNewOption={( inputValue ) => {
                                                                        const isPermitted = isPermit( userPermission?.ItemGroupCreateSegmentValue, authPermissions ) && inputValue.trim().length;
                                                                        return isPermitted;
                                                                    }}
                                                                    isLoading={i.isValueLoading}
                                                                    options={colorSegmentValueDropdown}
                                                                    classNamePrefix="dropdown"
                                                                    className="erp-dropdown-select"
                                                                    onFocus={() => {
                                                                        handleColorSegmentValueOnFocus( consumptionDetailsColorSens.categoryId,
                                                                            consumptionDetailsColorSens.segmentId,
                                                                            colorSegmentValueDropdown, i.randomGenerateId );
                                                                    }}
                                                                    value={i.segment}
                                                                    onChange={( data ) => { handleColorValueDropDown( i.randomGenerateId, data ); }}
                                                                    onCreateOption={( data ) => {
                                                                        handleInstantCreateColorSegmentValue( data, consumptionDetailsColorSens.categoryId, consumptionDetailsColorSens.segmentId, i.randomGenerateId );
                                                                    }}
                                                                />
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
                                {consumptionDetailsSizeSens?.segmentId ? <Card className="p-1">
                                    <CardTitle className="text-center">
                                        Size Sensitivity
                                    </CardTitle>

                                    <Row>

                                        <FormGroup tag={Col} className="text-nowrap">
                                            <Label className="text-dark font-weight-bold" for='sizeSeneConditionId'> Size Sensitivity</Label>
                                            <Select
                                                id='sizeSeneConditionId'
                                                name="sizeSeneCondition"
                                                isSearchable

                                                theme={selectThemeColors}
                                                options={selectSensitivityCategoryForSize}
                                                classNamePrefix="dropdown"
                                                className="erp-dropdown-select"
                                                value={sizeSensCondition}
                                                onChange={( data ) => { handleSizeSensCondition( data ); }}
                                            />

                                        </FormGroup>

                                        <FormGroup tag={Col}>
                                            <Label className="text-dark font-weight-bold" for='segmentSizeValueId'>{` Select ${consumptionDetailsSizeSens?.segmentName}`} </Label>
                                            <CreatableSelect
                                                id='segmentSizeValueId'
                                                name="segmentSizeValue"
                                                isSearchable
                                                isClearable
                                                isDisabled={sizeSensCondition?.label === 'Size Mapping' || sizeSensCondition?.label === 'As per Gmt Size' || !sizeSensCondition}
                                                isValidNewOption={( inputValue ) => {
                                                    const isPermitted = isPermit( userPermission?.ItemGroupCreateSegmentValue, authPermissions ) && inputValue.trim().length;
                                                    return isPermitted;
                                                }}
                                                isLoading={isSizeValueLoading}
                                                options={sizeSegmentValuesDropdown}
                                                onFocus={() => {
                                                    handleSizeSingleSegmentValueOnFocus(
                                                        consumptionDetailsSizeSens.categoryId,
                                                        consumptionDetailsSizeSens.segmentId,
                                                        sizeSegmentValuesDropdown );
                                                }}
                                                theme={selectThemeColors}
                                                classNamePrefix="dropdown"
                                                className="erp-dropdown-select"
                                                value={segmentSizeValue}
                                                onChange={( data ) => { handleSizeSegmentValueForBothDropdown( data ); }}
                                                onCreateOption={( data ) => {
                                                    handleInstantCreateSizeSegmentValue( data, consumptionDetailsSizeSens.categoryId, consumptionDetailsSizeSens.segmentId );
                                                }}
                                            />
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
                                                                <CreatableSelect
                                                                    id='fabricSizeSenseId'
                                                                    name='fabricSizeSense'
                                                                    isSearchable
                                                                    menuPosition="fixed"
                                                                    isClearable
                                                                    theme={selectThemeColors}
                                                                    classNamePrefix="dropdown"
                                                                    className="erp-dropdown-select"
                                                                    isValidNewOption={( inputValue ) => {
                                                                        const isPermitted = isPermit( userPermission?.ItemGroupCreateSegmentValue, authPermissions ) && inputValue.trim().length;
                                                                        return isPermitted;
                                                                    }}
                                                                    isLoading={size.isValueLoading}

                                                                    options={sizeSegmentValuesDropdown}
                                                                    value={size.segment}
                                                                    onFocus={() => {
                                                                        handleSizeSegmentValueOnFocus(
                                                                            consumptionDetailsSizeSens.categoryId,
                                                                            consumptionDetailsSizeSens.segmentId,
                                                                            sizeSegmentValuesDropdown, size.randomGenerateId );
                                                                    }}
                                                                    onChange={( data ) => { handleSizeValueDropDown( size.randomGenerateId, data ); }}
                                                                    onCreateOption={( data ) => {
                                                                        handleInstantCreateSizeSegmentValue( data, consumptionDetailsSizeSens.categoryId, consumptionDetailsSizeSens.segmentId, size.randomGenerateId );
                                                                    }}
                                                                />
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

export default SizeColorSenseAccessoriesForm;

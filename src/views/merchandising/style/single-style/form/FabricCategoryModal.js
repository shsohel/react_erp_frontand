import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/merchandising/others/custom-table.scss';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Col, Label, Row, Table } from 'reactstrap';
import CustomModal from '../../../../../utility/custom/CustomModal';
import { isPermit, selectThemeColors } from '../../../../../utility/Utils';
import { handleSegmentValueOnFocus, updateStyleItemSegmentValue } from '../../../../inventory/item-segment-value/store/actions';
import { getFabricSubGroupDropdown } from '../../../../inventory/item-sub-group/store/actions';
import { bindItemGroupSegmentWithValueInput, getItemGroupSegmentWithValueInput } from '../../../../inventory/segment/store/actions';
import { bindStyleBasicInfo } from '../store/actions';
const FabricCategoryModal = ( { openModal, setOpenModal } ) => {
    const dispatch = useDispatch();
    const { dropdownFabricSubGroup } = useSelector( ( { itemSubGroups } ) => itemSubGroups );
    const { itemGroupSegmentsWithValue, isItemGroupSegmentsWithValueLoaded } = useSelector( ( { segments } ) => segments );
    const { singleStyleBasicInfo } = useSelector( ( { styles } ) => styles );

    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );

    const handleModelSubmit = () => {
        const createDescription = ( itemGroupSegmentsWithValue?.filter( i => !!i.value ).map( i => ` ${i.value?.label ? i.value?.label : ''}` ).join( '' ) ).trim();
        const defaultFabDescValue = { label: createDescription, value: createDescription };
        const descriptionTemplate = itemGroupSegmentsWithValue.map( isa => ( {
            id: isa.segmentId,
            name: isa.segmentName,
            value: isa?.value?.label ?? ''
        } ) );

        const updatedObj = {
            ...singleStyleBasicInfo,
            defaultFabCatId: singleStyleBasicInfo?.itemGroup?.categoryId,
            defaultFabSubCatId: singleStyleBasicInfo?.itemGroup?.value,
            defaultFabDesc: createDescription,
            defaultFabDescValue,
            defaultFabDescTemplate: JSON.stringify( descriptionTemplate ),
            itemGroup: null

        };
        console.log( updatedObj );
        dispatch( bindStyleBasicInfo( updatedObj ) );
        setOpenModal( !openModal );

    };
    const handleModalToggleClose = () => {
        setOpenModal( !openModal );
        // setApplicableColorSize( null );
    };

    const handleItemSubGroupDropdownOnFocus = () => {
        if ( !dropdownFabricSubGroup.length ) {
            dispatch( getFabricSubGroupDropdown() );
        }
    };

    const handleItemSubGroupDropdownOnChange = ( data ) => {

        //  setItemSubGroup( data );
        const updatedObj = {
            ...singleStyleBasicInfo,
            itemGroup: data
        };
        dispatch( bindStyleBasicInfo( updatedObj ) );

        dispatch( getItemGroupSegmentWithValueInput( data?.categoryId ) );

    };


    const handleSegmentValueFocus = ( array, itemGroupId, segmentId ) => {
        if ( !array.length ) {
            dispatch( handleSegmentValueOnFocus( itemGroupId, segmentId ) );
        }
    };

    const handleSegmentValueOnChange = ( data, segmentId ) => {
        const updatedData = itemGroupSegmentsWithValue.map( segment => {
            if ( segment.segmentId === segmentId ) {
                segment['value'] = data;
            }
            return segment;
        } );
        dispatch( bindItemGroupSegmentWithValueInput( updatedData ) );
    };


    const handleInstantCreateSegmentValue = ( data, itemGroupId, segmentId ) => {
        const obj = [
            {
                value: data,
                isDeleted: false
            }
        ];
        dispatch( updateStyleItemSegmentValue( itemGroupId, segmentId, obj, data, 'style' ) );
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
                isDisabledBtn={!singleStyleBasicInfo?.itemGroup || !isItemGroupSegmentsWithValueLoaded}
                title="Default Fabric Category"
            >
                <div>
                    <UILoader blocking={!isItemGroupSegmentsWithValueLoaded} loader={<ComponentSpinner />} >
                        <div style={{ minHeight: '200px' }}>
                            <Row >
                                <Col lg={6} md={6} xs={6} sm={6} >
                                    <Label className="font-weight-bolder">Group  : </Label>
                                </Col>
                                <Col lg={6} md={6} xs={6} sm={6} >
                                    <Select
                                        isSearchable
                                        isClearable
                                        id='merchandiserId'
                                        theme={selectThemeColors}
                                        options={dropdownFabricSubGroup}
                                        classNamePrefix='dropdown'
                                        className={classnames( 'erp-dropdown-select' )}
                                        value={singleStyleBasicInfo?.itemGroup}
                                        onChange={data => {
                                            handleItemSubGroupDropdownOnChange( data );
                                        }}
                                        onFocus={() => {
                                            handleItemSubGroupDropdownOnFocus();
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="mt-1">
                                <Col>
                                    <Table responsive size="sm" bordered style={{ border: 'solid 1px' }} className="custom-table">
                                        <thead>
                                            <tr className="thead-light"  >
                                                <th style={{ width: '50px' }} className="text-nowrap text-left">Segment</th>
                                                <th className="text-nowrap text-left">Value</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                itemGroupSegmentsWithValue.filter( itemSegment => itemSegment.isColorSensitive === false &&
                                                    itemSegment.isSizeSensitive === false )?.map( segment => (
                                                        <tr key={segment.segmentId}>
                                                            <td>
                                                                {segment.segmentName}
                                                            </td>
                                                            <td >
                                                                <CreatableSelect
                                                                    isSearchable
                                                                    isClearable
                                                                    menuPosition="fixed"
                                                                    isValidNewOption={( inputValue ) => {
                                                                        const isPermitted = isPermit( userPermission?.ItemGroupCreateSegmentValue, authPermissions ) && inputValue.trim().length;
                                                                        return isPermitted;
                                                                    }}
                                                                    id='merchandiserId'
                                                                    theme={selectThemeColors}
                                                                    isLoading={segment.isValueLoading}
                                                                    options={segment.segmentValues}
                                                                    classNamePrefix='dropdown'
                                                                    className={classnames( 'erp-dropdown-select' )}
                                                                    value={segment.value}
                                                                    onChange={( data ) => {
                                                                        handleSegmentValueOnChange( data, segment.segmentId );
                                                                    }}
                                                                    onFocus={() => {
                                                                        handleSegmentValueFocus( segment.segmentValues, segment.itemGroupId, segment.segmentId );
                                                                    }}
                                                                    onCreateOption={( data ) => {
                                                                        handleInstantCreateSegmentValue( data, segment.itemGroupId, segment.segmentId );
                                                                    }}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ) )
                                            }

                                        </tbody>
                                    </Table>
                                </Col>

                            </Row>
                        </div>


                    </UILoader>
                </div>

            </CustomModal>
        </div>
    );
};

export default FabricCategoryModal;